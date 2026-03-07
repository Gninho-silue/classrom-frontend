import { useState } from "react";
import { useLogin, useLink } from "@refinedev/core";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { InputPassword } from "@/components/refine-ui/form/input-password";
import { GraduationCap, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Link = useLink();
  const { mutate: login, isLoading } = useLogin();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({ email, password });
  };

  return (
    <div className="min-h-svh flex flex-col items-center justify-center px-6 py-8 bg-background">
      <div className="flex items-center gap-3 mb-6">
        <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <GraduationCap className="size-7 text-primary" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Classroom</h1>
      </div>

      <Card className="w-full sm:w-[440px] border-none shadow-lg bg-card/60 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-primary">Sign in</CardTitle>
          <CardDescription>Welcome back to your admin dashboard</CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <InputPassword
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>
        </CardContent>

        <Separator />

        <CardFooter className="pt-4 justify-center">
          <p className="text-sm text-muted-foreground">
            No account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
