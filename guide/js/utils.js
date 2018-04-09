//工具库
var utils = {

    tipInfo: function(opt) {

        var hasTipInfo = document.querySelector('.tip-info-wrapper');
        hasTipInfo || createTipInfo();

        function createTipInfo() {
            var content = opt.content || '',
                data = opt.data || null,
                time = opt.time || 2,
                callback = opt.callback || function() {},
                div = document.createElement('div');

            div.classList.add('tip-info-wrapper');
            div.innerHTML = content;
            document.body.appendChild(div);
            setTimeout(function() {
                div.parentNode.removeChild(div);
                callback(data);
            }, time * 1000);
        }
    },

    // addEvent: function() {

    //     var arrs = Array.prototype.slice.call(arguments);
    //     var timer = null;
    //     var merchantId = this.getParams('merchantId');
    //     // if (merchantId && merchantId !== '18fd13cc9aa611e6afb66c92bf314c17') {

    //     //     arrs[0] = merchantId + '-' + arrs[0]
    //     // }

    //     arrs[0] = arrs[0].replace(/(undefined)/, function($1, $2) {

    //         if ($2 == 'undefined') {

    //             return '闪电贷';
    //         }
    //     })

    //     if (window.TDAPP) {

    //         TDAPP.onEvent.apply(TDAPP, arrs);
    //         return;
    //     }

    //     timer = setInterval(function() {
    //         try {

    //             TDAPP && clearInterval(timer);

    //             TDAPP.onEvent.apply(TDAPP, arrs);

    //         } catch (e) {

    //             console.log(e);
    //         }
    //     }, 1000);

    // },
    /**
     * [bdTrack 百度事件统计]
     * @param  {[type]} category  [要监控的目标的类型名称，通常是同一组目标的名字，比如”视频”、”音乐”、”软件”、”游戏”等等。该项必选。]
     * @param  {[type]} action    [用户跟目标交互的行为，如”播放”、”暂停”、”下载”等等。该项必选。]
     * @param  {[type]} opt_label [事件的一些额外信息，通常可以是歌曲的名称、软件的名称、链接的名称等等。该项可选。]
     * @param  {[type]} opt_value [事件的一些数值信息，比如权重、时长、价格等等，在报表中可以看到其平均值等数据。该项可选。]
     * @return {[type]}           [null]
     */
    bdTrack:function(category,action, opt_label,opt_value){
        _hmt.push(['_trackEvent', category, action, opt_label,opt_value]);
        console.log(category+"+"+action+"+"+opt_label+"+"+opt_value);

    },
    getParams: function(key) {

        var queryString = location.search.slice(1);
        var params = {};

        var temParams = queryString.split('&');

        for (var i = 0; i < temParams.length; i++) {

            var temData = temParams[i].split('=');

            params[temData[0]] = temData[1];
        }

        return !!key ? params[key] : params;

    },
    //显示loading
    showLoading: function() {
        var div = document.createElement('div');
        div.id = 'loading';
        document.body.appendChild(div);
    },

    //隐藏loading
    hideLoading: function() {
        var ele = document.getElementById('loading');

        ele && document.body.removeChild(ele);
    },
    //获取数据
    fetch: function(opt) {

        this.showLoading();

        var type = opt.type || 'post',
            url = opt.url || 'url',
            data = opt.data || "",
            self = this;

        $.ajax({

            type: type,
            url: url,
            data: data,
            dataType: 'json',
            contentType: 'application/json;charset=utf-8',
            success: function(data) {

                opt.success && opt.success(data);

                self.hideLoading();
            },
            error: function() {

                alert('服务器错误')
                opt.error && opt.error();

                self.hideLoading();
            }
        })
    },


}