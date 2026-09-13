import { useState } from "react";

import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Database,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  ShieldCheck,
  Sparkles,
  Terminal,
  AlertCircle,
  KeyRound,
  Check,
  X,
} from "lucide-react";

import { Link, useNavigate, useParams } from "react-router-dom";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] =
    useState("");
  const [error, setError] = useState("");

  const passwordLengthValid =
    newPassword.length >= 6;

  const passwordsMatch =
    newPassword.length > 0 &&
    confirmPassword.length > 0 &&
    newPassword === confirmPassword;

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccessMessage("");

    // =====================================================
    // TOKEN VALIDATION
    // =====================================================

    if (!token) {
      setError(
        "This password reset link is invalid or incomplete."
      );
      return;
    }

    // =====================================================
    // PASSWORD VALIDATION
    // =====================================================

    if (!newPassword || !confirmPassword) {
      setError(
        "Please enter and confirm your new password."
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        "Your new password must be at least 6 characters long."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        "The passwords do not match."
      );
      return;
    }

    try {
      setLoading(true);

      // ===================================================
      // RESET PASSWORD API
      // ===================================================

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/reset-password`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            resetToken: token,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to reset your password."
        );
      }

      // ===================================================
      // SUCCESS
      // ===================================================

      setSuccessMessage(
        "Your password has been reset successfully."
      );

      setNewPassword("");
      setConfirmPassword("");

      // Give the user time to see the success message.
      setTimeout(() => {
        navigate("/login");
      }, 1800);
    } catch (error) {
      console.error(
        "Reset password error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong while resetting your password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* =====================================================
          AMBIENT BACKGROUND
      ====================================================== */}

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

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.7)_100%)]" />
      </div>


      {/* =====================================================
          NAVBAR
      ====================================================== */}

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


      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] items-center justify-center px-5 py-12 sm:px-8 lg:py-16">

        <div className="w-full max-w-5xl">

          <div className="grid overflow-hidden rounded-[28px] border border-white/10 bg-[#090909]/95 shadow-[0_30px_100px_rgba(0,0,0,0.55)] backdrop-blur-2xl lg:grid-cols-[0.9fr_1.1fr]">


            {/* =================================================
                LEFT INFORMATION PANEL
            ================================================== */}

            <section className="relative hidden overflow-hidden border-r border-white/5 bg-gradient-to-br from-red-950/20 via-[#0a0a0a] to-black p-10 lg:block xl:p-12">

              <div className="absolute right-[-80px] top-[-80px] h-64 w-64 rounded-full bg-red-600/10 blur-[90px]" />

              <div className="relative flex h-full flex-col">


                {/* LABEL */}

                <div className="mb-10 flex items-center gap-2">

                  <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10">

                    <KeyRound
                      size={13}
                      className="text-red-500"
                    />

                  </span>

                  <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    Secure Reset
                  </span>

                </div>


                {/* TITLE */}

                <div className="max-w-sm">

                  <h1 className="text-4xl font-black leading-[1.05] tracking-tight xl:text-5xl">

                    Forge a new

                    <span className="block text-red-500">
                      password.
                    </span>

                  </h1>

                  <p className="mt-6 text-sm leading-7 text-neutral-500">
                    Create a new password for your
                    SQLForge account and get back to
                    mastering SQL.
                  </p>

                </div>


                {/* TERMINAL */}

                <div className="mt-10 overflow-hidden rounded-2xl border border-white/8 bg-black/50 shadow-2xl">

                  <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">

                    <span className="h-2 w-2 rounded-full bg-red-500/70" />

                    <span className="h-2 w-2 rounded-full bg-yellow-500/40" />

                    <span className="h-2 w-2 rounded-full bg-green-500/40" />

                    <span className="ml-2 text-[9px] font-medium text-neutral-700">
                      sqlforge-reset
                    </span>

                  </div>


                  <div className="space-y-2 px-5 py-5 font-mono text-[10px] leading-6">

                    <div className="text-neutral-700">
                      <span className="text-red-500">
                        $
                      </span>{" "}
                      sqlforge auth --reset
                    </div>

                    <div className="text-neutral-500">
                      validating reset token...
                    </div>

                    <div className="text-neutral-500">
                      preparing secure credentials...
                    </div>

                    <div className="text-green-500/80">
                      ✓ reset channel verified
                    </div>

                    <div className="text-neutral-700">
                      waiting for new credentials...
                    </div>

                  </div>

                </div>


                {/* FEATURES */}

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
                        Secure reset
                      </p>

                      <p className="mt-0.5 text-[10px] text-neutral-600">
                        Reset links expire automatically.
                      </p>

                    </div>

                  </div>


                  <div className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.025] p-3.5">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10">

                      <Lock
                        size={16}
                        className="text-red-500"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-semibold text-neutral-300">
                        Protected credentials
                      </p>

                      <p className="mt-0.5 text-[10px] text-neutral-600">
                        Your password is securely hashed.
                      </p>

                    </div>

                  </div>

                </div>

              </div>

            </section>


            {/* =================================================
                RIGHT RESET FORM
            ================================================== */}

            <section className="relative p-7 sm:p-10 lg:p-12">

              <div className="mx-auto max-w-md">


                {/* MOBILE HEADER */}

                <div className="mb-8 lg:hidden">

                  <div className="mb-5 flex items-center gap-2">

                    <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10">

                      <Sparkles
                        size={14}
                        className="text-red-500"
                      />

                    </span>

                    <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                      Secure Reset
                    </span>

                  </div>

                </div>


                {/* HEADER */}

                <div className="mb-9">

                  <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/10 shadow-[0_0_30px_rgba(239,68,68,0.08)]">

                    <Lock
                      size={21}
                      className="text-red-500"
                    />

                  </div>

                  <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-red-500">
                    New Credentials
                  </p>

                  <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
                    Reset password
                  </h2>

                  <p className="mt-3 max-w-sm text-sm leading-6 text-neutral-500">
                    Choose a strong new password for
                    your SQLForge account.
                  </p>

                </div>


                {/* ERROR */}

                {error && (

                  <div className="mb-5 flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3.5 text-xs leading-5 text-red-400">

                    <AlertCircle
                      size={16}
                      className="mt-0.5 shrink-0"
                    />

                    <span>
                      {error}
                    </span>

                  </div>

                )}


                {/* SUCCESS */}

                {successMessage && (

                  <div className="mb-5 rounded-2xl border border-green-500/20 bg-green-500/5 p-4">

                    <div className="flex items-start gap-3">

                      <CheckCircle2
                        size={17}
                        className="mt-0.5 shrink-0 text-green-500"
                      />

                      <div>

                        <p className="text-xs font-semibold text-green-400">
                          Password reset complete
                        </p>

                        <p className="mt-1 text-[11px] leading-5 text-green-500/70">
                          {successMessage}
                        </p>

                        <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.15em] text-green-500/50">
                          Redirecting to login...
                        </p>

                      </div>

                    </div>

                  </div>

                )}


                {/* FORM */}

                <form
                  onSubmit={handleSubmit}
                  className="space-y-5"
                >


                  {/* NEW PASSWORD */}

                  <div>

                    <label
                      htmlFor="new-password"
                      className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500"
                    >
                      New Password
                    </label>

                    <div className="group relative">

                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 transition group-focus-within:text-red-500"
                      />

                      <input
                        id="new-password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        value={newPassword}
                        onChange={(event) => {
                          setNewPassword(
                            event.target.value
                          );
                          setError("");
                          setSuccessMessage("");
                        }}
                        placeholder="Enter your new password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-neutral-700 hover:border-white/15 focus:border-red-500/40 focus:bg-red-500/[0.025] focus:ring-4 focus:ring-red-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowPassword(
                            !showPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-white/[0.05] hover:text-neutral-300"
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}

                      </button>

                    </div>

                  </div>


                  {/* PASSWORD REQUIREMENTS */}

                  <div className="rounded-xl border border-white/5 bg-white/[0.015] px-4 py-3">

                    <p className="mb-2.5 text-[9px] font-bold uppercase tracking-[0.18em] text-neutral-600">
                      Password requirements
                    </p>

                    <div className="flex items-center gap-2">

                      {passwordLengthValid ? (
                        <Check
                          size={12}
                          className="text-green-500"
                        />
                      ) : (
                        <X
                          size={12}
                          className="text-neutral-700"
                        />
                      )}

                      <span
                        className={`text-[10px] ${
                          passwordLengthValid
                            ? "text-green-500/80"
                            : "text-neutral-600"
                        }`}
                      >
                        At least 6 characters
                      </span>

                    </div>

                  </div>


                  {/* CONFIRM PASSWORD */}

                  <div>

                    <label
                      htmlFor="confirm-password"
                      className="mb-2.5 block text-[10px] font-bold uppercase tracking-[0.18em] text-neutral-500"
                    >
                      Confirm New Password
                    </label>

                    <div className="group relative">

                      <Lock
                        size={16}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-600 transition group-focus-within:text-red-500"
                      />

                      <input
                        id="confirm-password"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(
                            event.target.value
                          );
                          setError("");
                          setSuccessMessage("");
                        }}
                        placeholder="Confirm your new password"
                        autoComplete="new-password"
                        disabled={loading}
                        className="h-14 w-full rounded-xl border border-white/10 bg-white/[0.025] pl-11 pr-12 text-sm text-white outline-none transition placeholder:text-neutral-700 hover:border-white/15 focus:border-red-500/40 focus:bg-red-500/[0.025] focus:ring-4 focus:ring-red-500/5 disabled:cursor-not-allowed disabled:opacity-60"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(
                            !showConfirmPassword
                          )
                        }
                        disabled={loading}
                        className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-neutral-700 transition hover:bg-white/[0.05] hover:text-neutral-300"
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >

                        {showConfirmPassword ? (
                          <EyeOff size={15} />
                        ) : (
                          <Eye size={15} />
                        )}

                      </button>

                    </div>


                    {/* MATCH INDICATOR */}

                    {confirmPassword.length > 0 && (

                      <div className="mt-2 flex items-center gap-2">

                        {passwordsMatch ? (
                          <>
                            <Check
                              size={11}
                              className="text-green-500"
                            />

                            <span className="text-[9px] text-green-500/70">
                              Passwords match
                            </span>
                          </>
                        ) : (
                          <>
                            <X
                              size={11}
                              className="text-red-500/70"
                            />

                            <span className="text-[9px] text-red-500/60">
                              Passwords do not match
                            </span>
                          </>
                        )}

                      </div>

                    )}

                  </div>


                  {/* SUBMIT */}

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

                        Updating Password...
                      </>
                    ) : (
                      <>
                        Reset Password

                        <ArrowRight
                          size={17}
                          className="transition-transform group-hover:translate-x-1"
                        />
                      </>
                    )}

                  </button>

                </form>


                {/* BACK TO LOGIN */}

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


                {/* SECURITY STRIP */}

                <div className="mt-10 flex items-center justify-center gap-2 border-t border-white/5 pt-6 text-[9px] font-medium uppercase tracking-[0.18em] text-neutral-700">

                  <ShieldCheck size={12} />

                  Secure SQLForge password reset

                </div>

              </div>

            </section>

          </div>


          {/* =================================================
              JOE FOOTER
          ================================================== */}

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


          {/* STATUS */}

          <div className="mt-4 text-center">

            <p className="text-[9px] leading-5 text-neutral-700">
              Password reset links are temporary and
              expire automatically for your security.
            </p>

          </div>

        </div>

      </main>

    </div>
  );
};

export default ResetPassword;