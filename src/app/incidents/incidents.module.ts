import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IncidentsComponent} from './incidents.component';
import {IncidentsOverviewComponent} from './overview/incidents-overview.component';
import {IncidentsRoutingModule} from './incidents-routing.module';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {TabViewModule} from 'primeng/tabview';
import {IncidentsInsightsComponent} from "./insights/incidents-insights.component";
import {
  NbIconModule,
  NbPopoverModule,
  NbSelectModule,
  NbSpinnerModule,
  NbTagModule,
  NbTreeGridModule
} from "@nebular/theme";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {SkeletonModule} from "primeng/skeleton";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ChipsModule} from "primeng/chips";
import {ThemeModule} from "../@theme/theme.module";
import {CheckboxModule} from "primeng/checkbox";
import {IncidentsSharingService} from "./services/incidents-sharing.service";
import {IncidentsAnalyticsComponent} from "./analytics/incidents-analytics.component";
import {ChartModule} from "primeng/chart";
import {ChartsWrapperModule} from "../pages/charts-wrapper-module/charts-wrapper.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {PagesModule} from "../pages/pages.module";
import {DashboardService} from "../pages/dashboard/dashboard.service";
import {OverlayPanelModule} from "primeng/overlaypanel";
import {RippleModule} from "primeng/ripple";

@NgModule({
  declarations: [IncidentsComponent, IncidentsOverviewComponent, IncidentsInsightsComponent, IncidentsAnalyticsComponent],
  imports: [//Angular modules
    CommonModule, FormsModule,

    //Modules from the installed libraries
    TableModule, DropdownModule, ButtonModule, CalendarModule, InputTextModule, SliderModule, MultiSelectModule, TabViewModule,

    //Application modules
    IncidentsRoutingModule, NbSelectModule, NbSpinnerModule, NbTagModule, NbTreeGridModule, CardModule, ChipModule, SkeletonModule, AutoCompleteModule, ChipsModule, ThemeModule, CheckboxModule, ChartModule, ChartsWrapperModule, ConfirmDialogModule, TooltipModule, TourMatMenuModule, PagesModule, NbIconModule, NbPopoverModule, OverlayPanelModule, RippleModule],
  providers: [IncidentsSharingService, ConfirmationService, DashboardService]
})
export class IncidentsModule {
}
