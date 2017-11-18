import { Component } from '@angular/core';
import  { StatsLineChart } from '../../models/item';
import  { NavParams } from 'ionic-angular';

import { HistoryProvider } from '../../providers/providers';
import { User } from '../../providers/providers';


import firebase from 'firebase';

/**
 * Generated class for the HistoryComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'history',
  templateUrl: 'history.html'
})
export class HistoryComponent {

  username: any;
  exercise: any;

  constructor(
    navParams: NavParams,
    public user: User,
    private history: HistoryProvider
    ) {

    this.exercise = navParams.get('item');
    
  }

  ngOnInit() {
    this.username = this.user._user;
    this.history._history = [];

    var queryHistory = firebase.database().ref('/' + this.username + '/exercises/' + this.exercise.name + '/history');
    queryHistory.once("value").then( snapshot => {
      snapshot.forEach( childSnapshot => {
        var childData1 = childSnapshot.val();
        var s = {date: childData1.date, reps: childData1.reps, weight: childData1.weight, oneRM: childData1.oneRM};
        this.history._history.push(s); 
      });
    });
  }
}
