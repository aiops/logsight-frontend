import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { LandingPage } from './landing.page';
import { ImpressumComponent } from './Impressum/impressum.component';
import { LandingComponent } from './landing-component/landing.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { TermsconditionsComponent } from './terms-and-conditions/termsconditions.component';
import { TryLogsightComponent} from "./try-logsight/try-logsight";

const routes: Routes = [{
  path: '',
  component: LandingPage,
  children: [
    {
      path: '',
      component: LandingComponent
    },
    {
      path: 'impressum',
      component: ImpressumComponent
    },
    {
      path: 'quickstart',
      component: TryLogsightComponent
    },
    {
      path: 'privacy-policy',
      component: PrivacyPolicyComponent,
    },
    {
      path: 'terms-conditions',
      component: TermsconditionsComponent,
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LandingRoutingModule {
}
