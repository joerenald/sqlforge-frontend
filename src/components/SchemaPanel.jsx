import {
  Database,
  Table2,
  ChevronDown,
  KeyRound,
  Type,
  Hash,
} from "lucide-react";

const columns = [
  {
    name: "id",
    type: "INT",
    icon: Hash,
  },
  {
    name: "name",
    type: "VARCHAR",
    icon: Type,
  },
  {
    name: "department",
    type: "VARCHAR",
    icon: Type,
  },
  {
    name: "salary",
    type: "INT",
    icon: Hash,
  },
];

function SchemaPanel() {
  return (
    <aside className="w-64 shrink-0 border-r border-red-950/50 bg-[#080808]">
      <div className="border-b border-zinc-900 px-5 py-4">
        <div className="flex items-center gap-2">
          <Database size={16} className="text-red-500" />

          <span className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">
            Database
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 rounded-lg bg-red-950/20 px-3 py-2.5">
          <ChevronDown size={14} className="text-red-500" />

          <Table2 size={15} className="text-red-400" />

          <span className="text-sm font-semibold text-zinc-200">
            employees
          </span>
        </div>

        <div className="mt-2 space-y-1 pl-4">
          {columns.map((column) => {
            const Icon = column.icon;

            return (
              <div
                key={column.name}
                className="group flex items-center justify-between rounded-md px-3 py-2 transition hover:bg-red-950/20"
              >
                <div className="flex items-center gap-2">
                  <Icon
                    size={13}
                    className={
                      column.name === "id"
                        ? "text-yellow-500"
                        : "text-zinc-600"
                    }
                  />

                  <span className="text-xs text-zinc-400 group-hover:text-zinc-200">
                    {column.name}
                  </span>
                </div>

                <span className="text-[10px] text-zinc-700">
                  {column.type}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

export default SchemaPanel;