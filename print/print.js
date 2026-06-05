const API_URL =
"https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

let allData = [];

let currentTab = 0;

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
        allData.filter(x => {

            if(currentTab == 0){

                return x.printed == 0;

            }

            return x.printed == 1;

        });

    filtered.forEach(item => {

        const div =
            document.createElement(
                "div"
            );

        div.className =
            "card";

        div.innerHTML = `

            <div class="header">

                <strong>
                    ${item.id_kelompok}
                </strong>

                <br>

                Total
                ${item.total}
                Tamu

            </div>

            <div
                id="detail-${item.id_kelompok}">
            </div>

        `;

        div.onclick = () =>
            loadDetail(
                item.id_kelompok
            );

        wrap.appendChild(div);

    });

}


