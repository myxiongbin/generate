		/**
		*得到整个屏幕的高度
		*/
		function getViewportHeight() {
			if (window.innerHeight!=window.undefined) return window.innerHeight;
			if (document.compatMode=='CSS1Compat') return document.documentElement.clientHeight;
			if (document.body) return document.body.clientHeight;
			return window.undefined;
		}
		/**
		*得到整个屏幕的宽度
		*/
		function getViewportWidth() {
			if (window.innerWidth!=window.undefined) return window.innerWidth;
			if (document.compatMode=='CSS1Compat') return document.documentElement.clientWidth;
			if (document.body) return document.body.clientWidth;
			return window.undefined;
		}

		///////////////////////////////////////////////////////////
		
		
		//////////////////////框架主动调用方法////////////////////////begin
		//是否正在查询dwr方法
		var __isQueryDwr=false;
		$(function(){
			__onfocusMe();
		});
		function __onfocusMe(){
			try{
				$('body').layout('resize');
				if(!__isQueryDwr){
					
					$.winmess.progress({
						msg:'正在加载，请稍后……'
					});
					setTimeout(function(){
						$.winmess.progress('close');
					}, 1);
				}
				//otherMyTurn();
			}catch(e){}
		}
		//////////////////////框架主动调用方法////////////////////////end
		//////////////////////文件上传方法////////////////////////begin
		/*
		传入参数：
		 * @folderId 【文件夹ID】可选，如果存在，什么都是浮云。直接文件与文件夹关联
		 
	 	 * @param fileType 可选： 1文件 9图片(默认9） 
		 * @param closeImportDivFunc 必选： 关闭对话框回调函数，参数为list ，SM_FILE对象（必选）
		 * @param isMulti 可选： true false；是否多文件上传（默认true）
		 * @param fileHeight 可选：上传显示区域高度（默认150）
		 * 
		 * @param --userId： 可选：三者如果有，则都必须有。
		 * @param --userName：可选：三者如果有，则都必须有。
		 * @param --userObjType： 可选：8000 1011三者如果有，则都必须有。
		 * 
		 * @param objId 可选：三者如果有，则都必须有。
		 * @param objName 可选：三者如果有，则都必须有。
		 * @param objType 可选：8000 1011三者如果有，则都必须有。 
		 * 
		 * @param folderType 可选：8000 1030,二者不用同时出现
		 * @param folderStorageType 可选：，二者不用同时出现
		 
		para:{ closeImportDivFunc, //必选
			folderType,   //可选，建议填写 8000 1030
			folderStorageType,//可选
			objId,objName,objType,//可选，填写后直接关联业务表
			folderId // 可选，如果存在，什么都是浮云。直接文件与文件夹关联
			}
		*/
		function userUploadFiles(webRootPath, para){
			para.fileType = para.fileType?para.fileType:9;
			var url = webRootPath+"/component/uploadfiles.xhtml"
				+"?fileType="+para.fileType
				+"&folderId="+(para.folderId?para.folderId:-1)
				+"&isMulti="+(para.isMulti?para.isMulti:"true")
				+"&fileHeight="+(para.fileHeight?para.fileHeight:-1)
				+"&userId="+(para.userId?para.userId:-1)
				+"&userName="+(para.userName?para.userName:-1)
				+"&userObjType="+(para.userObjType?para.userObjType:-1)
				+"&objId="+(para.objId?para.objId:-1)
				+"&objName="+(para.objName?para.objName:-1)
				+"&objType="+(para.objType?para.objType:-1)
				+"&closeImportDivFunc="+para.closeImportDivFunc
				+"&folderType="+(para.folderType?para.folderType:-1)
				+"&folderStorageType="+(para.folderStorageType?para.folderStorageType:-1)
				+"&encode=utf-8"
				+"&other="+(para.other?para.other:'')
				;
			var title = para.fileType==1?"上传文件":"上传图片";
			dialogOpen(title, "userUploadFilesDiv", 
					url, null, 500,320);
		}
		//////////////////////文件上传方法////////////////////////end
		
		/////////////////////文件浏览///////////////////////////begin
		/**
		 传入参数：
		 * @param objId 可选 对象id
		 * @param objType 可选 对象类型
		 * @param objName 可选 对象名称
		 * @param folderType 可选 文件夹类型
		 * objId,objType,folderType三者一起选择默认文件夹下指定文件夹下的文件
		 * @param folderId  可选,若有，以上其他都是浮云
		 * @param fileType 可选 文件类型
		 * @param other 可选 回调参数
		 * @param closeFileBrowseDivFunc 回调函数
		 * @param uploadFolderFunc 回调函数
		 */
		function fileBrowse(webRootPath, para){
			var url=webRootPath+"/fileMgr/read.xhtml"
			+"?objId="+(para.objId?para.objId:-1)
			+"&objType="+(para.objType?para.objType:-1)
			+"&folderType="+(para.folderType?para.folderType:-1)
			+"&folderId="+ (para.folderId?para.folderId:-1)
			+"&fileType="+(para.fileType?para.fileType:-1)
			+"&objName="+(para.objName?para.objName:-1)
			+"&other="+(para.other?para.other:-1)
			+"&isReadOnly="+(para.isReadOnly?para.isReadOnly:-1)
			+"&uploadFolderFunc="+para.uploadFolderFunc
			+"&closeFileBrowseDivFunc="+para.closeFileBrowseDivFunc;
			dialogOpen("文件浏览", "fileReadDiv", 
					url, null, 800,500);
		}
/////////////////////文件浏览///////////////////////////end
	
