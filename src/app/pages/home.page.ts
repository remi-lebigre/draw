import {Component} from '@angular/core';
import {NavController, NavParams, ModalController} from 'ionic-angular';
import {DrawPage} from './draw.page';
import {Utilities} from '../services/utilities.service';
import {HomeCategoryModal} from './modals/home.category';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    private title: string = 'Draw le me le something';
    private user: string;
    private wordCategories: any = [
        {id: 0, name: 'sport'},
        {id: 1, name: 'food'},
        {id: 2, name: 'jeux vidéo'},
    ];
    private words: any = [
        {word: 'vélo', category: 0, difficulty: 0},
        {word: 'marathon', category: 0, difficulty: 2},
        {word: 'bowling', category: 0, difficulty: 1},
        {word: 'pizza', category: 1, difficulty: 0},
        {word: 'sushi', category: 1, difficulty: 1},
        {word: 'pho', category: 1, difficulty: 2},
        {word: 'loclac', category: 1, difficulty: 0},
        {word: 'sangoku', category: 2, difficulty: 2},
        {word: 'taupiqueur', category: 2, difficulty: 1},
        {word: 'pokemon', category: 2, difficulty: 0},
    ];
    private wordsToGuess: any = [];
    private categoryToGuess: any = [];
    private wordsLimit: number = 3;

    constructor(public modalCtrl: ModalController, private navParams: NavParams,  private navCtrl: NavController, private _: Utilities) {
        this.wordsToGuess = _.shuffle(this.words).splice(0, this.wordsLimit);
        this.categoryToGuess = _.shuffle(this.wordCategories).shift();
        this.user = this.navParams.get('user');
    }

    startDraw(word) {
        this.navCtrl.push(DrawPage, {word: word});
    }

    startGuess(word) {
        this.navCtrl.push(DrawPage, {guess: word});
    }

    modalWordsFromCategory() {
        let words = this.words.filter((w) => {
            return w.category === this.categoryToGuess.id
        }).map((w) => {
            return w.word;
        })
        console.debug('words', words);
        let modal = this.modalCtrl.create(HomeCategoryModal, {words: words});
        modal.onDidDismiss(word => {
            if (word) {
                this.startDraw(word);
            }
        });
        modal.present();
    }
}
