<?php
include("connect.php");

if(!(
	isset($_POST["msg"]) and
	isset($_POST["artifact"])
)){
	datalog("Cannot post message: arguments invalid.");
}

$msg = $_POST["msg"];
$artifact = $_POST["artifact"];

if(strlen($msg) < 1){
	datalog("Invalid message: message must be at least 1 character.");
}
if($artifact < 0){
	datalog("Invalid artifact: id must be greater than 0.");
}

$query="INSERT INTO messages (text) VALUES('".$msg."')";

$res = mysqli_query($connection, $query);
if(!$res){
	datalog("Could not post message ('".$msg."') to database: ".mysqli_error($connection));
	datalog("Query: ".$query);
}

$msg_id = mysqli_insert_id($connection);
$query = "INSERT INTO artifact_messages (artifact_id,messages_id) VALUES(".$artifact.",".$msg_id.")";
$res = mysqli_query($connection, $query);
if(!$res){
	datalog("Posted message ('".$msg."') to database, but could not post artifact_messages entry: ".mysqli_error($connection));
	datalog("Query: ".$query);
}

datalog("Posted message ('".$msg."') and artifact_messages entry to database.");

include("disconnect.php");
?>