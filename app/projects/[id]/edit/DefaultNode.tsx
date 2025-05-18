"use client"

import { Handle, Position } from "reactflow"
import { AlertCircle } from "lucide-react"

export default function DefaultNode({ data, selected }) {
  // Extract the node type from data if available
  const nodeType = data?.type || "Unknown Node Type"

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 ${selected ? "border-red-500" : "border-gray-200"} w-64`}>
      <div className="bg-red-500 text-white p-2 rounded-t-lg flex items-center">
        <AlertCircle size={16} className="mr-2" />
        <div className="font-bold">Unknown Node Type</div>
      </div>

      <div className="p-3">
        <div className="text-sm text-center text-red-600">
          <p>This node type "{nodeType}" is not recognized.</p>
          <p className="mt-1">Please check your node configuration.</p>
        </div>

        <div className="mt-3 text-xs text-gray-500">
          <div>Node ID: {data?.id || "unknown"}</div>
          {data && (
            <div className="mt-1">
              Properties:{" "}
              {Object.keys(data)
                .filter((key) => key !== "onChange")
                .join(", ")}
            </div>
          )}
        </div>
      </div>

      {/* Add handles on both sides to allow connections */}
      <Handle type="target" position={Position.Left} style={{ background: "#555" }} id="in" />
      <Handle type="source" position={Position.Right} style={{ background: "#555" }} id="out" />
    </div>
  )
}