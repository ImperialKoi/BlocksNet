"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import ReactFlow, {
  Controls,
  Background,
  applyEdgeChanges,
  applyNodeChanges,
  addEdge,
  type Edge,
  type Connection,
  type Node,
  type NodeChange,
  type EdgeChange,
  Panel,
  MiniMap,
  ConnectionLineType,
  ReactFlowProvider,
} from "reactflow"
import "reactflow/dist/style.css"
import { PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/hooks/use-toast"

import InputBlockNode from "@/components/blocks/InputBlock"
import HiddenBlock from "@/components/blocks/HiddenBlock"
import OutputBlockNode from "@/components/blocks/OutputBlock"
import ConvolutionalBlock from "@/components/blocks/ConvolutionalBlock"
import PoolingBlock from "@/components/blocks/PoolingBlock"
import StartBlock from "@/components/blocks/StartBlock"
import TrainingBlock from "@/components/blocks/TrainingBlock"
import ClassifierBlock from "@/components/blocks/ClassifierBlock"
import ContextMenu from "@/components/scratchUI/ContextMenu"

const nodeTypes = {
  inputBlock: InputBlockNode,
  hiddenBlock: HiddenBlock,
  outputBlock: OutputBlockNode,
  convolutionalBlock: ConvolutionalBlock,
  poolingBlock: PoolingBlock,
  classifierBlock: ClassifierBlock,
  trainingBlock: TrainingBlock,
  startBlock: StartBlock,
}

// Initial image size (assuming square image)
const INITIAL_IMAGE_SIZE = 128

export default function NeuralNetworkFlow() {
  const { toast } = useToast()
  const [nodes, setNodes] = useState<Node[]>([
    {
      id: "classifier-1",
      type: "classifierBlock",
      position: { x: 100, y: 100 },
      data: {
        label: "Classifier Layer",
        sizeIn: 12,
        sizeOut: 12,
        id: "classifier-1",
        sequenceIndex: 0,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "input-1",
      type: "inputBlock",
      position: { x: 100, y: 100 },
      data: {
        label: "Input Layer",
        sizeIn: 12,
        sizeOut: 12,
        id: "input-1",
        sequenceIndex: 0,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "hidden-1",
      type: "hiddenBlock",
      position: { x: 450, y: 100 },
      data: {
        label: "Hidden Layer 1",
        sizeIn: 12,
        sizeOut: 8,
        activation: "relu",
        id: "hidden-1",
        sequenceIndex: 1,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "output-1",
      type: "outputBlock",
      position: { x: 800, y: 100 },
      data: {
        label: "Output Layer",
        sizeIn: 8,
        sizeOut: 4,
        id: "output-1",
        sequenceIndex: 2,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "conv-1",
      type: "convolutionalBlock",
      position: { x: 100, y: 300 },
      data: {
        label: "Conv2D Layer 1",
        size: 3,
        sizeIn: 3, // Default input channels (e.g., RGB image)
        sizeOut: 32, // Default output channels
        padding: 1,
        id: "conv-1",
        sequenceIndex: 0,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "pool-1",
      type: "poolingBlock",
      position: { x: 450, y: 300 },
      data: {
        label: "Pooling Layer 1",
        size: 2,
        stride: 2,
        type: "max",
        channels: 32, // Pass-through channel count
        id: "pool-1",
        sequenceIndex: 1,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
    {
      id: "conv-2",
      type: "convolutionalBlock",
      position: { x: 800, y: 300 },
      data: {
        label: "Conv2D Layer 2",
        size: 3,
        sizeIn: 32, // Matches output channels of conv-1
        sizeOut: 64, // Default output channels
        padding: 1,
        id: "conv-2",
        sequenceIndex: 2,
        onChange: (id: string, param: string, value: any) => {},
      },
    },
  ])

  const [edges, setEdges] = useState<Edge[]>([])
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null)

  const onNodesChange = useCallback((changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)), [])

  const onEdgesChange = useCallback((changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)), [])

  const onConnect = useCallback((connection: Connection) => {
    // Add the edge
    setEdges((eds) => addEdge(connection, eds))
  }, [])

  // Context menu handlers
  const onContextMenu = (event: React.MouseEvent) => {
    event.preventDefault()
    const reactFlowBounds = event.currentTarget.getBoundingClientRect()
    const position = {
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    }

    setContextMenu(position)
  }

  const onPaneClick = () => {
    setContextMenu(null)
  }

  // Find the next convolutional layer in sequence
  const findNextConvLayer = useCallback((currentNodeId: string, nodes: Node[]) => {
    // Get all conv blocks
    const convNodes = nodes.filter((node) => node.type === "convolutionalBlock")

    // Find the current node
    const currentNode = nodes.find((node) => node.id === currentNodeId)
    if (!currentNode || currentNode.type !== "convolutionalBlock") return null

    // Sort by sequence index
    const sortedConvNodes = [...convNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

    // Find the current node's index in the sorted array
    const currentIndex = sortedConvNodes.findIndex((node) => node.id === currentNodeId)

    // If there's a next conv node, return it
    if (currentIndex >= 0 && currentIndex < sortedConvNodes.length - 1) {
      return sortedConvNodes[currentIndex + 1]
    }

    return null
  }, [])

  // Calculate the spatial dimension reduction through pooling layers
  const calculateSpatialDimension = useCallback((nodes: Node[]) => {
    // Get all pooling blocks
    const poolingBlocks = nodes
      .filter((node) => node.type === "poolingBlock")
      .sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

    // Start with initial image size
    let currentDim = INITIAL_IMAGE_SIZE

    // Apply each pooling layer's reduction
    for (const poolBlock of poolingBlocks) {
      const kernelSize = poolBlock.data.size
      const stride = poolBlock.data.stride || 2 // Default stride is 2 if not specified

      // Apply the formula: floor((current_dim - kernel_size) / stride + 1)
      currentDim = Math.floor((currentDim - kernelSize) / stride + 1)
    }

    return currentDim
  }, [])

  // Calculate the input dimension for the input block based on convolutional output
  const calculateInputBlockDimension = useCallback(
    (nodes: Node[]) => {
      // Get the last convolutional block
      const convBlocks = nodes.filter((node) => node.type === "convolutionalBlock")

      if (convBlocks.length === 0) return 12 // Default if no conv blocks

      // Sort by sequence index to find the last one
      const sortedConvBlocks = [...convBlocks].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
      const lastConvBlock = sortedConvBlocks[sortedConvBlocks.length - 1]
      const outputChannels = lastConvBlock.data.sizeOut

      // Calculate the spatial dimension after all pooling operations
      const spatialDim = calculateSpatialDimension(nodes)

      // Apply the formula: output_channels * spatialDim^2
      return outputChannels * spatialDim * spatialDim
    },
    [calculateSpatialDimension],
  )

  // Update pooling layer channel pass-through
  const updatePoolingLayerChannels = useCallback((nodes: Node[]) => {
    const updatedNodes = [...nodes]
    let needsUpdate = false

    // Get all conv and pool blocks
    const convPoolNodes = nodes.filter((node) => node.type === "convolutionalBlock" || node.type === "poolingBlock")

    // Sort by sequence index
    const sortedNodes = [...convPoolNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

    // Update pooling layer channels based on the previous conv layer
    for (let i = 1; i < sortedNodes.length; i++) {
      const currentNode = sortedNodes[i]
      const prevNode = sortedNodes[i - 1]

      // If current node is a pooling layer and previous node is a conv layer
      if (currentNode.type === "poolingBlock" && prevNode.type === "convolutionalBlock") {
        if (currentNode.data.channels !== prevNode.data.sizeOut) {
          needsUpdate = true

          // Find this pooling layer in the original nodes array
          const nodeIndex = updatedNodes.findIndex((node) => node.id === currentNode.id)
          if (nodeIndex >= 0) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              data: {
                ...updatedNodes[nodeIndex].data,
                channels: prevNode.data.sizeOut,
              },
            }
          }
        }
      }
    }

    return { updatedNodes, needsUpdate }
  }, [])

  // Function to handle node parameter changes
  const handleNodeParamChange = useCallback(
    (nodeId: string, param: string, value: any) => {
      setNodes((nds) => {
        // First update the node with the changed parameter
        const updatedNodes = nds.map((node) => {
          if (node.id === nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                [param]: value,
              },
            }
          }
          return node
        })

        // If a convolutional layer's output channels changed
        if (param === "sizeOut" && updatedNodes.find((n) => n.id === nodeId)?.type === "convolutionalBlock") {
          let finalNodes = [...updatedNodes]

          // Find the next conv layer and update its input channels
          const nextConvLayer = findNextConvLayer(nodeId, updatedNodes)
          if (nextConvLayer) {
            finalNodes = finalNodes.map((node) => {
              if (node.id === nextConvLayer.id) {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    sizeIn: value,
                  },
                }
              }
              return node
            })
          }

          // Update any pooling layer that comes after this conv layer
          const currentNode = updatedNodes.find((n) => n.id === nodeId)
          if (currentNode) {
            const convPoolNodes = updatedNodes.filter(
              (node) => node.type === "convolutionalBlock" || node.type === "poolingBlock",
            )

            const sortedNodes = [...convPoolNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
            const currentIndex = sortedNodes.findIndex((node) => node.id === nodeId)

            if (currentIndex >= 0 && currentIndex < sortedNodes.length - 1) {
              const nextNode = sortedNodes[currentIndex + 1]

              if (nextNode.type === "poolingBlock") {
                finalNodes = finalNodes.map((node) => {
                  if (node.id === nextNode.id) {
                    return {
                      ...node,
                      data: {
                        ...node.data,
                        channels: value,
                      },
                    }
                  }
                  return node
                })
              }
            }
          }

          // Recalculate the input dimension for the input block
          const inputDim = calculateInputBlockDimension(finalNodes)

          // Update the input block's input size
          return finalNodes.map((node) => {
            if (node.type === "inputBlock" && node.data.sequenceIndex === 0) {
              return {
                ...node,
                data: {
                  ...node.data,
                  sizeIn: inputDim,
                },
              }
            }
            return node
          })
        }

        // If the changed parameter affects the spatial dimensions
        if (["size", "stride"].includes(param) && updatedNodes.find((n) => n.id === nodeId)?.type === "poolingBlock") {
          // Recalculate the input dimension for the input block
          const inputDim = calculateInputBlockDimension(updatedNodes)

          // Update the input block's input size
          return updatedNodes.map((node) => {
            if (node.type === "inputBlock" && node.data.sequenceIndex === 0) {
              return {
                ...node,
                data: {
                  ...node.data,
                  sizeIn: inputDim,
                },
              }
            }
            return node
          })
        }

        // If the changed parameter is sizeOut for neural network blocks
        if (param === "sizeOut") {
          // Find the current node
          const currentNode = updatedNodes.find((node) => node.id === nodeId)
          if (!currentNode) return updatedNodes

          // For neural network blocks (input, hidden, output)
          if (
            currentNode.type === "inputBlock" ||
            currentNode.type === "hiddenBlock" ||
            currentNode.type === "outputBlock"
          ) {
            const nnNodes = updatedNodes.filter(
              (node) => node.type === "inputBlock" || node.type === "hiddenBlock" || node.type === "outputBlock",
            )

            // Sort by sequence index
            const sortedNNNodes = [...nnNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

            // Find the current node's index in the sorted array
            const currentIndex = sortedNNNodes.findIndex((node) => node.id === nodeId)

            // If there's a next node in sequence, update its input size
            if (currentIndex >= 0 && currentIndex < sortedNNNodes.length - 1) {
              const nextNode = sortedNNNodes[currentIndex + 1]

              return updatedNodes.map((node) => {
                if (node.id === nextNode.id) {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      sizeIn: value,
                    },
                  }
                }
                return node
              })
            }
          }
        }

        return updatedNodes
      })
    },
    [findNextConvLayer, calculateInputBlockDimension],
  )

  // Synchronize all blocks in sequence
  useEffect(() => {
    let updatedNodes = [...nodes]
    let needsUpdate = false

    // Synchronize neural network blocks (input, hidden, output)
    const nnNodes = nodes.filter(
      (node) => node.type === "inputBlock" || node.type === "hiddenBlock" || node.type === "outputBlock",
    )

    if (nnNodes.length >= 2) {
      // Sort by sequence index
      const sortedNNNodes = [...nnNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

      // Check if we need to update any input sizes
      for (let i = 1; i < sortedNNNodes.length; i++) {
        const prevNode = sortedNNNodes[i - 1]
        const currentNode = sortedNNNodes[i]

        if (currentNode.data.sizeIn !== prevNode.data.sizeOut) {
          needsUpdate = true

          // Find the node in the original array and update it
          const nodeIndex = updatedNodes.findIndex((node) => node.id === currentNode.id)
          if (nodeIndex >= 0) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              data: {
                ...updatedNodes[nodeIndex].data,
                sizeIn: prevNode.data.sizeOut,
              },
            }
          }
        }
      }
    }

    // Update pooling layer channels
    const poolingResult = updatePoolingLayerChannels(updatedNodes)
    if (poolingResult.needsUpdate) {
      updatedNodes = poolingResult.updatedNodes
      needsUpdate = true
    }

    // Synchronize convolutional blocks (conv to conv, skipping pooling)
    const convNodes = nodes.filter((node) => node.type === "convolutionalBlock")

    if (convNodes.length >= 2) {
      // Sort by sequence index
      const sortedConvNodes = [...convNodes].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)

      // Check if we need to update any input sizes
      for (let i = 1; i < sortedConvNodes.length; i++) {
        const prevNode = sortedConvNodes[i - 1]
        const currentNode = sortedConvNodes[i]

        if (currentNode.data.sizeIn !== prevNode.data.sizeOut) {
          needsUpdate = true

          // Find the node in the original array and update it
          const nodeIndex = updatedNodes.findIndex((node) => node.id === currentNode.id)
          if (nodeIndex >= 0) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              data: {
                ...updatedNodes[nodeIndex].data,
                sizeIn: prevNode.data.sizeOut,
              },
            }
          }
        }
      }
    }

    // Connect convolutional output to fully connected input
    const inputBlock = nodes.find((node) => node.type === "inputBlock" && node.data.sequenceIndex === 0)
    if (inputBlock && convNodes.length > 0) {
      const calculatedInputDim = calculateInputBlockDimension(updatedNodes)

      if (inputBlock.data.sizeIn !== calculatedInputDim) {
        needsUpdate = true

        // Find the input block in the updated nodes array
        const inputBlockIndex = updatedNodes.findIndex(
          (node) => node.type === "inputBlock" && node.data.sequenceIndex === 0,
        )

        if (inputBlockIndex >= 0) {
          updatedNodes[inputBlockIndex] = {
            ...updatedNodes[inputBlockIndex],
            data: {
              ...updatedNodes[inputBlockIndex].data,
              sizeIn: calculatedInputDim,
            },
          }
        }
      }
    }

    if (needsUpdate) {
      setNodes(updatedNodes)
    }
  }, [nodes, calculateInputBlockDimension, updatePoolingLayerChannels])

  // Add onChange handler to all nodes
  const nodesWithHandlers = nodes.map((node) => ({
    ...node,
    data: {
      ...node.data,
      onChange: handleNodeParamChange,
    },
  }))

  // Function to add a new node from context menu
  const addNodeFromContext = (type: string) => {
    if (!contextMenu) return

    // Generate a unique ID based on node type and current count
    let typePrefix = ""
    let defaultData = {}

    switch (type) {
      case "inputBlock":
        typePrefix = "input"
        // Calculate input dimension based on convolutional output
        const inputDim = calculateInputBlockDimension(nodes)
        defaultData = {
          sizeIn: inputDim,
          sizeOut: Math.max(64, Math.floor(inputDim / 4)),
          sequenceIndex: 0,
          id: `input-${nodes.filter((n) => n.type === "inputBlock").length + 1}`,
        }
        break
      case "hiddenBlock":
        typePrefix = "hidden"
        const hiddenCount = nodes.filter((n) => n.type === "hiddenBlock").length
        defaultData = {
          sizeIn: 64,
          sizeOut: 32,
          activation: "relu",
          sequenceIndex: 1,
          id: `hidden-${hiddenCount + 1}`,
        }
        break
      case "outputBlock":
        typePrefix = "output"
        defaultData = {
          sizeIn: 32,
          sizeOut: 10,
          sequenceIndex: 2,
          id: `output-${nodes.filter((n) => n.type === "outputBlock").length + 1}`,
        }
        break
      case "convolutionalBlock":
        typePrefix = "conv"
        const convCount = nodes.filter((n) => n.type === "convolutionalBlock").length
        defaultData = {
          size: 3,
          sizeIn: 3,
          sizeOut: 32,
          padding: 1,
          sequenceIndex: convCount,
          id: `conv-${convCount + 1}`,
        }
        break
      case "poolingBlock":
        typePrefix = "pool"
        const poolCount = nodes.filter((n) => n.type === "poolingBlock").length
        defaultData = {
          size: 2,
          stride: 2,
          type: "max",
          channels: 32,
          sequenceIndex: poolCount,
          id: `pool-${poolCount + 1}`,
        }
        break
    }

    const newId = `${typePrefix}-${nodes.filter((n) => n.type === type).length + 1}`

    // Create the new node
    const newNode: Node = {
      id: newId,
      type,
      position: { x: contextMenu.x, y: contextMenu.y },
      data: {
        label:
          type === "inputBlock"
            ? "Input Layer"
            : type === "hiddenBlock"
              ? `Hidden Layer ${nodes.filter((n) => n.type === "hiddenBlock").length + 1}`
              : type === "outputBlock"
                ? "Output Layer"
                : type === "convolutionalBlock"
                  ? `Conv2D Layer ${nodes.filter((n) => n.type === "convolutionalBlock").length + 1}`
                  : `Pooling Layer ${nodes.filter((n) => n.type === "poolingBlock").length + 1}`,
        ...defaultData,
        onChange: handleNodeParamChange,
      },
    }

    setNodes((prevNodes) => [...prevNodes, newNode])
    setContextMenu(null)

    toast({
      title: "Block added",
      description: `Added a new ${type.replace("Block", "")} block to the editor.`,
    })
  }

  // Function to add a new node from dropdown
  const addNode = (type: string) => {
    // Generate a unique ID based on node type and current count
    let typePrefix = ""
    let defaultData = {}
    let newY = 100

    switch (type) {
      case "inputBlock":
      case "hiddenBlock":
      case "outputBlock":
        // Get all neural network blocks to determine sequence index and input size
        const nnBlocks = nodes.filter(
          (node) => node.type === "inputBlock" || node.type === "hiddenBlock" || node.type === "outputBlock",
        )

        if (type === "inputBlock") {
          typePrefix = "input"
          const sequenceIndex = 0 // Input blocks always go first

          // Calculate input dimension based on convolutional output
          const inputDim = calculateInputBlockDimension(nodes)

          // Shift all existing NN blocks' sequence indices
          setNodes((prevNodes) =>
            prevNodes.map((node) => {
              if (node.type === "inputBlock" || node.type === "hiddenBlock" || node.type === "outputBlock") {
                return {
                  ...node,
                  data: {
                    ...node.data,
                    sequenceIndex: node.data.sequenceIndex + 1,
                  },
                }
              }
              return node
            }),
          )

          defaultData = { sizeIn: inputDim, sizeOut: Math.max(64, Math.floor(inputDim / 4)), sequenceIndex }
        } else if (type === "hiddenBlock") {
          typePrefix = "hidden"

          // Get the highest sequence index among hidden layers
          const hiddenBlocks = nnBlocks.filter((node) => node.type === "hiddenBlock")
          const existingHiddenCount = hiddenBlocks.length

          // Find the output layer's sequence index
          const outputBlock = nnBlocks.find((node) => node.type === "outputBlock")
          const outputIndex = outputBlock ? outputBlock.data.sequenceIndex : nnBlocks.length

          // Insert before output layer
          const sequenceIndex = outputIndex

          // Get the output size of the previous layer
          let prevOutputSize = 12 // Default
          const prevLayer = [...nnBlocks]
            .sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
            .find((node) => node.data.sequenceIndex === sequenceIndex - 1)

          if (prevLayer) {
            prevOutputSize = prevLayer.data.sizeOut
          }

          // Shift output layer's sequence index
          if (outputBlock) {
            setNodes((prevNodes) =>
              prevNodes.map((node) => {
                if (node.type === "outputBlock") {
                  return {
                    ...node,
                    data: {
                      ...node.data,
                      sequenceIndex: node.data.sequenceIndex + 1,
                    },
                  }
                }
                return node
              }),
            )
          }

          defaultData = {
            sizeIn: prevOutputSize,
            sizeOut: Math.max(4, Math.floor(prevOutputSize / 2)),
            activation: "relu",
            sequenceIndex,
          }
        } else {
          typePrefix = "output"

          // Output layer always goes last
          const sequenceIndex = nnBlocks.length

          // Get the output size of the previous layer
          let prevOutputSize = 8 // Default
          if (nnBlocks.length > 0) {
            const sortedBlocks = [...nnBlocks].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
            const prevLayer = sortedBlocks[sortedBlocks.length - 1]
            if (prevLayer) {
              prevOutputSize = prevLayer.data.sizeOut
            }
          }

          defaultData = {
            sizeIn: prevOutputSize,
            sizeOut: Math.max(1, Math.floor(prevOutputSize / 2)),
            sequenceIndex,
          }
        }

        newY = 100
        break

      case "convolutionalBlock":
        typePrefix = "conv"

        // Get all conv and pooling blocks to determine sequence index
        const convPoolBlocks = nodes.filter((node) => node.type === "convolutionalBlock" || node.type === "poolingBlock")
        const sequenceIndex = convPoolBlocks.length

        // Get the last conv block to determine input channels
        const convBlocks = nodes.filter((node) => node.type === "convolutionalBlock")

        // If there are no conv blocks, use default input channels (3 for RGB)
        let prevOutputChannels = 3

        if (convBlocks.length > 0) {
          // Sort by sequence index
          const sortedConvBlocks = [...convBlocks].sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
          // Get the last conv block's output channels
          prevOutputChannels = sortedConvBlocks[sortedConvBlocks.length - 1].data.sizeOut
        }

        defaultData = {
          size: 3,
          sizeIn: prevOutputChannels,
          sizeOut: prevOutputChannels * 2,
          padding: 1,
          sequenceIndex,
        }
        newY = 300
        break

      case "poolingBlock":
        typePrefix = "pool"

        // Get all conv/pool blocks to determine sequence index
        const allBlocks = nodes.filter((node) => node.type === "convolutionalBlock" || node.type === "poolingBlock")
        const poolSequenceIndex = allBlocks.length

        // Get the last conv block to determine channel count
        const lastConvBlock = nodes
          .filter((node) => node.type === "convolutionalBlock")
          .sort((a, b) => a.data.sequenceIndex - b.data.sequenceIndex)
          .pop()

        const channelCount = lastConvBlock ? lastConvBlock.data.sizeOut : 32

        defaultData = {
          size: 2,
          stride: 2,
          type: "max",
          channels: channelCount, // Pass-through channel count from last conv
          sequenceIndex: poolSequenceIndex,
        }
        newY = 300
        break
    }

    const existingCount = nodes.filter((node) => node.type === type).length
    const newId = `${typePrefix}-${existingCount + 1}`

    // Find the rightmost node's x position to place the new node
    const rightmostX = Math.max(...nodes.map((node) => node.position.x)) + 350

    // Find a suitable y position (avoid overlapping)
    const usedYPositions = nodes.map((node) => node.position.y)

    // If the y position is already taken, offset it by 150px
    while (usedYPositions.includes(newY)) {
      newY += 150
    }

    // Create the new node
    const newNode: Node = {
      id: newId,
      type,
      position: { x: rightmostX, y: newY },
      data: {
        label:
          type === "inputBlock"
            ? `Input Layer ${existingCount + 1}`
            : type === "outputBlock"
              ? `Output Layer ${existingCount + 1}`
              : type === "hiddenBlock"
                ? `Hidden Layer ${existingCount + 1}`
                : type === "convolutionalBlock"
                  ? `Conv2D Layer ${existingCount + 1}`
                  : `Pooling Layer ${existingCount + 1}`,
        id: newId,
        ...defaultData,
        onChange: handleNodeParamChange,
      },
    }

    setNodes((prevNodes) => [...prevNodes, newNode])

    toast({
      title: "Block added",
      description: `Added a new ${type.replace("Block", "").replace("conv", "convolutional")} block to the editor.`,
    })
  }

  const onCompile = () => {
    toast({
      title: "Compiling model",
      description: "Neural network architecture compiled successfully!",
    })
  }

  function nodeColor(node: any) {
    switch (node.type) {
      case "inputBlock":
        return "#4caf50"
      case "outputBlock":
        return "#e91e63"
      case "hiddenBlock":
        return "#ff9800"
      case "convolutionalBlock":
        return "#9c27b0"
      case "poolingBlock":
        return "#00bcd4"
      default:
        return "#3880ff"
    }
  }

  return (
    <div className="w-full h-screen">
      <div className="h-16 border-b flex items-center justify-between bg-[#1e2530] text-white px-4">
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text pr-4 border-r">
            BLOCKS.
          </div>
          <div className="ml-4">Neural Network Designer</div>
        </div>

        <div className="flex items-center gap-6">
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">EXPORT</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">NEW</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">LOAD</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">TUTORIALS</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">OPTIONS</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">SOCIAL</span>
          </button>
          <button className="flex flex-col items-center text-xs opacity-70 hover:opacity-100">
            <span className="mb-1">GITHUB</span>
          </button>
        </div>
      </div>

      <div className="w-full h-[calc(100vh-4rem)]" onContextMenu={onContextMenu}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodesWithHandlers}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            onPaneClick={onPaneClick}
            connectionLineType={ConnectionLineType.Bezier}
            connectionLineStyle={{ stroke: "#3880ff", strokeWidth: 2 }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            fitView
          >
            <Background color="#4a5568" gap={16} size={1} />
            <Controls />
            <MiniMap nodeStrokeWidth={3} nodeColor={nodeColor} />

            <Panel position="bottom-right">
              <button
                onClick={onCompile}
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-mono"
              >
                COMPILE
              </button>
            </Panel>
          </ReactFlow>
        </ReactFlowProvider>

        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            onClose={() => setContextMenu(null)}
            onAddNode={addNodeFromContext}
          />
        )}
      </div>
    </div>
  )
}