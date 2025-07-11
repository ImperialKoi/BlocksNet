"use client"

import type React from "react"
import { Handle, Position } from "reactflow"

interface HiddenBlockProps {
  id: string
  data: {
    label: string
    sizeIn: number
    sizeOut: number
    activation: string
    sequenceIndex: number
    onChange: (id: string, param: string, value: any) => void
    id: string
  }
  isConnectable: boolean
}

const HiddenBlock: React.FC<HiddenBlockProps> = ({ id, data, isConnectable }) => {
  const handleInChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      data.onChange(data.id, "sizeIn", value)
    }
  }

  const handleOutChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      data.onChange(data.id, "sizeOut", value)
      // The parent component will handle propagation to the next block in sequence
    }
  }

  const handleActivationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    data.onChange(data.id, "activation", e.target.value)
  }

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#0e8a86] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">
        {data.label} (Sequence: {data.sequenceIndex + 1})
      </div>

      <div className="flex items-center mb-4">
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-400" />

        <div className="flex-grow flex items-center">
          <div className="text-sm font-mono text-white">Linear(</div>
          <span className="text-sm text-green-300">⠀**</span>
          <span className="text-sm text-blue-300">kwargs</span>
          <div className="text-sm font-mono text-white ml-2">)</div>
        </div>

        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-green-400"
        />
      </div>

      <div className="bg-[#1a2535] bg-opacity-60 rounded p-2 mb-4">
        <div className="flex items-center mb-2">
          <div className="text-xs text-gray-400 mr-2 w-24">Input Dimensions:</div>
          <input
            type="number"
            value={data.sizeIn}
            onChange={handleInChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            min={1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center mb-2">
          <div className="text-xs text-gray-400 mr-2 w-24">Output Dimensions:</div>
          <input
            type="number"
            value={data.sizeOut}
            onChange={handleOutChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            min={1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center">
          <div className="text-xs text-gray-400 mr-2 w-24">Activation:</div>
          <select
            value={data.activation}
            onChange={handleActivationChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default HiddenBlock