import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingComponent } from './landing.component';
import { SecondComponent } from './second.component';
import { LandingPage } from './landing.page';

const routes: Routes = [{
  path: '',
  component: LandingPage,
  children: [
    {
      path: '',
      component: LandingComponent
    },
    {
      path: 'second',
      component: SecondComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {
}
