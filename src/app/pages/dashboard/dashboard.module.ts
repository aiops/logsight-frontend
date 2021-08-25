import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import {
  NbButtonModule,
  NbCardModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbTooltipModule
} from '@nebular/theme';
import { DashboardPage } from './dashboard.page';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';
import { PagesModule } from '../pages.module';
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import { ReactiveFormsModule } from '@angular/forms';

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
    NbButtonModule,
    NbIconModule,
    NbPopoverModule,
    TourMatMenuModule,
    NbTooltipModule,
    ReactiveFormsModule,
    NbInputModule
  ],
  declarations: [
    DashboardPage,
  ],
})
export class DashboardModule {
}
