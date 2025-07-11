"use client"

import type React from "react"
import type { TrainingStatus, ClassificationResult } from "@/types/flow"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Loader2, Upload, ArrowLeft, Check, X, AlertTriangle } from "lucide-react"

export default function ModelPage() {
  const router = useRouter()
  const [stage, setStage] = useState<"loading" | "ready" | "classifying" | "result" | "error">("loading")
  const [trainingId, setTrainingId] = useState<string | null>(null)
  const [trainingStatus, setTrainingStatus] = useState<TrainingStatus | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [classificationResult, setClassificationResult] = useState<ClassificationResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  // Initialize training when the page loads
  useEffect(() => {
    const storedTrainingId = localStorage.getItem("trainingId")

    if (storedTrainingId) {
      // If we have a training ID, check its status
      setTrainingId(storedTrainingId)
    } else {
      // Otherwise, start a new training job
      const modelJson = localStorage.getItem("modelArchitecture")
      const trainingData = localStorage.getItem("trainingParams")

      if (!modelJson) {
        setError("No model architecture found. Please go back to the editor and compile again.")
        setStage("error")
        return
      }
      if (!trainingData) {
        setError("No training data found. Please go back to the editor and compile again.")
        setStage("error")
        return
      }

      const newList = [trainingData, modelJson];

      startTraining(newList)
    }
  }, [])

  // Poll for training status updates
  useEffect(() => {
    if (!trainingId || stage !== "loading") return

    const intervalId = setInterval(async () => {
      try {
        clearInterval(intervalId)
        setStage("ready")
      } catch (err) {
        console.error("Error checking training status:", err)
        setError("Failed to check training status. Please try again.")
        setStage("error")
        clearInterval(intervalId)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [trainingId, stage])

  // Start a new training job
  async function startTraining(modelData: any) {
    try {
      const response = await fetch("/api/recieve_architecture", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(modelData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to start training")
      }

      const data = await response.json()
      setTrainingId(data.trainingId)

    } catch (err) {
      console.error("Error starting training:", err)
      setError(`Failed to start model training: ${err instanceof Error ? err.message : "Unknown error"}`)
      setStage("error")
    }
  }

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)

      const reader = new FileReader()
      reader.onload = (event) => {
        setSelectedImage(event.target?.result as string)
        setStage("classifying")

        // Classify the image
        classifyImage(file)
      }
      reader.readAsDataURL(file)
    }
  }

  // Classify an image using the trained model
  async function classifyImage(image: File) {
    if (!trainingId) {
      setError("No trained model available. Please train the model first.")
      setStage("error")
      return
    }

    try {
      const formData = new FormData()
      formData.append("image", image)
      formData.append("modelId", trainingId)

      const response = await fetch("/api/classify", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to classify image")
      }

      const result: ClassificationResult = await response.json()
      setClassificationResult(result)
      setStage("result")
    } catch (err) {
      console.error("Error classifying image:", err)
      setError(`Failed to classify image: ${err instanceof Error ? err.message : "Unknown error"}`)
      setStage("error")
    }
  }

  const handleBackToEditor = () => {
    router.push("/dashboard")
  }

  const handleTryAgain = () => {
    setSelectedImage(null)
    setImageFile(null)
    setClassificationResult(null)
    setStage("ready")
  }

  const handleRetry = () => {
    if (stage === "error") {
      // Clear error state
      setError(null)

      if (trainingId) {
        // If we have a training ID, go back to loading state
        setStage("loading")
      } else {
        // Otherwise, go back to the editor
        router.push("/")
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#121920] text-white flex flex-col">
      {/* Header */}
      <header className="h-16 border-b border-gray-800 flex items-center justify-between px-6">
        <div className="flex items-center">
          <button
            onClick={handleBackToEditor}
            className="flex items-center text-sm text-gray-400 hover:text-white mr-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Neural Network Model
          </h1>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        {stage === "loading" && trainingStatus && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Training Model</h2>

            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span>Progress</span>
                <span>{trainingStatus.progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-500 h-2.5 rounded-full"
                  style={{ width: `${trainingStatus.progress}%` }}
                ></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-[#253040] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Epoch</div>
                <div className="text-xl font-mono">
                  {trainingStatus.currentEpoch} / {trainingStatus.totalEpochs}
                </div>
              </div>

              <div className="bg-[#253040] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Batch</div>
                <div className="text-xl font-mono">{Math.floor(trainingStatus.progress / 10) + 1} / 10</div>
              </div>

              <div className="bg-[#253040] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Accuracy</div>
                <div className="text-xl font-mono">{trainingStatus.metrics.accuracy.toFixed(4)}</div>
              </div>

              <div className="bg-[#253040] p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Loss</div>
                <div className="text-xl font-mono">{trainingStatus.metrics.loss.toFixed(4)}</div>
              </div>
            </div>

            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Training in progress on server...</span>
            </div>
          </div>
        )}

        {stage === "loading" && !trainingStatus && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Initializing Training</h2>
            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Connecting to training server...</span>
            </div>
          </div>
        )}

        {stage === "ready" && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Model Trained Successfully</h2>

            <div className="border-2 border-dashed border-gray-600 rounded-lg p-10 text-center mb-6">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="mb-4">Upload an image to classify</p>
              <label className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md cursor-pointer">
                Select Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        )}

        {stage === "classifying" && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Classifying Image</h2>

            {selectedImage && (
              <div className="mb-6 flex justify-center">
                <div className="relative w-64 h-64 overflow-hidden rounded-lg">
                  <Image
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected image"
                    fill
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>
            )}

            <div className="flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin mr-2" />
              <span>Processing image on server...</span>
            </div>
          </div>
        )}

        {stage === "result" && classificationResult?.success && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <h2 className="text-2xl font-bold mb-6 text-center">Classification Result</h2>

            <div className="flex mb-8">
              {selectedImage && (
                <div className="w-1/2 pr-4">
                  <div className="relative w-full h-64 overflow-hidden rounded-lg">
                    <Image
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected image"
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </div>
              )}

              <div className="w-1/2 pl-4">
                <div className="bg-[#253040] p-6 rounded-lg h-full flex flex-col justify-center">
                  <div className="text-sm text-gray-400 mb-1">Prediction</div>
                  <div className="text-3xl font-bold mb-4">{classificationResult.prediction?.class}</div>

                  <div className="text-sm text-gray-400 mb-1">Confidence</div>
                  <div className="mb-2">{((classificationResult.prediction?.confidence || 0) * 100).toFixed(2)}%</div>

                  <div className="w-full bg-gray-700 rounded-full h-2.5 mb-6">
                    <div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-2.5 rounded-full"
                      style={{ width: `${(classificationResult.prediction?.confidence || 0) * 100}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center">
                    {(classificationResult.prediction?.confidence || 0) > 0.8 ? (
                      <Check className="w-5 h-5 text-green-500 mr-2" />
                    ) : (
                      <X className="w-5 h-5 text-yellow-500 mr-2" />
                    )}
                    <span
                      className={
                        (classificationResult.prediction?.confidence || 0) > 0.8 ? "text-green-500" : "text-yellow-500"
                      }
                    >
                      {(classificationResult.prediction?.confidence || 0) > 0.8
                        ? "High confidence prediction"
                        : "Low confidence prediction"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Top classes */}
            {classificationResult.prediction?.topClasses && classificationResult.prediction.topClasses.length > 1 && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3">Top Predictions</h3>
                <div className="bg-[#253040] p-4 rounded-lg">
                  {classificationResult.prediction.topClasses.map((item, index) => (
                    <div key={index} className="flex justify-between items-center mb-2">
                      <span>{item.class}</span>
                      <div className="flex items-center">
                        <div className="w-32 bg-gray-700 rounded-full h-2 mr-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${item.confidence * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm">{(item.confidence * 100).toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <button
                onClick={handleTryAgain}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md"
              >
                Classify Another Image
              </button>
            </div>
          </div>
        )}

        {stage === "error" && (
          <div className="max-w-2xl w-full bg-[#1e2530] rounded-lg p-8 shadow-lg">
            <div className="flex items-center justify-center mb-6 text-red-500">
              <AlertTriangle className="w-12 h-12" />
            </div>

            <h2 className="text-2xl font-bold mb-4 text-center">Error</h2>

            <p className="text-center mb-8">{error || "An unexpected error occurred."}</p>

            <div className="flex justify-center">
              <button
                onClick={handleRetry}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md mr-4"
              >
                Retry
              </button>

              <button
                onClick={handleBackToEditor}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-md"
              >
                Back to Editor
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}