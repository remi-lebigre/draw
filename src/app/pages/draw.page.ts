import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform, ModalController, AlertController} from 'ionic-angular';
import {ColorPage} from './color.page';
import {SizePage} from './size.page';

@Component({
    templateUrl: 'draw.page.html',
    styleUrls: ['draw.page.scss']
})
export class DrawPage {

    private title: string;
    private currentWord: string;
    private isGuess: boolean = false;
    private drawing: boolean = false;
    private ctx: any = null;
    private width: number = 400;
    private offsetTop: number;
    private lines: any = [];
    private color: string = 'black';
    private linesUndone: any = [];
    private currentLine: any = {
        coords: [],
        color: 'black',
        opacity: 1,
        lineWidth: 10
    };
    private opacity: number = 1;
    private loop: number = 0;
    private lineWidth: number = 10;
    private colors: any = {
        red: ['255', '0', '0'],
        green: ['0', '255', '0'],
        blue: ['0', '0', '255'],
        black: ['0', '0', '0'],
    };
    private sizes: any = [1, 5, 10];
    private lineToDraw: any = {};
    private canvas: any;
    private pizza: any = [{
        "coords": [[183, 2], [181, 3], [179, 3], [177, 4], [169, 8], [152, 24], [133, 50], [121, 74], [113, 97], [111, 116], [111, 132], [111, 143], [111, 154], [116, 166], [125, 176], [152, 191], [178, 198], [209, 204], [231, 206], [250, 207], [259, 207], [273, 206], [282, 198], [290, 186], [296, 164], [300, 136], [301, 111], [301, 100], [291, 87], [281, 80], [266, 74], [248, 68], [222, 58], [207, 53], [193, 49], [185, 47], [179, 47], [177, 47], [173, 47]],
        "color": "red",
        "opacity": 1,
        "lineWidth": 10
    }, {
        "coords": [[183, 2], [181, 3], [179, 3], [177, 4], [169, 8], [152, 24], [133, 50], [121, 74], [113, 97], [111, 116], [111, 132], [111, 143], [111, 154], [116, 166], [125, 176], [152, 191], [178, 198], [209, 204], [231, 206], [250, 207], [259, 207], [273, 206], [282, 198], [290, 186], [296, 164], [300, 136], [301, 111], [301, 100], [291, 87], [281, 80], [266, 74], [248, 68], [222, 58], [207, 53], [193, 49], [185, 47], [179, 47], [177, 47], [173, 47]],
        "color": "green",
        "opacity": 1,
        "lineWidth": 1
    }];
    @ViewChild('sheet') sheet;

    constructor(private alertCtrl: AlertController, public modalCtrl: ModalController, private navCtrl: NavController, navParams: NavParams, private platform: Platform) {
        this.currentWord = navParams.get('word');

        platform.ready().then(_ => {
            console.info('platform ready');
            this.canvas = this.sheet.nativeElement;
            this.ctx = this.canvas.getContext('2d');

            //START DRAW OR GUESS
            if (this.currentWord) {
                this.title = `Draw me le ${this.currentWord}`;
            } else {
                this.isGuess = true;
                this.title = 'Try to guess!';
                this.currentWord = navParams.get('guess');
                this.handleGuessState();
            }

            //PRE-SET SHEET
            this.width = platform.width();
            this.canvas.width = this.width;
            this.canvas.height = this.width;
            this.offsetTop = this.canvas.offsetTop;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";

        });
    }

    handleGuessState() {
        this.lines = this.pizza;
        this.drawAllAnimated();
    }

    ngAfterViewInit() {
        console.info('view init');
    }

    startDraw(e) {
        if (this.isGuess) return false;
        console.debug('start', e);
        this.drawing = true;
        let x = e.layerX;
        let y = e.layerY - this.offsetTop;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.moveTo(x, y);
        this.ctx.lineTo(x, y);
        this.ctx.stroke();
        this.currentLine.coords.push([x, y]);
    }

    draw(e) {
        if (this.isGuess) return false;
        console.log('draw', e, this.offsetTop);

        if (this.drawing) {
            let x = e.layerX;
            let y = e.layerY - this.offsetTop;
            this.ctx.lineTo(x, y);
            this.ctx.globalAlpha = this.opacity;
            this.ctx.stroke();
            this.currentLine.coords.push([x, y]);
        }
    }

    stopDraw(e) {
        if (this.isGuess) return false;
        console.debug('stop', e);

        this.drawing = false;
        this.currentLine.color = this.color;
        this.currentLine.lineWidth = this.lineWidth;
        const copy = Object.assign({}, this.currentLine);
        this.lines.push(copy);
        this.currentLine.coords = [];
    }

    changeSize(size) {
        console.debug('change size', size);

        this.lineWidth = size;
    }

    changeColor(colorName) {
        console.debug('change color', colorName, this.opacity);
        this.color = colorName;
        let color = this.colors[colorName];

        this.ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${this.opacity})`;
    }

    changeOpacity(opacity) {
        this.opacity = opacity;
    }

    drawAllAnimated() {
        console.debug('animate all');

        this.loop = 0;
        this.drawAllAnimationLoop();
    }

    drawAllAnimationLoop() {
        this.drawLineAnimated(this.lines[this.loop]).then(_ => {
            this.loop++;
            if (this.loop < this.lines.length)
                this.drawAllAnimationLoop();
        });
    }

    drawLineAnimated(line) {
        return new Promise((r, e) => {
            console.debug('draw line animated', line);

            if (!line) line = this.lines[this.lines.length - 1];

            this.lineToDraw = {};
            this.lineToDraw.line = line.coords;
            this.lineToDraw.fpsInterval = 1000 / 40;
            this.lineToDraw.then = Date.now();
            this.lineToDraw.drawPointIteration = 0;
            this.ctx.beginPath();
            setTimeout(_ => {
                this.ctx.lineWidth = line.lineWidth;
                this.changeColor(line.color);
                this.drawPointLoop(_ => {
                    r();
                });
            }, 1);
        })
    }

    drawPointLoop(cb) {
        let line = this.lineToDraw;
        let point = line.line[line.drawPointIteration];
        console.log('draw point', point);

        if (point) {

            requestAnimationFrame(this.drawPointLoop.bind(this, cb));

            line.now = Date.now();
            line.elapsed = line.now - line.then;

            if (line.elapsed > line.fpsInterval) {
                line.then = line.now - (line.elapsed % line.fpsInterval);

                if (line.drawPointIteration === 0) {
                    this.ctx.moveTo(point[0], point[1]);
                } else {
                    this.ctx.lineTo(point[0], point[1]);
                }
                this.ctx.stroke();
                line.drawPointIteration++;
            }
        } else {
            cb();
        }
    }

    drawLine(line) {

        if (!line) line = this.lines[this.lines.length - 1];
        console.debug('draw line', line);

        this.changeColor(line.color);
        this.ctx.lineWidth = line.lineWidth;
        this.ctx.beginPath();

        let i = 0;
        for (const point of line.coords) {
            if (i === 0) {
                this.ctx.moveTo(point[0], point[1]);
                i = 1;
            } else {
                this.ctx.lineTo(point[0], point[1]);
            }
        }
        this.ctx.stroke();
    }

    drawAll() {
        for (const line of this.lines) {
            this.drawLine(line);
        }
    }

    resetAll() {
        console.debug('reset all');

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    undo() {
        if (this.lines.length <= 0) return false;
        this.linesUndone.push(this.lines.pop());
        this.resetAll();
        this.drawAll();
    }

    redo() {
        if (this.linesUndone.length <= 0) return false;
        this.lines.push(this.linesUndone.pop());
        this.resetAll();
        this.drawAll();
    }

    showColorSelect() {
        let modal = this.modalCtrl.create(ColorPage, {colors: Object.keys(this.colors)});
        modal.onDidDismiss(color => {
            console.log('color:', color);
            if (color)
                this.changeColor(color);
        });
        modal.present();
    }

    showSizeSelect() {
        let modal = this.modalCtrl.create(SizePage, {sizes: this.sizes});
        modal.onDidDismiss(size => {
            console.log('size:', size);
            if (size)
                this.changeSize(size);
        });
        modal.present();
    }

    checkAnswer(answer: string) {
        console.log('answer', answer);
        if (answer === this.currentWord) {
            let alert = this.alertCtrl.create({
                title: 'Bravo!',
                subTitle: 'Vous avez deviné le mot de machin !',
                buttons: ['À mon tour']
            });
            alert.present();
        }
    }
}
