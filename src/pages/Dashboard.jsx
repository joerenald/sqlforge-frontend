import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Database,
  LayoutDashboard,
  Terminal,
  ArrowRight,
  Gamepad2,
  BarChart3,
  Trophy,
  Flame,
  Zap,
  Target,
  ChevronRight,
  ChevronDown,
  LogOut,
  User,
  Settings,
  Menu,
  X,
  Play,
  Code2,
  Lock,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Sparkles,
  CircleUserRound,
  BookOpen,
  ShieldCheck,
} from "lucide-react";

// =====================================================
// STORAGE
// =====================================================

const DEFAULT_CHALLENGE_PROGRESS = {
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



// =====================================================
// DASHBOARD
// =====================================================

function Dashboard() {
  const navigate = useNavigate();

  // =====================================================
  // USER STATE
  // =====================================================

  const [user, setUser] = useState(null);

  // =====================================================
  // PROGRESS STATE
  // =====================================================

const [challengeProgress, setChallengeProgress] =
  useState(DEFAULT_CHALLENGE_PROGRESS);

  // =====================================================
  // UI STATE
  // =====================================================

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  // =====================================================
  // AUTHENTICATION CHECK
  // =====================================================

  useEffect(() => {
    const token =
      localStorage.getItem("sqlforge_token");

    const storedUser =
      localStorage.getItem("sqlforge_user");

    if (!token || !storedUser) {
      navigate("/login", {
        replace: true,
      });

      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);

      setUser(parsedUser);
    } catch (error) {
      console.error(
        "Unable to read SQLForge user:",
        error
      );

      localStorage.removeItem("sqlforge_token");

      localStorage.removeItem("sqlforge_user");

      navigate("/login", {
        replace: true,
      });
    }
  }, [navigate]);

// =====================================================
// PROGRESS SYNC
// =====================================================

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

      setChallengeProgress({
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

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem(
      "sqlforge_token"
    );

    localStorage.removeItem(
      "sqlforge_user"
    );

    navigate("/login", {
      replace: true,
    });
  };

  // =====================================================
  // NAVIGATION
  // =====================================================

  const goTo = (path) => {
    setSidebarOpen(false);

    setProfileOpen(false);

    navigate(path);
  };

  // =====================================================
  // CONTINUE CHALLENGE
  // =====================================================

const continueChallenge = () => {
  navigate("/challenge-levels");
};

  // =====================================================
  // CALCULATED PROGRESS
  // =====================================================

  const easyCompleted =
    challengeProgress.easy.completed.length;

  const mediumCompleted =
    challengeProgress.medium.completed.length;

  const advancedCompleted =
    challengeProgress.advanced.completed.length;

  const completedLevels =
    easyCompleted +
    mediumCompleted +
    advancedCompleted;

  // =====================================================
  // CURRENT LEVEL
  // =====================================================

  const currentLevel =
    easyCompleted < 50
      ? easyCompleted + 1
      : mediumCompleted < 50
        ? 50 + mediumCompleted + 1
        : advancedCompleted < 50
          ? 100 + advancedCompleted + 1
          : 150;

  // =====================================================
  // XP TARGET
  // =====================================================

  const nextLevelXp = Math.max(
    100,
    currentLevel * 100
  );

  // =====================================================
  // RECENT ACTIVITY
  // =====================================================

  const recentActivity = [
    ...challengeProgress.advanced.completed
      .slice(-3)
      .reverse()
      .map((level) => ({
        type: "Advanced",
        level,
        label: `Completed Advanced Level ${level}`,
      })),

    ...challengeProgress.medium.completed
      .slice(-3)
      .reverse()
      .map((level) => ({
        type: "Intermediate",
        level,
        label: `Completed Intermediate Level ${level}`,
      })),

    ...challengeProgress.easy.completed
      .slice(-3)
      .reverse()
      .map((level) => ({
        type: "Easy",
        level,
        label: `Completed Easy Level ${level}`,
      })),
  ].slice(0, 5);

  // =====================================================
  // PROGRESS OBJECT
  // =====================================================

  const progress = {
    currentLevel,

    highestLevel: completedLevels,

    totalLevels: 150,

    completedLevels,

    xp: challengeProgress.xp,

    nextLevelXp,

    streak: challengeProgress.streak,

    easy: {
      completed: easyCompleted,
      total: 50,
    },

    intermediate: {
      completed: mediumCompleted,
      total: 50,
    },

    advanced: {
      completed: advancedCompleted,
      total: 50,
    },

    recentActivity,
  };

  // =====================================================
  // TOTAL PROGRESS
  // =====================================================

  const totalProgress =
    progress.totalLevels > 0
      ? Math.round(
          (progress.completedLevels /
            progress.totalLevels) *
            100
        )
      : 0;

  // =====================================================
  // XP PROGRESS
  // =====================================================

  const xpProgress =
    progress.nextLevelXp > 0
      ? Math.min(
          100,
          Math.round(
            (progress.xp /
              progress.nextLevelXp) *
              100
          )
        )
      : 0;

  // =====================================================
  // SIDEBAR ITEMS
  // =====================================================

  const navigationItems = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
      path: "/dashboard",
    },

    {
      label: "Free SQL Practice",
      icon: Terminal,
      path: "/practice",
    },

    {
      label: "Challenge Arena",
      icon: Gamepad2,
      path: "/challenge-levels",
    },

    {
      label: "Progress",
      icon: BarChart3,
      path: "/progress",
    },
  ];

  // =====================================================
  // LOADING
  // =====================================================

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-red-700 shadow-lg shadow-red-950/30">
            <Database size={21} />
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-zinc-500">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-800 border-t-red-500" />

            Loading SQLForge...
          </div>
        </div>
      </div>
    );
  }

  // =====================================================
  // DASHBOARD
  // =====================================================

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      {/* =================================================
          MOBILE OVERLAY
      ================================================= */}

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50
          flex w-[270px] flex-col
          border-r border-white/[0.06]
          bg-[#060606]
          transition-transform duration-300
          lg:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* =================================================
            LOGO
        ================================================= */}

        <div className="flex h-[76px] items-center justify-between border-b border-white/[0.06] px-6">
          <button
            onClick={() => goTo("/dashboard")}
            className="flex items-center gap-3"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-700 shadow-lg shadow-red-950/30">
              <Database size={18} />
            </div>

            <div className="text-left">
              <div className="text-lg font-black tracking-tight">
                SQL
                <span className="text-red-500">
                  Forge
                </span>
              </div>

              <div className="text-[7px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                Practice Platform
              </div>
            </div>
          </button>

          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="text-zinc-600 hover:text-white lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        {/* =================================================
            NAVIGATION
        ================================================= */}

        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
            Workspace
          </p>

          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <button
                  key={item.label}
                  onClick={() =>
                    goTo(item.path)
                  }
                  className={`
                    group flex w-full items-center gap-3
                    rounded-xl px-3 py-3
                    text-left text-xs font-semibold
                    transition
                    ${
                      item.active
                        ? "bg-red-950/30 text-red-400"
                        : "text-zinc-500 hover:bg-white/[0.035] hover:text-zinc-200"
                    }
                  `}
                >
                  <Icon
                    size={17}
                    className={
                      item.active
                        ? "text-red-500"
                        : "text-zinc-700 group-hover:text-zinc-400"
                    }
                  />

                  <span className="flex-1">
                    {item.label}
                  </span>

                  {item.active && (
                    <div className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* =================================================
              SEPARATOR
          ================================================= */}

          <div className="my-7 h-px bg-white/[0.05]" />

          {/* =================================================
              CURRENT CHALLENGE
          ================================================= */}

          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
            Your Challenge
          </p>

          <button
            onClick={continueChallenge}
            className="group w-full rounded-2xl border border-white/[0.06] bg-[#090909] p-4 text-left transition hover:border-red-900/40"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/30">
                <Gamepad2
                  size={16}
                  className="text-red-500"
                />
              </div>

              <ChevronRight
                size={15}
                className="text-zinc-700 transition group-hover:translate-x-1 group-hover:text-zinc-400"
              />
            </div>

            <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-zinc-600">
              Current Level
            </p>

            <div className="mt-1 text-2xl font-black">
              {progress.currentLevel}
            </div>

            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-900">
              <div
                className="h-full rounded-full bg-red-600 transition-all"
                style={{
                  width: `${xpProgress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-[9px] text-zinc-700">
              {progress.xp} /{" "}
              {progress.nextLevelXp} XP
            </p>
          </button>
        </div>

        {/* =================================================
            SIDEBAR USER
        ================================================= */}

        <div className="border-t border-white/[0.06] p-4">
          <button
            onClick={() =>
              setProfileOpen(!profileOpen)
            }
            className="flex w-full items-center gap-3 rounded-xl p-2 text-left transition hover:bg-white/[0.035]"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-red-900/40 bg-red-950/20">
              <User
                size={16}
                className="text-red-500"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-bold text-zinc-300">
                {user.name ||
                  "SQLForge User"}
              </p>

              <p className="truncate text-[9px] text-zinc-700">
                {user.email}
              </p>
            </div>

            <ChevronDown
              size={14}
              className="text-zinc-700"
            />
          </button>

          {/* Sidebar profile dropdown */}

          {profileOpen && (
            <div className="mt-2 rounded-xl border border-white/[0.06] bg-[#090909] p-2">
              <button
                onClick={() =>
                  goTo("/profile")
                }
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
              >
                <Settings size={14} />

                Account Settings
              </button>

              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-red-500 transition hover:bg-red-950/20"
              >
                <LogOut size={14} />

                Sign Out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* =================================================
          MAIN AREA
      ================================================= */}

      <div className="lg:pl-[270px]">
        {/* =================================================
            TOP BAR
        ================================================= */}

        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-white/[0.06] bg-[#030303]/85 px-5 backdrop-blur-xl sm:px-8">
          {/* Mobile menu */}

          <button
            onClick={() =>
              setSidebarOpen(true)
            }
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.04] hover:text-white lg:hidden"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:block">
            <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-700">
              SQLForge Workspace
            </p>

            <p className="mt-1 text-xs font-semibold text-zinc-400">
              Dashboard
            </p>
          </div>

          {/* Right controls */}

          <div className="ml-auto flex items-center gap-3">
            {/* Streak */}

            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-[#080808] px-3 py-2 sm:flex">
              <Flame
                size={14}
                className="text-orange-500"
              />

              <div>
                <p className="text-[8px] uppercase tracking-wider text-zinc-700">
                  Streak
                </p>

                <p className="text-xs font-bold text-zinc-300">
                 {progress.streak} {progress.streak === 1 ? "day" : "days"}
                </p>
              </div>
            </div>

            {/* XP */}

            <div className="hidden items-center gap-2 rounded-xl border border-white/[0.06] bg-[#080808] px-3 py-2 md:flex">
              <Zap
                size={14}
                className="text-yellow-500"
              />

              <div>
                <p className="text-[8px] uppercase tracking-wider text-zinc-700">
                  XP
                </p>

                <p className="text-xs font-bold text-zinc-300">
                  {progress.xp}
                </p>
              </div>
            </div>

            {/* Profile */}

            <div className="relative">
              <button
                onClick={() =>
                  setProfileOpen(
                    !profileOpen
                  )
                }
                className="flex items-center gap-2 rounded-xl border border-white/[0.06] bg-[#080808] p-1.5 pr-3 transition hover:border-white/[0.12]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/30">
                  <User
                    size={14}
                    className="text-red-500"
                  />
                </div>

                <span className="hidden max-w-[100px] truncate text-xs font-semibold text-zinc-300 sm:block">
                  {user.name || "User"}
                </span>

                <ChevronDown
                  size={13}
                  className="text-zinc-700"
                />
              </button>

              {/* Dropdown */}

              {profileOpen && (
                <div className="absolute right-0 top-[52px] w-56 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0a0a0a] p-2 shadow-2xl">
                  <div className="border-b border-white/[0.06] px-3 py-3">
                    <p className="truncate text-xs font-bold text-zinc-200">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-[10px] text-zinc-600">
                      {user.email}
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      goTo("/profile")
                    }
                    className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-zinc-500 transition hover:bg-white/[0.04] hover:text-zinc-200"
                  >
                    <Settings size={14} />

                    Account Settings
                  </button>

                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-red-500 transition hover:bg-red-950/20"
                  >
                    <LogOut size={14} />

                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* =================================================
            CONTENT
        ================================================= */}

        <main className="relative overflow-hidden">
          {/* Background glows */}

          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[30%] top-[-300px] h-[550px] w-[550px] rounded-full bg-red-950/10 blur-[150px]" />

            <div className="absolute bottom-[-250px] right-[-150px] h-[500px] w-[500px] rounded-full bg-red-950/10 blur-[150px]" />
          </div>

          <div className="relative mx-auto max-w-[1500px] px-5 py-8 sm:px-8 lg:px-10">
            {/* =================================================
                WELCOME
            ================================================= */}

            <section className="mb-8">
              <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Sparkles
                      size={14}
                      className="text-red-500"
                    />

                    <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500">
                      Your workspace
                    </span>
                  </div>

                  <h1 className="text-3xl font-black tracking-tight sm:text-4xl lg:text-5xl">
                    Welcome back,{" "}
                    <span className="text-red-500">
                      {user.name?.split(
                        " "
                      )[0] || "Coder"}
                    </span>

                    <span className="text-zinc-700">
                      .
                    </span>
                  </h1>

                  <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-600">
                    Keep sharpening your SQL
                    skills, solve challenges,
                    and move one level closer
                    to placement-ready.
                  </p>
                </div>

                {/* Continue */}

                <button
                  onClick={continueChallenge}
                  className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-red-700 px-5 text-xs font-bold shadow-lg shadow-red-950/20 transition hover:bg-red-600"
                >
                  <Play size={14} />

                  Continue Challenge

                  <ArrowRight
                    size={14}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </button>
              </div>
            </section>

            {/* =================================================
                STAT CARDS
            ================================================= */}

            <section className="mb-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* Current Level */}

              <div className="group rounded-2xl border border-white/[0.06] bg-[#080808] p-5 transition hover:border-red-900/30">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/20">
                    <Target
                      size={18}
                      className="text-red-500"
                    />
                  </div>

                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-700">
                    Level
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black">
                      {progress.currentLevel}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Current level
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-400">
                      {progress.completedLevels}
                      /{progress.totalLevels}
                    </p>

                    <p className="text-[9px] text-zinc-700">
                      completed
                    </p>
                  </div>
                </div>
              </div>

              {/* XP */}

              <div className="group rounded-2xl border border-white/[0.06] bg-[#080808] p-5 transition hover:border-yellow-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-950/20">
                    <Zap
                      size={18}
                      className="text-yellow-500"
                    />
                  </div>

                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-700">
                    Experience
                  </span>
                </div>

                <div className="mt-5">
                  <div className="flex items-end justify-between">
                    <div>
                      <p className="text-3xl font-black">
                        {progress.xp}
                      </p>

                      <p className="mt-1 text-[10px] text-zinc-600">
                        Total XP
                      </p>
                    </div>

                    <p className="text-[10px] font-bold text-zinc-600">
                      {progress.nextLevelXp}{" "}
                      XP
                    </p>
                  </div>

                  <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                    <div
                      className="h-full rounded-full bg-yellow-500 transition-all"
                      style={{
                        width: `${xpProgress}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Streak */}

              <div className="group rounded-2xl border border-white/[0.06] bg-[#080808] p-5 transition hover:border-orange-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-950/20">
                    <Flame
                      size={18}
                      className="text-orange-500"
                    />
                  </div>

                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-700">
                    Consistency
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black">
                      {progress.streak}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Day streak
                    </p>
                  </div>

                  <TrendingUp
                    size={18}
                    className="mb-1 text-zinc-800"
                  />
                </div>
              </div>

              {/* Challenges Completed */}

              <div className="group rounded-2xl border border-white/[0.06] bg-[#080808] p-5 transition hover:border-emerald-900/20">
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/20">
                    <Trophy
                      size={18}
                      className="text-emerald-500"
                    />
                  </div>

                  <span className="text-[8px] font-bold uppercase tracking-wider text-zinc-700">
                    Progress
                  </span>
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-3xl font-black">
                      {progress.completedLevels}
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-600">
                      Challenges completed
                    </p>
                  </div>

                  <CheckCircle2
                    size={18}
                    className="mb-1 text-zinc-800"
                  />
                </div>
              </div>
            </section>

            {/* =================================================
                THREE CORE CATEGORIES
            ================================================= */}

            <section className="mb-8">
              <div className="mb-5">
                <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-red-500">
                  Choose your path
                </p>

                <h2 className="mt-2 text-xl font-black tracking-tight">
                  Build your SQL mastery
                </h2>
              </div>

              <div className="grid gap-4 xl:grid-cols-3">
                {/* =================================================
                    FREE SQL PRACTICE
                ================================================= */}

                <div className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080808] p-6 transition hover:-translate-y-0.5 hover:border-zinc-700">
                  <div className="pointer-events-none absolute right-[-70px] top-[-70px] h-48 w-48 rounded-full bg-zinc-800/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.025]">
                        <Terminal
                          size={21}
                          className="text-zinc-300"
                        />
                      </div>

                      <span className="rounded-full border border-white/[0.06] px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-zinc-600">
                        Open Practice
                      </span>
                    </div>

                    <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                      Category 01
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      Free SQL Practice
                    </h3>

                    <p className="mt-3 min-h-[48px] text-xs leading-6 text-zinc-600">
                      Write, execute, and
                      experiment with SQL queries
                      in a flexible practice
                      environment.
                    </p>

                    <div className="mt-6 grid grid-cols-3 gap-2">
                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <Code2
                          size={14}
                          className="text-zinc-600"
                        />

                        <p className="mt-2 text-[9px] text-zinc-600">
                          SQL Editor
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <Database
                          size={14}
                          className="text-zinc-600"
                        />

                        <p className="mt-2 text-[9px] text-zinc-600">
                          MySQL
                        </p>
                      </div>

                      <div className="rounded-xl border border-white/[0.05] bg-white/[0.02] p-3">
                        <BookOpen
                          size={14}
                          className="text-zinc-600"
                        />

                        <p className="mt-2 text-[9px] text-zinc-600">
                          Learn
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        goTo("/practice")
                      }
                      className="group mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] text-xs font-bold text-zinc-300 transition hover:border-zinc-600 hover:bg-white/[0.05] hover:text-white"
                    >
                      Open Practice

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    GAMIFIED SQL ARENA
                ================================================= */}

                <div className="group relative overflow-hidden rounded-3xl border border-red-900/30 bg-gradient-to-br from-red-950/20 via-[#080808] to-[#080808] p-6 transition hover:-translate-y-0.5 hover:border-red-700/50">
                  <div className="pointer-events-none absolute right-[-90px] top-[-90px] h-60 w-60 rounded-full bg-red-900/15 blur-3xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-red-900/40 bg-red-950/30">
                        <Gamepad2
                          size={21}
                          className="text-red-500"
                        />
                      </div>

                      <span className="rounded-full border border-red-900/40 bg-red-950/20 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-red-500">
                        150 Challenges
                      </span>
                    </div>

                    <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.25em] text-red-600">
                      Category 02
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      Gamified SQL Arena
                    </h3>

                    <p className="mt-3 min-h-[48px] text-xs leading-6 text-zinc-600">
                      Solve increasingly
                      difficult SQL challenges,
                      earn XP, and progress
                      from Easy to Intermediate
                      to Advanced.
                    </p>

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-zinc-700">
                          Overall progress
                        </span>

                        <span className="text-[10px] font-bold text-red-500">
                          {totalProgress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-red-950/30">
                        <div
                          className="h-full rounded-full bg-red-600 transition-all"
                          style={{
                            width: `${totalProgress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between text-[9px] text-zinc-700">
                      <span>
                        Level{" "}
                        {progress.currentLevel}
                      </span>

                      <span>
                        {
                          progress.completedLevels
                        }{" "}
                        completed
                      </span>
                    </div>

                    <button
                      onClick={continueChallenge}
                      className="group mt-5 flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-700 text-xs font-bold shadow-lg shadow-red-950/20 transition hover:bg-red-600"
                    >
                      Continue Challenge

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>

                {/* =================================================
                    PROGRESS & SKILL
                ================================================= */}

                <div className="group relative overflow-hidden rounded-3xl border border-white/[0.07] bg-[#080808] p-6 transition hover:-translate-y-0.5 hover:border-emerald-900/30">
                  <div className="pointer-events-none absolute bottom-[-70px] right-[-70px] h-48 w-48 rounded-full bg-emerald-950/10 blur-3xl" />

                  <div className="relative">
                    <div className="flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-emerald-900/30 bg-emerald-950/20">
                        <BarChart3
                          size={21}
                          className="text-emerald-500"
                        />
                      </div>

                      <span className="rounded-full border border-emerald-900/30 bg-emerald-950/20 px-2.5 py-1 text-[8px] font-bold uppercase tracking-wider text-emerald-500">
                        Skill Check
                      </span>
                    </div>

                    <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.25em] text-emerald-600">
                      Category 03
                    </p>

                    <h3 className="mt-2 text-xl font-black">
                      Progress & Skill
                    </h3>

                    <p className="mt-3 min-h-[48px] text-xs leading-6 text-zinc-600">
                      Track your completed
                      levels, strengths,
                      weaknesses, and overall
                      SQL skill.
                    </p>

                    <div className="mt-6 space-y-3">
                      {/* Easy */}

                      <div>
                        <div className="mb-1.5 flex justify-between">
                          <span className="text-[9px] font-semibold text-zinc-600">
                            Easy
                          </span>

                          <span className="text-[9px] text-zinc-700">
                            {
                              progress.easy
                                .completed
                            }
                            /
                            {
                              progress.easy
                                .total
                            }
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-emerald-500"
                            style={{
                              width: `${
                                (progress.easy
                                  .completed /
                                  progress.easy
                                    .total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Intermediate */}

                      <div>
                        <div className="mb-1.5 flex justify-between">
                          <span className="text-[9px] font-semibold text-zinc-600">
                            Intermediate
                          </span>

                          <span className="text-[9px] text-zinc-700">
                            {
                              progress
                                .intermediate
                                .completed
                            }
                            /
                            {
                              progress
                                .intermediate
                                .total
                            }
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-yellow-500"
                            style={{
                              width: `${
                                (progress
                                  .intermediate
                                  .completed /
                                  progress
                                    .intermediate
                                    .total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Advanced */}

                      <div>
                        <div className="mb-1.5 flex justify-between">
                          <span className="text-[9px] font-semibold text-zinc-600">
                            Advanced
                          </span>

                          <span className="text-[9px] text-zinc-700">
                            {
                              progress.advanced
                                .completed
                            }
                            /
                            {
                              progress.advanced
                                .total
                            }
                          </span>
                        </div>

                        <div className="h-1.5 overflow-hidden rounded-full bg-zinc-900">
                          <div
                            className="h-full rounded-full bg-red-500"
                            style={{
                              width: `${
                                (progress.advanced
                                  .completed /
                                  progress.advanced
                                    .total) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() =>
                        goTo("/progress")
                      }
                      className="group mt-6 flex h-11 w-full items-center justify-center gap-2 rounded-xl border border-emerald-900/30 bg-emerald-950/10 text-xs font-bold text-emerald-500 transition hover:border-emerald-700/50 hover:bg-emerald-950/20"
                    >
                      View Skill Report

                      <ArrowRight
                        size={14}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* =================================================
                LOWER DASHBOARD
            ================================================= */}

            <section className="grid gap-4 xl:grid-cols-3">
              {/* =================================================
                  LEVEL ROADMAP
              ================================================= */}

              <div className="xl:col-span-2 rounded-3xl border border-white/[0.06] bg-[#080808] p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Trophy
                        size={16}
                        className="text-red-500"
                      />

                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-red-500">
                        Your roadmap
                      </p>
                    </div>

                    <h2 className="mt-2 text-lg font-black">
                      SQLForge Journey
                    </h2>

                    <p className="mt-1 text-xs text-zinc-700">
                      Master SQL from fundamentals
                      to advanced problem solving.
                    </p>
                  </div>

                  <button
                    onClick={() =>
                      goTo(
                        "/challenge-levels/easy"
                      )
                    }
                    className="hidden items-center gap-1 text-[10px] font-bold text-zinc-600 transition hover:text-red-500 sm:flex"
                  >
                    View all

                    <ChevronRight size={13} />
                  </button>
                </div>

                {/* =================================================
                    ROADMAP
                ================================================= */}

                <div className="mt-8">
                  {/* EASY */}

                  <button
                    onClick={() =>
                      goTo(
                        "/challenge-levels/easy"
                      )
                    }
                    className="group relative flex w-full gap-4 rounded-2xl text-left transition hover:bg-white/[0.02]"
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-900/30 bg-emerald-950/20">
                        {progress.easy
                          .completed >= 50 ? (
                          <CheckCircle2
                            size={18}
                            className="text-emerald-500"
                          />
                        ) : (
                          <Play
                            size={16}
                            className="text-emerald-500"
                          />
                        )}
                      </div>

                      <div className="mt-2 h-14 w-px bg-white/[0.06]" />
                    </div>

                    <div className="flex-1 pb-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Easy
                          </p>

                          <p className="mt-1 text-[10px] text-zinc-700">
                            Fundamentals · Levels
                            1–50
                          </p>
                        </div>

                        <span className="text-[10px] font-bold text-zinc-700">
                          {
                            progress.easy
                              .completed
                          }
                          /50
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-emerald-500"
                          style={{
                            width: `${
                              (progress.easy
                                .completed /
                                50) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* INTERMEDIATE */}

                  <button
                    onClick={() => {
                      if (
                        progress.easy
                          .completed >= 50
                      ) {
                        goTo("/medium-levels");
                      }
                    }}
                    disabled={
                      progress.easy
                        .completed < 50
                    }
                    className={`group relative flex w-full gap-4 rounded-2xl text-left transition ${
                      progress.easy
                        .completed >= 50
                        ? "cursor-pointer hover:bg-white/[0.02]"
                        : "cursor-not-allowed opacity-70"
                    }`}
                  >
                    <div className="relative flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-yellow-900/30 bg-yellow-950/20">
                        {progress.intermediate
                          .completed >= 50 ? (
                          <CheckCircle2
                            size={18}
                            className="text-yellow-500"
                          />
                        ) : progress.easy
                            .completed >=
                          50 ? (
                          <Play
                            size={16}
                            className="text-yellow-500"
                          />
                        ) : (
                          <Lock
                            size={16}
                            className="text-yellow-600"
                          />
                        )}
                      </div>

                      <div className="mt-2 h-14 w-px bg-white/[0.06]" />
                    </div>

                    <div className="flex-1 pb-7">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Intermediate
                          </p>

                          <p className="mt-1 text-[10px] text-zinc-700">
                            Practical SQL · Levels
                            1–50
                          </p>
                        </div>

                        <span className="text-[10px] font-bold text-zinc-700">
                          {
                            progress
                              .intermediate
                              .completed
                          }
                          /50
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-yellow-500"
                          style={{
                            width: `${
                              (progress
                                .intermediate
                                .completed /
                                50) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>

                  {/* ADVANCED */}

                  <button
                    onClick={() => {
                      if (
                        progress.intermediate
                          .completed >= 50
                      ) {
                        goTo(
                          "/advanced-levels"
                        );
                      }
                    }}
                    disabled={
                      progress.intermediate
                        .completed < 50
                    }
                    className={`group relative flex w-full gap-4 rounded-2xl text-left transition ${
                      progress.intermediate
                        .completed >= 50
                        ? "cursor-pointer hover:bg-white/[0.02]"
                        : "cursor-not-allowed opacity-70"
                    }`}
                  >
                    <div className="flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-900/30 bg-red-950/20">
                        {progress.advanced
                          .completed >= 50 ? (
                          <CheckCircle2
                            size={18}
                            className="text-red-500"
                          />
                        ) : progress.intermediate
                            .completed >=
                          50 ? (
                          <Play
                            size={16}
                            className="text-red-500"
                          />
                        ) : (
                          <Lock
                            size={16}
                            className="text-red-600"
                          />
                        )}
                      </div>
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold">
                            Advanced
                          </p>

                          <p className="mt-1 text-[10px] text-zinc-700">
                            Complex SQL · Levels
                            1–50
                          </p>
                        </div>

                        <span className="text-[10px] font-bold text-zinc-700">
                          {
                            progress.advanced
                              .completed
                          }
                          /50
                        </span>
                      </div>

                      <div className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-900">
                        <div
                          className="h-full rounded-full bg-red-500"
                          style={{
                            width: `${
                              (progress.advanced
                                .completed /
                                50) *
                              100
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* =================================================
                  RECENT ACTIVITY
              ================================================= */}

              <div className="rounded-3xl border border-white/[0.06] bg-[#080808] p-6 sm:p-7">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock3
                        size={15}
                        className="text-zinc-600"
                      />

                      <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-zinc-600">
                        Activity
                      </p>
                    </div>

                    <h2 className="mt-2 text-lg font-black">
                      Recent Activity
                    </h2>
                  </div>

                  <TrendingUp
                    size={16}
                    className="text-zinc-800"
                  />
                </div>

                {progress.recentActivity
                  .length === 0 ? (
                  <div className="flex min-h-[260px] flex-col items-center justify-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                      <Terminal
                        size={19}
                        className="text-zinc-700"
                      />
                    </div>

                    <p className="mt-4 text-xs font-semibold text-zinc-500">
                      No activity yet
                    </p>

                    <p className="mt-2 max-w-[220px] text-[10px] leading-5 text-zinc-700">
                      Start your first SQL
                      challenge and your
                      activity will appear
                      here.
                    </p>

                    <button
                      onClick={continueChallenge}
                      className="mt-5 text-[10px] font-bold text-red-500 hover:text-red-400"
                    >
                      Start first challenge →
                    </button>
                  </div>
                ) : (
                  <div className="mt-5 space-y-3">
                    {progress.recentActivity.map(
                      (
                        activity,
                        index
                      ) => (
                        <div
                          key={`${activity.type}-${activity.level}-${index}`}
                          className="flex items-center gap-3 rounded-xl border border-white/[0.05] bg-white/[0.015] p-3"
                        >
                          <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                              activity.type ===
                              "Easy"
                                ? "bg-emerald-950/20"
                                : activity.type ===
                                    "Intermediate"
                                  ? "bg-yellow-950/20"
                                  : "bg-red-950/20"
                            }`}
                          >
                            <CheckCircle2
                              size={14}
                              className={
                                activity.type ===
                                "Easy"
                                  ? "text-emerald-500"
                                  : activity.type ===
                                      "Intermediate"
                                    ? "text-yellow-500"
                                    : "text-red-500"
                              }
                            />
                          </div>

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[10px] font-bold text-zinc-300">
                              {
                                activity.label
                              }
                            </p>

                            <p className="mt-1 text-[8px] uppercase tracking-wider text-zinc-700">
                              Challenge completed
                            </p>
                          </div>

                          <ChevronRight
                            size={13}
                            className="shrink-0 text-zinc-800"
                          />
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            </section>

            {/* =================================================
                QUICK ACTIONS
            ================================================= */}

            <section className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* SQL Playground */}

              <button
                onClick={() =>
                  goTo("/practice")
                }
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#080808] p-4 text-left transition hover:border-white/[0.12]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                  <Code2
                    size={17}
                    className="text-zinc-500 group-hover:text-white"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    SQL Playground
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    Practice freely
                  </p>
                </div>

                <ChevronRight
                  size={14}
                  className="text-zinc-800 transition group-hover:translate-x-1"
                />
              </button>

              {/* Next Challenge */}

              <button
                onClick={continueChallenge}
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#080808] p-4 text-left transition hover:border-red-900/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-950/20">
                  <Gamepad2
                    size={17}
                    className="text-red-500"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    Next Challenge
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    Level{" "}
                    {progress.currentLevel}
                  </p>
                </div>

                <ChevronRight
                  size={14}
                  className="text-zinc-800 transition group-hover:translate-x-1"
                />
              </button>

              {/* Skill Report */}

              <button
                onClick={() =>
                  goTo("/progress")
                }
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#080808] p-4 text-left transition hover:border-emerald-900/30"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-950/20">
                  <BarChart3
                    size={17}
                    className="text-emerald-500"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    Skill Report
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    View your progress
                  </p>
                </div>

                <ChevronRight
                  size={14}
                  className="text-zinc-800 transition group-hover:translate-x-1"
                />
              </button>

              {/* My Profile */}

              <button
                onClick={() =>
                  goTo("/profile")
                }
                className="group flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-[#080808] p-4 text-left transition hover:border-white/[0.12]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.03]">
                  <CircleUserRound
                    size={17}
                    className="text-zinc-500 group-hover:text-white"
                  />
                </div>

                <div className="flex-1">
                  <p className="text-xs font-bold">
                    My Profile
                  </p>

                  <p className="mt-1 text-[9px] text-zinc-700">
                    Account information
                  </p>
                </div>

                <ChevronRight
                  size={14}
                  className="text-zinc-800 transition group-hover:translate-x-1"
                />
              </button>
            </section>

            {/* =================================================
                FOOTER
            ================================================= */}

            <footer className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/[0.05] pt-6 text-[9px] text-zinc-800 sm:flex-row">
              <div className="flex items-center gap-2">
                <ShieldCheck size={12} />

                <span>
                  SQLForge authentication secured
                  with Firebase & JWT
                </span>
              </div>

              <p>
                Practice SQL. Build confidence.
                Crack placements.
              </p>
            </footer>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;