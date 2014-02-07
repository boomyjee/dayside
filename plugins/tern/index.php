<?
if (isset($_REQUEST['remote'])) {
    echo file_get_contents($_REQUEST['remote']); die();
}
if (isset($_POST['css'])) {
    file_put_contents(realpath(__DIR__)."/tern.js",$_POST['js']);
    file_put_contents(realpath(__DIR__)."/tern.css",$_POST['css']);
    echo 'ok';
    die();
}
?>
<!doctype html>
<html>
    <head>
        <title>Tern plugin test</title>
        <meta charset="utf-8">
        
        <script src="../../server/assets/teacss/teacss.js"></script>
        
        <script src="../../server/assets/teacss/teacss-ui.js"></script>
        <link href="../../server/assets/teacss/teacss-ui.css" rel="stylesheet" type="text/css">
            
        <script src="../../client/dayside.js"></script>
        <link href="../../client/dayside.css" rel="stylesheet" type="text/css">
        
        <? if (@$_GET['dev']): ?>
        
            <script tea="makefile.tea"></script>
            <script>teacss.update()</script>
            <script>
                teacss.buildCallback = function (files) {
                    teacss.jQuery.post(location.href,{css:files['/default.css'],js:files['/default.js']},function(data){
                        alert(data);
                    });
                }
            </script>
        
        <? else: ?>
        
            <script src="tern.js"></script>
            <link href="tern.css" rel="stylesheet" type="text/css">
            <script>
                dayside({
                    root: teacss.path.absolute("./")
                });
                dayside.plugins.tern();
            </script>
        
        <? endif ?>
        
    </head>
    <body>
    </body>
</html>