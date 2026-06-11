const API_URL =
"https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

let currentReg = "";

const scanner =
new Html5QrcodeScanner(
    "reader",
    {
        fps:10,
        qrbox:250
    }
);

scanner.render(onScan);

function showPopup(
    text,
    success=true
){

    const p =
        document
        .getElementById(
            "popup"
        );

    p.innerText =
        text;

    p.className =
        success
        ?
        "success"
        :
        "error";

    p.style.display =
        "block";

    setTimeout(()=>{

        p.style.display =
            "none";

    },2500);

}

async function onScan(
    text
){

    document
    .getElementById(
        "regInput"
    )
    .value = text;

    loadData(text);

}

document
.getElementById(
    "btnCari"
)
.onclick = ()=>{

    loadData(

        document
        .getElementById(
            "regInput"
        )
        .value
        .trim()

    );

};

async function loadData(id){

    currentReg = id;

    const res =
        await fetch(

            API_URL +

            "?action=scan&id_kelompok=" +

            encodeURIComponent(id)

        );

    const data =
        await res.json();

    if(
        data.members.length
        == 0
    ){

        showPopup(
            "ID Tidak Ditemukan",
            false
        );

        return;

    }

    let html = `

        <div class="result-card">

            <h3>
                ${id}
            </h3>

            <br>

    `;

    data.members.forEach(m=>{

        html += `

            <div class="member">

                <span>
                    ${m.nama}
                </span>

                <span>
                    ${m.asal}
                </span>

            </div>

        `;

    });

    html += `

        <button
            class="submit-btn"
            onclick="submitSouvenir()">

            SERAHKAN SOUVENIR

        </button>

        </div>

    `;

    document
    .getElementById(
        "result"
    )
    .innerHTML = html;

}

async function submitSouvenir(){

    const res =
        await fetch(
            API_URL,
            {
                method:"POST",

                body:JSON.stringify({

                    action:"souvenir",

                    id_kelompok:
                        currentReg

                })

            }
        );

    const data =
        await res.json();

    if(!data.success){

        showPopup(

            "Souvenir Sudah Diambil",

            false

        );

        return;

    }

    showPopup(
        "Berhasil Diserahkan"
    );

    document
    .getElementById(
        "result"
    )
    .innerHTML = "";

    document
    .getElementById(
        "regInput"
    )
    .value = "";

}
