// import { addButtons as addPlayingButtons } from "./actions.js";

function createServer(scene) {

    let server = io("localhost:3000");

    server.on("reset", (data) => {
        scene.remove();
        scene.cacherBoutonRestart();
    })

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
        console.log("Liste sieges",freeSeats);
        let name = server.id;
        localStorage.setItem('userId',name)
        if(localStorage.getItem('userId')){
            name = localStorage.getItem('userId')
        }
        let userName = localStorage.getItem('userName');       
        console.log("userId:",name);
        let seat = freeSeats[Math.floor(Math.random() * freeSeats.length)];
        let stack = 1000;
        scene.player = {seat,name,stack,userName}
        console.log("player",scene.player);
        server.emit("join", scene.player)


    })
    server.on("join", (player) => {
        console.log("new player:", player);
        player.cardsSprites = []
        scene.seats[player.seat-1] = player
        // scene.players[data.name] = data
        // scene.displayPlayerName(player.userName, player.seat);
    })
    server.on("bet", ({ seat, amount }) => {
        console.log(seat, "mise", amount);
        scene.updateDialogBubbleDealer(seat, amount);
        scene.miseJetonTable();
    })
    server.on("secoucher", (seat) => {
        console.log(seat, "se couche");
    });
    server.on("active", (data) => {
        scene.afficherBoutons();
    })
    server.on("unactive", (data) => {
        scene.cacherBoutons()
    });
    server.on("flop", (data) => {
        scene.dealFlop(data);
        scene.updateDialogBubbleDealerFlop();
    });
    server.on("deal", (data) => {
        scene.displayPlayerName(data.username, data.seat);
        if (data.seat === scene.player.seat) {
            let cards = data.cards
            scene.dealOpenCards(data.seat,data.cards)
        }
        else{
            scene.dealClosedCards(data.seat)
        }

    })
    server.on("winners", (data) => {
        console.log("winners", data);
        if (data.map((w)=>w.seat).includes(scene.player.seat)) {
            console.log("gagn??!");
        }
        else {
            console.log("perdu!");
        }
    })
    server.on("game-over", (data) => {
        server.emit("show", scene.player.seat);
        scene.cacherBoutons();
        scene.updateDialogBubbleDealerGameOver();
    })
    server.on("show", (data) => {
        scene.showCards(data.seat,data.cards);
    })

    server.on("cardTurn", (data => {
        //console.log("TURN CARD !!!");
        //console.log(data);
        scene.updateDialogBuubleDealerTurnCard()
        scene.dealCardTurn(data);
    }))

    server.on("cardRiver", (data) => {
        //console.log("RIVER CARD !!!!");
        //console.log(data);
        scene.updateDialogBuubleDealerRiverCard();
        scene.dealCardRiver(data);
    })

    return server
}

export { createServer }
