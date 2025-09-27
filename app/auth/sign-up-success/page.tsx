import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <span className="text-4xl">🏙️</span>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Cyberjaya</h1>
                <p className="text-sm text-muted-foreground">Smart City System</p>
              </div>
            </div>
          </div>
          <Card className="glow-green">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <span>✅</span>
                <span>Account Created Successfully!</span>
              </CardTitle>
              <CardDescription>Check your email to verify your account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Thank you for registering with the Cyberjaya Smart City System. We've sent a verification email to your
                inbox. Please check your email and click the verification link to activate your account.
              </p>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">Next steps:</p>
                <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                  <li>• Check your email inbox (and spam folder)</li>
                  <li>• Click the verification link</li>
                  <li>• Return to sign in to your account</li>
                </ul>
              </div>
              <div className="pt-4">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Return to Sign In</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
