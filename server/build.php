<?php

require __DIR__."/assets/teacss/teacss.php";
function build($makefile,$css,$js,$dir) {
    $dev = @$_GET['dev'];
    if ($dev) {
        include __DIR__."/api.php";
        $api = new FileApi("pass");
        if ($api->pass()!='ok') $dev = false;
    }
    return teacss($makefile,$css,$js,$dir,$dev);
}
