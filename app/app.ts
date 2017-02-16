import {Component, provide} from '@angular/core';
import {Platform, ionicBootstrap} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {TabsPage} from './pages/tabs/tabs';
import {Http} from "@angular/http";
import {AuthHttp, AuthConfig, AUTH_PROVIDERS} from 'angular2-jwt';
import { bootstrap }      from '@angular/platform-browser-dynamic';
import { HTTP_PROVIDERS } from '@angular/http';

@Component({
  template: '<ion-nav [root]="rootPage"></ion-nav>',
  providers: [
    provide(AuthHttp, {
      useFactory: (http) => {
        return new AuthHttp(new AuthConfig({
          headerName: 'X-Access-Token',
          headerPrefix: ' '
        }), http);
      },
      deps: [Http]
    }),
    HTTP_PROVIDERS
  ]
})

export class MyApp {

  private rootPage:any;

  constructor(private platform:Platform) {
    this.rootPage = TabsPage;

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }
}

ionicBootstrap(MyApp)
