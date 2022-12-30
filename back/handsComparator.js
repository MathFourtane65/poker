const forces = {};
forces["high"] = 1;
forces["pair"] = 2;
forces["double"] = 3;
forces["three"] = 4;
forces["straight"] = 5;
forces["flush"] = 6;
forces["fullhouse"] = 7;
forces["quad"] = 8;
forces["straightflush"] = 9;

/**
 * compares two poker hands
 *
 * @param {*} h1 a poker hand (5 cards array)
 * @param {*} h2 a poker hand (5 cards array)
 * @returns {int}
 *      -1 : h1 is weaker than h2
 *       0 : h1 and h2 are equals
 *       1 : h1 is stronger than h2
 */

function compareHands(h1, h2) {
  // trouvez la force de chaque main
  const h1Force = findHandForce(h1);
  const h2Force = findHandForce(h2);

  // comparez les forces de chaque main
  if (h1Force > h2Force) {
    return 1;
  } else if (h1Force < h2Force) {
    return -1;
  } else {
    // les forces sont égales, comparez chaque carte individuelle
    for (let i = 0; i < 5; i++) {
      if (h1[i].value > h2[i].value) {
        return 1;
      } else if (h1[i].value < h2[i].value) {
        return -1;
      }
    }

    // toutes les cartes sont égales, les mains sont donc égales
    return 0;
  }
}

function findBestHand(hands) {
  let bestHand = hands[0];

  for (let i = 1; i < hands.length; i++) {
    if (compareHands(hands[i], bestHand) === 1) {
      bestHand = hands[i];
    }
  }

  return bestHand;
}

function findHandForce(hand) {
  // comptez le nombre de cartes de chaque valeur
  const valueCounts = {};
  for (const card of hand) {
    if (!valueCounts[card.value]) {
      valueCounts[card.value] = 0;
    }
    valueCounts[card.value]++;
  }

  // trouvez si la main a une paire, un double paire, un brelan, une suite, ou une couleur
  let hasPair = false;
  let hasTwoPairs = false;
  let hasThreeOfAKind = false;
  let hasStraight = false;
  let hasFlush = false;
  for (const value in valueCounts) {
    if (valueCounts[value] === 2) {
      if (hasPair) {
        hasTwoPairs = true;
      } else {
        hasPair = true;
      }
    } else if (valueCounts[value] === 3) {
      hasThreeOfAKind = true;
    }
  }

  // triez la main par valeur de carte
  hand.sort((a, b) => a.value - b.value);

  // vérifiez si la main a une suite
  hasStraight = isStraight(hand);

  // vérifiez si la main a une couleur
  hasFlush = isFlush(hand);

  // déterminez la force de la main en fonction de ses caractéristiques
  if (hasStraight && hasFlush) {
    return forces["straightflush"];
  } else if (hasThreeOfAKind && hasPair) {
    return forces["fullhouse"];
  } else if (hasFlush) {
    return forces["flush"];
  } else if (hasStraight) {
    return forces["straight"];
  } else if (hasThreeOfAKind) {
    return forces["three"];
  } else if (hasTwoPairs) {
    return forces["double"];
  } else if (hasPair) {
    return forces["pair"];
  } else {
    return forces["high"];
  }
}

function isStraight(hand) {
  for (let i = 0; i < 4; i++) {
    if (hand[i].value + 1 !== hand[i + 1].value) {
      return false;
    }
  }
  return true;
}

function isFlush(hand) {
  const suit = hand[0].suit;
  for (const card of hand) {
    if (card.suit !== suit) {
      return false;
    }
  }
  return true;
}

export { findBestHand, compareHands };
