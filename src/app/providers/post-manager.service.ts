import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reply } from '../types/Reply';

export interface Post {
  id?: string;
  question: string;
  replies: Reply[];
  upVotes: string[];
  downVotes: string[];
  createdAt: number;
  username: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostManagerService {
  private postCollection: AngularFirestoreCollection<Post>;
 
  private posts: Observable<Post[]>;
 
  constructor(private db: AngularFirestore) { 
    this.postCollection = this.db.collection<Post>('posts');
    
  }

  public getPosts() {
    return this.postCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return {id, ...data};
        });
      })
    )
  }

  public getPost(id: string) {
    return this.postCollection.doc<Post>(id).valueChanges();
  }

  public addPost(post: Post) {
    const id = this.db.createId();
    return this.postCollection.add(post);
  }

  public updatePost(post: Post, id: string) {
    return this.postCollection.doc(id).update(post);
  }

  public removePost(id: string) {
    return this.postCollection.doc(id).delete();
  }
}
