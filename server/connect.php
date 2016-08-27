<?php
header("Access-Control-Allow-Origin: *");


$connection = mysql_connect("localhost",$username,$password);
if(!$connection){
	die("Could not connect to database: ".mysql_error());
}
echo "Connected to database.";
mysql_select_db($database);

?>
