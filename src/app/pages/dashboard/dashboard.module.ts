import {NgModule} from '@angular/core';
import {ThemeModule} from '../../@theme/theme.module';
import {NgxChartsModule} from '@swimlane/ngx-charts';
import {ChartModule} from 'angular2-chartjs';
import {
    NbButtonModule,
    NbCardModule,
    NbIconModule,
    NbInputModule,
    NbPopoverModule, NbSelectModule,
    NbTooltipModule, NbTreeGridModule
} from '@nebular/theme';
import {DashboardPage} from './dashboard.page';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';
import {ChartsWrapperModule} from '../charts-wrapper-module/charts-wrapper.module';
import {PagesModule} from '../pages.module';
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {ReactiveFormsModule} from '@angular/forms';
import {NgScrollbarModule} from "ngx-scrollbar";

@NgModule({
    imports: [
        DashboardRoutingModule,
        ThemeModule,
        NgxChartsModule,
        ChartModule,
        NbCardModule,
        NgxDatatableModule,
        ChartsWrapperModule,
        PagesModule,
        NbButtonModule,
        NbIconModule,
        NbPopoverModule,
        TourMatMenuModule,
        NbTooltipModule,
        ReactiveFormsModule,
        NbInputModule,
        NgScrollbarModule,
        NbSelectModule,
        NbTreeGridModule
    ],
  declarations: [
    DashboardPage,
  ],
})
export class DashboardModule {
}
