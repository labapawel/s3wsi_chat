// alias $ do document.querySelector
const $ = (e)=>document.querySelector(e);
const socket = io('ws:///');

let idKlienta = localStorage.getItem('idKlienta');
if(!idKlienta){
    idKlienta = (new Date()).getTime()+'_'+Math.floor(Math.random()*999999999999999999);
    localStorage.setItem('idKlienta', idKlienta);
}


let userName = "";
while(userName=="" || userName==null)
    userName = prompt("Podaj swoje imie:")

socket.on('connect', ()=>{
    console.log("Zostałem połączony")
    socket.emit('witaj',userName, idKlienta);
})

socket.on('goscie', listaGosci=>{
       let nav  = $('nav');
       nav.innerHTML = '';
       for(let klient of listaGosci)
       {
            // console.log(klient);
            let linia = document.createElement('div');
            linia.addEventListener('click', e=>{
                klikniecieKlienta(e.target,klient.id)
            });
            linia.innerText = klient.Klient;
            nav.append(linia);
       }     
});

function klikniecieKlienta(th, id){
    document.querySelectorAll('nav>.sel')
        .forEach(e=>e.classList.remove('sel'));
    th.classList.add('sel');
}

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
