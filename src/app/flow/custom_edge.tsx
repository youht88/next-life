import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow
} from '@xyflow/react';
   
type props = {
  id: any
  sourceX: any
  sourceY: any
  targetX: any
  targetY: any
}

export default function CustomEdge({ id, sourceX, sourceY, targetX, targetY } : props) {
    const { setEdges } = useReactFlow();
    const [edgePath,labelX,labelY] = getBezierPath({
      sourceX,
      sourceY,
      targetX,
      targetY,
    });
   
    return (
      <>
        <BaseEdge id={id} path={edgePath} />
        <EdgeLabelRenderer>
        <button
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
          onClick={() => {
            setEdges((es) => es.filter((e) => e.id !== id));
          }}
        >
            delete
        </button>
        </EdgeLabelRenderer>
      </>
    );
  }