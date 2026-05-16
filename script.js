AOS.init();

function openInvite() {

    document.querySelector(".cover").style.display = "none";

    document.getElementById("content")
        .classList.remove("hidden");

    document.getElementById("music").play();

}

// =========================
// NAMA TAMU
// =========================
let path = window.location.pathname;

let nama = path.replace("/", "");

if (nama) {

    nama = decodeURIComponent(nama);

    const guest =
        document.getElementById("guestName");

    if (guest) {

        guest.innerText = nama;

    }

}

// =========================
// COUNTDOWN
// =========================
const target =
    new Date("Jun 13, 2026 12:30:00").getTime();

setInterval(() => {

    const now =
        new Date().getTime();

    const gap =
        target - now;

    const d =
        Math.floor(gap / (1000 * 60 * 60 * 24));

    const h =
        Math.floor((gap / (1000 * 60 * 60)) % 24);

    const timer =
        document.getElementById("timer");

    if (timer) {

        timer.innerHTML =
            d + " Hari " + h + " Jam";

    }

}, 1000);

// =========================
// RSVP
// =========================
const rsvpForm =
    document.getElementById("rsvpForm");

if (rsvpForm) {

    rsvpForm.addEventListener("submit", e => {

        e.preventDefault();

        fetch("https://script.google.com/macros/s/AKfycbwNjzXpPMgeRb7NqkXhDooHCeqFd0HhK7JGrqzYEBsGO9rVDIzBnwJ851Js6imNB4rDZA/exec", {
            method: "POST",
            body: new FormData(e.target)
        })

        .then(() => {

            document.getElementById("status").innerText =
                "Berhasil terkirim";

            e.target.reset();

        })

        .catch(() => {

            document.getElementById("status").innerText =
                "Gagal kirim";

        });

    });

}

// =========================
// SEMUA SETELAH HTML SIAP
// =========================
document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // CARD
    // =========================
    const card =
        document.querySelector(".schedule-card");

    if (card) {

        card.style.opacity = "0";

        card.style.transform =
            "translateY(30px)";

        setTimeout(() => {

            card.style.transition =
                "all 1s ease";

            card.style.opacity = "1";

            card.style.transform =
                "translateY(0)";

        }, 300);

    }

    // =========================
    // SPARKLE
    // =========================
    const sparkleContainer =
        document.querySelector(".sparkle");

    function createSparkle(x, y) {

        if (!sparkleContainer) return;

        const sparkle =
            document.createElement("span");

        const shapes =
            ["✦", "✧"];

        sparkle.innerHTML =
            shapes[Math.floor(Math.random() * shapes.length)];

        sparkle.style.left =
            x + "px";

        sparkle.style.top =
            y + "px";

        sparkle.style.fontSize =
            (6 + Math.random() * 8) + "px";

        const moveX =
            (Math.random() - 0.5) * 40;

        const moveY =
            (Math.random() - 0.5) * 40;

        sparkle.style.setProperty(
            "--x",
            moveX + "px"
        );

        sparkle.style.setProperty(
            "--y",
            moveY + "px"
        );

        const duration =
            1.5 + Math.random() * 1.5;

        sparkle.style.animationDuration =
            duration + "s";

        sparkleContainer.appendChild(sparkle);

        setTimeout(() => {

            sparkle.remove();

        }, duration * 1000);

    }

    if (sparkleContainer) {

        setInterval(() => {

            const rect =
                sparkleContainer.getBoundingClientRect();

            const x =
                Math.random() * rect.width;

            const y =
                Math.random() * rect.height;

            createSparkle(x, y);

        }, 150);

    }

    // =========================
    // LOVE
    // =========================
       const loveContainer =
    document.querySelector(".floating-love-container");

function createLove() {

    if (!loveContainer) return;

    const love =
        document.createElement("div");

    love.classList.add("floating-love");

    love.innerHTML = "❤";

    love.style.left =
        Math.random() * 100 + "%";

    love.style.fontSize =
        (10 + Math.random() * 20) + "px";

    const duration =
        4 + Math.random() * 3;

    love.style.animationDuration =
        duration + "s";

    /* 🔥 INI YANG NENTUKAN “SEBERAPA JAUH NAIKNYA” */
    const travel =
        loveContainer.offsetHeight + 200;

    love.style.setProperty(
        "--travel",
        travel + "px"
    );

    love.style.animationName = "loveFloatDynamic";

    loveContainer.appendChild(love);

    setTimeout(() => {
        love.remove();
    }, duration * 1000);
}

setInterval(createLove, 250);

    // =========================
    // FOTO SCROLL
    // =========================
    const photos =
        document.querySelectorAll(".photo-wrapper");

    function revealOnScroll() {

        const triggerMiddle =
            window.innerHeight * 0.55;

        photos.forEach((photo) => {

            const rect =
                photo.parentElement.getBoundingClientRect();

            const text =
                photo.parentElement.querySelector(".text-content");

            if (
                rect.top < triggerMiddle &&
                rect.bottom > triggerMiddle
            ) {

                photo.classList.add("active");

                photo.classList.remove("hide");

                if (text) {

                    text.classList.add("down");

                }

            } else {

                if (photo.classList.contains("active")) {

                    photo.classList.remove("active");

                    photo.classList.add("hide");

                    if (text) {

                        text.classList.remove("down");

                    }

                }

            }

        });

    }

    window.addEventListener(
        "scroll",
        revealOnScroll
    );

    revealOnScroll();

});

const targetDate = new Date("June 13, 2026 12:30:00").getTime();

const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function animateFlip(el){

    el.style.animation = 'none';

    el.offsetHeight;

    el.style.animation = 'flip .8s ease';
}

function updateCountdown(){

    const now = new Date().getTime();

    const distance = targetDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));

    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24))
        / (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60))
        / (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60))
        / 1000
    );

    if(daysEl.innerText !== String(days).padStart(2,'0')){
        animateFlip(daysEl);
    }

    if(hoursEl.innerText !== String(hours).padStart(2,'0')){
        animateFlip(hoursEl);
    }

    if(minutesEl.innerText !== String(minutes).padStart(2,'0')){
        animateFlip(minutesEl);
    }

    animateFlip(secondsEl);

    daysEl.innerText = String(days).padStart(2,'0');
    hoursEl.innerText = String(hours).padStart(2,'0');
    minutesEl.innerText = String(minutes).padStart(2,'0');
    secondsEl.innerText = String(seconds).padStart(2,'0');

}

setInterval(updateCountdown, 1000);

updateCountdown();


const flipSections = document.querySelectorAll('.section-flip');

const flipObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add('show');

        }

    });

},{
    threshold:0.2
});

flipSections.forEach(section=>{

    flipObserver.observe(section);

});

// =========================
// DISABLE COPY / INSPECT
// =========================

document.addEventListener('contextmenu', e=>{
    e.preventDefault();
});

document.addEventListener('copy', e=>{
    e.preventDefault();
});

document.addEventListener('selectstart', e=>{
    e.preventDefault();
});

document.addEventListener('keydown', (e)=>{

    if(

        (e.ctrlKey && e.key === '+') ||
        (e.ctrlKey && e.key === '-') ||
        (e.ctrlKey && e.key === '=') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 'U') ||
        (e.ctrlKey && e.key === 'c') ||
        (e.ctrlKey && e.key === 'C') ||
        (e.ctrlKey && e.key === 's') ||
        (e.ctrlKey && e.key === 'S') ||
        (e.ctrlKey && e.key === 'p') ||
        (e.ctrlKey && e.key === 'P')

    ){

        e.preventDefault();

    }

});
