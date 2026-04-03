#!/bin/bash
# ========================================
# 个人网站 一键部署脚本
# 用于 Ubuntu 服务器 (Docker 部署)
# ========================================

set -e

# 配置变量
GITEA_URL="https://home.662661.xyz:3010/winterchen/personal-website.git"
PROJECT_DIR="/home/winterchen/personal-website"
DOCKER_PORT=8080  # 宿主机映射端口

echo "========================================"
echo "   个人网站 Docker 一键部署脚本"
echo "========================================"

# 1. 进入项目目录
echo "[1/5] 进入项目目录..."
cd "$PROJECT_DIR" || exit 1

# 2. 拉取最新代码
echo "[2/5] 拉取最新代码..."
git fetch origin
git pull origin master

# 3. 停止并删除旧容器
echo "[3/5] 停止旧容器..."
docker-compose down || true

# 4. 构建并启动新容器
echo "[4/5] 构建并启动 Docker 容器..."
docker-compose up -d --build

# 5. 等待服务启动
echo "[5/5] 等待服务启动..."
sleep 10

# 检查服务状态
if docker ps | grep -q personal-website; then
    echo ""
    echo "========================================"
    echo "   ✅ 部署成功！"
    echo "========================================"
    echo "访问地址: http://192.168.3.11:$DOCKER_PORT"
    echo "查看日志: docker-compose logs -f"
    echo "停止服务: docker-compose down"
else
    echo "❌ 部署失败，请检查日志: docker-compose logs"
    exit 1
fi