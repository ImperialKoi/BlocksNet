"use client"

import type React from "react"

import { useState } from "react"
import { Handle, Position } from "reactflow"

interface StartBlockProps {
  data: {
    label: string
  }
  isConnectable: boolean
}

const StartBlock: React.FC<StartBlockProps> = ({ data, isConnectable }) => {
  const [blockName, setBlockName] = useState("Start")

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#253040] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">{data.label}</div>

      <div className="flex items-center mb-4">
        <div className="flex-grow flex items-center">
          <div className="text-sm font-mono text-white">Network Entry Point</div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-green-400"
        />
      </div>

      <div className="bg-[#1a2535] rounded p-2 mb-4">
        <div className="flex items-center">
          <div className="text-xs text-gray-400 mr-2">Block Name:</div>
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  )
}

export default StartBlock