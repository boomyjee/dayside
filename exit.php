<?      session_start();
        $_SESSION ['logged_user'] = false;
			 	$_SESSION ['auth'] = false;
				$_SESSION ['status'] = false;
        session_unset();
        header('Location: problem.php');

?>