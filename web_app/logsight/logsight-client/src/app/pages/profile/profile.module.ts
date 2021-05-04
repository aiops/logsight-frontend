import { NgModule } from '@angular/core';
import { NbCardModule } from '@nebular/theme';
import { ProfilePage} from './profile.page';
import { ProfileRoutingModule} from "./profile-routing.module";

@NgModule({
  imports: [
    NbCardModule,
    ProfileRoutingModule
  ],
  declarations: [
    ProfilePage,
  ],
})
export class ProfileModule {
}
