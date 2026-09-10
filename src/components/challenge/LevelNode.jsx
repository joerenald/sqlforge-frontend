import {
  Check,
  Lock,
  Play,
  Star,
  Zap,
} from "lucide-react";

function LevelNode({
  level,
  status = "locked",
  onClick,
  xp = 50,
  stars = 0,
  difficulty = "easy",
}) {
  const isCompleted = status === "completed";
  const isCurrent = status === "current";
  const isLocked = status === "locked";

  // ----------------------------------------------------------
  // DIFFICULTY CONFIG
  // ----------------------------------------------------------

  const difficultyConfig = {
    easy: {
      accent: "green",
      activeBorder: "border-green-700/70",
      activeBg: "bg-green-950/20",
      activeText: "text-green-400",
      glow: "bg-green-500/10",
      number: "text-green-400",
      badge: "bg-green-950/30",
      badgeBorder: "border-green-800/40",
    },

    medium: {
      accent: "yellow",
      activeBorder: "border-yellow-700/70",
      activeBg: "bg-yellow-950/20",
      activeText: "text-yellow-400",
      glow: "bg-yellow-500/10",
      number: "text-yellow-400",
      badge: "bg-yellow-950/30",
      badgeBorder: "border-yellow-800/40",
    },

    advanced: {
      accent: "red",
      activeBorder: "border-red-700/70",
      activeBg: "bg-red-950/20",
      activeText: "text-red-400",
      glow: "bg-red-500/10",
      number: "text-red-400",
      badge: "bg-red-950/30",
      badgeBorder: "border-red-800/40",
    },
  };

  const config =
    difficultyConfig[difficulty] ||
    difficultyConfig.easy;

  // ----------------------------------------------------------
  // CLICK
  // ----------------------------------------------------------

  const handleClick = () => {
    if (isLocked) return;

    if (onClick) {
      onClick(level);
    }
  };

  // ----------------------------------------------------------
  // STARS
  // ----------------------------------------------------------

  const normalizedStars = Math.max(
    0,
    Math.min(3, stars)
  );

  // ----------------------------------------------------------
  // CLASS
  // ----------------------------------------------------------

  let containerClasses =
    "group relative aspect-square w-full overflow-hidden rounded-2xl border p-3 text-left transition-all duration-300";

  if (isCompleted) {
    containerClasses +=
      " cursor-pointer border-green-900/50 bg-green-950/[0.08] hover:-translate-y-1 hover:border-green-700/70 hover:bg-green-950/[0.15] hover:shadow-xl hover:shadow-green-950/20";
  }

  if (isCurrent) {
    containerClasses +=
      ` cursor-pointer ${config.activeBorder} ${config.activeBg} hover:-translate-y-1 hover:shadow-xl`;
  }

  if (isLocked) {
    containerClasses +=
      " cursor-not-allowed border-zinc-900/70 bg-[#070707] opacity-55";
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isLocked}
      aria-label={
        isCompleted
          ? `Level ${level}, completed`
          : isCurrent
          ? `Level ${level}, play`
          : `Level ${level}, locked`
      }
      className={containerClasses}
    >
      {/* =====================================================
          CURRENT LEVEL GLOW
      ====================================================== */}

      {isCurrent && (
        <>
          <div
            className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${config.glow} blur-2xl`}
          />

          <div
            className={`pointer-events-none absolute -bottom-10 -left-10 h-20 w-20 rounded-full ${config.glow} blur-2xl`}
          />
        </>
      )}

      {/* =====================================================
          COMPLETED GLOW
      ====================================================== */}

      {isCompleted && (
        <div className="pointer-events-none absolute -right-8 -top-8 h-20 w-20 rounded-full bg-green-500/5 blur-2xl" />
      )}

      {/* =====================================================
          TOP ROW
      ====================================================== */}

      <div className="relative z-10 flex items-start justify-between">
        {/* Level number */}

        <span
          className={`font-mono text-[9px] font-black tracking-wider ${
            isCompleted
              ? "text-green-600"
              : isCurrent
              ? config.number
              : "text-zinc-700"
          }`}
        >
          LVL
        </span>

        {/* Status icon */}

        {isCompleted && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-green-800/40 bg-green-950/30">
            <Check
              size={12}
              className="text-green-400"
              strokeWidth={3}
            />
          </div>
        )}

        {isCurrent && (
          <div
            className={`flex h-6 w-6 items-center justify-center rounded-full ${config.activeBg} border ${config.activeBorder}`}
          >
            <Play
              size={9}
              fill="currentColor"
              className={config.activeText}
            />
          </div>
        )}

        {isLocked && (
          <div className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-900 bg-zinc-950">
            <Lock
              size={10}
              className="text-zinc-700"
            />
          </div>
        )}
      </div>

      {/* =====================================================
          LEVEL NUMBER
      ====================================================== */}

      <div className="relative z-10 mt-3">
        <p
          className={`font-mono text-3xl font-black tracking-tight transition-transform duration-300 ${
            isCompleted
              ? "text-green-500/80 group-hover:scale-105"
              : isCurrent
              ? "text-white group-hover:scale-105"
              : "text-zinc-800"
          }`}
        >
          {String(level).padStart(2, "0")}
        </p>
      </div>

      {/* =====================================================
          STATUS TEXT
      ====================================================== */}

      <div className="relative z-10 mt-1">
        <p
          className={`text-[8px] font-black uppercase tracking-[0.18em] ${
            isCompleted
              ? "text-green-700"
              : isCurrent
              ? config.activeText
              : "text-zinc-800"
          }`}
        >
          {isCompleted
            ? "Completed"
            : isCurrent
            ? "Play Now"
            : "Locked"}
        </p>
      </div>

      {/* =====================================================
          STARS
      ====================================================== */}

      <div className="absolute bottom-3 left-3 z-10 flex items-center gap-0.5">
        {[1, 2, 3].map((star) => (
          <Star
            key={star}
            size={10}
            fill={
              star <= normalizedStars
                ? "currentColor"
                : "transparent"
            }
            className={
              star <= normalizedStars
                ? "text-yellow-400"
                : "text-zinc-800"
            }
          />
        ))}
      </div>

      {/* =====================================================
          XP
      ====================================================== */}

      {!isLocked && (
        <div className="absolute bottom-3 right-3 z-10 flex items-center gap-1">
          <Zap
            size={9}
            className={
              isCompleted
                ? "text-yellow-500"
                : "text-zinc-600"
            }
          />

          <span
            className={`text-[8px] font-bold ${
              isCompleted
                ? "text-yellow-600"
                : "text-zinc-700"
            }`}
          >
            +{xp}
          </span>
        </div>
      )}

      {/* =====================================================
          CURRENT LEVEL PULSE
      ====================================================== */}

      {isCurrent && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-red-500/10" />
      )}

      {/* =====================================================
          HOVER ARROW
      ====================================================== */}

      {!isLocked && (
        <div
          className={`absolute right-3 top-1/2 z-20 -translate-y-1/2 translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 ${
            isCompleted
              ? "text-green-500"
              : config.activeText
          }`}
        >
          →
        </div>
      )}
    </button>
  );
}

export default LevelNode;