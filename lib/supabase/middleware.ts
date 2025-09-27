import { NextResponse, type NextRequest } from "next/server"

// Mock middleware that allows all requests without authentication
export async function updateSession(request: NextRequest) {
  // Simply pass through all requests without authentication checks
  // In a real app with auth, you would check user sessions here
  return NextResponse.next({
    request,
  })
}
