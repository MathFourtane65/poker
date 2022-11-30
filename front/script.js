import { PokerTable } from "./sceneTable.js";

window.onload = function () {   
    let config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 1000,
        height: 500,
        //backgroundColor: 0x4488aa,
        dom: {
            createContainer: true
        },
        // Sets game scaling
        scene : PokerTable
    }
    let game = new Phaser.Game(config);
    
    window.focus();
}
