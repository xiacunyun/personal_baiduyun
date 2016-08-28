var tools = (function(){
	var toolsObj={
		$:function (selector,obj){
			obj=obj||document;
			if(selector.indexOf(" ")!=-1){//如果包含空格，通过querySelector的方式获取
				return obj.querySelector(selector)
			}else if(selector.charAt(0)==="#"){//通过id的方式获取
				return document.getElementById(selector.substr(1))
			}else if(selector.charAt(0)==="."){//calssName方式获取
				return obj.getElementsByClassName(selector.substr(1))
			}else{//tagName方式获取
				return obj.getElementsByTagName(selector)
			}
		},
		addEvent:function(obj,eventType,fnHandle){
			obj.addEventListener(eventType,fnHandle,false)
		},
		removeEvent:function(obj,eventType,fnHandle){
			obj.removeEventListener(eventType,fnHandle,false)
		},
		collision:function(obj1,obj2){//碰撞检测:碰上返回true，否则返回false
			var pos1=obj1.getBoundingClientRect();
			var pos2=obj2.getBoundingClientRect();
			if(pos1.right<pos2.left||pos1.left>pos2.right||pos1.bottom<pos2.top||pos1.top>pos2.bottom){
				return false;
			}else{
				return true;
			}
		},
		each:function(obj,callback){
			for(var i=0;i<obj.length;i++){
				callback(obj[i],i)
			}
		},
		containClass:function(ele,classNames){
			var classNameArr=ele.className.split(" ");
			for(var i=0;i<classNameArr.length;i++){
				if(classNameArr[i]==classNames){
					return true;
				}
			}
			return false;
		},
		store:function(namespace,data){
			if (data) {
				return localStorage.setItem(namespace, JSON.stringify(data));
			}
			var store = localStorage.getItem(namespace);
			return (store && JSON.parse(store)) || [];
		}
	}
	return toolsObj;
}())