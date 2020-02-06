import { Injectable } from '@angular/core';
import { User } from '../types/User';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  private currentUser: any;
  constructor(){
  }

  ngOnDestroy(){
    this.currentUser = undefined;
  }

  setCurrentUser(user: any){
    this.currentUser = user;
  }

  getCurrentUser(){
    return this.currentUser;
  }

  getUsername() {
    return this.currentUser.displayName;
  }
}
