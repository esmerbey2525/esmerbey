// =====================================================
// FURINA PRO ANALYZER v1.0
// Bluetooth + Session Manager
// =====================================================

"use strict";

// ---------- GLOBAL DEĞİŞKENLER ----------
let bluetoothDevice = null;
let gattServer = null;
let primaryService = null;
let dataCharacteristic = null;

let connected = false;
let scanning = false;

let sessionData = [];
let gridCells = [];
let currentIndex = 0;

const GRID_SIZE = 25;

// ---------- SAYFA YÜKLENDİ ----------
window.addEventListener("load", () => {

    createGrid();

    loadSessions();

    console.log("Furina Pro Analyzer Hazır.");

});

// ---------- GRID OLUŞTUR ----------
function createGrid(){

    const grid = document.getElementById("scanGrid");

    if(!grid) return;

    grid.innerHTML = "";

    gridCells = [];

    for(let i=0;i<GRID_SIZE;i++){

        const cell=document.createElement("div");

        cell.className="cell";

        cell.style.background="#333";

        grid.appendChild(cell);

        gridCells.push(cell);

    }

}

// ---------- DURUM GÜNCELLE ----------
function setStatus(text,color){

    const badge=document.getElementById("statusBadge");

    if(!badge) return;

    badge.innerHTML=text;

    badge.style.background=color;

}

// ---------- LOG ----------
function log(msg){

    console.log(msg);

}

// ---------- SESSION ----------
function startSession(){

    scanning=true;

    sessionData=[];

    currentIndex=0;

    gridCells.forEach(c=>c.style.background="#333");

    log("Yeni seans başladı.");

}

function stopSession(){

    scanning=false;

    saveSession();

    log("Seans tamamlandı.");

}

// ---------- KAYDET ----------
function saveSession(){

    const data={

        date:new Date().toLocaleString(),

        values:sessionData

    };

    let list=JSON.parse(localStorage.getItem("furina_sessions")||"[]");

    list.push(data);

    localStorage.setItem("furina_sessions",JSON.stringify(list));

}

// ---------- OTURUMLARI YÜKLE ----------
function loadSessions(){

    let list=JSON.parse(localStorage.getItem("furina_sessions")||"[]");

    console.log(list);

}// ===============================
// BLUETOOTH BAĞLANTISI
// ===============================

const btnConnect = document.getElementById("btnConnect");
const btnDisconnect = document.getElementById("btnDisconnect");

btnConnect?.addEventListener("click", connectDevice);
btnDisconnect?.addEventListener("click", disconnectDevice);

async function connectDevice() {

    try {

        setStatus("Cihaz aranıyor...", "#ff9800");

        bluetoothDevice = await navigator.bluetooth.requestDevice({
            acceptAllDevices: true,
            optionalServices: [
                "0000ffe0-0000-1000-8000-00805f9b34fb",
                "6e400001-b5a3-f393-e0a9-e50e24dcca9e"
            ]
        });

        bluetoothDevice.addEventListener(
            "gattserverdisconnected",
            disconnectDevice
        );

        gattServer = await bluetoothDevice.gatt.connect();

        connected = true;

        setStatus(
            "Bağlandı : " + (bluetoothDevice.name || "Bilinmeyen Cihaz"),
            "#2e7d32"
        );

        alert("Bluetooth bağlantısı başarılı.");

    } catch (e) {

        console.error(e);

        setStatus("Bağlantı başarısız", "#c62828");

        alert(e.message);

    }

}

function disconnectDevice() {

    if (bluetoothDevice?.gatt?.connected) {

        bluetoothDevice.gatt.disconnect();

    }

    connected = false;

    setStatus("Bağlı Değil", "#c62828");

}
