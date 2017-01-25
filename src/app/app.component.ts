import { Component } from '@angular/core';
import { AuthPage } from './pages/auth.page';

@Component({
  template: `<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>`
})
export class AppComponent {

  rootPage = AuthPage;

}
