<?php include __DIR__."/../../server/build.php" ?>
<!doctype html>
<html>
    <head>
        <title>Collaborate plugin test</title>
        <meta charset="utf-8">
        
        <script src="../../server/assets/teacss/teacss.js"></script>
        
        <script src="../../server/assets/teacss/teacss-ui.js"></script>
        <link href="../../server/assets/teacss/teacss-ui.css" rel="stylesheet" type="text/css">
            
        <script src="../../client/dayside.js"></script>
        <link href="../../client/dayside.css" rel="stylesheet" type="text/css">
        
        <?php if (build("makefile.tea",false,"collaborate.js",__DIR__)!='dev'): ?>
            <script>
                dayside.plugins.collaborate();
                dayside({
                    root: teacss.path.absolute("./../../../"),
                    ajax_url: teacss.path.absolute("./demo.php")
                });
            </script>
        <?php endif ?>
    </head>
</html>      