import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { VariableAnalysisRoutingModule } from './variable-analysis-routing.module';
import { VariableAnalysisPage } from './variable-analysis.page';

@NgModule({
  imports: [
    VariableAnalysisRoutingModule,
    ThemeModule,
    NgxChartsModule,
    ChartModule,
    NbCardModule,
    NbInputModule,
    NbButtonModule,
    ReactiveFormsModule,
    NbSelectModule,
  ],
  declarations: [VariableAnalysisPage]
})
export class VariableAnalysisModule {
}
