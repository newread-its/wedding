const API_URL = "https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");
const selectedDiv = document.getElementById("selected");
const loading = document.getElementById("loading");

let allGuests = [];
let selectedGuests = [];

loadGuests();

async function loadGuests(){

    loading.classList.remove("hidden");

    const res = await fetch(`${API_URL}?action=all`);

    allGuests = await res.json();

    loading.classList.add("hidden");

}

searchInput.addEventListener("input", ()=>{

    const q = searchInput.value.trim().toLowerCase();

    resultDiv.innerHTML = "";

    if(q.length < 1) return;

    const filtered = allGuests.filter(g => {
    const cocokNama =
        g.nama.toLowerCase().includes(q);
        const belumDipilih =
        !selectedGuests.find(
            s => s.id_tamu == g.id_tamu
        );
    return cocokNama && belumDipilih;
    });

    filtered.forEach(item => {

        const div = document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `
            <div class="item-text">
                ${item.nama} - ${item.asal}
            </div>
        `;

        div.onclick = () => addGuest(item);

        resultDiv.appendChild(div);

    });

});

function addGuest(item){
    selectedGuests.push(item);
    renderGuests();
    searchInput.value = "";
    resultDiv.innerHTML = "";
}

function renderGuests(){

    selectedDiv.innerHTML = "";

    selectedGuests.forEach((guest,index) => {

        const div = document.createElement("div");

        div.className = "member";

        div.innerHTML = `
        <div class="item-text">
            ${guest.nama} - ${guest.asal}
        </div>

        <button
        class="remove-btn"
        onclick="removeGuest('${guest.id_tamu}')"
        >
        <svg viewBox="0 0 24 24">
        <path d="M18 6L6 18"/>
        <path d="M6 6L18 18"/>
        </svg>
        </button>
`      ;

        selectedDiv.appendChild(div);

    });

}

function removeGuest(id_tamu){

    selectedGuests = selectedGuests.filter(
        g => g.id_tamu != id_tamu
    );

    renderGuests();

}

async function saveAttendance(){

    if(selectedGuests.length == 0){
        alert("Belum ada tamu");
        return;
    }

    const btn = event.target;

    btn.disabled = true;
    btn.innerText = "MENYIMPAN...";

    const res = await fetch(API_URL,{
        method:"POST",
        body:JSON.stringify({
            action:"save",
            ids:selectedGuests.map(g => g.id_tamu)
        })
    });

    const data = await res.json();

    btn.disabled = false;
    btn.innerText = "SIMPAN KEHADIRAN";

    if(!data.success){
        alert(data.message);
        return;
    }

    document
        .getElementById("successCard")
        .classList.remove("hidden");

    document
        .getElementById("regId")
        .innerText = data.id_kelompok;

    const qrDiv = document.getElementById("qrcode");

    qrDiv.innerHTML = "";

    new QRCode(qrDiv,{
        text:data.id_kelompok,
        width:180,
        height:180
    });

    document.getElementById("memberList").innerHTML =
        selectedGuests.map((m,i)=>`
            <p>${m.nama} - ${m.asal}</p>
        `).join("");

}
