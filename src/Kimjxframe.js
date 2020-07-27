!function(){
  
  window.KJ = {
    config:{
      
      root:"",//文件路径
      
      page:"components/", //页面地址

      u:"main/main.html",   //加载页面首页
      
      common:"common/", //资源文件地址(js/css/images等)

      DomRoot:"root", //框架刷新dom的id
     
      star:"app.js",  //项目初始化加载插件地址
      
      appdom:document.createElement("div"), //生成最外层dom节点，页面切换就是往其中刷入页面

      router:"",

      mode:"hash"   //hash模式还是history模式
    },
   
    cachevesion:"0.1", //js 版本缓存控制

    jsCache:{},  //js缓存
  
    cssCache:{},   //css缓存

    htmlCache:{}, //html页面缓存

    hashCache:{},
   
    init:function(option){  //初始化函数
      var _this = KJ;
      for(var i in option){
        _this.config[i] = option[i];
      }
      _this.config.router= new Router();     //初始化路由配置

      if(_this.config.mode == "hash"){
        _this.config.router.listenerHashchange();
      }else{
        _this.config.router.listenerPopState();
      }
      
      document.body.append(_this.config.appdom);// 添加容器

      _this.Fnloader(); // 初始化加载js资源
      // history.replaceState(null, null, KJ.config.u);
    },

    
    Fnloader:function(){   //初始化加载js css 插件资源
      var _this = KJ;
      var fiurl = _this.config;
      var url = fiurl.root +fiurl.page+ fiurl.star;    //初始化加载插件资源地址（app.js 文件）
      _this.Fnloadjs(url);
    },
   
    Fnloadjs:function(url){  //加载js
      var _this = KJ;
      if(!url && _this.jsCache[url] === 2)return;
      var script = _this.Fncel("script");

      script.onload = function(){//加载完成
        _this.jsCache[url]=2;
        document.body.removeChild(script);
      }
      
      script.src = url + (_this.cachevesion?"?v="+_this.cachevesion:"");
      document.body.appendChild(script);
      console.log("url",url);
    },
  
    Fnloadcss:function(url){   //加载css
      var _this = KJ;
      // console.log("Fnloadcss",url);
      // if(!url && _this.cssCache[url] === 2)return;
      var link = _this.Fncel("link");
      link.onload = function(){  //加载完成
        _this.cssCache[url] = 2;
      }

      link.rel = "stylesheet";
      link.href = url;
      // console.log("link",link);
      document.head.appendChild(link);
    },
    
    Fncel:function(ename){ //创建元素
      return document.createElement(ename)
    },

    Fnpage:function(url){  //切换标签模式加载页面 页面root节点全刷
      var _this = KJ;
      var u = url?url:_this.config.u;   //html页面路径
      
      var appdom = _this.config.appdom;
      var DomRoot = _this.Fnfindel("#"+_this.config.DomRoot);  //在页面上找到刷入点（页面切换由此节点内容改变）
      //console.log("_this.htmlCache---------------------------",u,url);
      console.log("DomRoot.................",DomRoot);
      if(!DomRoot){                                    //若果刷入点不存在则创建一个
        var root = _this.Fncel("div");
        root.setAttribute("id",_this.config.DomRoot);
        appdom.appendChild(root)
      }
     
      var DomRoot = _this.Fnfindel("#"+_this.config.DomRoot);  //重新获取刷入点

      if(_this.htmlCache[u]){              //判断是否有缓存，有则从缓存拿取
        console.log("有缓存从缓存中拿到了");
        DomRoot.innerHTML = _this.htmlCache[u];
        _this.FnRunjs(_this.jsCache[u],DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
        return;
      }

      _this.FngetTemplate(u,function(html){  //加载html页面
        // console.log("加载html页面");
        DomRoot.innerHTML = html;
        var scriptList = _this.Fnfindel("#"+_this.config.DomRoot,"script");   //获取插入页面script
        _this.jsCache[u] = scriptList;
        _this.FnRunjs(scriptList,DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
        console.log("scrotpt",scriptList)
      });     
      
    },

    Fntemplate:function(url){       //模板刷入 （拼接成页面）
      
    },

    Fnfindel:function(ename,child){  //ename查找元素,返回元素  child查找所有对应的子元素
      if(child){
        return document.querySelector(ename).querySelectorAll(child);
      }
      return document.querySelector(ename);
    },

    FnRunjs:function(scriptList,DomRoot){  //由于innerHTML插入的script不能运行，此方法用来运行插入的script
      var _this = KJ;
      for(var i=0,len=scriptList.length;i<len;i++){
        var script = _this.Fncel("script");
        script.innerHTML = scriptList[i].innerHTML;

        script.onload = function(){
          DomRoot.removeChild(script);
        };
        DomRoot.appendChild(script);
      }  
    },

    FngetTemplate:function(u,callback){ //加载html页面
      var _this = KJ;
   
      var url = _this.config.page + u;

      // console.log("u11111111111111111111111111111111111111111111111",u,url);
      var xhr = new XMLHttpRequest(); //请求  路径  异步
      xhr.open("GET",url,true); 
      xhr.onreadystatechange = function(){   //每当 readyState 改变时，就会触发 onreadystatechange 事件。
        if(xhr.readyState == 4 && xhr.status == 200){
          //console.log("xhr.responseText",xhr.responseText);
          _this.FnsetHTML(u,xhr.responseText);
          callback(xhr.responseText);
        }
      }
      xhr.send();
      
    },

    FnsetHTML:function(u,html){  //缓存html
      var _this = KJ;
      // _this.config.router.route(u,html);
      _this.htmlCache[u] = html;
    },

    Fnuse:function(list,callback){   //循环加载js或者css
      var _this = KJ;count = 0,len=list.length;
      var loop = function(){
        if(count >= len){
          if(callback){callback()};
          return;
        }
        if(list[count][1] === "css"){
          _this.Fnloadcss(list[count][0]);
        }
        if(list[count][1] === "js"){
          _this.Fnloadjs(list[count][0]);
        }
        count++;
        loop();
      }
      loop();
    },
    
    PageJump(el){  //页面跳转方法
      var _this = this;
      var count = 1;
      var data_url = el.getAttribute("data-url");
      sessionStorage[data_url] = data_url;
      // _this.hashCache[data_url] = data_url;
      location.hash = data_url;
    }
  }
}()

