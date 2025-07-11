// Define a union type for all possible node data types
export type NodeData =
  | { label: string } // StartBlock, OutputBlock
  | { label: string; size: number; id: string; onChange: (id: string, value: number) => void } // InputBlock
  | {
      label: string
      size: number
      activation: string
      id: string
      onChange: (id: string, param: string, value: any) => void
    } // HiddenBlock
  | {
      label: string
      size: number
      padding: number
      id: string
      onChange: (id: string, param: string, value: any) => void
    } // ConvolutionalBlock
  | { label: string; size: number; type: string; id: string; onChange: (id: string, param: string, value: any) => void } // PoolingBlock
  | {
      label: string
      code: string
      functionName: string
      parameters: Array<{ name: string; type: string }>
      returnType: string
    } // CodeBlockNode
  | {
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
    } // TrainingBlock

export interface TrainingStatus {
  trainingId: string
  progress: number
  currentEpoch: number
  totalEpochs: number
  metrics: {
    accuracy: number
    loss: number
  }
  isComplete: boolean
  modelData: {
    modelUrl: string
    finalAccuracy: number
    finalLoss: number
  } | null
}

export interface ClassificationResult {
  success: boolean
  prediction?: {
    class: string
    confidence: number
    topClasses: Array<{
      class: string
      confidence: number
    }>
  }
  error?: string
}