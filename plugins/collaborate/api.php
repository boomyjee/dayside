<?php

FileApi::extend('firepad_init',function($self){
    $cls = get_class($self);
    $secret = $cls::$firebase_secret;
    $url = $cls::$firebase_url;
    
    if (!$secret || !$url) {
        $ret = array(
            'error' => 'Please define $firebase_secret and $firebase_url in your API class'
        );
    } else {
        require_once __DIR__."/lib/JWT.php";
        require_once __DIR__."/lib/FirebaseToken.php";
        $tokenGen = new Services_FirebaseTokenGenerator($secret);
        $token = $tokenGen->createToken(array("uid" => "1"));
        $ret = array(
            'token' => $token,
            'url' => $url
        );
    }
    
    echo json_encode($ret);
});