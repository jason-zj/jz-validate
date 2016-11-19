/*!
 * 表单验证插件,原生js，不依赖JQ 
 * @Author Jason-zj
 * Github地址：
 * 个人博客：https://jason-zj.github.io/
 */
(function(window){
	var validate = {};
	
	validate.methods = {
		check : function(obj,msg){
			if(obj.className !="error"){
				obj.className = "error";
				var span = document.createElement("span");
				span.className = "error-box";
				span.innerHTML = msg;
				obj.parentNode.appendChild(span);
			}
		},
		success : function(obj){
			if(obj.className =="error"){
				obj.className = "";
				var span = obj.nextElementSibling;
				obj.parentNode.removeChild(span);
			}
		},
		formValid : function(tags){			
			var result = true;
			
			for(var i=0;i<tags.length;i++){				
				if(tags[i].getAttribute('data-validate')!=null){
					var that = tags[i];
					ruleName = that.getAttribute('data-validate');
					if(ruleName.indexOf(",") >= 0){	
						var rules = ruleName.split(",");
						for (var s in rules) {
							result = validate.methods.validateStart(that,rules[s]);
						}					
					}else{
						result = validate.methods.validateStart(that,ruleName);	
					}
				}
			}
			return result;
		},
		trim : function(str){
			return str.replace(/(^\s*)|(\s*$)/g, "");
		},
		validateStart : function(obj,ruleName){
			var param = {};
			var rName = ruleName;
			if(ruleName.indexOf("length") != -1){
				ruleName = ruleName.substring(0,ruleName.indexOf("["));
				param.min = rName.substring(rName.indexOf("[")+1,rName.indexOf("-"));
				param.max = rName.substring(rName.indexOf("-")+1,rName.indexOf("]"));
			}
			if(ruleName.indexOf("max") != -1){
				//取得规则名称
				ruleName = ruleName.substring(0,ruleName.indexOf("["));
				param.max = rName.substring(rName.indexOf("[")+1,rName.indexOf("]"));
			}
			if(ruleName.indexOf("min") >= 0){
				ruleName = ruleName.substring(0,ruleName.indexOf("["));
				param.min = rName.substring(rName.indexOf("[")+1,rName.indexOf("]"));
			}
			if(validate.rules.hasOwnProperty(ruleName)){
				rule = validate.rules[ruleName];
				if(!rule.valid(obj.value,param)){
					validate.methods.check(obj,rule.warning(param));
					return false;
				}else{
					validate.methods.success(obj);
					return true;
				}
			}
			return false;
		},
		multiple : function (obj,ruleName){
			if(ruleName.indexOf(",") >= 0){				
				var rules = ruleName.split(",");				
				for (var i in rules) {
					validate.methods.validateStart(obj,validate.methods.trim(rules[i]));
				}
			}else{
				validate.methods.validateStart(obj,validate.methods.trim(ruleName))
			}
		}
	};
	validate.rules = {
		required : {
			valid:function(value){
				if(value != null && validate.methods.trim(value) != ""){ return true;}
				else{return false;}
			},
			warning:function(){ return "此项为必填项！"}
		},
		integer :{
			valid:function(value){
				var reg = /^\d+$/;
				return reg.test(value);
			},
			warning:function(){ return "请输入整数！"}
		},
		phone :{
			valid:function(value){
				var reg = /^(1[34578]\d{9})$/;
				return reg.test(value);
			},
			warning:function(){ return "输入的手机号码不正确！"}
		},
		qq :{
			valid:function(value){
				var reg = /^([1-9]\d{4,9})$/;
				return reg.test(value);
			},
			warning:function(){ return "输入的QQ号码不正确！"}
		},
		email : {
			valid:function(value){
				var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
				return reg.test(value);
			},
			warning:function(){ return "请输入正确的邮箱格式！"}
		},
		CN :{
			valid:function(value){
				var reg =  /^[\u0391-\uFFE5]+$/
				return reg.test(value);
			},
			warning:function(){ return "请输入汉字！"}
		},
		length : {
			valid:function(value,param){
				var size = value.length;
				if( param.min <= size && size <= param.max){ 
					return true;
				}else {
					return false;
				}
			},
			warning:function(param){return "输入的字符必须在"+param.min+"~"+param.max+"之间";}
		},
		max : {
			valid:function(value,param){
				var size = value.length;
				if( size <= param.max){
					 return true;
				} else {
					return false;
				}
			},
			warning:function(param){return "最大不能超过"+param.max+"个字符";}
		},
		min : {
			valid:function(value,param){
				var size = value.length;
				if( size >= param.min){ 
					return true;
				} else {
					return false;
				}
			},
			warning:function(param){return "不能少于"+param.min+"个字符";}
		},
		
	};
	
	window.validata = function(formId){		
		var form = formId;		
		var input = form.getElementsByTagName("input");
		var textarea = form.getElementsByTagName("textarea");
		var tags = [];
		for(var i=0;i<input.length;i++){
			tags.push(input[i]);
		}
		for(var i=0;i<textarea.length;i++){
			tags.push(textarea[i]);
		}
		for(var i=0;i<tags.length;i++){
			if(tags[i].getAttribute('data-validate')!=null && tags[i].getAttribute('data-validate')!=""){
				var that = tags[i];				
				(function (el) {
					el.onblur= function () { validate.methods.multiple(el,el.getAttribute('data-validate')) };					
				})(that);
				
			}
		}
		form.onsubmit = function(e){	
			if(!validate.methods.formValid(tags)){
				e.preventDefault();
			};
		}
	}
	
})(window)