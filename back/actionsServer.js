import {creerJeu, listeSieges, ajoutNouveauJoueur, supprimerJoueur, majJetons, demarrerJeu, distribuerToutesLesCartesEnMain, diffuser} from "./actionsJeu.js";

let jeu = creerJeu([...Array(9)]);

let connexion = (socket) => {
    console.log("Connexion de ", socket.id);

    socket.on("listeSieges :", () => {
        let sieges = listeSieges(jeu);
        console.log(sieges);
        socket.emit("listeSieges", sieges)
    })

    socket.on("rejoindre", (nouveauJoueur) => {
        console.log("joueur", nouveauJoueur.nom, "pret");
        nouveauJoueur.socket = socket
        ajoutNouveauJoueur(jeu, nouveauJoueur);

        const joueursPrets = jeu.joueurs.filter((j) => j!=undefined)
        if(joueursPrets.length > 1 && jeu.demarree) {
            console.log("distribution ...");
            demarrerJeu(jeu);
            distribuerToutesLesCartesEnMain(jeu);
        }
    })



    //socket.on("mise")
    

    //socket.on("secoucher")
}

export { connexion }