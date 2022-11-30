// import { addButtons as addPlayingButtons } from "./actions.js";

function createServer(scene) {

    let server = io("localhost:3000");

    // console.log("create");

    // server.on("connect", () => {
        // let seat = null
        // if(localStorage.getItem("seat"){
        //     seat = parseInt(localStorage.getItem("seat"))
        // }
        // if(!seat){
            // server.emit("listSeats")
        // }
    // })
    
    server.on("listSeats", (freeSeats) => {
        console.log("list seats",freeSeats);
        let name = server.id;
        localStorage.setItem('userId',name)
        if(localStorage.getItem('userId')){
            name = localStorage.getItem('userId')
        }
        //let userName = localStorage.getItem('userName');       
        console.log("userId:",name);
        let seat = freeSeats[Math.floor(Math.random() * freeSeats.length)]
        let stack = 1000
        scene.player = {seat,name,stack};
        console.log("player",scene.player);
        server.emit("join", scene.player)
    })
    server.on("join", (player) => {
        console.log("new player:", player);
        player.cardsSprites = []
        scene.seats[player.seat-1] = player
        // scene.players[data.name] = data
    })
    server.on("bet", ({ seat, amount }) => {
        console.log(seat, "bet", amount);
    })
    server.on("fold", (seat) => {
        console.log(seat, "fold");
    })
    server.on("deal", (data) => {
        if (data.seat === scene.player.seat) {
            let cards = data.cards
            scene.dealOpenCards(data.seat,data.cards)
            scene.addPlayingButtons()
        }
        else{
            scene.dealClosedCards(data.seat)
        }
    })
    return server
}

export { createServer }
