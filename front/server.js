function creerServeur(scene) {
  let serveur = io("localhost:3000");

  serveur.on("listeSieges", (siegesLibres) => {
    console.log("sieges libres", siegesLibres);
    let nom = serveur.id;
    if (localStorage.getItem("nom")) {
      nom = localStorage.getItem("nom");
    }
    localStorage.setItem("nom", nom);
    console.log("nom :", nom);
    let siege = siegesLibres[Math.floor(Math.random() * siegesLibres.length)];
    let jetons = 1000;
    scene.joueur = { siege, nom, jetons };
    console.log("joueur", scene.joueur);
    serveur.emit("rejoindre", scene.joueur);
  });

  serveur.on("rejoindre", (joueur) => {
    console.log("nouveau joueur", joueur);
    joueur.cartesSprites = [];
    scene.sieges[joueur.siege - 1] = joueur;
  });

  serveur.on("distribuer", (donnees) => {
    if (donnees.siege === scene.joueur.siege) {
      let cartes = donnees.cartes;
      scene.distribuerCartesOuvertes(donnees.siege, donnees.cartes);
      scene.ajouterBoutonsDeJeu();
    } else {
      scene.distribuerCartesFermees(donnees.siege);
    }
  });

  //serveur.on("mise")

  //serveur.on("secoucher")

  return serveur;
}

export {creerServeur}
