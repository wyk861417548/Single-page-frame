!function(){
  window.Kim = {
    init:function(){
      Kim.Fnloadplugin();
    },
    //初始化加载插件
    Fnloadplugin:function(){
      var list = [
        ["https://static.cdn.vihost.cn/plugin/font-awesome/5.7.2/css/all.min.css","css"],
        ["https://static.cdn.vihost.cn/plugin/zepto/zepto1.2.0_touch/zepto.min.js","js"],
        ["https://static.cdn.vihost.cn/plugin/layui/layui-v2.4.5/layui.js","js"],
        ["./common/js/wheel.js","js"],
        ["./common/css/init.css","css"],
        ["./common/css/main.css","css"],
        ["./common/css/3.css","css"]
      ]
      //循环加载插件
      KJ.Fnuse(list,function(){});
     
    }
  }
  Kim.init();
}()

