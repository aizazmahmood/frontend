import { type FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import {
    bulkUpdate,
    createEvent,
    deleteEvent,
    getEvents,
    updateEvent,
    type EventDto,
} from "../../api/eventsApi";
import { EventFilters } from "./components/EventFilters";
import { EventsToolbar } from "./components/EventsToolbar";
import { EventsTable } from "./components/EventsTable";
import { EventForm } from "./components/EventForm";
import type { EventFormValues, Filters, StatusFilter } from "./types";

export function EventsPage() {
    const { user, logout } = useAuth();
    const [searchParams, setSearchParams] = useSearchParams();

    const defaultScope = useMemo(() => {
        if (!user) return "mine";
        const rolesLower = user.roles.map((r) => r.toLowerCase());
        if (rolesLower.includes("admin") || rolesLower.includes("moderator")) {
            return "org";
        }
        return "mine";
    }, [user]);

    const [filters, setFilters] = useState<Filters>({
        scope: searchParams.get("scope") || defaultScope,
        category: searchParams.get("category") || "",
        status: (searchParams.get("status") as StatusFilter) || "",
        q: searchParams.get("q") || "",
    });

    const [cursor, setCursor] = useState<string | null>(
        searchParams.get("cursor")
    );
    const [events, setEvents] = useState<EventDto[]>([]);
    const [nextCursor, setNextCursor] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [editingEvent, setEditingEvent] = useState<EventDto | null>(null);

    const [formValues, setFormValues] = useState<EventFormValues>({
        title: "",
        category: "",
        tags: "",
        startDate: "",
        endDate: "",
    });

    const isAdminOrMod = useMemo(() => {
        if (!user) return false;
        const lower = user.roles.map((r) => r.toLowerCase());
        return lower.includes("admin") || lower.includes("moderator");
    }, [user]);

    // Sync to URL
    useEffect(() => {
        const params: any = {};
        if (filters.scope) params.scope = filters.scope;
        if (filters.category) params.category = filters.category;
        if (filters.status) params.status = filters.status;
        if (filters.q) params.q = filters.q;
        if (cursor) params.cursor = cursor;

        setSearchParams(params, { replace: true });
    }, [filters, cursor, setSearchParams]);

    // Fetch events
    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await getEvents({
                    scope: filters.scope,
                    category: filters.category,
                    status: filters.status,
                    q: filters.q,
                    cursor,
                    limit: 20,
                });
                if (!cancelled) {
                    setEvents(data.items);
                    setNextCursor(data.nextCursor ?? null);
                    setSelectedIds([]);
                }
            } catch (err: any) {
                if (!cancelled) {
                    const msg =
                        err?.response?.data?.message ||
                        err?.message ||
                        "Failed to load events";
                    setError(msg);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, [filters.scope, filters.category, filters.status, filters.q, cursor]);

    const handleFilterChange = (patch: Partial<Filters>) => {
        setFilters((prev) => ({ ...prev, ...patch }));
        setCursor(null);
    };

    const handleResetFilters = () => {
        setFilters({
            scope: defaultScope,
            category: "",
            status: "",
            q: "",
        });
        setCursor(null);
    };

    const handleNextPage = () => {
        if (nextCursor) setCursor(nextCursor);
    };

    const handleFirstPage = () => {
        setCursor(null);
    };

    const toggleSelect = (id: number) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === events.length) {
            setSelectedIds([]);
            return;
        }
        setSelectedIds(events.map((e) => e.id));
    };

    const openCreateForm = () => {
        setEditingEvent(null);
        setFormValues({
            title: "",
            category: "",
            tags: "",
            startDate: "",
            endDate: "",
        });
    };

    const openEditForm = (ev: EventDto) => {
        setEditingEvent(ev);
        setFormValues({
            title: ev.title,
            category: ev.category,
            tags: ev.tags.join(", "),
            startDate: ev.startDate.substring(0, 10),
            endDate: ev.endDate.substring(0, 10),
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Delete this event?")) return;
        try {
            await deleteEvent(id);
            setCursor(null);
        } catch {
            alert("Failed to delete event");
        }
    };

    const handleFormChange = (patch: Partial<EventFormValues>) => {
        setFormValues((prev) => ({ ...prev, ...patch }));
    };

    const handleFormSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (
            !formValues.title ||
            !formValues.category ||
            !formValues.startDate ||
            !formValues.endDate
        ) {
            alert("Please fill all required fields.");
            return;
        }

        const startIso = new Date(formValues.startDate).toISOString();
        const endIso = new Date(formValues.endDate).toISOString();
        const tags =
            formValues.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean) || [];

        try {
            if (editingEvent) {
                await updateEvent(editingEvent.id, {
                    title: formValues.title,
                    category: formValues.category,
                    startDate: startIso,
                    endDate: endIso,
                    tags,
                });
            } else {
                await createEvent({
                    title: formValues.title,
                    category: formValues.category,
                    startDate: startIso,
                    endDate: endIso,
                    tags,
                });
            }
            openCreateForm();
            setCursor(null);
        } catch {
            alert("Failed to save event");
        }
    };

    const handleBulkAction = async (action: string) => {
        if (selectedIds.length === 0) return;
        try {
            await bulkUpdate(action, selectedIds);
            setCursor(null);
        } catch {
            alert("Bulk update failed");
        }
    };

    const now = new Date();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <header className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold text-slate-900">
                        EventBoard Pro
                    </h1>
                    {user && (
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                            <span className="font-medium text-slate-700">{user.email}</span>
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5">
                                Org: <span className="ml-1 font-semibold text-slate-700">{user.orgId}</span>
                            </span>
                            {user.roles.map((role) => (
                                <span
                                    key={role}
                                    className="inline-flex items-center rounded-full bg-indigo-50 px-2 py-0.5 font-semibold text-[11px] text-indigo-700"
                                >
                                    {role}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <button
                    onClick={logout}
                    className="px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 text-white hover:bg-slate-800"
                >
                    Logout
                </button>
            </header>


            <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 space-y-6">
                <EventForm
                    mode={editingEvent ? "edit" : "create"}
                    values={formValues}
                    onChange={handleFormChange}
                    onSubmit={handleFormSubmit}
                    onCancelEdit={editingEvent ? openCreateForm : undefined}
                />

                <EventFilters
                    filters={filters}
                    onChange={handleFilterChange}
                    onReset={handleResetFilters}
                    isAdminOrMod={isAdminOrMod}
                />

                <EventsToolbar
                    isAdminOrMod={isAdminOrMod}
                    selectedCount={selectedIds.length}
                    onBulkAction={handleBulkAction}
                />

                <EventsTable
                    events={events}
                    loading={loading}
                    error={error}
                    now={now}
                    selectedIds={selectedIds}
                    onToggleSelect={toggleSelect}
                    onToggleSelectAll={toggleSelectAll}
                    onEdit={openEditForm}
                    onDelete={handleDelete}
                />

                <div className="flex items-center justify-between text-xs text-slate-600">
                    <span>
                        Showing {events.length} event{events.length === 1 ? "" : "s"}
                    </span>
                    <div className="flex gap-2">
                        <button
                            type="button"
                            disabled={!cursor}
                            onClick={handleFirstPage}
                            className="px-3 py-1 border border-slate-300 rounded-lg disabled:opacity-40"
                        >
                            First page
                        </button>
                        <button
                            type="button"
                            disabled={!nextCursor}
                            onClick={handleNextPage}
                            className="px-3 py-1 border border-slate-300 rounded-lg disabled:opacity-40"
                        >
                            Next
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
