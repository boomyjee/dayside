<?
if(isset($_POST))

$login = $_POST['login'];
$password = $_POST['password'];

if($login == "admin" & $password == 123){


	$file = fopen("feadbacks.txt", "r");
	while(! feof($file)){
		$info = fgets($file);
		$info = explode("; ",$info);
		$name = $info[0];
		$email = $info[1];
		$text = $info[2];
		$date = $info[3];
		$feadbacks[$i][0] = str_replace( "name: ", "", $name);
		$feadbacks[$i][1] = str_replace( "email: ", "", $email);
		$feadbacks[$i][2] = str_replace( "text: ", "", $text);
		$feadbacks[$i][3] = str_replace( "date: ", "", $date);
		$i++;
	}
	fclose($file);

	echo "<form method='post' action='send.php' >";
	foreach ($feadbacks as $row => $col){
		echo "<textarea name='name_".$row."'>".$feadbacks[$row][0]."</textarea>";
		echo "<textarea name='email_".$row."'>".$feadbacks[$row][1]."</textarea>";
		echo "<textarea name='text_".$row."'>".$feadbacks[$row][2]."</textarea>";
		echo "<textarea name='date_".$row."'>".$feadbacks[$row][3]."</textarea>";
		echo "</br>";
	}

	echo "<input name='quantitative' value='".$row."' style='display: none;'>";
	echo "<input type='submit' value='отправить' >";
	echo "</form>";


}



?>
