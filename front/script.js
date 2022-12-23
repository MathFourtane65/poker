import { PokerTable } from "./sceneTable.js";


window.onload = function () {   
    let config = {
        type: Phaser.AUTO,
        parent: 'phaser-example',
        width: 1500,
        height: 850,
        backgroundColor: 0xFFE8CE,
        dom: {
            createContainer: true
        },
        audio: {
            disableWebAudio: true
        },
        // Sets game scaling
        // scale: {
        //     // Fit to window
        //     mode: Phaser.Scale.FIT,
        //     // Center vertically and horizontally
        //     autoCenter: Phaser.Scale.CENTER_BOTH
        // },
        scene : PokerTable
    }
    let game = new Phaser.Game(config);
    
    window.focus();
}
