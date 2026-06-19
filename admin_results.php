<?php
echo "<h2>CBT Results</h2>";
if(file_exists("results/results.csv")){
echo "<p>Open results/results.csv in Excel.</p><pre>";
echo htmlspecialchars(file_get_contents("results/results.csv"));
echo "</pre>";
}
foreach(glob("results/*.json") as $f){
if(strpos($f,'.json')!==false) echo "<hr><pre>".htmlspecialchars(file_get_contents($f))."</pre>";
}
?>