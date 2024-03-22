const express = require('express'); // pobieramy klase express do serwera www
const socketio = require('socket.io');

const app = express(); // pobieram instancje serwera

// zmienna dla licznika odw.
let LicznikOdw = 0; 

// definiuje statyczny katalog na pliki, dostępny w sieci
app.use(express.static(__dirname+"/public")); 

// otwieramy port 80 dla serwera WWW
const serwer = app.listen(80, ()=>{
    console.log("serwer start: http://localhost/");
});
// dodanie soketów do komunikacji online
const io = socketio(serwer, {
    // zgoda na komunikacje z innych adresów internetoweych cors(GET, POST)
    cors: {
        origin: "*", // adresy dozwolone
        methods: ["GET", "POST"], // metody komunikacji
        credentials: true
      },
})

let ClientDB = [];

const CID = socketid => ClientDB.filter(e=>e.socketid == socketid)[0];
const KID = idKlienta => ClientDB.filter(e=>e.id == idKlienta)[0];
// function CID1(socketid){
//     return ClientDB.filter(e=>e.socketid == socketid)[0];
// }

io.on('connection', klient=>{
    console.log("Klient nawiązał połączenie", klient.id);

    // 
    klient.on('wiadomosc', (wiadomosc)=>{
        
        let client = CID(klient.id);
        if(client)
        {
            console.log(wiadomosc, client);
            io.sockets.emit('wiadomosc', wiadomosc, client.Klient);
        }
    })

    klient.on('witaj', (klientNazwa, idKlienta)=>{
        console.log("Witaj", klientNazwa);
        if(!idKlienta) return;
        if(!klientNazwa) return;

        let client = KID(idKlienta);
        if(!client)
        {
            ClientDB.push({
                Klient: klientNazwa,
                id: idKlienta,
                socketid: klient.id
            });

        } else
        {
            client.Klient = klientNazwa;
        }
        io.sockets.emit('goscie', ClientDB);
        
        


    })

})

/**
 * funkcja licznika odwiedzin dostępna pod adresem http://host/licznik
 * 
 * @param {Request} - dane które przychodzą
 * @param {Response} - dane wyjściowe
 */
app.get("/licznik",(req, resp)=>{
    // odpowiedź serwera z json, w nim liczba odwiedzin od startu serwera
    resp.send({licznik:++LicznikOdw}); 
});
