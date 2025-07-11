import type React from "react"

interface BaseBlockProps {
  data: {
    label: string
    className?: string
    children?: React.ReactNode
  }
  isConnectable: boolean
}

const BaseBlock: React.FC<BaseBlockProps> = ({ data, isConnectable }) => {
  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#253040] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">{data.label}</div>
      {data.children}
    </div>
  )
}

export default BaseBlock