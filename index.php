<!doctype html>
<html>
    <head>
        <title>DaysIDE</title>
        <meta charset="utf-8">
        <? if (isset($_GET['dev'])): ?>
            <script tea="server/assets/index.tea"></script>
            <script src="server/assets/teacss/teacss.js"></script>
        <? else: ?>
            <script src="server/assets/teacss/teacss.js"></script>
            <script src="server/assets/teacss/teacss-ui.js"></script>
            <link href="server/assets/teacss/teacss-ui.css" rel="stylesheet" type="text/css">
            <script src="client/dayside.js"></script>
            <link href="client/dayside.css" rel="stylesheet" type="text/css">
            <script src="plugins/pixlr/pixlr.js"></script>
            <script src="plugins/xdebug/xdebug.js"></script>
            <link href="plugins/xdebug/xdebug.css" rel="stylesheet" type="text/css">
            <script src="plugins/console/console.js"></script>
            <script src="plugins/git_commit/git_commit.js"></script>
            <link href="plugins/git_commit/git_commit.css" rel="stylesheet" type="text/css">
            <!--<script src="plugins/collaborate/collaborate.js"></script>-->

            <script>
                dayside({preview:false});
                dayside.plugins.pixlr();
                dayside.plugins.xdebug();
                dayside.plugins.console();
                dayside.plugins.git_commit();
                // dayside.plugins.collaborate();
            </script>
        <? endif ?>
    </head>
    <body>
        Welcome to DaysIDE
    </body>
</html>
