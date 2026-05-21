const API_URL = "https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

const searchInput = document.getElementById("search");
const resultDiv = document.getElementById("result");
const selectedDiv = document.getElementById("selected");
const loading = document.getElementById("loading");

let allGuests = [];
let selectedGuests = [];
let isSaving = false;

loadGuests();

async function loadGuests(){

    loading.classList.remove("hidden");

    const res = await fetch(`${API_URL}?action=all`);

    allGuests = await res.json();

    loading.classList.add("hidden");

}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener("input", () => {

    const q =
        searchInput.value
            .trim()
            .toLowerCase();

    renderSearch(q);

});

function renderSearch(q){

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

        const div =
            document.createElement("div");

        div.className = "result-item";

        div.innerHTML = `

            <div class="item-text">
                ${item.nama} - ${item.asal}
            </div>

            <button
                class="add-btn"
                onclick="event.stopPropagation(); addGuestById('${item.id_tamu}')"
            >
                ADD
            </button>

        `;

        resultDiv.appendChild(div);

    });

}

/* =========================
   ADD GUEST
========================= */

function addGuestById(id_tamu){

    const item =
        allGuests.find(
            g => g.id_tamu == id_tamu
        );

    if(!item) return;

    addGuest(item);

    const q =
        searchInput.value
            .trim()
            .toLowerCase();

    renderSearch(q);

}

function addGuest(item){

    selectedGuests.push(item);

    renderGuests();

}

/* =========================
   RENDER SELECTED
========================= */

function renderGuests(){

    selectedDiv.innerHTML = "";

    selectedGuests.forEach(guest => {

        const div =
            document.createElement("div");

        div.className = "member";

        div.innerHTML = `

            <div class="item-text">

                ${guest.nama} - ${guest.asal}

                ${
                    guest.failed
                    ? `
                        <div class="failed-text">
                            Sudah terdaftar
                        </div>
                    `
                    : ""
                }

            </div>

            <button
                class="remove-btn"
                onclick="removeGuest('${guest.id_tamu}')"
            ></button>

        `;

        selectedDiv.appendChild(div);

    });

}

/* =========================
   REMOVE
========================= */

function removeGuest(id_tamu){

    selectedGuests =
        selectedGuests.filter(
            g => g.id_tamu != id_tamu
        );

    renderGuests();

    const q =
        searchInput.value
            .trim()
            .toLowerCase();

    renderSearch(q);

}

/* =========================
   SAVE
========================= */

async function saveAttendance(){

    if(isSaving) return;

    if(selectedGuests.length == 0){
        return;
    }

    isSaving = true;

    const btn =
        document.getElementById("saveBtn");

    btn.disabled = true;

    btn.classList.add("loading-btn");

    btn.innerText = "MENYIMPAN...";

    try{

        const res = await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"save",

                ids:selectedGuests.map(
                    g => g.id_tamu
                )

            })

        });

        const data = await res.json();

        if(!data.success){

            alert("Terjadi kesalahan");

            return;

        }

        /* TANDAI GAGAL */

        selectedGuests = selectedGuests.map(g => {

            if(data.failed_ids.includes(g.id_tamu)){

                return {
                    ...g,
                    failed:true
                };

            }

            return g;

        });

        /* SISAKAN YANG GAGAL */

        selectedGuests =
            selectedGuests.filter(
                g => data.failed_ids.includes(g.id_tamu)
            );

        renderGuests();

        /* QR */

        if(data.success_ids.length > 0){

            const successCard =
                document.getElementById("successCard");

            successCard.style.display = "block";

            document
                .getElementById("regId")
                .innerText = data.id_kelompok;

            const sukses =
                allGuests.filter(g =>
                    data.success_ids.includes(
                        String(g.id_tamu)
                    )
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
                    `).join("")}

                `;

            const qrDiv =
                document.getElementById("qrcode");

            qrDiv.innerHTML = "";

            new QRCode(qrDiv,{

                text:data.id_kelompok,

                width:180,
                height:180

            });

        }

    }
    finally{

        isSaving = false;

        btn.disabled = false;

        btn.classList.remove("loading-btn");

        btn.innerText = "SIMPAN KEHADIRAN";

    }

}

/* =========================
   DOWNLOAD QR
========================= */

function downloadQR(){

    const card =
        document.getElementById("qrCapture");

    html2canvas(card).then(canvas => {

        const link =
            document.createElement("a");

        link.download =
            document.getElementById("regId")
                .innerText + ".png";

        link.href =
            canvas.toDataURL();

        link.click();

    });

}

/* =========================
   PRINT
========================= */

function printQR(){

    const content =
        document.getElementById("qrCapture")
            .innerHTML;

    const win =
        window.open("", "_blank");

    win.document.write(`

        <html>

        <head>

            <title>Print QR</title>

            <style>

                @page{
                    size:58mm auto;
                    margin:0;
                }

                body{

                    width:58mm;

                    margin:0 auto;

                    padding:4mm;

                    box-sizing:border-box;

                    font-family:monospace;

                    text-align:center;

                }

                h2{
                    font-size:18px;
                    margin:0 0 8px 0;
                }

                #qrcode{

                    display:flex;
                    justify-content:center;

                    margin-bottom:8px;
                }

                #qrcode img{
                    width:170px !important;
                    height:170px !important;
                }

                #regId{
                    font-size:18px;
                    font-weight:bold;
                    margin:8px 0 12px 0;
                }

                .total-member{
                    font-size:14px;
                    font-weight:bold;
                    margin-bottom:6px;
                }

                .member-line{
                    font-size:13px;
                    line-height:1.2;
                    margin:2px 0;

                    text-align:left;

                    word-break:break-word;
                }

            </style>

        </head>

        <body>

            ${content}

        </body>

        </html>

    `);

    win.document.close();

    win.focus();

    setTimeout(()=>{

        win.print();

    },700);

}

/* =========================
   CLOSE QR
========================= */

function closeQR(){

    document
        .getElementById("successCard")
        .style.display = "none";

    document
        .getElementById("qrcode")
        .innerHTML = "";

}
