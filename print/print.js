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

                <div
                    id="detail-${item.id_kelompok}">
                </div>

            </div>

        `;

    });

}


async function loadDetail(
    idKelompok
){

    const div =
        document.getElementById(
            "detail-" +
            idKelompok
        );

    if(
        div.innerHTML.trim()
    ){

        div.innerHTML = "";

        return;

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

    div.innerHTML = `

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
                    printReg(
                        '${idKelompok}'
                    );
                ">

                PRINT

            </button>

        </div>

    `;

}


