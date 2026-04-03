import { useState, useCallback } from 'react'
import MDEditor from '@uiw/react-md-editor'
import {
  Bold, Italic, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Code, Link2,
  Image, Table, Minus, Eye, EyeOff, Maximize2, Minimize2
} from 'lucide-react'

export default function RichTextEditor({ value, onChange, height = 500 }) {
  const [preview, setPreview] = useState('edit') // 'edit' | 'live' | 'preview'
  const [fullscreen, setFullscreen] = useState(false)

  const handleCommand = useCallback((command) => {
    const textarea = document.querySelector('.w-md-editor-text-input')
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)

    let newText = ''
    let cursorOffset = 0

    switch (command) {
      case 'bold':
        newText = `**${selectedText || '粗体文本'}**`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'italic':
        newText = `*${selectedText || '斜体文本'}*`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'h1':
        newText = `\n# ${selectedText || '标题1'}\n`
        cursorOffset = selectedText ? 0 : 3
        break
      case 'h2':
        newText = `\n## ${selectedText || '标题2'}\n`
        cursorOffset = selectedText ? 0 : 3
        break
      case 'h3':
        newText = `\n### ${selectedText || '标题3'}\n`
        cursorOffset = selectedText ? 0 : 3
        break
      case 'ul':
        newText = `\n- ${selectedText || '列表项'}\n`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'ol':
        newText = `\n1. ${selectedText || '列表项'}\n`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'quote':
        newText = `\n> ${selectedText || '引用内容'}\n`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'code':
        newText = selectedText.includes('\n')
          ? `\n\`\`\`\n${selectedText || '代码块'}\n\`\`\`\n`
          : `\`${selectedText || '代码'}\``
        cursorOffset = selectedText ? 0 : 3
        break
      case 'link':
        newText = `[${selectedText || '链接文本'}](url)`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'image':
        newText = `![${selectedText || '图片描述'}](url)`
        cursorOffset = selectedText ? 0 : 4
        break
      case 'table':
        newText = `\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n`
        break
      case 'hr':
        newText = `\n---\n`
        break
      default:
        return
    }

    const newValue = value.substring(0, start) + newText + value.substring(end)
    onChange(newValue)

    // 设置光标位置
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + newText.length - cursorOffset
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const toolbarItems = [
    { command: 'bold', icon: Bold, title: '粗体 (Ctrl+B)' },
    { command: 'italic', icon: Italic, title: '斜体 (Ctrl+I)' },
    { command: 'h1', icon: Heading1, title: '标题1' },
    { command: 'h2', icon: Heading2, title: '标题2' },
    { command: 'h3', icon: Heading3, title: '标题3' },
    { command: 'ul', icon: List, title: '无序列表' },
    { command: 'ol', icon: ListOrdered, title: '有序列表' },
    { command: 'quote', icon: Quote, title: '引用' },
    { command: 'code', icon: Code, title: '代码块' },
    { command: 'link', icon: Link2, title: '链接' },
    { command: 'image', icon: Image, title: '图片' },
    { command: 'table', icon: Table, title: '表格' },
    { command: 'hr', icon: Minus, title: '分割线' },
  ]

  return (
    <div className={`rich-text-editor ${fullscreen ? 'fixed inset-0 z-50 bg-white' : ''}`}>
      {/* Custom Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border border-gray-200 rounded-t-xl border-b-0">
        {toolbarItems.map(({ command, icon: Icon, title }) => (
          <button
            key={command}
            type="button"
            onClick={() => handleCommand(command)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
            title={title}
          >
            <Icon className="w-4 h-4" />
          </button>
        ))}

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Preview toggle */}
        <button
          type="button"
          onClick={() => setPreview(preview === 'edit' ? 'live' : 'edit')}
          className={`p-2 rounded-lg transition-colors ${preview === 'live' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200 text-gray-600'}`}
          title={preview === 'live' ? '隐藏预览' : '显示预览'}
        >
          {preview === 'live' ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
        </button>

        <button
          type="button"
          onClick={() => setPreview('preview')}
          className={`p-2 rounded-lg transition-colors ${preview === 'preview' ? 'bg-purple-100 text-purple-600' : 'hover:bg-gray-200 text-gray-600'}`}
          title="仅预览"
        >
          <Eye className="w-4 h-4" />
        </button>

        <div className="w-px h-6 bg-gray-300 mx-2" />

        {/* Fullscreen toggle */}
        <button
          type="button"
          onClick={() => setFullscreen(!fullscreen)}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors text-gray-600 hover:text-gray-900"
          title={fullscreen ? '退出全屏' : '全屏编辑'}
        >
          {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Editor */}
      <div className="border border-gray-200 rounded-b-xl overflow-hidden" style={{ height: fullscreen ? 'calc(100vh - 60px)' : height }}>
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          preview={preview}
          hideToolbar
          height={fullscreen ? '100%' : height}
          style={{
            height: '100%',
            backgroundColor: 'white'
          }}
          textareaProps={{
            placeholder: '开始编写您的内容...\n\n支持的格式：\n- **粗体** 和 *斜体*\n- # 标题\n- [链接](url)\n- ![图片](url)\n- `代码` 和代码块\n- 列表和引用',
          }}
        />
      </div>

      {/* Quick Help */}
      <div className="mt-2 text-xs text-gray-400 flex flex-wrap gap-3">
        <span>💡 快捷键：</span>
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+B</kbd> 粗体</span>
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+I</kbd> 斜体</span>
        <span><kbd className="px-1 py-0.5 bg-gray-100 rounded">Ctrl+K</kbd> 链接</span>
      </div>
    </div>
  )
}