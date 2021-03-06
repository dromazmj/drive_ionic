import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonicPage, NavController, ViewController, NavParams, AlertController } from 'ionic-angular';
import { CustomRecordsPage } from '../custom-records/custom-records';
import { Storage } from '@ionic/storage';
import { ProvidersUserProvider } from '../../providers/providers-user/providers-user';


import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {

  isReadyToSave: boolean;

  item: any;
  loop = 0;
  show = false;
  lifts = {};
  setlifts = {};
  gains = {};
  myrecords: any;
  users = [];
  username = "test";
  info: { username: any, weight: number, height: number, gym: string, location: string} = { username: this.username, weight: null, height: null, gym: "", location: ""};
  bool = true;
  edit = false;
  data: any;
  competitorsList = [];
  competingList = [];
  userData: any;

  form: FormGroup;

  constructor(
    public navCtrl: NavController,
    public viewCtrl: ViewController, 
    formBuilder: FormBuilder,
    navParams: NavParams,
    public alertCtrl: AlertController,
    private storage: Storage,
    private userService: ProvidersUserProvider) {

    this.userData = this.userService.getUser();

    this.form = formBuilder.group({
      username: [''],
      weight: [''],
      height: [''],
      gym: [''],
      location: ['']
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });

    //this.myrecords = navParams.get('records') || records._records;
  }

  ionViewWillEnter() {
    this.viewCtrl.showBackButton(false);
  }

  ionViewDidLoad() {
    // this.username = localStorage.getItem("username");
    // this.info.username = this.username;
    // console.log(this.username);
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }

  /*
  checkUsername(){
    console.log(this.info.username)
    if(this.info.username != this.username){
      this.show = true
      var query1 = firebase.database().ref('/users');
      query1.once("value").then( snapshot => {
        this.loop = 0;
        snapshot.forEach( childSnapshot => {
          var childData1 = childSnapshot.val();
          this.loop++
          if ( this.info.username == childData1.name ) {
            this.show = false;
            this.repeatUsername()
            return;
          } 
          if ( snapshot.numChildren() == this.loop && this.show == true) {
            this.changeData();
          }
        });
      });
    } else {
      this.changeData();
    }
  }
  */
  changeData(){
    /*
    if(this.info.username != this.username){
      
      localStorage.setItem("username",this.info.username)

      var user = firebase.database().ref('/users/' + this.username);
      user.once("value").then( snapshot => {
        var newUser = snapshot.val();
        var user = firebase.database().ref('/users' + this.info.username);
        user.set(newUser);
      })

      this.getUsers().then((val) => {
        this.users = val;
        this.users.push(this.username);
        this.storage.set('/users', this.users);
      })

      this.getExercises().then((val) => {
        this.lifts = val;
        this.storage.set(this.info.username + '/exercises', this.lifts)
        var exercises = firebase.database().ref(this.info.username + '/exercises');
        exercises.set(this.lifts);
      })

      this.getGains().then((val) => {
        this.gains = val;
        this.storage.set(this.info.username + '/gains', this.gains)
        var gains  = firebase.database().ref(this.info.username + '/gains');
        gains.set(this.gains);
      })

      var queryCompeting = firebase.database().ref('/' + this.username + '/competing');
      queryCompeting.once("value").then( snapshot => {
        var newList = snapshot.val();
        var competing = firebase.database().ref('/' + this.info.username + '/competing');
        competing.set(newList);
        snapshot.forEach( childSnapshot => {
          var childData1 = childSnapshot.val();
          var thisUser = childData1.name
          console.log(thisUser + "USER");
          var thisUsersCompetitors = firebase.database().ref('/' + thisUser + '/competitors');
          thisUsersCompetitors.once("value").then( snapshot2 => {
            this.competitorsList = [];
            snapshot2.forEach( childSnapshot2 => {
              var childData2 = childSnapshot2.val();
              console.log(childData2);
              if (childData2 != this.username){
                this.competitorsList.push(childData2) 
              }
            })
          }).then(() => {
            this.competitorsList.push(this.info.username)
            thisUsersCompetitors.set(this.competitorsList)
          })
        })
      })

      
      var queryCompetitors = firebase.database().ref('/' + this.username + '/competitors');
      queryCompetitors.once("value").then( snapshot => {
        var newList = snapshot.val();
        var competitors = firebase.database().ref('/' + this.info.username + '/competitors');
        competitors.set(newList);
        snapshot.forEach( childSnapshot => {
          var childData1 = childSnapshot.val();
          var thisUser = childData1.name

          var thisUsersCompeting = firebase.database().ref('/' + thisUser + '/competing');
          thisUsersCompeting.once("value").then( snapshot2 => {
            this.competingList = [];
            snapshot2.forEach( childSnapshot2 => {
              var childData2 = childSnapshot2.val();
              //console.log(childData2);
              if (childData2 != this.username){
                this.competingList.push(childData2) 
              }
            })
          }).then(() => {
            this.competingList.push(this.info.username)
            thisUsersCompeting.set(this.competitorsList)
          })
        })
      })

      var queryPic = firebase.database().ref('/users/' + this.username + '/profilePic');
      queryPic.once("value").then( snapshot => {
        var pic = snapshot.val();
        var profilePic = firebase.database().ref('/users/' + this.info.username + '/profilePic');
        profilePic.set(pic);
      })
      
    }
    */

    this.userData.weight = this.info.weight;
    this.userData.height = this.info.height;
    this.userData.gym = this.info.gym;
    this.userData.location = this.info.location;
    this.userService.createUser(this.userData).subscribe(response => console.log(response));

  	// var weight = firebase.database().ref('/users/' + this.info.username + '/weight');
  	// weight.set(this.info.weight);

  	// var height = firebase.database().ref('/users/' + this.info.username + '/height');
  	// height.set(this.info.height);

  	// var gym = firebase.database().ref('/users/' + this.info.username + '/gym');
  	// gym.set(this.info.gym);

  	// var location = firebase.database().ref('/users/' + this.info.username + '/location');
  	// location.set(this.info.location);

  	this.done();
  }

  getUsers(): Promise<any> {
    return this.storage.get('/users');
  }

  getExercises(): Promise<any> {
    return this.storage.get(this.username + '/exercises');
  }

  getGains(): Promise<any> {
    return this.storage.get(this.username + '/gains');
  }

  repeatUsername(){
    let alert = this.alertCtrl.create({
      title: "Someone is already using this username.",
      buttons: ['Ok']
    });
    alert.present(); 
  }
}
