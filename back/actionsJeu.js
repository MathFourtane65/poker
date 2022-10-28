import { constructionDeck } from "./cardsDeck.js";

function creerJeu(joueurs){
    return { demarree: false, joueurs, cardsDeck: constructionDeck() }
}

const listeSieges = (jeu) => {
    let sieges = jeu.joueurs.filter((j) => j == undefined).map((j, i) => i+1)
    console.log(sieges);
    return sieges
}

const ajoutNouveauJoueur = (jeu, nouveauJoueur) => {
    console.log("joueur", nouveauJoueur.nom, "pret");
    jeu.joueurs[nouveauJoueur.siege - 1] = nouveauJoueur
    console.log("joueurs", jeu.joueurs);
}

function supprimerJoueur(jeu, siege) {
    jeu.joueurs[siege - 1].cartes = null;
}

function majJetons(jeu, siege, montant){
    jeu.joueurs[siege - 1].jetons -= montant;
    jeu.joueurs[siege - 1].mise += montant;
}

function demarrerJeu(jeu) {
    console.log("Démarrée ...");
    jeu.demarree = true;
}

function distribuerToutesLesCartesEnMain(jeu) {
    for (let joueur of jeu.joueurs) {
        if(joueur != undefined) {
            console.log("distribuer", joueur.nom);
            distribuerLesCartesEnMain(jeu, joueur);
            joueur.socket.emit("distribuer",{ siege: joueur.siege, cartes: joueur.cartes });
            diffuser(jeu, "distribuer", {siege: joueur.siege}, joueur.siege);
        }
    }
}


function distribuerLesCartesEnMain(jeu, joueur) {
    let cartes = [jeu.cardsDeck.pop(), jeu.cardsDeck.pop()];
    jeu.joueurs[joueur.siege - 1].cartes = cartes;
    return cartes;
}

function diffuser(jeu, evt, donnee, saufSiege) {
    for (let joueur of jeu.joueurs) {
        if (joueur!= undefined && joueur.siege != saufSiege) {
            jeu.joueurs[joueur.siege -1 ].socket.emit(evt, donnee);
        }
    }
}

export {creerJeu, listeSieges, ajoutNouveauJoueur, supprimerJoueur, majJetons, demarrerJeu, distribuerToutesLesCartesEnMain, diffuser}