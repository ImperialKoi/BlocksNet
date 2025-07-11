"use client"

import React, { useState } from "react"
import { Handle, Position, NodeProps } from "reactflow"

interface Payload {
  classes: string[]
}

interface ClassifierBlockProps extends NodeProps {
  data: {
    label: string
  }
}

const ClassifierBlock: React.FC<ClassifierBlockProps> = ({
  data,
  isConnectable,
}) => {
  const [blockName, setBlockName] = useState("")
  const [loading, setLoading] = useState(false)

  async function setupClasses(payload: Payload) {
    setLoading(true)
    try {
      const response = await fetch("/api/setup_dataset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start training")
      }

      // clear on success
      setBlockName("")
    } catch (err) {
      console.error("Error starting training:", err)
    } finally {
      setLoading(false)
    }
  }

  function parseList(input: string): string[] {
    return input
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)
  }

  return (
    <div className="relative p-4 border-2 border-gray-300 rounded-lg bg-[#966b1b] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">{data.label}</div>

      <div className="bg-[#1a2535] bg-opacity-60 rounded p-2 mb-4">
        <div className="flex items-center">
          <div className="text-xs text-gray-400 mr-2">Classes:</div>
          <input
            type="text"
            value={blockName}
            onChange={(e) => setBlockName(e.target.value)}
            className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
            onClick={(e) => e.stopPropagation()}
            placeholder="e.g. Cats, Birds, Dogs"
          />
        </div>
      </div>

      <button
        onClick={() =>
          setupClasses({ classes: parseList(blockName) })
        }
        disabled={loading || !blockName.trim()}
        className={`w-full text-white font-medium py-2 px-4 rounded-lg transition-colors ${
          loading
            ? "bg-orange-300 cursor-not-allowed"
            : "bg-orange-500 hover:bg-orange-600 bg-opacity-60"
        }`}
      >
        {loading ? "Submitting…" : "Submit"}
      </button>
    </div>
  )
}

export default ClassifierBlock