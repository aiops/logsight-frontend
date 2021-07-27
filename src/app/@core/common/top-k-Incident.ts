import { VariableAnalysisHit } from './variable-analysis-hit';

export interface TopKIncident {
  applicationId: number,
  appName: string,
  timestamp: string,
  startTimestamp: string,
  stopTimestamp: string,
  scAnomalies: VariableAnalysisHit[],
  newTemplates: VariableAnalysisHit[],
  semanticAD: VariableAnalysisHit[],
  countAD: VariableAnalysisHit[],
}
