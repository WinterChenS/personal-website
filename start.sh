#!/bin/bash
echo "========================================"
echo "   个人网站启动脚本"
echo "========================================"
echo

# 检查 Java
if ! command -v java &> /dev/null; then
    echo "[错误] 未找到 Java，请先安装 Java 21"
    exit 1
fi

# 检查 Node.js
if ! command -v node &> /dev/null; then
    echo "[错误] 未找到 Node.js，请先安装 Node.js"
    exit 1
fi

echo "[1/4] 安装前端依赖..."
cd frontend
npm install
if [ $? -ne 0 ]; then
    echo "[错误] 前端依赖安装失败"
    exit 1
fi

echo
echo "[2/4] 启动后端服务..."
cd ../backend
mvn spring-boot:run &
BACKEND_PID=$!

echo "等待后端启动..."
sleep 15

echo
echo "[3/4] 启动前端开发服务器..."
cd ../frontend
npm run dev &
FRONTEND_PID=$!

echo
echo "========================================"
echo "   启动完成！"
echo "========================================"
echo
echo "前端地址: http://localhost:3000"
echo "后端地址: http://localhost:8080"
echo "管理后台: http://localhost:3000/admin"
echo
echo "默认管理员账号:"
echo "  用户名: admin"
echo "  密码: admin123"
echo
echo "按 Ctrl+C 停止服务"
wait