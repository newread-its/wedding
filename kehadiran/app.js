const API_URL = "https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");
const selectedDiv = document.getElementById("selected");

let selectedGuests = [];

searchInput.addEventListener("input", async () => {

    const q = searchInput.value.trim();

    if(q.length < 2){
        resultDiv.innerHTML = "";
        return;
    }

    const res = await fetch(`${API_URL}?action=search&q=${q}`);

    const data = await res.json();

    resultDiv.innerHTML = "";

    data.forEach(item => {

        const div = document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <b>${item.nama}</b><br>
            ${item.asal}
        `;

        div.onclick = () => selectGuest(item);

        resultDiv.appendChild(div);

    });

});

async function selectGuest(item){

    if(selectedGuests.find(g => g.id_tamu == item.id_tamu)){
        alert("Tamu sudah ditambahkan");
        return;
    }

    selectedGuests.push(item);

    renderMembers();

    searchInput.value = "";
    resultDiv.innerHTML = "";

}

function renderMembers(){

    selectedDiv.innerHTML = "";

    selectedGuests.forEach((guest,index) => {

        const div = document.createElement("div");

        div.className = "member";

        div.innerHTML = `
            <b>${guest.nama}</b><br>
            ${guest.asal}

            <button onclick="removeGuest('${guest.id_tamu}')" style="margin-top:10px;">
                HAPUS
            </button>
        `;

        selectedDiv.appendChild(div);

    });

}

function removeGuest(id_tamu){

    selectedGuests = selectedGuests.filter(g => g.id_tamu != id_tamu);

    renderMembers();

}

async function saveAttendance(){

    if(selectedGuests.length == 0){
        alert("Pilih tamu dulu");
        return;
    }

    const res = await fetch(API_URL, {
        method:"POST",
        body:JSON.stringify({
            action:"save",
            ids:selectedGuests.map(g => g.id_tamu)
        })
    });

    const data = await res.json();

    if(!data.success){
        alert(data.message);
        return;
    }

    document.getElementById("successCard").classList.remove("hidden");

    document.getElementById("regId").innerText = data.id_daftar;

    let html = "";

    document.getElementById("memberList").innerHTML = selectedGuests.map((m,i)=>`
        <p>${i+1}. ${m.nama} - ${m.asal}</p>
    `).join("");

    document.getElementById("qrcode").innerHTML = "";

    new QRCode(document.getElementById("qrcode"), {
        text: data.id_daftar,
        width: 220,
        height: 220
    });

}

function downloadQR(){

    const img = document.querySelector("#qrcode img");

    if(!img) return;

    const a = document.createElement("a");

    a.href = img.src;
    a.download = "qr-kehadiran.png";

    a.click();

}
