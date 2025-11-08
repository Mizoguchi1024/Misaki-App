import React, { useState, useRef } from 'react'

export default function EditableTitle({
  initialTitle,
  onSave
}: {
  initialTitle: string
  onSave: (newTitle: string) => void
}): React.JSX.Element {
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(initialTitle)
  const inputRef = useRef<HTMLInputElement>(null)

  // 点击标题进入编辑模式
  const handleClick = (): void => {
    setIsEditing(true)
    // 延迟聚焦，等DOM更新完
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // 退出编辑并触发保存逻辑
  const finishEdit = (): void => {
    setIsEditing(false)
    if (title.trim() !== initialTitle.trim()) {
      onSave(title.trim()) // 发请求或触发回调
    }
  }

  // 监听键盘事件
  const handleKeyDown = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') finishEdit()
    if (e.key === 'Escape') {
      setTitle(initialTitle)
      setIsEditing(false)
    }
  }

  return (
    <>
      {isEditing ? (
        <input
          ref={inputRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={finishEdit}
          onKeyDown={handleKeyDown}
          className="border-none outline-none text-8xl font-semibold"
          style={{ width: `${title.length}ch` }}
        />
      ) : (
        <h1
          onClick={handleClick}
          className="cursor-pointer text-8xl font-semibold hover:bg-gray-200 rounded-xl"
        >
          {title}
        </h1>
      )}
    </>
  )
}
