import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { Items } from '../../providers/providers';
import { Records } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Levels } from '../../providers/providers';
import { HistoryProvider } from '../../providers/providers';
import { ProvidersUserProvider } from '../../providers/providers-user/providers-user';
import { UserModel } from '../../models/users';
import { Exercise } from '../../models/Exercise';

import { BarChartComponent } from '../../components/bar-chart/bar-chart';
import { LineChartComponent } from '../../components/line-chart/line-chart';
import { SortByRepsPipe } from '../../pipes/sort-by-reps/sort-by-reps';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-exercise-detail',
  templateUrl: 'exercise-detail.html'
})
export class ItemDetailPage {

  selectedValue = 0;
  exercise: any;
  username: any;
  segment = "set";
  loop = 0;
  checkRec = false;
  history = [];

  // @ViewChild(BarChartComponent) barChart: BarChartComponent
  // @ViewChild(LineChartComponent) lineChart: LineChartComponent

  constructor(public navCtrl: NavController,
    navParams: NavParams,
    items: Items,
    public records: Records,
    public user: User,
    public levels: Levels,
    private platform: Platform,
    private userService: ProvidersUserProvider) {
      this.platform.ready().then((readySource) => {
        console.log("anything")
        console.log('Platform ready from', readySource);
        // Platform now ready, execute any required native code
      });
    }

  ionViewWillEnter() {
    this.records._records = [
      
    ];
    this.records._chart = [
      
    ];
    
    this.getRecords();
  }

  getRecords() {
    // this.userService.getExercises().subscribe(exercises => {
    //   this.exercises = exercises;
    // });
    console.log("here");
    console.log(this.exercise);
    
    
    
    
    
    // this.getExercises().then((val) => {
    //   var keyOne = this.exercise.name + '-' + this.exercise.variation
    //   var history = val[keyOne].history;
    //   //console.log(val[keyOne].history);
    //   if (history) {
    //     Object.keys(history).forEach ( (set) => {
    //       this.checkRec = false;
    //       this.records._records.forEach( (value, index) => {
    //         if (history[set].reps == value.reps) {
    //           this.checkRec = true;
    //           if (history[set].weight > value.weight) {
    //             this.records._records[index].weight = history[set].weight;
    //             this.records._records[index].oneRM = history[set].oneRM;
    //             this.records._records[index].records++;
    //           }
    //         }
    //       });
    //       if (this.checkRec == false){
    //         this.records._records.push({reps: history[set].reps, weight: history[set].weight, oneRM: history[set].oneRM, records: 1})
    //       }
    //     })
    //   }
    // });

    // this.barChart.makeChart();
    // this.lineChart.makeChart2();
  }
  
  showBar() {
    this.selectedValue = 1;
  }

  showLine() {
    this.selectedValue = 2;
  }

  hideCharts() {
    this.selectedValue = 0;
  }
  
  // getExercises(): Promise<any> {
  //   return this.storage.get(this.username + '/exercises');
  // }
}
