<?php
if (!isset($_REQUEST['_type'])) return;
    
require "api.php";
require __DIR__."/../plugins/collaborate/api.php";
require __DIR__."/../plugins/git_commit/api.php";

class DemoApi extends FileApi {
    static $firebase_secret = "";
    static $firebase_url = "";
}

$api = new DemoApi;
