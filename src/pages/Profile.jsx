import {
  ArrowLeft,
  BarChart3,
  CheckCircle2,
  Database,
  Flame,
  Gamepad2,
  LogOut,
  Mail,
  Pencil,
  Save,
  ShieldCheck,
  Sparkles,
  Trophy,
  User,
  X,
  Zap,
} from "lucide-react";
import { auth } from "../firebase";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";


const DEFAULT_PROGRESS = {
  easy: { completed: [] },
  medium: { completed: [] },
  advanced: { completed: [] },
  xp: 0,
  streak: 0,
};

const getStoredUser = () => {
  try {
    const stored = localStorage.getItem("sqlforge_user");

    if (!stored) {
      return null;
    }

    return JSON.parse(stored);
  } catch {
    return null;
  }
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
 const [progress, setProgress] = useState(DEFAULT_PROGRESS);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [saveMessage, setSaveMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("sqlforge_token");
    const storedUser = getStoredUser();

    if (!token || !storedUser) {
      navigate("/login", { replace: true });
      return;
    }

    setUser(storedUser);
    setEditedName(storedUser.name || "");
  }, [navigate]);

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

  const logout = () => {
    localStorage.removeItem("sqlforge_token");
    localStorage.removeItem("sqlforge_user");

    navigate("/login", { replace: true });
  };

  const startEditing = () => {
    setEditedName(user?.name || "");
    setSaveMessage("");
    setIsEditing(true);
  };

  const cancelEditing = () => {
    setEditedName(user?.name || "");
    setSaveMessage("");
    setIsEditing(false);
  };

  const saveProfile = () => {
    const trimmedName = editedName.trim();

    if (!trimmedName) {
      setSaveMessage("Name cannot be empty.");
      return;
    }

    const updatedUser = {
      ...user,
      name: trimmedName,
    };

    localStorage.setItem(
      "sqlforge_user",
      JSON.stringify(updatedUser)
    );

    setUser(updatedUser);
    setEditedName(trimmedName);
    setIsEditing(false);
    setSaveMessage("Profile updated successfully.");

    window.dispatchEvent(
      new Event("sqlforge-user-updated")
    );

    setTimeout(() => {
      setSaveMessage("");
    }, 2500);
  };

  const goTo = (path) => {
    navigate(path);
  };

 const userName = user?.name || "SQLForge User";
const userEmail = user?.email || "No email available";

const profilePhoto =
  user?.photoURL || auth.currentUser?.photoURL || null;
  const initials = useMemo(() => {
    return userName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }, [userName]);

  const easyCompleted = useMemo(
    () => new Set(progress.easy.completed).size,
    [progress.easy.completed]
  );

  const mediumCompleted = useMemo(
    () => new Set(progress.medium.completed).size,
    [progress.medium.completed]
  );

  const advancedCompleted = useMemo(
    () => new Set(progress.advanced.completed).size,
    [progress.advanced.completed]
  );

  const totalCompleted =
    easyCompleted +
    mediumCompleted +
    advancedCompleted;

  const totalChallenges = 150;

  const completionPercentage = Math.min(
    100,
    Math.round(
      (totalCompleted / totalChallenges) * 100
    )
  );

  const currentPath = useMemo(() => {
    if (easyCompleted < 50) {
      return `Foundation • Level ${easyCompleted + 1}`;
    }

    if (mediumCompleted < 50) {
      return `Intermediate • Level ${mediumCompleted + 1}`;
    }

    if (advancedCompleted < 50) {
      return `Advanced • Level ${advancedCompleted + 1}`;
    }

    return "SQL Master • 150 / 150";
  }, [easyCompleted, mediumCompleted, advancedCompleted]);

  const tracks = [
    {
      title: "Foundation",
      subtitle: "Easy Challenges",
      completed: easyCompleted,
      total: 50,
      path: "/challenge-levels/easy",
      icon: Database,
      accent: "blue",
    },
    {
      title: "Intermediate",
      subtitle: "Medium Challenges",
      completed: mediumCompleted,
      total: 50,
      path: "/medium-levels",
      icon: Gamepad2,
      accent: "cyan",
    },
    {
      title: "Advanced",
      subtitle: "Advanced Challenges",
      completed: advancedCompleted,
      total: 50,
      path: "/advanced-levels",
      icon: Trophy,
      accent: "red",
    },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-220px] h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-red-600/[0.06] blur-[130px]" />

        <div className="absolute bottom-[-250px] right-[-180px] h-[500px] w-[500px] rounded-full bg-blue-600/[0.04] blur-[130px]" />

        <div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap text-[22vw] font-black uppercase italic leading-none tracking-[-0.08em] text-white/[0.018] sm:text-[19vw] lg:text-[17vw]"
          style={{
            fontFamily:
              "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif",
            WebkitTextStroke:
              "2px rgba(239,68,68,0.035)",
            transform:
              "translate(-50%, -50%) skewX(-8deg)",
            textShadow:
              "10px 10px 0 rgba(0,0,0,0.22), -2px -2px 0 rgba(255,255,255,0.012)",
          }}
        >
          JOE
        </div>
      </div>

      {/* Main */}
      <div className="relative z-10">
        {/* Top Bar */}
        <header className="border-b border-zinc-900 bg-black/70 backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
            <button
              onClick={() => goTo("/dashboard")}
              className="group flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm font-semibold text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <ArrowLeft
                size={16}
                className="transition-transform group-hover:-translate-x-0.5"
              />

              <span>Dashboard</span>
            </button>

            <button
              onClick={logout}
              className="flex items-center gap-2 rounded-xl border border-red-950/70 bg-red-950/20 px-3 py-2 text-sm font-semibold text-red-400 transition hover:border-red-800 hover:bg-red-950/40 hover:text-red-300"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 lg:py-12">
          {/* Hero */}
          <section className="mb-8">
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-red-500">
              <Sparkles size={14} />
              <span>SQLForge Identity</span>
            </div>

            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
              <div>
                <h1 className="text-4xl font-black tracking-tight sm:text-5xl">
                  {userName}
                </h1>

                <p className="mt-2 text-sm text-zinc-500">
                  Your SQLForge profile, progress and
                  mastery statistics.
                </p>
              </div>

              <div className="rounded-2xl border border-red-950/60 bg-red-950/10 px-4 py-3">
                <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-red-500">
                  Current Path
                </div>

                <div className="mt-1 text-sm font-bold text-white">
                  {currentPath}
                </div>
              </div>
            </div>
          </section>

          {/* Identity + Account */}
          <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Identity Card */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6 shadow-2xl shadow-black/30">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
                {/* Avatar */}
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-3xl border-2 border-red-600/70 bg-gradient-to-br from-red-950/70 to-zinc-950 shadow-lg shadow-red-950/20">
{profilePhoto ? (
  <img
    src={profilePhoto}
      alt={userName}
      className="h-full w-full object-cover"
      referrerPolicy="no-referrer"
    />
  ) : (
    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-red-400">
      {initials || "S"}
    </div>
  )}
</div>

                <div className="min-w-0 flex-1">
                  {isEditing ? (
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-[0.18em] text-zinc-500">
                        Display Name
                      </label>

                      <input
                        value={editedName}
                        onChange={(event) =>
                          setEditedName(event.target.value)
                        }
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            saveProfile();
                          }

                          if (event.key === "Escape") {
                            cancelEditing();
                          }
                        }}
                        autoFocus
                        maxLength={50}
                        className="w-full max-w-md rounded-xl border border-zinc-700 bg-black px-4 py-3 text-lg font-bold text-white outline-none transition placeholder:text-zinc-700 focus:border-red-600 focus:ring-2 focus:ring-red-600/10"
                        placeholder="Enter your name"
                      />

                      <div className="mt-3 flex flex-wrap gap-2">
                        <button
                          onClick={saveProfile}
                          className="flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500"
                        >
                          <Save size={15} />
                          Save
                        </button>

                        <button
                          onClick={cancelEditing}
                          className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm font-bold text-zinc-400 transition hover:bg-zinc-800 hover:text-white"
                        >
                          <X size={15} />
                          Cancel
                        </button>
                      </div>

                      {saveMessage && (
                        <p className="mt-3 text-xs font-semibold text-emerald-400">
                          {saveMessage}
                        </p>
                      )}
                    </div>
                  ) : (
                    <>
                      <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-2xl font-black text-white">
                          {userName}
                        </h2>

                        <button
                          onClick={startEditing}
                          className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-2.5 py-1.5 text-xs font-bold text-zinc-400 transition hover:border-red-900 hover:bg-red-950/20 hover:text-red-400"
                        >
                          <Pencil size={13} />
                          Edit Profile
                        </button>
                      </div>

                      <div className="mt-2 flex items-center gap-2 text-sm text-zinc-500">
                        <Mail size={15} />
                        <span className="truncate">
                          {userEmail}
                        </span>
                      </div>

                      {saveMessage && (
                        <p className="mt-3 text-xs font-semibold text-emerald-400">
                          {saveMessage}
                        </p>
                      )}
                    </>
                  )}

                  {!isEditing && (
                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <div className="flex items-center gap-1.5 rounded-full border border-emerald-900/50 bg-emerald-950/20 px-3 py-1.5 text-xs font-bold text-emerald-400">
                        <ShieldCheck size={13} />
                        Account Active
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-bold text-zinc-500">
                        <User size={13} />
                        SQLForge Member
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Account Information */}
            <div className="rounded-3xl border border-zinc-900 bg-zinc-950/80 p-6">
              <div className="mb-5 flex items-center gap-2">
                <User size={17} className="text-red-500" />

                <h2 className="text-sm font-black uppercase tracking-[0.16em] text-zinc-300">
                  Account Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Name
                  </div>

                  <div className="mt-1 text-sm font-semibold text-white">
                    {userName}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Email
                  </div>

                  <div className="mt-1 break-all text-sm font-semibold text-white">
                    {userEmail}
                  </div>
                </div>

                <div>
                  <div className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-600">
                    Account Status
                  </div>

                  <div className="mt-1 flex items-center gap-2 text-sm font-semibold text-emerald-400">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/40" />
                    Active
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
              <div className="flex items-center justify-between">
                <Zap
                  size={18}
                  className="text-amber-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  XP
                </span>
              </div>

              <div className="mt-4 text-3xl font-black">
                {progress.xp.toLocaleString()}
              </div>

              <div className="mt-1 text-xs text-zinc-600">
                Total experience
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
              <div className="flex items-center justify-between">
                <Flame
                  size={18}
                  className="text-amber-500"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Streak
                </span>
              </div>

              <div className="mt-4 text-3xl font-black">
                {progress.streak}
              </div>

              <div className="mt-1 text-xs text-zinc-600">
                Current streak
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
              <div className="flex items-center justify-between">
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Completed
                </span>
              </div>

              <div className="mt-4 text-3xl font-black">
                {totalCompleted}
                <span className="text-lg text-zinc-700">
                  /150
                </span>
              </div>

              <div className="mt-1 text-xs text-zinc-600">
                Challenges conquered
              </div>
            </div>

            <div className="rounded-2xl border border-zinc-900 bg-zinc-950/80 p-5">
              <div className="flex items-center justify-between">
                <BarChart3
                  size={18}
                  className="text-blue-400"
                />

                <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">
                  Overall
                </span>
              </div>

              <div className="mt-4 text-3xl font-black">
                {completionPercentage}%
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-zinc-900">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>
            </div>
          </section>

          {/* Challenge Tracks */}
          <section className="mt-8">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Progress
                </div>

                <h2 className="mt-1 text-2xl font-black">
                  Challenge Tracks
                </h2>
              </div>

              <button
                onClick={() => goTo("/progress")}
                className="hidden text-xs font-bold text-zinc-500 transition hover:text-white sm:block"
              >
                View Full Progress →
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {tracks.map((track) => {
                const Icon = track.icon;

                const percentage = Math.round(
                  (track.completed / track.total) * 100
                );

                const accentClasses = {
                  blue: {
                    icon: "text-blue-400",
                    border:
                      "hover:border-blue-900/70",
                    bar: "bg-blue-500",
                  },
                  cyan: {
                    icon: "text-cyan-400",
                    border:
                      "hover:border-cyan-900/70",
                    bar: "bg-cyan-500",
                  },
                  red: {
                    icon: "text-red-400",
                    border:
                      "hover:border-red-900/70",
                    bar: "bg-red-500",
                  },
                };

                const accent =
                  accentClasses[track.accent];

                return (
                  <button
                    key={track.title}
                    onClick={() => goTo(track.path)}
                    className={`group rounded-3xl border border-zinc-900 bg-zinc-950/80 p-5 text-left transition hover:-translate-y-0.5 ${accent.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon
                            size={18}
                            className={accent.icon}
                          />

                          <h3 className="font-black text-white">
                            {track.title}
                          </h3>
                        </div>

                        <p className="mt-1 text-xs text-zinc-600">
                          {track.subtitle}
                        </p>
                      </div>

                      <span className="text-sm font-black text-zinc-400">
                        {track.completed}/{track.total}
                      </span>
                    </div>

                    <div className="mt-5 h-2 overflow-hidden rounded-full bg-zinc-900">
                      <div
                        className={`h-full rounded-full ${accent.bar} transition-all duration-700`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-600">
                        {percentage}% complete
                      </span>

                      <span className="text-xs font-bold text-zinc-700 transition group-hover:text-zinc-300">
                        Open track →
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Continue Journey */}
          <section className="mt-8 overflow-hidden rounded-3xl border border-red-950/60 bg-gradient-to-br from-red-950/20 via-zinc-950 to-zinc-950 p-6 sm:p-8">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-red-500">
                  <Sparkles size={14} />
                  Continue Your Journey
                </div>

                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  {totalCompleted >= 150
                    ? "SQL Mastery Complete."
                    : `Next up: ${currentPath}`}
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  {totalCompleted >= 150
                    ? "You conquered every SQLForge challenge. That's serious SQL power."
                    : "Keep solving challenges and build your SQL skills one level at a time."}
                </p>
              </div>

              <button
                onClick={() => {
                  if (totalCompleted >= 150) {
                    goTo("/progress");
                    return;
                  }

                  if (easyCompleted < 50) {
                    goTo(
                      `/challenge/${easyCompleted + 1}`
                    );
                    return;
                  }

                  if (mediumCompleted < 50) {
                    goTo(
                      `/challenge/medium/${mediumCompleted + 1}`
                    );
                    return;
                  }

                  goTo(
                    `/challenge/advanced/${advancedCompleted + 1}`
                  );
                }}
                className="shrink-0 rounded-2xl bg-red-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-red-500"
              >
                {totalCompleted >= 150
                  ? "View Progress"
                  : "Continue"}
              </button>
            </div>
          </section>

          {/* Return */}
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => goTo("/dashboard")}
              className="flex items-center gap-2 rounded-xl border border-zinc-800 bg-zinc-950 px-5 py-3 text-sm font-bold text-zinc-400 transition hover:border-zinc-700 hover:text-white"
            >
              <ArrowLeft size={16} />
              Return to Dashboard
            </button>
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-zinc-900 px-5 py-8 sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-zinc-700">
              <Database size={13} />
              SQLForge
            </div>

            <div className="text-xs text-zinc-700">
              Build skills. Solve queries. Master SQL.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Profile;