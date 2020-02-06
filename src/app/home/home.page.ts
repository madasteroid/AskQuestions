import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Post, PostManagerService } from '../providers/post-manager.service';
import { LoadingController, NavController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { SessionManagerService } from '../providers/session-manager.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  newPost: Post = {
    question: '',
    upVotes: [],
    downVotes: [],
    replies: [],
    createdAt: 0,
    username: '',
    userId: ''
  };

  posts: Post[];
  currentUserId: string;

  constructor(private afAuth: AngularFireAuth,
     private postManager: PostManagerService,
     private loadCtrl: LoadingController,
     private router: Router,
     private navCtrl: NavController,
     private alertCtrl: AlertController
     ) {
    if (!this.afAuth.auth.currentUser) {
      this.afAuth.auth.signOut()
      .then(() => this.navCtrl.navigateRoot('login'));
    }
    this.currentUserId = this.afAuth.auth.currentUser.uid;
    this.getPosts();
    
  }

  ngOnInit() {
    this.getPosts();
  }
  
  async getPosts() {
    const loader = await this.loadCtrl.create({
      message: "Fetching questions",
      duration: 10000
    });

    await loader.present();

    this.postManager.getPosts().subscribe(posts => {      
      this.posts = posts.sort((a, b) => {
        return b.createdAt - a.createdAt;
      })
      
    });
    
    return loader.dismiss();  
  }

  async getCurrentUsersPost() {
    const loader = await this.loadCtrl.create({
      message: "Fetching questions",
      duration: 10000
    });

    await loader.present();

    this.postManager.getPosts().subscribe(posts => {      
      this.posts = posts.filter((post)=> {
        console.log(post);
        console.log(this.currentUserId);
        
        return post.userId == this.currentUserId;
      }).sort((a, b) => {
        return b.createdAt - a.createdAt;
      })

      console.log(this.posts);
      
      
    });
    
    return loader.dismiss();  
  }

  doRefresh(event) {
    setTimeout(() => {
      this.getPosts();
      event.target.complete();
    }, 2000);
  }

  async postQuestion() {

    const loader = await this.loadCtrl.create({
      message: "Fetching questions",
      duration: 10000
    });

    await loader.present();

    this.newPost.username = this.afAuth.auth.currentUser.displayName;
    this.newPost.userId = this.currentUserId;
    this.newPost.createdAt = new Date().getTime();
    
    this.postManager.addPost(this.newPost).then(() => {
      this.newPost.question = "";
    });

    return await loader.dismiss();
  }

  likeIt(post: Post) {
    
    if(!post.upVotes.includes(this.currentUserId)){
      post.upVotes.push(this.currentUserId);
    } else {
      post.upVotes.splice(post.upVotes.indexOf(this.currentUserId));
    }
    this.postManager.updatePost(post, post.id);
  }

  unlikeIt(post: Post) {
    
    if(!post.downVotes.includes(this.currentUserId)){
      post.downVotes.push(this.currentUserId);
    } else {
      post.downVotes.splice(post.downVotes.indexOf(this.currentUserId));
    }
    this.postManager.updatePost(post, post.id);
  }

  reply(id: string) {
    this.router.navigate(['/post/' + id]);
  }

  async logout() {
    const loader = await this.loadCtrl.create({
      message: "Logging Out",
      duration: 10000
    });

    await loader.present();

    this.afAuth.auth.signOut()
    .then(()=> this.navCtrl.navigateRoot('/'));

    return await loader.dismiss();

  }

  async deleteQuestion(post: Post) {
    
    const alerter = await this.alertCtrl.create({
      header: 'Delete Post',
      message: 'Are you sure you want to delete the post?',
      buttons: [{
        text: 'Cancel',
        role: 'cancel',
        cssClass: 'secondary',
        handler: (blah) => {
          console.log('Confirm Cancel: blah');
        }
      }, 
      {
        text: 'Yes',
        handler: () => {
          if (this.currentUserId == post.userId) {
            
            this.postManager.removePost(post.id);
            this.getPosts();
          }        
        }
      }]
    });
    
    return await alerter.present();
  }
}
