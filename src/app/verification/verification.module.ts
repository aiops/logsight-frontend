import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {VerificationComponent} from './verification.component';
import {VerificationOverviewComponent} from './overview/verification-overview.component';
import {VerificationRoutingModule} from './verification-routing.module';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {CalendarModule} from 'primeng/calendar';
import {SliderModule} from 'primeng/slider';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
import {TabViewModule} from 'primeng/tabview';
import {VerificationInsightsComponent} from "./insights/verification-insights.component";
import {NbSelectModule, NbSpinnerModule, NbTagModule, NbTreeGridModule} from "@nebular/theme";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {SkeletonModule} from "primeng/skeleton";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ChipsModule} from "primeng/chips";
import {ThemeModule} from "../@theme/theme.module";
import {CheckboxModule} from "primeng/checkbox";
import {CreateVerificationComponent} from "./create-verification/create-verification.component";
import {VerificationSharingService} from "./services/verification-sharing.service";
import {VerificationAnalyticsComponent} from "./analytics/verification-analytics.component";
import {ChartModule} from "primeng/chart";
import {ChartsWrapperModule} from "../pages/charts-wrapper-module/charts-wrapper.module";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ConfirmationService} from "primeng/api";
import {TooltipModule} from "primeng/tooltip";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import { TagControlComponent } from './tag-control/tag-control.component';

@NgModule({
  declarations: [
    VerificationComponent, 
    VerificationOverviewComponent, 
    VerificationInsightsComponent, 
    VerificationAnalyticsComponent, 
    CreateVerificationComponent, 
    TagControlComponent
  ],
  imports: [
    //Angular modules
    CommonModule, 
    FormsModule,

    //Modules from the installed libraries
    TableModule, 
    DropdownModule, 
    ButtonModule, 
    CalendarModule, 
    InputTextModule, 
    SliderModule, 
    MultiSelectModule, 
    TabViewModule,

    //Application modules
    VerificationRoutingModule, 
    NbSelectModule, 
    NbSpinnerModule, 
    NbTagModule, 
    NbTreeGridModule, 
    CardModule, 
    ChipModule, 
    SkeletonModule, 
    AutoCompleteModule, 
    ChipsModule, 
    ThemeModule, 
    CheckboxModule, 
    ChartModule, 
    ChartsWrapperModule, 
    ConfirmDialogModule, 
    TooltipModule, 
    TourMatMenuModule
  ],
  providers: [VerificationSharingService, ConfirmationService]
})
export class VerificationModule {
}
