const API_URL =
"https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

let allData = [];
let currentTab = 0;
let keyword = "";

document
.getElementById("searchInput")
.addEventListener("input", e => {
    keyword =
        e.target.value
        .toLowerCase();
    render();
});

document
.getElementById("tabBelum")
.onclick = () => {

    currentTab = 0;

    document
    .getElementById("tabBelum")
    .classList.add("active");

    document
    .getElementById("tabSudah")
    .classList.remove("active");

    render();

};

document
.getElementById("tabSudah")
.onclick = () => {
    currentTab = 1;
    document
    .getElementById("tabSudah")
    .classList.add("active");
    document
    .getElementById("tabBelum")
    .classList.remove("active");    
    render();
};

loadData();

async function loadData(){

    const res =
        await fetch(
            API_URL +
            "?action=registrasi"
        );

    allData =
        await res.json();

    console.log("DATA:", allData);
    console.log("ARRAY?", Array.isArray(allData));

    render();

}

function render(){

    const wrap =
        document.getElementById(
            "listData"
        );

    wrap.innerHTML = "";

    const filtered =
        allData.filter(item => {

            const matchTab =
                currentTab == 0
                ?
                item.printed == 0
                :
                item.printed == 1;

            const matchSearch =
                item.search
                .toLowerCase()
                .includes(keyword);

            return (
                matchTab &&
                matchSearch
            );

        });

    if(filtered.length < 1){

        wrap.innerHTML = `
            <div class="empty">
                Data tidak ditemukan
            </div>
        `;

        return;

    }

    filtered.forEach(item => {

        wrap.innerHTML += `

            <div class="card">
            
                <div
                    onclick="
                        loadDetail(
                            '${item.id_kelompok}'
                        )
                    ">
            
                    <div class="reg-id">
                        ${item.id_kelompok}
                    </div>
            
                    <div>
                        ${item.nama}
                    </div>
            
                    <div class="total">
                        Total ${item.total} Tamu
                    </div>
            
                </div>
            
                <button
                    id="btn-${item.id_kelompok}"
                    class="btn-print-top"
                    onclick="
                        event.stopPropagation();
                        printReg(
                            '${item.id_kelompok}'
                        );
                    ">
                    PRINT
                </button>
            
                <div
                    id="detail-${item.id_kelompok}">
                </div>
            
            </div>
            
`            ;

    });

}


async function loadDetail(idKelompok){

    const detailDiv =
        document.getElementById(
            "detail-" + idKelompok
        );

    const btnTop =
        document.getElementById(
            "btn-" + idKelompok
        );

    // collapse
    if(detailDiv.innerHTML.trim()){

        detailDiv.innerHTML = "";

        if(btnTop){
            btnTop.style.display = "block";
        }

        return;

    }

    // expand
    if(btnTop){
        btnTop.style.display = "none";
    }

    const res =
        await fetch(

            API_URL +

            "?action=detail&id_kelompok=" +

            encodeURIComponent(
                idKelompok
            )

        );

    const data =
        await res.json();

    detailDiv.innerHTML = `

        <div class="detail">

            ${data.map(m => `

                <div class="member">

                    <div class="member-name">
                        ${m.nama}
                    </div>

                    <div class="member-asal">
                        ${m.asal}
                    </div>

                </div>

            `).join("")}

            <button
                class="btn-print"
                onclick="
                    event.stopPropagation();
                    printReg('${idKelompok}');
                ">

                PRINT

            </button>

        </div>

    `;

}

async function printReg(idKelompok){

    const res =
        await fetch(

            API_URL +

            "?action=detail&id_kelompok=" +

            encodeURIComponent(
                idKelompok
            )

        );

    const members =
        await res.json();

    let text = "";

    // RESET
    text += "\x1B\x40";

    // CENTER
    text += "\x1B\x61\x01";

    // BOLD + BESAR
    text += "\x1B\x45\x01";
    text += "\x1D\x21\x11";

    text += "DATA CHECK-IN\n";

    text += "\x1D\x21\x00";

    text += "------------------------------\n\n";

    // ID
    text += "\x1B\x45\x01";
    text += "ID : " + idKelompok + "\n";
    text += "\x1B\x45\x00";

    text += "\n";

    // QR
    const qrData = idKelompok;

    text += "\x1D\x28\x6B\x03\x00\x31\x43\x08";
    text += "\x1D\x28\x6B\x03\x00\x31\x45\x31";

    const len = qrData.length + 3;
    const pL = len % 256;
    const pH = Math.floor(len / 256);

    text += "\x1D\x28\x6B";
    text += String.fromCharCode(pL);
    text += String.fromCharCode(pH);
    text += "\x31\x50\x30";
    text += qrData;

    text += "\x1D\x28\x6B\x03\x00\x31\x51\x30";

    text += "\n";

    // TOTAL TAMU
    text += "\x1B\x45\x01";
    text += "Total " + members.length + " Tamu\n";
    text += "\x1B\x45\x00";

    text += "\n";
    text += "------------------------------\n";

    // LIST
    text += "\x1B\x61\x00";

    members.forEach(m => {

        text +=
            "* " +
            m.nama +
            " - " +
            m.asal +
            "\n";

    });

    text += "\n";
    text += "------------------------------\n";

    // FOOTER
    text += "\x1B\x61\x01";

    text += "Terima Kasih Atas\n";
    text += "Kehadiran dan Do'a Restu\n";
    text += "Bapak / Ibu / Saudara / i\n";

    text += "\n\n";

    // PRINT RAWBT
    location.href =
        "rawbt:" +
        encodeURIComponent(text);

    // UPDATE STATUS PRINT
    setTimeout(async ()=>{

        await fetch(API_URL,{

            method:"POST",

            body:JSON.stringify({

                action:"printed",

                id_kelompok:idKelompok

            })

        });

        loadData();

    },2000);

}
