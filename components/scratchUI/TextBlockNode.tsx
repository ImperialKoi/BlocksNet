
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface TextBlockData {
  label: string;
  value: string;
  fieldName: string;
}

const TextBlockNode = ({ data, isConnectable }: NodeProps<TextBlockData>) => {
  const [value, setValue] = useState(data.value);
  const [isStable, setIsStable] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#253040] shadow-lg min-w-[200px]">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400"
      />
      
      <div className="font-mono text-white">
        <div className="text-sm mb-2">{data.label}</div>
        
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
          <div className="text-sm text-gray-300">{data.fieldName}</div>
        </div>
        
        <div className="mb-3">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-[#1a2535] border border-gray-600 rounded px-2 py-1 text-white"
          />
        </div>
        
        <div className="text-xs text-gray-400 mb-1">Initial value</div>
        
        <div className="flex items-center mb-2">
          <input 
            type="checkbox" 
            id={`stable-${data.fieldName}`}
            checked={isStable}
            onChange={() => setIsStable(!isStable)}
            className="mr-2"
          />
          <label htmlFor={`stable-${data.fieldName}`} className="text-xs">Stable</label>
        </div>
        
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id={`advanced-${data.fieldName}`}
            checked={showAdvanced}
            onChange={() => setShowAdvanced(!showAdvanced)}
            className="mr-2" 
          />
          <label htmlFor={`advanced-${data.fieldName}`} className="text-xs">Advanced</label>
        </div>
      </div>
      
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-green-400"
      />
    </div>
  );
};

export default TextBlockNode;