import { VariableAnalysisHit } from './variable-analysis-hit';

export interface IncidentTableData {
  applicationId: number,
  appName: string,
  timestamp: string,
  startTimestamp: string,
  stopTimestamp: string,
  countAds: VariableAnalysisHit[]
  semanticCountAds: VariableAnalysisHit[],
  newTemplates: VariableAnalysisHit[]
  semanticAd: VariableAnalysisHit[],
  logData: VariableAnalysisHit[],
}
