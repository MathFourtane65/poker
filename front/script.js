import { PokerTable } from "./tableScene.js";

window.onload = function () {
    let config = {
        width: 1400,
        height: 700,
        scale: {
            //mode: Phaser.Scale.FIT,
            // autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene : PokerTable
    }
    let jeu = new Phaser.Game(config);

    window.focus();
}