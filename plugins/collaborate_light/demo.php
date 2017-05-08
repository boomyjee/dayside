<?php

ini_set('display_errors', 1);
error_reporting(E_ALL);
    
require __DIR__."/../../server/api.php";
require __DIR__."/../../plugins/git_commit/api.php";
require __DIR__."/api.php";

class FirepadApi extends FileApi {

    static $firebase_url = "https://collaborate-light.firebaseio.com";
    static $firebase_api_key = "AIzaSyAKzjCBeLWmU40zv4M39WQg1e8v_QILK9A";
    static $firebase_client_email = "firebase-adminsdk-11vak@collaborate-light.iam.gserviceaccount.com";
    static $firebase_private_key = "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCgeDxT5m4LLLNP\nkJHKBEvFEgKrjCRzdlYCKs+ZqTyvNAYyuje0CxwXL2Hlcaa30mtdmq91b1n/RL1z\nrJssJ+utZsP8ayNqFHoYz6M4JooXtMtuOVo5GMxg2IpW6soHfpnQe6UK4PEOT1m5\n3N7I4+Cf7RxvQVdDVfi89Bm5aho3H+F3auZWczU92aVpUse++9j9Jcdzs9gvMMoP\nPCIVK7V9HeZ0PWnPWKn16CH80CQJsHeQ+lEHQqce0xJBaGG6Qh7DQxpoLaAlrz9P\n/6xy62ux0J1F7VzVIqxNgbYV+Yy/CzC9+b3r+eAplxAf83oEz5IhVoThfMBeHrYi\nelYNC2wdAgMBAAECggEAd7Q5jHzAaiWWPSwjFQfPXdrpkv6f0mHcFxHIe1/7nNa6\nKO0w0GXZNpJp/LajH00gOltBt+CwyfOFP9zqhC3jaR7X5FwntuI/knKR1zkomjaL\n6lVuMFmHXFcsG1paCu0t4I/bthnGuF4JGNTifAlBbwt5wqSDa/+d5ZZR+jZkB+nZ\n3/tVja4eMhsR/UF79Q/tFIvew2kdFP6ktNpHAhja2VuNPgX1Dejw2Y6hiyGWRCL4\nRjZ0AWaSM5HaTV0v++uH7YtCCrAfVKJnyj9o+NzzOx1L38dCUX1cGoXgnmqo+CjB\nFHkeYiWlrChb43Cv1vZd28vXWJyPLQZ96vjR2F19IQKBgQDOJjmvAP2SiRarSlne\nRF8925zt7eQYE/FNgPOTC8MEj+SfUxY1+liwBkU/qF1zPUDjjiuPZSwE5doitf3c\n1FeAU61Oesf2S4ICgDGNe9iSwaxsG68p8nGUodghoMZ+00wUCMwg9a/DVjejf75I\nto/54nrpVjLwBf3Fpdbyxot+WwKBgQDHRjB5meQq2lTytFb+jt3yHdfXDgs75/62\njrUp4ymeRfVrsVPXxpmECjLECHCsKRgAYOcq6F6APLivXuNOhFUWXbj83hhnmLua\nqqbEj7zdQKeHGaMwSMiQfJuSVzrOu8WD3ArJRC/Y86O/2DwhIya6Ssm+yycWNhU8\neH9grAG45wKBgQCGn3PgEzeE8D17ksxpWCESVk5/GnFwP+W/BU0LZAzw978HRM0m\nZtxv50hlr9+HGCM992P++sTqVehD7rFf+tNBnGN68reO4fR/CZRSnuPpwsyEtPeI\n3yjJNX/dRg8aV4ZBNxWHGKq1V6JyBUQQXBhdyUcXBhGxqVf2MLzUQlBqLQKBgB6A\n8AqtM/AbW8WLNYXh+LeHOfMBg1a4PJVVYwX2b/h6XQcPLfZpwDYmGX9Ii3bPE417\nR+eZil227c5qiAEM4Ll7v0V1+eZhytXyKXUNS6vSqdJUalaJzanQaUANekMLG0ED\n/eKxPWHIadiEETBBYTxDFn7OOj18KeQHzffOXLUhAoGAQt3z+g+s1gnK34gtWlHG\nVKn8uIVm3Imt39J2Jszx79EP7AsOnURJ2RMmeMhYhZZV3EHo7D+lZohxpgtL+mrI\nnUxGvYtfCLy+780pddU4/V47HBI0MQMstC+Ze7AsImfH3tIxFgFGN2frdso79va5\nqGu+l4jinyD0a6MTeicLqVk=\n-----END PRIVATE KEY-----\n";
    
    function _pathFromUrl($url) {
        $url = explode('/',$url,4);
        $url = @$url[3] ? "/".$url[3] : "";
        
        $base = substr($_SERVER['REQUEST_URI'],0,strlen($_SERVER['REQUEST_URI'])-strlen($_SERVER['QUERY_STRING']));
        $base = preg_replace('/(\/)?('.basename($_SERVER["PHP_SELF"]).')?\??$/i','',$base);
        $base = implode('/',explode('/',$base,-3));
        
        if ($base=="" || strpos($url,$base)===0) {
            $rel = substr($url,strlen($base));
            $path = realpath(__DIR__."/../../..").$rel;
            return $path;
        }
        return false;
    }    
}
$api = new FirepadApi;