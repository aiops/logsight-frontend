import { VariableAnalysisHit } from './variable-analysis-hit';

export interface TopKIncident {
  timestamp: string,
  scAnomalies: VariableAnalysisHit[],
  newTemplates: VariableAnalysisHit[],
  semanticAD: VariableAnalysisHit[],
  countAD: VariableAnalysisHit[],
}
