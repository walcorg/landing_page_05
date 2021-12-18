class Data {
    constructor() {
        this.data = [
            { title: "one", percent: 50, value: "$2015.50", title: "CODOSIN CON CERTIFICADO", color: "#ffbb32", startColor: "#ffbb32", endColor: "#deae05" },
            { title: "two", percent: 30, value: "$1209.50", title: "CODOSIN SIN CERTIFICADO", color: "#5d90d2", startColor: "#5d90d2", endColor: "#3576be" },
            { title: "three", percent: 15, value: "$604.50", title: "MONEDA FIDUCIARIA", color: "#6cab48", startColor: "#6cab48", endColor: "#519628" },
            { title: "four", percent: 5, value: "$201.50", title: "CODOSIN SIN CREAR", color: "#2e2e2e", startColor: "#2e2e2e", endColor: "#000000" },
        ];
    }
    get chartData() {
        return this.data;
    }
}
class Shapes {
    constructor() {
        this.canvasElm = document.getElementById("canvas");
        this.canvasElm.height = window.innerHeight * window.devicePixelRatio;
        this.canvasElm.width = window.innerWidth * window.devicePixelRatio;
        this.ctx = this.canvasElm.getContext("2d");
    }
    drawCircle(opts) {
        this.ctx.beginPath();
        this.ctx.arc(opts.x, opts.y, opts.r, 0, 2 * Math.PI);
        this.ctx.fillStyle = opts.fillStyle;
        this.ctx.lineWidth = 0;
        this.ctx.fill();
    }
    drawText(opts) {
        this.ctx.textAlign = opts.textAlign || "end";
        this.ctx.font = opts.font || "30px";
        this.ctx.fillStyle = opts.color || "white";
        this.ctx.fillText(opts.content, opts.x, opts.y);
    }
    drawArc(opts) {
        let cx = opts.x;
        let cy = opts.y;
        let r = opts.r;
        if (opts.startColor) {
            console.log(opts.startColor, opts.endColor);
            var grd = this.ctx.createLinearGradient(opts.x, opts.x, opts.x + r, opts.y + r);
            grd.addColorStop(0, opts.startColor);
            grd.addColorStop(1, opts.endColor);
            this.ctx.strokeStyle = grd;
        } else {
            this.ctx.strokeStyle = opts.color;
        }
        if (opts.shadow) {
            this.ctx.shadowColor = "#777";
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, r, opts.startAngle, opts.endAngle);
        this.ctx.lineWidth = opts.lineWidth || 25;
        this.ctx.stroke();
        this.ctx.lineWidth = 0;
        this.ctx.strokeStyle = "rgba(0,0,0,0)";
        this.ctx.shadowColor = "rgba(0,0,0,0)";
        this.ctx.shadowBlur = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowOffsetY = 0;
    }
    rect(opts) {
        if (opts.shadow) {
            this.ctx.shadowColor = "#777";
            this.ctx.shadowBlur = 5;
            this.ctx.shadowOffsetX = 2;
            this.ctx.shadowOffsetY = 2;
        }
        this.ctx.rect(opts.x, opts.y, opts.width, opts.height);
        if (opts.startColor) {
            console.log(opts.startColor, opts.endColor);
            var grd = this.ctx.createLinearGradient(opts.x + opts.width, opts.y, opts.x, opts.y + opts.height);
            grd.addColorStop(0, opts.startColor);
            grd.addColorStop(0.6, opts.endColor);
            this.ctx.fillStyle = grd;
        } else {
            this.ctx.fillStyle = opts.fillStyle;
        }
        this.ctx.fillRect(opts.x, opts.y, opts.width, opts.height);
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = "rgba(0,0,0,0)";
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.lineWidth = 0;
        this.ctx.fillStyle = "rgba(0,0,0,0)";
    }
    cutCircle(x, y, radius) {
        this.ctx.globalCompositeOperation = "destination-out";
        this.ctx.arc(x, y, radius, 0, Math.PI * 2, true);
        this.ctx.fill();
    }
    adjustForResolution(val) {
        return val * window.devicePixelRatio;
    }
    get canvasWidth() {
        return this.canvasElm.width;
    }
}
class Donut extends Shapes {
    constructor() {
        super();
        this.spaceBetweenInDegrees = 3;
        this.rectHeight = this.adjustForResolution(65);
        this.circleHeight = this.adjustForResolution(330);
        this.circleCenter = this.adjustForResolution(200);
        this.lineWidth = this.adjustForResolution(38);
        this.fontSize = this.adjustForResolution(29);
        this.titleFontSize = this.adjustForResolution(35);
        this.numberFontSize = this.adjustForResolution(28);
        this.largeFontSize = this.adjustForResolution(45);
        this.firstRectPercent = 0.75; //100% is 1.
        this.secondRectPercent = 0.2; //100% is 1.
        this.space = this.adjustForResolution(10); //100% is 1.
        this.titleFont = "Clubland, Arial";
        this.numberFont = "Clubland, Arial";
    }
    getRadian(degree) {
        return (Math.PI / 180) * degree;
    }
    draw() {
        let dataLen = data.chartData.length;
        let totalAvailableDegrees = 360 - dataLen * this.spaceBetweenInDegrees;
        let startDeg = 0;
        let rectStartY = this.circleCenter - (dataLen * this.rectHeight) / 2;
        let rectOverallWidth = this.canvasWidth - this.circleHeight;
        let firstSegmentRectWidth = rectOverallWidth * this.firstRectPercent;
        let secondSegmentRectWidth = rectOverallWidth * this.secondRectPercent;

        for (var x = 0; x < dataLen; x++) {
            // Drawing Rects.
            // First Rect
            this.rect({
                x: this.circleHeight,
                y: rectStartY,
                width: firstSegmentRectWidth,
                height: this.rectHeight - this.space,
                fillStyle: data.chartData[x].color,
                shadow: true,
                startColor: data.chartData[x].startColor,
                endColor: data.chartData[x].endColor,
            });
            this.rect({
                x: this.circleHeight + firstSegmentRectWidth + this.space,
                y: rectStartY,
                width: secondSegmentRectWidth,
                height: this.rectHeight - this.space,
                fillStyle: data.chartData[x].color,
                shadow: true,
            });
            // font-family: 'Nova Square', cursive;
            // font-family: 'Squada One', cursive;
            this.drawText({
                content: data.chartData[x].title,
                x: this.circleHeight + firstSegmentRectWidth - this.adjustForResolution(5),
                y: rectStartY + this.rectHeight - this.fontSize / 1.25,
                font: `${this.titleFontSize}px ${this.titleFont}`,
                textAlign: "end",
            });

            this.drawText({
                content: data.chartData[x].value,
                x: this.circleHeight + firstSegmentRectWidth + secondSegmentRectWidth/2,
                y: rectStartY + (this.rectHeight/2) + (this.numberFontSize/5),
                font: `${this.numberFontSize}px ${this.numberFont}`,
                textAlign: "center",
            });
            rectStartY += this.rectHeight;
            // **** End Rectangle Drawing **** //
        }

        let circleR = this.circleHeight / 2;
        // white Clearing circle
        this.drawCircle({
            x: this.circleCenter,
            y: this.circleCenter,
            r: circleR + this.lineWidth * 1.5,
            fillStyle: "white",
        });
        this.drawText({
            content: "$4,031.00",
            x: this.circleCenter,
            y: this.circleCenter,
            font: `${this.largeFontSize}px ${this.numberFont}`,
            textAlign: "center",
            color: "skyblue",
        });
        this.drawText({
            content: "USD",
            x: this.circleCenter,
            y: this.circleCenter + this.largeFontSize + 10,
            font: `${this.largeFontSize}px ${this.numberFont}`,
            textAlign: "center",
            color: "skyblue",
        });

        for (var x = 0; x < dataLen; x++) {
            // Start Circle Drawing
            let segmentDegree = (data.chartData[x].percent / 100) * totalAvailableDegrees;
            let endDeg = segmentDegree + startDeg;

            // Donut
            this.drawArc({
                x: this.circleCenter,
                y: this.circleCenter,
                r: circleR,
                lineWidth: this.lineWidth,
                color: data.chartData[x].color,
                startAngle: this.getRadian(startDeg),
                endAngle: this.getRadian(endDeg),
                shadow: true,
                startColor: data.chartData[x].startColor,
                endColor: data.chartData[x].endColor,
            });
            startDeg = endDeg + this.spaceBetweenInDegrees;
            // **** End Circle Drawing **** //
        }
    }
}

var data = new Data();
var donut = new Donut();

donut.draw();
