import { Github, ExternalLink, Star, GitBranch, Code } from 'lucide-react'
import { motion } from 'framer-motion'
import { useLanguage } from '../contexts/LanguageContext'

export default function ProjectCard({ project, index = 0 }) {
  const { language } = useLanguage()
  // 根据技术栈生成渐变色
  const getGradient = (techStack) => {
    if (!techStack) return 'from-indigo-500 to-purple-500'
    
    const tech = techStack.toLowerCase()
    if (tech.includes('react')) return 'from-cyan-500 to-blue-500'
    if (tech.includes('vue')) return 'from-emerald-500 to-teal-500'
    if (tech.includes('python')) return 'from-yellow-500 to-amber-500'
    if (tech.includes('java')) return 'from-red-500 to-orange-500'
    if (tech.includes('go')) return 'from-cyan-400 to-sky-500'
    if (tech.includes('rust')) return 'from-orange-600 to-amber-500'
    return 'from-indigo-500 to-purple-500'
  }

  const gradient = getGradient(project.techStack)

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15 }}
      className="group h-full"
    >
      <div className="relative h-full rounded-2xl overflow-hidden bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 transform hover:-translate-y-2 preserve-3d">
        {/* 背景装饰 */}
        <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-full transform translate-x-10 -translate-y-10 group-hover:opacity-10 transition-opacity duration-500`} />
        
        {/* 精选标识 */}
        {project.featured && (
          <div className="absolute top-4 right-4 z-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.5 }}
              className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-xs font-semibold rounded-full shadow-lg"
            >
              <Star className="w-3 h-3 fill-current" />
              <span>{language === 'en' ? 'Featured' : '精选'}</span>
            </motion.div>
          </div>
        )}

        <div className="relative p-8">
          {/* 头部 */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center space-x-4">
              {/* 项目图标 */}
              <motion.div 
                className={`w-14 h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring', stiffness: 400 }}
              >
                <Code className="w-7 h-7 text-white" />
              </motion.div>

              <div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                  {project.name}
                </h3>
                {project.stars > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-sm font-medium text-gray-600">{project.stars}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            {project.description}
          </p>

          {/* 技术栈标签 */}
          {project.techStack && (
            <div className="flex flex-wrap gap-2 mb-8">
              {project.techStack.split(',').map((tech, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="tag"
                >
                  {tech.trim()}
                </motion.span>
              ))}
            </div>
          )}

          {/* 底部链接 */}
          <div className="flex items-center space-x-4 pt-4 border-t border-gray-100">
            {project.githubUrl && (
              <motion.a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
              >
                <Github className="w-4 h-4" />
                <span>{language === 'en' ? 'Source' : '源码'}</span>
              </motion.a>
            )}
            {project.demoUrl && (
              <motion.a
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, x: 5 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r ${gradient} text-white text-sm font-medium shadow-md hover:shadow-lg transition-shadow`}
              >
                <ExternalLink className="w-4 h-4" />
                <span>{language === 'en' ? 'Demo' : '演示'}</span>
              </motion.a>
            )}
          </div>
        </div>

        {/* 底部渐变边框 */}
        <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      </div>
    </motion.div>
  )
}