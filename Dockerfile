# 个人网站 - 全栈 Docker 镜像
# 包含前端(React)和后端(Spring Boot)在一个容器中

# ================================
# Stage 1: 构建前端
# ================================
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# 复制前端依赖文件
COPY frontend/package*.json ./

# 安装依赖（使用 npm install 替代 npm ci）
RUN npm install --legacy-peer-deps

# 复制前端源码
COPY frontend/ ./

# 构建前端
RUN npm run build

# ================================
# Stage 2: 构建后端
# ================================
FROM maven:3.9-eclipse-temurin-21-alpine AS backend-builder

WORKDIR /app/backend

# 复制后端 pom.xml
COPY backend/pom.xml ./

# 下载依赖 (利用 Docker 缓存)
RUN mvn dependency:go-offline -B

# 复制后端源码
COPY backend/src ./src

# 构建后端
RUN mvn clean package -DskipTests -B

# ================================
# Stage 3: 生产镜像 (Ubuntu)
# ================================
FROM ubuntu:22.04

LABEL maintainer="Claw"
LABEL description="Personal Website - Full Stack (Frontend + Backend)"
LABEL version="1.0"

# 安装 nginx 和 supervisor
RUN apt-get update && apt-get install -y \
    nginx \
    supervisor \
    openjdk-21-jre-headless \
    wget \
    && rm -rf /var/lib/apt/lists/*

# 创建应用目录
WORKDIR /app

# 从构建阶段复制后端 JAR
COPY --from=backend-builder /app/backend/target/*.jar app.jar

# 从构建阶段复制前端构建产物
COPY --from=frontend-builder /app/frontend/dist /var/www/html

# 复制 nginx 配置
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# 复制 supervisor 配置 (管理多个进程)
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# 创建数据目录
RUN mkdir -p /app/data

# 暴露端口
# 80: 前端 (nginx)
# 8080: 后端 API
EXPOSE 80 8080

# 健康检查
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/public/profile || exit 1

# 启动 supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]