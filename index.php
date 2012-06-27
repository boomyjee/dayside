<html>
    <head>
        <title>editorPanel demo</title>
        <style>
            body {
                background: #333;
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
            
            <script src="client/editorPanel.js"></script>
            <link href="client/editorPanel.css" rel="stylesheet" type="text/css">
            <script src="server/assets/shellTab.js"></script>
            <script src="server/assets/index.js"></script>
        <? endif ?>
    </head>
    <body>
    </body>
</html>