var wheelSelf = {
  /**
   * 获取url传递的参数
   * @param search  有：?aa=11  无：获取本页面参数
   * return {aa:'11'}
   */
  getUrlParams :function(search) {
    var r = {}
    if( search == undefined ){
      search =window.location.href.split('?')[1];
    }else {
      search = search.split('?')[1];
    }
    var arr = search.split('&');
    var len = arr.length;
    //console.log(arr.length)
    if( !arr.length  ){
      return;
    }
    for (var i = 0; i < len ; i++) {
      s = arr[i].split('=');
      r[s[0]] = decodeURI(s[1]);
    }
    return r;
  },

 
}


var Authwheel = {
  userAgent:function(){        //获取入端信息
    return window.navigator.userAgent.toLowerCase();
  },
  isWX:function(){     //是否是微信端
    return /micromessenger/.test( Authwheel.userAgent() );
  },
  isAlipay:function(){  //判断是支付宝端
    return /aliapp/.test( FWCuserAuth.userAgent() );
  },
}