const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
const scoreEl = document.querySelector('#scoreEl');
const start = document.querySelector('#startBtn');
const modalEl = document.querySelector('#modalEl');
const num = document.querySelector('#num');

canvas.width = innerWidth;
canvas.height = innerHeight;

class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;    
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        context.fillStyle = this.color;
        context.fill();
    }

    update() {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

const x = canvas.width / 2;
const y = canvas.height / 2;

let player = new Player(x, y, 20, 'white');
let projectiles = [];
let enemies = [];

function init() {
    player = new Player(x, y, 20, 'white');
    projectiles = [];
    enemies = [];
    score = 0;
    scoreEl.innerHTML = score;
    num.innerHTML = score;
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * (30 - 8) + 8;
        let x, y;

        if (Math.random() < 0.5) {
            x = Math.random() * canvas.width;
            y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
        }
        else {
            x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
            y = Math.random() * canvas.height;
        }

        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        const angle = Math.atan2(canvas.height / 2 - y, canvas.width / 2 - x);
        const velocity = {x: Math.cos(angle), y: Math.sin(angle)};

        enemies.push(new Enemy(x, y, radius, color, velocity));
    }, 1000);
}

let animationId;
let score = 0;
function animate() {
    animationId = requestAnimationFrame(animate);
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    player.draw();

    animateProjectile();
    animateEnemies();    
}

function animateProjectile() {
    projectiles.forEach((projectile, index) => {
        projectile.update();

        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > canvas.width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.slice(index, 1);
            }, 0);
        }
    })
}

function animateEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.update();
        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
        if (dist - enemy.radius - player.radius < 1){
            cancelAnimationFrame(animationId);
            modalEl.style.display = 'flex';
            num.innerHTML = score;
        }

        projectiles.forEach((projectile, pIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                score += 37;
                scoreEl.innerHTML = score;
                if (enemy.radius - 10 > 5) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })                
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1);
                    })  
                }
                else {
                    score += 65;
                    scoreEl.innerHTML = score;
                    setTimeout(() => {
                        enemies.splice(index, 1);
                        projectiles.splice(pIndex, 1);
                    })    
                }                            
            }
        })
    })
}

addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - canvas.height / 2, event.clientX - canvas.width / 2);
    const velocity = {x: Math.cos(angle) * 4, y: Math.sin(angle) * 4};
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 5, 'white', velocity));
})

start.addEventListener('click', () => {
    init();
    animate();
    spawnEnemies();
    modalEl.style.display = 'none';
})