import {NgModule} from '@angular/core';
import {ThemeModule} from '../../@theme/theme.module';
import {ChartModule} from 'angular2-chartjs';
import {DemoDataPage} from './demo-data.page';
import {DemoDataRoutingModule} from './demo-data-routing.module';
import {ReactiveFormsModule} from '@angular/forms';
import {HIGHLIGHT_OPTIONS, HighlightModule} from "ngx-highlightjs";
import {TourMatMenuModule} from "ngx-ui-tour-md-menu";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";

@NgModule({
  imports: [
    DemoDataRoutingModule,
    ThemeModule,
    ChartModule,
    ReactiveFormsModule,
    HighlightModule,
    TourMatMenuModule,
    CardModule,
    ButtonModule
  ],
  declarations: [
    DemoDataPage,
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
export class DemoDataModule {
}
