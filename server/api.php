<?php

abstract class FileApi {
    abstract function _pathFromUrl($url);
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
        
        if (!$path || !is_file($path)) { echo "ERROR: Invalid file save path"; die(); }
     
        $mark = "data:image/png;base64,";
        if (strpos($text,$mark)===0)
            $text = base64_decode(substr($text,strlen($mark)));
        file_put_contents($path,$text);
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
                            
                            echo $sub->__toString()."\n";
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
        $dest = $this->_pathFromUrl(@$_REQUEST['dest']);
        if (!$dest || !is_dir($dest)) { echo "ERROR: Invalid destination path"; die(); }
        
        $pathes = @$_REQUEST['pathes'];
        if (is_array($pathes)) {
            foreach ($pathes as $one) {
                $full = $this->_pathFromUrl($one);
                if ($full) {
                    $newPath =  $dest."/".basename($full);
                    rename($full,$newPath);
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