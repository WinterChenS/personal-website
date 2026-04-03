import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, FileText, Folder, Menu, X, Sun, Moon, Github } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'
import LanguageSwitcher from './LanguageSwitcher'

export default function Navbar({ profile }) {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const location = useLocation()
  const { language } = useLanguage()
  const { t } = useTranslation()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/blog', label: t('nav.blog'), icon: FileText },
    { path: '/projects', label: t('nav.projects'), icon: Folder },
  ]

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'py-2' 
            : 'py-4'
        }`}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className={`flex justify-between items-center rounded-2xl transition-all duration-500 ${
            scrolled 
              ? 'backdrop-blur-xl bg-white/80 shadow-lg shadow-indigo-500/5 border border-white/50 px-6 py-3' 
              : 'bg-transparent px-2'
          }`}>
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <div 
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow"
                style={{ background: 'var(--theme-gradient)', boxShadow: 'var(--theme-shadow)' }}
              >
                  <span className="text-white font-bold text-xl">{profile?.nickname?.charAt(0) || 'W'}</span>
                </div>
                <div 
                className="absolute -inset-1 rounded-xl blur opacity-30 group-hover:opacity-50 transition-opacity"
                style={{ background: 'var(--theme-gradient)' }}
              />
              </motion.div>
              <div className="hidden sm:block">
                <span 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{ backgroundImage: 'var(--theme-gradient-text)' }}
              >
                  {profile?.nickname || (language === 'en' ? 'My Website' : '我的网站')}
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navLinks.map(({ path, label, icon: Icon }) => (
                <Link
                  key={path}
                  to={path}
                  className="relative group"
                >
                  <motion.div
                    className={`flex items-center space-x-2 px-5 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      location.pathname === path
                        ? 'text-indigo-600'
                        : 'text-gray-600 hover:text-indigo-600'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className={`w-4 h-4 transition-all duration-300 ${
                      location.pathname === path ? 'scale-110' : ''
                    }`} />
                    <span>{label}</span>
                  </motion.div>
                  
                  {/* Active indicator */}
                  {location.pathname === path && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  
                  {/* Hover effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 to-purple-500/0 group-hover:from-indigo-50 group-hover:to-purple-50 rounded-xl -z-10 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-3">
              {/* Language Switcher */}
              <LanguageSwitcher />

              {/* GitHub Link */}
              <motion.a
                href={profile?.github || 'https://github.com'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                className="p-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Github className="w-5 h-5" />
              </motion.a>

              {/* Mobile menu button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="md:hidden p-2.5 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-600 transition-colors"
                onClick={() => setIsOpen(!isOpen)}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu className="w-5 h-5" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ opacity: 0, x: '100%' }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white/95 backdrop-blur-xl shadow-2xl z-50 md:hidden"
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex justify-end mb-8">
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-600"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>

                {/* Navigation Links */}
                <div className="space-y-2">
                  {navLinks.map(({ path, label, icon: Icon }, index) => (
                    <motion.div
                      key={path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={path}
                        onClick={() => setIsOpen(false)}
                        className={`flex items-center space-x-4 px-5 py-4 rounded-xl transition-all duration-300 ${
                          location.pathname === path
                            ? 'text-white'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                        style={location.pathname === path ? { background: 'var(--theme-gradient)', boxShadow: 'var(--theme-shadow)' } : {}}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{label}</span>
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Divider */}
                <div className="my-8 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />

                {/* Additional Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="text-center text-gray-500 text-sm"
                >
                  <p>{language === 'en' ? 'Thanks for visiting ✨' : '感谢访问 ✨'}</p>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}