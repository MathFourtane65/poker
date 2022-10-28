import { creerServeur } from "./server.js";

let cartesParams = {
  width: 223,
  height: 312,

  adversaireEchelle: 0.3,
  mainEchelle: 0.5,
};

class PokerTable extends Phaser.Scene {
  constructor() {
    super("PokerTable");
    this.couleurs = { coeur: 0, pique: 1, trefle: 2, carreau: 3 };
    this.cardsDeck = {
      coeur: [],
      pique: [],
      trefle: [],
      carreau: [],
    };
    let sieges = [];
    sieges[1] = { x: 90, y: 300 };
    sieges[2] = { x: 250, y: 250 };
    sieges[3] = { x: 400, y: 200 };
    sieges[4] = { x: 560, y: 200 };
    sieges[5] = { x: 710, y: 250 };
    sieges[6] = { x: 850, y: 300 };
    sieges[7] = { x: 800, y: 450 };
    sieges[8] = { x: 500, y: 550 };
    sieges[9] = { x: 200, y: 450 };
    this.sieges = sieges;
    this.serveur = creerServeur(this);
  }

  preload() {
    // loading the sprite sheet with all cards
    this.load.spritesheet("cartes", "./assets/cards.png", {
      frameWidth: cartesParams.width,
      frameHeight: cartesParams.height,
    });

    this.load.image("fond", "./assets/fond.png");
    this.load.image("table", "./assets/tableV2.png");
  }

  create() {
    this.serveur.emit("listeSieges");
    this.add.image(700, 350, "fond");
    this.add.image(700, 350, "table");
  }

  creerCarte(carte, echelle) {
    let couleurIdx = 4,
      hauteurIdx = 0;
    if (carte) {
      couleurIdx = this.couleurs[carte.couleur];
      hauteurIdx = carte.hauteur - 1;
    }
    let idx = couleurIdx * 13 + hauteurIdx;
    let sprite = this.add.sprite(
      -cartesParams.width * echelle,
      this.jeu.config.height / 2,
      "cards",
      idx
    );

    sprite.setScale(echelle);
    return sprite;
  }

  distribuerCarte(carte, x, y, cb) {
    this.tweens.add({
      targets: carte,
      x: x,
      y: y,
      duration: 500,
      ease: "Cubic.easeOut",
      callbackScope: this,
      onComplete: cb,
    });
  }

  distribuerCartesOuvertes(siege, cartes, isCartesMain){
    let echelle = echelle.adversaireEchelle
    if(isCartesMain){
        echelle = echelle.mainEchelle
    }
    let carte1 = this.creerCarte(cartes[0], cartesParams.mainEchelle)
    carte1.x = 0
    carte1.y = 0
    this.sieges[siege].cartesSprites = []
    console.log(siege, this.sieges[siege], this.sieges[siege].cartesSprites);
    this.sieges[siege].cartesSprites.push(carte1)
    this.distribuerCarte(carte1, this.sieges[siege].x , this.sieges[siege].y, () => {
        console.log("Distribuer siege", siege);
        let carte2 = this.creerCarte(cartes[1], cartesParams.mainEchelle)
        carte2.x=0
        carte2.y=0
        this.sieges[siege].cartesSprites.push(carte2)
        this.distribuerCarte(carte2, this.sieges[siege].x + (cartesParams.width*echelle)*1.2, this.sieges[siege].y)
    })
  }


  //distribuerCartesFermees()

  //coucherCartes()

  //ajoutBoutonsDeJeu()
}

export { PokerTable };
