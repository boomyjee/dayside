<?php 

namespace GitWebCommit;

class Git {
    
    public $dir;
    public $error = false;
    public $content = false;
    
    function __construct($path) {        
        $this->dir = $path;
    }
    
    function run_command($array_args) {
        $args = "";
        foreach($array_args as $v)
            $args .= ' '. escapeshellarg($v);
        
        $descriptorspec = array(
            0 => Array ('pipe', 'r'),  // stdin
            1 => Array ('pipe', 'w'),  // stdout
            2 => Array ('pipe', 'w'),  // stderr
        );

        $pipes = Array ();
        
        $process = proc_open('git '.$args, $descriptorspec, $pipes, $this->dir);

        if (is_resource($process)) {
            stream_set_blocking($pipes[0], 1);
            stream_set_blocking($pipes[1], 1);
            stream_set_blocking($pipes[2], 1);
        }
        
        $this->content = stream_get_contents($pipes[1]);        
        $this->error = stream_get_contents($pipes[2]);
        
        fclose($pipes[0]);
        fclose($pipes[1]);
        fclose($pipes[2]);
        proc_close($process);
        
        return $this->content;
    }
    
    function rev_parse($ref) {
        return trim($this->run_command(array("rev-parse", "--short", $ref)));
    }
    
    function show_file($file,$ref) {
        return $this->run_command(array("show", $ref.":".$file));
    }
    
    function stage_all() {
        return $this->run_command(array("add", "-A"));
    }
    
    function unstage($file) {
        return $this->run_command(array('reset', "HEAD", "--", $file));
    }
    
    function stage($file) {
        if (file_exists($this->dir."/".$file)){                
            return $this->run_command(array('add', $file));
        } else {
            return $this->run_command(array('rm', $file));
        }        
    }
    
    function checkout_file($file_status) {
        $file = $file_status['file'];
        $old_file = @$file_status['old_file'];
        
        if($old_file){
            $this->run_command(array('reset', "HEAD", "--", $old_file));
            $this->run_command(array("checkout", "--", $old_file));
        }        
        
        $this->run_command(array('reset', "HEAD", "--", $file));
        $this->run_command(array("checkout", "-f", "--", $file));
        $this->run_command(array("clean", "-f", $file));
    }
    
    function current_branch() {
        $branches = $this->run_command(array("branch"));
        $arr_branches = preg_split("/\n/", $branches, -1, PREG_SPLIT_NO_EMPTY);
        foreach($arr_branches as $branch){
            if(substr($branch,0,1) == "*"){
                $result=trim(substr($branch,2));
            }
        }
        return $result;
    }    
    
    function switch_branch($branch_name) {
        return $this->run_command(array('checkout', '--quiet', $branch_name)); 
    }
        
    function get_branches() {
        $branches = $this->run_command(array("branch"));
        $arr_branches = preg_split("/\n/", $branches, -1, PREG_SPLIT_NO_EMPTY);
        $result = array();
        foreach($arr_branches as $branch){
            $result[]=trim(substr($branch,2));
        }
        return $result;
    }
    
    function last_commits($name_branch, $count, $skip=false) { 
        $git_output = $this->run_command(array_merge(
            ['log', '--max-count='.$count], $skip ? ['--skip='.$skip] : [],
            ['--pretty=format:%h>%H>%cd>%s', '--date=iso8601', $name_branch]
        ));
        return $this->parse_commits($git_output);
    }

    function commits_between($commit_sha1, $commit_sha2) {
        $git_output = $this->run_command(['log', '--pretty=format:%h>%H>%cd>%s', '--date=iso8601', '--ancestry-path', $commit_sha1.'^..'.$commit_sha2]);
        return $this->parse_commits($git_output);
    }

    function parse_commits($git_output) {
        $arr_commits = preg_split("/\n/", $git_output, -1, PREG_SPLIT_NO_EMPTY);
        $result = array();        
        foreach($arr_commits as $commit){
            $arr = explode(">",$commit);
            $result[$arr[1]] = array("sha_short"=>$arr[0],"sha_full"=>$arr[1],"date"=>$arr[2],"message"=>$arr[3]);
        }
        return $result;
    }
    
    function amend($message) {
        $args = $message ? "-m ".escapeshellarg($message) : "--no-edit";
        return $this->run_command(array("commit", "--amend", $args));
    }
    
    function commit($message) {
        return $this->run_command(array("commit", "-m", escapeshellarg($message)));
    }
    
    function diff($one_status,$commit_sha1=false,$commit_sha2=false) {
        $res = array(
            'diff_staged' => '',
            'diff_wt' => ''
        );
        
        if ($commit_sha1 && $commit_sha2) {
            $file_2 = $one_status['file'];
            $file_1 = isset($one_status['old_file']) ? $one_status['old_file'] : $file_2;
            $res['diff_staged'] = $this->run_command(array('diff', '-b', '--ignore-blank-lines', '--find-renames', $commit_sha1, $commit_sha2, '--', $file_1, $file_2)); 
        } 
        else {
            $head_file = @$one_status['old_file']?:$one_status['file'];
            
            if ($one_status['staged']) {
                $res['diff_staged'] = $this->run_command(array('diff', '-b', '--ignore-blank-lines', '--cached', '--find-renames', '--', $one_status['file'],$head_file));
            } else {
                $res['diff_staged'] = "";
            }
            
            if (!$one_status['staged'] || $one_status['partial']) {
                if ($one_status['state'][0]=='?') {
                    $res['diff_wt'] = $this->run_command(array('diff', '-b', '--ignore-blank-lines', '--', '/dev/null', $head_file));
                } else {
                    $res['diff_wt'] = $this->run_command(array('diff', '-b', '--ignore-blank-lines', 'HEAD', '--find-renames', '--', $one_status['file'], $head_file));
                }
            } else {
                $res['diff_wt'] = "";
            }
        }
        return $res;
    }
    
    function history($commit_sha, $name_branch=null,$depth=1) {
        $status = array();
        $status_string = $this->run_command(array("diff", '-b', '--ignore-blank-lines', "--name-status", '--find-renames', $commit_sha."~".$depth, $commit_sha));
        if ($this->error) return $status;
        
        $status_lines = preg_split("/\\r\\n|\\r|\\n/", $status_string, -1,  PREG_SPLIT_NO_EMPTY);        
       
        foreach ($status_lines as $status_line) {
            $str = rtrim($status_line);
            $str = preg_split("/\s/", $str, -1,  PREG_SPLIT_NO_EMPTY); 
            
            $one = array(); 
            $one['state'] = $str[0]; 
            if($one['state'][0]=="R"){                
                $one['old_file'] = $file_1 = $str[1];
                $one['file'] = $file_2 = $str[2];
            } else {
                $one['file'] = $file_1 = $file_2 = $str[1];
            }
            if ($this->error) return $status;
            $status[$one['file']] = $one;
        }
        return $status;
    }
    
    function current_status($file=null) {
        if (!$file) $file = '.';
        $status = array();
        $string = $this->run_command(array("status", "--porcelain", "--untracked-files", $file));
        if ($this->error) return $status;
        
        $lines = preg_split("/\\r\\n|\\r|\\n/", $string, -1,  PREG_SPLIT_NO_EMPTY);        
        
        foreach ($lines as $line) {
            $one = array('partial'=>false);
            $str = rtrim($line);           
            
            $one['state'] = $str[0].$str[1];            
            $one['file'] = substr($str, 3);
            $one['modified'] = filemtime($this->dir."/".$one['file']);
            
            if ($str[0]=='R') {
                $parts = explode('->',$one['file']);
                $one['old_file'] = trim($parts[0]);                
                $one['file'] = trim($parts[1]);
            }
            
            if ($str[0]!=' ' && $str[0]!='?') {
                $one['staged'] = 1;
                if ($str[1]!=' ') $one['partial'] = true;
            } else {
                $one['staged'] = 0;
            }
            
            $status[$one['file']] = $one;
        }        
        return $status;
    }

    public function blame($file, $commit_sha=false) { 
        $content = $this->run_command(array_merge(['blame', '-l', '-n', '--date=iso8601'], $commit_sha ? [$commit_sha] : [], ['--', $file])); 
        $blame_lines = []; 
        foreach (explode("\n", $content) as $line_str) { 
            if (preg_match('#^([^\s]+)\s+(?:[^\s]+\s+?)?(\d+)\s+\((.+)\s+(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2}:\d{2}) \+\d{4}\s+(\d+)\) (.*)#', $line_str, $matches)) { 
                $blame_lines[] = [ 
                    'author' => trim($matches[3]), 
                    'date' => $matches[4], 
                    'commit_sha' => $matches[1],
                    'content' => $matches[7] . PHP_EOL
                ]; 
            } 
        } 
        return $blame_lines;
    }     
}