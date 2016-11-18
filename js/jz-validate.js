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
				if(tags[i].getAttribute('data-validate')!=null && tags[i].getAttribute('data-validate')!=""){
					var that = tags[i];
					ruleName = that.getAttribute('data-validate');
					if(ruleName.indexOf(",") >= 0){	
						var rules = ruleName.split(",");
						for (var i in rules) {
							result = validate.methods.validateStart(that,rules[i]);
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
			if(validate.rules.hasOwnProperty(ruleName)){
				rule = validate.rules[ruleName];
				if(!rule.valid(obj.value)){
					validate.methods.check(obj,rule.warning);
					return false;
				}else{
					validate.methods.success(obj);
					return true;
				}
			}
		},
		duochong : function (obj,ruleName){
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
			warning:"此项为必填项！"
		},
		integer :{
			valid:function(value){
				var reg = /^\d+$/;
				return reg.test(value);
			},
			warning:"请输入整数！"
		},
		phone :{
			valid:function(value){
				var reg = /^(1[34578]\d{9})$/;
				return reg.test(value);
			},
			warning:"输入的手机号码不正确！"
		},
		email : {
			valid:function(value){
				var reg = /^(\w)+(\.\w+)*@(\w)+((\.\w{2,3}){1,3})$/;
				return reg.test(value);
			},
			warning:"请输入正确的邮箱格式！"
		},
		CN :{
			valid:function(value){
				var reg =  /^[\u0391-\uFFE5]+$/
				return reg.test(value);
			},
			warning:"请输入汉字！"
		},
		
	};
	window.onload = function(){
		var form = document.getElementById('validate');
		var tags = form.getElementsByTagName("input");
		for(var i=0;i<tags.length;i++){
			if(tags[i].getAttribute('data-validate')!=null && tags[i].getAttribute('data-validate')!=""){
				var that = tags[i];				
				(function (el) {
					el.onblur= function () { validate.methods.duochong(el,el.getAttribute('data-validate')) };					
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