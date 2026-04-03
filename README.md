# 个人网站

一个现代化的个人网站，使用 React + Spring Boot + Java 21 构建。

## 技术栈

### 前端
- React 18
- Vite
- TailwindCSS
- Framer Motion
- React Router

### 后端
- Java 21
- Spring Boot 3.2
- Spring Security
- JWT Authentication
- H2 Database

## 快速开始

### 前置要求
- Java 21+
- Node.js 18+
- Maven 3.8+

### 一键启动

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

### 手动启动

1. 启动后端：
```bash
cd backend
mvn spring-boot:run
```

2. 启动前端：
```bash
cd frontend
npm install
npm run dev
```

## 访问地址

- 前端展示页: http://localhost:3000
- 管理后台: http://localhost:3000/admin
- 后端 API: http://localhost:8080
- H2 控制台: http://localhost:8080/h2-console

## 默认账号

- 用户名: `admin`
- 密码: `admin123`

## 功能特性

### 用户端
- 🏠 首页展示（个人简介、技能、精选项目）
- 📝 博客文章（支持 Markdown）
- 💼 项目展示
- 🔍 响应式设计

### 管理后台
- 📊 数据概览
- 📝 文章管理（增删改查）
- 💼 项目管理
- 🛠️ 技能管理
- 👤 个人信息管理

## 项目结构

```
personal-website/
├── backend/                # Spring Boot 后端
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   │           ├── application.yml
│   │           └── application-prod.yml
│   └── pom.xml
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.jsx
│   └── package.json
├── docker/                 # Docker 配置文件
│   ├── nginx.conf          # Nginx 配置
│   └── supervisord.conf    # Supervisor 配置
├── start.bat              # Windows 启动脚本
├── start-full.bat         # Windows 完整启动脚本
├── start.sh               # Linux/Mac 启动脚本
├── Dockerfile             # Docker 镜像构建文件
├── docker-compose.yml     # Docker Compose 配置
├── .dockerignore          # Docker 构建忽略文件
└── README.md
```

## 数据库

默认使用 H2 内存数据库，数据存储在 `./data/personal_website.mv.db`

首次启动会自动创建示例数据。

## Docker 部署

### 一键启动 (推荐)

```bash
# 构建并启动
docker-compose up -d --build

# 查看日志
docker-compose logs -f

# 停止服务
docker-compose down
```

### 访问地址

- 前端展示页: http://localhost
- 后端 API: http://localhost:8080
- 管理后台: http://localhost/admin
- H2 控制台: http://localhost/h2-console

### Docker 架构说明

容器内使用 Supervisor 管理两个进程：
- **Nginx**: 服务前端静态文件，代理后端 API (端口 80)
- **Spring Boot**: 后端服务 (端口 8080)

### 数据持久化

- `./data`: H2 数据库文件
- `./logs`: 应用日志

### 手动构建镜像

```bash
docker build -t personal-website:latest .
docker run -d -p 80:80 -p 8080:8080 -v ./data:/app/data personal-website:latest
```

## 自定义配置

修改 `backend/src/main/resources/application.yml`:

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:h2:file:./data/personal_website
```

## 许可证

MIT License
