import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Clock3,
  Code2,
  Database,
  Flame,
  Lightbulb,
  Play,
  RotateCcw,
  Send,
  Sparkles,
  Table2,
  Trophy,
  X,
  XCircle,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import SQLEditor from "../components/SQLEditor";
import EASY_CHALLENGES from "../data/easyQuestions";
import MEDIUM_CHALLENGES from "../data/mediumQuestions";
import ADVANCED_CHALLENGES from "../data/advancedQuestions";
// ============================================================
// CONFIG
// ============================================================


const QUESTIONS_PER_LEVEL = 50;

const TABLES_PER_PAGE = 7;

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api/sql/execute`;

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
// FALLBACK CHALLENGE
// ============================================================

function createFallbackChallenge(level) {
  return {
    title: `SQL Challenge ${level}`,
    question: `Solve SQL Challenge ${level}`,
    description:
      "Solve the SQL challenge using the database tables available in the schema panel.",
    difficulty: "Easy",
    category: "SQL Practice",
    xp: 50,
    hint:
      "Study the available tables and columns. Identify the required data and construct your SELECT query step by step.",
    expectedQuery: "SELECT ...",
    expectedColumns: [],
    expectedRows: [],
  };
}
// ============================================================
// LOAD PROGRESS
// ============================================================

function getStoredProgress() {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);

    if (!stored) {
      return DEFAULT_PROGRESS;
    }

    const parsed = JSON.parse(stored);

    return {
      ...DEFAULT_PROGRESS,

      ...parsed,

      easy: {
        ...DEFAULT_PROGRESS.easy,
        ...(parsed.easy || {}),
      },

      medium: {
        ...DEFAULT_PROGRESS.medium,
        ...(parsed.medium || {}),
      },

      advanced: {
        ...DEFAULT_PROGRESS.advanced,
        ...(parsed.advanced || {}),
      },
    };
  } catch (error) {
    console.error("Unable to load progress:", error);

    return DEFAULT_PROGRESS;
  }
}

// ============================================================
// SQL NORMALIZATION
// ============================================================

function normalizeSQL(sql) {
  return String(sql || "")
    .replace(/--.*$/gm, "")
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/;+$/, "")
    .trim()
    .toLowerCase();
}

// ============================================================
// NORMALIZE ROWS
// ============================================================

function normalizeRows(data) {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data.rows)) {
    return data.rows;
  }

  if (Array.isArray(data.result)) {
    return data.result;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (data.data && Array.isArray(data.data.rows)) {
    return data.data.rows;
  }

  return [];
}

// ============================================================
// NORMALIZE OBJECT
// ============================================================

function normalizeObject(row) {
  const normalized = {};

  Object.keys(row || {})
    .sort()
    .forEach((key) => {
      const value = row[key];

      normalized[key.toLowerCase()] =
        value === null || value === undefined
          ? ""
          : String(value).trim().toLowerCase();
    });

  return normalized;
}

// ============================================================
// COMPARE RESULTS
// ============================================================

function compareResults(actualRows, expectedRows, expectedColumns) {
  if (!Array.isArray(actualRows) || !Array.isArray(expectedRows)) {
    return false;
  }

  if (actualRows.length !== expectedRows.length) {
    return false;
  }

  if (expectedRows.length === 0) {
    return true;
  }

  const actual = actualRows.map(normalizeObject);

  const expected = expectedRows.map(normalizeObject);

  if (expectedColumns?.length) {
    const requiredColumns = expectedColumns.map((column) =>
      column.toLowerCase()
    );

    for (const row of actual) {
      const actualColumns = Object.keys(row);

      for (const column of requiredColumns) {
        if (!actualColumns.includes(column)) {
          return false;
        }
      }
    }
  }

  return JSON.stringify(actual) === JSON.stringify(expected);
}

// ============================================================
// COMPONENT
// ============================================================

function Challenge() {
  const navigate = useNavigate();

const { level, mediumLevel, advancedLevel } = useParams();

const isMedium = Boolean(mediumLevel);
const isAdvanced = Boolean(advancedLevel);

const numericLevel = Number(
  isAdvanced
    ? advancedLevel
    : isMedium
      ? mediumLevel
      : level
) || 1;

  // ==========================================================
  // CHALLENGE
  // ==========================================================

const challenge = useMemo(() => {
  const challenges = isAdvanced
    ? ADVANCED_CHALLENGES
    : isMedium
      ? MEDIUM_CHALLENGES
      : EASY_CHALLENGES;

  const question = challenges[numericLevel];

  if (!question) {
    return createFallbackChallenge(numericLevel);
  }

  return question;
}, [numericLevel, isMedium, isAdvanced]);
  // ==========================================================
  // STATE
  // ==========================================================

  const [query, setQuery] = useState("");

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] = useState(null);

  const [showHint, setShowHint] = useState(false);

  const [attempts, setAttempts] = useState(0);

  const [elapsed, setElapsed] = useState(0);

 const [progress, setProgress] = useState({
  easy: { completed: [] },
  medium: { completed: [] },
  advanced: { completed: [] },
  xp: 0,
  streak: 0,
});

  // ==========================================================
  // DATABASE TABLES
  // ==========================================================

  const [tables, setTables] = useState([]);

  const [tablesLoading, setTablesLoading] = useState(true);

  const [tablesError, setTablesError] = useState("");

  const [tablePage, setTablePage] = useState(0);

  // ==========================================================
  // SELECTED TABLE
  // ==========================================================

  const [selectedTable, setSelectedTable] = useState(null);

  const [selectedTableRows, setSelectedTableRows] = useState([]);

  const [selectedTableColumns, setSelectedTableColumns] = useState([]);

  const [selectedTableLoading, setSelectedTableLoading] = useState(false);

  const [selectedTableError, setSelectedTableError] = useState("");

  // ==========================================================
  // TIMER
  // ==========================================================

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((previous) => previous + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // ==========================================================
  // RESET WHEN QUESTION CHANGES
  // ==========================================================

  useEffect(() => {
    setQuery("");
    setResult(null);
    setError("");
    setFeedback(null);
    setShowHint(false);
    setAttempts(0);
    setElapsed(0);
 }, [numericLevel, isMedium, isAdvanced]);

  // ==========================================================
  // FETCH TABLE NAMES
  // ==========================================================

  useEffect(() => {
    const fetchTables = async () => {
      setTablesLoading(true);
      setTablesError("");

      try {
        const response = await fetch(API_BASE_URL, {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            query: `
              SELECT
                table_name
              FROM information_schema.tables
              WHERE table_schema = DATABASE()
              AND table_type = 'BASE TABLE'
              ORDER BY table_name
            `,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load database tables."
          );
        }

        const rows = normalizeRows(data);

        const tableNames = rows
          .map((row) => row.table_name || row.TABLE_NAME)
          .filter(Boolean);

        setTables(tableNames);
        setTablePage(0);
      } catch (err) {
        console.error("Table loading error:", err);

        setTablesError(
          err.message || "Unable to load database tables."
        );
      } finally {
        setTablesLoading(false);
      }
    };

    fetchTables();
  }, []);

  // ==========================================================
  // TABLE PAGINATION
  // ==========================================================

  const totalTablePages = Math.max(
    1,
    Math.ceil(tables.length / TABLES_PER_PAGE)
  );

  const visibleTables = useMemo(() => {
    const start = tablePage * TABLES_PER_PAGE;

    return tables.slice(
      start,
      start + TABLES_PER_PAGE
    );
  }, [tables, tablePage]);

  const goToNextTablePage = () => {
    setTablePage((previous) =>
      Math.min(previous + 1, totalTablePages - 1)
    );
  };

  const goToPreviousTablePage = () => {
    setTablePage((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  // ==========================================================
  // LOAD SELECTED TABLE
  // ==========================================================

  const openTable = async (tableName) => {
    if (!tableName) {
      return;
    }

    setSelectedTable(tableName);

    setSelectedTableRows([]);

    setSelectedTableColumns([]);

    setSelectedTableError("");

    setSelectedTableLoading(true);

    try {
      /*
       * The table name comes directly from information_schema.
       * We do not allow arbitrary user input here.
       */

      const safeTableName = tableName.replace(/`/g, "``");

      const response = await fetch(API_BASE_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          query: `SELECT * FROM \`${safeTableName}\``,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to load table records."
        );
      }

      const rows = normalizeRows(data);

      setSelectedTableRows(rows);

      if (Array.isArray(data.columns) && data.columns.length) {
        setSelectedTableColumns(data.columns);
      } else if (rows.length > 0) {
        setSelectedTableColumns(Object.keys(rows[0]));
      }
    } catch (err) {
      console.error("Table records error:", err);

      setSelectedTableError(
        err.message || "Unable to load table records."
      );
    } finally {
      setSelectedTableLoading(false);
    }
  };

  // ==========================================================
  // CLOSE TABLE
  // ==========================================================

  const closeTable = () => {
    setSelectedTable(null);

    setSelectedTableRows([]);

    setSelectedTableColumns([]);

    setSelectedTableError("");
  };

  // ==========================================================
  // TIMER FORMAT
  // ==========================================================

  const formattedTime = useMemo(() => {
    const minutes = Math.floor(elapsed / 60);

    const seconds = elapsed % 60;

    return `${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }, [elapsed]);

  // ==========================================================
  // RUN QUERY
  // ==========================================================

  const executeQuery = async () => {
    if (!query.trim()) {
      setError("Write a SQL query before running it.");

      setResult(null);

      return null;
    }

    setLoading(true);

    setError("");

    try {
      const response = await fetch(API_BASE_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          query,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Query execution failed."
        );
      }

      setResult(data);

      setAttempts((previous) => previous + 1);

      return data;
    } catch (err) {
      setError(
        err.message || "Unable to execute query."
      );

      setResult(null);

      return null;
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RUN
  // ==========================================================

  const handleRunQuery = async () => {
    setFeedback(null);

    await executeQuery();
  };

  // ==========================================================
  // SUBMIT
  // ==========================================================

 const handleSubmit = async () => {
  if (!query.trim()) {
    setFeedback({
      type: "error",
      message: "Your answer cannot be empty.",
      userAnswer: "",
      correctAnswer: challenge.expectedQuery,
    });

    return;
  }

  setSubmitting(true);
  setError("");

  try {
    let executionData = result;

    if (!executionData) {
      executionData = await executeQuery();
    }

    if (!executionData) {
      return;
    }

    const actualRows = normalizeRows(executionData);

    const correctResult = compareResults(
      actualRows,
      challenge.expectedRows,
      challenge.expectedColumns
    );

    const normalizedUserSQL = normalizeSQL(query);

    const normalizedCorrectSQL = normalizeSQL(
      challenge.expectedQuery
    );

    const sqlMatches =
      normalizedUserSQL === normalizedCorrectSQL;

    const correct =
      correctResult || sqlMatches;

 if (correct) {
  // Mark the level as completed in MongoDB
  const progressSaved = await completeLevel();

  if (!progressSaved) {
    return;
  }

  if (numericLevel === 50) {
  if (isAdvanced) {
    setFeedback({
      type: "success",
      message: `🏆 ADVANCED MASTERY!
50 advanced challenges conquered. Your SQL skills are seriously powerful. 🔥
But Joe isn't done with you yet... 😏
The ultimate challenge is waiting. 💀`,
      xp: challenge.xp,
      userAnswer: query,
      correctAnswer: challenge.expectedQuery,
    });
  } else {
    setFeedback({
      type: "success",
      message: `🎉 YOU DID IT!
50 levels defeated. SQL skills upgraded. 💪
But Joe isn't done with you yet... 😏
More surprise levels are waiting! 🔥`,
      xp: challenge.xp,
      userAnswer: query,
      correctAnswer: challenge.expectedQuery,
    });
  }

  return;
}

      setFeedback({
        type: "success",
        message: "Excellent! Your answer is correct.",
        xp: challenge.xp,
        userAnswer: query,
        correctAnswer: challenge.expectedQuery,
      });
    } else {
      setFeedback({
        type: "error",
        message:
          "Your query executed, but the result does not match the expected answer.",
        userAnswer: query,
        correctAnswer: challenge.expectedQuery,
      });
    }
  } catch (err) {
    setFeedback({
      type: "error",
      message:
        err.message ||
        "Unable to validate your answer.",
      userAnswer: query,
      correctAnswer: challenge.expectedQuery,
    });
  } finally {
    setSubmitting(false);
  }
};
// ----------------------------------------------------------
// COMPLETE LEVEL
// ----------------------------------------------------------

const completeLevel = async () => {
  try {
    const token = localStorage.getItem("sqlforge_token");

    if (!token) {
      setError("Your session has expired. Please log in again.");
      return false;
    }

    const progressKey = isAdvanced
      ? "advanced"
      : isMedium
        ? "medium"
        : "easy";

   const response = await fetch(
  `${import.meta.env.VITE_API_URL}/api/progress/complete`,
  {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          track: progressKey,
          level: numericLevel,
          xp: challenge.xp,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || "Unable to save your progress."
      );
    }

    // Use the progress returned by MongoDB
    setProgress(data.progress);

    return true;
  } catch (err) {
    console.error("Progress update error:", err);

    setError(
      err.message || "Unable to save your progress."
    );

    return false;
  }
};
  // ==========================================================
  // NEXT
  // ==========================================================

const handleNext = () => {
  if (numericLevel < QUESTIONS_PER_LEVEL) {
    if (isAdvanced) {
      navigate(`/challenge/advanced/${numericLevel + 1}`);
    } else if (isMedium) {
      navigate(`/challenge/medium/${numericLevel + 1}`);
    } else {
      navigate(`/challenge/${numericLevel + 1}`);
    }
    return;
  }

  if (isAdvanced) {
    navigate("/advanced-levels");
  } else if (isMedium) {
    navigate("/medium-levels");
  } else {
    navigate("/challenge-levels/easy");
  }
};
  // ----------------------------------------------------------
// PREVIOUS
// ----------------------------------------------------------

const handlePrevious = () => {
  if (numericLevel > 1) {
    if (isAdvanced) {
      navigate(`/challenge/advanced/${numericLevel - 1}`);
    } else if (isMedium) {
      navigate(`/challenge/medium/${numericLevel - 1}`);
    } else {
      navigate(`/challenge/${numericLevel - 1}`);
    }
  } else {
    if (isAdvanced) {
      navigate("/advanced-levels");
    } else if (isMedium) {
      navigate("/medium-levels");
    } else {
      navigate("/challenge-levels/easy");
    }
  }
};

  // ==========================================================
  // RESET
  // ==========================================================

  const handleReset = () => {
    setQuery("");

    setResult(null);

    setError("");

    setFeedback(null);
  };

  // ==========================================================
  // RESULT
  // ==========================================================

  const resultRows = normalizeRows(result);

  const resultColumns =
    resultRows.length > 0
      ? Object.keys(resultRows[0])
      : [];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-[#050505] text-white">

      {/* ======================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute left-1/2 top-[-280px] h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-red-950/20 blur-[180px]" />

        <div className="absolute bottom-[-250px] left-[-200px] h-[500px] w-[500px] rounded-full bg-red-950/10 blur-[160px]" />

        <div className="absolute right-[-250px] top-[30%] h-[500px] w-[500px] rounded-full bg-red-950/10 blur-[160px]" />

      </div>

      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-zinc-900/90 bg-[#060606]/95 backdrop-blur-xl">

        <div className="mx-auto flex h-16 max-w-[1550px] items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex items-center gap-3">

           <button
  onClick={() =>
    navigate(
      isAdvanced
        ? "/advanced-levels"
        : isMedium
          ? "/medium-levels"
          : "/challenge-levels/easy"
    )
  }
  className="group flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition hover:border-red-800/70 hover:bg-red-950/20 hover:text-white"
  title="Back to levels"
>
  <ArrowLeft
    size={16}
    className="transition-transform group-hover:-translate-x-0.5"
  />
</button>

            <div className="hidden h-6 w-px bg-zinc-900 sm:block" />

            <div className="flex items-center gap-3">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-700 shadow-lg shadow-red-950/40">
                <Database size={17} />
              </div>

              <div>
                <h1 className="text-sm font-black sm:text-base">
                  SQL
                  <span className="text-red-600">
                    Forge
                  </span>
                </h1>

                <p className="text-[8px] uppercase tracking-[0.25em] text-zinc-700">
                  Challenge Arena
                </p>
              </div>

            </div>

          </div>

          {/* CENTER */}

          <div className="hidden items-center gap-3 md:flex">

            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>

            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-600">
              Challenge
              {" "}
              {String(numericLevel).padStart(2, "0")}
            </span>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2">

            <div className="hidden items-center gap-2 rounded-xl border border-zinc-900 bg-zinc-950 px-3 py-2 sm:flex">

              <Zap
                size={13}
                className="text-yellow-500"
              />

              <span className="text-[10px] font-black text-zinc-500">
                {progress.xp || 0} XP
              </span>

            </div>

            <div className="flex items-center gap-2 rounded-xl border border-red-950/50 bg-red-950/10 px-3 py-2">

              <Flame
                size={13}
                className="text-red-500"
              />

              <span className="text-[10px] font-black text-zinc-400">
                {progress.streak || 0}
              </span>

            </div>

          </div>

        </div>

      </header>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <main className="relative mx-auto max-w-[1550px] px-4 py-5 sm:px-6 lg:px-8">

        {/* ====================================================
            QUESTION HEADER
        ==================================================== */}

        <section className="mb-4 overflow-hidden rounded-2xl border border-zinc-900 bg-[#090909] shadow-2xl shadow-black/20">

          <div className="p-5 sm:p-6">

            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

              <div className="min-w-0">

                {/* BADGES */}

                <div className="mb-3 flex flex-wrap items-center gap-2">

                  <span className="rounded-full border border-green-900/40 bg-green-950/20 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-green-500">
                    {challenge.difficulty}
                  </span>

                  <span className="rounded-full border border-zinc-900 bg-zinc-950 px-3 py-1 text-[9px] font-bold text-zinc-600">
                    {challenge.category}
                  </span>

                  <span className="flex items-center gap-1 rounded-full border border-yellow-900/30 bg-yellow-950/10 px-3 py-1 text-[9px] font-black text-yellow-500">
                    <Zap size={10} />
                    +{challenge.xp} XP
                  </span>

                </div>

                {/* TITLE */}

               <div className="flex items-start gap-3">
  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20">
    <Code2 size={18} className="text-red-500" />
  </div>

  <div className="min-w-0">
    <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-zinc-700">
      Challenge {String(numericLevel).padStart(2, "0")}
    </p>

    <h2 className="mt-1 text-xl font-black leading-7 text-white sm:text-2xl">
  {challenge.title}
</h2>
  </div>
</div>

               <p
  className="
    mt-3
    text-base
    font-semibold
    leading-7
    text-red-100
    sm:text-lg
  "
>
  {challenge.description}
</p>

              </div>

              {/* TIMER */}

              <div className="flex shrink-0 items-center gap-3 rounded-xl border border-zinc-900 bg-zinc-950 px-4 py-3">

                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900">
                  <Clock3
                    size={15}
                    className="text-zinc-500"
                  />
                </div>

                <div>
                  <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">
                    Time
                  </p>

                  <p className="font-mono text-sm font-black text-zinc-300">
                    {formattedTime}
                  </p>
                </div>

              </div>

            </div>

            {/* PROGRESS */}

            <div className="mt-5">

              <div className="mb-2 flex items-center justify-between">

                <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-700">
                  Challenge Progress
                </span>

                <span className="text-[9px] font-black text-zinc-500">
                  {String(numericLevel).padStart(2, "0")}
                  {" "}
                  /
                  {" "}
                  {String(QUESTIONS_PER_LEVEL).padStart(2, "0")}
                </span>

              </div>

              <div className="flex gap-1">

                {Array.from({
                  length: QUESTIONS_PER_LEVEL,
                }).map((_, index) => {

                  const number = index + 1;

                  return (
                    <div
                      key={number}
                      className={`h-1 flex-1 rounded-full transition ${
                        number === numericLevel
                          ? "bg-red-600 shadow-sm shadow-red-600/50"
                          : number < numericLevel
                          ? "bg-green-700"
                          : "bg-zinc-900"
                      }`}
                    />
                  );
                })}

              </div>

            </div>

          </div>

        </section>

        {/* ====================================================
            WORKSPACE
        ==================================================== */}

        <section className="grid items-start gap-4 xl:grid-cols-[250px_minmax(0,1fr)_290px]">

          {/* ==================================================
              LEFT — CHALLENGE TOOLS
          ================================================== */}

          <aside className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#080808]">

            <div className="border-b border-zinc-900 px-4 py-3">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={13}
                    className="text-red-500"
                  />

                  <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    Challenge Tools
                  </span>

                </div>

                <span className="text-[8px] text-zinc-700">
                  {attempts} attempts
                </span>

              </div>

            </div>

            <div className="space-y-3 p-3">

              {/* OBJECTIVE */}

              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3">

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/20">

                    <Code2
                      size={13}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <p className="text-[7px] font-black uppercase tracking-widest text-zinc-700">
                      Objective
                    </p>

                    <p className="text-[10px] font-bold text-zinc-400">
                      Solve the challenge
                    </p>

                  </div>

                </div>

              </div>

              {/* HINT */}

              <button
                onClick={() =>
                  setShowHint(
                    (previous) => !previous
                  )
                }
                className="flex w-full items-center justify-between rounded-xl border border-zinc-900 bg-zinc-950 p-3 text-left transition hover:border-red-900/40 hover:bg-red-950/10"
              >

                <span className="flex items-center gap-2">

                  <Lightbulb
                    size={13}
                    className="text-yellow-500"
                  />

                  <span className="text-[10px] font-bold text-zinc-400">
                    Hint
                  </span>

                </span>

                <ChevronDown
                  size={13}
                  className={`text-zinc-700 transition ${
                    showHint
                      ? "rotate-180"
                      : ""
                  }`}
                />

              </button>

              {showHint && (
                <div className="rounded-xl border border-yellow-900/20 bg-yellow-950/10 p-3">

                  <p className="text-[10px] leading-5 text-zinc-500">
                    {challenge.hint}
                  </p>

                </div>
              )}

              {/* STATS */}

              <div className="grid grid-cols-2 gap-2">

                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3">

                  <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-700">
                    Reward
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-xs font-black text-yellow-500">

                    <Zap size={11} />

                    +{challenge.xp}

                  </p>

                </div>

                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3">

                  <p className="text-[7px] font-bold uppercase tracking-widest text-zinc-700">
                    Attempts
                  </p>

                  <p className="mt-1 text-xs font-black text-zinc-400">
                    {attempts}
                  </p>

                </div>

              </div>

              {/* SQL TIP */}

              <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-3">

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={11}
                    className="text-red-500"
                  />

                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                    SQL Tip
                  </span>

                </div>

                <p className="mt-2 text-[9px] leading-5 text-zinc-600">
                  Start with SELECT and identify the required columns.
                  Then choose the appropriate table and filtering conditions.
                </p>

              </div>

              {/* STATUS */}

              <div className="rounded-xl border border-zinc-900 bg-[#050505] p-3">

                <div className="flex items-center gap-2">

                  <CheckCircle2
                    size={12}
                    className={
                      feedback?.type === "success"
                        ? "text-green-500"
                        : "text-zinc-700"
                    }
                  />

                  <span className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                    Status
                  </span>

                </div>

                <p className="mt-2 text-[9px] leading-4 text-zinc-700">

                  {feedback?.type === "success"
                    ? "Challenge completed successfully."
                    : "Write, run and submit your SQL answer."}

                </p>

              </div>

            </div>

          </aside>

          {/* ==================================================
              CENTER — SQL EDITOR
          ================================================== */}

          <section className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#050505] shadow-xl shadow-black/20">

            {/* EDITOR HEADER */}

            <div className="flex h-11 items-center justify-between border-b border-zinc-900 bg-[#090909] px-4">

              <div className="flex items-center gap-3">

                <div className="flex gap-1.5">

                  <span className="h-2.5 w-2.5 rounded-full bg-red-700" />

                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />

                  <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />

                </div>

                <span className="font-mono text-[9px] text-zinc-600">
                  challenge.sql
                </span>

              </div>

              <div className="flex items-center gap-2">

                <span className="rounded-md border border-zinc-900 bg-zinc-950 px-2 py-1 text-[7px] font-bold uppercase tracking-wider text-zinc-700">
                  Read Only DB
                </span>

                <span className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-zinc-700">

                  <Database size={10} />

                  MySQL

                </span>

              </div>

            </div>

            {/* EDITOR */}

            <div className="h-[390px]">

              <SQLEditor
                value={query}
                onChange={(value) =>
                  setQuery(value || "")
                }
              />

            </div>

            {/* ERROR */}

            {error && (

              <div className="border-t border-red-900/40 bg-red-950/10 px-4 py-3">

                <div className="flex items-center gap-2">

                  <XCircle
                    size={13}
                    className="text-red-500"
                  />

                  <p className="text-[10px] text-red-400">
                    {error}
                  </p>

                </div>

              </div>

            )}

            {/* FEEDBACK */}

            {feedback && (

              <div
                className={`border-t p-4 ${
                  feedback.type === "success"
                    ? "border-green-900/40 bg-green-950/10"
                    : "border-red-900/40 bg-red-950/10"
                }`}
              >

                <div className="flex items-center gap-2">

                  {feedback.type === "success" ? (
                    <CheckCircle2
                      size={15}
                      className="text-green-500"
                    />
                  ) : (
                    <XCircle
                      size={15}
                      className="text-red-500"
                    />
                  )}

                  <p
                    className={`text-xs font-bold ${
                      feedback.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {feedback.message}
                  </p>

                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-2">

                  <div className="overflow-hidden rounded-xl border border-zinc-900 bg-[#050505]">

                    <div className="border-b border-zinc-900 px-3 py-2">

                      <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                        Your Answer
                      </p>

                    </div>

                    <pre className="max-h-[140px] overflow-auto whitespace-pre-wrap p-3 font-mono text-[10px] leading-5 text-zinc-400">
                      {feedback.userAnswer}
                    </pre>

                  </div>

                  <div className="overflow-hidden rounded-xl border border-green-900/30 bg-green-950/5">

                    <div className="border-b border-green-900/20 px-3 py-2">

                      <p className="text-[8px] font-black uppercase tracking-widest text-green-600">
                        Correct Answer
                      </p>

                    </div>

                    <pre className="max-h-[140px] overflow-auto whitespace-pre-wrap p-3 font-mono text-[10px] leading-5 text-green-400">
                      {feedback.correctAnswer}
                    </pre>

                  </div>

                </div>

              </div>

            )}

            {/* CONTROLS */}

            <div className="flex items-center justify-between border-t border-zinc-900 bg-[#090909] px-4 py-3">

              <button
                onClick={handleReset}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-bold text-zinc-600 transition hover:bg-zinc-900 hover:text-white"
              >

                <RotateCcw size={12} />

                Clear

              </button>

              <div className="flex items-center gap-2">

                <button
                  onClick={handleRunQuery}
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-[10px] font-bold text-zinc-300 transition hover:border-zinc-600 hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Play
                    size={11}
                    fill="currentColor"
                  />

                  {loading
                    ? "Running..."
                    : "Run Query"}

                </button>

                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2.5 text-[10px] font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                >

                  <Send size={11} />

                  {submitting
                    ? "Checking..."
                    : "Submit"}

                </button>

              </div>

            </div>

          </section>

          {/* ==================================================
              RIGHT — DATABASE TABLES
          ================================================== */}

          <aside className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#080808]">

            {/* HEADER */}

            <div className="border-b border-zinc-900 bg-[#090909] px-4 py-3">

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-2">

                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20">

                    <Table2
                      size={13}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <h3 className="text-[10px] font-black">
                      Database
                    </h3>

                    <p className="font-mono text-[7px] text-zinc-700">
                      sqlforge
                    </p>

                  </div>

                </div>

                <span className="rounded-full border border-zinc-900 bg-zinc-950 px-2 py-1 text-[7px] font-bold text-zinc-600">
                  {tables.length} tables
                </span>

              </div>

            </div>

            {/* TABLE LIST */}

            <div className="p-3">

              <div className="mb-2 flex items-center justify-between px-1">

                <span className="text-[7px] font-black uppercase tracking-widest text-zinc-700">
                  Available Tables
                </span>

                <span className="font-mono text-[7px] text-zinc-800">
                  {tablePage + 1}/{totalTablePages}
                </span>

              </div>

              {tablesLoading ? (

                <div className="space-y-2">

                  {Array.from({
                    length: TABLES_PER_PAGE,
                  }).map((_, index) => (
                    <div
                      key={index}
                      className="h-10 animate-pulse rounded-xl border border-zinc-900 bg-zinc-950"
                    />
                  ))}

                </div>

              ) : tablesError ? (

                <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-3">

                  <div className="flex items-start gap-2">

                    <XCircle
                      size={13}
                      className="mt-0.5 shrink-0 text-red-500"
                    />

                    <p className="text-[9px] leading-4 text-red-400">
                      {tablesError}
                    </p>

                  </div>

                </div>

              ) : visibleTables.length === 0 ? (

                <div className="rounded-xl border border-zinc-900 bg-zinc-950 p-4 text-center">

                  <Table2
                    size={18}
                    className="mx-auto text-zinc-800"
                  />

                  <p className="mt-2 text-[9px] font-bold text-zinc-600">
                    No tables found
                  </p>

                </div>

              ) : (

                <div className="space-y-1.5">

                  {visibleTables.map((tableName) => (

                    <button
                      key={tableName}
                      onClick={() =>
                        openTable(tableName)
                      }
                      className="group flex w-full items-center justify-between rounded-xl border border-transparent bg-zinc-950/60 px-3 py-2.5 text-left transition hover:border-red-900/40 hover:bg-red-950/10"
                    >

                      <div className="flex min-w-0 items-center gap-2">

                        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-zinc-900 bg-[#080808] transition group-hover:border-red-900/40">

                          <Table2
                            size={11}
                            className="text-zinc-600 transition group-hover:text-red-500"
                          />

                        </div>

                        <span className="truncate font-mono text-[9px] font-bold text-zinc-500 transition group-hover:text-zinc-200">
                          {tableName}
                        </span>

                      </div>

                      <ChevronRight
                        size={11}
                        className="shrink-0 text-zinc-800 transition group-hover:translate-x-0.5 group-hover:text-red-500"
                      />

                    </button>

                  ))}

                </div>

              )}

              {/* PAGINATION */}

              {tables.length > TABLES_PER_PAGE && (

                <div className="mt-3 flex items-center gap-2 border-t border-zinc-900 pt-3">

                  <button
                    onClick={goToPreviousTablePage}
                    disabled={tablePage === 0}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950 py-2 text-[8px] font-bold text-zinc-600 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >

                    <ChevronLeft size={11} />

                    Prev

                  </button>

                  <button
                    onClick={goToNextTablePage}
                    disabled={
                      tablePage === totalTablePages - 1
                    }
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-zinc-900 bg-zinc-950 py-2 text-[8px] font-bold text-zinc-600 transition hover:border-zinc-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
                  >

                    Next

                    <ChevronRight size={11} />

                  </button>

                </div>

              )}

              {/* INFO */}

              <div className="mt-3 rounded-xl border border-zinc-900 bg-[#050505] p-3">

                <div className="flex items-center gap-2">

                  <Sparkles
                    size={10}
                    className="text-red-500"
                  />

                  <span className="text-[7px] font-black uppercase tracking-widest text-zinc-600">
                    Table Explorer
                  </span>

                </div>

                <p className="mt-2 text-[8px] leading-4 text-zinc-700">
                  Click a table to inspect its complete records before writing your query.
                </p>

              </div>

            </div>

          </aside>

        </section>

        {/* ====================================================
            QUERY RESULT
        ==================================================== */}

        <section className="mt-4 overflow-hidden rounded-2xl border border-zinc-900 bg-[#080808]">

          <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">

            <div className="flex items-center gap-3">

              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/20">

                <Database
                  size={14}
                  className="text-red-500"
                />

              </div>

              <div>

                <h3 className="text-[10px] font-black">
                  Query Result
                </h3>

                <p className="text-[8px] text-zinc-700">
                  Output from your SQL query
                </p>

              </div>

            </div>

            {resultRows.length > 0 && (

              <span className="rounded-full border border-zinc-900 bg-zinc-950 px-3 py-1 text-[8px] font-bold text-zinc-600">
                {resultRows.length} rows
              </span>

            )}

          </div>

          <div className="max-h-[320px] overflow-auto">

            {resultRows.length > 0 ? (

              <table className="w-full min-w-max text-left">

                <thead className="sticky top-0 z-10 bg-[#0a0a0a]">

                  <tr>

                    {resultColumns.map((column) => (

                      <th
                        key={column}
                        className="border-b border-zinc-900 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-wider text-zinc-600"
                      >
                        {column}
                      </th>

                    ))}

                  </tr>

                </thead>

                <tbody>

                  {resultRows.map(
                    (row, rowIndex) => (

                      <tr
                        key={rowIndex}
                        className="border-b border-zinc-900/70 transition hover:bg-zinc-950"
                      >

                        {resultColumns.map(
                          (column) => (

                            <td
                              key={column}
                              className="whitespace-nowrap px-4 py-2.5 font-mono text-[10px] text-zinc-400"
                            >
                              {row[column] === null
                                ? "NULL"
                                : String(row[column])}
                            </td>

                          )
                        )}

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            ) : (

              <div className="flex min-h-[110px] flex-col items-center justify-center px-5 text-center">

                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950">

                  <Database
                    size={14}
                    className="text-zinc-800"
                  />

                </div>

                <p className="mt-2 text-[9px] font-bold text-zinc-700">
                  No query result yet
                </p>

                <p className="mt-1 text-[8px] text-zinc-800">
                  Run your SQL query to see the output.
                </p>

              </div>

            )}

          </div>

        </section>

        {/* ====================================================
            NAVIGATION
        ==================================================== */}

        <section className="mt-4 flex items-center justify-between rounded-2xl border border-zinc-900 bg-[#080808] p-3">

          {/* PREVIOUS */}

          <button
            onClick={handlePrevious}
            disabled={numericLevel === 1}
            className={`group flex items-center gap-2 rounded-xl border px-4 py-2.5 text-[10px] font-black transition ${
              numericLevel === 1
                ? "cursor-not-allowed border-zinc-900 bg-zinc-950 text-zinc-800 opacity-60"
                : "border-zinc-800 bg-zinc-950 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-900 hover:text-white"
            }`}
          >

            <ArrowLeft
              size={12}
              className={
                numericLevel === 1
                  ? ""
                  : "transition-transform group-hover:-translate-x-1"
              }
            />

            <span className="hidden sm:inline">
              Previous
            </span>

          </button>

          {/* POSITION */}

          <div className="text-center">

            <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-zinc-700">
              Question
            </p>

            <p className="mt-0.5 font-mono text-xs font-black text-zinc-400">

              {String(numericLevel).padStart(
                2,
                "0"
              )}

              <span className="mx-1 text-zinc-800">
                /
              </span>

              {String(
                QUESTIONS_PER_LEVEL
              ).padStart(2, "0")}

            </p>

          </div>

          {/* NEXT */}

          <button
            onClick={handleNext}
            className="group flex items-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-[10px] font-black text-white shadow-lg shadow-red-950/30 transition hover:bg-red-600"
          >

            <span className="hidden sm:inline">
              {numericLevel === QUESTIONS_PER_LEVEL
                ? "Complete Level"
                : "Next Question"}
            </span>

            <span className="sm:hidden">
              Next
            </span>

            <ArrowRight
              size={12}
              className="transition-transform group-hover:translate-x-1"
            />

          </button>

        </section>

        {/* ====================================================
    SUCCESS
==================================================== */}
{feedback?.type === "success" &&
  numericLevel === 50 &&
  !isMedium && (
  <section className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/95 px-4 py-6 backdrop-blur-xl">

    {/* Background glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-1/2 top-1/2 h-[700px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[140px]" />

      <div className="absolute left-[10%] top-[15%] h-32 w-32 rounded-full bg-green-500/10 blur-3xl" />

      <div className="absolute bottom-[10%] right-[10%] h-40 w-40 rounded-full bg-lime-500/10 blur-3xl" />
    </div>

    {/* Decorative particles */}
    <div className="pointer-events-none absolute left-[12%] top-[25%] text-2xl opacity-60">
      ✦
    </div>

    <div className="pointer-events-none absolute right-[15%] top-[20%] text-xl opacity-50">
      ✧
    </div>

    <div className="pointer-events-none absolute bottom-[22%] left-[18%] text-xl opacity-40">
      ✦
    </div>

    <div className="pointer-events-none absolute bottom-[18%] right-[20%] text-2xl opacity-50">
      ✧
    </div>

    {/* Main card */}
    <div className="relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-emerald-500/30 bg-gradient-to-br from-[#07140c] via-[#050907] to-black shadow-2xl shadow-emerald-500/10">

      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent" />

      {/* Inner glow */}
      <div className="pointer-events-none absolute inset-0 rounded-[2rem] ring-1 ring-inset ring-white/[0.04]" />

      <div className="relative px-6 py-12 text-center sm:px-12 sm:py-16">

        {/* Trophy */}
        <div className="relative mx-auto w-fit">

          <div className="absolute inset-0 scale-150 rounded-full bg-emerald-400/10 blur-2xl" />

          <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10 shadow-lg shadow-emerald-500/20 sm:h-28 sm:w-28">

            <Trophy
              size={48}
              strokeWidth={1.5}
              className="text-emerald-400 sm:h-14 sm:w-14"
            />

          </div>

        </div>

        {/* Small label */}
        <p className="mt-8 text-[10px] font-black uppercase tracking-[0.45em] text-emerald-400/80 sm:text-xs">
          SQLForge • Easy Challenge
        </p>

        {/* Main title */}
        <h1 className="mt-4 text-5xl font-black tracking-tight text-transparent bg-gradient-to-r from-emerald-300 via-green-400 to-lime-300 bg-clip-text sm:text-7xl">
          🎉 YOU DID IT!
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-7 text-zinc-400 sm:text-xl sm:leading-8">
          50 levels defeated.
          <br />
          <span className="font-bold text-zinc-200">
            SQL skills upgraded. 💪
          </span>
        </p>

        {/* Divider */}
        <div className="mx-auto mt-8 flex max-w-md items-center gap-4">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent to-zinc-800" />

          <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

          <div className="h-px flex-1 bg-gradient-to-l from-transparent to-zinc-800" />
        </div>

        {/* Message */}
        <div className="mx-auto mt-8 max-w-2xl">
          <p className="text-lg font-semibold leading-8 text-zinc-300 sm:text-2xl sm:leading-10">
            But Joe isn't done with you yet... 😏
          </p>

          <p className="mt-2 text-base font-medium text-emerald-400 sm:text-lg">
            More surprise levels are waiting! 🔥
          </p>
        </div>

        {/* Stats */}
        <div className="mx-auto mt-10 grid max-w-xl grid-cols-2 gap-3 sm:gap-4">

          <div className="rounded-2xl border border-zinc-800 bg-white/[0.02] px-5 py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-zinc-600">
              Levels
            </p>

            <p className="mt-1 text-2xl font-black text-white">
              50
            </p>

            <p className="text-[10px] text-zinc-600">
              Completed
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-4">
            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-emerald-600">
              XP Earned
            </p>

            <p className="mt-1 text-2xl font-black text-emerald-400">
              +{feedback.xp}
            </p>

            <p className="text-[10px] text-emerald-700">
              Challenge XP
            </p>
          </div>

        </div>

        {/* CTA */}
        <div className="mt-10">

          <button
           onClick={() =>
  navigate(
    isAdvanced
      ? "/advanced-levels"
      : isMedium
        ? "/medium-levels"
        : "/challenge-levels/easy"
  )
}

            className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-500 via-green-500 to-lime-500 px-8 py-4 text-sm font-black text-black shadow-xl shadow-emerald-500/20 transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:shadow-emerald-400/30 active:scale-[0.98] sm:px-10 sm:py-5 sm:text-base"
          >

            <span className="absolute inset-0 -translate-x-full bg-white/20 transition-transform duration-500 group-hover:translate-x-full" />

            <span className="relative">
              Back to Easy Levels
            </span>

            <ArrowRight
              size={20}
              className="relative transition-transform duration-300 group-hover:translate-x-1"
            />

          </button>

        </div>

        {/* Footer */}
        <p className="mt-6 text-[9px] font-bold uppercase tracking-[0.3em] text-zinc-700">
          One milestone conquered • The journey continues
        </p>

      </div>
    </div>
  </section>
)}
{/* =========================================================
    MEDIUM LEVEL 50 CELEBRATION
========================================================= */}
{feedback?.type === "success" &&
  numericLevel === 50 &&
  isMedium && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#02080d]/95 backdrop-blur-xl px-6">
      
      {/* Glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[10%] w-[500px] h-[500px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute bottom-[-15%] right-[10%] w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px]" />
        <div className="absolute top-[35%] left-[45%] w-[300px] h-[300px] rounded-full bg-teal-400/10 blur-[100px]" />
      </div>

      {/* Celebration card */}
      <div className="relative w-full max-w-3xl rounded-3xl border border-cyan-400/30 bg-[#06131c]/95 shadow-[0_0_80px_rgba(34,211,238,0.18)] p-10 md:p-14 text-center">

        {/* Top badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2 text-sm font-semibold tracking-widest text-cyan-300 uppercase">
          ⚡ SQLForge • Medium Challenge
        </div>

        {/* Main icon */}
        <div className="mt-8 text-7xl">
          🧠⚡
        </div>

        {/* Title */}
        <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight text-white">
          MEDIUM MASTERY!
        </h1>

        {/* Subtitle */}
        <p className="mt-5 text-xl md:text-2xl font-semibold text-cyan-300">
          50 challenges conquered. Your SQL skills just leveled up. 🚀
        </p>

        {/* Message */}
        <p className="mt-6 text-lg text-slate-300 leading-relaxed">
          You pushed beyond the fundamentals and proved you can handle
          serious SQL challenges.
        </p>

        <p className="mt-2 text-lg font-semibold text-blue-300">
          But Joe isn't done with you yet... 😏
        </p>

        <p className="mt-2 text-lg font-semibold text-teal-300">
          The next stage is waiting. 🔥
        </p>

        {/* Stats */}
        <div className="mt-10 grid grid-cols-2 gap-4">

          <div className="rounded-2xl border border-cyan-400/20 bg-cyan-400/5 p-5">
            <div className="text-3xl font-black text-cyan-300">
              50
            </div>
            <div className="mt-1 text-sm text-slate-400 uppercase tracking-wider">
              Levels Completed
            </div>
          </div>

          <div className="rounded-2xl border border-blue-400/20 bg-blue-400/5 p-5">
            <div className="text-3xl font-black text-blue-300">
              +{feedback.xp}
            </div>
            <div className="mt-1 text-sm text-slate-400 uppercase tracking-wider">
              XP Earned
            </div>
          </div>

        </div>

        {/* CTA */}
        <button
          onClick={() => navigate("/medium-levels")}
          className="mt-10 w-full rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 to-teal-400 px-6 py-4 text-lg font-black text-slate-950 shadow-lg shadow-cyan-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-cyan-400/40"
        >
          ⚡ BACK TO MEDIUM LEVELS
        </button>

      </div>
    </div>
  )}
  {feedback?.type === "success" &&
  numericLevel === 50 &&
  isAdvanced && (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#020509]/95 backdrop-blur-xl px-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-15%] left-[5%] w-[550px] h-[550px] rounded-full bg-purple-500/10 blur-[130px]" />
        <div className="absolute bottom-[-15%] right-[5%] w-[550px] h-[550px] rounded-full bg-fuchsia-600/10 blur-[130px]" />
        <div className="absolute top-[35%] left-[45%] w-[350px] h-[350px] rounded-full bg-violet-400/10 blur-[110px]" />
      </div>

      <div className="relative w-full max-w-3xl rounded-3xl border border-purple-400/30 bg-[#090512]/95 shadow-[0_0_100px_rgba(168,85,247,0.2)] p-10 md:p-14 text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-purple-400/30 bg-purple-400/10 px-5 py-2 text-sm font-semibold tracking-widest text-purple-300 uppercase">
          👑 SQLForge • Advanced Challenge
        </div>

        <div className="mt-8 text-7xl">💀🔥🏆</div>

        <h1 className="mt-6 text-5xl md:text-6xl font-black tracking-tight text-white">
          ADVANCED MASTER!
        </h1>

        <p className="mt-5 text-xl md:text-2xl font-semibold text-purple-300">
          50 advanced challenges conquered. You have mastered serious SQL. 🚀
        </p>

        <p className="mt-6 text-lg text-slate-300 leading-relaxed">
          Subqueries. Correlated logic. EXISTS. Aggregation. Complex
          relationships. You made it through all of them.
        </p>

        <p className="mt-2 text-lg font-semibold text-fuchsia-300">
          But Joe still isn't done with you... 😏
        </p>

        <p className="mt-2 text-lg font-semibold text-violet-300">
          The ultimate SQL challenge is waiting. 💀
        </p>

        <div className="mt-10 grid grid-cols-2 gap-4">
          <div className="rounded-2xl border border-purple-400/20 bg-purple-400/5 p-5">
            <div className="text-3xl font-black text-purple-300">
              50
            </div>

            <div className="mt-1 text-sm text-slate-400 uppercase tracking-wider">
              Levels Completed
            </div>
          </div>

          <div className="rounded-2xl border border-fuchsia-400/20 bg-fuchsia-400/5 p-5">
            <div className="text-3xl font-black text-fuchsia-300">
              +{feedback.xp}
            </div>

            <div className="mt-1 text-sm text-slate-400 uppercase tracking-wider">
              XP Earned
            </div>
          </div>
        </div>

        <button
          onClick={() => navigate("/advanced-levels")}
          className="mt-10 w-full rounded-2xl bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-400 px-6 py-4 text-lg font-black text-white shadow-lg shadow-purple-500/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-purple-400/40"
        >
          👑 BACK TO ADVANCED LEVELS
        </button>
      </div>
    </div>
  )}
        {/* ====================================================
            FOOTER
        ==================================================== */}

        <footer className="mt-6 border-t border-zinc-900 py-4">

          <div className="flex flex-col gap-2 text-[8px] text-zinc-800 sm:flex-row sm:items-center sm:justify-between">

            <span>
              SQLForge Challenge Arena
            </span>

            <span>
              Solve. Learn. Level up.
            </span>

          </div>

        </footer>

      </main>

      {/* ======================================================
          TABLE RECORD VIEWER
      ====================================================== */}

      {selectedTable && (

        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

          {/* MODAL */}

          <div className="flex max-h-[88vh] w-full max-w-[1250px] flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#080808] shadow-2xl shadow-black/60">

            {/* MODAL HEADER */}

            <div className="flex items-center justify-between border-b border-zinc-900 bg-[#0b0b0b] px-5 py-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-red-900/40 bg-red-950/20">

                  <Table2
                    size={16}
                    className="text-red-500"
                  />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <span className="text-[8px] font-black uppercase tracking-widest text-zinc-700">
                      Table
                    </span>

                    <span className="rounded-full border border-zinc-900 bg-zinc-950 px-2 py-0.5 text-[7px] font-bold text-zinc-600">
                      MySQL
                    </span>

                  </div>

                  <h3 className="mt-0.5 truncate font-mono text-sm font-black text-white">
                    {selectedTable}
                  </h3>

                </div>

              </div>

              <button
                onClick={closeTable}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-500 transition hover:border-red-900/50 hover:bg-red-950/20 hover:text-white"
                title="Close"
              >

                <X size={15} />

              </button>

            </div>

            {/* MODAL INFO BAR */}

            <div className="flex items-center justify-between border-b border-zinc-900 bg-[#070707] px-5 py-2.5">

              <div className="flex items-center gap-2">

                <Database
                  size={11}
                  className="text-zinc-600"
                />

                <span className="text-[8px] text-zinc-600">
                  Complete table records
                </span>

              </div>

              {!selectedTableLoading &&
                !selectedTableError && (

                  <span className="rounded-full border border-zinc-900 bg-zinc-950 px-2.5 py-1 text-[7px] font-bold text-zinc-600">

                    {selectedTableRows.length}
                    {" "}
                    records

                  </span>

                )}

            </div>

            {/* TABLE BODY */}

            <div className="min-h-0 flex-1 overflow-auto">

              {selectedTableLoading ? (

                <div className="flex min-h-[350px] items-center justify-center">

                  <div className="text-center">

                    <div className="mx-auto flex h-10 w-10 animate-pulse items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950">

                      <Database
                        size={17}
                        className="text-zinc-600"
                      />

                    </div>

                    <p className="mt-3 text-[10px] font-bold text-zinc-500">
                      Loading records...
                    </p>

                    <p className="mt-1 text-[8px] text-zinc-700">
                      Reading {selectedTable}
                    </p>

                  </div>

                </div>

              ) : selectedTableError ? (

                <div className="flex min-h-[300px] items-center justify-center p-5">

                  <div className="max-w-md rounded-xl border border-red-900/30 bg-red-950/10 p-5 text-center">

                    <XCircle
                      size={20}
                      className="mx-auto text-red-500"
                    />

                    <p className="mt-3 text-xs font-bold text-red-400">
                      Unable to load table
                    </p>

                    <p className="mt-2 text-[9px] leading-5 text-zinc-600">
                      {selectedTableError}
                    </p>

                  </div>

                </div>

              ) : selectedTableRows.length === 0 ? (

                <div className="flex min-h-[300px] items-center justify-center">

                  <div className="text-center">

                    <Table2
                      size={20}
                      className="mx-auto text-zinc-800"
                    />

                    <p className="mt-3 text-[10px] font-bold text-zinc-600">
                      This table has no records.
                    </p>

                  </div>

                </div>

              ) : (

                <table className="w-full min-w-max text-left">

                  <thead className="sticky top-0 z-20 bg-[#0c0c0c]">

                    <tr>

                      {selectedTableColumns.map(
                        (column) => (

                          <th
                            key={column}
                            className="border-b border-zinc-800 px-4 py-3 font-mono text-[8px] font-black uppercase tracking-wider text-zinc-500"
                          >
                            {column}
                          </th>

                        )
                      )}

                    </tr>

                  </thead>

                  <tbody>

                    {selectedTableRows.map(
                      (row, rowIndex) => (

                        <tr
                          key={rowIndex}
                          className="border-b border-zinc-900/70 transition hover:bg-red-950/5"
                        >

                          {selectedTableColumns.map(
                            (column) => (

                              <td
                                key={column}
                                className="whitespace-nowrap px-4 py-2.5 font-mono text-[9px] text-zinc-400"
                              >

                                {row[column] === null ||
                                row[column] === undefined
                                  ? (
                                    <span className="text-zinc-700">
                                      NULL
                                    </span>
                                  )
                                  : String(row[column])}

                              </td>

                            )
                          )}

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              )}

            </div>

            {/* MODAL FOOTER */}

            <div className="flex items-center justify-between border-t border-zinc-900 bg-[#090909] px-5 py-3">

              <p className="text-[8px] text-zinc-700">

                Click outside or use the close button to return to the challenge.

              </p>

              <button
                onClick={closeTable}
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-[9px] font-bold text-zinc-400 transition hover:border-zinc-600 hover:text-white"
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Challenge;