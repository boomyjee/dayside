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
                                    try {
                                        var obj = $.parseJSON(response);
                                    } catch {
                                        authFail = true;
                                        alert("Invalid json in response");
                                        return;
                                    }

                                    if (obj.message) alert(obj.message);
                                    if (obj.token) {
                                        authFail = false;
                                        data.auth_key = obj.token;
                                        FileApi.request(type, data, json, function (answer) {
                                            for (var i = 0; i < authWait.length; i++) {
                                                var it = authWait[i];
                                                FileApi.request(it.type, it.data, it.json, it.callback);
                                            }
                                            authWait = false;
                                            if (callback) callback(answer);
                                        });
                                    } else {
                                        authFail = true;
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