import { expect } from "chai";
import { buildDeck } from "../cards.js";
import { makeHand } from "../handMaker.js";

function getCard(deck, rank, suit) {
    const idx = deck.findIndex((c) => c.suit === suit && c.rank === rank)
    const card = deck.splice(idx, 1)[0]
    return card
}

describe('Carré', () => {
    it('gestion d un carré sur 5 cartes', () => {
        const deck = buildDeck();
        const cards = [];
        cards.push(getCard(deck, 10, 'diamond'));
        cards.push(getCard(deck, 9, 'diamond'));
        cards.push(getCard(deck, 10, 'club'));
        cards.push(getCard(deck, 10, 'heart'));
        cards.push(getCard(deck, 10, 'spade'));

        expect(cards).to.be.a('Array');
        expect(cards.length).to.equal(5);

        const main = makeHand(cards);

        expect(main.type).to.equal('carre');
        expect(main.rank).to.equal(10);
        expect(main.kickers).to.be.a('Array');
        expect(main.kickers.length).to.be.equal(0);
    })
})
