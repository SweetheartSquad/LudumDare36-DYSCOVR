<?php
header("Access-Control-Allow-Origin: *");

function done(){
	global $data;
	$data["success"]=true;
	echo json_encode($data);
}
function fail(){
	global $data;
	$data["success"]=false;
	echo json_encode($data);
	exit();
}
function datalog($msg){
	global $data;
	$data["datalog"][]=$msg;
}

$data=array(
	"datalog"=>array()
);




$connection = mysql_connect("localhost",$username,$password);
if(!$connection){
	datalog("Could not connect to database: ".mysql_error());
	fail();
}
datalog("Connected to database.");
mysql_select_db($database);

?>