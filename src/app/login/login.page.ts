import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { ToastController, NavController } from '@ionic/angular';
import { SessionManagerService } from '../providers/session-manager.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss']
})
export class LoginPage implements OnInit {

  user = {
    email : '',
    password : 'test123'
  }

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toaster: ToastController,
    private session: SessionManagerService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {
    
  }

  async login() {
    try {
        const res = await this.afAuth.auth
            .signInWithEmailAndPassword(this.user.email, this.user.password)
            .then(() => this.navCtrl.navigateRoot(['/home']))
            .then((user) => this.session.setCurrentUser(user));
    } catch (err) {
        let message: string;

        if (err.code === 'auth/invalid-email') {
            message = 'Invalid Email. Please try again.';
        } else if (err.code === 'auth/wrong-password') {
            message = 'Invalid Password.';
        } else {
            message = err.message;
        }

        const toast = await this.toaster.create({
            duration: 2000,
            color: 'danger',
            message
        });
        toast.present();
    }
  }
}
