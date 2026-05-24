"use client"

import React, { useCallback, useEffect } from "react"
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  ConnectionLineType,
  Node,
  Edge,
} from "@xyflow/react"
import dagre from "dagre"
import PositionNode from "./PositionNode"
import { useOrgChart } from "@/modules/organization/chart/hooks/use-chart"
import "@xyflow/react/dist/style.css"

const nodeTypes = {
  positionNode: PositionNode,
}

const getLayoutedElements = (nodes: any[], edges: any[], direction = "TB") => {
  const isHorizontal = direction === "LR"

  // Create a fresh graph per render
  const dagreGraph = new dagre.graphlib.Graph()
  dagreGraph.setDefaultEdgeLabel(() => ({}))
  dagreGraph.setGraph({ rankdir: direction, ranksep: 60, nodesep: 20 })

  const MAX_COLUMNS = 3
  const NODE_WIDTH = 280
  const NODE_HEIGHT = 90
  const X_SEP = 20
  const Y_SEP = 20

  const parentToChildren: Record<string, string[]> = {}
  edges.forEach((e) => {
    if (!parentToChildren[e.source]) parentToChildren[e.source] = []
    parentToChildren[e.source].push(e.target)
  })

  const leafParents: Record<string, string[]> = {}

  if (!isHorizontal) {
    Object.keys(parentToChildren).forEach((parentId) => {
      const childrenIds = parentToChildren[parentId]
      // Check if they are all leaves
      const isAllLeaves = childrenIds.every(
        (cId) => !parentToChildren[cId] || parentToChildren[cId].length === 0
      )

      // If parent has many leaf children, group them
      if (isAllLeaves && childrenIds.length > MAX_COLUMNS) {
        leafParents[parentId] = childrenIds
      }
    })
  }

  const hiddenLeafIds = new Set<string>()
  Object.values(leafParents).forEach((childrenIds) => {
    childrenIds.forEach((id) => hiddenLeafIds.add(id))
  })

  nodes.forEach((node) => {
    // Only add non-hidden nodes to Dagre initially
    if (!hiddenLeafIds.has(node.id)) {
      dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT })
    }
  })

  // Add dummy nodes representing the grid block sizes
  Object.keys(leafParents).forEach((parentId) => {
    const childrenCount = leafParents[parentId].length
    const numCols = Math.min(childrenCount, MAX_COLUMNS)
    const numRows = Math.ceil(childrenCount / MAX_COLUMNS)

    const blockWidth = numCols * NODE_WIDTH + (numCols - 1) * X_SEP
    const blockHeight = numRows * NODE_HEIGHT + (numRows - 1) * Y_SEP

    dagreGraph.setNode(`dummy_${parentId}`, {
      width: blockWidth,
      height: blockHeight,
    })
  })

  edges.forEach((edge) => {
    if (!hiddenLeafIds.has(edge.target)) {
      dagreGraph.setEdge(edge.source, edge.target)
    }
  })

  // Connect parents to their dummy blocks
  Object.keys(leafParents).forEach((parentId) => {
    dagreGraph.setEdge(parentId, `dummy_${parentId}`)
  })

  dagre.layout(dagreGraph)

  // Map dummy positions back to actual grid leaf nodes
  Object.keys(leafParents).forEach((parentId) => {
    const dummyPos = dagreGraph.node(`dummy_${parentId}`)
    if (!dummyPos) return

    const childrenIds = leafParents[parentId]
    const numCols = Math.min(childrenIds.length, MAX_COLUMNS)
    const numRows = Math.ceil(childrenIds.length / MAX_COLUMNS)

    const blockWidth = numCols * NODE_WIDTH + (numCols - 1) * X_SEP
    const blockHeight = numRows * NODE_HEIGHT + (numRows - 1) * Y_SEP

    // Dagre coordinates are the center, calculate start top-left for grid
    const startX = dummyPos.x - blockWidth / 2 + NODE_WIDTH / 2
    const startY = dummyPos.y - blockHeight / 2 + NODE_HEIGHT / 2

    childrenIds.forEach((childId, index) => {
      const row = Math.floor(index / numCols)
      const col = index % numCols

      dagreGraph.setNode(childId, {
        x: startX + col * (NODE_WIDTH + X_SEP),
        y: startY + row * (NODE_HEIGHT + Y_SEP),
        width: NODE_WIDTH,
        height: NODE_HEIGHT,
      })
    })
  })

  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    return {
      ...node,
      targetPosition: isHorizontal ? "left" : "top",
      sourcePosition: isHorizontal ? "right" : "bottom",
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    }
  })

  return { nodes: layoutedNodes, edges }
}

export default function OrgChartFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])

  const { data, isLoading } = useOrgChart()

  useEffect(() => {
    if (data) {
      const { nodes: initialNodes, edges: initialEdges } = data

      // Inject animated style into edges
      const styledEdges = initialEdges.map((edge: any) => ({
        ...edge,
        animated: true,
        style: { stroke: "#818cf8", strokeWidth: 2 }, // Indigo-400
      }))

      const { nodes: layoutedNodes, edges: layoutedEdges } =
        getLayoutedElements(initialNodes, styledEdges)

      setNodes(layoutedNodes)
      setEdges(layoutedEdges)
    }
  }, [data, setNodes, setEdges])

  const onConnect = useCallback(
    (params: any) =>
      setEdges((eds) =>
        addEdge(
          { ...params, type: ConnectionLineType.SmoothStep, animated: true },
          eds
        )
      ),
    [setEdges]
  )

  if (isLoading) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="h-[800px] w-full overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-50/50 shadow-sm backdrop-blur-sm dark:border-slate-800/60 dark:bg-slate-950/50">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        connectionLineType={ConnectionLineType.SmoothStep}
        defaultEdgeOptions={{
          type: "smoothstep",
          animated: true,
          style: { stroke: "hsl(var(--primary))", strokeWidth: 2 },
        }}
        fitView
        minZoom={0.05}
        maxZoom={1.5}
        attributionPosition="bottom-right"
      >
        <MiniMap
          zoomable
          pannable
          className="rounded-xl border border-slate-200 bg-white/50 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50"
          maskColor="rgba(0, 0, 0, 0.05)"
        />
        <Controls className="rounded-xl border border-slate-200 bg-white/50 shadow-sm backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/50" />
        <Background
          color="#94a3b8"
          gap={20}
          size={1.5}
          className="opacity-40"
        />
      </ReactFlow>
    </div>
  )
}
