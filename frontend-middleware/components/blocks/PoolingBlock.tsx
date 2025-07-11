"use client"

import type React from "react"
import { Handle, Position } from "reactflow"

interface PoolingBlockProps {
  id: string
  data: {
    label: string
    size: number
    type: string
    stride: number
    channels: number // Just one channel parameter that passes through
    sequenceIndex: number
    onChange: (id: string, param: string, value: any) => void
    id: string
  }
  isConnectable: boolean
}

const PoolingBlock: React.FC<PoolingBlockProps> = ({ id, data, isConnectable }) => {
  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      data.onChange(data.id, "size", value)
    }
  }

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    data.onChange(data.id, "type", e.target.value)
  }

  const handleStridesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number.parseInt(e.target.value)
    if (!isNaN(value)) {
      data.onChange(data.id, "stride", value)
    }
  }

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#871083] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">
        {data.label} (Sequence: {data.sequenceIndex + 1})
      </div>

      <div className="flex items-center mb-4">
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-400" />

        <div className="flex-grow flex items-center">
          <div className="text-sm font-mono text-white">MaxPool2D(</div>
          <div className="ml-2 text-sm font-mono text-blue-300">
            <span className="text-sm text-green-300">**</span>
            <span className="text-sm text-blue-300">kwargs</span>
          </div>
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
          <div className="text-xs text-gray-400 mr-2 w-24">Channels:</div>
          <input
            type="number"
            value={data.channels}
            readOnly
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            min={1}
            onClick={(e) => e.stopPropagation()}
          />
          <div className="text-xs text-gray-500 ml-2">(pass-through)</div>
        </div>

        <div className="flex items-center mb-2">
          <div className="text-xs text-gray-400 mr-2 w-24">Pool Size:</div>
          <input
            type="number"
            value={data.size}
            onChange={handleSizeChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            min={1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center mb-2">
          <div className="text-xs text-gray-400 mr-2 w-24">Stride:</div>
          <input
            type="number"
            value={data.stride}
            onChange={handleStridesChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            min={1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          />
        </div>

        <div className="flex items-center">
          <div className="text-xs text-gray-400 mr-2 w-24">Pool Type:</div>
          <select
            value={data.type || "max"}
            onChange={handleTypeChange}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="max">Max Pooling</option>
            <option value="avg">Average Pooling</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default PoolingBlock