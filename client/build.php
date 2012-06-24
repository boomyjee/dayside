<?
    if (isset($_POST['js'])) {
        file_put_contents(__DIR__."/editorPanel.js",@$_POST['js']);
        file_put_contents(__DIR__."/editorPanel.css",@$_POST['css']);
        echo 'ok';
        return ;
    }
?>
<html>
    <head>
        <title>editorPanel build</title>
        <script src="http://code.jquery.com/jquery-1.7.2.min.js"></script>
        <script src="/apps/boomyjee/teacss/contexts/lib/teacss.js"></script>
    </head>
    <body>
        Build page for "editorPanel" project<br>
        <button onclick = "build();">Build</button>
        <br>
        <script>
            var build = function () {
                teacss.build("makefile.tea",{
                    callback: function (files) {
                        $.ajax({
                            url: location.href,
                            type: 'POST',
                            data: {
                                js: files['/default.js'],
                                css: files['/default.css']
                            },
                            success: function (data) {
                                alert(data);
                            }
                        });
                    }
                });
            }
        </script>
    </body>
</html>