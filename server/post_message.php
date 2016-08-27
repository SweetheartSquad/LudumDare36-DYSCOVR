<?php
include("connect.php");

if(!(
	isset($_POST["msg"]) and
	isset($_POST["artifact"])
)){
	die("Cannot post message: arguments invalid.\n");
}

$msg = $_POST["msg"];
$artifact = $_POST["artifact"];

if(strlen($msg) < 1){
	die("Invalid message: message must be at least 1 character.\n");
}
if($artifact < 0){
	die("Invalid artifact: id must be greater than 0.\n");
}

$query="INSERT INTO messages (text) VALUES('".$msg."')";

$res = mysql_query($query);
if(!$res){
	die("Could not post message ('".$msg."') to database: ".mysql_error()."\n"
		."Query: ".$query."\n");
}

$msg_id = mysql_insert_id();
$query = "INSERT INTO artifact_messages (artifact_id,messages_id) VALUES(".$artifact.",".$msg_id.")";
$res = mysql_query($query);
if(!$res){
	die("Posted message ('".$msg."') to database, but could not post artifact_messages entry: ".mysql_error()."\n"
		."Query: ".$query."\n");
}

echo "Posted message ('".$msg."') and artifact_messages entry to database.\n";

include("disconnect.php");
?>