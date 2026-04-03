import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)
const API_BASE = 'http://localhost:8080'

// 调整颜色亮度
function adjustBrightness(hex, percent) {
  hex = hex.replace('#', '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)
  
  r = Math.min(255, Math.max(0, Math.floor(r * (1 + percent / 100))))
  g = Math.min(255, Math.max(0, Math.floor(g * (1 + percent / 100))))
  b = Math.min(255, Math.max(0, Math.floor(b * (1 + percent / 100))))
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

// 预设主题
const PRESET_THEMES = {
  'purple-pink': {
    name: '紫粉渐变',
    primary: '#8B5CF6',
    secondary: '#EC4899',
    accent: '#F59E0B',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  'blue-cyan': {
    name: '蓝青清新',
    primary: '#3B82F6',
    secondary: '#06B6D4',
    accent: '#10B981',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #0e7490 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  'green-teal': {
    name: '绿松自然',
    primary: '#10B981',
    secondary: '#14B8A6',
    accent: '#F59E0B',
    background: 'linear-gradient(135deg, #047857 0%, #0d9488 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  'orange-red': {
    name: '橙红热情',
    primary: '#F97316',
    secondary: '#EF4444',
    accent: '#FBBF24',
    background: 'linear-gradient(135deg, #c2410c 0%, #dc2626 100%)',
    cardBg: 'rgba(255, 255, 255, 0.1)',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
  },
  'dark-purple': {
    name: '暗黑紫夜',
    primary: '#8B5CF6',
    secondary: '#A855F7',
    accent: '#FBBF24',
    background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
    cardBg: 'rgba(255, 255, 255, 0.05)',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
  },
  'minimal': {
    name: '极简白',
    primary: '#3B82F6',
    secondary: '#6366F1',
    accent: '#F59E0B',
    background: '#FFFFFF',
    cardBg: 'rgba(0, 0, 0, 0.02)',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
  },
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('purple-pink')
  const [customTheme, setCustomTheme] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // 从后端加载主题
  useEffect(() => {
    const loadTheme = async () => {
      try {
        // 先检查 localStorage
        const savedTheme = localStorage.getItem('website-theme')
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme)
          if (parsed.preset) {
            setCurrentTheme(parsed.preset)
          } else if (parsed.custom) {
            setCustomTheme(parsed.custom)
          }
        }
        
        // 然后尝试从后端加载
        const res = await fetch(`${API_BASE}/api/public/theme`)
        if (res.ok) {
          const data = await res.json()
          console.log('Theme loaded from backend:', data)
          if (data.preset) {
            setCurrentTheme(data.preset)
            setCustomTheme(null)
          } else if (data.custom) {
            setCustomTheme(data.custom)
          }
          // 同步到 localStorage
          localStorage.setItem('website-theme', JSON.stringify(data))
        }
      } catch (e) {
        console.error('Failed to load theme from backend:', e)
      } finally {
        setLoaded(true)
      }
    }
    loadTheme()
  }, [])

  // 应用主题到 CSS 变量
  useEffect(() => {
    const theme = customTheme || PRESET_THEMES[currentTheme]
    if (!theme) return

    console.log('Applying theme:', currentTheme, customTheme ? '(custom)' : '', theme)
    
    const root = document.documentElement
    
    // 主要颜色
    root.style.setProperty('--theme-primary', theme.primary)
    root.style.setProperty('--theme-secondary', theme.secondary)
    root.style.setProperty('--theme-accent', theme.accent)
    
    // 文本颜色
    root.style.setProperty('--theme-text-primary', theme.textPrimary)
    root.style.setProperty('--theme-text-secondary', theme.textSecondary)
    
    // 背景和卡片
    root.style.setProperty('--theme-bg', theme.background)
    root.style.setProperty('--theme-card-bg', theme.cardBg)
    
    // 渐变
    root.style.setProperty('--theme-gradient', `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`)
    root.style.setProperty('--theme-gradient-text', `linear-gradient(90deg, ${theme.primary}, ${theme.secondary}, ${theme.accent})`)
    root.style.setProperty('--theme-gradient-hover', `linear-gradient(135deg, ${adjustBrightness(theme.primary, -15)}, ${adjustBrightness(theme.secondary, -15)})`)
    
    // 阴影
    root.style.setProperty('--theme-shadow', `0 10px 30px -10px ${theme.primary}40`)
    root.style.setProperty('--theme-shadow-lg', `0 20px 50px -15px ${theme.primary}50`)
    
    // 更新 body data 属性，用于 CSS 选择器
    root.setAttribute('data-theme', currentTheme)
    if (customTheme) {
      root.setAttribute('data-custom-theme', 'true')
    } else {
      root.removeAttribute('data-custom-theme')
    }
    
    console.log('Theme applied! Primary:', theme.primary)
  }, [currentTheme, customTheme])

  const setTheme = (themeKey) => {
    setCurrentTheme(themeKey)
    setCustomTheme(null)
    localStorage.setItem('website-theme', JSON.stringify({ preset: themeKey }))
  }

  const setCustomThemeConfig = (theme) => {
    setCustomTheme(theme)
    localStorage.setItem('website-theme', JSON.stringify({ custom: theme }))
  }

  const getActiveTheme = () => {
    return customTheme || PRESET_THEMES[currentTheme]
  }

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      customTheme,
      presetThemes: PRESET_THEMES,
      setTheme,
      setCustomTheme: setCustomThemeConfig,
      getActiveTheme,
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}