export default class Listener {
    constructor() {
        this.handlers = [];
        this.initeds = [];
    }
    on(type, handler) {
        this.handlers.push({
            type: type,
            handler: handler
        })
    }
    off(type, handler) {
        this.handlers.forEach((item, key) => {
            if (item.type == type) {
                if (item.handler == handler) {
                    this.handlers.splice(key, 1)
                }
            }
        })
    }
    trigger(type, data) {
        this.handlers.forEach((item) => {
            if (item.type == type) {
                if (data) {
                    item.handler(...data);
                } else {
                    item.handler();
                }

            }
        })
    }
    checkInit(name) {
        if (!this.initeds[name]) {
            this.initeds[name] = true;
            return true;
        } else return false;
    }
}