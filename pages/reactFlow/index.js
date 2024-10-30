import React, {useCallback, useState} from 'react';
import {
  addEdge,
  Background,
  BackgroundVariant,
  ControlButton,
  Controls,
  MiniMap, Panel,
  ReactFlow,
  useEdgesState,
  useNodesState, useReactFlow,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import {DownloadIcon} from '@radix-ui/react-icons'

const flowKey = 'example-flow';

const getNodeId = () => `randomNode_${+new Date()}`;

const initialNodes = [
  {id: '1', position: {x: 100, y: 100}, data: {label: '1'}},
  {id: '2', position: {x: 300, y: 300}, data: {label: '2'}},
  {id: '3', position: {x: 100, y: 300}, data: {label: '3'}},
];
const initialEdges = [
  {id: 'e1-2', source: '1', target: '2'},
  {id: 'e1-3', source: '1', target: '3'}
];


export default function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [rfInstance, setRfInstance] = useState(null);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );
  const onSave = useCallback(() => {
    if (rfInstance) {
      const flow = rfInstance.toObject();
      console.log(flow, 'aaaaaaaaaaaa')
      localStorage.setItem(flowKey, JSON.stringify(flow));
    }
  }, [rfInstance]);

  const onRestore = useCallback(() => {
    const restoreFlow = async () => {
      const flow = JSON.parse(localStorage.getItem(flowKey));

      if (flow) {
        const {x = 0, y = 0, zoom = 1} = flow.viewport;
        setNodes(flow.nodes || []);
        setEdges(flow.edges || []);
      }
    };

    restoreFlow();
  }, [setNodes]);

  const onAdd = useCallback(() => {
    const newNode = {
      id: getNodeId(),
      data: {label: 'Added node'},
      position: {
        x: (Math.random() - 0.5) * 400,
        y: (Math.random() - 0.5) * 400,
      },
    };
    setNodes((nds) => nds.concat(newNode));
  }, [setNodes]);


  return (
    <div style={{width: '100vw', height: '100vh'}}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        fitView
        fitViewOptions={{padding: 2}}
      >
        <Controls>
          <ControlButton onClick={() => alert('Something magical just happened. ✨')}>
            <DownloadIcon/>
          </ControlButton>
        </Controls>
        <MiniMap/>


        <Background
          id="2"
          gap={100}
          lineWidth={0.5}
          color="#ccc"
          variant={BackgroundVariant.Lines}
        />
        <Background gap={10} size={1} color="#ccc" variant={BackgroundVariant.Dots}/>
        <Panel position="top-right">
          <button style={btnStyle} onClick={onSave}>save</button>
          <button style={btnStyle} onClick={onRestore}>restore</button>
          <button style={btnStyle} onClick={onAdd}>add node</button>
        </Panel>
      </ReactFlow>
    </div>
  );
}

const btnStyle = {
  border: '1px solid #ccc',
  margin: '10px',
  padding: '6px 10px',
  borderRadius: '10px',
}