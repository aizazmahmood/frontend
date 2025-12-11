import type { EventItem } from "../types";

interface Props {
  events: EventItem[];
  loading: boolean;
  error: string | null;
  now: Date;
  selectedIds: number[];
  onToggleSelect: (id: number) => void;
  onToggleSelectAll: () => void;
  onEdit: (ev: EventItem) => void;
  onDelete: (id: number) => void;
}

export function EventsTable({
  events,
  loading,
  error,
  now,
  selectedIds,
  onToggleSelect,
  onToggleSelectAll,
  onEdit,
  onDelete,
}: Props) {
  return (
    <section className="bg-white rounded-2xl shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-semibold text-slate-900">Events</h2>
        {loading && (
          <span className="text-xs text-slate-500">Loading events...</span>
        )}
      </div>

      {/* Highlight legend */}
      <div className="flex flex-wrap items-center gap-2 mb-3 text-[11px] text-slate-500">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm bg-yellow-100 border border-yellow-200" />
          Pending
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded-sm border-l-4 border-l-red-500 border border-red-100 bg-white" />
          Overdue (end date in the past)
        </span>
      </div>

      {error && (
        <div className="mb-2 text-xs text-red-700 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {!loading && events.length === 0 && !error && (
        <div className="border border-dashed border-slate-200 rounded-lg p-4 text-center text-xs text-slate-500">
          <p className="font-medium text-slate-600 mb-1">No events found</p>
          <p>Try adjusting your filters or creating a new event above.</p>
        </div>
      )}

      {events.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-2 py-1 border">
                  <input
                    type="checkbox"
                    checked={
                      events.length > 0 && selectedIds.length === events.length
                    }
                    onChange={onToggleSelectAll}
                  />
                </th>
                <th className="px-2 py-1 border text-left">Title</th>
                <th className="px-2 py-1 border">Category</th>
                <th className="px-2 py-1 border">Status</th>
                <th className="px-2 py-1 border">Featured</th>
                <th className="px-2 py-1 border">Start</th>
                <th className="px-2 py-1 border">End</th>
                <th className="px-2 py-1 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const isSelected = selectedIds.includes(ev.id);
                const isOverdue = new Date(ev.endDate) < now;
                const isPending = ev.status === "Pending";

                const rowClasses = [
                  isPending ? "bg-yellow-50" : "",
                  isOverdue ? "border-l-4 border-l-red-500" : "",
                ]
                  .filter(Boolean)
                  .join(" ");

                return (
                  <tr key={ev.id} className={rowClasses}>
                    <td className="px-2 py-1 border text-center">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => onToggleSelect(ev.id)}
                      />
                    </td>
                    <td className="px-2 py-1 border whitespace-nowrap">
                      {ev.title}
                    </td>
                    <td className="px-2 py-1 border">{ev.category}</td>
                    <td className="px-2 py-1 border">
                      <span
                        className={
                          "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium " +
                          (ev.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : ev.status === "Rejected"
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-yellow-50 text-yellow-700 border border-yellow-200")
                        }
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="px-2 py-1 border text-center">
                      {ev.isFeatured && (
                        <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[11px] text-amber-700 border border-amber-200">
                          ★ Featured
                        </span>
                      )}
                    </td>
                    <td className="px-2 py-1 border">
                      {new Date(ev.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-1 border">
                      {new Date(ev.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-2 py-1 border space-x-1">
                      <button
                        className="px-2 py-0.5 text-[11px] rounded border border-slate-300 hover:bg-slate-50"
                        onClick={() => onEdit(ev)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-2 py-0.5 text-[11px] rounded border border-red-400 text-red-700 hover:bg-red-50"
                        onClick={() => onDelete(ev.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
