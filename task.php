<?php require ('header.php'); ?>

<div class="container">
<h2> Всі задачі: </h2>


 
<!--підключаємо пагінацію-->
<?php require ('pagination.php'); ?>

<?php if (isset($task)) : ?>
<?php foreach ($tasks as $task) :?>
<div class="container row">
    <div class="col-lg-5 col-md-6">
        <div class="img"><img src="<?='/'. $task->image?>"></div> 
    </div>
    <div class="col-lg-7 col-md-6">
        <h6>Task id: <?= $task["id"]?></h6>
        <h7><i>Posted by: <?=$task['login']?></i></h7>
        <p><i><?=$task['email']?></i></p>
        <p class="taskId-<?=$task['id']?>"><?=$task['message']?></p>  
        <?php echo $task['status'] ?
          "<button type='button' class='btn btn-success'>DONE</button>" :
          "<button type='button' class='taskId-{$task['id']} btn btn-warning'>ACTIVE</button>" ;
        ?>
        <?php if ($_SESSION['logged_user'] == true) : ?>
            <form class="form-inline" method="post" role="form" name="redag" action="index.php" >
                <div class="form-group">
             <button type="submit" name="do_reg" class='btn btn-primary' value="1">CLOSE</button>
             <button type="submit" name="do_reg" class='btn btn-secondary'>EDIT</button>
             </div>
             
            </form>
            <? var_dump($_POST["value"]); ?>
        <?php endif; ?>
    </div>  
</div>
<hr>
<?php endforeach;?>
<?php endif; ?>

</div> <!-- end container -->
<?		require ('footer.php'); 		// підключаєм footer?>