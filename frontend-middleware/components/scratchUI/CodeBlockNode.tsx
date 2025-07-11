
import React, { useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

interface Parameter {
  name: string;
  type: string;
}

interface CodeBlockData {
  label: string;
  code: string;
  functionName: string;
  parameters: Parameter[];
  returnType: string;
}

const CodeBlockNode = ({ data, isConnectable }: NodeProps<CodeBlockData>) => {
  const [isQuery, setIsQuery] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [accessType, setAccessType] = useState("Public");
  
  // Ensure parameters is always an array, even if it's undefined in data
  const parameters = data.parameters || [];

  return (
    <div className="p-4 border-2 border-gray-300 rounded-lg bg-[#253040] shadow-lg min-w-[300px]">
      <div className="text-sm font-mono text-gray-300 mb-2">{data.label}</div>
      
      <div className="flex items-center mb-4">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-blue-400"
        />
        
        <div className="flex-grow flex items-center">
          <div className="text-sm font-mono text-white">{data.functionName}(</div>
          {parameters.map((param, index) => (
            <div key={index} className="ml-2 text-sm font-mono text-blue-300">
              {param.name}
              <span className="text-white ml-1">:</span>
              <span className="text-green-300 ml-1">{param.type}</span>
              {index < parameters.length - 1 && <span className="text-white ml-1">,</span>}
            </div>
          ))}
          <div className="text-sm font-mono text-white ml-2">)</div>
        </div>
        
        <div className="flex items-center">
          <div className="text-sm font-mono text-white mr-2">→</div>
          <div className="text-sm font-mono text-green-300 mr-4">{data.returnType}</div>
        </div>
        
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          className="w-3 h-3 bg-green-400"
        />
      </div>
      
      <div className="bg-[#1a2535] rounded p-2 mb-4">
        <pre className="text-xs font-mono text-white whitespace-pre-wrap overflow-auto max-h-[150px]">
          {data.code}
        </pre>
      </div>
      
      <div className="flex justify-between">
        <div className="flex flex-col">
          <div className="mb-2">
            <select
              value={accessType}
              onChange={(e) => setAccessType(e.target.value)}
              className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1"
            >
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Internal">Internal</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <input 
              type="checkbox" 
              id={`query-${data.functionName}`}
              checked={isQuery}
              onChange={() => setIsQuery(!isQuery)}
              className="mr-2" 
            />
            <label htmlFor={`query-${data.functionName}`} className="text-xs text-white">Query</label>
          </div>
          
          <div className="flex items-center mt-1">
            <input 
              type="checkbox" 
              id={`advanced-${data.functionName}`}
              checked={showAdvanced}
              onChange={() => setShowAdvanced(!showAdvanced)}
              className="mr-2" 
            />
            <label htmlFor={`advanced-${data.functionName}`} className="text-xs text-white">Advanced</label>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="text-xs text-gray-400 mb-1">Parameters</div>
          {parameters.map((param, index) => (
            <div key={index} className="flex items-center mb-1">
              <input 
                type="text" 
                value={param.name}
                readOnly
                className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1 w-24 mr-2" 
              />
              <select
                value={param.type}
                onChange={(e) => {
                  // This would be updated in a real implementation
                  console.log(`Changed param ${param.name} type to ${e.target.value}`);
                }}
                className="bg-[#1a2535] border border-gray-600 text-white text-xs rounded px-2 py-1"
              >
                <option value="Nat">Nat</option>
                <option value="Bool">Bool</option>
                <option value="Text">Text</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeBlockNode;
