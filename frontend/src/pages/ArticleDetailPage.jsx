import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Calendar, Eye, Clock, User, Share2, Bookmark, Heart, Tag } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

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
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-full font-medium hover:shadow-lg transition-shadow"
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
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

      {/* 封面区域 */}
      {article.coverImage && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative h-[50vh] overflow-hidden"
        >
          <img
            src={article.coverImage}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="relative max-w-4xl mx-auto px-4 py-12"
      >
        {/* 返回按钮 */}
        <Link 
          to="/blog" 
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-indigo-600 mb-8 group transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>返回博客</span>
        </Link>

        {/* 文章头部 */}
        <div className="mb-8">
          {/* 分类标签 */}
          {article.category && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={`inline-block px-4 py-1.5 bg-gradient-to-r ${gradient} text-white text-sm font-semibold rounded-full mb-4 shadow-lg`}
            >
              {article.category}
            </motion.span>
          )}

          {/* 标题 */}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {article.title}
          </h1>

          {/* 元信息 */}
          <div className="flex flex-wrap items-center gap-6 text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Claw</p>
                <p className="text-xs">全栈开发者</p>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
            </div>

            <div className="flex items-center space-x-1">
              <Clock className="w-4 h-4" />
              <span>5 分钟阅读</span>
            </div>

            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{article.views || 0} 次阅读</span>
            </div>
          </div>

          {/* 分割线 */}
          <div className="h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent mt-8" />
        </div>

        {/* 文章内容 */}
        <motion.article
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-a:text-indigo-600 hover:prose-a:text-indigo-700 prose-code:bg-gray-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-indigo-600"
        >
          <ReactMarkdown>{article.content}</ReactMarkdown>
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