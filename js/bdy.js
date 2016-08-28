var create_nfile=tools.$(".create_nfile")[0];
//localStorage中没有filesData,保存,有的话拿出来渲染在页面中
var localFilesData=tools.store("filesData");
if(!localFilesData.length){//如果没取到数据，走默认，并且 存到localStorage中
	localFilesData=datas.files;
	tools.store("filesData",localFilesData)
}
refreshDirectory(getChildren(0));//根据已有文件数据来初始化创建文件夹/文件,只显示一级文件夹

var num=0;//当前目录下父级文件夹的id
var renameOnoff=false;//重命名按钮开关
var renameFile;//重命名被选中的文件
var confirm_name="";
var modify_name="";
var checkBox=tools.$(".checkBox");//获取每个文件夹的勾选框
var checkedFileNum=0;//统计被选中的文件夹数量
var targetFileId=0;//点击确定的时候文件的id(移动或者复制的目标文件夹)
	
var select_node=tools.$(".select_node")[0];
var countCheckedFile=tools.$("span",select_node)[0];//已选中几个文件夹数量统计
//	全选
var select_all=tools.$(".select_all")[0];
var select_onoff=true;//全选按钮的开关
tools.addEvent(select_all,"click",function(){
	if(create_nfile.isCreateStatus){
		return;
	}
	if(select_onoff){
		this.style.backgroundPosition="-133px -253px";
		this.parentNode.style.backgroundColor="#f2f6ff";
		tools.each(checkBox,function(item,index){
			item.checked=true;
			item.style.display="inline";
			item.style.backgroundPositionY="-248px";
			item.parentNode.style.borderColor="#2e80dc";
		})
		countCheckedFile.innerHTML=checkBox.length;
	}else{
		this.style.backgroundPosition="-118px -253px";
		this.parentNode.style.backgroundColor="#f7f7f7";
		tools.each(checkBox,function(item,index){
			item.checked=false;
			item.style.display="none";
			item.style.backgroundPositionY="-228px";
			item.parentNode.style.borderColor="";
		})
		countCheckedFile.innerHTML=0;
	}
	select_onoff=!select_onoff;
})
//	操作文件部分
var right_content=document.querySelector(".right_content");
right_content.oncontextmenu=function(ev){
	showContextmenu(ev,datas.contextmenu.common);
	return false;
}
//	鼠标点击文档隐藏右键菜单
tools.addEvent(right_content,"click",hideContextmenu);

//	删除文件夹
var deletaBtn=tools.$(".deletaBtn")[0];
tools.addEvent(deletaBtn,"click",function(){
	if(create_nfile.isCreateStatus||renameOnoff){
		return;
	}
	deleteFiles(checkBox);//执行删除文件
	checkedFileNum=0;//选中文件夹的数量修改为1
	countCheckedFile.innerHTML=checkedFileNum;
	select_onoff=false;//取消全选状态（在选中所有文件夹的情况下）
	select_all.style.backgroundPosition="-118px -253px";
})
//	重命名:只有在选中一个文件的情况下才能使用重命名功能
var rename=tools.$(".rename")[0];
tools.addEvent(rename,"click",function(){
	renameHandle();
})
//新建文件夹:给按钮添加开关
tools.addEvent(create_nfile,"click",function(){
	createHandle();
})
//	拖拽选择文件:
dragSelect();
//	模拟上传功能
	var fileUpload=document.querySelector("#fileUpload");
	var file_box=document.querySelector(".file_box");
	var upSrc="";
	fileUpload.onchange=function(){
		console.log(num)
		var file=this.files[0];
		if(file.type.indexOf("image")==-1){
			alert("只能上传图片")
		}else{
			var fr=new FileReader();
			fr.onload=function(ev){
				localFilesData.push({
					id:getMaxId()+1,
					pid:num,
					name:file.name,
					type:"img",
					src:ev.target.result
				})
				refreshDirectory(getChildren(num));
				tools.store("filesData",localFilesData);
			}
			fr.readAsDataURL(file);
		}
	}
var dialog=document.querySelector(".dialog");
var mark=document.querySelector(".mark");
drag(dialog);//给选框添加拖拽功能
var closeBtn=document.querySelector(".closeBtn");
var foot_confirm_btn=document.querySelector(".foot_confirm_btn");
foot_cancel_btn=document.querySelector(".foot_cancel_btn");
//	移动文件夹功能
var moveFile=tools.$(".moveFile")[0];
var movedFileTop=[];//存放需要移动文件的顶层文件夹的id;
tools.addEvent(moveFile,"click",function(){
	if(create_nfile.isCreateStatus||renameOnoff){//在新建文件夹和重命名的时候无法移动文件夹
		return;
	}
	this.onoff=true;
	//	获取被选中的文件
	var countCheckedFile=getCheckedFile(checkBox);
	movedFileTop=[];
	for(var i=0;i<countCheckedFile.length;i++){
		movedFileTop.push(countCheckedFile[i].fileId);//把要移动文件的id存进数组
	}
	if(countCheckedFile.length>0){
//	如果已选中文件夹,点击移动,选框及弹出层显示
		dialog.style.display="block";
		mark.style.display="block";
		dialog.children[0].children[0].innerHTML="移动到";
		createDialog();
	}else{//没有选中文件夹提示
		alert("请选择要移动的文件夹")
	}
})
//	移动、复制文件夹的一些按钮的操作
closeBtn.onclick=closeDialog;//点击头部“关闭”，关闭弹窗
foot_cancel_btn.onclick=closeDialog;//点击取消关闭弹窗
foot_confirm_btn.addEventListener("click",function(){//点击确定
	if(moveFile.onoff){//移动文件夹：只修改顶层文件夹的pid为选中的文件夹的id;
		for(var i=0;i<movedFileTop.length;i++){//修改文件的pid
			localFilesData[getArrEq(movedFileTop[i])].pid=targetFileId;
		}
	}
	tools.store("filesData",localFilesData);//更改本地存储数据
	refreshDirectory(getChildren(0));//刷新到首页
	closeDialog();
	moveFile.onoff=false;
},false)
//搜索文件夹功能
var search=document.querySelector(".search");
var searchValue=document.querySelector(".search input");
var searchBtn=document.querySelector(".search_btn");
searchBtn.onclick=function(){
	var matchResult=[];
	if(searchValue.value!=""){//如果搜索内容不为空
		for(var i=0;i<localFilesData.length;i++){
			if(localFilesData[i].name.indexOf(searchValue.value)!=-1){
				matchResult.push(localFilesData[i])
			}
		}
		var ul=document.createElement("ul");
		if(matchResult.length==0){
			ul.innerHTML="没有搜索到结果";
		}else{
			for(var i=0;i<matchResult.length;i++){//显示搜索结果
				var li=document.createElement("li");
				li.innerHTML=matchResult[i].name;
				li.id=matchResult[i].id;
				li.onclick=function(){
					refreshDirectory(matchResult);
					search.removeChild(ul);
					searchValue.value="";
//					重新渲染导航
					startIndex=1;
					navArr.length=2
					renderNav(navArr,startIndex);
				}
				ul.appendChild(li);
			}
		}
		search.appendChild(ul);
	}
}
//导航的事件处理
var catalog=tools.$(".file_catalog")[0];
var navArr=[{fileName:"返回上一级"},{fileName:"全部",id:0}]
tools.addEvent(catalog,"click",function(ev){
	var e=ev||event;
	if(e.target.nodeName=="A"){
		num=e.target.id;
		var currentId=e.target.getAttribute("id")
		refreshDirectory(getChildren(currentId));
		tools.each(navArr,function(item,index){
			if(item.id==currentId){
				navArr.length=index+1;
			}
		})
//		如果点击的是全部,那么从第二个开始渲染
		var startIndex=0;
		if(currentId==0){
			startIndex=1;
		}
		renderNav(navArr,startIndex);
	}
})
//点击退出,跳转到登录页面
var quit=tools.$("#quit");
tools.addEvent(quit,"click",function(){
	this.href="../index.html";
})