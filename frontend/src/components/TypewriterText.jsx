import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function TypewriterText({ 
  texts = [], 
  speed = 100, 
  deleteSpeed = 50, 
  pauseTime = 2000,
  className = ''
}) {
  const [displayText, setDisplayText] = useState('')
  const [textIndex, setTextIndex] = useState(0)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    if (texts.length === 0) return

    const currentText = texts[textIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        // 打字
        if (displayText.length < currentText.length) {
          setDisplayText(currentText.slice(0, displayText.length + 1))
        } else {
          // 完成打字，暂停后开始删除
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        // 删除
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1))
        } else {
          // 删除完成，切换到下一个文本
          setIsDeleting(false)
          setTextIndex((prev) => (prev + 1) % texts.length)
        }
      }
    }, isDeleting ? deleteSpeed : speed)

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, textIndex, texts, speed, deleteSpeed, pauseTime])

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity, repeatType: 'reverse' }}
        className="inline-block w-0.5 h-[1em] ml-1 bg-current align-middle"
      />
    </span>
  )
}