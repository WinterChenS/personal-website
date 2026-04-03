import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProjectCard from '../components/ProjectCard'
import { Briefcase, Filter, Search, Rocket, Code, Sparkles, Zap } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'

export default function ProjectsPage() {
  const [projects, setProjects] = useState([])
  const [filteredProjects, setFilteredProjects] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTech, setSelectedTech] = useState('')
  const [techStacks, setTechStacks] = useState([])
  const [profile, setProfile] = useState(null)
  const { language } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    // 使用真实后端 API
    fetch('/api/public/projects')
      .then(res => res.json())
      .then(data => {
        setProjects(data || [])
        setFilteredProjects(data || [])

        // 提取所有技术栈
        const techs = new Set()
        ;(data || []).forEach(p => {
          if (p.techStack) {
            p.techStack.split(',').forEach(t => techs.add(t.trim()))
          }
        })
        const allTechs = [t('common.all'), ...Array.from(techs)]
        setTechStacks(allTechs)
        setSelectedTech(t('common.all'))
      })
      .catch(() => {
        // 如果后端不可用，使用 mock 数据
        import('../api/mockApi').then(module => {
          const api = module.default
          const allProjects = api.getProjects()
          setProjects(allProjects)
          setFilteredProjects(allProjects)

          const techs = new Set()
          allProjects.forEach(p => {
            if (p.techStack) {
              p.techStack.split(',').forEach(t => techs.add(t.trim()))
            }
          })
          const allTechs = [t('common.all'), ...Array.from(techs)]
          setTechStacks(allTechs)
          setSelectedTech(t('common.all'))
        })
      })

    // 获取 profile 数据
    fetch(`/api/public/profile?lang=${language}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {})
  }, [language])

  // 搜索和过滤
  useEffect(() => {
    let result = projects

    if (searchTerm) {
      result = result.filter(project =>
        project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (selectedTech && selectedTech !== t('common.all')) {
      result = result.filter(project =>
        project.techStack?.includes(selectedTech)
      )
    }

    setFilteredProjects(result)
  }, [searchTerm, selectedTech, projects, language])

  // 统计信息
  const stats = [
    { icon: Briefcase, value: projects.length, label: t('projects.stats.total'), color: 'from-indigo-500 to-purple-500' },
    { icon: Rocket, value: projects.filter(p => p.featured).length, label: t('projects.stats.featured'), color: 'from-amber-500 to-orange-500' },
    { icon: Code, value: techStacks.length - 1, label: t('projects.stats.techStack'), color: 'from-emerald-500 to-teal-500' },
  ]

  return (
    <div className="min-h-screen relative">
      {/* 背景装饰 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50/50 via-white to-white pointer-events-none" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto px-4 py-24">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', bounce: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-xl shadow-purple-500/30 mb-8"
          >
            <Rocket className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="page-title mb-6">{t('projects.title')}</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('projects.subtitle')}
          </p>
        </motion.div>

        {/* 统计卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-3 gap-6 mb-12"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="card-glass p-6 text-center"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-r ${stat.color} mb-3`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-500">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 搜索和过滤栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <div className="card-glass p-6">
            <div className="flex flex-col md:flex-row gap-4">
              {/* 搜索框 */}
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder={t('projects.searchPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/50 border border-white/50 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 outline-none transition-all"
                />
              </div>
            </div>

            {/* 技术栈筛选 */}
            <div className="flex items-center gap-2 flex-wrap mt-4">
              <Filter className="w-5 h-5 text-gray-400" />
              {techStacks.slice(0, 8).map((tech) => (
                <motion.button
                  key={tech}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedTech(tech)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    selectedTech === tech
                      ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                      : 'bg-white/50 text-gray-600 hover:bg-white hover:text-purple-600'
                  }`}
                >
                  {tech}
                </motion.button>
              ))}
              {techStacks.length > 8 && (
                <span className="text-gray-400 text-sm">+{techStacks.length - 8}</span>
              )}
            </div>
          </div>
        </motion.div>

        {/* 项目统计 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <p className="text-gray-600">
            {t('projects.resultsCount')} <span className="font-semibold text-purple-600">{filteredProjects.length}</span> {t('projects.projectsUnit')}
          </p>

          {/* 排序按钮 */}
          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center space-x-2 px-4 py-2 bg-white rounded-lg shadow-sm hover:shadow-md transition-all"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-gray-600">{t('projects.sortFeatured')}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* 项目列表 */}
        <AnimatePresence mode="wait">
          {filteredProjects.length > 0 ? (
            <motion.div
              key="projects"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid md:grid-cols-2 gap-8"
            >
              {filteredProjects.map((project, index) => (
                <ProjectCard key={project.id} project={project} index={index} />
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{t('projects.noProjects.title')}</h3>
              <p className="text-gray-500">{t('projects.noProjects.desc')}</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 底部 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-20 text-center"
        >
          <div className="card-glass p-8 max-w-2xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-r from-amber-400 to-orange-400 shadow-lg mb-6">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">{t('projects.cta.title')}</h3>
            <p className="text-gray-600 mb-6">
              {t('projects.cta.desc')}
            </p>
            <motion.a
              href={profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com'}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
            >
              <span>{t('projects.cta.button')}</span>
            </motion.a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}