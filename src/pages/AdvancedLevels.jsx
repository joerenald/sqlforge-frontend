import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronRight,
  Crown,
  Database,
  Flame,
  Play,
  Shield,
  Skull,
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
  "Multiple Orders",
  "Above Average Spending",
  "Products Never Ordered",
  "Highest Price Per Category",
  "Department Salary Analysis",
  "Customers With Orders & Reviews",
  "Above Average Ratings",
  "Customers With No Reviews",
  "Orders Above Customer Average",
  "Suppliers With Multiple Products",

  "Advanced Aggregation",
  "Multi-Level Aggregation",
  "Complex GROUP BY",
  "Advanced HAVING",
  "Nested Aggregation",
  "Subquery Fundamentals",
  "Scalar Subqueries",
  "Derived Tables",
  "Subquery Filtering",
  "Aggregation Subqueries",

  "Correlated Subqueries",
  "Advanced Correlation",
  "NOT EXISTS Logic",
  "Multiple EXISTS",
  "EXISTS + Aggregation",
  "NOT EXISTS + JOIN",
  "Nested EXISTS",
  "Anti-Join Analysis",
  "Relationship Validation",
  "Complex Existence Logic",

  "Multi-Table Analysis",
  "JOIN + Subquery",
  "JOIN + Aggregation",
  "JOIN + HAVING",
  "Multi-Level JOIN",
  "Complex Relationships",
  "Customer Intelligence",
  "Product Intelligence",
  "Supplier Intelligence",
  "Business Intelligence",

  "Advanced Data Investigation",
  "Comparative Analysis",
  "Performance Analysis",
  "Cross-Table Analysis",
  "Complex Business Logic",
  "SQL Interview Challenge",
  "SQL Placement Challenge",
  "Expert Query Challenge",
  "Advanced SQL Mastery",
  "SQLForge Final Boss",
];

// ============================================================
// LEVEL DESCRIPTIONS
// ============================================================

const LEVEL_DESCRIPTIONS = [
  "Find customers who have placed multiple orders and expose their ordering behavior.",
  "Identify customers whose total spending exceeds the average customer spending.",
  "Find products that have never appeared in any customer order.",
  "Determine the highest-priced product within each category.",
  "Compare department salary totals and identify the strongest-paying departments.",
  "Find customers who have both purchased products and submitted reviews.",
  "Identify products whose ratings exceed the overall average rating.",
  "Find customers who have purchased products but never submitted a review.",
  "Compare each customer's orders against their own average order value.",
  "Identify suppliers responsible for multiple products across the catalog.",

  "Combine multiple aggregate functions to produce deeper business statistics.",
  "Solve aggregation problems that require more than one level of grouping.",
  "Build complex GROUP BY queries across multiple dimensions.",
  "Filter grouped results using advanced HAVING conditions.",
  "Use nested aggregate logic to derive meaningful business metrics.",
  "Understand how subqueries can be used to isolate intermediate results.",
  "Return a single calculated value from a subquery and use it in another query.",
  "Turn a query into a derived table and analyze its results externally.",
  "Use subqueries to filter rows according to dynamic conditions.",
  "Combine aggregation and subqueries to solve multi-step analytical problems.",

  "Use correlated subqueries where the inner query depends on the outer row.",
  "Build advanced row-by-row comparisons using correlated logic.",
  "Use NOT EXISTS to detect missing relationships in relational data.",
  "Combine multiple EXISTS conditions to validate complex relationships.",
  "Use EXISTS together with aggregation to solve advanced validation problems.",
  "Combine NOT EXISTS and JOIN logic to identify missing associations.",
  "Nest EXISTS conditions to create deeper relational checks.",
  "Solve anti-join problems using multiple SQL strategies.",
  "Validate whether required relationships exist across several tables.",
  "Construct complex existence logic involving multiple relational conditions.",

  "Analyze information spread across multiple related tables.",
  "Combine JOIN operations with subqueries for advanced filtering.",
  "Join multiple tables and calculate aggregate business metrics.",
  "Filter multi-table aggregate results using HAVING.",
  "Perform analysis requiring several levels of relational joins.",
  "Solve complex problems involving several interconnected relationships.",
  "Extract meaningful customer behavior and purchasing intelligence.",
  "Analyze product performance using multiple data relationships.",
  "Investigate supplier performance across the entire catalog.",
  "Combine multiple business dimensions into a single analytical query.",

  "Investigate unfamiliar data and determine meaningful patterns.",
  "Compare entities against each other using advanced SQL logic.",
  "Analyze performance metrics across different groups and entities.",
  "Compare information across multiple independent tables.",
  "Translate complex business requirements into SQL logic.",
  "Solve a difficult interview-style SQL problem under pressure.",
  "Tackle a placement-oriented SQL challenge combining multiple concepts.",
  "Solve an expert-level query requiring several advanced techniques.",
  "Demonstrate complete advanced SQL mastery across multiple concepts.",
  "Defeat the SQLForge Final Boss and prove elite SQL mastery.",
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
    icon: Shield,
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

function AdvancedLevels() {
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

        const normalizedProgress = {
          easy: {
            completed: Array.isArray(
              backendProgress.easy?.completed
            )
              ? backendProgress.easy.completed
                  .map(Number)
                  .filter(
                    (level) =>
                      Number.isInteger(level) &&
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
                      Number.isInteger(level) &&
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
                      Number.isInteger(level) &&
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
        };

        setProgress(normalizedProgress);

        localStorage.setItem(
          PROGRESS_STORAGE_KEY,
          JSON.stringify(normalizedProgress)
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Unable to load SQLForge progress:",
            error
          );

          setProgress(
            getStoredProgress()
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
      progress.advanced?.completed || [];

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
    (completedCount / TOTAL_LEVELS) * 100;

  const isComplete =
    completedCount >= TOTAL_LEVELS;

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
  // ALL ADVANCED LEVELS ARE UNLOCKED.
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
        `/challenge/advanced/${level}`
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
    <div className="min-h-screen overflow-x-hidden bg-[#080706] text-white">

      {/* ======================================================
          TRANSITION OVERLAY
      ======================================================= */}

      {transitioningLevel !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#050302]/95 backdrop-blur-xl">

          <div className="text-center">

            <div className="relative mx-auto flex h-20 w-20 items-center justify-center">

              <div className="absolute inset-0 animate-ping rounded-full bg-orange-500/10" />

              <div className="absolute inset-2 animate-pulse rounded-full border border-orange-400/30" />

              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-400/50 bg-orange-950/50 text-orange-300 shadow-2xl shadow-orange-500/20">

                <Flame
                  size={22}
                  className="animate-pulse"
                />

              </div>
            </div>

            <p className="mt-6 text-[9px] font-black uppercase tracking-[0.4em] text-orange-500">
              Entering Combat
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

        <div className="absolute left-[-160px] top-[-220px] h-[560px] w-[560px] rounded-full bg-red-950/30 blur-[180px]" />

        <div className="absolute right-[-180px] top-[10%] h-[620px] w-[620px] rounded-full bg-orange-950/20 blur-[200px]" />

        <div className="absolute bottom-[-260px] left-[20%] h-[580px] w-[580px] rounded-full bg-red-950/20 blur-[190px]" />

        <div className="absolute left-[45%] top-[40%] h-[340px] w-[340px] rounded-full bg-amber-900/10 blur-[170px]" />

      </div>

      {/* ======================================================
          HEADER
      ======================================================= */}

      <header className="sticky top-0 z-50 border-b border-red-950/60 bg-[#080706]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              type="button"
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-950/60 bg-black/30 text-zinc-500 transition hover:border-orange-700/50 hover:bg-orange-950/20 hover:text-orange-400"
              title="Back to Challenge Arena"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-6 w-px bg-red-950/60" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-red-700 to-orange-700 shadow-lg shadow-red-950/50">
                <Flame size={17} />
              </div>

              <div>

                <h1 className="text-sm font-black sm:text-base">
                  SQL
                  <span className="text-orange-500">
                    Forge
                  </span>
                </h1>

                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">
                  Advanced Combat Zone
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

          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-orange-900/40 bg-orange-950/20 px-4 py-2">

            <Flame
              size={13}
              className="text-orange-400"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
              Elite SQL // Combat Mode
            </span>

          </div>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">

            ADVANCED
            <span className="text-orange-500">
              {" "}
              LEVELS
            </span>

          </h2>

          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.35em] text-orange-900">
            Stage 03 • Elite Combat
          </p>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-zinc-600">
            Enter the advanced SQL battlefield.
            Master complex aggregation, correlated
            subqueries, multi-table analysis and
            interview-level business logic.
          </p>

        </section>

        {/* ====================================================
            PROGRESS HUD
        ===================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="rounded-2xl border border-orange-950/50 bg-[#0d0906] p-4 shadow-xl shadow-red-950/10">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">
                  Combat Progress
                </p>

                <p className="mt-1 text-sm font-black text-zinc-300">

                  {completedCount}

                  <span className="text-zinc-700">
                    {" "}
                    / 50 Elite Levels
                  </span>

                </p>

              </div>

              <div className="text-right">

                <p className="text-[9px] font-black text-orange-500">
                  {Math.round(
                    progressPercentage
                  )}
                  %
                </p>

                <p className="mt-0.5 text-[7px] font-bold uppercase tracking-widest text-zinc-800">
                  Mastery
                </p>

              </div>

            </div>

            <div className="relative mt-4 h-2 overflow-hidden rounded-full bg-black">

              <div
                className="h-full rounded-full bg-gradient-to-r from-red-900 via-orange-600 to-amber-400 transition-all duration-700"
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

        {!isComplete && (
          <section className="mx-auto mt-6 max-w-3xl">

            <div className="relative overflow-hidden rounded-2xl border border-orange-800/30 bg-gradient-to-r from-red-950/30 via-[#0d0906] to-orange-950/20 p-4 shadow-xl shadow-red-950/10">

              <div className="pointer-events-none absolute right-[-80px] top-[-80px] h-48 w-48 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative flex items-center gap-4">

                <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-orange-500/40 bg-orange-950/50">

                  <div className="absolute inset-0 animate-pulse rounded-2xl bg-orange-400/5" />

                  <Play
                    size={18}
                    fill="currentColor"
                    className="relative ml-0.5 text-orange-300"
                  />

                </div>

                <div className="min-w-0 flex-1">

                  <div className="flex flex-wrap items-center gap-2">

                    <p className="text-[8px] font-black uppercase tracking-[0.25em] text-orange-500">
                      Current Mission
                    </p>

                    <span className="rounded-full border border-orange-900/50 bg-orange-950/30 px-2 py-0.5 text-[7px] font-black uppercase tracking-widest text-orange-700">
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
                  className="hidden shrink-0 items-center gap-2 rounded-xl bg-orange-700 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:flex"
                >
                  Enter
                  <ArrowRight size={13} />
                </button>

              </div>

              <button
                type="button"
                onClick={handleContinue}
                disabled={
                  transitioningLevel !== null
                }
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-700 px-4 py-2.5 text-[9px] font-black uppercase tracking-widest text-white shadow-lg shadow-orange-950/30 transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 sm:hidden"
              >
                Enter Combat
                <ArrowRight size={13} />
              </button>

            </div>
          </section>
        )}

        {/* ====================================================
            DESKTOP MAP
        ===================================================== */}

        <section className="relative mx-auto mt-8 hidden max-w-[1200px] md:block">

          <div className="relative min-h-[1800px] overflow-hidden rounded-[2rem] border border-red-950/60 bg-[#0d0906] shadow-2xl shadow-red-950/20">

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
                  "linear-gradient(rgba(249,115,22,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(249,115,22,0.08) 1px, transparent 1px)",
                backgroundSize:
                  "180px 180px",
              }}
            />

            {/* ATMOSPHERIC ORBS */}

            <div className="pointer-events-none absolute left-[5%] top-[20%] h-40 w-40 rounded-full bg-red-500/5 blur-3xl" />

            <div className="pointer-events-none absolute right-[5%] top-[48%] h-48 w-48 rounded-full bg-orange-500/5 blur-3xl" />

            <div className="pointer-events-none absolute bottom-[10%] left-[30%] h-48 w-48 rounded-full bg-amber-500/5 blur-3xl" />

            {/* STARS / EMBERS */}

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
                    className={`absolute rounded-full bg-orange-300/20 ${size}`}
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

              <div className="inline-flex items-center gap-2 rounded-full border border-orange-800/40 bg-black/50 px-4 py-2 backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-orange-400" />

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-orange-400">
                  Elite Combat Route
                </span>

              </div>

            </div>

            {/* UNLOCKED */}

            <div className="absolute right-5 top-5 z-20 hidden rounded-xl border border-orange-900/40 bg-black/40 px-3 py-2 backdrop-blur lg:block">

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

                  <div className="flex items-center gap-2 rounded-full border border-red-950/40 bg-black/30 px-3 py-1.5 opacity-50 backdrop-blur-sm">

                    <Icon
                      size={11}
                      className="text-orange-800"
                    />

                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-900">
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
                  id="advancedArrowhead"
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

                <filter id="advancedGlow">

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
                              ? "#f97316"
                              : "#4c1d0a"
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
                            ? "url(#advancedArrowhead)"
                            : undefined
                        }
                        filter={
                          active
                            ? "url(#advancedGlow)"
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
                ENERGY / EMBER DOTS
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

                const isCompletedZone =
                  currentLevel >
                  index * 4 + 1;

                return (
                  <span
                    key={index}
                    className={`absolute h-1 w-1 animate-pulse rounded-full ${
                      isCompletedZone
                        ? "bg-green-400/20"
                        : "bg-orange-400/20"
                    }`}
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
                      <span className="absolute -inset-7 animate-ping rounded-full bg-orange-500/10" />

                      <span className="absolute -inset-5 animate-pulse rounded-full border border-orange-400/20" />

                      <span className="absolute -inset-3 rounded-full border border-orange-400/30" />
                    </>
                  )}

                  {/* COMPLETED AURA */}

                  {completed && (
                    <>
                      <span className="absolute -inset-5 rounded-full bg-green-500/10 blur-xl" />

                      <span className="absolute -inset-3 rounded-full border border-green-400/20" />
                    </>
                  )}

                  {/* FINAL BOSS AURA */}

                  {isFinal && !completed && (
                    <>
                      <span className="absolute -inset-8 animate-pulse rounded-full bg-amber-500/5" />

                      <span className="absolute -inset-5 rounded-full border border-amber-500/20" />

                      <span className="absolute -inset-3 rounded-full border border-orange-700/20" />
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
                        completed
                          ? "border-green-300 bg-gradient-to-br from-green-400 via-emerald-600 to-green-950 text-white shadow-2xl shadow-green-700/40 hover:scale-110 hover:border-green-200"

                          : current
                            ? "scale-110 border-orange-200 bg-gradient-to-br from-orange-500 via-red-700 to-red-950 shadow-2xl shadow-orange-500/50 hover:scale-[1.17]"

                            : isFinal
                              ? "border-amber-500 bg-gradient-to-br from-amber-700 via-orange-900 to-[#241006] shadow-2xl shadow-amber-900/30 hover:scale-110 hover:border-amber-300"

                              : "border-orange-800 bg-gradient-to-br from-red-950 via-orange-950 to-[#100806] shadow-lg shadow-red-950/40 hover:scale-110 hover:border-orange-400 hover:shadow-orange-700/40"
                      }
                    `}
                  >

                    {/* INNER RING */}

                    <div className="absolute inset-1 rounded-full border border-white/20" />

                    <div
                      className={`absolute inset-2 rounded-full ${
                        completed
                          ? "bg-green-400/10"
                          : "bg-orange-400/5"
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
                      <Skull
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

                    {isFinal && !completed && (
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
                        completed
                          ? "border-green-700/60 bg-green-950/90 text-green-300"

                          : isFinal
                            ? "border-amber-700/60 bg-amber-950/80 text-amber-300"

                            : current
                              ? "border-orange-500/60 bg-orange-950/80 text-orange-200 shadow-lg shadow-orange-950/30"

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
                          ? "text-green-300"
                          : current
                            ? "text-orange-400"
                            : "text-zinc-600"
                      }`}
                    >
                      {LEVEL_TITLES[index]}
                    </p>

                  </div>

                  {/* CURRENT START LABEL */}

                  {current && (
                    <div className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2 whitespace-nowrap">

                      <div className="rounded-lg border border-orange-700/50 bg-orange-950/80 px-2.5 py-1.5 shadow-xl shadow-orange-950/30 backdrop-blur">

                        <p className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-400">
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

                  <div className="flex items-center gap-2 rounded-xl border border-red-950/50 bg-black/40 px-3 py-2 backdrop-blur">

                    <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-orange-900/50 bg-orange-950/30">

                      <Icon
                        size={12}
                        className="text-orange-600"
                      />

                    </div>

                    <div>

                      <p className="text-[7px] font-black uppercase tracking-[0.2em] text-orange-700">
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
                FINAL BOSS BANNER
            ================================================== */}

            {!isComplete && (
              <div className="pointer-events-none absolute bottom-28 left-1/2 z-20 -translate-x-1/2">

                <div className="flex items-center gap-3 rounded-2xl border border-amber-800/40 bg-gradient-to-r from-red-950/70 via-orange-950/60 to-amber-950/50 px-5 py-3 shadow-2xl shadow-red-950/40 backdrop-blur-xl">

                  <Skull
                    size={19}
                    className="text-amber-400"
                  />

                  <div>

                    <p className="text-xs font-black text-amber-300">
                      FINAL BOSS AHEAD
                    </p>

                    <p className="text-[9px] text-amber-700">
                      Level 50 • SQLForge Final Boss
                    </p>

                  </div>

                </div>
              </div>
            )}

            {/* ==================================================
                COMPLETION PANEL
            ================================================== */}

            {isComplete && (
              <div className="absolute bottom-8 left-1/2 z-30 -translate-x-1/2">

                <div className="flex items-center gap-3 rounded-2xl border border-green-700/50 bg-green-950/50 px-5 py-3 shadow-2xl shadow-green-950/30 backdrop-blur-xl">

                  <Trophy
                    size={19}
                    className="text-green-400"
                  />

                  <div>

                    <p className="text-xs font-black text-green-300">
                      ADVANCED STAGE COMPLETE
                    </p>

                    <p className="text-[9px] text-green-700">
                      All 50 elite combat levels mastered
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

          <div className="relative overflow-hidden rounded-[2rem] border border-red-950/60 bg-[#0d0906] px-4 py-7">

            {/* MOBILE LINE */}

            <div className="absolute bottom-10 left-1/2 top-10 w-px -translate-x-1/2 bg-gradient-to-b from-red-900/10 via-orange-800/40 to-red-900/10" />

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
                            ? "border-orange-300 bg-orange-700 shadow-lg shadow-orange-500/30"

                            : isFinal
                              ? "border-amber-500 bg-amber-950"

                              : "border-orange-950 bg-[#0d0906]"
                      }`}
                    >

                      {completed ? (
                        <Check
                          size={13}
                          strokeWidth={3}
                        />

                      ) : isFinal ? (
                        <Skull
                          size={12}
                          className="text-amber-300"
                        />

                      ) : (
                        <span
                          className={`text-[8px] font-black ${
                            current
                              ? "text-orange-200"
                              : "text-orange-500"
                          }`}
                        >
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
                        completed
                          ? "border-green-800/50 bg-green-950/20 shadow-lg shadow-green-950/10"

                          : isFinal
                            ? "border-amber-800/50 bg-amber-950/10"

                            : current
                              ? "border-orange-600/60 bg-orange-950/20 shadow-lg shadow-orange-950/20"

                              : "border-zinc-900 bg-black/20"
                      }`}
                    >

                      {/* COMPLETED GLOW */}

                      {completed && (
                        <div className="pointer-events-none absolute right-[-30px] top-[-30px] h-20 w-20 rounded-full bg-green-400/10 blur-2xl" />
                      )}

                      {/* CURRENT GLOW */}

                      {current && (
                        <div className="pointer-events-none absolute right-[-30px] top-[-30px] h-20 w-20 rounded-full bg-orange-400/10 blur-2xl" />
                      )}

                      {/* FINAL HAZARD */}

                      {isFinal && !completed && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-amber-500/5 to-red-950/10" />
                      )}

                      <div className="relative flex items-start justify-between gap-2">

                        <div>

                          <p
                            className={`text-[7px] font-black uppercase tracking-[0.2em] ${
                              completed
                                ? "text-green-400"
                                : isFinal
                                  ? "text-amber-600"
                                  : current
                                    ? "text-orange-400"
                                    : "text-zinc-800"
                            }`}
                          >
                            {chapter
                              ? `CH ${chapter.number}`
                              : "SQL"}
                          </p>

                          <p
                            className={`mt-1 text-[8px] font-black uppercase tracking-wider ${
                              completed
                                ? "text-green-500"
                                : current
                                  ? "text-orange-500"
                                  : isFinal
                                    ? "text-amber-500"
                                    : "text-zinc-700"
                            }`}
                          >
                            Level {level}
                          </p>

                        </div>

                        <Icon
                          size={13}
                          className={
                            completed
                              ? "text-green-500"
                              : isFinal
                                ? "text-amber-500"
                                : current
                                  ? "text-orange-400"
                                  : "text-zinc-800"
                          }
                        />

                      </div>

                      <h3
                        className={`relative mt-3 text-xs font-black leading-4 ${
                          completed
                            ? "text-green-200"
                            : current
                              ? "text-white"
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
                              ? "text-green-400"
                              : current
                                ? "text-orange-500"
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
                                ? "Final Boss"
                                : "Available"}
                        </span>

                        {(current ||
                          completed ||
                          isFinal) && (
                          <ChevronRight
                            size={11}
                            className={
                              completed
                                ? "text-green-500"
                                : isFinal
                                  ? "text-amber-600"
                                  : "text-orange-500"
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

            {isComplete && (
              <div className="relative z-20 mt-8 rounded-2xl border border-green-800/40 bg-green-950/20 p-4 text-center">

                <Trophy
                  size={20}
                  className="mx-auto text-green-400"
                />

                <p className="mt-2 text-xs font-black text-green-300">
                  ADVANCED STAGE COMPLETE
                </p>

                <p className="mt-1 text-[9px] text-green-700">
                  All 50 elite levels mastered.
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

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0d0906] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-green-300 bg-green-700 shadow-lg shadow-green-900/20">

                <Check
                  size={14}
                  strokeWidth={3}
                />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-green-500">
                Completed
              </span>

            </div>

            {/* CURRENT */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0d0906] p-3">

              <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-800">

                <Play
                  size={10}
                  fill="currentColor"
                  className="ml-0.5"
                />

                <span className="absolute -inset-2 animate-ping rounded-full bg-orange-500/5" />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                Current
              </span>

            </div>

            {/* FINAL BOSS */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0d0906] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-amber-600 bg-amber-950">

                <Skull
                  size={13}
                  className="text-amber-400"
                />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-amber-700">
                Final Boss
              </span>

            </div>

          </div>
        </section>

        {/* ====================================================
            CONTINUE CTA
        ===================================================== */}

        {!isComplete && (
          <section className="mx-auto mt-7 max-w-3xl">

            <button
              type="button"
              onClick={handleContinue}
              disabled={
                transitioningLevel !== null
              }
              className="group relative flex w-full items-center justify-between overflow-hidden rounded-2xl border border-orange-800/40 bg-gradient-to-r from-red-950/30 to-orange-950/20 p-5 text-left transition hover:border-orange-600/60 hover:bg-orange-950/30 disabled:cursor-not-allowed disabled:opacity-60"
            >

              <div className="pointer-events-none absolute right-[-100px] top-[-100px] h-56 w-56 rounded-full bg-orange-500/10 blur-3xl" />

              <div className="relative">

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-orange-600">
                  Continue Your Combat
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

              <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-orange-700/50 bg-orange-950/40 text-orange-400 transition group-hover:translate-x-1">
                <ArrowRight size={17} />
              </div>

            </button>
          </section>
        )}

        {/* ====================================================
            FINAL COMPLETE CTA
        ===================================================== */}

        {isComplete && (
          <section className="mx-auto mt-7 max-w-3xl">

            <button
              type="button"
              onClick={() =>
                navigate(
                  "/challenge-levels"
                )
              }
              className="group flex w-full items-center justify-between rounded-2xl border border-green-800/40 bg-gradient-to-r from-green-950/20 to-emerald-950/20 p-5 transition hover:border-green-600/50"
            >

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-green-500">
                  Elite Stage Complete
                </p>

                <h3 className="mt-1 text-lg font-black text-zinc-200">
                  Advanced SQL Mastered
                </h3>

                <p className="mt-1 text-[9px] text-zinc-700">
                  Return to the Challenge Arena.
                </p>

              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-green-700/40 bg-green-950/30 text-green-400 transition group-hover:translate-x-1">
                <Trophy size={17} />
              </div>

            </button>
          </section>
        )}

        {/* ====================================================
            FOOTER
        ===================================================== */}

        <footer className="mx-auto mt-12 max-w-3xl pb-8 text-center">

          <div className="flex items-center justify-center gap-2">

            <div className="h-px w-10 bg-red-950/50" />

            <Flame
              size={11}
              className="text-orange-900"
            />

            <div className="h-px w-10 bg-red-950/50" />

          </div>

          <p className="mt-3 text-[8px] font-black uppercase tracking-[0.3em] text-zinc-800">
            SQLForge • Elite Combat Protocol
          </p>

        </footer>

      </main>
    </div>
  );
}

export default AdvancedLevels;