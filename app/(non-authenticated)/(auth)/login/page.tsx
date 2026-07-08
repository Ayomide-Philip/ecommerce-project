"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
  };

  return (
    <div className="min-h-screen mt-15 sm:mt-16 lg:mt-18 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#F4F4F2] dark:bg-[#0B0B0D]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-1/2 top-10 hidden h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(61,107,255,0.08)_0%,rgba(11,11,13,0)_70%)] dark:md:block"
      />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <Link
            href="/"
            className="inline-block mb-6 hover:opacity-80 transition"
          >
            <h1 className="font-display text-2xl sm:text-3xl font-medium text-[#151519] dark:text-white">
              Ēlan
            </h1>
          </Link>
          <h2 className="font-display text-2xl sm:text-3xl font-medium text-[#151519] dark:text-white mb-2">
            Welcome Back
          </h2>
          <p className="text-[#151519]/70 dark:text-white/70 text-sm">
            Sign in to your account to continue shopping
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-[#151519] dark:text-white mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#151519]/50 dark:text-white/50 pointer-events-none" />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/12 dark:border-white/12 text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-[#151519] dark:text-white mb-2"
            >
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#151519]/50 dark:text-white/50 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-10 pr-12 py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/12 dark:border-white/12 text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition "
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#151519]/50 dark:text-white/50 hover:text-[#151519] dark:hover:text-white transition"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border border-black/30 dark:border-white/30 bg-black/5 dark:bg-white/5 accent-accent cursor-pointer"
              />
              <span className="text-[#151519]/70 dark:text-white/70">
                Remember me
              </span>
            </label>
            <Link
              href="/forgot-password"
              className="text-accent hover:text-accent/80 transition font-medium"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white font-mono text-sm uppercase tracking-[0.16em] py-3 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 font-medium"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-black/20 dark:bg-white/20" />
          <span className="text-black/50 dark:text-white/50 text-sm">or</span>
          <div className="flex-1 h-px bg-black/20 dark:bg-white/20" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-3">
          <button className="py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/12 dark:border-white/12 hover:bg-black/10 dark:hover:bg-white/10 transition text-[#151519] dark:text-white text-sm font-medium ">
            Google
          </button>
          <button className="py-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/12 dark:border-white/12 hover:bg-black/10 dark:hover:bg-white/10 transition text-[#151519] dark:text-white text-sm font-medium ">
            Apple
          </button>
        </div>

        {/* Sign Up Link */}
        <p className="text-center text-[#151519]/70 dark:text-white/70 text-sm mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-accent hover:text-accent/80 font-medium transition"
          >
            Sign up
          </Link>
        </p>

        {/* Terms */}
        <p className="text-center text-[#151519]/50 dark:text-white/50 text-xs mt-6">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </div>
    </div>
  );
}
