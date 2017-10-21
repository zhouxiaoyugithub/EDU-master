/**
 * notice_module:顶部通知不再显示模块
 */
var notice_module = (function () {
	var notice = document.querySelector(".m-notice"),
		close = document.querySelector(".unnotice"),
		cookie = getCookie(),
		name = "unnotice" ,
	    value = "yes" ;
	if(cookie[name]!=value){
		notice.style.display="block";
	}
	close.onclick = function () {
		setCookie(name,value);
		notice.style.marginTop = "-36px";
	}
})();
/**
 * attention_module : 关注与登录模块
 */
var attention_module = (function () {
	var fol = document.querySelector('.g-fol .follow'),//关注
	    fold = document.querySelector('.followed'),//已关注
		login = document.querySelector('.m-login'),//登录框
		close = document.querySelector('.login .close'),//关闭登录框
		form = document.querySelector('#login-form'),//表单
		btn = document.querySelector('#login-form .login-btn'),//提交按钮
		login_url = "//study.163.com/webDev/login.htm",//请求登录的url
		userinput = form["userName"],
		passinput = form["password"],
		error = document.querySelector('.login-error'),//错误信息
		fol_url = "//study.163.com/webDev/attention.htm",//导航关注url
		cancel = document.querySelector('.followed .cac'),
		follow_name = "followSuc",
		follow_value = "followed",
		login_name = "loginSuc",
		login_value = "successd";
	//首先判断是否有关注的cookie
	if(getCookie()[follow_name]==follow_value){
			showFollow(false);
	}
	//点击关注事件
	fol.onclick=function () {
		if(getCookie()[login_name]==login_value){
			getFollow();
		}
		else{
			showLogin(true);
		}
	}
	//点击取消关注事件
	cancel.onclick = function () {
		showFollow(true);
		setCookie(follow_name,follow_value,new Date());//删除关注cookie
	}
	//点击登录事件
	btn.onclick = function () {
		var user = userinput.value,
			pass = passinput.value,
			options = {userName:md5(user),password:md5(pass)};
		ajax_get(login_url,options,res_form);
	}
	//输入事件取消显示错误信息
	userinput.oninput = function() {
		showErro(false);
	}
	passinput.oninput = function () {
		showErro(false);
	}
	// 关闭登录框
	close.onclick = function () {
		showLogin(false);
	}

	// 提交密码服务器验证的回调函数
    function res_form (response) {
		if(response=="1"){
			showFollow(false);
			showLogin(false);
			setCookie(login_name,login_value);
			getFollow();
		}
		else{
			showErro(true);
		}
	}
	// 获取关注信息
	function getFollow() {
		ajax_get(fol_url,null,function (res) {
			if(res == 1){
			setCookie(follow_name,follow_value);
			showFollow(false);
			}
			else{
				alert("关注信息获取失败");
			}
		});
	}
	// 显示或隐藏关注
	function showFollow(flag) {
		if(flag){
			fol.style.display = "block";
			fold.style.display = "none";
		}
		else{
			fol.style.display = "none";
			fold.style.display = "block";
		}
	}
	// 显示或隐藏登录框
	function showLogin(flag) {
		if(flag){
			login.style.display = "block";
			form.reset();
			error.style.display = "none" ;
		}
		else{
			login.style.display = "none";
		}
	}
	//显示或隐藏错误信息
	function showErro(flag) {
		if(flag){
			error.style.display = "block";
		}
		else{
			error.style.display = "none";
		}
	}
})();
/**
 * 轮播图模块
 * 
 */
var banner_moudels = (function () {
	var banner = document.querySelector('.m-banner'),//轮播图区域
		imgNodes = banner.getElementsByTagName('a'),//图片链接
		img_count = imgNodes.length,//图片个数
		buttons = banner.getElementsByTagName('span'),//按钮
		totaltimer,//计时器
		now_index = 0,//当前第几张图在显示
		next = document.querySelector('.m-banner .arrow-right'),//下一张
		prev = document.querySelector('.m-banner .arrow-left');//上一张
	next.onclick = function () {
		clearInterval(totaltimer);
		now_index++;
		if(now_index>=img_count){
			now_index = 0;
		}
		startMove(now_index);
	}
	prev.onclick = function () {
		clearInterval(totaltimer);
		now_index--;
		if(now_index<=-1){
			now_index = img_count-1;
		}
		startMove(now_index);
	}
	//所有图淡出 当前index图淡入
	function startMove(index) {
		for(var i=0;i<img_count;i++){
			buttons[i].className="";
			move(imgNodes[i],{opacity:0});
			imgNodes[i].style.display="none";
		}
		imgNodes[index].style.display="block";
		buttons[index].className="on";
		move(imgNodes[index],{opacity:100});
		now_index = index;
	}
	// 按钮点击事件
	for(var i=0;i<buttons.length;i++){
		buttons[i].onclick=function () {
			if(now_index==this.getAttribute("data-index")){
				return ;
			}
			else{
				startMove(this.getAttribute("data-index"));
			}
		}
	}
	function play() {
		totaltimer = setInterval(function () {
			next.onclick();
		},5000)
	}
	
	banner.onmouseover=function () {
		clearInterval(totaltimer);
	}
	banner.onmouseout = play;
	play();
})();
/**
 * 生活区无限滚动模块
 */
var pictures = (function () {
	var g_pictures = document.getElementsByClassName('g-pictures')[0],
	    m_pictures = g_pictures.getElementsByClassName('m-pictures')[0],
	    pic_timer ;
	m_pictures.innerHTML+=m_pictures.innerHTML;
	var object_value = -m_pictures.offsetWidth/2;
	pic_timer=setInterval(startMove,10);
	function startMove() {
		var now_left = m_pictures.offsetLeft;
		if(now_left<=object_value){
			m_pictures.style.left = 0;
		}
		else{
			m_pictures.style.left = now_left-1+"px";
		}
	}
	g_pictures.onmouseover=function () {
		clearInterval(pic_timer);
	}
	g_pictures.onmouseout=function () {
		pic_timer=setInterval(startMove,10);
	}
})();
/**
 * 获取课程模块
 */
 var get_course = (function () {
 	var mnav = document.querySelector('.m-nav'),//tab
 		mnavTag = mnav.getElementsByTagName('a'),//Tab下的标签区域
 		mpager = document.querySelector('.m-pager'),// 分页器区域
 		templete = document.querySelector('.f-templete'),//内容模板
 		url = "//study.163.com/webDev/couresByCategory.htm",//课程信息u	
 		initNum = 1,   // 当前页码 随点击的页码数变化 初始为1
 		ty = 10, //种类 10代表产品设计 20代表编程语言，随tab标签的点击变化
 		pz =  20,//请求每页返回数据20个 不变 宽屏为20 窄屏为15
 		option = {pageNo:initNum,psize:pz,type:ty},//初始化请求参数
 		pageNum = 8,//分页器个数
 		lightNum = Math.floor(pageNum/2)+1;//保证第几个位置亮
 	//初始化调用ajax获取数据
 	ajax_get(url,option,drawCourse);
 	//根据	绘制课程列表
 	function drawCourse(response) {
 		var obj = JSON.parse(response),
 			totalPage = obj.totalPage,//返回的数据总页数 宽屏31 窄屏41
 			list = obj.list,
 			coverNodes = document.getElementsByClassName('u-cover');
 		for(var i =coverNodes.length-1;i>0;i--){//从最后一个开始删除,保留第一个
 			templete.parentNode.removeChild(coverNodes[i]);
 		}
 		for(var i = 0;i<list.length;i++){
 			var content = templete.cloneNode(true);
 			removeClass(content,"f-templete");
 			var price = list[i].price;//课程价格，0为免费
 			if(price==0){
 				price="免费"
 			}
 			else{
 				price="¥ "+price+".00";
 			}
 			var categoryName = list[i].categoryName;//课程分类
 			if(String(categoryName)=="null"){
 				categoryName="暂无";
 			}
 			var description = list[i].description;//课程描述
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
 			templete.parentNode.appendChild(content);
 		}
 		page(totalPage,option.pageNo); 
 	}
 	//根据当前页码和总页数来绘制翻页器
 	function page(tl,pi) {
		var pi = pi,
			tl = tl;
		    count = pi-lightNum ,//用于判断第几个亮
		min = count+1,//最低也要大于等于1
		max = count+pageNum;//最高不能超过总页数
		mpager.innerHTML = "";
		//创建a节点
		function createNode(atr,text,classStr) {
			var obj = document.createElement("a");
			obj.setAttribute("index",atr);
			obj.innerText = text;
			obj.className = classStr;
			return obj;
		}
		var prev = createNode(pi-1,"上一页","prv f-dis");
		if(pi!=1){
			removeClass(prev, "f-dis");
		}
		mpager.appendChild(prev);
		for(var i =1;i<=pageNum;i++){
			var aNode,
				lg;
			if(min<=1){//让当前页作为显示区域
				lg = i;
			}
			else if(max>=tl){
				lg = tl-pageNum+i;
			}
			else{
				lg = pi-lightNum+i;
			}
			aNode = createNode(lg,lg,"pg selected");
			if(lg!=pi){
				removeClass(aNode,"selected");
			}
			mpager.appendChild(aNode);
		}
		//再创建下箭头节点
		var next = createNode(pi+1,"下一页","nxt f-dis");
		if(pi!=tl){
			removeClass(next,"f-dis");
		}
		mpager.appendChild(next);
		//初始化完毕后对每个按钮加上点击事件
		var nodes = mpager.getElementsByTagName('a');
		for(var i=0,l=nodes.length;i<l;i++){
			nodes[i].onclick = function (event) {
				var this_num = parseInt(this.getAttribute("index"));
				if(pi==this_num || this_num==0 || this_num==tl+1){
					return;
				}
				else{
					option.pageNo = this_num;
					ajax_get(url,option,drawCourse);
				}
				preventDefault(event);
			}
		} 
 	}
 	//tab切换
 	for(var i = 0,tl = mnavTag.length;i<tl;i++){
 		mnavTag[i].onclick=function () {
 			for(var j=0;j<tl;j++){
 				mnavTag[j].className="";
 			}
 			this.className="selected";
 			if(parseInt(this.getAttribute("data"))!=option.type){
 				option.pageNo = initNum; 
 				option.type = parseInt(this.getAttribute("data"));
 				ajax_get(url,option,drawCourse);
 			}
 		}
 	}
 })();
/**
 * 最热排行模块
 */
var topHot_moudel = function () {
	var ulNode = document.querySelector('.m-toplit'),
		liNode = ulNode.getElementsByTagName("li"),
		url = '//study.163.com/webDev/hotcouresByCategory.htm',
		li_templete = document.querySelector('.item'),
		scollTimer;
	ajax_get(url,null,drawHot);
	function drawHot(response) {
		var data = JSON.parse(response);
		for(var i=0;i<data.length;i++){
			var liClone = li_templete.cloneNode(true);
			removeClass(liClone,"f-templete");
			var img = liClone.querySelector('.imgpic');
			img.src = data[i].smallPhotoUrl;
			img.alt = data[i].name;
			var h3 = liClone.querySelector('.tt');
			h3.innerText = data[i].name;
			var count = liClone.querySelector('.num');
			count.innerText = data[i].learnerCount;
			li_templete.parentNode.appendChild(liClone);
		}
		li_templete.parentNode.innerHTML+=li_templete.parentNode.innerHTML;
	}
	// 无限滚动	
	function startScoll() {
		scollTimer = setInterval(scollDown,30);
		ulNode.style.top = parseInt(getStyle(ulNode,"top"))+5+"px";
	}
	function scollDown() {
		var now_top = parseInt(getStyle(ulNode,"top"));
		if(now_top%90==0){
			clearInterval(scollTimer);
			setTimeout(startScoll,5000);
		}
		else{
			if(now_top>=0){
				ulNode.style.top = "-1800px";
			}
			ulNode.style.top = parseInt(getStyle(ulNode,"top"))+5+"px";
		}
	}
	setTimeout(startScoll,5000);
}();
/**
 * 视频播放模块
 */
var viedeo_moudel = (function () {
	var img_pic = document.querySelector('.playbox .imgpic'),//图片
		video = document.querySelector('.m-video'),//视频区域
		v_content = video.querySelector('#movie'),
		close_v = video.querySelector('.m-video .close');
	img_pic.onclick = showVideo;
	close_v.onclick = hideVideo;
	function showVideo() {
		video.style.display = "block";
		if(v_content.paused){
			v_content.play();
		}
	}
	function hideVideo() {
		v_content.pause();
		video.style.display = "none";
	}
})();