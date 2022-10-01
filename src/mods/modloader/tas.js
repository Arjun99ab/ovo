var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.arrayIteratorImpl = function(a) {
    var b = 0;
    return function() {
        return b < a.length ? {
            done: !1,
            value: a[b++]
        } : {
            done: !0
        }
    }
};
$jscomp.arrayIterator = function(a) {
    return {
        next: $jscomp.arrayIteratorImpl(a)
    }
};
$jscomp.makeIterator = function(a) {
    var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    return b ? b.call(a) : $jscomp.arrayIterator(a)
};
$jscomp.arrayFromIterator = function(a) {
    for (var b, c = []; !(b = a.next()).done;) c.push(b.value);
    return c
};
$jscomp.arrayFromIterable = function(a) {
    return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a))
};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
    a != Array.prototype && a != Object.prototype && (a[b] = c.value)
};
$jscomp.getGlobal = function(a) {
    return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
    $jscomp.initSymbol = function() {};
    $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol)
};
$jscomp.Symbol = function() {
    var a = 0;
    return function(b) {
        return $jscomp.SYMBOL_PREFIX + (b || "") + a++
    }
}();
$jscomp.initSymbolIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.iterator;
    a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
    "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {
        configurable: !0,
        writable: !0,
        value: function() {
            return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this))
        }
    });
    $jscomp.initSymbolIterator = function() {}
};
$jscomp.initSymbolAsyncIterator = function() {
    $jscomp.initSymbol();
    var a = $jscomp.global.Symbol.asyncIterator;
    a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator"));
    $jscomp.initSymbolAsyncIterator = function() {}
};
$jscomp.iteratorPrototype = function(a) {
    $jscomp.initSymbolIterator();
    a = {
        next: a
    };
    a[$jscomp.global.Symbol.iterator] = function() {
        return this
    };
    return a
};
$jscomp.iteratorFromArray = function(a, b) {
    $jscomp.initSymbolIterator();
    a instanceof String && (a += "");
    var c = 0,
        e = {
            next: function() {
                if (c < a.length) {
                    var d = c++;
                    return {
                        value: b(d, a[d]),
                        done: !1
                    }
                }
                e.next = function() {
                    return {
                        done: !0,
                        value: void 0
                    }
                };
                return e.next()
            }
        };
    e[Symbol.iterator] = function() {
        return e
    };
    return e
};
$jscomp.polyfill = function(a, b, c, e) {
    if (b) {
        c = $jscomp.global;
        a = a.split(".");
        for (e = 0; e < a.length - 1; e++) {
            var d = a[e];
            d in c || (c[d] = {});
            c = c[d]
        }
        a = a[a.length - 1];
        e = c[a];
        b = b(e);
        b != e && null != b && $jscomp.defineProperty(c, a, {
            configurable: !0,
            writable: !0,
            value: b
        })
    }
};
$jscomp.polyfill("Array.prototype.keys", function(a) {
    return a ? a : function() {
        return $jscomp.iteratorFromArray(this, function(a) {
            return a
        })
    }
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, b, c) {
    if (null == a) throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
    if (b instanceof RegExp) throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
    return a + ""
};
$jscomp.polyfill("String.prototype.startsWith", function(a) {
    return a ? a : function(a, c) {
        var b = $jscomp.checkStringArgs(this, a, "startsWith");
        a += "";
        var d = b.length,
            f = a.length;
        c = Math.max(0, Math.min(c | 0, b.length));
        for (var h = 0; h < f && c < d;)
            if (b[c++] != a[h++]) return !1;
        return h >= f
    }
}, "es6", "es3");
$jscomp.findInternal = function(a, b, c) {
    a instanceof String && (a = String(a));
    for (var e = a.length, d = 0; d < e; d++) {
        var f = a[d];
        if (b.call(c, f, d, a)) return {
            i: d,
            v: f
        }
    }
    return {
        i: -1,
        v: void 0
    }
};
$jscomp.polyfill("Array.prototype.find", function(a) {
    return a ? a : function(a, c) {
        return $jscomp.findInternal(this, a, c).v
    }
}, "es6", "es3");
(function() {
    var a = Math.round(999999999 * Math.random()).toString(),
        b = 1,
        c = 1,
        e = null,
        d = null,
        f = [],
        h = function(a) {
            for (var b = [], c = 0; c < arguments.length; ++c) b[c - 0] = arguments[c];
            console.group("OvO TAS Tools Log:");
            console.log.apply(console, $jscomp.arrayFromIterable(b));
            console.groupEnd()
        },
        k = function() {
            if (!document.getElementById(a)) {
                var b = document.createElement("div"),
                    c = {
                        backgroundColor: "rgba(150,10,1,0.7)",
                        width: "10px",
                        height: "10px",
                        position: "absolute",
                        top: "100px",
                        left: "100px"
                    };
                Object.keys(c).forEach(function(a) {
                    b.style[a] =
                        c[a]
                });
                b.id = a;
                document.body.appendChild(b)
            }
        },
        g = globalThis.ovoTasTools = {
            init: function() {
                window.cr_getC2Runtime && (d = g.runtime = cr_getC2Runtime());
                d ? (g.startUpdate(), h("OvO TAS Tools Initialised!")) : alert("this is code only works on OvO!");
                k()
            },
            get version() {
                return 4
            },
            get timescale() {
                return b
            },
            set timescale(a) {
                a !== b && (c = b, b = a)
            },
            isInLevel: function() {
                return d.running_layout.name.startsWith("Level")
            },
            isPaused: function() {
                if (g.isInLevel()) return d.running_layout.layers.find(function(a) {
                    return "Pause" === a.name
                }).visible
            },
            loadInputs: function(a) {
                f = "number" === typeof a[0][0] ? a : a.map(function(a, b) {
                    return [1 * b / 60, a]
                })
            },
            get loadedInputs() {
                return f
            },
            playInputs: function() {
                g.timescale = 1;
                var a = 0,
                    b = {
                        tick: function() {
                            k();
                            var c = d.dt;
                            a += c;
                            for (console.log(a, c, f.length); 0 < f.length && a > f[0][0];) a -= 1 / 60, f.shift()[1].forEach(function(a) {
                                "Restart" === a ? c2_callFunction("Menu > Replay") : "Jump" === a ? c2_callFunction("Controls > Buffer", ["Jump"]) : c2_callFunction("Controls > " + a)
                            });
                            0 === f.length && d.untickMe(b)
                        }
                    };
                d.tickMe(b)
            },
            isInEndCard: function() {
                if (g.isInLevel()) {
                    var a =
                        d.running_layout.layers.find(function(a) {
                            return "End Game" === a.name
                        }),
                        b = d.running_layout.layers.find(function(a) {
                            return "End Card" === a.name
                        });
                    return a.visible || b.visible
                }
            },
            pause: function() {
                g.timescale = 0
            },
            undoTimescale: function() {
                g.timescale = c
            },
            step: function() {
                var a = d.timescale;
                d.timescale = 1;
                d.tick(!0, null, null);
                d.timescale = a
            },
            startUpdate: function() {
                e = setInterval(g.update, 10)
            },
            stopUpdate: function() {
                clearInterval(e);
                e = null
            },
            update: function() {
                var a = g.timescale;
                a == d.timescale || !g.isInLevel() || g.isPaused() ||
                    g.isInEndCard() || (h("Updating timescale"), d.timescale = a)
            }
        };
    g.init()
})();