"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Lock, User, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toaster";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { cn } from "@/lib/utils";

type AuthMode = "signin" | "signup";

export function AuthSwitch() {
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const supabase = createClientComponentClient();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Welcome back!");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to sign in";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;

      if (data.user) {
        toast.success("Account created! Please check your email to verify.");
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create account";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const isSignIn = mode === "signin";

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white dark:from-gray-900 dark:to-gray-800 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-bold text-green-600 dark:text-green-400">AgriSakhi</h1>
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            {isSignIn ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {isSignIn ? "Sign in to continue to your account" : "Join thousands of farmers using AgriSakhi"}
          </p>
        </div>

        {/* Auth Mode Switch */}
        <div className="flex items-center justify-center">
          <div className="inline-flex rounded-lg border-2 border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 p-1">
            <button
              onClick={() => setMode("signin")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                isSignIn
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"
              )}
              suppressHydrationWarning
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={cn(
                "px-6 py-2 rounded-md text-sm font-semibold transition-all duration-200",
                !isSignIn
                  ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                  : "text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-gray-700"
              )}
              suppressHydrationWarning
            >
              Sign Up
            </button>
          </div>
        </div>

        <Card className="border-2 border-green-100 dark:border-green-900 shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl text-gray-900 dark:text-white">
              {isSignIn ? "Sign In" : "Sign Up"}
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isSignIn
                ? "Enter your credentials to access your account"
                : "Free forever • 50 detections/month • No credit card required"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={isSignIn ? handleSignIn : handleSignUp} className="space-y-4">
              {/* Full Name - Only for Sign Up */}
              {!isSignIn && (
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium text-gray-900 dark:text-white">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      id="fullName"
                      type="text"
                      placeholder="John Doe"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                      required
                      suppressHydrationWarning
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-900 dark:text-white">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                    required
                    suppressHydrationWarning
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  {isSignIn && (
                    <Link
                      href="/auth/reset-password"
                      className="text-xs text-green-600 dark:text-green-400 hover:underline font-medium"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 border-2 border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-all"
                    required
                    minLength={8}
                    suppressHydrationWarning
                  />
                </div>
                {!isSignIn && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Must be at least 8 characters
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={isLoading}
                suppressHydrationWarning
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {isSignIn ? "Signing in..." : "Creating account..."}
                  </>
                ) : (
                  <>{isSignIn ? "Sign In" : "Create Account"}</>
                )}
              </Button>
            </form>

            {/* Terms - Only for Sign Up */}
            {!isSignIn && (
              <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-green-600 dark:text-green-400 hover:underline font-medium">
                  Privacy Policy
                </Link>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Guest Mode */}
        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-200 dark:border-blue-800 shadow-md">
          <CardContent className="pt-6">
            <p className="text-sm text-center text-gray-700 dark:text-gray-300 mb-4 font-medium">
              🎁 Want to try first? Use guest mode with 5 free detections
            </p>
            <Link href="/detect">
              <Button 
                variant="outline" 
                className="w-full border-2 border-blue-400 dark:border-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/40 font-semibold" 
                suppressHydrationWarning
              >
                Continue as Guest
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Footer Links */}
        <div className="text-center space-y-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Having trouble?{" "}
            <Link href="/support" className="text-green-600 dark:text-green-400 hover:underline font-medium">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
