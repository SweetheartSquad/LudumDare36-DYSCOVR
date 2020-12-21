<?php
include("connect.php");

if(!(
	isset($_POST["artifact"]) and
	isset($_POST["sort_column"]) and
	isset($_POST["sort_order"])
)){
	datalog("Cannot get messages: arguments invalid.");
	fail();
}

$artifact = $_POST["artifact"];
$sort_column = $_POST["sort_column"];
$sort_order = $_POST["sort_order"];

if($artifact < 0){
	datalog("Invalid artifact: id must be greater than 0.");
	fail();
}

if(!(
	$sort_column == "timestamp" or
	$sort_column == "rating"
)){
	datalog("Invalid sort column: must be either timestamp or rating.");
	fail();
}

if(!(
	$sort_order == "ASC" or
	$sort_order == "DESC"
)){
	datalog("Invalid sort order: must be either ASC or DESC.");
	fail();
}

$query="
SELECT messages.text,messages.rating,messages.timestamp,messages.messages_id
FROM (
	SELECT * 
	FROM artifact_messages
	WHERE artifact_messages.artifact_id=".$artifact."
) AS a
INNER JOIN messages ON a.messages_id = messages.messages_id
ORDER BY messages.".$sort_column." ".$sort_order;

$res = mysqli_query($connection, $query);
if(!$res){
	datalog("Could not get messages from database: ".mysqli_error($connection));
	datalog("Query: ".$query);
	fail();
}

datalog("Retrieved messages from database.");

$data["rows"] = array();
while($r = mysqli_fetch_assoc($res)) {
    $data["rows"][] = $r;
}

include("disconnect.php");
?>