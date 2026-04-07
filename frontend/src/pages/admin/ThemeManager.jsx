import { useState, useEffect } from 'react'
import { Palette, Check, Loader, Sparkles, RotateCcw, Eye } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'

const API_BASE = 'http://localhost:8080'

export default function ThemeManager() {
  const { 
    currentTheme, 
    customTheme, 
    presetThemes, 
    setTheme, 
    setCustomTheme,
    getActiveTheme 
  } = useTheme()
  
  const token = localStorage.getItem('token')
  const [saving, setSaving] = useState(false)
  const [previewTheme, setPreviewTheme] = useState(null)

  const activeTheme = previewTheme || getActiveTheme()

  const handlePresetSelect = (key) => {
    setTheme(key)  // 这会自动更新 localStorage 和 CSS 变量
    setPreviewTheme(null)
  }

  const handleColorChange = (key, color) => {
    const baseTheme = getActiveTheme()
    const newTheme = { ...baseTheme, [key]: color }
    setCustomTheme(newTheme)  // 这会自动更新 localStorage 和 CSS 变量
    setPreviewTheme(newTheme)
  }

  const handleSaveToBackend = async () => {
    setSaving(true)
    try {
      const themeData = customTheme ? { custom: customTheme } : { preset: currentTheme }
      
      console.log('Saving theme to backend:', themeData)
      
      const res = await fetch(`${API_BASE}/api/admin/theme`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(themeData)
      })
      
      if (res.ok) {
        const data = await res.json()
        console.log('Theme saved successfully:', data)
        alert('主题配置已保存到服务器')
      } else {
        const error = await res.text()
        console.error('Save failed:', error)
        alert('保存失败: ' + error)
      }
    } catch (err) {
      console.error('保存主题失败:', err)
      alert('保存失败: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleReset = () => {
    setTheme('purple-pink')
    setPreviewTheme(null)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Palette className="w-7 h-7" style={{ color: 'var(--theme-primary)' }} />
            主题管理
          </h1>
          <p className="text-gray-500 text-sm mt-1">自定义网站颜色和样式</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 flex items-center gap-2 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleSaveToBackend}
            disabled={saving}
            className="px-4 py-2 text-white rounded-xl flex items-center gap-2 transition-all disabled:opacity-50"
            style={{ background: 'var(--theme-gradient)', boxShadow: 'var(--theme-shadow)' }}
          >
            {saving ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                保存配置
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Preset Themes */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">预设主题</h2>
            <div className="space-y-3">
              {Object.entries(presetThemes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handlePresetSelect(key)}
                  className={`w-full p-3 rounded-xl border-2 transition-all ${
                    currentTheme === key && !customTheme
                      ? 'bg-opacity-10'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  style={currentTheme === key && !customTheme ? {
                    borderColor: 'var(--theme-primary)',
                    backgroundColor: 'color-mix(in srgb, var(--theme-primary) 5%, white)'
                  } : {}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-lg"
                        style={{ background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})` }}
                      />
                      <span className="font-medium text-gray-900">{theme.name}</span>
                    </div>
                    {currentTheme === key && !customTheme && (
                      <Check className="w-5 h-5" style={{ color: 'var(--theme-primary)' }} />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Center: Color Customization */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">颜色自定义</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">主色调</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activeTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={activeTheme.primary}
                    onChange={(e) => handleColorChange('primary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">次要色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activeTheme.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={activeTheme.secondary}
                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">强调色</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={activeTheme.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-200"
                  />
                  <input
                    type="text"
                    value={activeTheme.accent}
                    onChange={(e) => handleColorChange('accent', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  💡 提示：修改颜色后会自动创建自定义主题
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">实时预览</h2>
              <Eye className="w-5 h-5 text-gray-400" />
            </div>
            
            <div 
              className="rounded-xl p-4 min-h-[300px] relative overflow-hidden"
              style={{ 
                background: activeTheme.background,
                color: activeTheme.textPrimary
              }}
            >
              {/* Preview Content */}
              <div className="relative z-10">
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                >
                  <Sparkles className="w-8 h-8 text-white" />
                </div>

                <h3 
                  className="text-xl font-bold mb-2"
                  style={{ color: activeTheme.textPrimary }}
                >
                  网站标题
                </h3>
                <p 
                  className="text-sm mb-4"
                  style={{ color: activeTheme.textSecondary }}
                >
                  这是一个主题预览示例，展示您选择的效果
                </p>

                <div className="flex gap-2 mb-4">
                  <button 
                    className="px-4 py-2 rounded-lg text-white font-medium"
                    style={{ background: `linear-gradient(135deg, ${activeTheme.primary}, ${activeTheme.secondary})` }}
                  >
                    主要按钮
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg border font-medium"
                    style={{ 
                      borderColor: activeTheme.primary,
                      color: activeTheme.primary
                    }}
                  >
                    次要按钮
                  </button>
                </div>

                <div 
                  className="rounded-lg p-3"
                  style={{ backgroundColor: activeTheme.cardBg }}
                >
                  <div className="flex items-center gap-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: activeTheme.accent }}
                    />
                    <span className="text-sm">状态指示器</span>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div 
                className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20"
                style={{ backgroundColor: activeTheme.secondary }}
              />
              <div 
                className="absolute -bottom-10 -left-10 w-24 h-24 rounded-full opacity-20"
                style={{ backgroundColor: activeTheme.primary }}
              />
            </div>

            {customTheme && (
              <div 
                className="mt-3 p-2 rounded-lg"
                style={{ 
                  backgroundColor: 'color-mix(in srgb, var(--theme-primary) 5%, white)',
                  color: 'var(--theme-primary)'
                }}
              >
                <p className="text-xs">
                  ✓ 当前使用自定义主题
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Additional Settings */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">附加设置</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">背景样式</label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="gradient">渐变背景</option>
              <option value="solid">纯色背景</option>
              <option value="image">图片背景</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">圆角大小</label>
            <select className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
              <option value="small">小圆角 (8px)</option>
              <option value="medium">中圆角 (12px)</option>
              <option value="large">大圆角 (16px)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}