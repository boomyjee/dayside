<?
if(isset($_POST)){
if(isset($_POST['quantitative'])){
	$info_rows = $_POST['quantitative'];
	$info_id = array();
	$file = 'feadbacks.txt';
	for($i=0; $i<$info_rows; $i++){
		if($i==0){
			$name_id = 'name_';
			$email_id = 'email_';
			$text_id = 'text_';
			$date_id = 'date_';
		} else{
			$name_id = 'name_'.$i;
			$email_id = 'email_'.$i;
			$text_id = 'text_'.$i;
			$date_id = 'date_'.$i;
		}
		$name = $_POST[$name_id];
		$email = $_POST[$email_id];
		$text = $_POST[$text_id];
		$date = $_POST[$date_id];
		$current .= "name: ".$name."; email: ".$email."; text: ".$text."; date: ".$date;
	}	
	file_put_contents($file, $current, LOCK_EX);
} else {
	$info_length = count($_POST);
	$name = $_POST['name'];
	$email = $_POST['email'];
	$text = $_POST['text'];
	$date = $_POST['date'];
	foreach ($_POST as $key => $value){
		echo $key.":".$_POST[$key]."</br> ";
	}
	$file = 'feadbacks.txt';
	$current = "name: ".$name."; email: ".$email."; text: ".$text."; date: ".$date."\n";
	file_put_contents($file, $current, FILE_APPEND);
}
}


?>
