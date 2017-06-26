<?php
if (isset($_GET['status'])) {
            $pUri = ($_SERVER["REQUEST_URI"]) . '&';;
} else {
    $pUri = '?';
}$tasks = R::getAll('SELECT * FROM problem');

 foreach ($tasks as $task){
 $page = $_GET['page'] ?? 1;
 $pageArray = array_chunk($task, 3);
    $task = $pageArray[$page-1];
 }

?>

    
    <nav aria-label="Page navigation example">
  <ul class="pagination">
    <li class="page-item <?= ($page <= 1)?'disabled':''?>">
        <a class="page-link" href="<?= $pUri ?>page=<?= $page - 1 ?>">Previous</a>
    </li>
    <?php for($i = 1; $i <= count($page); $i++): ?>
        <li class="page-item <?= ($page == $i)?'active':''?>">
            <a class="page-link" href="<?= $pUri ?>page=<?= $i ?>"><?= $i ?></a>
        </li>
    <?php endfor;?>    
    <li class="page-item <?= ($page > count($page)-1)?'disabled':'' ?>">
        <a class="page-link" href="<?= $pUri ?>page=<?= $page + 1 ?>">Next</a>
    </li>

  </ul>
</nav>

</div>