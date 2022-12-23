const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

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
        seats[9] = { x: 1220, y: 280, cardsSprites: [] } //orange

        this.seats = seats;


        let commonCards = [];
        commonCards[0] = { x: 450, y: 280, cardsSprites: [] };
        commonCards[1] = { x: 530, y: 280, cardsSprites: [] };
        commonCards[2] = { x: 610, y: 280, cardsSprites: [] };

        commonCards[3] = { x: 690, y: 280, cardsSprites: [] };
        commonCards[4] = { x: 690, y: 280, cardsSprites: [] };


        this.commonCards = commonCards;

        this.server = createServer(this)
    }

    cacherBoutons() {
        this.boutonMiser.x = -100;
        this.boutonMiser.y = -100;
        this.boutonSeCoucher.x = -100;
        this.boutonSeCoucher.y = -100;
        this.print0.setVisible(false);
        this.bbb.setVisible(false);
    }

    creerBoutons() {
        //console.log(this);
        this.boutonMiser = this.add.text(-100, -100, 'Miser', { fontSize: '32px', backgroundColor: '#87cefa', color: '#000' });
        this.boutonMiser.setInteractive({ useHandCursor: true });
        this.boutonMiser.on('pointerdown', () => {
            console.log('mise...');
            this.server.emit("bet", { seat: this.player.seat, amount: Number(this.print0.text), username: this.player.username });
            this.updateDialogBubbleDealer(this.player.seat, Number(this.print0.text), this.player.username)
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
        this.load.scenePlugin({
            key: 'rexuiplugin',
            url: 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
            sceneKey: 'rexUI'
        });

        this.load.spritesheet("cards", "./assets/cards.png", {
            frameWidth: cardParams.width,
            frameHeight: cardParams.height
        });

        this.load.image("table", "./assets/table-pokerV3.png");
        this.load.html("nameform", "./assets/nameform.html");
        this.load.image("jeton", "./assets/groupeJetonsV2.png");
        this.load.image("bulleConsigne", "./assets/bulleConsigne.png");
        this.load.image("bullePseudo", "./assets/bullePseudo.png");
        this.load.image("jetonMise", "./assets/jetonViolet.png");

    }

    create() {

        this.add.image(750, 375, "table");
        //this.add.image(425,64,"bulleConsigne");
        this.add.image(485, 64, "bullePseudo");

        console.log("Table lancée !");
        this.creerBoutons();

        var minSlider = 0;
        var maxSlider = 1000;
        var rangeSlider = maxSlider - minSlider;
        var gapSlider = 10;

        let aaa = this.print0 = this.add.text(1345, 40, '', { color: 'black', fontSize: '30px ' });
        this.bbb = this.rexUI.add.slider({
            x: 1335,
            y: 90,
            width: 200,
            height: 20,
            orientation: 'x',


            track: this.rexUI.add.roundRectangle(0, 0, 0, 0, 6, COLOR_DARK),
            thumb: this.rexUI.add.roundRectangle(0, 0, 0, 0, 10, COLOR_LIGHT),


            valuechangeCallback: function (value) {
                value = (value * rangeSlider) + minSlider
                aaa.text = value;
            },
            gap: gapSlider / rangeSlider,
            space: {
                top: 4,
                bottom: 4
            },
            input: 'drag', // 'drag'|'click'
        })
            .layout()

        this.print0.text = aaa.text;



        this.print0.setVisible(false);
        this.bbb.setVisible(false);



        let element = this.add.dom(750, 375).createFromCache("nameform");
        element.addListener('click');
        element.server = this.server;
        element.bulleConsigne = this.add.image(425, 64, "bulleConsigne");
        //this.bulleConsigne = element.bulleConsigne;
        this.text = this.add.text(200, 50, 'Entrer votre pseudo SVP', { color: 'black', fontSize: '30px ' });
        var text = this.text;
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
                    text.setPosition(310, 50);
                    text.setText("Bonjour " + inputText.value);

                    console.log(element.bulleConsigne);
                    element.bulleConsigne.setVisible(false);
                    console.log(element.server);
                    element.server.emit("listSeats");
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



        // this.server.emit("listSeats");
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

        //affichage des jetons aux sieges 
        if (this.seats[seat].x === this.seats[1].x && this.seats[seat].y === this.seats[1].y) {
            this.add.image(310, 280, "jeton");
        }
        else if (this.seats[seat].x === this.seats[2].x && this.seats[seat].y === this.seats[2].y) {
            this.add.image(310, 440, "jeton");
        }
        else if (this.seats[seat].x === this.seats[3].x && this.seats[seat].y === this.seats[3].y) {
            this.add.image(380, 545, "jeton");
        }
        else if (this.seats[seat].x === this.seats[4].x && this.seats[seat].y === this.seats[4].y) {
            this.add.image(570, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[5].x && this.seats[seat].y === this.seats[5].y) {
            this.add.image(740, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[6].x && this.seats[seat].y === this.seats[6].y) {
            this.add.image(900, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[7].x && this.seats[seat].y === this.seats[7].y) {
            this.add.image(1080, 550, "jeton");
        }
        else if (this.seats[seat].x === this.seats[8].x && this.seats[seat].y === this.seats[8].y) {
            this.add.image(1150, 440, "jeton");
        }
        else if (this.seats[seat].x === this.seats[9].x && this.seats[seat].y === this.seats[9].y) {
            this.add.image(1150, 280, "jeton");
        }





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

        //affichage des jetons aux sieges 
        if (this.seats[seat].x === this.seats[1].x && this.seats[seat].y === this.seats[1].y) {
            this.add.image(310, 280, "jeton");
        }
        else if (this.seats[seat].x === this.seats[2].x && this.seats[seat].y === this.seats[2].y) {
            this.add.image(310, 440, "jeton");
        }
        else if (this.seats[seat].x === this.seats[3].x && this.seats[seat].y === this.seats[3].y) {
            this.add.image(380, 545, "jeton");
        }
        else if (this.seats[seat].x === this.seats[4].x && this.seats[seat].y === this.seats[4].y) {
            this.add.image(570, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[5].x && this.seats[seat].y === this.seats[5].y) {
            this.add.image(740, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[6].x && this.seats[seat].y === this.seats[6].y) {
            this.add.image(900, 590, "jeton");
        }
        else if (this.seats[seat].x === this.seats[7].x && this.seats[seat].y === this.seats[7].y) {
            this.add.image(1080, 550, "jeton");
        }
        else if (this.seats[seat].x === this.seats[8].x && this.seats[seat].y === this.seats[8].y) {
            this.add.image(1150, 440, "jeton");
        }
        else if (this.seats[seat].x === this.seats[9].x && this.seats[seat].y === this.seats[9].y) {
            this.add.image(1150, 280, "jeton");
        }

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
        this.boutonSeCoucher.y = 150;
        this.print0.setVisible(true);
        this.bbb.setVisible(true);
    }

    //updateDialogBubbleDealer(username,siege, montant) {
    //    this.text.setText(username + siege + " mise " + montant);
    //}

    miseJetonTable() {
        for (var i = 0; i < 1; i++) {
            var x = Phaser.Math.Between(690, 770);
            var y = Phaser.Math.Between(165, 215);

            this.add.image(x, y, 'jetonMise');
        }
    }

    displayPlayerName(username, seat) {
        this.add.text(this.seats[seat].x, this.seats[seat].y+80, username, { color: 'red', fontSize: '30px ' });
    }

    updateDialogBubbleDealer(siege, montant, username) {
        this.text.setText( username + siege + " mise " + montant);
    }

}

export { PokerTable }
