const chai = require('chai');
const LifeCycle = require('./LifeCycle');

const expect = chai.expect;

describe('LifeCycle', () => {
    it('should create an object with a field time in milliseconds', () => {
        const lc = new LifeCycle(10);
        let bool = true;
        expect(lc.time).to.equal(10000);
        lc.start()
            .then(() => { bool = false; })
            .then(() => { expect(bool).to.equal(false); });
    });
    it('should not create another timer in the same object', () => {
        const lc = new LifeCycle(10);
        let s = '';
        lc.start()
            .then(() => { s = 'Started'; }, () => { s = 'Rejected'; })
            .then(() => { s += '+Started'; }, () => { s += '+Rejected'; })
            .then(() => { expect(s).to.equal('Started+Rejected'); });
    });
    it('should create a timer, clear it and create a second one', () => {
        const lc = new LifeCycle(10);
        let s = '';
        lc.start()
            .then(() => { s = 'Started'; }, () => { s = 'Rejected'; })
            .then(() => { lc.clear(); })
            .then(() => { s += '+Started'; }, () => { s += '+Rejected'; })
            .then(() => { expect(s).to.equal('Started+Started'); });
    });
});
