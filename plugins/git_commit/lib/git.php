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
        
        foreach($array_args as $v)
            $args .= ' '. escapeshellarg($v);

        $command = escapeshellcmd($command);
        
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
    
    function last_15_commits($name_branch=null) {
        $commits = $this->run_command(array('log', '-15', '--pretty=format:%h>%H>%s', $name_branch));
        $arr_commits = preg_split("/\n/", $commits, -1, PREG_SPLIT_NO_EMPTY);
        $result = array();        
        foreach($arr_commits as $commit){
            $arr = explode(">",$commit);
            $result[] = array("sha_short"=>$arr[0],"sha_full"=>$arr[1],"message"=>$arr[2]);
        }
        return $result;
    }
    
    function commit($message) {
        return $this->run_command(array("commit", "-m", escapeshellarg($message)));
    }
    
    function last_commit_in_branch($branch_name=null) {
        return $this->run_command(array('log', '--pretty=format:%H', '-1', $branch_name)); 
    }
    
    function history($commit_sha, $name_branch=null) {
        $status = array();
        $string = $this->run_command(array("diff", "--name-status", '--find-renames', $commit_sha."^", $commit_sha));
        if ($this->error) return $status;
        
        $lines = preg_split("/\\r\\n|\\r|\\n/", $string, -1,  PREG_SPLIT_NO_EMPTY);        
       
        foreach ($lines as $line) {
            $str = rtrim($line);
            $str = preg_split("/\s/", $str, -1,  PREG_SPLIT_NO_EMPTY); 
            $one = array(); 
            $one['state'] = $str[0]; 
            if(substr($one['state'],0,1)=="R"){                
                $one['old_file'] = $file_1 = $str[1];
                $one['file'] = $file_2 = $str[2];
            } else {
                $one['file'] = $file_1 = $file_2 = $str[1];
            }
            $one['diff_staged'] = $this->run_command(array('diff', $commit_sha."^", $commit_sha, '--', $file_1, $file_2)); 
            $one['diff_wt'] = '';

            if ($this->error) return $status;
            $status[$one['file']] = $one;
        }
        
        return $status;
    }
    
    function current_status($file=null) {
        $status = array();
        $string = $this->run_command(array("status", "--porcelain", "--untracked-files", $file));
        if ($this->error) return $status;
        
        $lines = preg_split("/\\r\\n|\\r|\\n/", $string, -1,  PREG_SPLIT_NO_EMPTY);        
        
        foreach ($lines as $line) {
            $one = array('partial'=>false);
            $str = rtrim($line);           
            
            if ($str[0]!=' ' && $str[0]!='?') {
                $one['staged'] = 1;
                if ($str[1]!=' ') $one['partial'] = true;
            } else {
                $one['staged'] = 0;
            }
            
            $one['state'] = $str[0].$str[1];            
            $one['file'] = substr($str, 3);
            
            if ($one['staged']) {
                $old_file = @$one['old_file']?:'';
                $one['diff_staged'] = $this->run_command(array('diff', '--cached', '--find-renames', '--', $one['file'],$old_file));
            } else {
                $one['diff_staged'] = "";
            }
            if (!$one['staged'] || $one['partial']) {
                if ($str[0]=='?') {
                    $one['diff_wt'] = $this->run_command(array('diff', '--', '/dev/null', $one['file']));
                } else {
                    $one['diff_wt'] = $this->run_command(array('diff', 'HEAD', '--', $one['file']));
                }
            } else {
                $one['diff_wt'] = "";
            }
            $status[$one['file']] = $one;
        }        
        return $status;
    }
    
    /* ------------------------------------------------
                           OBSOLETE
    --------------------------------------------------- */
    function diff_format_range($start, $count){
        if($count == 1){
            return $start;
        }else{
            return $start.",".$count;
        }
    }

    function diff_format_hunk_header($old_start, $old_count, $new_start, $new_count, $heading=''){
        $old = $this->diff_format_range($old_start, $old_count);
        $new = $this->diff_format_range($new_start, $new_count);        
        return '@@ -'.$old.' +'.$new.' @@'.$heading.'';
    }
    
    function diff_parse($diff_text){
    
        $hunks = array();
        $lines = explode("\n",$diff_text);
        
        foreach ($lines as $line_idx=>$line) {
            preg_match('/^@@ -([0-9,]+) \+([0-9,]+) @@(.*)/',$line,$match);
            if ($match) {
                list($old_start, $old_count) = $this->diff_parse_range_str($match[1]);
                list($new_start, $new_count) = $this->diff_parse_range_str($match[2]);
                $heading = $match[3];

                $hunks[] = $last_hunk = (object)array(
                    'old_start' => $old_start,
                    'old_count' => $old_count,
                    'new_start' => $new_start,
                    'new_count' => $new_count,
                    'heading' => $heading,
                    'first_line_idx' => $line_idx,
                    'lines' => array($line)
                );
            } elseif ($line_idx==0) {
                $this->error = "Parse diff error";
            } elseif ($line) {
                $last_hunk->lines[] = $line;
            }
        }
        
        return $hunks;                    
    }
    
    function diff_parse_range_str($range_str){
    
        if (strpos(",",$range_str)!==false) {
            list($begin,$end) = explode(",",$range_str,2);
            return array((int)$begin,(int)$end);
        } else {
            return array((int)$range_str,1);
        }
    }
    
    
    function diff_generate_patch($file, $first_line_idx, $last_line_idx){        
        
        
        echo "<pre>";
        $diff_text = $this->run_command(array('diff', $file));
        
        define('ADDITION', '+');
        define('DELETION', '-');
        define('CONTEXT', ' ');
        define('NO_NEWLINE', '\\');
        
        /*
        const ADDITION = '+';
        const DELETION = '-';
        const CONTEXT = ' ';
        const NO_NEWLINE = '\\';
        */
        
        $lines = array('--- a/'.$file, '+++ b/'.$file);
        
        $start_offset = 0;
        
        $hunks = $this->diff_parse($diff_text);
        
        foreach($hunks as $hunk){
            $hunk_last_line_idx = $hunk->first_line_idx + count($hunk->lines) - 1;
            
            if($hunk_last_line_idx < $first_line_idx){
                continue;
            }
            if($hunk->first_line_idx > $last_line_idx){
                break;
            }
            
            $prev_skipped = false;
            $counts = array();
            $filtered_lines = array();
            
            foreach ($hunk->lines as $line_idx => $line){
                if ($line_idx==0) continue;
                
                $line_type = substr($line,0,1);
                $line_content = substr($line,1);
                               
                if (!($first_line_idx <= $line_idx && $line_idx <= $last_line_idx)){
                  
                    if($line_type == ADDITION){
                        // Skip additions that are not selected.
                        $prev_skipped = true;
                        continue;
                    }elseif($line_type == DELETION){
                        // Change deletions that are not selected to context.
                        $line_type = CONTEXT;
                    }
                }
                
                if ($line_type == NO_NEWLINE && $prev_skipped){
                    // If the line immediately before a "No newline" line was
                    // skipped (because it was an unselected addition) skip
                    // the "No newline" line as well.
                    continue;
                }
                
                $filtered_lines[] = $line_type.$line_content;
                $counts[$line_type] += 1;
                $prev_skipped = false;                 
            }
            
            // Do not include hunks that, after filtering, have only context
            // lines (no additions or deletions).
            if (!$counts[ADDITION] && !$counts[DELETION]){
                continue;
            }

            $old_count = $counts[CONTEXT] + $counts[DELETION];
            $new_count = $counts[CONTEXT] + $counts[ADDITION];
            
            $old_start = $hunk->old_start;
            $new_start = $old_start + $start_offset;
            if($old_count == 0){
                $new_start += 1;
            }
            if($new_count == 0){
                $new_start -= 1;
            }

            $start_offset += $counts[ADDITION] - $counts[DELETION];
            
            $lines[] = $this->diff_format_hunk_header($old_start, $old_count, $new_start, $new_count, $hunk->heading);
            foreach ($filtered_lines as $line) $lines[] = $line;
        }
               
        // If there are only two lines, that means we did not include any hunks,
        // so return null.
        if (count($lines) == 2){
            return null;
        } else {
            $patch_apply =  implode("\n",$lines);
            $patch_apply = $patch_apply."\n";
            
            /*echo"<pre>";
            print($f."\n");
            echo"<pre>";
            die;
            */

            $handle = fopen($this->dir."/".$file.".patch", "w");
            fwrite($handle, $patch_apply);
            fclose($handle);
            
            
        }
    }  
    
}