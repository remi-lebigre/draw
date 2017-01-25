import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'size.page.html',
    styleUrls: ['size.page.scss']
})
export class SizePage {
    private title:string = 'Choisis une taille';
    private sizes:any;

    constructor(public viewCtrl:ViewController, params: NavParams) {
        this.sizes = params.get('sizes');
    }

    choseSize(size) {
        this.viewCtrl.dismiss(size);
    }
}
