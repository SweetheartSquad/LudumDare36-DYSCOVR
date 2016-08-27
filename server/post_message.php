<?php
include("connect.php");


$msg = $_POST["msg"];

if(strlen($msg) < 1){
	die("Invalid message: message must be at least 1 character.");
}

$query="INSERT INTO messages VALUES(NULL,'".$msg."',0)";

$res = mysql_query($query);
if(!$res){
	die("Could not post message ('".$msg."') to database: ".mysql_error());
}
echo "Posted message ('".$msg."') to database.";

include("disconnect.php");
?>