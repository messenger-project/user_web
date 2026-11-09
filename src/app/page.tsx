
"use client";

import { useState, type FormEvent } from "react";

export default function HomePage() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Connect your authentication API here.
      // Redirect only after successful authentication.

      setError("Authentication is not configured yet.");
    } catch {
      setError("Unable to sign in. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-[#E8EDF0] p-3 sm:p-6">
      <div className="grid w-full max-w-[900px] overflow-hidden rounded-2xl bg-white shadow-[0_20px_70px_rgba(2,57,79,0.12)] md:min-h-[520px] md:grid-cols-[0.9fr_1.1fr]">
        {/* Brand panel */}
        <section className="relative flex flex-col justify-between overflow-hidden bg-[#02394F] px-7 py-8 text-white sm:px-10 md:px-12 md:py-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#008EED]">
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.4-5.1a8.5 8.5 0 1 1 16.6-4.4Z" />
                  <path d="M8 10h8M8 14h5" />
                </svg>
              </div>

              <span className="text-lg font-semibold tracking-tight">
                Messenger AI
              </span>
            </div>

            <div className="mt-8 hidden md:block">
              <div className="mb-5 h-1 w-12 rounded-full bg-[#FD7E27]" />
              <h1 className="text-4xl font-semibold leading-tight tracking-tight">
                Messenger
                <span className="block text-[#05A7F7]">AI</span>
              </h1>
            </div>
          </div>

          <div className="mt-6 hidden items-center gap-2 md:flex">
            <span className="h-2 w-2 rounded-full bg-[#FD7E27]" />
            <span className="text-xs text-white/60">
              Internal workspace
            </span>
          </div>

          {/* Brand color stripe */}
          <div className="absolute bottom-0 left-0 flex h-1.5 w-full">
            <div className="w-3/5 bg-[#008EED]" />
            <div className="w-1/4 bg-[#05A7F7]" />
            <div className="flex-1 bg-[#FD7E27]" />
          </div>
        </section>

        {/* Login panel */}
        <section className="flex items-center justify-center px-6 py-10 sm:px-12 sm:py-14">
          <div className="w-full max-w-[340px]">
            <div className="mb-8">
              <div className="mb-3 h-1 w-9 rounded-full bg-[#008EED]" />
              <h2 className="text-[28px] font-semibold tracking-tight text-[#02394F]">
                Sign in
              </h2>
              <p className="mt-2 text-sm text-[#69727D]">
                Enter your account credentials.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-[#02394F]"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  autoComplete="email"
                  required
                  className="h-12 w-full rounded-lg border border-[#D6E0E6] bg-[#F8FAFB] px-4 text-sm text-[#02394F] outline-none transition-colors placeholder:text-[#9CA8B0] focus:border-[#008EED] focus:bg-white focus:ring-2 focus:ring-[#008EED]/10"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-[#02394F]"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) =>
                      setPassword(event.target.value)
                    }
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="h-12 w-full rounded-lg border border-[#D6E0E6] bg-[#F8FAFB] px-4 pr-16 text-sm text-[#02394F] outline-none transition-colors placeholder:text-[#9CA8B0] focus:border-[#008EED] focus:bg-white focus:ring-2 focus:ring-[#008EED]/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-[#008EED] hover:text-[#02394F]"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {error && (
                <p role="alert" className="text-sm text-red-600">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-3 rounded-lg bg-[#008EED] text-sm font-semibold text-white transition-colors hover:bg-[#0079CC] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#008EED] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span aria-hidden="true">→</span>}
              </button>
            </form>

            <div className="mt-9 border-t border-[#E8EDF0] pt-5">
              <p className="text-center text-xs text-[#89969F]">
                Staffgate · Messenger AI
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
