import {
  ArrowLeft,
  ArrowRight,
  Database,
  Flame,
  Lock,
  ShieldCheck,
  Trophy,
  Zap,
} from "lucide-react";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const TOTAL_LEVELS = 50;

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
// COMPONENT
// ============================================================

function ChallengeLevels() {
  const navigate = useNavigate();

const [progress, setProgress] = useState(
  DEFAULT_PROGRESS
);

  // ==========================================================
  // KEEP PROGRESS IN SYNC
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
  // COMPLETED LEVEL COUNTS
  // ==========================================================

  const easyCompleted =
    progress.easy?.completed?.length || 0;

  const mediumCompleted =
    progress.medium?.completed?.length || 0;

  const advancedCompleted =
    progress.advanced?.completed?.length || 0;

  // ==========================================================
  // ALL DIFFICULTIES ARE UNLOCKED
  // ==========================================================

  const easyUnlocked = true;
  const mediumUnlocked = true;
  const advancedUnlocked = true;

  // ==========================================================
  // OPEN DIFFICULTY
  // ==========================================================

  const handleStart = (difficulty) => {
    if (difficulty === "easy") {
      navigate("/challenge-levels/easy");
      return;
    }

    if (difficulty === "medium") {
      navigate("/medium-levels");
      return;
    }

   if (difficulty === "advanced") {
  if (!advancedUnlocked) return;

  navigate("/advanced-levels");
  return;
}
  };

  // ==========================================================
  // DIFFICULTY DATA
  // ==========================================================

  const difficulties = [
    {
      key: "easy",

      name: "Easy",

      label: "FOUNDATION",

      description:
        "Build your SQL foundation with SELECT, WHERE, ORDER BY, filtering, sorting, and basic query operations.",

      levels: "01 — 50",

      completed: easyCompleted,

      unlocked: easyUnlocked,

      icon: ShieldCheck,
    },

    {
      key: "medium",

      name: "Medium",

      label: "INTERMEDIATE",

      description:
        "Level up with JOINs, GROUP BY, aggregation, HAVING, multiple tables, and more complex SQL logic.",

      levels: "51 — 100",

      completed: mediumCompleted,

      unlocked: mediumUnlocked,

      icon: Zap,
    },

    {
      key: "advanced",

      name: "Advanced",

      label: "MASTERY",

      description:
        "Master advanced SQL with subqueries, CTEs, window functions, ranking, optimization, and complex analysis.",

      levels: "101 — 150",

      completed: advancedCompleted,

      unlocked: advancedUnlocked,

      icon: Trophy,
    },
  ];

  // ==========================================================
  // ICON COLORS
  // ==========================================================

  const getIconClasses = (difficulty) => {
    if (difficulty === "easy") {
      return `
        border-green-900/40
        bg-green-950/30
        text-green-500
      `;
    }

    if (difficulty === "medium") {
      return `
        border-yellow-900/40
        bg-yellow-950/30
        text-yellow-500
      `;
    }

    return `
      border-red-900/40
      bg-red-950/30
      text-red-500
    `;
  };

  // ==========================================================
  // PROGRESS COLORS
  // ==========================================================

  const getProgressClasses = (difficulty) => {
    if (difficulty === "easy") {
      return "bg-green-600";
    }

    if (difficulty === "medium") {
      return "bg-yellow-600";
    }

    return "bg-red-600";
  };

  // ==========================================================
  // BUTTON COLORS
  // ==========================================================

  const getButtonClasses = (difficulty) => {
    if (difficulty === "easy") {
      return `
        bg-green-700
        hover:bg-green-600
        shadow-green-950/30
      `;
    }

    if (difficulty === "medium") {
      return `
        bg-yellow-700
        hover:bg-yellow-600
        shadow-yellow-950/20
      `;
    }

    return `
      bg-red-700
      hover:bg-red-600
      shadow-red-950/30
    `;
  };

  // ==========================================================
  // TOTAL PROGRESS
  // ==========================================================

  const totalCompleted =
    easyCompleted +
    mediumCompleted +
    advancedCompleted;

  const overallPercentage = Math.min(
    100,
    (totalCompleted / 150) * 100
  );

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div
          className="
            absolute
            left-1/2
            top-[-250px]
            h-[600px]
            w-[600px]
            -translate-x-1/2
            rounded-full
            bg-red-950/20
            blur-[180px]
          "
        />

        <div
          className="
            absolute
            bottom-[-250px]
            left-[-150px]
            h-[500px]
            w-[500px]
            rounded-full
            bg-red-950/10
            blur-[160px]
          "
        />

        <div
          className="
            absolute
            right-[-200px]
            top-[40%]
            h-[450px]
            w-[450px]
            rounded-full
            bg-red-950/10
            blur-[160px]
          "
        />

      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header
        className="
          sticky
          top-0
          z-50
          border-b
          border-zinc-900
          bg-[#070707]/90
          backdrop-blur-xl
        "
      >

        <div
          className="
            mx-auto
            flex
            h-16
            max-w-[1300px]
            items-center
            justify-between
            px-5
            sm:px-8
          "
        >

          {/* LEFT */}

          <div className="flex items-center gap-3">

            <button
              onClick={() =>
                navigate("/dashboard")
              }
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-lg
                border
                border-zinc-900
                text-zinc-500
                transition-all
                duration-200
                hover:border-red-900/50
                hover:bg-red-950/20
                hover:text-red-400
              "
              title="Back to Dashboard"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="h-6 w-px bg-zinc-900" />

            <div className="flex items-center gap-3">

              <div
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  bg-red-700
                  shadow-lg
                  shadow-red-950/30
                "
              >
                <Database size={17} />
              </div>

              <div>

                <h1 className="text-sm font-black sm:text-base">
                  SQL
                  <span className="text-red-600">
                    Forge
                  </span>
                </h1>

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-[0.2em]
                    text-zinc-700
                  "
                >
                  Challenge Arena
                </p>

              </div>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            {/* XP */}

            <div
              className="
                hidden
                items-center
                gap-2
                rounded-lg
                border
                border-zinc-900
                bg-zinc-950
                px-3
                py-2
                sm:flex
              "
            >
              <Zap
                size={13}
                className="text-yellow-500"
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-zinc-500
                "
              >
                {progress.xp || 0} XP
              </span>
            </div>

            {/* STREAK */}

            <div
              className="
                flex
                items-center
                gap-2
                rounded-lg
                border
                border-red-950/50
                bg-red-950/10
                px-3
                py-2
              "
            >
              <Flame
                size={13}
                className="text-red-500"
              />

              <span
                className="
                  text-xs
                  font-bold
                  text-zinc-500
                "
              >
                {progress.streak || 0}
              </span>
            </div>

          </div>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main
        className="
          relative
          mx-auto
          max-w-[1300px]
          px-5
          py-10
          sm:px-8
          lg:py-14
        "
      >

        {/* ====================================================
            HERO
        ==================================================== */}

        <section className="mx-auto max-w-3xl text-center">

          <div
            className="
              mx-auto
              mb-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-red-900/40
              bg-red-950/10
              px-4
              py-2
            "
          >

            <Trophy
              size={13}
              className="text-red-500"
            />

            <span
              className="
                text-[9px]
                font-bold
                uppercase
                tracking-[0.25em]
                text-red-500
              "
            >
              Challenge Arena
            </span>

          </div>

          <h2
            className="
              text-4xl
              font-black
              tracking-tight
              sm:text-5xl
            "
          >
            Choose Your

            <span className="text-red-600">
              {" "}Difficulty
            </span>
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-zinc-600
              sm:text-base
            "
          >
            Choose any difficulty and explore all
            available challenges. Every level is
            unlocked — solve them in any order you
            want.
          </p>

        </section>

        {/* ====================================================
            OVERALL PROGRESS
        ==================================================== */}

        <section className="mx-auto mt-10 max-w-4xl">

          <div
            className="
              rounded-2xl
              border
              border-zinc-900
              bg-[#080808]
              p-5
            "
          >

            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >

              <div>

                <p
                  className="
                    text-[9px]
                    font-bold
                    uppercase
                    tracking-[0.25em]
                    text-zinc-700
                  "
                >
                  Your Journey
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-black
                    text-zinc-300
                  "
                >
                  {totalCompleted}

                  <span className="ml-1 text-zinc-700">
                    / 150 challenges completed
                  </span>
                </p>

              </div>

              <div className="text-right">

                <p
                  className="
                    text-[9px]
                    uppercase
                    tracking-widest
                    text-zinc-700
                  "
                >
                  XP
                </p>

                <p
                  className="
                    text-sm
                    font-black
                    text-yellow-500
                  "
                >
                  {progress.xp || 0}
                </p>

              </div>

            </div>

            {/* PROGRESS BAR */}

            <div
              className="
                mt-4
                h-1.5
                overflow-hidden
                rounded-full
                bg-zinc-950
              "
            >

              <div
                className="
                  h-full
                  rounded-full
                  bg-red-600
                  transition-all
                  duration-700
                "
                style={{
                  width: `${overallPercentage}%`,
                }}
              />

            </div>

          </div>

        </section>

        {/* ====================================================
            DIFFICULTY CARDS
        ==================================================== */}

        <section
          className="
            mx-auto
            mt-8
            grid
            max-w-6xl
            gap-5
            lg:grid-cols-3
          "
        >

          {difficulties.map((difficulty) => {

            const Icon = difficulty.icon;

            const percentage = Math.round(
              (difficulty.completed /
                TOTAL_LEVELS) *
                100
            );

            const complete =
              difficulty.completed >=
              TOTAL_LEVELS;

            return (
              <div
                key={difficulty.key}
                className="
                  group
                  relative
                  overflow-hidden
                  rounded-3xl
                  border
                  border-zinc-900
                  bg-[#080808]
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-zinc-700
                  hover:shadow-2xl
                "
              >

                {/* =================================================
                    CARD GLOW
                ================================================== */}

                <div
                  className="
                    pointer-events-none
                    absolute
                    right-[-80px]
                    top-[-80px]
                    h-48
                    w-48
                    rounded-full
                    bg-red-900/10
                    blur-[80px]
                    transition-all
                    duration-500
                    group-hover:bg-red-800/20
                  "
                />

                {/* =================================================
                    TOP
                ================================================== */}

                <div
                  className="
                    relative
                    flex
                    items-start
                    justify-between
                  "
                >

                  <div
                    className={`
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-2xl
                      border
                      ${getIconClasses(
                        difficulty.key
                      )}
                    `}
                  >
                    <Icon size={21} />
                  </div>

                  {complete ? (
                    <span
                      className="
                        rounded-full
                        border
                        border-green-900/40
                        bg-green-950/20
                        px-3
                        py-1.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-widest
                        text-green-500
                      "
                    >
                      Completed
                    </span>
                  ) : (
                    <span
                      className="
                        rounded-full
                        border
                        border-red-900/40
                        bg-red-950/20
                        px-3
                        py-1.5
                        text-[8px]
                        font-black
                        uppercase
                        tracking-widest
                        text-red-500
                      "
                    >
                      Unlocked
                    </span>
                  )}

                </div>

                {/* =================================================
                    TITLE
                ================================================== */}

                <div className="relative mt-7">

                  <p
                    className="
                      text-[9px]
                      font-black
                      uppercase
                      tracking-[0.25em]
                      text-zinc-700
                    "
                  >
                    {difficulty.label}
                  </p>

                  <h3
                    className="
                      mt-2
                      text-2xl
                      font-black
                    "
                  >
                    {difficulty.name}
                  </h3>

                  <p
                    className="
                      mt-2
                      text-xs
                      font-bold
                      uppercase
                      tracking-wider
                      text-zinc-800
                    "
                  >
                    Levels {difficulty.levels}
                  </p>

                  <p
                    className="
                      mt-4
                      min-h-[66px]
                      text-sm
                      leading-6
                      text-zinc-600
                    "
                  >
                    {difficulty.description}
                  </p>

                </div>

                {/* =================================================
                    PROGRESS
                ================================================== */}

                <div className="relative mt-6">

                  <div
                    className="
                      mb-2
                      flex
                      items-center
                      justify-between
                    "
                  >

                    <span
                      className="
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-widest
                        text-zinc-700
                      "
                    >
                      Progress
                    </span>

                    <span
                      className="
                        text-[10px]
                        font-black
                        text-zinc-500
                      "
                    >
                      {difficulty.completed}/50
                    </span>

                  </div>

                  <div
                    className="
                      h-1.5
                      overflow-hidden
                      rounded-full
                      bg-zinc-950
                    "
                  >

                    <div
                      className={`
                        h-full
                        rounded-full
                        transition-all
                        duration-700
                        ${getProgressClasses(
                          difficulty.key
                        )}
                      `}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>

                {/* =================================================
                    BUTTON
                ================================================== */}

                <div className="relative mt-7">

                  <button
                    type="button"
                    onClick={() =>
                      handleStart(
                        difficulty.key
                      )
                    }
                    className={`
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      px-5
                      py-3.5
                      text-xs
                      font-black
                      text-white
                      shadow-lg
                      transition-all
                      duration-200
                      hover:scale-[1.01]
                      active:scale-[0.98]
                      ${getButtonClasses(
                        difficulty.key
                      )}
                    `}
                  >

                    {complete
                      ? "Replay Stage"
                      : difficulty.completed > 0
                      ? `Continue — ${difficulty.completed + 1}`
                      : "Explore Levels"}

                    <ArrowRight size={14} />

                  </button>

                </div>

              </div>
            );
          })}

        </section>

        {/* ====================================================
            INFO SECTION
        ==================================================== */}

        <section className="mx-auto mt-10 max-w-6xl">

          <div
            className="
              grid
              gap-4
              md:grid-cols-3
            "
          >

            {/* CARD 1 */}

            <div
              className="
                rounded-2xl
                border
                border-zinc-900
                bg-[#080808]
                p-5
                transition-all
                duration-300
                hover:border-zinc-800
              "
            >

              <div className="text-xl font-black text-zinc-800">
                01
              </div>

              <h4
                className="
                  mt-3
                  text-sm
                  font-black
                "
              >
                Choose Any Stage
              </h4>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-700
                "
              >
                Easy, Medium, and Advanced are all
                available from the beginning.
              </p>

            </div>

            {/* CARD 2 */}

            <div
              className="
                rounded-2xl
                border
                border-zinc-900
                bg-[#080808]
                p-5
                transition-all
                duration-300
                hover:border-zinc-800
              "
            >

              <div className="text-xl font-black text-zinc-800">
                02
              </div>

              <h4
                className="
                  mt-3
                  text-sm
                  font-black
                "
              >
                Multiple Solutions
              </h4>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-700
                "
              >
                Solve a challenge using any valid SQL
                approach. You are not restricted to one
                exact query.
              </p>

            </div>

            {/* CARD 3 */}

            <div
              className="
                rounded-2xl
                border
                border-zinc-900
                bg-[#080808]
                p-5
                transition-all
                duration-300
                hover:border-zinc-800
              "
            >

              <div className="text-xl font-black text-zinc-800">
                03
              </div>

              <h4
                className="
                  mt-3
                  text-sm
                  font-black
                "
              >
                Master All 150
              </h4>

              <p
                className="
                  mt-2
                  text-xs
                  leading-5
                  text-zinc-700
                "
              >
                Complete all 50 levels in each
                difficulty and build your SQL mastery.
              </p>

            </div>

          </div>

        </section>

        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer
          className="
            mx-auto
            mt-12
            max-w-6xl
            border-t
            border-zinc-900
            pt-6
          "
        >

          <div
            className="
              flex
              flex-col
              gap-2
              text-[9px]
              text-zinc-800
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >

            <span>
              SQLForge Challenge Arena
            </span>

            <span>
              Practice SQL. Build confidence.
              Crack placements.
            </span>

          </div>

        </footer>

      </main>

    </div>
  );
}

export default ChallengeLevels;