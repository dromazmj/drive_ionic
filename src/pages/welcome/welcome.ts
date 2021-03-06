import { Component } from '@angular/core';
import { IonicPage, NavController, ToastController, AlertController, Alert, LoadingController, Keyboard } from 'ionic-angular';
import { ProvidersUserProvider, AuthProvider } from '../../providers/providers';
import { MainPage } from '../pages';
import firebase from 'firebase';
import { Firebase } from '@ionic-native/firebase';

import { Error } from '@firebase/auth-types';
import { APIUser } from '../../models/APIUser'
// import {JwtHelperService} from "@auth0/angular-jwt";
import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import {finalize} from 'rxjs/operators';
import {Storage} from "@ionic/storage";
import { FcmProvider } from '../../providers/fcm/fcm';

import { tap } from 'rxjs/operators';
/**
 * The Welcome Page is a splash page that quickly describes the app,
 * and then directs the user to create an account or log in.
 * If you'd like to immediately put the user onto a login/signup page,
 * we recommend not using the Welcome page.
*/
@IonicPage()
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
@Injectable()

export class WelcomePage {

   account: { email: string, password: string } = {
    email: '',
    password: ''
  };

  user: string;

  log: boolean;

  private buttonPressed: Boolean = false;
  private showFooter: boolean = true;

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
    private userService: ProvidersUserProvider,
    private authProvider: AuthProvider,
    private toastCtrl: ToastController,
    public httpClient: HttpClient,
    public keyboard: Keyboard,
    // public jwtHelper: JwtHelperService,
    public firebaseNative: Firebase,
    private readonly loadingCtrl: LoadingController,
    private storage: Storage,
    private fcm: FcmProvider
  ) { 

    keyboard.didShow.subscribe(() => {
      console.log("here");
      this.showFooter = false;
   });
   
   keyboard.didHide.subscribe(() => {
      this.showFooter = true;
   });


    // authProvider.authUser.subscribe(jwt => {
    //   if (jwt) {
    //     this.userService.getUserByEmail(this.account.email).subscribe(data =>{
    //       this.userService.setUser(data);
    //       this.navCtrl.push(MainPage);
    //       // Get a FCM token
    //       fcm.getToken();

    //       // Listen to incoming messages
    //       fcm.listenToNotifications().pipe(
    //         tap(msg => {
    //           console.log("FIRST MESSAGE" + JSON.stringify(msg));
    //           if (msg['tap'] == true) {
    //             console.log("here");
    //             userService.getOneUser(msg['user'].split(' ')[0]).subscribe(user => {
    //               this.navCtrl.push(MainPage).then(() => {
    //                 this.navCtrl.push('FriendProfilePage', {
    //                   item: user
    //                 });
    //               })
    //             })
    //           }
    //           // show a toast
    //           const toast = toastCtrl.create({
    //             message: msg['body'],
    //             duration: 3000,
    //             position: 'top'
    //           });
    //           toast.present();
    //         })
    //       ).subscribe()
    //     },
    //     err => console.log(err));
    //   } else { }
    // });
  }

  signup() {
    this.navCtrl.push('SignupPage');
  }

  login() {

    this.buttonPressed = true;

    if(this.account.email == ''){
      let emptyEmail = this.alertCtrl.create({
        title: "Error",
        message: "Please enter your email!",
        buttons: ['Ok']
      });

      emptyEmail.present();
      this.buttonPressed = false;
    }
    else if(this.account.password == ''){
      let emptyPassword = this.alertCtrl.create({
        title: "Error",
        message: "Please enter your password!",
        buttons: ['Ok']
      });
      emptyPassword.present();
      this.buttonPressed = false;
    }
    else{
      this.authLogin()
        .then(value => {
          console.log(value);
          let user = new APIUser;
          user.email = this.account.email
          user.password = this.account.password
          user.username = this.account.email.split('@')[0]
          this.signupWithAPI(user);
        }).catch( error => {
          this.presentFirebaseError(error)
        });
    }
  }

  keyboardCheck() {
    console.log("KEYBOARD OPEN");
    if (this.keyboard.isOpen()) {
        // You logic goes here
        this.showFooter = false;
    }
  }

  loginWithAPI(value: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in ...'
    });

    loading.present();

    this.authProvider
      .login(value)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        () => {},
        err => {
          alert(err)
          this.handleError(err);
        });
  }

  signupWithAPI(value: any) {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles',
      content: 'Logging in ...'
    });

    loading.present();
    if (localStorage.getItem("jwt_token")) {
      localStorage.removeItem("jwt_token");
    }

    this.authProvider
      .signup(value, this.account.email)
      .pipe(finalize(() => loading.dismiss()))
      .subscribe(
        (jwt) => { },
        err => console.log(err));
  }

  handleError(error: any) {
    alert(error)
    let message: string;
    if (error.status && error.status === 401) {
      message = 'Login failed';
    }
    else {
      message = `Unexpected error: ${error.statusText}`;
    }

    const toast = this.toastCtrl.create({
      message,
      duration: 5000,
      position: 'bottom'
    });

    toast.present();
  }

  stayLogged() {
    if (this.log == false){
      this.log = true;
    } else if (this.log == true){
      this.log = false;
    }
  }

  presentFirebaseError(error: Error){
    console.log(error.code);
    console.log(error.message);
    this.buttonPressed = false;
    let firebaseError: Alert = this.alertCtrl.create({
     title: "Error",
     message: "Something went wrong!",
     buttons: ['Ok']
   });
   if(error.code === "auth/email-already-in-use"){
     firebaseError.setMessage("There is an existing account associated with this email")
   }
   else if(error.code === "auth/invalid-email"){
     firebaseError.setMessage("Please enter a valid email")
   }
   else if(error.code === "auth/weak-password"){
     firebaseError.setMessage("Password must be at least 6 characters")
   }
   else if(error.code === "auth/wrong-password"){
    firebaseError.setMessage("Invalid password")
   }
    firebaseError.present();
  }
 
  authLogin() : Promise<any> {
    return firebase.auth().signInWithEmailAndPassword(this.account.email, this.account.password);
  }

  saveLogin() {
      localStorage.setItem("stay","logged");
      localStorage.setItem("email",this.account.email);
    }
}
