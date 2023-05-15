import Card from "../interfaces/card.interface";
import Combination from "../interfaces/combination.interface";
export default class Deck {
    private deckCards;
    static readonly instance: Deck;
    getRoundDeck(numPlayers: number): Card[];
    static getIsStraight(cards: Card[], n1: number, n2?: number, count?: number): Combination | false;
    static getIsStraightLoop(cards: Card[], n2: number, count?: number, countForward?: number, backward?: boolean): Combination | false;
    static isStraight(cards: Card[]): Combination | false;
    static isRepeat(cards: Card[], nRepeat: number, herarchy: number): Combination | false;
    static isFourOfAKind(cards: Card[]): Combination | false;
    static isFullHouse(cards: Card[]): Combination | false;
    static isFlush(cards: Card[]): Combination | false;
    static isThreeOfAKind(cards: Card[]): Combination | false;
    static isTwoPair(cards: Card[]): Combination | false;
    static isPair(cards: Card[]): Combination | false;
    static getCombinationValue(cards: Card[]): Combination;
}
