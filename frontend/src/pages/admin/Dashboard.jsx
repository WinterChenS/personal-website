import { useState, useEffect } from 'react'
import { FileText, Folder, Award, Eye, TrendingUp, Sparkles } from 'lucide-react'

const API_BASE = 'http://localhost:8080'

export default function Dashboard() {
  const [stats, setStats] = useState({ articles: 0, projects: 0, skills: 0, views: 0 })
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([
      fetch(`${API_BASE}/api/admin/articles?page=0&size=1`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
      fetch(`${API_BASE}/api/admin/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      }).then(r => r.json()),
    ]).then(([articles, projects, skills]) => {
      setStats({
        articles: articles.totalElements || 0,
        projects: projects.length || 0,
        skills: skills.length || 0,
        views: 0
      })
    }).catch(err => console.error('获取统计失败:', err))
      .finally(() => setLoading(false))
  }, [])

  const cards = [
    { label: '文章总数', value: stats.articles, icon: FileText, color: 'blue', bg: 'from-blue-500 to-cyan-500' },
    { label: '项目总数', value: stats.projects, icon: Folder, color: 'green', bg: 'from-green-500 to-emerald-500' },
    { label: '技能数量', value: stats.skills, icon: Award, color: 'purple', bg: 'from-purple-500 to-pink-500' },
    { label: '总阅读量', value: stats.views, icon: Eye, color: 'orange', bg: 'from-orange-500 to-red-500' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
          概览
        </h1>
        <p className="text-gray-500 text-sm mt-1">查看网站整体数据概况</p>
      </div>

      <div className="grid md:grid-cols-4 gap-5">
        {cards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
            <div className={`h-1.5 bg-gradient-to-r ${bg}`} />
            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{loading ? '-' : value}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div 
        className="mt-8 p-6 rounded-xl shadow-lg"
        style={{ background: 'var(--theme-gradient)' }}
      >
        <div className="flex items-center gap-3 mb-3">
          <TrendingUp className="w-6 h-6 text-white" />
          <h2 className="text-lg font-semibold text-white">欢迎使用管理后台</h2>
        </div>
        <p className="text-white/80">
          在这里你可以管理文章、项目、技能和个人信息。使用左侧导航栏切换不同的管理模块。
        </p>
        <div className="mt-4 flex gap-3">
          <a href="/admin/articles" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors">
            管理文章
          </a>
          <a href="/admin/projects" className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg text-sm transition-colors">
            管理项目
          </a>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            快速操作
          </h3>
          <div className="space-y-3">
            <a href="/admin/articles" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">📝 新建文章</span>
            </a>
            <a href="/admin/projects" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">📁 新建项目</span>
            </a>
            <a href="/admin/skills" className="block p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="text-gray-700">⚡ 添加技能</span>
            </a>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-500" />
            提示
          </h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>• 文章支持 Markdown 格式编写</p>
            <p>• 精选项目会在首页优先展示</p>
            <p>• 技能熟练度用于首页进度条展示</p>
            <p>• 个人信息会显示在网站各处</p>
          </div>
        </div>
      </div>
    </div>
  )
}