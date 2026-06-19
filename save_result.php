<?php
$data=json_decode(file_get_contents("php://input"),true);
if(!file_exists("results")) mkdir("results",0777,true);
$csv="results/results.csv";
$rows=[];
if(file_exists($csv)){
 if(($h=fopen($csv,"r"))){$header=fgetcsv($h); while(($r=fgetcsv($h))!==false){$rows[]=$r;} fclose($h);}
}
$position=1;
foreach($rows as $r){ if(floatval($r[6])>floatval($data["percentage"])) $position++; }
$data["position"]=$position;
file_put_contents("results/".$data["regNumber"]."_".$data["subject"].".json",json_encode($data,JSON_PRETTY_PRINT));
$new=!file_exists($csv);
$f=fopen($csv,"a");
if($new){fputcsv($f,["Student Name","Registration Number","Class","Subject","Score","Total","Percentage","Position"]);}
fputcsv($f,[$data["studentName"],$data["regNumber"],$data["class"],$data["subject"],$data["score"],$data["total"],$data["percentage"],$position]);
fclose($f);
echo json_encode(["saved"=>true,"position"=>$position]);
?>