// 通用
// 应付金额
$('#showPayDetail').click(function(){
	$(this).toggleClass('arr-active');
	$('#payDetail').toggleClass('pay-detail-active');
	$('.mask').fadeToggle();
});

// 失焦验证
$('form input').blur(function(){
	$(this).siblings('.val-error').show();
});

// 关闭对话框
$('.confirm-dialog i').click(function(){
	hideDialog();
});

//同意条款点击
$('.agree').click(function(){
	$(this).toggleClass('agree-checked');
});

function showDialog(selector,height){
	$('.mask-t').fadeIn(200);
	$('.confirm-dialog article').hide();
	selector.show();
	$('.confirm-dialog').height(height);
	$('.confirm-dialog').fadeIn(200);
}

function hideDialog(){
	$('.confirm-dialog').fadeOut(200);
	$('.mask-t').fadeOut(200);
}


// lmm-step1
// 费用明细
$('#payExplain').click(function(){
	showDialog($('#payExplainDetail'),220);
});

// 贷款条款
$('#loanRule').click(function(){
	showDialog($('#loanRuleDetail'),400);
	event.stopPropagation();
});


//lmm-step2
$('.upload-idcard').on('change',function(){
	var file = this.files[0];
	var fileType = file.type;
	if(!/image\/\w+/.test(fileType)){
		alert('请上传图片文件');
		return;
	}
	//预览图片	
	var prvImg = $(this).siblings('img');
	//父容器
	var container = $(this).parent('.upload-file');

	var reader = new FileReader();
	reader.onload = function(){
		var result = this.result;
		prvImg.attr('src',this.result);
		if(!container.hasClass('uploaded')){
			container.addClass('uploaded');
			container.append('<p>已上传</p>');
		}
	};
	reader.readAsDataURL(file);
})


// lmm-step4
$('#serviceRule').click(function(){
	showDialog($('#serviceRuleDetail'),406);
	event.stopPropagation();
});

