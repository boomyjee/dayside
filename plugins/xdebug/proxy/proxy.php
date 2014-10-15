<?php

require __DIR__."/../../../server/lib/Daemon.php";
Daemon::daemonize(__DIR__."/proxy.pid");

function debug($what1,$what2=false) {
    echo $what1.": ";
    echo $what2; 
    echo "\n";
}

class XDebugServer {
    
    public $serverPort = 9000;
    public $serverSocket = false;
    
    public $clientPort = 9001;
    public $clientSocket = false;
    
    public $clients;
    public $lastClient;
    
    public $clientTimeout = 2;
    public $daemonTimeout = 10;
    
    public $apiPaths;
    
    function init() {
        $this->serverSocket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Failed creating server socket: ".socket_strerror(socket_last_error()));
        socket_set_option($this->serverSocket, SOL_SOCKET, SO_REUSEADDR, 1) or die("Failed setting option on server socket: ".socket_strerror(socket_last_error()));
        socket_bind($this->serverSocket, "0.0.0.0", $this->serverPort) or die("Failed binding server socket (".$this->serverPort."): ".socket_strerror(socket_last_error()));
        socket_listen($this->serverSocket) or die("Failed listening server socket: ".socket_strerror(socket_last_error()));
        
        $this->clientSocket = socket_create(AF_INET, SOCK_STREAM, 0) or die("Failed creating client socket: ".socket_strerror(socket_last_error()));
        socket_set_option($this->clientSocket, SOL_SOCKET, SO_REUSEADDR, 1) or die("Failed setting option on client socket: ".socket_strerror(socket_last_error()));
        socket_bind($this->clientSocket, "0.0.0.0", $this->clientPort) or die("Failed binding client socket (".$this->idePort."): ".socket_strerror(socket_last_error()));
        socket_listen($this->clientSocket) or die("Failed listening client socket: ".socket_strerror(socket_last_error()));
        
        $this->clients = array();
        $this->lastClient = time();
        
        $this->apiPaths = array();
        $this->apiPaths[realpath(__DIR__."/../../../")."/"] = 1;
    }
    
    function loop() {
        
        $loop = true;
        while ($loop)
        {
            $rfds = array($this->serverSocket,$this->clientSocket);
            $wfds = array();
            $efds = array();
            
            foreach ($this->clients as $key=>$client) {
                if ($client['stamp']+$this->clientTimeout < time()) {
                    if ($client['server']) {
                        socket_close($client['server']);
                    }
                    unset($this->clients[$key]);
                }
            }
            
            if (count($this->clients)) {
                $this->lastClient = time();
            } else {
                if ($this->lastClient + $this->daemonTimeout < time()) {
                    $loop = false;
                    break;
                }
            }
            
            foreach ($this->clients as $key=>$client) {
                if ($client['server']) {
                    $rfds[] = $client['server'];
                    if ($client['in']) {
                        $wfds[] = $client['server'];
                    }
                }
            }
            
            $r = socket_select($rfds, $wfds, $efds, 1);
            if ($r === false)
            {
                die("Select error: ".socket_strerror(socket_last_error()));
            }
            if ($r>0)
            {
                //debug("NET", "rfds: ".implode(',',$rfds));
                //debug("NET", "wfds: ".implode(',',$wfds));
                foreach ($rfds as $sock)
                {
                    if ($sock == $this->serverSocket)
                    {
                        $this->newServer($sock);
                    }
                    else if ($sock == $this->clientSocket) {
                        $this->newClient($sock);
                    }
                    else
                    {
                        foreach ($this->clients as $key=>$client) {
                            if ($client['server']==$sock) $this->readServer($sock,$key);
                        }           
                    }
                }
                
                foreach ($wfds as $sock) {
                    foreach ($this->clients as $key=>$client) {
                        if ($client['server']==$sock) $this->writeServer($sock,$key);
                    }
                }
            }
        }        
    }
    
    function newClient($server_sock) {
        $sock = socket_accept($server_sock);
        $buf = socket_read($sock,100000);
        
        $json = json_decode($buf);
        $key = $json->key;
        $data = $json->data;
        $apiPath = $json->apiPath;
        
        if (!$key) {
            socket_close($sock);
        }
        
        // debug("NET", "Client socket with key: ".$key);
        // debug("NET", "Some data was read: ".$data);
        
        if (!isset($this->clients[$key])) {
            $this->clients[$key] = array(
                'server' => false,
                'in' => "",
                'out' => "",
                'stamp' => false
            );
        }
        
        if ($apiPath) {
            $this->apiPaths[$apiPath] = 1;
        }
        
        $this->clients[$key]['stamp'] = time();
        $this->clients[$key]['in'] .= ($data=='none') ? "" : $data;
        
        $out = $this->clients[$key]['out'] ? : "none";
        socket_write($sock,$out);
        $this->clients[$key]['out'] = "";
        socket_close($sock);
    }    
    
    function newServer($server_sock)
    {
        $sock = socket_accept($server_sock);
        $buf = socket_read($sock,5000);
        
        echo $buf;
        
        if (strstr($buf, "<init ")===false)
        {
            debug("PROXY", "Not an init packet?");
            socket_close($sock);
            return;
        }
        if (strstr($buf, " idekey=\"")===false)
        {
            debug("PROXY", "No idekey?");
            socket_close($sock);
            return;
        }
        list(,$k) = explode(' idekey="', $buf, 2);
        list($key,) = explode('"', $k, 2);
        
        if (strstr($buf, " fileuri=\"")===false) {
            debug("PROXY", "No fileuri?");
            socket_close($sock);
            return;
        }
        list(,$k) = explode(' fileuri="', $buf, 2);
        list($uri,) = explode('"', $k, 2);
        
        $uri = realpath(substr($uri,strlen("file://")));
        foreach ($this->apiPaths as $path=>$flag) {
            if ( substr($uri,0,strlen($path))==$path ) {
                // debug("NET", "This is client uri = ".$uri);
                socket_close($sock);
                return;
            }
        }
        
        debug("NET", "New server socket with key: ".$key);
        
        if (!isset($this->clients[$key])) {
            debug("NET", "No client for key: ".$key);
            socket_close($sock);
            return;
        }
        $this->clients[$key]['server'] = $sock;
        $this->clients[$key]['out'] = $buf;
        
        socket_set_nonblock($sock);
        $this->servers[$key] = $sock;
    }    
    
    function readServer($sock,$key) {
        $data = socket_read($sock,5000);
        
        if ($data===false || $data==="") {
            $this->clients[$key]['server'] = false;
            socket_close($sock);
            return;
        }
        
        $this->clients[$key]['out'] .= $data;
        debug("Data read",$data);
    }
    
    function writeServer($sock,$key) {
        $data = $this->clients[$key]['in'];
        $data = $data."\0";
        
        debug("Data write",$data);
        
        socket_write($sock,$data);
        $this->clients[$key]['in'] = "";
    }
    
    function run() {
        $this->init();
        $this->loop();
    }
}

$server = new XDebugServer();
$server->run();