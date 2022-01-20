import { Injectable } from '@angular/core';
import { ApiService } from '../../@core/service/api.service';
import {Observable} from "rxjs";

@Injectable()
export class LogCompareService {
  constructor(private apiService: ApiService) {
  }

    loadApplicationVersions(applicationId: number): Observable<any> {
    let applicationParam = '';
    if (applicationId) {
      applicationParam = `&applicationId=${applicationId}`
    }
    return this.apiService.get(`/api/log_compare/load_versions?${applicationParam}`);
  }

  computeLogCompare(applicationId: number, baselineTagId: string, compareTagId: string){
    return this.apiService.get(`/api/log_compare/compute_log_compare?applicationId=${applicationId}
    &baselineTagId=${baselineTagId}&compareTagId=${compareTagId}`);
  }

  getLogCountBar(applicationId: number, startTime: string, endTime: string, tag: string): Observable<any> {
    return this.apiService.get(
      `/api/log_compare/bar_plot_count?startTime=${startTime}&endTime=${endTime}&applicationId=${applicationId}&tag=${tag}`)
  }

  getCognitiveBarData(applicationId: number, startTime: string, endTime: string, baselineTagId: string, compareTagId: string, newTemplates: string) {
    if (newTemplates == "new_templates" && baselineTagId && compareTagId){
      return this.apiService.get(`/api/charts/log_comp_new_templates_bar?startTime=${startTime}&endTime=${endTime}&applicationId=${applicationId}&baselineTagId=${baselineTagId}&compareTagId=${compareTagId}`);
    }else{
      var tag = ""
      if (baselineTagId){
        tag = baselineTagId
      }else{
        tag = compareTagId
      }
      return this.apiService.get(`/api/log_compare/cognitive_bar_plot?startTime=${startTime}&endTime=${endTime}&applicationId=${applicationId}&tag=${tag}`);
    }
  }

  loadCompareTemplatesHorizontalBar(applicationId: number, startTime: string, endTime: string, baselineTagId: string, compareTagId: string) {
    return this.apiService.get(`/api/log_compare/compare_templates_horizontal_bar?startTime=${startTime}&endTime=${endTime}&baselineTagId=${baselineTagId}&compareTagId=${compareTagId}&applicationId=${applicationId}`);
  }


 loadLogCompareData(startTime: string, endTime: string, applicationId: number, baselineTagId: string, compareTagId: string): Observable<any> {
    let applicationParam = `&applicationId=${applicationId}`
    return this.apiService.get(`/api/log_compare/data?startTime=${startTime}&endTime=${endTime}${applicationParam}&baselineTagId=${baselineTagId}&compareTagId=${compareTagId}`);
  }

  loadHeatmapData(startTime: string, endTime: string, applicationId: number, baselineTagId: string, compareTagId: string) {

    let applicationParam = `&applicationId=${applicationId}`

    return this.apiService.get(
      `/api/charts/log_compare_heatmap?startTime=${startTime}&endTime=${endTime}&compareTagId=${compareTagId}&baselineTagId=${baselineTagId}${applicationParam}`);
  }

}
