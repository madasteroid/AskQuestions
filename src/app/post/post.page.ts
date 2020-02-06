import { Component, OnInit } from '@angular/core';
import { Post, PostManagerService } from '../providers/post-manager.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { ReplaySubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { Reply } from '../types/Reply';
import { SessionManagerService } from '../providers/session-manager.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {

  reply: Reply = {
    text: '',
    username: '',
    userId: '',
    createdAt: 0
  };

  currentUserId: string;
  postId: string;
  post: Post;

  constructor(private route: ActivatedRoute, 
    private router: Router,
    private postManager: PostManagerService, 
    private loadCtrl: LoadingController, 
    private afAuth: AngularFireAuth,
    private session: SessionManagerService) {

    if (!this.afAuth.auth.currentUser) {
      this.afAuth.auth.signOut()
      .then(() => this.router.navigate(['/']));
    }  
    this.postId = this.route.snapshot.paramMap.get('id');
    this.currentUserId = this.afAuth.auth.currentUser.uid;

  }

  async ngOnInit() {

    const loader = await this.loadCtrl.create({
      message: 'Loading',
      duration: 10000
    });

    await loader.present();

    this.postManager.getPost(this.postId).subscribe(data => {
      this.post = data;
      console.log(this.post);
    });

    
    await loader.dismiss();
  }
  
  async sendReply() {
    this.reply.createdAt = new Date().getTime();    
    this.reply.username = this.afAuth.auth.currentUser.displayName;
    this.reply.userId   = this.afAuth.auth.currentUser.uid;
    
    this.post.replies.push(this.reply);
    
    const loader = await this.loadCtrl.create({
      message: 'Loading',
      duration: 10000
    });

    await loader.present();
    this.postManager.updatePost(this.post, this.postId).then(()=> {
      this.reply.text = '';
    })
    await loader.dismiss();

  }
}

