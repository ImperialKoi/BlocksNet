import { NextResponse } from "next/server"
import { connectToDatabase } from "@/lib/mongodb/connection"
import User from "@/lib/mongodb/models/user"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export async function POST(request: Request) {
  try {
    console.log("Login attempt started")
    await connectToDatabase()
    const { email, password } = await request.json()
    console.log(`Login attempt for email: ${email}`)

    // Find user by email
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
      console.log(`User not found for email: ${email}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password)

    if (!isMatch) {
      console.log(`Password mismatch for user: ${email}`)
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    console.log(`User authenticated successfully: ${email}`)

    // Create token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" })
    console.log(`JWT token created for user: ${email}`)

    // Set cookie
    const cookieStore = await cookies()
    cookieStore.set({
      name: "token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    console.log(`Cookie set for user: ${email}`)

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

    return NextResponse.json({ user: userWithoutPassword })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "An error occurred during login" }, { status: 500 })
  }
}