import { NgModule } from '@angular/core';
import { IncidentsRoutingModule } from './incidents-routing.module';
import { IncidentsComponent } from './incidents.component';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule } from '@nebular/theme';
import { ThemeModule } from '../../@theme/theme.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { IncidentsService } from './incidents.service';
import 'd3';
import 'nvd3';
import { NvD3Module } from 'ng2-nvd3';

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
    IncidentsComponent,
  ],
  providers: [IncidentsService]
})
export class IncidentsModule {
}
