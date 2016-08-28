(function(){
	var imgBox=tools.$(".imgBox")[0];
	var lis=tools.$("li",imgBox);
	var dot=tools.$(".dot")[0];
	var as=tools.$("a",dot);
	var timer=null;
	var num=0;

	lis[0].style.opacity=1;
	as[0].style.backgroundColor="#1e77d6";
	autoChange();
	//	点击事件
	for(var i=0;i<as.length;i++){
		as[i].index=i;
		as[i].onclick=function(){
			clearInterval(timer);
			num=this.index;
			clear(num);
			autoChange()
		}
	}
	function autoChange(){
		timer=setInterval(function(){
			num++;
			num%=lis.length;
			clear(num);
			
		},2000)
	}
	function clear(num){
		for(var i=0;i<lis.length;i++){
			lis[i].style.opacity=0;
			as[i].style.backgroundColor="";
		}
		lis[num].style.opacity=1;
		as[num].style.backgroundColor="#1e77d6";
	}
	var login_btn=tools.$(".login_btn")[0];
	var username=tools.$(".username")[0];
	var password1=tools.$(".password")[0];
	tools.addEvent(login_btn,"click",function(){
		if(username.value==""||password1.value==""){
			alert("请确认是否有空缺项");
		}
		if(username.value=="123"&& password1.value=="123"){
			window.open("index/bdy.html");
		}
	})
})()
