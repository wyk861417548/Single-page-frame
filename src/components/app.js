!function(){
  window.Kim = {
    init:function(){
      Kim.Fnloadplugin();
    },
    //初始化加载插件
    Fnloadplugin:function(){
      var list = [
        ["https://static.cdn.vihost.cn/plugin/layui/layui-v2.4.5/layui.js","js"],
        ["https://static.cdn.vihost.cn/plugin/layui/layui-v2.4.5/layui.js","js"],
        ["./common/js/wheel.js","js"],
        ["./common/css/init.css","css"],
        ["./common/css/main.css","css"],
        ["./common/css/3.css","css"]
      ]
      //循环加载插件
      KJ.Fnuse(list,function(){
        // if(!sessionStorage[KJ.config.routeStorage]){
        //   KJ.Fnpage();  //初始化加载页面
        // }
        // console.log("xxxxxxxxx",sessionStorage);
      });
     
    },
    Fnhash:function(el){
      if(el){
        var urllen =  el.split("#");
        return urllen.length > 1? urllen[1]:"0";
      }
      return "0";
    }
  }
  Kim.init();
}()

