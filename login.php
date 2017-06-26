<?
require "include/db.php";

	$data = $_POST;
	if (isset($data['do_login' ]) )
	{
		$errors = array();
		$user = R::findOne('users','login = ?', array($data['login']));
		if( $user )
		{
			//логін існує!
			 if( password_verify($data['password'], $user->password)) {
			 	// все чудово, логіним користувача
			 	$_SESSION ['logged_user'] = $user;
			 	$_SESSION ['auth'] = true;
				$_SESSION ['status'] = $user['status'];
				echo '<script type="text/javascript">
					window.location = "index.php"
					</script>';
			 	//echo '<div style="color: green;">Ви авторизовані!<br></div><hr>';
			 	
			 }else
			 {

			 	$errors[] = 'Невірно введений пароль!';
			 }
		} else
		{
			$errors[] = 'Користувач з таким логіном не знайдено!';
		}

			if( ! empty($errors) )
		{
			$error = $errors;
		}
	}

?>