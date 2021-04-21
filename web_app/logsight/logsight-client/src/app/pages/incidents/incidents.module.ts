import { NgModule } from '@angular/core';
import { IncidentsRoutingModule } from './incidents-routing.module';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { IncidentsService } from './incidents.service';
import { NvD3Module } from 'ng2-nvd3';
import { IncidentsPage } from './incidents.page';

@NgModule({
  imports: [
    IncidentsRoutingModule,
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    Ng2SmartTableModule,
    NvD3Module
  ],
  declarations: [
    IncidentsPage,
  ],
  providers: [IncidentsService]
})
export class IncidentsModule {
}
