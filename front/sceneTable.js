import { createServer } from "./server.js";

let cardParams = {

    width: 223,
    height: 312,

    opponentScale: 0.33,
    pocketScale: 0.33
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
        seats[1] = { x: 150, y: 280, cardsSprites: [] } //rouge
        seats[2] = { x: 150, y: 440, cardsSprites: [] } //vert

        seats[3] = { x: 240, y: 630, cardsSprites: [] } //noir

        seats[4] = { x: 530, y: 680, cardsSprites: [] } //jaune
        seats[5] = { x: 690, y: 680, cardsSprites: [] } //violet
        seats[6] = { x: 850, y: 680, cardsSprites: [] } //rose

        seats[7] = { x: 1120, y: 630, cardsSprites: [] } //bleu foncé

        seats[8] = { x: 1220, y: 440, cardsSprites: [] } //bleu clair
        seats[9] = { x: 1220, y: 200, cardsSprites: [] } //orange

        this.seats = seats;


        let commonCards = [];
        commonCards[0] = { x: 450, y: 280, cardsSprites: [] };
        commonCards[1] = { x: 530, y: 280, cardsSprites: [] };
        commonCards[2] = { x: 610, y: 280, cardsSprites: [] };
        this.commonCards = commonCards;

        this.server = createServer(this)
    }

    cacherBoutons() {
        this.boutonMiser.x = -100;
        this.boutonMiser.y = -100;
        this.boutonSeCoucher.x = -100;
        this.boutonSeCoucher.y = -100;
    }

    creerBoutons() {
        console.log(this);
        this.boutonMiser = this.add.text(-100, -100, 'Miser', { fontSize: '32px', backgroundColor: '#87cefa', color: '#000' });
        this.boutonMiser.setInteractive({ useHandCursor: true });
        this.boutonMiser.on('pointerdown', () => {
            console.log('mise...');
            this.server.emit("bet", { seat: this.player.seat, amount: 100 });
            this.cacherBoutons();
        });
        this.boutonSeCoucher = this.add.text(-100, -100, 'Se coucher', { fontSize: '32px', backgroundColor: '#87cefa', color: '#000' });
        this.boutonSeCoucher.setInteractive({ useHandCursor: true });
        this.boutonSeCoucher.on('pointerdown', () => {
            console.log('se coucher...');
            this.server.emit("secoucher", this.player.seat);
        });

    }

    preload() {
        this.load.spritesheet("cards", "./assets/cards.png", {
            frameWidth: cardParams.width,
            frameHeight: cardParams.height
        });

        this.load.image("table", "./assets/table-pokerV3.png");
        this.load.html("nameform", "./assets/nameform.html");
    }

    create() {

        this.add.image(750, 375, "table")
        console.log("Table lancée !");
        this.creerBoutons();


        var text = this.add.text(0, 5, 'Entrer votre pseudo SVP', { color: 'black', fontSize: '30px ' });
        let element = this.add.dom(750, 375).createFromCache("nameform");
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
                    text.setText(inputText.value);
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
                };
            };
        });
        this.tweens.add({
            targets: element,
            y: 300,
            duration: 3000,
            ease: 'Power3'
        });

        this.server.emit("listSeats");
    }

    createCard(card, scale) {
        let suitIdx = 4, rankIdx = 0 //blue cover idx in spritesheet
        if (card) {
            suitIdx = this.suits[card.suit]
            rankIdx = card.rank - 1
        }

        let idx = (suitIdx * 13) + rankIdx
        let sprite = this.add.sprite(- cardParams.width * scale, this.game.config.height / 2, "cards", idx);

        sprite.x = 500;
        sprite.y = 260;
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

    showCards(seat, cards) {
        let card1 = this.createCard(cards[0], cardParams.opponentScale)
        let card2 = this.createCard(cards[1], cardParams.opponentScale)
        let oldCards = this.seats[seat].cardsSprites
        card1.x = oldCards[0].x
        card1.y = oldCards[0].y
        oldCards[0].destroy()
        oldCards[0] = card1
        card2.x = oldCards[1].x
        card2.y = oldCards[1].y
        oldCards[1].destroy()
        oldCards[1] = card2
    }

    dealOpenCards(seat, cards, isPocketCards) {
        let scale = cardParams.opponentScale
        if (isPocketCards) {
            scale = cardParams.pocketScale
        }
        let card1 = this.createCard(cards[0], cardParams.pocketScale)
        // card1.x = 90
        // card1.y = 860
        // this.seats[seat].cardsSprites = []
        console.log(seat, this.seats[seat], this.seats[seat].cardsSprites);
        this.seats[seat].cardsSprites.push(card1)
        this.dealCard(card1, this.seats[seat].x, this.seats[seat].y, () => {
            console.log("deal seat", seat);
            let card2 = this.createCard(cards[1], cardParams.pocketScale)
            // card2.x = 860
            // card2.y = 90
            this.seats[seat].cardsSprites.push(card2)
            this.dealCard(card2, this.seats[seat].x + (cardParams.width * scale) * 1.2, this.seats[seat].y)
        })
    }

    dealClosedCards(seat, isPocketCards) {
        let scale = cardParams.opponentScale
        if (isPocketCards) {
            scale = cardParams.pocketScale
        }
        let card1 = this.createCard(null, scale)
        // card1.x = 860
        // card1.y = 90
        this.seats[seat].cardsSprites.push(card1)
        this.dealCard(card1, this.seats[seat].x, this.seats[seat].y, () => {
            console.log("deal cover...");
            let card2 = this.createCard(null, scale)
            // card2.x = 860
            // card2.y = 90
            this.seats[seat].cardsSprites.push(card2)
            this.dealCard(card2, this.seats[seat].x + (cardParams.width * scale), this.seats[seat].y, () => {
                console.log("play...");
            })
        })
    }

    dealFlop(flop) {
        let scale = cardParams.opponentScale
        let card1 = this.createCard(flop[0], scale)
        this.commonCards[0].cardsSprite = card1
        this.dealCard(card1, this.commonCards[0].x, this.commonCards[0].y, () => {

            let card2 = this.createCard(flop[1], scale)
            this.commonCards[1].cardsSprite = card2
            this.dealCard(card2, this.commonCards[1].x, this.commonCards[1].y, () => {
                let card3 = this.createCard(flop[2], scale)
                this.commonCards[2].cardsSprite = card3
                this.dealCard(card3, this.commonCards[2].x, this.commonCards[2].y)

            })
        })
    }

    foldCards(seat) {

        let card1 = this.seats[seat].cardsSprites[0]
        let card2 = this.seats[seat].cardsSprites[1]
        this.dealCard(card1, 100, -100, () => {
            card1.destroy()
        })
        this.dealCard(card2, -100, -100, () => {
            card2.destroy()
        })
        this.seats[seat].cardsSprites = []
    }

    afficherBoutons() {
        this.boutonMiser.x = 1235
        this.boutonMiser.y = 42;
        this.boutonSeCoucher.x = 1235;
        this.boutonSeCoucher.y = 100;
    }

}

export { PokerTable }
