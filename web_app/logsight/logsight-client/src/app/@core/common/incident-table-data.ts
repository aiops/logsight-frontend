import { VariableAnalysisHit } from './variable-analysis-hit';

export interface IncidentTableData {
  countAds: VariableAnalysisHit[]
  semanticCountAds: VariableAnalysisHit[],
  newTemplates: VariableAnalysisHit[]
  semanticAd: VariableAnalysisHit[],
}
