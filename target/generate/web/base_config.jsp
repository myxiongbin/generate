<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
	<head>
    
	    <title>基本配置</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="Cache-Control" content="no-store" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" /> 
		<jsp:include flush="true" page="/manage/include/view_new_inc.jsp" />
	
		<script type="text/javascript">
			var path = '/RapGerTool';
			$(function(){
				
			});
			//显示信息
			function showMsgTips(title){
				parent.showMsgTips(title);
			}
			//实时保存配置信息
			function saveConfig(obj){
				parent.saveConfig(obj);
			}
		</script>
  	</head>
  
	<body class="easyui-layout" fit="true" bg="layout-bg3">
		<div region="center" border="false" style="padding: 10px; background: #fff; border: 0px solid #ccc; overflow: auto;">
			<fieldset style="padding: 10px">
				<legend style="margin: 8px">
					基本配置信息：
				</legend>
				<form class="jform-style" id="projectForm">
					<table style="margin: 0 auto;">
						<tr>
							<th style="font-weight: normal">项目名：</th>
							<td>
								<input type="text" value="" id="projectForm:prjName" name="prjName" disabled="disabled"/>
							</td>
							<th style="font-weight: normal">命名空间：</th>
							<td>
								<input type="text" value="" id="projectForm:namespace" name="namespace" class="easyui-validatebox" 
									required="true" size="30" missingMessage="命名空间不能为空!"  onmousemove="showMsgTips('工程命名空间，用于页面变量替换');" 
									onmouseout="showMsgTips('');" onchange="saveConfig(this)"/>
							</td>
							<th style="font-weight: normal">基本包：</th>
							<td>
								<input type="text" value="" id="projectForm:basepackage" name="basepackage" class="easyui-validatebox" 
									required="true" size="30"  missingMessage="基本包不能为空!"  onmousemove="showMsgTips('工程的基础包名');" 
									onmouseout="showMsgTips('');" onchange="saveConfig(this)"/>
							</td>
						</tr>
					</table>
				</form>
			</fieldset>
		</div>
	</body>
</html>



