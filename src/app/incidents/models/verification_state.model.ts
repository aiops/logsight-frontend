export interface VerificationStateItem {
  risk_severity: number;
  change_count: string;
  change_perc: number;
  count_base: string;
  count_baseline: number;
  count_cand: string;
  count_candidate: number;
  count_gtotal: number;
  count_total: number;
  coverage: number;
  level: string;
  perc_baseline: number;
  perc_candidate: number;
  risk_color: string;
  risk_description: string;
  risk_score: number;
  risk_symbol: string;
  semantic_color: string[];
  semantics: string;
  template: string;
  trend_baseline: string;
  trend_candidate: string;
}
