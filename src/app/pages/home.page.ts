import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';

@Component({
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss']
})
export class HomePage {

    private title:string = 'Draw me something';
    private ctx:any = null;
    private lines:any = [];
    private currentLine:any = [];
    private opacity:number = 1;
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
    canvas;

    constructor(private navController:NavController) {
    }

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d');
        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
    }

    getLines() {
        console.debug('lines', this.lines);
    }

    startDraw(e) {
        console.debug('start', e);
        this.drawing = true;
        let x = e.offsetX;
        let y = e.offsetY;
        this.ctx.beginPath();
        this.ctx.lineWidth = this.lineWidth;


        this.ctx.moveTo(x, y);
        this.currentLine.push([x, y]);
    }

    draw(e) {
        if (this.drawing) {
            let x = e.offsetX;
            let y = e.offsetY;
            this.ctx.lineTo(x, y);
            this.ctx.globalAlpha = this.opacity;
            this.ctx.stroke();
            this.currentLine.push([x, y]);
        }
    }

    stopDraw(e) {
        this.drawing = false;
        this.lines.push(this.currentLine);
        this.currentLine = [];
        console.debug('stop', e);
    }

    changeWidth(width) {
        console.debug('change width', width);

        this.lineWidth = width;
    }

    changeColor(colorName) {
        console.debug('change color', colorName, this.opacity);
        let color = this.colors[colorName];

        this.ctx.strokeStyle = `rgba(${color[0]},${color[1]},${color[2]},${this.opacity})`;
    }

    changeOpacity(opacity) {
        this.opacity = opacity;
    }

    drawLineAnimated(line) {
        console.debug('draw line animated', line);

        if (!line) line = this.lines[this.lines.length - 1];
        this.lineToDraw = {};
        this.lineToDraw.line = line;
        this.lineToDraw.fpsInterval = 1000 / 40;
        this.lineToDraw.then = Date.now();
        this.lineToDraw.drawPointIteration = 0;

        this.ctx.beginPath();
        this.drawPoint();
    }

    drawLine(line) {
        console.debug('draw line', line);

        if (!line) line = this.lines[this.lines.length - 1];

        this.ctx.beginPath();

        let i = 0;
        for (const point of line) {
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

        this.ctx.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    }

    drawPoint() {
        let line = this.lineToDraw;
        let point = line.line[line.drawPointIteration];
        console.log('draw point', point);

        if (point) {

            requestAnimationFrame(this.drawPoint.bind(this));

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
        }
    }
}
