<?php
    
require __DIR__."/../../server/api.php";
require __DIR__."/api.php";

class FirepadApi extends FileApi {
    static $firebase_secret = "ZqPvkrvCBxmfjLyi0mCf1FvcJaM6NXcSWGU4p17I";
    static $firebase_url = "https://scorching-torch-3166.firebaseio.com";
    
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
$api = new FirepadApi;