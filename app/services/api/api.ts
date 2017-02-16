import { Injectable }               from '@angular/core';
import { Response }                 from "@angular/http";

import { AuthHttp }                 from 'angular2-jwt';

import { API_ENDPOINT }             from '../../constants';
import { Post }                     from './post';
import { Observable }               from 'rxjs/Rx';

@Injectable()
export class Api {

  constructor(private authHttp: AuthHttp) {
  }

  getMyPosts (): Observable<Post[]> {
    return this.authHttp.get(`${API_ENDPOINT}/users/me/posts?sort=-created_at`)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addPost (data) {
    return this.authHttp.post(`${API_ENDPOINT}/posts`, data)
      .map(this.extractData)
      .catch(this.handleError);
  }

  private extractData(res: Response) {
    let body = res.json();
    console.log('body', body);
    return body || { };
  }
  private handleError (error: any) {
    // In a real world app, we might use a remote logging infrastructure
    // We'd also dig deeper into the error to get a better message
    let errMsg = (error.message) ? error.message :
      error.status ? `${error.status} - ${error.statusText}` : 'Server error';
    console.error(errMsg); // log to console instead
    return Observable.throw(errMsg);
  }

}
