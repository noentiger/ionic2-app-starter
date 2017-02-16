import { Component } from '@angular/core';
import { Api } from '../../services/api/api';
import { Post } from '../../services/api/post';

@Component({
  templateUrl: 'build/pages/home/home.html',
  providers: [Api]
})

export class HomePage {

  errorMessage: string;
  posts: Post[];
  mode = 'Observable';
  constructor (private api: Api) {}

  // ngOnInit() { this.getMyPosts(); }
  onPageWillEnter() { this.getMyPosts(); }

  getMyPosts() {
    this.api.getMyPosts()
     .subscribe(
       posts => this.posts = posts,
       error =>  this.errorMessage = <any>error);
  }

}
