var clientHeight = document.documentElement.clientHeight;

initMsgBox();

function initMsgBox(){
	var items = $('.item');
	for(i=0;i<items.length;i++){
		var item = items.eq(i);
		if(clientHeight >= item.offset().top + item.height()){
			item.find('.info-box').addClass('info-box-active');
		}
	}
}

$(window).scroll(function(){
	var items = $('.item');
	for(i=0;i<items.length;i++){ 
		var item = items.eq(i);
		var scrollTop = $(window).scrollTop();
		if(clientHeight + scrollTop >=item.offset().top + item.height()){
			item.find('.info-box').addClass('info-box-active');
		}else{
			item.find('.info-box').removeClass('info-box-active');
		}
	}
});