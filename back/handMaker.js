function makeHand(origCards) {
  let cards = [];
  const cardsByRank = [...origCards];
  cardsByRank.sort(byRank);
  const cardsBySuit = [...origCards];
  cardsBySuit.sort(bySuit);
  let counts = countPairs(origCards);
  const hand = initHand();

  if (isPair(counts)) {
    hand.type = "pair";
    let tmp = Object.entries(counts).find(([val, count]) => count === 2)[0];
    tmp = parseInt(tmp);
    hand.rank = tmp;
    let others = cardsByRank.filter((c) => c.rank !== hand.rank);
    hand.kickers = others;
  }

  if (isDoublePair(counts)) {
    hand.type = "doublepair";
    let tmp = Object.entries(counts).filter(([val, count]) => count === 2);
    let firstPairRank = parseInt(tmp[0][0]);
    let secondPairRank = parseInt(tmp[1][0]);
    hand.rank = Math.max(firstPairRank, secondPairRank);
    let others = cardsByRank.filter(
      (c) => c.rank !== firstPairRank && c.rank !== secondPairRank
    );
    hand.kickers = others;
  }

  if (isThreeOfAKind(counts)) {
    hand.type = "threeofakind";
    let tmp = Object.entries(counts).find(([val, count]) => count === 3)[0];
    hand.rank = parseInt(tmp);
    let others = cardsByRank.filter((c) => c.rank !== hand.rank);
    hand.kickers = others;
  }

  return hand;
}

function isHighCard(cards) {
  return Math.max(...cards);
}

function isQuad(counts) {
  const sames = Object.values(counts);
  return sames.includes(4);
}

function isFullHouse(counts) {
  const sames = Object.values(counts);
  return sames.includes(3) && sames.includes(2);
}

function isThreeOfAKind(counts) {
  const sames = Object.values(counts);
  sames.sort((r1, r2) => r2 - r1);
  //console.log("sames0",sames[0]);
  return sames[0] === 3;
}

function isDoublePair(counts) {
  const sames = Object.values(counts);
  sames.sort((r1, r2) => r2 - r1);
  //console.log("sames0",sames[0]);
  return sames[0] === 2 && sames[1] === 2;
}

function isPair(counts) {
  const sames = Object.values(counts);
  sames.sort((r1, r2) => r2 - r1);
  return sames[0] === 2;
}

function countPairs(hand) {
  let values = getUniqueRanks(hand);
  let counts = {};
  for (let val of values) {
    counts[val] = hand.filter((c) => c.rank === val).length;
  }
  return counts;
}

function getUniqueRanks(array) {
  const values = [];
  for (const val of array) {
    if (!values.some((v) => v.rank === val.rank)) {
      values.push(val.rank);
    }
  }
  return values;
}

function bySuit(c1, c2) {
  if (c1.suit < c2.suit) {
    return -1;
  }
  if (c1.suit > c2.suit) {
    return 1;
  }
  return 0;
}
function byRank(c1, c2) {
  if (c1.rank === 1 && c2.rank === 1) {
    return 0;
  }
  if (c1.rank === 1 && c2.rank > 1) {
    return 1;
  }
  if (c2.rank === 1 && c1.rank > 1) {
    return -1;
  }
  return c2.rank - c1.rank;
}

function initHand() {
  const hand = {};
  hand.type = "singleCard";
  hand.rank = null;
  hand.kickers = [];
  hand.cards = [];
  return hand;
}

export { makeHand };
