import { NgModule } from '@angular/core';
import { LandingRoutingModule } from './landing-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing-component/landing.component';
import { TermsconditionsComponent } from './terms-and-conditions/termsconditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ImpressumComponent } from './Impressum/impressum.component';

@NgModule({
  imports: [
    LandingRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LandingComponent, TermsconditionsComponent, PrivacyPolicyComponent, ImpressumComponent
  ]
})
export class LandingModule {
}
