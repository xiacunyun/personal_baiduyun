function showContextmenu(ev,data){
//	显示右键菜单并确定右键菜单的位置
	var e=ev||event;
	var contextmenu=document.querySelector(".contextmenu");
	contextmenu.style.display="block";
	contextmenu.style.left=e.pageX+"px";
	contextmenu.style.top=e.pageY+"px";
	contextmenu.style.zIndex=100;
	var e1=contextmenu.getBoundingClientRect();
	var oHeight=document.documentElement.clientHeight;
	var oWidth=document.documentElement.clientWidth;
	if(e1.bottom>oHeight){
		contextmenu.style.top=oHeight-e1.height+"px";
	}
	if(e1.right>oWidth){
		contextmenu.style.left=oWidth-e1.width+"px";
	}
//	创建菜单数据:点击的时候显示的内容可能会不一样，所以要传参进来
	contextmenu.innerHTML="";//每次调用的时候清空contextmenu的内容
	data.forEach(function(item,index){
		var li=document.createElement("li");
		li.innerHTML=item.name;
//		给每一个菜单项添加点击处理
		li.onclick=item.exe;
		contextmenu.appendChild(li);
	})
}
//	隐藏右键菜单
function hideContextmenu(){
	var contextmenu=document.querySelector(".contextmenu");
	contextmenu.style.display="none";
}
////新建文件夹
function createFolder(data,display1,display2){
	var checkedFile=document.querySelector(".select_node span");
	var file_box=document.querySelector(".file_box");
	var file_list=document.createElement("li");
	file_list.className="file_list fl";
	file_list.fileId=data.id;//给每个文件夹添加自定义属性
	tools.addEvent(file_list,"dblclick",function(){
		if(data.type=="file"){//如果是文件夹，进入下一级目录
			refreshDirectory(getChildren(this.fileId));//更新文件夹
			num=this.fileId;//记录当前点击的文件的id
	//		渲染导航的目录
			navArr.push({
				fileName:confirm_name.innerHTML,
				id:this.fileId
			})
			renderNav(navArr);
		}
	})
//	鼠标移入移出事件
	file_list.onmousemove=function(){
		if(create_nfile.isCreateStatus){
			return;
		}
		file_a.style.borderColor="#2e80dc";
		checkBox.style.display="inline";
	}
	file_list.onmouseout=function(){//鼠标移开文件夹的时候，判断是否被选中
		if(!checkBox.checked){//如果没有被选中，回到么有选中的状态
			file_a.style.borderColor="";
			checkBox.style.display="none";
		}
	}
	var file_a=document.createElement("a");
	file_a.className="file_a";
	file_a.innerHTML='<img src="../img/file_img.png" />';
	if(data.type=="file"){
		file_a.innerHTML='<img src="../img/file_img.png" />';
	}else if(data.type=="img"){
		file_a.innerHTML='<img src='+data.src+' />';
	}
	var checkBox=document.createElement("span");
	checkBox.className="bg checkBox";
	checkBox.checked=false;//给每个文件夹设置一个自定义开关，检测当前文件夹是否被选中
	checkBox.onclick=function(){
		if(this.checked){//如果被选中，那么再次点击取消选中
			this.style.backgroundPositionY="-228px";
		}else{
			this.style.backgroundPositionY="-248px";
		}
		this.checked=!this.checked;
//		选择文件夹的时候,遍历所有checkBox的checked属性，统计选中的文件夹的数量
		var checkFiles=file_box.querySelectorAll(".checkBox");
		var checkedFileNum=0;
		var select_all=document.querySelector(".select_all");
		for(var i=0;i<checkFiles.length;i++){
			if(checkFiles[i].checked){
				checkedFileNum++;
			}
		}
		checkedFile.innerHTML=checkedFileNum;
//		如果checkedFileNum=文件夹数量,那么勾选全选操作,否则取消
		if(checkedFileNum==checkFiles.length){
			select_all.style.backgroundPosition="-133px -253px";
			select_all.parentNode.style.backgroundColor="#f2f6ff";
			select_onoff=false;
		}else{
			select_all.style.backgroundPosition="";
			select_all.parentNode.style.backgroundColor="#f7f7f7";
			select_onoff=true;
		}
	}
	var confirm_name=document.createElement("a");
	confirm_name.style.display=display1
	confirm_name.className="confirm_name";
	if(data.name){
		confirm_name.innerHTML=data.name;
	}
	var modify_name=document.createElement("div");//编辑文件夹名称
	modify_name.className="modify_name";
	modify_name.style.display=display2;
	var textName=document.createElement("input");
	textName.type="text"
	textName.className="textName";
	textName.autofocus="autofocus";
	textName.value="新建文件夹";
	var confBtn=document.createElement("span");
	confBtn.className="bg confBtn";
	confBtn.onclick=function(){
		if(textName.value!=""){
			modify_name.style.display="none";
			confirm_name.style.display="block";
			confirm_name.innerHTML=textName.value;
//			把文件名push进files数组
			var filename=confirm_name.innerHTML;
			//在新建文件夹的情况下，遍历当前目录下的所有文件,看是否有重名的文件夹
			for(var i=0;i<getChildren(num).length;i++){
				if(getChildren(num)[i].name==filename){
					refreshDirectory(getChildren(num));
					alert("已经存在该文件夹了");
					create_nfile.isCreateStatus=false;
					renameOnoff=false;
					return;
				}
			}
			if(!renameOnoff){//如果没有点击重命名，则为新建文件夹,把数据push进数组
				localFilesData.push({
					id:getMaxId()+1,
					pid:num,
					name:filename,
					type:"file"
				});
//				更改本地存储数据
				tools.store("filesData",localFilesData)
			}else{//重命名操作，在数据中修改当前文件夹的名称
				localFilesData[getArrEq(renameFile.fileId)].name=textName.value;
				tools.store("filesData",localFilesData)
				renameOnoff=false;
			}
			checkedFileNum=0;
			checkedFile.innerHTML=checkedFileNum;
			select_all.style.backgroundPosition="-118px -253px";
			refreshDirectory(getChildren(num));
		}else{
			alert("文件夹名称不能为空")
		}
		create_nfile.isCreateStatus=false;
	}
	var cancelBtn=document.createElement("span");
	cancelBtn.className="bg cancelBtn";
	cancelBtn.onclick=function(){
		modify_name.style.display="none";
		confirm_name.style.display="block";
		refreshDirectory(getChildren(num));
		checkedFileNum=0;
		checkedFile.innerHTML=checkedFileNum;
		select_all.style.backgroundPosition="-118px -253px";
		create_nfile.isCreateStatus=false;
	}
	file_a.appendChild(checkBox)
	modify_name.appendChild(textName);
	modify_name.appendChild(confBtn);
	modify_name.appendChild(cancelBtn);
	file_list.appendChild(file_a);
	file_list.appendChild(modify_name);
	file_list.appendChild(confirm_name);
	file_box.appendChild(file_list);
	return file_list;
}
//刷新当前目录：根据传进来的数据创建文件夹
function refreshDirectory(data){
//	清空原来文件夹,读取现有文件夹数据,重新生成
	var file_box=document.querySelector(".file_box");
	file_box.innerHTML="";
	for(var i=0;i<data.length;i++){
		createFolder(data[i],"block","none")
	}
}
function deleteFiles(obj){
	var delArr=getCheckedFile(obj);//所有被选中的要删除的一级文件夹
//	判断选中文件夹的数量
	if(delArr.length==0){
		alert("请选中要删除的文件夹")
	}else{
		var pFile=getInfo(delArr[0].fileId);//一级文件夹的数据信息，目的是为了拿到他的pid
	//	通过删除文件的id获取他下面的所有的子文件
		var arr=[];
		
		for(var i=0;i<delArr.length;i++){
			arr.push(delArr[i].fileId);//把要删除文件的id存进数组
		}
	//	查找文件下的所有子文件的id
		for(var i=0;i<arr.length;i++){
			for(var j=0;j<localFilesData.length;j++){
				if(localFilesData[j].pid==arr[i]){
					arr.push(localFilesData[j].id)
				}
			}
		}
		var arrEq=[];//根据拿到的id,确定这些id在datas.files数组中的下标位置,存进数组
		for(var i=0;i<arr.length;i++){
			arrEq.push(getArrEq(arr[i]))
		}
	//	arrEq按升序排列：否则会删错数据
		arrEq.sort(function(a,b){
			return a-b;
		})
	//	在localFilesData数组中删除这些下标对应的数据
		if(arrEq.length==0){
			alert("请选择您要删除的文件")
		}else{
			//在datas.files中把这些数据删除
			for(var i=0;i<arrEq.length;i++){
				if(i==0){
					localFilesData.splice(arrEq[i],1);
				}else{
					localFilesData.splice(arrEq[i]-i,1);
				}
				tools.store("filesData",localFilesData)
			}
			refreshDirectory(getChildren(pFile.pid));//删除数据后更新当前目录
		}
	}
}
//拖拽选择文件
function dragSelect(){
	var file_box_wrap=document.querySelector(".file_box_wrap");
	var file_box=document.querySelector(".file_box");
	var checkedFile=document.querySelector(".select_node span");
	var select_all=document.querySelector(".select_all");
	tools.addEvent(file_box_wrap,"mousedown",function(ev){
		var ev = ev || event;
		if(ev.target.nodeName!="DIV"){
			return;
		}	
		else{
			var disX = ev.clientX; 
			var disY = ev.clientY;
			var fileList = file_box.getElementsByClassName("file_list");//获取页面上的所有文件
			var newDiv = document.createElement('div'); // 创建选择框
			newDiv.style.cssText='position: absolute;z-index: 100;background-color: rgba(46,128,220,.3);border: 1px solid rgba(46,128,220,.7);';
			document.body.appendChild(newDiv);
			tools.addEvent(document,"mousemove",moveHandle);
			tools.addEvent(document,"mouseup",upHandle);
			
			function moveHandle(ev){
				var ev = ev || event;
				//鼠标移动的位置大于点击的位置,left值就是点击的位置;鼠标移动的位置小于点击的位置,left值就是移动的位置
				newDiv.style.left=(ev.clientX>disX?disX:ev.clientX)+"px";
				newDiv.style.top=(ev.clientY>disY?disY:ev.clientY)+"px";
				newDiv.style.width=Math.abs(ev.clientX-disX)+"px";
				newDiv.style.height=Math.abs(ev.clientY-disY)+"px";
				var arr = [];//存放被选中的文件
				for(var i=0;i<fileList.length;i++){
					//初始化
					fileList[i].children[0].style.borderColor="";
					fileList[i].children[0].children[1].style.display="none";
					fileList[i].children[0].children[1].style.backgroundPositionY="";
					fileList[i].children[0].children[1].checked=false;
					 //碰撞检测
					if(crash(newDiv,fileList[i])){//如果碰上了
						fileList[i].children[0].style.borderColor="rgb(46,128,220)";
						fileList[i].children[0].children[1].style.display="inline";
						fileList[i].children[0].children[1].style.backgroundPositionY="-248px";	
						fileList[i].children[0].children[1].checked=true;
						arr.push(fileList[i]);//判断数量
					}
				}
				checkedFileNum=arr.length;
				checkedFile.innerHTML=checkedFileNum;
//				处理全选操作及计算选中数量
				if(checkedFileNum==fileList.length){//页面上的文件夹都被选中，勾选全选按钮
					select_all.style.backgroundPosition="-133px -253px";
					select_all.parentNode.style.backgroundColor="#f2f6ff";
					select_onoff=false;
				}else{
					select_all.style.backgroundPosition="";
					select_all.parentNode.style.backgroundColor="#f7f7f7";
					select_onoff=true;
				}
			}
			function upHandle(){
				document.body.removeChild(newDiv);
				tools.removeEvent(document,"mousemove",moveHandle);
				tools.removeEvent(document,"mouseup",upHandle);
			}
		}
		return false;
	})
}

//逐级查找创建文件
function createFileStep(father){
	for(var i=0;i<father.children.length;i++){
		if(getChildren(father.children[i].id).length>=0){//如果下面存在子文件夹
			var ul=document.createElement("ul");
			for(var j=0;j<getChildren(father.children[i].id).length;j++){
				var li=document.createElement("li");
				li.id=getChildren(father.children[i].id)[j].id;
				var h4=document.createElement("h4");
				h4.innerHTML=getChildren(father.children[i].id)[j].name;
				li.appendChild(h4);
				ul.appendChild(li);
			}
			father.children[i].appendChild(ul);
			createFileStep(ul);//继续查找下一级文件夹，继续生成
		}
	}
}
//关闭弹窗
function closeDialog(){
	var dialog=document.querySelector(".dialog");
	var mark=document.querySelector(".mark");
	dialog.style.display="none";
	mark.style.display="none";
}
//点击移动或者复制生成弹窗
function createDialog(){//给弹窗下的h4添加点击事件
	var dialog_content=document.querySelector(".dialog_content");
	var h4s=dialog_content.getElementsByTagName("h4");//获取所有的h4标签
	var firstFile=document.querySelector(".firstFile");
//	把pid=0的数组生成文件显示
	var str="";
	for(var i=0;i<getChildren(0).length;i++){
		if(getInfo(getChildren(0)[i].id).type==="file"){
			str+='<li id='+getChildren(0)[i].id+'><h4>'+getChildren(0)[i].name+'</h4></li>';
		}
	}
	firstFile.innerHTML=str;
	createFileStep(firstFile);//调用逐级生成文件夹函数
	for(var i=0;i<h4s.length;i++){//给所有的h4设置点击事件
		h4s[i].onoff=true;
		h4s[i].onclick=function(){
			for(var i=0;i<h4s.length;i++){
				h4s[i].style.backgroundColor="";
			}
			if(this.nextElementSibling){
				var uls=this.nextElementSibling.getElementsByTagName("ul");
			}
			for(var i=0;i<uls.length;i++){
				uls[i].style.display="none";
				uls[i].previousElementSibling.onoff=true;
			}
			if(this.onoff){
				this.nextElementSibling.style.display="block";
			}else{
				this.nextElementSibling.style.display="none";
			}
			this.onoff=!this.onoff;
			this.style.backgroundColor="#9EBADE";
			targetFileId=this.parentNode.id;//要移入或复制的文件的id
		}
	}	
}
//拖拽功能
function drag(obj){
	obj.onmousedown=function(ev){
		var e=ev||event;
		var disX=e.clientX-this.offsetLeft;
		var disY=e.clientY-this.offsetTop;
		document.onmousemove=function(ev){
			var e=ev||event;
			obj.style.left=e.clientX-disX+"px";
			obj.style.top=e.clientY-disY+"px"
		}
		document.onmouseup=function(){
			document.onmousemove=document.onmouseup=null;
		}
		return false;
	}
}
//碰撞检测
function crash(obj1,obj2){
	var pos1=obj1.getBoundingClientRect();
	var pos2=obj2.getBoundingClientRect();
	return !(pos1.right<pos2.left||pos1.left>pos2.right||pos1.top>pos2.bottom||pos1.bottom<pos2.top);
//	true:碰上;false:碰不上
}
//渲染目录
function renderNav(navArr,startIndex){
	var str="";
	startIndex=startIndex||0;
	for(var i=startIndex;i<navArr.length-1;i++){
		if(i===0){
			str+='<a href="javascript:;" index='+i+' id='+navArr[navArr.length-2].id+'>'+navArr[i].fileName+'</a>|'
		}else{
			str+='<a href="javascript:;" index='+i+' id='+navArr[i].id+'>'+navArr[i].fileName+'</a>>>'
		}
	}
	str+='<span>'+navArr[navArr.length-1].fileName+'</span>'
	catalog.innerHTML=str;
}
function renameHandle(){
	if(create_nfile.isCreateStatus){//如果是在创建文件夹状态，点击重命名终止程序执行
		return;
	}
	var num=0;//判断选中文件夹的数量，如果大于1，则提示，等于1进行重命名操作
	tools.each(checkBox,function(item){
		if(item.checked){
			num++;
		}
	})
	if(num>1){
		alert("只能选择一个文件进行重命名噢")
	}else if(num==0){
		alert("请选中一个文件夹")
	}else{
		renameOnoff=true;
		//查看哪个文件被选中	
		renameFile=getCheckedFile(checkBox)[0];//重命名时被选中的那个文件
		confirm_name=renameFile.getElementsByClassName("confirm_name")[0];
		modify_name=renameFile.getElementsByClassName("modify_name")[0];
		confirm_name.style.display="none";
		modify_name.style.display="block";
		modify_name.getElementsByTagName("input")[0].value=confirm_name.innerHTML;
		modify_name.getElementsByTagName("input")[0].select();
	}
}
function createHandle(){
	if(create_nfile.isCreateStatus||renameOnoff){//正在创建文件夹或者在重命名过程中无法新建文件夹
		if(modify_name.getElementsByTagName){
			modify_name.getElementsByTagName("input")[0].select();
		}
		return;
	}
//	如果有选中文件夹,则清掉样式
	var checkedFiles=getCheckedFile(checkBox);
	tools.each(checkedFiles,function(item,index){
		item.children[0].children[1].style.display="none";
		item.children[0].children[1].style.backgroundPositionY="-228px";
		item.children[0].children[1].checked=false;
		item.children[0].style.borderColor="";
	})
	var name=createFolder(localFilesData,"none","block");
	tools.$(".textName",name)[0].select();
	create_nfile.isCreateStatus=true;
}

//根据指定的id查找其下的一级子数据
function getChildren(pid){
	var data=[];
	for(var i=0;i<localFilesData.length;i++){
		if(localFilesData[i].pid==pid){
			data.push(localFilesData[i])
		}
	}
	return data;
}
//根据指定id查找对应的数据
function getInfo(id){
	for(var i=0;i<localFilesData.length;i++){
		if(localFilesData[i].id==id){
			return(localFilesData[i])
		}
	}
}
//查找最大id
function getMaxId(){
	var maxId=localFilesData[0]?localFilesData[0].id:0;
	for(var i=0;i<localFilesData.length;i++){
		if(maxId<localFilesData[i].id){
			maxId=localFilesData[i].id;
		}
	}
	return maxId;
}
//获取被选中的文件
function getCheckedFile(obj){
	var arr=[];
	for(var i=0;i<obj.length;i++){
		if(obj[i].checked){
			arr.push(obj[i].parentNode.parentNode);
		}
	}
	return arr;
}
//根据文件的id查找这个文件在数组中的位置
function getArrEq(id){
	for(var i=0;i<localFilesData.length;i++){
		if(localFilesData[i].id==id){
			return i;
		}
	}
}

