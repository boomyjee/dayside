<?php
    
require_once __DIR__."/../../server/api.php";

FileApi::extend('get_files_diff',function($self){
    
    ini_set("memory_limit","256M");
    
    $root_path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$root_path) { echo "ERROR: Invalid folder path"; die(); }

    exec('find '.escapeshellarg($root_path).' -type f -name "*.php"',$php_files);

    $checkHash = json_decode($_POST['checkHash'],true);
    $result = [];
    $path_present = [];

    foreach ($php_files as $file) {
        if (substr($file,0,strlen($root_path))==$root_path) {

            $stamp = filemtime($file);
            $size = filesize($file);
            $path = $_REQUEST['path'].str_replace("\\","/",substr($file,strlen($root_path)));
            $path_present[$path] = 1;

            $hash = isset($checkHash[$path]) ? $checkHash[$path] : false;

            if (!$hash || $hash['stamp']!=$stamp || $hash['size']!=$size) {
                $result[$path] = [
                    'size' => $size,
                    'stamp' => $stamp,
                    'text' => file_get_contents($file)
                ];
            }
        }
    }

    foreach ($checkHash as $path => $hash) {
        if (!isset($path_present[$path])) {
            $result[$path] = false;
        }
    }

    echo json_encode($result);
});