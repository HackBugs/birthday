const canvas = document.getElementById('fireworksCanvas');
const ctx = canvas.getContext('2d');
const birthdaySound = document.getElementById('birthdaySound');
const fireworkSound = document.getElementById('fireworkSound');
const surpriseButton = document.getElementById('surpriseButton');
const popupOverlay = document.getElementById('popupOverlay');
const popupCard = document.getElementById('popupCard');
const closeButton = document.getElementById('closeButton');
const loveVideo = document.getElementById('loveVideo');
const loveVideo2 = document.getElementById('loveVideo2');
const loveVideo3 = document.getElementById('loveVideo3');
const loveVideo4 = document.getElementById('loveVideo4');
const loveVideo5 = document.getElementById('loveVideo5');
const images = [
    document.getElementById('image1'),
    document.getElementById('image2'),
    document.getElementById('image3'),
    document.getElementById('image4'),
    document.getElementById('image5'),
    document.getElementById('image6'),
    document.getElementById('image7'),
    document.getElementById('image8'),
    document.getElementById('image9'),
    document.getElementById('image10')
];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Play background music
birthdaySound.volume = 0.5;
birthdaySound.play().catch(() => {});

// Play videos
[loveVideo, loveVideo2, loveVideo3, loveVideo4, loveVideo5].forEach(video => {
    video.play().catch(() => {});
});

// Mouse position
let mouseX = null;
let mouseY = null;
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // Update heart visibility
    updateHeartVisibility();
});

// Media element class for random movement
class MediaElement {
    constructor(element, isVideo) {
        this.element = element;
        this.isVideo = isVideo;
        this.width = window.innerWidth <= 600 ? 80 : 100;
        this.height = this.width * (isVideo ? 9 / 16 : 1);
        this.x = Math.random() * (window.innerWidth - this.width);
        this.y = Math.random() * (window.innerHeight - this.height);
        this.targetVx = (Math.random() * 2 - 1) * 1.5;
        this.targetVy = (Math.random() * 2 - 1) * 1.5;
        this.vx = this.targetVx;
        this.vy = this.targetVy;
        this.updatePosition();
    }

    updatePosition() {
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
    }

    update() {
        // Mouse repulsion
        if (mouseX !== null && mouseY !== null) {
            const dx = mouseX - (this.x + this.width / 2);
            const dy = mouseY - (this.y + this.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            const repulsionRadius = 150;
            if (distance < repulsionRadius && distance > 0) {
                const force = (repulsionRadius - distance) / repulsionRadius * 3;
                this.targetVx -= (dx / distance) * force;
                this.targetVy -= (dy / distance) * force;
            }
        }

        // Smooth velocity with lerp
        this.vx = this.vx * 0.95 + this.targetVx * 0.05;
        this.vy = this.vy * 0.95 + this.targetVy * 0.05;

        // Update position
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x <= 0 || this.x >= window.innerWidth - this.width) {
            this.targetVx = -this.targetVx;
            this.x = Math.max(0, Math.min(this.x, window.innerWidth - this.width));
        }
        if (this.y <= 0 || this.y >= window.innerHeight - this.height) {
            this.targetVy = -this.targetVy;
            this.y = Math.max(0, Math.min(this.y, window.innerHeight - this.height));
        }

        // Randomly adjust target velocity
        if (Math.random() < 0.01) {
            this.targetVx += (Math.random() * 0.3 - 0.15);
            this.targetVy += (Math.random() * 0.3 - 0.15);
            this.targetVx = Math.max(-1.5, Math.min(this.targetVx, 1.5));
            this.targetVy = Math.max(-1.5, Math.min(this.targetVy, 1.5));
        }

        this.updatePosition();
    }
}

// Sparkle particle class for cake effect
class SparkleParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.5;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = Math.random() * 50 + 50;
        this.color = `rgba(255, 215, 0, ${this.opacity})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.opacity -= 0.01;
        this.life--;
        if (this.opacity < 0) this.opacity = 0;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.opacity;
        ctx.fill();
        ctx.globalAlpha = 1;
    }
}

// Background hearts
const backgroundHeartsContainer = document.querySelector('.background-hearts');
const heartCount = 50; // Increased for "bahot sara"

function createBackgroundHeart() {
    const heart = document.createElement('div');
    heart.classList.add('background-heart');

    const size = Math.random() * 10 + 5; // 5-15px
    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * window.innerHeight;
    const duration = Math.random() * 20 + 10; // 10-30s
    const delay = Math.random() * 5;
    const driftX = (Math.random() - 0.5) * 200;
    const driftY = (Math.random() - 0.5) * 200;

    heart.style.width = `${size}px`;
    heart.style.height = `${size * 0.9}px`;
    heart.style.left = `${posX}px`;
    heart.style.top = `${posY}px`;
    heart.style.setProperty('--drift-x', `${driftX}px`);
    heart.style.setProperty('--drift-y', `${driftY}px`);
    heart.style.animation = `drift ${duration}s linear ${delay}s infinite`;

    // Heart shape using pseudo-elements
    const scale = size / 150;
    heart.style.setProperty('--before-width', `${75 * scale}px`);
    heart.style.setProperty('--before-height', `${120 * scale}px`);
    heart.style.setProperty('--before-left', `${30 * scale}px`);
    heart.style.setProperty('--after-width', `${75 * scale}px`);
    heart.style.setProperty('--after-height', `${120 * scale}px`);
    heart.style.setProperty('--after-right', `${72 * scale}px`);

    backgroundHeartsContainer.appendChild(heart);

    // Respawn when animation ends
    heart.addEventListener('animationiteration', () => {
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.top = `${Math.random() * window.innerHeight}px`;
        heart.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 200}px`);
        heart.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 200}px`);
    });

    return heart;
}

// Initialize hearts
const backgroundHearts = [];
for (let i = 0; i < heartCount; i++) {
    backgroundHearts.push(createBackgroundHeart());
}

// Update heart visibility based on cursor
function updateHeartVisibility() {
    if (mouseX === null || mouseY === null) return;
    backgroundHearts.forEach(heart => {
        const rect = heart.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const visibilityRadius = 100; // Hearts become more visible within 100px
        if (distance < visibilityRadius) {
            heart.classList.add('visible');
        } else {
            heart.classList.remove('visible');
        }
    });
}

// Add styles for background hearts
const heartStyle = document.createElement('style');
heartStyle.innerHTML = `
    .background-heart::before {
        width: var(--before-width);
        height: var(--before-height);
        left: var(--before-left);
        border-radius: 75px 75px 0 0;
        transform: rotate(-45deg);
        transform-origin: right bottom;
    }
    .background-heart::after {
        width: var(--after-width);
        height: var(--after-height);
        right: var(--after-right);
        border-radius: 75px 75px 0 0;
        transform: rotate(45deg);
        transform-origin: left bottom;
    }
`;
document.head.appendChild(heartStyle);

// Initialize media elements
const mediaElements = [
    new MediaElement(loveVideo, true),
    new MediaElement(loveVideo2, true),
    new MediaElement(loveVideo3, true),
    new MediaElement(loveVideo4, true),
    new MediaElement(loveVideo5, true),
    ...images.map(img => new MediaElement(img, false))
];

// Sparkle particles around cake
let sparkleParticles = [];
function createSparkleParticles() {
    const cake = document.querySelector('.cake');
    if (!cake) return;
    const rect = cake.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const radiusX = rect.width / 2 + 20;
    const radiusY = rect.height / 2 + 20;

    if (Math.random() < 0.1) {
        const angle = Math.random() * Math.PI * 2;
        const x = centerX + Math.cos(angle) * radiusX;
        const y = centerY + Math.sin(angle) * radiusY;
        sparkleParticles.push(new SparkleParticle(x, y));
    }

    sparkleParticles = sparkleParticles.filter(p => p.life > 0);
    sparkleParticles.forEach(p => p.update());
}

// Stars in the sky
function createStars() {
    const starsContainer = document.getElementById('stars');
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 50}%`;
        star.style.animationDelay = `${Math.random() * 2}s`;
        starsContainer.appendChild(star);
    }
}

// Balloon particle for blast
class BalloonParticle {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.radius = window.innerWidth <= 600 ? Math.random() * 8 + 4 : Math.random() * 10 + 5;
        this.vx = window.innerWidth <= 600 ? Math.random() * 6 - 3 : Math.random() * 8 - 4;
        this.vy = window.innerWidth <= 600 ? Math.random() * 6 - 3 : Math.random() * 8 - 4;
        this.life = 60;
        this.shape = Math.random() > 0.5 ? 'circle' : 'oval';
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.03;
        this.life--;
        this.radius *= 0.99;
    }

    draw() {
        ctx.beginPath();
        if (this.shape === 'circle') {
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        } else {
            ctx.ellipse(this.x, this.y, this.radius, this.radius * 1.5, 0, 0, Math.PI * 2);
        }
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

// Firework class
class Firework {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height;
        this.targetY = Math.random() * canvas.height * 0.5;
        this.vy = -(Math.random() * 5 + 5);
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
        this.particles = [];
        this.exploded = false;
    }

    update() {
        if (!this.exploded) {
            this.y += this.vy;
            if (this.y <= this.targetY) {
                this.explode();
            }
        } else {
            this.particles.forEach(p => p.update());
            this.particles = this.particles.filter(p => p.life > 0);
        }
    }

    draw() {
        if (!this.exploded) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        } else {
            this.particles.forEach(p => p.draw());
        }
    }

    explode() {
        this.exploded = true;
        for (let i = 0; i < 100; i++) {
            this.particles.push(new BalloonParticle(this.x, this.y, this.color));
        }
        fireworkSound.volume = 0.3;
        fireworkSound.currentTime = 0;
        fireworkSound.play().catch(() => {});
    }
}

// Balloon blast for button
let balloonParticles = [];

function createBalloonBlast(x, y) {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeead'];
    for (let i = 0; i < 30; i++) {
        const color = colors[Math.floor(Math.random() * colors.length)];
        balloonParticles.push(new BalloonParticle(x, y, color));
    }
    fireworkSound.volume = 0.3;
    fireworkSound.currentTime = 0;
    fireworkSound.play().catch(() => {});
}

// Animation loop
const fireworks = [];
function animate() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.05) {
        fireworks.push(new Firework());
    }
    fireworks.forEach((f, i) => {
        f.update();
        f.draw();
        if (f.exploded && f.particles.length === 0) {
            fireworks.splice(i, 1);
        }
    });

    balloonParticles.forEach((p, i) => {
        p.update();
        p.draw();
        if (p.life <= 0) {
            balloonParticles.splice(i, 1);
        }
    });

    createSparkleParticles();
    sparkleParticles.forEach(p => p.draw());

    mediaElements.forEach(media => media.update());

    requestAnimationFrame(animate);
}

// Button click event
if (surpriseButton) {
    surpriseButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const rect = surpriseButton.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;
        createBalloonBlast(x, y);
        surpriseButton.classList.add('hidden');
        popupOverlay.style.display = 'flex';
        setTimeout(() => popupCard.classList.add('show'), 100);
    });
}

// Close button event
if (closeButton) {
    closeButton.addEventListener('click', () => {
        popupOverlay.style.display = 'none';
        popupCard.classList.remove('show');
        surpriseButton.classList.remove('hidden');
    });
}

// Initialize
createStars();
animate();

// Handle window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mediaElements.forEach(media => {
        media.width = window.innerWidth <= 600 ? 80 : 100;
        media.height = media.width * (media.isVideo ? 9 / 16 : 1);
        media.x = Math.max(0, Math.min(media.x, window.innerWidth - media.width));
        media.y = Math.max(0, Math.min(media.y, window.innerHeight - media.height));
        media.updatePosition();
    });
    sparkleParticles = [];
    // Reposition background hearts
    backgroundHearts.forEach(heart => {
        heart.style.left = `${Math.random() * window.innerWidth}px`;
        heart.style.top = `${Math.random() * window.innerHeight}px`;
        heart.style.setProperty('--drift-x', `${(Math.random() - 0.5) * 200}px`);
        heart.style.setProperty('--drift-y', `${(Math.random() - 0.5) * 200}px`);
    });
});