/**
 * 检测相关属性是否支持，依赖于[ga.js](http://www.google-analytics.com/ga.js)
 * 在引入js时最好在外层增加一个js判断
 * 数据是以Google Analytics的Event方式发送
 * 功能检测参考：https://github.com/Modernizr/Modernizr/tree/master/feature-detects
 *
 * @Examples:
 * if (getCookie(xxx)) return; // 已检测过的不再检测
 * var script = document.createElement('script');
 * script.src = './detect.js';
 * script.async = true;
 * script.onload = function() {
 *  setCookie(xxx, oneYear)
 * };
 */
(function(win, doc) {
    var S_NAME = '__S__N',
        nav = win.navigator;

    var Detect = win.Detect = {
        /**
         * 检测方法是否可用
         * @param name
         * @param fn
         */
        check: function(name, fn) {
            // bind可能不是都支持
            // fn(this._send.bind(null, name));
            if (fn) {
                if (typeof fn === 'boolean') {
                    this._send(name, fn);
                } else if (typeof fn === 'function') {
                    // 回调方式
                    var support = fn(function(support) {
                        Detect._send(name, support);
                    });

                    // return 方式
                    if (typeof support !== 'undefined') {
                        Detect._send(name, support);
                    }
                }
            } else {
                this._send(name, !!win[name]);
            }
        },

        /**
         * 发送到GA
         * @param name {String} 功能名
         * @param support {Number|Boolean} default 0 -1表示没有检查到或被拒绝，0表示不支持，1表示支持 true => 1, false => 0
         */
        _send: function(name, support) {
            if (typeof support === 'undefined') {
                support = 0;
            } else if (typeof support === 'boolean') {
                support *= 1;
            }
            if (win._gaq) {
                // Google Analytics 自动就发送浏览器信息
                // _gaq.push(['_trackEvent', 'Feature', name, support, browser_version]);
                _gaq.push(['_trackEvent', 'Feature', name, '' + support]);
            }
        }
    };

    // 检测localStorage
    Detect.check('localStorage', function() {
        try {
            localStorage.setItem(S_NAME, S_NAME);
            localStorage.removeItem(S_NAME);
            return true;
        } catch(e) {
            return false;
        }
    });

    Detect.check('sessionStorage', function() {
        try {
            sessionStorage.setItem(S_NAME, S_NAME);
            sessionStorage.removeItem(S_NAME);
            return true;
        } catch(e) {
            return false;
        }
    });

    Detect.check('hashchange', function() {
        return typeof win.onhashchange === 'object';
    });

    Detect.check('history.pushState', function() {
        return typeof history.pushState === 'function';
    });

    Detect.check('datauri', function(cb) {
        var image = new Image();
        image.onerror = function() {
            cb(0);
        };

        image.onload = function() {
            cb(image.width == 1 && image.height == 1);
        }

        image.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

    });

    Detect.check('webp', function(cb) {
        var image = new Image();
        image.onerror = function() {
            cb(0);
        };
        image.onload = function() {
            cb(image.width == 1);
        };

        image.src = 'data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAAwA0JaQAA3AA/vuUAAA=';
    });

    Detect.check('canvas', function() {
        var elem = doc.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    });

    Detect.check('dataset', function() {
        var n = doc.createElement('div');
        n.setAttribute('data-a-b', 'c');
        return !!(n.dataset && n.dataset.aB === 'c');
    })

    Detect.check('json', 'JSON' in win  && 'parse' in JSON);
    Detect.check('geolocation', 'geolocation' in nav);
    Detect.check('bind', !!(Function.prototype && Function.prototype.bind));
    Detect.check('websql', 'openDatabase' in win);
    Detect.check('indexeddb', !!(win.indexedDB || win.mozIndexedDB || win.webkitIndexedDB || win.msIndexedDB));
    Detect.check('filereader', !!(win.File && win.FileList && win.FileReader));
    Detect.check('connection', nav.connection && nav.connection.type);
    Detect.check('webworkers', 'Worker' in win);
    Detect.check('postmessage', 'postMessage' in win);
    Detect.check('cookieEnabled', nav.cookieEnabled);

    Detect.check('WebSocket');
    Detect.check('applicationCache');
    Detect.check('performance');

})(window, document);