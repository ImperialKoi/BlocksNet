import { NextResponse } from "next/server"

// This route handler will check the status of a training job
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trainingId = params.id

    // In a real implementation, you would check the status on your ML server
    // For demo purposes, we'll simulate progress based on time elapsed
    const startTime = Number.parseInt(trainingId.split("_")[1])
    const currentTime = Date.now()
    const elapsedSeconds = (currentTime - startTime) / 1000

    // Simulate a training job that takes about 30 seconds
    const progress = Math.min(Math.floor((elapsedSeconds / 30) * 100), 100)
    const isComplete = progress >= 100

    // Calculate metrics based on progress
    const currentEpoch = Math.min(Math.floor((progress / 100) * 10) + 1, 10)
    const accuracy = Math.min(0.5 + (progress / 100) * 0.45, 0.95)
    const loss = Math.max(1 - (progress / 100) * 0.9, 0.1)

    // If complete, include model weights URL
    const modelData = isComplete
      ? {
          modelUrl: `/api/models/${trainingId}`,
          finalAccuracy: accuracy,
          finalLoss: loss,
        }
      : null

    return NextResponse.json({
      trainingId,
      progress,
      currentEpoch,
      totalEpochs: 10,
      metrics: {
        accuracy,
        loss,
      },
      isComplete,
      modelData,
    })
  } catch (error) {
    console.error("Error checking training status:", error)
    return NextResponse.json({ success: false, error: "Failed to check training status" }, { status: 500 })
  }
}