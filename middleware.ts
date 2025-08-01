// middleware.ts
import { updateSession } from './app/utils/supabase/middleware'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // ✅ Update session and handle redirects if needed
  return await updateSession(request)
}

// ✅ Config to apply middleware to specific routes
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/settings/:path*'], // Add protected routes
}
