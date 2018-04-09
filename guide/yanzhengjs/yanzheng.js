// var javahost2 = "http://118.190.67.197:8030/";
var javahost2 = "https://consumer.credan.com/";

		var handlerPopup = function(captchaObj) {
		    captchaObj.onReady(function() {
		        captchaObj.show();
		    });
		    // 成功的回调
		    captchaObj.onSuccess(function() {
		        var validate = captchaObj.getValidate();
		        var urlnow = window.location.search;
		        var urlphone = urlnow.replace("?", "");
		        $.ajax({
		            url: javahost2 + "wx/enrollSendCode", // 进行二次验证
		            type: "post",
		            dataType: "json",
		            contentType: 'application/json; charset=utf-8',
		            data: JSON.stringify({
		                phone: urlphone,
		                geetest_challenge: validate.geetest_challenge,
		                geetest_validate: validate.geetest_validate,
		                geetest_seccode: validate.geetest_seccode
		            }),
		            success: function(data) {
		                if (data.statusCode == 10001) {
			                var amsg = "10001";
			                window.parent.postMessage(amsg,'*');
		                } else {
		                    if (data.statusCode == 10002) {
		                        if (data.data.userStatus == "REJECT") {
					                var amsg = "REJECT";
					                window.parent.postMessage(amsg,'*');
		                        } else {
					                var amsg = data.message;
					                window.parent.postMessage(amsg,'*');
		                        }
		                    }
		                }

		            }
		        });
		    });

		    // 将验证码加到id为captcha的元素里
		    captchaObj.appendTo("#popup-captcha");
		    // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
		};


		$(function() {
/*
			alert("进来了！");
		    var checkresult = checkPhonenum(phoneNum);
		    if (checkresult == true) {
		        sendCode(this);
*/
		        // 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
		        var urlnow = window.location.search;
		        var urlphone = urlnow.replace("?", "");

		        $.ajax({
		            url: javahost2 + "wx/smsCaptcha",
		            type: "post",
		            dataType: "json",
		            contentType: 'application/json; charset=utf-8',
		            data: JSON.stringify({
		                phone: urlphone,
		            }),
		            success: function(data) {
		                // 使用initGeetest接口
		                // 参数1：配置参数
		                // 参数2：回调，回调的第一个参数验证码对象，之后可以使用它做appendTo之类的事件
		                initGeetest({
		                    gt: data.gt,
		                    https: true,
		                    challenge: data.challenge,
		                    product: "popup", // 产品形式，包括：float，embed，popup。注意只对PC版验证码有效
		                    offline: !data.success // 表示用户后台检测极验服务器是否宕机，一般不需要关注
		                        // 更多配置参数请参见：http://www.geetest.com/install/sections/idx-client-sdk.html#config
		                }, handlerPopup);
		            }
		        });
/*
		    } else {

		    }
*/
		});