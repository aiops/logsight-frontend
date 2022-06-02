import {NgModule} from '@angular/core';
import {NbContextMenuModule} from '@nebular/theme';
import {ProfilePage} from './profile.page';
import {ProfileRoutingModule} from "./profile-routing.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HighlightModule} from "ngx-highlightjs";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {CardModule} from "primeng/card";
import {AccordionModule} from "primeng/accordion";
import {PasswordModule} from "primeng/password";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {TableModule} from "primeng/table";

@NgModule({
  imports: [
    ProfileRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    HighlightModule,
    NbContextMenuModule,
    TourMatMenuModule,
    CardModule,
    AccordionModule,
    PasswordModule,
    ButtonModule,
    InputTextModule,
    TableModule,
  ],
  declarations: [
    ProfilePage,
  ],
})
export class ProfileModule {
}
