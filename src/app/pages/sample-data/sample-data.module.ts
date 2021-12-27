import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { ChartModule } from 'angular2-chartjs';
import {
    NbButtonModule,
    NbCardModule,
    NbInputModule,
    NbListModule,
    NbSelectModule, NbSpinnerModule,
    NbTreeGridModule
} from '@nebular/theme';
import { SampleDataPage } from './sample-data.page';
import { SampleDataRoutingModule } from './sample-data-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import {HIGHLIGHT_OPTIONS, HighlightModule} from "ngx-highlightjs";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";

@NgModule({
    imports: [
        SampleDataRoutingModule,
        ThemeModule,
        NgxChartsModule,
        ChartModule,
        NbCardModule,
        NbInputModule,
        NbButtonModule,
        ReactiveFormsModule,
        HighlightModule,
        TourMatMenuModule,
        NbSelectModule,
        NbTreeGridModule,
        NbListModule,
        NbSpinnerModule
    ],
  declarations: [
    SampleDataPage,
  ],

  providers: [
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        fullLibraryLoader: () => import('highlight.js')
      }
    }
  ],

})
export class SampleDataModule {
}
