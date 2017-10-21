/**
 *获取实际样式函数
 * @param   {Object} obj  需要获取样式的对象
 * @param   {String} attr 获取的样式名
 * @returns {String} 获取到的样式值
 */
function getStyle(obj, attr) {
    //IE写法
    if (obj.currentStyle) {
        return obj.currentStyle[attr];
        //标准
    } else {
        return getComputedStyle(obj, false)[attr];
    }
}
/**
 * [获取cookie]
 * @return {[Object]} [返回一个cookie的对象，以cookie[name]的形式访问]
 */
function getCookie() {
    var cookie = {};
    var all = document.cookie;
    if (all === '') return cookie;
    var list = all.split('; ');
    for (var i = 0, len = list.length; i < len; i++) {
        var item = list[i];
        var p = item.indexOf('=');
        var name = item.substring(0, p);
        name = decodeURIComponent(name);
        var value = item.substring(p + 1);
        value = decodeURIComponent(value);
        cookie[name] = value;
    }
    return cookie;
}
/**
 * [setCookie 设置cookie]
 * @param {[String]} name
 * @param {[String]} value
 * @param {[String]} expires
 * @param {[String]} path
 * @param {[String]} domain
 * @param {[String]} secure
 */
function setCookie(name, value, expires, path, domain, secure) {
    var cookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    if (expires)
        cookie += '; expires=' + expires.toGMTString();
    if (path)
        cookie += '; path=' + path;
    if (domain)
        cookie += '; domain=' + domain;
    if (secure)
        cookie += '; secure=' + secure;
    document.cookie = cookie;
}
/**
 * [preventDefault 对IE的兼容]
 * 阻止默认行为
 */
function preventDefault(event){
    if(event.preventDefault){
        event.preventDefault();
    }else{    
        event.returnValue = false;
    }
}
/**
 * [Ajax get请求函数封装]
 * @param  {String}   url      [请求地址]
 * @param  {Object}   options  [请求的参数必须为{a:"",b,""}类型]
 * @param  {Function} callback [请求成功后要执行回调函数，接收参数为服务器返回来的数据]
 */
function ajax_get(url,options,callback){
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                callback(xhr.responseText);
            } else {
                console.error('Request was unsuccessful: ' + xhr.status);
            }
        };
    }
    if (!!options) {
        var url = url + '?' + serialize(options);
        // console.log(url);
    };
    xhr.open("get",url,true);
    xhr.send(null);

    function serialize(data){
        if (typeof data == 'object') {
            var str = '';
            for (var key in data) {
                str += key + '=' + data[key] + '&';
            }
            data = str.replace(/&$/, '');
            // console.log(data);
        }
        return data ;
    }
}
/**
 *运动框架实现功能：
 *1.任意属性值的改变如width,heigt,opacity...
 *2.多个物体(元素)运动：如ul的所有li依次滑过都改变
 *3.多个属性值同时运动：如width,height同时改变
 *3.链式运动：如先改变width再改变height
 */

/**
 * 运动框架实现功能：
 *1.任意属性值的改变如width,heigt,opacity...
 *2.多个物体(元素)运动：如ul的所有li依次滑过都改变
 *3.多个属性值同时运动：如width,height同时改变
 *3.链式运动：如先改变width再改变height
 * @param  {Htmlelment}   obj  obj是传入进来的html元素对象
 * @param  {object}   json json={width:300,height:400,...}传入要改变的属性名称(width不加“”)以及该属性要改变到的终点值
 * @param  {Function} fn   fn是回调函数,如果需要链式运动需传入如move(this,{width:400},move(this,{heigth,400}))
 */
function move(obj,json,fn) {
    //1.首先关闭定时器
    clearInterval(obj.timer);//每个对象的timer定时器需在调用前定义为null
    //2.为每一个对象开启定时器
    obj.timer=setInterval(function () {
        //在遍历每个属性前需要定义一个flag只有当每一个属性的值达到目标值才能清除定时器
        var flag = true ;
        for(var attr in json){//变量attr代表json里的每一个属性值
            //确认当前属性的值attr_value
            var attr_value = 0;
            if(attr=='opacity'){
                attr_value = Math.round((parseFloat(getStyle(obj,attr)))*100);//返回的是小数点形式传入的是*100的整形值
            }
            else{
                attr_value = parseInt(getStyle(obj,attr));
            }
     //只有当前属性值attr_value不等于目标值json[attr]时才改变属性值，并将flag变为false保证所有的属性都能达到目标值
            if(attr_value!=json[attr]){
                flag = false;
                //确定属性改变运动的速度speed
                var speed = (json[attr]-attr_value)/100;
                speed = (speed>0)?Math.ceil(speed):Math.floor(speed);
                //变化属性值公式
                attr_value = attr_value+speed;
                //将变化过后的属性值赋给属性
                if(attr=='opacity'){
                    obj.style.opacity = attr_value/100;
                    obj.style.filter = "alpha(opacity:"+attr_value+")";
                }
                else{
                    obj.style[attr] = attr_value+"px";
                }
            }
        }
        if(flag){
            clearInterval(obj.timer);
            //在所有属性达到目标值后，如果有回调函数fn则执行，形成链式运动
            if(fn){
                fn();
            }
        }
    },10)
}
/**
* 判断是否有某个className
* @param {HTMLElement} element 元素
* @param {string} className className
* @return {boolean}
*/
function hasClass(element, className) {
    var classNames = element.className;
    if (!classNames) {
        return false;
    }
    classNames = classNames.split(/\s+/);
    for (var i = 0, len = classNames.length; i < len; i++) {
        if (classNames[i] === className) {
            return true;
        }
    }
    return false;
}
/**
* 删除元素className
*
* @param {HTMLElement} element 元素
* @param {string} className className
*/
function removeClass(element, className) {
    if (className && hasClass(element, className)) {
        var classNames = element.className.split(/\s+/);
        for (var i = 0, len = classNames.length; i < len; i++) {
            if (classNames[i] === className) {
                classNames.splice(i, 1);
                break;
            }
        }
    element.className = classNames.join(' ');
    }
}