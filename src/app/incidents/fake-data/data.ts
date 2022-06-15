import {VerificationData} from "../../@core/common/verification-data";
import {Incident} from "../../@core/common/incident-data";

export const verificationData: VerificationData = {
  "timestamp": "",
  "compareId": "",
  "status": "1",
  "baseline_tags_keys": [],
  "candidate_tags_keys": [],
  "risk": "0",
  "risk_color": "red",
  "total_n_log_messages": "0",
  "count_baseline": "0",
  "count_candidate": "0",
  "candidate_perc": "0",
  "added_states": "0",
  "added_states_info": "0",
  "added_states_fault": "0",
  "deleted_states": "0",
  "deleted_states_info": "0",
  "deleted_states_fault": "0",
  "recurring_states": "0",
  "recurring_states_info": "0",
  "recurring_states_fault": "0",
  "frequency_change_threshold": "0",
  "frequency_change": "0",
  "frequency_change_info": "0",
  "frequency_change_fault": "0",
  "cols": [],
  "rows": []
}

export const incidentData: Incident = {
  "timestamp": "",
  "incidentId": "",
  "tags": [],
  "tagKeys": "",
  "status": "1",
  "severity": "1",
  "message": "",
  "risk": "0",
  "countAddedState": "0",
  "countLevelFault": "0",
  "countSemanticAnomaly": "0",
  "countMessages": "0",
  "countStates": "0",
}
