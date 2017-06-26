<?php
// вход адміна
	$data = $_POST;
	if (isset($data['do_login' ]) )
	{
		$errors = array();
		$user = R::findOne('users','login = ?', array($data['login']));
		if( $user )
		{
			//логін існує!
			 if( array($data['password'] == $user->password)) {
			 	// все чудово, логіним користувача
			 	$_SESSION ['logged_user'] = $user;
			 	$_SESSION ['auth'] = true;
				$_SESSION ['status'] = $user['status'];
			 	echo '<div style="color: green;">Ви авторизовані!<br></div><hr>';
			 	
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


// фунція відправки задачі в базу
    $data = $_POST;
	if (isset($data['do_send']) )
	{
		 //перевіряємо правильність вводу даних 

		$errors = array(); // масив помилок
        // перевірка чи введено імя
		if( trim($data['username']) == '')
		{
			$errors[] = 'Введіть імя!';
		}

        //перевірка чи введено email
		if( trim($data['email']) == '')
		{
			$errors[] = 'Введіть email!';
		}

        //перевірка чи введено задачу
		if( trim($data['message']) == '')
		{
			$errors[] = 'Введіть умову задачі!';
		}
		//функція обробки зображення
		/*
		// Пути загрузки файлов
		$path = 'img/';
		$tmp_path = 'tmp/';
		// Массив допустимых значений типа файла
		$types = array('image/gif', 'image/png', 'image/jpeg');
		// Максимальный размер файла
		$size = 1024000;

		// Проверяем тип файла
		if (!in_array($_FILES['picture']['type'], $types))
			die('<p>Запрещённый тип файла. <a href="?">Попробовать другой файл?</a></p>');

		// Проверяем размер файла
		if ($_FILES['picture']['size'] > $size)
			die('<p>Слишком большой размер файла. <a href="?">Попробовать другой файл?</a></p>');

		// Функция изменения размера
		// Изменяет размер изображения в зависимости от type:
		//	type = 1 - эскиз
		// 	type = 2 - большое изображение
		//	rotate - поворот на количество градусов (желательно использовать значение 90, 180, 270)
		//	quality - качество изображения (по умолчанию 75%)
		function resize($file, $type = 1, $rotate = null, $quality = null)
		{
			global $tmp_path;

			// Ограничение по ширине в пикселях
			$max_thumb_size = 200;
			$max_size = 600;
		
			// Качество изображения по умолчанию
			if ($quality == null)
				$quality = 75;

			// Cоздаём исходное изображение на основе исходного файла
			if ($file['type'] == 'image/jpeg')
				$source = imagecreatefromjpeg($file['tmp_name']);
			elseif ($file['type'] == 'image/png')
				$source = imagecreatefrompng($file['tmp_name']);
			elseif ($file['type'] == 'image/gif')
				$source = imagecreatefromgif($file['tmp_name']);
			else
				return false;
				
			// Поворачиваем изображение
			if ($rotate != null)
				$src = imagerotate($source, $rotate, 0);
			else
				$src = $source;

			// Определяем ширину и высоту изображения
			$w_src = imagesx($src); 
			$h_src = imagesy($src);

			// В зависимости от типа (эскиз или большое изображение) устанавливаем ограничение по ширине.
			if ($type == 1)
				$w = $max_thumb_size;
			elseif ($type == 2)
				$w = $max_size;

			// Если ширина больше заданной
			if ($w_src > $w)
			{
				// Вычисление пропорций
				$ratio = $w_src/$w;
				$w_dest = round($w_src/$ratio);
				$h_dest = round($h_src/$ratio);

				// Создаём пустую картинку
				$dest = imagecreatetruecolor($w_dest, $h_dest);
				
				// Копируем старое изображение в новое с изменением параметров
				imagecopyresampled($dest, $src, 0, 0, 0, 0, $w_dest, $h_dest, $w_src, $h_src);

				// Вывод картинки и очистка памяти
				imagejpeg($dest, $tmp_path . $file['name'], $quality);
				imagedestroy($dest);
				imagedestroy($src);

				return $file['name'];
			}
			else
			{
				// Вывод картинки и очистка памяти
				imagejpeg($src, $tmp_path . $file['name'], $quality);
				imagedestroy($src);

				return $file['name'];
			}
		}

		$name = resize($_FILES['picture'], $_POST['file_type'], $_POST['file_rotate']);

		// Загрузка файла и вывод сообщения
		if (!@copy($tmp_path . $name, $path . $name))
			echo '<p>Что-то пошло не так.</p>';
		else
			echo '<p>Загрузка прошла удачно <a href="' . $path . $_FILES['picture']['name'] . '">Посмотреть</a>.</p>';

		// Удаляем временный файл
		unlink($tmp_path . $name);
		*/



		if( empty($errors) ) // якщо масив errors чистий
		{
			//все добре, можна створити задачу.
			$user = R:: dispense ('problem');
			$user-> login = $data['username'];
			$user-> email = $data['email'];
			$user-> message = $data['message'];
    		$user-> join_date = date('Y-m-d H:i:s');
			$user-> status = '0';
			R::store($user);
            

            echo '<div class="container text-success">Ваша задача успішно створенна!</div><hr>';
		}else
		{
			echo '<div class="container text-danger">'.array_shift($errors).'</div><hr>';

		}

	}
		$data = $_POST;
		if (isset($data['do_reg']) ) {
			
			$user = R::load('problem', $user['id']);
			R::store($user);
		 var_dump($user); 
		}
		
	


?>