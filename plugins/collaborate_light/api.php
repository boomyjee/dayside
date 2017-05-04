<?php

FileApi::extend('firebase_init',function($self){
    $cls = get_class($self);

    $url = $cls::$firebase_url;
    $private_key = $cls::$firebase_private_key;
    $client_email = $cls::$firebase_client_email;
    $api_key = $cls::$firebase_api_key;
    
    if (!$url || !$private_key || !$client_email || !$api_key) {
        $ret = array(
            'error' => 'Please define $firebase_url, $firebase_api_key, $firebase_client_email, $firebase_private_key in your API class'
        );
    } else {
        require_once __DIR__."/lib/JWT.php";

        $now_seconds = time();
        $payload = array(
            "iss" => $client_email,
            "sub" => $client_email,
            "aud" => "https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit",
            "iat" => $now_seconds,
            "exp" => $now_seconds+(60*60),
            "uid" => "1",
            "claims" => array(
                "premium_account" => true
            )            
        );
        $token = JWT::encode($payload, $private_key, "RS256");
        $ret = array(
            'token' => $token,
            'url' => $url,
            'api_key' => $api_key
        );
    }
    
    echo json_encode($ret);
});