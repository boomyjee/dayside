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
        $this->working_tree();
        $this->data['current_branch'] = $this->model->current_branch(); 
        
        $action = @$_POST['action'];
        if ($action=='refresh') $action = $_POST['previous_view_type'];
        
        if ($action && method_exists($this,$action)) {
            if ($this->data['status_hash']!=@$_POST['status_hash'] && $action!='working_tree' && $action!='history') {
                $this->data['error'] = $hashErrorMessage;
            } else {
                $this->$action();                      
            }      
        }   
        
        $ajax_action = @$_POST['ajax_action'];
        if ($ajax_action && method_exists($this,$ajax_action)) {
            if ($this->data['status_hash']!=@$_POST['status_hash']) {
                echo json_encode(array('error' => $hashErrorMessage));
            } else {
                $this->$ajax_action();
            }
            die();
        }
            
        extract($this->data);
		require_once __DIR__."/template.php";
	}
    
    function working_tree(){
        if ($this->data['error']) return;
        
        $this->data['view_type'] = 'working_tree';
        $this->data['all_branches'] = $this->model->get_branches(); 
        $this->data['commits'] = $this->model->last_15_commits();
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
        
        $commit_sha = @$_POST['selected_commit'];
        if(!$commit_sha){ 
            $commit_sha = $this->model->last_commit_in_branch($name_branch);
        }
        
        $this->data['view_type'] = 'history';    
        $this->data['selected_commit'] = substr($commit_sha,0,7);
        $this->data['current_branch'] = $name_branch;
        $this->data['commits'] = $this->model->last_15_commits($name_branch);
        $this->data['status'] = $this->model->history($commit_sha, $name_branch);
        $this->data['error'] = $this->model->error;
    }
        
    function stage_all(){
        $this->model->stage_all();
        $this->data['error'] = $this->model->error;
        $this->working_tree();
    }
        
    function amend(){
        $this->model->amend();
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
        
        
    function diff_html($one_status,$commit_sha1,$commit_sha2) {
        $diff = $this->model->diff($one_status,$commit_sha1,$commit_sha2);
        
        $lines_staged = $diff['diff_staged'] ? explode("\n",$diff['diff_staged']) : array();
        $lines_wt = $diff['diff_wt'] ? explode("\n",$diff['diff_wt']) : array();

        $add = false;
        $del = false;

        $diff_html = " <td colspan='5'><table class='delta CodeMirror cm-s-no-direct-theme' data-filename='".$one_status['file']."'><tbody>";

        foreach (array('staged'=>$lines_staged,'wt'=>$lines_wt) as $line_src => $lines) {
            $was_header = false;
            $partial_staged = ($line_src=='staged' && !empty($lines_wt)) ? 'partial_staged' : '';
            foreach($lines as $line) {
                $add_str = "";
                $del_str = "";
                $tr_class = "context";

                if("@@" == substr($line, 0, 2)){
                    preg_match('/\d+,\d+\s\+\d+,\d+/', $line, $info);
                    $info_line = explode(' ', $info[0]);
                    $counter_add = explode(',', $info_line[0]);
                    $counter_del = explode(',', $info_line[1]);
                    $counter_del[0] = substr($counter_del[0], 1);

                    $add = ($counter_add[0] == 0) ? 1 : $counter_add[0];
                    $del = ($counter_del[0] == 0) ? 1 : $counter_del[0];
                    $was_header = true;
                    $tr_class = "info";
                }

                if (!$was_header) continue;
                if ($line[0]=="\\") continue;

                if ($line[0]==" " || $line[0]=="+") $add_str = $add++;
                if ($line[0]==" " || $line[0]=="-") $del_str = $del++;
                if ($line[0]=="+") $tr_class = "insert";
                if ($line[0]=="-") $tr_class = "delete";

                $diff_html .= "<tr class='$tr_class $partial_staged'>
                                   <td class='number_del ui-state-default'>$del_str</td>
                                   <td class='number_add ui-state-default'>$add_str</td> 
                                   <td class='diff_line ui-state-default'>".htmlspecialchars($line)."</td>
                              </tr>";
            }

        }
        $diff_html .= "</tbody></table></td>";
        return $diff_html;
    }
}