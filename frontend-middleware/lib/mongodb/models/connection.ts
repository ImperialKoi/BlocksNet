import mongoose from "mongoose"

const ConnectionSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  sourceBlockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    required: true,
  },
  targetBlockId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Block",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

export default mongoose.models.Connection || mongoose.model("Connection", ConnectionSchema)
