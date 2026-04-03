import { motion } from 'framer-motion'
import { Globe } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage()

  return (
    <motion.button
      onClick={toggleLanguage}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors"
      title={language === 'zh' ? 'Switch to English' : '切换到中文'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'zh' ? 'EN' : '中'}
      </span>
    </motion.button>
  )
}