class LifeCycle {
    constructor(sec = null) {
        this.tm = sec * 1000;
        this.timer = null;
    }
    start() {
        return new Promise((resolve, reject) => {
            if (this.timer === null) {
                this.timer = setTimeout(resolve, this.time);
            } else {
                reject(Error('Timer already set'));
            }
        });
    }
    get time() {
        return this.tm;
    }
    set time(sec) {
        this.tm = sec;
    }

    clear() {
        clearTimeout(this.timer);
        this.timer = null;
    }
}

module.exports = LifeCycle;
