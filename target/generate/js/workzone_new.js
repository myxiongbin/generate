		//// 遍历全部工作区，使其状态正常 --%>
		function traversalWorkZone(){
			
		}
		
		//// 根据node 打开工作区 --%>
		function openWorkZone(node){
			//alert(node.menu_id+"  "+node.text+"  node.attributes.openMethod:"+node.attributes.openMethod);
			
			if(""+node.attributes.openMethod != "undefined" && node.attributes.openMethod==2){
				try{
					var pageURL=node.attributes.url;
					//resizable='yes',status='yes',depended='yes',directories='yes',location='yes',menubar='yes',titlebar='yes',toolbar='yes'
					var _win = window.open(pageURL,node.text,"");
					_win.focus();
					//_win.moveTo(5, 5);
					//_win.resizeTo(screen.availWidth-10,screen.availHeight-10);
				}catch(e){}
				return ;
			}
			
			choiceWillOpenNode = node;
			
			// node : {menuId: 123, title:'xxxx', url:'', haveClose: true(默认) }  
			$('#workzoneTab').workzone('open',{menuId: node.menu_id, title: node.text, url: node.attributes.url,haveClose: node.haveClose });
			
			//满了，请选择
			//$('#choice_work_zone').window('open');
			
		}
		//// 根据id 点击某工作区 --%>
		function onclickWorkZoneById(id){
			$('#workzoneTab').workzone('clickByIndex', id);
		}
		//// 根据name 点击某工作区（主要方法） --%>
		function onclickWorkZoneByIdName(id,name,url){
			
			$('#workzoneTab').workzone('clickByIndex', id);
			
			//修饰一下变量
			//_onclickWrapper(id,name,url);
			
			//激活tab
			//tabclick(id);

			//激活固定方法
			//onfocusWorkZone(id);

			//// 设置css --%>
			//traversalWorkZone();
		}
		//// 根据id 关闭工作区 --%>
		function closeWorkZoneByMenuId(menu_id){
			$('#workzoneTab').workzone('closeByMenuId', menu_id);
		}
		//// 关闭现在打开的工作区 --%>
		function closeNowOnWorkZone(){
			$('#workzoneTab').workzone('closeCurrentTab');
		}
		//// 根据id 关闭工作区（主要方法） --%>
		function closeWorkZoneById(id){
			$('#workzoneTab').workzone('closeByIndex', id);
		}
		
		//// 关闭所有工作区 --%>
		function closeAllWorkZone(){
			//$.winmess.confirm('提示', '关闭所有工作区？', function(r){
			//	if (r){
					$('#workzoneTab').workzone('closeAll');
			//	}
			//});
		}
		
////////////////////workdzone common month
		/*
		* 获取当前打开工作区的menuid
		*/
		function getWorkingZoneMenuId(){
			var selectedWorkZone = $('#workzoneTab').workzone('getCurrentClickTabNode');
			if(selectedWorkZone && selectedWorkZone!=null){
				var tmp = selectedWorkZone.menuId;
				return tmp;
			}
			return  null;
		}
		//
		
		//从已打开的菜单中。打开工作区菜单node:{deviceKeyNo:1,url:'xxxx',text:"name" }
		function openChildWorkZone(node){
			//node.menu_id ,node.text,node.attributes.url
			var menuId = "sub_"+node.url;
			var url = getUrlTrans(node.url, node.deviceKeyNo, menuId);
			var opnode ={
					menu_id:menuId, 
					text:node.text,
					attributes: {
						url:url
					}
					};
			openWorkZone(opnode);
		}
		
		//当激活某个工作区（原先已打开），默认调用的方法。
		function onfocusWorkZone(index){
			//激活固定方法
			try{
				document.getElementById("iframe_work_zone_"+index).contentWindow.__onfocusMe();
			}catch(e){
				try{
				frames["iframe_work_zone_"+index].__onfocusMe();
				}catch(e){}
			}
			
		}
		//当前打开的菜单中，调用父工作区iframe里面的方法，传入方法名称，及一个参数。
		//para : { funcName:"getXXXX", para:??}  para可以是任意对象。如果para不存在，则表示方法无参数。方法无返回值
		function invokeParentMethod(para){
			
		}