import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbListModule,
  NbRouteTabsetModule, NbStepperModule, NbAccordionModule, NbProgressBarModule, NbSpinnerModule, NbLayoutModule,
} from '@nebular/theme';
import { QuickstartRoutingModule } from './quickstart-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { QuickstartPage } from './quickstart.page';
import {BdcWalkModule} from "bdc-walkthrough";
import {MatIconModule} from "@angular/material/icon";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";
import {MatDialogModule} from "@angular/material/dialog";
import {MatCardModule} from "@angular/material/card";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";

@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule,
    ThemeModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    NbStepperModule,
    NbCardModule,
    NbButtonModule,
    NbListModule,
    NbAccordionModule,
    NbUserModule,
    NbActionsModule,
    QuickstartRoutingModule,
    NbProgressBarModule,
    NbSpinnerModule,
    BdcWalkModule,
    MatIconModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    TourMatMenuModule,
    MatCardModule,
    NbLayoutModule
  ],
  providers: [
    ],
  declarations: [
    QuickstartPage,
  ],
})
export class QuickstartModule { }
