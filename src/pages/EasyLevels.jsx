import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Flame,
  Play,
  Trophy,
  Zap,
  Sparkles,
  Target,
  ChevronRight,
  Crown,
  Star,
  ShieldCheck,
  CircleDot,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_LEVELS = 50;

const PROGRESS_STORAGE_KEY = "sqlforge_challenge_progress";

// ------------------------------------------------------------
// DEFAULT PROGRESS
// ------------------------------------------------------------

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

// ------------------------------------------------------------
// DESKTOP LEVEL POSITIONS
// ------------------------------------------------------------

const LEVEL_POSITIONS = [
  // Row 1
  { x: 10, y: 7 },
  { x: 30, y: 7 },
  { x: 50, y: 7 },
  { x: 70, y: 7 },
  { x: 90, y: 7 },

  // Row 2
  { x: 90, y: 17 },
  { x: 70, y: 17 },
  { x: 50, y: 17 },
  { x: 30, y: 17 },
  { x: 10, y: 17 },

  // Row 3
  { x: 10, y: 27 },
  { x: 30, y: 27 },
  { x: 50, y: 27 },
  { x: 70, y: 27 },
  { x: 90, y: 27 },

  // Row 4
  { x: 90, y: 37 },
  { x: 70, y: 37 },
  { x: 50, y: 37 },
  { x: 30, y: 37 },
  { x: 10, y: 37 },

  // Row 5
  { x: 10, y: 47 },
  { x: 30, y: 47 },
  { x: 50, y: 47 },
  { x: 70, y: 47 },
  { x: 90, y: 47 },

  // Row 6
  { x: 90, y: 57 },
  { x: 70, y: 57 },
  { x: 50, y: 57 },
  { x: 30, y: 57 },
  { x: 10, y: 57 },

  // Row 7
  { x: 10, y: 67 },
  { x: 30, y: 67 },
  { x: 50, y: 67 },
  { x: 70, y: 67 },
  { x: 90, y: 67 },

  // Row 8
  { x: 90, y: 77 },
  { x: 70, y: 77 },
  { x: 50, y: 77 },
  { x: 30, y: 77 },
  { x: 10, y: 77 },

  // Row 9
  { x: 10, y: 87 },
  { x: 30, y: 87 },
  { x: 50, y: 87 },
  { x: 70, y: 87 },
  { x: 90, y: 87 },

  // Row 10
  { x: 90, y: 96 },
  { x: 70, y: 96 },
  { x: 50, y: 96 },
  { x: 30, y: 96 },
  { x: 10, y: 96 },
];

// ------------------------------------------------------------
// LEVEL TITLES
// ------------------------------------------------------------

const LEVEL_TITLES = [
  "SELECT Basics",
  "Filtering Data",
  "WHERE Conditions",
  "Sorting Results",
  "LIMIT & OFFSET",
  "DISTINCT",
  "Comparison Operators",
  "Logical Operators",
  "Pattern Matching",
  "NULL Values",

  "Aggregate Functions",
  "COUNT",
  "SUM",
  "AVG",
  "MIN & MAX",
  "GROUP BY",
  "HAVING",
  "Multiple Conditions",
  "Aliases",
  "Expressions",

  "INNER JOIN",
  "LEFT JOIN",
  "RIGHT JOIN",
  "JOIN Conditions",
  "Multiple JOINs",
  "Date Filtering",
  "String Functions",
  "Numeric Functions",
  "CASE Statements",
  "Subqueries",

  "Nested Queries",
  "EXISTS",
  "IN Operator",
  "BETWEEN",
  "COALESCE",
  "Conditional Logic",
  "Advanced Filtering",
  "Data Analysis",
  "Business Queries",
  "Real World SQL",

  "Placement Challenge",
  "Interview SQL",
  "Query Optimization",
  "Complex Queries",
  "SQL Mastery",
  "Problem Solving",
  "Data Exploration",
  "Challenge Mode",
  "Final Preparation",
  "SQLForge Champion",
];

// ------------------------------------------------------------
// LEVEL DESCRIPTIONS
// ------------------------------------------------------------

const LEVEL_DESCRIPTIONS = [
  "Retrieve specific columns",
  "Filter records with conditions",
  "Master WHERE clauses",
  "Sort your query results",
  "Control returned rows",
  "Remove duplicate results",
  "Compare values",
  "Combine multiple conditions",
  "Search using patterns",
  "Handle missing values",

  "Calculate grouped data",
  "Count your records",
  "Calculate totals",
  "Find averages",
  "Find minimum and maximum",
  "Group related records",
  "Filter grouped results",
  "Build complex conditions",
  "Rename columns cleanly",
  "Work with SQL expressions",

  "Combine related tables",
  "Preserve left-side records",
  "Work with right-side tables",
  "Master JOIN conditions",
  "Connect multiple tables",
  "Work with dates",
  "Transform text",
  "Perform numeric calculations",
  "Build conditional results",
  "Query inside queries",

  "Build nested queries",
  "Test record existence",
  "Filter with IN",
  "Filter value ranges",
  "Handle NULL safely",
  "Build conditional logic",
  "Advanced filtering techniques",
  "Analyze datasets",
  "Solve business problems",
  "Real-world SQL scenarios",

  "Placement-level challenge",
  "Interview-style SQL",
  "Improve query performance",
  "Complex SQL problems",
  "Master SQL concepts",
  "Solve difficult problems",
  "Explore unfamiliar data",
  "Challenge yourself",
  "Final preparation",
  "Become an SQLForge Champion",
];

// ------------------------------------------------------------
// SAFE LOCAL PROGRESS
// ------------------------------------------------------------

const getStoredProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(stored);

    return {
      easy: {
        completed: Array.isArray(parsed?.easy?.completed)
          ? parsed.easy.completed.map(Number)
          : [],
      },

      medium: {
        completed: Array.isArray(parsed?.medium?.completed)
          ? parsed.medium.completed.map(Number)
          : [],
      },

      advanced: {
        completed: Array.isArray(parsed?.advanced?.completed)
          ? parsed.advanced.completed.map(Number)
          : [],
      },

      xp: Number(parsed?.xp) || 0,
      streak: Number(parsed?.streak) || 0,
    };
  } catch (error) {
    console.error(
      "Unable to read SQLForge local progress:",
      error
    );

    return DEFAULT_PROGRESS;
  }
};

// ------------------------------------------------------------
// COMPONENT
// ------------------------------------------------------------

function EasyLevels() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(() =>
    getStoredProgress()
  );

  // ----------------------------------------------------------
  // LOAD BACKEND PROGRESS
  // ----------------------------------------------------------

  useEffect(() => {
    const loadProgress = async () => {
      try {
        const token = localStorage.getItem("sqlforge_token");

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
            data.message || "Unable to load progress."
          );
        }

        const backendProgress = {
          easy: {
            completed: Array.isArray(
              data.progress?.easy?.completed
            )
              ? data.progress.easy.completed.map(Number)
              : [],
          },

          medium: {
            completed: Array.isArray(
              data.progress?.medium?.completed
            )
              ? data.progress.medium.completed.map(Number)
              : [],
          },

          advanced: {
            completed: Array.isArray(
              data.progress?.advanced?.completed
            )
              ? data.progress.advanced.completed.map(Number)
              : [],
          },

          xp: Number(data.progress?.xp) || 0,

          streak: Number(data.progress?.streak) || 0,
        };

        setProgress(backendProgress);

        try {
          localStorage.setItem(
            PROGRESS_STORAGE_KEY,
            JSON.stringify(backendProgress)
          );
        } catch (storageError) {
          console.error(
            "Unable to cache SQLForge progress:",
            storageError
          );
        }
      } catch (error) {
        console.error(
          "Unable to load SQLForge progress:",
          error
        );

        // Fall back to local progress
        setProgress(getStoredProgress());
      }
    };

    loadProgress();
  }, [navigate]);

  // ----------------------------------------------------------
  // SYNC LOCAL PROGRESS
  // ----------------------------------------------------------

  useEffect(() => {
    const refreshLocalProgress = () => {
      setProgress(getStoredProgress());
    };

    window.addEventListener(
      "storage",
      refreshLocalProgress
    );

    window.addEventListener(
      "sqlforge-progress-updated",
      refreshLocalProgress
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshLocalProgress
      );

      window.removeEventListener(
        "sqlforge-progress-updated",
        refreshLocalProgress
      );
    };
  }, []);

  // ----------------------------------------------------------
  // COMPLETED LEVELS
  // ----------------------------------------------------------

  const completedLevels = useMemo(() => {
    const completed =
      progress.easy?.completed || [];

    return new Set(
      completed
        .map(Number)
        .filter(
          (level) =>
            Number.isInteger(level) &&
            level >= 1 &&
            level <= TOTAL_LEVELS
        )
    );
  }, [progress.easy]);

  const completedCount = completedLevels.size;

  // ----------------------------------------------------------
  // NEXT LEVEL
  // ----------------------------------------------------------

  const nextLevel = useMemo(() => {
    for (
      let level = 1;
      level <= TOTAL_LEVELS;
      level++
    ) {
      if (!completedLevels.has(level)) {
        return level;
      }
    }

    return TOTAL_LEVELS;
  }, [completedLevels]);

  const progressPercentage =
    (completedCount / TOTAL_LEVELS) * 100;

  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const handleLevelClick = (level) => {
    if (
      !Number.isInteger(level) ||
      level < 1 ||
      level > TOTAL_LEVELS
    ) {
      return;
    }

    navigate(`/challenge/${level}`);
  };

  const handleBack = () => {
    navigate("/challenge-levels");
  };

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#040006] text-white selection:bg-fuchsia-500/30">

      {/* =====================================================
          GLOBAL ATMOSPHERE
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-260px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-fuchsia-700/[0.09] blur-[160px]" />

        <div className="absolute -left-[220px] top-[30%] h-[520px] w-[520px] rounded-full bg-purple-700/[0.08] blur-[170px]" />

        <div className="absolute -right-[220px] bottom-[8%] h-[520px] w-[520px] rounded-full bg-pink-700/[0.07] blur-[170px]" />

        <div className="absolute left-[12%] top-[18%] h-1 w-1 animate-pulse rounded-full bg-fuchsia-400/40" />

        <div className="absolute right-[18%] top-[25%] h-1 w-1 animate-pulse rounded-full bg-purple-400/40 [animation-delay:700ms]" />

        <div className="absolute bottom-[25%] left-[22%] h-1 w-1 animate-pulse rounded-full bg-pink-400/30 [animation-delay:1200ms]" />

        <div className="absolute bottom-[32%] right-[12%] h-1 w-1 animate-pulse rounded-full bg-fuchsia-400/30 [animation-delay:400ms]" />

        <div className="absolute left-1/2 top-0 h-px w-[80%] -translate-x-1/2 bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />
      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-fuchsia-950/40 bg-[#060108]/80 shadow-[0_8px_40px_rgba(0,0,0,0.45)] backdrop-blur-2xl">

        <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />

        <div className="mx-auto flex h-[64px] max-w-[1400px] items-center justify-between px-3 sm:h-16 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-2 sm:gap-3">

            <button
              type="button"
              onClick={handleBack}
              className="
                group relative flex h-9 w-9 shrink-0
                items-center justify-center
                rounded-xl
                border border-fuchsia-950/60
                bg-black/40
                text-zinc-500
                shadow-inner shadow-white/[0.02]
                transition-all duration-300
                active:scale-90
                hover:border-fuchsia-500/60
                hover:bg-fuchsia-950/30
                hover:text-fuchsia-300
              "
            >
              <ArrowLeft
                size={16}
                className="transition-transform duration-300 group-hover:-translate-x-0.5"
              />

              <span className="pointer-events-none absolute inset-0 rounded-xl bg-fuchsia-500/0 transition group-hover:bg-fuchsia-500/5" />
            </button>

            <div className="hidden h-6 w-px bg-gradient-to-b from-transparent via-fuchsia-900/60 to-transparent sm:block" />

            {/* BRAND */}

            <div className="flex min-w-0 items-center gap-2.5">

              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-fuchsia-500 via-purple-700 to-purple-950 shadow-lg shadow-fuchsia-900/40">

                <Database size={16} />

                <div className="absolute inset-0 rounded-xl bg-white/5" />

                <div className="absolute -inset-1 -z-10 rounded-2xl bg-fuchsia-500/10 blur-md" />
              </div>

              <div className="min-w-0">

                <h1 className="text-sm font-black tracking-tight sm:text-base">
                  SQL
                  <span className="text-fuchsia-500">
                    Forge
                  </span>
                </h1>

                <p className="truncate text-[7px] font-bold uppercase tracking-[0.22em] text-zinc-600 sm:text-[8px]">
                  Easy Challenge Map
                </p>

              </div>
            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-1.5 sm:gap-2">

            {/* XP */}

            <div className="group hidden items-center gap-2 rounded-xl border border-yellow-900/20 bg-yellow-950/[0.08] px-3 py-2 transition hover:border-yellow-700/30 sm:flex">

              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-yellow-500/10">
                <Zap
                  size={12}
                  className="text-yellow-400"
                />
              </div>

              <span className="text-xs font-black text-zinc-500">
                {progress.xp || 0} XP
              </span>
            </div>

            {/* MOBILE XP */}

            <div className="flex items-center gap-1 rounded-xl border border-yellow-900/20 bg-yellow-950/[0.08] px-2 py-2 sm:hidden">

              <Zap
                size={12}
                className="text-yellow-400"
              />

              <span className="text-[9px] font-black text-yellow-500/70">
                {progress.xp || 0}
              </span>
            </div>

            {/* STREAK */}

            <div className="flex items-center gap-1.5 rounded-xl border border-red-950/60 bg-gradient-to-br from-red-950/30 to-black/30 px-2.5 py-2 shadow-lg shadow-red-950/10 sm:gap-2 sm:px-3">

              <Flame
                size={13}
                className="text-red-500 drop-shadow-[0_0_6px_rgba(239,68,68,0.5)]"
              />

              <span className="text-xs font-black text-zinc-400">
                {progress.streak || 0}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* =====================================================
          MAIN
      ====================================================== */}

      <main className="relative mx-auto max-w-[1400px] px-3 pb-14 pt-6 sm:px-6 sm:pt-8 lg:px-8">

        {/* ===================================================
            HERO
        ==================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          {/* BADGE */}

          <div className="relative mb-4 inline-flex">

            <div className="absolute -inset-2 rounded-full bg-fuchsia-500/10 blur-lg" />

            <div className="relative inline-flex items-center gap-2 rounded-full border border-fuchsia-800/40 bg-fuchsia-950/20 px-3 py-1.5 shadow-lg shadow-fuchsia-950/10 backdrop-blur-xl sm:px-4 sm:py-2">

              <Sparkles
                size={12}
                className="text-fuchsia-400"
              />

              <span className="text-[8px] font-black uppercase tracking-[0.25em] text-fuchsia-400 sm:text-[9px]">
                Foundation Path
              </span>

              <span className="h-1 w-1 rounded-full bg-fuchsia-500" />

              <span className="text-[7px] font-bold uppercase tracking-wider text-fuchsia-700">
                Stage 01
              </span>

            </div>
          </div>

          {/* TITLE */}

          <h2 className="text-3xl font-black tracking-[-0.04em] sm:text-5xl">

            EASY

            <span className="bg-gradient-to-r from-fuchsia-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
              {" "}LEVELS
            </span>

          </h2>

          <div className="mx-auto mt-3 flex max-w-md items-center justify-center gap-3">

            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-fuchsia-900/40" />

            <CircleDot
              size={10}
              className="text-fuchsia-700"
            />

            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-zinc-700 sm:text-[10px]">
              50 SQL Missions
            </p>

            <CircleDot
              size={10}
              className="text-fuchsia-700"
            />

            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-fuchsia-900/40" />

          </div>

          <p className="mx-auto mt-3 max-w-xl text-[11px] leading-5 text-zinc-600 sm:mt-4 sm:text-sm sm:leading-6">
            Master SQL from the foundations
            to real-world challenges.
          </p>

        </section>

        {/* ===================================================
            PROGRESS HUD
        ==================================================== */}

        <section className="mx-auto mt-5 max-w-md sm:mt-7 sm:max-w-3xl">

          <div className="relative overflow-hidden rounded-[22px] border border-fuchsia-900/30 bg-gradient-to-br from-[#100614] via-[#0b0610] to-[#09030c] p-3.5 shadow-2xl shadow-fuchsia-950/10 backdrop-blur-xl sm:rounded-2xl sm:p-4">

            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-fuchsia-600/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-16 -left-16 h-32 w-32 rounded-full bg-purple-600/10 blur-3xl" />

            <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/30 to-transparent" />

            <div className="relative flex items-center justify-between">

              <div className="flex items-center gap-3">

                <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-fuchsia-800/40 bg-fuchsia-950/30">

                  <Target
                    size={16}
                    className="text-fuchsia-400"
                  />

                  <div className="absolute -inset-1 rounded-xl bg-fuchsia-500/5 blur-md" />

                </div>

                <div>

                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-600">
                    Journey Progress
                  </p>

                  <p className="mt-0.5 text-xs font-black text-zinc-200 sm:text-sm">

                    {completedCount}

                    <span className="text-zinc-600">
                      {" "} / 50 completed
                    </span>

                  </p>

                </div>
              </div>

              <div className="text-right">

                <p className="bg-gradient-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-lg font-black text-transparent sm:text-xl">
                  {Math.round(progressPercentage)}%
                </p>

                <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-700">
                  Progress
                </p>

              </div>
            </div>

            <div className="relative mt-3">

              <div className="h-2 overflow-hidden rounded-full border border-fuchsia-950/30 bg-black/80">

                <div
                  className="relative h-full rounded-full bg-gradient-to-r from-fuchsia-800 via-fuchsia-500 to-pink-400 shadow-[0_0_15px_rgba(217,70,239,0.4)] transition-all duration-700"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                >
                  <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-r from-transparent to-white/20 blur-sm" />
                </div>

              </div>

              <div className="mt-1.5 flex justify-between px-0.5">

                <span className="text-[6px] font-black uppercase tracking-widest text-zinc-800">
                  Start
                </span>

                <span className="text-[6px] font-black uppercase tracking-widest text-zinc-800">
                  25
                </span>

                <span className="text-[6px] font-black uppercase tracking-widest text-zinc-800">
                  50
                </span>

              </div>
            </div>

          </div>
        </section>

        {/* ===================================================
            DESKTOP MAP
        ==================================================== */}

        <section className="relative mx-auto mt-8 hidden max-w-[1200px] md:block">

          <div className="relative min-h-[1800px] overflow-hidden rounded-[2rem] border border-fuchsia-950/40 bg-[#100415] shadow-2xl shadow-fuchsia-950/10">

            {/* GRID */}

            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize: "60px 60px",
              }}
            />

            {/* STARS */}

            <div className="pointer-events-none absolute inset-0">

              {Array.from({ length: 90 }).map(
                (_, index) => {
                  const left =
                    (index * 37) % 100;

                  const top =
                    (index * 61) % 100;

                  return (
                    <div
                      key={index}
                      className="absolute h-1 w-1 rounded-full bg-fuchsia-300/30"
                      style={{
                        left: `${left}%`,
                        top: `${top}%`,
                        opacity:
                          0.15 +
                          ((index * 13) % 60) /
                            100,
                      }}
                    />
                  );
                }
              )}

            </div>

            {/* ATMOSPHERE */}

            <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-fuchsia-600/[0.025] blur-[120px]" />

            {/* SVG PATH */}

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              <defs>

                <marker
                  id="easy-arrow"
                  markerWidth="5"
                  markerHeight="5"
                  refX="4"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 5 2.5, 0 5"
                    fill="#d946ef"
                  />
                </marker>

                <filter id="easy-glow">

                  <feGaussianBlur
                    stdDeviation="0.8"
                    result="blur"
                  />

                  <feMerge>
                    <feMergeNode in="blur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>

                </filter>

              </defs>

              {LEVEL_POSITIONS
                .slice(0, TOTAL_LEVELS - 1)
                .map((position, index) => {

                  const next =
                    LEVEL_POSITIONS[index + 1];

                  const currentLevel =
                    index + 1;

                  const pathCompleted =
                    completedLevels.has(
                      currentLevel
                    );

                  return (
                    <line
                      key={currentLevel}
                      x1={`${position.x}%`}
                      y1={`${position.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke={
                        pathCompleted
                          ? "#d946ef"
                          : "#6b1b70"
                      }
                      strokeWidth={
                        pathCompleted
                          ? "0.38"
                          : "0.25"
                      }
                      strokeDasharray="1.2 1"
                      strokeLinecap="round"
                      markerEnd={
                        pathCompleted
                          ? "url(#easy-arrow)"
                          : undefined
                      }
                      filter={
                        pathCompleted
                          ? "url(#easy-glow)"
                          : undefined
                      }
                      opacity={
                        pathCompleted
                          ? 0.95
                          : 0.35
                      }
                    />
                  );
                })}

            </svg>

            {/* MAP TITLE */}

            <div className="absolute left-1/2 top-7 -translate-x-1/2">

              <div className="relative flex items-center gap-2 rounded-full border border-fuchsia-800/40 bg-black/60 px-5 py-2 shadow-xl shadow-fuchsia-950/20 backdrop-blur-xl">

                <span className="absolute -inset-1 rounded-full bg-fuchsia-500/5 blur-md" />

                <span className="relative h-2 w-2 animate-pulse rounded-full bg-fuchsia-500 shadow-lg shadow-fuchsia-500" />

                <span className="relative text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-400">
                  SQL Journey
                </span>

              </div>

            </div>

            {/* UNLOCKED */}

            <div className="absolute right-5 top-5 rounded-xl border border-fuchsia-900/40 bg-black/40 px-3 py-2 backdrop-blur">

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)]" />

                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  50 Levels Unlocked
                </span>

              </div>

            </div>

            {/* DESKTOP NODES */}

            {Array.from({
              length: TOTAL_LEVELS,
            }).map((_, index) => {

              const level = index + 1;

              const position =
                LEVEL_POSITIONS[index];

              const completed =
                completedLevels.has(level);

              const current =
                level === nextLevel &&
                !completed;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    handleLevelClick(level)
                  }
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >

                  {current && (
                    <>
                      <span className="absolute -inset-7 animate-ping rounded-full bg-fuchsia-500/[0.07]" />

                      <span className="absolute -inset-5 animate-pulse rounded-full border border-fuchsia-400/30" />

                      <span className="absolute -inset-3 rounded-full border border-fuchsia-500/20" />
                    </>
                  )}

                  <div
                    className={`
                      relative flex h-[78px] w-[78px]
                      items-center justify-center
                      rounded-full border-[3px]
                      transition-all duration-300
                      hover:scale-110

                      ${
                        completed
                          ? "border-emerald-400 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 shadow-xl shadow-emerald-500/40"
                          : current
                          ? "scale-110 border-fuchsia-300 bg-gradient-to-br from-fuchsia-500 via-purple-800 to-fuchsia-950 shadow-2xl shadow-fuchsia-600/50"
                          : "border-fuchsia-600 bg-gradient-to-br from-fuchsia-800 via-purple-900 to-[#1a061d] shadow-lg shadow-fuchsia-900/30 hover:border-fuchsia-300"
                      }
                    `}
                  >

                    <div className="absolute inset-1 rounded-full border border-white/10" />

                    <div className="absolute inset-2 rounded-full border border-fuchsia-300/20" />

                    <div className="absolute inset-[7px] rounded-full bg-black/10" />

                    {completed ? (
                      <Check
                        size={28}
                        strokeWidth={3}
                        className="relative z-10 text-white"
                      />
                    ) : current ? (
                      <Play
                        size={26}
                        fill="currentColor"
                        className="relative z-10 ml-1 text-white"
                      />
                    ) : (
                      <span className="relative z-10 text-xl font-black">
                        {level}
                      </span>
                    )}

                  </div>

                  {/* LABEL */}

                  <div
                    className={`
                      absolute left-1/2 top-full mt-2
                      -translate-x-1/2 whitespace-nowrap
                      rounded-lg border px-3 py-1.5
                      backdrop-blur-xl

                      ${
                        completed
                          ? "border-emerald-700/50 bg-emerald-950/70"
                          : current
                          ? "border-fuchsia-500/60 bg-fuchsia-950/80 shadow-lg shadow-fuchsia-950/30"
                          : "border-zinc-800 bg-black/75"
                      }
                    `}
                  >

                    <p
                      className={`
                        text-[8px] font-black uppercase tracking-wider

                        ${
                          completed
                            ? "text-emerald-300"
                            : current
                            ? "text-fuchsia-200"
                            : "text-zinc-400"
                        }
                      `}
                    >
                      Level {level}
                    </p>

                    <p className="mt-0.5 max-w-[120px] truncate text-[7px] font-bold text-zinc-600">
                      {LEVEL_TITLES[index]}
                    </p>

                  </div>

                </button>
              );
            })}

            {/* COMPLETION */}

            {completedCount >= TOTAL_LEVELS && (
              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">

                <div className="relative flex items-center gap-3 overflow-hidden rounded-2xl border border-emerald-700/50 bg-emerald-950/60 px-6 py-4 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl">

                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent" />

                  <Trophy
                    size={20}
                    className="relative text-emerald-400"
                  />

                  <div className="relative">

                    <p className="text-xs font-black text-emerald-300">
                      EASY STAGE COMPLETE
                    </p>

                    <p className="text-[9px] text-emerald-700">
                      All 50 levels mastered
                    </p>

                  </div>

                </div>
              </div>
            )}

          </div>
        </section>

        {/* ===================================================
            MOBILE JOURNEY
        ==================================================== */}

        <section className="relative mx-auto mt-7 max-w-md md:hidden">

          {/* SECTION HEADER */}

          <div className="mb-5 flex items-end justify-between px-1">

            <div>

              <div className="flex items-center gap-2">

                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-fuchsia-500 shadow-[0_0_8px_rgba(217,70,239,0.8)]" />

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-fuchsia-500">
                  Your Path
                </p>

              </div>

              <h3 className="mt-1 text-lg font-black tracking-tight">
                SQL Journey
              </h3>

            </div>

            <div className="flex items-center gap-1.5 rounded-full border border-fuchsia-900/40 bg-fuchsia-950/20 px-3 py-1.5 shadow-lg shadow-fuchsia-950/10">

              <Star
                size={9}
                className="fill-fuchsia-400 text-fuchsia-400"
              />

              <span className="text-[7px] font-black uppercase tracking-widest text-fuchsia-400">
                50 Missions
              </span>

            </div>

          </div>

          {/* JOURNEY CONTAINER */}

          <div className="relative overflow-hidden rounded-[30px] border border-fuchsia-950/50 bg-gradient-to-b from-[#0d0412] via-[#09030d] to-[#060208] px-3 py-7 shadow-[0_20px_80px_rgba(0,0,0,0.5)]">

            {/* TOP BORDER GLOW */}

            <div className="pointer-events-none absolute left-8 right-8 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />

            {/* BACKGROUND GRID */}

            <div
              className="pointer-events-none absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.3) 1px, transparent 1px)",
                backgroundSize: "38px 38px",
              }}
            />

            {/* ATMOSPHERIC GLOW */}

            <div className="pointer-events-none absolute left-1/2 top-0 h-80 w-80 -translate-x-1/2 rounded-full bg-fuchsia-700/[0.04] blur-[100px]" />

            <div className="pointer-events-none absolute bottom-0 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-purple-700/[0.04] blur-[100px]" />

            {/* CENTRAL ENERGY CORE */}

            <div className="pointer-events-none absolute bottom-8 left-1/2 top-8 -translate-x-1/2">

              <div className="absolute left-1/2 top-0 h-full w-8 -translate-x-1/2 bg-fuchsia-600/[0.025] blur-xl" />

              <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-fuchsia-700/70 to-transparent" />

              <div className="absolute left-1/2 top-0 h-full w-[2px] -translate-x-1/2 bg-gradient-to-b from-transparent via-fuchsia-600/30 to-transparent blur-[2px]" />

              <div className="absolute left-1/2 top-0 -translate-x-1/2">

                <div className="relative flex h-5 w-5 items-center justify-center">

                  <span className="absolute inset-0 animate-ping rounded-full bg-fuchsia-500/10" />

                  <span className="absolute inset-1 rounded-full border border-fuchsia-500/40 bg-[#09030d]" />

                  <span className="h-1.5 w-1.5 rounded-full bg-fuchsia-400 shadow-[0_0_8px_rgba(217,70,239,0.9)]" />

                </div>
              </div>
            </div>

            {/* LEVELS */}

            <div className="relative space-y-5">

              {Array.from({
                length: TOTAL_LEVELS,
              }).map((_, index) => {

                const level = index + 1;

                const completed =
                  completedLevels.has(level);

                const current =
                  level === nextLevel &&
                  !completed;

                const leftSide =
                  level % 2 === 1;

                return (
                  <div
                    key={level}
                    className={`
                      relative flex min-h-[96px] items-center
                      ${
                        leftSide
                          ? "justify-start pr-[50%]"
                          : "justify-end pl-[50%]"
                      }
                    `}
                  >

                    {/* CHECKPOINT */}

                    <div
                      className={`
                        absolute left-1/2 top-1/2 z-30
                        flex h-4 w-4
                        -translate-x-1/2
                        -translate-y-1/2
                        items-center justify-center
                        rounded-full
                        border-2 border-[#09030d]

                        ${
                          completed
                            ? "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]"
                            : current
                            ? "bg-fuchsia-300 shadow-[0_0_14px_rgba(217,70,239,0.9)]"
                            : "bg-fuchsia-800 shadow-[0_0_6px_rgba(168,85,247,0.25)]"
                        }
                      `}
                    >

                      {current && (
                        <span className="h-1 w-1 animate-pulse rounded-full bg-white" />
                      )}

                    </div>

                    {/* CONNECTION BEAM */}

                    <div
                      className={`
                        pointer-events-none absolute top-1/2 z-10 h-px
                        -translate-y-1/2

                        ${
                          leftSide
                            ? "right-[calc(50%-1px)] left-[32%]"
                            : "left-[calc(50%-1px)] right-[32%]"
                        }

                        ${
                          completed
                            ? "bg-emerald-500/40"
                            : current
                            ? "bg-fuchsia-400/40"
                            : "bg-fuchsia-900/40"
                        }
                      `}
                    />

                    {/* LEVEL CARD */}

                    <button
                      type="button"
                      onClick={() =>
                        handleLevelClick(level)
                      }
                      className="group relative z-20 w-full max-w-[155px] text-left focus:outline-none"
                    >

                      {/* CURRENT AURA */}

                      {current && (
                        <>
                          <span className="absolute -inset-2 animate-pulse rounded-[20px] bg-fuchsia-500/[0.07] blur-lg" />

                          <span className="absolute -inset-1 rounded-[20px] border border-fuchsia-500/30" />
                        </>
                      )}

                      {/* CARD */}

                      <div
                        className={`
                          relative overflow-hidden
                          rounded-[19px]
                          border
                          p-2.5
                          shadow-xl
                          transition-all duration-300
                          active:scale-[0.96]

                          ${
                            completed
                              ? "border-emerald-800/50 bg-gradient-to-br from-emerald-950/60 to-[#07100b] shadow-emerald-950/20"
                              : current
                              ? "border-fuchsia-500/60 bg-gradient-to-br from-fuchsia-950/70 via-[#130719] to-[#0b0310] shadow-fuchsia-950/40"
                              : "border-zinc-900/90 bg-gradient-to-br from-[#120817] to-[#09030d]"
                          }

                          group-hover:-translate-y-0.5
                        `}
                      >

                        <div className="pointer-events-none absolute left-4 right-4 top-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />

                        <div
                          className={`
                            pointer-events-none absolute -right-7 -top-7
                            h-16 w-16 rounded-full blur-2xl

                            ${
                              completed
                                ? "bg-emerald-500/10"
                                : current
                                ? "bg-fuchsia-500/15"
                                : "bg-purple-500/5"
                            }
                          `}
                        />

                        <div className="relative flex items-center gap-2.5">

                          {/* NODE */}

                          <div
                            className={`
                              relative flex h-11 w-11 shrink-0
                              items-center justify-center
                              rounded-full border-2
                              shadow-lg
                              transition-transform duration-300
                              group-hover:scale-105

                              ${
                                completed
                                  ? "border-emerald-400 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 shadow-emerald-500/30"
                                  : current
                                  ? "border-fuchsia-300 bg-gradient-to-br from-fuchsia-500 via-purple-700 to-purple-950 shadow-fuchsia-500/40"
                                  : "border-fuchsia-700 bg-gradient-to-br from-fuchsia-800/90 to-purple-950 shadow-fuchsia-950/20"
                              }
                            `}
                          >

                            <div className="absolute inset-1 rounded-full border border-white/10" />

                            <div className="absolute inset-2 rounded-full border border-white/5" />

                            {completed ? (
                              <Check
                                size={17}
                                strokeWidth={3}
                                className="relative z-10"
                              />
                            ) : current ? (
                              <Play
                                size={15}
                                fill="currentColor"
                                className="relative z-10 ml-0.5"
                              />
                            ) : (
                              <span className="relative z-10 text-xs font-black">
                                {level}
                              </span>
                            )}

                          </div>

                          {/* INFO */}

                          <div className="min-w-0 flex-1">

                            <div className="flex items-center justify-between gap-1">

                              <p
                                className={`
                                  text-[7px]
                                  font-black
                                  uppercase
                                  tracking-widest

                                  ${
                                    completed
                                      ? "text-emerald-400"
                                      : current
                                      ? "text-fuchsia-300"
                                      : "text-zinc-600"
                                  }
                                `}
                              >
                                {completed
                                  ? "Cleared"
                                  : current
                                  ? "Active"
                                  : `Level ${level}`}
                              </p>

                              <ChevronRight
                                size={11}
                                className={`
                                  shrink-0
                                  transition-all
                                  duration-300
                                  group-hover:translate-x-0.5

                                  ${
                                    completed
                                      ? "text-emerald-700"
                                      : current
                                      ? "text-fuchsia-400"
                                      : "text-zinc-800"
                                  }
                                `}
                              />

                            </div>

                            <p className="mt-1 truncate text-[10px] font-black text-zinc-200">
                              {LEVEL_TITLES[index]}
                            </p>

                            <p className="mt-0.5 truncate text-[7px] font-bold text-zinc-700">
                              {LEVEL_DESCRIPTIONS[index]}
                            </p>

                          </div>
                        </div>

                        {/* CURRENT BAR */}

                        {current && (
                          <div className="relative mt-2.5 overflow-hidden rounded-full bg-fuchsia-950/40">

                            <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-fuchsia-400 to-transparent" />

                          </div>
                        )}

                      </div>
                    </button>
                  </div>
                );
              })}

            </div>

            {/* FINAL REACTOR */}

            <div className="relative z-30 mt-7">

              {completedCount >= TOTAL_LEVELS ? (

                <div className="relative overflow-hidden rounded-[22px] border border-emerald-700/50 bg-gradient-to-br from-emerald-950/70 to-[#061009] p-5 text-center shadow-2xl shadow-emerald-950/30">

                  <div className="absolute left-1/2 top-0 h-20 w-20 -translate-x-1/2 rounded-full bg-emerald-400/10 blur-2xl" />

                  <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-500/40 bg-emerald-500/10">

                    <Crown
                      size={23}
                      className="text-emerald-400"
                    />

                  </div>

                  <p className="relative mt-3 text-xs font-black tracking-wide text-emerald-300">
                    EASY STAGE COMPLETE
                  </p>

                  <p className="relative mt-1 text-[8px] font-bold uppercase tracking-widest text-emerald-700">
                    All 50 missions mastered
                  </p>

                </div>

              ) : (

                <div className="relative overflow-hidden rounded-[22px] border border-fuchsia-900/40 bg-gradient-to-br from-fuchsia-950/30 to-[#09030d] p-4">

                  <div className="absolute -right-10 -top-10 h-24 w-24 rounded-full bg-fuchsia-500/10 blur-2xl" />

                  <div className="relative flex items-center gap-3">

                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-fuchsia-800/40 bg-fuchsia-950/30">

                      <ShieldCheck
                        size={17}
                        className="text-fuchsia-400"
                      />

                    </div>

                    <div className="min-w-0">

                      <p className="text-[8px] font-black uppercase tracking-[0.2em] text-fuchsia-500">
                        Mission Progress
                      </p>

                      <p className="mt-1 truncate text-[10px] font-black text-zinc-300">
                        Level {nextLevel} is waiting
                      </p>

                    </div>

                    <div className="ml-auto flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-fuchsia-800/30 bg-black/30">

                      <ArrowRight
                        size={12}
                        className="text-fuchsia-500"
                      />

                    </div>

                  </div>
                </div>
              )}

            </div>
          </div>
        </section>

        {/* ===================================================
            LEGEND
        ==================================================== */}

        <section className="mx-auto mt-6 max-w-md sm:mt-7 sm:max-w-3xl">

          <div className="grid grid-cols-3 gap-2">

            {/* COMPLETED */}

            <div className="group rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0710] to-[#08030b] p-2.5 text-center shadow-lg transition hover:border-emerald-900/50 sm:p-3">

              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-400 bg-gradient-to-br from-emerald-500 to-emerald-900 shadow-lg shadow-emerald-900/30">

                <Check
                  size={14}
                  strokeWidth={3}
                />

              </div>

              <p className="mt-2 text-[7px] font-black uppercase tracking-widest text-zinc-600">
                Completed
              </p>

            </div>

            {/* CURRENT */}

            <div className="group rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0710] to-[#08030b] p-2.5 text-center shadow-lg transition hover:border-fuchsia-900/50 sm:p-3">

              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 bg-gradient-to-br from-fuchsia-600 to-purple-900 shadow-lg shadow-fuchsia-900/30">

                <Play
                  size={12}
                  fill="currentColor"
                />

              </div>

              <p className="mt-2 text-[7px] font-black uppercase tracking-widest text-zinc-600">
                Next
              </p>

            </div>

            {/* AVAILABLE */}

            <div className="group rounded-2xl border border-zinc-900 bg-gradient-to-br from-[#0c0710] to-[#08030b] p-2.5 text-center shadow-lg transition hover:border-purple-900/50 sm:p-3">

              <div className="relative mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-600 bg-gradient-to-br from-fuchsia-800 to-purple-950">

                <span className="text-[9px] font-black">
                  50
                </span>

              </div>

              <p className="mt-2 text-[7px] font-black uppercase tracking-widest text-zinc-600">
                Available
              </p>

            </div>

          </div>
        </section>

        {/* ===================================================
            CONTINUE
        ==================================================== */}

        {completedCount < TOTAL_LEVELS && (

          <section className="mx-auto mt-5 max-w-md sm:mt-6">

            <button
              type="button"
              onClick={() =>
                navigate(`/challenge/${nextLevel}`)
              }
              className="
                group relative flex w-full
                items-center justify-center gap-3
                overflow-hidden rounded-[20px]
                border border-fuchsia-500/50
                bg-gradient-to-r
                from-fuchsia-800
                via-purple-800
                to-fuchsia-800
                px-5 py-4
                text-xs font-black
                shadow-2xl shadow-fuchsia-950/40
                transition-all duration-300
                active:scale-[0.97]
                hover:-translate-y-0.5
                hover:border-fuchsia-300
                hover:shadow-fuchsia-900/50
              "
            >

              {/* ANIMATED SHINE */}

              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 group-hover:translate-x-full" />

              {/* GLOW */}

              <div className="absolute -inset-10 bg-fuchsia-500/5 blur-2xl" />

              <Play
                size={15}
                fill="currentColor"
                className="relative"
              />

              <span className="relative">
                CONTINUE LEVEL {nextLevel}
              </span>

              <ArrowRight
                size={15}
                className="relative transition-transform duration-300 group-hover:translate-x-1"
              />

            </button>

          </section>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="mx-auto mt-8 max-w-6xl border-t border-fuchsia-950/30 pt-5 sm:mt-10 sm:pt-6">

          <div className="flex flex-col items-center justify-between gap-2 text-center text-[7px] font-bold uppercase tracking-widest text-zinc-800 sm:flex-row">

            <span>
              SQLForge Challenge Arena
            </span>

            <span>
              Easy • 50 Challenges • All Unlocked
            </span>

          </div>

        </footer>

      </main>
    </div>
  );
}

export default EasyLevels;