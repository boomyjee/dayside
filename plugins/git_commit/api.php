<?php
    
require_once __DIR__."/../../server/api.php";

FileApi::extend('git_commit',function($self){
    $path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$path) { echo "ERROR: Invalid folder path"; die(); }

    require_once __DIR__."/lib/controller.php";
    new \GitWebCommit\Controller($path);    
});