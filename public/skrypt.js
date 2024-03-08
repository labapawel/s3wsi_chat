// alias $ do document.querySelector
const $ = (e)=>document.querySelector(e);


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