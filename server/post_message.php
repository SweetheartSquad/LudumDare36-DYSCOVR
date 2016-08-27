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

$res = mysql_query($query);
if(!$res){
	datalog("Could not post message ('".$msg."') to database: ".mysql_error());
	datalog("Query: ".$query);
}

$msg_id = mysql_insert_id();
$query = "INSERT INTO artifact_messages (artifact_id,messages_id) VALUES(".$artifact.",".$msg_id.")";
$res = mysql_query($query);
if(!$res){
	datalog("Posted message ('".$msg."') to database, but could not post artifact_messages entry: ".mysql_error());
	datalog("Query: ".$query);
}

datalog("Posted message ('".$msg."') and artifact_messages entry to database.");

include("disconnect.php");
?>