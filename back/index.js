import { Server } from "socket.io";
import { createServer } from "http";
import { onConnect } from "./serverActions.js";
import { createGame } from "./jeuActions.js";


const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*"
    }
});

io.on("connection", onConnect);
io.listen(3000);