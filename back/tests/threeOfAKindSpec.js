import { expect } from "chai";
import { buildDeck } from "../cards.js";
import { makeHand } from "../handMaker.js";

function getCard(deck, rank, suit) {
    const idx = deck.findIndex((c) => c.suit === suit && c.rank === rank)
    const card = deck.splice(idx, 1)[0]
    return card
}


describe('Brelan', () => {
    it('gestion d un brelan sur 5 cartes (main + flop)', () => {
        const deck = buildDeck();
        const cards = [];
        cards.push(getCard(deck, 10, 'diamond'));
        cards.push(getCard(deck, 9, 'diamond'));
        cards.push(getCard(deck, 13, 'club'));
        cards.push(getCard(deck, 13, 'diamond'));
        cards.push(getCard(deck, 13, 'spade'));

        expect(cards).to.be.a('Array');
        expect(cards.length).to.equal(5);

        const main = makeHand(cards);

        expect(main.type).to.equal('threeofakind');
        expect(main.rank).to.equal(13);
        expect(main.kickers).to.be.a('Array');
        expect(main.kickers.length).to.be.equal(2);
        expect(main.kickers[0].rank).to.equal(10);
    })
});


