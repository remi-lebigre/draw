import {Component, ViewChild} from '@angular/core';
import {NavController, NavParams, Platform} from 'ionic-angular';

@Component({
    templateUrl: 'draw.page.html',
    styleUrls: ['draw.page.scss']
})
export class DrawPage {

    private word:string;
    private ctx:any = null;
    private width:number = 400;
    private offsetTop:number;
    private lines:any = [];
    private color:string = 'black';
    private linesUndone:any = [];
    private currentLine:any = {
        coords: [],
        color: 'black',
        opacity: 1,
        lineWidth: 10
    };
    private opacity:number = 1;
    private loop:number = 0;
    private lineWidth:number = 10;
    private colors:any = {
        red: ['255', '0', '0'],
        green: ['0', '255', '0'],
        blue: ['0', '0', '255'],
        black: ['0', '0', '0'],
    };
    private lineToDraw:any = {};
    private drawing:boolean = false;
    @ViewChild('sheet')
    sheet;
    private canvas:any;

    constructor(private navCtrl:NavController, navParams:NavParams, private platform:Platform) {
        this.word = `Draw me le ${navParams.get('word')}`;

        platform.ready().then(_=> {
            console.info('platform ready');
            this.width = platform.width();
            this.canvas.width = this.width;
            this.canvas.height = this.width;
            this.offsetTop = this.canvas.offsetTop;
            this.ctx.lineCap = "round";
            this.ctx.lineJoin = "round";
        });
    }

    ngAfterViewInit() {
        console.info('view init');

        this.canvas = this.sheet.nativeElement;
        this.ctx = this.canvas.getContext('2d');
    }

    startDraw(e) {
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
        console.debug('stop', e);

        this.drawing = false;
        this.currentLine.color = this.color;
        this.currentLine.lineWidth = this.lineWidth;
        const copy = Object.assign({}, this.currentLine);
        this.lines.push(copy);
        this.currentLine.coords = [];
    }

    changeWidth(width) {
        console.debug('change width', width);

        this.lineWidth = width;
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
        this.drawLineAnimated(this.lines[this.loop]).then(_=> {
            this.loop++;
            if (this.loop < this.lines.length)
                this.drawAllAnimationLoop();
        });
    }

    drawLineAnimated(line) {
        return new Promise((r, e)=> {
            console.debug('draw line animated', line);

            if (!line) line = this.lines[this.lines.length - 1];
            this.lineToDraw = {};
            this.lineToDraw.line = line.coords;
            this.lineToDraw.fpsInterval = 1000 / 40;
            this.lineToDraw.then = Date.now();
            this.lineToDraw.drawPointIteration = 0;
            this.changeColor(line.color);
            this.ctx.lineWidth = line.lineWidth;
            this.ctx.beginPath();
            this.drawPointLoop(_=> {
                r();
            });
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
                console.log('premier trait');
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
}
