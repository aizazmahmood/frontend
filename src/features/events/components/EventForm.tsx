import type { EventFormValues } from "../types";

interface Props {
  mode: "create" | "edit";
  values: EventFormValues;
  onChange: (patch: Partial<EventFormValues>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancelEdit?: () => void;
}

export function EventForm({
  mode,
  values,
  onChange,
  onSubmit,
  onCancelEdit,
}: Props) {
  const heading = mode === "create" ? "Create Event" : "Edit Event";

  return (
    <section className="bg-white rounded-2xl shadow-sm p-4">
      <h2 className="text-sm font-semibold text-slate-900 mb-3">{heading}</h2>
      <form
        onSubmit={onSubmit}
        className="grid gap-3 md:grid-cols-2 text-xs text-slate-700"
      >
        <div>
          <label className="block mb-1 font-medium">Title *</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={values.title}
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Category *</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={values.category}
            onChange={(e) => onChange({ category: e.target.value })}
            placeholder="Conference, Meetup, Workshop..."
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">Start date *</label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={values.startDate}
            onChange={(e) => onChange({ startDate: e.target.value })}
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">End date *</label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={values.endDate}
            onChange={(e) => onChange({ endDate: e.target.value })}
          />
        </div>
        <div className="md:col-span-2">
          <label className="block mb-1 font-medium">
            Tags <span className="font-normal text-slate-400">(comma-separated)</span>
          </label>
          <input
            className="w-full border border-slate-300 rounded-lg px-2 py-1.5 text-xs outline-none focus:ring-2 focus:ring-slate-500"
            value={values.tags}
            onChange={(e) => onChange({ tags: e.target.value })}
            placeholder="fitness, tech, webinar"
          />
        </div>
        <div className="md:col-span-2 flex items-center gap-2 mt-1">
          <button
            type="submit"
            className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white"
          >
            {mode === "create" ? "Create event" : "Update event"}
          </button>
          {mode === "edit" && onCancelEdit && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="px-3 py-1.5 text-xs rounded-lg border border-slate-300 text-slate-700"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
