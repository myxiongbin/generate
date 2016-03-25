		///////////////////////////////////////////////////////////
$(function(){
	//#ffffee
	//$('.easyui-validatebox').css("background","#ffffee");
	$('.easyui-validatebox[required="true"]').after('<font color="red"><b>*</b></font>');
	//$('.easyui-validatebox[required="true"]').before('<font color="red"><b>&nbsp;*&nbsp;</b></font>');
});
$.extend($.fn.validatebox.defaults.rules, {
    minLength: {
        validator: function(value, param){
            return value.length >= param[0];
        },
        message: 'Please enter at least {0} characters.'
    },
    maxLength: {
        validator: function(value, param){
            return value.length < param[0];
        },
        message: 'Please enter less than {0} characters.'
    },
    geInt: {
        validator: function(value, param){
    		if(!/^\d+$/.test(value)){
				return false;
        	}
            return parseInt(value) >= param[0];
        },
        message: 'Min Order {0}pcs.'
    },
    isInt: {
        validator: function(value, param){
    		if(/^\d+$/.test(value)){
				return true;
        	}
            return false;
        },
        message: '请输入整数.'
    },
    isEmail: {
        validator: function(value, param){
        	if(/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.)([a-zA-Z0-9_-])+$/.test(value)){
				return true;
        	}
            return false;
        },
        message: 'please input the correct email.'
    }

});
function validateJQForm(formjq) {
	if ($.fn.validatebox) {
		var box = $(".validatebox-text", formjq);
		if (box.length) {
			box.validatebox("validate");
			box.trigger("blur");
			var _21 = $(".validatebox-invalid:first", formjq).focus();
			return _21.length == 0;
		}
	}
	return true;
}