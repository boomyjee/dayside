<?php

require_once __DIR__."/../../server/api.php";

FileApi::extend('xterm_open',function($self) {
    $path = $self->_pathFromUrl(@$_REQUEST['path']);
    if (!$path) { echo "ERROR: Invalid path"; die(); }

    $reflection = new \ReflectionClass(get_class($self));
    $apiFile = $reflection->getFileName();
    exec("/usr/bin/php ".__DIR__."/server.php ".escapeshellarg($apiFile));
    $port = file_get_contents(__DIR__."/cache/".get_current_user().".port");
    
    ?>
        <!doctype html>
        <html>
        <head>
            <link rel="stylesheet" href="assets/xterm.css" />
            <script src="assets/xterm.js"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body, #terminal { width: 100%; height: 100%; background: #000; }
                .terminal { padding: 2px; }
            </style>
        </head>
        <body>
            <div id="terminal" />
            <script>
                var terminal = new Terminal({cols:130,rows:50});
                var terminalEl = document.getElementById('terminal');
                terminal.open(terminalEl);

                var cols = Math.max(2, Math.floor((terminalEl.clientWidth-4)  / terminal._core._renderService.dimensions.actualCellWidth));
                var rows = Math.max(1, Math.floor((terminalEl.clientHeight-4) / terminal._core._renderService.dimensions.actualCellHeight));                    
                terminal.resize(cols,rows);

                var socket = new WebSocket((location.protocol=='https:' ? "wss:":"ws:")+"//"+location.host+":<?=$port?>");
                var firstMessage = true;
                socket.onopen = () => {
                    socket.send(JSON.stringify({cookie:<?=json_encode($_COOKIE)?>,rows,cols,path:<?=json_encode($path)?>}));
                    socket.onmessage = ({data}) => {
                        if (firstMessage && data.indexOf("@")==-1) { 
                            firstMessage = false; 
                            return; 
                        }
                        terminal.write(typeof data === 'string' ? data : new Uint8Array(data));
                    }
                    socket.onclose = () => terminal.write("\nDisconnected...");
                    terminal.onData(data => socket.readyState==1 && socket.send(data));
                    terminal.onBinary(data => {
                        if (this._socket.readyState !== 1) return;
                        const buffer = new Uint8Array(data.length);
                        for (let i = 0; i < data.length; ++i) buffer[i] = data.charCodeAt(i) & 255;
                        this._socket.send(buffer);                
                    });    
                }
            </script>
        </body>
        </html>
    <?
});

