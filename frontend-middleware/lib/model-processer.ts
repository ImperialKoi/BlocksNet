import type { Node, Edge } from "reactflow"
import type { NodeData } from "@/types/flow"

// Define more specific types for each node type
interface TrainingBlockData {
  label: string
  id: string
  epochs: number
  batchSize?: number
  learningRate?: number
  optimizer?: string
  validationSplit?: number
  useEarlyStopping?: boolean
  patience?: number
  useTensorboard?: boolean
  useDataAugmentation?: boolean
  onChange?: (id: string, param: string, value: any) => void
}

interface InputBlockData {
  label: string
  size: number
  id: string
  onChange: (id: string, value: number) => void
}

interface HiddenBlockData {
  label: string
  size: number
  activation: string
  id: string
  onChange: (id: string, param: string, value: any) => void
}

interface ConvolutionalBlockData {
  label: string
  size: number
  padding: number
  id: string
  onChange: (id: string, param: string, value: any) => void
}

interface PoolingBlockData {
  label: string
  size: number
  type: string
  id: string
  onChange: (id: string, param: string, value: any) => void
}

interface OutputBlockData {
  label: string
}

// Type guards to check node types and cast to specific data types
function isTrainingBlock(node: Node<NodeData>): node is Node<TrainingBlockData> {
  return node.type === "trainingBlock"
}

function isInputBlock(node: Node<NodeData>): node is Node<InputBlockData> {
  return node.type === "inputBlock"
}

function isHiddenBlock(node: Node<NodeData>): node is Node<HiddenBlockData> {
  return node.type === "hiddenBlock"
}

function isConvolutionalBlock(node: Node<NodeData>): node is Node<ConvolutionalBlockData> {
  return node.type === "convolutionalBlock"
}

function isPoolingBlock(node: Node<NodeData>): node is Node<PoolingBlockData> {
  return node.type === "poolingBlock"
}

function isOutputBlock(node: Node<NodeData>): node is Node<OutputBlockData> {
  return node.type === "outputBlock"
}

// This function converts the visual flow diagram to a model architecture
// that can be sent to the server for training
export function processModel(nodes: Node<NodeData>[], edges: Edge[]) {
  // Find nodes by type
  const inputNodes = nodes.filter(isInputBlock)
  const hiddenNodes = nodes.filter(isHiddenBlock)
  const convNodes = nodes.filter(isConvolutionalBlock)
  const poolingNodes = nodes.filter(isPoolingBlock)
  const outputNodes = nodes.filter(isOutputBlock)
  const trainingNodes = nodes.filter(isTrainingBlock)

  // Extract training parameters
  const trainingConfig =
    trainingNodes.length > 0
      ? {
          epochs: trainingNodes[0].data.epochs || 10,
          batchSize: trainingNodes[0].data.batchSize || 32,
          learningRate: trainingNodes[0].data.learningRate || 0.001,
          optimizer: trainingNodes[0].data.optimizer || "adam",
          validationSplit: trainingNodes[0].data.validationSplit || 0.2,
        }
      : {
          epochs: 10,
          batchSize: 32,
          learningRate: 0.001,
          optimizer: "adam",
          validationSplit: 0.2,
        }

  // Build a graph representation to determine layer order
  const graph: Record<string, string[]> = {}
  edges.forEach((edge) => {
    if (!graph[edge.source]) {
      graph[edge.source] = []
    }
    graph[edge.source].push(edge.target)
  })

  // Find the starting node (usually has no incoming edges)
  const startNodeId = nodes.find((node) => !edges.some((edge) => edge.target === node.id))?.id || ""

  // Traverse the graph to build an ordered layer list
  const orderedLayers: Node<NodeData>[] = []
  const visited = new Set<string>()

  function dfs(nodeId: string) {
    if (visited.has(nodeId)) return
    visited.add(nodeId)

    const node = nodes.find((n) => n.id === nodeId)
    if (node) {
      orderedLayers.push(node)
    }

    if (graph[nodeId]) {
      graph[nodeId].forEach((targetId) => {
        dfs(targetId)
      })
    }
  }

  dfs(startNodeId)

  // Filter to only include layer nodes and not control nodes
  const layerNodes = orderedLayers.filter((node) =>
    ["inputBlock", "hiddenBlock", "convolutionalBlock", "poolingBlock", "outputBlock"].includes(node.type || ""),
  )

  // Create the dictionary in the requested format
  // Use an array of entries to maintain order
  const modelLayerEntries: [string, any][] = []

  // Track channel sizes for proper connectivity
  let currentChannels = 3 // Default starting with RGB images
  let currentSize = 224 // Default image size
  let convCount = 0
  let poolCount = 0
  let fclCount = 0
  let inputCount = 0

  // Process each node in the order determined by the graph traversal
  layerNodes.forEach((node) => {
    if (isInputBlock(node)) {
      inputCount++
      modelLayerEntries.push([
        `fcl_input${inputCount}`,
        {
          size: node.data.size
        },
      ])

      currentSize = node.data.size
    } else if (isConvolutionalBlock(node)) {
      convCount++
      const outChannels = 16 * Math.pow(2, convCount - 1) // 16, 32, 64, etc.

      modelLayerEntries.push([
        `conv${convCount}`,
        {
          in_channels: currentChannels,
          out_channels: outChannels,
          kernel_size: node.data.size,
          padding: node.data.padding,
          act: "relu", // Default activation for conv layers
        },
      ])

      // Update current channels for next layer
      currentChannels = outChannels
    } else if (isPoolingBlock(node)) {
      poolCount++
      modelLayerEntries.push([
        `pool${poolCount}`,
        {
          kernel_size: node.data.size,
          stride: node.data.size, // Usually stride equals kernel_size in pooling
        },
      ])

      // Update current size after pooling
      currentSize = Math.floor(currentSize / node.data.size)
    } else if (isHiddenBlock(node)) {
      fclCount++
      modelLayerEntries.push([
        `fcl_hidden${fclCount}`,
        {
            in_features: currentChannels,
            out_features: node.data.size,
            act: node.data.activation,
        },
      ])
        // Update for next layer
      currentChannels = node.data.size
    } else if (isOutputBlock(node)) {
      // Assume output size is 10 classes by default, or get from node if available
      const outputSize = 10

      modelLayerEntries.push([
        `fcl_output1`,
        {
          in_features: currentChannels,
          out_features: outputSize,
          act: "softmax", // Default activation for output layer
        },
      ])
    }
  })

  // Convert the entries array to an object, preserving order
  const modelLayers = Object.fromEntries(modelLayerEntries)

  return modelLayers
}