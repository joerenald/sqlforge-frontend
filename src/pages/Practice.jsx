import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  Columns3,
  Copy,
  Database,
  Eye,
  Play,
  RotateCcw,
  Sparkles,
  Table2,
  Terminal,
  Trash2,
  X,
  Zap,
} from "lucide-react";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import SQLEditor from "../components/SQLEditor";
import QueryResult from "../components/QueryResult";

// ============================================================
// CONFIG
// ============================================================

const API_BASE_URL =
  `${import.meta.env.VITE_API_URL}/api/sql/execute`;

const TABLES_PER_PAGE = 7;

const RESULT_ROWS_PER_PAGE = 10;

// ============================================================
// NORMALIZE API ROWS
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

  if (
    data.data &&
    Array.isArray(data.data.rows)
  ) {
    return data.data.rows;
  }

  return [];
}

// ============================================================
// FORMAT TABLE CELL VALUE
// ============================================================

function formatCellValue(value) {
  if (value === null || value === undefined) {
    return "NULL";
  }

  if (typeof value === "object") {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }

  return String(value);
}

// ============================================================
// COMPONENT
// ============================================================

function Practice() {
  const navigate = useNavigate();

  // ==========================================================
  // QUERY STATE
  // ==========================================================

  const [query, setQuery] = useState("");

  const [result, setResult] = useState(null);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // ==========================================================
  // UI STATE
  // ==========================================================

  const [copied, setCopied] = useState(false);

  const [toolsOpen, setToolsOpen] = useState(true);

  const [samplesOpen, setSamplesOpen] = useState(true);

  // ==========================================================
  // DATABASE STATE
  // ==========================================================

  const [databaseName, setDatabaseName] =
    useState("sqlforge");

  const [tables, setTables] = useState([]);

  const [tablesLoading, setTablesLoading] =
    useState(true);

  const [tablesError, setTablesError] =
    useState("");

  const [tablePage, setTablePage] = useState(0);

  // ==========================================================
  // SELECTED TABLE STATE
  // ==========================================================

  const [selectedTable, setSelectedTable] =
    useState(null);

  const [selectedTableRows, setSelectedTableRows] =
    useState([]);

  const [selectedTableColumns, setSelectedTableColumns] =
    useState([]);

  const [selectedTableLoading, setSelectedTableLoading] =
    useState(false);

  const [selectedTableError, setSelectedTableError] =
    useState("");

  // ==========================================================
  // ATTEMPTS
  // ==========================================================

  const [attempts, setAttempts] = useState(0);

  // ==========================================================
  // QUERY RESULT PAGINATION
  // ==========================================================

  const [resultPage, setResultPage] = useState(0);

  // ==========================================================
  // FETCH DATABASE NAME
  // ==========================================================

  useEffect(() => {
    const fetchDatabaseName = async () => {
      try {
        const response = await fetch(
          API_BASE_URL,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query:
                "SELECT DATABASE() AS database_name",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          return;
        }

        const rows = normalizeRows(data);

        if (rows.length > 0) {
          const name =
            rows[0].database_name ||
            rows[0].DATABASE_NAME;

          if (name) {
            setDatabaseName(name);
          }
        }
      } catch (err) {
        console.error(
          "Database name loading error:",
          err
        );
      }
    };

    fetchDatabaseName();
  }, []);

  // ==========================================================
  // FETCH TABLE NAMES
  // ==========================================================

  useEffect(() => {
    const fetchTables = async () => {
      setTablesLoading(true);

      setTablesError("");

      try {
        const response = await fetch(
          API_BASE_URL,
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
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
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load database tables."
          );
        }

        const rows = normalizeRows(data);

        const tableNames = rows
          .map(
            (row) =>
              row.table_name ||
              row.TABLE_NAME
          )
          .filter(Boolean);

        setTables(tableNames);

        setTablePage(0);
      } catch (err) {
        console.error(
          "Table loading error:",
          err
        );

        setTablesError(
          err.message ||
            "Unable to load database tables."
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
    Math.ceil(
      tables.length /
        TABLES_PER_PAGE
    )
  );

  const visibleTables = useMemo(() => {
    const start =
      tablePage *
      TABLES_PER_PAGE;

    return tables.slice(
      start,
      start + TABLES_PER_PAGE
    );
  }, [tables, tablePage]);

  const goToNextTablePage = () => {
    setTablePage((previous) =>
      Math.min(
        previous + 1,
        totalTablePages - 1
      )
    );
  };

  const goToPreviousTablePage = () => {
    setTablePage((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  // ==========================================================
  // SAMPLE QUERIES
  // ==========================================================

  const sampleQueries = useMemo(() => {
    if (!tables.length) {
      return [];
    }

    return tables
      .slice(0, 6)
      .map((tableName) => ({
        title: `Explore ${tableName}`,

        description:
          `View records from the ${tableName} table.`,

        query:
          `SELECT *\nFROM \`${tableName}\`\nLIMIT 20;`,
      }));
  }, [tables]);

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
      const safeTableName =
        tableName.replace(/`/g, "``");

      const response = await fetch(
        API_BASE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            query:
              `SELECT * FROM \`${safeTableName}\``,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load table records."
        );
      }

      const rows = normalizeRows(data);

      setSelectedTableRows(rows);

      if (
        Array.isArray(data.columns) &&
        data.columns.length
      ) {
        setSelectedTableColumns(
          data.columns
        );
      } else if (rows.length > 0) {
        setSelectedTableColumns(
          Object.keys(rows[0])
        );
      }
    } catch (err) {
      console.error(
        "Table records error:",
        err
      );

      setSelectedTableError(
        err.message ||
          "Unable to load table records."
      );
    } finally {
      setSelectedTableLoading(false);
    }
  };

  // ==========================================================
  // CLOSE SELECTED TABLE
  // ==========================================================

  const closeTable = () => {
    setSelectedTable(null);

    setSelectedTableRows([]);

    setSelectedTableColumns([]);

    setSelectedTableError("");
  };

  // ==========================================================
  // RUN QUERY
  // ==========================================================

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setError(
        "Write a SQL query before running it."
      );

      setResult(null);

      setResultPage(0);

      return;
    }

    setLoading(true);

    setError("");

    setResult(null);

    setResultPage(0);

    try {
      const response = await fetch(
        API_BASE_URL,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            query,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        data.success === false
      ) {
        throw new Error(
          data.message ||
            "Query execution failed."
        );
      }

      setResult(data);

      setResultPage(0);

      setAttempts(
        (previous) =>
          previous + 1
      );
    } catch (err) {
      console.error(
        "SQL execution error:",
        err
      );

      setError(
        err.message ||
          "Unable to execute the query. Please check your backend."
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // RESET QUERY
  // ==========================================================

  const handleReset = () => {
    setQuery("");

    setResult(null);

    setError("");

    setResultPage(0);
  };

  // ==========================================================
  // CLEAR RESULT
  // ==========================================================

  const handleClearResult = () => {
    setResult(null);

    setError("");

    setResultPage(0);
  };

  // ==========================================================
  // LOAD SAMPLE QUERY
  // ==========================================================

  const handleLoadSample = (
    sampleQuery
  ) => {
    setQuery(sampleQuery);

    setResult(null);

    setError("");

    setResultPage(0);
  };

  // ==========================================================
  // COPY QUERY
  // ==========================================================

  const handleCopyQuery = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        query
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error(
        "Unable to copy query:",
        err
      );
    }
  };

  // ==========================================================
  // RESULT ROWS
  // ==========================================================

  const resultRows = normalizeRows(result);

  const totalResultPages = Math.max(
    1,
    Math.ceil(
      resultRows.length /
        RESULT_ROWS_PER_PAGE
    )
  );

  const visibleResultRows =
    resultRows.slice(
      resultPage *
        RESULT_ROWS_PER_PAGE,

      (resultPage + 1) *
        RESULT_ROWS_PER_PAGE
    );

  // ==========================================================
  // RESULT PAGINATION
  // ==========================================================

  const goToNextResultPage = () => {
    setResultPage((previous) =>
      Math.min(
        previous + 1,
        totalResultPages - 1
      )
    );
  };

  const goToPreviousResultPage = () => {
    setResultPage((previous) =>
      Math.max(previous - 1, 0)
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#050505] text-white">

      {/* ====================================================
          TOP NAVIGATION
      ===================================================== */}

      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-red-950/50 bg-[#070707]/95 px-4 backdrop-blur-xl sm:px-6">

        {/* LEFT */}

        <div className="flex items-center gap-3">

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="group flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-[#090909] text-zinc-500 transition hover:border-red-800/70 hover:bg-red-950/20 hover:text-white"
            title="Back to Dashboard"
          >
            <ArrowLeft
              size={16}
              className="transition-transform group-hover:-translate-x-0.5"
            />
          </button>

          <div className="h-6 w-px bg-zinc-900" />

          <div className="flex items-center gap-3">

            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-700 shadow-lg shadow-red-950/30">
              <Database size={17} />
            </div>

            <div>

              <h1 className="text-sm font-black tracking-tight">
                SQL
                <span className="text-red-600">
                  Forge
                </span>
              </h1>

              <p className="text-[9px] uppercase tracking-[0.22em] text-zinc-600">
                Free Practice
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT */}

        <div className="flex items-center gap-2 sm:gap-3">

          <div className="hidden items-center gap-2 rounded-lg border border-zinc-900 bg-[#090909] px-3 py-2 text-xs text-zinc-500 sm:flex">

            <Database
              size={14}
              className="text-red-500"
            />

            MySQL

          </div>

          <div className="flex items-center gap-2 rounded-lg border border-green-900/40 bg-green-950/10 px-3 py-2 text-[10px] font-semibold text-green-500">

            <span className="h-1.5 w-1.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />

            Playground

          </div>

        </div>

      </header>

      {/* ====================================================
          MAIN WORKSPACE
      ===================================================== */}

      <main className="mx-auto max-w-[1800px]">

        <div className="grid min-h-[calc(100vh-4rem)] grid-cols-1 xl:grid-cols-[280px_minmax(0,1fr)_320px]">

          {/* ==================================================
              LEFT SIDEBAR
          ================================================== */}

          <aside className="border-b border-zinc-900 bg-[#080808] xl:border-b-0 xl:border-r">

            <div className="p-5">

              {/* Practice tools */}

              <button
                onClick={() =>
                  setToolsOpen(
                    !toolsOpen
                  )
                }
                className="mb-5 flex w-full items-center justify-between text-left"
              >

                <div className="flex items-center gap-2">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-900/40 bg-red-950/20">

                    <Terminal
                      size={15}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                      Practice Tools
                    </p>

                    <p className="mt-0.5 text-[9px] text-zinc-700">
                      Free SQL playground
                    </p>

                  </div>

                </div>

                {toolsOpen ? (
                  <ChevronUp
                    size={14}
                    className="text-zinc-700"
                  />
                ) : (
                  <ChevronDown
                    size={14}
                    className="text-zinc-700"
                  />
                )}

              </button>

              {toolsOpen && (
                <div className="space-y-3">

                  {/* Objective */}

                  <div className="rounded-xl border border-zinc-900 bg-[#050505] p-4">

                    <div className="flex items-start gap-3">

                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-950/30">

                        <Zap
                          size={15}
                          className="text-red-500"
                        />

                      </div>

                      <div>

                        <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                          Objective
                        </p>

                        <p className="mt-1 text-xs font-semibold leading-5 text-zinc-300">
                          Explore the database and practice SQL freely.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* SQL Tips */}

                  <div className="rounded-xl border border-zinc-900 bg-[#050505]">

                    <div className="flex items-center justify-between border-b border-zinc-900 px-4 py-3">

                      <div className="flex items-center gap-2">

                        <Sparkles
                          size={13}
                          className="text-red-500"
                        />

                        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                          SQL Tips
                        </span>

                      </div>

                      <ChevronDown
                        size={13}
                        className="text-zinc-700"
                      />

                    </div>

                    <div className="space-y-3 p-4">

                      <div className="flex gap-3">

                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />

                        <p className="text-[10px] leading-5 text-zinc-600">
                          Start with SELECT to explore your data.
                        </p>

                      </div>

                      <div className="flex gap-3">

                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />

                        <p className="text-[10px] leading-5 text-zinc-600">
                          Use WHERE to filter rows.
                        </p>

                      </div>

                      <div className="flex gap-3">

                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-600" />

                        <p className="text-[10px] leading-5 text-zinc-600">
                          Use JOIN when information is spread across tables.
                        </p>

                      </div>

                    </div>

                  </div>

                  {/* Attempts */}

                  <div className="rounded-xl border border-zinc-900 bg-[#050505] p-4">

                    <div className="mb-2 flex items-center justify-between">

                      <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
                        Attempts
                      </span>

                      <span className="text-xs font-bold text-zinc-400">
                        {attempts}
                      </span>

                    </div>

                    <div className="h-1 overflow-hidden rounded-full bg-zinc-900">

                      <div
                        className="h-full rounded-full bg-red-700 transition-all"
                        style={{
                          width:
                            attempts === 0
                              ? "0%"
                              : `${Math.min(
                                  attempts * 10,
                                  100
                                )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Practice Mode */}

                  <div className="rounded-xl border border-red-950/40 bg-red-950/10 p-4">

                    <div className="flex items-center gap-2">

                      <BookOpen
                        size={13}
                        className="text-red-500"
                      />

                      <span className="text-[9px] font-bold uppercase tracking-widest text-red-500">
                        Practice Mode
                      </span>

                    </div>

                    <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                      There are no levels or restrictions here.
                      Experiment, make mistakes, and inspect your results.
                    </p>

                  </div>

                </div>
              )}

              {/* Database summary */}

              <div className="mt-6 rounded-xl border border-zinc-900 bg-[#050505] p-4">

                <div className="mb-3 flex items-center gap-2">

                  <Database
                    size={14}
                    className="text-red-500"
                  />

                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                    Connected Database
                  </span>

                </div>

                <p className="font-mono text-xs font-semibold text-zinc-300">
                  {databaseName}
                </p>

                <div className="mt-2 flex items-center gap-2">

                  <CircleCheck
                    size={12}
                    className="text-green-500"
                  />

                  <span className="text-[9px] text-green-500">
                    Connection active
                  </span>

                </div>

              </div>

            </div>

          </aside>

          {/* ==================================================
              CENTER EDITOR
          ================================================== */}

          <section className="flex min-h-[720px] flex-col bg-[#050505]">

            {/* Editor header */}

            <div className="flex h-14 items-center justify-between border-b border-zinc-900 bg-[#090909] px-4 sm:px-5">

              <div className="flex items-center gap-3">

                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-950">

                  <Terminal
                    size={14}
                    className="text-red-500"
                  />

                </div>

                <div>

                  <p className="text-xs font-semibold text-zinc-300">
                    query.sql
                  </p>

                  <p className="text-[9px] text-zinc-700">
                    SQL Editor
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <div className="hidden items-center gap-2 text-[9px] uppercase tracking-widest text-zinc-700 sm:flex">

                  <span className="h-1.5 w-1.5 rounded-full bg-red-600" />

                  Editable

                </div>

                <button
                  onClick={
                    handleCopyQuery
                  }
                  disabled={
                    !query.trim()
                  }
                  className="flex h-8 items-center gap-2 rounded-lg px-3 text-[10px] font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
                  title="Copy query"
                >

                  {copied ? (
                    <>
                      <Check
                        size={13}
                        className="text-green-500"
                      />

                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={13} />

                      Copy
                    </>
                  )}

                </button>

              </div>

            </div>

            {/* Editor */}

            <div className="min-h-[480px] flex-1 overflow-hidden">

              <SQLEditor
                value={query}
                onChange={(value) =>
                  setQuery(
                    value || ""
                  )
                }
              />

            </div>

            {/* Editor footer */}

            <div className="flex flex-col gap-3 border-t border-zinc-900 bg-[#090909] p-4 sm:flex-row sm:items-center sm:justify-between">

              <div className="flex items-center gap-2">

                <button
                  onClick={
                    handleReset
                  }
                  disabled={loading}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300 disabled:opacity-40"
                >

                  <RotateCcw
                    size={14}
                  />

                  Reset

                </button>

                <button
                  onClick={
                    handleClearResult
                  }
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300"
                >

                  <Trash2
                    size={14}
                  />

                  Clear

                </button>

              </div>

              <button
                onClick={
                  handleRunQuery
                }
                disabled={loading}
                className="group flex h-11 items-center justify-center gap-2 rounded-xl bg-red-700 px-7 text-xs font-bold shadow-lg shadow-red-950/30 transition hover:bg-red-600 hover:shadow-red-900/30 disabled:cursor-not-allowed disabled:opacity-50"
              >

                <Play
                  size={14}
                  fill="currentColor"
                  className="transition group-hover:scale-110"
                />

                {loading
                  ? "Running Query..."
                  : "Run Query"}

              </button>

            </div>

          </section>

          {/* ==================================================
              RIGHT DATABASE SIDEBAR
          ================================================== */}

          <aside className="border-t border-zinc-900 bg-[#080808] xl:border-l xl:border-t-0">

            <div className="flex h-full flex-col">

              {/* Database header */}

              <div className="border-b border-zinc-900 p-5">

                <div className="flex items-start justify-between">

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-950/30">

                      <Database
                        size={15}
                        className="text-red-500"
                      />

                    </div>

                    <div>

                      <p className="text-xs font-black text-zinc-200">
                        Database
                      </p>

                      <p className="mt-0.5 text-[9px] text-zinc-700">
                        {databaseName}
                      </p>

                    </div>

                  </div>

                  <span className="rounded-full border border-zinc-800 bg-zinc-950 px-2.5 py-1 text-[9px] font-semibold text-zinc-400">
                    {tables.length} tables
                  </span>

                </div>

              </div>

              {/* Available tables */}

              <div className="flex-1 p-5">

                <div className="mb-4 flex items-center justify-between">

                  <div>

                    <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">
                      Available Tables
                    </p>

                  </div>

                  <span className="text-[9px] font-semibold text-zinc-500">
                    {tablePage + 1} /{" "}
                    {totalTablePages}
                  </span>

                </div>

                {/* Loading */}

                {tablesLoading && (
                  <div className="space-y-2">

                    {Array.from({
                      length: 7,
                    }).map(
                      (_, index) => (
                        <div
                          key={index}
                          className="h-12 animate-pulse rounded-xl border border-zinc-900 bg-[#050505]"
                        />
                      )
                    )}

                  </div>
                )}

                {/* Error */}

                {!tablesLoading &&
                  tablesError && (
                    <div className="rounded-xl border border-red-950/50 bg-red-950/10 p-4">

                      <p className="text-[10px] font-semibold text-red-500">
                        Unable to load schema
                      </p>

                      <p className="mt-2 text-[9px] leading-5 text-zinc-700">
                        {tablesError}
                      </p>

                    </div>
                  )}

                {/* Tables */}

                {!tablesLoading &&
                  !tablesError && (
                    <div className="space-y-2">

                      {visibleTables.map(
                        (tableName) => {
                          const isSelected =
                            selectedTable ===
                            tableName;

                          return (
                            <button
                              key={
                                tableName
                              }
                              onClick={() =>
                                openTable(
                                  tableName
                                )
                              }
                              className={`group flex w-full items-center justify-between rounded-xl border px-3 py-3 text-left transition ${
                                isSelected
                                  ? "border-red-700/50 bg-red-950/15 shadow-lg shadow-red-950/10"
                                  : "border-zinc-800/80 bg-[#070707] hover:border-red-700/40 hover:bg-red-950/10"
                              }`}
                            >

                              <div className="flex min-w-0 items-center gap-3">

                                <div
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border transition ${
                                    isSelected
                                      ? "border-red-800/60 bg-red-950/30"
                                      : "border-zinc-800 bg-zinc-950 group-hover:border-red-900/50"
                                  }`}
                                >

                                  <Table2
                                    size={13}
                                    className={`transition ${
                                      isSelected
                                        ? "text-red-500"
                                        : "text-zinc-500 group-hover:text-red-500"
                                    }`}
                                  />

                                </div>

                                <span
                                  className={`truncate font-mono text-[10px] font-semibold transition ${
                                    isSelected
                                      ? "text-red-400"
                                      : "text-zinc-300 group-hover:text-red-400"
                                  }`}
                                >
                                  {
                                    tableName
                                  }
                                </span>

                              </div>

                              <ChevronRight
                                size={13}
                                className={`shrink-0 transition ${
                                  isSelected
                                    ? "text-red-500"
                                    : "text-zinc-600 group-hover:translate-x-0.5 group-hover:text-red-500"
                                }`}
                              />

                            </button>
                          );
                        }
                      )}

                      {!visibleTables.length && (
                        <div className="rounded-xl border border-zinc-900 bg-[#050505] p-5 text-center">

                          <Database
                            size={18}
                            className="mx-auto text-zinc-800"
                          />

                          <p className="mt-3 text-[10px] font-semibold text-zinc-600">
                            No tables found
                          </p>

                        </div>
                      )}

                    </div>
                  )}

              </div>

              {/* Table pagination */}

              <div className="border-t border-zinc-900 p-4">

                <div className="flex items-center justify-between">

                  <button
                    onClick={
                      goToPreviousTablePage
                    }
                    disabled={
                      tablePage === 0
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-[#050505] text-zinc-600 transition hover:border-red-900/50 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-25"
                    title="Previous tables"
                  >

                    <ChevronLeft
                      size={14}
                    />

                  </button>

                  <div className="text-center">

                    <p className="text-[9px] font-bold text-zinc-600">
                      {tables.length} tables
                    </p>

                    <p className="mt-0.5 text-[8px] text-zinc-800">
                      7 tables per page
                    </p>

                  </div>

                  <button
                    onClick={
                      goToNextTablePage
                    }
                    disabled={
                      tablePage >=
                      totalTablePages - 1
                    }
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-[#050505] text-zinc-600 transition hover:border-red-900/50 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-25"
                    title="Next tables"
                  >

                    <ChevronRight
                      size={14}
                    />

                  </button>

                </div>

              </div>

            </div>

          </aside>

        </div>

      </main>

      {/* ====================================================
          SAMPLE QUERIES + QUERY RESULT
      ===================================================== */}

      <section className="border-t border-zinc-900 bg-[#070707]">

        <div className="mx-auto max-w-[1800px] p-4 sm:p-6">

          <div className="grid gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">

            {/* =================================================
                SAMPLE QUERIES
            ================================================== */}

            <aside className="rounded-2xl border border-zinc-900 bg-[#080808]">

              <button
                onClick={() =>
                  setSamplesOpen(
                    !samplesOpen
                  )
                }
                className="flex w-full items-center justify-between border-b border-zinc-900 p-4 text-left"
              >

                <div className="flex items-center gap-3">

                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-950/20">

                    <BookOpen
                      size={14}
                      className="text-red-500"
                    />

                  </div>

                  <div>

                    <p className="text-xs font-black">
                      Sample Queries
                    </p>

                    <p className="text-[9px] text-zinc-700">
                      Generated from your database
                    </p>

                  </div>

                </div>

                {samplesOpen ? (
                  <ChevronUp
                    size={14}
                    className="text-zinc-700"
                  />
                ) : (
                  <ChevronDown
                    size={14}
                    className="text-zinc-700"
                  />
                )}

              </button>

              {samplesOpen && (
                <div className="space-y-2 p-4">

                  {sampleQueries.length >
                  0 ? (
                    sampleQueries.map(
                      (
                        sample,
                        index
                      ) => (
                        <button
                          key={`${sample.title}-${index}`}
                          onClick={() =>
                            handleLoadSample(
                              sample.query
                            )
                          }
                          className="group w-full rounded-xl border border-zinc-900 bg-[#050505] p-3 text-left transition hover:border-red-950/70 hover:bg-red-950/10"
                        >

                          <div className="flex items-start justify-between gap-3">

                            <span className="text-[10px] font-semibold text-zinc-500 transition group-hover:text-zinc-200">
                              {
                                sample.title
                              }
                            </span>

                            <ArrowRight
                              size={12}
                              className="shrink-0 text-zinc-800 transition group-hover:translate-x-0.5 group-hover:text-red-500"
                            />

                          </div>

                          <p className="mt-1 text-[9px] leading-4 text-zinc-700">
                            {
                              sample.description
                            }
                          </p>

                        </button>
                      )
                    )
                  ) : (
                    <div className="py-8 text-center">

                      <BookOpen
                        size={18}
                        className="mx-auto text-zinc-800"
                      />

                      <p className="mt-3 text-[10px] text-zinc-700">
                        Load the database schema to see sample queries.
                      </p>

                    </div>
                  )}

                </div>
              )}

            </aside>

            {/* =================================================
                QUERY RESULT
            ================================================== */}

            <section className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#080808]">

              <div className="flex items-center justify-between border-b border-zinc-900 p-4">

                <div className="flex items-center gap-3">

                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      error
                        ? "bg-red-950/30"
                        : "bg-zinc-950"
                    }`}
                  >

                    {error ? (
                      <Zap
                        size={16}
                        className="text-red-500"
                      />
                    ) : (
                      <Database
                        size={16}
                        className="text-zinc-600"
                      />
                    )}

                  </div>

                  <div>

                    <h3 className="text-xs font-black">
                      Query Result
                    </h3>

                    <p className="text-[9px] text-zinc-700">
                      Output from your SQL query
                    </p>

                  </div>

                </div>

                <div className="flex items-center gap-3">

                  {result && (
                    <span className="rounded-full border border-zinc-900 bg-zinc-950 px-3 py-1 text-[9px] font-semibold text-zinc-600">
                      {resultRows.length} rows
                    </span>
                  )}

                  {(result || error) && (
                    <button
                      onClick={
                        handleClearResult
                      }
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-[10px] font-semibold text-zinc-600 transition hover:bg-zinc-900 hover:text-zinc-300"
                    >

                      <Trash2
                        size={13}
                      />

                      Clear

                    </button>
                  )}

                </div>

              </div>

              <div className="p-4">

                {result || error ? (
                  <>
                    <QueryResult
                      result={
                        result
                          ? {
                              ...result,
                              rows: visibleResultRows,
                            }
                          : null
                      }
                      error={error}
                      onClear={
                        handleClearResult
                      }
                    />

                    {/* =========================================
                        RESULT PAGINATION
                    ========================================== */}

                    {result &&
                      resultRows.length >
                        RESULT_ROWS_PER_PAGE && (
                        <div className="mt-4 flex flex-col gap-3 border-t border-zinc-900 pt-4 sm:flex-row sm:items-center sm:justify-between">

                          <div className="text-[10px] text-zinc-600">

                            Showing{" "}

                            <span className="font-semibold text-zinc-400">
                              {
                                resultPage *
                                  RESULT_ROWS_PER_PAGE +
                                1
                              }
                            </span>

                            {" – "}

                            <span className="font-semibold text-zinc-400">
                              {Math.min(
                                (resultPage +
                                  1) *
                                  RESULT_ROWS_PER_PAGE,
                                resultRows.length
                              )}
                            </span>

                            {" of "}

                            <span className="font-semibold text-zinc-400">
                              {
                                resultRows.length
                              }
                            </span>

                            {" rows"}

                          </div>

                          <div className="flex items-center gap-2">

                            <button
                              onClick={
                                goToPreviousResultPage
                              }
                              disabled={
                                resultPage ===
                                0
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-[#050505] text-zinc-600 transition hover:border-red-900/50 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-25"
                              title="Previous page"
                            >

                              <ChevronLeft
                                size={14}
                              />

                            </button>

                            <span className="min-w-[70px] text-center text-[10px] font-semibold text-zinc-600">
                              {resultPage +
                                1}{" "}
                              /{" "}
                              {
                                totalResultPages
                              }
                            </span>

                            <button
                              onClick={
                                goToNextResultPage
                              }
                              disabled={
                                resultPage >=
                                totalResultPages -
                                  1
                              }
                              className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-900 bg-[#050505] text-zinc-600 transition hover:border-red-900/50 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-25"
                              title="Next page"
                            >

                              <ChevronRight
                                size={14}
                              />

                            </button>

                          </div>

                        </div>
                      )}
                  </>
                ) : (
                  <div className="flex min-h-[170px] flex-col items-center justify-center text-center">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-900 bg-zinc-950">

                      <Terminal
                        size={17}
                        className="text-zinc-800"
                      />

                    </div>

                    <p className="mt-3 text-xs font-bold text-zinc-700">
                      No query result yet
                    </p>

                    <p className="mt-1 max-w-sm text-[10px] leading-5 text-zinc-800">

                      Write your SQL query and click

                      <span className="mx-1 text-zinc-700">
                        Run Query
                      </span>

                      to inspect the output.

                    </p>

                  </div>
                )}

              </div>

            </section>

          </div>

        </div>

      </section>

      {/* ====================================================
          SELECTED TABLE MODAL
      ===================================================== */}

      {selectedTable && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">

          <div className="flex max-h-[90vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#080808] shadow-2xl shadow-black">

            {/* Modal header */}

            <div className="flex items-center justify-between border-b border-zinc-900 bg-[#090909] px-5 py-4">

              <div className="flex min-w-0 items-center gap-3">

                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-950/30">

                  <Table2
                    size={15}
                    className="text-red-500"
                  />

                </div>

                <div className="min-w-0">

                  <div className="flex items-center gap-2">

                    <h2 className="truncate font-mono text-sm font-bold text-zinc-200">
                      {selectedTable}
                    </h2>

                    <Eye
                      size={13}
                      className="text-zinc-700"
                    />

                  </div>

                  <p className="text-[9px] text-zinc-700">
                    {
                      selectedTableRows.length
                    }{" "}
                    records
                  </p>

                </div>

              </div>

              <button
                onClick={
                  closeTable
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-zinc-900 text-zinc-600 transition hover:border-red-900/50 hover:bg-red-950/20 hover:text-red-400"
                title="Close"
              >

                <X size={16} />

              </button>

            </div>

            {/* Modal content */}

            <div className="min-h-0 flex-1 overflow-auto">

              {selectedTableLoading && (
                <div className="flex min-h-[350px] flex-col items-center justify-center">

                  <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-800 border-t-red-600" />

                  <p className="mt-4 text-xs text-zinc-600">
                    Loading{" "}
                    {
                      selectedTable
                    }
                    ...
                  </p>

                </div>
              )}

              {!selectedTableLoading &&
                selectedTableError && (
                  <div className="flex min-h-[300px] items-center justify-center p-6">

                    <div className="max-w-md rounded-xl border border-red-950/50 bg-red-950/10 p-5 text-center">

                      <p className="text-xs font-bold text-red-500">
                        Unable to load table
                      </p>

                      <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                        {
                          selectedTableError
                        }
                      </p>

                    </div>

                  </div>
                )}

              {!selectedTableLoading &&
                !selectedTableError &&
                selectedTableRows.length ===
                  0 && (
                  <div className="flex min-h-[300px] flex-col items-center justify-center">

                    <Database
                      size={24}
                      className="text-zinc-800"
                    />

                    <p className="mt-4 text-xs font-semibold text-zinc-600">
                      No records found
                    </p>

                    <p className="mt-1 text-[10px] text-zinc-800">
                      This table is currently empty.
                    </p>

                  </div>
                )}

              {!selectedTableLoading &&
                !selectedTableError &&
                selectedTableRows.length >
                  0 && (
                  <div className="overflow-x-auto">

                    <table className="min-w-full border-collapse">

                      <thead>

                        <tr className="border-b border-zinc-900 bg-[#0b0b0b]">

                          {selectedTableColumns.map(
                            (column) => (
                              <th
                                key={column}
                                className="whitespace-nowrap border-r border-zinc-900 px-4 py-3 text-left text-[9px] font-bold uppercase tracking-widest text-zinc-600 last:border-r-0"
                              >

                                <div className="flex items-center gap-2">

                                  <Columns3
                                    size={11}
                                    className="text-zinc-800"
                                  />

                                  {
                                    column
                                  }

                                </div>

                              </th>
                            )
                          )}

                        </tr>

                      </thead>

                      <tbody>

                        {selectedTableRows.map(
                          (
                            row,
                            rowIndex
                          ) => (
                            <tr
                              key={
                                rowIndex
                              }
                              className="border-b border-zinc-900/70 transition hover:bg-red-950/5"
                            >

                              {selectedTableColumns.map(
                                (
                                  column
                                ) => (
                                  <td
                                    key={`${rowIndex}-${column}`}
                                    className="max-w-[320px] border-r border-zinc-900/70 px-4 py-3 font-mono text-[10px] text-zinc-500 last:border-r-0"
                                  >

                                    <span
                                      className={
                                        row[
                                          column
                                        ] ===
                                          null ||
                                        row[
                                          column
                                        ] ===
                                          undefined
                                          ? "text-zinc-800"
                                          : ""
                                      }
                                    >
                                      {formatCellValue(
                                        row[
                                          column
                                        ]
                                      )}
                                    </span>

                                  </td>
                                )
                              )}

                            </tr>
                          )
                        )}

                      </tbody>

                    </table>

                  </div>
                )}

            </div>

            {/* Modal footer */}

            <div className="flex items-center justify-between border-t border-zinc-900 bg-[#090909] px-5 py-3">

              <div className="flex items-center gap-2">

                <Database
                  size={12}
                  className="text-zinc-700"
                />

                <span className="text-[9px] text-zinc-700">
                  {databaseName}
                </span>

                <span className="text-zinc-900">
                  /
                </span>

                <span className="font-mono text-[9px] text-zinc-600">
                  {selectedTable}
                </span>

              </div>

              <button
                onClick={
                  closeTable
                }
                className="rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2 text-[10px] font-semibold text-zinc-500 transition hover:border-red-900/50 hover:text-zinc-200"
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

export default Practice;