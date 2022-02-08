import { VariableAnalysisHit } from './variable-analysis-hit';

export interface IncidentTableData {
  applicationId: string,
  appName: string,
  timestamp: string,
  startTimestamp: string,
  stopTimestamp: string,
  countAD: VariableAnalysisHit[]
  scAnomalies: VariableAnalysisHit[],
  newTemplates: VariableAnalysisHit[]
  semanticAD: VariableAnalysisHit[],
  logs: VariableAnalysisHit[],
}
