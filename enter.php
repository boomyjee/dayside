           <!-- форма авторизації -->
           
            
            <?php if ( $_SESSION['logged_user'] == true) {
            echo '                
                    <div class =" col-lg-3 col-xs-6 col-md-4   lead">
                        <h4>Hello,<b>' . $_SESSION["logged_user"]->login . '</b></h4><a href="exit.php">Exit</a>
                    </div>
                        
                </div>';

            }else{
                echo '
                    <div  class="navbar-header navbar-rigth row col-lg-6 col-xs-6 col-md-4">
                        <form class="form-inline navbar-rigth" role="form" action="index.php" method="POST">
                            
                            <div class="form-group">
                                <!-- вивід помилок --><div class="text-warning">'. $error[0] . '</div>
                                <label class="sr-only" for="exampleInputlogin">login</label>
                                <input type="text" class="form-control" id="exampleInputlogin" placeholder="login" name="login">
                            </div>
                            <div class="form-group">
                                <label class="sr-only" for="exampleInputPassword">Пароль</label>
                                <input type="password" class="form-control" id="exampleInputPassword" placeholder="Password" name="password">
                                
                            </div>
                            <!--<div class="checkbox">
                                <label>
                                    <input type="checkbox"> Запомнить меня
                                    </label>
                            </div>-->                    
                            <button type="submit"  class="btn btn-default" name="do_login">Ввійти</button>               
                        </form>        
                    </div>';}?>