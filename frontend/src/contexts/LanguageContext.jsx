import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    // 从 localStorage 读取语言设置，默认中文
    const saved = localStorage.getItem('language')
    return saved || 'zh'
  })

  useEffect(() => {
    // 保存语言设置到 localStorage
    localStorage.setItem('language', language)
    // 设置 HTML lang 属性
    document.documentElement.lang = language
  }, [language])

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'zh' ? 'en' : 'zh')
  }

  const value = {
    language,
    setLanguage,
    toggleLanguage,
    isZh: language === 'zh',
    isEn: language === 'en'
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}