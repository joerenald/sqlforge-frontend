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
} from "lucide-react";

import { Link, useNavigate } from "react-router-dom";

import {
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

import { auth } from "../firebase";

function Login() {
  const navigate = useNavigate();

  // =====================================================
  // FORM STATE
  // =====================================================

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // =====================================================
  // LOADING STATE
  // =====================================================

  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // =====================================================
  // MESSAGE STATE
  // =====================================================

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // =====================================================
  // EMAIL / PASSWORD LOGIN
  // =====================================================

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (loading || googleLoading) {
      return;
    }

    // Validate email
    if (!email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    // Validate password
    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/auth/login",
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
          data.message || "Unable to login."
        );
      }

      // =================================================
      // STORE SQLFORGE JWT
      // =================================================

      localStorage.setItem(
        "sqlforge_token",
        data.token
      );

      // =================================================
      // STORE USER INFORMATION
      // =================================================

      // Do NOT reference googleUser here.
      // googleUser only exists inside Google login.
      localStorage.setItem(
        "sqlforge_user",
        JSON.stringify(data.user)
      );

      setSuccess("Login successful. Welcome back!");

      // =================================================
      // REDIRECT TO DASHBOARD
      // =================================================

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
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

    if (loading || googleLoading) {
      return;
    }

    try {
      setGoogleLoading(true);

      // =================================================
      // CREATE GOOGLE PROVIDER
      // =================================================

      const provider = new GoogleAuthProvider();

      provider.addScope("profile");
      provider.addScope("email");

      // =================================================
      // FIREBASE GOOGLE SIGN-IN
      // =================================================

      const result = await signInWithPopup(
        auth,
        provider
      );

      // =================================================
      // FIREBASE USER
      // =================================================

      const googleUser = result.user;

      console.log(
        "========== GOOGLE USER DEBUG =========="
      );
      console.log("Google user:", googleUser);
      console.log(
        "Google displayName:",
        googleUser.displayName
      );
      console.log(
        "Google email:",
        googleUser.email
      );
      console.log(
        "Google photoURL:",
        googleUser.photoURL
      );
      console.log(
        "========================================"
      );

      console.log(
        "Google authentication successful"
      );

      console.log(
        "Name:",
        googleUser.displayName
      );

      console.log(
        "Email:",
        googleUser.email
      );

      console.log(
        "Firebase UID:",
        googleUser.uid
      );

      // =================================================
      // GET FIREBASE ID TOKEN
      // =================================================

      const firebaseIdToken =
        await googleUser.getIdToken(true);

      if (!firebaseIdToken) {
        throw new Error(
          "Unable to obtain Firebase authentication token."
        );
      }

      console.log(
        "Firebase ID token received"
      );

      // =================================================
      // SEND FIREBASE TOKEN TO BACKEND
      // =================================================

      const response = await fetch(
        "http://localhost:5000/api/auth/google",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            idToken: firebaseIdToken,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "Google backend response:",
        data
      );

      // =================================================
      // HANDLE BACKEND ERROR
      // =================================================

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to complete Google authentication."
        );
      }

      // =================================================
      // STORE SQLFORGE JWT
      // =================================================

      localStorage.setItem(
        "sqlforge_token",
        data.token
      );

      // =================================================
      // STORE SQLFORGE USER
      // =================================================

      const sqlforgeUser = {
        ...data.user,
        photoURL:
          googleUser.photoURL || null,
      };

      console.log(
        "Google photo URL:",
        googleUser.photoURL
      );

      console.log(
        "User being stored:",
        sqlforgeUser
      );

      localStorage.setItem(
        "sqlforge_user",
        JSON.stringify(sqlforgeUser)
      );

      console.log(
        "SQLForge authentication successful"
      );

      console.log(
        "SQLForge user:",
        sqlforgeUser
      );

      setSuccess(
        "Google login successful. Welcome to SQLForge!"
      );

      // =================================================
      // REDIRECT TO DASHBOARD
      // =================================================

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
        });
      }, 500);
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      // Firebase-specific errors
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
          "Google sign-in popup was blocked. Please allow popups for localhost."
        );
      } else if (
        error.code ===
        "auth/account-exists-with-different-credential"
      ) {
        setError(
          "An account already exists with this email using another login method."
        );
      } else {
        setError(
          error.message ||
            "Unable to sign in with Google."
        );
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#020202] text-white">

      {/* =================================================
          BACKGROUND
      ================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Main red glow */}
        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-700/10 blur-[160px] sm:h-[750px] sm:w-[750px]" />

        {/* Bottom glow */}
        <div className="absolute bottom-[-220px] left-[-180px] h-[450px] w-[450px] rounded-full bg-red-950/15 blur-[140px] sm:h-[600px] sm:w-[600px]" />

        {/* Side glow */}
        <div className="absolute right-[-180px] top-[40%] h-[400px] w-[400px] rounded-full bg-red-950/10 blur-[130px]" />

        {/* Grid */}
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* =================================================
          HEADER
      ================================================= */}

      <header className="relative z-20 border-b border-white/[0.06] bg-black/60 backdrop-blur-2xl">

        <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">

          {/* Logo */}

          <Link
            to="/"
            className="group flex items-center gap-2.5 sm:gap-3"
          >

            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/25 bg-red-600 shadow-lg shadow-red-950/40 transition duration-300 group-hover:scale-105 group-hover:bg-red-500 sm:h-10 sm:w-10">
              <Database
                size={18}
                strokeWidth={2.5}
              />

              <div className="absolute inset-0 rounded-xl ring-1 ring-red-400/10" />
            </div>

            <div>
              <div className="text-base font-black tracking-tight sm:text-lg">
                SQL
                <span className="text-red-500">
                  Forge
                </span>
              </div>

              <div className="hidden text-[8px] font-semibold uppercase tracking-[0.28em] text-zinc-600 sm:block">
                SQL Practice Platform
              </div>
            </div>
          </Link>

          {/* Back */}

          <Link
            to="/"
            className="group flex items-center gap-2 rounded-lg px-2 py-2 text-xs font-medium text-zinc-500 transition hover:bg-white/[0.03] hover:text-white sm:px-3"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span className="hidden sm:inline">
              Back to Home
            </span>

            <span className="sm:hidden">
              Home
            </span>
          </Link>

        </div>
      </header>

      {/* =================================================
          MAIN
      ================================================= */}

      <main className="relative z-10 flex min-h-[calc(100vh-70px)] items-center justify-center px-4 py-10 sm:px-6 sm:py-14">

        <div className="w-full max-w-[440px]">

          {/* =================================================
              TOP BRAND MOMENT
          ================================================= */}

          <div className="mb-7 text-center sm:mb-8">

            <div className="relative mx-auto flex h-[68px] w-[68px] items-center justify-center rounded-2xl border border-red-500/20 bg-gradient-to-br from-red-950/50 to-[#090909] shadow-xl shadow-red-950/20">

              <div className="absolute inset-[-7px] rounded-2xl border border-red-500/[0.04]" />

              <Lock
                size={24}
                className="text-red-500"
                strokeWidth={1.8}
              />
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-[9px] font-bold uppercase tracking-[0.35em] text-red-500 sm:text-[10px]">
              <Sparkles size={11} />
              Welcome Back
            </div>

            <h1 className="mt-3 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
              Sign in to{" "}
              <span className="text-red-500">
                SQLForge
              </span>
            </h1>

            <p className="mx-auto mt-3 max-w-[350px] text-xs leading-6 text-zinc-600 sm:text-sm">
              Continue your SQL journey, keep your
              streak alive, and sharpen the skills
              you need for placements.
            </p>

          </div>

          {/* =================================================
              LOGIN CARD
          ================================================= */}

          <div className="relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#070707]/95 shadow-2xl shadow-black/60 backdrop-blur-xl">

            {/* Top red line */}

            <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-red-600/70 to-transparent" />

            <div className="p-5 sm:p-8">

              {/* =================================================
                  ERROR
              ================================================= */}

              {error && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-900/40 bg-red-950/15 px-4 py-3.5">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-red-500/10">
                    <AlertCircle
                      size={15}
                      className="text-red-500"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-red-500">
                      Sign in failed
                    </p>

                    <p className="mt-1 text-xs leading-5 text-red-300/80">
                      {error}
                    </p>
                  </div>

                </div>
              )}

              {/* =================================================
                  SUCCESS
              ================================================= */}

              {success && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-emerald-900/40 bg-emerald-950/15 px-4 py-3.5">

                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10">
                    <CheckCircle2
                      size={15}
                      className="text-emerald-500"
                    />
                  </div>

                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                      Success
                    </p>

                    <p className="mt-1 text-xs leading-5 text-emerald-300/80">
                      {success}
                    </p>
                  </div>

                </div>
              )}

              {/* =================================================
                  FORM
              ================================================= */}

              <form
                onSubmit={handleLogin}
                className="space-y-5"
              >

                {/* EMAIL */}

                <div>

                  <label
                    htmlFor="email"
                    className="mb-2.5 block text-[11px] font-bold uppercase tracking-wider text-zinc-500"
                  >
                    Email address
                  </label>

                  <div className="group relative">

                    <Mail
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition group-focus-within:text-red-500"
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
                      disabled={
                        loading ||
                        googleLoading
                      }
                      className="h-13 w-full rounded-xl border border-white/[0.07] bg-[#030303] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-red-600/60 focus:bg-[#050505] focus:ring-4 focus:ring-red-950/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                  </div>
                </div>

                {/* PASSWORD */}

                <div>

                  <div className="mb-2.5 flex items-center justify-between">

                    <label
                      htmlFor="password"
                      className="text-[11px] font-bold uppercase tracking-wider text-zinc-500"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-[10px] font-semibold text-red-500 transition hover:text-red-400"
                    >
                      Forgot password?
                    </button>

                  </div>

                  <div className="group relative">

                    <Lock
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700 transition group-focus-within:text-red-500"
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
                      disabled={
                        loading ||
                        googleLoading
                      }
                      className="h-13 w-full rounded-xl border border-white/[0.07] bg-[#030303] pl-11 pr-12 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 hover:border-white/[0.12] focus:border-red-600/60 focus:bg-[#050505] focus:ring-4 focus:ring-red-950/20 disabled:cursor-not-allowed disabled:opacity-50"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }
                      disabled={
                        loading ||
                        googleLoading
                      }
                      className="absolute right-3.5 top-1/2 flex -translate-y-1/2 items-center justify-center rounded-lg p-1.5 text-zinc-700 transition hover:bg-white/[0.04] hover:text-zinc-300 disabled:cursor-not-allowed"
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {showPassword ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>

                  </div>
                </div>

                {/* REMEMBER */}

                <div className="flex items-center gap-2">

                  <input
                    id="remember"
                    type="checkbox"
                    className="h-3.5 w-3.5 cursor-pointer rounded accent-red-600"
                  />

                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-[11px] text-zinc-600"
                  >
                    Remember me
                  </label>

                </div>

                {/* SIGN IN */}

                <button
                  type="submit"
                  disabled={
                    loading ||
                    googleLoading
                  }
                  className="group relative flex h-13 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-red-600 text-sm font-bold shadow-xl shadow-red-950/30 transition duration-300 hover:bg-red-500 hover:shadow-red-900/40 disabled:cursor-not-allowed disabled:opacity-60"
                >

                  {/* shine */}

                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition duration-700 group-hover:translate-x-full" />

                  <span className="relative flex items-center gap-2">

                    {loading ? (
                      <>
                        <Loader2
                          size={17}
                          className="animate-spin"
                        />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In

                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </span>
                </button>

              </form>

              {/* =================================================
                  DIVIDER
              ================================================= */}

              <div className="my-7 flex items-center gap-3">

                <div className="h-px flex-1 bg-white/[0.06]" />

                <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
                  Or continue with
                </span>

                <div className="h-px flex-1 bg-white/[0.06]" />

              </div>

              {/* =================================================
                  GOOGLE
              ================================================= */}

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={
                  loading ||
                  googleLoading
                }
                className="group flex h-13 w-full items-center justify-center gap-3 rounded-xl border border-white/[0.08] bg-[#030303] text-xs font-semibold text-zinc-300 transition duration-300 hover:border-white/[0.16] hover:bg-[#0b0b0b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
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
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[13px] font-black text-[#4285F4] shadow-sm transition duration-300 group-hover:scale-105">
                      G
                    </span>

                    Continue with Google
                  </>
                )}

              </button>

              {/* =================================================
                  REGISTER
              ================================================= */}

              <div className="mt-7 border-t border-white/[0.05] pt-6">

                <p className="text-center text-xs text-zinc-600">
                  Don't have an account?
                </p>

                <Link
                  to="/register"
                  className="group mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-red-500/15 bg-red-950/10 text-xs font-bold text-red-400 transition duration-300 hover:border-red-500/30 hover:bg-red-950/20 hover:text-red-300"
                >
                  Create your SQLForge account

                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                </Link>

              </div>

            </div>
          </div>

          {/* =================================================
              SECURITY
          ================================================= */}

          <div className="mt-6 flex items-center justify-center gap-2 text-[9px] uppercase tracking-wider text-zinc-700">

            <ShieldCheck
              size={12}
              className="text-zinc-700"
            />

            Secure authentication

            <span className="text-zinc-800">
              •
            </span>

            SQLForge + Firebase

          </div>

          {/* =================================================
              JOE SIGNATURE
          ================================================= */}

          <div className="mt-6 flex flex-col items-center">

            <div className="flex items-center gap-2">

              <div className="h-px w-6 bg-red-900/50" />

              <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-700">
                Made with
              </span>

              <span className="text-sm text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.45)]">
                ♥
              </span>

              <span className="text-[10px] font-black uppercase tracking-[0.16em] text-red-400">
                by Joe
              </span>

              <div className="h-px w-6 bg-red-900/50" />

            </div>

            <p className="mt-2 text-[8px] uppercase tracking-[0.25em] text-zinc-800">
              Practice. Improve. Forge.
            </p>

          </div>

        </div>
      </main>
    </div>
  );
}

export default Login;