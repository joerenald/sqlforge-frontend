import { useState } from "react";

import {
  Database,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Lock,
  Mail,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Sparkles,
  Terminal,
  Zap,
  Code2,
  Cpu,
  Activity,
  ChevronRight,
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

const Login = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] =
    useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const isBusy = loading || googleLoading;

  // =====================================================
  // EMAIL LOGIN
  // =====================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Invalid email or password."
        );
      }

      localStorage.setItem(
        "sqlforge_token",
        data.token
      );

      localStorage.setItem(
        "sqlforge_user",
        JSON.stringify(data.user)
      );

      setSuccess(
        "Authentication successful. Opening the Forge..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      console.error("Login error:", error);

      setError(
        error.message ||
          "Something went wrong while logging in."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GOOGLE LOGIN
  // =====================================================

  const handleGoogleLogin = async () => {
    setError("");
    setSuccess("");

    try {
      setGoogleLoading(true);

      const provider =
        new GoogleAuthProvider();

      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(
        auth,
        provider
      );

      const firebaseUser = result.user;

      const firebaseToken =
        await firebaseUser.getIdToken();

     const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: firebaseToken,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Google authentication failed."
        );
      }

      localStorage.setItem(
        "sqlforge_token",
        data.token
      );

      localStorage.setItem(
        "sqlforge_user",
        JSON.stringify(data.user)
      );

      setSuccess(
        "Google authentication successful. Opening the Forge..."
      );

      setTimeout(() => {
        navigate("/dashboard");
      }, 700);
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      if (
        error.code ===
        "auth/popup-closed-by-user"
      ) {
        setError(
          "Google sign-in was cancelled."
        );
      } else if (
        error.code ===
        "auth/popup-blocked"
      ) {
        setError(
          "Google sign-in popup was blocked. Please allow popups and try again."
        );
      } else {
        setError(
          error.message ||
            "Google sign-in failed. Please try again."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020202] text-white">

      {/* =================================================
          CINEMATIC BACKGROUND
      ================================================== */}

      <div className="pointer-events-none absolute inset-0">

        {/* Main red atmospheric glow */}
        <div className="absolute left-1/2 top-[-300px] h-[850px] w-[850px] -translate-x-1/2 rounded-full bg-red-700/[0.09] blur-[180px]" />

        {/* Left glow */}
        <div className="absolute left-[-300px] top-[25%] h-[700px] w-[700px] rounded-full bg-red-950/[0.28] blur-[180px]" />

        {/* Right glow */}
        <div className="absolute right-[-350px] bottom-[-150px] h-[700px] w-[700px] rounded-full bg-red-900/[0.18] blur-[180px]" />

        {/* Fine grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Center spotlight */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(120,0,0,0.08),transparent_48%)]" />

        {/* Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_15%,rgba(0,0,0,0.75)_100%)]" />

        {/* Floating particles */}
        <span className="absolute left-[8%] top-[24%] h-1 w-1 animate-pulse rounded-full bg-red-500/70" />
        <span className="absolute left-[15%] top-[70%] h-1 w-1 animate-pulse rounded-full bg-red-500/40" />
        <span className="absolute right-[12%] top-[28%] h-1 w-1 animate-pulse rounded-full bg-red-500/60" />
        <span className="absolute right-[20%] bottom-[18%] h-1 w-1 animate-pulse rounded-full bg-red-500/40" />

      </div>

      {/* =================================================
          NAVIGATION
      ================================================== */}

      <header className="relative z-30 border-b border-white/[0.06] bg-black/30 backdrop-blur-2xl">

        <div className="mx-auto flex h-[72px] max-w-[1450px] items-center justify-between px-5 sm:px-8 lg:px-12">

          {/* Brand */}
          <Link
            to="/"
            className="group flex items-center gap-3"
          >

            <div className="relative">

              <div className="absolute inset-0 rounded-xl bg-red-600/40 blur-xl transition duration-500 group-hover:bg-red-500/60" />

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-black">
                <Database
                  size={21}
                  className="text-red-500"
                />
              </div>

            </div>

            <div>

              <div className="text-[15px] font-black tracking-[0.25em]">
                SQL<span className="text-red-500">FORGE</span>
              </div>

              <div className="mt-0.5 hidden text-[8px] font-medium uppercase tracking-[0.35em] text-zinc-600 sm:block">
                Master SQL • Forge Your Future
              </div>

            </div>
          </Link>

          {/* Back */}
          <Link
            to="/"
            className="group flex items-center gap-2 rounded-full border border-white/[0.07] bg-white/[0.025] px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-500 backdrop-blur-xl transition duration-300 hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-white"
          >
            <ArrowLeft
              size={13}
              className="transition-transform group-hover:-translate-x-1"
            />

            <span className="hidden sm:block">
              Back to Home
            </span>

            <span className="sm:hidden">
              Back
            </span>
          </Link>

        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center px-4 py-8 sm:px-6 lg:px-10">

        <div className="w-full max-w-[1320px]">

          {/* =================================================
              OUTER GLOW
          ================================================== */}

          <div className="relative">

            <div className="absolute -inset-[1px] rounded-[32px] bg-gradient-to-r from-red-600/30 via-transparent to-red-600/20 blur-sm" />

            <div className="relative overflow-hidden rounded-[30px] border border-white/[0.09] bg-[#070707]/90 shadow-[0_40px_140px_rgba(0,0,0,0.85)] backdrop-blur-3xl">

              {/* Top laser line */}
              <div className="absolute left-[5%] right-[5%] top-0 h-px bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-80" />

              <div className="grid lg:grid-cols-[1.15fr_0.85fr]">

                {/* =================================================
                    HERO SIDE
                ================================================== */}

                <section className="relative hidden min-h-[760px] overflow-hidden border-r border-white/[0.06] lg:block">

                  {/* Hero lighting */}
                  <div className="absolute left-[-250px] top-[20%] h-[650px] w-[650px] rounded-full bg-red-700/[0.09] blur-[160px]" />

                  <div className="relative flex min-h-[760px] flex-col justify-between p-12 xl:p-16">

                    {/* -----------------------------------------
                        Hero heading
                    ------------------------------------------ */}

                    <div>

                      <div className="mb-8 flex items-center gap-3">

                        <div className="flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.05] px-3.5 py-2">

                          <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-50" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                          </span>

                          <span className="text-[9px] font-black uppercase tracking-[0.28em] text-red-400">
                            System Online
                          </span>

                        </div>

                        <div className="h-px w-10 bg-red-500/30" />

                        <span className="text-[9px] font-medium uppercase tracking-[0.25em] text-zinc-700">
                          AUTH.01
                        </span>

                      </div>

                      <h1 className="max-w-2xl text-[58px] font-black leading-[0.95] tracking-[-0.055em] xl:text-[72px]">

                        Enter the

                        <br />

                        <span className="relative inline-block text-red-500">

                          SQL Forge

                          <span className="absolute -bottom-3 left-0 h-[2px] w-[85%] bg-gradient-to-r from-red-500 via-red-500/40 to-transparent" />

                        </span>

                        <span className="text-zinc-700">
                          .
                        </span>

                      </h1>

                      <p className="mt-8 max-w-xl text-[13px] leading-7 text-zinc-500">
                        A focused environment built for
                        developers who want to turn SQL
                        knowledge into real interview-ready
                        skills.
                      </p>

                    </div>

                    {/* -----------------------------------------
                        Giant code visual
                    ------------------------------------------ */}

                    <div className="relative mt-12">

                      {/* Ambient glow */}
                      <div className="absolute left-1/2 top-1/2 h-[250px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-600/[0.07] blur-[100px]" />

                      <div className="relative overflow-hidden rounded-2xl border border-white/[0.07] bg-black/60 shadow-[0_25px_80px_rgba(0,0,0,0.5)]">

                        {/* Terminal top */}
                        <div className="flex h-11 items-center justify-between border-b border-white/[0.06] bg-white/[0.015] px-4">

                          <div className="flex items-center gap-1.5">
                            <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                            <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/30" />
                            <span className="h-2.5 w-2.5 rounded-full bg-green-500/30" />
                          </div>

                          <div className="flex items-center gap-2 text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-700">
                            <Terminal size={10} />
                            sqlforge_engine
                          </div>

                          <Activity
                            size={12}
                            className="text-red-500/40"
                          />

                        </div>

                        {/* Code */}
                        <div className="grid grid-cols-[45px_1fr] font-mono text-[10px] leading-6 sm:text-[11px]">

                          <div className="border-r border-white/[0.04] bg-white/[0.01] py-5 text-center text-zinc-800">
                            01
                            <br />
                            02
                            <br />
                            03
                            <br />
                            04
                            <br />
                            05
                            <br />
                            06
                            <br />
                            07
                            <br />
                            08
                          </div>

                          <div className="overflow-hidden p-5">

                            <div>
                              <span className="text-zinc-700">
                                -- forge access
                              </span>
                            </div>

                            <div>
                              <span className="text-red-500">
                                SELECT
                              </span>{" "}
                              <span className="text-zinc-300">
                                skills
                              </span>
                            </div>

                            <div>
                              <span className="text-red-500">
                                FROM
                              </span>{" "}
                              <span className="text-zinc-300">
                                developer
                              </span>
                            </div>

                            <div>
                              <span className="text-red-500">
                                WHERE
                              </span>{" "}
                              <span className="text-zinc-300">
                                ambition
                              </span>{" "}
                              <span className="text-red-400">
                                =
                              </span>{" "}
                              <span className="text-green-500">
                                'HIGH'
                              </span>
                              <span className="text-zinc-500">
                                ;
                              </span>
                            </div>

                            <div className="mt-2 text-zinc-700">
                              ─────────────────────
                            </div>

                            <div>
                              <span className="text-green-500">
                                ✓
                              </span>{" "}
                              <span className="text-zinc-400">
                                query executed
                              </span>
                            </div>

                            <div>
                              <span className="text-green-500">
                                ✓
                              </span>{" "}
                              <span className="text-zinc-400">
                                practice environment ready
                              </span>
                            </div>

                            <div>
                              <span className="text-red-500">
                                $
                              </span>{" "}
                              <span className="animate-pulse text-zinc-300">
                                _
                              </span>
                            </div>

                          </div>

                        </div>
                      </div>
                    </div>

                    {/* -----------------------------------------
                        Feature row
                    ------------------------------------------ */}

                    <div className="grid grid-cols-3 gap-3">

                      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-red-500/[0.03]">

                        <Code2
                          size={16}
                          className="mb-3 text-red-500"
                        />

                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-300">
                          Practice
                        </div>

                        <div className="mt-1 text-[8px] leading-4 text-zinc-700">
                          Real SQL challenges
                        </div>

                      </div>

                      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-red-500/[0.03]">

                        <Cpu
                          size={16}
                          className="mb-3 text-red-500"
                        />

                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-300">
                          Progress
                        </div>

                        <div className="mt-1 text-[8px] leading-4 text-zinc-700">
                          Track your mastery
                        </div>

                      </div>

                      <div className="group rounded-xl border border-white/[0.06] bg-white/[0.015] p-4 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-red-500/[0.03]">

                        <ShieldCheck
                          size={16}
                          className="mb-3 text-red-500"
                        />

                        <div className="text-[9px] font-black uppercase tracking-[0.15em] text-zinc-300">
                          Secure
                        </div>

                        <div className="mt-1 text-[8px] leading-4 text-zinc-700">
                          Protected account
                        </div>

                      </div>

                    </div>

                  </div>
                </section>

                {/* =================================================
                    LOGIN SIDE
                ================================================== */}

                <section className="relative flex min-h-[760px] flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-14">

                  {/* Mobile hero */}
                  <div className="mb-10 lg:hidden">

                    <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/[0.05] px-3 py-2">

                      <Sparkles
                        size={11}
                        className="text-red-500"
                      />

                      <span className="text-[9px] font-black uppercase tracking-[0.25em] text-red-400">
                        SQLForge Access
                      </span>

                    </div>

                    <h1 className="text-4xl font-black leading-none tracking-[-0.05em]">

                      Enter the{" "}
                      <span className="text-red-500">
                        Forge
                      </span>

                      <span className="text-zinc-700">
                        .
                      </span>

                    </h1>

                    <p className="mt-4 text-xs leading-6 text-zinc-600">
                      Continue your journey toward
                      becoming interview-ready.
                    </p>

                  </div>

                  {/* Login form */}
                  <div className="mx-auto w-full max-w-[440px]">

                    {/* Heading */}
                    <div className="mb-8 hidden lg:block">

                      <div className="mb-4 flex items-center gap-2">

                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10">
                          <Zap
                            size={13}
                            className="text-red-500"
                          />
                        </div>

                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-red-500">
                          Access Terminal
                        </span>

                      </div>

                      <h2 className="text-3xl font-black tracking-[-0.04em]">
                        Welcome back.
                      </h2>

                      <p className="mt-2 text-xs leading-6 text-zinc-600">
                        Sign in and continue forging
                        your SQL skills.
                      </p>

                    </div>

                    {/* Error */}
                    {error && (
                      <div className="mb-5 flex gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] p-4">

                        <AlertCircle
                          size={16}
                          className="mt-0.5 shrink-0 text-red-500"
                        />

                        <p className="text-[10px] leading-5 text-red-400">
                          {error}
                        </p>

                      </div>
                    )}

                    {/* Success */}
                    {success && (
                      <div className="mb-5 flex gap-3 rounded-xl border border-green-500/20 bg-green-500/[0.05] p-4">

                        <CheckCircle2
                          size={16}
                          className="mt-0.5 shrink-0 text-green-500"
                        />

                        <p className="text-[10px] leading-5 text-green-400">
                          {success}
                        </p>

                      </div>
                    )}

                    {/* Form */}
                    <form
                      onSubmit={handleLogin}
                      className="space-y-5"
                    >

                      {/* Email */}
                      <div>

                        <div className="mb-2.5 flex items-center justify-between">

                          <label
                            htmlFor="email"
                            className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500"
                          >
                            Email Address
                          </label>

                          <span className="text-[8px] text-zinc-800">
                            REQUIRED
                          </span>

                        </div>

                        <div className="group relative">

                          <Mail
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:text-red-500"
                          />

                          <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                              setEmail(
                                event.target.value
                              )
                            }
                            placeholder="you@example.com"
                            autoComplete="email"
                            disabled={isBusy}
                            className="h-[54px] w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-4 text-xs text-white outline-none transition-all duration-300 placeholder:text-zinc-800 hover:border-white/[0.13] focus:border-red-500/40 focus:bg-red-500/[0.025] focus:shadow-[0_0_30px_rgba(220,38,38,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
                          />

                        </div>

                      </div>

                      {/* Password */}
                      <div>

                        <div className="mb-2.5 flex items-center justify-between">

                          <label
                            htmlFor="password"
                            className="text-[9px] font-black uppercase tracking-[0.22em] text-zinc-500"
                          >
                            Password
                          </label>

                          <Link
                            to="/forgot-password"
                            className="text-[9px] font-bold text-red-500 transition hover:text-red-400"
                          >
                            Forgot password?
                          </Link>

                        </div>

                        <div className="group relative">

                          <Lock
                            size={15}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition-colors group-focus-within:text-red-500"
                          />

                          <input
                            id="password"
                            type={
                              showPassword
                                ? "text"
                                : "password"
                            }
                            value={password}
                            onChange={(event) =>
                              setPassword(
                                event.target.value
                              )
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            disabled={isBusy}
                            className="h-[54px] w-full rounded-xl border border-white/[0.08] bg-white/[0.025] pl-11 pr-12 text-xs text-white outline-none transition-all duration-300 placeholder:text-zinc-800 hover:border-white/[0.13] focus:border-red-500/40 focus:bg-red-500/[0.025] focus:shadow-[0_0_30px_rgba(220,38,38,0.06)] disabled:cursor-not-allowed disabled:opacity-50"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              setShowPassword(
                                !showPassword
                              )
                            }
                            disabled={isBusy}
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-zinc-700 transition hover:bg-white/[0.05] hover:text-zinc-300"
                          >
                            {showPassword ? (
                              <EyeOff size={15} />
                            ) : (
                              <Eye size={15} />
                            )}
                          </button>

                        </div>

                      </div>

                      {/* Login button */}
                      <button
                        type="submit"
                        disabled={isBusy}
                        className="group relative mt-2 flex h-[56px] w-full items-center justify-center gap-3 overflow-hidden rounded-xl bg-red-600 text-[10px] font-black uppercase tracking-[0.22em] text-white shadow-[0_15px_45px_rgba(220,38,38,0.2)] transition-all duration-300 hover:bg-red-500 hover:shadow-[0_18px_55px_rgba(220,38,38,0.32)] active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60"
                      >

                        {/* Shine */}
                        <span className="absolute inset-y-0 -left-20 w-16 -skew-x-12 bg-white/25 transition-transform duration-700 group-hover:translate-x-[600px]" />

                        {/* Inner glow */}
                        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />

                        {loading ? (
                          <>
                            <Loader2
                              size={15}
                              className="animate-spin"
                            />
                            Authenticating...
                          </>
                        ) : (
                          <>
                            Enter SQLForge

                            <ArrowRight
                              size={15}
                              className="transition-transform duration-300 group-hover:translate-x-1"
                            />
                          </>
                        )}

                      </button>

                    </form>

                    {/* Divider */}
                    <div className="my-7 flex items-center gap-4">

                      <div className="h-px flex-1 bg-white/[0.06]" />

                      <span className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                        OR
                      </span>

                      <div className="h-px flex-1 bg-white/[0.06]" />

                    </div>

                    {/* Google */}
                   <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isBusy}
                className="group flex w-full items-center justify-center gap-3 rounded-xl border border-zinc-800/90 bg-black/40 py-3.5 text-sm font-semibold text-zinc-300 transition duration-200 hover:border-zinc-700 hover:bg-zinc-900/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {googleLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Connecting to Google...
                  </>
                ) : (
                  <>
                    <div className="flex h-5 w-5 items-center justify-center">

                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M21.805 10.023H12v3.954h5.635c-.242 1.273-.968 2.352-2.063 3.079v2.555h3.339c1.953-1.798 3.079-4.444 3.079-7.588 0-.726-.065-1.427-.185-2Z"
                          fill="#4285F4"
                        />

                        <path
                          d="M12 22c2.79 0 5.136-.923 6.847-2.389l-3.339-2.555c-.923.619-2.102.986-3.508.986-2.698 0-4.984-1.824-5.802-4.276H2.746v2.637A10.342 10.342 0 0 0 12 22Z"
                          fill="#34A853"
                        />

                        <path
                          d="M6.198 13.766A6.214 6.214 0 0 1 5.865 12c0-.613.105-1.21.333-1.766V7.597H2.746A10.006 10.006 0 0 0 1.657 12c0 1.6.383 3.112 1.089 4.403l3.452-2.637Z"
                          fill="#FBBC05"
                        />

                        <path
                          d="M12 5.958c1.518 0 2.878.522 3.952 1.546l2.966-2.966C17.132 2.951 14.79 2 12 2A10.342 10.342 0 0 0 2.746 7.597l3.452 2.637C7.016 7.782 9.302 5.958 12 5.958Z"
                          fill="#EA4335"
                        />
                      </svg>
                    </div>

                    Continue with Google
                  </>
                )}
              </button>



                    {/* Register */}
                    <div className="mt-7 text-center">

                      <span className="text-[10px] text-zinc-600">
                        New to SQLForge?
                      </span>

                      <Link
                        to="/register"
                        className="ml-2 text-[10px] font-black uppercase tracking-wider text-red-500 transition hover:text-red-400"
                      >
                        Create account
                      </Link>

                    </div>

                    {/* Security status */}
                    <div className="mt-8 flex items-center justify-center gap-2">

                      <div className="flex items-center gap-2 rounded-full border border-white/[0.05] bg-white/[0.015] px-3 py-1.5">

                        <span className="relative flex h-1.5 w-1.5">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />
                          <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                        </span>

                        <ShieldCheck
                          size={11}
                          className="text-zinc-700"
                        />

                        <span className="text-[7px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                          Secure authentication
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* =================================================
                      JOE SIGNATURE
                  ================================================== */}

                  <div className="mx-auto mt-10 w-full max-w-[440px]">

                    <div className="group relative overflow-hidden rounded-2xl">

                      {/* Animated border */}
                      <div className="absolute inset-0 bg-gradient-to-r from-red-700/40 via-red-500/10 to-red-700/40 opacity-70" />

                      <div className="relative m-[1px] rounded-[15px] border border-red-500/10 bg-[#080808]/95 px-5 py-4 backdrop-blur-xl">

                        <div className="flex items-center justify-between">

                          {/* JOE */}
                          <div className="flex items-center gap-3">

                            <div className="relative">

                              <div className="absolute inset-0 rounded-xl bg-red-600/30 blur-lg transition group-hover:bg-red-500/50" />

                              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/30 bg-gradient-to-br from-red-500/15 to-black">

                                <span className="text-sm font-black tracking-wider text-red-500">
                                  J
                                </span>

                              </div>

                            </div>

                            <div>

                              <p className="text-[7px] font-bold uppercase tracking-[0.28em] text-zinc-700">
                                Designed & Built by
                              </p>

                              <p className="mt-0.5 text-[15px] font-black tracking-[0.22em] text-white">
                                J
                                <span className="text-red-500">
                                  OE
                                </span>
                              </p>

                            </div>

                          </div>

                          {/* Right */}
                          <div className="text-right">

                            <div className="mb-1 flex items-center justify-end gap-1.5">

                              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.8)]" />

                              <span className="text-[8px] font-black uppercase tracking-[0.2em] text-red-500">
                                SQLForge
                              </span>

                            </div>

                            <p className="text-[7px] tracking-wider text-zinc-700">
                              Built for the next query.
                            </p>

                          </div>

                        </div>

                      </div>

                    </div>

                    <div className="mt-3 text-center text-[7px] font-medium uppercase tracking-[0.28em] text-zinc-800">
                      © {new Date().getFullYear()} SQLForge
                      <span className="mx-2 text-red-900">
                        •
                      </span>
                      Forge Your Future
                    </div>

                  </div>

                </section>

              </div>

            </div>
          </div>

          {/* Bottom micro status */}
          <div className="mt-5 flex items-center justify-center gap-3 text-[7px] font-bold uppercase tracking-[0.3em] text-zinc-800">

            <span className="h-px w-8 bg-zinc-900" />

            <Activity size={10} />

            SQL Practice Platform

            <span className="h-px w-8 bg-zinc-900" />

          </div>

        </div>
      </main>
    </div>
  );
};

export default Login;