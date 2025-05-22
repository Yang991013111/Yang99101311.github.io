const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener('resize', () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
});

const lines = [];
const particles = [];
const LINE_COUNT = 120;
const PARTICLE_COUNT = 70;
const MAX_DIST = 180;
let time = 0;

// 粒子类
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.prevX = x;
        this.prevY = y;
        this.size = Math.random() * 2 + 1;
        this.speedX = (Math.random() - 0.5) * 2.5;
        this.speedY = (Math.random() - 0.5) * 2.5;
        this.opacity = Math.random();
    }

    update() {
        this.prevX = this.x;
        this.prevY = this.y;

        this.x += this.speedX + (Math.sin(time / 20) * 0.3);
        this.y += this.speedY + (Math.cos(time / 25) * 0.3);

        this.opacity -= 0.005;
        if (this.opacity <= 0) {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.prevX = this.x;
            this.prevY = this.y;
            this.opacity = 1;
        }
        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.moveTo(this.prevX, this.prevY);
        ctx.lineTo(this.x, this.y);
        ctx.strokeStyle = `rgba(0, 255, 255, ${this.opacity})`;
        ctx.lineWidth = this.size;
        ctx.stroke();
    }
}

// 线条类
class Line {
    constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.speedX = (Math.random() - 0.5) * 1.8;
        this.speedY = (Math.random() - 0.5) * 1.8;
        this.hue = Math.random() * 360;
    }

    update() {
        this.x += this.speedX + Math.sin(time / 50 + this.hue) * 0.5;
        this.y += this.speedY + Math.cos(time / 50 + this.hue) * 0.5;

        if (this.x > w || this.x < 0) this.speedX *= -1;
        if (this.y > h || this.y < 0) this.speedY *= -1;

        this.draw();
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsl(${this.hue + time * 0.5}, 100%, 60%)`;
        ctx.shadowColor = `hsl(${this.hue + time * 0.5}, 100%, 80%)`;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // 关闭以防影响其他元素
    }

    connect(other) {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < MAX_DIST) {
            const alpha = 1 - dist / MAX_DIST;
            ctx.beginPath();
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
            ctx.lineWidth = 0.2;
            ctx.shadowColor = '#00f0ff';
            ctx.shadowBlur = 10;
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
}

// 初始化
for (let i = 0; i < LINE_COUNT; i++) {
    lines.push(new Line());
}
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(Math.random() * w, Math.random() * h));
}

// 动画
function animate() {
    time++;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.fillRect(0, 0, w, h);

    for (let i = 0; i < lines.length; i++) {
        lines[i].update();
        for (let j = i + 1; j < lines.length; j++) {
            lines[i].connect(lines[j]);
        }
    }

    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
    }

    requestAnimationFrame(animate);
}

animate();
