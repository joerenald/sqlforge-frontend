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
// 5 columns × 10 rows
// Serpentine challenge path
// ============================================================

const LEVEL_POSITIONS = [
  // ROW 1
  { x: 10, y: 7 },
  { x: 30, y: 7 },
  { x: 50, y: 7 },
  { x: 70, y: 7 },
  { x: 90, y: 7 },

  // ROW 2
  { x: 90, y: 17 },
  { x: 70, y: 17 },
  { x: 50, y: 17 },
  { x: 30, y: 17 },
  { x: 10, y: 17 },

  // ROW 3
  { x: 10, y: 27 },
  { x: 30, y: 27 },
  { x: 50, y: 27 },
  { x: 70, y: 27 },
  { x: 90, y: 27 },

  // ROW 4
  { x: 90, y: 37 },
  { x: 70, y: 37 },
  { x: 50, y: 37 },
  { x: 30, y: 37 },
  { x: 10, y: 37 },

  // ROW 5
  { x: 10, y: 47 },
  { x: 30, y: 47 },
  { x: 50, y: 47 },
  { x: 70, y: 47 },
  { x: 90, y: 47 },

  // ROW 6
  { x: 90, y: 57 },
  { x: 70, y: 57 },
  { x: 50, y: 57 },
  { x: 30, y: 57 },
  { x: 10, y: 57 },

  // ROW 7
  { x: 10, y: 67 },
  { x: 30, y: 67 },
  { x: 50, y: 67 },
  { x: 70, y: 67 },
  { x: 90, y: 67 },

  // ROW 8
  { x: 90, y: 77 },
  { x: 70, y: 77 },
  { x: 50, y: 77 },
  { x: 30, y: 77 },
  { x: 10, y: 77 },

  // ROW 9
  { x: 10, y: 87 },
  { x: 30, y: 87 },
  { x: 50, y: 87 },
  { x: 70, y: 87 },
  { x: 90, y: 87 },

  // ROW 10
  { x: 90, y: 96 },
  { x: 70, y: 96 },
  { x: 50, y: 96 },
  { x: 30, y: 96 },
  { x: 10, y: 96 },
];

// ============================================================
// MEDIUM LEVEL TITLES
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
// COMPONENT
// ============================================================

function MediumLevels() {
  const navigate = useNavigate();

 const [progress, setProgress] = useState(
  DEFAULT_PROGRESS
);

  // ==========================================================
  // REFRESH PROGRESS
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
  // LEVEL CLICK
  //
  // ALL MEDIUM LEVELS ARE UNLOCKED
  // ==========================================================

  const handleLevelClick = (level) => {
    navigate(`/challenge/medium/${level}`);
  };

  // ==========================================================
  // BACK
  // ==========================================================

  const handleBack = () => {
    navigate("/challenge-levels");
  };

  // ==========================================================
  // PROGRESS
  // ==========================================================

  const progressPercentage =
    (completedCount / TOTAL_LEVELS) * 100;

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#02080d] text-white">

      {/* ====================================================
          BACKGROUND
      ===================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Main cyan glow */}

        <div className="absolute left-[12%] top-[-220px] h-[520px] w-[520px] rounded-full bg-cyan-900/20 blur-[180px]" />

        {/* Blue glow */}

        <div className="absolute right-[-180px] top-[25%] h-[550px] w-[550px] rounded-full bg-blue-900/20 blur-[190px]" />

        {/* Bottom teal glow */}

        <div className="absolute bottom-[-220px] left-[30%] h-[500px] w-[500px] rounded-full bg-teal-900/15 blur-[180px]" />

      </div>

      {/* ====================================================
          HEADER
      ===================================================== */}

      <header className="sticky top-0 z-50 border-b border-cyan-950/40 bg-[#03090e]/90 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              onClick={handleBack}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-950/50 bg-black/30 text-zinc-500 transition hover:border-cyan-600/50 hover:bg-cyan-950/20 hover:text-cyan-400"
              title="Back to Challenge Arena"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-6 w-px bg-cyan-950/40" />

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

      {/* ====================================================
          MAIN
      ===================================================== */}

      <main className="relative mx-auto max-w-[1400px] px-4 py-8 sm:px-6 lg:px-8">

        {/* ==================================================
            TITLE
        =================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-900/40 bg-cyan-950/20 px-4 py-2">

            <Trophy
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
              {" "}LEVELS
            </span>

          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-zinc-600">

            Push beyond the fundamentals.
            Master joins, aggregation, subqueries,
            conditions, and real-world SQL problems.

          </p>

        </section>

        {/* ==================================================
            PROGRESS
        =================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="rounded-2xl border border-cyan-950/40 bg-[#030b11] p-4 shadow-xl shadow-cyan-950/5">

            <div className="flex items-center justify-between">

              <div>

                <p className="text-[8px] font-black uppercase tracking-[0.25em] text-zinc-700">

                  Medium Progress

                </p>

                <p className="mt-1 text-sm font-black text-zinc-300">

                  {completedCount}

                  <span className="text-zinc-700">
                    {" "}/ 50 Levels
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

              </div>

            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black">

              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-700 via-cyan-500 to-sky-400 transition-all duration-700"
                style={{
                  width: `${progressPercentage}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* ==================================================
            GAME MAP
        =================================================== */}

        <section className="relative mx-auto mt-8 max-w-[1200px]">

          <div className="relative min-h-[1500px] overflow-hidden rounded-[2rem] border border-cyan-950/40 bg-[#041018] shadow-2xl shadow-cyan-950/10 sm:min-h-[1700px] lg:min-h-[1800px]">

            {/* =================================================
                GRID
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
                    className="absolute h-1 w-1 rounded-full bg-cyan-300/30"
                    style={{
                      left: `${left}%`,
                      top: `${top}%`,
                    }}
                  />
                );
              })}

            </div>

            {/* =================================================
                PATH
            ================================================== */}

            <svg
              className="pointer-events-none absolute inset-0 h-full w-full"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >

              <defs>

                <marker
                  id="medium-arrowhead"
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

                <filter id="medium-glow">

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
                      key={`medium-line-${currentLevel}`}
                      x1={`${position.x}%`}
                      y1={`${position.y}%`}
                      x2={`${next.x}%`}
                      y2={`${next.y}%`}
                      stroke={
                        pathCompleted
                          ? "#22d3ee"
                          : "#164e63"
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
                          ? "url(#medium-arrowhead)"
                          : undefined
                      }
                      filter={
                        pathCompleted
                          ? "url(#medium-glow)"
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

              const unlocked = true;

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

                  {/* CURRENT GLOW */}

                  {current && (
                    <>
                      <span className="absolute -inset-5 animate-ping rounded-full bg-cyan-400/10" />

                      <span className="absolute -inset-3 rounded-full border border-cyan-300/30 animate-pulse" />
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
                          ? "border-emerald-400 bg-gradient-to-br from-emerald-400 via-emerald-600 to-emerald-950 shadow-xl shadow-emerald-500/40 hover:scale-110"
                          : current
                          ? "scale-110 border-cyan-200 bg-gradient-to-br from-cyan-500 via-cyan-700 to-blue-950 shadow-2xl shadow-cyan-500/50 hover:scale-[1.17]"
                          : "border-cyan-600 bg-gradient-to-br from-cyan-800 via-blue-900 to-[#03151c] shadow-lg shadow-cyan-900/30 hover:scale-110 hover:border-cyan-300 hover:shadow-cyan-700/50"
                      }
                    `}
                  >

                    {/* INNER RING */}

                    <div className="absolute inset-1 rounded-full border border-cyan-200/30" />

                    {/* INNER GLOW */}

                    <div className="absolute inset-2 rounded-full bg-cyan-300/5" />

                    {/* ICON / NUMBER */}

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

                  {/* LEVEL LABEL */}

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
                          ? "border-cyan-500/60 bg-cyan-950/80 text-cyan-200 shadow-lg shadow-cyan-950/30"
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
                MAP LABEL
            ================================================== */}

            <div className="absolute left-1/2 top-8 -translate-x-1/2 text-center">

              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-800/40 bg-black/40 px-4 py-2 backdrop-blur">

                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

                <span className="text-[9px] font-black uppercase tracking-[0.25em] text-cyan-400">

                  Skill Progression

                </span>

              </div>

            </div>

            {/* =================================================
                UNLOCKED BADGE
            ================================================== */}

            <div className="absolute right-5 top-5 hidden rounded-xl border border-cyan-900/40 bg-black/40 px-3 py-2 backdrop-blur sm:block">

              <div className="flex items-center gap-2">

                <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />

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

                <div className="flex items-center gap-3 rounded-2xl border border-emerald-800/50 bg-emerald-950/50 px-5 py-3 shadow-2xl backdrop-blur-xl">

                  <Trophy
                    size={18}
                    className="text-emerald-400"
                  />

                  <div>

                    <p className="text-xs font-black text-emerald-300">

                      MEDIUM STAGE COMPLETE

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

        {/* ==================================================
            LEGEND
        =================================================== */}

        <section className="mx-auto mt-7 max-w-3xl">

          <div className="grid grid-cols-3 gap-2">

            {/* COMPLETED */}

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#030b11] p-3">

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

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#030b11] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-200 bg-cyan-700">

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

            <div className="flex flex-col items-center gap-2 rounded-xl border border-zinc-900 bg-[#030b11] p-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-cyan-600 bg-blue-900">

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

        {/* ==================================================
            CONTINUE
        =================================================== */}

        {completedCount < TOTAL_LEVELS && (
          <section className="mx-auto mt-6 max-w-md">

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/challenge/medium/${nextLevel}`
                )
              }
              className="group flex w-full items-center justify-center gap-3 rounded-2xl border border-cyan-600/50 bg-gradient-to-r from-cyan-800 to-blue-800 px-6 py-4 text-xs font-black shadow-xl shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:border-cyan-300 hover:shadow-cyan-900/40"
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

        {/* ==================================================
            FOOTER
        =================================================== */}

        <footer className="mx-auto mt-10 max-w-6xl border-t border-cyan-950/30 pt-6">

          <div className="flex flex-col items-center justify-between gap-2 text-[8px] font-bold uppercase tracking-widest text-zinc-800 sm:flex-row">

            <span>
              SQLForge Challenge Arena
            </span>

            <span>
              Medium • 50 Challenges • All Unlocked
            </span>

          </div>

        </footer>

      </main>
    </div>
  );
}

export default MediumLevels;