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
            Math.random() + 1 / Engine.loadTime,
            1 / Engine.loadTime / 2
        );
        this.isLoaded = false;
    }

    render() {
        this.engine.ctx.fillStyle = this.color;
        this.engine.ctx.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        // Dragging back to initial position
        this.x += (this.xi - this.x) * this.loadingStepPercentage;
        this.y += (this.yi - this.y) * this.loadingStepPercentage;
        // Mouse Interaction
        const dx = this.engine.mouseX - this.xi;
        const dy = this.engine.mouseY - this.yi;
        // Early return if the particle is too far from the mouse
        if (
            Math.abs(dy) > Engine.suckRadius ||
            Math.abs(dx) > Engine.suckRadius
        ) {
            return;
        }
        const theta = Math.atan2(dy, dx);
        const dist = Math.sqrt(dx * dx + dy * dy);
        // Sucking effect
        if (dist < Engine.suckRadius) {
            const distRatio = Engine.suckRadius / dist;
            this.vx = -Math.cos(theta) * distRatio;
            this.vy = -Math.sin(theta) * distRatio;
            this.x += this.vx;
            this.y += this.vy;
        }
    }
}

export class Engine {
    static loadTime = 8;
    static suckRadius = 100;
    static fontSize = 72;
    static smallParticleSize = 4;
    static largeParticleSize = 15;

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
        this.stepSize = Engine.largeParticleSize;
        this.mouseX = 0;
        this.mouseY = 0;
        Engine.suckRadius = Math.min(this.width, this.height) * 0.095;
        this.init();
    }

    init() {
        // Render image for once
        this.ctx.fillStyle = "transparent";
        this.ctx.fillRect(0, 0, this.width, this.height);
        const IW = this.canvas.height * 0.5;
        const IH = this.canvas.height * 0.5;
        const IX = this.ctx.canvas.width / 2 - IW / 2;
        const IY = this.ctx.canvas.height * 0.4 - IH / 2;
        this.ctx.drawImage(this.image, IX, IY, IW, IH);
        // Render Text
        this.ctx.fillStyle = "#fff";
        this.ctx.font = `bolder ${Engine.fontSize}px Arial`;
        this.ctx.textAlign = "center";
        Engine.textY = this.canvas.height - 120;
        this.ctx.fillText("ThunderDome", this.width / 2, Engine.textY);
        // Tessellation
        const pixels = this.ctx.getImageData(
            0,
            0,
            this.width,
            this.height
        ).data;
        for (let y = 0; y < this.height; y += this.stepSize) {
            if (y < IY) continue;
            if (y > IY + IH && y < Engine.textY - Engine.fontSize) continue;
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
                if (y > Engine.textY - Engine.fontSize) {
                    this.stepSize = Engine.smallParticleSize;
                }
            }
        }
    }

    resize() {
        const cw = this.canvas.getBoundingClientRect().width;
        const ch = this.canvas.getBoundingClientRect().height;
        this.canvas.width = cw;
        this.canvas.height = ch;
        this.width = cw;
        this.height = ch;
        this.particles = [];
        this.init();
    }

    render() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        this.particles.forEach((p) => p.render());
    }

    update() {
        this.particles.forEach((p) => p.update());
    }
}
