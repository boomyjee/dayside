<?php

require_once __DIR__."/../../server/api.php";

FileApi::extend('auth', function($self) {
    if (empty($self::$auth_public_key)) {
        return "ERROR: Auth public key is not defined";
    }

    if (isset($_REQUEST['_type']) && $_REQUEST['_type'] == 'get_auth_token') return;

    session_id($_COOKIE[session_name()]);
    session_start();

    $authorized = false;
    if (!empty($_POST['auth_key'])) {
        if (!empty($_SESSION['auth_key']) && !empty($_SESSION['auth_key_expiration_timestamp'])) {
            $authorized = $_SESSION['auth_key_expiration_timestamp'] >= time() && $_POST['auth_key'] == $_SESSION['auth_key'];
            if (!$authorized) {
                session_write_close();
                return "ERROR: Invalid auth key";
            }

            $_SESSION['auth_expiration_timestamp'] = time() + 60 * 60;
        }
    } else {
        $authorized = !empty($_SESSION['auth_expiration_timestamp']) && $_SESSION['auth_expiration_timestamp'] >= time();
    }

    session_write_close();
    if (!$authorized) {
        return "auth_error";
    }
});

FileApi::extend('get_auth_token', function($self) {
    $auth_key = uniqid('auth_key');
    $_SESSION['auth_key'] = $auth_key;
    $_SESSION['auth_key_expiration_timestamp'] = time() + 60;
    
    openssl_public_encrypt($auth_key, $auth_token, $self::$auth_public_key);
    echo base64_encode($auth_token);
});