/**
 * notice_module:顶部通知不再显示模块
 */
var notice_module = (function () {
	var notice = $.ge(".m-notice"),
		close = $.ge(".unnotice");
	// 如果没有设置cookie则显示
	if (!cookieUtil.getCookie()["unnotice"]){
		notice.style.display = "block";
	}
	//点击则设置cookie并隐藏
	EventUtil.addHandler(close,'click',function (ev) {
		cookieUtil.setCookie("unnotice","yes");
		notice.style.display = "none";
	});
})();
/**
 * attention_module : 关注与登录模块
 */
var attention_module = (function () {
	var l_tem = 
	'<div class="m-login">\
        <div class="login">\
            <div class="close">关闭</div>\
            <h2>登录云课堂</h2>\
            <form id="login-form">\
                <input type="text" placeholder="账号" name="userName" class="user" required maxlength="19">\
                <input type="password" name="password" placeholder="密码" class="pass">\
                <p class="login-error" style="display:none;">用户名或密码错误，请重新输入！</p>\
                <div class="login-btn">登 录</div>\
            </form>\
        </div>\
    </div>';
    var login = html2node(l_tem);
    var btn = login.querySelector('#login-form .login-btn');
    var close = login.querySelector('.login .close');
    var ui = login.querySelector('#login-form .user');
    var pi = login.querySelector('#login-form .pass');
    var error = login.querySelector('#login-form .login-error');
	var fol = $.ge('.g-fol .follow'),
	    fold = $.ge('.followed'),
		login_url = "http://study.163.com/webDev/login.htm",
		fol_url = "http://study.163.com/webDev/attention.htm",
		cancel = $.ge('.followed .cac');
	//首先判断有无关注的cookie
	if (cookieUtil.getCookie()['followSuc']){
			showFollow();
	}
	//关注按钮点击事件
	EventUtil.addHandler(fol,'click',function (ev) {
		//判断是否有登录cookie:有则调用关注API，无则弹出登录框
		if (cookieUtil.getCookie()['loginSuc']){
			ajaxUtil.get(fol_url,null,follow);
		} else {
			document.body.appendChild(login);
		}
	});
	//关闭登录框事件
	EventUtil.addHandler(close,'click',function (ev) {
		//移除登录框
		document.body.removeChild(login);
	});
	//登录按钮事件
	EventUtil.addHandler(btn,'click',function (ev) {
		var user = ui.value,
			pass = pi.value,
			options = {userName:md5(user),password:md5(pass)};
		//调用登录API
		ajaxUtil.get(login_url,options,login_form);
	});
	//输入框事件隐藏错误信息
	EventUtil.addHandler(ui,'input',function (ev) {
		error.style.display = 'none';
	});
	EventUtil.addHandler(pi,'input',function (ev) {
		error.style.display = 'none';
	});

	//取消关注点击事件
	EventUtil.addHandler(cancel,'click',function (ev) {
		showFollow();
		//删除已关注的cookie
		cookieUtil.setCookie("followSuc","followed",new Date());
	});

	//显示或隐藏已关注函数
	function showFollow() {
		if (fol.style.display == 'block'){
			fol.style.display = 'none';
			fold.style.display = 'block';
		} else {
			fol.style.display = 'block';
			fold.style.display = 'none';
		}
	}
	//登录回调函数
	function login_form(res) {
		//登录成功则设置cookie,移除登录框，调用关注API
		if (res == 1){
			cookieUtil.setCookie('loginSuc','successd');
			document.body.removeChild(login);
			ajaxUtil.get(fol_url,null,follow);
		} else{
			error.style.display = 'block';
		}
	}
	//关注回调函数
	function follow(data) {
		//关注成功则设置cookie
		if (data == 1){
			cookieUtil.setCookie("followSuc","followed");
			showFollow();
		} else {
			alert('获取关注信息失败！')
		}
	}
})();
/**
 * 轮播图模块
 * 
 */
var banner_moudels = (function () {
	var banner = $.ge('.m-banner'),
		imgNodes =$.ges('.m-banner a'),
		img_count = imgNodes.length,
		buttons = $.ges('.m-banner span'),
		now_index = 0;
	//开启自动轮播定时器
	var	totaltimer = setInterval(nextc,5000);
	//鼠标悬停时停止自动轮播
	EventUtil.addHandler(banner,'mouseover',function (ev) {
		clearInterval(totaltimer);
	});
	//鼠标离开时再开启定时器
	EventUtil.addHandler(banner,'mouseout',function (ev) {
		totaltimer = setInterval(nextc,5000);
	});
	//小圆点点击时跳转
	buttons.forEach(function (item,index) {
		EventUtil.addHandler(item,'click',function (ev) {
			if (now_index == index){
				return;
			} else{
				nav(index);
			}
		});
	});
	//计算当前轮播指针函数
	function nextc() {
		now_index++;
		if (now_index >= img_count){
			now_index = 0;
		}
		nav(now_index);
	}
	//根据当前指针确定显示的图
	function nav(index) {
		for (var i = 0;i < img_count;i++){
			buttons[i].className = "";
			imgNodes[i].style.display = "none";
			imgNodes[i].style.opacity = 0;
		}
		imgNodes[index].style.display = "block";
		buttons[index].className = "on";
		move(imgNodes[index],{opacity:100});
		now_index = index;
	}
})();
/**
 * 生活区无限滚动模块
 */
var pictures = (function () {
	var g_pic = $.ge('.g-pictures');
	var m_pic = $.ge('.m-pictures');
	//复制所有li,运动目标值为图片区域宽度的一半
	m_pic.innerHTML += m_pic.innerHTML;
	var ov = -m_pic.offsetWidth/2;
	//开启自动轮播
	var pic_timer = setInterval(startMove,15);
	//鼠标悬停时停止自动轮播
	EventUtil.addHandler(g_pic,'mouseover',function (ev) {
		clearInterval(pic_timer);
	});
	EventUtil.addHandler(g_pic,'mouseout',function (ev) {
		pic_timer = setInterval(startMove,15);
	});
	//运动函数当小于目标值时则恢复原值
	function startMove() {
		var now_left = m_pic.offsetLeft;
		if (now_left <= ov){
			m_pic.style.left = 0;
		} else{
			m_pic.style.left = now_left - 1 + "px";
		}
	}
})();
/**
 * 获取课程模块
 */
 var get_course = (function () {
 	//课程卡片模板
 	var c_temp = 
 	'<div class="u-cover">\
 	    <a class="wrap clearfix">\
 	        <img class="imgpic" width="223" height="124">\
 	        <h3 class="tt f-oh f-fs0"></h3>\
 	        <div class="orgname f-oh f-fs0"></div>\
 	        <div class="num">\
 	            <span class="hot"></span>\
 	        </div>\
 	        <div class="price">\
 	            <span class="pri f-fs0"></span>\
 	        </div>\
 	        <div class="kind">分类：<span class="kindname"></span></div>\
 	        <div class="disc"></div>\
 	    </a>\
 	</div>';
 	var cNode = html2node(c_temp);
 	var c_url = "http://study.163.com/webDev/couresByCategory.htm",	
 		option = {pageNo:1,psize:20,type:10};//初始化请求参数
 	var ccontainer = $.ge('.m-data-lists');
 	//初始化绘制第一页数据
 	ajaxUtil.get(c_url,option,drawCourse);
 	//绘制课程信息函数
 	function drawCourse(response) {
 		var obj = JSON.parse(response),
 			list = obj.list,
 			coverNodes = [].slice.call(document.getElementsByClassName('u-cover'));
 		for (var i = coverNodes.length-1;i >= 0;i--){
 			ccontainer.removeChild(coverNodes[i]);
 		}
 		for(var i = 0;i < list.length;i++){
 			var content = cNode.cloneNode(true);
 			var price = list[i].price;
 			if (price == 0){
 				price = "免费"
 			} else {
 				price = "¥ " + price + ".00";
 			}
 			var categoryName = list[i].categoryName;
 			if (String(categoryName) == "null"){
 				categoryName = "暂无";
 			}
 			var description = list[i].description;
 			var img = content.getElementsByTagName('img')[0];
 			img.src = list[i].middlePhotoUrl;
 			img.alt = list[i].name;
 			var h3 = content.getElementsByTagName('h3')[0];
 			h3.innerText = list[i].name;
 			var org = content.getElementsByClassName('orgname')[0];
 			org.innerText = list[i].provider;
 			var num = content.getElementsByClassName('hot')[0];
 			num.innerText = list[i].learnerCount;
 			var kind = content.getElementsByClassName('kindname')[0];
 			kind.innerText = categoryName;
 			var desc = content.getElementsByClassName('disc')[0];
 			desc.innerText = list[i].description;
 			var pri = content.getElementsByClassName('pri')[0];
 			pri.innerText = price;
 			ccontainer.appendChild(content);
 		}
 	}

 	//分页器
 	var pg = $.ge('.m-pager');
 	var as = $.ges('.m-pager .pg');
 	var prev = $.ge('.m-pager .prv');
 	var next =$.ge('.m-pager .nxt');
 	//对分页器事件代理获取当前index
 	EventUtil.addHandler(pg,'click',function (ev) {
 		var event = EventUtil.getEvent(ev);
 		var target = EventUtil.getTarget(event);
 		if (target.nodeName.toLowerCase() === "a"){
 			var current = Number(target.getAttribute('data-index'));
 			//当获取到的数据小于1或者大于总页数或者等于当前页数不执行操作	
 			if (current == option.pageNo || current == 0 || current == 31) return;
 			//否则调用课程API重新绘制分页器
 			option.pageNo = current;
 			calIndex(option.pageNo);
 			ajaxUtil.get(c_url,option,drawCourse);
 		}
 	});
 	//根据当前页数计算要显示的8页
 	function calIndex(cur) {
 		(cur - 1 == 0) ? (prev.className = 'prv f-dis'):(prev.className = 'prv');
 		(cur + 1 == 31) ? (next.className = 'nxt f-dis'):(next.className = 'nxt');
 		prev.setAttribute('data-index',cur - 1);
 		next.setAttribute('data-index',cur + 1);
 		var num;
 		//始终保持第五个为当前页
 		if (cur < 5){
 			num = 1;
 		} else if (cur > 27){
 			num = 23; 
 		} else {
 			num = cur - 4;
 		}
 		drawPage(num);
 	}
 	function drawPage(nu) {
 		for (var i = 0,len = as.length;i < len;i++){
 			as[i].setAttribute('data-index',i + nu);
 			as[i].innerText = i + nu;
 			if (i + nu == option.pageNo){
 				as[i].className = 'pg selected';
 			}else {
 				as[i].className = 'pg';
 			}
 		}
 	}

 	var mnav = $.ge('.m-nav');
 	var aTags = $.ges('.m-nav a');
 	//筛选类型事件代理函数
 	EventUtil.addHandler(mnav,'click',function (ev) {
 		var event = EventUtil.getEvent(ev);
 		var target = EventUtil.getTarget(event);
 		if (target.nodeName.toLowerCase() === 'a'){
 			aTags.forEach(function (item) {
 				item.className = '';
 			})
 			target.className = 'selected';
 			var curType = Number(target.getAttribute('data'));
 			if (curType == option.type){
 				return;
 			} else {
 				option.type = curType;
 				option.pageNo = 1;
 				calIndex(1);
 				ajaxUtil.get(c_url,option,drawCourse);
 			}
 		}
 	});

 })();
/**
 * 最热排行模块
 */
var topHot_moudel = function () {
	var t_temp =
	'<li class="item">\
	    <a class="clearfix">\
	        <img class="imgpic" width="50" height="50">\
	        <h3 class="tt f-oh"></h3>\
	        <div class="num"></div>\
	    </a>\
	</li>';
	var tNode = html2node(t_temp);
	var ulNode = $.ge('.m-toplit'),
		t_url = 'http://study.163.com/webDev/hotcouresByCategory.htm',
		scollTimer;
	ajaxUtil.get(t_url,null,drawHot);
	function drawHot(response) {
		var data = JSON.parse(response);
		for (var i = 0,len = data.length;i < len;i++){
			var liClone = tNode.cloneNode(true);
			var img = liClone.querySelector('.imgpic');
			img.src = data[i].smallPhotoUrl;
			img.alt = data[i].name;
			var h3 = liClone.querySelector('.tt');
			h3.innerText = data[i].name;
			var count = liClone.querySelector('.num');
			count.innerText = data[i].learnerCount;
			ulNode.appendChild(liClone);
		}
		ulNode.innerHTML += ulNode.innerHTML;
	}
	setTimeout(startScoll,5000);
	function startScoll() {
		scollTimer = setInterval(scollDown,30);
		ulNode.style.top = parseInt(ulNode.style.top) + 5 + "px";
	}
	function scollDown() {
		var now_top = parseInt(ulNode.style.top);
		if (now_top % 90 == 0){
			clearInterval(scollTimer);
			setTimeout(startScoll,5000);
		} else {
			if(now_top >= 0){
				ulNode.style.top = "-1800px";
			}
			ulNode.style.top = parseInt(ulNode.style.top) + 5 + "px";
		}
	}
	
}();
/**
 * 视频播放模块
 */
var viedeo_moudel = (function () {
	var v_temp = 
	'<div class="m-video">\
	    <div class="v-content">\
	        <h2>请观看下面的视频</h2>\
	        <div class="close">关闭</div>\
	        <div class="v-wrap">\
	            <video controls loop id="movie">\
	                <source src="http://mov.bn.netease.com/open-movie/nos/mp4/2014/12/30/SADQ86F5S_shd.mp4"> 你的浏览器不支持该视频播放.请升级你的浏览器\
	            </video>\
	        </div>\
	    </div>\
	</div>';
	var vNode = html2node(v_temp);
	var v_close = vNode.querySelector('.close');
	var img_pic = $.ge('.playbox .imgpic');
	EventUtil.addHandler(img_pic,'click',function (ev) {
		document.body.appendChild(vNode);
		var v_content = $.ge('#movie');
		if (v_content.paused){
			v_content.play();
		}
	});
	EventUtil.addHandler(v_close,'click',function (ev) {
		document.body.removeChild(vNode);
	});
})();