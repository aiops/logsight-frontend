import { VariableAnalysisHit } from './variable-analysis-hit';

export interface IncidentTableData {
  applicationId: string,
  appName: string,
  timestamp: string,
  startTimestamp: string,
  stopTimestamp: string,
  countAD: String[]
  scAnomalies: String[],
  newTemplates: String[]
  semanticAD: String[],
  logs: String[],
}
