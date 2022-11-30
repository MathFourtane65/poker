import { createServer } from "./server.js";

let cardParams = {

    width: 223,
    height: 312,

    opponentScale: 0.3,
    pocketScale : 0.5
}

class PokerTable extends Phaser.Scene {

    constructor() {
        super("PokerTable");
        // console.log(this.server);
        this.suits = { 'spade': 0, 'club': 1, 'diamond': 2, 'heart': 3 }
        this.deck = {
            'heart': [],
            'diamond': [],
            'club': [],
            'spike': []
        };
        let seats = []
        seats[1] = { x: 90, y: 300 }
        seats[2] = { x: 250, y: 250 }
        seats[3] = { x: 400, y: 200 }
        seats[4] = { x: 560, y: 200 }
        seats[5] = { x: 710, y: 250 }
        seats[6] = { x: 850, y: 300 }
        
        seats[7] = { x: 800, y: 450 }
        seats[8] = { x: 500, y: 550 }
        seats[9] = { x: 200, y: 450 }
        this.seats = seats
        // this.players = {}
        this.server = createServer(this)
    }
    preload() {

        


        // loading the sprite sheet with all cards
        this.load.spritesheet("cards", "./assets/cards.png", {
            frameWidth: cardParams.width,
            frameHeight: cardParams.height
        });

        this.load.image("fond", "./assets/fond.png");
        this.load.image("table", "./assets/tableV2.png")
        this.load.html("nameform", "./assets/nameform.html");

    }
    create() {

        this.add.image(500,250,"fond")
        this.add.image(500,250,"table")

        this.server.emit("listSeats")


        // var text = this.add.text(0, 5, 'Please enter your name', { color: 'black', fontSize: '30px '});
        let element = this.add.dom(500, 250).createFromCache("nameform");

        element.addListener('click');

            element.on('click', function (event) {

                if (event.target.name === 'playButton') {
                    var inputText = this.getChildByName('nameField');
                    localStorage.setItem('userName', inputText.value);
                    console.log(localStorage.getItem('userName'));

                    //  Have they entered anything?
                    if (inputText.value !== '') {
                        //  Turn off the click events
                        this.removeListener('click');

                        //  Hide the login element
                        this.setVisible(false);

                        //  Populate the text with whatever they typed in
                        text.setText('Welcome ' + inputText.value);
                    }
                    else {
                        //  Flash the prompt
                        this.scene.tweens.add({
                            targets: text,
                            alpha: 0.2,
                            duration: 250,
                            ease: 'Power3',
                            yoyo: true
                        });
                    }
                }

            });

            this.tweens.add({
                targets: element,
                y: 300,
                duration: 3000,
                ease: 'Power3'
            });


    }

    createCard(card,scale) {

        let suitIdx = 4,rankIdx = 0 //blue cover idx in spritesheet
        if(card){
        suitIdx = this.suits[card.suit]
        rankIdx = card.rank - 1
        }
        
        let idx = (suitIdx * 13) + rankIdx
        let sprite = this.add.sprite(- cardParams.width * scale, this.game.config.height / 2, "cards", idx);

        sprite.setScale(scale);
        return sprite;

    }

    dealCard(card, x, y, cb) {
        this.tweens.add({
            targets: card,
            x: x,
            y: y,
            duration: 500,
            ease: "Cubic.easeOut",
            callbackScope: this,
            onComplete: cb
        });
    }

    dealOpenCards(seat, cards,isPocketCards) {
        let scale = cardParams.opponentScale
        if(isPocketCards){
            scale = cardParams.pocketScale
        }
        let card1 = this.createCard(cards[0],cardParams.pocketScale)
        card1.x = 0
        card1.y = 0
        this.seats[seat].cardsSprites = []
        console.log(seat,this.seats[seat],this.seats[seat].cardsSprites);
        this.seats[seat].cardsSprites.push(card1)
        this.dealCard(card1, this.seats[seat].x, this.seats[seat].y, () => {
            console.log("deal seat",seat);
            let card2 = this.createCard(cards[1],cardParams.pocketScale)
            card2.x = 0
            card2.y = 0
            this.seats[seat].cardsSprites.push(card2)
            this.dealCard(card2, this.seats[seat].x + (cardParams.width*scale)*1.2, this.seats[seat].y)
        })
    }

    dealClosedCards(seat,isPocketCards) {
        let scale = cardParams.opponentScale
        if(isPocketCards){
            scale = cardParams.pocketScale
        }
        let card1 = this.createCard(null,scale)
        card1.x = 0
        card1.y = 0
        this.seats[seat].cardsSprites.push(card1)
        this.dealCard(card1, this.seats[seat].x, this.seats[seat].y, () => {
            console.log("deal cover...");
            let card2 = this.createCard(null,scale)
            card2.x = 0
            card2.y = 0
            this.seats[seat].cardsSprites.push(card2)
            this.dealCard(card2, this.seats[seat].x + (cardParams.width*scale), this.seats[seat].y, () => {
                console.log("play...");
            })
        })
    }

    foldCards(seat) {
        
        let card1 = this.seats[seat].cardsSprites[0]
        let card2 = this.seats[seat].cardsSprites[1]
        this.dealCard(card1, -100, -100,()=>{
            card1.destroy()
        })
        this.dealCard(card2, -100, -100,()=>{
            card2.destroy()
        })
        this.seats[seat].cardsSprites = null
    }

    addPlayingButtons() {
        const betButton = this.add.text(350, 680, 'Miser', { fontSize: '50px', backgroundColor: '#ddd', color: '#000' });
        betButton.setInteractive({ useHandCursor: true });
        betButton.on('pointerdown', () => {
            console.log('mise...');
            this.server.emit("bet", {seat:this.player.seat,amount:100});
        });
        const foldButton = this.add.text(550, 680, 'Passer', { fontSize: '50px', backgroundColor: '#ddd', color: '#000' });
        foldButton.setInteractive({ useHandCursor: true });
        foldButton.on('pointerdown', () => {
            console.log('passer...');
            this.server.emit("fold",this.player.seat);
        });
    }
}

export { PokerTable }
