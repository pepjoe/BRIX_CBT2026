<?php
$csv="results/results.csv";
echo "<h2>Student Results Dashboard</h2>";
if(!file_exists($csv)){ die("No results available."); }
$rows=[];
if(($h=fopen($csv,"r"))){
 $header=fgetcsv($h);
 while(($r=fgetcsv($h))!==false){ $rows[]=$r; }
 fclose($h);
}
usort($rows,function($a,$b){ return floatval($b[6]) <=> floatval($a[6]); });
echo "<table border='1' cellpadding='6'><tr>";
foreach($header as $c) echo "<th>$c</th>";
echo "</tr>";
$rank=1;
foreach($rows as $r){
 echo "<tr>";
 foreach($r as $v) echo "<td>$v</td>";
 echo "</tr>";
 $rank++;
}
echo "</table>";
?>