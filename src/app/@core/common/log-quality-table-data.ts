import {VariableAnalysisHit} from "./variable-analysis-hit";

export interface LogQualityTableData {
    applicationId: number,
    indexName: string,
    timestamp: string,
    template: string,
    appName: string,
    message: string,
    predictedLevel: string,
    level: string,
    linguisticPrediction: string,
    hasSubject: boolean,
    hasObject: boolean,
    variableHit: VariableAnalysisHit
}
