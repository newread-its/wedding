/* =========================
   CONFIG
========================= */

const API_URL =
"https://script.google.com/macros/s/AKfycbyhbYegFWLHDstH4vxPfFDrlRPYyzkwSTKSTHsGbx2xhcZRaW0WzxCz75OQ3f2ZWy08/exec";

let scanner = null;
let cameraRunning = false;
let processing = false;

/* =========================
   ELEMENT
========================= */

const scanBtn =
document.getElementById(
    "scanBtn"
);

const cameraWrap =
document.getElementById(
    "cameraWrap"
);

const regInput =
document.getElementById(
    "regInput"
);

const manualBtn =
document.getElementById(
    "manualBtn"
);

const loadingOverlay =
document.getElementById(
    "loadingOverlay"
);

const popup =
document.getElementById(
    "popup"
);

const popupIcon =
document.getElementById(
    "popupIcon"
);

const popupTitle =
document.getElementById(
    "popupTitle"
);

const popupMessage =
document.getElementById(
    "popupMessage"
);

/* =========================
   LOADING
========================= */

function showLoading(){

    loadingOverlay.style.display =
        "flex";

}

function hideLoading(){

    loadingOverlay.style.display =
        "none";

}

/* =========================
   POPUP
========================= */

function showPopup(
    success,
    title,
    message
){

    popup.className =
        success
        ?
        "popup success"
        :
        "popup error";

    popupIcon.innerHTML =
        success
        ?
        "✓"
        :
        "✕";

    popupTitle.innerHTML =
        title;

    popupMessage.innerHTML =
        message;

    popup.style.display =
        "block";

    setTimeout(()=>{

        popup.style.display =
            "none";

    },2500);

}

/* =========================
   CAMERA
========================= */

scanBtn.onclick =
async ()=>{

    if(cameraRunning){
        return;
    }

    cameraWrap.style.display =
        "block";

    scanner =
        new Html5Qrcode(
            "reader"
        );

    try{

        await scanner.start(

            {
                facingMode:
                    "environment"
            },

            {
                fps:10,
                qrbox:220
            },

            onScanSuccess

        );

        cameraRunning =
            true;

    }
    catch(err){

        console.log(err);

        showPopup(

            false,

            "KAMERA",

            "Tidak dapat membuka kamera"

        );

    }

};

/* =========================
   STOP CAMERA
========================= */

async function stopCamera(){

    if(
        scanner &&
        cameraRunning
    ){

        try{

            await scanner.stop();

            await scanner.clear();

        }
        catch(e){}

        scanner = null;

        cameraRunning =
            false;

    }

    cameraWrap.style.display =
        "none";

}

/* =========================
   SCAN SUCCESS
========================= */

async function onScanSuccess(
    text
){

    if(processing){
        return;
    }

    processing = true;

    regInput.value =
        text.trim();

    await stopCamera();

    await processReg();

}

/* =========================
   MANUAL
========================= */

manualBtn.onclick =
()=>{

    processReg();

};

/* =========================
   PROCESS
========================= */

async function processReg(){

    const reg =
        regInput.value
        .trim();

    if(!reg){

        processing =
            false;

        showPopup(

            false,

            "ID REGISTRASI",

            "Silakan isi ID registrasi"

        );

        return;

    }

    showLoading();

    try{

        /* =====================
           CEK DATA
        ===================== */

        const checkRes =
            await fetch(

                API_URL +

                "?action=scan&id_kelompok=" +

                encodeURIComponent(
                    reg
                )

            );

        const checkData =
            await checkRes.json();

        if(
            !checkData.success
        ){

            hideLoading();

            processing =
                false;

            showPopup(

                false,

                "TIDAK DITEMUKAN",

                reg

            );

            regInput.value =
                "";

            return;

        }

        if(
            Number(
                checkData.souvenir
            ) === 1
        ){

            hideLoading();

            processing =
                false;

            showPopup(

                false,

                "SUDAH DIAMBIL",

                reg

            );

            regInput.value =
                "";

            return;

        }

        /* =====================
           UPDATE SOUVENIR
        ===================== */

        const saveRes =
            await fetch(
                API_URL,
                {
                    method:"POST",

                    body:
                    JSON.stringify({

                        action:
                            "souvenir",

                        id_kelompok:
                            reg

                    })

                }
            );

        const saveData =
            await saveRes.json();

        hideLoading();

        if(
            !saveData.success
        ){

            processing =
                false;

            showPopup(

                false,

                "SUDAH DIAMBIL",

                reg

            );

            regInput.value =
                "";

            return;

        }

        showPopup(

            true,

            "BERHASIL",

            `
            ${reg}
            <br><br>
            Total Tamu
            <br>
            <b>
            ${saveData.total}
            Orang
            </b>
            `

        );

        regInput.value =
            "";

    }
    catch(err){

        console.log(err);

        hideLoading();

        showPopup(

            false,

            "ERROR",

            "Gagal terhubung ke server"

        );

    }

    processing =
        false;

}

/* =========================
   ENTER KEY
========================= */

regInput.addEventListener(

    "keypress",

    e=>{

        if(
            e.key === "Enter"
        ){

            processReg();

        }

    }

);
