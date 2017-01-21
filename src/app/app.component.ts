import { Component } from '@angular/core';
import { HomePage } from './pages/home.page';

@Component({
  template: `<ion-nav [root]="rootPage" swipeBackEnabled="false"></ion-nav>`
})
export class AppComponent {

  rootPage = HomePage;

}
