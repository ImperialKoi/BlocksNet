"use client"

import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import { Save } from "lucide-react"

interface AutoSaveIndicatorProps {
  projectId: string
  nodes: any[]
  edges: any[]
  hasChanges: boolean
  onSaveComplete: () => void
}

export default function AutoSaveIndicator({
  projectId,
  nodes,
  edges,
  hasChanges,
  onSaveComplete,
}: AutoSaveIndicatorProps) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const { toast } = useToast()

  useEffect(() => {
    let saveTimeout: NodeJS.Timeout

    if (hasChanges) {
      setStatus("saving")
      saveTimeout = setTimeout(() => {
        saveFlow()
      }, 2000) // Auto-save after 2 seconds of inactivity
    }

    return () => {
      if (saveTimeout) clearTimeout(saveTimeout)
    }
  }, [nodes, edges, hasChanges])

  const saveFlow = async () => {
    if (!projectId || !hasChanges) return

    try {
      // Make sure all nodes have valid positions
      const validatedNodes = nodes.map((node) => {
        // Ensure position has x and y properties
        if (!node.position || typeof node.position.x !== "number" || typeof node.position.y !== "number") {
          return {
            ...node,
            position: { x: node.position?.x || 0, y: node.position?.y || 0 },
          }
        }
        return node
      })

      const response = await fetch(`/api/projects/${projectId}/flow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nodes: validatedNodes,
          edges,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save flow")
      }

      setStatus("saved")
      onSaveComplete()

      // Reset to idle after showing saved for a while
      setTimeout(() => {
        setStatus("idle")
      }, 3000)
    } catch (error) {
      console.error("Error auto-saving flow:", error)
      setStatus("error")
      toast({
        title: "Auto-save failed",
        description: "Failed to save your changes automatically",
        variant: "destructive",
      })
    }
  }

  if (status === "idle") return null

  return (
    <div className="flex items-center gap-2 text-sm">
      <Save className="h-4 w-4" />
      {status === "saving" && <span>Saving...</span>}
      {status === "saved" && <span>Saved</span>}
      {status === "error" && <span className="text-red-500">Save failed</span>}
    </div>
  )
}
