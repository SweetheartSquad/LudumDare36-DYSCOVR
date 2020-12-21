var base = "https://seans.site/stuff/DYSCOVR";
var client={
// msg: message text
// artiface: ID of artifact to send message for
// 
// data returned is an object in the format:
// {
// 	success:bool,
// 	datalog:["text","with log","messages"]
// }
postMessage:function(msg,artifact){
	return $.ajax({
		url: base + "/post_message.php",
		async:true,
		method:"POST",

		data:{
			msg:msg,
			artifact:artifact
		}
	})
},

// artifact: ID of artifact to get messages for
// sort_column: 'timestamp' or 'rating'
// sort_order: 'ASC' or 'DESC'
// f: on_complete function(data)
// 
// data returned is an object in the format:
// {
// 	success:bool,
// 	datalog:["text","with log","messages"],
// 	rows:[{text,rating,timestamp},{text,rating,timestamp},...]
// }
getMessages:function(artifact,sort_column,sort_order){
	var artifact=$("input").val();
	return $.ajax({
		url: base + "/get_messages.php",
		async:true,
		method:"POST",

		data:{
			artifact:artifact,
			sort_column:sort_column,
			sort_order:sort_order
		}
	});
}
};
