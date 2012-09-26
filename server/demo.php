<?php
if (!isset($_REQUEST['_type'])) return;
    
require "api.php";

class DemoApi extends FileApi {
}

$api = new DemoApi;