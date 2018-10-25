Object.defineProperty(Object.prototype, "objSize", {
    enumerable: false,
    value: function() {
        return Object.keys(this).length;
    }
});

Object.defineProperty(Object.prototype, "merge", {
    enumerable: false,
    value: function(extend, overwrite) {
        overwrite = overwrite === undefined ? true : overwrite;

        if (extend.constructor.name == [].constructor.name) {
            extend.forEach(e => { this.merge(e, overwrite); });
        } else {
            for (let e in extend) {
                if (extend.hasOwnProperty(e) && (overwrite || !this.hasOwnProperty(e))) this[e] = extend[e];
            }
        }
        return this;
    }
});

Object.defineProperty(Object, "merge", {
    enumerable: false,
    value: function(base, extend, overwrite) {
        overwrite = overwrite === undefined ? true : overwrite;
        let ret = {};
        return ret.merge(base).merge(extend);
    }
});

Object.defineProperty(Object.prototype, "stringify", {
    enumerable: false,
    value: function(humane) {
        humane = humane === undefined ? true : humane;

        if (!humane) return JSON.stringify(this);
        else {
            let ret = "";
            for (let k in this) {
                if (this.hasOwnProperty(k)) {
                    let line = this[k];
                    if (line.constructor == Object) line = line.stringify(humane).trim();
                    ret += `${k}: ${line}\n`;
                }
            }
            return ret;
        }
    }
});

Object.defineProperty(Array.prototype, "remove", {
    enumerable: false,
    value: function() {
        let l, a = arguments;
        for (let i = 0; i < a.length; i++) {
            l = this.indexOf(a[i]);
            if (l >= 0) this.splice(l, 1);
        }
        return this;
    }
});