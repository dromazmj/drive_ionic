import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IonicPageModule } from 'ionic-angular';

import { ItemDetailPage } from './exercise-detail';
import { BarChartComponent } from '../../components/bar-chart/bar-chart';
import { NewSetComponent } from '../../components/new-set/new-set';
import { HistoryComponent } from '../../components/history/history';
import { RecordsComponent } from '../../components/records/records';
import { LineChartComponent } from '../../components/line-chart/line-chart';
import { PipesModule } from '../../pipes/pipes.module';


@NgModule({
  declarations: [
    ItemDetailPage,
    BarChartComponent,
    NewSetComponent,
    HistoryComponent,
    RecordsComponent,
    LineChartComponent
  ],
  imports: [
    IonicPageModule.forChild(ItemDetailPage),
    TranslateModule.forChild(),
    PipesModule
  ],
  exports: [
    ItemDetailPage
  ]
})
export class ItemDetailPageModule { }
