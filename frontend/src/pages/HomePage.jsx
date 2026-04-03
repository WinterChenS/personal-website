import { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Code, PenTool, Briefcase, Sparkles, Github, Linkedin, Mail, ChevronDown, Star, Zap, Heart, Coffee, Rocket, Cpu, Database, Globe } from 'lucide-react'
import { Link } from 'react-router-dom'
import ParticleBackground from '../components/ParticleBackground'
import TypewriterText from '../components/TypewriterText'
import ArticleCard from '../components/ArticleCard'
import ProjectCard from '../components/ProjectCard'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'

export default function HomePage() {
  const [articles, setArticles] = useState([])
  const [projects, setProjects] = useState([])
  const [skills, setSkills] = useState([])
  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const { language } = useLanguage()
  const { t } = useTranslation()
  
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll()
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.95])

  useEffect(() => {
    // 使用真实后端 API
    fetch('/api/public/articles?page=0&size=3')
      .then(res => res.json())
      .then(data => setArticles(data.content || []))
      .catch(() => {
        // 如果后端不可用，使用 mock 数据
        import('../api/mockApi').then(module => {
          setArticles(module.default.getArticles().slice(0, 3))
        })
      })

    fetch('/api/public/projects/featured')
      .then(res => res.json())
      .then(data => setProjects(data || []))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setProjects(module.default.getProjects().filter(p => p.featured))
        })
      })

    fetch('/api/public/skills')
      .then(res => res.json())
      .then(data => setSkills(data || []))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setSkills(module.default.getSkills())
        })
      })

    // 获取统计数据
    fetch('/api/public/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {
        // 使用默认统计数据
      })

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // 语言切换时重新获取 profile
  useEffect(() => {
    fetch(`/api/public/profile?lang=${language}`)
      .then(res => res.json())
      .then(data => setProfile(data))
      .catch(() => {
        import('../api/mockApi').then(module => {
          setProfile(module.default.getProfile(language))
        })
      })
  }, [language])

  const skillCategories = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) acc[skill.category] = []
    acc[skill.category].push(skill)
    return acc
  }, {})

  // 职业标签：从 profile.tags 解析，或使用默认值
  const defaultTags = language === 'en' 
    ? ['Full Stack Developer', 'Tech Enthusiast', 'Lifelong Learner', 'Open Source Contributor']
    : ['全栈开发者', '技术爱好者', '终身学习者', '开源贡献者']
  const typewriterTexts = profile?.tags 
    ? profile.tags.split(',').map(t => t.trim()).filter(Boolean)
    : defaultTags

  // 统计数据：优先使用 API 数据
  const displayStats = [
    { icon: Coffee, value: stats?.coffeeCount || 1000, label: t('home.stats.coffee'), color: 'from-amber-500 to-orange-500' },
    { icon: Code, value: stats?.projectCount || 50, label: t('home.stats.projects'), color: 'from-indigo-500 to-purple-500' },
    { icon: PenTool, value: stats?.articleCount || 100, label: t('home.stats.articles'), color: 'from-pink-500 to-rose-500' },
    { icon: Star, value: stats?.starsCount || 1000, label: t('home.stats.stars'), color: 'from-yellow-500 to-amber-500' }
  ]

  const features = [
    { 
      icon: Code, 
      title: t('home.features.fullStack.title'), 
      desc: t('home.features.fullStack.desc'),
      gradient: 'from-blue-500 to-cyan-500',
      shadowColor: 'blue'
    },
    { 
      icon: Database, 
      title: t('home.features.architecture.title'), 
      desc: t('home.features.architecture.desc'),
      gradient: 'from-purple-500 to-pink-500',
      shadowColor: 'purple'
    },
    { 
      icon: Globe, 
      title: t('home.features.writing.title'), 
      desc: t('home.features.writing.desc'),
      gradient: 'from-amber-500 to-orange-500',
      shadowColor: 'amber'
    },
    { 
      icon: Rocket, 
      title: t('home.features.innovation.title'), 
      desc: t('home.features.innovation.desc'),
      gradient: 'from-emerald-500 to-teal-500',
      shadowColor: 'emerald'
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 粒子背景 */}
      <ParticleBackground />
      
      {/* Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 动态渐变背景 */}
        <div className="absolute inset-0 hero-gradient opacity-10" />
        
        {/* 装饰圆形 */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300/30 rounded-full blur-3xl float" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-300/30 rounded-full blur-3xl float-delay-1" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-200/20 rounded-full blur-3xl float-delay-2" />
        
        {/* 鼠标跟随光效 */}
        <motion.div 
          className="pointer-events-none fixed w-96 h-96 bg-gradient-radial from-indigo-500/20 to-transparent rounded-full blur-3xl"
          animate={{
            x: mousePosition.x - 192,
            y: mousePosition.y - 192,
          }}
          transition={{ type: 'spring', damping: 30, stiffness: 200 }}
        />

        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          {/* 头像区域 */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 100, delay: 0.2 }}
            className="relative inline-block mb-8"
          >
            <div className="relative">
              {/* 外圈旋转装饰 */}
              <motion.div 
                className="absolute inset-0 w-40 h-40 rounded-full border-2 border-dashed border-indigo-400/50"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              />
              {/* 中圈反向旋转 */}
              <motion.div 
                className="absolute inset-2 w-36 h-36 rounded-full border-2 border-dashed border-purple-400/50"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              />
              {/* 头像容器 */}
              <div className="w-32 h-32 relative">
                <div className="absolute inset-0 hero-avatar-gradient rounded-full animate-gradient" />
                <div className="absolute inset-1 hero-avatar-gradient rounded-full flex items-center justify-center hero-avatar-glow" style={{ opacity: 0.9 }}>
                  <span className="text-white font-bold text-5xl drop-shadow-lg">
                    {profile?.nickname?.charAt(0) || 'W'}
                  </span>
                </div>
                {/* 状态指示器 */}
                <motion.div 
                  className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full border-4 border-white shadow-lg"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.5 }}
                />
              </div>
            </div>
          </motion.div>

          {/* 欢迎文字 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="font-medium text-lg mb-2" style={{ color: 'var(--theme-primary)' }}>
              {profile?.welcomeText || '👋 Hello, I\'m'}
            </p>
          </motion.div>

          {/* 名字 */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-5xl md:text-7xl font-bold mb-6"
          >
            <span style={{
              background: 'var(--theme-gradient-text)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              {profile?.nickname || 'Claw'}
            </span>
          </motion.h1>

          {/* 打字机效果 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl md:text-2xl text-gray-600 mb-8 h-8"
          >
            <span className="text-gray-500">{t('home.hero.prefix')}</span>
            <span 
              className="font-semibold mx-2"
              style={{
                background: 'var(--theme-gradient)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              <TypewriterText texts={typewriterTexts} />
            </span>
          </motion.div>

          {/* 简介 */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="text-gray-600 text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            {profile?.bio || t('home.defaultBio')}
          </motion.p>

          {/* 社交链接和按钮 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12"
          >
            <Link to="/blog" className="btn-primary flex items-center space-x-2 group">
              <PenTool className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>{t('home.hero.readBlog')}</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/projects" className="btn-secondary flex items-center space-x-2 group">
              <Briefcase className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>{t('home.hero.viewProjects')}</span>
            </Link>
          </motion.div>

          {/* 社交图标 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center space-x-6"
          >
            {[
              { icon: Github, href: profile?.github || 'https://github.com', label: 'GitHub' },
              { icon: Linkedin, href: profile?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
              { icon: Mail, href: profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com', label: 'Email' },
            ].map((social, index) => (
              <motion.a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 rounded-full bg-white/50 backdrop-blur-sm border border-white/50 text-gray-600 hover:text-indigo-600 hover:bg-white transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <social.icon className="w-5 h-5" />
              </motion.a>
            ))}
          </motion.div>

          {/* 向下滚动提示 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          >
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="cursor-pointer"
              onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}
            >
              <ChevronDown className="w-8 h-8 text-gray-400" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* 统计数据 */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white via-gray-50 to-white" />
        <div className="relative max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {displayStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-10 transition-opacity rounded-2xl blur-xl"
                  style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}
                />
                <div className="card-glass p-6 text-center">
                  <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4 shadow-lg`}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 mb-1">
                    {stat.value}
                  </div>
                  <div className="text-gray-500 text-sm">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* 特色功能 */}
      <section className="relative py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 text-sm font-medium mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              {t('home.features.title')}
            </span>
            <h2 className="section-title">{t('home.features.subtitle')}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="group relative"
              >
                <div className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-20 rounded-2xl blur-xl transition-opacity duration-500`} />
                <div className="card-gradient h-full p-8 relative overflow-hidden">
                  {/* 背景装饰 */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${feature.gradient} opacity-5 rounded-bl-full transform translate-x-8 -translate-y-8`} />
                  
                  <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 技能展示 */}
      {Object.keys(skillCategories).length > 0 && (
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 via-white to-purple-50/50" />
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-50 text-purple-600 text-sm font-medium mb-4">
                <Cpu className="w-4 h-4 mr-2" />
                {t('home.skills.badge')}
              </span>
              <h2 className="section-title">{t('home.skills.title')}</h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {Object.entries(skillCategories).map(([category, categorySkills], index) => (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="card-glass p-8"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
                    <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${
                      index === 0 ? 'from-blue-500 to-cyan-500' :
                      index === 1 ? 'from-purple-500 to-pink-500' :
                      'from-amber-500 to-orange-500'
                    } mr-3`} />
                    {category}
                  </h3>
                  <div className="space-y-5">
                    {categorySkills.map((skill, i) => (
                      <motion.div 
                        key={skill.id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-gray-700 font-medium">{skill.name}</span>
                          <span className="text-indigo-600 font-semibold">{skill.proficiency}%</span>
                        </div>
                        <div className="skill-bar">
                          <motion.div
                            className="skill-bar-fill"
                            initial={{ width: 0 }}
                            whileInView={{ width: `${skill.proficiency}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 最新文章 */}
      {articles.length > 0 && (
        <section className="relative py-24 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
            >
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-pink-50 text-pink-600 text-sm font-medium mb-4">
                  <PenTool className="w-4 h-4 mr-2" />
                  {t('home.articles.badge')}
                </span>
                <h2 className="section-title mb-0">{t('home.articles.title')}</h2>
              </div>
              <Link to="/blog" className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium mt-4 md:mt-0">
                <span>{t('home.sections.viewAll')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <ArticleCard article={article} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 精选项目 */}
      {projects.length > 0 && (
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-indigo-50/30" />
          <div className="max-w-6xl mx-auto relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex flex-col md:flex-row md:items-end md:justify-between mb-12"
            >
              <div>
                <span className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 text-emerald-600 text-sm font-medium mb-4">
                  <Rocket className="w-4 h-4 mr-2" />
                  {t('home.projects.badge')}
                </span>
                <h2 className="section-title mb-0">{t('home.projects.title')}</h2>
              </div>
              <Link to="/projects" className="group flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-medium mt-4 md:mt-0">
                <span>{t('home.sections.viewAll')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.slice(0, 2).map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 40, rotateX: -10 }}
                  whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  className="perspective-1000"
                >
                  <ProjectCard project={project} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA 区域 */}
      <section className="relative py-24 px-4 overflow-hidden">
        <div 
          className="absolute inset-0"
          style={{ background: 'var(--theme-gradient)' }}
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIyIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        
        {/* 浮动装饰 */}
        <motion.div 
          className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div 
          className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />

        <div className="max-w-4xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              {profile?.ctaTitle || t('home.cta.defaultTitle')}
            </h2>
            <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
              {profile?.ctaDescription || t('home.cta.defaultDesc')}
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <motion.a
                href={profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com'}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow"
              >
                <Mail className="w-5 h-5 mr-2" />
                {t('home.cta.sendEmail')}
              </motion.a>
              <Link 
                to="/blog"
                className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-white/30 hover:bg-white/20 transition-colors"
              >
                {t('home.cta.browseArticles')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}