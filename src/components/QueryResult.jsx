import {
  CheckCircle2,
  AlertCircle,
  Database,
  Clock3,
  Rows3,
  Copy,
  Check,
  Trash2,
  Terminal,
  ChevronDown,
  Braces,
  Hash,
} from "lucide-react";

import { useMemo, useState } from "react";

function QueryResult({
  result,
  error,
  onClear,
}) {
  const [copied, setCopied] = useState(false);

  // =========================================================
  // NORMALIZE RESULT DATA
  // =========================================================

  const rows = useMemo(() => {
    if (!result) return [];

    if (Array.isArray(result)) {
      return result;
    }

    if (Array.isArray(result.rows)) {
      return result.rows;
    }

    if (Array.isArray(result.data)) {
      return result.data;
    }

    return [];
  }, [result]);

  // =========================================================
  // TABLE COLUMNS
  // =========================================================

  const columns = useMemo(() => {
    if (!rows.length) return [];

    const keys = new Set();

    rows.forEach((row) => {
      if (row && typeof row === "object") {
        Object.keys(row).forEach((key) => {
          keys.add(key);
        });
      }
    });

    return Array.from(keys);
  }, [rows]);

  // =========================================================
  // EXECUTION TIME
  // =========================================================

  const executionTime =
    result?.executionTime ??
    result?.execution_time ??
    result?.duration ??
    null;

  // =========================================================
  // ROW COUNT
  // =========================================================

  const rowCount =
    result?.rowCount ??
    result?.row_count ??
    rows.length;

  // =========================================================
  // COPY RESULT
  // =========================================================

  const handleCopyResult = async () => {
    try {
      const text = rows
        .map((row) =>
          columns
            .map((column) => {
              const value = row[column];

              if (
                value === null ||
                value === undefined
              ) {
                return "NULL";
              }

              return String(value);
            })
            .join("\t")
        )
        .join("\n");

      const header = columns.join("\t");

      await navigator.clipboard.writeText(
        `${header}\n${text}`
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (err) {
      console.error(
        "Unable to copy result:",
        err
      );
    }
  };

  // =========================================================
  // NOTHING TO SHOW
  // =========================================================

  if (!result && !error) {
    return null;
  }

  // =========================================================
  // ERROR RESULT
  // =========================================================

  if (error) {
    return (
      <div className="overflow-hidden rounded-2xl border border-red-950/70 bg-[#080808] shadow-2xl shadow-red-950/10">

        {/* =================================================
            ERROR HEADER
        ================================================== */}

        <div className="border-b border-red-950/60 bg-gradient-to-r from-red-950/30 via-red-950/10 to-transparent">

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-900/60 bg-red-950/30">

                <AlertCircle
                  size={18}
                  className="text-red-500"
                />

              </div>

              <div>

                <div className="flex items-center gap-2">

                  <h3 className="text-sm font-bold text-red-400">
                    Query Execution Failed
                  </h3>

                  <span className="rounded-full border border-red-900/50 bg-red-950/30 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-red-500">
                    ERROR
                  </span>

                </div>

                <p className="mt-1 text-[10px] text-zinc-600">
                  MySQL returned an error while
                  processing your query.
                </p>

              </div>

            </div>


            {/* Clear */}

            <button
              onClick={onClear}
              className="flex items-center justify-center gap-2 rounded-lg border border-zinc-900 px-3 py-2 text-[10px] font-semibold text-zinc-600 transition hover:border-red-900/50 hover:bg-red-950/10 hover:text-red-400"
            >

              <Trash2 size={13} />

              Clear

            </button>

          </div>

        </div>


        {/* =================================================
            ERROR CONSOLE
        ================================================== */}

        <div className="p-5">

          <div className="overflow-hidden rounded-xl border border-red-950/50 bg-[#030303]">

            {/* Terminal header */}

            <div className="flex items-center gap-2 border-b border-red-950/40 bg-[#080808] px-4 py-3">

              <div className="flex gap-1.5">

                <span className="h-2.5 w-2.5 rounded-full bg-red-700" />

                <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />

                <span className="h-2.5 w-2.5 rounded-full bg-zinc-800" />

              </div>

              <div className="ml-2 flex items-center gap-2">

                <Terminal
                  size={12}
                  className="text-zinc-700"
                />

                <span className="text-[10px] text-zinc-700">
                  mysql://practice_db
                </span>

              </div>

            </div>


            {/* Error body */}

            <div className="p-5">

              <div className="flex gap-3">

                <span className="select-none text-xs font-bold text-red-700">
                  ERROR
                </span>

                <pre className="whitespace-pre-wrap break-words font-mono text-xs leading-6 text-red-400">
                  {error}
                </pre>

              </div>

            </div>

          </div>


          {/* Error suggestion */}

          <div className="mt-4 flex gap-3 rounded-xl border border-zinc-900 bg-[#050505] p-4">

            <div className="mt-0.5">

              <Braces
                size={14}
                className="text-zinc-600"
              />

            </div>

            <div>

              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">
                Debugging tip
              </p>

              <p className="mt-1 text-xs leading-5 text-zinc-600">
                Check your table names, column names,
                SQL syntax, and the schema shown in
                the database panel.

              </p>

            </div>

          </div>

        </div>

      </div>
    );
  }

  // =========================================================
  // SUCCESS RESULT
  // =========================================================

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-900 bg-[#080808] shadow-2xl shadow-black/30">

      {/* =====================================================
          TOP SUCCESS BANNER
      ====================================================== */}

      <div className="relative overflow-hidden border-b border-zinc-900">

        {/* Background glow */}

        <div className="pointer-events-none absolute right-[-100px] top-[-120px] h-[250px] w-[250px] rounded-full bg-green-900/10 blur-[100px]" />


        <div className="relative flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">

          {/* Status */}

          <div className="flex items-center gap-3">

            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-green-900/50 bg-green-950/20">

              <CheckCircle2
                size={19}
                className="text-green-500"
              />

              <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-green-500 shadow-lg shadow-green-500/50" />

            </div>


            <div>

              <div className="flex flex-wrap items-center gap-2">

                <h3 className="text-sm font-bold text-zinc-200">
                  Query Executed Successfully
                </h3>

                <span className="rounded-full border border-green-900/40 bg-green-950/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-green-500">
                  SUCCESS
                </span>

              </div>

              <p className="mt-1 text-[10px] text-zinc-600">
                Your SQL query completed without
                errors.
              </p>

            </div>

          </div>


          {/* Actions */}

          <div className="flex items-center gap-2">

            <button
              onClick={handleCopyResult}
              disabled={!rows.length}
              className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-[#050505] px-3 py-2 text-[10px] font-semibold text-zinc-600 transition hover:border-zinc-700 hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-30"
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
                  Copy Result
                </>
              )}

            </button>


            <button
              onClick={onClear}
              className="flex items-center gap-2 rounded-lg border border-zinc-900 bg-[#050505] px-3 py-2 text-[10px] font-semibold text-zinc-600 transition hover:border-red-900/50 hover:bg-red-950/10 hover:text-red-400"
            >

              <Trash2 size={13} />

              Clear

            </button>

          </div>

        </div>

      </div>


      {/* =====================================================
          QUERY METRICS
      ====================================================== */}

      <div className="grid grid-cols-2 border-b border-zinc-900 sm:grid-cols-4">

        {/* Rows */}

        <div className="border-b border-zinc-900 p-4 sm:border-b-0 sm:border-r">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20">

              <Rows3
                size={13}
                className="text-red-500"
              />

            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
              Rows
            </span>

          </div>

          <p className="mt-2 text-lg font-black text-zinc-200">
            {rowCount}
          </p>

        </div>


        {/* Execution time */}

        <div className="border-b border-zinc-900 p-4 sm:border-b-0 sm:border-r">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20">

              <Clock3
                size={13}
                className="text-red-500"
              />

            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
              Time
            </span>

          </div>

          <p className="mt-2 text-lg font-black text-zinc-200">

            {executionTime !== null
              ? `${executionTime} ms`
              : "—"}

          </p>

        </div>


        {/* Database */}

        <div className="border-r border-zinc-900 p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20">

              <Database
                size={13}
                className="text-red-500"
              />

            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
              Database
            </span>

          </div>

          <p className="mt-2 truncate text-xs font-bold text-zinc-400">
            practice_db
          </p>

        </div>


        {/* Columns */}

        <div className="p-4">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-950/20">

              <Hash
                size={13}
                className="text-red-500"
              />

            </div>

            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
              Columns
            </span>

          </div>

          <p className="mt-2 text-lg font-black text-zinc-200">
            {columns.length}
          </p>

        </div>

      </div>


      {/* =====================================================
          RESULT TABLE HEADER
      ====================================================== */}

      <div className="flex flex-col gap-3 border-b border-zinc-900 bg-[#090909] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-950">

            <Terminal
              size={14}
              className="text-red-500"
            />

          </div>

          <div>

            <div className="flex items-center gap-2">

              <h4 className="text-xs font-bold text-zinc-300">
                Result Set
              </h4>

              <span className="rounded-md border border-zinc-900 bg-zinc-950 px-2 py-0.5 text-[9px] text-zinc-600">
                {rows.length}{" "}
                {rows.length === 1
                  ? "row"
                  : "rows"}
              </span>

            </div>

            <p className="mt-0.5 text-[9px] text-zinc-700">
              Query output from MySQL
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2 text-[9px] text-zinc-700">

          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />

          Live result

        </div>

      </div>


      {/* =====================================================
          EMPTY RESULT
      ====================================================== */}

      {rows.length === 0 ? (

        <div className="flex min-h-[220px] items-center justify-center p-8">

          <div className="max-w-sm text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-900 bg-zinc-950">

              <Rows3
                size={21}
                className="text-zinc-700"
              />

            </div>

            <h4 className="mt-4 text-sm font-bold text-zinc-400">
              Query executed successfully
            </h4>

            <p className="mt-2 text-xs leading-5 text-zinc-700">
              The query returned no rows. This can be
              expected for UPDATE, DELETE, or filtered
              SELECT statements.
            </p>

          </div>

        </div>

      ) : (

        /* ===================================================
           TABLE
        ==================================================== */

        <div className="overflow-x-auto">

          <table className="w-full min-w-[650px] border-collapse text-left">

            {/* TABLE HEADER */}

            <thead>

              <tr className="border-b border-zinc-900 bg-[#050505]">

                {/* Row number */}

                <th className="sticky left-0 z-10 w-14 border-r border-zinc-900 bg-[#050505] px-4 py-3 text-center text-[9px] font-bold uppercase tracking-widest text-zinc-700">

                  #

                </th>


                {columns.map((column) => (

                  <th
                    key={column}
                    className="whitespace-nowrap border-r border-zinc-900 px-5 py-3 last:border-r-0"
                  >

                    <div className="flex items-center gap-2">

                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                        {column}
                      </span>

                      <span className="rounded-md border border-zinc-900 bg-zinc-950 px-1.5 py-0.5 text-[8px] text-zinc-700">
                        FIELD
                      </span>

                    </div>

                  </th>

                ))}

              </tr>

            </thead>


            {/* TABLE BODY */}

            <tbody>

              {rows.map((row, rowIndex) => (

                <tr
                  key={rowIndex}
                  className="group border-b border-zinc-900/80 transition hover:bg-red-950/[0.04]"
                >

                  {/* Row number */}

                  <td className="sticky left-0 z-10 border-r border-zinc-900 bg-[#080808] px-4 py-3 text-center font-mono text-[10px] text-zinc-700 group-hover:bg-[#0b0808]">

                    {String(rowIndex + 1).padStart(
                      2,
                      "0"
                    )}

                  </td>


                  {columns.map((column) => {

                    const value =
                      row?.[column];

                    const isNull =
                      value === null ||
                      value === undefined;

                    const valueType =
                      typeof value;

                    return (

                      <td
                        key={column}
                        className="border-r border-zinc-900/80 px-5 py-3 last:border-r-0"
                      >

                        {isNull ? (

                          <span className="rounded-md border border-zinc-900 bg-zinc-950 px-2 py-1 font-mono text-[9px] italic text-zinc-700">
                            NULL
                          </span>

                        ) : valueType ===
                          "number" ? (

                          <span className="font-mono text-xs text-red-400">
                            {value}
                          </span>

                        ) : (

                          <span className="text-xs text-zinc-400">
                            {String(value)}
                          </span>

                        )}

                      </td>

                    );
                  })}

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}


      {/* =====================================================
          TABLE FOOTER
      ====================================================== */}

      {rows.length > 0 && (

        <div className="flex flex-col gap-2 border-t border-zinc-900 bg-[#050505] px-5 py-3 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2">

            <div className="h-1.5 w-1.5 rounded-full bg-green-500" />

            <span className="text-[9px] text-zinc-700">
              {rows.length}{" "}
              {rows.length === 1
                ? "record"
                : "records"}{" "}
              returned
            </span>

          </div>

          <div className="flex items-center gap-3">

            <span className="text-[9px] text-zinc-800">
              MySQL
            </span>

            <span className="h-3 w-px bg-zinc-900" />

            <span className="text-[9px] text-zinc-800">
              practice_db
            </span>

          </div>

        </div>

      )}

    </div>
  );
}

export default QueryResult;