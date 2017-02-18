<?php

class FileApi {
    
    static protected $_extensions;
    static function extend($name,$f) {
        if ($f) {
            self::$_extensions[$name] = $f;
        } else {
            unset(self::$_extensions[$name]);
        }
    }
    
    public function __call($name,$args) {
        if (isset(self::$_extensions[$name])) {
            $args = array_merge(array($this),$args);
            return call_user_func_array(self::$_extensions[$name],$args);
        } else {
            throw new \Exception('Method is not implemented');
        }
    }    
    
    function __construct($_type=false) {
        $fileapi_hash = false;
        $password_path = __DIR__."/password.php";
        if (file_exists($password_path)) include $password_path;
        
        if (!$fileapi_hash) {
            if (isset($_POST['password'])) {
                $fileapi_hash = sha1($_POST['password']);
                if (!file_put_contents($password_path,'<?php $fileapi_hash="'.$fileapi_hash.'";')) {
                    echo "ERROR: Can't write password file"; die();
                }
            } else {
                echo "auth_empty"; die(); 
            }
        }
        
        if (isset($_POST['password']))
            setcookie('editor_auth',$test = sha1($_POST['password']),0,'/');
        elseif (isset($_REQUEST['auth_token']))
            $test = $_REQUEST['auth_token'];
        else
            $test = @$_COOKIE['editor_auth'];
        
        if ($test!=$fileapi_hash) { echo "auth_error"; die(); } 
        
        $this->csrfRequired();
        
        $_type = $_type ? : $_REQUEST['_type'];
        $this->{$_type}();
    }
    
    function csrfRequired() {
        setcookie('editor_csrf', @$_COOKIE['editor_csrf'] ? :bin2hex(openssl_random_pseudo_bytes(32)),0,'/');
        if (!isset($_COOKIE['editor_csrf'])) return;
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            if (!@$_POST['_csrf'] || $_POST['_csrf']!=@$_COOKIE['editor_csrf']) { echo "auth_error"; die(); }
        }
    }
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        $url = str_replace("..","_",$url);
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename($_SERVER["PHP_SELF"]).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-2));
        
        if ($base=="" || strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            $path = realpath(__DIR__."/../..").$rel;
            return $path;
        }
        return false;
    }
    
    function pass() {
        return 'ok';
    }
    
    function dir($ret=false) {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path || !is_dir($path)) { echo "ERROR: Invalid directory path"; die(); }

        $res = array();
        $iterator = new \DirectoryIterator($path);
        foreach ($iterator as $sub) {
            $name = $sub->__toString();
            $file = $_REQUEST['path'].str_replace(str_replace("\\","/",$path),"",str_replace("\\","/",$sub->getPathname()));
            if (!$sub->isDot())
                $res[($sub->isDir() ? '0':'1').$file] = array('name'=>$name,'folder'=>$sub->isDir(),'path'=>$file);
        }
        ksort($res);
        $res = array_values($res);
        if ($ret) 
            return $res;
        else
            echo json_encode($res);
    }
    
    function file() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path || !is_file($path)) { echo "ERROR: Invalid file path"; die(); }
        readfile($path);
    }
    
    function save() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        $text = @$_REQUEST['text'] ?:"";
        
        if (!$path) { echo "ERROR: Invalid file save path"; die(); }
     
        $mark = "data:image/png;base64,";
        if (strpos($text,$mark)===0)
            $text = base64_decode(substr($text,strlen($mark)));
        
        $res = file_put_contents($path,$text);
        if ($res===false) { echo "ERROR: Can't save file"; die(); }
        echo "ok";
    }
    
    function createFile() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path) { echo "ERROR: Invalid create file path"; die(); }
        $newFile = @$_REQUEST['newFile'];
        if (!$newFile) { echo "ERROR: Invalid file name to create"; die(); }
        $newFile = $path."/".$newFile;
        if (file_exists($newFile)) { echo "ERROR: File already exists"; die(); }
        file_put_contents($newFile,"");
        echo "ok";
        return $newFile;
    }
            
    function createFolder() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path) { echo "ERROR: Invalid create directory path"; die(); }
        $newFolder = @$_REQUEST['newFolder'];
        if (!$newFolder) { echo "ERROR: Invalid directory name to create"; die(); }
        $newFolder = $path."/".$newFolder;
        if (file_exists($newFolder)) { echo "ERROR: Folder already exists"; die(); }
        mkdir($newFolder);
        echo "ok";
        return $newFolder;
    }
    
    function rename() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        $name = @$_REQUEST['name'];
        if (!$path || !$name) { echo "ERROR: Invalid path for rename"; die(); }
        
        $newPath = dirname($path)."/".$name;
        if (dirname($newPath)!=dirname($path)) { echo "ERROR: Subpaths are restricted"; die(); }
        if (file_exists($newPath)) { echo "ERROR: Name already exists"; die(); }
        
        rename($path,$newPath);
        echo 'ok';
    }
    
    function remove() {
        $pathes = @$_REQUEST['pathes'];
        if (is_array($pathes)) {
            foreach ($pathes as $path) {
                $path = $this->_pathFromUrl($path);
                if ($path && file_exists($path)) {
                    if (is_dir($path)) {
                        if (!is_link($path)) {
                            $iterator = new \RecursiveIteratorIterator(
                                new \RecursiveDirectoryIterator($path,\RecursiveDirectoryIterator::SKIP_DOTS),
                                \RecursiveIteratorIterator::CHILD_FIRST);
                            foreach ($iterator as $sub) {
                                if ($sub->isDir())
                                    rmdir($sub->__toString());
                                else
                                    unlink($sub->__toString());
                            }
                            rmdir($path);
                        } else {
                            unlink($path);
                        }
                    } elseif (is_file($path)) {
                        unlink($path);
                    }
                }
            }
        }
        echo "ok";
    }
    
    function move() {
        $pathes = @$_REQUEST['pathes'];
        $dest = @$_REQUEST['dest'];
        if (is_array($pathes) && is_array($dest)) {
            foreach ($pathes as $i=>$one) {
                $full = $this->_pathFromUrl($one);
                $full_dest = $this->_pathFromUrl(@$dest[$i]);
                if ($full && $full_dest) {
                    rename($full,$full_dest);
                }
            }
        }
        echo "ok";
    }    
    
    function copy() {
        $pathes = @$_REQUEST['pathes'];
        $dest = @$_REQUEST['dest'];
        if (is_array($pathes) && is_array($dest)) {
            foreach ($pathes as $i=>$path) {
                $path = $this->_pathFromUrl($path);
                $newPath = $this->_pathFromUrl(@$dest[$i]);
                if ($path && file_exists($path) && $newPath) {
                    $copyN = 1;
                    while (file_exists($newPath)) {
                        $path_parts = pathinfo(@$dest[$i]);
                        $ext = @$path_parts['extension'] ? ".".$path_parts['extension']:"";
                        $newPath = $this->_pathFromUrl($path_parts['dirname'].
                            "/".$path_parts['filename']."-copy".($copyN>1?$copyN:"").$ext);
                        if (!$newPath) continue;
                        $copyN++;
                    }
                    
                    if (is_dir($path)) {
                        mkdir($newPath);
                        $iterator = new \RecursiveIteratorIterator(
                            new \RecursiveDirectoryIterator($path,\RecursiveDirectoryIterator::SKIP_DOTS),
                            \RecursiveIteratorIterator::SELF_FIRST);
                        foreach ($iterator as $sub) {
                            if ($sub->isDir())
                                mkdir($newPath.substr($sub->__toString(),strlen($path)));
                            else
                                copy($sub->__toString(),$newPath.substr($sub->__toString(),strlen($path)));
                        }
                    } elseif (is_file($path)) {
                        copy($path,$newPath);
                    }
                }
            }            
        }
        echo "ok";
    }
    
    function upload() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path || !is_dir($path)) { echo "ERROR: Invalid upload path"; die(); }
        
        if (isset($_REQUEST['relpathinfo0'])) {
            $path = $path."/".$_REQUEST['relpathinfo0'];
            $path = str_replace("\\","/",$path);
            if (!file_exists($path)) {
                if (!mkdir($path,0755,true)) {
                    echo "ERROR: could not create upload directory\n";
                    return;
                }
            }
        }
        if (!is_dir($path)) {
            echo "ERROR: invalid upload directory\n";
            return;
        }
        
        if (count($_FILES)==0) {
            echo "ERROR: no files to upload\n";
            return;
        }
        
        $file = reset($_FILES);
        $file_name = isset($_POST["name"]) ? $_POST["name"] : $file["name"];
        $target = $path."/".$file_name;
        
        $chunk = isset($_POST["chunk"]) ? intval($_POST["chunk"]) : 0;
        $chunks = isset($_POST["chunks"]) ? intval($_POST["chunks"]) : 0;

        $out = @fopen("{$target}.part", $chunk == 0 ? "wb" : "ab");
        if ($out) {
            $in = @fopen($file['tmp_name'], "rb");
            if ($in) {
                while ($buff = fread($in, 4096)) fwrite($out, $buff);

                @fclose($in);
                @fclose($out);
                @unlink($file['tmp_name']);

                if (!$chunks || $chunk == $chunks - 1) rename("{$target}.part", $target);
                echo "SUCCESS\n";
                return;
            }
        }
        @unlink("{$target}.part");
        echo "ERROR: cannot move uploaded file to target folder";
        return;
    }    
    
    function download() {
        $path = array();
        if (!$_REQUEST['path'] || is_string($_REQUEST['path'])) { echo "ERROR: Download path is not defined"; die(); }
        foreach ($_REQUEST['path'] as $value) {
            $path_temp = $this->_pathFromUrl($value);
            if (!$path_temp) { echo "ERROR: Invalid download path"; die(); }
            $path[] = $path_temp;
        }
        $output = false;
        $addDir = function(&$zip, $location, $name) use(&$addDir) {
            $zip->addEmptyDir($name);
            $name .= '/';
            $location .= '/';

            // Read all Files in Dir
            $dir = opendir ($location);
            while ($file = readdir($dir))
            {
                if ($file == '.' || $file == '..') continue;

                if (filetype($location . $file) == 'dir')
                    $addDir($zip, $location . $file, $name . $file);
                else
                    $zip->addFile($location . $file, $name . $file);
            }
        };
        
        if (count($path) > 1 || filetype($path[0]) == 'dir') {
            $za = new \ZipArchive;
            $dir = sys_get_temp_dir() .'/'. uniqid(); 
            mkdir($dir);
            $zip_file_name = count($path) > 1 ?  $dir.'/files.zip' : $dir."/".pathinfo($path[0], PATHINFO_FILENAME).".zip";
            
            $res = $za->open($zip_file_name, ZipArchive::CREATE);
            if($res === TRUE) {
                foreach ($path as $value) {
                    if (filetype($value) == 'dir') 
                        $addDir($za, $value, basename($value));
                    else 
                        $za->addFile($value, basename($value));
                }
                $za->close();
                $output = $zip_file_name;
            }
            else  { echo 'Could not create a zip archive';}
        }
        else {
            $output = $path[0];
        }
        
        if ($output) {
            ob_get_clean();
            header("Pragma: public");
            header("Expires: 0");
            header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
            header("Cache-Control: private", false);
            header("Content-Type: application/octet-stream");
            header("Content-Disposition: attachment; filename=" . basename($output) . ";" );
            header("Content-Transfer-Encoding: binary");
            header("Content-Length: " . filesize($output));
            readfile($output);
        }
        
        if ($zip_file_name)
            unlink($zip_file_name);
    }        
    
    function fileSearch() {
        $url = @$_REQUEST['path'];
        $path = $this->_pathFromUrl($url);
        $mask = @$_REQUEST['mask'];
        $text = @$_REQUEST['text'];
        
        if (!$path || !is_dir($path)) { echo "ERROR: Invalid directory path"; die(); }
        
        $res = array();
        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator(
            $path,\RecursiveDirectoryIterator::SKIP_DOTS),\RecursiveIteratorIterator::CHILD_FIRST);
        
        foreach ($iterator as $sub) {
            if (!$sub->isDir()) {
                $basename = $sub->getBasename();
                if (!$mask || fnmatch($mask,$basename)) {
                    $sub_path = $sub->__toString();
                    if ($text) {
                        $valid = false;
                        $handle = fopen($sub_path, 'r');
                        while (($buffer = fgets($handle,4096)) !== false) {
                            if (strpos($buffer, $text) !== false) {
                                $valid = true;
                                break;
                            }      
                        }
                        fclose($handle);                           
                    } else {
                        $valid = true;
                    }
                    
                    if ($valid) {
                        $sub_url = str_replace($path,$url,$sub_path);
                        $res[] = $sub_url;
                    }
                }
            }
        }
        echo json_encode(array(
            'files' => $res,
            'finished' => true,
            'from' => array(
                'file' => 'a/b/c',
                'pos' => 222
            )
        ));        
    }
    
    function batch() {
        $res = array();
        $url = @$_REQUEST['path'];
        $path = $this->_pathFromUrl($url);
        
        if (!$path || !is_dir($path)) { echo "ERROR: Invalid directory path"; die(); }
        
        $iterator = new \RecursiveIteratorIterator(
            new \RecursiveDirectoryIterator($path,\RecursiveDirectoryIterator::SKIP_DOTS),\RecursiveIteratorIterator::CHILD_FIRST);
        foreach ($iterator as $sub) {
            $sub_path = $sub->__toString();
            $sub_url = str_replace($path,$url,$sub_path);
            if ($sub->isDir()) {
                $res[$sub_url] = array('directory'=>true);
            } else {
                $res[$sub_url] = array('content'=>file_get_contents($sub_path));
            }
        }
        echo json_encode($res);
    }
    
    function unpack() {
        $url = @$_REQUEST['path'];
        $path = $this->_pathFromUrl($url);
        
        if (!$path || !file_exists($path)) { echo "ERROR: Invalid file path"; die(); }
        
        $zip = new ZipArchive;
        $res = $zip->open($path);
        if ($res === true) {
            $zip->extractTo(dirname($path));
            $zip->close();
        } else {
            echo "ERROR: Can't open archive"; die();
        }
        echo "ok";
    }
    
    function pixlr_frame() {
        
        $url = @$_REQUEST['path'];
        $path = false;
        
        if ($url) $path = $this->_pathFromUrl($url);
        
        if ($path) {
            if (@$_REQUEST['preload']) {
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, array('image' => '@'.$path));
                curl_setopt($ch, CURLOPT_URL, 'http://pixlr.com/store/');
                $res = curl_exec($ch);
                curl_close($ch);            

                if ($res && substr($res,0,4)=='http') {
                    $url = $res;
                } else {
                    echo "ERROR: Error preloading file"; die();
                }
            }
            $title = basename($path);
            $params = '&image='.urlencode($url)."&title=".urlencode($title);
        } else {
            $params = '';
        }
        
        $params .= "&target=".urlencode($_REQUEST['target']);
        $red = 'https://pixlr.com/editor/?s=c&locktarget=true&referrer=dayside'.$params;
        header("Location:$red");
    }
    
    function pixlr() {
        if (isset($_REQUEST['image'])) {
            $url = $_REQUEST['image'];
            $path = $this->_pathFromUrl($_REQUEST['dir']."/".$_REQUEST['title'].".".$_REQUEST['type']);
            if (!$path) {
                echo "ERROR: invalid path";
                die();
            }
            $file = fopen ($url, "rb");
            if ($file) {
                $newf = fopen($path, "wb");
                if ($newf) while(!feof($file)) {
                    fwrite($newf, fread($file, 1024 * 8 ), 1024 * 8 );
                }
            }
            if ($file) fclose($file);
            if ($newf) fclose($newf);
            echo "ok";
        }
    }  
    
    function xdebug() {
        $sock = socket_create(AF_INET, SOCK_STREAM, 0);
        if (!@socket_connect($sock, "localhost", 9001)) {
            // start daemon
            $proxy_path = realpath(__DIR__."/../plugins/xdebug/proxy/proxy.php");
            shell_exec(PHP_BINDIR."/php ".$proxy_path." start");
            
            echo "error";
            return;
        }

        $key = $_REQUEST['key'];
        $data = @$_REQUEST['data'] ?:'none';
        
        $json = json_encode(array(
            'key' => $key,
            'data' => $data,
            'apiPath' => $this->apiPath ?:false
        ));

        socket_write($sock,$json);

        $retdata = socket_read($sock,100000);
        echo $retdata;
    }
    
    function real_path() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        echo json_encode(array('path'=>$path));
    }    
    
    function xdebug_path() {
        $this->real_path();
    }    
    
    function console($commands=false,$theme=false) {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path) { echo "ERROR: Invalid folder path"; die(); }
        
        define('DAYSIDE_CONSOLE',1);
        
        $currentDir = $path;
        $commands = $commands ?:array(
            'git*' => 'git $1',
            'ls*' => 'ls $1'
        );
        $theme = $theme ?:'ubuntu';
        
        require __DIR__."/../plugins/console/console.php";
    }
    
    static function remote_auth($cookies) {
        $password_path = __DIR__."/password.php";
        $fileapi_hash = false;
        if (file_exists($password_path)) include $password_path;
        if (!$fileapi_hash) return false;
        $test = @$cookies['editor_auth'];
        return $test==$fileapi_hash;
    }
    
    function realtime_start() {
        $server_path = realpath(__DIR__."/../plugins/realtime/server/server.php"); 
        $params = @$this->realtimeParams ?: array(
            'authInclude' =>  __FILE__,
            'authFunction' => array('\FileApi','remote_auth')
        );
        $params['ip'] = $_SERVER['SERVER_ADDR'];
        $params = escapeshellarg(json_encode($params));
        echo shell_exec(PHP_BINDIR."/php ".$server_path." start ".$params);
    }
    
    function codeintel_start() {
        $server_path = realpath(__DIR__."/../../daysideCodeintel/server/server.py"); 
        $params = @$this->codeintelParams ?: array(
            'authInclude' =>  __FILE__,
            'authFunction' => array('\FileApi','remote_auth')
        );
        $params = array_merge($params,array(
            'port' => (int)(@$_REQUEST['port'] ?:8000)
        ));
        $params = escapeshellarg(json_encode($params));
        echo shell_exec("python ".$server_path." restart ".$params." 2>&1");
    }

    function php_server_start() {
        $server_path = realpath(__DIR__."/../../daysidePHPServer/server/server.php"); 
        if (!$server_path) {
            echo "Can't find server/server.php";
            return;
        }
        $params = @$this->phpServerParams ?: array(
            'authInclude' =>  __FILE__,
            'authFunction' => array('\FileApi','remote_auth')
        );
        $params = array_merge($params,array(
            'port' => (int)(@$_REQUEST['port'] ?:8000)
        ));
        $params = escapeshellarg(json_encode($params));
        echo shell_exec(PHP_BINDIR."/php ".$server_path." start ".$params);
    }    
}