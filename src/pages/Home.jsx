import {
  ArrowRight,
  Code2,
  Database,
  Flame,
  Play,
  ShieldCheck,
  Terminal,
  Trophy,
  Users,
  Zap,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-[#030303] text-white">

      {/* =========================================================
          BACKGROUND
      ========================================================= */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-[-300px] h-[650px] w-[900px] -translate-x-1/2 rounded-full bg-red-700/10 blur-[150px]" />

        <div className="absolute left-[-200px] top-[35%] h-[450px] w-[450px] rounded-full bg-red-950/10 blur-[130px]" />

        <div className="absolute bottom-[-250px] right-[-200px] h-[600px] w-[600px] rounded-full bg-red-950/15 blur-[150px]" />

        {/* subtle grid */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.35) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.35) 1px, transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />
      </div>

      {/* =========================================================
          NAVBAR
      ========================================================= */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-black/70 backdrop-blur-2xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:h-[76px] sm:px-6 lg:px-8">

          {/* Logo */}
          <Link to="/" className="group flex items-center gap-2.5 sm:gap-3">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-red-600 text-sm font-black shadow-lg shadow-red-950/40 transition duration-300 group-hover:scale-105 group-hover:bg-red-500 sm:h-10 sm:w-10">
              S
            </div>

            <div>
              <div className="text-base font-black tracking-tight sm:text-lg">
                SQL<span className="text-red-500">Forge</span>
              </div>

              <div className="hidden text-[9px] uppercase tracking-[0.28em] text-zinc-600 sm:block">
                Master SQL
              </div>
            </div>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              How It Works
            </a>

            <a
              href="#stats"
              className="text-sm text-zinc-500 transition hover:text-white"
            >
              Why SQLForge
            </a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/login"
              className="hidden px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:text-white sm:block"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="group flex items-center gap-1.5 rounded-xl border border-red-500/20 bg-red-600 px-4 py-2.5 text-xs font-bold shadow-lg shadow-red-950/30 transition hover:bg-red-500 hover:shadow-red-900/40 sm:px-5 sm:text-sm"
            >
              Get Started
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          </div>
        </div>
      </nav>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative">
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 pb-20 pt-16 sm:px-6 sm:pb-28 sm:pt-20 lg:min-h-[calc(100vh-76px)] lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-20">

          {/* LEFT */}
          <div className="relative">

            {/* Badge */}
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-950/20 px-3.5 py-2 shadow-lg shadow-red-950/10">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>

              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-red-400 sm:text-[10px]">
                Built for Placement Training
              </span>
            </div>

            {/* Heading */}
            <h1 className="max-w-4xl text-[3.25rem] font-black leading-[0.95] tracking-[-0.045em] sm:text-6xl lg:text-[5.25rem] xl:text-[5.8rem]">
              Stop
              <br />
              <span className="text-zinc-500">memorizing.</span>
              <br />
              <span className="relative inline-block text-red-500">
                Start querying.
                <span className="absolute -bottom-2 left-0 h-[2px] w-1/2 bg-gradient-to-r from-red-500 to-transparent" />
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-xl text-sm leading-7 text-zinc-400 sm:mt-8 sm:text-base sm:leading-8 lg:text-lg">
              SQLForge is an interactive SQL practice platform designed
              to help students build real query-solving skills and prepare
              for technical placement interviews.
            </p>

            {/* CTA */}
            <div className="mt-8 flex w-full flex-col gap-3 sm:mt-9 sm:flex-row sm:flex-wrap">

              <Link
                to="/login"
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-7 py-4 text-sm font-bold shadow-xl shadow-red-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-900/50 sm:w-auto"
              >
                Start Practicing

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <a
                href="#features"
                className="group flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-7 py-4 text-sm font-semibold text-zinc-300 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-red-500/30 hover:bg-red-950/10 hover:text-white sm:w-auto"
              >
                <Play size={15} />

                Explore Platform

                <ChevronRight
                  size={14}
                  className="text-zinc-600 transition group-hover:translate-x-0.5 group-hover:text-red-400"
                />
              </a>
            </div>

            {/* Trust points */}
            <div className="mt-9 grid gap-3 text-[10px] uppercase tracking-wider text-zinc-600 sm:flex sm:flex-wrap sm:gap-5">

              <div className="flex items-center gap-2">
                <ShieldCheck size={14} className="text-red-500" />
                Safe SQL Environment
              </div>

              <div className="flex items-center gap-2">
                <Database size={14} className="text-red-500" />
                Real SQL Execution
              </div>

              <div className="flex items-center gap-2">
                <Zap size={14} className="text-red-500" />
                Instant Results
              </div>
            </div>

            {/* Creator signature */}
            <div className="mt-10 flex items-center gap-3">
              <div className="h-px w-8 bg-red-600/60" />

              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-zinc-600">
                  Made with
                </span>

                <span className="text-red-500">♥</span>

                <span className="font-semibold text-zinc-300">
                  by Joe
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================
              CODE EDITOR VISUAL
          ===================================================== */}
          <div className="relative w-full">

            {/* Glow */}
            <div className="absolute inset-[-30px] rounded-full bg-red-700/10 blur-[90px]" />

            <div className="relative rounded-2xl border border-red-500/10 bg-[#070707]/95 p-1 shadow-2xl shadow-black">

              {/* Inner */}
              <div className="overflow-hidden rounded-[14px] border border-white/[0.04]">

                {/* Editor header */}
                <div className="flex items-center justify-between border-b border-white/[0.05] bg-[#0b0b0b] px-4 py-3.5 sm:px-5">

                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-red-900" />
                    <span className="h-2.5 w-2.5 rounded-full bg-zinc-700" />
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-zinc-600">
                    <Terminal size={12} />
                    query.sql
                  </div>
                </div>

                {/* Editor */}
                <div className="flex min-h-[300px] sm:min-h-[355px]">

                  {/* Line numbers */}
                  <div className="w-10 shrink-0 border-r border-white/[0.04] bg-[#050505] px-2 py-5 text-right font-mono text-[10px] leading-7 text-zinc-800 sm:w-12 sm:px-3 sm:text-xs">
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                    <div>4</div>
                    <div>5</div>
                    <div>6</div>
                    <div>7</div>
                    <div>8</div>
                  </div>

                  {/* Code */}
                  <div className="min-w-0 flex-1 overflow-hidden p-4 font-mono text-[10px] leading-7 sm:p-6 sm:text-sm">

                    <div className="whitespace-nowrap">
                      <span className="text-red-500">SELECT</span>{" "}
                      <span className="text-zinc-300">
                        name,
                      </span>{" "}
                      <span className="text-zinc-300">
                        salary
                      </span>
                    </div>

                    <div className="whitespace-nowrap">
                      <span className="text-red-500">FROM</span>{" "}
                      <span className="text-orange-400">
                        employees
                      </span>
                    </div>

                    <div className="whitespace-nowrap">
                      <span className="text-red-500">WHERE</span>{" "}
                      <span className="text-zinc-300">
                        salary
                      </span>{" "}
                      <span className="text-red-400">
                        &gt;
                      </span>{" "}
                      <span className="text-orange-400">
                        50000
                      </span>
                    </div>

                    <div className="whitespace-nowrap">
                      <span className="text-red-500">
                        ORDER BY
                      </span>{" "}
                      <span className="text-zinc-300">
                        salary
                      </span>{" "}
                      <span className="text-red-400">
                        DESC
                      </span>
                      <span className="text-zinc-600">
                        ;
                      </span>
                    </div>

                    {/* Cursor */}
                    <div className="mt-1 h-4 w-[2px] animate-pulse bg-red-500" />

                    {/* Result */}
                    <div className="mt-10 border-t border-white/[0.05] pt-5">

                      <div className="flex items-center gap-2 text-[10px] text-emerald-500 sm:text-xs">
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />

                        Query executed successfully
                      </div>

                      <div className="mt-4 grid grid-cols-2 gap-2 text-[9px] sm:text-xs">

                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <p className="text-zinc-700">ROWS</p>
                          <p className="mt-1 font-bold text-zinc-300">
                            3
                          </p>
                        </div>

                        <div className="rounded-lg border border-white/[0.04] bg-white/[0.02] p-2.5">
                          <p className="text-zinc-700">TIME</p>
                          <p className="mt-1 font-bold text-zinc-300">
                            12ms
                          </p>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                {/* Editor footer */}
                <div className="flex flex-col gap-3 border-t border-white/[0.05] bg-[#090909] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">

                  <div className="flex items-center gap-2 text-[10px] text-zinc-600">
                    <Database size={12} />
                    MySQL · Practice Database
                  </div>

                  <button
                    type="button"
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-xs font-bold transition hover:bg-red-500 sm:w-auto"
                  >
                    <Play size={12} fill="currentColor" />
                    Run Query
                  </button>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-[#0b0b0b]/95 px-4 py-3 shadow-xl backdrop-blur-xl sm:flex lg:-left-6">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/40 text-red-500">
                <Code2 size={14} />
              </div>

              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-700">
                  Real SQL
                </p>
                <p className="text-xs font-bold text-zinc-300">
                  Practice Environment
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          STATS
      ========================================================= */}
      <section
        id="stats"
        className="border-y border-white/[0.05] bg-[#070707]"
      >
        <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">

          <Stat value="150+" label="SQL Problems" />
          <Stat value="15+" label="SQL Concepts" />
          <Stat value="3" label="Difficulty Levels" />
          <Stat value="∞" label="Practice" />

        </div>
      </section>

      {/* =========================================================
          FEATURES
      ========================================================= */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      >
        <div className="max-w-2xl">

          <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 sm:text-xs">
            <Sparkles size={13} />
            Everything you need
          </div>

          <h2 className="mt-5 text-3xl font-black tracking-tight sm:text-5xl">
            Practice SQL
            <br />
            <span className="text-zinc-600">
              the right way.
            </span>
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Stop watching tutorials endlessly. Write queries,
            make mistakes, understand them, and improve.
          </p>
        </div>

        <div className="mt-10 grid gap-4 sm:mt-16 sm:grid-cols-2 lg:grid-cols-3">

          <FeatureCard
            icon={<Code2 />}
            title="Real SQL Editor"
            description="Write queries in a professional editor with syntax highlighting and instant execution."
          />

          <FeatureCard
            icon={<Database />}
            title="Real Database"
            description="Practice against structured databases instead of solving questions on paper."
          />

          <FeatureCard
            icon={<Zap />}
            title="Instant Results"
            description="Execute your query and immediately inspect the returned rows."
          />

          <FeatureCard
            icon={<Flame />}
            title="Daily Practice"
            description="Build consistency with daily challenges and practice streaks."
          />

          <FeatureCard
            icon={<Trophy />}
            title="Placement Mode"
            description="Take SQL challenges designed around common technical interview patterns."
          />

          <FeatureCard
            icon={<Users />}
            title="Track Progress"
            description="Understand your strengths, weaknesses, accuracy, and improvement over time."
          />

        </div>
      </section>

      {/* =========================================================
          HOW IT WORKS
      ========================================================= */}
      <section
        id="how-it-works"
        className="border-y border-white/[0.05] bg-[#070707]"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">

          <div className="text-center">

            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-red-500 sm:text-xs">
              Simple workflow
            </p>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              From question to mastery.
            </h2>

          </div>

          <div className="mt-10 grid gap-4 sm:mt-16 md:grid-cols-3">

            <Step
              number="01"
              title="Choose a Problem"
              description="Pick a SQL challenge based on topic and difficulty."
            />

            <Step
              number="02"
              title="Write Your Query"
              description="Use the SQL editor to build your own solution."
            />

            <Step
              number="03"
              title="Execute & Improve"
              description="Run the query, inspect the result, and learn from mistakes."
            />

          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-6 sm:py-32">

        <div className="absolute left-1/2 top-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-700/10 blur-[120px]" />

        <div className="relative mx-auto max-w-3xl text-center">

          <div className="mx-auto flex w-fit items-center gap-2 rounded-full border border-red-500/20 bg-red-950/20 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-red-400">
            <Flame size={13} />
            Your SQL journey starts here
          </div>

          <h2 className="mt-6 text-4xl font-black tracking-[-0.04em] sm:text-6xl">
            Ready to
            <span className="text-red-500"> forge </span>
            your skills?
          </h2>

          <p className="mx-auto mt-6 max-w-xl text-sm leading-7 text-zinc-500 sm:text-base">
            Practice consistently. Build confidence.
            Walk into your next technical interview prepared.
          </p>

          <Link
            to="/login"
            className="group mt-9 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-8 py-4 text-sm font-bold shadow-xl shadow-red-950/40 transition duration-300 hover:-translate-y-0.5 hover:bg-red-500 hover:shadow-red-900/50 sm:w-auto"
          >
            Start Practicing

            <ArrowRight
              size={17}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>

          {/* Creator signature */}
          <div className="mt-10 flex items-center justify-center gap-2 text-xs">
            <span className="text-zinc-700">
              Made with
            </span>

            <span className="text-base text-red-500">
              ♥
            </span>

            <span className="font-bold text-zinc-400">
              by Joe
            </span>
          </div>

        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <Footer />
    </div>
  );
}

/* =============================================================
   STAT
============================================================= */

function Stat({ value, label }) {
  return (
    <div className="border-r border-white/[0.04] px-3 py-8 text-center last:border-r-0 sm:px-6 sm:py-10">
      <p className="text-2xl font-black text-red-500 sm:text-3xl">
        {value}
      </p>

      <p className="mt-2 text-[9px] uppercase tracking-[0.2em] text-zinc-700 sm:text-xs">
        {label}
      </p>
    </div>
  );
}

/* =============================================================
   FEATURE CARD
============================================================= */

function FeatureCard({
  icon,
  title,
  description,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.015] p-5 transition duration-300 hover:-translate-y-1 hover:border-red-500/20 hover:bg-red-950/[0.04] sm:p-7">

      {/* hover glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-32 w-32 rounded-full bg-red-600/0 blur-[50px] transition duration-500 group-hover:bg-red-600/10" />

      <div className="relative">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-500/15 bg-red-950/20 text-red-500 transition duration-300 group-hover:scale-105 group-hover:bg-red-600 group-hover:text-white">
          {icon}
        </div>

        <h3 className="mt-5 text-base font-bold sm:text-lg">
          {title}
        </h3>

        <p className="mt-3 text-xs leading-6 text-zinc-600 sm:text-sm sm:leading-7">
          {description}
        </p>

      </div>
    </div>
  );
}

/* =============================================================
   STEP
============================================================= */

function Step({
  number,
  title,
  description,
}) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-[#050505] p-6 transition duration-300 hover:border-red-500/20 sm:p-8">

      <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-red-600/0 blur-[50px] transition duration-500 group-hover:bg-red-600/5" />

      <div className="relative">

        <span className="font-mono text-sm font-bold text-red-500">
          {number}
        </span>

        <h3 className="mt-5 text-lg font-bold sm:text-xl">
          {title}
        </h3>

        <p className="mt-3 text-xs leading-6 text-zinc-600 sm:text-sm sm:leading-7">
          {description}
        </p>

      </div>
    </div>
  );
}

export default Home;