function postMessage(){
	var msg=$("textarea").val();
	var artifact=$("input").val();
	$.ajax({
		url:"https://seans.site/stuff/DYSCOVR/post_message.php",
		async:true,
		method:"POST",

		data:{
			msg:msg,
			artifact:artifact
		}
	}).done(function(data,status,xhr){
		console.log(xhr.responseText);
	}).fail(function(xhr,status,error){
		console.error(error);
	});
}