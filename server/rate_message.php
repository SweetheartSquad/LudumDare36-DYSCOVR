<?php
include("connect.php");

if(!(
	isset($_POST["msg_id"])
)){
	datalog("Cannot rate message: arguments invalid.");
}

$msg_id = $_POST["msg_id"];

if($msg_id < 0){
	datalog("Invalid msg_id: id must be greater than 0.");
}

$query = "UPDATE messages SET rating = rating+1 WHERE messages_id = ".$msg_id.")";

$res = mysqli_query($connection, $query);
if(!$res){
	datalog("Could not rate message ('".$msg."'): ".mysqli_error($connection));
	datalog("Query: ".$query);
}

datalog("Rated message ('".$msg_id."').");

include("disconnect.php");
?>