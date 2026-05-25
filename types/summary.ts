export type SummaryMode = "brief" | "detailed" | "bullets";

export interface SummaryRequest {
  text: string;
  mode: SummaryMode;
}

export interface SummaryResponse {
  summary: string;
}
