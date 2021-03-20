import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { VariableAnalysisRoutingModule } from './variable-analysis-routing.module';
import { VariableAnalysisPage } from './variable-analysis.page';
import { TemplatesDirective } from '../../@core/components/host-directive';
import { AdDirective } from '../../@core/components/app/ad.directive';
import { VariableAnalysisTemplate } from '../../@core/components/app/variable-analysis-template';
import { VariableAnalysisTemplateResolver } from '../../@core/components/app/variable-analysis-template-resolver';

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
  declarations: [VariableAnalysisPage, TemplatesDirective, VariableAnalysisTemplateResolver,
    VariableAnalysisTemplate,
    AdDirective],
  entryComponents: [VariableAnalysisTemplate]
})
export class VariableAnalysisModule {
}
