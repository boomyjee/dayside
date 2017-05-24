<?php

require_once __DIR__."/../../server/api.php";

FileApi::extend('git_get_branches',function($self){

    $path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$path || !is_dir($path)) { echo "ERROR: Invalid folder path"; die(); }

    chdir($path);
    exec("git branch", $output, $ret_var);

    $result = [];
    foreach($output as $branch){
        if ($branch[0]=='*') continue;
        $result[] = trim($branch);
    }
   echo json_encode($result);
});

FileApi::extend('git_delete_branches',function($self){

    $path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$path || !is_dir($path)) { echo "ERROR: Invalid folder path"; die(); }

    chdir($path);
    $branches = $_POST['branches'];
    foreach ($branches as $branch) {
        exec("git branch -D $branch");
    }
    echo 1;
});