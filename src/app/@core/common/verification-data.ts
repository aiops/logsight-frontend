export interface VerificationData {
  timestamp: any,
  compareId: any,
  status: any,
  baseline_tags_keys: any,
  candidate_tags_keys: any,
  risk: any,
  risk_color: any,
  total_n_log_messages: any,
  count_baseline: any,
  count_candidate: any,
  candidate_perc: any,
  added_states: any,
  added_states_info: any,
  added_states_fault: any,
  deleted_states: any,
  deleted_states_info: any,
  deleted_states_fault: any,
  recurring_states: any,
  recurring_states_info: any,
  recurring_states_fault: any,
  frequency_change_threshold: any,
  frequency_change: any,
  frequency_change_info: any,
  frequency_change_fault: any,
  cols: any[],
  rows: any[]
}


export interface ListOverviewVerificationData {
  listCompare: OverviewVerificationData
}

export interface OverviewVerificationData {
  _id: string,
  _source: VerificationData
}

export interface IssueCountVerificationData {
  status: number,
  count: number
}

