AOS.init();

function openInvite() {
  document.querySelector(".cover").style.display = "none";
  document.getElementById("content").classList.remove("hidden");
  document.getElementById("music").play();
}

let path = window.location.pathname; // contoh: /M%20Ainur%20Ridho
let nama = path.replace("/", "");

if (nama) {
    nama = decodeURIComponent(nama); // otomatis ubah %20 jadi spasi
    document.getElementById("guestName").innerText = nama;
}

/* COUNTDOWN */
const target = new Date("Jun 13, 2026 12:30:00").getTime();

setInterval(() => {
  const now = new Date().getTime();
  const gap = target - now;

  const d = Math.floor(gap / (1000*60*60*24));
  const h = Math.floor((gap/(1000*60*60))%24);

  document.getElementById("timer").innerHTML =
    d + " Hari " + h + " Jam";
}, 1000);

/* RSVP */
document.getElementById("rsvpForm").addEventListener("submit", e => {
  e.preventDefault();

  fetch("https://script.google.com/macros/s/AKfycbwNjzXpPMgeRb7NqkXhDooHCeqFd0HhK7JGrqzYEBsGO9rVDIzBnwJ851Js6imNB4rDZA/exec", {
    method: "POST",
    body: new FormData(e.target)
  })
  .then(() => {
    document.getElementById("status").innerText = "Berhasil terkirim";
    e.target.reset();
  })
  .catch(() => {
    document.getElementById("status").innerText = "Gagal kirim";
  });
});

document.addEventListener("DOMContentLoaded", () => {

  const container = document.querySelector(".sparkle");

  function createSparkle(x, y) {
    const sparkle = document.createElement("span");

    const shapes = ["✦","✧"];
    sparkle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

    sparkle.style.left = x + "px";
    sparkle.style.top = y + "px";

    sparkle.style.fontSize = (6 + Math.random() * 8) + "px";

    const moveX = (Math.random() - 0.5) * 40;
    const moveY = (Math.random() - 0.5) * 40;

    sparkle.style.setProperty("--x", moveX + "px");
    sparkle.style.setProperty("--y", moveY + "px");

    const duration = 1.5 + Math.random() * 1.5;
    sparkle.style.animationDuration = duration + "s";

    container.appendChild(sparkle);

    setTimeout(() => {
      sparkle.remove();
    }, duration * 1000);
  }

  setInterval(() => {
    const rect = container.getBoundingClientRect();

    const x = Math.random() * rect.width;
    const y = Math.random() * rect.height;

    createSparkle(x, y);
  }, 150);

});

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    const triggerBottom = window.innerHeight * 0.85;
    const triggerTop = window.innerHeight * 0.15;

    reveals.forEach((element) => {

        const rect = element.getBoundingClientRect();

        /* Muncul saat masuk area layar */
        if(
            rect.top < triggerBottom &&
            rect.bottom > triggerTop
        ){

            element.classList.add("active");

        }else{

            /* Hilang saat keluar fokus layar */
            element.classList.remove("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);
revealOnScroll();
