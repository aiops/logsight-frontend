import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbListModule,
  NbRouteTabsetModule, NbStepperModule, NbAccordionModule, NbProgressBarModule, NbSpinnerModule,
} from '@nebular/theme';
import { QuickstartRoutingModule } from './quickstart-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeModule } from '../../@theme/theme.module';
import { QuickstartPage } from './quickstart.page';

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
  ],
  declarations: [
    QuickstartPage,
  ],
})
export class QuickstartModule { }
