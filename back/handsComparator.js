
const forces = {}
forces['high'] = 1
forces['pair'] = 2
forces['double'] = 3
forces['three'] = 4
forces['straight'] = 5
forces['flush'] = 6
forces['fullhouse'] = 7
forces['quad'] = 8
forces['straightflush'] = 9

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
   
    //TODO
    return 1
}

function findBestHand(hands) {
    hands.sort(compareHands)
    return hands[0]
    // let winners = hands.filter((h) => forces[h.type] === forces[hands[0].type])
    // let max = Math.max(...winners.map((w) => w.rank))
    // winners = winners.filter((w) => w.rank === max)
    // if (!!winners[0].kickers) {
    //     const length = winners[0].kickers.length
    //     for (let i = 0; i < length; i++) {
    //         winners.sort((w1, w2) => w1.kickers[i].rank - w2.kickers[i].rank)
    //         winners = winners.filter((h) => h.kickers[i].rank === winners[0].kickers[i].rank)
    //     }
    // }
    return winners
}

export { findBestHand,compareHands }