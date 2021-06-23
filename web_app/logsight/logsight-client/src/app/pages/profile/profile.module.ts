import { NgModule } from '@angular/core';
import {NbButtonModule, NbCardModule, NbContextMenuModule, NbInputModule, NbUserModule} from '@nebular/theme';
import { ProfilePage} from './profile.page';
import { ProfileRoutingModule} from "./profile-routing.module";
import {CommonModule} from "@angular/common";
import {ReactiveFormsModule} from "@angular/forms";
import {HighlightModule} from "ngx-highlightjs";

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
  ],
  declarations: [
    ProfilePage,
  ],
})
export class ProfileModule {
}
