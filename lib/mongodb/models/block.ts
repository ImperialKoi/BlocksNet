import * as mongoose from "mongoose"

// Define interfaces for our documents
export interface BlockDoc extends mongoose.Document {
  blockId: string
  projectId: mongoose.Types.ObjectId
  blockType: string
  positionX: number
  positionY: number
  data: any
  style?: any
  createdAt: Date
  updatedAt: Date
}

export interface EdgeDoc extends mongoose.Document {
  edgeId: string
  projectId: mongoose.Types.ObjectId
  source: string
  target: string
  createdAt: Date
  updatedAt: Date
}

const BlockSchema = new mongoose.Schema({
  blockId:   { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
  blockType: {
    type: String,
    required: true,
    enum: [
      "startBlock", 
      "inputBlock",
      "hiddenBlock",
      "convolutionalBlock",
      "poolingBlock",
      "codeBlock",
      "trainingBlock",
      "outputBlock",
      "classifierBlocks"
      // …any others you use…
    ],
  },
  positionX: { type: Number, required: true },
  positionY: { type: Number, required: true },
  data:      { type: mongoose.Schema.Types.Mixed, required: true },
  style:     { type: mongoose.Schema.Types.Mixed },
}, {
  timestamps: true,
});

// Define a schema for the edges (connections between blocks)
const EdgeSchema = new mongoose.Schema(
  {
    edgeId: {
      type: String,
      required: true,
    },
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    target: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

// Create models with the same pattern as the Project model
export const Block =
  (mongoose.models?.Block as mongoose.Model<BlockDoc>) || mongoose.model<BlockDoc>("Block", BlockSchema)

export const Edge = (mongoose.models?.Edge as mongoose.Model<EdgeDoc>) || mongoose.model<EdgeDoc>("Edge", EdgeSchema)