// 获得窗口高度
var viewHeight = $(window).height();

var judgs = [
		{
			id: "1",
			question: "信用卡不可作为还款银行卡登记",
			key: "Y"
		},
		{
			id: "2",
			question: "申请人士若是学生，其他证明材料需上传学生证和社保卡",
			key: "N"
		},
		{
			id: "3",
			question: "5W以上的申请需另外提交居住地证明（包括户口本、机动车驾驶证、房产证、购房合同、租房合同）",
			key: "N"
		},
		{
			id: "4",
			question: "个人居住地址信息必须填写的是户籍地址",
			key: "N"
		},
		{
			id: "5",
			question: "还款银行卡的开户地点必须正确",
			key: "N"
		},
	];

var selects = [
		{
			id: "1",
			question: "以下属于需要申请人手持拍照上传的资料是___? ",
			options: [
				{
					value: "A",
					content:"身份证原件"
				},{
					value: "B",
					content:"分期合同（客户签名）"
				},{
					value: "C",
					content:"产品确认单"
				},{
					value: "D",
					content:"客户亲签照片"
				},
			],
			key: "A"
		},
		{
			id: "2",
			question: "目前支持还款银行的卡号是多少位的___? ",
			options: [
				{
					value: "A",
					content:"16"
				},{
					value: "B",
					content:"17"
				},{
					value: "C",
					content:"18"
				},{
					value: "D",
					content:"19"
				},
			],
			key: "D"
		},
		{
			id: "3",
			question: "以下对于个人信息拍照上传描述正确的是哪个？",
			options: [
				{
					value: "A",
					content:"身份证复印件"
				},{
					value: "B",
					content:"户口本或者护照"
				},{
					value: "C",
					content:"二代身份证原件"
				},{
					value: "D",
					content:"临时身份证"
				},
			],
			key: "C"
		},
		{
			id: "4",
			question: "关于注意事项描述错误的是哪个选项? ",
			options: [
				{
					value: "A",
					content:"所有提供的信息必须真实有效（特别是单位信息和联系人信息）"
				},{
					value: "B",
					content:"银行信审会核实单位电话"
				},{
					value: "C",
					content:"分期可以找人代为办理"
				},{
					value: "D",
					content:"还款日期是固定的每月的12日"
				},
			],
			key: "C"
		},
		{
			id: "5",
			question: "对于学生申请分期描述错的是",
			options: [
				{
					value: "A",
					content:"大一至大四学生有共同还款人可申请高额度分期"
				},{
					value: "B",
					content:"学生申请分期相关联系人信息登记必须是父母"
				},{
					value: "C",
					content:"学生分期其他证明材料只需提供学生证和学信网截屏"
				},{
					value: "D",
					content:"学生申请时工资填写的必须是生活费"
				},
			],
			key: "D"
		},
	];

(function initPages(){
 	$('.main-container').height(viewHeight);
 	$('.main-page').height(viewHeight);
	// 初始化判断题
	initJudg();
	// 初始化选择题
	initSelect();
 })();

// 立即参加
$('#start').click(function(){
	scrollDown();
});

// 规则页面
$('.rule-page').click(function(){
	scrollDown(function(){
		startCountDown(60);
	});
});

// 判断选项点击
$('#judgQuestions').on('click','.btn',function(){		//使用这样的绑定方法对后来创建的元素也生效
	var qid = $(this).siblings('input[type=hidden]').val();	//题目id
	var answer = $(this).attr('data-value');				//用户答案
	var key;												//正确答案
	$(judgs).each(function(k,v){
		if(v.id == qid){
			key = v.key;
			return;
		}
	});
	
	if(answer == key){
		scrollDown();
	}else{
		showError();
	}
});

// 选择选项点击
$('#selectQuestions').on('click','.btn',function(){
	var qid = $(this).siblings('input[type=hidden]').val();	//题目id
	var answer = $(this).attr('data-value');				//用户答案
	var key;												//正确答案
	$(selects).each(function(k,v){
		if(v.id == qid){
			key = v.key;
			return;
		}
	});

	if(answer == key){
		scrollDown(function(page){
			if(page == 12){		//如果是滚到恭喜您页面,添加火箭飞行的样式
				$('.rocket').addClass('rocket-fly');
				console.log('time:'+ (60-$('.clock').html()));
			}
		});
	}else{
		showError();
	}
});

var loadingFlag = false;
// 查看排行榜
$('#goRank').click(function(){
	if(loadingFlag)return;
	loadingFlag = true;
	$.ajax({
		url: '../../public/js/fqcg/rank.json',
		method: 'post',
		success: function(data){
			loadingFlag = false;
			initRank(data);
			scrollDown();
		}
	});
});

// 向下滚动
var timer;
var counter = 0;
var page = 0;
function scrollDown(callback){
	if(counter!=0) return;
	var top = $('.main-pages').offset().top - viewHeight;
	timer = setInterval(function(){
		if(counter >= 40){
			clearInterval(timer);
			$('.main-pages').offset({ top: top });  //最后再定位一次
			counter = 0;
			page += 1;
			callback && callback(page);
			return;
		}
		var curTop = $('.main-pages').offset().top;
		$('.main-pages').offset({top: curTop - viewHeight/40 });
		counter += 1;
	},5);
}

// 重新开始
$('#restart').click(function(){
	$('.main-pages').removeClass('blur');
	$('.wrong').hide();
	resetPages();
});

//重置页面
function resetPages(){
	$('.main-pages').offset({ top:0 })
	clearInterval(countDown);
	initJudg();
	initSelect();
	page = 0;
}

var countDown;
// 开始计时
function startCountDown(time){
	$('.clock').html(time);
	countDown = setInterval(function(){
		if(time <= 0){
			clearInterval(countDown);
			showTimeOut();
			return;
		}
		time -= 1;
		$('.clock').html(time);
	},1000);
}

// 显示回答错误
function showError(){
	$('.main-pages').addClass('blur');
	$('.wrong').show();
}

// 显示超时
function showTimeOut(){

}

//初始化判断题
function initJudg(){
	shuffleArr(judgs);	//获得一个随机顺序的题目
	var judgBlock = $('#judgQuestions');
	judgBlock.empty();	//清空原来的题目
	for(var i=0;i<judgs.length;i++){
		var html = '<section class="main-page judg-page">\
						<div class="round-title">\
							<i>判读题</i>\
						</div>\
						<i class="clock">60</i>\
						<div class="dialog-block">\
							<input type="hidden" value="'+ judgs[i].id +'">\
							<p class="question">'+ (i-(-1))+'.'+ judgs[i].question + '</p>\
							<a class="btn" data-value="Y" >YES</a>\
							<a class="btn" data-value="N" >NO</a>\
						</div>\
					</section>';

		judgBlock.append(html);
	}
	$('.main-page').height(viewHeight); //给新加的内容赋上高度
}

// 初始化选择题
function initSelect(){
	shuffleArr(selects);	//获得一个随机顺序的题目
	var selectBlock = $('#selectQuestions');
	selectBlock.empty();	//清空原来的题目
	for(var i=0;i<selects.length;i++){
		var html = '<section class="main-page select-page">\
						<div class="round-title">\
							<i>选择题</i>\
						</div>\
						<i class="clock"></i>\
						<div class="dialog-block">\
							<input type="hidden" value="'+ selects[i].id +'">\
							<p class="question">'+ (i-(-1))+'.'+ selects[i].question +
							'</p>';
		for(var j=0;j<selects[i].options.length;j++){
			html += '<a class="btn" data-value="'+ selects[i].options[j].value +'" >' 
					+ selects[i].options[j].content+'</a>';
		}
							
		html += '</div>\
				</section>'

		selectBlock.append(html);
	}
	$('.main-page').height(viewHeight); //给新加的内容赋上高度
}

// 初始化排行榜
function initRank(ranks){
	var rankUl = $('#rankList');
	rankUl.empty();
	for(var i=0;i<ranks.length;i++){
		if(i<=2){
			var html = '<li class="rank-item rank-item-top">\
							<div class="user-head" >\
								<img src="' + ranks[i].img+ '">\
							</div>\
							<b>' + ranks[i].name + '</b>\
							<span class="time-count">' + ranks[i].time+ 'S</span>\
						</li>';
		}else{
			var html = '<li class="rank-item">\
							<em>'+ (i+1) +'</em>\
							<b>' + ranks[i].name + '</b>\
							<span class="time-count">' + ranks[i].time+ 'S</span>\
						</li>';
		}
		rankUl.append(html);
	}
}

// 数组随机排序
function shuffleArr(arr){
	arr.sort(function(){
		return Math.random()>0.5?1:-1;		
	});
}