(function($) {
	// 初始化
	function init(obj) {
		var para = $.data(obj, "tipmess").options;
		
		var list = para.actors;
		for (var i = 0; list && list != null && i < list.length; i++) {
			activateActor(obj , list[i]);
		}
		
		bind(obj);
	};
	
	// 绑定单击事件
	function bind(obj) {
		var para = $.data(obj, "tipmess").options;
		var list = para.actors;
		$("#" + obj.id).unbind("click").bind("click", function() {
			for (var i = 0; list && list != null && i < list.length; i++) {
				if (list[i].handler) {
					list[i].handler.call();
				}
			}
		});
	};
	
	// 远程查询
	function query(url, para, callback) {
		_log("tipmess");
		$.ajaxjson.post({
			url: url,
	        queryPara: para,
			successFunc: function(data) {
				callback(data);
			}
		});
	};
	
	var flag = 0;
	// 激活
	function activateActor(obj, actor) {
		var para = $.data(obj, "tipmess").options;
		
		var tt = actor.time;
		if (flag == 0) tt = 0;
		
		setTimeout(function() {			
			var still = false;
			var list = para.actors;
			for (var i = 0; list && list != null && i < list.length; i++) {
				if (list[i].id == actor.id) {
					still = true;
					break;
				}
			}
			if (!still) return ;
			
			var count;
			query(actor.url, actor.queryPara, function(data) {
				if (data && data.length > 0) {
					count = data.length;
				}
			});
			$("#" + obj.id).html(count);	// 设置链接的文本
			if (flag == 0) {
				$.winmess.show({
					title: "信息",
					msg: "你有&nbsp;<a href='javascript:void(0);'>" + count + "</a>&nbsp;条待办任务需要处理",
					showType: "slide",
					timeout: 5000
				});
			}
			activateActor(obj, actor);
			flag++;
		}, tt);
	};
	
	// 添加角色
	function addActor(obj) {
		var para = $.data(obj, "tipmess").options;
		activateActor(obj, para.actors[0]);
	};
	
	// 通过id删除角色
	function removeActorById(obj, actorId) {
		$("#" + actorId).remove();
	};
	
	$.fn.tipmess = function(para, args) {
		if (typeof para == "string") {
			return $.fn.tipmess.methods[para](this, args);
		}
		para = para || {};
		return this.each(function() {
			var _9 = $.data(this, "tipmess");
			if (_9) {
				$.extend(_9.options, para);
			} else {
				$.data(this, "tipmess", {
					options : $.extend( {}, $.fn.tipmess.defaults, para)
				});
				init(this);
			}
		});
	};
	
	$.fn.tipmess.methods = {
		// 添加
		addActor: function(jq, para) {
			addActor(jq[0]);
		},
		// 通过id移除
		removeActorById: function(jq, actorId) {
			removeActorById(jq[0], actorId);
		}
	};
	
	$.fn.tipmess.defaults = {
		/**
		 * id: ""
		 * url: ""	请求的url
		 * queryPara: {}	查询参数
		 * time: 3000	延迟时间
		 * handler: function() {}	点击触发的事件	
		 */
		actors: []	// 参与者
	};
})(jQuery);