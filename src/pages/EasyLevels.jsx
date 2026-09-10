import {
  ArrowLeft,
  ArrowRight,
  Check,
  Database,
  Flame,
  Play,
  Trophy,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_LEVELS = 50;

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
// LEVEL POSITIONS
//
// 50 levels arranged as a clean 5-column × 10-row
// serpentine game map.
//
// This prevents nodes and labels from overlapping.
// ------------------------------------------------------------

const LEVEL_POSITIONS = [
  // ROW 1
  { x: 10, y: 7 },   // 1
  { x: 30, y: 7 },   // 2
  { x: 50, y: 7 },   // 3
  { x: 70, y: 7 },   // 4
  { x: 90, y: 7 },   // 5

  // ROW 2 → reverse direction
  { x: 90, y: 17 },  // 6
  { x: 70, y: 17 },  // 7
  { x: 50, y: 17 },  // 8
  { x: 30, y: 17 },  // 9
  { x: 10, y: 17 },  // 10

  // ROW 3
  { x: 10, y: 27 },  // 11
  { x: 30, y: 27 },  // 12
  { x: 50, y: 27 },  // 13
  { x: 70, y: 27 },  // 14
  { x: 90, y: 27 },  // 15

  // ROW 4
  { x: 90, y: 37 },  // 16
  { x: 70, y: 37 },  // 17
  { x: 50, y: 37 },  // 18
  { x: 30, y: 37 },  // 19
  { x: 10, y: 37 },  // 20

  // ROW 5
  { x: 10, y: 47 },  // 21
  { x: 30, y: 47 },  // 22
  { x: 50, y: 47 },  // 23
  { x: 70, y: 47 },  // 24
  { x: 90, y: 47 },  // 25

  // ROW 6
  { x: 90, y: 57 },  // 26
  { x: 70, y: 57 },  // 27
  { x: 50, y: 57 },  // 28
  { x: 30, y: 57 },  // 29
  { x: 10, y: 57 },  // 30

  // ROW 7
  { x: 10, y: 67 },  // 31
  { x: 30, y: 67 },  // 32
  { x: 50, y: 67 },  // 33
  { x: 70, y: 67 },  // 34
  { x: 90, y: 67 },  // 35

  // ROW 8
  { x: 90, y: 77 },  // 36
  { x: 70, y: 77 },  // 37
  { x: 50, y: 77 },  // 38
  { x: 30, y: 77 },  // 39
  { x: 10, y: 77 },  // 40

  // ROW 9
  { x: 10, y: 87 },  // 41
  { x: 30, y: 87 },  // 42
  { x: 50, y: 87 },  // 43
  { x: 70, y: 87 },  // 44
  { x: 90, y: 87 },  // 45

  // ROW 10
  { x: 90, y: 96 },  // 46
  { x: 70, y: 96 },  // 47
  { x: 50, y: 96 },  // 48
  { x: 30, y: 96 },  // 49
  { x: 10, y: 96 },  // 50
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
// COMPONENT
// ------------------------------------------------------------

function EasyLevels() {
  const navigate = useNavigate();

const [progress, setProgress] = useState(
  DEFAULT_PROGRESS
);
  // ----------------------------------------------------------
  // REFRESH PROGRESS
  // ----------------------------------------------------------

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
        "http://localhost:5000/api/progress",
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
}, [progress]);

// ----------------------------------------------------------
// NUMBER OF COMPLETED LEVELS
// ----------------------------------------------------------

const completedCount =
  completedLevels.size;

// ----------------------------------------------------------
// NEXT LEVEL
// Find the first level that is NOT completed.
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
  // ----------------------------------------------------------
  // LEVEL CLICK
  //
  // ALL 50 LEVELS ARE UNLOCKED.
  // ----------------------------------------------------------

  const handleLevelClick = (level) => {
    navigate(`/challenge/${level}`);
  };

  // ----------------------------------------------------------
  // BACK
  // ----------------------------------------------------------

  const handleBack = () => {
    navigate("/challenge-levels");
  };

  // ----------------------------------------------------------
  // PROGRESS
  // ----------------------------------------------------------

  const progressPercentage =
    (completedCount / TOTAL_LEVELS) * 100;

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#07020b] text-white">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-[15%] top-[-200px] h-[500px] w-[500px] rounded-full bg-fuchsia-900/20 blur-[180px]" />

        <div className="absolute right-[-150px] top-[25%] h-[500px] w-[500px] rounded-full bg-purple-900/20 blur-[180px]" />

        <div className="absolute bottom-[-200px] left-[30%] h-[500px] w-[500px] rounded-full bg-pink-900/10 blur-[180px]" />

      </div>

      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-fuchsia-950/40 bg-[#09030d]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-fuchsia-950/50 bg-black/30 text-zinc-500 transition hover:border-fuchsia-600/50 hover:bg-fuchsia-950/20 hover:text-fuchsia-400"
              title="Back to Challenge Arena"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-6 w-px bg-fuchsia-950/40" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-700 shadow-lg shadow-fuchsia-950/40">

                <Database size={17} />

              </div>

              <div>

                <h1 className="text-sm font-black sm:text-base">

                  SQL
                  <span className="text-fuchsia-500">
                    Forge
                  </span>

                </h1>

                <p className="text-[8px] font-bold uppercase tracking-[0.25em] text-zinc-700">

                  Easy Challenge Map

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

            <div className="flex items-center gap-2 rounded-xl border border-red-950/50 bg-red-950/10 px-3 py-2">

              <Flame
                size={13}
                className="text-red-500"
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
      ====================================================== */}

      <main className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {/* ===================================================
            TITLE
        ==================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-fuchsia-900/40 bg-fuchsia-950/20 px-4 py-2">

            <Trophy
              size={13}
              className="text-fuchsia-400"
            />

            <span className="text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-400">

              Foundation Path

            </span>

          </div>

          <h2 className="text-4xl font-black tracking-tight sm:text-5xl">

            EASY
            <span className="text-fuchsia-500">
              {" "}LEVELS
            </span>

          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">

            Explore all 50 SQL challenges.
            Every level is unlocked — solve them
            in any order and build your SQL mastery.

          </p>

        </section>

        {/* ===================================================
            PROGRESS BAR
        ==================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="rounded-2xl border border-fuchsia-950/40 bg-[#0b050f] p-4 shadow-xl shadow-fuchsia-950/5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">

                  Easy Progress

                </p>

                <p className="mt-1 text-sm font-black text-zinc-300">

                  {completedCount}

                  <span className="text-zinc-700">
                    {" "}/ 50 Levels
                  </span>

                </p>

              </div>

              <div className="text-right">

                <p className="text-[9px] font-black text-fuchsia-500">

                  {Math.round(
                    progressPercentage
                  )}
                  %

                </p>

              </div>

            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black">

              <div
                className="h-full rounded-full bg-gradient-to-r from-fuchsia-700 via-pink-500 to-fuchsia-400 transition-all duration-700"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* ===================================================
            GAME MAP
        ==================================================== */}

        <section className="relative mx-auto mt-8 max-w-[1200px]">

          <div className="relative min-h-[1500px] overflow-hidden rounded-[2rem] border border-fuchsia-950/40 bg-[#100415] shadow-2xl shadow-fuchsia-950/10 sm:min-h-[1700px] lg:min-h-[1800px]">

            {/* =================================================
                BACKGROUND GRID
            ================================================== */}

            <div
              className="pointer-events-none absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
                backgroundSize:
                  "60px 60px",
              }}
            />

            {/* =================================================
                STARS
            ================================================== */}

            <div className="pointer-events-none absolute inset-0">

              {Array.from({
                length: 70,
              }).map((_, index) => {

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
                    }}
                  />
                );
              })}

            </div>

            {/* =================================================
                SVG PATH
            ================================================== */}

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              <defs>

                <marker
                  id="arrowhead"
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

                <filter id="glow">
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

              {/* ---------------------------------------------
                  PATH BETWEEN ALL LEVELS
              ---------------------------------------------- */}

              {LEVEL_POSITIONS
                .slice(0, TOTAL_LEVELS - 1)
                .map((position, index) => {

                  const next =
                    LEVEL_POSITIONS[index + 1];

                  const currentLevel =
                    index + 1;

                  /*
                   * Path becomes highlighted when the
                   * current level has been completed.
                   */

                  const pathCompleted =
                    completedLevels.has(
                      currentLevel
                    );

                  return (
                    <line
                      key={`line-${currentLevel}`}
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
                          ? "url(#arrowhead)"
                          : undefined
                      }
                      filter={
                        pathCompleted
                          ? "url(#glow)"
                          : undefined
                      }
                      opacity={
                        pathCompleted
                          ? 0.95
                          : 0.35
                      }
                      className="transition-all duration-700"
                    />
                  );
                })}

            </svg>

            {/* =================================================
                LEVEL NODES
            ================================================== */}

            {Array.from({
              length: TOTAL_LEVELS,
            }).map((_, index) => {

              const level = index + 1;

              const position =
                LEVEL_POSITIONS[index];

              const completed =
                completedLevels.has(level);

              /*
               * ALL LEVELS ARE UNLOCKED.
               */

              const unlocked = true;

              /*
               * Current = first incomplete level.
               */

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
                  title={`Level ${level}: ${
                    LEVEL_TITLES[index]
                  }`}
                  className="absolute z-10 -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  style={{
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                  }}
                >

                  {/* =================================================
                      CURRENT GLOW
                  ================================================== */}

                  {current && (
                    <>
                      <span className="absolute -inset-5 animate-ping rounded-full bg-fuchsia-500/10" />

                      <span className="absolute -inset-3 rounded-full border border-fuchsia-400/30 animate-pulse" />
                    </>
                  )}

                  {/* =================================================
                      NODE
                  ================================================== */}

                  <div
                    className={`
                      relative flex h-16 w-16 items-center justify-center rounded-full
                      border-[3px]
                      transition-all duration-300
                      sm:h-[72px] sm:w-[72px]
                      lg:h-[78px] lg:w-[78px]

                     ${
  completed
    ? "border-emerald-400 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 shadow-xl shadow-emerald-500/40 hover:scale-110"
    : current
    ? "scale-110 border-fuchsia-300 bg-gradient-to-br from-fuchsia-600 via-purple-800 to-fuchsia-950 shadow-2xl shadow-fuchsia-600/50 hover:scale-[1.17]"
    : "border-fuchsia-600 bg-gradient-to-br from-fuchsia-800 via-purple-900 to-[#1a061d] shadow-lg shadow-fuchsia-900/30 hover:scale-110 hover:border-fuchsia-300 hover:shadow-fuchsia-700/50"
}
                    `}
                  >

                    {/* INNER RING */}

                    <div
                      className="
                        absolute inset-1 rounded-full
                        border border-fuchsia-300/30
                      "
                    />

                    {/* EXTRA INNER GLOW */}

                    <div className="absolute inset-2 rounded-full bg-fuchsia-400/5" />

                    {/* =================================================
                        ICON / NUMBER
                    ================================================== */}

                    {completed ? (
                      <Check
                        size={27}
                        strokeWidth={3}
                        className="relative z-10 text-white"
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

                  </div>

                  {/* =================================================
                      LEVEL LABEL
                  ================================================== */}

                  <div
                    className={`
                      absolute left-1/2 top-full mt-2
                      -translate-x-1/2 whitespace-nowrap
                      rounded-lg border px-2.5 py-1
                      transition-all duration-300

                      ${
  completed
    ? "border-emerald-700/50 bg-emerald-950/70 text-emerald-300"
    : current
    ? "border-fuchsia-500/60 bg-fuchsia-950/80 text-fuchsia-200 shadow-lg shadow-fuchsia-950/30"
    : "border-zinc-800 bg-black/70 text-zinc-400"
}
                    `}
                  >

                    <p className="text-[8px] font-black uppercase tracking-wider">

                      Level {level}

                    </p>

                    <p className="mt-0.5 max-w-[110px] truncate text-[7px] font-bold text-zinc-600">

                      {LEVEL_TITLES[index]}

                    </p>

                  </div>

                </button>
              );
            })}

            {/* =================================================
                MAP TOP LABEL
            ================================================== */}

            <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-fuchsia-800/40 bg-black/40 px-4 py-2 backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-fuchsia-500" />

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-fuchsia-400">

                  SQL Journey

                </span>

              </div>

            </div>

            {/* =================================================
                ALL LEVELS UNLOCKED BADGE
            ================================================== */}

            <div className="absolute right-5 top-5 hidden rounded-xl border border-fuchsia-900/40 bg-black/40 px-3 py-2 backdrop-blur sm:block">

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />

                <span className="text-[8px] font-black uppercase tracking-widest text-zinc-500">

                  50 Levels Unlocked

                </span>

              </div>

            </div>

            {/* =================================================
                COMPLETION
            ================================================== */}

            {completedCount >= TOTAL_LEVELS && (
              <div className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2">

                <div className="flex items-center gap-3 rounded-2xl border border-green-800/50 bg-green-950/50 px-5 py-3 shadow-2xl backdrop-blur-xl">

                  <Trophy
                    size={18}
                    className="text-green-400"
                  />

                  <div>

                    <p className="text-xs font-black text-green-300">

                      EASY STAGE COMPLETE

                    </p>

                    <p className="text-[9px] text-green-700">

                      All 50 levels mastered

                    </p>

                  </div>

                </div>

              </div>
            )}

          </div>

        </section>

        {/* ===================================================
            LEGEND
        ==================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="grid grid-cols-3 gap-2">

            {/* COMPLETED */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0b050f] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-600">

                <Check
                  size={14}
                  strokeWidth={3}
                />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">

                Completed

              </span>

            </div>

            {/* CURRENT */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0b050f] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-300 bg-fuchsia-800">

                <Play
                  size={12}
                  fill="currentColor"
                />

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">

                Next

              </span>

            </div>

            {/* AVAILABLE */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#0b050f] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-fuchsia-600 bg-purple-900">

                <span className="text-[10px] font-black">
                  50
                </span>

              </div>

              <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">

                Available

              </span>

            </div>

          </div>

        </section>

        {/* ===================================================
            CONTINUE BUTTON
        ==================================================== */}

        {completedCount < TOTAL_LEVELS && (
          <section className="mx-auto mt-6 max-w-md">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/challenge/${nextLevel}`
                )
              }
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-fuchsia-600/50 bg-gradient-to-r from-fuchsia-800 to-purple-800 px-6 py-4 text-xs font-black shadow-xl shadow-fuchsia-950/30 transition hover:-translate-y-0.5 hover:border-fuchsia-400 hover:shadow-fuchsia-900/40"
            >

              <Play
                size={15}
                fill="currentColor"
              />

              CONTINUE LEVEL {nextLevel}

              <ArrowRight
                size={15}
                className="transition-transform group-hover:translate-x-1"
              />

            </button>

          </section>
        )}

        {/* ===================================================
            FOOTER
        ==================================================== */}

        <footer className="mx-auto mt-10 max-w-6xl border-t border-fuchsia-950/30 pt-6">

          <div className="flex flex-col items-center justify-between gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-800 sm:flex-row">

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