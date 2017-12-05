import { Component } from '@angular/core';
import { NavParams } from 'ionic-angular';

import { User } from '../../providers/providers';
import { Records } from '../../providers/providers';

@Component({
  selector: 'records',
  templateUrl: 'records.html'
})
export class RecordsComponent {

  exercise: any;
  username: any;

  constructor(
    navParams: NavParams,
    public user: User,
    public records: Records
    ) {
    this.exercise = navParams.get('item');
  }

}