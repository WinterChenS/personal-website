import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, Eye, Clock, ArrowRight } from 'lucide-react'

export default function ArticleCard({ article, index = 0 }) {
  // 根据分类生成渐变色
  const categoryGradients = {
    '技术': 'from-blue-500 to-cyan-500',
    '生活': 'from-pink-500 to-rose-500',
    '随笔': 'from-amber-500 to-orange-500',
    '教程': 'from-emerald-500 to-teal-500',
    '默认': 'from-indigo-500 to-purple-500'
  }

  const gradient = categoryGradients[article.category] || categoryGradients['默认']

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Link to={`/blog/${article.id}`} className="group block">
        <div className="relative h-full rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 transform hover:-translate-y-2">
          {/* 封面图片区域 */}
          <div className="relative h-48 overflow-hidden">
            {article.coverImage ? (
              <img
                src={article.coverImage}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-90`}>
                <div className="absolute inset-0 bg-black/10" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/30 text-6xl font-bold">
                    {article.title.charAt(0)}
                  </span>
                </div>
              </div>
            )}
            
            {/* 遮罩层 */}
            <div className={`absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* 分类标签 */}
            {article.category && (
              <div className="absolute top-4 left-4">
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  className={`inline-block px-3 py-1 bg-gradient-to-r ${gradient} text-white text-xs font-semibold rounded-full shadow-lg`}
                >
                  {article.category}
                </motion.span>
              </div>
            )}
          </div>

          {/* 内容区域 */}
          <div className="p-6">
            {/* 标题 */}
            <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-300 line-clamp-2">
              {article.title}
            </h3>

            {/* 摘要 */}
            <p className="text-gray-600 text-sm mb-5 line-clamp-2 leading-relaxed">
              {article.summary}
            </p>

            {/* 底部信息 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(article.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>{article.views || 0}</span>
                </div>
              </div>

              {/* 阅读更多指示 */}
              <motion.div 
                className="flex items-center space-x-1 text-indigo-600 font-medium text-sm"
                initial={{ x: 0 }}
                whileHover={{ x: 5 }}
              >
                <span>阅读</span>
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </div>
          </div>

          {/* 底部渐变边框 */}
          <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
        </div>
      </Link>
    </motion.div>
  )
}