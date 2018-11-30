<?php
    
require __DIR__."/../../server/api.php";
require __DIR__."/api.php";

class AuthCandyApi extends FileApi {
    public static $auth_public_key = "-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA5UTu3dZn+Ekv7lPoc4Hc\n2N6XMfKoymY+8Nuh8dDFnRLKXnqNk1+I6st0aeCp+sEUaPcfB13m/VY4rUnKmVi8\nkwG3UUWr6kW7hjIzSJv87WsdBeee2c3Qd7o0QrUXPknNZ60gDZ95mtxYFW8le7mR\nlexGyOaUXfK2wzohpBBFAinYd20a+9pW1Du3Uew9ezl3YsQaSnfTJFxEhCVBPDLx\nmKRkv7wF2WZDZxM1t/BUqj/84sv6vy3ZoFjnXUtssSn3cjylhWPHs4qPzWmS6V6f\npcMg9dh6JDsLyFpclwtay3RNF4edji+AjDyAYL5z8ewe5PMjZn+4UpWZ6FqpFo/+\nxQIDAQAB\n-----END PUBLIC KEY-----";

    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename($_SERVER["PHP_SELF"]).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-3));
        
        if ($base=="" || strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            $path = realpath(__DIR__."/../../..").$rel;
            return $path;
        }
        return false;
    }
}
$api = new AuthCandyApi;