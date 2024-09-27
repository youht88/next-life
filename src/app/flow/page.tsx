'use client'
import {
    addEdge,
    Background,
    BackgroundVariant,
    ControlButton,
    Controls,
    MarkerType,
    MiniMap,
    Panel,
    ReactFlow,
    useEdgesState,
    useNodesState
} from '@xyflow/react';
import { useCallback, useMemo } from 'react';

import '@xyflow/react/dist/style.css';
import CustomEdge from './custom_edge';
import CustomNode from './custom_node';

import { Blocks } from 'lucide-react';

const initialNodes = [
    { id: 'node-1', type: 'custom-node', position: { x: 200, y: 200 }, data: { label: 'node 1', value: 123 } },
    { id: 'node-2', position: { x: 100, y: 300 }, data: { label: 'node 2' } },
    { id: 'node-3', position: { x: 250, y: 350 }, data: { label: 'node 3' } },
];
const initialEdges = [
    { id: 'edge-1-2', source: 'node-1',  target: 'node-2' },
    {
        id: 'edge-1-3', type: 'custom-edge', source: 'node-1', target: 'node-3', animated: true,
        selected: true,
        label: "条件边",
        style: { stroke: '#FF0072', strokeWidth: 2, strokeDasharray: '5,5' },
        markerEnd: MarkerType.Arrow
    }
];

let id = 4
const setId = () => `${id++}`

export default function App() {
    const nodeTypes = useMemo(() => ({ 'custom-node': CustomNode }), []);
    const edgeTypes = { 'custom-edge': CustomEdge }

    const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const defaultEdgeOptions = {
        label: 'Edge Label',
        type: 'smoothstep',
        markerEnd: {
            type: MarkerType.ArrowClosed,
        },
        style: {
            strokeWidth: 1,
            color: "green"
        },
    };

    const onConnect = useCallback(
        (params: any) => setEdges((eds) => addEdge(params, eds)),
        [setEdges],
    );
    return (
        <div className="flex flex-col">

            <div style={{ width: '100vw', height: '100vh' }}>
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    defaultEdgeOptions={defaultEdgeOptions}
                    onConnect={onConnect}
                    nodeTypes={nodeTypes}
                    edgeTypes={edgeTypes}
                ><Panel position="top-left">top-left</Panel>
                    <Panel position="top-center">top-center</Panel>
                    <Panel position="top-right">top-right</Panel>
                    <Panel position="bottom-left">bottom-left</Panel>
                    <Panel position="bottom-center">bottom-center</Panel>
                    <Panel position="bottom-right">bottom-right</Panel>
                    <Controls>
                        <ControlButton onClick={() => {
                            const id = setId()
                            alert(`Something magical just happened. ✨,${id}`)
                            setNodes((prev) => [...prev, { id: `node-${id}`, position: { x: 500, y: 500 }, data: { label: `node ${id}` } },])
                        }}>
                            <Blocks />
                        </ControlButton>
                    </Controls>
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    );
}