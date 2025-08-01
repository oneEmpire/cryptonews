"use client"

import { Button } from "@/components/ui/button"
import { Smartphone, Mail, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ConfirmEmailPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-yellow-500 flex items-center justify-center text-2xl font-bold text-black mb-3">
              <Smartphone className="h-8 w-8 text-black" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white mt-4">
            BEATUS<span className="text-yellow-400">VTU</span>
          </h1>
          <p className="text-gray-400 mt-2">Your VTU Partner</p>
        </div>

        <div className="bg-gray-900 rounded-xl p-8 border border-gray-800 shadow-lg text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-yellow-500/20 flex items-center justify-center">
              <Mail className="h-8 w-8 text-yellow-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Check Your Email</h2>

          <p className="text-gray-400 mb-6">
            We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify
            your account.
          </p>

          <div className="bg-gray-800/50 rounded-lg p-4 mb-6 text-sm text-gray-300">
            <p>If you don&apos;t see the email in your inbox, please check your spam folder.</p>
          </div>

          <Link href="/login">
            <Button className="flex items-center justify-center w-full bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 rounded-lg transition-colors">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Login
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} BEATUS VTU. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}

