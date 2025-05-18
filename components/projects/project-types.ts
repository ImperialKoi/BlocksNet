// types/project.ts (or wherever)
export interface ProjectType {
  _id: string;
  name: string;
  description?: string;
  userId: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}