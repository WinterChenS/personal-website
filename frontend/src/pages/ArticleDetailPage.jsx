import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Eye, Clock, User, Share2, Bookmark, Heart, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'

export default function ArticleDetailPage() {
  const { id } = useParams()
  const [article, setArticle] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 使用真实后端 API
    fetch(`/api/public/articles/${id}`)
      .then(res => res.json())
      .then(data => {
        setArticle(data)
        setLoading(false)
      })
      .catch(() => {
        // 如果后端不可用，使用 mock 数据
        import('../api/mockApi').then(module => {
          const api = module.default
          const articles = api.getArticles()
          const foundArticle = articles.find(a => a.id === parseInt(id))
          setArticle(foundArticle || null)
          setLoading(false)
        })
      })
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full mx-auto mb-4"
          />
          <p className="text-gray-500">加载中...</p>
        </div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">📄</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">文章不存在</h2>
          <p className="text-gray-500 mb-6">该文章可能已被删除或移除</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-all hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回博客</span>
          </Link>
        </div>
      </div>
    )
  }

  // 根据分类生成渐变色
  const categoryGradients = {
    '前端开发': 'from-blue-500 to-cyan-500',
    '后端开发': 'from-purple-500 to-pink-500',
    'DevOps': 'from-emerald-500 to-teal-500',
    '架构设计': 'from-amber-500 to-orange-500',
    '默认': 'from-indigo-500 to-purple-500'
  }

  const gradient = categoryGradients[article.category] || categoryGradients['默认']

  return (
    <div className="min-h-screen bg-white">
      {/* Notion风格 - 顶部区域 */}
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-8">
        {/* 第一行：返回按钮 */}
        <a 
          href="/blog"
          className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 transition-colors duration-200 mb-6"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span className="text-sm">返回</span>
        </a>
        
        {/* 第二行：分类 + 标题 */}
        <div className="mb-4">
          {article.category && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="mb-3"
            >
              <span className="inline-block px-2.5 py-1 text-xs font-medium text-gray-700 bg-gray-100 rounded-md">
                {article.category}
              </span>
            </motion.div>
          )}
          
          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
            {article.title}
          </h1>
        </div>
        
        {/* 第三行：元信息 */}
        <div className="flex items-center gap-4 text-gray-400 text-sm pb-6 border-b border-gray-100">
          <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
          <span>·</span>
          <span>{article.views || 0} 阅读</span>
        </div>
      </div>

      {/* 文章内容 - Notion风格简洁区域 */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-4xl mx-auto px-4 pt-8 pb-12"
      >
        {/* 文章内容 - 优化Markdown渲染样式 */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="article-content"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {article.content}
          </ReactMarkdown>
        </motion.article>

        {/* 标签区域 */}
        {article.tags && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 pt-8 border-t border-gray-100"
          >
            <div className="flex items-center space-x-3 flex-wrap gap-2">
              <Tag className="w-5 h-5 text-gray-400" />
              {article.tags.split(',').map((tag, index) => (
                <span 
                  key={index} 
                  className="px-4 py-1.5 bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 text-sm rounded-full cursor-pointer transition-colors"
                >
                  #{tag.trim()}
                </span>
              ))}
            </div>
          </motion.div>
        )}

        {/* 操作按钮 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 flex items-center justify-between"
        >
          <div className="flex items-center space-x-4">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-50 text-gray-600 hover:text-pink-600 transition-colors"
            >
              <Heart className="w-5 h-5" />
              <span>喜欢</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gray-100 hover:bg-indigo-50 text-gray-600 hover:text-indigo-600 transition-colors"
            >
              <Bookmark className="w-5 h-5" />
              <span>收藏</span>
            </motion.button>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="flex items-center space-x-2 px-4 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg"
          >
            <Share2 className="w-5 h-5" />
            <span>分享</span>
          </motion.button>
        </motion.div>

        {/* 作者卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-16"
        >
          <div className="card-glass p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold text-gray-900 mb-2">关于作者</h3>
                <p className="text-gray-600 mb-4">
                  全栈开发者，热爱技术与开源。专注于构建优雅的解决方案，从全栈开发到系统架构，始终保持学习的热情。
                </p>
                <div className="flex justify-center md:justify-start space-x-3">
                  <Link 
                    to="/projects"
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
                  >
                    查看项目
                  </Link>
                  <Link 
                    to="/blog"
                    className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-shadow"
                  >
                    更多文章
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}