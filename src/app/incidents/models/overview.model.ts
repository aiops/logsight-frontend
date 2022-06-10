import { Severity } from "./severity.enum";
import { Status } from "./status.enum";

export interface OverviewItem {
    selected: boolean;
    date: Date;
    applicationName: string;
    verificationId: string;
    baselineTags: string[];
    candidateTags: string[];
    risk: number;
    severity: Severity;
    status: Status;
}