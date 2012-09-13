var pixlr = (function () {
    /*
     * IE only, size the size is only used when needed
     */
    function windowSize() {
        var w = 0,
            h = 0;
        if (document.documentElement.clientWidth !== 0) {
            w = document.documentElement.clientWidth;
            h = document.documentElement.clientHeight;
        } else {
            w = document.body.clientWidth;
            h = document.body.clientHeight;
        }
        return {
            width: w,
            height: h
        };
    }

    function extend(object, extender) {
        for (var attr in extender) {
            if (extender.hasOwnProperty(attr)) {
                object[attr] = extender[attr] || object[attr];
            }
        }
        return object;
    }

    function buildUrl(opt) {
        var url = 'http://pixlr.com/' + opt.service + '/?s=c', attr;
        for (attr in opt) {
            if (opt.hasOwnProperty(attr) && attr !== 'service') {
                url += "&" + attr + "=" + escape(opt[attr]);
            }
        }
        return url;
    }
    var bo = {
        ie: window.ActiveXObject,
        ie6: window.ActiveXObject && (document.implementation !== null) && (document.implementation.hasFeature !== null) && (window.XMLHttpRequest === null),
        quirks: document.compatMode === 'BackCompat' },
        return_obj = {
            settings: {
                'service': 'editor'
            },
            overlay: {
                show: function (options) {
                    var opt = extend(return_obj.settings, options || {}),
                        iframe = document.createElement('iframe'),
                    return iframe;
                },
                hide: function (callback) {
                    if (pixlr.overlay.idiv && pixlr.overlay.div) {
                        document.body.removeChild(pixlr.overlay.idiv);
                        document.body.removeChild(pixlr.overlay.div);
                    }
                    if (callback) {
                        eval(callback);
                    }
                }
            },
            url: function(options) {
                return buildUrl(extend(return_obj.settings, options || {}));
            },
            edit: function (options) {
                var opt = extend(return_obj.settings, options || {});
                location.href = buildUrl(opt);
            }
        };        
    return return_obj;
}());