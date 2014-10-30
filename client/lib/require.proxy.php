<?php

class Proxy {
    static $base_url;
    static $base_path;
    static $cache = array();
    static $tea = false;
    
    static function resolve($url) {
        if (strpos($url,self::$base_url)!==0) return false;
        return self::$base_path.substr($url,strlen(self::$base_url));
    }
    
    static function rel2abs($rel, $base) {
        if (parse_url($rel, PHP_URL_SCHEME) != '' || substr($rel, 0, 2) == '//') return $rel;
        if ($rel[0]=='#' || $rel[0]=='?') return $base.$rel;
        extract(parse_url($base));
        $path = preg_replace('#/[^/]*$#', '', $path);
        if ($rel[0] == '/') $path = '';
        $abs = "$host$path/$rel";
        $re = array('#(/\.?/)#', '#/(?!\.\.)[^/]+/\.\./#');
        for($n=1; $n>0; $abs=preg_replace($re, '/', $abs, -1, $n)) {}
        return $scheme.'://'.$abs;
    }
    
    static function process($url) {
        $path = self::resolve($url);
        if (!$path) return;
        if (isset(self::$cache[$url])) return;
        if (!file_exists($path)) {
            self::$cache[$url] = false;
            return;
        }
        
        $text = file_get_contents($path);
        self::$cache[$url] = $text;
        
        if (self::$tea) {
            $pattern = '/@import\s*(\'|")(.*?)(\'|")/';
        } else {
            $pattern = '/require\(\s*(\'|")(.*?)(\'|")\s*\)/';
        }
        $matches = array();
        preg_match_all($pattern,$text,$matches);
        
        foreach ($matches[2] as $rel) {
            $abs_url = self::rel2abs($rel,$url);
            $ext = pathinfo($abs_url, PATHINFO_EXTENSION);
            if (!$ext) {
                $abs_url = $abs_url.".".(self::$tea ? "tea" : "js");
            }
            self::process($abs_url);
        }
    }
    
    static function run() {
        $self = $_SERVER['SCRIPT_URI'];
        $path_self = $_SERVER['PATH_TRANSLATED'];

        $a = strlen($self);
        $b = strlen($path_self);

        $i = 0;
        while ($self[$a-$i-1]==$path_self[$b-$i-1] && $i<1000) $i++;
        if ($i==0) return;

        self::$base_url = substr($self,0,strlen($self)-$i);
        self::$base_path = substr($path_self,0,strlen($path_self)-$i);
        
        self::$tea = isset($_GET['tea']);
        self::process($_GET['url']);
        echo json_encode(self::$cache);
    }
}

Proxy::run();




