$(function(){
	// 饼
	$(".pie .pie-main").hover(function(){
		$(this).toggleClass("pie-roll");
		$(this).siblings(".pie-white").toggleClass("pie-open");
		$(this).siblings(".pie-content").toggleClass("pie-open");
	});

	// 拉杆
	$(".switch").hover(function(){
		$(this).find(".base span").fadeToggle();
	});

	$(".switch").click(function(){
		$(this).find(".lever").addClass("lever-active");
		$(this).find(".lever").toggleClass("lever-active1");
	});

});