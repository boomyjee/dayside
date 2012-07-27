<?php
if (!isset($_POST['type'])) return;
    
require "api.php";
$api = new FileApi;