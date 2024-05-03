export class Particle {
    constructor(engine, x, y, color, size) {
        this.engine = engine;
        this.x = Math.random() * engine.width;
        this.y = Math.random() * engine.height;
        this.xi = x;
        this.yi = y;
        this.vx = 0;
        this.vy = 0;
        this.color = color;
        this.size = size;
        this.loadingStepPercentage = Math.min(
            Math.random() + 1 / Engine.loadTime / 30,
            1 / Engine.loadTime / 15
        );
        this.isLoaded = false;
    }

    render() {
        this.engine.ctx.fillStyle = this.color;
        this.engine.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        const dx = this.engine.mouseX - this.x;
        const dy = this.engine.mouseY - this.y;
        const theta = Math.atan2(dy, dx);
        const dist = dx * dx + dy * dy;
        if (Engine.suckRadius > dist) {
            this.vx = Math.cos(theta) * (Engine.suckRadius / dist) * 50;
            this.vy = Math.sin(theta) * (Engine.suckRadius / dist) * 50;
            this.x += this.vx;
            this.y += this.vy;
        }
        this.x += (this.xi - this.x) * this.loadingStepPercentage;
        this.y += (this.yi - this.y) * this.loadingStepPercentage;
    }
}

export class Engine {
    static loadTime = 2;
    static suckRadius = 1000;

    constructor(canvas, image) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");
        const cw = canvas.getBoundingClientRect().width;
        const ch = canvas.getBoundingClientRect().height;
        canvas.width = cw;
        canvas.height = ch;
        this.width = cw;
        this.height = ch;
        this.particles = [];
        this.image = image;
        this.stepSize = 15;
        this.mouseX = 0;
        this.mouseY = 0;
        this.init();
    }

    init() {
        // Render image for once
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(0, 0, this.width, this.height);
        const IW = this.canvas.height * 0.5;
        const IH = this.canvas.height * 0.5;
        this.ctx.drawImage(
            this.image,
            this.ctx.canvas.width / 2 - IW / 2,
            this.ctx.canvas.height / 2 - IH / 2,
            IW,
            IH
        );
        // Render Text
        this.ctx.fillStyle = "#fff";
        this.ctx.font = "bolder 60px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "ThunderDome",
            this.width / 2,
            this.canvas.height - 100
        );
        // Tessellation
        const pixels = this.ctx.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;
        for (let y = 0; y < this.height; y += this.stepSize) {
            for (let x = 0; x < this.width; x += this.stepSize) {
                const idx = (y * Math.floor(this.width) + x) * 4;
                const r = pixels[idx];
                const g = pixels[idx + 1];
                const b = pixels[idx + 2];
                const a = pixels[idx + 3];
                if (a > 0) {
                    this.particles.push(
                        new Particle(
                            this,
                            x,
                            y,
                            `rgb(${r}, ${g}, ${b})`,
                            this.stepSize - 0.8
                        )
                    );
                }
                if (y > this.canvas.height - 200) {
                    this.stepSize = 3;
                }
            }
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach((p) => p.render());
    }

    update() {
        this.particles.forEach((p) => p.update());
    }
}
