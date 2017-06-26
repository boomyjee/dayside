<? require ('header.php');		/* підключаєм шапку*/?>
<div class="container">
	<div class="center row">
	
		<!-- Створення задачі -->
		<form role="form" action="index.php" method="post" multipart="" enctype="multipart/form-data">
			<div class="page-header">
				<h2>Створити задачу</h2>
			</div>
			<div class=" col-lg-12 col-xs-12 form-group input-group">
				<span class="input-group-addon">Username</span>
				<input class="form-control" name="username" type="text" placeholder="Bender">
			</div>
			<div class="col-lg-12 col-xs-12 form-group input-group">
				<span class="input-group-addon">Email</span>
				<input class="form-control" name="email" type="email" placeholder="exempel@exempel.co">
			</div>
			<div class="col-lg-12 col-xs-12 form-group input-group">
				<span class="input-group-addon">Message</span>
				<textarea class="form-control" name="message" rows="5" placeholder="Введіть задачу"></textarea>
			</div>					
			<div class="form-group"> 
			<input class="btn" type="file" name="picture" multiple>                       
			<button type="submit" name="do_send" class="btn btn-default">Надіслати</button>
			<button type="submit" class="btn btn-default">Попередній перегляд</button>
			</div>
		</form>
	</div>
</div>