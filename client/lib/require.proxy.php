<?php if (!isset($_REQUEST['url'])): ?>
<?php header("Content-Type: application/javascript") ?>
//<script>
(function(){
var scripts = document.getElementsByTagName("script");
for (var s=0;s < scripts.length;s++) {
    var script = scripts[s];
    if (script.src.indexOf("require.proxy.php")!=-1) {
        var proxy_url = script.src;
        
        window.require.proxy_queue = {tea:[],js:[]};
        window.require.proxy_get = function (path,callback,async,isTea) {
            var qkey = isTea ? 'tea':'js';
            var queue = window.require.proxy_queue[qkey];
            queue.push({url:path,callback:callback});

            clearTimeout(require['proxy_timeout_'+qkey]);
            require['proxy_timeout_'+qkey] = setTimeout(function(){
                var url = proxy_url + (isTea ? "?tea=1" : '');
                
                var params = "";
                for (var q=0;q<queue.length;q++) {
                    params += "url[]="+encodeURIComponent(queue[q].url)+"&";
                }
                require.proxy_queue[qkey] = [];

                var xhr = (window.ActiveXObject) ? new ActiveXObject("Microsoft.XMLHTTP") : (XMLHttpRequest && new XMLHttpRequest()) || null;
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        var text = xhr.status==200 ? xhr.responseText:false;
                        var json = JSON.parse(text);
                        
                        if (isTea) {
                            for (var key in json) {
                                teacss.files[key] = json[key];
                            }
                            for (var q=0;q < queue.length;q++) {
                                queue[q].callback(teacss.files[queue[q].url]);
                            }
                        } else {
                            for (var key in json) {
                                if (json[key]===false) throw "Proxy could not load module on path "+key;
                                window.require.cache.files[key] = json[key];
                            }
                            for (var q=0;q < queue.length;q++) {
                                queue[q].callback();
                            }
                        }
                    }
                }
                xhr.open('POST',url,async);
                xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
                xhr.send(params);
            },1);
        }
        
        window.require.extensions.js.pre = function (path,callback,async) {
            if (window.require.cache.files[path]) return callback();
            require.proxy_get(path,callback,async,false);
        };
        teacss.getFile = function (path,callback) {
            if (teacss.files[path]) return callback(teacss.files[path]);
            require.proxy_get(path,callback,true,true);
        }
        break;
    }
}
})();
//</script>

<?php die(); endif;

class Proxy {
    static $base_url;
    static $base_path;
    static $cache = array();
    static $tea = false;
    
    static function resolve($url) {
        if (strpos($url,"uxcandy.com")!==false) {
            $path = preg_replace("/https?\:\/\/uxcandy\.com\/\~([A-Za-z0-9_-]+)/","/var/www/uxcandy_$1/data/public_html",$url);
            return $path;
        }
        
        if (self::$base_url && strpos($url,self::$base_url)!==0) return false;
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
        if (isset(self::$cache[$url])) return;
        
        if (!$path || !file_exists($path)) {
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
            if ($matches[1]==$matches[3]) {
                $abs_url = self::rel2abs($rel,$url);
                $ext = pathinfo($abs_url, PATHINFO_EXTENSION);
                if (!$ext) {
                    $abs_url = $abs_url.".".(self::$tea ? "tea" : "js");
                }
                self::process($abs_url);
            }
        }
    }
    
    static function run() {
        $self = "http://".$_SERVER['HTTP_HOST'].$_SERVER['PHP_SELF'];
        $path_self = @$_SERVER['PATH_TRANSLATED'] ?: $_SERVER['SCRIPT_FILENAME'];
        
        $a = strlen($self);
        $b = strlen($path_self);
        
        $i = 0;
        while ($self[$a-$i-1]==$path_self[$b-$i-1] && $i<1000) $i++;
        if ($i==0) return;
        
        self::$base_url = substr($self,0,strlen($self)-$i);
        self::$base_path = substr($path_self,0,strlen($path_self)-$i);
        
        self::$tea = isset($_GET['tea']);
        
        $urls = $_REQUEST['url'];
        if (!is_array($urls)) $urls = array($urls);
        foreach ($urls as $url) self::process($url);
        
        echo json_encode(self::$cache);
    }
}

Proxy::run();




