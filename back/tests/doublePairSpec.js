//TEST DE LA FONCTION QUI VERIFIE SI C'EST UNE DOUBLE PAIRE AVEC LES 5 CARTES

import { expect } from "chai";
import { buildDeck } from "../cards.js";
import { makeHand } from "../handMaker.js";

function getCard(deck, rank, suit) {
    const idx = deck.findIndex((c) => c.suit === suit && c.rank === rank)
    const card = deck.splice(idx, 1)[0]
    return card
}

describe('Double paire', () => {
    it('gestion d une double paire sur 5 cartes', () => {
        const deck = buildDeck();
        const cards = [];
        cards.push(getCard(deck, 10, 'diamond'));
        cards.push(getCard(deck, 9, 'diamond'));
        cards.push(getCard(deck, 10, 'club'));
        cards.push(getCard(deck, 2, 'diamond'));
        cards.push(getCard(deck, 2, 'spade'));

        expect(cards).to.be.a('Array');
        expect(cards.length).to.equal(5);

        const main = makeHand(cards);

        expect(main.type).to.equal('doublepair');
        expect(main.rank).to.equal(10);
        expect(main.kickers).to.be.a('Array');
        expect(main.kickers.length).to.be.equal(1);
        expect(main.kickers[0].rank).to.equal(9);

    })
})