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

    // 🔥 POSISI RANDOM FULL AREA (INI YANG KAMU BELUM PUNYA)
    const rect = loveContainer.getBoundingClientRect();

    love.style.left =
        Math.random() * rect.width + "px";

    love.style.top =
        rect.height - 10 + "px"; // start dari bawah container

    // ukuran
    const size =
        Math.random() * 20 + 10;

    love.style.fontSize =
        size + "px";

    // durasi
    const duration =
        Math.random() * 4 + 5;

    love.style.animationDuration =
        duration + "s";

    loveContainer.appendChild(love);

    setTimeout(() => {
        love.remove();
    }, duration * 1000);

    }

    setInterval(createLove, 300);

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
