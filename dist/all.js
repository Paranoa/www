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


$(function(){
	

});
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
require.config({
	baseUrl: "../public/libs",
	paths: {
		jquery: "jquery",
		ajax: "ajax"
	}
})

define(["jquery", "ajax"], function($, ajax) {

	var aLi = $("#sect1 li"), i = 0, aHeight = {L: [], C: [], R: []}

	for(i=0; i<aLi.length; i++) {
		var iNow = i % 2

		switch(iNow) {
			case 0:
				aLi[i].style.left = "3%"
				aHeight.L.push(aLi[i].offsetHeight)

				var step = Math.floor(i / 2)

				if(!step) {
					aLi[i].style.top = 0
				} else {
					var sum = 0
					for(var j=0; j<step; j++) {
						sum += aHeight.L[j] + 5
					}
					aLi[i].style.top = sum + "px"
				}

				break
			case 1:
				aLi[i].style.left = "52%"
				aHeight.C.push(aLi[i].offsetHeight)

				var step = Math.floor(i / 2)

				if(!step) {
					aLi[i].style.top = 0
				} else {
					var sum = 0
					for(var j=0; j<step; j++) {
						sum += aHeight.C[j] + 5
					}
					aLi[i].style.top = sum + "px"
				}

				break
		}
	}

})

window.onload = function(){
//	移入移出
	document.getElementById('p1').onmouseover = function(){
		document.getElementById('tooltip').style.display = "block";
	}
	document.getElementById('p1').onmouseout = function(){
		document.getElementById('tooltip').style.display = "none";
	}

//	选项卡
	var btns = document.getElementsByTagName('input');
	var divs  = document.getElementsByName('tabDiv');
	for (var i = 0; i < btns.length; i++) {
		btns[i].index = i;
		btns[i].onclick = function(){
			
			for (var i = 0; i < btns.length; i++){
				btns[i].className='btn';
				divs[i].style.display = 'none';
			}
			this.className = 'active';
			divs[this.index].style.display = 'block';
		}
	};

//	时钟

	setInterval(refreshTime,1000);
	refreshTime();
	function refreshTime(){
		var date = new Date();
		var hours = date.getHours()>=10?''+date.getHours():'0'+date.getHours();
		var minutes= date.getMinutes()>=10?''+date.getMinutes():'0'+date.getMinutes();
		var seconds = date.getSeconds()>=10?''+date.getSeconds():'0'+date.getSeconds();

		document.getElementById('hours').innerHTML = hours;
		document.getElementById('minutes').innerHTML = minutes;
		document.getElementById('seconds').innerHTML = seconds;
	}

//	菜单
	menu();
	function menu(){
		var items = document.getElementById('menu').getElementsByTagName('div');
	
		var timer_next,timer_this;
		var rootMenuId = 'menu1';
		

		for (var i = 0; i < items.length; i++) {
			items[i].onmouseover = itemMouseover;
			items[i].onmouseout = itemMouseout;
		};

		function itemMouseover(){
			clearTimeout(timer_this);		//先清除之前的逐渐消失效果
			clearTimeout(timer_next);

			$(this.parentNode.parentNode).nextAll().find("aside").hide();	//本级以后的菜单全部隐藏

			if(this.getAttribute('nextMenu')){								//如果有下一级菜单，显示下一级
				var nextMenu = document.getElementById(this.getAttribute('nextMenu'));
				nextMenu.style.display = 'block';
			}
		}

		function itemMouseout(){


			if(this.getAttribute('nextMenu')){							//如果有下一级菜单，隐藏下一级菜单
				var nextMenu = document.getElementById(this.getAttribute('nextMenu'));
				timer_next = setTimeout(function(){
					nextMenu.style.display = 'none';
				},300)
			}

			var thismenu = this.parentNode;								//隐藏自身菜单,除非自身是根菜单
			if((thismenu).getAttribute('id') == rootMenuId)
				return;
			timer_this = setTimeout(function(){
				thismenu.style.display = 'none';
			},300)
		}
	}
	
//	图片滚动
	slide('vet',2,'slideLeft','slideRight');
	function slide(type,speed,btn1,btn2){			//hor 水平滑动 vet 垂直滑动
		var imgSlide = document.getElementById('imgSlide'),
			btn1 = document.getElementById(btn1),				//向左
			btn2 = document.getElementById(btn2),				//向右
			imgs = imgSlide.getElementsByTagName('li');			//所有放图片的li

		var imgWidth = imgs[0].offsetWidth;						//获得li宽度
		imgSlide.innerHTML += imgSlide.innerHTML;				//将图片内容复制一遍
		imgSlide.style.width = type == 'vet'?imgWidth + 'px':imgs.length * imgWidth +'px';	//初始化新的ul宽度
		
		var stop = false;										//stop为true 则不移动滚动

		if(type == 'hor'){
			setInterval(function(){
				if(stop)return;
				imgSlide.style.left = imgSlide.offsetLeft + speed + 'px'; 

				if(imgSlide.offsetLeft>0)			//方向向右 left>0 
					imgSlide.style.left = -(imgSlide.offsetWidth/2)+'px';

				if(imgSlide.offsetLeft<-(imgSlide.offsetWidth/2))	//方向向左 移动到图片结尾 
					imgSlide.style.left = 0;
			},30);

		}else if(type == 'vet'){
			setInterval(function(){
				if(stop)return;
				imgSlide.style.top = imgSlide.offsetTop + speed + 'px'; 

				if(imgSlide.offsetTop>0)			
					imgSlide.style.top = -(imgSlide.offsetHeight/2)+'px';

				if(imgSlide.offsetTop<-(imgSlide.offsetHeight/2))	
					imgSlide.style.top = 0;
			},30);

		}
		

		btn1.onclick = function(){	//方向向左
			if(speed>0) speed = -speed;
		}

		btn2.onclick =function(){	//方向向右
			if(speed<0) speed = -speed;
		}

		for (var i = 0; i < imgs.length; i++) {	//图片的鼠标移入移出事件
			imgs[i].onmouseover = function(){
				stop = true;
			}
			imgs[i].onmouseout = function(){
				stop =false;
			}
		};

	}

	score()
	function score(){
		var tip = document.getElementById('score').getElementsByTagName('p')[0],
			stars = document.getElementById('score').getElementsByTagName('div');

		var msgArr = ['(╯‵□′)╯','(*@ο@*)','( ‵o′)凸','(ーー゛)','∑(っ °Д °;)っ'];
		var flg = true;
		for (var i = 0; i < stars.length; i++) {
			stars[i].index = i;
			stars[i].onmouseover = function(){
				for (var i = 0; i < stars.length; i++) {
					if(stars[i].index<=this.index){			//小于当前下标的变样式、其他清样式
						stars[i].className = 'scoreActive';
					}else{												
						stars[i].className = '';
					}				
				};
				tip.innerHTML = msgArr[this.index];			//改变信息内容
			}

			stars[i].onmouseout = function(){
				for (var i = 0; i < stars.length; i++) {
					stars[i].className = '';
				};
				tip.innerHTML = msgArr[0];
			}

			stars[i].onclick = function(){
				if(flg){
					flg = false;
					for (var i = 0; i < stars.length; i++) {
						stars[i].onmouseover = null;			//接触移入移出事件
						stars[i].onmouseout = null;
					};
					alert(this.index+1);	
				}
			}
		};
	}








}


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


var app = angular.module('routeApp',['ngRoute']);
app.config(['$routeProvider',function($routeProvider){
	$routeProvider
	.when('/phones',{
		templateUrl:'ng/list.html',
		controller:'listCtrl'
	})
	.when('/phones/:id',{
		templateUrl:'ng/phoneDetail.html',
		controller:'detailCtrl'
	})
	.otherwise({redirectTo: '/'});
}]);


app.controller('listCtrl',['$scope','PhoneService',function($scope,PhoneService){
	PhoneService.list().success(function(data){
		$scope.phones = data;
	});
}]);

app.controller('detailCtrl',['$scope','$routeParams','PhoneService',function(
	$scope,$routeParams,PhoneService){
	PhoneService.query($routeParams.id*1).success(function(data){
		$scope.phone = data[$routeParams.id*1-1];
	});
}]);


// var services= angular.module('MyFirstServices',['ngResource'])
app.factory('PhoneService',['$http',function($http){

	var queryData = function(id){
		console.log('query-id: '+id);
		return $http.get('/WWW/public/data/data.json')
	}

	return {
		query: function(id){
			return queryData(id);
		},	
		list: function(){
			return queryData();
		}
	}
}]);

$('.waver-img').mouseover(function(){
	$(this).removeClass('waver').offset($(this).offset()).addClass('waver');
})