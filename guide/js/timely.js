
/*
var javahost = "http://118.190.67.197:8070/v2/"; //开发URL
var javahostv3 = "http://118.190.67.197:8070/v3/"; //开发URL
var javahost2 = "http://118.190.67.197:8030/"; //开发URL
*/




// var javahost = "http://118.190.60.163:8070/v2/"; //预发布URL
// var javahostv3 = "http://118.190.60.163:8070/v3/"; //预发布URL
// var javahost2 = "http://118.190.60.163:8030/"; //预发布URL




// var javahost = "https://api.credan.com/v2/"; //正式
// var javahostv3 = "https://api.credan.com/v3/"; //正式
// var javahost2 = "https://consumer.credan.com/";

/**
 * 设置域名
 */
var javahost, javahostv3, javahost2,env;

function setHost() {

    var host = location.host;

    if(host.indexOf('app') > -1) {
        //正式环境
        javahost = "https://api.credan.com/v2/"; //正式
        javahostv3 = "https://api.credan.com/v3/"; //正式
        javahost2 = "https://consumer.credan.com/";
        env="production";

    } else {

        javahost = "http://118.190.60.163:8070/v2/"; //预发布URL
        javahostv3 = "http://118.190.60.163:8070/v3/"; //预发布URL
        javahost2 = "http://118.190.60.163:8030/"; //预发布URL
        env="test";
    }
}

setHost();

/*window.sessionStorage.userCashId = "60f0df5f7e6411e6af9d9cb654ae5988";
window.sessionStorage.userId = "a59eac76-6f4c-11e6-afa9-d89d672a22e4";

*/

var reclickTime = 60;
var resetButton = "";
var gpsMsg;

//设备侦测
var deviceMsg = ($.device);


function debug(obj) {
    console.log(obj);
}

/* restful API*/
var timelyCfg = {
    api: {
        cashloantestMessage: javahost + 'cashloan/submitOrderInfo',
        cashloanQueryUserInfo: javahost + 'cashloan/queryUserInfo',
        cashloanSubmitUserInfo: javahost + 'cashloan/submitUserInfo',
        cashloanSubmitContactInfo: javahost + 'cashloan/submitContactInfo',
        cashloanSubmitDetailInfo: javahost + 'cashloan/submitDetailInfo',
        cashloanFinalSubmit: javahost + 'cashloan/finalSubmit',
        collectionMobileSubmit: javahost + "user/collection/mobile/submit",
        userFileUploadByUserId: javahost + "user/file/uploadByUserId",
        userFileShowImg: javahost + 'user/file/showImg'
    }
}

/*查询定位信息*/
function Gps() {
    //var ua = navigator.userAgent.toLowerCase();
    var options = { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback, options);

}

/**
 * [timely Class]
 * @return {[type]} [急时雨方法封装]
 */
function timely() {

    this.rate = 0.01;

    this.dayList = [14, 21, 30];
    this.quota = {
        min: 600, //最小申请额度
        max: 3000, //最大申请额度
        countQuato: 3000, //申请额度
        money: 0, //到帐金额
        handling: 0, //手续费
        days: 14 //申请天数

    };
    this.checkStart = {
        identityCard: false,
        mobileVerify: false,
        otherLinkman: false,
        userMoreVerify: false
    }
}
timely.prototype = {
    /**
     * [init initialize]
     * @return {[undefined]} [description]
     */
    init: function() {
        this._sumPoundage();
        this._selectQuotaUp();
        this._daysListUp(0);
        this._bind();
    },
    /**
     * [_bind 事件绑定]
     * @return {[undefined]} [description]
     */
    _bind: function() {
        var _that = this;
        //照像机对象
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
        //金额滑动选择
        /*holdingCash.onchange = function(){
            _that.priceChange();
        }*/
        holdingCash.oninput = function() {
            _that.priceChange();
            //srcElement.value
        };
        /*selectDays.oninput = function() {
            var days = selectDays.value;
            _that.quota.days = days;
            _that._sumPoundage();
            _that._selectQuotaUp();
        };*/
        //申请天数调选择
        $("#daysList .idboxsm").each(function(idx) {
            $(this).on('click', function() {
                _that._daysListUp(idx);
                _that._sumPoundage();
                _that._selectQuotaUp();
            })
        });

        //额度提交按钮
        timelyQuoteBtn.onclick = function() {

            _that._sendQuoteCheck();


        };
        //所有用户信息提交
        userAllInfoBtn.onclick = function() {

            if (!_that.checkStart.identityCard) {
                $.alert('请先完善身份验证内的信息哦！');
                return false;
            }
            if (!_that.checkStart.mobileVerify) {
                $.alert('请先完善运营商验证内的信息哦！');
                return false;
            }
            if (!_that.checkStart.otherLinkman) {
                $.alert('请先完善联系人内的信息哦！');
                return false;
            }
            if (!_that.checkStart.userMoreVerify) {
                $.alert('请先完善更多信息哦！');
                return false;
            }

            // if (!_that.checkStart.userSesameF) {
            //     $.alert('请先完善芝麻分授权喔！');
	           //  return false;
            // }

            if(!gpsMsg) {//没有拿到定位信息的话

                gpsMsg = {

                    longitude: '',
                    latitude: ''
                }
            }

            var data = {
                "applyId": _that.applyId,
                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "gps": gpsMsg,
                "productType": 1,
                "sessionId": sessionId
            }

            _that.disabled(userAllInfoBtn);
            ajax(timelyCfg.api.cashloanFinalSubmit, { "data": data }, function(D) {

	            if (D.statusCode == 10105) {
                    $.alert(cdResult.msg, function() {
                        window.location.href = "about:blank";
                        window.open("", "_self");
                        window.opener = null;
                        window.close();
                        WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                    });
	            } else {
	                if (checkAjaxStart(D)) {
	                    if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
	                        $.router.load("#watingRST");
	                        window.sessionStorage.refreshPD = "timely";
	                    } else {
	                        $.router.load("#watingRSTwithoutbigNo");
	                        window.sessionStorage.refreshPD = "timely";
	                    }
	                    //_that.disabled(userAllInfoBtn);
	                }
	            }
            }, function(D) {
                _that.disabled(userAllInfoBtn);
            });

            // utils.addEvent('申请-提交-' + window.productName);

        };
        /*用户信息填写情况预查询*/
        $(document).on("pageInit", function(e, pageId, $page) {
            if (pageId == "userInfoGather") {
                var data = {
                    "cashId": window.sessionStorage.userCashId,
                    "userId": window.sessionStorage.userId,
                    "merchantId": window.sessionStorage.merchantid,
                    "type": 0,
                    "productType": 1
                };
                ajax(timelyCfg.api.cashloanQueryUserInfo, { "data": data }, function(D) {
                    if (checkAjaxStart(D)) {
                        _that.userInfoInit(D);
                    }
                });

            } else if (pageId == "basicTimely") {
                $.modal({
                    title: '',
                    extraClass: 'gpsbox',
                    text: '<div class="gps-icon"></div><div class="gps-info">当你关闭此消息时，我们可能会发起定位请求，<span>请选择允许！</span>以免因为定位失败导致的无法通过哦！</div>',
                    buttons: [{
                        text: '关闭此消息',
                        onClick: function() {
                            Gps();
                        }
                    }]
                });

            }
        });

        //身份验证弹窗
        identityCard.onclick = function() {

            // utils.addEvent('申请-下一步-身份-' + window.productName);

            $.popup('.popup-user-iden');
            var data = {

                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "type": 1,
                "productType": 1
            };
            ajax(timelyCfg.api.cashloanQueryUserInfo, { "data": data }, function(D) {
                if (checkAjaxStart(D)) {
                    var formItem = $(userCardForm).find("input");
                    formItem.eq(0).val(D.data.name);
                    formItem.eq(1).val(D.data.idNum);
                    formItem.eq(2).val(D.data.idAddress||'');
                    formItem.eq(3).val(D.data.bankCard);
                }
            });

            window.sessionStorage.HANDHELD_ID = 0;
            window.sessionStorage.IDCARD_FACADE = 0;
            window.sessionStorage.IDACRD_REVERSE = 0;
            ajax(timelyCfg.api.userFileShowImg, { "data": { "userId": window.sessionStorage.userId } }, function(D) {
                if (checkAjaxStart(D)) {
                    if (D.data.filePath.HANDHELD_ID != "") {
                        if ($("#cardIdPic").length >= 1) cardIdPic.src = D.data.filePath.HANDHELD_ID;
                        window.sessionStorage.HANDHELD_ID = 1;
                    } else {
                        window.sessionStorage.HANDHELD_ID = 0;
                    }
                    if (D.data.filePath.IDCARD_FACADE != "") {
                        if ($("#positivePic").length >= 1) positivePic.src = D.data.filePath.IDCARD_FACADE;
                        window.sessionStorage.IDCARD_FACADE = 1;
                    } else {
                        window.sessionStorage.IDCARD_FACADE = 0;
                    }
                    if (D.data.filePath.IDACRD_REVERSE != "") {
                        if ($("#reversePic").length >= 1) reversePic.src = D.data.filePath.IDACRD_REVERSE;
                        window.sessionStorage.IDACRD_REVERSE = 1;
                    } else {
                        window.sessionStorage.IDACRD_REVERSE = 0;
                    }
                }
            });

        };
        //运营商验证
        mobileVerify.onclick = function() {


            if (!_that.checkStart.identityCard) {
                $.alert("请先完善身份验证内的信息哦！");
                return false;
            }
            $.popup('.popup-mobile');
            var data = {

                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "type": 2,
                "productType": 1
            };
            ajax(timelyCfg.api.cashloanQueryUserInfo, { "data": data }, function(D) {
                if (checkAjaxStart(D)) {
                    mobileStr.value = D.data.phone;
                }
            });

            // utils.addEvent('申请-下一步-运营商-' + window.productName);
        };
        //紧急联系人
        otherLinkman.onclick = function() {
            if (!_that.checkStart.identityCard) {
                $.alert("请先完善身份验证内的信息哦！");
                return false;
            }

            $.popup('.popup-linkman');
            var data = {
                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "type": 3,
                "productType": 1
            };

            ajax(timelyCfg.api.cashloanQueryUserInfo, { "data": data }, function(D) {
                if (checkAjaxStart(D)) {
                    _that.applyId = D.data.applyId;
                    if (D.data.contact) {
                        var everArr = D.data.contact;
                        if (everArr.length >= 1) {
                            linkmanSelect1.value = everArr[0].relationType;
                            var typeText1 = $("#linkmanSelect1 option").not(function() {
                                return !this.selected
                            }).text();
                            if (typeText1) {
                                $(".create-contactre1").html(typeText1);
                            }
                            linkman_name1.value = everArr[0].name;
                            linkman_phone1.value = everArr[0].phone;
                        }

                        if (everArr.length >= 2) {
                            linkmanSelect2.value = everArr[1].relationType;
                            var typeText2 = $("#linkmanSelect2 option").not(function() {
                                return !this.selected
                            }).text();
                            if (typeText2) {
                                $(".create-contactre2").html(typeText2);
                            }
                            linkman_name2.value = everArr[1].name;
                            linkman_phone2.value = everArr[1].phone;
                        }
                        if (everArr.length >= 3) {
                            linkmanSelect3.value = everArr[2].relationType;
                            var typeText3 = $("#linkmanSelect3 option").not(function() {
                                return !this.selected
                            }).text();
                            if (typeText3) {
                                $(".create-contactre3").html(typeText3);
                            }

                            linkman_name3.value = everArr[2].name;
                            linkman_phone3.value = everArr[2].phone;
                        }
                    }
                }
            });

            // utils.addEvent('申请-下一步-联系人-' + window.productName);
        };

        //芝麻分授权
        userSesameFraction.onclick = function () {
            if (!_that.checkStart.identityCard) {
                $.alert("请先完善身份验证内的信息哦！");
                return false;
            }
            $.showPreloader();
            var data = {
                "userId": window.sessionStorage.userId,
            };
		    $.ajax({
		        type: "post",
		        url: javahostv3 + "collect/zhima/authorize/" + window.sessionStorage.userId,
		        data: data,
		        datatype: "json",
		        contentType: "application/json;charset=utf-8",
		        success: function(data) {
		            $.hidePreloader(); //显示蒙版层
		            if (data.success) {
			            var ah5url = data.data;
			            $.popup('.popup-user-sesame');
			            if (sesameiframe.location) {
				            sesameiframe.location.href = ah5url;
			            } else {
							sesameiframe.src = ah5url;
			            }
		            } else {
			            $.alert(data.message);
		            }
		        },
		        //请求出错处理
		        error: function() {
		            $.hidePreloader(); //显示蒙版层
		            $.alert("服务器繁忙");
		        }
		    })
        }


$(function(){
      window.addEventListener('message',function(e){


	    if (typeof (e.data) =='string')  {
			if(e.data.indexOf("?params=") != -1 ){
				checksesameresult (e.data);

			}
	    }
      },false);
});

function checksesameresult (data) {
	$.showPreloader();
	var x = data.indexOf("?params=");
	var y = data.indexOf("&sign=");
	var hfstr1 = data.substring(x + 8, y);
	var hfstr2 = data.substring(y + 6);
	    $.ajax({
	        type: "post",
	        url: javahostv3 + "collect/zhima/getOpenId/" + hfstr1 + "/" + hfstr2 ,
	        data: data,
	        datatype: "json",
	        contentType: "application/json;charset=utf-8",
	        success: function(data) {
	            $.hidePreloader(); //显示蒙版层
	            if (data.success) {
					$.alert("芝麻分授权成功！" , function () {
						$.closeModal('.popup-user-sesame');
                        $(userSesameFraction).find(".icon-f5").addClass("icon-f5-pass");
			            $(userSesameFraction).find(".item-after").addClass("fc1").html("已验证");
                        _that.checkStart.userSesameF = true;
					});
	            } else {
					$.alert(data.message , function (){
						$.closeModal('.popup-user-sesame');
					});
	            }
	        },
	        //请求出错处理
	        error: function() {
	            $.hidePreloader(); //显示蒙版层
	            $.alert("服务器繁忙");
	        }
	    })
}

        //更多信息
        userMoreVerify.onclick = function() {

            if (!_that.checkStart.identityCard) {
                $.alert("请先完善身份验证内的信息哦！");
                return false;
            }
            $.popup('.popup-user-more');
            var data = {
                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "type": 4,
                "productType": 1
            };
            ajax(timelyCfg.api.cashloanQueryUserInfo, { "data": data }, function(D) {
                if (checkAjaxStart(D)) {
                    if (D.data.workInfo) {
                        companyName.value = D.data.workInfo.workName;
                        if (D.data.workInfo.workAddr.province) {
                            citypickerworkads.value = D.data.workInfo.workAddr.province + " " + D.data.workInfo.workAddr.city + " " + D.data.workInfo.workAddr.district;
                        }
                        companyAddres.value = D.data.workInfo.specificAddr;
                        companyPhone.value = D.data.workInfo.companyPhone || '';
                        if (D.data.workInfo.companyType) { //单位性质

                            worknature.value = D.data.workInfo.companyType;
                            $(".create-worknature").html($("#worknature option").not(function() {
                                return !this.selected
                            }).text());
                        }
                        if (D.data.workInfo.liveTime) { //何时入职
                            workdatainput.value = D.data.workInfo.liveTime.replace('-', '年 ') + '月';
                        }
                        if (D.data.workInfo.profession) { //所任职位
                            worklevel.value = D.data.workInfo.profession;
                            $(".create-worklevel").html($("#worklevel option").not(function() {
                                return !this.selected
                            }).text());
                        }
                        if (D.data.workInfo.education) { //学历情况
                            education.value = D.data.workInfo.education;
                            $(".create-education").html($("#education option").not(function() {
                                return !this.selected
                            }).text());
                        }

                    }
                    if (D.data.residentInfo) {

                        if (D.data.residentInfo.liveAddr.province) {
                            citypickerliveads.value = D.data.residentInfo.liveAddr.province + " " + D.data.residentInfo.liveAddr.city + " " + D.data.residentInfo.liveAddr.district;
                        }
                        if (D.data.residentInfo.specificAddr) {
                            homeAddress.value = D.data.residentInfo.specificAddr;
                        }
                        debug(D.data.residentInfo.liveTime);
                        if (D.data.residentInfo.liveTime) { //何时入职
                            homeLiveTime.value = D.data.residentInfo.liveTime.replace('-', '年 ') + '月';
                        }
                     }
                    if (D.data.lifeInfo) {
                        if (D.data.lifeInfo.merriage) {
                            marital.value = D.data.lifeInfo.merriage;
                            $(".create-marred").html($("#marital option").not(function() {
                                return !this.selected
                            }).text());
                        }

                        if (D.data.lifeInfo.merriage == 2 || D.data.lifeInfo.merriage == 3) {
                            if (D.data.lifeInfo.spouse) {
                                $("#spouseitem").removeClass("hide");
                                spouse.value = D.data.lifeInfo.spouse;
                                $(".create-spouse").html($("#spouse option").not(function() {
                                    return !this.selected
                                }).text());
                            }
                        }
                        if (D.data.lifeInfo.household) {
                            household.value = D.data.lifeInfo.household;
                            $(".create-household").html($("#household option").not(function() {
                                return !this.selected
                            }).text());
                        }
                    }

                }
            });

            // utils.addEvent('申请-下一步-更多信息-' + window.productName);
        };
        //拍照对话框按钮
        /*$(".up-photo-bottom").on('click', function() {
            var buttons1 = [{
                text: '拍摄',
                onClick:
            }, {
                text: '取消',
                bg: 'danger'
            }];
            var groups = [buttons1];
            $.actions(groups);


            _that.takePicture();


        });*/

        //身份校验提交
        userIdenBtn.onclick = function() {


            var formItem = $(userCardForm).find("input");
            var data = {

                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "name": formItem.eq(0).val(), //姓名
                "idNum": formItem.eq(1).val(), //身份证号
                "idAddress": formItem.eq(2).val(),//身份证地址
                "cardNum": formItem.eq(3).val() //银行卡号
            }

            if (_that.checkUserCard(formItem, data)) {
                _that.disabled(userIdenBtn);


                if (window.sessionStorage.HANDHELD_ID == "0") {
                    if ($("#reportholdidcard li").length <= 0) {
                        $.alert("请上传手持身份证照片哦！");
                        _that.disabled(userIdenBtn);
                        return false;
                    }
                }
                if (window.sessionStorage.IDCARD_FACADE == "0") {
                    if ($("#positiveBox li").length <= 0) {
                        $.alert("请上传身份证正面照片哦！");
                        _that.disabled(userIdenBtn);
                        return false;
                    }
                }

                if (window.sessionStorage.IDACRD_REVERSE == "0") {
                    if ($("#reverseBox li").length <= 0) {
                        $.alert("请上传身份证反面照片哦！");
                        _that.disabled(userIdenBtn);
                        return false;
                    }
                }

                var upLdfrontMsg = {
                    "cashId": window.sessionStorage.userCashId,
                    "userId": window.sessionStorage.userId,
                    "HANDHELD_ID": {
                        facade: 8,
                        filename: '1.jpg',
                        file: ""
                    },
                    "IDCARD_FACADE": {
                        facade: 1,
                        filename: '2.jpg',
                        file: ""
                    },
                    "IDACRD_REVERSE": {
                        facade: 2,
                        filename: '3.jpg',
                        file: ""
                    },

                };

                if ($("#frontimg").length == 1) {
                    var imgbssixfour1 = frontimg.src;
                    imgbssixfour1 = imgbssixfour1.slice(23, imgbssixfour1.length);
                    upLdfrontMsg.HANDHELD_ID.file = imgbssixfour1;
                }
                if ($("#positivesPic").length == 1) {
                    var imgbssixfour2 = positivesPic.src;
                    imgbssixfour2 = imgbssixfour2.slice(23, imgbssixfour2.length);
                    upLdfrontMsg.IDCARD_FACADE.file = imgbssixfour2;
                }
                if ($("#reversesPic").length == 1) {
                    var imgbssixfour3 = reversesPic.src;
                    imgbssixfour3 = imgbssixfour3.slice(23, imgbssixfour3.length);
                    upLdfrontMsg.IDACRD_REVERSE.file = imgbssixfour3;
                }

                ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                    if (cdResult.statusCode == 7007) {

                        /*holdidcardword.innerHTML = "身份证图片已上传！";
                        $.closeModal('.popup-holdidcard');*/

                        //提交资料
                        //发送请求
                        ajax(timelyCfg.api.cashloanSubmitUserInfo, { "data": data }, function(D) {
                            _that.disabled(userIdenBtn);
                            if (checkAjaxStart(D)) {
                                if (D.data.userStatus == 3) {
                                    $.alert(D.message, function() {
                                        window.location.href = "about:blank";
                                        window.open("", "_self");
                                        window.opener = null;
                                        window.close();
                                        WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                                    });
                                } else if (D.data.userStatus == 2) {
                                    $.alert(D.message, function() {
                                        if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                                            $.closeModal(".popup-user-iden");
                                            $.router.load("#watingRST");
                                            window.sessionStorage.refreshPD = "timely";
                                        } else {
                                            $.closeModal(".popup-user-iden");
                                            $.router.load("#watingRSTwithoutbigNo");
                                            window.sessionStorage.refreshPD = "timely";
                                        }
                                    });

                                } else {
                                    $.closeModal(".popup-user-iden");
                                    $(identityCard).find(".icon-f1").addClass("icon-f1-pass");
                                    $(identityCard).find(".item-after").addClass("fc1").html("已验证");
                                    _that.checkStart.identityCard = true;

                                }

                            }
                        }, function(D) {
                            _that.disabled(userIdenBtn);
                        });

                    } else if (cdResult.statusCode == 7008) {
                        $.alert("上传失败！", function() {
                            $.closeModal('.popup-user-iden');
                            _that.disabled(userIdenBtn);
                        })
                    } else if (cdResult.statusCode == 4000) {
                        $.alert("参数错误，注册请从第一步开始！");
                        _that.disabled(userIdenBtn);
                    }
                }, function(D) {
                    _that.disabled(userIdenBtn);
                });

                // utils.addEvent('申请-下一步-身份-提交-' + window.productName);
                /*var upLdfrontMsg = { "cashId": window.sessionStorage.userCashId, "userId": window.sessionStorage.userId, "filename": "123.jpg"};
                //手持身份证如果有重新选择，则上传
                if (frontimg) {
                    var imgbssixfour = frontimg.src;
                    imgbssixfour = imgbssixfour.slice(23, imgbssixfour.length);
                    upLdfrontMsg.file = imgbssixfour;
                    upLdfrontMsg.facade = 8;
                    ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                        if (cdResult.statusCode != 7007) {
                            $.alert("上传失败！", function() {
                                holdidcardword.innerHTML = "手持身份证上传失败！";
                                holdidcardword.style.color = "red";
                                $.closeModal('.popup-holdidcard');
                            })
                        } else if (cdResult.statusCode == 7008) {
                            $.alert("上传失败！", function() {
                                holdidcardword.innerHTML = "手持身份证上传失败！";
                                holdidcardword.style.color = "red";
                                $.closeModal('.popup-holdidcard');
                            })
                        } else if (cdResult.statusCode == 4000) {
                            $.alert("参数错误，注册请从第一步开始！");
                        }
                    });
                }
                //正面如果有重新选择，则上传
                if (positivesPic) {
                    var positivesPic = positivesPic.src;
                    imgbssixfour = imgbssixfour.slice(23, positivesPic.length);
                    upLdfrontMsg.file = imgbssixfour;
                    upLdfrontMsg.facade = 1;
                    ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                        if (cdResult.statusCode == 7007) {
                            $.alert("上传失败！", function() {
                                $.closeModal('.popup-user-iden');
                            })
                        } else if (cdResult.statusCode == 7008) {
                            $.alert("上传失败！", function() {
                                $.closeModal('.popup-user-iden');
                            })
                        } else if (cdResult.statusCode == 4000) {
                            $.alert("参数错误，注册请从第一步开始！");
                        }
                    });
                }

                //反面如果有重新选择，则上传
                if (reversesPic) {
                    var reversesPic = reversesPic.src;
                    imgbssixfour = imgbssixfour.slice(23, reversesPic.length);
                    upLdfrontMsg.file = imgbssixfour;
                    upLdfrontMsg.facade = 2;
                    ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                        if (cdResult.statusCode == 7007) {
                            $.alert("上传失败！", function() {
                                $.closeModal('.popup-user-iden');
                            })
                        } else if (cdResult.statusCode == 7008) {
                            $.alert("上传失败！", function() {
                                $.closeModal('.popup-user-iden');
                            })
                        } else if (cdResult.statusCode == 4000) {
                            $.alert("参数错误，注册请从第一步开始！");
                        }
                    });
                }

                //提交数据
                ajax(timelyCfg.api.cashloanSubmitUserInfo, { "data": data }, function(D) {
                    if (checkAjaxStart(D)) {
                        if (D.data.userStatus == 3) {
                            $.alert(D.message, function() {
                                window.location.href = "about:blank";
                                window.open("", "_self");
                                window.opener = null;
                                window.close();
                                WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                            });
                        } else if (D.data.userStatus == 2) {
                            $.alert(D.message, function() {
                                if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17") {
                                    $.closeModal(".popup-user-iden");
                                    $.router.load("#watingRST");
                                    window.sessionStorage.refreshPD = "timely";
                                } else {
                                    $.closeModal(".popup-user-iden");
                                    $.router.load("#watingRSTwithoutbigNo");
                                    window.sessionStorage.refreshPD = "timely";
                                }
                            });

                        } else {
                            $.closeModal(".popup-user-iden");
                            $(identityCard).find(".icon-f1").addClass("icon-f1-pass");
                            $(identityCard).find(".item-after").addClass("fc1").html("已验证");
                            _that.checkStart.identityCard = true;
                            _that.disabled(userIdenBtn);
                        }


                    }
                }, function(D) {
                    _that.disabled(userIdenBtn);
                });*/
                /*//上传手持
                var filerename = "123.jpeg";
                var imgbssixfour = document.getElementById("frontimg").src;
                imgbssixfour = imgbssixfour.slice(23, imgbssixfour.length);

                var upLdfrontMsg = { "cashId": window.sessionStorage.userCashId, "userId": window.sessionStorage.userId, "file": imgbssixfour, "filename": filerename, "facade": 8 };
                ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                    if (cdResult.statusCode == 7007) {
                        var positivesPic = positivesPic.src;
                        imgbssixfour = imgbssixfour.slice(23, positivesPic.length);
                        upLdfrontMsg.file = imgbssixfour;
                        upLdfrontMsg.facade = 1;
                        //上传正面
                        ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                            if (cdResult.statusCode == 7007) {
                                var reversesPic = reversesPic.src;
                                imgbssixfour = imgbssixfour.slice(23, reversesPic.length);
                                upLdfrontMsg.file = imgbssixfour;
                                upLdfrontMsg.facade = 2;
                                //上传反面
                                ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                                    if (cdResult.statusCode == 7007) {

                                        //提交数据
                                        ajax(timelyCfg.api.cashloanSubmitUserInfo, { "data": data }, function(D) {
                                            if (checkAjaxStart(D)) {
                                                if (D.data.userStatus == 3) {
                                                    $.alert(D.message, function() {
                                                        window.location.href = "about:blank";
                                                        window.open("", "_self");
                                                        window.opener = null;
                                                        window.close();
                                                        WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                                                    });
                                                } else if (D.data.userStatus == 2) {
                                                    $.alert(D.message, function() {
                                                        if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17") {
                                                            $.closeModal(".popup-user-iden");
                                                            $.router.load("#watingRST");
                                                            window.sessionStorage.refreshPD = "timely";
                                                        } else {
                                                            $.closeModal(".popup-user-iden");
                                                            $.router.load("#watingRSTwithoutbigNo");
                                                            window.sessionStorage.refreshPD = "timely";
                                                        }
                                                    });

                                                } else {
                                                    $.closeModal(".popup-user-iden");
                                                    $(identityCard).find(".icon-f1").addClass("icon-f1-pass");
                                                    $(identityCard).find(".item-after").addClass("fc1").html("已验证");
                                                    _that.checkStart.identityCard = true;
                                                    _that.disabled(userIdenBtn);
                                                }


                                            }
                                        }, function(D) {
                                            _that.disabled(userIdenBtn);
                                        });




                                    } else if (cdResult.statusCode == 7008) {
                                        $.alert("上传失败！", function() {
                                            holdidcardword.innerHTML = "身份证上传失败！";
                                            holdidcardword.style.color = "red";
                                            $.closeModal('.popup-holdidcard');
                                        })
                                    } else if (cdResult.statusCode == 4000) {
                                        $.alert("参数错误，注册请从第一步开始！");
                                    }
                                });



                            } else if (cdResult.statusCode == 7008) {
                                $.alert("上传失败！", function() {
                                    holdidcardword.innerHTML = "身份证上传失败！";
                                    holdidcardword.style.color = "red";
                                    $.closeModal('.popup-holdidcard');
                                })
                            } else if (cdResult.statusCode == 4000) {
                                $.alert("参数错误，注册请从第一步开始！");
                            }
                        });

                    } else if (cdResult.statusCode == 7008) {
                        $.alert("上传失败！", function() {
                            holdidcardword.innerHTML = "身份证上传失败！";
                            holdidcardword.style.color = "red";
                            $.closeModal('.popup-holdidcard');
                        })
                    } else if (cdResult.statusCode == 4000) {
                        $.alert("参数错误，注册请从第一步开始！");
                    }
                });*/

                //上传身份证
                // /*/*if ($("#reportholdidcard li").length > 0) {
                //     var filerename = "123.jpeg";
                //     var imgbssixfour = document.getElementById("frontimg").src;
                //     imgbssixfour = imgbssixfour.slice(23, imgbssixfour.length);

                //     var upLdfrontMsg = { "cashId": window.sessionStorage.userCashId, "userId": window.sessionStorage.userId, "file": imgbssixfour, "filename": filerename };


                //     ajax(timelyCfg.api.userFileUploadByUserId, { data: upLdfrontMsg }, function(cdResult) {
                //         if (cdResult.statusCode == 7007) {

                //             /*holdidcardword.innerHTML = "身份证图片已上传！";
                //             $.closeModal('.popup-holdidcard');*/

                //             //提交资料
                //             //发送请求
                //             ajax(timelyCfg.api.cashloanSubmitUserInfo, { "data": data }, function(D) {
                //                 if (checkAjaxStart(D)) {
                //                     if (D.data.userStatus == 3) {
                //                         $.alert(D.message, function() {
                //                             window.location.href = "about:blank";
                //                             window.open("", "_self");
                //                             window.opener = null;
                //                             window.close();
                //                             WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                //                         });
                //                     } else if (D.data.userStatus == 2) {
                //                         $.alert(D.message, function() {
                //                             if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17") {
                //                                 $.closeModal(".popup-user-iden");
                //                                 $.router.load("#watingRST");
                //                                 window.sessionStorage.refreshPD = "timely";
                //                             } else {
                //                                 $.closeModal(".popup-user-iden");
                //                                 $.router.load("#watingRSTwithoutbigNo");
                //                                 window.sessionStorage.refreshPD = "timely";
                //                             }
                //                         });

                //                     } else {
                //                         $.closeModal(".popup-user-iden");
                //                         $(identityCard).find(".icon-f1").addClass("icon-f1-pass");
                //                         $(identityCard).find(".item-after").addClass("fc1").html("已验证");
                //                         _that.checkStart.identityCard = true;
                //                         _that.disabled(userIdenBtn);
                //                     }


                //                 }
                //             }, function(D) {
                //                 _that.disabled(userIdenBtn);
                //             });

                //         } else if (cdResult.statusCode == 7008) {
                //             $.alert("上传失败！", function() {
                //                 holdidcardword.innerHTML = "身份证上传失败！";
                //                 holdidcardword.style.color = "red";
                //                 $.closeModal('.popup-holdidcard');
                //             })
                //         } else if (cdResult.statusCode == 4000) {
                //             $.alert("参数错误，注册请从第一步开始！");
                //         }
                //     });
                //     //makeAfrontcall(upLdfrontUrl, upLdfrontMsg);
                // } else {
                //     $.alert("请上传手持身份证照片哦！");
                //     _that.disabled(userIdenBtn);
                // }*/*/



                return false;

            }

        };

        //运营商校验提交
        mobileVerifyBtn.onclick = function() {


            var data = {
                mobile: mobileStr.value,
                mobilePwd: mobilePwd.value
            };
            if (data.mobilePwd == "") {
                $.alert(msg.mobile.pwdEmpty, function() {
                    mobilePwd.focus();
                });
                return false;
            };



            //验证运营商服务密码正确性
            var mobileData = {
                "method": "",
                "param": { "password": mobilePwd.value },
                "userId": window.sessionStorage.userId,
                "cashId": window.sessionStorage.userCashId
            };

            //校验运营商

            // makevestcall (timelyCfg.api.collectionMobileSubmit,mobileData);
            makevestcall(timelyCfg.api.collectionMobileSubmit, mobileData, function() {
                _that.checkStart.mobileVerify = true;
                debug(_that.checkStart);
            }, 'timely');
            /*ajax(timelyCfg.api.collectionMobileSubmit, { "data": mobileData }, function(D) {

                threeMobileCheck(D);
            });

            _that.disabled(mobileVerifyBtn);
            //保存数据
            ajax(timelyCfg.api.cashloanSubmitUserInfo, { "data": data }, function(D) {
                if (checkAjaxStart(D)) {
                    $.closeModal(".popup-mobile");
                    $(mobileVerify).find(".icon-f2").addClass("icon-f2-pass");
                    $(mobileVerify).find(".item-after").addClass("fc1").html("已验证");
                    _that.checkStart.mobileVerify = true;
                    _that.disabled(mobileVerifyBtn);

                }
            }, function(D) {
                _that.disabled(mobileVerifyBtn);
            });*/

            // utils.addEvent('申请-下一步-运营商-提交-' + window.productName);

        };

        //联系人信息提交
        otherLinkmanBtn.onclick = function() {
            var data = {
                "applyId": _that.applyId,

                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "contactInfo": [{
                    "rank": 1,
                    "relationType": linkmanSelect1.value,
                    "name": linkman_name1.value,
                    "phone": linkman_phone1.value
                }, {
                    "rank": 2,
                    "relationType": linkmanSelect2.value,
                    "name": linkman_name2.value,
                    "phone": linkman_phone2.value
                }, {
                    "rank": 3,
                    "relationType": linkmanSelect3.value,
                    "name": linkman_name3.value,
                    "phone": linkman_phone3.value
                }]
            };
            if (_that.checkLinkman(data)) {

                _that.disabled(otherLinkmanBtn);
                //保存数据
                ajax(timelyCfg.api.cashloanSubmitContactInfo, { "data": data }, function(D) {
                    if (checkAjaxStart(D)) {
                        $.closeModal(".popup-linkman");
                        $(otherLinkman).find(".icon-f3").addClass("icon-f3-pass");
                        $(otherLinkman).find(".item-after").addClass("fc1").html("已验证");
                        _that.checkStart.otherLinkman = true;
                        _that.disabled(otherLinkmanBtn);
                    }
                }, function(D) {
                    _that.disabled(otherLinkmanBtn);
                });
            };

            // utils.addEvent('申请-下一步-联系人-提交-' + window.productName);

        };

        //更多信息提交
        userMoreVerifyBtn.onclick = function() {
            var workAddrArr = citypickerworkads.value.split(" ");

            if (workAddrArr[2] == "") {
                workAddrArr[2] = workAddrArr[1];
                workAddrArr[1] = workAddrArr[0];
            }

            var citypickerliveadsArr = citypickerliveads.value.split(" ");
            if (citypickerliveadsArr[2] == "") {
                citypickerliveadsArr[2] = citypickerliveadsArr[1];
                citypickerliveadsArr[1] = citypickerliveadsArr[0];
            }
            var workdatainput = $("#workdatainput").val();
            var homeLiveTime = $("#homeLiveTime").val();
            if (workdatainput) {
                workdatainput = workdatainput.replace('年 ', '-');
                workdatainput = workdatainput.substring(0, workdatainput.length - 1);
            }
            if (homeLiveTime) {
                homeLiveTime = homeLiveTime.replace('年 ', '-');
                homeLiveTime = homeLiveTime.substring(0, homeLiveTime.length - 1);
            }

            if(!gpsMsg) {//没有拿到定位信息的话

                gpsMsg = {

                    longitude: '',
                    latitude: ''
                }
            }

            var data = {
                "cashId": window.sessionStorage.userCashId,
                "userId": window.sessionStorage.userId,
                "merchantId": window.sessionStorage.merchantid,
                "quota": 0,
                "workInfo": {
                    "workName": companyName.value, //公司名称
                    "workAddr": {
                        "province": workAddrArr[0],
                        "city": workAddrArr[1],
                        "district": workAddrArr[2]
                        }, //公司地址
                    "companyPhone": companyPhone.value,//公司电话
                    "specificAddr": companyAddres.value, //详细地址
                    "companyType": worknature.value, //公司性质
                    "liveTime": workdatainput, //何时入职
                    "profession": worklevel.value, //所任职位
                    "education": education.value, //学历情况

                },
                "residentInfo": {
                    "liveAddr": { "province": citypickerliveadsArr[0], "city": citypickerliveadsArr[1], "district": citypickerliveadsArr[2] },
                    "specificAddr": homeAddress.value,
                    "liveTime": homeLiveTime
                },
                "lifeInfo": {
                    "household": household.value, //是否本地户口:0：否；1：是
                    "spouse": spouse.value,
                    "merriage": marital.value //婚姻状况
                },
                gps: gpsMsg
            };

            if (_that.checkOtherInfo(data)) {
                //发请求

                _that.disabled(userMoreVerifyBtn);
                //保存数据
                ajax(timelyCfg.api.cashloanSubmitDetailInfo, { "data": data }, function(D) {
                    if (checkAjaxStart(D)) {
                        $.closeModal(".popup-user-more");
                        $(userMoreVerify).find(".icon-f4").addClass("icon-f4-pass");
                        $(userMoreVerify).find(".item-after").addClass("fc1").html("已验证");
                        _that.checkStart.userMoreVerify = true;
                        _that.disabled(userMoreVerifyBtn);
                    }
                }, function(D) {
                    _that.disabled(userMoreVerifyBtn);
                });


                // utils.addEvent('申请-下一步-更多信息-提交-' + window.productName);
            }


        };

        /*var itemArr = [
            { key: 1, text: '配偶' },
            { key: 2, text: '父母' },
            { key: 4, text: '兄弟姐妹' },
            { key: 6, text: '朋友' },
            { key: 7, text: '同事' }
        ];

        //关系下拉菜单设置
        linkmanSelect1.onchange = function() {
            var linkmanVal = linkmanSelect1.value;
            var linkmanArr2 = [itemArr[2], itemArr[3]];
            if (linkmanVal == "1") {
                linkmanArr2.unshift(itemArr[1]);
            } else if (linkmanVal == "2") {
                linkmanArr2.unshift(itemArr[0]);
            } else {
                return false;
            }
            var htmlNode = ['<option value="0">请选择</option>'];
            linkmanArr2.forEach(function(item) {
                htmlNode.push('<option value="' + item.key + '">' + item.text + '</option>');
            });
            $(linkmanSelect2).empty().append(htmlNode.join(''));
        };*/


    },
    handlevestData: function(vestdata) {
        if (vestdata.param.length == 1) {
            if (vestdata.param[0].key == "pic_code") {
                var modal = $.modal({
                    title: vestdata.param[0].title,
                    text: vestdata.param[0].hint,
                    afterText: '<img id="picCode" src = "data:image/jpg;base64,' + vestdata.param[0].value + '">' + '<a style="margin-top:.4rem;" id="reloadPiccode" href="#" class="button button-light">刷新</a>' +
                        '<input id="vestpiccode" type="text" value= "">',
                    buttons: [{
                        text: '提交',
                        bold: true,
                        onClick: function() {
                            var value = vestpiccode.value;
                            var key = vestdata.param[0].key;
                            var checkphonepicMsg = { param: { pic_code: value }, "hidden": vestdata.hidden, "method": vestdata.method };
                            var checkphonepicUrl = javahost + "collection/mobile/submit";
                            makevestcall(checkphonepicUrl, checkphonepicMsg);
                        }
                    }, ]
                })
                reloadPiccode.style.height = picCode.style.height;
                reloadPiccode.style.lineHeight = picCode.style.height;
                reloadPiccode.addEventListener("click", function() {
                    var refreshMsg = { "hidden": vestdata.hidden, "param": vestdata.param[0].refresh_param, "method": vestdata.param[0].refresh_method };
                    var refreshUrl = javahost + "collection/mobile/refresh";
                    makerefreshcall(refreshUrl, refreshMsg);
                })
            } else {
                var modal = $.modal({
                    title: vestdata.param[0].title,
                    text: vestdata.param[0].hint,
                    afterText: '<input id="whateversmth" type="text" value= "">',
                    buttons: [{
                        text: '提交',
                        bold: true,
                        onClick: function() {
                            var value = whateversmth.value;
                            var key = vestdata.param[0].key;
                            //                    var checkphonepicMsg = {param:{message_code:value},"hidden":vestdata.hidden,"method":vestdata.method};
                            var paramstr = '{"' + key + '":""}'
                            var paramjson = JSON.parse(paramstr);
                            paramjson[key] = value;
                            var checkphonepicMsg = {};
                            checkphonepicMsg.hidden = vestdata.hidden;
                            checkphonepicMsg.method = vestdata.method;
                            checkphonepicMsg.param = paramjson;
                            var checkphonepicUrl = javahost + "collection/mobile/submit";
                            makevestcall(checkphonepicUrl, checkphonepicMsg);
                        }
                    }, ]
                })
            }
        } else if (vestdata.param.length == 2) {
            if (vestdata.param[1].key == "pic_code") {
                var checkphonetwoMsg = { param: { message_code: "", pic_code: "" }, "hidden": vestdata.hidden, "method": vestdata.method };
                var modal = $.modal({
                    title: vestdata.param[1].title,
                    text: vestdata.param[1].hint,
                    afterText: '<img src = "data:image/jpg;base64,' + vestdata.param[1].value + '">' +
                        '<input id="vestpiccode" type="text" value= "">',
                    buttons: [{
                        text: '提交',
                        bold: true,
                        onClick: function() {
                            var value = vestpiccode.value;
                            checkphonetwoMsg.param.pic_code = value;
                        }
                    }, ]
                })
                var modal = $.modal({
                    title: vestdata.param[0].title,
                    text: vestdata.param[0].hint,
                    afterText: '<input id="vesttextcode" type="text" value= "">',
                    buttons: [{
                        text: '提交',
                        bold: true,
                        onClick: function() {
                            var value2 = vesttextcode.value;
                            checkphonetwoMsg.param.message_code = value2;
                            var checkphonetwoUrl = javahost + "collection/mobile/submit";
                            makevestcall(checkphonetwoUrl, checkphonetwoMsg);
                        }
                    }, ]
                })
            }
        } else if (vestdata.param.length == 3) {
            alert("需要填写身份证号和真实姓名登录！");
        }
    },
    /**
     * [userInfoInit description]
     * @param  {[type]} D [description]
     * @return {[type]}   [description]
     */
    userInfoInit: function(D) {
        this.checkStart = {
            identityCard: D.data.identity,
            mobileVerify: D.data.mobile,
            otherLinkman: D.data.contact,
            userMoreVerify: D.data.more,
            userSesameF: D.data.zhima
        }
        this.userInfoPageShow();
    },
    /**
     * [userInfoPageShow description]
     * @return {[type]} [description]
     */
    userInfoPageShow: function() {

        if (this.checkStart.identityCard) {
            var obj = $(identityCard);
            obj.find(".icon-f1").addClass("icon-f1-pass");
            obj.find(".item-after").addClass("fc1").html("已验证");
        }
        if (this.checkStart.mobileVerify) {
            obj = $(mobileVerify);
            obj.find(".icon-f2").addClass("icon-f2-pass");
            obj.find(".item-after").addClass("fc1").html("已验证");
        }
        if (this.checkStart.otherLinkman) {
            obj = $(otherLinkman);
            obj.find(".icon-f3").addClass("icon-f3-pass");
            obj.find(".item-after").addClass("fc1").html("已验证");
        }
        if (this.checkStart.userMoreVerify) {
            obj = $(userMoreVerify);
            obj.find(".icon-f4").addClass("icon-f4-pass");
            obj.find(".item-after").addClass("fc1").html("已验证");
        }
        if (this.checkStart.userSesameF) {
            obj = $(userSesameFraction);
            obj.find(".icon-f5").addClass("icon-f5-pass");
            obj.find(".item-after").addClass("fc1").html("已验证");
        }

    },
    /**
     * [disabled 设置按钮是否可用]
     * @param  {[type]} id [description]
     * @return {[undefined]}    [description]
     */
    disabled: function(id) {
        var obj = $(id);
        var disabled = obj.attr("disabled");
        disabled ? obj.removeAttr("disabled") : obj.attr("disabled", true);
    },
    /**
     * [_sumPoundage 急时雨到帐金额和手续费计算]
     * @param  {[number]} price [申请金额]
     * @param  {[number]} days  [使用天数]
     * @return {[number]}       [手续费]
     */
    _sumPoundage: function(quota, days) {
        quota = quota || this.quota.countQuato;
        days = days || this.quota.days;
        var handling = quota * days * this.rate;
        var money = quota - handling;
        this.quota.handling = handling;
        this.quota.money = money;
        return {
            money: money,
            handling: handling.toFixed(0)
        };
    },
    /**
     * [priceChange 额度调整回调]
     * @return {[undefined]} [description]
     */
    priceChange: function() {
        var price = holdingCash.value;

        if (this._checkQuota(price)) {
            this.quota.countQuato = price;
            this._sumPoundage();
            this._selectQuotaUp();
        }
    },
    /**
     * [_checkQuota 检查申请额度是否正确]
     * @param  {[number]} prop [额度]
     * @return {[boolean]}     [在额度范围内反回true,否则false]
     */
    _checkQuota: function(prop) {
        var k = parseInt(prop);
        if (isNaN(prop)) return false;
        if (prop < this.quota.min || prop > this.quota.max) return false;
        return true;
    },
    /**
     * [_selectQuotaUp 更新申请金额]
     * @return {[undefined]} [description]
     */
    _selectQuotaUp: function() {
        holdingCash.value = this.quota.countQuato;
        wantCash.innerHTML = this.quota.countQuato;
        wantDays.innerHTML = this.quota.days;
        actualCash.innerHTML = this.quota.money;
        processingFee.innerHTML = this.quota.handling;
    },
    /**
     * [_daysListUp 更新申请天数]
     * @return {[undefined]} [description]
     */
    _daysListUp: function(idx) {
        this.quota.days = this.dayList[idx];
        var daysItem = $("#daysList .idboxsm");
        daysItem.removeClass("checked");
        var k = this.dayList.indexOf(this.quota.days);
        if (k > -1) {
            daysItem.eq(k).addClass("checked");
        }
    },
    _sendQuoteCheck: function() {
        var data = {
            "cashId": window.sessionStorage.userCashId,
            "userId": window.sessionStorage.userId,
            "merchantId": window.sessionStorage.merchantid,
            "productType": "1", //产品类型
            "fee": this.quota.handling, //手续费
            "finalAmount": this.quota.money, //到帐金额
            "orderAmount": this.quota.countQuato, //订单金额
            "term": this.quota.days, //期数
            "unit": "D" //单位
        }
        this.disabled(timelyQuoteBtn);
        var _this = this;

        ajax(timelyCfg.api.cashloantestMessage, { "data": data }, function(D) {
            if (checkAjaxStart(D)) {
                if (D.statusCode == 200) {
                    $.router.load("#userInfoGather");
                    _this.disabled(timelyQuoteBtn);
                }
            }
        }, function(D) {
            _this.disabled(timelyQuoteBtn);
        });

        // utils.addEvent('申请-时间{'+ this.quota.days +'天}-' + window.productName);
        // utils.addEvent('申请-下一步-' + window.productName);
        return false;
    },
    /**
     * [takePicture 微信身份证上传]
     * @return {[type]} [description]
     */
    takePicture: function() {
        wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function(res) {
                var localIds = res.localIds; // 返回选定照片的本地ID列表，localId可以作为img标签的src属性显示图片
                $('#cardIdPic').attr('src', $.trim(localIds[0]));
                wx.uploadImage({
                    localId: localIds,
                    isShowProgressTips: 1,
                    success: function(res) {
                        serverId = res.serverId;
                        //不需要下载，应该向服务器发起请求保存图片



                        //下载图片
                        /*wx.downloadImage({
                            serverId: serverId, // 需要下载的图片的服务器端ID，由uploadImage接口获得
                            isShowProgressTips: 1, // 默认为1，显示进度提示
                            success: function(res) {
                                var localId = res.localId; // 返回图片下载后的本地ID
                                alert('本地图片ID' + localId);
                            }
                        });*/
                    }
                });
            }
        });

    },
    /**
     * [checkUserCard 校验用户身份证填写情况]
     * @return {[boolean]} [description]
     */
    checkUserCard: function(formItem, data) {

        if (data.name == "") {
            $.alert(msg.userName.empty, function() {
                formItem.eq(0).focus();
            });
            return false;
        }
        if (!checkRealname2(data.name)) {
            $.alert(msg.userName.error, function() {
                formItem.eq(0).focus();
            });
            return false;
        }
        if (data.idNum == "") {
            $.alert(msg.idNum.empty, function() {
                formItem.eq(1).focus();
            });
            return false;
        }
        if (!checkIdcard2(data.idNum)) {
            $.alert(msg.idNum.error, function() {
                formItem.eq(1).focus();
            });
            return false;
        }
           // 检测身份证地址
        if(data.idAddress == ""){

            $.alert(msg.idAddress.empty, function() {
                formItem.eq(2).focus();
            })

            return false;
        }

        if (data.cardNum == "") {
            $.alert(msg.cardNum.empty, function() {
                formItem.eq(2).focus();
            });
            return false;
        }
        if (!checkBanknumber2(data.cardNum)) {
            $.alert(msg.cardNum.error, function() {
                formItem.eq(2).focus();
            });
            return false;
        }
        return true;
    },
    /**
     * [checkLinkman 校验更多信息填写情况]
     * @param  {[object]} data [表单数据]
     * @return {[boolean]}      [description]
     */
    checkLinkman: function(data) {
        if (data.contactInfo[0].relationType == 0 && data.contactInfo[0].name == "" && data.contactInfo[0].phone == "") {
            $.alert(msg.relation.error.replace('${1}', '1'));
            return false;
        }
        if (data.contactInfo[0].name == "") {
            $.alert(msg.relationName.empty.replace('${1}', '1'), function() {
                linkman_name1.focus();
            });
            return false;
        }
        if (!checkRealname2(data.contactInfo[0].name)) {
            $.alert(msg.relationName.error.replace('${1}', '1'), function() {
                linkman_name1.focus();
            });
            return false;
        }
        if (data.contactInfo[0].phone == "") {
            $.alert(msg.relationPhone.empty.replace('${1}', '1'), function() {
                linkman_phone1.focus();
            });
            return false;
        }
        if (!verifyMobile(data.contactInfo[0].phone)) {
            $.alert(msg.relationPhone.error.replace('${1}', '1'), function() {
                linkman_phone1.focus();
            });
            return false;
        }

        //紧急联系人2
        if (data.contactInfo[1].relationType == 0 && data.contactInfo[1].name == "" && data.contactInfo[1].phone == "") {
            $.alert(msg.relation.error.replace('${1}', '2'));
            return false;
        }
        if (data.contactInfo[1].name == "") {
            $.alert(msg.relationName.empty.replace('${1}', '2'), function() {
                linkman_name2.focus();
            });
            return false;
        };
        if (!checkRealname2(data.contactInfo[1].name)) {
            $.alert(msg.relationName.error.replace('${1}', '2'), function() {
                linkman_name2.focus();
            });
            return false;
        };
        if (data.contactInfo[1].phone == "") {
            $.alert(msg.relationPhone.empty.replace('${1}', '2'), function() {
                linkman_phone2.focus();
            });
            return false;
        }
        if (!verifyMobile(data.contactInfo[0].phone)) {
            $.alert(msg.relationPhone.error.replace('${1}', '2'), function() {
                linkman_phone2.focus();
            });
            return false;
        }

        // if (data.contactInfo[1].relationType == 0 && || data.contactInfo[1].name == "" || data.contactInfo[1].phone == "") {
        //     if (data.contactInfo[1].relationType == 0) {
        //         $.alert(msg.relation.error.replace('${1}', '2'));
        //         return false;
        //     };
        //     if (data.contactInfo[1].name == "") {
        //         $.alert(msg.relationName.empty.replace('${1}', '2'), function() {
        //             linkman_name2.focus();
        //         });
        //         return false;
        //     };
        //     if (!checkRealname2(data.contactInfo[1].name)) {
        //         $.alert(msg.relationName.error.replace('${1}', '2'), function() {
        //             linkman_name2.focus();
        //         });
        //         return false;
        //     };
        //     if (data.contactInfo[1].phone == "") {
        //         $.alert(msg.relationPhone.empty.replace('${1}', '2'), function() {
        //             linkman_phone2.focus();
        //         });
        //         return false;
        //     }
        //     if (!verifyMobile(data.contactInfo[0].phone)) {
        //         $.alert(msg.relationPhone.error.replace('${1}', '2'), function() {
        //             linkman_phone2.focus();
        //         });
        //         return false;
        //     }

        //     // if (data.contactInfo[0].relationType == data.contactInfo[1].relationType || data.contactInfo[0].name == data.contactInfo[1].name || data.contactInfo[0].phone == data.contactInfo[1].name) {
        //     //  $.alert('紧急联系人有重复信息，请正确填写！');
        //     // }

        // }
        //紧急联系人3
        if (data.contactInfo[2].relationType == 0 && data.contactInfo[2].name == "" && data.contactInfo[2].phone == "") {
            $.alert(msg.relation.error.replace('${1}', '3'));
            return false;
        };
        if (data.contactInfo[2].relationType == 0) {
            $.alert(msg.relation.error.replace('${1}', '3'));
            return false;
        };
        if (data.contactInfo[2].name == "") {
            $.alert(msg.relationName.empty.replace('${1}', '3'), function() {
                linkman_name3.focus();
            });
            return false;
        };
        if (!checkRealname2(data.contactInfo[2].name)) {
            $.alert(msg.relationName.error.replace('${1}', '3'), function() {
                linkman_name3.focus();
            });
            return false;
        };
        if (data.contactInfo[2].phone == "") {
            $.alert(msg.relationPhone.empty.replace('${1}', '3'), function() {
                linkman_phone3.focus();
            });
            return false;
        }
        if (!verifyMobile(data.contactInfo[2].phone)) {
            $.alert(msg.relationPhone.error.replace('${1}', '3'), function() {
                linkman_phone3.focus();
            });
            return false;
        }
        /*if (data.contactInfo[2].relationType == 0 || data.contactInfo[2].name == "" || data.contactInfo[2].phone == "") {
            if (data.contactInfo[2].relationType == 0) {
                $.alert(msg.relation.error.replace('${1}', '3'));
                return false;
            };
            if (data.contactInfo[2].name == "") {
                $.alert(msg.relationName.empty.replace('${1}', '3'), function() {
                    linkman_name3.focus();
                });
                return false;
            };
            if (!checkRealname2(data.contactInfo[2].name)) {
                $.alert(msg.relationName.error.replace('${1}', '3'), function() {
                    linkman_name3.focus();
                });
                return false;
            };
            if (data.contactInfo[2].phone == "") {
                $.alert(msg.relationPhone.empty.replace('${1}', '3'), function() {
                    linkman_phone3.focus();
                });
                return false;
            }
            if (!verifyMobile(data.contactInfo[2].phone)) {
                $.alert(msg.relationPhone.error.replace('${1}', '3'), function() {
                    linkman_phone3.focus();
                });
                return false;
            }
        }*/

        //验证不能存在相同紧急联系人
        if (data.contactInfo[0].name == data.contactInfo[1].name || data.contactInfo[1].name == data.contactInfo[2].name || data.contactInfo[0].name == data.contactInfo[2].name || data.contactInfo[0].phone == data.contactInfo[1].phone || data.contactInfo[0].phone == data.contactInfo[2].phone || data.contactInfo[1].phone == data.contactInfo[2].phone) {
            $.alert('紧急联系人存在相同的联系人信息，请修改！',
                function() {
                    linkman_phone3.focus();
                });
            return false;
        }

        return true;

    },
    /**
     * [checkOtherInfo 校验更多信息填写情况]
     * @param  {[object]} data [表单数据]
     * @return {[boolean]}      [description]
     */
    checkOtherInfo: function(data) {

        if (data.workInfo.workName == "") {
            $.alert(msg.companyName.empty, function() {
                companyName.focus();
            });
            return false;
        };

        if (data.workInfo.workAddr.province == "") {
            $.alert(msg.companyAddres1.empty);
            return false;
        };

        //校验公司电话
        if(data.workInfo.companyPhone == '') {

            $.alert(msg.companyPhone.empty, function() {

                companyPhone.focus();
            });
            return false;
        }

        if(!/([0-9]{3,4}-)?[0-9]{7,8}/.test(data.workInfo.companyPhone)) {

            $.alert(msg.companyPhone.error, function() {

                companyPhone.focus();
            })
            return false;
        }

        if (data.workInfo.specificAddr == "") {
            $.alert(msg.companyAddres2.empty, function() {
                companyAddres.focus();
            });
            return false;
        };
        if (data.workInfo.companyType == "0") {
            $.alert(msg.companyType.empty);
            return false;
        };
        if (data.workInfo.liveTime == "") {
            $.alert(msg.companyLiveTime.empty);
            return false;
        };
        if (data.workInfo.profession == "0") {
            $.alert(msg.companyJobPost.empty);
            return false;
        };
        if (data.workInfo.education == "0") {
            $.alert(msg.education.empty);
            return false;
        };
        if (data.residentInfo.liveAddr.province == "") {
            $.alert(msg.resideAddres1.empty);
            return false;
        };
        if (data.residentInfo.specificAddr == "") {
            $.alert(msg.resideAddres2.empty, function() {
                homeAddress.focus();
            });
            return false;
        };
        if (data.residentInfo.liveTime == "") {
            $.alert(msg.resideLiveTime.empty);
            return false;
        };
        if (data.lifeInfo.merriage == "0") {
            $.alert(msg.marriage.empty);
            return false;
        } else if (data.lifeInfo.merriage == "2" || data.lifeInfo.merriage == "3") {
            if (data.lifeInfo.spouse == "0") {
                $.alert(msg.spouse.empty);
                return false;
            }
        };
        if (data.lifeInfo.household == "0") {
            $.alert(msg.registered.empty);
            return false;
        };
        return true;
    }
}


/* -------- error msg --------- */
var msg = {
    userName: {
        empty: '您还没有填写真实姓名！',
        error: '请输入正确的真实姓名哦！'
    },
    idNum: {
        empty: '您还没有填写身份证号！',
        error: '请输入正确的身份证号哦！'
    },
    idAddress: {
        empty: '您还没有填写身份证地址',
        error: '请输入正确的身份证地址哦！'
    },
    cardNum: {
        empty: '您还没有填写银行卡号！',
        error: '请输入正确的银行卡哦！'
    },
    mobile: {
        pwdEmpty: '请输入正确手机服务密码哦！'
    },
    relation: {
        error: '请完善紧急联系人${1}的信息！'
    },
    relationName: {
        empty: '请输入紧急联系人${1}姓名！',
        error: '请输入正确的紧急联系人${1}真实姓名哦！'
    },
    relationPhone: {
        empty: '请输入紧急联系人${1}手机号！',
        error: '请输入正确的紧急联系人${1}手机号码哦！'
    },
    companyName: {
        empty: '请输入公司名称！'
    },
    companyPhone: {
        empty: '请输入公司电话',
        error: '请输入正确的公司电话!'
    },
    companyAddres1: {
        empty: '请选择公司所在地区！'
    },
    companyAddres2: {
        empty: '请输入公司详细地址！'
    },
    companyType: {
        empty: '请选择单位性质！'
    },
    companyLiveTime: {
        empty: '请选择何时入职！'
    },
    companyJobPost: {
        empty: '请选择所任职位！'
    },
    education: {
        empty: '请选择学历情况！'
    },
    resideAddres1: {
        empty: '请选择居住地址！'
    },
    resideAddres2: {
        empty: '请输入居住详细地址！'
    },
    resideLiveTime: {
        empty: '请选择何时在此居住！'
    },
    marriage: {
        empty: '请选择婚姻状况！'
    },
    spouse: {
        empty: '请选择配偶身份！'
    },
    registered: {
        empty: '请选择户口信息！'
    }
};

//地区和日期选择器
$("#citypickerworkads,#citypickerliveads").cityPicker({
    toolbarTemplate: '<header class="bar bar-nav">\
    <button class="button button-link pull-right close-picker">确定</button>\
    <h1 class="title">选择地区</h1>\
    </header>'
});
$("#workdatainput,#homeLiveTime").picker({
    toolbarTemplate: '<header class="bar bar-nav">\
  <button class="button button-link pull-right close-picker">确定</button>\
  <h1 class="title">请选择时间</h1>\
  </header>',
    cols: [{
        textAlign: 'center',
        values: ['2017年', '2016年', '2015年', '2014年', '2013年', '2012年', '2011年', '2010年', '2009年', '2008年', '2007年', '2006年', '2005年', '2004年', '2003年', '2002年', '2001年', '2000年', '1999年', '1998年', '1997年', '1996年', '1995年', '1994年', '1993年', '1992年', '1991年', '1990年', '1989年', '1988年', '1987年'],
    }, {
        textAlign: 'center',
        values: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    }]
});
//弹出工作性质选择器
$(document).on('click', '.create-worknature', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '政府机关',
        onClick: function() {
            worknature.value = 1;
            $('.create-worknature').html('政府机关');
        }
    }, {
        text: '事业单位',
        onClick: function() {
            worknature.value = 2;
            $('.create-worknature').html('事业单位');
        }
    }, {
        text: '国有企业',
        onClick: function() {
            worknature.value = 3;
            $('.create-worknature').html('国有企业');
        }
    }, {
        text: '外资或合资',
        onClick: function() {
            worknature.value = 4;
            $('.create-worknature').html('外资或合资');
        }
    }, {
        text: '私营企业',
        onClick: function() {
            worknature.value = 5;
            $('.create-worknature').html('私营企业');
        }
    }, {
        text: '其他',
        onClick: function() {
            worknature.value = 6;
            $('.create-worknature').html('其他');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});
//弹出职位选择器
$(document).on('click', '.create-worklevel', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '员工',
        onClick: function() {
            worklevel.value = 1;
            $('.create-worklevel').html('员工');
        }
    }, {
        text: '基层管理人员',
        onClick: function() {
            worklevel.value = 2;
            $('.create-worklevel').html('基层管理人员');
        }
    }, {
        text: '中层管理人员或同级',
        onClick: function() {
            worklevel.value = 3;
            $('.create-worklevel').html('中层管理人员或同级');
        }
    }, {
        text: '高层管理人员或同级',
        onClick: function() {
            worklevel.value = 4;
            $('.create-worklevel').html('高层管理人员或同级');
        }
    }, {
        text: '自雇人士－私营或个体',
        onClick: function() {
            worklevel.value = 5;
            $('.create-worklevel').html('自雇人士－私营或个体');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});
//弹出学历选择器
$(document).on('click', '.create-education', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '中专、高中及以下',
        onClick: function() {
            education.value = 1;
            $('.create-education').html('中专、高中及以下');
        }
    }, {
        text: '大专',
        onClick: function() {
            education.value = 2;
            $('.create-education').html('大专');
        }
    }, {
        text: '本科',
        onClick: function() {
            education.value = 3;
            $('.create-education').html('本科');
        }
    }, {
        text: '研究生及以上',
        onClick: function() {
            education.value = 4;
            $('.create-education').html('研究生及以上');
        }
    }, {
        text: '其他',
        onClick: function() {
            education.value = 5;
            $('.create-education').html('其他');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});

//弹出婚姻选择器
$(document).on('click', '.create-marred', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '未婚',
        onClick: function() {
            marital.value = 1;
            $('.create-marred').html('未婚');
            spouseitem.setAttribute("class", "item-link hide");
        }
    }, {
        text: '已婚－无子女',
        onClick: function() {
            marital.value = 2;
            $('.create-marred').html('已婚－无子女');
            spouseitem.setAttribute("class", "item-link");
        }
    }, {
        text: '已婚－有子女',
        onClick: function() {
            marital.value = 3;
            $('.create-marred').html('已婚－有子女');
            spouseitem.setAttribute("class", "item-link");
        }
    }, {
        text: '离异',
        onClick: function() {
            marital.value = 4;
            $('.create-marred').html('离异');
            spouseitem.setAttribute("class", "item-link hide");
        }
    }, {
        text: '丧偶',
        onClick: function() {
            marital.value = 5;
            $('.create-marred').html('丧偶');
            spouseitem.setAttribute("class", "item-link hide");
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});
//弹出配偶选择器
$(document).on('click', '.create-spouse', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '上班族',
        onClick: function() {
            spouse.value = 1;
            $('.create-spouse').html('上班族');
        }
    }, {
        text: '全职太太（或先生）',
        onClick: function() {
            spouse.value = 2;
            $('.create-spouse').html('全职太太（或先生）');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});
//弹出户口选择器
$(document).on('click', '.create-household', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '有本地户口',
        onClick: function() {
            household.value = 1;
            $('.create-household').html('有本地户口');
        }
    }, {
        text: '无本地户口',
        onClick: function() {
            household.value = 2;
            $('.create-household').html('无本地户口');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});
//弹出紧急联系人选择器
$(document).on('click', '.create-contactre1', function() {
    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '配偶',
        onClick: function() {
            linkmanSelect1.value = 1;
            $('.create-contactre1').html('配偶');
        }
    }, {
        text: '父母',
        onClick: function() {
            linkmanSelect1.value = 2;
            $('.create-contactre1').html('父母');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});

//弹出紧急联系人选择器
$(document).on('click', '.create-contactre2', function() {
    var sNo = linkmanSelect1.value;
    var buttback = [{
        text: '请选择',
        label: true
    }, {
        text: '配偶',
        onClick: function() {
            linkmanSelect2.value = 1;
            $('.create-contactre2').html('配偶');
        }
    }, {
        text: '父母',
        onClick: function() {
            linkmanSelect2.value = 2;
            $('.create-contactre2').html('父母');
        }
    }];
    var buttons1 = [{
        text: '兄弟姐妹',
        onClick: function() {
            linkmanSelect2.value = 4;
            $('.create-contactre2').html('兄弟姐妹');
        }
    }, {
        text: '朋友',
        onClick: function() {
            linkmanSelect2.value = 6;
            $('.create-contactre2').html('朋友');
        }
    }];
    if (sNo == 1) {
        buttons1.unshift(buttback[0], buttback[2])
    } else if (sNo == 2) {
        buttons1.unshift(buttback[0], buttback[1])
    } else {
        buttons1.unshift(buttback[0], buttback[1], buttback[2])
    };

    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});

//弹出紧急联系人选择器
$(document).on('click', '.create-contactre3', function() {

    var buttons1 = [{
        text: '请选择',
        label: true
    }, {
        text: '兄弟姐妹',
        onClick: function() {
            linkmanSelect3.value = 4;
            $('.create-contactre3').html('兄弟姐妹');
        }
    }, {
        text: '朋友',
        onClick: function() {
            linkmanSelect3.value = 6;
            $('.create-contactre3').html('朋友');
        }
    }, {
        text: '同事',
        onClick: function() {
            linkmanSelect3.value = 7;
            $('.create-contactre3').html('同事');
        }
    }];
    var buttons2 = [{
        text: '取消',
        bg: 'danger'
    }];
    var groups = [buttons1, buttons2];
    $.actions(groups);
});

//及时雨帮助按钮
actualCashHelp.onclick = function() {
    $.alert("为了方便结算，我们提前为您结清了手续费，您到还款日须全额归还本金。");
}

function aa() {
    debug('aa');
}
