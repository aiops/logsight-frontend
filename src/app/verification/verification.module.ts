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

@NgModule({
  declarations: [VerificationComponent, OverviewComponent],
  imports: [
    //Angular modules
    CommonModule,
    FormsModule,
    BrowserAnimationsModule,

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
    VerificationRoutingModule
  ]
})
export class VerificationModule { }
