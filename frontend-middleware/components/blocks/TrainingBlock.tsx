"use client"

import { Handle, Position } from "reactflow"

interface TrainingBlockNodeProps {
  id: string
  data: {
    label: string
    id: string
    epochs: number
    learningRate?: number
    optimizer?: string
    shuffle?: boolean
    onChange: (id: string, param: string, value: any) => void
  }
  isConnectable?: boolean
  selected?: boolean
}

function TrainingBlockNode({ id, data, isConnectable = true, selected }: TrainingBlockNodeProps) {
  // Initialize with data values or defaults
  const learningRate = data.learningRate || 0.001
  const optimizer = data.optimizer || "adam"
  const shuffle = data.shuffle || true

  return (
    <div
      className={`p-4 border-2 ${selected ? "border-blue-500" : "border-gray-300"} rounded-lg bg-[#940d1d] shadow-lg min-w-[300px]`}
    >
      <div className="text-sm font-mono text-gray-300 mb-2">{data.label}</div>

      <div className="flex items-center mb-4">
        <Handle type="target" position={Position.Left} isConnectable={isConnectable} className="w-3 h-3 bg-blue-400" />

        <div className="flex-grow flex items-center">
          <div className="text-sm font-mono text-white">Model.fit(</div>
          <div className="ml-2 text-sm font-mono text-blue-300">
            <span className="text-sm text-green-300">
              **
            </span>
            <span className="text-sm text-blue-300">
              kwargs
            </span>
          </div>
          <div className="text-sm font-mono text-white ml-2">)</div>
        </div>
      </div>

      <div className="bg-[#1a2535] bg-opacity-60 rounded p-2 mb-4">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center">
            <div className="text-xs text-gray-400 mr-2 w-24">Epochs:</div>
            <input
              type="number"
              defaultValue={data.epochs}
              onChange={(e) => {
                e.stopPropagation()
                const value = Number.parseInt(e.target.value)
                if (!isNaN(value)) {
                  data.onChange(data.id, "epochs", value || 1)
                }
              }}
              className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
              min={1}
              max={1000}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center">
            <div className="text-xs text-gray-400 mr-2 w-24">Learning Rate:</div>
            <input
              type="number"
              defaultValue={learningRate}
              onChange={(e) => {
                e.stopPropagation()
                const value = Number.parseFloat(e.target.value)
                if (!isNaN(value)) {
                  data.onChange(data.id, "learningRate", value || 0.001)
                }
              }}
              className="bg-[#1a2535] bg-opacity-60 border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
              min={0.0001}
              max={1}
              step={0.0001}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
            />
          </div>

          <div className="flex items-center">
            <div className="text-xs text-gray-400 mr-2 w-24">Optimizer:</div>
            <select
              defaultValue={optimizer}
              onChange={(e) => {
                e.stopPropagation()
                data.onChange(data.id, "optimizer", e.target.value)
              }}
              className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="adam">Adam</option>
              <option value="sgd">SGD</option>
              <option value="rmsprop">RMSprop</option>
              <option value="adagrad">Adagrad</option>
            </select>
          </div>

          <div className="flex items-center">
            <div className="text-xs text-gray-400 mr-2 w-24">Shuffle:</div>
            <select
              defaultValue={shuffle ? "true" : "false"}
              onChange={(e) => {
                e.stopPropagation()
                data.onChange(data.id, "shuffle", e.target.value === "true")
              }}
              className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 flex-grow nodrag"
              onClick={(e) => e.stopPropagation()}
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrainingBlockNode;