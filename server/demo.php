<?php
if (!isset($_POST['type'])) return;
    
require "api.php";

class DemoApi extends FileApi {
    function __construct() {
        $password = "123";
        $salt = "boo";
        
        if (isset($_POST['password']))
            setcookie('editor_auth',$test = md5($_POST['password'].$salt));
        else
            $test = $_COOKIE['editor_auth'];
        
        if ($test!=md5($password.$salt)) { echo "auth_error"; die(); } 
        $this->{$_POST['type']}();
        die();                
    }
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = "/".$url[3];
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename(__FILE__).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-2));
        
        if (strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            $path = realpath(__DIR__."/../..").$rel;
            return $path;
        }
        return false;
    }
    
    function exec($cmd, $input='',$cwd) {
        $proc=proc_open($cmd, 
            array(0=>array('pipe', 'r'), 1=>array('pipe', 'w'), 2=>array('pipe', 'w')), $pipes,$cwd); 
        fwrite($pipes[0], $input);fclose($pipes[0]); 
        $stdout=stream_get_contents($pipes[1]);fclose($pipes[1]); 
        $stderr=stream_get_contents($pipes[2]);fclose($pipes[2]); 
        $rtn=proc_close($proc); 
        $out = array('stdout'=>$stdout, 'stderr'=>$stderr, 'return'=>$rtn); 
        $text = "";
        if ($out['stdout']) $text .= $out['stdout']."\n";
        if ($out['stderr']) $text .= $out['stderr']."\n";
        return $text;
    }     

    function shell() {
        $command = trim(@$_REQUEST['command']);
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        
        if (!$path || !is_dir($path)) { echo "Invalid path"; die(); }
        if (!$command) {
            $text = "";
        } else {
            $text = htmlentities($this->exec($command,'',$path));
        }
        $res = array('text'=>$text);
        echo json_encode($res);     
    }
}

$api = new DemoApi;