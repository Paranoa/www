$(function(){
	localStorage.clear("deleteList");
	//123456
	$(".btn").click(function(){

		// $.ajax({
		// 	url:"xxx.do?id="+$(this).siblings("input").val(),
		// 	success: function(){

		// 	},
		// 	error: function(){
		// 		if(localStorage.deleteList){
		// 			localStorage.deleteList += (","+$(this).siblings("input").val());
		// 		}else{
		// 			localStorage.deleteList = $(this).siblings("input").val();
		// 		}
		// 		console.log(localStorage.deleteList);
		// 	}

		// });

		if(localStorage.deleteList){
			localStorage.deleteList += (","+$(this).siblings("input").val());
		}else{
			localStorage.deleteList = $(this).siblings("input").val();
		}
		console.log(localStorage.deleteList);
		
		$(this).parent().remove();
		
	});

	$(".floor").click(function(){
		if($(this).next().length == 0 || $(this).next()[0].tagName != "DD")
			$(this).remove();
	});


	setInterval(function(){
		if(localStorage.deleteList){
			var arr =  localStorage.deleteList.split(",");
			for (var i = 0; i < arr.length; i++) {
				console.log('delete'+arr[i]);
				localStorage.clear('deleteList');
			};
		}else{
			console.log('no delete');
		}
	},5*1000);

});

