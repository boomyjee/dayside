<?php

ini_set('session.use_cookies', 0);
session_cache_limiter("");

require $argv[1];
require __DIR__."/lib/workerman/Autoloader.php";

class Worker extends \Workerman\Worker {
    public static $daemonize = true;
    protected static $_outputStream = "/dev/null";

    public static $portFile;
    public static $freePort;

    protected static function parseCommand() {
        global $argv;
        $command  = \trim($argv[2] ?? 'start');
        $master_pid      = \is_file(static::$pidFile) ? \file_get_contents(static::$pidFile) : 0;
        $master_is_alive = $master_pid && \posix_kill($master_pid, 0) && \posix_getpid() !== $master_pid;

        switch ($command) {
            case 'start':
                if ($master_is_alive) {
                    echo file_get_contents(self::$portFile)."\n";
                    exit;
                }
                file_put_contents(self::$portFile,self::$freePort);
                echo "live on 0.0.0.0:".self::$freePort."\n";
                break;
            case 'stop':
                if ($master_is_alive) {
                    echo "stopped\n";
                    \posix_kill($master_pid, \SIGINT);
                } else {
                    echo "not running\n";
                }
                exit;
        }
    }    

    static function findFreePort($host="0.0.0.0", $start=7700, $end=7999) {
        $port = $start;
        while ($port >= $start && $port <= $end) {
            $errno = null;
            $errstr = null;

            $connection = @fsockopen($host, $port, $errno, $errstr,0.1);

            if (is_resource($connection)) {
                fclose($connection);
            } else {
                if (!in_array($errno,[110])) return $port;
            }
            $port++;
        }
        return false;
    }    

    static function cleanText($text) {
        $regex = <<<'END'
/
(
    (?: [\x00-\x7F]                 # single-byte sequences   0xxxxxxx
    |   [\xC0-\xDF][\x80-\xBF]      # double-byte sequences   110xxxxx 10xxxxxx
    |   [\xE0-\xEF][\x80-\xBF]{2}   # triple-byte sequences   1110xxxx 10xxxxxx * 2
    |   [\xF0-\xF7][\x80-\xBF]{3}   # quadruple-byte sequence 11110xxx 10xxxxxx * 3 
    ){1,100}                        # ...one or more times
)
| .                                 # anything else
/x
END;
        return preg_replace($regex, '$1', $text);        
    }

    static function createWorker() {
        $context = get_class(FileApi::$instance)::$xterm_context ?? [];
        self::$freePort = self::findFreePort();

        $worker = new Worker("Websocket://0.0.0.0:".self::$freePort,$context);
        $worker->name = 'xterm_ws';
        if (!empty($context)) $worker->transport = 'ssl';
        $worker->reusePort = false;

        $worker->onConnect = function ($connection) {
            $connection->auth = false;
        };

        $worker->onMessage = function($connection, $data) {
            if (!$connection->auth) {
                $initial = json_decode($data,true);
                $_COOKIE = $initial['cookie'];
                $auth_error = FileApi::$instance->auth();
                
                if ($auth_error) {
                    $connection->send($auth_error);
                    $connection->close();
                } else {
                    $connection->auth = true;
                }

                $current_user_home = posix_getpwuid(posix_getuid())['dir'];

                unset($_SERVER['argv']);
                $env = array_merge([
                    'COLUMNS'=>$initial['cols'],
                    'LINES'=>$initial['rows'],
                    'TERM'=>'xterm',
                    'HOME'=>$current_user_home
                ],$_SERVER);

                $cmd = "bash";
                if (!file_exists(__DIR__.'/pt')) {
                    system('cc -o pt pt.c -lutil 2>&1', $retval);
                    if ($retval) echo("Cannot compile pseudotty helper\n");
                }
                if (file_exists(__DIR__.'/pt')) { 
                    $cmd = __DIR__.'/pt $LINES $COLUMNS '.$cmd;
                }
                $connection->process = proc_open($cmd, [['pty'],['pty'],['pty']], $pipes, $initial['path'], $env);
                $connection->pipes = $pipes;
                stream_set_blocking($pipes[0], 0);
                $connection->process_stdout = new \Workerman\Connection\TcpConnection($pipes[1]);
                $connection->process_stdout->onMessage = function($process_connection, $data)use($connection) {
                    $connection->send(self::cleanText($data));
                };
                $connection->process_stdout->onClose = function($process_connection)use($connection) {
                    $connection->close();
                };
                $connection->process_stdin = new \Workerman\Connection\TcpConnection($pipes[2]);
                $connection->process_stdin->onMessage = function($process_connection, $data)use($connection) {
                    $connection->send(self::cleanText($data));
                };                
            } else {
                fwrite($connection->pipes[0], $data);
            }
        };

        $worker->onClose = function($connection) use ($worker) {
            if (!empty($connection->process)) {
                $connection->process_stdin->close();
                $connection->process_stdout->close();
                fclose($connection->pipes[0]);
                $connection->pipes = null;
                proc_terminate($connection->process);
                proc_close($connection->process);
                $connection->process = null;

                if (count($worker->connections)==1) {
                    echo "dying since last...\n";
                    \posix_kill(\file_get_contents(static::$pidFile), \SIGINT);
                }
            }
        };

        $worker->onWorkerStop = function($worker) {
            foreach($worker->connections as $connection) {
                $connection->close();
            }
        };

    }
}

$current_user = posix_getpwuid(posix_getuid())['name'];
Worker::$pidFile = __DIR__."/cache/".$current_user.".pid";
Worker::$portFile = __DIR__."/cache/".$current_user.".port";
Worker::$logFile = __DIR__."/cache/".$current_user.".log";
Worker::createWorker();
Worker::runAll();