import { createClient } from "../../utils/supabase/server"

interface UserType {
  email: string
  password: string
  username: string
}

// Create a named export for the POST method
export async function POST(req: Request) {
  try {
    const { email, password, username }: UserType = await req.json()

    // Await the createClient function since it's now async
    const supabase = await createClient()
    const origin = process.env.NEXT_PUBLIC_API_URL
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo:origin
      },
    })

    if (error) {
      console.error("Signup failed:", error.message)
      return new Response(JSON.stringify({ success: false, message: error.message }), { status: 400 })
    }

    console.log("Signup successful:", data)
    return new Response(JSON.stringify({ success: true, message: "Signup successful" }), { status: 200 })
  } catch (err) {
    console.error("Unexpected error:", err)
    return new Response(JSON.stringify({ success: false, message: "Unexpected error occurred" }), { status: 500 })
  }
}

