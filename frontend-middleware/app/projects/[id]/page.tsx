import { getAuthUser } from "@/lib/auth"
import { redirect, notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Edit, Share2 } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb/connection"
import Project from "@/lib/mongodb/models/project"
import {Block} from "@/lib/mongodb/models/block"
import Connection from "@/lib/mongodb/models/connection"
import { ProjectType } from "@/components/projects/project-types"

interface ProjectPageProps {
  params: {
    id: string
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  // Check if user is authenticated
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }

  // Connect to database
  await connectToDatabase()

  // Fetch project
  const project = await Project
    .findById(params.id)
    .lean<ProjectType>();   // <— tell TS “this doc is a Project”

  if (!project) notFound();

  // Check if user has access to this project
  if (project.userId.toString() !== user._id.toString() && !project.isPublic) {
    redirect("/dashboard")
  }

  // Fetch blocks for this project
  const blocks = await Block.find({ projectId: params.id }).lean()

  // Fetch connections for this project
  const connections = await Connection.find({ projectId: params.id }).lean()

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost" className="flex items-center gap-2 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{project.name}</h1>
              {project.description && <p className="mt-2 text-gray-600 dark:text-gray-300">{project.description}</p>}
            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              {project.userId.toString() === user._id.toString() && (
                <Link href={`/projects/${params.id}/edit`}>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Project
                  </Button>
                </Link>
              )}
              <Button variant="outline" className="flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                {project.isPublic ? "Share" : "Make Public"}
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Project Canvas</h2>
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 h-96 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">
              {blocks && blocks.length > 0
                ? `This project has ${blocks.length} blocks and ${connections?.length || 0} connections.`
                : 'This project is empty. Click "Edit Project" to start building.'}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Project Details</h2>
            <dl className="space-y-4">
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Created</dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {new Date(project.createdAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Last Updated</dt>
                <dd className="mt-1 text-gray-900 dark:text-white">
                  {new Date(project.updatedAt).toLocaleDateString()}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Visibility</dt>
                <dd className="mt-1 text-gray-900 dark:text-white">{project.isPublic ? "Public" : "Private"}</dd>
              </div>
            </dl>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Block Statistics</h2>
            {blocks && blocks.length > 0 ? (
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Blocks</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{blocks.length}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Block Types</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">
                    {Array.from(new Set(blocks.map((block) => block.blockType))).length}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Connections</dt>
                  <dd className="mt-1 text-gray-900 dark:text-white">{connections?.length || 0}</dd>
                </div>
              </dl>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No blocks have been added to this project yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
