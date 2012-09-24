<?php

class FileApi {
    
    function __construct() {
        $fileapi_hash = false;
        $password_path = __DIR__."/password.php";
        
        if (file_exists($password_path))
            include $password_path;
        
        if (!$fileapi_hash) {
            if (isset($_POST['password'])) {
                $fileapi_hash = sha1($_POST['password']);
                file_put_contents($password_path,'<?php $fileapi_hash="'.$fileapi_hash.'";');
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
        $this->{$_REQUEST['_type']}();
        die();                
    }
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        
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
    
    function dir() {
        $path = $this->_pathFromUrl(@$_REQUEST['path']);
        if (!$path || !is_dir($path)) { echo "ERROR: Invalid directory path"; die(); }

        $res = array();
        $iterator = new \DirectoryIterator($path);
        foreach ($iterator as $sub) {
            $name = $sub->__toString();
            $file = $_REQUEST['path'].str_replace($path,"",str_replace("\\","/",$sub->getPathname()));
            if (!$sub->isDot())
                $res[($sub->isDir() ? '0':'1').$file] = array('name'=>$name,'folder'=>$sub->isDir(),'path'=>$file);
        }
        ksort($res);
        $res = array_values($res);
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
        
        $path = $path."/".$_REQUEST['relpathinfo0'];
        $path = str_replace("\\","/",$path);
        if (!file_exists($path)) {
            if (!mkdir($path,0755,true)) {
                echo "ERROR: could not create upload directory\n";
                return;
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
        
        $fileArray = reset($_FILES);
        move_uploaded_file($fileArray['tmp_name'],$path."/".$fileArray['name']);
        echo "SUCCESS\n";
        return;
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
}
