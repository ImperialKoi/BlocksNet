"use client"

import type React from "react"

interface ContextMenuProps {
  x: number
  y: number
  onClose: () => void
  onAddNode: (type: string) => void
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, onClose, onAddNode }) => {
  const menuStyle = {
    top: y,
    left: x,
  }

  const nodeTypes = [
    { type: "startBlock", label: "Start Block" },
    { type: "convolutionalBlock", label: "Convolutional Layer" },
    { type: "poolingBlock", label: "Pooling Layer" },
    { type: "inputBlock", label: "Input Layer" },
    { type: "hiddenBlock", label: "Hidden Layer" },
    { type: "outputBlock", label: "Output Layer" },
    { type: "trainingBlock", label: "Training Block" }
  ]

  return (
    <div
      className="fixed z-10 bg-[#1e2530] border border-gray-700 rounded-md shadow-lg p-2 min-w-[180px]"
      style={menuStyle}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="text-white text-xs font-semibold mb-2 pb-1 border-b border-gray-700">ADD NODE</div>
      {nodeTypes.map((node) => (
        <div
          key={node.type}
          className="text-white text-sm py-1 px-2 hover:bg-blue-600 rounded cursor-pointer"
          onClick={() => onAddNode(node.type)}
        >
          {node.label}
        </div>
      ))}
      <div className="border-t border-gray-700 mt-2 pt-1">
        <div className="text-white text-sm py-1 px-2 hover:bg-red-600 rounded cursor-pointer" onClick={onClose}>
          Cancel
        </div>
      </div>
    </div>
  )
}

export default ContextMenu