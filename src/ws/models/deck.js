"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
var deckCards_1 = require("../utils/deckCards");
var Deck = /** @class */ (function () {
    function Deck() {
        this.deckCards = deckCards_1["default"];
    }
    Deck.prototype.getRoundDeck = function (numPlayers) {
        var deck = new Set();
        var deckSize = (numPlayers * 2) + 5;
        while (deck.size != deckSize) {
            deck.add(this.deckCards[Math.floor(Math.random() * 52)]);
        }
        return __spreadArray([], deck, true);
    };
    Deck.getIsStraight = function (cards, n1, n2, count) {
        if (n2 === void 0) { n2 = n1 + 1; }
        if (count === void 0) { count = 1; }
        if (count == 5) {
            return {
                combination: cards.slice(n1, n1 + 5).reverse(),
                highCardValues: [cards[n1 + 4].value],
                herarchy: 5
            };
        }
        if (cards[n1].value == cards[n2].value - count) {
            return Deck.getIsStraight(cards, n1, n2 + 1, count + 1);
        }
        return false;
    };
    Deck.getIsStraightLoop = function (cards, n2, count, countForward, backward) {
        var _a, _b;
        if (count === void 0) { count = 1; }
        if (countForward === void 0) { countForward = 1; }
        if (backward === void 0) { backward = true; }
        if (count == 5) {
            return {
                combination: __spreadArray(__spreadArray([], cards.slice(-1 * (5 - countForward)), true), cards.slice(0, countForward), true),
                highCardValues: [(_a = cards.at(-1 * (5 - countForward))) === null || _a === void 0 ? void 0 : _a.value],
                herarchy: 5
            };
        }
        console.log(cards);
        if (backward && cards[0].value == ((_b = cards.at(n2)) === null || _b === void 0 ? void 0 : _b.value) + (13 - count)) {
            return Deck.getIsStraightLoop(cards, n2 - 1, count + 1, countForward, backward);
        }
        if (!backward && cards[0].value == cards[n2].value + countForward) {
            return Deck.getIsStraightLoop(cards, n2 + 1, count + 1, countForward + 1, backward);
        }
        if (backward) {
            return Deck.getIsStraightLoop(cards, 1, count, countForward, false);
        }
        return false;
    };
    Deck.isStraight = function (cards) {
        var _a;
        var _b;
        var uniqueValues = new Set();
        cards.sort(function (cardA, cardB) { return cardB.value - cardA.value; });
        var cardsUnique = cards.filter(function (card) {
            if (!uniqueValues.has(card.value)) {
                uniqueValues.add(card.value);
                return true;
            }
            return false;
        });
        if (cardsUnique.length < 5) {
            return false;
        }
        var _loop_1 = function (i) {
            var _c;
            var isStraightLineal = Deck.getIsStraight(__spreadArray([], cardsUnique, true).reverse(), i);
            if (isStraightLineal) {
                var maxNotInCombination_1 = cards.filter(function (c) { return !isStraightLineal.combination.includes(c); }).slice(-2).map(function (c) { return c.value; });
                (_c = isStraightLineal.highCardValues).push.apply(_c, maxNotInCombination_1);
                return { value: isStraightLineal };
            }
        };
        for (var i = (cardsUnique.length - 5); i != -1; i--) {
            var state_1 = _loop_1(i);
            if (typeof state_1 === "object")
                return state_1.value;
        }
        if (cardsUnique[0].value != 14 || ((_b = cardsUnique.at(-1)) === null || _b === void 0 ? void 0 : _b.value) != 2)
            return false;
        var isStraightLoop = Deck.getIsStraightLoop(cardsUnique, -1);
        if (!isStraightLoop)
            return false;
        var maxNotInCombination = cards.filter(function (c) { return !isStraightLoop.combination.includes(c); }).map(function (c) { return c.value; }).slice(0, 2);
        (_a = isStraightLoop.highCardValues).push.apply(_a, maxNotInCombination);
        return isStraightLoop;
    };
    Deck.isRepeat = function (cards, nRepeat, herarchy) {
        var uniqueValues = new Set();
        cards.sort(function (cardA, cardB) { return cardB.value - cardA.value; });
        var cardsUnique = cards.filter(function (card) {
            if (!uniqueValues.has(card.value)) {
                uniqueValues.add(card.value);
                return true;
            }
            return false;
        });
        var _loop_2 = function (card) {
            var repeat = cards.filter(function (c) { return c.value == card.value; }).slice(-nRepeat);
            if (repeat.length == nRepeat) {
                return { value: {
                        combination: repeat,
                        highCardValues: __spreadArray([card.value], cards.filter(function (c) { return !repeat.includes(c); }).map(function (c) { return c.value; }).slice(0, 3), true),
                        herarchy: herarchy
                    } };
            }
        };
        for (var _i = 0, cardsUnique_1 = cardsUnique; _i < cardsUnique_1.length; _i++) {
            var card = cardsUnique_1[_i];
            var state_2 = _loop_2(card);
            if (typeof state_2 === "object")
                return state_2.value;
        }
        return false;
    };
    Deck.isFourOfAKind = function (cards) {
        return Deck.isRepeat(cards, 4, 2);
    };
    Deck.isFullHouse = function (cards) {
        var threeOfAKindHigh = Deck.isThreeOfAKind(cards);
        if (threeOfAKindHigh) {
            var pairLow_1 = Deck.isPair(cards.filter(function (c) { return !threeOfAKindHigh.combination.includes(c); }));
            if (!pairLow_1)
                return false;
            return {
                combination: __spreadArray(__spreadArray([], threeOfAKindHigh.combination, true), pairLow_1.combination, true),
                highCardValues: __spreadArray([
                    threeOfAKindHigh.highCardValues[0],
                    pairLow_1.highCardValues[0]
                ], cards.filter(function (c) { return !threeOfAKindHigh.combination.includes(c) && !pairLow_1.combination.includes(c); }).map(function (c) { return c.value; }).slice(0, 2), true),
                herarchy: 3
            };
        }
        var pairHigh = Deck.isPair(cards);
        if (pairHigh) {
            var threeOfAKindLow_1 = Deck.isThreeOfAKind(cards.filter(function (c) { return !pairHigh.combination.includes(c); }));
            if (!threeOfAKindLow_1)
                return false;
            return {
                combination: __spreadArray(__spreadArray([], threeOfAKindLow_1.combination, true), pairHigh.combination, true),
                highCardValues: __spreadArray([
                    threeOfAKindLow_1.highCardValues[0],
                    pairHigh.highCardValues[0]
                ], cards.filter(function (c) { return !threeOfAKindLow_1.combination.includes(c) && !pairHigh.combination.includes(c); }).map(function (c) { return c.value; }).slice(0, 2), true),
                herarchy: 3
            };
        }
        return false;
    };
    Deck.isFlush = function (cards) {
        var uniqueSuits = new Set();
        var cardsUnique = cards
            .sort(function (cardA, cardB) { return cardB.value - cardA.value; })
            .filter(function (card) {
            if (!uniqueSuits.has(card.suit)) {
                uniqueSuits.add(card.suit);
                return true;
            }
            return false;
        });
        var _loop_3 = function (card) {
            var flush = cards.filter(function (c) { return c.suit == card.suit; }).slice(-5);
            if (flush.length === 5) {
                return { value: {
                        combination: flush,
                        highCardValues: __spreadArray(__spreadArray([], flush.map(function (c) { return c.value; }), true), cards.filter(function (c) { return !flush.includes(c); }).map(function (c) { return c.value; }).slice(0, 2), true),
                        herarchy: 4
                    } };
            }
        };
        for (var _i = 0, cardsUnique_2 = cardsUnique; _i < cardsUnique_2.length; _i++) {
            var card = cardsUnique_2[_i];
            var state_3 = _loop_3(card);
            if (typeof state_3 === "object")
                return state_3.value;
        }
        return false;
    };
    Deck.isThreeOfAKind = function (cards) {
        return Deck.isRepeat(cards, 3, 6);
    };
    Deck.isTwoPair = function (cards) {
        var pairHigh = Deck.isRepeat(cards, 2, 8);
        if (pairHigh) {
            var pairLow_2 = Deck.isRepeat(cards.filter(function (c) { return !pairHigh.combination.includes(c); }), 2, 8);
            if (!pairLow_2)
                return false;
            return {
                combination: __spreadArray(__spreadArray([], pairHigh.combination, true), pairLow_2.combination, true),
                highCardValues: __spreadArray([
                    pairHigh.highCardValues[0],
                    pairLow_2.highCardValues[0]
                ], cards.filter(function (c) { return !pairHigh.combination.includes(c) && !pairLow_2.combination.includes(c); }).map(function (c) { return c.value; }).slice(0, 3), true),
                herarchy: 7
            };
        }
        return false;
    };
    Deck.isPair = function (cards) {
        return Deck.isRepeat(cards, 2, 8);
    };
    Deck.getCombinationValue = function (cards) {
        var isStraight = Deck.isStraight(cards);
        if (isStraight) {
            var isStraightFlush = Deck.isFlush(isStraight.combination);
            if (isStraightFlush) {
                if (isStraightFlush.highCardValues[0] == 14) {
                    isStraightFlush.herarchy = 0;
                    return isStraightFlush;
                }
                isStraightFlush.herarchy = 1;
                return isStraightFlush;
            }
        }
        var isFourOfAKind = Deck.isFourOfAKind(cards);
        if (isFourOfAKind) {
            return isFourOfAKind;
        }
        var isFullHouse = Deck.isFullHouse(cards);
        if (isFullHouse) {
            return isFullHouse;
        }
        var isFlush = Deck.isFlush(cards);
        if (isFlush) {
            return isFlush;
        }
        else if (isStraight) {
            return isStraight;
        }
        var isThreeOfAKind = Deck.isThreeOfAKind(cards);
        if (isThreeOfAKind) {
            return isThreeOfAKind;
        }
        var isTwoPair = Deck.isTwoPair(cards);
        if (isTwoPair) {
            return isTwoPair;
        }
        var isPair = Deck.isPair(cards);
        if (isPair) {
            return isPair;
        }
        var higherCards = cards.sort(function (cardA, cardB) { return cardB.value - cardA.value; });
        return { combination: [higherCards[0]], highCardValues: higherCards.map(function (c) { return c.value; }), herarchy: 9 };
    };
    Deck.instance = new Deck();
    return Deck;
}());
exports["default"] = Deck;
