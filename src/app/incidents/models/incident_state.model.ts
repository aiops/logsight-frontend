export interface IncidentStateItem {
  level: string;
  timestamp: string,
  risk_score: number,
  message: string,
  added_state: number,
  prediction: number,
  template: string;
}
