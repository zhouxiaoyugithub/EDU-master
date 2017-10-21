// 封装选择器操作
var $ = {
    ge: function (selector) {
        return document.querySelector(selector);
    },
    ges: function (selector) {
        return [].slice.call(document.querySelectorAll(selector)); 
    }
};
// cookie工具
var cookieUtil = {
    setCookie: function (name, value, expires, path, domain, secure) {
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
    },
    getCookie: function () {
        var cookie = {};
        var all = document.cookie;
        if (all === '')
            return cookie;
        var list = all.split('; ');
        for (var i = 0; i < list.length; i++) {
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
};

//事件处理工具
var EventUtil = {
    addHandler: function (element,type,handler) {
        if (element.addEventListener){
            element.addEventListener(type,handler,false);
        } else if (element.attachEvent){
            element.attachEvent("on" + type,handler);
        } else {
            element["on" + type] = handler;
        }
    },
    getEvent: function (event) {
        return event ? event : window.event;
    },
    getTarget: function (event) {
        return event.target || event.srcElement;
    }
};
/**
 * 将字符串模板转化为DOM节点函数
 * @param  {string} str dom的字符串表现形式
 * @return {HTMLElement}     
 */
function html2node(str){
    var container = document.createElement('div');
    container.innerHTML = str;
    return container.children[0];
}
/**
 * 序列化url查询参数函数
 * @param  {obj} data 
 * @return {string}      
 */
function serialize(data) {
    if (!data) return '';
    var pairs = [];
    for (var name in data) {
        if (!data.hasOwnProperty(name)) continue;
        if (typeof data[name] === 'function') continue;
        var value = data[name].toString();
        name = encodeURIComponent(name);
        value = encodeURIComponent(value);
        pairs.push(name + '=' + value);
    }
    return pairs.join('&');
}
//ajax操作封装
var ajaxUtil = {
    get: function (url,options,callback) {
        var url = options ? url + '?' + serialize(options) : url;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4) {
                if ((xhr.status >= 200 && xhr.status <300) || xhr.status == 304) {
                    callback(xhr.responseText);
                } else {
                    alert('Request was unsuccessful: ' + xhr.status);
                }
            }
        }
        xhr.open('get',url,true);
        xhr.send(null);
    }
};
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
 * 以速度为基准的运动框架函数
 * @param  {Htmlelment}   obj  obj是传入进来的html元素对象
 * @param  {object}   json key:属性名字,value:目标值
 * @param  {Function} fn   fn是回调函数,如果需要链式运动需传入
 */
function move(obj,json,fn) {
    clearInterval(obj.timer);
    obj.timer = setInterval(function () {
        var flag = true ;
        for (var attr in json){
            var attr_value = 0;
            if (attr == 'opacity'){
                attr_value = Math.round((parseFloat(getStyle(obj,attr)))*100);
            } else {
                attr_value = parseInt(getStyle(obj,attr));
            }
            if (attr_value!=json[attr]){
                flag = false;
                var speed = (json[attr] - attr_value)/20;
                speed = (speed>0) ? Math.ceil(speed) : Math.floor(speed);
                attr_value = attr_value + speed;
                if(attr == 'opacity'){
                    obj.style.opacity = attr_value/100;
                    obj.style.filter = "alpha(opacity:" + attr_value + ")";
                } else {
                    obj.style[attr] = attr_value + "px";
                }
            }
        }
        if (flag){
            clearInterval(obj.timer);
            if (fn){
                fn();
            }
        }
    },20);
}






