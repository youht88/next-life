import { Handle, NodeResizer, NodeToolbar, Position } from '@xyflow/react';
import { memo } from 'react';
 
const CustomNode = ({ data }:any) => {
  return (
    <>
      <NodeResizer minWidth={100} />
      <NodeToolbar isVisible={data.toolbarVisible} position={data.toolbarPosition} className="flex flex-row gap-2">
        <button>delete</button>
        <button>copy</button>
        <button>expand</button>
      </NodeToolbar>
 
      <div className="border border-red-400 bg-yellow-400 p-4">
        {data.label}
      </div>
 
      <Handle type="target" position={Position.Left} />
      <Handle type="target" position={Position.Bottom} />
      <Handle type="source" position={Position.Right} />
    </>
  );
};
 
export default memo(CustomNode);