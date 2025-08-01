"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Eye, EyeOff, Heart, Stethoscope, Activity } from "lucide-react"
import { loginUser } from "../../../components/actions/loging"
import { AuthStore } from "@/lib/AuthStore"

const formSchema = z.object({
  email: z.string().email({ message: "Enter a valid email address." }),
  password: z.string().min(8, { message: "Password must be at least 8 characters long." }).max(20),
})

export default function LoginForm() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { checkAuth, isLoggedIn } = AuthStore()

  useEffect(() => {
    if (isLoggedIn) {
      router.push("/")
    }
  }, [isLoggedIn, router])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { email: "", password: "" },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true)
    try {
      const response = await loginUser(values)
      if (response.success) {
        toast.success(response.message || "Login successful")
        await checkAuth()
        setTimeout(() => {
          router.push("/")
        }, 300)
      } else {
        toast.error(response.message || "Failed to login")
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Something went wrong")
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
          <p className="text-gray-600">Your trusted source for global health news</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to access your health news dashboard</p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Email Field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <div className="relative">
                        <Input
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 focus:bg-white transition-all"
                          placeholder="Email address"
                          type="email"
                          autoComplete="email"
                          {...field}
                        />
                      </div>
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
                          placeholder="Password"
                          type={isPasswordVisible ? "text" : "password"}
                          autoComplete="current-password"
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

              {/* Forgot Password Link */}
              <div className="flex justify-end">
                <a
                  href="/forgot-password"
                  className="text-sm text-red-600 hover:text-red-700 hover:underline transition-colors"
                >
                  Forgot your password?
                </a>
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
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>

              {/* Sign Up Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-600">
                  New to HealthNews.Guru?{" "}
                  <a
                    href="/signup"
                    className="text-red-600 hover:text-red-700 hover:underline font-semibold transition-colors"
                  >
                    Create Account
                  </a>
                </p>
              </div>
            </form>
          </Form>

          {/* Additional Features */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-sm text-gray-500 mb-4">Sign in to access:</p>
              <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Personalized news feed</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Breaking news alerts</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Save articles</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>Comment & discuss</span>
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
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
