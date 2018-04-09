//自动运行类
//加载时判断是否为微信浏览器<>
var page = {};
var flowPageUrl = "https://app.credan.com/v1.5.1/coop.html?merchantId=18fd13cc9aa611e6afb66c92bf314c17";



$(function() {
    if (window.name != "") { // 直接进来才是空的
        // $.popup(".popup-resultwithbigNotok")
        $.router.load("#wbregpage");
        // $.router.load("#selectPD");
    }
    window.name = "test";
    window.sessionStorage.userId = ""; //USER_ID
    window.sessionStorage.userCashId = ""; //现金贷ID
    window.sessionStorage.cashStatus = ""; //闪电贷状态
    window.sessionStorage.cashStatusBit = ""; //现金贷状态
    window.sessionStorage.ruinCashStatus = ""; //及时雨状态
    window.sessionStorage.raiseCashStatus = ""; //提额状态
    window.sessionStorage.cashInstallment = ""; //现金分期状态
    window.sessionStorage.merchantid = "";
    window.sessionStorage.selectproduct = "";
    window.sessionStorage.isquota = "";
    window.sessionStorage.refreshPD = "";
    window.sessionStorage.authorization = "";
    window.sessionStorage.hdId = "";
    window.sessionStorage.hd10001 = ""; //活动1是否开启
    window.sessionStorage.hd10002 = ""; //活动2是否开启
    window.sessionStorage.hd10001Auth = ""; //活动1权限
    window.sessionStorage.hd10002Auth = ""; //活动2权限
    window.sessionStorage.flashid = "2";
    window.sessionStorage.phonePass = "1"; //判断是否为北上广的一些号段
    window.sessionStorage.phonePassMsg = ""; //提示
    window.sessionStorage.roll="0";//是否滚动显示产品
    //window.sessionStorage.hdNewUser="0";
    //window.sessionStorage.activityIsOpen = "0";
    var href = window.location.search;
    getAmerchantid(href)
    var JSY = new timely();
    JSY.init();
    $.init();

});

//通讯通用类
//构建一个XMLHttpRequest
function getXMLHttpRequest() {
    var xmlHttpReq = false;
    // to create XMLHttpRequest object in non-Microsoft browsers
    if (window.XMLHttpRequest) {
        xmlHttpReq = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
        try {
            // to create XMLHttpRequest object in later versions
            // of Internet Explorer
            xmlHttpReq = new ActiveXObject("Msxml2.XMLHTTP");
        } catch (exp1) {
            try {
                // to create XMLHttpRequest object in older versions
                // of Internet Explorer
                xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
            } catch (exp2) {
                xmlHttpReq = false;
            }
        }
    }
    return xmlHttpReq;
}
//构建一个XML私有Call公有部分
function makeRequest(XMLHttpRequest, url, datastr) {
    XMLHttpRequest.open("POST", url, true);
    XMLHttpRequest.setRequestHeader("Content-Type", "application/json");
    //datastr.authorization = window.sessionStorage.authorization;
    //  datastr.authorization = "201612071709132019850c836a4ac89389b4d2bbbc71b5";
    XMLHttpRequest.send(JSON.stringify(datastr));
}
//构建一个XML公有Call并处理结果
function makeAcall(url, datastr) {
    if (datastr.islastone == "1") {
        $.showPreloader('该过程需要几分钟的时间，如退出或重复提交会导致审核失败');
    } else {
        $.showPreloader('请稍候');
    }
    var XMLHttpRequest = getXMLHttpRequest();
    makeRequest(XMLHttpRequest, url, datastr);
    XMLHttpRequest.onreadystatechange = function() {
        if (XMLHttpRequest.readyState == 4) {
            if (XMLHttpRequest.status == 200) {

                var cdResult = JSON.parse(XMLHttpRequest.responseText);
                if (cdResult.statusCode == 10002) {
                    var databag = JSON.parse(cdResult.data);
                    if (databag.userStatus == "REJECT") {

                        loginJudge();
                        /*$.alert("该手机号已经被快乐达拒绝过，不能再申请快乐达服务。", function() {
                            window.location.href = "about:blank";
                            window.open("", "_self");
                            window.opener = null;
                            window.close();
                            WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                        });*/
                    } else {
                        $.alert(cdResult.message);
                    }
                } else if (cdResult.statusCode == 10001) {
                    window.sessionStorage.phcdgo = 10001;

                } else if (cdResult.statusCode == 10010) { //注册成功

                    utils.bdTrack("上游-总登录数",'click',window.sessionStorage.merchantid);
                    // if(cdResult.isNewUser){
                    //     outCount('大号外新用户登录数-v2');
                    // }else{
                    //     outCount('大号外老用户登录数-v2');
                    // }


                    var databag = JSON.parse(cdResult.data);
                    // window.sessionStorage.authorization = databag.authorization;
                    window.sessionStorage.userId = databag.userId; //USER_ID
                    window.sessionStorage.userCashId = databag.userCashId; //现金贷ID
                    window.sessionStorage.cashStatus = databag.cashStatus; //闪电贷状态
                    window.sessionStorage.cashStatusBit = databag.cashStatusBit; //现金贷状态
                    window.sessionStorage.ruinCashStatus = databag.ruinCashStatus; //及时雨状态
                    window.sessionStorage.raiseCashStatus = databag.raiseCashStatus; //提额状态
                    window.sessionStorage.cashInstallment = databag.cashPeriodizationStatus; //现金分期状态

                    window.sessionStorage.sassStatus = databag.sassStatus; //其他sass客户产品的状态

                    //活动配置
                    if (databag.userActivitys == undefined) {
                        $.alert("没传活动参数，跳过");
                    } else {
                        for (var i = 0; i < databag.userActivitys.length; i++) {
                            if (databag.userActivitys[i].id == 10001) {
                                window.sessionStorage.hd10001 = "1";
                                window.sessionStorage.hd10001Auth = databag.userActivitys[i].status;
                            } else if (databag.userActivitys[i].id == 10002) {
                                window.sessionStorage.hd10002 = "1";
                                window.sessionStorage.hd10002Auth = databag.userActivitys[i].status;
                            }
                        }
                    }

                    //[
                    //{id:10001,status:1},
                    //{id:10002,status:1}
                    //]
                    //window.sessionStorage.userActivitys = databag.userActivitys;//是否为活动新用户
                    //window.sessionStorage.activityIsOpen = databag.status; //活动是否开启
                    basicPhoneNum.value = phoneNum.value;

                    loginJudge();
                    afterLogin(databag);
                } else if (cdResult.statusCode == 10011) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 10014) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 10015) {
                    if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                        $.router.load("#watingRST");
                    } else {
                        $.router.load("#watingRSTwithoutbigNo");
                    }
                    window.sessionStorage.refreshPD = "flash";

                    // utils.addEvent('审核-' + window.productName);
                } else if (cdResult.statusCode == 10016) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 10017) {

                    if (cdResult.data.userStatus == 7025) {
                        if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) { //大号

                            localCoop();

                            // utils.addEvent('钞好用－公众号进入审核失败页');
                            //$.popup('.popup-resultwithbigNotok');
                        } else {

                            popupCoop();

                            // utils.addEvent('钞好用－渠道进入审核失败页');
                            // $.router.load("#watingRSTwithoutbigNonot");
                        }

                        // utils.addEvent('审核失败-' + window.productName);
                    } else if (cdResult.data.userStatus == 7024) {
                        if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                            $.popup('.popup-resultwithbigOk');
                        } else {
                            $.router.load("#watingRSTwithoutbigNoOk");
                        }
                    } else if (cdResult.data.userStatus == 7023) {

                    } else {

                    }
                } else if (cdResult.statusCode == 1060) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 10105) {
                    $.alert(cdResult.msg, function() {
                        window.location.href = "about:blank";
                        window.open("", "_self");
                        window.opener = null;
                        window.close();
                        WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                    });
                } else {
                    $.alert(cdResult.message);
                }
                $.hidePreloader();
            } else {
                //                  $.alert("HTTP error" + XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                $.alert("系统有点忙哦，请稍等片刻");
                $.hidePreloader();
            }
        }
    }
}


function afterLogin(data) {

    var channelUid = window.sessionStorage.channelUid === 'null' ? data.userId : window.sessionStorage.channelUid;

    var params = {

        channelSid: window.sessionStorage.merchantid,
        channelUid: channelUid,
        userSid: data.userId
    }

    utils.fetch({

        url: javahostv3 + 'channelUser/afterLogin',
        data: JSON.stringify(params),
        dataType: 'json',
        success: function() {

        },
    })
}
//构建一个公用静默call
function makeAsilencecall(url, datastr) {
    var XMLHttpRequest = getXMLHttpRequest();
    makeRequest(XMLHttpRequest, url, datastr);
    XMLHttpRequest.onreadystatechange = function() {
        if (XMLHttpRequest.readyState == 4) {
            if (XMLHttpRequest.status == 200) {

                var cdResult = JSON.parse(XMLHttpRequest.responseText);
                if (cdResult.statusCode == 200) {
                    if (cdResult.success == false) {
                        $.alert('请求商户非法！', function() {
                            window.location.href = "about:blank";
                            window.open("", "_self");
                            window.opener = null;
                            window.close();
                            WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                        });
                    }
                } else {
                    $.alert(cdResult.message);
                }

            } else {
                //              $.alert("HTTP error" + XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                $.alert("系统有点忙哦，请稍等片刻");
            }
        }
    }
}
//构建一个授权call并处理结果
function makevestcall(url, datastr, callback, module) {
    $.showPreloader('请稍候');
    var XMLHttpRequest = getXMLHttpRequest();
    makeRequest(XMLHttpRequest, url, datastr);
    XMLHttpRequest.onreadystatechange = function() {
        if (XMLHttpRequest.readyState == 4) {
            if (XMLHttpRequest.status == 200) {
                var cdResult = JSON.parse(XMLHttpRequest.responseText);
                //处理计算分期值的call结果
                //                  cdUserid = cdResult.data.userId;
                if (cdResult.statusCode == 200) {
                    var vestdata = cdResult.data;
                    handlevestData(vestdata, callback, module);
                } else if (cdResult.statusCode == 210101 || cdResult.statusCode == 211101) {
                    $.alert("请输入正确的验证码哦");
                } else if (cdResult.statusCode == 506027) {
                    $.alert("短信验证码超时，请点击下一步重新授权");
                } else if (cdResult.statusCode == 506004 || cdResult.statusCode == 506021) {
                    $.alert("未能成功拉取登录需要的验证码，请重新尝试");
                } else if (cdResult.statusCode == 506014 || cdResult.statusCode == 506003 || cdResult.statusCode == 506005 || cdResult.statusCode == 506026) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 506006 || cdResult.statusCode == 506017 || cdResult.statusCode == 506019 || cdResult.statusCode == 506009 || cdResult.statusCode == 506025 || cdResult.statusCode == 506012) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 506102 || cdResult.statusCode == 208101 || cdResult.statusCode == 506010 || cdResult.statusCode == 506018) {
                    $.alert(cdResult.message, function() {
                        vestphonePswd.focus();
                    });
                } else if (cdResult.statusCode == 506100 || cdResult.statusCode == 506101) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 506007 || cdResult.statusCode == 506008 || cdResult.statusCode == 506011 || cdResult.statusCode == 506013 || cdResult.statusCode == 506015 || cdResult.statusCode == 506016 || cdResult.statusCode == 506020 || cdResult.statusCode == 506201) {
                    $.alert(cdResult.message);
                } else if (cdResult.statusCode == 4000) {
                    $.alert("系统有点忙哦，请稍等片刻");
                } else if (cdResult.statusCode == 1010) {
                    if (module == "timely") {
                        $.closeModal(".popup-mobile");
                        $(mobileVerify).find(".icon-f2").addClass("icon-f2-pass");
                        $(mobileVerify).find(".item-after").addClass("fc1").html("已验证");
                        if (callback) callback();
                    } else {
                        submitflashCredit();
                    }
                } else {
                    $.alert(cdResult.message);
                }
                $.hidePreloader();
            } else {
                //                      $.alert("HTTP error" + XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                $.alert("系统有点忙哦，请稍等片刻");
                $.hidePreloader();

            }
        }
    }
}
//构建一个刷新验证码call并处理结果
function makerefreshcall(url, datastr) {
    var XMLHttpRequest = getXMLHttpRequest();
    makeRequest(XMLHttpRequest, url, datastr);
    XMLHttpRequest.onreadystatechange = function() {
        if (XMLHttpRequest.readyState == 4) {
            if (XMLHttpRequest.status == 200) {
                var cdResult = JSON.parse(XMLHttpRequest.responseText);
                //处理计算分期值的call结果
                //                  cdUserid = cdResult.data.userId;
                if (cdResult.statusCode == 200) {
                    var refreshdata = cdResult.data;
                    refreshData(refreshdata);
                }

            } else {
                //                      $.alert("HTTP error" + XMLHttpRequest.status + ": " + XMLHttpRequest.statusText);
                $.alert("系统有点忙哦，请稍等片刻");
            }
        }
    }
}


function refreshData(refreshdata) {
    picCode.src = 'data:image/jpg;base64,' + refreshdata;
}

function handlevestData(vestdata, callback, module) {
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
                        var checkphonepicMsg = { "userId": window.sessionStorage.userId, param: { pic_code: value }, "hidden": vestdata.hidden, "method": vestdata.method };
                        var checkphonepicUrl = javahost + "user/collection/mobile/submit";
                        makevestcall(checkphonepicUrl, checkphonepicMsg, callback, module);
                    }
                }, ]
            })
            reloadPiccode.style.height = picCode.style.height;
            reloadPiccode.style.lineHeight = picCode.style.height;
            reloadPiccode.addEventListener("click", function() {
                var refreshMsg = { "userId": window.sessionStorage.userId, "hidden": vestdata.hidden, "param": vestdata.param[0].refresh_param, "method": vestdata.param[0].refresh_method };
                var refreshUrl = javahost + "user/collection/mobile/refresh";
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
                        checkphonepicMsg.userId = window.sessionStorage.userId;
                        var checkphonepicUrl = javahost + "user/collection/mobile/submit";
                        makevestcall(checkphonepicUrl, checkphonepicMsg, callback, module);
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
                        checkphonetwoMsg.userId = window.sessionStorage.userId;
                        var checkphonetwoUrl = javahost + "user/collection/mobile/submit";
                        makevestcall(checkphonetwoUrl, checkphonetwoMsg, callback, module);
                    }
                }, ]
            })
        }
    } else if (vestdata.param.length == 3) {
        alert("需要填写身份证号和真实姓名登录！");
    }
}
//发起call类
//CALL接口获取验证码并在60秒内不可再次点击
var handlerPopup = function(captchaObj) {
    captchaObj.onReady(function() {
        captchaObj.show();
    });
    // 成功的回调
    captchaObj.onSuccess(function() {
        var validate = captchaObj.getValidate();
        $.ajax({
            url: javahost2 + "wx/enrollSendCode", // 进行二次验证
            type: "post",
            dataType: "json",
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify({
                phone: $('#phoneNum').val(),
                geetest_challenge: validate.geetest_challenge,
                geetest_validate: validate.geetest_validate,
                geetest_seccode: validate.geetest_seccode
            }),
            success: function(data) {
                if (data.statusCode == 10001) {
                    window.sessionStorage.phcdgo = 10001;
                    $.alert("发送成功！");
                    utils.bdTrack("上游-验证码发送成功总量",'click',window.sessionStorage.merchantid);
                } else {
                    if (data.statusCode == 10002) {
                        popupCoop();
                        // if (data.data.userStatus == "REJECT") {
                        //     $.alert("该手机号已经被快乐达拒绝过，不能再申请快乐达服务。", function() {
                        //         window.location.href = "about:blank";
                        //         window.open("", "_self");
                        //         window.opener = null;
                        //         window.close();
                        //         WeixinJSBridge.call('closeWindow'); //关闭微信浏览器;
                        //     });
                        // } else {
                        //     $.alert(data.message);
                        // }
                    }
                }

            }
        });
    });

    // 将验证码加到id为captcha的元素里
    captchaObj.appendTo("#popup-captcha");
    // 更多接口参考：http://www.geetest.com/install/sections/idx-client-sdk.html
};

$("#getPhcodebtn").click(function() {

    var checkresult = checkPhonenum(phoneNum);

    if (checkresult == true) {
        sendCode(this);

        // if (productName === 'nadianhua') {

        //     var params = {
        //         firmId: 108,
        //         phone: $('#phoneNum').val()
        //     }

        //     utils.fetch({

        //         url: javahost2 + 'v16/firm/whiteList',
        //         data: JSON.stringify(params),
        //         success: function(data) {

        //             if (!data.data) {

        //                 window.sessionStorage.notWriteUser = true;
        //             }

        //         }
        //     })

        // }

        sendCodeAction();

    }
});


function sendCodeAction() {

    sendCodeGo();
    getProList(window.sessionStorage.roll);
    // var _that = this;
    //先判断地区
    // $.ajax({
    //     url: 'https://tcc.taobao.com/cc/json/mobile_tel_segment.htm?tel=' + phoneNum.value,
    //     type: "get",
    //     dataType: "jsonp",
    //     contentType: 'application/json; charset=utf-8',
    //     success: function(ret) {
    //         var k = "1";
    //         var cityname = "";
    //         if (ret.province == "广东") {
    //             if (ret.catName.indexOf("移动") >= 0) {
    //                 k = "0";
    //                 cityname = "广东移动";
    //                 // $.alert("您是广东移动用户，暂时不能申请，如果您申请过"+proTitle+"，点击“提现还款”可登录帐户中心。");
    //             }
    //         } else if (ret.province == "北京") {
    //             if (ret.catName.indexOf("电信") >= 0) {
    //                 k = "0";
    //                 cityname = "北京电信";
    //                 // window.sessionStorage.phonePass="0";
    //                 // $.alert("您是北京电信用户，暂时不能申请，如果您申请过"+proTitle+"，点击“提现还款”可登录帐户中心。");
    //             }
    //         } else if (ret.province == "陕西") {
    //             if (ret.catName.indexOf("电信") >= 0) {
    //                 k = "0";
    //                 cityname = "陕西电信";
    //                 // window.sessionStorage.phonePass="0";
    //                 // $.alert("您是陕西电信用户，暂时不能申请，如果您申请过"+proTitle+"，点击“提现还款”可登录帐户中心。");
    //             }
    //         }
    //         window.sessionStorage.phonePass = k;
    //         window.sessionStorage.phonePassMsg = "您是" + cityname + "用户，暂时不能申请，如果您申请过" + proTitle + "，点击“提现还款”可登录帐户中心。";
    //     }
    // });
}


function sendCodeGo() {

    // 验证开始需要向网站主后台获取id，challenge，success（是否启用failback）
    $.ajax({
        url: javahost2 + "wx/smsCaptcha",
        type: "post",
        dataType: "json",
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({
            phone: $('#phoneNum').val(),
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
}

$(document).on('click', '#showAddressDesc', function() {

    $.modal({

        title: '提示',
        text: $('.user-addr-desc-wrapper').html(),
        buttons: [{
            text: '知道了'
        }]
    })
})

function sendCode(thisBtn) {
    thisBtn.setAttribute("disabled", "true");
    thisBtn.style.background = "#bababa";
    thisBtn.style.color = "#fff";
    thisBtn.value = reclickTime + "秒后重获";
    resetButton = setInterval(doLoop, 1000, thisBtn);
}

function doLoop(thisBtn) {
    reclickTime--;
    if (reclickTime > 0) {
        thisBtn.value = reclickTime + "秒后重获";
    } else {
        clearInterval(resetButton);
        thisBtn.disabled = false;
        thisBtn.style.background = "#fff";
        thisBtn.style.color = "#36b046";
        thisBtn.value = "点击获取";
        reclickTime = 60;
    }
}

function getLink(link) {

    var host = location.host,
        domain;

    if (host.indexOf('app') > -1) {

        domain = 'http://app.credan.com/';
    } else {

        domain = 'http://uctest.credan.com/';
    }

    return domain + link;

}

//注册时的手机验证
regandloginbtn.onclick = function() {

    if (this.disabled) {

        return;
    }

    if (window.sessionStorage.notWriteUser == 'true') {


        window.location.href = getLink('cs/jinjian/?merchantId=18fd13cc9aa611e6afb66c92bf314c17&invitCode=000000&selectPd=0&End#selectPD');
        return;
    }

    //判断是否限制地区
    // if (window.sessionStorage.phonePass == "0") {
    //     $.alert(window.sessionStorage.phonePassMsg);
    //     return;
    // }

    var checkresult = checkPhonenum(phoneNum);
    if (checkresult == true) {
        if (enterPhcode !== "") {
            if (iAgreementthis.checked == false) {
                $.alert('请先勾选注册协议哦');
            } else {
                var midArr = [
                    'de2712d2398944c5afe397bd420abe99',
                    '39458bc5c5804568acebdcd1bf1f892e',
                    'cce41c30abb44ebc8fac72e653c4414e',
                    '4e34632fc9e141d095f12ff45df614c5',
                    'c3558723d4564469af77564321a73988',
                    '306d6671db704a19a9b59c94171a15cb',
                    '5efae9a08679490ea175f61809648ec6',
                    'ab939aa0154340dc93cc3912af071628',
                    'b29f8f96d9cd4091b087dd8d9d5c67e8',
                    'ead19871b8034e63b514384187695c37',
                    '18fd13cc9aa611e6afb66c92bf314c17',
                ];

                //限制大号外不允许注册
                if(midArr.indexOf(window.sessionStorage.merchantid)==-1){
                    return;
                }
                var verifyMsg = {
                    "activityCode": sessionStorage.hdId,
                    "code": enterPhcode.value,
                    "sessionId": sessionId,
                    "recommendedCode": invitInput.value,
                    "phone": phoneNum.value,
                    "merchantId": window.sessionStorage.merchantid,
                    "channelId": window.sessionStorage.channelId,
                    "channelUid": window.sessionStorage.channelUid,
                    "productId": window.sessionStorage.flashid
                };
                var verifyUrl = javahost2 + "wx/userEnrollCode";
                makeAcall(verifyUrl, verifyMsg);
                // utils.addEvent('登录页-登录');
            }
        } else {
            $.alert("请输入正确的验证码哦！", function() {
                enterPhcode.focus();
            });
        }
    } else {
        return;
    }

    setbtncantclick(this);

}
flashcreditGo.onclick = function() {

    if (this.disabled) {

        return;
    }

    var realNamecheckresult = checkRealname(humanName);
    if (realNamecheckresult == true) {
        var checkIdcardresult = checkIdcard(humanId);
        if (checkIdcardresult == true) {
            if (vestphonePswd.value == "") {
                $.alert('请输入正确手机服务密码哦', function() {
                    vestphonePswd.focus();
                });
            } else {
                var checkresult = checkPhonenum(basicPhoneNum);
                if (checkresult == true) {
                    var vestphoneMsg = {
                        "method": "",
                        "name": humanName.value,
                        "idCard": humanId.value,
                        "param": { "password": vestphonePswd.value },
                        "userId": window.sessionStorage.userId,
                        "productId": window.sessionStorage.flashid
                    };
                    //edit code
                    var vestphoneUrl = javahost + "user/collection/mobile/submit";
                    makevestcall(vestphoneUrl, vestphoneMsg);

                    // utils.addEvent('申请-提交-' + window.productName);
                }
            }
        } else {
            $.alert('请输入正确的身份证号喔', function() {
                humanId.focus();
            });
        }
    } else {
        $.alert('请输入正确的真实姓名哦', function() {
            humanName.focus();
        });
    }

    setbtncantclick(this);

}

function submitflashCredit() {

    //
    var sbflashCtMsg = {
        "merchantId": window.sessionStorage.merchantid,
        "sessionId": sessionId,
        "userId": window.sessionStorage.userId,
        "productType": window.sessionStorage.flashid,
        "orderAmount": page.quota,
        "term": parseInt(flashDays2.innerHTML)
    }; //,"payPwd":window.sessionStorage.payPSWD

    //  sbflashCtMsg.gps = gpsMsg;
    var sbflashCtUrl = javahost + "shandian/shandianSubmit";
    makeAcall(sbflashCtUrl, sbflashCtMsg);
}
//输入校验类
//公用方法：较验手机号有效性
function checkPhonenum(phoneNum) {
    if (phoneNum.value == "") {
        $.alert('请输入正确的手机号哦', function() {
            phoneNum.focus();
        });
        return false;
    } else if (phoneNum.value !== "") {
        if (/^1[3,4,5,7,8]\d{9}$/.test(phoneNum.value)) {
            return true;
        } else {
            $.alert('请输入正确的手机号哦', function() {
                phoneNum.focus();
            });
        }
    }
}

function verifyMobile(str) {
    /*
        var check0 = /^1[3,4,5,7,8]\d{5,9}$/;
        var phoneresult = false;
        if (check0.test(str)) phoneresult = true;
        if (str.length == 11) phoneresult = true;
        if (!phoneresult){
            return false;
        } else {
            return true;
        }

    */

    return /^1[3,4,5,7,8]\d{9}$/.test(str);

}

/*enterPhcode.onkeyup = function() {
    if (window.sessionStorage.phcdgo != 10001) {
        $.alert('请先点击获取验证码');
    }
}*/

//真实姓名有效性校验

function checkRealname(humanName) {
    if (humanName.value == "") {
        $.alert('请输入正确的真实姓名哦', function() {
            humanName.focus();
        });
    } else {
        var regName = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,}(?:\·[\u4E00-\u9FA5\uF900-\uFA2D]{2,})*$/;
        if (regName.test(humanName.value) !== true) {
            return false;
        } else {
            return true;
        }
    }
}
//姓名有效性校验
function checkRealname2(humanName) {
    var regName = /^[\u4E00-\u9FA5\uF900-\uFA2D]{2,}(?:\·[\u4E00-\u9FA5\uF900-\uFA2D]{2,})*$/
    return regName.test(humanName);

}
//严格身份证号码校验

function checkIdcard(humanId) {
    if (humanId.value == "") {
        $.alert('请输入正确的身份证号哦！', function() {
            humanId.focus();
        });
    } else {
        humanId.value = humanId.value.replace('x', 'X');
        var vcity = {
            11: "北京",
            12: "天津",
            13: "河北",
            14: "山西",
            15: "内蒙古",
            21: "辽宁",
            22: "吉林",
            23: "黑龙江",
            31: "上海",
            32: "江苏",
            33: "浙江",
            34: "安徽",
            35: "福建",
            36: "江西",
            37: "山东",
            41: "河南",
            42: "湖北",
            43: "湖南",
            44: "广东",
            45: "广西",
            46: "海南",
            50: "重庆",
            51: "四川",
            52: "贵州",
            53: "云南",
            54: "西藏",
            61: "陕西",
            62: "甘肃",
            63: "青海",
            64: "宁夏",
            65: "新疆",
            71: "台湾",
            81: "香港",
            82: "澳门",
            91: "国外"
        };
        var regId = /(^\d{17}(\d|X)$)/;
        var province = humanId.value.substr(0, 2);
        var len = humanId.value.length;
        var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
        var arr_data = humanId.value.match(re_eighteen);
        if (regId.test(humanId.value) == false) {
            return false; //校验位数；
        } else if (vcity[province] == undefined) {
            return false; //校验城市
        } else if (regId.test(humanId.value) !== false) {
            var year = arr_data[2];
            var month = arr_data[3];
            var day = arr_data[4];
            var birthday = new Date(year + '/' + month + '/' + day);
            var now = new Date();
            var now_year = now.getFullYear();
            var time = now_year - year;
            if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
                if (time >= 3 && time <= 100) {
                    var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                    var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                    var cardTemp = 0,
                        i, valnum;
                    for (i = 0; i < 17; i++) {
                        cardTemp += humanId.value.substr(i, 1) * arrInt[i];
                    }
                    valnum = arrCh[cardTemp % 11];
                    if (valnum == humanId.value.substr(17, 1)) {
                        return true;
                    }
                    return false;
                }
                return false;
            }
            return false;
        }
    }
}
//严格身份证号码校验
function checkIdcard2(humanId) {
    humanId = humanId.replace('x', 'X');
    var vcity = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外"
    };
    var regId = /(^\d{17}(\d|X)$)/;
    var province = humanId.substr(0, 2);
    var len = humanId.length;
    var re_eighteen = /^(\d{6})(\d{4})(\d{2})(\d{2})(\d{3})([0-9]|X)$/;
    var arr_data = humanId.match(re_eighteen);
    if (regId.test(humanId) == false) {
        return false; //校验位数；
    } else if (vcity[province] == undefined) {
        return false; //校验城市
    } else if (regId.test(humanId) !== false) {
        var year = arr_data[2];
        var month = arr_data[3];
        var day = arr_data[4];
        var birthday = new Date(year + '/' + month + '/' + day);
        var now = new Date();
        var now_year = now.getFullYear();
        var time = now_year - year;
        if (birthday.getFullYear() == year && (birthday.getMonth() + 1) == month && birthday.getDate() == day) {
            if (time >= 3 && time <= 100) {
                var arrInt = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
                var arrCh = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
                var cardTemp = 0,
                    i, valnum;
                for (i = 0; i < 17; i++) {
                    cardTemp += humanId.substr(i, 1) * arrInt[i];
                }
                valnum = arrCh[cardTemp % 11];
                if (valnum == humanId.substr(17, 1)) {
                    return true;
                }
                return false;
            }
            return false;
        }
        return false;
    }
}
//严格版银行卡卡号校验（16-19位）
function checkBanknumber(bankCard) {
    var num = /^\d*$/;
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (bankCard.value.length < 16 || bankCard.value.length > 19) {
        return false; //位数
    } else if (!num.exec(bankCard.value)) {
        return false; //数字
    } else if (strBin.indexOf(bankCard.value.substring(0, 2)) == -1) {
        return false; //前6位校验
    } else {
        var lastNum = bankCard.value.substr(bankCard.value.length - 1, 1); //取出最后一位（与luhm进行比较）
        var first15Num = bankCard.value.substr(0, bankCard.value.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }
        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }
        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }
        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }
        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;
        if (lastNum == luhm) {
            return true;
        }
    }
    return false;

}

//严格版银行卡卡号校验（16-19位）
function checkBanknumber2(bankCard) {
    var num = /^\d*$/;
    var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
    if (bankCard.length < 16 || bankCard.length > 19) {
        return false; //位数
    } else if (!num.exec(bankCard)) {
        return false; //数字
    } else if (strBin.indexOf(bankCard.substring(0, 2)) == -1) {
        return false; //前6位校验
    } else {
        var lastNum = bankCard.substr(bankCard.length - 1, 1); //取出最后一位（与luhm进行比较）
        var first15Num = bankCard.substr(0, bankCard.length - 1); //前15或18位
        var newArr = new Array();
        for (var i = first15Num.length - 1; i > -1; i--) { //前15或18位倒序存进数组
            newArr.push(first15Num.substr(i, 1));
        }
        var arrJiShu = new Array(); //奇数位*2的积 <9
        var arrJiShu2 = new Array(); //奇数位*2的积 >9
        var arrOuShu = new Array(); //偶数位数组
        for (var j = 0; j < newArr.length; j++) {
            if ((j + 1) % 2 == 1) { //奇数位
                if (parseInt(newArr[j]) * 2 < 9)
                    arrJiShu.push(parseInt(newArr[j]) * 2);
                else
                    arrJiShu2.push(parseInt(newArr[j]) * 2);
            } else //偶数位
                arrOuShu.push(newArr[j]);
        }
        var jishu_child1 = new Array(); //奇数位*2 >9 的分割之后的数组个位数
        var jishu_child2 = new Array(); //奇数位*2 >9 的分割之后的数组十位数
        for (var h = 0; h < arrJiShu2.length; h++) {
            jishu_child1.push(parseInt(arrJiShu2[h]) % 10);
            jishu_child2.push(parseInt(arrJiShu2[h]) / 10);
        }
        var sumJiShu = 0; //奇数位*2 < 9 的数组之和
        var sumOuShu = 0; //偶数位数组之和
        var sumJiShuChild1 = 0; //奇数位*2 >9 的分割之后的数组个位数之和
        var sumJiShuChild2 = 0; //奇数位*2 >9 的分割之后的数组十位数之和
        var sumTotal = 0;
        for (var m = 0; m < arrJiShu.length; m++) {
            sumJiShu = sumJiShu + parseInt(arrJiShu[m]);
        }
        for (var n = 0; n < arrOuShu.length; n++) {
            sumOuShu = sumOuShu + parseInt(arrOuShu[n]);
        }
        for (var p = 0; p < jishu_child1.length; p++) {
            sumJiShuChild1 = sumJiShuChild1 + parseInt(jishu_child1[p]);
            sumJiShuChild2 = sumJiShuChild2 + parseInt(jishu_child2[p]);
        }
        //计算总和
        sumTotal = parseInt(sumJiShu) + parseInt(sumOuShu) + parseInt(sumJiShuChild1) + parseInt(sumJiShuChild2);
        //计算Luhm值
        var k = parseInt(sumTotal) % 10 == 0 ? 10 : parseInt(sumTotal) % 10;
        var luhm = 10 - k;
        if (lastNum == luhm) {
            return true;
        }
    }
    return false;
}

//密码纯数字校验
/*
function checkjustNum () {
    var regpswdNun = /^\d*$/;
    if (regpswdNun.test(payPassword.value) !== true) {
        return false;
    } else if (payPassword.value.length < 6){
        return false;
    } else {
        return true;
    }
}
*/

//兼容安卓密码框输入滚动方法
var lookingresize = function() { scrollpage(this) };
phoneNum.onfocus = function() {
    if (deviceMsg.android == true) {
        window.addEventListener("resize", lookingresize, false);
        //      this.type = "password";
    }
}
phoneNum.onblur = function() {

    if(phoneNum.value.length==11){
        utils.bdTrack("上游-手机输入完毕总量",'click',window.sessionStorage.merchantid);
    }
    window.removeEventListener("resize", lookingresize, false);


}

invitInput.onkeyup=function(){
    if(invitInput.value.length==4){
        // outCount('大号外验证码输入完毕总量');
    }
}

function scrollpage(thisinput) {
    var viewTop = $(window).scrollTop(), // 可视区域顶部
        viewBottom = viewTop + window.innerHeight; // 可视区域底部
    var getElementPosition = function(elem) {
        var defaultRect = { top: 0, left: 0 };
        var rect = (elem.getBoundingClientRect && elem.getBoundingClientRect()) || defaultRect;
        var ret = {
            top: rect.top + document.body.scrollTop,
            left: rect.left + document.body.scrollLeft
        }
        return ret;
    }
    var elementTop = getElementPosition(thisinput).top, // 元素顶部位置
        elementBottom = elementTop + thisinput.clientHeight; // 元素底部位置
    $('.content').scrollTop(viewBottom);
}

//页面跳转类
$(document).on('click', '.open-iagreement', function() {
    $.popup('.popup-iagreement');
    if (iagreement.innerHTML == null || iagreement.innerHTML == undefined || iagreement.innerHTML == "") {
        $.ajax({
            type: "GET",
            url: "js/igreement.html",
            dataType: "html",
            success: function(iJson) {
                /*var test = eval(iJson);
                for (i = 0; i < test.length; i++) {
                    var ap = document.createElement("p");
                    ap.innerHTML = test[i];
                    $('#iagreement').append(ap);
                }*/
                $('#iagreement').append(iJson);
            },
            error: function() {
                //              alert("error");
            }
        });
    }
});
regflash.onclick = function() {

    if (this.disabled) {

        return;
    }

    $.router.load("#basicIF");

    setbtncantclick(this);

}

$(document).on("pageInit", function(e, pageId, $page) {
    if (pageId == "basicIF") {
        if (window.sessionStorage.hd10002Auth == "1" && window.sessionStorage.hd10002 == "1") {
            flashName2.innerHTML = "急速贷";
            flashCount2.innerHTML = "1000";
            flashDays2.innerHTML = "30天";
            //flashSfee2.innerHTML = "240元";
        }
    }
});

/*partnersBtn.onclick = function(){
    $.closeModal(".popup-resultwithbigNotok");
    $.router.load("#partners");
}*/
$(document).on('click', '#idontknowPD', function() {

    var mobileText = !!mobileUserText1 ? mobileUserText1 : "发短信MMCZ到10086,或拔打10086转人工查询；";
    $.modal({
        title: '<div class="buttons-row">' +
            '<a href="#tab1" class="button active tab-link">移动用户</a>' +
            '<a href="#tab2" class="button tab-link">联通用户</a>' +
            '<a href="#tab3" class="button tab-link">电信用户</a>' +
            '</div>',
        text: '<div class="tabs" style="text-align: left;">' +
            '<div class="tab active" id="tab1" ><h5>方法一：'+ mobileUserText1 +'<br>方法二：手机登录10086.cn，初始密码为您手机后6位，点“忘记密码”重新设置。</h5></div>' +
            '<div class="tab" id="tab2"><h5>方法一：发短信“MMCZ#6位新密码”至10010,或拔打10010转人工查询；<br>方法二：手机登录wap.10010.cn，初始密码为您手机后6位，点“忘记密码”重新设置。</h5></div>' +
            '<div class="tab" id="tab3"><h5>方法一：编辑“503#机主名称#身份证号码”发送至10001,或拔打10000转人工查询；<br>方法二：手机登录wapzt.189.cn，初始密码为您手机后6位，点“忘记密码”重新设置。</h5></div>' +
            '</div>',
        buttons: [{
            text: '知道了',
            bold: true
        }, ]
    });

    // utils.addEvent('申请-服务密码-' + window.productName);
});


function loginJudge() {

    //免息活动
    if (window.sessionStorage.hd10001 == "1") {
        if (window.sessionStorage.hd10001Auth == "1") {
            $.alert('恭喜您已获得“闪电贷”免息贷款名额， 立即去免息贷款！', function() {
                $.router.load("#basicIF");
            });
            return;
        } else if (window.sessionStorage.hd10001Auth == "0") {
            $.alert('很抱歉！ 您是老用户，本次免息活动仅限新用户参加哦！', function() {
                checkUserStart();
            });
            return;
        } else if (window.sessionStorage.hd10001Auth == "2") {
            checkUserStart();
            return;
        }
    } else {
        checkUserStart();
        return;
    }

};

function checkUserStart() {

    //急速贷活动
    if (window.sessionStorage.hd10002 == "1") {
        flashName.innerHTML = "急速贷";
        flashCount.innerHTML = "1000";
        flashDays.innerHTML = "30天";
        //flashSfee.innerHTML = "240元";
    }


    if (window.sessionStorage.selectproduct == 0 || window.sessionStorage.selectproduct == "" || window.sessionStorage.selectproduct == null || window.sessionStorage.selectproduct == undefined) {
        if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" || window.sessionStorage.cashInstallment == "FURTHER_AUTH" ||
            window.sessionStorage.cashStatus == "FASUCCESS" || window.sessionStorage.ruinCashStatus == "FASUCCESS" || window.sessionStorage.raiseCashStatus == "FASUCCESS" || window.sessionStorage.cashInstallment == "FASUCCESS") {
            //任一产品在审核中
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                $.router.load("#watingRST");
            } else {
                $.router.load("#watingRSTwithoutbigNo");
            }

            // utils.addEvent('审核-' + window.productName);

            if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.cashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD = "flash";
            } else if (window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD = "timely";
                window.sessionStorage.isquota = 0;
            } else if (window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD = "timely";
                window.sessionStorage.isquota = 1;
            } else if (window.sessionStorage.cashInstallment == "FURTHER_AUTH" || window.sessionStorage.cashInstallment == "FASUCCESS") { //现金分期审核中
                window.sessionStorage.refreshPD = "installment";
                window.sessionStorage.isquota = 2;
            }
        } else if (window.sessionStorage.cashStatus == "REJECT" || window.sessionStorage.ruinCashStatus == "REJECT" || window.sessionStorage.cashInstallment == "REJECT" ||
            window.sessionStorage.cashStatus == "FA_REJECT" || window.sessionStorage.ruinCashStatus == "FA_REJECT" || window.sessionStorage.cashInstallment == "FA_REJECT") {
            //闪电贷或及时雨或现金分期被拒
            // if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                if (window.sessionStorage.raiseCashStatus == "SUCCESS") { //用户申请提额的状态
                    //因后台数据原因，当及时雨被拒绝，提额是通过状态时，
                    //优先以提额通过状态响应，此处只针对手动更改数据引
                    //起的接口和需求漏洞.
                    $.popup('.popup-resultwithbigOk');
                } else {

                    localCoop();
                    // utils.addEvent('钞好用－公众号进入审核失败页');
                    // $.popup('.popup-resultwithbigNotok');
                }
            // } else {
            //     if (window.sessionStorage.raiseCashStatus == "SUCCESS") {
            //         //因后台数据原因，当及时雨被拒绝，提额是通过状态时，
            //         //优先以提额通过状态响应，此处只针对手动更改数据引
            //         //起的接口和需求漏洞.
            //         $.router.load("#watingRSTwithoutbigNoOk");
            //     } else {
            //         $.router.load("#watingRSTwithoutbigNonot");
            //     }
            // }


        } else if (window.sessionStorage.ruinCashStatus == "SUCCESS") {
            //及时雨通过
            $.router.load("#selectPD");
            flashcredit.style.display = "none"; //隐藏所有闪电贷交互
            regrain.style.display = "none"; //注册及时雨按钮隐藏
            raincashin.style.display = "block"; //及时雨“通过”按钮显示

            //             cashinstallment.style.display = "none";      //现金分期隐藏

        } else if (window.sessionStorage.raiseCashStatus == "SUCCESS") {
            //提额通过
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                resulttitleWB.innerHTML = "恭喜您！提额成功";
                resultword.innerHTML = "恭喜您提额已审核通过，已为您提额，赶紧去提一笔吧！";
                $.popup('.popup-resultwithbigOk');
            } else {
                $.router.load("#watingRSTwithoutbigNoOk");
            }

            //             cashinstallment.style.display = "none";      //现金分期隐藏
            // advimgnotok.href = "#";
        } else if (window.sessionStorage.cashStatus == "SUCCESS") {

            //闪电贷通过
            $.router.load("#selectPD");
            if (window.sessionStorage.raiseCashStatus == "REJECT" || window.sessionStorage.raiseCashStatus == "FA_REJECT") {
                //闪电贷通过，提额被拒
                $(raincredit).addClass('graybigpdbg'); //及时雨设为灰色背景
                $(regrain).addClass('graycantclickbtn'); //注册及时雨按钮设为透明
                regrain.href = "#"; //注册及时雨按钮设为不可用
                regrain.innerHTML = "审核未通过"; //把注册及时雨按钮改为“审核未通过”
                regflash.style.display = "none"; //注册闪电贷隐藏
                falshcashin.style.display = "block"; //闪电贷中的去提现显示
            } else {
                //闪电贷通过，及时雨非拒绝状态、非人工审核状态、非通过状态，
                //提额非拒绝状态、非人工审核状态、非通过状态
                regflash.style.display = "none";
                falshcashin.style.display = "block";
                regrain.innerHTML = "去提额";
                regrain.onclick = function() {
                    window.sessionStorage.isquota = 1;

                    window.productName = "及时雨";
                    // utils.addEvent('申请-及时雨');
                }
            }


            //             cashinstallment.style.display = "none";      //现金分期隐藏
        } else {
            $.router.load("#selectPD");
            regrain.onclick = function() {
                window.sessionStorage.isquota = 0;
                window.productName = "及时雨";
                // utils.addEvent('申请-及时雨');
            }

        }


        reginstallment.onclick = function() {
            window.sessionStorage.isquota = 2; //点击记录当前是现金分期

            window.productName = "现金分期";
            // utils.addEvent('申请-现金分期');
        }

        if (window.sessionStorage.cashInstallment == "SUCCESS") {
            cashinstallment.style.display = "block";
            reginstallment.style.display = "none";
            getcashinstallment.style.display = "block";
        } else if (window.sessionStorage.cashInstallment != "FURTHER_AUTH" || window.sessionStorage.cashInstallment != "FASUCCESS") {
            cashinstallment.style.display = "block";
        } else {
            cashinstallment.style.display = "none";
        }












    } else if (window.sessionStorage.selectproduct == 1) { //直接闪电贷

        if (window.sessionStorage.sassStatus === "null") {

            $.router.load("#basicIF");
            return;
        }

        if (window.sessionStorage.sassStatus == "REJECT") {

            localCoop();

            return;

        }

        if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" || window.sessionStorage.sassStatus == "FURTHER_AUTH" ||
            window.sessionStorage.cashStatus == "FASUCCESS" || window.sessionStorage.ruinCashStatus == "FASUCCESS" || window.sessionStorage.raiseCashStatus == "FASUCCESS" || window.sessionStorage.sassStatus == "FASUCCESS"
        ) {
            //闪电贷、及时雨、提额任一产品人工审核中
            //该情况出现在提额或及时雨已申请用户，进
            //入直接闪电贷的入口中的情况。常见于一个
            //用户收到我们多种市场渠道进件。本提示用
            //于需求和逻辑漏洞。
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                $.router.load("#watingRST");
            } else {
                $.router.load("#watingRSTwithoutbigNo");
            }

            // utils.addEvent('审核-' + window.productName);

            if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.cashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "flash";
            } else if (window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "timely";
                window.sessionStorage.isquota == 0;
            } else if (window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "timely";
                window.sessionStorage.isquota == 1;
            }

        } else if (window.sessionStorage.cashStatus == "SUCCESS" || window.sessionStorage.ruinCashStatus == "SUCCESS" || window.sessionStorage.raiseCashStatus == "SUCCESS" || window.sessionStorage.sassStatus == "SUCCESS") { //闪电贷审核通过
            //闪电贷、及时雨、提额任一产品审核通过后
            //该情况出现在提额或及时雨已申请用户，进
            //入直接闪电贷的入口中的情况。常见于一个
            //用户收到我们多种市场渠道进件。本提示用
            //于需求和逻辑漏洞。
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                $.popup('.popup-resultwithbigOk');
            } else {
                $.router.load("#watingRSTwithoutbigNoOk");
            }

        } else if (window.sessionStorage.cashStatus == "REJECT" || window.sessionStorage.cashStatus == "FA_REJECT" || window.sessionStorage.sassStatus == "REJECT" || window.sessionStorage.sassStatus == "FA_REJECT") { //闪电贷或者sass产品被拒绝
            // if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                if (window.sessionStorage.raiseCashStatus == "SUCCESS" || window.sessionStorage.ruinCashStatus == "SUCCESS") {
                    //因后台数据原因，当闪电贷被拒绝，提额或及时雨是通过状态时，
                    //优先以及时雨或提额通过状态响应，此处只针对手动更改数据引
                    //起的接口和需求漏洞.
                    $.popup('.popup-resultwithbigOk');
                } else {
                    localCoop();
                    // utils.addEvent('钞好用－公众号进入审核失败页');
                    //$.popup('.popup-resultwithbigNotok');
                }

            // } else {
            //     if (window.sessionStorage.raiseCashStatus == "SUCCESS" || window.sessionStorage.ruinCashStatus == "SUCCESS") {
            //         //因后台数据原因，当闪电贷被拒绝，提额或及时雨是通过状态时，
            //         //优先以及时雨或提额通过状态响应，此处只针对手动更改数据引
            //         //起的接口和需求漏洞.
            //         $.router.load("#watingRSTwithoutbigNoOk");
            //     } else {
            //         $.router.load("#watingRSTwithoutbigNonot");
            //     }
            // }

            // utils.addEvent('审核失败-' + window.productName);
        } else {

            $.router.load("#basicIF");
        }













    } else if (window.sessionStorage.selectproduct == 2) { //直接及时雨
        if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" ||
            window.sessionStorage.cashStatus == "FASUCCESS" || window.sessionStorage.ruinCashStatus == "FASUCCESS" || window.sessionStorage.raiseCashStatus == "FASUCCESS"
        ) {
            //闪电贷、及时雨、提额任一产品人工审核中
            //该情况出现在提额或及时雨已申请用户，进
            //入直接闪电贷的入口中的情况。常见于一个
            //用户收到我们多种市场渠道进件。本提示用
            //于需求和逻辑漏洞。
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                $.router.load("#watingRST");
            } else {
                $.router.load("#watingRSTwithoutbigNo");
            }

            // utils.addEvent('审核-' + window.productName);

            if (window.sessionStorage.cashStatus == "FURTHER_AUTH" || window.sessionStorage.cashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "flash";
            } else if (window.sessionStorage.ruinCashStatus == "FURTHER_AUTH" || window.sessionStorage.ruinCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "timely";
                window.sessionStorage.isquota == 0;
            } else if (window.sessionStorage.raiseCashStatus == "FURTHER_AUTH" || window.sessionStorage.raiseCashStatus == "FASUCCESS") {
                window.sessionStorage.refreshPD == "timely";
                window.sessionStorage.isquota == 1;
            }
        } else if (window.sessionStorage.cashStatus == "SUCCESS" || window.sessionStorage.ruinCashStatus == "SUCCESS" || window.sessionStorage.raiseCashStatus == "SUCCESS") { //闪电贷审核通过
            //闪电贷、及时雨、提额任一产品审核通过后
            //该情况出现在提额或及时雨已申请用户，进
            //入直接闪电贷的入口中的情况。常见于一个
            //用户收到我们多种市场渠道进件。本提示用
            //于需求和逻辑漏洞。
            if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                $.popup('.popup-resultwithbigOk');
            } else {
                $.router.load("#watingRSTwithoutbigNoOk");
            }

        } else if (window.sessionStorage.ruinCashStatus == "REJECT" || window.sessionStorage.ruinCashStatus == "FA_REJECT") { //及时雨审核拒绝
            // if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
                if (window.sessionStorage.raiseCashStatus == "SUCCESS") {
                    //因后台数据原因，当及时雨被拒绝，提额是通过状态时，
                    //优先以提额通过状态响应，此处只针对手动更改数据引
                    //起的接口和需求漏洞.
                    $.popup('.popup-resultwithbigOk');
                } else {
                    localCoop();

                    // utils.addEvent('钞好用－公众号进入审核失败页');
                    // $.popup('.popup-resultwithbigNotok');
                }
            // } else {
            //     if (window.sessionStorage.raiseCashStatus == "SUCCESS") {
            //         //因后台数据原因，当及时雨被拒绝，提额是通过状态时，
            //         //优先以提额通过状态响应，此处只针对手动更改数据引
            //         //起的接口和需求漏洞.
            //         $.router.load("#watingRSTwithoutbigNoOk");
            //     } else {
            //         $.router.load("#watingRSTwithoutbigNonot");
            //     }
            // }

            // utils.addEvent('审核失败-' + window.productName);
        } else {
            $.router.load("#basicTimely");

        }
    }
}
//获取URL参数
function getQueryString(href, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = href.substr(1).match(reg);
    // console.log(r);
    if (r != null) return unescape(r[2]);
    return null;
}

// function outCount(str){
//     utils.bdTrack(str,'click',window.sessionStorage.merchantid);
// }
//自动运行类
function getAmerchantid(href) {
    var mchtstr = getQueryString(href, 'merchantId') || '18fd13cc9aa611e6afb66c92bf314c17';
    var channelId = getQueryString(href, 'channelId'); //渠道id
    var channelUid = getQueryString(href, 'channelUid'); //渠道用户id
    var invitstr = getQueryString(href, 'invitCode') || '000000' ;
    var selectstr = getQueryString(href, 'selectPd') || '0';
    var hdId = getQueryString(href, 'hdId');
    var flashId = getQueryString(href, 'flashId');
    var roll = getQueryString(href,'roll');
    var reffer = getQueryString(href, 'reffer');//来源;

    curMIDState = merchantIdArr.indexOf(mchtstr) != -1 ? true: false;
    //获取产品列表


    if (invitstr.length == 6 && invitstr != "000000") {
        invitInput.value = invitstr;
        invitInput.setAttribute("readOnly", "true");
    }

    if (flashId) {

        window.sessionStorage.flashid = flashId;
    }

    checkaproductid();

    window.sessionStorage.channelId = channelId;
    window.sessionStorage.channelUid = channelUid;
    window.sessionStorage.merchantid = mchtstr;
    window.sessionStorage.selectproduct = selectstr;
    window.sessionStorage.hdId = hdId != null ? hdId : 0;
    window.sessionStorage.isquota = 0;
    window.sessionStorage.roll = roll || 0;
    var mrchtMsg = { "merchantId": mchtstr };
    var mrchtUrl = javahost + "shandian/verifyMerchant";

    if(reffer) utils.bdTrack("上游-超好用来源:",reffer);

    makeAsilencecall(mrchtUrl, mrchtMsg);
    utils.bdTrack("上游-访问总量",'click',window.sessionStorage.merchantid);



}

/**
 * [getProList 获取可用产品列表]
 * @param  {[type]} roll [是否获取列表]
 * @return {[type]}      [description]
 */
function getProList(roll){
    if(roll !="1") return;
    $.ajax({
        type: "post",
        url: javahostv3 + "getRecommendation",
        data: JSON.stringify({"pageKey":"dongtaijinjian"}),
        datatype: "json",
        contentType: "application/json",
        success: function(ret) {

            var proList=ret.data.data.dongtaijinjian;
            if(!proList) return;
            var proIds=[];
            for(var i=0; i<proList.length; i++){
                proIds.push(proList[i].link);

            }

            $.ajax({
                type: "post",
                url: javahost2 + "v16/product/configs",
                data: JSON.stringify(proIds),
                datatype: "json",
                contentType: "application/json",
                success: function(ret2) {
                    var item = ret2.data;
                    //重写闪电贷页面
                    for(var i=0; i<item.length;i++){
                        if(item[i].status==1){
                            for(var j=0; j<proList.length;j++){
                                if(proList[j].link==item[i].productId){
                                     flashName2.innerHTML=proList[j].title;
                                     break;
                                }
                            }

                            flashCount2.innerHTML=item[i].quotaMax;
                            flashDays2.innerHTML = item[i].termNums + (item[i].termUnit==1 ? "天":"期");
                            flashSfee2.innerHTML = (item[i].interestRate*100)+"%";
                            window.sessionStorage.flashid=item[i].productId;
                            break;
                        }
                    }
                }
            })
        }
    })

    // $.post(javahostv3 + 'getRecommendation',,function(ret){

    //     $.post(javahost2 + "v16/product/configs",JSON.stringify(proIds),function(ret2){
    //         proListCfg = ret2.data;
    //     });
    // });
}

function checkaproductid() {
    $.ajax({
        type: "post",
        url: javahost2 + "v16/product/configs",
        data: JSON.stringify([window.sessionStorage.flashid]),
        datatype: "json",
        contentType: "application/json;charset=utf-8",
        success: function(data) {
            if (data.data) {
                flashName.innerHTML = data.data[0].title;
                flashCount.innerHTML = data.data[0].quotaMax;
                if (data.data[0].termUnit == 1) {
                    flashDays.innerHTML = data.data[0].termNums + "天";
                    flashDays2.innerHTML = data.data[0].termNums + "天";
                } else if (data.data[0].termUnit == 2) {
                    flashDays.innerHTML = data.data[0].termNums + "周";
                    flashDays2.innerHTML = data.data[0].termNums + "周";
                } else if (data.data[0].termUnit == 3) {
                    flashDays.innerHTML = data.data[0].termNums + "月";
                    flashDays2.innerHTML = data.data[0].termNums + "月";
                } else if (data.data[0].termUnit == 4) {
                    flashDays.innerHTML = data.data[0].termNums + "年";
                    flashDays2.innerHTML = data.data[0].termNums + "年";
                }
                flashSfee.innerHTML = (data.data[0].interestRate*100)+'%';
                flashName2.innerHTML = data.data[0].title;

                if(fixQuota) {

                    flashCount2.innerHTML = fixQuota;
                } else {

                    flashCount2.innerHTML = data.data[0].quotaMax;
                }


                flashSfee2.innerHTML = (data.data[0].interestRate*100)+'%';

                page.quota = data.data[0].quotaMax;
            } else {


            }
        },
        //请求出错处理
        error: function() {
            $.hidePreloader(); //显示蒙版层
            $.alert("服务器繁忙");
        }
    })


}




//GPS的Callback function
function successCallback(position) {
    var output = "";
    output += "Your position has bean located . \r\n";
    output += " Latitude:" + position.coords.latitude + " ";
    output += " Longitude:" + position.coords.longitude + " ";
    output += " Accuracy :" + position.coords.accuracy + " meters";
    if (position.coords.latitude) {
        output += " Accuracy :" + position.coords.altitudeAccuracy + " meters";
    }
    if (position.coords.heading) {
        output += " Heading :" + position.coords.Heading + " meters";
    }
    if (position.coords.speed) {
        output += " Speed :" + position.coords.Speed + " m/s";
    }
    output += " Time of Position " + position.timestamp + " m/s";
    gpsMsg.latitude = position.coords.latitude;
    gpsMsg.longitude = position.coords.longitude;
    //     gpsMsg = {"latitude":position.coords.latitude,"longitude":position.coords.longitude};
    //     var tostr = JSON.stringify(gpsMsg);
    window.sessionStorage.gpsmsg = { "latitude": position.coords.latitude, "longitude": position.coords.longitude };
    var findaddrUrl = javahost + "findAddr" + "/" + position.coords.latitude + "/" + position.coords.longitude;
    //     makesilenceAcall (findaddrUrl,gpsMsg);
}





function errorCallback(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            /*            $.alert("您拒绝了地理位置信息调用，将不能使用本现金贷业务", function (){
                                    window.location.href="about:blank";
                                    window.open("", "_self");
                                    window.opener = null;
                                    window.close();
                                    WeixinJSBridge.call('closeWindow');//关闭微信浏览器;
                               });
            */
            break;
        case error.er:
            /*            alert("获取地理位置信息中断。");
             */
            break;
        case error.TIMEOUT:
            alert("获取地理位置超时，请保持手机gps信号通畅。");
            break;
    }
}

//SESSION ID 生成设备指纹
var sessionId = uuid();

function uuid() {
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    var uuid = s.join("");
    return uuid;
}

function loadPayEgisDidJs() {
    var nTime = Date.parse(new Date());
    var _protocol = (("https:" == document.location.protocol) ? "https://" : "http://");
    var element = document.createElement("script");
    element.src = _protocol + "pws.payegis.com.cn/did/js/dp.js?appId=5282868&sessionId=" + sessionId + "&ts=" + nTime;
    document.body.appendChild(element);
}
if (window.addEventListener) {
    window.addEventListener("load", loadPayEgisDidJs, false);
} else if (window.attachEvent) {
    window.attachEvent("onload", loadPayEgisDidJs);
} else {
    window.onload = loadPayEgisDidJs;
}














//pageinit判断
/*
$(document).on("pageInit", function(e, pageId, $page) {
  if(pageId == "rqregpage") {
  } else {
      var akefubtn = document.getElementById("YSF-BTN-HOLDER");
      akefubtn.style.display = "block";
  }
});
*/


/* --------global function--------- */
/* ajax form */
/**
 * [ajax 请求主函数]
 * @param  {[string]} url  [请求地址]
 * @param  {[object]} opts [请求配置参数]
 * @return {[promise]}      [返回promise对象]
 */
function ajax(url, opts, callBack, errorBack) {
    opts = opts || {};
    if (window.sessionStorage.isquota == 1) {
        opts.data.quota = 3;
        opts.data.productType = 3;
    } else if (window.sessionStorage.isquota == 0 || window.sessionStorage.isquota == "") {
        opts.data.quota = 1;
        opts.data.productType = 1;
    } else if (window.sessionStorage.isquota == 2) {
        opts.data.productType = 4;
    }
    $.ajax({
        url: url,
        type: opts.type || 'POST',
        data: JSON.stringify(opts.data) || {},
        dataType: opts.dataType || 'json',
        contentType: "application/json",
        async: opts.async || true,
        success: callBack || ajaxBack,
        error: function(D) {
            ajaxNone(D);
            if (errorBack) errorBack();
        }
    });
}
/**
 * [ajaxNone ajax Error callBack]
 * @return {[boolean]}   [description]
 */
function ajaxNone() {
    $.alert("系统错误请稍后再试！");
    return false;
}
/**
 * [ajaxBack ajax success callBack]
 * @param  {[object]} D [description]
 * @return {[type]}   [description]
 */
function ajaxBack(D) {
    $.alert("系统错误请稍后再试！");
    return false;
}

function checkAjaxStart(D) {
    if (D.success == true) {
        return true;
    } else {
        $.alert(D.message);
        return false;
    }
}
//提额
// flashpromote.onclick = function() {
//         window.sessionStorage.isquota = 1;
//         $.router.load("#basicTimely");
//     }
//试试及时雨
//


//注册现金分期
/*
reginstallment.onclick = function () {
    window.sessionStorage.isquota = 4;
    window.sessionStorage.refreshPD = "installment";


}
*/
//防止双击事件时联系调用call
function setbtncantclick(thatbtn) {
    thatbtn.disabled = true;
    setTimeout(function() {
        thatbtn.disabled = false;
    }, 5000);
}


//提现
$("#resultgoforcash,#falshcashin,#raincashin,#getcashinstallment").click(function() {

    if (window.sessionStorage.merchantid == "18fd13cc9aa611e6afb66c92bf314c17" || curMIDState) {
        // alert("productName="+productName);
        // alert("env="+env);
        // alert("https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx743dd8669981aeb2&redirect_uri=http://app.credan.com/account-other/"+ userUrlPath +"/index.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect");
        if(userUrlPath) {
            if(env=="production"){
                window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx743dd8669981aeb2&redirect_uri=http://app.credan.com/account-other/"+ userUrlPath +"/index.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect";
            }else{
                window.location.href="https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc856e3a1bddd7a8e&redirect_uri=http://uctest.credan.com/account-other/"+ userUrlPath +"/index.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect";
            }
        } else {

            window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx743dd8669981aeb2&redirect_uri=http://app.credan.com/wx/index.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect";
        }

    } else {
        $.router.load("#watingRSTwithoutbigNoOk");
    }
});

//邀请
$("#invitefriend,#advimgnotok").click(function() {
    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx743dd8669981aeb2&redirect_uri=http://app.credan.com/wx/credancoin.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect";
    // window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxc856e3a1bddd7a8e&redirect_uri=http://uctest.credan.com/wx/credancoin.html&response_type=code&scope=snsapi_userinfo&#wechat_redirect"
});


//刷新
$("#refreshRstBtn,#refreshRstBtnwithoutbigNo").click(function() {

    if (this.disabled) {
        return;
    }

    if (window.sessionStorage.refreshPD == "flash") {
        var refreshrstMsg = { "userId": window.sessionStorage.userId, "productType": window.sessionStorage.flashid };
        var refreshrstUrl = javahost + "shandian/shandianRefresh";
        makeAcall(refreshrstUrl, refreshrstMsg);
    } else if (window.sessionStorage.refreshPD == "timely") {
        if (window.sessionStorage.isquota == 1) {
            var refreshrstUrl = javahost + "cashloan/cashloanRefresh";
            var refreshrstMsg = { "userId": window.sessionStorage.userId, "cashId": window.sessionStorage.userCashId, "quota": 3, "productType": 3 }; //提额
            makeAcall(refreshrstUrl, refreshrstMsg);
        } else if (window.sessionStorage.isquota == 0 || window.sessionStorage.isquota == "") {
            var refreshrstUrl = javahost + "cashloan/cashloanRefresh";
            var refreshrstMsg = { "userId": window.sessionStorage.userId, "cashId": window.sessionStorage.userCashId, "quota": 1, "productType": 1 }; //及时雨
            makeAcall(refreshrstUrl, refreshrstMsg);
        }
    } else if (window.sessionStorage.refreshPD = "installment") {
        var refreshrstUrl = javahost + "cashloan/cashloanRefresh";
        var refreshrstMsg = { "userId": window.sessionStorage.userId, "cashId": window.sessionStorage.userCashId, "productType": 4 }; //现金分期
        makeAcall(refreshrstUrl, refreshrstMsg);
    }

    setbtncantclick(this);

});


function localCoop() {

    $.popup(".popup-resultwithbigNotok");

    // utils.addEvent('审核失败-自动跳转-'+window.productName);

    utils.tipInfo({

        content: '抱歉,审核失败！<br/>特为您推荐10个贷款新品，正在前往',
        time: 3,

        callback: function() {

            utils.bdTrack("下游-导流coop",'进件登录-审核被拒-确定',window.sessionStorage.merchantid);
            location.href = flowPageUrl;
        }
    });

    // $.alert('审核失败！<br/>点击“确定”进入极速放款专区~',function(){
    //    TDAPP.onEvent("借款超市引导","广告条点击");
    //     window.location.href="coop.html";
    // });
}

function popupCoop() {

    var flowPageUrl = "https://app.credan.com/v1.5.1/coop.html?merchantId=18fd13cc9aa611e6afb66c92bf314c17";

    $.alert('审核失败！<br/>特为您推荐10个贷款新口子，点击确定领取', '', function() {

        utils.bdTrack("下游-导流coop",'进件登录-审核被拒-确定',window.sessionStorage.merchantid);

        utils.tipInfo({

            content: '正在前往...',
            callback: function() {

                location.href = flowPageUrl;

            }
        })

    });
}



$(document).on("pageInit", function(e, pageId, $page) {

    if (pageId == "basicIF") {

        window.productName = $('#flashName2').text();
        // utils.addEvent('申请-' + window.productName);
    }

});