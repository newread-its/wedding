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
