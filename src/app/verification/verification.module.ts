import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VerificationComponent } from './verification.component';
import { OverviewComponent } from './overview/overview.component';
import { VerificationRoutingModule } from './verification-routing.module';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import {InsightsComponent} from "./insights/insights.component";
import {NbSelectModule, NbSpinnerModule, NbTagModule, NbTreeGridModule} from "@nebular/theme";
import {CardModule} from "primeng/card";
import {ChipModule} from "primeng/chip";
import {SkeletonModule} from "primeng/skeleton";
import {AutoCompleteModule} from "primeng/autocomplete";
import {ChipsModule} from "primeng/chips";
import {ThemeModule} from "../@theme/theme.module";

@NgModule({
  declarations: [VerificationComponent, OverviewComponent, InsightsComponent],
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
        ThemeModule
    ]
})
export class VerificationModule { }
