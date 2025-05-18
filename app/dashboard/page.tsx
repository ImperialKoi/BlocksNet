import { getAuthUser } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProjectCard } from "@/components/project-card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import { connectToDatabase } from "@/lib/mongodb/connection"
import Project from "@/lib/mongodb/models/project"

interface Project {
  _id: string;
  name: string;
  description: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export default async function DashboardPage() {
  // Check if user is authenticated
  const user = await getAuthUser()
  if (!user) {
    redirect("/login")
  }

  // Connect to database
  await connectToDatabase()

  // Fetch user's projects
  const projects: Project[] = (await Project
  .find({ userId: user._id })
  .sort({ updatedAt: -1 })
  .lean()) as unknown as Project[];
  
  
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome, {user.username || "User"}</h1>
            <p className="mt-1 text-gray-600 dark:text-gray-300">Manage your neural network projects</p>
          </div>
          <Link href="/projects/new" className="mt-4 md:mt-0">
            <Button className="flex items-center gap-2">
              <PlusCircle className="h-4 w-4" />
              New Project
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects && projects.length > 0 ? (
            projects.map((project) => <ProjectCard key={project._id.toString()} project={project} />)
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-lg shadow p-6 text-center">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No projects yet</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create your first neural network project to get started.
              </p>
              <Link href="/projects/new">
                <Button>Create Project</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
