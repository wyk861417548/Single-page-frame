/**
 * 基于jq 或者 zepto
 */
(function(){

  window.getGet=KJ.FngetGet;

  //版本缓存控制
  KJ.cachevesion      = "1.74";

  window.Kim={
    Config:{
      //框架页面
      RootPage:KJ.CONFIG.defaultframe,

      //默认主页
      DefaultPage:KJ.CONFIG.defaultpage,

      //框架刷新dom的id
      DomRoot:"root",

      //模版根目录
      TRoot:KJ.CONFIG.root,

      LoadcpName:"loadcp",

      title:document.title,
    },

    //批量加载js css
    use:KJ.Fnuse,

    //加载js
    loadJs:KJ.Fnloadjs,

    //加载css
    loadCss:KJ.Fnloadcss,

    //对象列表
    App:{},

    //当前在最上方的App ID
    activeApp:0,

    //是否已经加载完毕框架
    inited:false,

    //当前生成的window tid
    winId:0,

    //当前APP个数
    AppCount:0,

    //缓存名称
    sessionName:"KimMobilePageSession",

    //初始化
    init:function(opt){
      //解析初始化参数
      var pageparam = location.href.split("#");

      Kim.INITPAGEGET  = getGet(pageparam[0]);
      Kim.INITPAGEHASH = pageparam.length>1 ? getGet(pageparam[1]) : {};

      Kim.Fnloadplugin();
    },

    //加载初始化基础插件
    Fnloadplugin:function(){
      var list = [
        ["https://static.cdn.vihost.cn/plugin/font-awesome/5.7.2/css/all.min.css","css"],
        ["https://static.cdn.vihost.cn/plugin/zepto/zepto1.2.0_touch/zepto.min.js","js"],
        
        ["https://static.cdn.vihost.cn/plugin/layui/layui-v2.4.5/layui.js","js"],
        ["https://static.cdn.vihost.cn/plugin/layer_mobile/2.0/layer.js","js"],

        [KJ.CONFIG.root + "static/css/app.css","css"],

        ["../../../static/m/js/msite.js","js"],
        ["../../../static/m/css/mobile.css","css"],

        ["../../../static/pc/common/js/validator.js","js"],
        [KJ.CONFIG.root + "static/js/site.js","js"],
        ["../../../static/pc/common/js/Ktool.js","js"],
        [KJ.CONFIG.root + "static/js/config.js","js"],
      ];

      KJ.Fnuse(list,function(){
        //加载高德地图
        KJ.Fnuse([[G.gdmapconfig,"js"]],function(){
          //加载layui插件
          layui.use(["laytpl"],function(){
            Kim.kinit();
          });
        });
      });
    },

    kinit:function(opt){
      //标签模式加载window
      window.Aloader = Kim.Aloader;
      window.App     = Kim.App;
      if(!opt){ opt={}; }

      for(var i in opt){
        //console.log(this.Config[i]);
        if(this.Config[i]){
          this.Config[i] = opt[i];
        }
      }

      Kim.Config.$PageRoot = $(KJ.CONFIG.appdom);

      if($("#" + Kim.Config.DomRoot).length <= 0){
        Kim.Config.$PageRoot.prepend('<div id="'+ Kim.Config.DomRoot +'"></div>');
      }

      Kim.DomRoot = $("#" + Kim.Config.DomRoot);

      var hash = location.hash;

      Kim.getTemplate(Kim.Config.RootPage,function(html){
        Kim.DomRoot.html(html);
      });
    },

    //首页 用户信息登录完成后回馈 运行多界面
    MainpageInitCallback:function(){
      if(sessionStorage[Kim.sessionName] && JSON.parse(sessionStorage[Kim.sessionName]).length>0){
        Kim.AppWinSessionRestart();
      }

      //注册hash事件
      Kim.hashchangeID = KJ.Fnregistevent("hashchange",Kim.hashchange);

      Kim.inited = true;
    },

    //页面会话发生改变 触发记录改变
    AppWinSessionChange:function(){
      var list = [];

      for(var i in this.App){
        var app = this.App[i];
        list.push({
          url:app._url,
          title:app._title,
          tid:app.tid,
          sessionCache:app._sessionCache
        });
      }

      sessionStorage[Kim.sessionName] = JSON.stringify(list);
    },

    //清理session信息
    AppWinSessionClear: function(){
      if(sessionStorage[Kim.sessionName]){
        delete sessionStorage[Kim.sessionName];
      }
    },

    //页面会话恢复
    AppWinSessionRestart:function(){
      if(!sessionStorage[Kim.sessionName]){
        return false;
      }

      var list = JSON.parse(sessionStorage[Kim.sessionName]);

      var loader = function(i){
        var app = list[i];

        setTimeout(function(){
          Kim.FnLoad({
            hashchangeOff:true,
            tid:app.tid,
            title:app.title,
            url:app.url,
            animateIn:false,
            loadNow:list.length-1 == i ? true : false,
          },function(_app){

            if(app.sessionCache){
              _app.sessionCache = app.sessionCache;
            }

            _app.OFF("GCALLBACK","default");

          });
        },50*i);
      }

      for(var i in list){
        loader(i);
      }
    },

    //加载遮罩 透明
    FnLoad_loading:function(a){
      if(!a){a = false;}

      if(a){
        var html='<div id="Kim-Loading" style="position:fixed; top:0; bottom:0; left:0; right:0; background:rgba(0,0,0,0); z-index:999999999;"></div>';

        $("body").append(html);
        //$("#Kim-Loading").on("touch",function(e){e.preventDefault();});
      }else{
        //防止操作太快
        setTimeout(function(){
          $("#Kim-Loading").remove();
        },200);
      }
    },

    //加载页面
    FnLoad:function(opt,callback){
      //浏览器最大 历史记录为47条 超出后就会舍弃老的
      if(Kim.AppCount >= 45){
        console.error("Out Of Brower History Limit");
        return false;
      }

      var url = opt.url ? opt.url : Kim.Config.DefaultPage;

      var tid;

      //加载中
      Kim.FnLoad_loading(true);

      Kim.FnLoad_lock = true;

      //生成 窗口ID
      if(opt.tid){
        Kim.winId = opt.tid;
        tid       = opt.tid;
      }else{
        tid = Kim.winId + 1;
      }
      
      Kim.winId++;
      Kim.AppCount++;

      Kim.activeApp = tid;

      if(!opt.hashchangeOff){
        history.pushState({},"","#" + tid);
      }

      var title = opt.title ? opt.title : Kim.Config.title;

      var app = {
        //是否在加载页面
        loading:false,

        //是否已经加载至页面
        loadToWin:false,

        //是否已经加载html 防止display=none 是运行页面 获取不到高度
        loaded:false,

        //是否需要加载动画
        animateIn:opt.animateIn === false ? false : true,

        //是否立即加载html
        loadNow:opt.loadNow ? true : false,

        //容器ID
        tid:tid,

        id:Kim.Config.LoadcpName + tid,

        //窗口按钮默认标题
        _title:title ? title : Kim.Config.title + tid,

        //GET url解析对象
        GET:getGet(url),

        //页面重回激活 触发
        ONWINRELOAD:false,
        ONGWINRELOAD:false,

        //页面 被 隐藏 触发
        ONPAUSE:false,
        ONGPAUSE:false,

        //窗口关闭
        ONWINCLOSE:false,
        ONGWINCLOSE:false,

        //绑定事件 f函数 n名称
        ON:function(n,f,tag){
          var eventName = 'ON' + n;

          //初始化
          if(!app[eventName]){
            app[eventName] = {events:[],list:{}};
          }

          //建立字典
          if(tag){
            app[eventName].list[tag] = app[eventName].events.length;
          }else{
            tag = app[eventName].events.length;
            app[eventName].list[tag] = app[eventName].events.length;
          }

          app[eventName].events.push(f);
          return tag;
        },

        //解绑事件 n事件名称 tag绑定事件标志
        OFF:function(n,tag){
          var eventName = 'ON' + n;

          app[eventName].events[ app[eventName].list[tag] ] = false;
          delete app[eventName].list[tag];
        },

        //事件统一处理函数
        EventDeal:function(n,data){
          var eventName = 'ON' + n;

          //console.log(n);

          data = data ? data : {};

          if(app[eventName]){
            for(var i=0;i<app[eventName].events.length;i++){
              if(app[eventName].events[i]){app[eventName].events[i](data);}
            }
          }

          var eventGName = 'ONG' + n;

          if(app[eventGName]){
            
            //console.log(data);

            for(var i=0;i<app[eventGName].events.length;i++){
              if(app[eventGName].events[i]){app[eventGName].events[i](app,data);}
            }
          }
        },

        //运行页面地址 + 参数
        _url:url,

        locationIndex:0,

        //清理dom点 内存
        clear:function(){
          Kim.clearHTML(document.getElementById(app.id));
        },

        //加载页面 GET 模版等统一处理
        pageloaddeal:function(u,ok){
          app.EventDeal("CALLBACK",{from:app,status:5});

          //app.GET   = getGet(u);
          app._pathurl = u.split("?")[0];

          Kim.getTemplate(app._pathurl,function(html){
            html = html.replace(/__TID__/g,app.tid);

            app.template = html;

            ok();
          });
        },

        //运行
        run:function(){

          app.pageloaddeal(app._url,function(){

            Kim.FnTemplateRun(app,function(){

              //关闭遮罩
              Kim.FnLoad_loading(false);

              //页面加载完毕 回调
              app.EventDeal("CALLBACK",{from:app,status:1});
              
            });
          });

        },

        //关闭应用 回收dom 清理内存
        shutdown:function(){
          //窗口关闭事件
          app.EventDeal("WINCLOSE");
          
          app.clear();

          var aim = document.getElementById(app.id);

          aim.parentNode.removeChild(aim);

          app.EventDeal("CALLBACK",{from:app.tid,status:1});

          delete Kim.App[app.tid];

          for(var i in app){
            app[i] = null;
          }

          app = null;
          Kim.AppCount--;

          //页面记录 刷新后重新能加载
          Kim.AppWinSessionChange();
        }

      };

      //定义App 监控变量接口
      Object.defineProperties(app,{

        title:{
          get:function(){
            return app._title;
          },
          set:function(v){
            app._title = v;
            document.title = _title;
          }
        },
      });

      //缓存对象 页面刷新后依然可以被传递
      app._sessionCache = "";

      Object.defineProperties(app,{
        sessionCache:{
          get:function(){
            return app._sessionCache;
          },
          set:function(v){
            app._sessionCache = v;

            //页面记录 刷新后重新能加载
            Kim.AppWinSessionChange();
          }
        }
      });

      //如果存在 callback
      if(callback){
        app.ON("GCALLBACK",callback,"default");
      }

      Kim.App[tid] = app;
      app.run();
      Kim.AppWinSessionChange();
    },


    //清理html
    clearHTML:function(dom){
      var list = dom.querySelectorAll("*");

      for(var i = 0;i<list.length;i++){
        list[i].parentNode.removeChild(list[i]);
      }
    },

    //运行加载模板
    FnTemplateRun:function(app,callback){
      var container   = Kim.Fncel("div");

      var showCss = 'transform:scale(1) translateX(0); -webkit-transform:scale(1) translateX(0);';
      var hideCss = 'transform:scale(.8) translateX(120%); -webkit-transform:scale(.8) translateX(120%);';

      container.style = 'position:fixed; z-index:100; left:0; right:0; top:0; bottom:0; transition: all .3s; -webkit-transition:all .3s; overflow:hidden'+ (app.animateIn ? hideCss : showCss);

      container.id = app.id;

      Kim.Config.$PageRoot.append(container);
      
      app.windowDIV   = container;
      app.jqwindowDIV = $(container);

      app.jqwindowDIV.append('<div class="Kim-Window-Render" style="width:100%; height:100%; position: relative; overflow-y:auto; background:#FFF"></div>');

      //是否动画进入
      if(app.animateIn){
        setTimeout(function(){
          app.jqwindowDIV.css({"transform":"scale(1) translateX(0)","-webkit-transform":"scale(1) translateX(0)"});
        },100);

        //隐藏其他div 减少内存 防止溢出页面崩溃
        setTimeout(function(){
          for(var i in Kim.App){
            if(i != app.tid){ Kim.App[i].jqwindowDIV.hide(); }
          }
        },1000);
      }

      app.jqWindowRender = app.jqwindowDIV.find(".Kim-Window-Render");
      app.loadToWin      = true;

      //console.log(app);

      if(app.loadNow && !app.loaded && app.template){
        app.loaded = true;
        app.jqWindowRender.html(app.template);

        setTimeout(function(){
          Kim.FnLoad_lock = false;

          //如果有初始化函数则运行
          if(app.init){
            app.init();
          }

        },100);
      }

      if(callback){callback();}
    },

    Aloader:function(a){
      if(!Kim.inited){
        return false;
      }
      
      var aim = $(a);

      var title = aim.attr("data-title");
      var opt = {
        url:aim.attr("data-url"),
        loadNow:true,
        title:title ? title : Kim.Config.title
      };

      Kim.FnLoad(opt);
    },

    //获取模板文件
    getTemplate:function(u,callback){
      KJ.Fnpageloader(u,function(){
        callback(KJ.getApp(u));
      });
    },

    /* 创建元素 */
    Fncel:function(ename){
      return document.createElement(ename);
    },

    //页面处理url
    hashchange:function(data){
      if(Kim.FnLoad_lock){
        //console.log("lock_new_tid");
        return false;
      }

      data.e.preventDefault();

      //console.log(e);

      var oldUrl = data.e.oldURL;
      var newURL = data.e.newURL;

      var newapp = newURL.split("#");
      var oldapp = oldUrl.split("#");

      var oldTid = parseInt(oldapp.length>=2 ? oldapp[1] : 0);
      var newTid = parseInt(newapp.length>=2 ? newapp[1] : 0);

      //console.log([oldTid,newTid,Kim.activeApp]);

      //前进后返回断掉
      if(newTid == Kim.activeApp){
        return false;
      }

      //hash 变化方向 0返回 1前进
      var direction = oldTid<newTid ? 1 : 0;

      //location前进则强制返回
      if(direction){
        history.go(-1);
        return false;
      }

      var app = Kim.App[oldTid];

      if(newTid){
        var showApp = Kim.App[newTid];

        //显示当前app
        showApp.jqwindowDIV.show();

        if(!showApp.loaded){
          showApp.loaded = true;
          showApp.jqWindowRender.html(showApp.template);

          if(showApp.init){ showApp.init() }
        }else{
          showApp.EventDeal("WINRELOAD");
        }

        Kim.activeApp = newTid;
      }else{
        Kim.activeApp = 0;
      }
      
      app.jqwindowDIV.css({"transform":"scale(.8) translateX(120%)","-webkit-transform":"scale(.8) translateX(120%)"});

      setTimeout(function(){
        app.shutdown();
      },600);
    }
  };

  Kim.init();
})();