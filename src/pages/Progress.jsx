import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Award,
  BarChart3,
  Check,
  ChevronRight,
  Code2,
  Database,
  Flame,
  Gauge,
  Lock,
  Medal,
  Rocket,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// CONSTANTS
// ============================================================


const TOTAL_LEVELS = 150;

const DEFAULT_PROGRESS = {
  easy: {
    completed: [],
  },
  medium: {
    completed: [],
  },
  advanced: {
    completed: [],
  },
  xp: 0,
  streak: 0,
};

// ============================================================
// SAFE COMPLETED COUNT
// ============================================================

function getCompletedCount(section) {
  if (!section || !Array.isArray(section.completed)) {
    return 0;
  }

  return new Set(
    section.completed
      .map(Number)
      .filter((level) => Number.isFinite(level))
  ).size;
}

// ============================================================
// COMPONENT
// ============================================================

function Progress() {
  const navigate = useNavigate();

const [progress, setProgress] = useState(
  DEFAULT_PROGRESS
);
const [loading, setLoading] = useState(true);

  // ==========================================================
  // REFRESH WHEN CHALLENGE PROGRESS CHANGES
  // ==========================================================

useEffect(() => {
  const loadProgress = async () => {
    try {
      const token =
        localStorage.getItem("sqlforge_token");

      if (!token) {
        navigate("/login", {
          replace: true,
        });

        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/progress`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load progress."
        );
      }

      setProgress({
        easy: {
          completed:
            Array.isArray(
              data.progress?.easy?.completed
            )
              ? data.progress.easy.completed.map(
                  Number
                )
              : [],
        },

        medium: {
          completed:
            Array.isArray(
              data.progress?.medium?.completed
            )
              ? data.progress.medium.completed.map(
                  Number
                )
              : [],
        },

        advanced: {
          completed:
            Array.isArray(
              data.progress?.advanced?.completed
            )
              ? data.progress.advanced.completed.map(
                  Number
                )
              : [],
        },

        xp: Number(data.progress?.xp) || 0,

        streak:
          Number(data.progress?.streak) || 0,
      });
      setLoading(false);
    } catch (error) {
      console.error(
        "Unable to load SQLForge progress:",
        error
      );
      setLoading(false);
    }
  };

  loadProgress();
}, [navigate]);
  // ==========================================================
  // CALCULATED DATA
  // ==========================================================

  const stats = useMemo(() => {
    const easy = getCompletedCount(progress.easy);
    const medium = getCompletedCount(progress.medium);
    const advanced = getCompletedCount(progress.advanced);

    const completed = easy + medium + advanced;

    const xp = Number(progress.xp) || 0;
    const streak = Number(progress.streak) || 0;

    const completionPercentage =
      TOTAL_LEVELS > 0
        ? Math.round((completed / TOTAL_LEVELS) * 100)
        : 0;

    return {
      easy,
      medium,
      advanced,
      completed,
      xp,
      streak,
      completionPercentage,
    };
  }, [progress]);

  // ==========================================================
  // NEXT LEVEL
  // ==========================================================

  const nextLevel = useMemo(() => {
    if (stats.easy < 50) {
      return {
        level: stats.easy + 1,
        category: "Foundation",
        color: "blue",
        route: `/challenge/${stats.easy + 1}`,
      };
    }

    if (stats.medium < 50) {
      return {
        level: stats.medium + 1,
        category: "Builder",
        color: "violet",
        route: `/challenge/medium/${stats.medium + 1}`,
      };
    }

    if (stats.advanced < 50) {
      return {
        level: stats.advanced + 1,
        category: "Mastery",
        color: "red",
        route: `/challenge/advanced/${stats.advanced + 1}`,
      };
    }

    return {
      level: 150,
      category: "Complete",
      color: "emerald",
      route: "/advanced-levels",
    };
  }, [stats]);

  // ==========================================================
  // OVERALL PROGRESS
  // ==========================================================

  const overallProgress = Math.min(
    100,
    Math.max(0, stats.completionPercentage)
  );

  // ==========================================================
  // NAVIGATION
  // ==========================================================

  const goToChallenges = () => {
    navigate("/challenge-levels");
  };

  const goToProgress = () => {
    navigate("/progress");
  };

  // ==========================================================
  // SKILL DATA
  // ==========================================================

  const skills = [
    {
      title: "SELECT & FROM",
      subtitle: "Query Foundations",
      description:
        "Build confidence with retrieving data and understanding table structure.",
      icon: Code2,
      color: "blue",
      strength:
        stats.easy > 0
          ? Math.min(100, Math.round((stats.easy / 10) * 100))
          : 0,
      tag: "FOUNDATION",
    },

    {
      title: "FILTERING",
      subtitle: "WHERE & Conditions",
      description:
        "Learn to narrow results and express precise data requirements.",
      icon: Target,
      color: "cyan",
      strength:
        stats.easy > 10
          ? Math.min(
              100,
              Math.round(((stats.easy - 10) / 10) * 100)
            )
          : 0,
      tag: "PRECISION",
    },

    {
      title: "AGGREGATION",
      subtitle: "GROUP BY & HAVING",
      description:
        "Turn raw records into meaningful summaries and insights.",
      icon: BarChart3,
      color: "violet",
      strength:
        stats.easy > 20
          ? Math.min(
              100,
              Math.round(((stats.easy - 20) / 10) * 100)
            )
          : 0,
      tag: "ANALYSIS",
    },

    {
      title: "JOINS",
      subtitle: "Relational Thinking",
      description:
        "Connect related tables and understand relationships across data.",
      icon: Database,
      color: "emerald",
      strength:
        stats.easy > 30
          ? Math.min(
              100,
              Math.round(((stats.easy - 30) / 10) * 100)
            )
          : 0,
      tag: "RELATIONS",
    },

    {
      title: "SUBQUERIES",
      subtitle: "Nested Logic",
      description:
        "Break complex SQL problems into smaller and more powerful queries.",
      icon: Activity,
      color: "amber",
      strength:
        stats.medium > 10
          ? Math.min(
              100,
              Math.round((stats.medium / 10) * 100)
            )
          : 0,
      tag: "LOGIC",
    },

    {
      title: "ADVANCED SQL",
      subtitle: "Expert Problem Solving",
      description:
        "Combine multiple SQL concepts to solve complex real-world problems.",
      icon: Zap,
      color: "red",
      strength:
        stats.advanced > 0
          ? Math.min(
              100,
              Math.round((stats.advanced / 10) * 100)
            )
          : 0,
      tag: "MASTERY",
    },
  ];

  // ==========================================================
  // PATH DATA
  // ==========================================================

  const paths = [
    {
      title: "FOUNDATION",
      subtitle: "Easy",
      description:
        "Master the fundamentals of SQL and build your query confidence.",
      completed: stats.easy,
      total: 50,
      icon: Database,
      color: "blue",
      route: "/challenge-levels/easy",
      unlocked: true,
    },

    {
      title: "BUILDER",
      subtitle: "Medium",
      description:
        "Move beyond the basics and solve increasingly complex SQL problems.",
      completed: stats.medium,
      total: 50,
      icon: Rocket,
      color: "violet",
      route: "/medium-levels",
      unlocked: stats.easy >= 50,
    },

    {
      title: "MASTERY",
      subtitle: "Advanced",
      description:
        "Push your SQL skills to expert level with advanced challenges.",
      completed: stats.advanced,
      total: 50,
      icon: Trophy,
      color: "red",
      route: "/advanced-levels",
      unlocked: stats.medium >= 50,
    },
  ];

  // ==========================================================
  // ACHIEVEMENTS
  // ==========================================================

  const achievements = [
    {
      title: "FIRST QUERY",
      description: "Complete your first SQL challenge.",
      unlocked: stats.completed >= 1,
      icon: Zap,
      color: "blue",
    },

    {
      title: "TEN DOWN",
      description: "Complete 10 SQL challenges.",
      unlocked: stats.completed >= 10,
      icon: Medal,
      color: "violet",
    },

    {
      title: "FOUNDATION BUILDER",
      description: "Complete all 50 Foundation challenges.",
      unlocked: stats.easy >= 50,
      icon: Award,
      color: "emerald",
    },

    {
      title: "QUERY WARRIOR",
      description: "Complete 100 challenges.",
      unlocked: stats.completed >= 100,
      icon: SwordsIcon,
      color: "amber",
    },

    {
      title: "SQL MASTER",
      description: "Complete all 150 SQLForge challenges.",
      unlocked: stats.completed >= 150,
      icon: CrownIcon,
      color: "red",
    },
  ];

  // ==========================================================
  // COLOR HELPERS
  // ==========================================================

  const colorStyles = {
    blue: {
      text: "text-blue-400",
      softText: "text-blue-300",
      border: "border-blue-500/20",
      bg: "bg-blue-500/10",
      strongBg: "bg-blue-500/15",
      glow: "shadow-[0_0_35px_rgba(59,130,246,0.10)]",
      progress: "bg-blue-500",
      dot: "bg-blue-400",
    },

    cyan: {
      text: "text-cyan-400",
      softText: "text-cyan-300",
      border: "border-cyan-500/20",
      bg: "bg-cyan-500/10",
      strongBg: "bg-cyan-500/15",
      glow: "shadow-[0_0_35px_rgba(6,182,212,0.10)]",
      progress: "bg-cyan-500",
      dot: "bg-cyan-400",
    },

    violet: {
      text: "text-violet-400",
      softText: "text-violet-300",
      border: "border-violet-500/20",
      bg: "bg-violet-500/10",
      strongBg: "bg-violet-500/15",
      glow: "shadow-[0_0_35px_rgba(139,92,246,0.10)]",
      progress: "bg-violet-500",
      dot: "bg-violet-400",
    },

    emerald: {
      text: "text-emerald-400",
      softText: "text-emerald-300",
      border: "border-emerald-500/20",
      bg: "bg-emerald-500/10",
      strongBg: "bg-emerald-500/15",
      glow: "shadow-[0_0_35px_rgba(16,185,129,0.10)]",
      progress: "bg-emerald-500",
      dot: "bg-emerald-400",
    },

    amber: {
      text: "text-amber-400",
      softText: "text-amber-300",
      border: "border-amber-500/20",
      bg: "bg-amber-500/10",
      strongBg: "bg-amber-500/15",
      glow: "shadow-[0_0_35px_rgba(245,158,11,0.10)]",
      progress: "bg-amber-500",
      dot: "bg-amber-400",
    },

    red: {
      text: "text-red-400",
      softText: "text-red-300",
      border: "border-red-500/20",
      bg: "bg-red-500/10",
      strongBg: "bg-red-500/15",
      glow: "shadow-[0_0_35px_rgba(239,68,68,0.12)]",
      progress: "bg-red-500",
      dot: "bg-red-400",
    },
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050608] text-white">
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-15%] top-[-15%] h-[500px] w-[500px] rounded-full bg-blue-600/[0.06] blur-[140px]" />

        <div className="absolute right-[-12%] top-[18%] h-[500px] w-[500px] rounded-full bg-violet-600/[0.06] blur-[150px]" />

        <div className="absolute bottom-[-15%] left-[35%] h-[450px] w-[450px] rounded-full bg-red-600/[0.045] blur-[140px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      {/* ======================================================
          PAGE
      ====================================================== */}

      <div className="relative z-10 mx-auto w-full max-w-[1500px] px-4 pb-16 sm:px-6 lg:px-8">
        {/* ====================================================
            TOP BAR
        ==================================================== */}

        <header className="flex h-[76px] items-center justify-between border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="group flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.025] text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-white"
              title="Back to dashboard"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />
            </button>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/[0.08]">
              <Database
                size={17}
                className="text-red-400"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-black tracking-tight">
                  SQLForge
                </span>

                <span className="rounded-full border border-blue-500/20 bg-blue-500/[0.06] px-2 py-0.5 text-[7px] font-black uppercase tracking-[0.2em] text-blue-400">
                  Analytics
                </span>
              </div>

              <p className="text-[9px] text-zinc-600">
                Your SQL progression
              </p>
            </div>
          </div>

          <button
            onClick={goToChallenges}
            className="group flex items-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-500 transition hover:border-red-500/30 hover:bg-red-500/[0.06] hover:text-white"
          >
            Continue Learning
            <ArrowRight
              size={13}
              className="transition-transform group-hover:translate-x-0.5"
            />
          </button>
        </header>

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="relative py-14 sm:py-20">
          <div className="max-w-4xl">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-px w-8 bg-red-500" />

              <span className="text-[9px] font-black uppercase tracking-[0.35em] text-red-400">
                Progress Intelligence
              </span>
            </div>

            <h1 className="text-4xl font-black leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Your SQL journey
              <br />
              is{" "}
              <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-red-400 bg-clip-text text-transparent">
                just getting started.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-sm leading-6 text-zinc-500 sm:text-base">
              Every challenge you solve strengthens your ability to
              think in data. Track your growth, understand your
              strengths, and keep pushing toward SQL mastery.
            </p>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <div className="rounded-full border border-blue-500/15 bg-blue-500/[0.05] px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-blue-400">
              {stats.completed} / {TOTAL_LEVELS} Challenges
            </div>

            <div className="rounded-full border border-violet-500/15 bg-violet-500/[0.05] px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-violet-400">
              {stats.xp} XP Earned
            </div>

            <div className="rounded-full border border-red-500/15 bg-red-500/[0.05] px-3 py-2 text-[8px] font-black uppercase tracking-[0.18em] text-red-400">
              {stats.streak} Day Streak
            </div>
          </div>
        </section>

        {/* ====================================================
            OVERALL JOURNEY
        ==================================================== */}

        <section className="rounded-[30px] border border-white/[0.07] bg-[#080a0e]/90 p-5 shadow-2xl sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Sparkles
                  size={14}
                  className="text-blue-400"
                />

                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">
                  Overall Journey
                </span>
              </div>

              <h2 className="text-2xl font-black tracking-tight sm:text-3xl">
                From{" "}
                <span className="text-blue-400">
                  foundations
                </span>{" "}
                to{" "}
                <span className="text-red-400">
                  mastery.
                </span>
              </h2>

              <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-600">
                Your entire SQLForge journey is divided into three
                progressive paths.
              </p>
            </div>

            <div className="text-left lg:text-right">
              <p className="text-4xl font-black tracking-tight text-white">
                {overallProgress}%
              </p>

              <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                Overall Completion
              </p>
            </div>
          </div>

          {/* Progress bar */}

          <div className="mt-8">
            <div className="h-2 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 via-violet-500 to-red-500 transition-all duration-700"
                style={{
                  width: `${overallProgress}%`,
                }}
              />
            </div>

            <div className="mt-3 flex justify-between text-[8px] font-bold uppercase tracking-[0.16em] text-zinc-700">
              <span>Start</span>
              <span>Growth</span>
              <span>Expert</span>
            </div>
          </div>

          {/* Journey nodes */}

          <div className="relative mt-12">
            <div className="absolute left-[8%] right-[8%] top-8 hidden h-px bg-gradient-to-r from-blue-500/30 via-violet-500/30 to-red-500/30 lg:block" />

            <div className="grid gap-8 lg:grid-cols-3">
              {paths.map((path, index) => {
                const colors =
                  colorStyles[path.color];

                const percentage =
                  path.total > 0
                    ? Math.round(
                        (path.completed /
                          path.total) *
                          100
                      )
                    : 0;

                const Icon = path.icon;

                return (
                  <div
                    key={path.title}
                    className="relative"
                  >
                    <div className="flex flex-col items-center text-center">
                      <div
                        className={`relative z-10 flex h-16 w-16 items-center justify-center rounded-2xl border ${colors.border} ${colors.bg} ${colors.glow}`}
                      >
                        {path.unlocked ? (
                          <Icon
                            size={22}
                            className={colors.text}
                          />
                        ) : (
                          <Lock
                            size={20}
                            className="text-zinc-700"
                          />
                        )}

                        {percentage === 100 && (
                          <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/15">
                            <Check
                              size={12}
                              className="text-emerald-400"
                            />
                          </div>
                        )}
                      </div>

                      <div className="mt-5">
                        <p
                          className={`text-[8px] font-black uppercase tracking-[0.28em] ${colors.text}`}
                        >
                          {path.subtitle}
                        </p>

                        <h3 className="mt-1 text-base font-black">
                          {path.title}
                        </h3>

                        <p className="mx-auto mt-2 max-w-xs text-[10px] leading-5 text-zinc-600">
                          {path.description}
                        </p>
                      </div>

                      <div className="mt-5 w-full max-w-[220px]">
                        <div className="flex items-center justify-between text-[8px] font-bold">
                          <span className="text-zinc-600">
                            Progress
                          </span>

                          <span
                            className={
                              path.unlocked
                                ? colors.text
                                : "text-zinc-700"
                            }
                          >
                            {path.completed}/
                            {path.total}
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                          <div
                            className={`h-full rounded-full ${colors.progress} transition-all duration-500`}
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            ORBIT + METRICS
        ==================================================== */}

        <section className="mt-5 grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
          {/* Orbit */}

          <div className="relative overflow-hidden rounded-[30px] border border-white/[0.07] bg-[#080a0e] p-7 sm:p-9">
            <div className="absolute right-[-20%] top-[-25%] h-64 w-64 rounded-full bg-violet-500/[0.05] blur-[100px]" />

            <div className="relative">
              <div className="flex items-center gap-2">
                <Gauge
                  size={14}
                  className="text-violet-400"
                />

                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-violet-400">
                  Progress Core
                </span>
              </div>

              <h2 className="mt-2 text-xl font-black">
                Your current orbit
              </h2>

              <div className="relative mx-auto mt-8 flex aspect-square max-w-[300px] items-center justify-center">
                {/* Outer ring */}

                <div className="absolute inset-3 rounded-full border border-blue-500/10" />

                <div className="absolute inset-10 rounded-full border border-violet-500/10" />

                <div
                  className="absolute inset-[18%] rounded-full border border-red-500/20"
                  style={{
                    boxShadow:
                      "0 0 60px rgba(239,68,68,0.06)",
                  }}
                />

                {/* Progress arc */}

                <div
                  className="absolute inset-3 rounded-full"
                  style={{
                    background: `conic-gradient(
                      from -90deg,
                      rgba(59,130,246,0.9) 0deg,
                      rgba(139,92,246,0.9) ${
                        overallProgress * 1.8
                      }deg,
                      transparent ${
                        overallProgress * 1.8
                      }deg
                    )`,
                    mask: "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                    WebkitMask:
                      "radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1px))",
                  }}
                />

                {/* Center */}

                <div className="relative z-10 flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white/[0.08] bg-[#07090d] shadow-2xl">
                  <span className="text-4xl font-black tracking-tight">
                    {overallProgress}%
                  </span>

                  <span className="mt-1 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Complete
                  </span>
                </div>

                {/* Orbit labels */}

                <div className="absolute left-0 top-[24%] rounded-xl border border-amber-500/15 bg-amber-500/[0.05] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Zap
                      size={12}
                      className="text-amber-400"
                    />

                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600">
                        XP
                      </p>

                      <p className="text-xs font-black text-amber-400">
                        {stats.xp}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute right-0 top-[24%] rounded-xl border border-red-500/15 bg-red-500/[0.05] px-3 py-2">
                  <div className="flex items-center gap-2">
                    <Flame
                      size={12}
                      className="text-red-400"
                    />

                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600">
                        Streak
                      </p>

                      <p className="text-xs font-black text-red-400">
                        {stats.streak}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-[16%] left-1/2 -translate-x-1/2 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.05] px-4 py-2">
                  <div className="flex items-center gap-2">
                    <Activity
                      size={12}
                      className="text-emerald-400"
                    />

                    <div>
                      <p className="text-[7px] font-black uppercase tracking-widest text-zinc-600">
                        Levels
                      </p>

                      <p className="text-xs font-black text-emerald-400">
                        {stats.completed}/150
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics */}

          <div className="grid grid-cols-2 gap-4">
            <MetricCard
              icon={Target}
              label="Challenges Solved"
              value={stats.completed}
              suffix={`/ ${TOTAL_LEVELS}`}
              color="blue"
              description="Completed across all paths"
              styles={colorStyles}
            />

            <MetricCard
              icon={Zap}
              label="Experience Points"
              value={stats.xp}
              suffix=" XP"
              color="amber"
              description="Earned from completed challenges"
              styles={colorStyles}
            />

            <MetricCard
              icon={BarChart3}
              label="Query Accuracy"
              value="—"
              suffix=""
              color="violet"
              description="Accuracy tracking coming next"
              styles={colorStyles}
            />

            <MetricCard
              icon={Flame}
              label="Day Streak"
              value={stats.streak}
              suffix={
                stats.streak === 1
                  ? " day"
                  : " days"
              }
              color="red"
              description="Keep the SQL fire alive"
              styles={colorStyles}
            />

            <div className="col-span-2 rounded-[26px] border border-white/[0.07] bg-[#080a0e] p-6 sm:p-7">
              <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Rocket
                      size={15}
                      className="text-blue-400"
                    />

                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-blue-400">
                      Next Destination
                    </p>
                  </div>

                  <h3 className="mt-2 text-lg font-black">
                    {nextLevel.category}
                    <span className="ml-2 text-zinc-600">
                      Level {nextLevel.level}
                    </span>
                  </h3>

                  <p className="mt-1 text-[10px] text-zinc-600">
                    One challenge at a time. Keep building.
                  </p>
                </div>

                <button
                  onClick={() =>
                    navigate(nextLevel.route)
                  }
                  className="group flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.08] px-5 py-3 text-[9px] font-black uppercase tracking-[0.16em] text-red-400 transition hover:border-red-400/40 hover:bg-red-500/[0.14] hover:text-red-300"
                >
                  Continue
                  <ArrowRight
                    size={13}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ====================================================
            LEARNING PATHS
        ==================================================== */}

        <section className="mt-16">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="flex items-center gap-2">
                <Rocket
                  size={14}
                  className="text-blue-400"
                />

                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-blue-400">
                  Learning Paths
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                Three paths.
                <span className="text-zinc-600">
                  {" "}
                  One destination.
                </span>
              </h2>
            </div>

            <p className="max-w-md text-[10px] leading-5 text-zinc-600 sm:text-right">
              Progress through each stage as your SQL knowledge
              becomes deeper and more powerful.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {paths.map((path) => {
              const colors =
                colorStyles[path.color];

              const percentage =
                path.total > 0
                  ? Math.round(
                      (path.completed /
                        path.total) *
                        100
                    )
                  : 0;

              const Icon = path.icon;

              return (
                <button
                  key={path.title}
                  onClick={() =>
                    path.unlocked &&
                    navigate(path.route)
                  }
                  disabled={!path.unlocked}
                  className={`group relative overflow-hidden rounded-[26px] border p-6 text-left transition ${
                    path.unlocked
                      ? `${colors.border} bg-[#080a0e] hover:-translate-y-1 hover:bg-[#0a0d12] ${colors.glow}`
                      : "cursor-not-allowed border-white/[0.05] bg-[#07080b] opacity-60"
                  }`}
                >
                  <div
                    className={`absolute right-[-50px] top-[-50px] h-36 w-36 rounded-full blur-[70px] ${
                      path.unlocked
                        ? colors.bg
                        : ""
                    }`}
                  />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl border ${colors.border} ${colors.bg}`}
                      >
                        {path.unlocked ? (
                          <Icon
                            size={17}
                            className={colors.text}
                          />
                        ) : (
                          <Lock
                            size={16}
                            className="text-zinc-700"
                          />
                        )}
                      </div>

                      {path.unlocked ? (
                        <ChevronRight
                          size={16}
                          className="text-zinc-700 transition-all group-hover:translate-x-1 group-hover:text-white"
                        />
                      ) : (
                        <span className="text-[7px] font-black uppercase tracking-widest text-zinc-700">
                          Locked
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-7 text-[8px] font-black uppercase tracking-[0.25em] ${colors.text}`}
                    >
                      {path.subtitle}
                    </p>

                    <h3 className="mt-1 text-xl font-black">
                      {path.title}
                    </h3>

                    <p className="mt-3 min-h-[40px] text-[10px] leading-5 text-zinc-600">
                      {path.description}
                    </p>

                    <div className="mt-6">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">
                          Completion
                        </span>

                        <span
                          className={`text-[9px] font-black ${colors.text}`}
                        >
                          {percentage}%
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/[0.04]">
                        <div
                          className={`h-full rounded-full ${colors.progress}`}
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between text-[8px] font-bold">
                      <span className="text-zinc-700">
                        {path.completed} completed
                      </span>

                      <span className="text-zinc-700">
                        {path.total} total
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            SKILL CONSTELLATION
        ==================================================== */}

        <section className="mt-16">
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Star
                  size={14}
                  className="text-violet-400"
                />

                <p className="text-[8px] font-black uppercase tracking-[0.3em] text-violet-400">
                  Skill Constellation
                </p>
              </div>

              <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
                The skills behind
                <span className="text-violet-400">
                  {" "}
                  your progress.
                </span>
              </h2>

              <p className="mt-2 max-w-xl text-[10px] leading-5 text-zinc-600">
                Your challenge progression gradually develops
                these core SQL abilities.
              </p>
            </div>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {skills.map((skill) => {
              const colors =
                colorStyles[skill.color];

              const Icon = skill.icon;

              return (
                <div
                  key={skill.title}
                  className={`group rounded-[24px] border ${colors.border} bg-[#080a0e] p-5 transition hover:-translate-y-0.5 hover:bg-[#0a0d12]`}
                >
                  <div className="flex items-start justify-between">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
                    >
                      <Icon
                        size={16}
                        className={colors.text}
                      />
                    </div>

                    <span
                      className={`rounded-full border ${colors.border} ${colors.bg} px-2 py-1 text-[6px] font-black uppercase tracking-[0.18em] ${colors.text}`}
                    >
                      {skill.tag}
                    </span>
                  </div>

                  <div className="mt-5">
                    <p
                      className={`text-[8px] font-black uppercase tracking-[0.2em] ${colors.text}`}
                    >
                      {skill.subtitle}
                    </p>

                    <h3 className="mt-1 text-sm font-black">
                      {skill.title}
                    </h3>

                    <p className="mt-2 min-h-[42px] text-[9px] leading-5 text-zinc-600">
                      {skill.description}
                    </p>
                  </div>

                  <div className="mt-5">
                    <div className="flex items-center justify-between">
                      <span className="text-[7px] font-bold uppercase tracking-widest text-zinc-700">
                        Development
                      </span>

                      <span
                        className={`text-[8px] font-black ${colors.text}`}
                      >
                        {skill.strength}%
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/[0.04]">
                      <div
                        className={`h-full rounded-full ${colors.progress} transition-all duration-700`}
                        style={{
                          width: `${skill.strength}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ====================================================
            ACTIVITY + ACHIEVEMENTS
        ==================================================== */}

        <section className="mt-16 grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
          {/* Activity */}

          <div className="rounded-[28px] border border-white/[0.07] bg-[#080a0e] p-6 sm:p-7">
            <div className="flex items-center gap-2">
              <Activity
                size={14}
                className="text-cyan-400"
              />

              <p className="text-[8px] font-black uppercase tracking-[0.3em] text-cyan-400">
                Recent Activity
              </p>
            </div>

            <h2 className="mt-2 text-xl font-black">
              Your latest moves.
            </h2>

            {stats.completed === 0 ? (
              <div className="mt-8 flex flex-col items-center rounded-2xl border border-dashed border-white/[0.07] bg-white/[0.015] px-6 py-10 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-blue-500/15 bg-blue-500/[0.06]">
                  <Code2
                    size={19}
                    className="text-blue-400"
                  />
                </div>

                <h3 className="mt-5 text-sm font-black">
                  Your activity starts here.
                </h3>

                <p className="mt-2 max-w-xs text-[9px] leading-5 text-zinc-600">
                  Complete your first SQLForge challenge and
                  your progress story will begin appearing here.
                </p>

                <button
                  onClick={goToChallenges}
                  className="group mt-6 flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/[0.07] px-4 py-2.5 text-[8px] font-black uppercase tracking-[0.16em] text-red-400 transition hover:bg-red-500/[0.12]"
                >
                  Start Challenge
                  <ArrowRight
                    size={12}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            ) : (
              <div className="mt-6 space-y-3">
                <ActivityRow
                  icon={Check}
                  title={`${stats.completed} challenge${
                    stats.completed === 1
                      ? ""
                      : "s"
                  } completed`}
                  subtitle="Your SQL journey is moving forward."
                  color="emerald"
                  styles={colorStyles}
                />

                <ActivityRow
                  icon={Zap}
                  title={`${stats.xp} XP earned`}
                  subtitle="Experience collected from your challenges."
                  color="amber"
                  styles={colorStyles}
                />

                <ActivityRow
                  icon={Flame}
                  title={`${stats.streak} day streak`}
                  subtitle="Keep showing up and keep improving."
                  color="red"
                  styles={colorStyles}
                />
              </div>
            )}
          </div>

          {/* Achievements */}

          <div className="rounded-[28px] border border-white/[0.07] bg-[#080a0e] p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Award
                    size={14}
                    className="text-amber-400"
                  />

                  <p className="text-[8px] font-black uppercase tracking-[0.3em] text-amber-400">
                    Achievements
                  </p>
                </div>

                <h2 className="mt-2 text-xl font-black">
                  Milestones waiting for you.
                </h2>
              </div>

              <span className="rounded-full border border-amber-500/15 bg-amber-500/[0.05] px-2.5 py-1 text-[7px] font-black uppercase tracking-widest text-amber-400">
                {achievements.filter(
                  (achievement) =>
                    achievement.unlocked
                ).length}
                /{achievements.length}
              </span>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {achievements.map((achievement) => {
                const colors =
                  colorStyles[achievement.color];

                const Icon = achievement.icon;

                return (
                  <div
                    key={achievement.title}
                    className={`rounded-2xl border p-4 ${
                      achievement.unlocked
                        ? `${colors.border} ${colors.bg}`
                        : "border-white/[0.05] bg-white/[0.015]"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                          achievement.unlocked
                            ? colors.bg
                            : "bg-white/[0.025]"
                        }`}
                      >
                        {achievement.unlocked ? (
                          <Icon
                            size={15}
                            className={
                              colors.text
                            }
                          />
                        ) : (
                          <Lock
                            size={14}
                            className="text-zinc-700"
                          />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-[8px] font-black uppercase tracking-[0.16em] ${
                            achievement.unlocked
                              ? colors.text
                              : "text-zinc-600"
                          }`}
                        >
                          {achievement.title}
                        </p>

                        <p className="mt-1 text-[8px] leading-4 text-zinc-600">
                          {achievement.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ====================================================
            FINAL CTA
        ==================================================== */}

        <section className="relative mt-16 overflow-hidden rounded-[32px] border border-red-500/15 bg-[#09090c] p-8 sm:p-12">
          <div className="absolute left-[-10%] top-[-80%] h-[500px] w-[500px] rounded-full bg-red-500/[0.07] blur-[130px]" />

          <div className="absolute right-[-10%] bottom-[-80%] h-[500px] w-[500px] rounded-full bg-violet-500/[0.06] blur-[130px]" />

          <div className="relative flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2">
                <Sparkles
                  size={15}
                  className="text-red-400"
                />

                <span className="text-[8px] font-black uppercase tracking-[0.3em] text-red-400">
                  Keep Forging
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-black tracking-[-0.03em] sm:text-4xl">
                Turn{" "}
                <span className="text-red-400">
                  {stats.completed}
                </span>{" "}
                into{" "}
                <span className="bg-gradient-to-r from-blue-400 via-violet-400 to-red-400 bg-clip-text text-transparent">
                  mastery.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-xs leading-6 text-zinc-600">
                The leaderboard doesn't matter. The streak doesn't
                matter. What matters is becoming better at solving
                problems with SQL.
              </p>
            </div>

            <button
              onClick={goToChallenges}
              className="group flex shrink-0 items-center justify-center gap-3 rounded-2xl border border-red-400/25 bg-red-500/[0.10] px-6 py-4 text-[9px] font-black uppercase tracking-[0.18em] text-red-300 transition hover:border-red-400/50 hover:bg-red-500/[0.16] hover:shadow-[0_0_35px_rgba(239,68,68,0.10)]"
            >
              Forge The Next Query
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </section>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/[0.05] pt-6 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-2">
            <Database
              size={12}
              className="text-red-500"
            />

            <span className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
              SQLForge Progress Intelligence
            </span>
          </div>

          <button
            onClick={goToProgress}
            className="text-[8px] font-bold uppercase tracking-[0.18em] text-zinc-700 transition hover:text-white"
          >
            Progress Overview
          </button>
        </footer>
      </div>
      
    </div>
  );
}

// ============================================================
// METRIC CARD
// ============================================================

function MetricCard({
  icon: Icon,
  label,
  value,
  suffix,
  color,
  description,
  styles,
}) {
  const colors = styles[color];

  return (
    <div className="group rounded-[26px] border border-white/[0.07] bg-[#080a0e] p-5 transition hover:border-white/[0.11] sm:p-6">
      <div
        className={`flex h-10 w-10 items-center justify-center rounded-xl ${colors.bg}`}
      >
        <Icon
          size={16}
          className={colors.text}
        />
      </div>

      <p className="mt-6 text-[8px] font-black uppercase tracking-[0.18em] text-zinc-600">
        {label}
      </p>

      <div className="mt-1 flex items-baseline gap-1">
        <span className="text-3xl font-black tracking-tight text-white">
          {value}
        </span>

        {suffix && (
          <span
            className={`text-[9px] font-black ${colors.text}`}
          >
            {suffix}
          </span>
        )}
      </div>

      <p className="mt-2 text-[8px] leading-4 text-zinc-700">
        {description}
      </p>
    </div>
  );
}

// ============================================================
// ACTIVITY ROW
// ============================================================

function ActivityRow({
  icon: Icon,
  title,
  subtitle,
  color,
  styles,
}) {
  const colors = styles[color];

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-white/[0.05] bg-white/[0.015] p-4">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${colors.bg}`}
      >
        <Icon
          size={14}
          className={colors.text}
        />
      </div>

      <div className="min-w-0">
        <p className="text-[9px] font-black text-zinc-300">
          {title}
        </p>

        <p className="mt-1 text-[8px] text-zinc-700">
          {subtitle}
        </p>
      </div>
      
    </div>
  );
}

// ============================================================
// CUSTOM ICONS
// ============================================================

function SwordsIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m14.5 17.5 3 3" />
      <path d="m16 16 5 5" />
      <path d="M14 3 3 14" />
      <path d="m7 3 14 14" />
      <path d="m3 7 4-4" />
      <path d="m17 21 4-4" />
      <path d="m3 21 4-4" />
      <path d="m17 7 4-4" />
    </svg>
  );
}

function CrownIcon({ size = 20, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="m2 4 3 7 4-5 3 6 3-6 4 5 3-7-3 16H5L2 4Z" />
      <path d="M5 20h14" />
    </svg>
  );
}

export default Progress;