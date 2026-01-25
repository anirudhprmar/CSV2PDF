import { cn } from '~/lib/utils'
import React from 'react'

export default function Container({children,className}:{children:React.ReactNode,className?:string}) {
  return (
    <div className={cn("max-w-5xl w-full mx-auto px-4 md:px-8 relative z-10 ", className)}>
      {children}
    </div>
  )
}
