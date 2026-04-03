import { useState, useEffect } from 'react'
import { Plus, Edit2, Trash2, X, Zap, Loader } from 'lucide-react'

const API_BASE = 'http://localhost:8080'

export default function SkillManager() {
  const [skills, setSkills] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [form, setForm] = useState({ name: '', category: '', proficiency: 80, displayOrder: 0 })
  const token = localStorage.getItem('token')

  useEffect(() => { fetchSkills() }, [])

  const fetchSkills = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/admin/skills`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      setSkills(await res.json() || [])
    } catch (err) {
      console.error('获取技能列表失败:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const url = editingSkill 
      ? `${API_BASE}/api/admin/skills/${editingSkill.id}` 
      : `${API_BASE}/api/admin/skills`
    const method = editingSkill ? 'PUT' : 'POST'
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ 
          ...form, 
          proficiency: Number(form.proficiency), 
          displayOrder: Number(form.displayOrder) 
        })
      })
      
      if (res.ok) {
        setShowModal(false)
        setEditingSkill(null)
        setForm({ name: '', category: '', proficiency: 80, displayOrder: 0 })
        fetchSkills()
      } else {
        alert('保存失败')
      }
    } catch (err) {
      console.error('保存技能失败:', err)
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (skill) => {
    setEditingSkill(skill)
    setForm({ 
      name: skill.name, 
      category: skill.category, 
      proficiency: skill.proficiency, 
      displayOrder: skill.displayOrder 
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这个技能吗？')) return
    try {
      await fetch(`${API_BASE}/api/admin/skills/${id}`, { 
        method: 'DELETE', 
        headers: { 'Authorization': `Bearer ${token}` } 
      })
      fetchSkills()
    } catch (err) {
      console.error('删除技能失败:', err)
    }
  }

  const getProficiencyColor = (level) => {
    if (level >= 90) return 'from-green-500 to-emerald-500'
    if (level >= 70) return 'from-blue-500 to-cyan-500'
    if (level >= 50) return 'from-yellow-500 to-orange-500'
    return 'from-gray-400 to-gray-500'
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-7 h-7 text-purple-600" />
            技能管理
          </h1>
          <p className="text-gray-500 text-sm mt-1">管理您的技能和熟练度</p>
        </div>
        <button 
          onClick={() => { 
            setEditingSkill(null)
            setForm({ name: '', category: '', proficiency: 80, displayOrder: 0 })
            setShowModal(true) 
          }} 
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          添加技能
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        ) : skills.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无技能，点击上方按钮添加</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">名称</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">熟练度</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {skills.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                      {s.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-gray-100 rounded-full h-2.5 max-w-32 overflow-hidden">
                        <div 
                          className={`h-full rounded-full bg-gradient-to-r ${getProficiencyColor(s.proficiency)} transition-all duration-300`}
                          style={{ width: `${s.proficiency}%` }} 
                        />
                      </div>
                      <span className="text-xs text-gray-500 w-8">{s.proficiency}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(s)} 
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(s.id)} 
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
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-gray-100 bg-gradient-to-r from-purple-500 to-pink-500">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {editingSkill ? '编辑技能' : '添加技能'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">技能名称 *</label>
                <input 
                  type="text" 
                  placeholder="如：React, Node.js" 
                  value={form.name} 
                  onChange={e => setForm({ ...form, name: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">分类 *</label>
                <input 
                  type="text" 
                  placeholder="如：前端、后端、数据库" 
                  value={form.category} 
                  onChange={e => setForm({ ...form, category: e.target.value })} 
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">熟练度: {form.proficiency}%</label>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={form.proficiency} 
                  onChange={e => setForm({ ...form, proficiency: e.target.value })} 
                  className="w-full accent-purple-500" 
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>入门</span>
                  <span>精通</span>
                </div>
              </div>
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