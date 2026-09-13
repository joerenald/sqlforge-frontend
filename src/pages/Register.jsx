import { useState } from "react";
import {
  ArrowRight,
  Database,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    const { name, email, password, confirmPassword } = formData;

    // Frontend validation
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Registration failed.");
        return;
      }

      // Registration successful
      navigate("/login", {
        state: {
          message: "Account created successfully. Please sign in.",
        },
      });
    } catch (error) {
      console.error("Registration error:", error);

      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050505] text-white">

      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-red-900/20 blur-[150px]" />

        <div className="absolute bottom-[-200px] right-[-100px] h-[400px] w-[400px] rounded-full bg-red-950/10 blur-[130px]" />
      </div>

      {/* Header */}
      <header className="relative border-b border-red-950/40 bg-[#070707]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700">
              <Database size={18} />
            </div>

            <span className="text-lg font-black tracking-tight">
              SQL<span className="text-red-600">Forge</span>
            </span>
          </Link>

          {/* Back */}
          <Link
            to="/"
            className="text-xs font-medium text-zinc-500 transition hover:text-zinc-200"
          >
            Back to Home
          </Link>

        </div>
      </header>

      {/* Register */}
      <main className="relative flex min-h-[calc(100vh-73px)] items-center justify-center px-5 py-12">

        <div className="w-full max-w-md">

          {/* Heading */}
          <div className="mb-8 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-red-900/50 bg-red-950/20">
              <User size={21} className="text-red-500" />
            </div>

            <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.3em] text-red-600">
              Get started
            </p>

            <h1 className="mt-2 text-3xl font-black tracking-tight">
              Create your account
            </h1>

            <p className="mt-3 text-sm leading-6 text-zinc-600">
              Start practicing SQL and build your placement skills.
            </p>

          </div>

          {/* Card */}
          <div className="rounded-2xl border border-red-950/50 bg-[#090909] p-6 shadow-2xl shadow-red-950/10 sm:p-8">

            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-400">
                  Full name
                </label>

                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="h-12 w-full rounded-xl border border-zinc-900 bg-[#050505] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-red-800 focus:ring-1 focus:ring-red-900/40"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-400">
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-zinc-900 bg-[#050505] pl-11 pr-4 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-red-800 focus:ring-1 focus:ring-red-900/40"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-400">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    className="h-12 w-full rounded-xl border border-zinc-900 bg-[#050505] pl-11 pr-12 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-red-800 focus:ring-1 focus:ring-red-900/40"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 transition hover:text-zinc-300"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-[10px] text-zinc-700">
                  Minimum 6 characters
                </p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="mb-2 block text-xs font-semibold text-zinc-400">
                  Confirm password
                </label>

                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-700"
                  />

                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    className="h-12 w-full rounded-xl border border-zinc-900 bg-[#050505] pl-11 pr-12 text-sm text-zinc-200 outline-none transition placeholder:text-zinc-700 focus:border-red-800 focus:ring-1 focus:ring-red-900/40"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-700 transition hover:text-zinc-300"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-900/50 bg-red-950/20 px-4 py-3 text-xs leading-5 text-red-400">
                  {error}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-red-700 text-sm font-bold transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Create Account"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>

            </form>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-zinc-900" />

              <span className="text-[10px] uppercase tracking-wider text-zinc-700">
                Already registered?
              </span>

              <div className="h-px flex-1 bg-zinc-900" />
            </div>

            {/* Login */}
            <Link
              to="/login"
              className="flex h-11 w-full items-center justify-center rounded-xl border border-zinc-900 text-xs font-semibold text-zinc-400 transition hover:border-red-900/60 hover:bg-red-950/10 hover:text-zinc-200"
            >
              Sign in to your account
            </Link>

          </div>

          {/* Footer */}
          <p className="mt-6 text-center text-[10px] leading-5 text-zinc-700">
            Practice SQL. Build confidence. Crack placements.
          </p>

        </div>

      </main>
    </div>
  );
}

export default Register;