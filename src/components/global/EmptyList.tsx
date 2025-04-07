import { cn } from '@/src/lib/utils'
import React from 'react'


const EmptyList = ({heading = 'No Items Found.', className}: {heading?:string, className?: string}) => {
  return (
    <h2 className={cn('text-xl', className)}>
        {heading}
    </h2>
  )
}

export default EmptyList
