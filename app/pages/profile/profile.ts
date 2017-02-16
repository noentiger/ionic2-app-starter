import { Component, Injectable } from '@angular/core';
import { Http, Headers } from "@angular/http";
import { Page, Storage, LocalStorage } from 'ionic-angular';
import { FORM_DIRECTIVES } from '@angular/common';
import { JwtHelper } from 'angular2-jwt';
import { AuthService } from '../../services/auth/auth';
import 'rxjs/add/operator/map';
import { API_ENDPOINT } from '../../constants';


@Component({
  templateUrl: 'build/pages/profile/profile.html',
  directives: [FORM_DIRECTIVES]
})
export class ProfilePage {

  API_ENDPOINT: string = API_ENDPOINT;

  auth: AuthService;
  // When the page loads, we want the Login segment to be selected
  authType: string = "login";
  // We need to set the content type for the server
  contentHeader: Headers = new Headers({"Content-Type": "application/json"});
  error: string;
  jwtHelper: JwtHelper = new JwtHelper();
  local: Storage = new Storage(LocalStorage);
  profile: Object = {};

  constructor(private http: Http) {
    this.auth = AuthService;
    this.local.get('profile').then(profile => {
      this.profile = JSON.parse(profile);
    }).catch(error => {
      console.log(error);
    });
  }

  login(credentials) {
    this.http.post(`${API_ENDPOINT}/users/login`, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => this.authSuccess(data.token),
        err => this.error = err
      );
  }

  signup(credentials) {
    this.http.post(`${API_ENDPOINT}/users`, JSON.stringify(credentials), { headers: this.contentHeader })
      .map(res => res.json())
      .subscribe(
        data => { this.login(credentials) },
        err => this.error = err
      );
  }

  logout() {
    this.local.remove('id_token');
    this.profile = null;
  }

  authSuccess(token) {
    this.error = null;
    this.local.set('id_token', token);
    this.profile = this.jwtHelper.decodeToken(token).user;
    this.local.set('profile', JSON.stringify(this.profile));
  }

}
