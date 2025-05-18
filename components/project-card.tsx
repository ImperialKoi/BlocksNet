import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit, Eye, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns";

interface Project {
  _id: string
  name: string
  description: string | null
  userId: string
  isPublic: boolean
  createdAt: string
  updatedAt: string
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="truncate">{project.name}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {project.description || "No description provided"}
        </p>
        <div className="mt-4 flex items-center text-xs text-gray-500 dark:text-gray-400">
          <span>Updated at {new Date(project.updatedAt).getTime()}</span>
          <span className="mx-2">•</span>
          <span className={project.isPublic ? "text-green-600 dark:text-green-400" : ""}>
            {project.isPublic ? "Public" : "Private"}
          </span>
        </div>
      </CardContent>
      <CardFooter className="border-t pt-4 flex justify-between">
        <Link href={`/projects/${project._id}`}>
          <Button variant="outline" size="sm" className="flex items-center gap-1">
            <Eye className="h-4 w-4" />
            View
          </Button>
        </Link>
        <div className="flex gap-2">
          <Link href={`/projects/${project._id}/edit`}>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </Link>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
