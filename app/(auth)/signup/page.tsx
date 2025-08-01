"use client"

import { useState } from "react"
import { Eye, EyeOff, Heart, Stethoscope, Activity, UserPlus } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import LinearBuffer from "../../../components/loader" // Ensure this is a client component

// Form validation schema using Zod
const formSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters long." }).max(20),
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }).max(20),
})

export default function SignUpForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>("")
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const router = useRouter()

  // Form handler with React Hook Form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", email: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    setErrorMessage(undefined)

    try {
      const response = await fetch("/api/create-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })

      const result = await response.json()

      if (!result.success) {
        setErrorMessage(result.message || "Error creating a new user account")
        toast.error(result.message || "Error creating a new user account")
      } else {
        toast.success("Account created successfully!")
        router.push("/confirmyourmail")
      }
    } catch (error) {
      console.error("Unexpected error during signup:", error)
      setErrorMessage("An unexpected error occurred. Please try again.")
      toast.error("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="relative">
              {/* Main logo circle */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-r from-red-600 to-red-700 flex items-center justify-center shadow-lg">
                <Heart className="h-10 w-10 text-white" />
              </div>
              {/* Floating medical icons */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center">
                <Stethoscope className="h-4 w-4 text-red-600" />
              </div>
              <div className="absolute -bottom-1 -left-2 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center">
                <Activity className="h-3 w-3 text-red-600" />
              </div>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            <span className="text-red-600">HealthNews</span>
            <span className="text-gray-600">.Guru</span>
          </h1>
          <p className="text-gray-600">Join the global health news community</p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          {isLoading && <LinearBuffer />}

          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-3">
              <UserPlus className="h-6 w-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
            <p className="text-gray-600">Join thousands of health professionals and enthusiasts</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-500 rounded-full flex-shrink-0"></div>
                {errorMessage}
              </div>
            </div>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Username Field */}
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                        placeholder="Choose a username"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                        placeholder="Email address"
                        type="email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 pr-12 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                          placeholder="Create a strong password"
                          type={isPasswordVisible ? "text" : "password"}
                          {...field}
                        />
                        <button
                          type="button"
                          onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-600 transition-colors"
                        >
                          {isPasswordVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage className="text-red-500 text-sm mt-1" />
                  </FormItem>
                )}
              />

              {/* Password Requirements */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-xs text-blue-800 font-medium mb-2">Password requirements:</p>
                <ul className="text-xs text-blue-700 space-y-1">
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    At least 8 characters long
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                    Mix of letters, numbers, and symbols
                  </li>
                </ul>
              </div>

              {/* Terms and Privacy */}
              <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded-lg">
                By creating an account, you agree to our{" "}
                <a href="/terms" className="text-red-600 hover:text-red-700 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="/privacy" className="text-red-600 hover:text-red-700 hover:underline">
                  Privacy Policy
                </a>
                .
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating Account...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>
          </Form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-red-600 hover:text-red-700 hover:underline font-semibold transition-colors"
              >
                Sign In
              </a>
            </p>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Join HealthNews.Guru to:</p>
              <div className="grid grid-cols-1 gap-3 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Get personalized health news recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Receive breaking health news alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Save and bookmark important articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Join discussions with health professionals</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} HealthNews.Guru. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-400">
            <a href="/privacy" className="hover:text-red-600 transition-colors">
              Privacy Policy
            </a>
            <span>•</span>
            <a href="/terms" className="hover:text-red-600 transition-colors">
              Terms of Service
            </a>
            <span>•</span>
            <a href="/contact" className="hover:text-red-600 transition-colors">
              Contact Support
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
