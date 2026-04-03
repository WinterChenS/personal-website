import { Github, Twitter, Linkedin, Mail, Heart, Coffee, ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useTranslation } from '../i18n/translations'

export default function Footer({ profile }) {
  const currentYear = new Date().getFullYear()
  const { language } = useLanguage()
  const { t } = useTranslation()

  const footerLinks = [
    {
      title: t('footer.navigation'),
      links: [
        { label: t('nav.home'), path: '/' },
        { label: t('nav.blog'), path: '/blog' },
        { label: t('nav.projects'), path: '/projects' },
      ]
    },
    {
      title: t('footer.contact'),
      links: [
        { label: 'GitHub', href: profile?.github || 'https://github.com', external: true },
        { label: 'LinkedIn', href: profile?.linkedin || 'https://linkedin.com', external: true },
        { label: 'Email', href: profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com', external: true },
      ]
    }
  ]

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-gray-900 overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMSIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center space-x-3 mb-6"
            >
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <span className="text-white font-bold text-xl">{profile?.nickname?.charAt(0) || 'W'}</span>
                </div>
                <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl blur opacity-30" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
                {profile?.nickname || (language === 'en' ? 'My Website' : '我的网站')}
              </span>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-gray-400 mb-6 max-w-md leading-relaxed"
            >
              {profile?.bio || t('home.defaultBio')}
            </motion.p>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex space-x-3"
            >
              {[
                { icon: Github, href: profile?.github || 'https://github.com', label: 'GitHub' },
                { icon: Twitter, href: profile?.twitter || 'https://twitter.com', label: 'Twitter' },
                { icon: Linkedin, href: profile?.linkedin || 'https://linkedin.com', label: 'LinkedIn' },
                { icon: Mail, href: profile?.emailPublic ? `mailto:${profile.emailPublic}` : 'mailto:hello@example.com', label: 'Email' },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.15, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-indigo-500/50 text-gray-400 hover:text-white transition-all duration-300"
                  title={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section, sectionIndex) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * (sectionIndex + 1) }}
            >
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link, index) => (
                  <li key={index}>
                    {link.path ? (
                      <Link
                        to={link.path}
                        className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                      >
                        <span>{link.label}</span>
                        <span className="ml-1 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-gray-400 hover:text-white transition-colors inline-flex items-center group"
                      >
                        <span>{link.label}</span>
                        {link.external && (
                          <ExternalLink className="w-3 h-3 ml-1 opacity-50 group-hover:opacity-100 transition-opacity" />
                        )}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent mb-8" />

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-center text-gray-500 text-sm"
        >
          <p className="flex items-center mb-4 md:mb-0">
            <span>© {currentYear}</span>
            <span className="mx-2">·</span>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 font-medium">
              {profile?.nickname || (language === 'en' ? 'My Website' : '我的网站')}
            </span>
            <span className="mx-2">·</span>
            <span>{t('footer.rights')}</span>
          </p>

          <p className="flex items-center">
            <span>{t('footer.madeWith')}</span>
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="inline-block mx-1"
            >
              <Heart className="w-4 h-4 text-red-500 fill-red-500" />
            </motion.span>
            <span>{t('footer.and')}</span>
            <Coffee className="w-4 h-4 mx-1 text-amber-500" />
            <span>{t('footer.using')}</span>
            <span className="ml-1 text-indigo-400">React</span>
            <span className="mx-1">+</span>
            <span className="text-purple-400">Tailwind</span>
          </p>
        </motion.div>
      </div>

      {/* Scroll to top button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 p-3 rounded-full text-white hover:shadow-xl transition-shadow z-50"
        style={{ background: 'var(--theme-gradient)', boxShadow: 'var(--theme-shadow)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </motion.button>
    </footer>
  )
}