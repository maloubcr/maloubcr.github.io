// 1. Récupération des éléments
const btnClick = document.querySelector("#click");
const affichage = document.querySelector("#affichage");
const btnUpgrade1 = document.querySelector("#upgrade1");
const btnUpgrade2 = document.querySelector("#upgrade2");
const btnUpgrade3 = document.querySelector("#upgrade3");
const btnUpgrade4 = document.querySelector("#upgrade4");
const crown = document.querySelector("#crown");
const progressFill = document.querySelector("#progress-fill");
const progressText = document.querySelector("#progress-text");
const victoryScreen = document.querySelector("#victory-screen");
const victoryScore = document.querySelector("#victory-score");
const victoryRestart = document.querySelector("#victory-restart");
const confettiCanvas = document.querySelector("#confetti-canvas");

// 2. Variables
let compteur = 0;
let totalClics = 0;
let puissanceClick = 1;
let aLeX3 = false;
let aLeX10 = false;
let autoClickerActif = false;
let autoClickerInterval = null;
let victoryDone = false;
const scoreMax = 2000;

// 3. Fonction pour créer un emoji volant
function lancerEmoji(type) {
    const emoji = document.createElement("div");
    emoji.innerHTML = type;
    emoji.className = "emoji-pop";

    const x = (Math.random() - 0.5) * 400;
    const y = -(Math.random() * 400 + 100);
    const r = (Math.random() - 0.5) * 720;

    emoji.style.setProperty('--x', `${x}px`);
    emoji.style.setProperty('--y', `${y}px`);
    emoji.style.setProperty('--r', `${r}deg`);

    emoji.style.left = "50%";
    emoji.style.top = "50%";

    document.body.appendChild(emoji);
    setTimeout(() => emoji.remove(), 1000);
}

// 4. Fonction de mise à jour de la barre de progression
function mettreAJourBarre() {
    // Barre basée sur le compteur (solde actuel)
    let pourcentage = (compteur / scoreMax) * 100;
    if (pourcentage > 100) pourcentage = 100;
    if (pourcentage < 0) pourcentage = 0;

    progressFill.style.width = pourcentage + "%";

    if (pourcentage >= 100 && !victoryDone) {
        victoryDone = true;
        setTimeout(() => afficherVictoire(), 600);
    }

    // Phrases basées sur totalClics (jamais réduit par les achats)
    if (totalClics >= scoreMax) {
        progressText.innerHTML = "On veut rire à gorge déployée";
        progressText.style.color = "#6d2e84";
    } else if (totalClics >= scoreMax * 0.75) {
        progressText.innerHTML = "Doucement mais sûrement !";
    } else if (totalClics >= scoreMax * 0.5) {
        progressText.innerHTML = "On y est presque...";
    } else if (totalClics >= scoreMax * 0.25) {
        progressText.innerHTML = " Allez ! Pour le bien de tous  !";
    } else {
        progressText.innerHTML = "Aide Mateo à devenir drôle...";
    }
}

// 5. Clic principal
btnClick.addEventListener('click', () => {
    compteur += puissanceClick;
    totalClics += puissanceClick;
    affichage.innerHTML = compteur;

    mettreAJourBarre();

    if (aLeX10) {
        lancerEmoji("🔥");
    } else if (aLeX3) {
        lancerEmoji("🚀");
    }
});

// 6. Boutique : Multiplicateur x2 (Coût: 25)
btnUpgrade1.addEventListener('click', () => {
    if (compteur >= 25) {
        compteur -= 25;
        puissanceClick = puissanceClick * 2;

        crown.style.display = "block";

        affichage.innerHTML = compteur;
        mettreAJourBarre();

        btnUpgrade1.disabled = true;
        btnUpgrade1.innerHTML = "Multiplicateur x2 ACQUIS ✅";
    } else {
        alert("Il te faut 25 clics !");
    }
});

// 7. Boutique : Multiplicateur x3 (Coût: 150)
btnUpgrade2.addEventListener('click', () => {
    if (compteur >= 150) {
        compteur -= 150;
        puissanceClick = puissanceClick * 3;

        aLeX3 = true;
        crown.style.display = "none";

        affichage.innerHTML = compteur;
        mettreAJourBarre();

        btnUpgrade2.disabled = true;
        btnUpgrade2.innerHTML = "Multiplicateur x3 ACQUIS ✅";
    } else {
        alert("Il te faut 150 clics !");
    }
});

// 8. Boutique : Multiplicateur x10 (Coût: 500)
btnUpgrade3.addEventListener('click', () => {
    if (compteur >= 500) {
        compteur -= 500;
        puissanceClick = puissanceClick * 10;

        aLeX10 = true;

        affichage.innerHTML = compteur;
        mettreAJourBarre();

        btnUpgrade3.disabled = true;
        btnUpgrade3.innerHTML = "ULTRA X10 ACQUIS ✅";
    } else {
        alert("Il te faut 500 clics !");
    }
});

// 9. Boutique : Auto-Clicker (Coût: 800)
// Règle : Mateo clique tout seul ! Ajoute automatiquement ta puissance de clic
// toutes les secondes. Un petit robot emoji apparaît à chaque clic auto.
btnUpgrade4.addEventListener('click', () => {
    if (compteur >= 800) {
        compteur -= 800;
        autoClickerActif = true;

        affichage.innerHTML = compteur;
        mettreAJourBarre();

        btnUpgrade4.disabled = true;
        btnUpgrade4.innerHTML = "⚡ Auto-Clicker ACQUIS ✅";

        // Lance l'auto-clicker : +puissanceClick chaque seconde
        autoClickerInterval = setInterval(() => {
            compteur += puissanceClick;
            totalClics += puissanceClick;
            affichage.innerHTML = compteur;
            mettreAJourBarre();
            lancerEmoji("⚡");

            // Petit effet de scale sur Mateo pour montrer le clic auto
            btnClick.style.transform = "scale(0.92)";
            setTimeout(() => {
                btnClick.style.transform = "scale(1)";
            }, 100);
        }, 1000);
    } else {
        alert("Il te faut 800 clics !");
    }
});

// 10. Écran de victoire
function afficherVictoire() {
    // Stoppe l'auto-clicker si actif
    if (autoClickerInterval) {
        clearInterval(autoClickerInterval);
    }

    victoryScore.innerHTML = "Score final : " + totalClics + " clics au total 🏅";
    victoryScreen.classList.add("active");

    lancerConfettis();
}

// 11. Confettis sur canvas
function lancerConfettis() {
    const ctx = confettiCanvas.getContext("2d");
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;

    const confettis = [];
    const couleurs = ["#FFD700", "#ff4500", "#3E3257", "#00c853", "#ff69b4", "#00bcd4", "#fff"];

    for (let i = 0; i < 200; i++) {
        confettis.push({
            x: Math.random() * confettiCanvas.width,
            y: Math.random() * confettiCanvas.height - confettiCanvas.height,
            w: Math.random() * 12 + 5,
            h: Math.random() * 6 + 3,
            color: couleurs[Math.floor(Math.random() * couleurs.length)],
            speedY: Math.random() * 4 + 2,
            speedX: (Math.random() - 0.5) * 3,
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 10
        });
    }

    function animer() {
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

        for (const c of confettis) {
            ctx.save();
            ctx.translate(c.x + c.w / 2, c.y + c.h / 2);
            ctx.rotate((c.rotation * Math.PI) / 180);
            ctx.fillStyle = c.color;
            ctx.fillRect(-c.w / 2, -c.h / 2, c.w, c.h);
            ctx.restore();

            c.y += c.speedY;
            c.x += c.speedX;
            c.rotation += c.rotSpeed;

            // Remonter en haut quand un confetti sort en bas
            if (c.y > confettiCanvas.height) {
                c.y = -20;
                c.x = Math.random() * confettiCanvas.width;
            }
        }

        requestAnimationFrame(animer);
    }

    animer();
}

// 12. Bouton rejouer
victoryRestart.addEventListener('click', () => {
    // Reset tout
    compteur = 0;
    totalClics = 0;
    puissanceClick = 1;
    aLeX3 = false;
    aLeX10 = false;
    autoClickerActif = false;
    victoryDone = false;

    affichage.innerHTML = 0;
    progressFill.style.width = "0%";
    progressText.innerHTML = "Aide Mateo à devenir drôle...";
    progressText.style.color = "";

    crown.style.display = "none";

    btnUpgrade1.disabled = false;
    btnUpgrade1.innerHTML = "Multiplicateur x2 (25)";
    btnUpgrade2.disabled = false;
    btnUpgrade2.innerHTML = "Multiplicateur x3 (150)";
    btnUpgrade3.disabled = false;
    btnUpgrade3.innerHTML = "ULTRA x10 (500)";
    btnUpgrade4.disabled = false;
    btnUpgrade4.innerHTML = "🤖 Auto-Clicker (800)";

    victoryScreen.classList.remove("active");
});