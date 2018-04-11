import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage,
  Nav,
  NavController,
  NavParams,
  AlertController,
  ModalController
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

import { Settings } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Levels } from '../../providers/providers';
//import { WelcomePage } from '../pages';

import firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class SettingsPage {
  // Our local settings object
  @ViewChild('fileInput') fileInput;
  @ViewChild(Nav) nav: Nav;
  xlevel = 1;
  xcurrent = 25;
  xtotal = 100;
  progress = 25;
  username = "test"
  rank = "Frail Body"
  weight = 0
  height = 0
  gym = "gym"
  location = "location"
  loop = 0;
  gains = 0;
  records = 0;
  competing = 0;
  competitors = 0;
  competingList = [];
  competitorsList = [];
  realCompetitorsList = [];
  imageData: any;

  options: any;

  show: boolean = true;
  load: boolean = true;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'Profile';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public translate: TranslateService,
    public camera: Camera,
    private user: User,
    public levels: Levels,
    private storage: Storage) {
  }

  _buildForm() {

    let group: any = {
      profilePic: [''],
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
      var pic = firebase.database().ref('/users/' + this.username + '/profilePic');
      pic.set(this.form.controls['profilePic'].value);
      console.log(group.profilePic);
    });
  }

  ionViewDidLoad() {
    this.competitorsList = [];
    this.username = localStorage.getItem("username");
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});  

    this.storage.get(this.username + '/gains').then((val) => {
      this.gains = 0;
      this.records = 0;
      //console.log('Your json is', val);
      if (val) {
        val.forEach ( (value) => {
          this.gains = this.gains + value.gains;
          if (value.gains == 10){
            this.records++;
          }
        })
      }
    }).then(() => {
      console.log(this.gains)
      this.setLevel();
    })

    
    var queryCompeting = firebase.database().ref('/' + this.username + '/competing');
    queryCompeting.once("value").then( snapshot => {
      this.competing = 0;
      this.competingList = [];
      snapshot.forEach( childSnapshot => {
        var childData1 = childSnapshot.val();
        this.competingList.push(childData1)
        //console.log(this.competingList)
        this.competing++
        //console.log(this.competing)
      })
    })

    
    var queryCompetitors = firebase.database().ref('/' + this.username + '/competitors');
    queryCompetitors.once("value").then( snapshot => {
      this.competitors = 0;
      this.competitorsList = [];
      snapshot.forEach( childSnapshot => {
        this.competitors++
        var childData1 = childSnapshot.val();
        this.competitorsList.push(childData1);
        
      })
    })

    var queryPic = firebase.database().ref('/users/' + this.username + '/profilePic');
    queryPic.once("value").then( snapshot => {
      var pic = snapshot.val();
      if(pic){
        this.form.patchValue({ 'profilePic': pic });
        this.show = false;
      }
    })

    var queryWeight = firebase.database().ref('/users/' + this.username + '/weight');
    queryWeight.once("value").then( snapshot => {
      var weight = snapshot.val();
      if (weight){
        this.weight = weight
      }
    })

    var queryHeight = firebase.database().ref('/users/' + this.username + '/height');
    queryHeight.once("value").then( snapshot => {
      var height = snapshot.val();
      if (height){
        this.height = height
      }
    })

    var queryGym = firebase.database().ref('/users/' + this.username + '/gym');
    queryGym.once("value").then( snapshot => {
      var gym = snapshot.val();
      if (gym){
        this.gym = gym
      }
    })

    var queryLocation = firebase.database().ref('/users/' + this.username + '/location');
    queryLocation.once("value").then( snapshot => {
      var location = snapshot.val();
      if (location){
        this.location = location
      }
    })
  }

  setLevel () {
    this.levels._levels.forEach( ( value, index) => {
      if (this.gains > value.totalPoints -1) {
        this.xcurrent = this.gains - value.totalPoints;
        this.xlevel = value.level;
        this.xtotal = value.levelPoints;
        this.progress = this.xcurrent / this.xtotal * 100
      }
      if (this.xlevel < 10){
        this.rank = "FRAIL BODY"
      } else if ( this.xlevel >= 10 && this.xlevel < 20){
        this.rank = "GYM RAT"
      } else if ( this.xlevel >= 20 && this.xlevel < 30){
        this.rank = "BODYBUILDER"
      } else if ( this.xlevel > 30){
        this.rank = "OLYMPIAN"
      }
    })
    
  }

  getPicture() {
    this.load = true;
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });

      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }



  }

  processWebImage(event) {
    //alert(event);
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      this.imageData = (readerEvent.target as any).result;
      this.show = false;
      this.form.patchValue({ 'profilePic': this.imageData });
    };
    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {

    try {
      //this.noLoad();
      return 'url(' + this.form.controls['profilePic'].value + ')'
    }
    catch(err){

    }
    finally{
      
    }
    
  }

  noLoad(){
    this.load = false;
  }

  ionViewWillEnter() {
    this.username = localStorage.getItem("username");
    this.ionViewDidLoad();
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;
    
    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  ngOnChanges() {
    console.log('Ng All Changes');
  }

  logOut(){
    let alert = this.alertCtrl.create({
      title: 'Logout of ' + this.username + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.reallyLogOut();
          }
        }
      ]
    });
    alert.present();
  }

  reallyLogOut(){
    localStorage.setItem("stay","out");
    localStorage.setItem("email","");
    window.location.reload();
    this.navCtrl.push("FirstRunPage");
  }

  rules(){
    this.navCtrl.push('RulesPage');
  }

  goToCompeting(){
    console.log(this.competingList)
    this.navCtrl.push('CompetingPage', {
      list: this.competingList
    });

  }

  goToCompetitors(){
    this.realCompetitorsList = [];
    console.log(this.competitorsList)
    this.competitorsList.forEach((val) => {
      this.loop = 0;
      var queryPic = firebase.database().ref('/users/' + val + '/profilePic');
      queryPic.once("value").then( snapshot => {
        var pic = snapshot.val();
        this.realCompetitorsList.push({name: val, profilePic: pic})
        this.loop++
        if (this.loop == this.competitorsList.length){
          this.navCtrl.push('CompetitorsPage', {
            list: this.realCompetitorsList,
            competing: this.competingList
          });
        }
      })
    })
  }

  goToRecords(){
    this.navCtrl.push('RecordsPage');
  }

  goToGains(){
    this.navCtrl.push('GainsPage');
  }

  editProfile(){
    let addModal = this.modalCtrl.create('EditProfilePage');
    addModal.onDidDismiss(item => {
      this.ionViewDidLoad();
    })
    addModal.present();
  }
}
