<?php

class Daemon {
    
    private static $instance;
    
	public static function daemonize($pidfile=false) {
		if (self::$instance) {
			echo "Singletons only, please\n";
            exit(0);
		}
        if (PHP_SAPI!=='cli') die();
		self::$instance = new self($pidfile);
	}
    
	private static function showHelp() {
		$cmd = $_SERVER['_'];
		if ($cmd != $_SERVER['PHP_SELF']) {
			$cmd .= ' ' . $_SERVER['PHP_SELF'];
		}
		echo "Usage: $cmd {status|start|stop|restart|reload|kill}\n";
		exit(0);
	}    
    
	private function __construct($pidfile) {
		$this->pidfile = $pidfile ?:__DIR__.'/pid';
		if ($_SERVER['argc'] < 2) {
			self::showHelp();
		}
		switch (strtolower($_SERVER['argv'][1])) {
			case 'start':
			case 'stop':
			case 'status':
            case 'run':
				call_user_func(array($this, $_SERVER['argv'][1]));
			break;
			default:
				self::showHelp();
			break;
		}
	}
    
    function start() {
        if ($pid = $this->isRunning()) {
            echo "Process already started... (pid = $pid)\n";
            exit(0);
        }
        
		echo "Starting...\n";
        
        $args = $_SERVER['argv'];
        $args[0] = realpath($_SERVER['argv'][0]);
        $args[1] = "run";
        
        if (isset($args[2])) {
            $args[2] = escapeshellarg($args[2]);
        }
        
        $path = implode(" ",$args);
        $cmd = PHP_BINDIR."/php ".$path;
        $cmd = '(('.$cmd.') > /dev/null 2>/dev/null)& echo $!';
        
        $pid = (int)shell_exec($cmd);
        file_put_contents($this->pidfile,$pid);
        
        echo "Process pid: $pid\n";
        echo "Success...\n";
        exit(0);
    }
    
    function stop() {
        echo "Sending signal SIGHUP\n";
        $this->terminate(SIGHUP);
        exit(0);
    }
    
    function run() {
        // run original script
    }
    
    function isRunning() {
        $pid = $this->getChildPid();
		if (!$pid) {
            return false;
		}
		if (posix_kill($pid, 0)) {
            return $pid;
		}
		else {
            return false;
		}        
    }
    
    function status() {
        if ($pid = $this->isRunning()) {
            echo "Process (pid $pid) is running...\n";
        } else {
            echo "Process is stopped\n";
        }
        exit(0);
    }
    
	private function terminate($signal,$startpid=false) {
        if ($startpid===false) {
            $pid = $this->getChildPid();
            if (false === $pid) {
                echo "No PID file found\n";
                return;
            }
            if (!posix_kill($pid, 0)) {
                echo "Process $pid not running!\n";
                return;
            }
        } else {
            $pid = $startpid;
        }
        
        exec("ps -ef| awk '\$3 == '$pid' { print  \$2 }'", $output, $ret); 
        if ($ret) return 'you need ps, grep, and awk to kill child processes\n'; 
        while(list(,$t) = each($output)) { 
            if ( $t != $pid ) { 
                $this->terminate($signal,$t);
            } 
        } 
        posix_kill($pid,$signal);
        
		$i = 0;
		while (posix_kill($pid, 0)) { // Wait until the child goes away
			if (++$i >= 10) {
				echo "Process $pid did not terminate after $i seconds\n";
			}
			echo ".";
			sleep(1);
		}
		echo "\nDone\n";
	}    
    
	private function getChildPid() {
		return file_exists($this->pidfile) ? (int)file_get_contents($this->pidfile) : false;
	}   
}
