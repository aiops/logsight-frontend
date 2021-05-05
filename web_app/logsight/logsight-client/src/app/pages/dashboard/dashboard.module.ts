import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule } from '@nebular/theme';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';
import { PagesModule } from '../pages.module';

@NgModule({
  imports: [
    DashboardRoutingModule,
    ThemeModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    Ng2SmartTableModule,
    NgxDatatableModule,
    ChartsWrapperModule,
    PagesModule,
    NbButtonModule
  ],
  declarations: [
    DashboardPage,
  ],
})
export class DashboardModule {
}
