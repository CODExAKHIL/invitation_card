/* ==========================================================================
   MASTER CONFIGURATION OBJECT - Easily Customize Girlfriend's Name & Choices
   ========================================================================== */
const dateConfig = {
    girlfriendName: "Bubu",
    yourName: "Dudu",

    // Step 2 Places Options
    places: [
        {
            id: "cafe",
            name: "Cozy Favourite Café",
            description: "Warm coffee, sweet pastries & endless conversations.",
            icon: "☕"
        },
        {
            id: "rooftop",
            name: "Rooftop Under The Stars",
            description: "A dreamy evening with glittering city lights & soft music.",
            icon: "🌃"
        },
        {
            id: "garden",
            name: "Dreamy Flower Garden",
            description: "A romantic walk surrounded by blooming flowers & peaceful vibes.",
            icon: "🌸"
        },
        {
            id: "lakeside",
           name: "Romantic Movie",
           description: "A dreamy cinematic moment where it's just you, me, and our beautiful love story. 🎬❤️",
            icon: "🎬"
        }
    ],

    // Step 3 Food Options
    foods: [
        { id: "pizza", name: "Cheesy Pizza", icon: "🍕" },
        { id: "burger", name: "Gourmet Burgers", icon: "🍔" },
        { id: "dessert", name: "Chocolate Dessert", icon: "🍫" },
        { id: "cake", name: "Sweet Bakery Cake", icon: "🍰" },
        { id: "coffee", name: "Coffee & Pastries", icon: "☕" },
        { id: "snack", name: "Favourite Street Food", icon: "🍜" }
    ],

    // Progressive Pamper Messages when clicking "NO"
    noPamperMessages: [
        "Are you sure? 🥺",
        "But I was really hoping to spend some beautiful time with you ❤️",
        "Please say yes? 🥹",
        "One tiny date? 🥺",
        "I promise I'll make it super special ❤️",
        "Pretty please with cherry on top? 🌸",
        "Okay... I'll wait... but I'm still asking! 😭❤️",
        "You can't say no forever! 💖"
    ]
};

/* ==========================================================================
   APPLICATION CENTRALIZED STATE
   ========================================================================== */
const appState = {
    currentScene: 1,
    acceptedDate: false,
    selectedPlace: null,
    selectedFood: null,
    selectedDate: null,
    noClickCount: 0,
    currentCalendarDate: new Date(), // For calendar navigation
    isPlayingMusic: false
};

/* ==========================================================================
   DOM ELEMENTS REFRESH / BINDING
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
    initPersonalization();
    initBackgroundCanvas();
    initAudioController();
    initPlacesGrid();
    initFoodsGrid();
    initCalendar();
    bindEventListeners();
});

/* Personalize Name Placeholders */
function initPersonalization() {
    document.getElementById("herNameDisplay1").innerText = dateConfig.girlfriendName;
    document.getElementById("herNameDisplay2").innerText = dateConfig.girlfriendName;
}

/* ==========================================================================
   SCENE NAVIGATION CONTROLLER
   ========================================================================== */
function goToScene(targetSceneNumber) {
    const currentSceneElem = document.getElementById(`scene${appState.currentScene}`);
    const targetSceneElem = document.getElementById(`scene${targetSceneNumber}`);

    if (!targetSceneElem) return;

    // Smooth exit transition
    if (currentSceneElem) {
        currentSceneElem.style.opacity = '0';
        currentSceneElem.style.transform = 'translateY(-20px)';
        setTimeout(() => {
            currentSceneElem.classList.remove("active");
            
            // Enter new scene
            targetSceneElem.classList.add("active");
            setTimeout(() => {
                targetSceneElem.style.opacity = '1';
                targetSceneElem.style.transform = 'translateY(0)';
            }, 50);
        }, 400);
    } else {
        targetSceneElem.classList.add("active");
    }

    appState.currentScene = targetSceneNumber;

    // Special setup per scene
    if (targetSceneNumber === 5) {
        setupFinalProposalScene();
    }
}

/* ==========================================================================
   SCENE 1 INTERACTION LOGIC (YES / NO HANDLERS)
   ========================================================================== */
function bindEventListeners() {
    // Scene 1 YES / NO Buttons
    const yesBtn = document.getElementById("yesBtnStep1");
    const noBtn = document.getElementById("noBtnStep1");

    yesBtn.addEventListener("click", handleScene1Yes);
    noBtn.addEventListener("click", handleScene1No);

    // Scene Navigation Buttons
    document.getElementById("backBtnScene2").addEventListener("click", () => goToScene(1));
    document.getElementById("nextBtnScene2").addEventListener("click", () => goToScene(3));

    document.getElementById("backBtnScene3").addEventListener("click", () => goToScene(2));
    document.getElementById("nextBtnScene3").addEventListener("click", () => goToScene(4));

    document.getElementById("backBtnScene4").addEventListener("click", () => goToScene(3));
    document.getElementById("nextBtnScene4").addEventListener("click", () => goToScene(5));

    // Calendar Month Navigation
    document.getElementById("prevMonthBtn").addEventListener("click", () => changeCalendarMonth(-1));
    document.getElementById("nextMonthBtn").addEventListener("click", () => changeCalendarMonth(1));

    // Final Proposal YES Button
    document.getElementById("finalYesBtn").addEventListener("click", handleFinalProposalYes);

    // Restart Button
    document.getElementById("restartBtn").addEventListener("click", resetExperience);
}

function handleScene1No() {
    const pamperBox = document.getElementById("pamperBox");
    const pamperText = document.getElementById("pamperText");
    const yesBtn = document.getElementById("yesBtnStep1");

    // Cycle through emotional pamper messages
    const messageIndex = appState.noClickCount % dateConfig.noPamperMessages.length;
    pamperText.innerText = dateConfig.noPamperMessages[messageIndex];
    pamperBox.classList.remove("hidden");

    appState.noClickCount++;

    // Gently scale up YES button to make it more inviting
    const currentScale = 1 + (appState.noClickCount * 0.08);
    if (currentScale < 1.6) {
        yesBtn.style.transform = `scale(${currentScale})`;
    }
}

function handleScene1Yes() {
    appState.acceptedDate = true;
    triggerHeartExplosion();
    goToScene(2);
}

/* ==========================================================================
   SCENE 2: PLACES SELECTION LOGIC
   ========================================================================== */
function initPlacesGrid() {
    const grid = document.getElementById("placesGrid");
    grid.innerHTML = "";

    dateConfig.places.forEach(place => {
        const card = document.createElement("div");
        card.className = "card-item";
        card.innerHTML = `
            <span class="card-icon">${place.icon}</span>
            <h3 class="card-title">${place.name}</h3>
            <p class="card-desc">${place.description}</p>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll("#placesGrid .card-item").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            appState.selectedPlace = place;
            document.getElementById("nextBtnScene2").disabled = false;
        });

        grid.appendChild(card);
    });
}

/* ==========================================================================
   SCENE 3: FOOD SELECTION LOGIC
   ========================================================================== */
function initFoodsGrid() {
    const grid = document.getElementById("foodsGrid");
    grid.innerHTML = "";

    dateConfig.foods.forEach(food => {
        const card = document.createElement("div");
        card.className = "card-item";
        card.innerHTML = `
            <span class="card-icon">${food.icon}</span>
            <h3 class="card-title">${food.name}</h3>
        `;

        card.addEventListener("click", () => {
            document.querySelectorAll("#foodsGrid .card-item").forEach(c => c.classList.remove("selected"));
            card.classList.add("selected");
            appState.selectedFood = food;
            document.getElementById("nextBtnScene3").disabled = false;
        });

        grid.appendChild(card);
    });
}

/* ==========================================================================
   SCENE 4: ROMANTIC CALENDAR LOGIC
   ========================================================================== */
function initCalendar() {
    renderCalendar(appState.currentCalendarDate);
}

function renderCalendar(date) {
    const year = date.getFullYear();
    const month = date.getMonth();

    const monthNames = ["January", "February", "March", "April", "May", "June", 
                        "July", "August", "September", "October", "November", "December"];

    document.getElementById("calendarMonthYear").innerText = `${monthNames[month]} ${year}`;

    const daysGrid = document.getElementById("calendarDays");
    daysGrid.innerHTML = "";

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Empty lead-in days
    for (let i = 0; i < firstDay; i++) {
        const emptyCell = document.createElement("div");
        emptyCell.className = "day-cell empty";
        daysGrid.appendChild(emptyCell);
    }

    // Days of month
    for (let day = 1; day <= totalDays; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "day-cell";
        dayCell.innerText = day;

        const cellDate = new Date(year, month, day);

        if (cellDate < today) {
            dayCell.classList.add("disabled");
        } else {
            if (appState.selectedDate && 
                appState.selectedDate.toDateString() === cellDate.toDateString()) {
                dayCell.classList.add("selected");
            }

            dayCell.addEventListener("click", () => {
                document.querySelectorAll(".day-cell").forEach(c => c.classList.remove("selected"));
                dayCell.classList.add("selected");
                
                appState.selectedDate = cellDate;
                
                const formatted = cellDate.toLocaleDateString("en-US", {
                    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
                });
                
                document.getElementById("formattedSelectedDate").innerText = formatted;
                document.getElementById("selectedDateDisplay").classList.remove("hidden");
                document.getElementById("nextBtnScene4").disabled = false;
            });
        }

        daysGrid.appendChild(dayCell);
    }
}

function changeCalendarMonth(delta) {
    appState.currentCalendarDate.setMonth(appState.currentCalendarDate.getMonth() + delta);
    renderCalendar(appState.currentCalendarDate);
}

/* ==========================================================================
   SCENE 5: CINEMATIC PROPOSAL SETUP & CELEBRATION
   ========================================================================== */
function setupFinalProposalScene() {
    // Fill summary data
    document.getElementById("summaryPlace").innerText = appState.selectedPlace ? appState.selectedPlace.name : "Café";
    document.getElementById("summaryFood").innerText = appState.selectedFood ? appState.selectedFood.name : "Treats";
    
    if (appState.selectedDate) {
        const dateStr = appState.selectedDate.toLocaleDateString("en-US", {
            month: 'short', day: 'numeric', year: 'numeric'
        });
        document.getElementById("summaryDate").innerText = dateStr;
    }

    // Reset proposal view
    document.getElementById("preProposalText").classList.remove("hidden");
    document.getElementById("postProposalBlock").classList.add("hidden");
    document.getElementById("loveBurstGraphic").classList.add("hidden");
}

function handleFinalProposalYes() {
    // Animate Characters proposal / hug
    const loveBurst = document.getElementById("loveBurstGraphic");
    if (loveBurst) loveBurst.classList.remove("hidden");

    // Hide initial prompt, reveal post-proposal celebration block
    document.getElementById("preProposalText").classList.add("hidden");
    document.getElementById("postProposalBlock").classList.remove("hidden");

    // Launch Confetti Burst
    launchConfetti();
}

/* Reset Experience */
function resetExperience() {
    appState.acceptedDate = false;
    appState.selectedPlace = null;
    appState.selectedFood = null;
    appState.selectedDate = null;
    appState.noClickCount = 0;

    // Reset Buttons & Grids
    document.getElementById("yesBtnStep1").style.transform = "scale(1)";
    document.getElementById("pamperBox").classList.add("hidden");
    document.getElementById("nextBtnScene2").disabled = true;
    document.getElementById("nextBtnScene3").disabled = true;
    document.getElementById("nextBtnScene4").disabled = true;

    initPlacesGrid();
    initFoodsGrid();
    initCalendar();

    goToScene(1);
}

/* ==========================================================================
   AUDIO CONTROLLER (AUDIO ELEMENT + SYNTHESIZER FALLBACK)
   ========================================================================== */
function initAudioController() {
    const musicToggle = document.getElementById("musicToggle");
    const bgMusic = document.getElementById("bgMusic");
    const musicText = document.getElementById("musicText");
    const musicIcon = document.getElementById("musicIcon");

    musicToggle.addEventListener("click", () => {
        if (appState.isPlayingMusic) {
            bgMusic.pause();
            appState.isPlayingMusic = false;
            musicText.innerText = "Play Music";
            musicIcon.innerText = "🎵";
        } else {
            // Attempt to play music audio file or Synthesize ambient chord
            bgMusic.play().then(() => {
                appState.isPlayingMusic = true;
                musicText.innerText = "Mute Music";
                musicIcon.innerText = "🎶";
            }).catch(err => {
                // Synthesizer Web Audio API Fallback if file isn't present
                playSynthesizedLullaby();
                appState.isPlayingMusic = true;
                musicText.innerText = "Mute Music";
                musicIcon.innerText = "🎶";
            });
        }
    });
}

// Romantic Synthesizer Ambient Fallback Audio
function playSynthesizedLullaby() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();
        
        const notes = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
        let step = 0;

        setInterval(() => {
            if (!appState.isPlayingMusic) return;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            
            osc.type = "sine";
            osc.frequency.setValueAtTime(notes[step % notes.length], ctx.currentTime);
            
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.8);
            
            osc.connect(gain);
            gain.connect(ctx.destination);
            
            osc.start();
            osc.stop(ctx.currentTime + 2);
            step++;
        }, 1200);
    } catch(e) {
        console.log("Web Audio API unavailable");
    }
}

/* ==========================================================================
   BACKGROUND CANVAS ENGINE (Floating Hearts & Stars)
   ========================================================================== */
function initBackgroundCanvas() {
    const canvas = document.getElementById("bgCanvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    // Generate Particles
    const particles = [];
    const particleCount = 40;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 12 + 6,
            speedY: Math.random() * 0.8 + 0.3,
            opacity: Math.random() * 0.5 + 0.2,
            isHeart: Math.random() > 0.4
        });
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.y -= p.speedY;
            if (p.y < -20) p.y = height + 20;

            ctx.globalAlpha = p.opacity;

            if (p.isHeart) {
                // Draw heart
                ctx.fillStyle = "#FF4D6D";
                ctx.beginPath();
                const x = p.x, y = p.y, s = p.size;
                ctx.moveTo(x, y);
                ctx.bezierCurveTo(x - s/2, y - s/2, x - s, y + s/3, x, y + s);
                ctx.bezierCurveTo(x + s, y + s/3, x + s/2, y - s/2, x, y);
                ctx.fill();
            } else {
                // Draw soft glowing star/bokeh
                ctx.fillStyle = "#FFF";
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size / 4, 0, Math.PI * 2);
                ctx.fill();
            }
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/* Heart Explosion Effect */
function triggerHeartExplosion() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const heart = document.createElement("div");
            heart.innerText = "❤️";
            heart.style.position = "fixed";
            heart.style.left = Math.random() * 100 + "vw";
            heart.style.top = "100vh";
            heart.style.fontSize = (Math.random() * 20 + 20) + "px";
            heart.style.zIndex = "1000";
            heart.style.transition = "transform 2s ease-out, opacity 2s ease-out";
            
            document.body.appendChild(heart);

            setTimeout(() => {
                heart.style.transform = `translateY(-${window.innerHeight + 100}px) rotate(${Math.random() * 360}deg)`;
                heart.style.opacity = "0";
            }, 50);

            setTimeout(() => heart.remove(), 2100);
        }, i * 50);
    }
}

/* ==========================================================================
   CONFETTI CANVIN ENGINE
   ========================================================================== */
function launchConfetti() {
    const canvas = document.getElementById("confettiCanvas");
    const ctx = canvas.getContext("2d");

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#FF4D6D", "#FFD166", "#FF8FA3", "#C77DFF", "#FFFFFF"];

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: width / 2,
            y: height / 2,
            vx: (Math.random() - 0.5) * 14,
            vy: (Math.random() - 0.7) * 14,
            size: Math.random() * 8 + 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    let frame = 0;
    function animateConfetti() {
        ctx.clearRect(0, 0, width, height);

        pieces.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.2; // Gravity
            p.rotation += p.rotSpeed;

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
            ctx.restore();
        });

        frame++;
        if (frame < 180) {
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, width, height);
        }
    }

    animateConfetti();
}