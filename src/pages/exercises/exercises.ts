import { Component } from '@angular/core';
import { 
  IonicPage,
  ModalController,
  NavController,
  ActionSheetController,
  AlertController
} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Platform } from 'ionic-angular';

import { Item } from '../../models/item';
import { Items } from '../../providers/providers';
import { Records } from '../../providers/providers';
import { KeysPipe } from '../../pipes/keys/keys'

import firebase from 'firebase';

import { User } from '../../providers/providers';
import { ExerciseProvider } from '../../providers/exercise/exercise';
import { ProvidersUserProvider } from '../../providers/providers-user/providers-user';
import { UserModel } from '../../models/users';
import { Exercise } from '../../models/Exercise';

@IonicPage()
@Component({
  selector: 'page-exercises',
  templateUrl: 'exercises.html'
})
//@Injectable()
export class ListMasterPage {
  username = "bob";
  users = [];

  names = ["Lift 1"];
  about = ["nothing"];

  filter= "All";
  show = true;
  loop = 0;
  gains = 0;
  status = ""
  totalGains = [];

  filteredExercises = [];

  private User: UserModel;
  private exercises: Exercise[];


  constructor(
    public navCtrl: NavController,
    public user: User,
    public items: Items,
    public records: Records,
    public modalCtrl: ModalController,
    private alertCtrl: AlertController,
    public actShtCtrl: ActionSheetController,
    private storage: Storage,
    private platform: Platform,
    private exerciseService: ExerciseProvider,
    private userService: ProvidersUserProvider) {
    this.platform.ready().then((readySource) => {
      console.log("anything")
      console.log('Platform ready from', readySource);
      // Platform now ready, execute any required native code
    });
  }

  ionViewWillEnter(){
    this.ionViewDidLoad();
  }

  /**
   * The view loaded, let's query our items for the list
   */
  ionViewDidLoad() {
    //console.log(this.records._cardioRecs)
    console.log(this.userService.getUser().email);
    if (this.userService.getUser().username == "Currybde") {
      this.getLocalExercises().then(exercises =>{
        exercises.forEach(exercise =>{
          var history = firebase.database().ref(this.userService.getUser().username + "/exercisesNew//history");
          history.push(exercise);
        });
      });
    }
    
    this.userService.getExercises().subscribe(exercises => {

      this.exercises = exercises;
      this.filteredExercises = exercises;
      this.show = false;
    });
  }

  getUsers(): Promise<any> {
    console.log("at user method");
    console.log(JSON.stringify(this.storage.get('/users')));
    return this.storage.get('/users');
  }
  
  getLocalExercises(): Promise<any> {
    return this.storage.get(this.username + '/exercises');
  }

  getGains(): Promise<any> {
    return this.storage.get(this.username + '/gains');
  }

  addExercise() {
    //this.navCtrl.push('ItemCreatePage');
    let addModal = this.modalCtrl.create('ItemCreatePage');
    addModal.onDidDismiss(item => {
      if (item) {
        this.ionViewDidLoad();
      }
    })
    addModal.present();
  }

  presentConfirm(item) {
    let alert = this.alertCtrl.create({
      title: 'Delete?',
      message: 'Do you want to delete ' + item.name + ' from you exercises? You will keep the gains',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Delete',
          handler: () => {
            this.deleteItem(item);
          }
        }
      ]
    });
    alert.present();
  }

  deleteItem(item) {
    this.userService.removeExercise(item.id).subscribe(data =>
      {
      this.ionViewDidLoad();
      }
    );

  }

  /**
   * Navigate to the detail page for this item.
   */
  openItem(exercise) {
    this.navCtrl.push('ItemDetailPage', {
      exercise: exercise,
      muscleGroup: exercise.MuscleGroup.muscleGroupName
    });
  }

  filterExercises(){
    let actionSheet = this.actShtCtrl.create({
      title: 'Filter Exercises By Muscle Group',
      buttons: [
        {
          text: 'All',
          handler: () => {
            this.filteredExercises = this.exercises
          }
        },{
          text: 'Chest',
          handler: () => {
            this.filter = "Chest";
            this.executeFilter()
          }
        },{
          text: 'Back',
          handler: () => {
            this.filter = "Back";
            this.executeFilter()          
          }
        },{
          text: 'Legs',
          handler: () => {
            this.filter = "Legs";
            this.executeFilter()          
          }
        },{
          text: 'Core',
          handler: () => {
            this.filter = "Core";
            this.executeFilter()          
          }
        },{
          text: 'Shoulders',
          handler: () => {
           this.filter = "Shoulders";
            this.executeFilter()
          }
        },{
          text: 'Arms',
          handler: () => {
            this.filter = "Arms";
            this.executeFilter()          
          }
        },{
          text: 'Cardio',
          handler: () => {
            this.filter = "Cardio";
            this.executeFilter()          
          }
        },{
          text: 'Other',
          handler: () => {
            this.filter = "Other";
            this.executeFilter()          
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  executeFilter(){
    this.filteredExercises = [];
    this.exercises.forEach((exercise) => {
      if (exercise.MuscleGroup.muscleGroupName == this.filter){
          this.filteredExercises.push(exercise);
      }
    })
    //alert(this.lifts["Bench Press-Barbell"].name)
    // Object.keys(this.setlifts).forEach( (key, index) => {
    //   if (this.setlifts[key].muscle == this.filter){
    //     this.lifts[key] = this.setlifts[key]
    //   }
    // });
  }

  editExercise(item){
    this.navCtrl.push('ItemCreatePage', {
      exercise: item
    });
  }
}
