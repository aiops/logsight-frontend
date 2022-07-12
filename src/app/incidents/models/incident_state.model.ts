export interface IncidentStateItem {
  level: string;
  timestamp: string,
  riskSeverity: number,
  message: string,
  addedState: number,
  prediction: number,
  template: string,
  riskScore: number,
  tagString: string,
  tags: any,
}
