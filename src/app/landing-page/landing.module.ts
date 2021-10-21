import { NgModule } from '@angular/core';
import { LandingRoutingModule } from './landing-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { LandingComponent } from './landing-component/landing.component';
import { TermsconditionsComponent } from './terms-and-conditions/termsconditions.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ImpressumComponent } from './Impressum/impressum.component';
import {SwiperModule} from "swiper/angular";
import {TryLogsightComponent} from "./try-logsight/try-logsight";
import {NbCardModule, NbIconModule, NbSelectModule, NbSpinnerModule} from "@nebular/theme";
import {MatIconModule} from "@angular/material/icon";
import {CommonModule} from "@angular/common";

@NgModule({
  imports: [
    LandingRoutingModule,
    ReactiveFormsModule,
    SwiperModule,
    MatIconModule,
    CommonModule,
    NbIconModule,
    NbSpinnerModule,
    NbSelectModule,
  ],
  declarations: [
    LandingComponent, TermsconditionsComponent, PrivacyPolicyComponent, ImpressumComponent, TryLogsightComponent
  ],
})
export class LandingModule {
}
