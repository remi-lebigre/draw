import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {HomePage} from './home.page';

@Component({
    templateUrl: 'auth.page.html',
    styleUrls: ['auth.page.scss']
})
export class AuthPage {

    private title: string = 'Connecte-toi';
    private pseudo: string;
    private password: string;

    constructor(private navCtrl: NavController) {
    }

    connect() {
        console.log('pseudo', this.pseudo);
        console.log('password', this.password);
        //TODO: localstorage credentials
        //TODO: check user connect
        if (1 === 1) {
            this.navCtrl.push(HomePage, {user: this.pseudo});
        }
    }

}
