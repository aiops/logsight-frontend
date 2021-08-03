import { NgModule } from '@angular/core';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { SecondComponent } from './second.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    LandingRoutingModule,
    ReactiveFormsModule,
  ],
  declarations: [
    LandingComponent, SecondComponent
  ]
})
export class LandingModule {
}
