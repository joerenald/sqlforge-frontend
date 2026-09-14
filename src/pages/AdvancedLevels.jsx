import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Flame,
  Play,
  Trophy,
  Zap,
  Skull,
  Shield,
  Target,
  Swords,
  Crown,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_LEVELS = 50;

/* =========================================================
   DEFAULT PROGRESS
========================================================= */

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

/* =========================================================
   DESKTOP MAP POSITIONS

   5 COLUMNS
   Zig-zag progression
========================================================= */

const DESKTOP_LEVEL_POSITIONS = [
  { x: 10, y: 7 },
  { x: 30, y: 7 },
  { x: 50, y: 7 },
  { x: 70, y: 7 },
  { x: 90, y: 7 },

  { x: 90, y: 17 },
  { x: 70, y: 17 },
  { x: 50, y: 17 },
  { x: 30, y: 17 },
  { x: 10, y: 17 },

  { x: 10, y: 27 },
  { x: 30, y: 27 },
  { x: 50, y: 27 },
  { x: 70, y: 27 },
  { x: 90, y: 27 },

  { x: 90, y: 37 },
  { x: 70, y: 37 },
  { x: 50, y: 37 },
  { x: 30, y: 37 },
  { x: 10, y: 37 },

  { x: 10, y: 47 },
  { x: 30, y: 47 },
  { x: 50, y: 47 },
  { x: 70, y: 47 },
  { x: 90, y: 47 },

  { x: 90, y: 57 },
  { x: 70, y: 57 },
  { x: 50, y: 57 },
  { x: 30, y: 57 },
  { x: 10, y: 57 },

  { x: 10, y: 67 },
  { x: 30, y: 67 },
  { x: 50, y: 67 },
  { x: 70, y: 67 },
  { x: 90, y: 67 },

  { x: 90, y: 77 },
  { x: 70, y: 77 },
  { x: 50, y: 77 },
  { x: 30, y: 77 },
  { x: 10, y: 77 },

  { x: 10, y: 87 },
  { x: 30, y: 87 },
  { x: 50, y: 87 },
  { x: 70, y: 87 },
  { x: 90, y: 87 },

  { x: 90, y: 96 },
  { x: 70, y: 96 },
  { x: 50, y: 96 },
  { x: 30, y: 96 },
  { x: 10, y: 96 },
];

/* =========================================================
   MOBILE MAP POSITIONS

   3 COLUMNS
   Zig-zag progression
========================================================= */

const MOBILE_LEVEL_POSITIONS = Array.from(
  { length: TOTAL_LEVELS },
  (_, index) => {
    const level = index + 1;

    const row = Math.floor(index / 3);
    const column = index % 3;

    const y = 6 + row * 5.55;

    const xPositions =
      row % 2 === 0
        ? [17, 50, 83]
        : [83, 50, 17];

    /*
      Keep the final two levels centered/left
      so the Final Boss has enough room.
    */

    if (level === 49) {
      return {
        x: 17,
        y: 95,
      };
    }

    if (level === 50) {
      return {
        x: 50,
        y: 95,
      };
    }

    return {
      x: xPositions[column],
      y,
    };
  }
);

/* =========================================================
   ADVANCED LEVEL TITLES
========================================================= */

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


/* =========================================================
   COMPONENT
========================================================= */

function AdvancedLevels() {
  const navigate = useNavigate();

const [progress, setProgress] = useState(
  DEFAULT_PROGRESS
);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined"
      ? window.innerWidth < 768
      : false
  );

  /* =========================================================
     RESPONSIVE MAP
  ========================================================= */

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
    } catch (error) {
      console.error(
        "Unable to load SQLForge progress:",
        error
      );
    }
  };

  loadProgress();
}, [navigate]);
  const LEVEL_POSITIONS = isMobile
    ? MOBILE_LEVEL_POSITIONS
    : DESKTOP_LEVEL_POSITIONS;

  /* =========================================================
     PROGRESS REFRESH
  ========================================================= */

  useEffect(() => {
    const refreshProgress = () => {
      setProgress(getStoredProgress());
    };

    window.addEventListener(
      "storage",
      refreshProgress
    );

    const interval = setInterval(() => {
      setProgress(getStoredProgress());
    }, 1000);

    return () => {
      window.removeEventListener(
        "storage",
        refreshProgress
      );
      clearInterval(interval);
    };
  }, []);

  /* =========================================================
     COMPLETED LEVELS
  ========================================================= */

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

  const completedCount =
    completedLevels.size;

  /* =========================================================
     NEXT LEVEL
  ========================================================= */

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

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleLevelClick = (level) => {
    navigate(`/challenge/advanced/${level}`);
  };

  const handleBack = () => {
    navigate("/challenge-levels");
  };

  const handleContinue = () => {
    navigate(
      `/challenge/advanced/${nextLevel}`
    );
  };

  const progressPercentage =
    (completedCount / TOTAL_LEVELS) * 100;

  /* =========================================================
     RENDER
  ========================================================= */

  return (
    <>
      {/* =====================================================
          ANIMATIONS

          NOTE:
          Actual flame / ember animations have been removed.
          Only UI / map / boss animations remain.
      ===================================================== */}

      <style>{`

        @keyframes forgeGlow {
          0%, 100% {
            transform: scale(0.95);
            opacity: 0.18;
          }

          50% {
            transform: scale(1.08);
            opacity: 0.42;
          }
        }

        @keyframes heatPulse {
          0%, 100% {
            opacity: 0.1;
          }

          50% {
            opacity: 0.3;
          }
        }

        @keyframes hazardMove {
          from {
            background-position: 0 0;
          }

          to {
            background-position: 40px 0;
          }
        }

        @keyframes bossPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow:
              0 0 0 0 rgba(249, 115, 22, 0.12),
              0 0 35px rgba(249, 115, 22, 0.18);
          }

          50% {
            transform: scale(1.04);
            box-shadow:
              0 0 0 10px rgba(249, 115, 22, 0),
              0 0 65px rgba(249, 115, 22, 0.35);
          }
        }

        .forge-glow {
          animation:
            forgeGlow
            3.5s
            ease-in-out
            infinite;
        }

        .forge-heat {
          animation:
            heatPulse
            4s
            ease-in-out
            infinite;
        }

        .forge-hazard {
          animation:
            hazardMove
            5s
            linear
            infinite;
        }

        .forge-final-boss {
          animation:
            bossPulse
            2.2s
            ease-in-out
            infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .forge-glow,
          .forge-heat,
          .forge-hazard,
          .forge-final-boss {
            animation: none !important;
          }
        }

      `}</style>

      {/* =====================================================
          PAGE
      ===================================================== */}

      <div className="relative min-h-screen overflow-x-hidden bg-[#080706] text-white">

        {/* ===================================================
            BACKGROUND

            Fire-burning effect removed.
            Ambient glow + grid + industrial stripes retained.
        =================================================== */}

        <div className="pointer-events-none fixed inset-0 overflow-hidden">

          {/* Ambient left glow */}

          <div className="absolute left-[-15%] top-[30%] h-[700px] w-[700px] rounded-full bg-red-950/15 blur-[220px]" />

          {/* Ambient right glow */}

          <div className="absolute right-[-15%] top-[35%] h-[650px] w-[650px] rounded-full bg-orange-950/15 blur-[220px]" />

          {/* Bottom ambient glow */}

          <div className="absolute bottom-[-300px] left-[5%] h-[800px] w-[800px] rounded-full bg-orange-900/10 blur-[220px]" />

          <div className="absolute bottom-[-300px] right-[5%] h-[800px] w-[800px] rounded-full bg-red-950/10 blur-[220px]" />

          {/* Soft atmospheric glow */}

          <div className="forge-heat absolute bottom-0 left-[5%] h-[45%] w-[35%] rounded-full bg-orange-600/5 blur-[120px]" />

          <div className="forge-heat absolute bottom-0 right-[5%] h-[40%] w-[30%] rounded-full bg-red-600/5 blur-[120px]" />

          <div className="forge-glow absolute bottom-0 left-1/2 h-[40%] w-[55%] -translate-x-1/2 rounded-full bg-orange-500/5 blur-[110px]" />

          {/* Grid */}

          <div
            className="absolute inset-0 opacity-[0.045]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(255,255,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "45px 45px",
            }}
          />

          {/* Industrial diagonal stripes */}

          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, #f97316 0px, #f97316 10px, transparent 10px, transparent 26px)",
            }}
          />

        </div>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <header className="sticky top-0 z-50 border-b border-orange-950/60 bg-[#0b0908]/95 backdrop-blur-xl">

          <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-3 sm:px-6 lg:px-8">

            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-2 sm:gap-3">

              <button
                onClick={handleBack}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-zinc-800 bg-[#11100f] text-zinc-500 transition hover:border-orange-600/60 hover:bg-orange-950/30 hover:text-orange-400"
                title="Back to Challenge Arena"
              >
                <ArrowLeft size={17} />
              </button>

              <div className="h-6 w-px shrink-0 bg-zinc-800" />

              <div className="flex min-w-0 items-center gap-2 sm:gap-3">

                <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-orange-700/50 bg-gradient-to-br from-orange-700 to-red-900 shadow-lg shadow-orange-950/50">

                  <Database size={17} />

                  <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-orange-400 shadow-lg shadow-orange-400/70" />

                </div>

                <div className="min-w-0">

                  <h1 className="text-sm font-black sm:text-base">
                    SQL
                    <span className="text-orange-500">
                      Forge
                    </span>
                  </h1>

                  <p className="truncate text-[7px] font-bold uppercase tracking-[0.18em] text-zinc-700 sm:text-[8px] sm:tracking-[0.25em]">
                    Advanced Combat Zone
                  </p>

                </div>

              </div>

            </div>

            {/* RIGHT */}

            <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">

              <div className="hidden items-center gap-2 rounded-lg border border-zinc-800 bg-[#11100f] px-3 py-2 sm:flex">

                <Zap
                  size={13}
                  className="text-amber-500"
                />

                <span className="text-xs font-black text-zinc-500">
                  {progress.xp || 0} XP
                </span>

              </div>

              <div className="flex items-center gap-1.5 rounded-lg border border-orange-950/60 bg-orange-950/10 px-2.5 py-2 sm:gap-2 sm:px-3">

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

        {/* =====================================================
            MAIN
        ===================================================== */}

        <main className="relative z-10 mx-auto max-w-[1400px] px-3 py-6 sm:px-6 sm:py-8 lg:px-8">

          {/* ===================================================
              HERO
          =================================================== */}

          <section className="mx-auto max-w-3xl text-center">

            <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-lg border border-orange-800/50 bg-orange-950/20 px-3 py-2 shadow-lg shadow-orange-950/20 sm:px-4">

              <Shield
                size={13}
                className="text-orange-500"
              />

              <span className="text-[8px] font-black uppercase tracking-[0.18em] text-orange-500 sm:text-[9px] sm:tracking-[0.25em]">
                ELITE SQL // COMBAT MODE
              </span>

            </div>

            <h2 className="text-3xl font-black uppercase tracking-tight sm:text-5xl">

              ADVANCED

              <span className="text-orange-500">
                {" "}LEVELS
              </span>

            </h2>

            <p className="mx-auto mt-3 max-w-xl text-xs leading-5 text-zinc-600 sm:text-sm sm:leading-6">

              No shortcuts. No easy routes.

              <br />

              Subqueries, correlated logic, EXISTS,
              advanced aggregation and brutal
              multi-table problems await.

            </p>

          </section>

          {/* ===================================================
              PROGRESS
          =================================================== */}

          <section className="mx-auto mt-6 max-w-3xl sm:mt-7">

            <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#10100f]/95 p-3 shadow-xl shadow-black/50 sm:p-4">

              <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-red-950 via-orange-600 to-amber-400" />

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-[7px] font-black uppercase tracking-[0.2em] text-zinc-700 sm:text-[8px]">
                    Combat Progress
                  </p>

                  <p className="mt-1 text-sm font-black text-zinc-300">

                    {completedCount}

                    <span className="text-zinc-700">
                      {" "}/ 50 Levels
                    </span>

                  </p>

                </div>

                <div className="text-right">

                  <p className="text-[9px] font-black text-orange-500">
                    {Math.round(progressPercentage)}%
                  </p>

                </div>

              </div>

              <div className="mt-3 h-2 overflow-hidden rounded-sm border border-zinc-800 bg-black">

                <div
                  className="h-full bg-gradient-to-r from-red-950 via-orange-700 to-amber-400 transition-all duration-700"
                  style={{
                    width: `${progressPercentage}%`,
                  }}
                />

              </div>

            </div>

          </section>

          {/* ===================================================
              MAP
          =================================================== */}

          <section className="relative mx-auto mt-6 w-full max-w-[1200px] sm:mt-8">

            <div
              className={`
                relative
                w-full
                overflow-hidden
                rounded-[1.25rem]
                border border-zinc-800
                bg-[#0d0c0b]/90
                shadow-2xl shadow-black/70

                ${
                  isMobile
                    ? "min-h-[1850px]"
                    : "min-h-[1500px] sm:min-h-[1700px] lg:min-h-[1800px]"
                }
              `}
            >

              {/* =================================================
                  MAP AMBIENT GLOW
              ================================================= */}

              <div className="pointer-events-none absolute inset-0">

                <div className="forge-glow absolute bottom-[5%] left-[5%] h-[500px] w-[500px] rounded-full bg-orange-700/10 blur-[140px]" />

                <div className="forge-heat absolute bottom-[10%] right-[5%] h-[450px] w-[450px] rounded-full bg-red-700/10 blur-[140px]" />

                <div className="forge-glow absolute left-[35%] top-[45%] h-[350px] w-[350px] rounded-full bg-orange-600/5 blur-[130px]" />

              </div>

              {/* =================================================
                  MAP GRID
              ================================================= */}

              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
                  backgroundSize: isMobile
                    ? "35px 35px"
                    : "50px 50px",
                }}
              />

              {/* =================================================
                  DIAGONAL STRIPES
              ================================================= */}

              <div
                className="forge-hazard pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(135deg, #f97316 0px, #f97316 10px, transparent 10px, transparent 24px)",
                }}
              />

              {/* =================================================
                  MAP TITLE
              ================================================= */}

              <div className="absolute left-1/2 top-5 z-20 -translate-x-1/2 sm:top-8">

                <div className="inline-flex items-center gap-2 rounded-md border border-orange-800/50 bg-black/80 px-3 py-1.5 shadow-lg shadow-orange-950/20 backdrop-blur sm:px-4 sm:py-2">

                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-500 shadow-lg shadow-orange-500/60 sm:h-2 sm:w-2" />

                  <span className="whitespace-nowrap text-[7px] font-black uppercase tracking-[0.18em] text-orange-500 sm:text-[9px] sm:tracking-[0.25em]">
                    Advanced Progression
                  </span>

                </div>

              </div>

              {/* =================================================
                  ELITE COUNTER
              ================================================= */}

              {!isMobile && (
                <div className="absolute right-5 top-5 z-20 rounded-md border border-zinc-800 bg-black/70 px-3 py-2 backdrop-blur">

                  <div className="flex items-center gap-2">

                    <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />

                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">
                      50 Elite Levels
                    </span>

                  </div>

                </div>
              )}

              {/* =================================================
                  CONNECTION PATH
              ================================================= */}

              <svg
                className="pointer-events-none absolute inset-0 h-full w-full"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
              >

                <defs>

                  <marker
                    id="advanced-arrowhead"
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

                  <filter id="advanced-glow">

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
                    (
                      position,
                      index
                    ) => {

                      const next =
                        LEVEL_POSITIONS[
                          index + 1
                        ];

                      const currentLevel =
                        index + 1;

                      const pathCompleted =
                        completedLevels.has(
                          currentLevel
                        );

                      return (
                        <line
                          key={`advanced-line-${currentLevel}`}
                          x1={`${position.x}%`}
                          y1={`${position.y}%`}
                          x2={`${next.x}%`}
                          y2={`${next.y}%`}
                          stroke={
                            pathCompleted
                              ? "#f97316"
                              : "#3f3f46"
                          }
                          strokeWidth={
                            isMobile
                              ? pathCompleted
                                ? "0.65"
                                : "0.38"
                              : pathCompleted
                              ? "0.5"
                              : "0.28"
                          }
                          strokeDasharray={
                            isMobile
                              ? "1.6 1.2"
                              : "1.3 1"
                          }
                          strokeLinecap="round"
                          markerEnd={
                            pathCompleted
                              ? "url(#advanced-arrowhead)"
                              : undefined
                          }
                          filter={
                            pathCompleted
                              ? "url(#advanced-glow)"
                              : undefined
                          }
                          opacity={
                            pathCompleted
                              ? 0.95
                              : 0.35
                          }
                        />
                      );
                    }
                  )}

              </svg>

              {/* =================================================
                  LEVEL NODES
              ================================================= */}

              {Array.from({
                length: TOTAL_LEVELS,
              }).map((_, index) => {

                const level = index + 1;

                const position =
                  LEVEL_POSITIONS[index];

                const completed =
                  completedLevels.has(level);

                /*
                  All advanced levels are currently unlocked.
                */

                const unlocked = true;

                const current =
                  level === nextLevel &&
                  !completed;

                /*
                  ONLY LEVEL 50 IS FINAL BOSS
                */

                const finalBoss =
                  level === 50;

                return (
                  <button
                    key={level}
                    type="button"
                    disabled={!unlocked}
                    onClick={() =>
                      handleLevelClick(level)
                    }
                    title={
                      finalBoss
                        ? "LEVEL 50 — SQLFORGE FINAL BOSS"
                        : `Level ${level}: ${LEVEL_TITLES[index]}`
                    }
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                    style={{
                      left: `${position.x}%`,
                      top: `${position.y}%`,
                    }}
                  >

                    {/* =========================================
                        CURRENT LEVEL EFFECT
                    ========================================= */}

                    {current &&
                      !finalBoss && (
                        <>
                          <span className="absolute -inset-5 animate-ping rounded-full bg-orange-500/10 sm:-inset-6" />

                          <span className="absolute -inset-4 rounded-full border border-orange-500/30 animate-pulse" />

                          <span className="absolute -inset-2 rounded-full bg-orange-500/10 blur-md" />
                        </>
                      )}

                    {/* =========================================
                        FINAL BOSS EFFECT
                    ========================================= */}



                    {/* =========================================
                        NODE
                    ========================================= */}

                    <div
                      className={`
                        relative flex items-center justify-center rounded-full
                        border-[3px]
                        transition-all duration-300

                        ${
                          isMobile
                            ? "h-12 w-12"
                            : "h-16 w-16 sm:h-[72px] sm:w-[72px] lg:h-[78px] lg:w-[78px]"
                        }

                        ${
                          finalBoss
                            ? completed
                              ? "border-emerald-400 bg-gradient-to-br from-emerald-500 via-emerald-700 to-emerald-950 shadow-xl shadow-emerald-500/40 hover:scale-110"
                              : "forge-final-boss border-orange-300 bg-gradient-to-br from-orange-700 via-red-900 to-black shadow-2xl shadow-orange-700/60 hover:border-amber-300 hover:shadow-orange-600/80"
                            : completed
                            ? "border-emerald-400 bg-gradient-to-br from-emerald-500 via-emerald-700 to-emerald-950 shadow-xl shadow-emerald-500/40 hover:scale-110"
                            : current
                            ? "scale-110 border-orange-300 bg-gradient-to-br from-orange-500 via-orange-700 to-black shadow-2xl shadow-orange-600/50 hover:scale-[1.17]"
                            : "border-zinc-700 bg-gradient-to-br from-zinc-800 via-zinc-900 to-black shadow-lg shadow-black/70 hover:scale-110 hover:border-orange-500 hover:shadow-orange-900/40"
                        }
                      `}
                    >

                      <div className="absolute inset-0 rounded-full border border-white/5" />

                      <div className="absolute inset-1 rounded-full border border-orange-400/10" />

                      <div className="absolute inset-2 rounded-full bg-white/[0.02]" />

                      {/* ICON */}

                      {finalBoss &&
                      !completed ? (
                        <Skull
                          size={
                            isMobile
                              ? 20
                              : 29
                          }
                          strokeWidth={2.5}
                          className="relative z-10 text-orange-300"
                        />
                      ) : completed ? (
                        <Check
                          size={
                            isMobile
                              ? 19
                              : 27
                          }
                          strokeWidth={3}
                          className="relative z-10 text-white"
                        />
                      ) : current ? (
                        <Play
                          size={
                            isMobile
                              ? 18
                              : 25
                          }
                          fill="currentColor"
                          className="relative z-10 ml-0.5 text-white sm:ml-1"
                        />
                      ) : (
                        <span
                          className={`
                            relative z-10 font-black text-white

                            ${
                              isMobile
                                ? "text-sm"
                                : "text-lg sm:text-xl"
                            }
                          `}
                        >
                          {level}
                        </span>
                      )}

                    </div>

                    {/* =========================================
                        LEVEL LABEL
                    ========================================= */}

                    <div
                      className={`
                        absolute
                        left-1/2
                        top-full
                        mt-1
                        -translate-x-1/2

                        rounded-md
                        border

                        ${
                          isMobile
                            ? "w-[78px] px-1.5 py-1"
                            : "w-auto whitespace-nowrap px-2.5 py-1"
                        }

                        ${
                          finalBoss
                            ? "border-orange-500/70 bg-orange-950/95 text-orange-300 shadow-lg shadow-orange-950/50"
                            : completed
                            ? "border-emerald-700/50 bg-emerald-950/70 text-emerald-300"
                            : current
                            ? "border-orange-500/60 bg-orange-950/90 text-orange-200 shadow-lg shadow-orange-950/40"
                            : "border-zinc-800 bg-black/90 text-zinc-500"
                        }
                      `}
                    >

                      <p
                        className={`
                          font-black uppercase tracking-wider

                          ${
                            isMobile
                              ? "truncate text-[6px]"
                              : "text-[8px]"
                          }
                        `}
                      >
                        {finalBoss
                          ? "FINAL BOSS • LEVEL 50"
                          : `LEVEL ${level}`}
                      </p>

                      <p
                        className={`
                          mt-0.5 truncate font-bold

                          ${
                            isMobile
                              ? "text-[5.5px]"
                              : "max-w-[135px] text-[7px]"
                          }

                          ${
                            finalBoss
                              ? "text-orange-500"
                              : "text-zinc-700"
                          }
                        `}
                      >
                        {finalBoss
                          ? "SQLForge Final Boss"
                          : LEVEL_TITLES[index]}
                      </p>

                    </div>

                  </button>
                );
              })}

              {/* =================================================
                  MOBILE INDICATOR
              ================================================= */}

              {isMobile && (
                <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2">

                  <div className="rounded-md border border-orange-900/40 bg-black/70 px-3 py-1.5 text-center backdrop-blur">

                    <p className="text-[6px] font-black uppercase tracking-[0.2em] text-orange-700">
                      50 LEVEL ELITE RUN
                    </p>

                  </div>

                </div>
              )}

            </div>

          </section>

          {/* ===================================================
              LEGEND
          =================================================== */}

          <section className="mx-auto mt-6 max-w-3xl sm:mt-7">

            <div className="grid grid-cols-3 gap-1.5 sm:gap-2">

              {/* COMPLETED */}

              <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-[#10100f]/95 p-2.5 sm:p-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-700">

                  <Check
                    size={14}
                    strokeWidth={3}
                  />

                </div>

                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600 sm:text-[8px]">
                  Completed
                </span>

              </div>

              {/* CURRENT */}

              <div className="flex flex-col items-center gap-2 rounded-lg border border-zinc-800 bg-[#10100f]/95 p-2.5 sm:p-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-300 bg-orange-700">

                  <Play
                    size={12}
                    fill="currentColor"
                  />

                </div>

                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600 sm:text-[8px]">
                  Current
                </span>

              </div>

              {/* FINAL BOSS */}

              <div className="flex flex-col items-center gap-2 rounded-lg border border-orange-900/40 bg-[#120b05]/95 p-2.5 sm:p-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-orange-400 bg-orange-900 shadow-lg shadow-orange-900/40">

                  <Skull size={14} />

                </div>

                <span className="text-[7px] font-black uppercase tracking-widest text-orange-700 sm:text-[8px]">
                  Final Boss
                </span>

              </div>

            </div>

          </section>


        

          {/* ===================================================
              CONTINUE
          =================================================== */}

          {completedCount < TOTAL_LEVELS && (
            <section className="mx-auto mt-5 w-full max-w-[560px] sm:mt-6">

              <button
                type="button"
                onClick={handleContinue}
                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-orange-700/60 bg-gradient-to-r from-red-950 via-orange-800 to-amber-700 px-5 py-4 text-xs font-black shadow-xl shadow-orange-950/50 transition hover:-translate-y-0.5 hover:border-orange-400 hover:shadow-orange-900/70 sm:gap-3 sm:px-6"
              >

                {/* Animated industrial stripe */}

                <div
                  className="forge-hazard absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(135deg, white 0px, white 6px, transparent 6px, transparent 14px)",
                  }}
                />

                <Play
                  size={15}
                  fill="currentColor"
                  className="relative z-10"
                />

                <span className="relative z-10">
                  CONTINUE LEVEL {nextLevel}
                </span>

                <ArrowRight
                  size={15}
                  className="relative z-10 transition-transform group-hover:translate-x-1"
                />

              </button>

            </section>
          )}

          {/* ===================================================
              COMPLETE
          =================================================== */}

          {completedCount >= TOTAL_LEVELS && (
            <section className="mx-auto mt-6 max-w-md">

              <div className="relative overflow-hidden rounded-xl border border-emerald-800/50 bg-emerald-950/30 p-5 text-center shadow-xl shadow-emerald-950/20">

                <div className="absolute inset-0 opacity-[0.025]">
                  <div
                    className="forge-hazard absolute inset-0"
                    style={{
                      backgroundImage:
                        "repeating-linear-gradient(135deg, #34d399 0px, #34d399 8px, transparent 8px, transparent 20px)",
                    }}
                  />
                </div>

                <div className="relative z-10">

                  <Trophy
                    size={26}
                    className="mx-auto text-emerald-400"
                  />

                  <p className="mt-3 text-sm font-black text-emerald-300">
                    ADVANCED STAGE COMPLETE
                  </p>

                  <p className="mt-1 text-[9px] uppercase tracking-widest text-emerald-700">
                    All 50 advanced levels mastered
                  </p>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest text-emerald-600">
                    <Check size={12} />
                    SQLForge Elite Status
                  </div>

                </div>

              </div>

            </section>
          )}

          {/* ===================================================
              FOOTER
          =================================================== */}

          <footer className="mx-auto mt-8 max-w-6xl border-t border-zinc-900 pt-5 sm:mt-10 sm:pt-6">

            <div className="flex flex-col items-center justify-between gap-2 text-[7px] font-bold uppercase tracking-widest text-zinc-800 sm:flex-row sm:text-[8px]">

              <span>
                SQLForge Challenge Arena
              </span>

              <span className="text-orange-950">
                Advanced • 50 Challenges • Elite Combat Mode
              </span>

            </div>

          </footer>

        </main>

      </div>
    </>
  );
}

export default AdvancedLevels;