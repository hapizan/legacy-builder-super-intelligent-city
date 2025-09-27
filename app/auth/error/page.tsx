import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

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
          <Card className="glow-orange">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center space-x-2">
                <span>⚠️</span>
                <span>Authentication Error</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">An error occurred during authentication:</p>
                  <p className="text-sm font-mono bg-muted p-2 rounded text-destructive">{params.error}</p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">An unspecified authentication error occurred.</p>
              )}
              <div className="pt-4 space-y-2">
                <Button asChild className="w-full">
                  <Link href="/auth/login">Try Again</Link>
                </Button>
                <Button asChild variant="outline" className="w-full bg-transparent">
                  <Link href="/auth/sign-up">Create New Account</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
