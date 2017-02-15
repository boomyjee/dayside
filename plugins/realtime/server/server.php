<?php

require __DIR__."/../../../server/lib/Daemon.php";
Daemon::daemonize(__DIR__."/server.pid");

spl_autoload_register(function($name){
    require_once __DIR__."/".str_replace("\\","/",$name).".php";
});
use Symfony\Component\Process\Process;

include "SocketServer.php";

class Listener implements SocketListener {
    
    public function onIdle(SocketServer $server) {
        $clients = $server->getClients();
        foreach ($clients as $client) {
            if ($client->buffer) {
                $client->send(array('type'=>'shell','result'=>$client->buffer));
                $client->buffer = "";
            }
            if ($client->process && !$client->process->isRunning() && !$client->buffer) {
                $client->process = false;
                $client->send(array('type'=>'shell','finished'=>true));
            }
        }
        usleep(1000*10);
    }
    
    function parseCookies($line) {
        $aPairs = explode(';', $line);  
        $result = array();
        foreach ($aPairs as $pair)  
        {  
            $aTmp = array();  
            $aKeyValues = explode('=', trim($pair), 2);  
            if (count($aKeyValues) == 2)  
            {  
                switch ($aKeyValues[0])  
                {  
                    case 'path':  
                    case 'domain':  
                        $aTmp[trim($aKeyValues[0])] = urldecode(trim($aKeyValues[1]));  
                        break;  
                    case 'expires':  
                        $aTmp[trim($aKeyValues[0])] = strtotime(urldecode(trim($aKeyValues[1])));  
                        break;  
                    default:  
                        $aTmp['name'] = trim($aKeyValues[0]);  
                        $aTmp['value'] = trim($aKeyValues[1]);  
                        break;  
                }  
            }  
            $result[$aTmp['name']] = $aTmp['value']; 
        }       
        return $result;
    }
    
    public function auth($cookies) {
        global $params;
        $authInclude = @$params['authInclude'] ? : __DIR__."/../../../server/api.php";
        $authFunction = @$params['authFunction'] ? : array('\FileApi','remote_auth');
        
        require_once $authInclude;
        return call_user_func($authFunction,$cookies);
    }
    
	public function onMessageReceived(SocketServer $server,SocketClient $sender,$message) {
        
        if (!$sender->verified) {
            $cookies = $this->parseCookies(@$sender->headers['Cookie']?:"");
            $sender->verified = $this->auth($cookies);
            if (!$sender->verified) {
                $sender->send(array('type'=>'error','error'=>'Auth failed'));
                $sender->disconnect();
                return;
            }
        }
        
        echo "MESSAGE DATA: ".$message."\n";
        $data = json_decode($message);
        if ($data) {
            if ($data->type=='kill' && $sender->process) {
                $sender->process->stop();
            }
            elseif ($data->type=='shell' && $data->cmd) {
                if ($sender->process) {
                    $sender->process->stop();
                    usleep(1000*10);
                }
                
                $process = new Process($data->cmd);
                $process->start(function ($type, $buffer) use ($sender) {
                    if (Process::ERR !== $type) {
                        $sender->buffer = $sender->buffer ? : "";
                        $sender->buffer .= $buffer;
                    } else {
                    }
                });
                $sender->process = $process;
            }
        }
	}
    
    public $clientId = 0;
	public function onClientConnected(SocketServer $server, SocketClient $newClient) {
        $newClient->buffer = "";
        $newClient->process = false;
        $newClient->verified = false;
        $newClient->id = $this->clientId++;
	}

	public function onClientDisconnected(SocketServer $server, SocketClient $client) {
        if ($client->process) {
            $client->process->stop();
            $client->process = false;
        }
	}

	public function onLogMessage(SocketServer $server,$message) {
	}
}

global $params;
$params = @json_decode($_SERVER['argv'][2],true)?:array();

$listener = new Listener;
$webSocket = new SocketServer(@$params['ip'] ?:'127.0.0.1');
$webSocket->addListener($listener);
$webSocket->start();

