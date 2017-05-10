<?php 

namespace GitWebCommit;
    
require_once __DIR__."/git.php";

class Controller {
    
    function __construct($path) {
          
        if(!file_exists($path."/.git")){ 
            echo "<div class='ui-state-error'>ERROR: Git not found. Please select other folder.</div>";
            die();
        }
        
        $hashErrorMessage = 'Status hash differs. Please, reload page.';
                         
        $this->model = new Git($path);
        $this->data = array();
        $this->data['error'] = false;
        $this->data['selected_commit_sha'] = false;
        $this->data['history_depth'] = 1;
        
        $action = @$_POST['action'];
        if ($action=='refresh') $action = $_POST['previous_view_type'];
        if ($action=='show_file') return $this->$action();

        $this->data['current_branch'] = $this->model->current_branch(); 
        $this->data['show_diffs'] = @$_POST['show_diffs']?:[];
        $this->working_tree();

        if ($action && method_exists($this,$action)) {
            if ($action=='working_tree') $this->$action();
            elseif ($action=='history') $this->$action();
            else {
                if ($this->data['status_hash']!=@$_POST['status_hash']) {
                    $this->data['error'] = $hashErrorMessage;
                } else {
                    $this->$action();                      
                }      
            }
        }

        $ajax_action = @$_POST['ajax_action'];
        if ($ajax_action && method_exists($this,$ajax_action)) {
            if ($ajax_action=='diff' && !empty($_POST['commit_sha1']) && !empty($_POST['commit_sha2'])) $this->$ajax_action();
            else {
                if ($this->data['status_hash']!=@$_POST['status_hash']) {
                    echo json_encode(array('error' => $hashErrorMessage));
                } else {
                    $this->$ajax_action();
                }
            }
            die();
        }
            
        extract($this->data);
		require_once __DIR__."/template.php";
	}
    
    function show_file() {
        $ref = $_POST['ref'];
        if ($ref=="index") $ref = "";
        echo $this->model->show_file($_POST['file'],$ref);
    }
    
    function working_tree(){
        if ($this->data['error']) return;
        
        $this->data['view_type'] = 'working_tree';
        $this->data['all_branches'] = $this->model->get_branches(); 
        $this->data['status'] = $this->model->current_status();
        $this->data['status_hash'] = sha1(json_encode($this->data['status']));
        if(!empty($this->data['status'])){
            $this->data['error'] = $this->model->error;
        }
    }
    
    function history(){  
        $name_branch = @$_POST['selected_branch'];
        if(!$name_branch){
            $name_branch = $this->data['current_branch'];
        }
        $this->data['history_depth'] = $history_depth = @$_POST['history_depth'] ?: 1;
        
        $commits = $name_branch ? $this->model->last_commits(30,$name_branch) : array();
        $commit_sha = @$_POST['selected_commit'];
        if (!isset($commits[$commit_sha])) $commit_sha = @array_shift(array_keys($commits));
        
        $last_commits = array();
        $after_commits = array();
        $after_current = false;
        foreach ($commits as $sha=>$one) {
            $one['excerpt'] = strlen($one['message'])<100 ? $one['message'] : substr($one['message'],0,100)."...";
            if (count($last_commits)<15) $last_commits[] = $one;
            if ($after_current && count($after_commits)<15) $after_commits[] = $one;
            if ($sha==$commit_sha) $after_current = true;
        }
        
        $this->data['view_type'] = 'history';    
        $this->data['current_branch'] = $name_branch;
        $this->data['last_commits'] = $last_commits;
        $this->data['after_commits'] = $after_commits;
        $this->data['selected_commit_sha'] = $commit_sha;
        $this->data['status'] = $commit_sha ? $this->model->history($commit_sha, $name_branch, $history_depth) : array();
        $this->data['error'] = $this->model->error;
    }
        
    function stage_all(){
        $this->model->stage_all();
        $this->data['error'] = $this->model->error;
        $this->working_tree();
    }    
    
    function amend(){
        $message = @$_POST['message'];
        $this->model->amend($message);
        $this->data['error'] = $this->model->error;
        $this->working_tree();
    }
    
    function commit(){
        $message = @$_POST['commit_message'];
        if (!$message) {            
            $this->data['error'] = 'Empty commit message';
            return;
        }   
        
        $counter_staged_files = 0;
        foreach($this->data['status'] as $one_status){
            $one_status['staged'] ? $counter_staged_files++ : '';
        }
        if ($counter_staged_files==0) {
            $this->data['error'] = "Nothing to commit";
            return;
        }
        $this->model->commit($message);
        $this->data['error'] = $this->model->error;
        $this->working_tree();
    }  
    
    function switch_branch(){    
        $name_branch = @$_POST['selected_branch'];
        $this->model->switch_branch($name_branch);
        if(!$this->model->error){
            $this->data['current_branch'] = $name_branch;
        }
        $this->data['error'] = $this->model->error;
        $this->working_tree();
    }    
    
    function change_staged() {
        $res = array('error'=>'');
        $old_file = false;
        
        if ($_POST['stage_file']) {
            $this->model->stage($_POST['file']);
        } else {            
            if(@$this->data['status'][$_POST['file']]['state'][0]=="R" && @$this->data['status'][$_POST['file']]['state'][1]==" "){
                $old_file = $this->data['status'][$_POST['file']]['old_file'];
                $this->model->unstage($_POST['file']);
                $this->model->unstage($old_file);
            } 
            elseif (@$this->data['status'][$_POST['file']]['state'][0]=="R" && @$this->data['status'][$_POST['file']]['state'][1]!=" ") {
                $old_file = $this->data['status'][$_POST['file']]['old_file'];
                $this->model->unstage($old_file);
            } else {
                $this->model->unstage($_POST['file']);
            }
            
        }
        $res['error'] = $this->model->error;
        
        $this->working_tree();
        $res['status_hash'] = $this->data['status_hash'];        
        $res['state'] = $this->data['status'][$_POST['file']]['state'];
        $res['staged'] = $this->data['status'][$_POST['file']]['staged'];
        $res['status'] = $this->data['status'][$_POST['file']];
        if($_POST['need_diff']) {
            $res['diff_html'] = $this->diff_html($this->data['status'][$_POST['file']]);
        }
        
        $status = $this->data['status'];
        
        if ($old_file) {
            $res['extra_status'][0] = $this->data['status'][$_POST['file']];
            $res['extra_status'][0]['diff'] = $this->diff_html($this->data['status'][$_POST['file']]);
            $res['extra_status'][1] = $this->data['status'][$old_file];
            $res['extra_status'][1]['diff'] = $this->diff_html($this->data['status'][$old_file]);
        } else {
            foreach ($status as $one_status) {
                if($one_status['state'][0]=="R" && ($one_status['file']==$_POST['file'] || $one_status['old_file']==$_POST['file'])){
                    $res['extra_status'][0] = $one_status;
                    $res['extra_status'][0]['diff'] = $this->diff_html($one_status);
                    break;
                }                          
            } 
        }       
        echo json_encode($res);
    }
    
    function checkout_file(){
        $res = array('error'=>'');
        
        $this->model->checkout_file($this->data['status'][$_POST['file']]);
        
        $res['error'] = $this->model->error;            
        $this->working_tree();
        $res['status_hash'] = $this->data['status_hash'];        
        echo json_encode($res);
    }
    
    function diff() {
        $commit_sha1 = @$_POST['commit_sha1'];
        $commit_sha2 = @$_POST['commit_sha2'];
        $one_status = json_decode($_POST['one_status'],true);
        
        $res = array();
        if ($this->model->error) {
            $res['error'] = $this->model->error;
        } else {
            $res['diff_html'] = $this->diff_html($one_status,$commit_sha1,$commit_sha2);
        }
        echo json_encode($res);
    }
        
        
    function diff_html($one_status,$commit_sha1="",$commit_sha2="") {
        
        $wt_status = @$this->data['status'][$one_status['file']];
        $diff = $this->model->diff($one_status,$commit_sha1,$commit_sha2);
        
        $lines_staged = $diff['diff_staged'] ? explode("\n",$diff['diff_staged']) : array();
        $lines_wt = $diff['diff_wt'] ? explode("\n",$diff['diff_wt']) : array();

        $add = false;
        $del = false;
        
        $diff_html = "<div class='delta code-text' data-filename='".$one_status['file']."'>";

        foreach (array('staged'=>$lines_staged,'wt'=>$lines_wt) as $line_src => $lines) {
            
            if(empty($lines)) continue;
            
            $was_header = false;
            $staged = ($line_src=='staged') ? 'staged' : '';
            
            $part_1 = $part_2 = $part_3 = null;
            
            foreach($lines as $line) {
                
                if(empty($line)) continue;
                
                $add_str = "";
                $del_str = "";
                $class = "context";

                if("@@" == substr($line, 0, 2)){
                    preg_match('/\d+,\d+\s\+\d+,\d+/', $line, $info);
                    $info_line = explode(' ', $info[0]);
                    $counter_add = explode(',', $info_line[0]);
                    $counter_del = explode(',', $info_line[1]);
                    $counter_del[0] = substr($counter_del[0], 1);

                    $add = ($counter_add[0] == 0) ? 1 : $counter_add[0];
                    $del = ($counter_del[0] == 0) ? 1 : $counter_del[0];
                    $was_header = true;
                    $class = "info";
                }

                if ($line[0]=="\\") continue;
                if (!$was_header) {
                    if (strpos($line,"diff")===0) continue;
                    if (strpos($line,"index")===0) continue;
                    if (strpos($line,"+++")===0) continue;
                    if (strpos($line,"---")===0) continue;
                    $class = "pre_header";
                    $out = $line;
                } else {
                    if ($line[0]==" " || $line[0]=="+") $add_str = $del++;
                    if ($line[0]==" " || $line[0]=="-") $del_str = $add++;
                    if ($line[0]=="+") $class = "insert";
                    if ($line[0]=="-") $class = "delete";
                    $out = substr($line,1);
                }
                
                $part_1 .= "<div class='$class'> ".$del_str." </div>";
                $part_2 .= "<div class='$class'> ".$add_str." </div>";                
                $part_3 .= "<div class='$class'>".htmlspecialchars(rtrim($out))." </div>";
                
            }
            
            $parts = array();
            if ($commit_sha1 && $commit_sha2) {
                if (!isset($last_commit)) {
                    $last_sha = $this->model->rev_parse("HEAD");

                    $commit_sha1 = $this->model->rev_parse($commit_sha1);
                    $commit_sha2 = $this->model->rev_parse($commit_sha2);
                }
                
                $parts[0] = $commit_sha1;
                $parts[1] = $commit_sha2;
                
                foreach ($parts as &$sha) {
                    if ($last_sha==$sha && !$wt_status) $sha = 'WT';
                }
            } 
            else {
                if ($staged) {
                    $parts[0] = 'HEAD';
                    $parts[1] = 'index';
                } else {
                    $parts[0] = 'HEAD';
                    $parts[1] = 'WT';
                }
            }
            
            $diff_html .= "<div class='hunk' data-parts='".json_encode($parts)."'>";
            $diff_html .= "<div class='$staged number_del ui-state-default'>".$part_1."</div>";
            $diff_html .= "<div class='$staged number_add ui-state-default'>".$part_2."</div>";
            $diff_html .= "<div class='$staged diff_line ui-state-default'>".$part_3."</div>";
            $diff_html .= "</div>";
        }
        
        $diff_html .= "</div>";
        
        return $diff_html;
    }
}