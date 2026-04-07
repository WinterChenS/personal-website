import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, FileText, Tag, Calendar, Check, Loader, Save, Eye, Hash } from 'lucide-react'
import RichTextEditor from '../../components/RichTextEditor'

const API_BASE = 'http://localhost:8080'

export default function ArticleManager() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [editingArticle, setEditingArticle] = useState(null)
  const [form, setForm] = useState({ 
    title: '', 
    summary: '', 
    content: '', 
    category: '', 
    tags: [], 
    published: true,
    coverImage: ''
  })

  const token = localStorage.getItem('token')

  useEffect(() => {
    fetchArticles()
  }, [])

  const fetchArticles = async () => {
    setLoading(true)
    try {
      const tokenValue = localStorage.getItem('token')
      const headers = {}
      if (tokenValue) {
        headers['Authorization'] = `Bearer ${tokenValue}`
      }
      
      const res = await fetch(`${API_BASE}/api/admin/articles?page=0&size=100`, { headers })
      
      if (!res.ok) {
        console.error('获取文章列表失败:', res.status)
        const text = await res.text()
        console.error('Error response:', text)
        setArticles([])
        return
      }
      
      const text = await res.text()
      let data
      try {
        data = JSON.parse(text)
      } catch {
        console.error('Invalid JSON response:', text)
        setArticles([])
        return
      }
      
      setArticles(Array.isArray(data) ? data : (data.content || []))
    } catch (err) {
      console.error('获取文章列表失败:', err)
      setArticles([])
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    
    const url = editingArticle
      ? `${API_BASE}/api/admin/articles/${editingArticle.id}`
      : `${API_BASE}/api/admin/articles`
    const method = editingArticle ? 'PUT' : 'POST'

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...form, tags: form.tags.join(',') })
      })
      
      if (res.ok) {
        setShowModal(false)
        setEditingArticle(null)
        setForm({ 
          title: '', 
          summary: '', 
          content: '', 
          category: '', 
          tags: [], 
          published: true,
          coverImage: '' 
        })
        fetchArticles()
      } else {
        alert('保存失败，请重试')
      }
    } catch (err) {
      console.error('保存文章失败:', err)
      alert('保存失败，请重试')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (article) => {
    setEditingArticle(article)
    setForm({
      title: article.title,
      summary: article.summary || '',
      content: article.content || '',
      category: article.category || '',
      tags: article.tags ? article.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      published: article.published,
      coverImage: article.coverImage || ''
    })
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (!confirm('确定要删除这篇文章吗？此操作不可撤销。')) return
    
    try {
      const res = await fetch(`${API_BASE}/api/admin/articles/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      
      if (res.ok) {
        fetchArticles()
      } else {
        alert('删除失败，请重试')
      }
    } catch (err) {
      console.error('删除文章失败:', err)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-7 h-7 text-purple-600" />
            文章管理
          </h1>
          <p className="text-gray-500 text-sm mt-1">管理您的博客文章内容</p>
        </div>
        <button
          onClick={() => {
            setEditingArticle(null)
            setForm({ 
              title: '', 
              summary: '', 
              content: '', 
              category: '', 
              tags: [], 
              published: true,
              coverImage: '' 
            })
            setShowModal(true)
          }}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-xl flex items-center gap-2 shadow-lg shadow-purple-500/20 transition-all"
        >
          <Plus className="w-4 h-4" />
          新建文章
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-6 h-6 animate-spin text-purple-500" />
            <span className="ml-2 text-gray-500">加载中...</span>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>暂无文章，点击上方按钮创建</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">标题</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">分类</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">状态</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">阅读量</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">创建时间</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {articles.map(article => (
                <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{article.title}</div>
                    {article.summary && (
                      <div className="text-xs text-gray-500 mt-1 line-clamp-1">{article.summary}</div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {article.category ? (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        <Tag className="w-3 h-3" />
                        {article.category}
                      </span>
                    ) : (
                      <span className="text-gray-400 text-sm">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                      article.published 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {article.published && <Check className="w-3 h-3" />}
                      {article.published ? '已发布' : '草稿'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-sm text-gray-600">
                      <Eye className="w-3 h-3" />
                      {article.views || 0}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(article.createdAt).toLocaleDateString('zh-CN')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(article)} 
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                        title="编辑"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(article.id)} 
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

      {/* Modal - Full Screen Editor */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex">
          <div className="bg-white w-full h-full overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-gray-200 bg-gradient-to-r from-purple-500 to-pink-500">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-white" />
                <h2 className="text-lg font-semibold text-white">
                  {editingArticle ? '编辑文章' : '新建文章'}
                </h2>
                {form.title && (
                  <span className="text-white/80 text-sm">- {form.title}</span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleSubmit}
                  disabled={saving || !form.title}
                  className="px-4 py-2 bg-white rounded-lg font-medium hover:bg-gray-100 transition-colors disabled:opacity-50 flex items-center gap-2"
                  style={{ color: 'var(--theme-primary)' }}
                >
                  {saving ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      保存中...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      保存
                    </>
                  )}
                </button>
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 text-white/80 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left: Meta fields */}
              <div className="w-80 border-r border-gray-200 p-4 overflow-y-auto bg-gray-50">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      标题 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="输入文章标题"
                      value={form.title}
                      onChange={e => setForm({ ...form, title: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">封面图片</label>
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={form.coverImage}
                      onChange={e => setForm({ ...form, coverImage: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                    {form.coverImage && (
                      <img 
                        src={form.coverImage} 
                        alt="封面预览" 
                        className="mt-2 w-full h-32 object-cover rounded-lg"
                        onError={(e) => e.target.style.display = 'none'}
                      />
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">摘要</label>
                    <textarea
                      placeholder="简短描述文章内容"
                      value={form.summary}
                      onChange={e => setForm({ ...form, summary: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">分类</label>
                    <input
                      type="text"
                      placeholder="如：技术、生活"
                      value={form.category}
                      onChange={e => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-white"
                    />
                  </div>
                  
                  {/* TagInput 组件 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">标签</label>
                    <TagInput 
                      tags={form.tags} 
                      onChange={(tags) => setForm({ ...form, tags })} 
                    />
                  </div>
                  
                  <label className="flex items-center gap-3 p-3 bg-white rounded-xl cursor-pointer hover:bg-gray-100 transition-colors border border-gray-200">
                    <input
                      type="checkbox"
                      checked={form.published}
                      onChange={e => setForm({ ...form, published: e.target.checked })}
                      className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-1">
                      {form.published ? (
                        <><Eye className="w-4 h-4 text-green-500" /> 立即发布</>
                      ) : (
                        <><FileText className="w-4 h-4 text-gray-400" /> 保存为草稿</>
                      )}
                    </span>
                  </label>
                </div>
              </div>

              {/* Right: Editor */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="h-full">
                  <RichTextEditor
                    value={form.content}
                    onChange={(val) => setForm({ ...form, content: val })}
                    height={600}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ========== TagInput 组件 ==========
function TagInput({ tags, onChange }) {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef(null)

  const addTag = (tagText) => {
    const tag = tagText.trim()
    if (tag && !tags.includes(tag)) {
      onChange([...tags, tag])
    }
    setInputValue('')
  }

  const removeTag = (indexToRemove) => {
    onChange(tags.filter((_, i) => i !== indexToRemove))
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === ',' || e.key === '，') {
      e.preventDefault()
      addTag(inputValue)
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1)
    }
  }

  return (
    <div className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-purple-500 bg-white flex flex-wrap items-center gap-2 min-h-[46px]">
      {tags.map((tag, index) => (
        <motion.span
          key={tag}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-100 text-purple-700 text-sm rounded-full"
        >
          <Hash className="w-3 h-3" />
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-0.5 hover:text-purple-900 hover:bg-purple-200 rounded-full p-0.5 transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </motion.span>
      ))}
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={tags.length === 0 ? '输入标签后按回车或逗号添加' : '继续添加...'}
        className="flex-1 min-w-[120px] outline-none bg-transparent text-sm py-1"
      />
    </div>
  )
}