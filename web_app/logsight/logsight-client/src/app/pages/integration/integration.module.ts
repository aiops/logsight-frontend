import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule, NbInputModule } from '@nebular/theme';
import { IntegrationPage } from './integration.page';
import { IntegrationRoutingModule } from './integration-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HighlightModule } from "ngx-highlightjs";

@NgModule({
  imports: [
    IntegrationRoutingModule,
    ThemeModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    ReactiveFormsModule,
    HighlightModule,
  ],
  declarations: [
    IntegrationPage,
  ]
})
export class IntegrationModule {
}
