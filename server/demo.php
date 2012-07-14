<?php
if (!isset($_POST['type'])) return;
    
require "api.php";

class DemoApi extends FileApi {
    function __construct() {
        $password = "123";
        $salt = "boo";
        
        if (isset($_POST['password']))
            setcookie('editor_auth',$test = md5($_POST['password'].$salt),0,'/');
        else
            $test = $_COOKIE['editor_auth'];
        
        if ($test!=md5($password.$salt)) { echo "auth_error"; die(); } 
        $this->{$_POST['type']}();
        die();                
    }
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename(__FILE__).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-2));
        
        if ($base=="" || strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            
            $path = realpath(__DIR__."/../..").$rel;
            return $path;
        }
        return false;
    }
}

$api = new DemoApi;