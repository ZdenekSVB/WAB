export interface WarningMessage {
  message: string;
  timestamp: Date;
  severity: "low" | "medium" | "high";
}
