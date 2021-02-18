import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbColorHelper, NbThemeService } from '@nebular/theme';
import { NbJSThemeVariable } from '@nebular/theme/services/js-themes/theme.options';
import { DashboardService } from './dashboard.service';
import { timeout } from 'rxjs/operators';
import { interval, Observable } from 'rxjs';

@Component({
  selector: 'dashboard',
  styleUrls: ['./dashboard.page.scss'],
  templateUrl: './dashboard.page.html',
})
export class DashboardPage implements OnInit, OnDestroy {
  data: any;
  options: any;
  themeSubscription: any;
  colorScheme: any;
  advancedPieData: any[];

  constructor(private theme: NbThemeService, private dashboardService: DashboardService) {
    this.getThemeSubscription();
  }

  ngOnInit(): void {

  }

  private getThemeSubscription() {
    this.themeSubscription = this.theme.getJsTheme().subscribe(config => {

      const colors: NbJSThemeVariable = config.variables;
      const chartjs: any = config.variables.chartjs;

      this.colorScheme = {
        domain: [colors.primaryLight, colors.infoLight, colors.successLight, colors.warningLight, colors.dangerLight],
      };

      // setInterval(() => {
      this.dashboardService.loadLineChartData().subscribe(data => {
        data.datasets[0].backgroundColor = NbColorHelper.hexToRgbA(colors.primary, 0.3);
        data.datasets[1].backgroundColor = NbColorHelper.hexToRgbA(colors.danger, 0.3);
        data.datasets[0].borderColor = colors.primary;
        data.datasets[1].borderColor = colors.danger;
        this.data = data;
      });
      // }, 2000);

      this.getOptions(chartjs);
    });
  }

  ngOnDestroy(): void {
    this.themeSubscription.unsubscribe();
  }

  // private getData(colors: NbJSThemeVariable) {
  //   this.data = {
  //     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
  //     datasets: [{
  //       data: [65, 59, 80, 81, 56, 55, 40],
  //       label: 'Normal',
  //       backgroundColor: NbColorHelper.hexToRgbA(colors.primary, 0.3),
  //       borderColor: colors.primary,
  //     }, {
  //       data: [28, 48, 40, 19, 86, 27, 90],
  //       label: 'Anomaly',
  //       backgroundColor: NbColorHelper.hexToRgbA(colors.danger, 0.3),
  //       borderColor: colors.danger,
  //     }, {
  //       data: [18, 48, 77, 9, 100, 27, 40],
  //       label: 'All logs',
  //       backgroundColor: NbColorHelper.hexToRgbA(colors.info, 0.3),
  //       borderColor: colors.info,
  //     },
  //     ],
  //   };
  // }

  private getOptions(chartjs: any) {
    this.options = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        xAxes: [
          {
            gridLines: {
              display: true,
              color: chartjs.axisLineColor,
            },
            ticks: {
              fontColor: chartjs.textColor,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
              color: chartjs.axisLineColor,
            },
            ticks: {
              fontColor: chartjs.textColor,
            },
          },
        ],
      },
      legend: {
        labels: {
          fontColor: chartjs.textColor,
        },
      },
    };
  }
}
