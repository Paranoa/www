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

