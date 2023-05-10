import { describe, it, expect, } from "vitest";
import Deck from "../src/ws/models/deck";

describe("Deck", () => {
    it("with 2 players it shoud be 9 cards", () => {
        const deckGenerator = new Deck();
        const deck = deckGenerator.getRoundDeck(2);
        expect(deck.length).toBe(9);
    });
    it("getCombinationValue with 2 Aces shoud return herarchy 8", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 4, suit: "heart" },
            { value: 2, suit: "diamond" },
            { value: 14, suit: "heart" },
            { value: 14, suit: "spade" },
            { value: 11, suit: "diamond" },
        ]);
        expect(combinationValue.herarchy).toBe(8);
    });
    it("getCombinationValue with 2 Aces and 2 Kings shoud return herarchy 7", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 4, suit: "heart" },
            { value: 3, suit: "diamond" },
            { value: 14, suit: "heart" },
            { value: 14, suit: "spade" },
            { value: 13, suit: "diamond" },
            { value: 13, suit: "spade" },
        ]);
        expect(combinationValue.herarchy).toBe(7);
    });
    it("getCombinationValue with 3 Aces shoud return herarchy 6", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "spade" },
            { value: 4, suit: "heart" },
            { value: 2, suit: "diamond" },
            { value: 14, suit: "heart" },
            { value: 14, suit: "spade" },
            { value: 14, suit: "diamond" },
        ]);
        expect(combinationValue.herarchy).toBe(6);
    });
    it("getCombinationValue with staight with 2 shoud return herarchy 5", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "spade" },
            { value: 4, suit: "heart" },
            { value: 2, suit: "diamond" },
            { value: 5, suit: "heart" },
            { value: 6, suit: "spade" },
            { value: 7, suit: "diamond" },
        ]);
        expect(combinationValue.herarchy).toBe(5);
    });
    it("getCombinationValue with 5 cards with same suit shoud return herarchy 4", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 4, suit: "diamond" },
            { value: 2, suit: "diamond" },
            { value: 5, suit: "heart" },
            { value: 6, suit: "heart" },
            { value: 14, suit: "heart" },
        ]);
        expect(combinationValue.herarchy).toBe(4);
    });
    it("getCombinationValue with 3 Aces and 2 Kings shoud return herarchy 3", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 4, suit: "heart" },
            { value: 14, suit: "diamond" },
            { value: 14, suit: "heart" },
            { value: 14, suit: "spade" },
            { value: 13, suit: "diamond" },
            { value: 13, suit: "spade" },
        ]);
        expect(combinationValue.herarchy).toBe(3);
    });
    it("getCombinationValue with 4 of kind shoud return herarchy 2", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 2, suit: "diamond" },
            { value: 3, suit: "spade" },
            { value: 4, suit: "heart" },
            { value: 14, suit: "diamond" },
            { value: 14, suit: "heart" },
            { value: 14, suit: "club" },
            { value: 14, suit: "spade" },
        ]);
        expect(combinationValue.herarchy).toBe(2);
    });
    it("getCombinationValue with flush and straight and hight card is not Ace shoud return herarchy 1", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 10, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 4, suit: "heart" },
            { value: 2, suit: "diamond" },
            { value: 5, suit: "heart" },
            { value: 6, suit: "heart" },
            { value: 7, suit: "heart" },
        ]);
        expect(combinationValue.herarchy).toBe(1);
    });
    it("getCombinationValue with flush and straight and hight card is Ace shoud return herarchy 0", () => {
        const combinationValue = Deck.getCombinationValue([
            { value: 5, suit: "heart" },
            { value: 3, suit: "heart" },
            { value: 10, suit: "heart" },
            { value: 11, suit: "heart" },
            { value: 12, suit: "heart" },
            { value: 13, suit: "heart" },
            { value: 14, suit: "heart" },
        ]);
        expect(combinationValue.herarchy).toBe(0);
    });
});