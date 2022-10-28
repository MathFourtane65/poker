import { Server } from "socket.io";
import { createServer } from "http";
import { connexion } from "./actionsServer.js";
import { creerJeu } from "./actionsJeu.js";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connexion", connexion)
io.listen(3000);
console.log("Listening on port 3000");