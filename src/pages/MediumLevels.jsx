import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Database,
  Flame,
  Play,
  ShieldCheck,
  Sparkles,
  Star,
  Target,
  Trophy,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

// ============================================================
// CONFIG
// ============================================================

const TOTAL_LEVELS = 50;

const PROGRESS_STORAGE_KEY =
  "sqlforge_challenge_progress";

// ============================================================
// DEFAULT PROGRESS
// ============================================================

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
// LEVEL POSITIONS
//
// 50 levels
// 5 columns × 10 rows
// Serpentine path
// ============================================================

const LEVEL_POSITIONS = [
  // ROW 1 — 1 → 5
  { x: 10, y: 7 },
  { x: 30, y: 7 },
  { x: 50, y: 7 },
  { x: 70, y: 7 },
  { x: 90, y: 7 },

  // ROW 2 — 6 → 10
  { x: 90, y: 17 },
  { x: 70, y: 17 },
  { x: 50, y: 17 },
  { x: 30, y: 17 },
  { x: 10, y: 17 },

  // ROW 3 — 11 → 15
  { x: 10, y: 27 },
  { x: 30, y: 27 },
  { x: 50, y: 27 },
  { x: 70, y: 27 },
  { x: 90, y: 27 },

  // ROW 4 — 16 → 20
  { x: 90, y: 37 },
  { x: 70, y: 37 },
  { x: 50, y: 37 },
  { x: 30, y: 37 },
  { x: 10, y: 37 },

  // ROW 5 — 21 → 25
  { x: 10, y: 47 },
  { x: 30, y: 47 },
  { x: 50, y: 47 },
  { x: 70, y: 47 },
  { x: 90, y: 47 },

  // ROW 6 — 26 → 30
  { x: 90, y: 57 },
  { x: 70, y: 57 },
  { x: 50, y: 57 },
  { x: 30, y: 57 },
  { x: 10, y: 57 },

  // ROW 7 — 31 → 35
  { x: 10, y: 67 },
  { x: 30, y: 67 },
  { x: 50, y: 67 },
  { x: 70, y: 67 },
  { x: 90, y: 67 },

  // ROW 8 — 36 → 40
  { x: 90, y: 77 },
  { x: 70, y: 77 },
  { x: 50, y: 77 },
  { x: 30, y: 77 },
  { x: 10, y: 77 },

  // ROW 9 — 41 → 45
  { x: 10, y: 87 },
  { x: 30, y: 87 },
  { x: 50, y: 87 },
  { x: 70, y: 87 },
  { x: 90, y: 87 },

  // ROW 10 — 46 → 50
  { x: 90, y: 96 },
  { x: 70, y: 96 },
  { x: 50, y: 96 },
  { x: 30, y: 96 },
  { x: 10, y: 96 },
];

// ============================================================
// LEVEL TITLES
// ============================================================

const LEVEL_TITLES = [
  "Advanced SELECT",
  "Complex WHERE",
  "Multiple Filters",
  "Advanced Sorting",
  "Pagination Queries",
  "DISTINCT Analysis",
  "Operator Logic",
  "Complex Conditions",
  "Advanced LIKE",
  "NULL Handling",

  "Aggregate Analysis",
  "COUNT Analysis",
  "SUM Analysis",
  "AVG Analysis",
  "MIN & MAX Analysis",
  "GROUP BY Analysis",
  "HAVING Queries",
  "Conditional Aggregation",
  "Column Aliases",
  "Calculated Columns",

  "INNER JOIN Practice",
  "LEFT JOIN Practice",
  "RIGHT JOIN Practice",
  "JOIN Filtering",
  "Multiple Table JOIN",

  "Date Functions",
  "String Manipulation",
  "Numeric Calculations",
  "CASE Logic",
  "Subquery Basics",

  "Nested Subqueries",
  "EXISTS Queries",
  "IN Subqueries",
  "BETWEEN Analysis",
  "COALESCE Practice",

  "Conditional Queries",
  "Advanced WHERE",
  "Data Analysis",
  "Business Analysis",
  "Real World Problems",

  "JOIN + GROUP BY",
  "JOIN + HAVING",
  "Subquery + JOIN",
  "Multi-Level Queries",
  "Complex Aggregation",
  "Analytical Problems",
  "Data Investigation",
  "Interview Challenge",
  "Placement Challenge",
  "SQLForge Strategist",
];

// ============================================================
// LEVEL DESCRIPTIONS
// ============================================================

const LEVEL_DESCRIPTIONS = [
  "Master SELECT queries with multiple columns and expressions.",
  "Build WHERE clauses with multiple filtering conditions.",
  "Combine several filters to isolate precise records.",
  "Sort complex result sets using multiple ordering rules.",
  "Control result sets using LIMIT and OFFSET techniques.",
  "Remove duplicates and analyze unique data patterns.",
  "Use comparison operators to build precise conditions.",
  "Combine AND, OR and NOT for complex SQL logic.",
  "Use advanced LIKE patterns to search structured text.",
  "Handle NULL values correctly in real SQL queries.",

  "Use aggregate functions to summarize datasets.",
  "Count records accurately using different COUNT strategies.",
  "Calculate totals and analyze numeric columns with SUM.",
  "Calculate averages and interpret grouped data.",
  "Find minimum and maximum values across datasets.",
  "Group records and generate meaningful summaries.",
  "Filter grouped results using HAVING.",
  "Combine conditions with aggregate calculations.",
  "Use aliases to create clean and readable queries.",
  "Build calculated columns using SQL expressions.",

  "Master INNER JOIN relationships between tables.",
  "Use LEFT JOIN to preserve unmatched records.",
  "Understand RIGHT JOIN and outer table behavior.",
  "Apply filtering conditions across joined tables.",
  "Combine three or more tables in a single query.",

  "Work with dates using SQL date functions.",
  "Manipulate and analyze strings using SQL functions.",
  "Perform calculations using numeric SQL functions.",
  "Build business logic with CASE expressions.",
  "Use subqueries to solve multi-step SQL problems.",

  "Build queries containing subqueries inside subqueries.",
  "Use EXISTS to test relationships between datasets.",
  "Use IN with subqueries for advanced filtering.",
  "Analyze ranges using BETWEEN effectively.",
  "Handle missing values using COALESCE.",

  "Combine conditional logic to solve practical problems.",
  "Build advanced filtering expressions.",
  "Analyze datasets and extract useful insights.",
  "Solve SQL problems based on business requirements.",
  "Translate real-world requirements into SQL.",

  "Combine JOIN and GROUP BY in analytical queries.",
  "Filter aggregated joined datasets using HAVING.",
  "Combine JOINs with subqueries.",
  "Solve queries requiring multiple SQL layers.",
  "Build complex aggregation queries.",

  "Solve analytical SQL problems from large datasets.",
  "Investigate data and identify hidden patterns.",
  "Solve interview-style SQL challenges.",
  "Prepare for placement-level SQL questions.",
  "Become an SQLForge Strategist.",
];

// ============================================================
// CHAPTERS
// ============================================================

const CHAPTERS = [
  {
    number: "01",
    start: 1,
    end: 10,
    title: "Advanced SELECT",
    subtitle: "Query Control",
    icon: Database,
  },

  {
    number: "02",
    start: 11,
    end: 20,
    title: "Aggregation",
    subtitle: "Data Intelligence",
    icon: Target,
  },

  {
    number: "03",
    start: 21,
    end: 25,
    title: "JOIN Mastery",
    subtitle: "Relational Thinking",
    icon: ShieldCheck,
  },

  {
    number: "04",
    start: 26,
    end: 29,
    title: "SQL Functions",
    subtitle: "Transformation",
    icon: Sparkles,
  },

  {
    number: "05",
    start: 30,
    end: 35,
    title: "Subqueries",
    subtitle: "Multi-Level Logic",
    icon: Zap,
  },

  {
    number: "06",
    start: 36,
    end: 40,
    title: "Data Analysis",
    subtitle: "Business SQL",
    icon: Target,
  },

  {
    number: "07",
    start: 41,
    end: 50,
    title: "Interview Trial",
    subtitle: "Final Skill Test",
    icon: Crown,
  },
];

// ============================================================
// GET STORED PROGRESS
// ============================================================

function getStoredProgress() {
  try {
    const stored = localStorage.getItem(
      PROGRESS_STORAGE_KEY
    );

    if (!stored) {
      return {
        ...DEFAULT_PROGRESS,

        easy: {
          ...DEFAULT_PROGRESS.easy,
          completed: [],
        },

        medium: {
          ...DEFAULT_PROGRESS.medium,
          completed: [],
        },

        advanced: {
          ...DEFAULT_PROGRESS.advanced,
          completed: [],
        },
      };
    }

    const parsed = JSON.parse(stored);

    return {
      ...DEFAULT_PROGRESS,

      ...parsed,

      easy: {
        ...DEFAULT_PROGRESS.easy,
        ...(parsed.easy || {}),
        completed: Array.isArray(
          parsed.easy?.completed
        )
          ? parsed.easy.completed.map(Number)
          : [],
      },

      medium: {
        ...DEFAULT_PROGRESS.medium,
        ...(parsed.medium || {}),
        completed: Array.isArray(
          parsed.medium?.completed
        )
          ? parsed.medium.completed.map(Number)
          : [],
      },

      advanced: {
        ...DEFAULT_PROGRESS.advanced,
        ...(parsed.advanced || {}),
        completed: Array.isArray(
          parsed.advanced?.completed
        )
          ? parsed.advanced.completed.map(Number)
          : [],
      },

      xp: Number(parsed.xp) || 0,

      streak: Number(parsed.streak) || 0,
    };
  } catch (error) {
    console.error(
      "Unable to load SQLForge progress:",
      error
    );

    return {
      ...DEFAULT_PROGRESS,

      easy: {
        completed: [],
      },

      medium: {
        completed: [],
      },

      advanced: {
        completed: [],
      },
    };
  }
}

// ============================================================
// COMPONENT
// ============================================================

function MediumLevels() {
  const navigate = useNavigate();

  const [progress, setProgress] = useState(
    getStoredProgress
  );

  const [transitioningLevel, setTransitioningLevel] =
    useState(null);

  // ==========================================================
  // LOAD PROGRESS FROM BACKEND
  // ==========================================================

  useEffect(() => {
    let cancelled = false;

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

        const apiUrl =
          import.meta.env.VITE_API_URL;

        if (!apiUrl) {
          throw new Error(
            "VITE_API_URL is not configured."
          );
        }

        const response = await fetch(
          `${apiUrl}/api/progress`,
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

        if (cancelled) {
          return;
        }

        const backendProgress =
          data.progress || {};

        setProgress({
          easy: {
            completed: Array.isArray(
              backendProgress.easy?.completed
            )
              ? backendProgress.easy.completed
                  .map(Number)
                  .filter(
                    (level) =>
                      level >= 1 &&
                      level <= TOTAL_LEVELS
                  )
              : [],
          },

          medium: {
            completed: Array.isArray(
              backendProgress.medium?.completed
            )
              ? backendProgress.medium.completed
                  .map(Number)
                  .filter(
                    (level) =>
                      level >= 1 &&
                      level <= TOTAL_LEVELS
                  )
              : [],
          },

          advanced: {
            completed: Array.isArray(
              backendProgress.advanced?.completed
            )
              ? backendProgress.advanced.completed
                  .map(Number)
                  .filter(
                    (level) =>
                      level >= 1 &&
                      level <= TOTAL_LEVELS
                  )
              : [],
          },

          xp:
            Number(
              backendProgress.xp
            ) || 0,

          streak:
            Number(
              backendProgress.streak
            ) || 0,
        });
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load SQLForge progress:",
            error
          );
        }
      }
    };

    loadProgress();

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  // ==========================================================
  // LOCAL PROGRESS REFRESH
  // ==========================================================

  useEffect(() => {
    const refreshProgress = () => {
      setProgress(
        getStoredProgress()
      );
    };

    window.addEventListener(
      "storage",
      refreshProgress
    );

    window.addEventListener(
      "sqlforge-progress-updated",
      refreshProgress
    );

    return () => {
      window.removeEventListener(
        "storage",
        refreshProgress
      );

      window.removeEventListener(
        "sqlforge-progress-updated",
        refreshProgress
      );
    };
  }, []);

  // ==========================================================
  // COMPLETED LEVELS
  // ==========================================================

  const completedLevels = useMemo(() => {
    const completed =
      progress.medium?.completed || [];

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
  }, [progress]);

  // ==========================================================
  // COMPLETED COUNT
  // ==========================================================

  const completedCount =
    completedLevels.size;

  // ==========================================================
  // NEXT LEVEL
  // ==========================================================

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

  // ==========================================================
  // CURRENT LEVEL
  // ==========================================================

  const currentLevel = Math.min(
    nextLevel,
    TOTAL_LEVELS
  );

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progressPercentage =
    (completedCount / TOTAL_LEVELS) *
    100;

  // ==========================================================
  // CURRENT CHAPTER
  // ==========================================================

  const currentChapter = useMemo(() => {
    return (
      CHAPTERS.find(
        (chapter) =>
          currentLevel >= chapter.start &&
          currentLevel <= chapter.end
      ) || CHAPTERS[0]
    );
  }, [currentLevel]);

  // ==========================================================
  // LEVEL CLICK
  //
  // ALL MEDIUM LEVELS ARE UNLOCKED.
  // ==========================================================

  const handleLevelClick = (level) => {
    if (
      level < 1 ||
      level > TOTAL_LEVELS
    ) {
      return;
    }

    if (transitioningLevel !== null) {
      return;
    }

    setTransitioningLevel(level);

    window.setTimeout(() => {
      navigate(
        `/challenge/medium/${level}`
      );
    }, 260);
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    navigate("/challenge-levels");
  };

  // ==========================================================
  // CONTINUE
  // ==========================================================

  const handleContinue = () => {
    handleLevelClick(currentLevel);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#061014] text-white">

      {/* ======================================================
          TRANSITION OVERLAY
      ======================================================= */}

      {transitioningLevel !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020709]/95 backdrop-blur-xl">
          <div className="text-center">
            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

              <div className="absolute inset-0 animate-ping rounded-full bg-cyan-500/10" />

              <div className="absolute inset-2 animate-pulse rounded-full border border-cyan-400/30" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/50 bg-cyan-950/50 text-cyan-300 shadow-2xl shadow-cyan-500/20">
                <Play
                  size={22}
                  fill="currentColor"
                  className="ml-1"
                />
              </div>
            </div>

            <p className="mt-6 text-[9px] font-black uppercase tracking-[0.4em] text-cyan-500">
              Loading Challenge
            </p>

            <p className="mt-2 text-2xl font-black">
              LEVEL{" "}
              {transitioningLevel}
            </p>
          </div>
        </div>
      )}

      {/* ======================================================
          ATMOSPHERE
      ======================================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[10%] top-[-220px] h-[520px] w-[520px] rounded-full bg-cyan-900/20 blur-[180px]" />

        <div className="absolute right-[-180px] top-[20%] h-[600px] w-[600px] rounded-full bg-blue-900/20 blur-[200px]" />

        <div className="absolute bottom-[-250px] left-[25%] h-[550px] w-[550px] rounded-full bg-teal-900/10 blur-[190px]" />

        <div className="absolute left-[45%] top-[45%] h-[300px] w-[300px] rounded-full bg-cyan-900/10 blur-[160px]" />

      </div>

      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="sticky top-0 z-50 border-b border-cyan-950/50 bg-[#061014]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-950/60 bg-black/30 text-zinc-500 transition hover:border-cyan-600/50 hover:bg-cyan-950/20 hover:text-cyan-400"
              title="Back to Challenge Arena"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-6 w-px bg-cyan-950/50" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-700 shadow-lg shadow-cyan-950/40">
                <Database size={17} />
              </div>

              <div>
                <h1 className="text-sm font-black sm:text-base">
                  SQL
                  <span className="text-cyan-400">
                    Forge
                  </span>
                </h1>

                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                  Medium Challenge Map
                </p>
              </div>

            </div>
          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            {/* XP */}

            <div className="hidden items-center gap-2 rounded-xl border border-zinc-900 bg-black/40 px-3 py-2 sm:flex">
              <Zap
                size={13}
                className="text-yellow-500"
              />

              <span className="text-xs font-black text-zinc-500">
                {progress.xp || 0} XP
              </span>
            </div>

            {/* STREAK */}

            <div className="flex items-center gap-2 rounded-xl border border-orange-950/50 bg-orange-950/10 px-3 py-2">
              <Flame
                size={13}
                className="text-orange-500"
              />

              <span className="text-xs font-black text-zinc-500">
                {progress.streak || 0}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* ======================================================
          MAIN
      ======================================================= */}

      <main className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {/* ====================================================
            HERO
        ===================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-900/40 bg-cyan-950/20 px-4 py-2">

            <Sparkles
              size={13}
              className="text-cyan-400"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400">
              Skill Builder Path
            </span>

          </div>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">
            MEDIUM
            <span className="text-cyan-400">
              {" "}
              LEVELS
            </span>
          </h2>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.35em] text-cyan-900">
            Stage 02 • Skill Builder
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600">
            Go beyond SQL fundamentals.
            Master aggregation, joins,
            subqueries, functions and
            real-world analytical logic.
          </p>

        </section>

        {/* ====================================================
            PROGRESS HUD
        ===================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="rounded-2xl border border-cyan-950/50 bg-[#071318] p-4 shadow-xl shadow-cyan-950/10">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                  Medium Progress
                </p>

                <p className="mt-1 text-sm font-black text-zinc-300">
                  {completedCount}

                  <span className="text-zinc-700">
                    {" "}
                    / 50 Levels
                  </span>
                </p>
              </div>

              <div className="text-right">
                <p className="text-[9px] font-black text-cyan-400">
                  {Math.round(
                    progressPercentage
                  )}
                  %
                </p>

                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-zinc-800">
                  Builder Progress
                </p>
              </div>

            </div>

            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-black">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-800 via-cyan-500 to-blue-400 transition-all duration-700"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>

            <div className="mt-2 flex justify-between">

              {[0, 10, 20, 30, 40, 50].map(
                (value) => (
                  <span
                    key={value}
                    className="text-[7px] font-bold text-zinc-800"
                  >
                    {value}
                  </span>
                )
              )}

            </div>
          </div>
        </section>

        {/* ====================================================
            CURRENT MISSION
        ===================================================== */}

        <section className="mx-auto mt-6 max-w-3xl">

          <div className="relative overflow-hidden rounded-2xl border border-cyan-800/30 bg-gradient-to-r from-cyan-950/30 via-[#071318] to-blue-950/20 p-4 shadow-xl shadow-cyan-950/10">

            <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />

            <div className="relative flex items-center gap-4">

              <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-500/40 bg-cyan-950/50">

                <div className="absolute inset-0 animate-pulse rounded-2xl bg-cyan-400/5" />

                <Play
                  size={18}
                  fill="currentColor"
                  className="relative ml-0.5 text-cyan-300"
                />

              </div>

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-2">

                  <p className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-500">
                    Current Mission
                  </p>

                  <span className="rounded-full border border-cyan-900/50 bg-cyan-950/30 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-cyan-700">
                    Chapter{" "}
                    {currentChapter.number}
                  </span>

                </div>

                <h3 className="mt-1 truncate text-base font-black text-zinc-200 sm:text-lg">
                  Level {currentLevel} •{" "}
                  {
                    LEVEL_TITLES[
                      currentLevel - 1
                    ]
                  }
                </h3>

                <p className="mt-1 line-clamp-1 text-[10px] text-zinc-600">
                  {
                    LEVEL_DESCRIPTIONS[
                      currentLevel - 1
                    ]
                  }
                </p>

              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  transitioningLevel !== null
                }
                className="hidden shrink-0 items-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
              >
                Start
                <ArrowRight size={13} />
              </button>

            </div>

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                transitioningLevel !== null
              }
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-cyan-950/30 transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
            >
              Start Mission
              <ArrowRight size={13} />
            </button>

          </div>
        </section>

        {/* ====================================================
            DESKTOP MAP
        ===================================================== */}

        <section className="relative mx-auto mt-8 hidden max-w-[1200px] md:block">

          <div className="relative min-h-[1800px] overflow-hidden rounded-[2rem] border border-cyan-950/50 bg-[#071318] shadow-2xl shadow-cyan-950/10">

            {/* GRID */}

            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize:
                  "60px 60px",
              }}
            />

            {/* SECONDARY GRID */}

            <div
              className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(34,211,238,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.08) 1px, transparent 1px)",
                backgroundSize:
                  "180px 180px",
              }}
            />

            {/* ATMOSPHERIC ORBS */}

            <div className="pointer-events-none absolute left-[5%] top-[20%] h-40 w-40 rounded-full bg-cyan-500/5 blur-3xl" />

            <div className="pointer-events-none absolute right-[5%] top-[48%] h-48 w-48 rounded-full bg-blue-500/5 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[10%] left-[30%] h-48 w-48 rounded-full bg-teal-500/5 blur-3xl" />

            {/* STARS */}

            <div className="pointer-events-none absolute inset-0">

              {Array.from({
                length: 90,
              }).map((_, index) => {

                const left =
                  (index * 37) % 100;

                const top =
                  (index * 61) % 100;

                const size =
                  index % 4 === 0
                    ? "h-1.5 w-1.5"
                    : "h-1 w-1";

                return (
                  <div
                    key={index}
                    className={`absolute rounded-full bg-cyan-300/20 ${size}`}
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                    }}
                  />
                );
              })}

            </div>

            {/* MAP HEADER */}

            <div className="absolute left-1/2 top-7 z-20 -translate-x-1/2 text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-black/50 px-4 py-2 backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400">
                  Skill Builder Route
                </span>

              </div>
            </div>

            {/* UNLOCKED */}

            <div className="absolute right-5 top-5 z-20 hidden rounded-xl border border-cyan-900/40 bg-black/40 px-3 py-2 backdrop-blur lg:block">

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                  50 Levels Unlocked
                </span>

              </div>
            </div>

            {/* ==================================================
                CHAPTER ZONES
            ================================================== */}

            {CHAPTERS.map((chapter) => {

              const startPosition =
                LEVEL_POSITIONS[
                  chapter.start - 1
                ];

              const endPosition =
                LEVEL_POSITIONS[
                  chapter.end - 1
                ];

              if (
                !startPosition ||
                !endPosition
              ) {
                return null;
              }

              const Icon = chapter.icon;

              const centerX =
                (startPosition.x +
                  endPosition.x) /
                2;

              const centerY =
                (startPosition.y +
                  endPosition.y) /
                2;

              return (
                <div
                  key={chapter.number}
                  className="pointer-events-none absolute z-[2]"
                  style={{
                    left: `${centerX}%`,
                    top: `${centerY}%`,
                    transform:
                      "translate(-50%, -50%)",
                  }}
                >

                  <div className="flex items-center gap-2 rounded-full border border-cyan-950/30 bg-black/20 px-3 py-1.5 opacity-50 backdrop-blur-sm">

                    <Icon
                      size={11}
                      className="text-cyan-700"
                    />

                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-800">
                      CH {chapter.number}
                    </span>

                    <span className="hidden text-[7px] font-bold uppercase tracking-wider text-zinc-800 xl:inline">
                      {chapter.title}
                    </span>

                  </div>
                </div>
              );
            })}

            {/* ==================================================
                SVG PATH
            ================================================== */}

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              <defs>

                <marker
                  id="mediumArrowhead"
                  markerWidth="5"
                  markerHeight="5"
                  refX="4"
                  refY="2.5"
                  orient="auto"
                >
                  <polygon
                    points="0 0, 5 2.5, 0 5"
                    fill="currentColor"
                  />
                </marker>

                <filter id="mediumGlow">
                  <feGaussianBlur
                    stdDeviation="0.8"
                    result="coloredBlur"
                  />

                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>

              </defs>

              {LEVEL_POSITIONS
                .slice(
                  0,
                  TOTAL_LEVELS - 1
                )
                .map(
                  (position, index) => {

                    const next =
                      LEVEL_POSITIONS[
                        index + 1
                      ];

                    if (!position || !next) {
                      return null;
                    }

                    const level =
                      index + 1;

                    const pathCompleted =
                      completedLevels.has(
                        level
                      );

                    const isActivePath =
                      level <
                      currentLevel;

                    const active =
                      pathCompleted ||
                      isActivePath;

                    return (
                      <line
                        key={`path-${level}`}
                        x1={`${position.x}%`}
                        y1={`${position.y}%`}
                        x2={`${next.x}%`}
                        y2={`${next.y}%`}

                        stroke={
                          pathCompleted
                            ? "#22c55e"
                            : isActivePath
                              ? "#22d3ee"
                              : "#164e63"
                        }

                        strokeWidth={
                          pathCompleted
                            ? "0.5"
                            : isActivePath
                              ? "0.35"
                              : "0.22"
                        }

                        strokeDasharray="1.2 1"
                        strokeLinecap="round"

                        markerEnd={
                          active
                            ? "url(#mediumArrowhead)"
                            : undefined
                        }

                        filter={
                          active
                            ? "url(#mediumGlow)"
                            : undefined
                        }

                        opacity={
                          pathCompleted
                            ? 1
                            : isActivePath
                              ? 0.8
                              : 0.3
                        }

                        className="transition-all duration-700"
                      />
                    );
                  }
                )}

            </svg>

            {/* ==================================================
                ENERGY DOTS
            ================================================== */}

            <div className="pointer-events-none absolute inset-0">

              {Array.from({
                length: 14,
              }).map((_, index) => {

                const top =
                  10 + index * 6.5;

                const left =
                  index % 2 === 0
                    ? 7 + index * 5
                    : 93 - index * 4;

                return (
                  <span
                    key={index}
                    className="absolute h-1 w-1 animate-pulse rounded-full bg-cyan-400/20"
                    style={{
                      top: `${Math.min(
                        top,
                        96
                      )}%`,
                      left: `${Math.max(
                        4,
                        Math.min(
                          left,
                          96
                        )
                      )}%`,
                      animationDelay: `${
                        index * 180
                      }ms`,
                    }}
                  />
                );
              })}

            </div>

            {/* ==================================================
                LEVEL NODES
            ================================================== */}

            {Array.from({
              length: TOTAL_LEVELS,
            }).map((_, index) => {

              const level = index + 1;

              const position =
                LEVEL_POSITIONS[index];

              if (!position) {
                return null;
              }

              const completed =
                completedLevels.has(level);

              const current =
                level === currentLevel &&
                !completed;

              const isFinal =
                level === TOTAL_LEVELS;

              return (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    handleLevelClick(level)
                  }
                  disabled={
                    transitioningLevel !==
                    null
                  }
                  title={`Level ${level}: ${LEVEL_TITLES[index]}`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none disabled:cursor-wait"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >

                  {/* CURRENT PULSE */}

                  {current && (
                    <>
                      <span className="absolute -inset-7 animate-ping rounded-full bg-cyan-500/10" />

                      <span className="absolute -inset-5 animate-pulse rounded-full border border-cyan-400/20" />

                      <span className="absolute -inset-3 rounded-full border border-cyan-400/30" />
                    </>
                  )}

                  {/* COMPLETED AURA */}

                  {completed && !isFinal && (
                    <>
                      <span className="absolute -inset-5 rounded-full bg-green-500/5 blur-xl" />

                      <span className="absolute -inset-3 rounded-full border border-green-400/10" />
                    </>
                  )}

                  {/* FINAL BOSS AURA */}

                  {isFinal && (
                    <>
                      <span className="absolute -inset-8 animate-pulse rounded-full bg-amber-500/5" />

                      <span className="absolute -inset-5 rounded-full border border-amber-500/20" />
                    </>
                  )}

                  {/* NODE */}

                  <div
                    className={`
                      relative flex h-16 w-16 items-center justify-center rounded-full
                      border-[3px]
                      transition-all duration-300
                      sm:h-[72px] sm:w-[72px]
                      lg:h-[78px] lg:w-[78px]

                      ${
                        isFinal
                          ? completed
                            ? "border-amber-300 bg-gradient-to-br from-amber-500 via-orange-700 to-orange-950 shadow-2xl shadow-amber-700/40 hover:scale-110"
                            : "border-amber-500 bg-gradient-to-br from-amber-700 via-orange-900 to-[#241006] shadow-2xl shadow-amber-900/30 hover:scale-110 hover:border-amber-300"

                          : completed
                            ? "border-green-300 bg-gradient-to-br from-green-400 via-green-600 to-green-950 shadow-xl shadow-green-700/40 hover:scale-110 hover:border-green-200"

                            : current
                              ? "scale-110 border-cyan-200 bg-gradient-to-br from-cyan-500 via-blue-700 to-cyan-950 shadow-2xl shadow-cyan-500/50 hover:scale-[1.17]"

                              : "border-cyan-700 bg-gradient-to-br from-cyan-900 via-blue-950 to-[#061318] shadow-lg shadow-cyan-950/40 hover:scale-110 hover:border-cyan-300 hover:shadow-cyan-700/40"
                      }
                    `}
                  >

                    {/* INNER RING */}

                    <div className="absolute inset-1 rounded-full border border-white/20" />

                    <div
                      className={`absolute inset-2 rounded-full ${
                        completed
                          ? "bg-green-400/5"
                          : "bg-cyan-400/5"
                      }`}
                    />

                    {/* ICON */}

                    {completed ? (
                      <Check
                        size={27}
                        strokeWidth={3}
                        className="relative z-10 text-white"
                      />
                    ) : isFinal ? (
                      <Crown
                        size={25}
                        className="relative z-10 text-amber-200"
                      />
                    ) : current ? (
                      <Play
                        size={25}
                        fill="currentColor"
                        className="relative z-10 ml-1 text-white"
                      />
                    ) : (
                      <span className="relative z-10 text-lg font-black text-white sm:text-xl">
                        {level}
                      </span>
                    )}

                    {/* FINAL STAR */}

                    {isFinal && (
                      <Star
                        size={10}
                        fill="currentColor"
                        className="absolute right-1 top-1 text-amber-300"
                      />
                    )}

                  </div>

                  {/* LABEL */}

                  <div
                    className={`
                      absolute left-1/2 top-full mt-2
                      -translate-x-1/2 whitespace-nowrap
                      rounded-lg border px-2.5 py-1
                      transition-all duration-300

                      ${
                        isFinal
                          ? "border-amber-700/60 bg-amber-950/80 text-amber-300"

                          : completed
                            ? "border-green-700/60 bg-green-950/80 text-green-300"

                            : current
                              ? "border-cyan-500/60 bg-cyan-950/80 text-cyan-200 shadow-lg shadow-cyan-950/30"

                              : "border-zinc-800 bg-black/70 text-zinc-500"
                      }
                    `}
                  >

                    <p className="text-[8px] font-black uppercase tracking-wider">
                      Level {level}
                    </p>

                    <p
                      className={`mt-0.5 max-w-[115px] truncate text-[7px] font-bold ${
                        completed
                          ? "text-green-700"
                          : "text-zinc-600"
                      }`}
                    >
                      {LEVEL_TITLES[index]}
                    </p>

                  </div>

                  {/* CURRENT START LABEL */}

                  {current && (
                    <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap">

                      <div className="rounded-lg border border-cyan-700/50 bg-cyan-950/80 px-2.5 py-1.5 shadow-xl shadow-cyan-950/30 backdrop-blur">

                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-400">
                          Current Mission
                        </p>

                      </div>
                    </div>
                  )}

                </button>
              );
            })}

            {/* ==================================================
                CHAPTER MARKERS
            ================================================== */}

            {CHAPTERS.map((chapter) => {

              const start =
                LEVEL_POSITIONS[
                  chapter.start - 1
                ];

              if (!start) {
                return null;
              }

              const Icon = chapter.icon;

              return (
                <div
                  key={`marker-${chapter.number}`}
                  className="pointer-events-none absolute left-5 z-20 hidden lg:block"
                  style={{
                    top: `calc(${start.y}% - 35px)`,
                  }}
                >

                  <div className="flex items-center gap-2 rounded-xl border border-cyan-950/40 bg-black/40 px-3 py-2 backdrop-blur">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-cyan-900/50 bg-cyan-950/30">

                      <Icon
                        size={12}
                        className="text-cyan-600"
                      />

                    </div>

                    <div>

                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-cyan-700">
                        Chapter{" "}
                        {chapter.number}
                      </p>

                      <p className="text-[9px] font-black text-zinc-600">
                        {chapter.title}
                      </p>

                    </div>

                  </div>
                </div>
              );
            })}

            {/* ==================================================
                COMPLETION PANEL
            ================================================== */}

            {completedCount >=
              TOTAL_LEVELS && (
              <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">

                <div className="flex items-center gap-3 rounded-2xl border border-green-700/50 bg-green-950/50 px-5 py-3 shadow-2xl shadow-green-950/30 backdrop-blur-xl">

                  <Trophy
                    size={19}
                    className="text-green-400"
                  />

                  <div>

                    <p className="text-xs font-black text-green-300">
                      MEDIUM STAGE COMPLETE
                    </p>

                    <p className="text-[9px] text-green-700">
                      All 50 builder levels mastered
                    </p>

                  </div>

                </div>
              </div>
            )}

          </div>
        </section>

        {/* ====================================================
            MOBILE JOURNEY
        ===================================================== */}

        <section className="relative mt-8 md:hidden">

          <div className="relative overflow-hidden rounded-[2rem] border border-cyan-950/50 bg-[#071318] px-4 py-7">

            {/* MOBILE LINE */}

            <div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-gradient-to-b from-cyan-800/10 via-cyan-700/40 to-cyan-800/10" />

            <div className="relative z-10 space-y-4">

              {Array.from({
                length: TOTAL_LEVELS,
              }).map((_, index) => {

                const level = index + 1;

                const completed =
                  completedLevels.has(level);

                const current =
                  level === currentLevel &&
                  !completed;

                const isFinal =
                  level === TOTAL_LEVELS;

                const chapter =
                  CHAPTERS.find(
                    (item) =>
                      level >= item.start &&
                      level <= item.end
                  );

                const Icon =
                  chapter?.icon || Target;

                const rightSide =
                  level % 2 === 0;

                return (
                  <div
                    key={level}
                    className={`relative flex ${
                      rightSide
                        ? "justify-end pl-8"
                        : "justify-start pr-8"
                    }`}
                  >

                    {/* CHECKPOINT */}

                    <div
                      className={`absolute left-1/2 top-1/2 z-20 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 ${
                        completed
                          ? "border-green-300 bg-green-700 shadow-lg shadow-green-500/20"

                          : current
                            ? "border-cyan-300 bg-cyan-700 shadow-lg shadow-cyan-500/30"

                            : isFinal
                              ? "border-amber-500 bg-amber-950"

                              : "border-cyan-950 bg-[#071318]"
                      }`}
                    >

                      {completed ? (
                        <Check
                          size={13}
                          strokeWidth={3}
                        />
                      ) : isFinal ? (
                        <Crown
                          size={12}
                          className="text-amber-300"
                        />
                      ) : (
                        <span className="text-[8px] font-black text-cyan-300">
                          {level}
                        </span>
                      )}

                    </div>

                    {/* CARD */}

                    <button
                      type="button"
                      onClick={() =>
                        handleLevelClick(level)
                      }
                      disabled={
                        transitioningLevel !==
                        null
                      }
                      className={`group relative w-[calc(50%-16px)] overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300 disabled:cursor-wait disabled:opacity-70 ${
                        isFinal
                          ? completed
                            ? "border-amber-700/50 bg-amber-950/20"
                            : "border-amber-800/50 bg-amber-950/10"

                          : completed
                            ? "border-green-800/50 bg-green-950/20 shadow-lg shadow-green-950/10"

                            : current
                              ? "border-cyan-600/60 bg-cyan-950/20 shadow-lg shadow-cyan-950/20"

                              : "border-zinc-900 bg-black/20"
                      }`}
                    >

                      {completed && !isFinal && (
                        <div className="pointer-events-none absolute right-[-30px] top-[-30px] h-20 w-20 rounded-full bg-green-400/5 blur-2xl" />
                      )}

                      {current && (
                        <div className="pointer-events-none absolute right-[-30px] top-[-30px] h-20 w-20 rounded-full bg-cyan-400/10 blur-2xl" />
                      )}

                      <div className="relative flex items-start justify-between gap-2">

                        <div>

                          <p
                            className={`text-[7px] font-black uppercase tracking-[0.2em] ${
                              isFinal
                                ? "text-amber-600"
                                : current
                                  ? "text-cyan-400"
                                  : completed
                                    ? "text-green-500"
                                    : "text-zinc-800"
                            }`}
                          >
                            {chapter
                              ? `CH ${chapter.number}`
                              : "SQL"}
                          </p>

                          <p
                            className={`mt-1 text-[8px] font-black uppercase tracking-wider ${
                              current
                                ? "text-cyan-500"
                                : isFinal
                                  ? "text-amber-500"
                                  : completed
                                    ? "text-green-500"
                                    : "text-zinc-700"
                            }`}
                          >
                            Level {level}
                          </p>

                        </div>

                        <Icon
                          size={13}
                          className={
                            isFinal
                              ? "text-amber-500"
                              : current
                                ? "text-cyan-400"
                                : completed
                                  ? "text-green-500"
                                  : "text-zinc-800"
                          }
                        />

                      </div>

                      <h3
                        className={`relative mt-3 text-xs font-black leading-4 ${
                          current
                            ? "text-white"
                            : completed
                              ? "text-green-200"
                              : isFinal
                                ? "text-amber-300"
                                : "text-zinc-600"
                        }`}
                      >
                        {LEVEL_TITLES[index]}
                      </h3>

                      <p className="relative mt-1.5 line-clamp-2 text-[8px] leading-4 text-zinc-700">
                        {
                          LEVEL_DESCRIPTIONS[
                            index
                          ]
                        }
                      </p>

                      <div className="relative mt-3 flex items-center justify-between">

                        <span
                          className={`text-[7px] font-black uppercase tracking-widest ${
                            completed
                              ? "text-green-500"
                              : current
                                ? "text-cyan-500"
                                : isFinal
                                  ? "text-amber-600"
                                  : "text-zinc-800"
                          }`}
                        >
                          {completed
                            ? "Completed"
                            : current
                              ? "Current"
                              : isFinal
                                ? "Final Trial"
                                : "Available"}
                        </span>

                        {(current ||
                          completed ||
                          isFinal) && (
                          <ChevronRight
                            size={11}
                            className={
                              isFinal
                                ? "text-amber-600"
                                : completed
                                  ? "text-green-500"
                                  : "text-cyan-600"
                            }
                          />
                        )}

                      </div>

                    </button>
                  </div>
                );
              })}

            </div>

            {/* MOBILE COMPLETE */}

            {completedCount >=
              TOTAL_LEVELS && (
              <div className="relative z-20 mt-8 rounded-2xl border border-green-800/40 bg-green-950/20 p-4 text-center">

                <Trophy
                  size={20}
                  className="mx-auto text-green-400"
                />

                <p className="mt-2 text-xs font-black text-green-300">
                  MEDIUM STAGE COMPLETE
                </p>

                <p className="mt-1 text-[9px] text-green-700">
                  All 50 levels mastered.
                </p>

              </div>
            )}

          </div>
        </section>

        {/* ====================================================
            LEGEND
        ===================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="grid grid-cols-3 gap-2">

            {/* COMPLETED */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#071318] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-300 bg-green-700 shadow-lg shadow-green-900/20">

                <Check
                  size={14}
                  strokeWidth={3}
                />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-green-600">
                Completed
              </span>

            </div>

            {/* CURRENT */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#071318] p-3">

              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-300 bg-cyan-800">

                <Play
                  size={10}
                  fill="currentColor"
                  className="ml-0.5"
                />

                <span className="absolute -inset-2 animate-ping rounded-full bg-cyan-500/5" />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                Current
              </span>

            </div>

            {/* AVAILABLE */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#071318] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-700 bg-cyan-950">

                <span className="text-[10px] font-black text-cyan-500">
                  01
                </span>

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                Available
              </span>

            </div>

          </div>
        </section>

        {/* ====================================================
            CONTINUE CTA
        ===================================================== */}

        {completedCount <
          TOTAL_LEVELS && (
          <section className="mx-auto mt-7 max-w-3xl">

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                transitioningLevel !== null
              }
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-cyan-800/40 bg-gradient-to-r from-cyan-950/30 to-blue-950/20 p-5 text-left transition hover:border-cyan-600/60 hover:bg-cyan-950/30 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-cyan-500/10 blur-3xl" />

              <div className="relative">

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-cyan-600">
                  Continue Your Journey
                </p>

                <h3 className="mt-1 text-lg font-black text-zinc-200">
                  Level {currentLevel}
                </h3>

                <p className="mt-1 text-[9px] text-zinc-700">
                  {
                    LEVEL_TITLES[
                      currentLevel - 1
                    ]
                  }
                </p>

              </div>

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-700/50 bg-cyan-950/40 text-cyan-400 transition group-hover:translate-x-1">
                <ArrowRight size={17} />
              </div>

            </button>
          </section>
        )}

        {/* ====================================================
            FINAL COMPLETE CTA
        ===================================================== */}

        {completedCount >=
          TOTAL_LEVELS && (
          <section className="mx-auto mt-7 max-w-3xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/advanced-levels"
                )
              }
              className="group flex w-full items-center justify-between rounded-2xl border border-amber-800/40 bg-gradient-to-r from-amber-950/20 to-orange-950/20 p-5 transition hover:border-amber-600/50"
            >

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-amber-600">
                  Builder Stage Complete
                </p>

                <h3 className="mt-1 text-lg font-black text-zinc-200">
                  Enter Advanced SQL
                </h3>

                <p className="mt-1 text-[9px] text-zinc-700">
                  Your next challenge awaits.
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-700/40 bg-amber-950/30 text-amber-400 transition group-hover:translate-x-1">
                <ArrowRight size={17} />
              </div>

            </button>
          </section>
        )}

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <footer className="mx-auto mt-12 max-w-3xl pb-8 text-center">

          <div className="flex items-center justify-center gap-2">

            <div className="h-px w-10 bg-cyan-950/50" />

            <Database
              size={11}
              className="text-cyan-900"
            />

            <div className="h-px w-10 bg-cyan-950/50" />

          </div>

          <p className="mt-3 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800">
            SQLForge • Skill Builder Protocol
          </p>

        </footer>

      </main>
    </div>
  );
}

export default MediumLevels;