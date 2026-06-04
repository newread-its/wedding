const API_URL =
"https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

const searchInput =
    document.getElementById("search");

const resultDiv =
    document.getElementById("result");

const selectedDiv =
    document.getElementById("selected");

const loading =
    document.getElementById("loading");

const saveBtn =
    document.getElementById("saveBtn");

let allGuests = [];

let selectedGuests = [];

let isSaving = false;

/* =========================
   LOAD DATA
========================= */

loadGuests();

async function loadGuests(){

    try{

        loading.classList.remove("hidden");

        const res =
            await fetch(
                `${API_URL}?action=all`
            );

        allGuests =
            await res.json();

    }
    catch(err){

        console.error(err);

        showToast(
        "Gagal memuat data tamu",
        "error"
        );

    }
    finally{

        loading.classList.add(
            "hidden"
        );

    }

}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    () => {

        const q =
            searchInput.value
                .trim()
                .toLowerCase();

        renderSearch(q);

    }
);

function renderSearch(q){

    resultDiv.innerHTML = "";

    if(q.length < 1){
        return;
    }

    const filtered =
        allGuests.filter(g => {

            const cocok =
                g.nama
                    .toLowerCase()
                    .includes(q);

            const belumDipilih =
                !selectedGuests.find(
                    s =>
                        s.id_tamu ==
                        g.id_tamu
                );

            return cocok && belumDipilih;

        });

    if(filtered.length < 1){

        resultDiv.innerHTML = `

            <div class="empty-state">
                Tamu tidak ditemukan
            </div>

        `;

        return;

    }

    filtered.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "result-item";

        div.innerHTML = `

            <div class="item-text">

                <strong>
                    ${item.nama}
                </strong>

                <br>

                <span>
                    ${item.asal}
                </span>

            </div>

            <button
                class="add-btn"
                onclick="addGuestById('${item.id_tamu}')"
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
            g =>
                g.id_tamu == id_tamu
        );

    if(!item) return;

    selectedGuests.push(item);

    renderGuests();

    const q =
        searchInput.value
            .trim()
            .toLowerCase();

    renderSearch(q);

}

/* =========================
   RENDER SELECTED
========================= */

function renderGuests(){

    selectedDiv.innerHTML = "";

    if(selectedGuests.length < 1){

        selectedDiv.innerHTML = `

            <div class="empty-state">
                Belum ada tamu dipilih
            </div>

        `;

        return;

    }

    selectedGuests.forEach(guest => {

        const div =
            document.createElement("div");

        div.className =
            "member";

        div.innerHTML = `

            <div class="item-text">

                <strong>
                    ${guest.nama}
                </strong>

                <br>

                <span>
                    ${guest.asal}
                </span>

                ${
                    guest.failed
                    ?
                    `
                        <div class="failed-text">
                            Sudah terdaftar
                        </div>
                    `
                    :
                    ""
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
            g =>
                g.id_tamu != id_tamu
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

    if(selectedGuests.length < 1){

        showToast(
            "Pilih tamu terlebih dahulu",
            "warning"
        );

        return;

    }

    try{

        isSaving = true;

        document
        .getElementById("saveLoading")
        .classList.remove("hidden");

        saveBtn.disabled = true;

        saveBtn.classList.add(
            "loading-btn"
        );

        saveBtn.innerText =
            "MENYIMPAN...";

        const res =
            await fetch(API_URL, {

                method:"POST",

                body:JSON.stringify({

                    action:"save",

                    ids:selectedGuests.map(
                        g => g.id_tamu
                    )

                })

            });

        const data =
            await res.json();

        if(!data.success){

            showToast(
                "Gagal menyimpan data",
                "error"
            );

            return;

        }

        /* FAILED */

        selectedGuests =
            selectedGuests.map(g => {

                if(
                    data.failed_ids.includes(
                        String(g.id_tamu)
                    )
                ){

                    return {
                        ...g,
                        failed:true
                    };

                }

                return g;

            });

        /* SISAKAN FAILED */

        selectedGuests =
            selectedGuests.filter(
                g =>
                    data.failed_ids.includes(
                        String(g.id_tamu)
                    )
            );

        renderGuests();

        /* SUCCESS */

        if(data.success_ids.length > 0){

            showToast(
                "Kehadiran berhasil disimpan",
                "success"
            );
            
            const sukses =
                allGuests.filter(g =>
                    data.success_ids.includes(
                        String(g.id_tamu)
                    )
                );

            document
                .getElementById(
                    "successCard"
                )
                .style.display =
                    "block";

            document
                .getElementById(
                    "regId"
                )
                .innerText =
                    data.id_kelompok;

            document
                .getElementById(
                    "memberList"
                )
                .innerHTML = `

                    <div class="total-member">
                        Total ${sukses.length} Tamu
                    </div>

                    ${sukses.map(m => `

                        <div class="member-line">

                            ${m.nama}
                            -
                            ${m.asal}

                        </div>

                    `).join("")}

                `;

            const qrDiv =
                document.getElementById(
                    "qrcode"
                );

            qrDiv.innerHTML = "";

            new QRCode(qrDiv,{

                text:data.id_kelompok,

                width:180,

                height:180

            });

        }

    }
    catch(err){

        console.error(err);

        showToast(
            "Terjadi kesalahan server",
            "error"
        );

    }
    finally{

        isSaving = false;

        document
        .getElementById("saveLoading")
        .classList.add("hidden");
        
        saveBtn.disabled = false;

        saveBtn.classList.remove(
            "loading-btn"
        );

        saveBtn.innerText =
            "SIMPAN KEHADIRAN";

    }

}

/* =========================
   DOWNLOAD QR
========================= */

function downloadQR(){

    const card =
        document.getElementById(
            "qrCapture"
        );

    html2canvas(card).then(canvas => {

        const link =
            document.createElement("a");

        link.download =
            document
                .getElementById("regId")
                .innerText + ".png";

        link.href =
            canvas.toDataURL();

        link.click();

    });

}

/* =========================
   PRINT QR
========================= */

function printQR(){

    const regId =
        document.getElementById("regId")
        .innerText;

    const members =
        [...document.querySelectorAll(".member-line")]
        .map(x => x.innerText);

    let text = "";

    // Reset
    text += "\x1B\x40";

    // ===== HEADER =====
    text += "\x1B\x61\x01"; // center
    text += "\x1B\x45\x01"; // bold
    text += "\x1D\x21\x11"; // besar

    text += "DATA CHECK-IN\n";

    text += "\x1D\x21\x00";
    text += "\x1B\x45\x00";

    text += "------------------------------\n";

    text += "\x1B\x45\x01";
    text += "ID : " + regId + "\n";
    text += "\x1B\x45\x00";

    text += "------------------------------\n\n";

    // ===== QR CODE =====

    // ukuran QR (1-16)
    text += "\x1D\x28\x6B\x03\x00\x31\x43\x08";

    // error correction M
    text += "\x1D\x28\x6B\x03\x00\x31\x45\x31";

    const qr = regId;

    const len = qr.length + 3;
    const pL = len % 256;
    const pH = Math.floor(len / 256);

    // simpan data QR
    text += "\x1D\x28\x6B";
    text += String.fromCharCode(pL);
    text += String.fromCharCode(pH);
    text += "\x31\x50\x30";
    text += qr;

    // print QR
    text += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    text += "\n\n";

    // ===== MEMBER =====
    text += "\x1B\x61\x00";

    members.forEach(m => {
        text += m + "\n";
    });

    text += "\n";
    text += "------------------------------\n";

    text += "\x1B\x61\x01";

    text += "Terima Kasih Atas\n";
    text += "Kehadiran dan Do'a Restu\n";

    text += "\n\n\n\n";

    location.href =
        "rawbt:" +
        encodeURIComponent(text);

}

function printQR2(){

    const regId =
        document.getElementById("regId")
        .innerText;

    const members =
        [...document.querySelectorAll(".member-line")]
        .map(x => x.innerText)
        .join("\n");

    const text =

`DATA CHECK-IN

ID: ${regId}

${members}

Terima kasih atas
kehadiran dan doa restu`;

    location.href =
        "rawbt:" +
        encodeURIComponent(text);

}

function printQR1(){

    const card =
        document.getElementById(
            "qrCapture"
        );

    html2canvas(card,{

        scale:3,

        useCORS:true,

        backgroundColor:"#ffffff"

    }).then(canvas => {

        const image =
            canvas.toDataURL(
                "image/png"
            );

        const win =
            window.open(
                "",
                "_blank"
            );

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

                        margin:0;

                        padding:0;

                        text-align:center;

                        background:white;

                    }

                    img{

                        width:58mm;

                        display:block;

                    }

                </style>

            </head>

            <body>

                <img src="${image}">

            </body>

            </html>

        `);

        win.document.close();

        setTimeout(() => {

            win.focus();

            win.print();

        },1200);

    });

}

/* =========================
   CLOSE QR
========================= */

function closeQR(){

    document
        .getElementById(
            "successCard"
        )
        .style.display = "none";

    document
        .getElementById(
            "qrcode"
        )
        .innerHTML = "";

}

/* =========================
   EMPTY STATE STYLE
========================= */

const style =
document.createElement("style");

style.innerHTML = `

.empty-state{

    text-align:center;

    padding:20px;

    opacity:.7;

    background:
        rgba(255,255,255,.05);

    border-radius:16px;

    margin-bottom:10px;

}

`;

document.head.appendChild(style);


/* =========================
   TOAST
========================= */

function showToast(
    message,
    type = "success"
){

    const toast =
        document.getElementById(
            "toast"
        );

    toast.className = "";

    toast.classList.add(
        `toast-${type}`
    );

    toast.classList.add(
        "show"
    );

    toast.innerText = message;

    clearTimeout(
        toast.timer
    );

    toast.timer =
        setTimeout(() => {

            toast.classList.remove(
                "show"
            );

        },2500);

}
