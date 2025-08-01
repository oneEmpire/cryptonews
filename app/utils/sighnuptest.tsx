import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const signUpUser = async (email: string, password: string, username: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username }, // Add metadata for the user
    },
  });

  if (error) {
    console.error("Signup Error:", error.message);
    return { success: false, message: error.message };
  }

  console.log("Signup Successful:", data);
  return { success: true, data, message: "Check your email to verify your account." };
};
