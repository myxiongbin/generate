<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
	<head>
		<title>快速生成</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="Cache-Control" content="no-store" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" /> 
		<jsp:include flush="true" page="/manage/include/view_new_inc.jsp" />

		<script type="text/javascript">
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
			//自动生成
			function generate(){
				top.$.winmess.confirm('信息', '是否开始生成代码?', function(r){
					if(r){
						$.winmess.progress({msg:'快速生成中，请稍等……'});
						var url = path + '/RapGerData/generate.xhtml';
						var prjName = parent.gifm('baseConfigIframe').window.$('#projectForm').getJSON().projectForm.prjName;
						$.ajaxjson.post({url : url,
					        queryPara : prjName,
							successFunc: function(ret){
								$.winmess.progress('close');
								if(ret){
									alertMsg('操作成功!');
									if(${exportfile}){
										location.href = path + "/RapGer/exportfile/" + prjName + ".xhtml";
									}
								}else{
									alertMsg('操作失败!');
								}
							}
						});
					}
				});
			}
		</script>
	</head>

	<body class="easyui-layout" fit="true" bg="layout-bg3">
		<div region="center" border="false" style="padding: 10px;background: #fff; border: 0px solid #ccc; overflow-y: auto;overflow-x: hidden">
			<fieldset style="padding: 10px">
				<legend style="margin: 8px">
					快速生成基本信息：
					<a class="easyui-linkbutton" plain="false" type="rectCrystal" href="javascript:generate();">自动生成</a>
				</legend>
				<form class="jform-style" id="configForm">
					<table style="margin: 0 auto;${type}">
						<tr>
							<th style="font-weight: normal">生成路径：</th>
							<td>
								<input name="outRootOverride" id="configForm:outRootOverride" type="text" class="easyui-validatebox" size="50" required="true" 
									missingMessage="生成路径不能为空!" onmousemove="showMsgTips('代码生成后覆盖的源代码位置');" 
									onmouseout="showMsgTips('');" onchange="saveConfig(this)"/>
							</td>
						</tr>
					</table>
				</form>
			</fieldset>
		</div>
	</body>
</html>




