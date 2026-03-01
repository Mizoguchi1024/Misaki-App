import { useSettingsStore } from '@renderer/store/settingsStore'
import clsx from 'clsx'
import React, { useRef } from 'react'

export default function GlassBox({ children, className = '', ...rest }): React.JSX.Element {
  const { borderRadius } = useSettingsStore()
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
      className={clsx(
        `group overflow-hidden flex flex-col items-center justify-center
        px-12 py-10 backdrop-blur-sm hover:backdrop-blur-md bg-white/20 border-white
         dark:bg-white/12 dark:border-white/16 border-2
         shadow-2xl shadow-black/20 dark:inset-shadow-[0_0_6px_rgba(255,255,255,0.25)] dark:text-shadow-[0_0_6px_rgb(0,0,0,0.5)]
         ease-in-out duration-500`,
        className
      )}
      style={{ borderRadius: borderRadius * 2 }}
      {...rest}
    >
      <div
        className="
          pointer-events-none absolute -translate-x-1/2 -translate-y-1/2
          w-125 h-125 rounded-full
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
