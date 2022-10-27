import { Server } from "socket.io";

const io = new Server({});
const players = [];
let id_player;

io.on("connexion", (socket) => {
    players.push(socket);
    console.log(socket);
    id_player = socket;


    var couleurs = ['diamond', 'heart', 'club', 'spike'];

    var numeroMain = Math.floor(Math.random() * 12) + 1;
    var rangCouleur = Math.floor(Math.random() * couleurs.length);
    var couleurMain = couleurs[rangCouleur];

    socket.emit("distribution", [{ suit: couleurMain, rank: numeroMain }]);

    console.log("Cartes de", id_player, " : ", numeroMain, couleurMain);
})



io.listen(3000);
console.log("LIstening on 3000");