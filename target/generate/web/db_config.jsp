<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<%
	String path = request.getContextPath();
	String basePath = request.getScheme()+"://"+request.getServerName()+":"+request.getServerPort()+path+"/";
%>

<html>
	<head>
		<title>数据库配置</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta http-equiv="Cache-Control" content="no-store" />
		<meta http-equiv="Pragma" content="no-cache" />
		<meta http-equiv="Expires" content="0" /> 
		<jsp:include flush="true" page="/manage/include/view_new_inc.jsp" />
		

		<script type="text/javascript">
			var gdataBaseMap = null;	//数据库配置信息
			var gdataBaseMap_modified = false;

			var json = [{'id':0,'text':'oracle'},{'id':1,'text':'sqlserver'}];
			$(function(){
				$('#dbConfigForm\\:dbType').combobox({
					width:100,
					data:json,  
					valueField:'id',  
					textField:'text',
					onSelect:function(){
						if($('#dbConfigForm\\:dbType').combobox('getText') == 'sqlserver'){
							var ret = {
								'dbType':'sqlserver',
								'url':'localhost:1433',
								'driver':'com.microsoft.sqlserver.jdbc.SQLServerDriver',
								'dataBaseName':'backups',
								'username':'sa',
								'password':'sa'
							};
							$('#dbConfigForm').setJSON({dbConfigForm:ret});
						}else if($('#dbConfigForm\\:dbType').combobox('getText') == 'oracle'){
							var ret = {
									'dbType':'oracle',
									'url':'192.168.105.29:1521',
									'driver':'oracle.jdbc.driver.OracleDriver',
									'dataBaseName':'oracle',
									'username':'base_system',
									'password':'base_system'
							};
							$('#dbConfigForm').setJSON({dbConfigForm:ret});
						}
					}
				});
				
				$('#dbtableGrid').datagrid({
					//fit: true,
					nowrap: false,
					striped: true,
					columns:[[
						{field:'sqlName',title:'表名',width:170,align:'center',
							formatter:function(value,rec){
								return rec.modelObj.sqlName;
							}
						},
						{field:'className',title:'类名称',width:170,align:'center',
							formatter:function(value, rec, index){
								return writeInput(value,rec.modelObj.className, 'style="width:160px"',index,'className');
							}
						},
						{field:'remark',title:'库备注',width:200,align:'center',
							formatter:function(value,rec){
								return rec.modelObj.remark;
							}
						},
						{field:'showRemark',title:'显示备注',width:200,align:'center',
							formatter:function(value, rec, index){
								return writeInput(value,rec.modelObj.showRemark, 'style="width:190px"',index,'showRemark');
							}
						}
					]],
					rownumbers:true,
					singleSelect:true,
					onClickRow:function(rowIndex, rowData){
						onClickTable(rowIndex, rowData);
					}
				});

				$('#dbtableGrid_detail').datagrid({
					//fit: true,
					nowrap: false,
					striped: true,
					fitColumns:true,
					columns:[[
						{field:'columnName',title:'字段名',width:100,align:'center',
							formatter:function(value, rec){
								return rec.modelObj.columnName;
							}
						},
						{field:'varName',title:'变量名',width:100,align:'center',
							formatter:function(value, rec,index){
								return writeInput2(value,rec.modelObj.varName, 'style="width:100px"',index,'varName');
							}
						},
						{field:'remark',title:'库备注',width:180,align:'center',
							formatter:function(value, rec){
								return rec.modelObj.remark;
							}
						},
						{field:'showRemark',title:'显示备注',width:200,align:'center',
							formatter:function(value, rec, index){
								return writeInput2(value,rec.modelObj.showRemark, 'style="width:200px"',index,'showRemark');
							}
						},
						{field:'dictTypeId',title:'数据字典ID',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeInput2(value,rec.modelObj.dictTypeId == null ? '':rec.modelObj.dictTypeId,'style="width:60px" class="easyui-validatebox" validType="isInt" decorateWait="true"',index,'dictTypeId');
							}
						},
						{field:'dataType', title:'类型',width:60,align:'center',
							formatter:function(value, rec){
								return rec.modelObj.dataType;
							}
						},
						{field:'queryShow',title:'查询显示',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeCheckbox(value,'null', 'style="width:60px"',index, 'queryShow');
							}
						},
						{field:'createShow',title:'添加显示',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeCheckbox(value,'checked', 'style="width:60px"',index, 'createShow');
							}
						},
						{field:'updateShow',title:'修改显示',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeCheckbox(value,'checked', 'style="width:60px"',index, 'updateShow');
							}
						},
						{field:'detailShow',title:'详细显示',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeCheckbox(value,'checked', 'style="width:60px"',index, 'detailShow');
							}
						},
						{field:'advanceQueryShow',title:'高级查询显示',width:70,align:'center',
							formatter:function(value,rec,index){
								return writeCheckbox(value,'checked', 'style="width:60px"',index, 'advanceQueryShow');
							}
						}
					]],
					singleSelect:true,
					rownumbers:true
				});
			});
			//显示信息
			function showMsgTips(title){
				parent.showMsgTips(title);
			}
			//写入input
			function writeInput(value, tableName, validateStr,index,colName){
				return "<input type='text' "+validateStr+" value='"+tableName+"' onblur=\"inputOnblur(this,'"+tableName+"','"+index+"','"+colName+"');\" />";
			}
			function inputOnblur(obj,tableName,index,colName){
				var param = $('#dbtableGrid').datagrid('getRows')[index];
				for(var key in param.modelObj){
					if(key == colName){
						param.modelObj[key] = obj.value
					}
				}
				$('#dbtableGrid').datagrid('updateRow',param);
			}
			//写入input
			function writeInput2(value, tableName, validateStr,index,colName){
				return "<input type='text' "+validateStr+" value='"+tableName+"' onblur=\"inputOnblur2(this,'"+tableName+"','"+index+"','"+colName+"');\" />";
			}
			function inputOnblur2(obj,tableName,index,colName){
				var param = $('#dbtableGrid_detail').datagrid('getRows')[index];
				for(var key in param.modelObj){
					if(key == colName){
						param.modelObj[key] = obj.value
					}
				}
				$('#dbtableGrid_detail').datagrid('updateRow',param);
			}
			//写入checkbox
			function writeCheckbox(value, check, validateStr,index,colName){
				if(check != 'null'){
					return "<input type='checkbox' "+validateStr+" checked='"+check+"'  onclick=\"checkboxClick(this,'"+check+"','"+index+"','"+colName+"');\"/>";
				}else{
					return "<input type='checkbox' "+validateStr+" onclick=\"checkboxClick(this,'"+check+"','"+index+"','"+colName+"');\"/>";
				}
			}
			function checkboxClick(obj,check,index,colName){
				var param = $('#dbtableGrid_detail').datagrid('getRows')[index];
				for(var key in param.modelObj){
					if(key == colName){
						param.modelObj[key] = obj.checked;
					}
				}
				$('#dbtableGrid_detail').datagrid('updateRow',param);
			}
			//查询数据库表
			function queryTableName(){
				var formJsonData = $("#dbConfigForm").getJSON()['dbConfigForm'];
				var url = path + '/RapGerData/queryTableName.xhtml';

				$('#dbtableGrid').datagrid({
					url: url,
					queryParams: formJsonData,
					useAjaxjson: true,
					useAjaxjson_total_attrName: 'content',// 必填返回数据组装
					useAjaxjson_rows_attrName: 'content',// 必填返回数据组装
					useAjaxjson_loadOverFunc:function(data){
						decorateLinkbutton();
						$('body').layout('panel','center').panel('resize');
						$.dictdata.wrapper();
					}
				});
			}
			//点击数据库表行
			function onClickTable(rowIndex, rowData){
				if(rowData!=null){
					loadTableDetail(rowData);
				}
			}
			//加载明细表内容
			function loadTableDetail(rowData){
				var tableName = rowData.modelObj.sqlName
				$('#detailLegend').text(tableName+"库表信息：");
				$('#dbtableGrid_detail').datagrid('loadData',rowData.tableStructureVoObjList);

				$("input[decorateWait=\"true\"]").validatebox({});
	            $("input[decorateWait=\"true\"]").attr("decorateWait", "true");
			}
			//库表持久化
			function writeTableToLocal(){
				/*
				top.$.winmess.confirm('信息', '是否开始数据库持久化到本地?', function(r){
					if(r){
						$('#dbConfigForm\\:url')[0].onchange();
						
						var tmpAll = $('#dbtableGrid').datagrid('getRows');
						var list = new Array();
						for(var i=0;i<tmpAll.length;i++){
							var queryParament = {};
							queryParament.modelObj = tmpAll[i].modelObj;
							queryParament.tableStructureVoObjList = tmpAll[i].tableStructureVoObjList;
							list.push(queryParament);
						}

						var model = {"list" : list , 'prjName' : parent.gifm('baseConfigIframe').window.$('#projectForm').getJSON().projectForm.prjName};
						
						var url = path + '/ToolData/writeTableToLocal.xhtml';
						$.winmess.progress({msg:'数据库持久化中，请稍等……'});
						setTimeout(function(){
							$.ajaxjson.post({url : url,
						        queryPara : model,
								successFunc: function(ret){
									$.winmess.progress('close');
									if(ret){
										alertMsg('操作完成!');
										$('#dbConfigForm\\:writeTableToLocal').val('true')[0].onchange();
										//setTimeout(function(){
											parent.readAndRoadTableToLocal();
										//},5000);
									}else{
										alertMsg('操作失败!');
									}
								},
						        errorFunc: function(){
									$.winmess.progress('close');
						        }
							});
						},5000);
					}
				});
				*/
				parent.saveConfig();
				top.$.winmess.confirm('信息', '是否开始数据库持久化到本地?', function(r){
					if(r){
						var tmpAll = $('#dbtableGrid').datagrid('getRows');
						var list = new Array();
						for(var i=0;i<tmpAll.length;i++){
							var queryParament = {};
							queryParament.modelObj = tmpAll[i].modelObj;
							queryParament.tableStructureVoObjList = tmpAll[i].tableStructureVoObjList;
							list.push(queryParament);
						}

						var model = {"list" : list , 'prjName' : parent.gifm('baseConfigIframe').window.$('#projectForm').getJSON().projectForm.prjName};
						
						var url = path + '/RapGerData/writeTableToLocal.xhtml';
						$.winmess.progress({msg:'数据库持久化中，请稍等……'});
						setTimeout(function(){
							$.ajaxjson.post({url : url,
						        queryPara : model,
								successFunc: function(ret){
									$.winmess.progress('close');
									if(ret){
										alertMsg('操作完成!');
										//$('#dbConfigForm\\:writeTableToLocal').val('true')[0].onchange();
										parent.readAndRoadTableToLocal();
									}else{
										alertMsg('操作失败!');
									}
								},
						        errorFunc: function(){
									$.winmess.progress('close');
						        }
							});
						},5000);
					}
				});
			}
			//实时保存配置信息到parent
			function changeConfigMapValue(obj){
				var val = validateJQForm($('#dbConfigForm'));
				if(!val){
					return ;
				}
				
				parent.changeConfigMapValue(obj.name,obj.value);

				gdataBaseMap[obj.name] = obj.value;
				gdataBaseMap_modified = true;
			}
			//选择库表
			function choiceTableDataOpen(){
				var formJsonData = $("#dbConfigForm").getJSON()['dbConfigForm'];
				formJsonData.tableNameList = '';
				gdataBaseMap = formJsonData;
				
				$('#dbConfigForm\\:tableNameList').combogrid({ 
					url: path + '/RapGerData/queryAllTable.xhtml',
					queryParams: formJsonData,
					useAjaxjson: true,
					useAjaxjson_total_attrName: 'content',// 必填返回数据组装
					useAjaxjson_rows_attrName: 'content',// 必填返回数据组装
					useAjaxjson_loadOverFunc:function(data){
						
					},
					separator:';',
					panelWidth:645,
					panelHeight:500,
					width:645,
					idField:'sqlName',
					textField:'sqlName',
					pagination:false,
					hasDownArrow:true,
					multiple:true,
					nowrap: false,
					striped: true,
					fitColumns:true,
					singleSelect:true,
					rownumbers:true,
					loadMsg:"Processing, please wait ...",
					columns:[[
						{field:'sqlName',title:'表名',width:170,align:'center',
							formatter:function(value,rec){
								return rec.sqlName;
							}
						},
						{field:'remark',title:'库备注',width:200,align:'center',
							formatter:function(value,rec){
								return rec.remark;
							}
						}
					]],
					onShowPanel:function(){
						if(gdataBaseMap_modified && gdataBaseMap != null){
							$('#dbConfigForm\\:tableNameList').combogrid({ 
								url: path + '/RapGerData/queryAllTable.xhtml',
								queryParams: gdataBaseMap,
							});
						}
					},
					onLoadSuccess:function(data){
						$('#dbConfigForm\\:tableNameList').next('.combo').find('input').blur(function(){
							var tableNameLists = $('#dbConfigForm\\:tableNameList').combogrid('getValues');

							var tableNameList = '';
							for(var i=0;i<tableNameLists.length;i++){
								if(tableNameList == ''){
									tableNameList = tableNameLists[i];
								}else{
									tableNameList += ';' + tableNameLists[i];
								}
							}
							parent.changeConfigMapValue('tableNameList',tableNameList);
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
					数据库基本信息：
					<a class="easyui-linkbutton" plain="false" type="rectCrystal" href="javascript:writeTableToLocal();">库表持久化</a>
				</legend>
				<form class="jform-style" id="dbConfigForm">
					<table style="margin: 0 auto;">
						<tr>
							<th style="font-weight: normal">数据库类型：</th>
							<td>
								<input id="dbConfigForm:dbType" name="dbType" type="text" />
							</td>
						</tr>
						<tr>
							<th style="font-weight: normal">db url：</th>
							<td>
								<input name="url" id="dbConfigForm:url" type="text" prompt="Please Input Value" class="easyui-validatebox" 
									required="true" missingMessage="数据库连接地址不能为空!" onmousemove="showMsgTips('jdbc.url');" onmouseout="showMsgTips('');" 
									 size="50" onchange="changeConfigMapValue(this)"/>
							</td>
							<th style="font-weight: normal">db driver：</th>
							<td>
								<input name="driver" id="dbConfigForm:driver" type="text" onmousemove="showMsgTips('jdbc.driver');" 
									class="easyui-validatebox" required="true"  missingMessage="数据库driver不能为空!" onmouseout="showMsgTips('');" size="50"
									onchange="changeConfigMapValue(this)"/>
							</td>
						</tr>
						<tr>
							<th style="font-weight: normal">库名：</th>
							<td>
								<input type="text" id="dbConfigForm:dataBaseName" name="dataBaseName" class="easyui-validatebox" 
									required="true" size="50" missingMessage="库名不能为空!"  onmousemove="showMsgTips('数据库库名');" 
									onmouseout="showMsgTips('');" onchange="changeConfigMapValue(this)"/>
							</td>
						</tr>
						<tr>
							<th style="font-weight: normal">用户名：</th>
							<td>
								<input name="username" id="dbConfigForm:username"type="text" onmousemove="showMsgTips('数据库登录名称');"
									class="easyui-validatebox" required="true" missingMessage="用户名不能为空!" 
									onmouseout="showMsgTips('');"  size="50" onchange="changeConfigMapValue(this)"/>
							</td>
							<th style="font-weight: normal">密码：</th>
							<td>
								<input name="password" id="dbConfigForm:password" type="text" onmousemove="showMsgTips('数据库登陆密码');"
									class="easyui-validatebox" required="true" missingMessage="密码不能为空!" 
									onmouseout="showMsgTips('');" size="50" onchange="changeConfigMapValue(this)"/>
								<input name="writeTableToLocal" id="dbConfigForm:writeTableToLocal" type="text" style="display: none;"
									onchange="changeConfigMapValue(this)"/>
							</td>
						</tr>
						<tr>
							<th style="font-weight: normal">库表：</th>
							<td colspan="3">
								<input name="tableNameList" id="dbConfigForm:tableNameList" type="text" onmousemove="showMsgTips('库表');"
									class="easyui-validatebox" required="true" missingMessage="库表不能为空!" 
									onmouseout="showMsgTips('');"  size="122" onchange="changeConfigMapValue(this)"/>
							</td>
						</tr>
					</table>
				</form>
				<!-- 
				<div style="text-align: right;padding-right: 250px">
					<a href="javascript:queryTableName()" class="easyui-linkbutton" type="rectCrystal" plain="false">查询表</a>
				</div>
				 -->
			</fieldset>
			<fieldset style="padding: 10px;">
				<legend style="margin: 10px">
					数据库表信息(全不选表示全选)：
				</legend>
				<table id="dbtableGrid">
				</table>
			</fieldset>
			<fieldset style="padding: 10px;">
				<legend id="detailLegend" style="margin: 8px">
					库表信息：
				</legend>
				<table id="dbtableGrid_detail"></table>
			</fieldset>
		</div>
	</body>
</html>




