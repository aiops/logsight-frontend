import { TagResponse } from "./tag-response.model";

export interface OverviewResultResponse {
    listCompare: OverviewItemResponse[];
}

export interface OverviewItemResponse {
    _id: string;
    _source: OverviewSourceResponse;
}

export interface OverviewSourceResponse {
    baseline_tags: TagResponse[];
    candidate_tags: TagResponse[];
    risk: number;
    severity: number;
    status: number;
    timestamp: Date;
}

