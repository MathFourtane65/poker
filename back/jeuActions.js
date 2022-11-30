import { buildDeck } from "./cards.js";

function createGame(players) {
    return { started: false, players, deck: buildDeck() }
}
const listSeats = (game) => {
    // console.log(game.players, game.players[0]);
    let seats = game.players.filter((p) => p == undefined).map((p, i) => i + 1)
    console.log(seats);
    return seats
}

const addNewPlayer = (game, newPlayer) => {
    // console.log(newPlayer);
    console.log("player", newPlayer.name, "ready");
    game.players[newPlayer.seat - 1] = newPlayer
    // freeSeats.splice(freeSeats.indexOf(newPlayer.seat),1)
    console.log("players", game.players);
}


function removePlayer(game, seat) {
    game.players[seat - 1].cards = null;
}

function updateStack(game, seat, amount) {
    game.players[seat - 1].stack -= amount;
    game.players[seat - 1].bet += amount;
}

function startGame(game) {
    console.log("start...");
    game.started = true;
}

function dealAllPocketCards(game) {
    for (let player of game.players) {
        if (player != undefined) {
            console.log("deal", player.name);
            dealPocketCards(game, player);
            player.socket.emit("deal", { seat: player.seat, cards:player.cards });
            broadcast(game, "deal", { seat: player.seat }, player.seat);
        }
    }
}


function dealPocketCards(game, player) {
    let cards = [game.deck.pop(), game.deck.pop()];
    game.players[player.seat - 1].cards = cards;
    return cards;
}


function broadcast(game, event, data, exceptSeat) {
    for (let player of game.players) {
        if (player != undefined && player.seat != exceptSeat) {
            // console.log("broadcast:", player);
            game.players[player.seat - 1].socket.emit(event, data);
        }
    }
}


export { createGame, listSeats, addNewPlayer, removePlayer, updateStack, startGame, broadcast,dealAllPocketCards }
