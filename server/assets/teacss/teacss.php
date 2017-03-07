<?

function teacss($makefile,$css,$js,$dir,$dev) {
    if ($dev) {
        if (isset($_REQUEST['remote'])) {
            ob_get_clean();
            echo file_get_contents($_REQUEST['remote']); 
            die();
        }
        if (isset($_POST['css'])) {
            ob_get_clean();
            if ($js) file_put_contents(realpath($dir)."/".basename($js),$_POST['js']);
            if ($css) file_put_contents(realpath($dir)."/".basename($css),$_POST['css']);
            echo 'ok';
            die();
        }   
        
        echo ob_get_clean();
        
        ?>
            <script tea="<?=$makefile?>"></script>
            <script>teacss.update()</script>
            <script>
                teacss.buildCallback = function (files) {
                    teacss.jQuery.post(location.href,{css:files['/default.css'],js:files['/default.js']},function(data){
                        alert(data);
                    });
                }
            </script>
        <?
        return 'dev';
    } else {
        echo ob_get_clean();
        ?>
            <?php if ($js): ?><script src="<?=$js?>"></script><?php endif ?>
            <?php if ($css): ?><link href="<?=$css?>" rel="stylesheet" type="text/css"><?php endif ?>
        <?
        return 'release';
    }
}

ob_start();