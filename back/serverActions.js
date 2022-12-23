import { broadcast, createGame, dealAllPocketCards, getNextPlayer, listFreeSeats, removePlayer, roundIsOver, startGame, updateStack, dealCardTurn, dealCardRiver, seCoucher } from "./jeuActions.js";
import { makeHand } from "./handMaker.js";
import { findBestHand, compareHands } from "./handsComparator.js";

let game;
let seats = [...Array(9)];


let onConnect = (socket) => {
  console.log("connexion de ", socket.id);


  socket.on("listSeats", () => {
    let freeSeats = listFreeSeats(seats)
    console.log(freeSeats);
    socket.emit("listSeats", freeSeats)
  });
  socket.on("join", (newPlayer) => {
    // console.log(newPlayer);
    console.log("player", newPlayer.name, "ready");
    newPlayer.socket = socket
    newPlayer.bet = 0;
    socket.player = newPlayer
    seats[newPlayer.seat - 1] = newPlayer
    //addNewPlayer(game,newPlayer)

    // console.log("game", game, game.players.length);
    const readyPlayers = seats.filter((s) => s != undefined)
    console.log("JOUEURS PRETS : ", readyPlayers.length);
    // demarrage partie si il y a au moins 2 joueurs
    if (readyPlayers.length > 1) {
      if (!game || !game.started) {
        console.log("deal...");
        game = createGame(readyPlayers)
        startGame(game)
        dealAllPocketCards(game)
        game.currentPlayer.socket.emit("active")
      }
    }
  })

  socket.on("bet", ({ seat, amount }) => {
    console.log(game.currentPlayer.name);
    if (seat != game.currentPlayer.seat) {
      console.log("not your turn...");
      return
    }
    console.log("player", seat, "bet", amount);

    updateStack(game.currentPlayer, amount)
    console.log(game.currentPlayer.stack);
    socket.emit("unactive")
    broadcast(game, "bet", { seat, amount, stack: game.currentPlayer.stack, bet: game.currentPlayer.bet })
    // game.currentPlayer.bet += amount
    // game.round1 = 0;
    console.log(("GAME.ROUND ="+game.round));
    
    //GAME.ROUND=0
    if (roundIsOver(game) && game.round===0) {
      game.round+=1;
      game.pot=0;
      //console.log("find winner");
      console.log("ROUND 1 FLOP FINI !");
      dealCardTurn(game);
      broadcast(game, "cardTurn", game.cardTurn);
      game.currentPlayer.socket.emit("active");
      return;
      // game.round1+=1;
      // game.pot = 0;
    }
    //GAME.ROUND=1

    if (roundIsOver(game) && game.round===1) {
      game.pot=0;
      game.round+=1;
      dealCardRiver(game);
      broadcast(game, "cardRiver", game.cardRiver);      
      console.log("ROUND 2 TURN FINI !");
      game.currentPlayer.socket.emit("active");
      return;
    }
    //GAME.ROUND=2

    if(roundIsOver(game) && game.round===2){
      broadcast(game, "unactive");
      broadcast(game,"game-over");
      game.currentPlayer.socket.emit("unactive");
      //game.players.socket.emit("unactive");
      return
    }
    // if (roundIsOver(game) && game.cardTurn!=0) {
    //   //console.log("find winner");
    //   dealCardRiver(game);
    //   broadcast(game, "cardRiver", game.cardRiver);
    //   // game.round1+=1;
    //   // game.pot = 0;
    // }
    //broadcast(game,"game-over")
    // game.pot = 0
    // for (let player of game.players) {

    //   player.hand = makeHand([...player.cards, ...game.flop])
    //   console.log("hand", player.hand);
    //   game.pot += player.bet
    //   player.bet = 0
    // }
    // let bestHand = findBestHand(game.players.map((p) => p.hand))
    // console.log("best",bestHand);
    // let winners = game.players.filter((p)=>compareHands(p.hand,bestHand)===0)
    // console.log("winners", winners);
    // for (let winner of winners) {
    //   winner.stack += game.pot/winners.length
    // }
    // broadcast(game, "winners", winners.map((w) => { return { hand:w.hand,seat: w.seat, prize: game.pot / winners.length, stack: w.stack } }))
    // return
    // if (game.round1 !=0 && game.pot ===0) {
    //   dealCardRiver(game);
    //   broadcast(game, "cardRiver", game.cardRiver);
    // }
    game.currentPlayer = getNextPlayer(game)
    console.log(game.currentPlayer.name);
    game.currentPlayer.socket.emit("active")

  })
  socket.on("show", (seat) => {
    console.log("show!", seat);
    broadcast(game, "show", { seat, cards: socket.player.cards }, seat)
  })
  socket.on("secoucher", (seat) => {
    console.log("player", seat, "se couche");
    removePlayer(game, seat);
    broadcast(game, "secoucher", seat);
    broadcast(game,"game-over");
  })

}
export { onConnect }
