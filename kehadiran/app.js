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
        ></button>
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

let isSaving = false;

async function saveAttendance(){

    if(isSaving) return;

    if(selectedGuests.length == 0){
        return;
    }

    isSaving = true;

    const btn = event.target;

    btn.disabled = true;

    btn.classList.add("loading-btn");

    btn.innerText = "MENYIMPAN...";

    try{

        const res = await fetch(API_URL,{
            method:"POST",
            body:JSON.stringify({
                action:"save",
                ids:selectedGuests.map(g => g.id_tamu)
            })
        });

        const data = await res.json();

        if(!data.success){
            alert("Terjadi kesalahan");
            return;
        }

        selectedGuests = selectedGuests.map(g => {

            if(data.failed_ids.includes(g.id_tamu)){

                return {
                    ...g,
                    failed:true
                };

            }

            return g;

        });

        selectedGuests =
            selectedGuests.filter(
                g => data.failed_ids.includes(g.id_tamu)
            );

        renderGuests();

        if(data.success_ids.length > 0){

            document
                .getElementById("successCard")
                .classList.remove("hidden");

            document
                .getElementById("regId")
                .innerText = data.id_kelompok;

            const qrDiv =
                document.getElementById("qrcode");

            qrDiv.innerHTML = "";

            new QRCode(qrDiv,{
                text:data.id_kelompok,
                width:180,
                height:180
            });

            const sukses =
                allGuests.filter(g =>
                    data.success_ids.includes(g.id_tamu)
                );

           document
            .getElementById("memberList")
            .innerHTML = `

            <div class="total-member">
            Total ${sukses.length} Tamu
            </div>

            ${sukses.map(m=>`
            <p class="member-line">
                ${m.nama} - ${m.asal}
            </p>
        `    ).join("")}

    `       ;

        }

    }
    finally{

        isSaving = false;

        btn.disabled = false;

        btn.classList.remove("loading-btn");

        btn.innerText = "SIMPAN KEHADIRAN";

    }

}

function downloadQR(){

    const card =
        document.getElementById("successCard");

    html2canvas(card).then(canvas => {

        const link = document.createElement("a");

        link.download =
            document.getElementById("regId").innerText + ".png";

        link.href = canvas.toDataURL();

        link.click();

    });

}
