<!DOCTYPE html> 



<head>
	<script src="//code.jquery.com/jquery-1.11.3.min.js"></script>
	<link href="styles.css" rel="stylesheet" type="text/css" />
	
</head>
<body>

<?


//	1) Сделать форму обратной связи. 
//	1.1. Загрузить все отзывы
$feadbacks = array();
$i = 0;
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

//	Отзывы можно сортировать по имени автора, e-mail и дате добавления (по умолчанию - по дате, последние наверху).
//	сортировать по дате
function array_sort_by_column(&$arr, $col, $dir = SORT_DESC) {
    $sort_col = array();
    foreach ($arr as $key=> $row) {
        $sort_col[$key] = $row[$col];
    }
    array_multisort($sort_col, $dir, $arr);
}
array_sort_by_column($feadbacks, 3);



//	На странице должны быть показаны все оставленные отзывы, под ними форма: Имя, E-mail, текст сообщения, кнопки "Предварительный просмотр" и "Отправить".
//	1.2. Опубликовать все отзывы
echo "<table>";
echo "<th>Имя</th> <th>Почта</th> <th>Отзыв</th> <th>Дата</th> ";
foreach ($feadbacks as $row => $col){
	echo "<tr>";
	foreach($col as $value){
		echo "<td>".$value."</td>";
	}
	echo "</tr>";
}


echo "</table>";


echo "<form method='post' action='send.php' id='feedback-form' >";
	echo "<textarea name='name' id='name' class='current'  > введите имя </textarea>";
	echo "<textarea name='email' id='email' class='current' > введите email </textarea>";
	echo "<textarea name='text' id='text' class='current' > оставьте отзыв </textarea>";
	echo "<textarea disabled id='date' class='current' >".date('Y-m-d H:i')."</textarea>";
	echo "<input name='date' style='display: none;'value='".date('Y-m-d H:i')."'>";
	echo "<div id='buttons'>";
		echo "<input id='prev' type='button' value='предварительный просмотр'>";
		echo "<input type='submit' value='отправить' >";
	echo "</div>";
echo "</form>";
echo "<form method='post' action='admin.php' id='feedback-form' >";
	echo "<input name='login' >";
	echo "<input name='password' >";
	echo "<input type='submit' value='отправить' >";
echo "</form>";





/*
2) Предварительный просмотр должен работать без перезагрузки страницы. После нажатия кнопки новый отзыв должен появиться на странице под внизу под остальными.
3) Сделать вход для администратора (логин "admin", пароль "123"). Администратор должен иметь возможность редактировать отзыв. Измененные отзывы в общем списке выводятся с пометкой "изменен администратором".

В приложении нужно с помощью чистого PHP реализовать модель MVC (PHP-фреймворки использовать нельзя).
Верстка на bootstrap.

Приложение нужно развернуть на любом бесплатном хостинге, чтобы можно было посмотреть его в действии. Скопируйте в папку с кодом наш онлайн-редактор dayside: https://github.com/boomyjee/dayside. 
Он должен быть доступен по url <ваш проект>/dayside/index.htm

Если вы совсем начинающий программист, на этом можно остановиться. Будет здорово, если вы выполните все задания с дополнениями
--- Дополнения ---
4) К отзыву можно прикрепить картинку.
Картинка должна быть не более 320х240 пикселей, при попытке залить изображение большего размера, картинка должна быть пропорционально уменьшена до заданных размеров. Допустимые форматы: JPG, GIF, PNG.
5) У администратора должна быть возможность модерирования.
Т.е. на странице администратора показаны отзывы с миниатюрами картинок и их статусы (принят/отклонен).
Отзыв становится видимым для всех только после принятия админом. Отклоненные отзывы остаются в базе, но не показываются обычным пользователям. Изменение картинки администратором не требуется.


*/



?>
	<script src="script.js"></script>

</body>
