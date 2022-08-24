import { OverviewItem } from "../models/overview.model";
import { OverviewResultResponse } from "../models/responses/overview-response.model";

export function mapOverview(response: OverviewResultResponse): OverviewItem[] {
    return response.listCompare.map(item => {
        return {
            compareId: item._id,
            baselineTags: Object.entries(item._source.baseline_tags).map(items => items.join(':')),
            candidateTags: Object.entries(item._source.candidate_tags).map(items => items.join(':')),
            risk: item._source.risk,
            severity: item._source.severity,
            status: item._source.status,
            timestamp: new Date(item._source.timestamp),
            selected: false
        }
    });
}