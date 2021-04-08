import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import { NbButtonModule, NbCardModule, NbInputModule, NbSelectModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';
import { VariableAnalysisRoutingModule } from './variable-analysis-routing.module';
import { VariableAnalysisPage } from './variable-analysis.page';
import { HostDirective } from '../../@core/components/app/host.directive';
import { VariableAnalysisTemplate } from '../../@core/components/app/variable-analysis-template';
import { VariableAnalysisTemplateResolver } from '../../@core/components/app/variable-analysis-template-resolver';
import { SpecificTemplateModalComponent } from '../../@core/components/specific-template-modal/specific-template-modal.component';
import { PagesModule } from '../pages.module';
import { ChartsWrapperModule } from '../charts-wrapper-module/charts-wrapper.module';

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
    PagesModule,
    ChartsWrapperModule
  ],
  declarations: [VariableAnalysisPage, VariableAnalysisTemplateResolver,
    VariableAnalysisTemplate,
    HostDirective, SpecificTemplateModalComponent],
  entryComponents: [VariableAnalysisTemplate]
})
export class VariableAnalysisModule {
}
