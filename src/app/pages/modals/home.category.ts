import {Component} from '@angular/core';
import {ViewController, NavParams} from 'ionic-angular';

@Component({
    templateUrl: 'home.category.html',
    styleUrls: ['home.category.scss']
})
export class HomeCategoryModal {
    private title: string = 'Choisis un mot de la catégorie';
    private words: any;

    constructor(public viewCtrl: ViewController, params: NavParams) {
        this.words = params.get('words');
    }

    choseWord(word) {
        this.viewCtrl.dismiss(word);
    }
}
