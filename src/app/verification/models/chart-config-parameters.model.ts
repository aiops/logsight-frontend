export class ChartConfigParameters {
    constructor(feature: ChartFeatures, baselineTags: any) {
        this.type = 'barchart',
        this.feature = feature.toString(),
        this.indexType = 'verifications',
        this.baselineTags = baselineTags;
    }

    type: string;
    feature: string;
    indexType: string;
    baselineTags: any;
}

export enum ChartFeatures {
    Risk = 'compare_analytics_risk',
    Frequency = 'compare_analytics_verification_frequency',
    Velocity = 'compare_analytics_verification_velocity',
    VelocityMinMax = 'compare_analytics_verification_velocity_min_max',
    FailureRatio = 'compare_analytics_verification_failure_ratio'
}