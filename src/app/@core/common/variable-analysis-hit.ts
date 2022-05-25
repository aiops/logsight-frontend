import { HitParam } from './hit-param';

export interface VariableAnalysisHit {
  message: string,
  template: string,
  params: HitParam[],
  result: string,
  level: string,
  timestamp: Date | string,
  applicationId: number,
  smr: number,
  rate_now: number,
}
