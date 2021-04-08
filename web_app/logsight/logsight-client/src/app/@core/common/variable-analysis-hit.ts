import { HitParam } from './hit-param';

export interface VariableAnalysisHit {
  message: string,
  template: string,
  params: HitParam[],
  result: string
}
