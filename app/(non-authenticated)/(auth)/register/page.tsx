"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = "Full name is required";
    }

    if (name?.trim().length < 5) {
      newErrors.name = "Full name must be at least 5 characters long";
    } else if (!name?.trim().includes(" ")) {
      newErrors.name = "Full name must contain a space";
    }

    if (!email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);
    try {
      const request = await fetch(`/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const response = await request.json();

      if (!request.ok || response?.error) {
        setErrors((prev) => ({
          ...prev,
          [response?.errorType]: response?.error,
        }));
        return;
      }

      window.location.href = "/login";
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-15 sm:mt-16 lg:mt-18 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8 bg-[#F4F4F2] dark:bg-[#0B0B0D]">
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-x-1/2 top-10 hidden h-72 w-72 -translate-x-1/2 bg-[radial-gradient(circle,rgba(61,107,255,0.08)_0%,rgba(11,11,13,0)_70%)] dark:md:block"
      />

      <div className="w-full max-w-md relative z-10">
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
            Create Account
          </h2>
          <p className="text-[#151519]/70 dark:text-white/70 text-sm">
            Join us and start your fashion journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-[#151519] dark:text-white mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#151519]/50 dark:text-white/50 pointer-events-none" />
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: "" }));
                }}
                placeholder="John Doe"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                  errors.name
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/12 dark:border-white/12"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.name}
              </p>
            )}
          </div>

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
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email)
                    setErrors((prev) => ({ ...prev, email: "" }));
                }}
                placeholder="you@example.com"
                className={`w-full pl-10 pr-4 py-3 rounded-xl bg-black/5 dark:bg-white/5 border text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                  errors.email
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/12 dark:border-white/12"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.email}
              </p>
            )}
          </div>

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
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password)
                    setErrors((prev) => ({ ...prev, password: "" }));
                }}
                placeholder="••••••••"
                minLength={8}
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-black/5 dark:bg-white/5 border text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                  errors.password
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/12 dark:border-white/12"
                }`}
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
            {errors.password && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-[#151519] dark:text-white mb-2"
            >
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#151519]/50 dark:text-white/50 pointer-events-none" />
              <input
                id="confirmPassword"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword)
                    setErrors((prev) => ({ ...prev, confirmPassword: "" }));
                }}
                placeholder="••••••••"
                className={`w-full pl-10 pr-12 py-3 rounded-xl bg-black/5 dark:bg-white/5 border text-[#151519] dark:text-white placeholder:text-[#151519]/50 dark:placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition ${
                  errors.confirmPassword
                    ? "border-red-500 dark:border-red-400"
                    : "border-black/12 dark:border-white/12"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#151519]/50 dark:text-white/50 hover:text-[#151519] dark:hover:text-white transition"
              >
                {showConfirm ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 dark:text-red-400 text-xs mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <label className="flex items-start gap-2 cursor-pointer text-sm">
            <input
              type="checkbox"
              required
              className="mt-0.5 w-4 h-4 rounded border border-black/30 dark:border-white/30 bg-black/5 dark:bg-white/5 accent-accent cursor-pointer shrink-0"
            />
            <span className="text-[#151519]/70 dark:text-white/70">
              I agree to the{" "}
              <Link href="/terms" className="text-accent hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-accent hover:underline">
                Privacy Policy
              </Link>
            </span>
          </label>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-accent text-white font-mono text-sm uppercase tracking-[0.16em] py-3 rounded-xl hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition duration-300 font-medium"
          >
            {isLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-[#151519]/70 dark:text-white/70 text-sm mt-6">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-accent hover:text-accent/80 font-medium transition"
          >
            Sign in
          </Link>
        </p>

        <p className="text-center text-[#151519]/50 dark:text-white/50 text-xs mt-6">
          By creating an account, you agree to our{" "}
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
