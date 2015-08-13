$('.waver-img').mouseover(function(){
	$(this).removeClass('waver').offset($(this).offset()).addClass('waver');
})