import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { VariableAnalysisPage } from './variable-analysis.page';

const routes: Routes = [{
  path: '',
  component: VariableAnalysisPage,
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VariableAnalysisRoutingModule {
}
