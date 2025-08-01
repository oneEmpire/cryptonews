"use server"

import { createClient } from "../../app/utils/supabase/server"

interface props{
  email: string;
  password: string;
}
export async function loginUser({email, password}:props) {
  const supabase = await createClient()


  const {error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (!error) {
 
    return { success: true, message: "successfully login"}
  }
  console.error("Error during sign in:", error.message)
  return { success: false , message:"Successful login" }
}

