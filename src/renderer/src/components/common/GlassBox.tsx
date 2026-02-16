import { useSettingsStore } from '@renderer/store/settingsStore'
import React, { useRef } from 'react'

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export default function GlassBox({
  children,
  className = '',
  ...rest
}: BoxProps): React.JSX.Element {
  const ref = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent): void => {
    const div = ref.current
    if (!div) return

    const rect = div.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    div.style.setProperty('--x', `${x}px`)
    div.style.setProperty('--y', `${y}px`)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={`group overflow-hidden flex flex-col items-center justify-center
        px-12 py-10 rounded-4xl backdrop-blur-sm bg-white/20 border-white
         dark:bg-white/10 dark:border-white/16 border-2
         shadow-2xl shadow-black/20 dark:shadow-none
         ${className}`}
      {...rest}
    >
      <div
        className="
          pointer-events-none absolute -translate-x-1/2 -translate-y-1/2
          w-[500px] h-[500px] rounded-full
          bg-black/4 dark:bg-white/8 blur-3xl opacity-0 scale-50
          transition duration-250 ease-in-out
          group-hover:opacity-100 group-hover:scale-100
        "
        style={{
          left: 'var(--x)',
          top: 'var(--y)'
        }}
      />
      {children}
    </div>
  )
}
