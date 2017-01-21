import {Component} from '@angular/core';
import {NavController} from 'ionic-angular';
import {DrawPage} from './draw.page';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    private title:string = 'Draw le me le something';

    constructor(private navCtrl:NavController) {
    }

    startDraw(word) {
        this.navCtrl.push(DrawPage, {word: word});
    }
}
