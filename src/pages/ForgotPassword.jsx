import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Loader2,
  Mail,
  ShieldCheck,
  Sparkles,
  Terminal,
  AlertCircle,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (event) => {
  event.preventDefault();

  setError("");
  setSuccessMessage("");

  if (!email.trim()) {
    setError("Please enter your email address.");
    return;
  }

  try {
    setLoading(true);

    const response = await fetch(
      "http://localhost:5000/api/auth/forgot-password",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message ||
          "Unable to process your password reset request."
      );
    }

    setSuccessMessage(
      data.message ||
        "If an account exists with this email, a password reset link has been sent. Please check your inbox."
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    setError(
      error.message ||
        "Something went wrong. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-15%] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-600/10 blur-[140px]" />

        <div className="absolute bottom-[-15%] left-[-10%] h-[450px] w-[450px] rounded-full bg-red-900/10 blur-[130px]" />

        <div className="absolute right-[-10%] top-[30%] h-[350px] w-[350px] rounded-full bg-red-700/5 blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      {/* Navbar */}
      <header className="relative z-10 border-b border-white/5 bg-black/40 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
          <Link
            to="/"
            className="group flex items-center gap-3"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-red-500/10 shadow-[0_0_25px_rgba(239,68,68,0.12)] transition group-hover:border-red-500/50">
              <Database
                size={19}
                className="text-red-500"
              />

              <div className="absolute inset-0 rounded-xl border border-red-500/0 transition group-hover:border-red-500/30" />
            </div>

            <div>
              <div className="text-sm font-black tracking-[0.22em]">
                SQLFORGE
              </div>

              <div className="mt-0.5 text-[8px] font-semibold uppercase tracking-[0.3em] text-neutral-600">
                Practice. Forge. Master.
              </div>
            </div>
          </Link>

          <Link
            to="/login"
            className="group flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs font-medium text-neutral-400 transition hover:border-red-500/30 hover:bg-red-500/5 hover:text-white"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            Back to Login
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="w-full max-w-5xl">
          <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">

            {/* Left information panel */}
            <section className="relative hidden overflow-hidden border-r border-white/5 bg-gradient-to-br from-red-950/20 via-[#0a0a0a] to-black p-10 lg:block xl:p-12">
              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-red-600/10 blur-[90px]" />

              <div className="relative flex h-full flex-col">
                {/* Small label */}
                <div className="mb-10 flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                    <Sparkles
                      size={13}
                      className="text-red-500"
                    />
                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Account Recovery
                  </span>
                </div>

                <div className="max-w-sm">
                  <h1 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">
                    Reset your
                    <span className="block text-red-500">
                      access.
                    </span>
                  </h1>

                  <p className="mt-6 text-sm leading-7 text-neutral-500">
                    Lost your password? No problem.
                    Enter your SQLForge account email
                    and we'll start the recovery process.
                  </p>
                </div>

                {/* Terminal decoration */}
                <div className="mt-10 overflow-hidden rounded-2xl border border-white/8 bg-black/50 shadow-2xl">
                  <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                    <span className="h-2 w-2 rounded-full bg-red-500/70" />
                    <span className="h-2 w-2 rounded-full bg-yellow-500/40" />
                    <span className="h-2 w-2 rounded-full bg-green-500/40" />

                    <span className="ml-2 text-[9px] font-medium text-neutral-700">
                      sqlforge-recovery
                    </span>
                  </div>

                  <div className="space-y-2 px-5 py-5 font-mono text-[10px] leading-6">
                    <div className="text-neutral-700">
                      <span className="text-red-500">
                        $
                      </span>{" "}
                      sqlforge auth --recover
                    </div>

                    <div className="text-neutral-500">
                      locating account...
                    </div>

                    <div className="text-neutral-500">
                      verifying recovery request...
                    </div>

                    <div className="text-green-500/80">
                      ✓ recovery channel ready
                    </div>

                    <div className="text-neutral-700">
                      waiting for secure reset...
                    </div>
                  </div>
                </div>

                {/* Feature cards */}
                <div className="mt-auto space-y-3 pt-10">
                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                      <ShieldCheck
                        size={16}
                        className="text-red-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-neutral-300">
                        Secure recovery
                      </p>

                      <p className="mt-0.5 text-[10px] text-neutral-600">
                        Your account remains protected.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">
                      <Terminal
                        size={16}
                        className="text-red-500"
                      />
                    </div>

                    <div>
                      <p className="text-xs font-semibold text-neutral-300">
                        Forge your skills
                      </p>

                      <p className="mt-0.5 text-[10px] text-neutral-600">
                        Get back to SQL practice quickly.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Right form panel */}
            <section className="relative p-7 sm:p-10 lg:p-12">
              <div className="mx-auto max-w-md">

                {/* Header */}
                <div className="mb-9">
                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.08)]">
                    <Mail
                      size={21}
                      className="text-red-500"
                    />
                  </div>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Password Recovery
                  </p>

                  <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Forgot password?
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Enter the email associated with your
                    SQLForge account to begin resetting
                    your password.
                  </p>
                </div>

                {/* Error */}
                {error && (
                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-xs leading-5 text-red-400">
                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{error}</span>
                  </div>
                )}

                {/* Success */}
                {successMessage && (
                  <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-green-500"
                      />

                      <div>
                        <p className="text-xs font-semibold text-green-400">
                          Recovery request processed
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-green-500/70">
                          {successMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form */}
                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >
                  <div>
                    <label
                      htmlFor="forgot-email"
                      className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500"
                    >
                      Account Email
                    </label>

                    <div className="group relative">
                      <Mail
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 transition group-focus-within:text-red-500"
                      />

                      <input
                        id="forgot-email"
                        type="email"
                        value={email}
                        onChange={(event) =>
                          setEmail(event.target.value)
                        }
                        placeholder="you@example.com"
                        autoComplete="email"
                        disabled={loading}
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-neutral-700 hover:border-white/15 focus:border-red-500/40 focus:bg-red-500/[0.025] focus:ring-4 focus:ring-red-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-red-600 text-sm font-bold text-white shadow-[0_12px_35px_rgba(220,38,38,0.18)] transition hover:bg-red-500 hover:shadow-[0_15px_45px_rgba(220,38,38,0.25)] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

                    {loading ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        Send Recovery Request
                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <div className="mt-7 text-center">
                  <Link
                    to="/login"
                    className="group inline-flex items-center gap-2 text-xs font-medium text-neutral-500 transition hover:text-white"
                  >
                    <ArrowLeft
                      size={13}
                      className="transition-transform group-hover:-translate-x-1"
                    />
                    Remember your password?{" "}
                    <span className="font-semibold text-red-500 group-hover:text-red-400">
                      Sign in
                    </span>
                  </Link>
                </div>

                {/* Security strip */}
                <div className="mt-10 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-700">
                  <ShieldCheck size={12} />
                  Secure SQLForge account recovery
                </div>
              </div>
            </section>
          </div>

          {/* JOE footer */}
          <div className="mt-6 flex justify-center">
            <div className="group relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-r from-red-950/20 via-black to-red-950/20 px-6 py-4 shadow-[0_0_35px_rgba(239,68,68,0.07)]">
              <div className="absolute inset-0 bg-red-500/[0.025] opacity-0 transition group-hover:opacity-100" />

              <div className="relative flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">
                  <span className="text-[10px] font-black text-red-500">
                    J
                  </span>
                </div>

                <div>
                  <p className="text-[9px] font-bold uppercase tracking-[0.22em] text-neutral-600">
                    Designed & Built by
                  </p>

                  <p className="mt-0.5 text-xs font-black tracking-[0.2em] text-red-500">
                    JOE
                    <span className="mx-2 text-neutral-700">
                      •
                    </span>
                    SQLFORGE
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Development notice */}
          <div className="mt-4 text-center">
            <p className="text-[9px] leading-5 text-neutral-700">
              Password recovery is currently running in
              development mode. Email delivery will be
              connected before production deployment.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ForgotPassword;