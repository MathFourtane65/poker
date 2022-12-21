import { addNewPlayer, broadcast, createGame, dealAllPocketCards, listSeats, removePlayer, startGame, updateStack } from "./jeuActions.js";

let game = createGame([...Array(9)])

let onConnect = (socket) => {
  console.log("connexion de ", socket.id);

  socket.on("listSeats", () => {
    let seats = listSeats(game)
    //console.log(seats);
    socket.emit("listSeats", seats)
  })
  socket.on("join", (newPlayer) => {
    // console.log(newPlayer);
    //console.log("player", newPlayer.name, "ready");
    newPlayer.socket = socket
    addNewPlayer(game,newPlayer)

    // console.log("game", game, game.players.length);
    const readyPlayers = game.players.filter((p)=>p!=undefined)
    if (readyPlayers.length > 1 && !game.started) {
      //console.log("deal...");
      startGame(game)
      dealAllPocketCards(game)
    }
  })

  socket.on("bet", ({ seat, amount }) => {
    console.log("player", seat, "bet", amount);
    updateStack(game,seat)
    broadcast(game,"bet", { seat, amount, stack: game.players[seat - 1].stack, bet: game.players[seat - 1].bet })
  })
  socket.on("fold", (seat) => {
    console.log("player", seat, "fold");
    removePlayer(game,seat)
    broadcast(game,"fold", seat)
  })
}

export { onConnect }
