import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/user"

export async function POST(request: Request) {
  try {
    await connectToDatabase()
    const { username, email, password } = await request.json()

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    })

    if (existingUser) {
      return NextResponse.json({ error: "User with this email or username already exists" }, { status: 400 })
    }

    // Create new user
    const user = await User.create({
      username,
      email,
      password,
    })

    // Don't return password
    const userWithoutPassword = {
      _id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    }

    return NextResponse.json({ user: userWithoutPassword }, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "An error occurred during registration" }, { status: 500 })
  }
}
