import { useState, useEffect } from 'react'
import { User, Mail, Tag, MessageSquare, Target, Coffee, Star, Loader, ChevronDown, ChevronUp, Globe } from 'lucide-react'

const API_BASE = 'http://localhost:8080'

export default function ProfileManager() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [activeLangTab, setActiveLangTab] = useState('zh') // 当前编辑的语言版本
  const [form, setForm] = useState({})
  const token = localStorage.getItem('token')

  useEffect(() => {
    const tokenValue = localStorage.getItem('token')
    fetch(`${API_BASE}/api/admin/profile`, {
      headers: { 'Authorization': `Bearer ${tokenValue}` }
    })
      .then(res => {
        if (!res.ok) {
          console.error('获取profile失败:', res.status, res.statusText)
          return {}
        }
        return res.json()
      })
      .then(data => {
        setProfile(data)
        setForm({
          // 基础信息（不分语言）
          nickname: data.nickname || '',
          location: data.location || '',
          website: data.website || '',
          github: data.github || '',
          twitter: data.twitter || '',
          linkedin: data.linkedin || '',
          emailPublic: data.emailPublic || '',
          coffeeCount: data.coffeeCount || 1000,
          starsCount: data.starsCount || 1000,
          // 中文内容
          bio: data.bio || '',
          tags: data.tags || '',
          welcomeText: data.welcomeText || '',
          ctaTitle: data.ctaTitle || '',
          ctaDescription: data.ctaDescription || '',
          // 英文内容
          bioEn: data.bioEn || '',
          tagsEn: data.tagsEn || '',
          welcomeTextEn: data.welcomeTextEn || '',
          ctaTitleEn: data.ctaTitleEn || '',
          ctaDescriptionEn: data.ctaDescriptionEn || ''
        })
      })
      .catch(err => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(form)
      })
      
      if (res.ok) {
        alert('保存成功')
        const data = await res.json()
        setProfile(data)
      } else {
        alert('保存失败')
      }
    } catch (err) {
      console.error('Save failed:', err)
      alert('保存失败')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="w-6 h-6 animate-spin text-purple-500" />
        <span className="ml-2 text-gray-500">加载中...</span>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <User className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
          个人信息
        </h1>
        <p className="mt-1 text-sm text-gray-500">管理您的公开个人信息</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 基础信息 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            基本信息
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">昵称</label>
              <input
                type="text"
                value={form.nickname || ''}
                onChange={(e) => setForm({ ...form, nickname: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">位置</label>
              <input
                type="text"
                value={form.location || ''}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人网站</label>
              <input
                type="url"
                value={form.website || ''}
                onChange={(e) => setForm({ ...form, website: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="https://"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Mail className="w-4 h-4" />
                公开邮箱
              </label>
              <input
                type="email"
                value={form.emailPublic || ''}
                onChange={(e) => setForm({ ...form, emailPublic: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 社交链接 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">社交链接</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
              <input
                type="url"
                value={form.github || ''}
                onChange={(e) => setForm({ ...form, github: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter</label>
              <input
                type="url"
                value={form.twitter || ''}
                onChange={(e) => setForm({ ...form, twitter: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
              <input
                type="url"
                value={form.linkedin || ''}
                onChange={(e) => setForm({ ...form, linkedin: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* 多语言内容 */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
            多语言内容
          </h2>
          
          {/* 语言切换标签 */}
          <div className="flex gap-2 mb-4 border-b pb-4">
            <button
              type="button"
              onClick={() => setActiveLangTab('zh')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeLangTab === 'zh'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇨🇳 中文
            </button>
            <button
              type="button"
              onClick={() => setActiveLangTab('en')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeLangTab === 'en'
                  ? 'bg-purple-100 text-purple-700'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              🇺🇸 English
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea
                value={activeLangTab === 'zh' ? form.bio : form.bioEn}
                onChange={(e) => setForm({
                  ...form,
                  [activeLangTab === 'zh' ? 'bio' : 'bioEn']: e.target.value
                })}
                rows={3}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={activeLangTab === 'zh' ? '简短介绍你自己' : 'Brief introduction about yourself'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4" />
                职业标签
              </label>
              <input
                type="text"
                value={activeLangTab === 'zh' ? form.tags : form.tagsEn}
                onChange={(e) => setForm({
                  ...form,
                  [activeLangTab === 'zh' ? 'tags' : 'tagsEn']: e.target.value
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={activeLangTab === 'zh' ? '逗号分隔，如：全栈开发者,技术爱好者' : 'Comma separated, e.g.: Full-stack Developer, Tech Enthusiast'}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                欢迎语
              </label>
              <input
                type="text"
                value={activeLangTab === 'zh' ? form.welcomeText : form.welcomeTextEn}
                onChange={(e) => setForm({
                  ...form,
                  [activeLangTab === 'zh' ? 'welcomeText' : 'welcomeTextEn']: e.target.value
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={activeLangTab === 'zh' ? "👋 你好，我是" : "👋 Hello, I'm"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                <Target className="w-4 h-4" />
                CTA 标题
              </label>
              <input
                type="text"
                value={activeLangTab === 'zh' ? form.ctaTitle : form.ctaTitleEn}
                onChange={(e) => setForm({
                  ...form,
                  [activeLangTab === 'zh' ? 'ctaTitle' : 'ctaTitleEn']: e.target.value
                })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={activeLangTab === 'zh' ? '开始合作' : "Let's Collaborate"}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CTA 描述</label>
              <textarea
                value={activeLangTab === 'zh' ? form.ctaDescription : form.ctaDescriptionEn}
                onChange={(e) => setForm({
                  ...form,
                  [activeLangTab === 'zh' ? 'ctaDescription' : 'ctaDescriptionEn']: e.target.value
                })}
                rows={2}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={activeLangTab === 'zh' ? '有想法？想要合作？随时联系我！' : "Have an idea? Let's collaborate!"}
              />
            </div>
          </div>
        </div>

        {/* 高级配置 */}
        <div className="bg-white rounded-xl shadow-sm">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full px-6 py-4 flex items-center justify-between text-left"
          >
            <span className="font-semibold text-gray-900">高级配置</span>
            {showAdvanced ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
          
          {showAdvanced && (
            <div className="px-6 pb-6 pt-2 border-t grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Coffee className="w-4 h-4" />
                  咖啡数
                </label>
                <input
                  type="number"
                  value={form.coffeeCount || 1000}
                  onChange={(e) => setForm({ ...form, coffeeCount: parseInt(e.target.value) || 1000 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
                  <Star className="w-4 h-4" />
                  Stars 数
                </label>
                <input
                  type="number"
                  value={form.starsCount || 1000}
                  onChange={(e) => setForm({ ...form, starsCount: parseInt(e.target.value) || 1000 })}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* 提交按钮 */}
        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-lg font-medium hover:from-purple-600 hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving && <Loader className="w-4 h-4 animate-spin" />}
            {saving ? '保存中...' : '保存'}
          </button>
        </div>
      </form>
    </div>
  )
}