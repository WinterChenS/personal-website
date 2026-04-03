import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ArticleCard from '../components/ArticleCard'
import { Search, Filter, Grid3x3, LayoutList, FileText, Sparkles } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'

export default function BlogPage() {
  const [articles, setArticles] = useState([])
  const [filteredArticles, setFilteredArticles] = useState([])
  const [page, setPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState('grid')
  const [categories, setCategories] = useState([])
  const { language } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    // 使用真实后端 API
    fetch(`/api/public/articles?page=${page}&size=9`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.content || [])
        setFilteredArticles(data.content || [])
        setTotalPages(data.totalPages || 0)
        
        // 提取分类
        const cats = new Set((data.content || []).map(a => a.category).filter(Boolean))
        const allCats = [t('common.all'), ...Array.from(cats)]
        setCategories(allCats)
        setSelectedCategory(t('common.all'))
      })
      .catch(() => {
        // 如果后端不可用，使用 mock 数据
        import('../api/mockApi').then(module => {
          const api = module.default
          const allArticles = api.getArticles()
          setArticles(allArticles)
          setFilteredArticles(allArticles)
          
          const cats = new Set(allArticles.map(a => a.category).filter(Boolean))
          const allCats = [t('common.all'), ...Array.from(cats)]
          setCategories(allCats)
          setSelectedCategory(t('common.all'))
        })
      })
  }, [page, language])

  // 搜索和过滤
  useEffect(() => {
    let result = articles

    if (searchTerm) {
      result = result.filter(article => 
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedCategory && selectedCategory !== t('common.all')) {
      result = result.filter(article => article.category === selectedCategory)
    }

    setFilteredArticles(result)
  }, [searchTerm, selectedCategory, articles, language])

  return (
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-50/50 via-white to-white pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-24">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-xl shadow-indigo-500/30 mb-8"
          >
            <FileText className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="page-title mb-6">{t('blog.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('blog.subtitle')}
          </p>
        </motion.div>

        {/* 搜索和过滤栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="card-glass p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('blog.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                />
              </div>

              {/* 分类筛选 */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-5 h-5 text-gray-400" />
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                        : 'bg-white/50 text-gray-600 hover:bg-white hover:text-indigo-600'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* 文章统计 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-gray-600">
            {t('blog.resultsCount')} <span className="font-semibold text-indigo-600">{filteredArticles.length}</span> {t('blog.articlesUnit')}
          </p>

          {/* 视图切换 */}
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'grid' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${
                viewMode === 'list' 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <LayoutList className="w-4 h-4" />
            </button>
          </div>
        </motion.div>

        {/* 文章列表 */}
        <AnimatePresence mode="wait">
          {filteredArticles.length > 0 ? (
            <motion.div
              key="articles"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={viewMode === 'grid' 
                ? 'grid md:grid-cols-3 gap-8' 
                : 'space-y-6'
              }
            >
              {filteredArticles.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-16"
            >
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-gray-300" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('blog.noArticles.title')}</h3>
              <p className="text-gray-500">{t('blog.noArticles.desc')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 分页 */}
        {totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-16"
          >
            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage(i)}
                  className={`w-10 h-10 rounded-xl font-medium transition-all ${
                    page === i
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg'
                      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  {i + 1}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}