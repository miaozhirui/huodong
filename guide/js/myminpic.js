(function () {

    var input1 = document.querySelector('#clicktoupload');
    var input2 = document.querySelector('#positiveupload');
    var input3 = document.querySelector('#reverseupload');
    input1.onchange = function () {
        lrz(this.files[0], {width: 640}, function (results) {
            // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
            //console.log(results);
            if (results.base64.length > 819200) {
	            $.alert("您上传的图片过大，请自行裁切后再继续上传。");
            } else {
				holdidcard_report(' ', results.base64, results.base64.length,"#reportholdidcard","frontimg");
            }
        });
    };
    input2.onchange = function () {
        lrz(this.files[0], {width: 640}, function (results) {
            // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
            //console.log(results);
            if (results.base64.length > 819200) {
                $.alert("您上传的图片过大，请自行裁切后再继续上传。");
            } else {
                holdidcard_report(' ', results.base64, results.base64.length,"#positiveBox","positivesPic");
            }
        });
    };
    input3.onchange = function () {
        lrz(this.files[0], {width: 640}, function (results) {
            // 你需要的数据都在这里，可以以字符串的形式传送base64给服务端转存为图片。
            //console.log(results);
            if (results.base64.length > 819200) {
                $.alert("您上传的图片过大，请自行裁切后再继续上传。");
            } else {
                holdidcard_report(' ', results.base64, results.base64.length,"#reverseBox","reversesPic");
            }
        });
    };
    /**
     * 演示报告
     * @param title
     * @param src
     * @param size
     */
    function holdidcard_report(title, src, size,id1,id2) {
        var img = new Image(),
            li = document.createElement('div'),
            size = (size / 1024).toFixed(2) + 'KB';
        img.onload = function () {
            var content = '<ul style="display:none">' +
                '<li>' + title + '（' + img.width + ' X ' + img.height + '）</li>' +
                '<li class="text-cyan">' + size + '</li>' +
                '</ul>';
            li.className = 'item';
            li.innerHTML = content;
            li.appendChild(img);
			$(id1).html('');
            document.querySelector(id1).appendChild(li);
        };
		img.setAttribute("id", id2);
        if(id1=="#reportholdidcard"){
            img.className="photo";
        }else{
            img.className="photo2";
        }

        img.src = src;
    }
    // 演示用服务器太慢，做个延缓加载
    window.onload = function () {
        input1.style.display = 'block';
        input2.style.display = 'block';
        input3.style.display = 'block';
    }
})();