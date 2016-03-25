void function() {
	function format(template, json) {
		return template.replace(/#\{(.*?)\}/g, function(all, key) {
			return json && (key in json) ? json[key] : "";
		});
	}

	headerHtml = format(
			String(function(){
				/*!
					<link rel="stylesheet" type="text/css" href="../css/style.css" />
	
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/themes/default/easyui.css" />
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/themes/icon.css" />
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/demo/demo.css" />
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/themes/default/workzone.css">
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/themes/default/css/main.css" />
					<link rel="stylesheet" type="text/css" href="../js/jquery-plugins/themes/default/winmess.css" />
					
					<script type="text/javascript" src="../js/common/date-functions.js"></script>
					<script type="text/javascript" src="../js/common/jquery-1.4.2.min.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-form-plugin.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-dict-plugin.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery.easyui.min.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/locale/easyui-lang-zh_CN.js"></script>
					<script type="text/javascript" src="../js/common/common.js"></script>
					<script type="text/javascript" src="../js/common/json2.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-validate.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-workzone.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-comp.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-winp.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-translate.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-ajaxjson-plugin.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-winmess.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-workbus-plugin.js"></script>
					<script type="text/javascript" src="../js/jquery-plugins/jquery-easyui-picshow.js"></script>
					<script type="text/javascript" src="../js/common/client_validate.js"></script>
					
					<script type="text/javascript" src="../js/workzone_new.js"></script>
					
					<script type="text/javascript" src="../js/url.js"></script>
			 	*/
			}).replace(/^[^\{]*\{\s*\/\*!?|\*\/[;|\s]*\}$/g, ''),
			{
				title: "�������ģ��",
				date: "2014-05-16"
			}
	);
}();
document.write(headerHtml);

var DEBUG = true;

//显示调试信息
function _log(){
	if(typeof console != 'undefined' && DEBUG){
		var str = "";
		var info = arguments[0];
		var infos = info.split("{}");
		for(var i=0;i<infos.length;i++){
			if(i+1 == infos.length){
				str += infos[i];
			}else{
				str += infos[i] + arguments[i+1];
			}
	    }
		
		console.log(str);
	}
}