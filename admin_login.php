<?php
session_start();
$error="";
if($_SERVER["REQUEST_METHOD"]==="POST"){
 if($_POST["username"]==="admin" && $_POST["password"]==="admin123"){
   $_SESSION["admin"]=1;
   header("Location: admin_results.php");
   exit;
 }
 $error="Invalid login";
}
?>
<h2>BRIX CBT Admin Login</h2>
<p style="color:red"><?php echo $error; ?></p>
<form method="post">
<input name="username" placeholder="Username"><br><br>
<input type="password" name="password" placeholder="Password"><br><br>
<button type="submit">Login</button>
</form>