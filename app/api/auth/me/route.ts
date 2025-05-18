import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/user"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function GET() {
  try {
    console.log("Auth check started")
    const cookieStore = await cookies()
    const token = cookieStore.get("token")?.value

    if (!token) {
      console.log("No token found in cookies")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    console.log("Token found in cookies, verifying...")

    try {
      // Verify token
      const decoded = jwt.verify(token, JWT_SECRET) as { id: string }
      console.log(`Token verified, user ID: ${decoded.id}`)

      await connectToDatabase()

      // Get user from database
      const user = await User.findById(decoded.id)

      if (!user) {
        console.log(`User not found for ID: ${decoded.id}`)
        return NextResponse.json({ error: "User not found" }, { status: 404 })
      }

      console.log(`User found: ${user.email}`)

      return NextResponse.json({
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          avatarUrl: user.avatarUrl,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        },
      })
    } catch (jwtError) {
      console.error("JWT verification error:", jwtError)
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth check error:", error)
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
  }
}