import { NgModule } from '@angular/core';
import {
    NbAccordionModule,
    NbAlertModule,
    NbButtonModule,
    NbCardModule,
    NbContextMenuModule, NbIconModule,
    NbInputModule, NbTooltipModule,
    NbUserModule
} from '@nebular/theme';
import { ProfilePage} from './profile.page';
import { ProfileRoutingModule} from "./profile-routing.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HighlightModule} from "ngx-highlightjs";
import {NgxChartsModule} from "@swimlane/ngx-charts";

@NgModule({
    imports: [
        NbCardModule,
        ProfileRoutingModule,
        CommonModule,
        NbButtonModule,
        NbInputModule,
        ReactiveFormsModule,
        HighlightModule,
        NbUserModule,
        NbContextMenuModule,
        NgxChartsModule,
        NbAlertModule,
        NbTooltipModule,
        NbIconModule,
        NbAccordionModule,
    ],
  declarations: [
    ProfilePage,
  ],
})
export class ProfileModule {
}
