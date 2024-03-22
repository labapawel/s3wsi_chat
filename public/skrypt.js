// alias $ do document.querySelector
const $ = (e)=>document.querySelector(e);
const socket = io('ws:///');
let userName = "";
while(userName=="" || userName==null)
    userName = prompt("Podaj swoje imie:")

socket.on('connect', ()=>{
    console.log("Zostałem połączony")
    socket.emit('witaj',userName);
})

socket.on('wiadomosc', (wiadomosc, nazwaKlienta)=>{
    let main = $("main");
    let mess = `<div><h3>${nazwaKlienta}</h3><p>${wiadomosc}</p></div>`;
    main.innerHTML += mess;
})

$('#chat').addEventListener('keyup', e=>{
    if(e.keyCode == 13)
    {
        socket.emit('wiadomosc',e.target.value);
        e.target.value = "";  
    }

})

    /**
 * Licznik odwiedzin
 * 
 * @returns void
 */
function akt_licznik(){
    // odczyt odwiedziń z serwera
    fetch('/licznik')
        .then(e=>e.json()) // przemień na json
        .then(dane=>{ // dane z licznika
            $("h3 > span").innerHTML = dane.licznik;
        });
}

akt_licznik(); // akt. licznik na stronie www
