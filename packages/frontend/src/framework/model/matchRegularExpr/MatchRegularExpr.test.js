const chai = require('chai');
const MatchRegularExpr = require('./MatchRegularExpr');

const expect = chai.expect;

describe('MatchRegularExpr', () => {
    describe('#constructor()', () => {
        it('should accept 0, 1 or 2 parameters', () => {
            const expr = new MatchRegularExpr();
            expect(expr).to.have.property('mod');
            expect(expr.toString()).to.equal('');
            expect(expr.modifiers.i)
                .to.equal(expr.modifiers.g)
                .to.equal(expr.modifiers.m)
                .to.equal(false);

            const expr2 = new MatchRegularExpr('[0-9]*', { i: true, g: true });
            expect(expr2).to.have.property('mod');
            expect(expr2.toString()).to.equal('[0-9]*');
            expect(expr2.modifiers.i)
                .to.equal(expr2.modifiers.g)
                .to.equal(true);
            expect(expr.modifiers.m).to.equal(false);

            const expr3 = new MatchRegularExpr(/[a-z]/gi);
            expect(expr3).to.have.property('mod');
            expect(expr3.toString()).to.equal('[a-z]');
            expect(expr3.modifiers.i)
                .to.equal(expr3.modifiers.g)
                .to.equal(true);
            expect(expr3.modifiers.m).to.equal(false);
        });
    });
    describe('find methods', () => {
        const expr = new MatchRegularExpr();
        beforeEach(() => {
            expr.clean();
        });
        describe('#findAnyOf()', () => {
            it('should return a matchRegularExpr object with expression like [string] with quantifier', () => {
                const res = expr.findAnyOf('abc', '+');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('[abc]+');
            });
        });
        describe('#findAnyNotOf()', () => {
            it('should return a matchRegularExpr object with expression like [^string] with quantifier', () => {
                const res = expr.findAnyNotOf('abc', '*');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('[^abc]*');
            });
        });
        describe('#findAnyBetween()', () => {
            it('should return a matchRegularExpr object with expression like [from-to] with quantifier', () => {
                const res = expr.findAnyBetween('a', 'z', '{2,}');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('[a-z]{2,}');
            });
        });
        describe('#findAnyNotBetween()', () => {
            it('should return a matchRegularExpr object with expression like [^from-to] with quantifier', () => {
                const res = expr.findAnyNotBetween('0', '9', '');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('[^0-9]');
            });
        });
        describe('#findAnyAlternative()', () => {
            it('should return a matchRegularExpr object with expression like (a1|aN) with quantifier', () => {
                const res = expr.findAnyAlternative(['a', 'b', 'c'], '?=');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('?=(a|b|c)');
            });
        });
        describe('#findAllOf()', () => {
            it('should return a matchRegularExpr object with expression like (s1)+(sN)+ with quantifier', () => {
                const res = expr.findAllOf(['ab', 'be', 'ci']);
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('(ab)+(be)+(ci)+');
            });
        });
        describe('a find method with wrong quantifier', () => {
            it('should return a matchRegularExpr object with the regular expression but the quantifier', () => {
                const res = expr.findAnyOf(['ab', 'bc', 'cd'], '%');
                expect(res).to.be.instanceOf(MatchRegularExpr);
                expect(res.toString()).to.equal('[ab][bc][cd]');
            });
        });
    });
    describe('#execMatch()', () => {
        it('should return an array if there is a match, otherwise null', () => {
            let expr = new MatchRegularExpr();
            expr.modifiers = { i: true };
            expr = expr.findAnyAlternative(['a', 'b', 'c'], '').findAnyOf('aeiou', '*');
            expect(expr.toString()).to.equal('(a|b|c)[aeiou]*');
            expect(expr.modifiersToString()).to.equal('i');

            let array = expr.execMatch('Ciao');
            expect(array[0]).to.equal('Ciao');
            expect(array.index).to.equal(0);

            array = expr.execMatch('Word');
            expect(array).to.equal(null);
        });
    });
    describe('#testMatch()', () => {
        it('should return an true if there is a match, otherwise false', () => {
            let expr = new MatchRegularExpr();
            expr.modifiers = { i: true };
            expr = expr.findAnyAlternative(['a', 'b', 'c'], '').findAnyOf('aeiou', '*');

            let res = expr.testMatch('Ciao');
            console.log(res);
            expect(res).to.equal(true);

            res = expr.execMatch('Word');
            console.log(res);
            expect(res).to.not.equal(true);
        });
    });
});
