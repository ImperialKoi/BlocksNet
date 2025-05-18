import { cookies } from "next/headers"
import jwt from "jsonwebtoken"
import { connectToDatabase } from "./mongodb/connection"
import User from "./mongodb/models/user"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function getAuthUser() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      return null
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string }

    await connectToDatabase()

    // Get user from database
    const user = await User.findById(decoded.id)

    if (!user) {
      return null
    }

    return user
  } catch (error) {
    console.error("Auth check error:", error)
    return null
  }
}