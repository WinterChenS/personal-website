import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './contexts/LanguageContext'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import ArticleDetailPage from './pages/ArticleDetailPage'
import ProjectsPage from './pages/ProjectsPage'
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import ArticleManager from './pages/admin/ArticleManager'
import ProjectManager from './pages/admin/ProjectManager'
import SkillManager from './pages/admin/SkillManager'
import ProfileManager from './pages/admin/ProfileManager'
import ThemeManager from './pages/admin/ThemeManager'
import LoginPage from './pages/admin/LoginPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const API_BASE = 'http://localhost:8080'

// 覆盖 window.fetch，统一处理管理后台 API 的 401 响应
function setupAdminApiInterceptor() {
  const originalFetch = window.fetch
  window.fetch = async (url, options = {}) => {
    const res = await originalFetch(url, options)

    // 如果是管理后台 API 且返回 401，清除 token 并跳转登录页
    if (
      typeof url === 'string'
      && url.includes('/api/admin/')
      && res.status === 401
      && !window.location.pathname.includes('/admin/login')
    ) {
      localStorage.removeItem('token')
      window.location.href = '/admin/login'
      return res
    }

    return res
  }
}

function App() {
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    // 全局注入管理后台 401 拦截器（只执行一次）
    setupAdminApiInterceptor()

    fetch(`${API_BASE}/api/public/profile`)
      .then(res => res.json())
      .then(data => {
        setProfile(data)
        // 动态设置页面标题
        if (data.nickname) {
          document.title = `${data.nickname} - 个人网站`
        }
      })
      .catch(() => {})
  }, [])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Routes>
            <Route path="/admin/login" element={<LoginPage />} />
            <Route path="/admin/*" element={
              <PrivateRoute>
                <AdminLayout />
              </PrivateRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="articles" element={<ArticleManager />} />
              <Route path="projects" element={<ProjectManager />} />
              <Route path="skills" element={<SkillManager />} />
              <Route path="profile" element={<ProfileManager />} />
              <Route path="theme" element={<ThemeManager />} />
            </Route>
            <Route path="/*" element={
              <>
                <Navbar profile={profile} />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:id" element={<ArticleDetailPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                  </Routes>
                </main>
                <Footer profile={profile} />
              </>
            } />
          </Routes>
        </div>
      </Router>
      </LanguageProvider>
    </ThemeProvider>
  )
}

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/admin/login" replace />
}

export default App