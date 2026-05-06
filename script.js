AOS.init();

function openInvite() {
  document.querySelector(".cover").style.display = "none";
  document.getElementById("content").classList.remove("hidden");
  document.getElementById("music").play();
}

/* COUNTDOWN */
const target = new Date("Jun 12, 2026 08:00:00").getTime();

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
/*
function createSparkle() {
  const el = document.createElement("span");

  const rect = container.getBoundingClientRect();

  el.style.left = Math.random() * rect.width + "px";
  el.style.top = Math.random() * rect.height + "px";

  el.style.animationDuration = (1.5 + Math.random() * 1.5) + "s";

  container.appendChild(el);

  setTimeout(() => {
    el.remove();
  }, 2000);
}

  setInterval(createSparkle, 300);
*/

function createSparkle(x, y) {
  const sparkle = document.createElement("span");

  // bentuk bintang random
  const shapes = ["✦","✧","✦","✧"];
  sparkle.innerHTML = shapes[Math.floor(Math.random() * shapes.length)];

  // posisi awal
  sparkle.style.left = x + "px";
  sparkle.style.top = y + "px";

  // ukuran random
  sparkle.style.fontSize = (6 + Math.random() * 8) + "px";

  // arah menyebar random
  const moveX = (Math.random() - 0.5) * 120;
  const moveY = (Math.random() - 0.5) * 120;

  sparkle.style.setProperty("--x", moveX + "px");
  sparkle.style.setProperty("--y", moveY + "px");

  // durasi random biar natural
  sparkle.style.animationDuration = (0.6 + Math.random() * 0.6) + "s";

  document.querySelector(".sparkle").appendChild(sparkle);

  // hapus setelah animasi
  setTimeout(() => {
    sparkle.remove();
  }, 1200);
}

setInterval(() => {
  const container = document.querySelector(".sparkle");
  const rect = container.getBoundingClientRect();

  const x = Math.random() * rect.width;
  const y = Math.random() * rect.height;

  createSparkle(x, y);
}, 120);
  
});


