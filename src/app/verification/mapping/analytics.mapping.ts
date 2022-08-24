import * as moment from "moment";
import { AnalyticsResponse } from "../models/responses/analytics-response.model";

export function mapAnalytics(response: any): AnalyticsResponse[] {
    let data: AnalyticsResponse[] = response.data.data;
    return data = data.map(obj => {
        let utcDate = moment.utc(obj.name, 'YYYY-MM-DD HH:mm');
        let formattedDate = moment(utcDate).local().format('MMM DD HH:mm');

        return {
            name: formattedDate,
            series: obj.series
        }
    });
}