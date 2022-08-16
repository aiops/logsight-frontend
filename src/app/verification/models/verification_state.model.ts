export interface VerificationStateItem {
  risk_severity: number;
  change_count: string;
  freq_change: number;
  count_base: string;
  count_baseline: number;
  count_cand: string;
  count_candidate: number;
  count_gtotal: number;
  count_total: number;
  coverage_candidate: number;
  level: string;
  percentage_baseline: number;
  percentage_candidate: number;
  risk_color: string;
  state: string;
  risk_score: number;
  risk_symbol: string;
  semantic_color: string[];
  predicted_anomaly: string;
  template: string;
  trend_baseline: string;
  trend_candidate: string;
}
