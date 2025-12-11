import type { EventDto } from "../../api/eventsApi";

export type StatusFilter = "" | "Pending" | "Approved" | "Rejected";

export interface Filters {
  scope: string;
  category: string;
  status: StatusFilter;
  q: string;
}

export interface EventFormValues {
  title: string;
  category: string;
  tags: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;
}

export type EventItem = EventDto;
