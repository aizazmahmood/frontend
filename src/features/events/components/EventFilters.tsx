import type { Filters, StatusFilter } from "../types";

interface Props {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
  onReset: () => void;
  isAdminOrMod: boolean;
}

export function EventFilters({ filters, onChange, onReset, isAdminOrMod }: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-4 space-y-3">
      <div className="flex flex-wrap gap-3 items-end">
        <div>
          <label className="block text-xs font-medium mb-1 text-slate-700">
            Scope
          </label>
          <select
            className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={filters.scope}
            onChange={(e) => onChange({ scope: e.target.value })}
          >
            <option value="mine">My events</option>
            <option value="org">Organization</option>
            {isAdminOrMod && <option value="all">All (admin)</option>}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-slate-700">
            Category
          </label>
          <input
            className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={filters.category}
            onChange={(e) => onChange({ category: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-xs font-medium mb-1 text-slate-700">
            Status
          </label>
          <select
            className="border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={filters.status}
            onChange={(e) =>
              onChange({ status: e.target.value as StatusFilter })
            }
          >
            <option value="">All</option>
            <option value="Pending">Pending</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        <div className="flex-1 min-w-[160px]">
          <label className="block text-xs font-medium mb-1 text-slate-700">
            Search
          </label>
          <input
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Search title..."
            value={filters.q}
            onChange={(e) => onChange({ q: e.target.value })}
          />
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            type="button"
            onClick={onReset}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50"
          >
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}
