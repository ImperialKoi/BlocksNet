
import { Handle, Position, NodeProps } from 'reactflow';

interface BlockNodeData {
  label: string;
  value?: string;
}

const BlockNode = ({ data, isConnectable }: NodeProps<BlockNodeData>) => {
  return (
    <div className="px-4 py-2 border-2 border-gray-300 rounded-lg bg-[#253040] shadow-lg min-w-[150px]">
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
        className="w-3 h-3 bg-blue-400"
      />
      <div className="font-mono text-white">
        <div className="flex justify-between items-center">
          <div>{data.label}</div>
        </div>
        {data.value && (
          <div className="mt-1 px-2 py-1 bg-[#1a2535] rounded text-sm">
            {data.value}
          </div>
        )}
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

export default BlockNode;