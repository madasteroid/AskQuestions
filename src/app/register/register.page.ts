import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { User } from '../types/User';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss']
})
export class RegisterPage implements OnInit {

  confirmPassword: String = '';
  user: User = {
    email: '' ,
    password: '',
    displayName: ''
  }

  constructor(
    private afAuth: AngularFireAuth,
    private router: Router,
    private toaster: ToastController
  ) {}

  ngOnInit() {}

  async register() {

    if (this.user.password !== this.confirmPassword) {
      const toast = await this.toaster.create({
        duration: 2000,
        color: 'danger',
        message: 'Confirm Password does not match.'
      });
      toast.present();
    }

    try {
      const res = await this.afAuth.auth
        .createUserWithEmailAndPassword(this.user.email, this.user.password)
        .then((user) => {
          return user.user.updateProfile({
            displayName: this.user.displayName
          });
        })
        .then(() => {
          this.router.navigate(['/login']);
        });
      console.log(res);
    } catch (err) {
      let message: string;

      if (err.code === 'auth/invalid-email') {
        message = 'Invalid Username.';
      } else if (err.code === 'auth/email-already-in-use') {
        message = 'Username already in use.';
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
