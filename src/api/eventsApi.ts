import { httpClient } from "./httpClient";

export interface EventDto {
  id: number;
  orgId: string;
  creatorId: number;
  title: string;
  category: string;
  status: string;
  isFeatured: boolean;
  tags: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventListResponse {
  items: EventDto[];
  nextCursor?: string | null;
}

export interface EventQuery {
  scope?: string;
  category?: string;
  status?: string;
  q?: string;
  cursor?: string | null;
  limit?: number;
}

export interface CreateEventRequest {
  title: string;
  category: string;
  tags?: string[];
  startDate: string;
  endDate: string;
}

export interface UpdateEventRequest {
  title?: string;
  category?: string;
  tags?: string[];
  isFeatured?: boolean;
  status?: string;
  startDate?: string;
  endDate?: string;
}

export async function getEvents(query: EventQuery) {
  const params: any = { ...query };
  if (!params.cursor) delete params.cursor;
  if (!params.scope) delete params.scope;
  if (!params.category) delete params.category;
  if (!params.status) delete params.status;
  if (!params.q) delete params.q;

  const res = await httpClient.get<EventListResponse>("/api/events", { params });
  return res.data;
}

export async function createEvent(payload: CreateEventRequest) {
  const res = await httpClient.post<EventDto>("/api/events", payload);
  return res.data;
}

export async function updateEvent(id: number, payload: UpdateEventRequest) {
  const res = await httpClient.patch<EventDto>(`/api/events/${id}`, payload);
  return res.data;
}

export async function deleteEvent(id: number) {
  await httpClient.delete(`/api/events/${id}`);
}

export async function bulkUpdate(action: string, ids: number[]) {
  await httpClient.patch("/api/events/bulk", { action, ids });
}
