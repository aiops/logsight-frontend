import { Severity } from "./severity.enum";
import { Status } from "./status.enum";

export interface OverviewItem {
    compareId: string;
    baselineTags: string[];
    candidateTags: string[];
    risk: number;
    severity: Severity;
    status: Status;
    timestamp: Date;
    selected: boolean;
}