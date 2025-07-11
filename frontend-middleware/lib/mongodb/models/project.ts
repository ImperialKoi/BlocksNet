import * as mongoose from "mongoose"

export interface ProjectDoc extends mongoose.Document {
  name: string
  userId: mongoose.Types.ObjectId
  isPublic: boolean
  targetIds: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const ProjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a project name"],
      trim: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    targetIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Target",
      },
    ],
  },
  {
    timestamps: true,
  },
)

const ProjectModel =
  (mongoose.models?.Project as mongoose.Model<ProjectDoc>) || mongoose.model<ProjectDoc>("Project", ProjectSchema)

export default ProjectModel