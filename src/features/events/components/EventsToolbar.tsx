interface Props {
  isAdminOrMod: boolean;
  selectedCount: number;
  onBulkAction: (action: string) => void;
}

export function EventsToolbar({ isAdminOrMod, selectedCount, onBulkAction }: Props) {
  if (!isAdminOrMod) return null;

  return (
    <section className="bg-white rounded-2xl shadow-sm p-3 flex items-center gap-3">
      <span className="text-xs text-slate-600">
        Selected: <span className="font-semibold">{selectedCount}</span>
      </span>
      <button
        disabled={selectedCount === 0}
        onClick={() => onBulkAction("approve")}
        className="px-2.5 py-1 text-xs rounded-lg border border-emerald-500 text-emerald-700 disabled:opacity-40"
      >
        Approve
      </button>
      <button
        disabled={selectedCount === 0}
        onClick={() => onBulkAction("reject")}
        className="px-2.5 py-1 text-xs rounded-lg border border-red-500 text-red-700 disabled:opacity-40"
      >
        Reject
      </button>
      <button
        disabled={selectedCount === 0}
        onClick={() => onBulkAction("feature")}
        className="px-2.5 py-1 text-xs rounded-lg border border-amber-500 text-amber-700 disabled:opacity-40"
      >
        Feature
      </button>
      <button
        disabled={selectedCount === 0}
        onClick={() => onBulkAction("unfeature")}
        className="px-2.5 py-1 text-xs rounded-lg border border-slate-400 text-slate-700 disabled:opacity-40"
      >
        Unfeature
      </button>
    </section>
  );
}
