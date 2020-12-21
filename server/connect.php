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




$connection = mysqli_connect("localhost",$username,$password,$database);
if(!$connection){
	datalog("Could not connect to database: ".mysqli_error($connection));
	fail();
}
datalog("Connected to database.");

?>