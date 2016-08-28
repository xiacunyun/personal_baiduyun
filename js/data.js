
var datas={
//	右键菜单数据
	contextmenu:{
//		通用数据
		common:[
//			一个对象代表一个菜单项
			{
				name:"新建",
				exe:function(){
					createHandle();
				}
			},
			{
				name:"刷新",
				exe:function(){
					refreshDirectory(getChildren(0));//刷新到首页
				}
			},
			{
				name:"删除",
				exe:function(){
					if(create_nfile.isCreateStatus||renameOnoff){
						return;
					}
					deleteFiles(checkBox);//执行删除文件
					checkedFileNum=0;//选中文件夹的数量修改为1
					countCheckedFile.innerHTML=checkedFileNum;
					select_onoff=false;//取消全选状态（在选中所有文件夹的情况下）
					select_all.style.backgroundPosition="-118px -253px";
				}
			},
			{
				name:"重命名",
				exe:function(){
					 renameHandle();
				}
			}
		],
//		文件夹菜单组
		folder:[
			{
				name:"打开"
			},
			{
				name:"复制"
			},
			{
				name:"剪切"
			},
			{
				name:"重命名"
			}
		]	
	},
	files:[
		{
            id: 1,
            pid: 0,
            name: "技术",
            type:"file"
        },
        {
            id: 2,
            pid: 0,
            name: "游戏",
            type:"file"
        },
        {
            id: 3,
            pid: 0,
            name: "城市",
            type:"file"
        },
        {
            id: 4,
            pid: 1,
            name: "前端",
            type:"file"
        },
        {
            id: 5,
            pid: 1,
            name: "后端",
            type:"file"
        },
        {
        	id: 6,
            pid: 2,
            name: "植物大战僵尸",
            type:"file"
        },
        {
        	id: 7,
            pid: 3,
            name: "上海",
            type:"file"
        },
        {
        	id: 8,
            pid: 3,
            name: "北京",
            type:"file"
        },
        {
        	id: 9,
            pid: 0,
            name: "艺术",
            type:"file"
        },
        {
        	id: 10,
            pid: 4,
            name: "JavaScript",
            type:"file"
        },
        {
        	id: 11,
            pid: 4,
            name: "HTML",
            type:"file"
        },
        {
        	id: 12,
            pid: 10,
            name: "JavaScript高级程序设计",
            type:"file"
        },
        {
        	id: 13,
            pid: 8,
            name: "海淀区",
            type:"file"
        }
	]
}
