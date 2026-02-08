document.addEventListener('DOMContentLoaded', () => {
    // Music Toggle Logic
    const musicBtn = document.getElementById('music-toggle');
    const bgMusic = document.getElementById('bg-music');
    let isPlaying = false;

    musicBtn.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicBtn.innerHTML = '<span class="icon">🎵</span> Play Music';
            isPlaying = false;
        } else {
            bgMusic.play().then(() => {
                musicBtn.innerHTML = '<span class="icon">⏸</span> Pause Music';
                isPlaying = true;
            }).catch(error => {
                console.log("Audio play failed: ", error);
            });
        }
    });

    // Attempt Autoplay
    bgMusic.play().then(() => {
        musicBtn.innerHTML = '<span class="icon">⏸</span> Pause Music';
        isPlaying = true;
    }).catch(error => {
        console.log("Autoplay prevented by browser policy. Interaction required.");
        // Optional: Show a toast or small text telling user to click play
    });

    // Petal Animation Logic
    const container = document.getElementById('canvas-container');
    let mouse = { x: null, y: null, radius: 100 };

    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    container.appendChild(canvas);

    const ctx = canvas.getContext('2d');

    let petals = [];
    const petalCount = 50;

    class Flower {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.size = Math.random() * 20 + 15;
            this.speedY = Math.random() * 1 + 0.5;
            this.speedX = Math.random() * 2 - 1;
            this.rotation = Math.random() * 360;
            this.rotationSpeed = Math.random() * 2 - 1;
            this.type = Math.random() > 0.6 ? 'rose' : 'dandelion';
            // Rose colors: Reds, Pinks. Dandelion: Whites, Creams, Yellows
            if (this.type === 'rose') {
                this.color = `hsl(${Math.random() * 50 + 330}, 80%, ${Math.random() * 20 + 60}%)`;
            } else {
                this.color = `hsl(${Math.random() * 40 + 40}, 80%, ${Math.random() * 20 + 80}%)`; // Yellow/Cream
            }
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX + Math.sin(this.y * 0.005) * 0.5;
            this.rotation += this.rotationSpeed;

            // Mouse Interaction
            if (mouse.x != null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouse.radius - distance) / mouse.radius;
                    const directionX = forceDirectionX * force * 3; // Push strength
                    const directionY = forceDirectionY * force * 3;

                    this.x -= directionX;
                    this.y -= directionY;
                }
            }

            if (this.y > canvas.height) {
                this.y = -50;
                this.x = Math.random() * canvas.width;
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation * Math.PI / 180);

            if (this.type === 'rose') {
                this.drawRose();
            } else {
                this.drawDandelion();
            }

            ctx.restore();
        }

        drawRose() {
            // Stylized Rose: Overlapping layered petals
            ctx.fillStyle = this.color;
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 1;

            // Inner bud
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
            ctx.fill();

            // Outer petals (spiral effect)
            for (let i = 0; i < 3; i++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 1.5);
                ctx.arc(this.size * 0.4, 0, this.size * 0.4, 0, Math.PI * 2);
                ctx.globalAlpha = 0.8; // Semi-transparent for layered look
                ctx.fill();
                ctx.globalAlpha = 1.0;
                ctx.stroke();
            }

            // More outer petals
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                ctx.rotate(Math.PI / 2.5);
                ctx.arc(this.size * 0.6, 0, this.size * 0.4, 0, Math.PI * 2);
                ctx.globalAlpha = 0.6;
                ctx.fill();
                ctx.globalAlpha = 1.0;
            }
        }

        drawDandelion() {
            // Stylized Dandelion: Radiating lines/fluff
            ctx.strokeStyle = this.color;
            ctx.fillStyle = "white"; // Center
            ctx.lineWidth = 1.5;

            // Stalks
            for (let i = 0; i < 16; i++) {
                ctx.beginPath();
                ctx.rotate((Math.PI * 2) / 16);
                ctx.moveTo(0, 0);
                ctx.lineTo(this.size, 0);
                ctx.stroke();

                // Little fluff at the end
                ctx.beginPath();
                ctx.arc(this.size, 0, 2, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
            }

            // Center
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
            ctx.fill();
        }
    }

    function init() {
        for (let i = 0; i < petalCount; i++) {
            petals.push(new Flower());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        petals.forEach(flower => {
            flower.update();
            flower.draw();
        });

        requestAnimationFrame(animate);
    }

    // Handle Window Resize
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    init();
    animate();
});
