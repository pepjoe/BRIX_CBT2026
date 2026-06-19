<?php
session_start();
if(!isset($_SESSION['admin'])) die('Admin login required');
if($_SERVER['REQUEST_METHOD']==='POST'){
 $reg=$_POST['reg'] ?? '';
 echo "<h3>Reset Instruction</h3>";
 echo "Delete lock keys for student: ".htmlspecialchars($reg)."<br>";
 echo "If using server-side storage, clear the subject status record.";
}
?>
<h2>Admin Subject Reset</h2>
<form method='post'>
<input name='reg' placeholder='Registration Number'>
<select name='action'>
<option value='subject'>Reset Single Subject</option>
<option value='all'>Reset All Subjects</option>
</select>
<button type='submit'>Reset</button>
</form>