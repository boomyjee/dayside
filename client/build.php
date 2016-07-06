<?
    if (isset($_POST['js'])) {
        file_put_contents(__DIR__."/dayside.js",@$_POST['js']);
        file_put_contents(__DIR__."/dayside.css",@$_POST['css']);
        echo 'ok';
        return ;
    }
?>
<html>
    <head>
        <title>dayside build</title>
        <meta charset="utf-8">
        <script src="//code.jquery.com/jquery-1.7.2.min.js"></script>
        <script src="/~boomyjee/teacss/lib/teacss.js"></script>
    </head>
    <body>
        Build page for "dayside" project<br>
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