import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, FolderGit, Star, ExternalLink, Loader } from 'lucide-react'

const API_BASE = 'http://localhost:8080'

export default function ProjectManager() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [form, setForm] = useState({ 
    name: '', 
    description: '', 
    techStack: '', 
    githubUrl: '', 
    demoUrl: '', 
    featured: false, 
    displayOrder: 0 
  })
  const token = localStorage.getItem('token')

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/projects`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      const data = await res.json()
      setProjects(data || [])
    } catch (err) {
      console.error('获取项目列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const url = editingProject 
      ? `${API_BASE}/api/admin/projects/${editingProject.id}` 
      : `${API_BASE}/api/admin/projects`
    const method = editingProject ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          ...form, 
          displayOrder: Number(form.displayOrder) 
        })
      })
      
      if (res.ok) {
        setShowModal(false)
        setEditingProject(null)
        setForm({ name: '', description: '', techStack: '', githubUrl: '', demoUrl: '', featured: false, displayOrder: 0 })
        fetchProjects()
      } else {
        alert('保存失败')
      }
    } catch (err) {
      console.error('保存项目失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setForm({ 
      name: project.name, 
      description: project.description || '', 
      techStack: project.techStack || '', 
      githubUrl: project.githubUrl || '', 
      demoUrl: project.demoUrl || '', 
      featured: project.featured, 
      displayOrder: project.displayOrder || 0 
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个项目吗？')) return
    try {
      await fetch(`${API_BASE}/api/admin/projects/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
      fetchProjects()
    } catch (err) {
      console.error('删除项目失败:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FolderGit className="w-7 h-7 text-purple-600" />
            项目管理
          </h1>
          <p className="text-gray-500 text-sm mt-1">管理您的作品集项目</p>
        </div>
        <button 
          onClick={() => { 
            setEditingProject(null)
            setForm({ name: '', description: '', techStack: '', githubUrl: '', demoUrl: '', featured: false, displayOrder: 0 })
            setShowModal(true) 
          }} 
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          新建项目
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        ) : projects.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FolderGit className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无项目，点击上方按钮创建</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">名称</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">技术栈</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">精选</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">链接</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {projects.map(p => (
                <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{p.name}</div>
                    {p.description && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{p.description}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <div className="flex flex-wrap gap-1">
                      {p.techStack?.split(',').slice(0, 3).map((tech, i) => (
                        <span key={i} className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded">
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      p.featured 
                        ? 'bg-yellow-100 text-yellow-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {p.featured && <Star className="w-3 h-3 fill-current" />}
                      {p.featured ? '精选' : '普通'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {p.githubUrl && (
                        <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(p)} 
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)} 
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="删除"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <FolderGit className="w-5 h-5" />
                {editingProject ? '编辑项目' : '新建项目'}
              </h2>
              <button 
                onClick={() => setShowModal(false)} 
                className="text-white/80 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">项目名称 *</label>
                <input 
                  type="text" 
                  placeholder="输入项目名称" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
                <textarea 
                  placeholder="项目简介" 
                  value={form.description} 
                  onChange={e => setForm({ ...form, description: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 h-24 resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">技术栈</label>
                <input 
                  type="text" 
                  placeholder="React, Node.js, MongoDB（用逗号分隔）" 
                  value={form.techStack} 
                  onChange={e => setForm({ ...form, techStack: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input 
                    type="text" 
                    placeholder="https://github.com/..." 
                    value={form.githubUrl} 
                    onChange={e => setForm({ ...form, githubUrl: e.target.value })} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Demo URL</label>
                  <input 
                    type="text" 
                    placeholder="https://demo.example.com" 
                    value={form.demoUrl} 
                    onChange={e => setForm({ ...form, demoUrl: e.target.value })} 
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">排序顺序</label>
                <input 
                  type="number" 
                  placeholder="数字越小越靠前" 
                  value={form.displayOrder} 
                  onChange={e => setForm({ ...form, displayOrder: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                />
              </div>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                <input 
                  type="checkbox" 
                  checked={form.featured} 
                  onChange={e => setForm({ ...form, featured: e.target.checked })} 
                  className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500" 
                />
                <span className="text-sm text-gray-700 flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-500" />
                  设为精选项目
                </span>
              </label>
              <div className="flex gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 px-4 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  取消
                </button>
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex-1 py-2.5 px-4 text-white rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  style={{ background: 'var(--theme-gradient)', boxShadow: 'var(--theme-shadow)' }}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : '保存'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}