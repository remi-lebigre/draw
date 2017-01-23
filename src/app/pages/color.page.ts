import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'color.page.html',
    styleUrls: ['color.page.scss']
})
export class ColorPage {
    private title:string = 'Choisis une couleur';
    private colors:any;

    constructor(public viewCtrl:ViewController, params: NavParams) {
        this.colors = params.get('colors');
    }

    choseColor(color) {
        this.viewCtrl.dismiss(color);
    }
}
