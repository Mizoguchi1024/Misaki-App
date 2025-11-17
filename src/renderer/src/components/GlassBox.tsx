import React from 'react'

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
}

export default function GlassBox({
  children,
  className = '',
  ...rest
}: BoxProps): React.JSX.Element {
  return (
    <div
      className={`flex flex-col items-center justify-center px-12 py-10 rounded-4xl backdrop-blur-md bg-linear-to-br from-white/8 to-white/16 border-white/20 border shadow-md shadow-neutral-500/50 ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}
