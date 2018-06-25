import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Records } from '../../providers/providers';
import { IonicPage,
  Nav,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  Img
} from 'ionic-angular';
import { Camera } from '@ionic-native/camera';
import { Storage } from '@ionic/storage';

import { Settings } from '../../providers/providers';
import { User } from '../../providers/providers';
import { Levels } from '../../providers/providers';
import { AuthProvider } from '../../providers/providers';
import { ProvidersUserProvider } from '../../providers/providers-user/providers-user';
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
  height = "0"
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
  userData: any;
  options: any;
  profile_pic: any;
  exercisesLength = 0;

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
    private storage: Storage,
    private userService: ProvidersUserProvider,
    private domSanitizer: DomSanitizer,
    private rec: Records,
    private authProvidor: AuthProvider) {

    this.userData = this.userService.getUser();
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
      // console.log(group.profilePic);
    });
  }

  ionViewDidLoad() {
    this.competitorsList = [];
    this.username = this.userService.getUser().username;
    this.userService.getOneUser(this.username).subscribe(data => {

      this.weight = data.weight;
      this.height = data.height;
      this.gym = data.gym;
      this.location = data.location;
      //this.gym = data.gym;
    })
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});  

    this.userService.getTotalGains(this.userData.id).subscribe(totalGains => {
      console.log(totalGains);
      this.gains = totalGains;
      this.setLevel();
    });;

    this.userService.getCompetingUsers(this.userData.id).subscribe(data => {
      this.competingList = data;
      //console.log(this.competingList);
      this.competing = this.competingList.length;
    })

    this.userService.getCompetitors(this.userData.id).subscribe(data => {
      this.competitorsList = data;
      console.log(this.competitorsList);
      this.competitors = this.competitorsList.length;
    })

    this.userService.getProfilePic(this.userData.username).subscribe(data => {
      console.log(data)
      this.form.patchValue({"profilePic": "data:image/jpeg;base64," + data['_body']});
      if (data['_body'] != "NahNigga"){
        this.show = false;
      }
    });

    this.userService.getExercises().subscribe(exercises => {
      this.exercisesLength = exercises.length;
    });
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
        alert("here");
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
        
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement
      this.fileInput.nativeElement.click();
    }
  }

  processWebImage(event) {
    //alert(event);
    let reader = new FileReader();
    reader.onload = (readerEvent) => {
      this.imageData = (readerEvent.target as any).result;
      console.log(this.imageData);
      this.userService.uploadProfilePic(this.userData.username, this.imageData).subscribe(data => {
        this.show = false;
        this.form.patchValue({ 'profilePic': this.imageData });
      });
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
    this.authProvidor.logout();
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
    this.navCtrl.push('CompetitorsPage', {
      list: this.competitorsList
    });
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
      this.userService.getOneUser(this.username).subscribe(data => {
        this.weight = data.weight;
        this.height = data.height;
        this.gym = data.gym;
        this.location = data.location;
      })
    })
    addModal.present();
  }
}
