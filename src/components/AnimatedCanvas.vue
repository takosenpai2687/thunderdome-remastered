<template>
    <canvas ref="canvas">
    </canvas>
</template>

<script>
import { Engine, Particle } from './Engine.js';

export default {
    name: 'AnimatedCanvas',
    data() {
        return {
            engine: null,
            particles: []
        }
    },
    mounted() {
        this.$nextTick(() => {
            const img = new Image();
            img.src = '/logo-navbar.png';
            img.onload = () => {
                const canvas = this.$refs.canvas;
                this.engine = new Engine(canvas, img);
                this.engine.ctx.clearRect(0, 0, canvas.width, canvas.height);
                canvas.addEventListener('mousemove', (e) => {
                    const rect = canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    this.engine.mouseX = x;
                    this.engine.mouseY = y;
                });
                this.animate();
            }
        });
    },
    methods: {
        onTick() {
            this.particles = this.engine.particles
        },
        animate() {
            this.engine.render();
            this.engine.update();
            requestAnimationFrame(this.animate);
        }
    }
}
</script>

<style lang="scss" scoped>
canvas {
    width: 100%;
    height: 100%;
}
</style>