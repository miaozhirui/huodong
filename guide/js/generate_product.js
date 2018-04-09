
var generateProduct = {

    init: function(opt) {

        this.initParams(opt);
        this.getTemplate();
        this.getRemoteData();
    },

    initParams: function(opt) {

	  this.pageName = opt.pageName;

      this.api = {

          pageDataUrl: javahostv3 + 'getRecommendation'
          // pageDataUrl: 'http://staticjson.oss-cn-hangzhou.aliyuncs.com/recomm-daikuanchaoshi.js'
      }

    },

    getTemplate: function () {

        this.template = $('#template').html();

    },

    getRemoteData: function() {
        var self = this;

        var param = {

               pageKey: this.pageName
                // positionKey: '1,2,3'
            }
 //      var url;
   //     if(env=="production"){
    //        url = 'https://staticjson.oss-cn-hangzhou.aliyuncs.com/recomm-'+this.pageName+'.js';
    //   }else{
    //      url = 'https://staticjson.oss-cn-hangzhou.aliyuncs.com/recomm-'+this.pageName+'-test.js';
    // }
//        $.get(url,function(data){

  //          var params = JSON.parse(data);

   //         self.renderProduct(params.data);
     //   });
         utils.fetch({

             url: this.api.pageDataUrl,
             type:'post',
             data: JSON.stringify(param),
             dataType: 'json',
             success: function(data) {

                 self.renderProduct(data.data);

             },
             error: function() {

                 alert('服务器繁忙')
             }
         })
    },

    renderProduct: function(data) {

        this.picPrefix = data.basePic;

        var data = data.data;

        //渲染每一个推荐位的数据
        for(var i in data) {

           this.renderEvery(i, data[i]);
        }

    },

    //渲染每一个推荐位的产品
    renderEvery: function (ele, data) {

        $('#'+ele).html(this.render(data));
    },

    render: function (data) {

        return ejs.render(this.template, {

            picPrefix: this.picPrefix,
            data: data
        })
    }
}

