/**
 * @class MatchRegularExpr - Class for representing regular expression.
 * @extends RegExp
 * @property {Object} modifiers
 * @property {boolean} modifiers.caseInsensitive
 * @property {boolean} modifiers.global
 * @property {boolean} modifiers.multiline
 */
class MatchRegularExpr extends RegExp {
    /**
     * Create a regular expression.
     * @param {string | RegExp} [expr = ''] - Regular expression as a RegExp or a string.
     * If this parameter is an instance of RegExp, the following parameters are ignored.
     * @param {boolean} [i] - Specify if the search is case insensitive.
     * @param {boolean} [g] - Perform a global search (find all matches).
     * @param {boolean} [m] - Perform multiline matching.
     */
    constructor(expr = '', { i = false, g = false, m = false } = {}) {
        if (expr instanceof RegExp) {
            super(expr);
            this.regExp = expr.toString().substr(1, expr.toString().length - expr.flags.length - 2);
            this.mod = {
                i: expr.flags.includes('i'),
                g: expr.flags.includes('g'),
                m: expr.flags.includes('m'),
            };
        } else {
            super();
            this.regExp = expr;
            this.mod = {
                i: i !== undefined ? i : false,
                g: g !== undefined ? g : false,
                m: m !== undefined ? m : false,
            };
        }
    }

    static get suffixQuantifiers() {
        return ['+', '*', '?', '$'];
    }
    static get prefixQuantifiers() {
        return ['^', '?=', '?!'];
    }

    /**
     * Get the string with the modifiers
     * @return {string}
     */
    modifiersToString() {
        let mod = '';
        if (this.mod.caseInsensitive) {
            mod += 'i';
        }
        if (this.mod.global) {
            mod += 'g';
        }
        if (this.mod.multiline) {
            mod += 'm';
        }
        return mod;
    }

    /**
     * Set the modifiers for the regular expression.
     * @param {boolean} i - Case insensitive
     * @param {boolean} g - Global
     * @param {boolean} m - Multiline
     */
    set modifiers({ i = false, g = false, m = false }) {
        if (i) {
            this.modifiers.caseInsensitive = true;
        }
        if (g) {
            this.modifiers.global = true;
        }
        if (m) {
            this.modifiers.multiline = true;
        }
    }

    /**
     * Get the modifiers as an object.
     * @returns {{i: boolean, g: boolean, m: boolean}}
     */
    get modifiers() {
        return this.mod;
    }

    static quote(str) {
        return (`${str}`).replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&');
    }

    /**
     * Compose the regular expression from the parameters given.
     * @param {string} string - The string to search or the array
     * that contains a sequence of characters.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @param {string} openBracket - A string with the firsts characters of the expression.
     * @param {string} closeBracket - A string with the last characters of the expression.
     * @param {string} [regExp = ''] - The regular expression to update.
     * @returns {string} - A concatenation of the elements that is the regular expression,
     * like RegExp expected it to be.
     */
    static compose(string, quantifier, openBracket, closeBracket, regExp = '') {
        let rExpr = `${regExp}${openBracket}${string}${closeBracket}`;
        if (MatchRegularExpr.prefixQuantifiers.indexOf(quantifier) !== -1) {
            rExpr = quantifier + rExpr;
        } else if (MatchRegularExpr.suffixQuantifiers.indexOf(quantifier) !== -1
            || /{[1-9]+(,[1-9]*)?}/.test(quantifier)) {
            rExpr += quantifier;
        }
        return rExpr;
    }

    /**
     * Find any of the characters included in string.
     * @param {string | string[]} string - The string or the array of sequence of
     * characters to search.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @returns {MatchRegularExpr} - A matchRegularExpr
     */
    findAnyOf(string, quantifier) {
        if (Array.isArray(string)) {
            for (let i = 0; i < string.length; i += 1) {
                this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(string[i]), quantifier, '[', ']', this.regExp);
            }
        } else {
            this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(string), quantifier, '[', ']', this.regExp);
        }
        return this;
    }

    /**
     * Find any of the characters not included in string
     * @param {string | string[]} string - The string to search or the array that contains
     * a sequence of characters.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @returns {MatchRegularExpr}
     */
    findAnyNotOf(string, quantifier) {
        if (Array.isArray(string)) {
            for (let i = 0; i < string.length; i += 1) {
                this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(string[i]), quantifier, '[^', ']', this.regExp);
            }
        } else {
            this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(string), quantifier, '[^', ']', this.regExp);
        }
        return this;
    }

    /**
     * Find any character included in the interval between from and to
     * @param {string | number} from - The character from which digit the search starts.
     * @param {string} to - The character to which digit the search ends.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @returns {MatchRegularExpr}
     */
    findAnyBetween(from, to, quantifier) {
        this.regExp = MatchRegularExpr.compose(`${MatchRegularExpr.quote(from)}-${MatchRegularExpr.quote(to)}`,
            quantifier, '[', ']', this.regExp);
        return this;
    }

    /**
     * Find any character not included in the interval between from and to.
     * @param {string | number} from - The character from which digit the search starts.
     * @param {string | number } to - The character to which digit the search ends.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @returns {MatchRegularExpr}
     */
    findAnyNotBetween(from, to, quantifier) {
        this.regExp = MatchRegularExpr.compose(`${MatchRegularExpr.quote(from)}-${MatchRegularExpr.quote(to)}`,
            quantifier, '[^', ']', this.regExp);
        return this;
    }

    /**
     * Find any of the alternatives specified.
     * @param {string[]} alternatives - An array with all the alternatives.
     * @param {string} quantifier - The quantifier for the regular expression.
     * @returns {MatchRegularExpr}
     */
    findAnyAlternative(alternatives, quantifier) {
        alternatives.every(item => MatchRegularExpr.quote(item));
        this.regExp = MatchRegularExpr.compose(alternatives.join('|'), quantifier, '(', ')', this.regExp);
        return this;
    }

    /**
     * Find all the strings in order but not adjacent, at least one time each.
     * @param {string | string[]} strings - The string(s) to search for.
     */
    findAllOf(strings) {
        if (Array.isArray(strings)) {
            for (let i = 0; i < strings.length; i += 1) {
                this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(strings[i]), '+', '(', ')', this.regExp);
            }
        } else {
            this.regExp = MatchRegularExpr.compose(MatchRegularExpr.quote(strings), '+', '(', ')', this.regExp);
        }
        return this;
    }

    /**
     * Return the regular expression as a string
     * @returns {string}
     */
    toString() {
        return this.regExp;
    }

    /**
     * Test for a match in a string.
     * @param {string} string - The string to be searched.
     * @returns {Array|{index: number, input: string}} - An array containing the matched
     * text if it finds a match, otherwise it returns null
     */
    execMatch(string) {
        return new RegExp(this.regExp, this.modifiersToString()).exec(string);
    }

    /**
     * Test for a match in a string
     * @param {string} string - The string to be searched.
     * @returns {boolean} - Returns true if it finds a match, otherwise it returns false
     */
    testMatch(string) {
        return new RegExp(this.regExp, this.modifiersToString()).test(string);
    }

    clean() {
        this.regExp = '';
    }
}

module.exports = MatchRegularExpr;
