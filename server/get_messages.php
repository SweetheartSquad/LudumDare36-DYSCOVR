<?php
include("connect.php");

if(!(
	isset($_POST["artifact"]) and
	isset($_POST["sort_column"]) and
	isset($_POST["sort_order"])
)){
	die("Cannot get messages: arguments invalid.\n");
}

$artifact = $_POST["artifact"];
$sort_column = $_POST["sort_column"];
$sort_order = $_POST["sort_order"];

if($artifact < 0){
	die("Invalid artifact: id must be greater than 0.\n");
}

if(!(
	$sort_column == "timestamp" or
	$sort_column == "rating"
)){
	die("Invalid sort column: must be either timestamp or rating.\n");
}

if(!(
	$sort_order == "ASC" or
	$sort_order == "DESC"
)){
	die("Invalid sort order: must be either ASC or DESC.\n");
}

$query="
SELECT messages.text,messages.rating,messages.timestamp 
FROM (
	SELECT * 
	FROM artifact_messages
	WHERE artifact_messages.artifact_id=".$artifact."
) AS a
INNER JOIN messages ON a.messages_id = messages.messages_id
ORDER BY messages.".$sort_column." ".$sort_order;

$res = mysql_query($query);
if(!$res){
	die("Could not get messages from database: ".mysql_error()."\n"
		."Query: ".$query."\n");
}

echo "Retrieved messages from database.\n";

$rows = array();
while($r = mysql_fetch_assoc($res)) {
    $rows[] = $r;
}
echo json_encode($rows);

include("disconnect.php");
?>