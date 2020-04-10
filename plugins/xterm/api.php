<?php

require_once __DIR__."/../../server/api.php";

FileApi::extend('xterm_open',function($self) {

    $path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$path) { echo "ERROR: Invalid path"; die(); }

    $reflection = new \ReflectionClass(get_class($self));
    $apiFile = $reflection->getFileName();
    $serverStartOutput = shell_exec("/usr/bin/php ".__DIR__."/server.php ".escapeshellarg($apiFile));
    
    $current_user = posix_getpwuid(posix_getuid())['name'];
    $port = file_get_contents(__DIR__."/cache/".$current_user.".port");

    $plugin_root = !empty($_REQUEST['dayside_url']) ? $_REQUEST['dayside_url']."/plugins/xterm/" : "";
    
    ?>
        <!doctype html>
        <html>
        <head>
            <link rel="stylesheet" href="<?=$plugin_root?>assets/xterm.css" />
            <script src="<?=$plugin_root?>assets/xterm.js"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body, #terminal { width: 100%; height: 100%; background: #000; }
                .terminal { padding: 2px; }
            </style>
        </head>
        <body>
            <div id="terminal" />
            <script>
                console.debug(<?=json_encode($serverStartOutput)?>);

                var terminal = new Terminal({cols:130,rows:50});
                var terminalEl = document.getElementById('terminal');
                terminal.open(terminalEl);
                
                var socket;

                function resize() {
                    var cols = Math.max(2, Math.floor((terminalEl.clientWidth-4)  / terminal._core._renderService.dimensions.actualCellWidth));
                    var rows = Math.max(1, Math.floor((terminalEl.clientHeight-4) / terminal._core._renderService.dimensions.actualCellHeight));                    
                    if (terminal.rows!=rows || terminal.cols!=cols) {
                        terminal.resize(cols,rows);
                        if (socket && socket.readyState==1) {
                            socket.send(
                                String.fromCharCode(7)
                                +String.fromCharCode(Math.min(100,Math.floor(rows/100)))+String.fromCharCode(rows % 100)
                                +String.fromCharCode(Math.min(100,Math.floor(cols/100)))+String.fromCharCode(cols % 100)
                            );
                        }
                    }
                }
                resize();
                window.addEventListener("resize",resize);

                socket = new WebSocket((location.protocol=='https:' ? "wss:":"ws:")+"//"+location.host+":<?=$port?>");
                socket.onopen = () => {
                    socket.send(JSON.stringify({cookie:<?=json_encode($_COOKIE)?>,rows:terminal.rows,cols:terminal.cols,path:<?=json_encode($path)?>}));
                    socket.onmessage = ({data}) => {
                        terminal.write(typeof data === 'string' ? data : new Uint8Array(data));
                    }
                    socket.onclose = () => terminal.write("\nDisconnected...");
                    terminal.onData(data => socket.readyState==1 && socket.send(data));
                    terminal.onBinary(data => {
                        if (socket.readyState !== 1) return;
                        const buffer = new Uint8Array(data.length);
                        for (let i = 0; i < data.length; ++i) buffer[i] = data.charCodeAt(i) & 255;
                        socket.send(buffer);                
                    });    
                }
            </script>
        </body>
        </html>
    <?
});

