import { Component, OnInit, ViewChild } from '@angular/core';
import { NbDialogService, NbThemeService } from '@nebular/theme';
import { DashboardService } from './dashboard.service';
import { TopKIncident } from '../../@core/common/top-k-Incident';
import { Router } from '@angular/router';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { VariableAnalysisService } from '../../@core/service/variable-analysis.service';
import { MessagingService } from '../../@core/service/messaging.service';
import { NotificationsService } from 'angular2-notifications';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit {
  heatmapData = [];
  pieChartData = [];
  stackedChartData = [];
  barData = [];
  topKIncidents: TopKIncident[] = [];

  constructor(private dashboardService: DashboardService, private router: Router,
              private variableAnalysisService: VariableAnalysisService,
              private messagingService: MessagingService,
              private notificationService: NotificationsService,
              private dialogService: NbDialogService) {
  }

  ngOnInit(): void {
    this.loadHeatmapData()
    this.loadPieChartData()
    this.loadStackedAreaChartData()
    this.loadTopKIncidents()
    this.loadBarData()

    this.messagingService.getVariableAnalysisTemplate().subscribe(selected => {
      if (true) {
        this.variableAnalysisService.loadSpecificTemplate(108, selected['item']).subscribe(
          resp => {
            this.dialogService.open(SpecificTemplateModalComponent, {
              context: {
                data: resp.second,
                type: resp.first
              }, dialogClass: 'model-full'
            });
          }, err => {
            console.log(err)
            this.notificationService.error('Error', 'Error fetching data')
          })
      }
    })
  }

  loadHeatmapData() {
    this.dashboardService.loadHeatmapData().subscribe(data => {
      this.heatmapData = data.data;
    });
  }

  loadBarData() {
    this.dashboardService.loadBarData().subscribe(data => {
      this.barData = data;
    });
  }

  loadPieChartData() {
    this.dashboardService.loadPieChartData().subscribe(data => {
      this.pieChartData = data.data;
    });
  }

  loadStackedAreaChartData() {
    this.dashboardService.loadStackedChartData().subscribe(data => {
      this.stackedChartData = data.data;
    });
  }

  loadTopKIncidents() {
    this.topKIncidents = [];

    this.dashboardService.loadTopKIncidentsData().subscribe(data => {
      console.log('data', data)
      this.topKIncidents = data.map(it => {
        const scAnomalies = this.parseTemplates(it, 'scAnomalies').sort((a, b) => b.timeStamp - a.timeStamp)
        const newTemplates = this.parseTemplates(it, 'newTemplates').sort((a, b) => b.timeStamp - a.timeStamp)
        const semanticAD = this.parseTemplates(it, 'semanticAD').sort((a, b) => b.timeStamp - a.timeStamp)
        const countAD = this.parseTemplates(it, 'countAD').sort((a, b) => b.timeStamp - a.timeStamp)
        return { timestamp: it.timestamp, scAnomalies, newTemplates, semanticAD, countAD }
      });
      console.log('this.topKIncidents', this.topKIncidents)
    });
  }

  onHeatMapSelect(data: any) {
    this.router.navigate(['/pages', 'incidents'], { queryParams: { 'startTime': data.series } })
  }

  parseTemplates(data, incident) {
    return JSON.parse(data[incident]).map(it2 => {
      let params = [];
      Object.keys(it2[0]).forEach(key => {
        if (key.startsWith('param_')) {
          params.push({ key, value: it2[0][key] })
        }
      });
      return {
        message: it2[0].message,
        template: it2[0].template,
        params: params,
        actualLevel: it2[0].actual_level,
        timeStamp: new Date(it2[0]['@timestamp'])
      }
    });
  }

}
