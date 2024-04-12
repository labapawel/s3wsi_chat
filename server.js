const express = require('express'); // pobieramy klase express do serwera www
const socketio = require('socket.io'); // import biblioteki socketio
// const moment = require('moment');

var fs = require('fs');
var http = require('http');
var https = require('https');
var privateKey  = fs.readFileSync('key.key', 'utf8');
var certificate = fs.readFileSync('key.crt', 'utf8');

var credentials = {key: privateKey, cert: certificate};

const app = express(); // pobieram instancje serwera

let serwer = https.createServer(credentials, app);


// zmienna dla licznika odw.
let LicznikOdw = 0; 

// definiuje statyczny katalog na pliki, dostępny w sieci
app.use(express.static(__dirname+"/public")); 

// otwieramy port 80 dla serwera WWW
serwer.listen(443, ()=>{
    console.log("serwer start: https://localhost/");
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

// CID('idsoketu') z ClientDB.filter(e=>e.socketid == 'idsoketu')[0]
const CID = (socketid) => ClientDB.filter(e=>e.socketid == socketid)[0];
const KID = idKlienta => ClientDB.filter(e=>e.id == idKlienta)[0];
// function CID1(socketid){
//     return ClientDB.filter(e=>e.socketid == socketid)[0];
// }

io.on('connection', (klient)=>{
    console.log("Klient nawiązał połączenie", klient.id);

    // 
    klient.on('wiadomosc', (wiadomosc)=>{
        
        let client = CID(klient.id);
        console.log(client);
        if(client)
        {
            console.log(wiadomosc, client);
            let option = {
                time: new Date()
            }
            console.log(option);
            io.sockets.emit('wiadomosc', wiadomosc, client.Klient, option);
        }
    })

    klient.on('witaj', (klientNazwa, idKlienta)=>{
        console.log("Witaj", klientNazwa,idKlienta);
        if(!idKlienta) return;
        if(!klientNazwa) return;

        let client = KID(idKlienta);
     //   console.log(client);
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
            client.socketid=klient.id 
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
