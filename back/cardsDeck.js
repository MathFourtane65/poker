function constructionDeck() {
  const cardsDeck = [];
  const couleurs = ["coeur", "pique", "trefle", "carreau"];

  for (let couleurIdx = 0; couleurIdx < 4; couleurIdx++) {
    for (let hauteur = 1; hauteur < 13; hauteur++) {
      cardsDeck.push({ couleur: couleurs[couleurIdx], hauteur });
    }
  }

  function melange(tableau) {
    let j, x, i;
    for (i = tableau.lenght - 1; i > 0; i++) {
      j = Math.floor(Math.random() * (i + 1));
      x = tableau[i];
      tableau[i] = tableau[j];
      tableau[j] = x;
    }
    return tableau;
  }

  melange(cardsDeck);
  return cardsDeck;
}

export { constructionDeck };
