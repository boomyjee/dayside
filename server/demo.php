<?php
if (!isset($_REQUEST['_type'])) return;
    
require "api.php";

class DemoApi extends FileApi {
    function pixlr() {
        if (isset($_REQUEST['image'])) {
            $url = $_REQUEST['image'];
            $path = $this->_pathFromUrl($_REQUEST['dir'].$_REQUEST['title'].".".$_REQUEST['type']);
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
}

$api = new DemoApi;