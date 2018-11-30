(function ($,ui) {
    dayside.plugins.auth_candy = $.Class.extend({
        init: function (options) {
            this.options = $.extend({}, options);

            dayside.ready(function() {
                var authWait = false;
                var authFail = false;
                FileApi.auth_error = function(auth_type, type, data, json, callback) {
                    if (authWait && !authFail) {
                        authWait.push({type: type, data: data, json: json, callback: callback});
                    } else {
                        if (!authFail) authWait = [];
                        FileApi.request('get_auth_token', data, false, function (answer) {
                            teacss.jQuery.ajax({
                                url: options.host + '/api/decrypt-token',
                                xhrFields: {
                                    withCredentials: true
                                },
                                type: 'POST',
                                data: {token: answer.data},
                                crossDomain: true,
                                success: function (response) {
                                    if (response === 'not_logged_in') {
                                        authFail = true;
                                        alert('Please login to ' + options.host);
                                    } else if (response === 'host_forbidden') {
                                        authFail = true;
                                        alert('This host is forbidden for you');
                                    } else if (response === '') {
                                        authFail = true;
                                        alert('Error. Try again later...');
                                    } else {
                                        data.auth_key = response;
                                        FileApi.request(type, data, json, function (answer) {
                                            for (var i = 0; i < authWait.length; i++) {
                                                var it = authWait[i];
                                                FileApi.request(it.type, it.data, it.json, it.callback);
                                            }
                                            authWait = false;
                                            if (callback) callback(answer);
                                        });
                                    }
                                },
                                error: function () {
                                    authFail = true;
                                    alert('Error. Try again later...');
                                }
                            });
                        });
                    }
                }
            });
        }
    });

})(teacss.jQuery,teacss.ui);