<!doctype html>
<html>
    <head>
        <title>DaysIDE</title>
        <meta charset="utf-8">
        <style>
            body {
                background: #666;
                font-family: "Helvetica Neue",Helvetica,Arial,sans-serif;
                font-size: 13px;
                line-height: 18px;
            }
        </style>
            
        <? if (isset($_GET['dev'])): ?>
            <script tea="server/assets/index.tea"></script>
            <script src="server/assets/teacss/teacss.js"></script>
        <? else: ?>
            <script src="server/assets/teacss/teacss.js"></script>
            <script src="server/assets/teacss/teacss-ui.js"></script>
            <link href="server/assets/teacss/teacss-ui.css" rel="stylesheet" type="text/css">
            
            <script src="client/dayside.js"></script>
            <link href="client/dayside.css" rel="stylesheet" type="text/css">
            <script>dayside({preview:false})</script>
        <? endif ?>
    </head>
    <body>
        Welcome to DaysIDE
    </body>
</html>