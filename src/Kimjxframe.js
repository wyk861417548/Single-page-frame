!function(){
  
  window.KJ = {
    config:{
      
      root:"",//文件路径

      App:"", 
      
      page:"components/", //html页面目录

      u:"main/main.html",   //初始页面
      
      common:"common/", //资源文件目录(js/css/images等)

      DomRoot:"root", //框架刷新dom的id

      template:"template", //页面部分刷入点
     
      star:"app.js",  //项目初始化加载插件文件
      
      appdom:document.createElement("div"), //生成最外层dom节点，页面切换就是往其中刷入页面

      router:"",      //初始化路由（hash/history）

      mode:"hash",   //hash模式还是history模式

      count:0,       //hash值（随页面变化自增）

      routeStorage:"routeStorage"  //sessionStorage存储页面路径名（url：页面路径 count:hash值）
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

      _this.config.appdom.setAttribute("id",_this.config.DomRoot);   //容器设置id值

      document.body.appendChild(_this.config.appdom);// 添加容器到页面

      _this.Fnloader(); // 初始化加载js资源
 
      _this.Fnpage();  //初始化加载页面
    },

    
    Fnloader:function(){   //初始化加载js css 插件资源
      var _this = KJ;
      var fiurl = _this.config;
      var url = fiurl.root +fiurl.page+ fiurl.star;    //初始化加载插件资源地址（app.js 文件）
      _this.Fnloadjs(url);
    },
   
    Fnloadjs:function(url){  //加载js 1: 加载中 2:加载完成
      var _this = KJ;

      if(_this.jsCache[url] === 1 || _this.jsCache[url] === 2)return;    //防止重复加载  

      var script = _this.Fncel("script");
      _this.jsCache[url]=1;       

      script.onload = function(){//加载完成
        _this.jsCache[url]=2;
        document.body.removeChild(script);
      }
      
      script.src = url + (_this.cachevesion?"?v="+_this.cachevesion:"");
      document.body.appendChild(script);
    },
  
    Fnloadcss:function(url){   //加载css 1: 加载中 2:加载完成
      var _this = KJ;
      
      if(_this.cssCache[url] === 1 || _this.cssCache[url] === 2)return;
      var link = _this.Fncel("link");
      _this.cssCache[url] = 1;

      link.onload = function(){  //加载完成
        _this.cssCache[url] = 2;
      }

      link.rel = "stylesheet";
      link.href = url +(_this.cachevesion?"?v="+_this.cachevesion:"");
      document.head.appendChild(link);
    },
    
    Fncel:function(ename){ //创建元素
      return document.createElement(ename)
    },

    Fnpage:function(url){  //切换标签模式加载页面 页面root节点全刷
      var _this = KJ,DomRoot;
      
      var u = url?url:_this.config.u;   //html页面路径

      if(u != _this.config.u){  //切换时当前页不是首页
        DomRoot = _this.Fnfindel("#"+_this.config.template);
      }else{
        DomRoot = _this.Fnfindel("#"+_this.config.DomRoot);  //在页面上找到刷入点（页面切换由此节点内容改变）
      }
      console.log("rul",u,url,DomRoot);

      if(_this.htmlCache[u]){              //判断是否有缓存，有则从缓存拿取
        console.log("有缓存从缓存中拿到了");
        DomRoot.innerHTML = _this.htmlCache[u];
        _this.FnRunjs(_this.jsCache[u],DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
        return;
      }

      _this.FngetTemplate(u,function(html){  //加载html页面
        DomRoot.innerHTML = html;
        var scriptList = _this.Fnfindel("#"+DomRoot.getAttribute("id"),"script");   //获取插入页面script
        _this.jsCache[u] = scriptList;
        _this.FnRunjs(scriptList,DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
      });     
      
    },

    // FnRepage:function(obj){  //切换标签模式加载页面 页面root节点全刷
    //   var _this = KJ,DomRoot;
      

    //   if(u != _this.config.u){  //切换时当前页不是首页
    //     DomRoot = _this.Fnfindel("#"+_this.config.template);
    //   }else{
    //     DomRoot = _this.Fnfindel("#"+_this.config.DomRoot);  //在页面上找到刷入点（页面切换由此节点内容改变）
    //   }
    //   console.log("rul",u,url,DomRoot);

    //   if(_this.htmlCache[u]){              //判断是否有缓存，有则从缓存拿取
    //     console.log("有缓存从缓存中拿到了");
    //     DomRoot.innerHTML = _this.htmlCache[u];
    //     _this.FnRunjs(_this.jsCache[u],DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
    //     return;
    //   }

    //   _this.FngetTemplate(u,function(html){  //加载html页面
    //     //console.log("appendchilid",html);
    //     // DomRoot.innerHTML = html;
    //     DomRoot.innerHTML = html;
    //     var scriptList = _this.Fnfindel("#"+DomRoot.getAttribute("id"),"script");   //获取插入页面script
    //     _this.jsCache[u] = scriptList;
    //     _this.FnRunjs(scriptList,DomRoot);  //运行通过innerhtml插入不能运行的script   页面中的script
    //     //console.log("scrotpt",scriptList)
    //   });     
      
    // },

    Fnfindel:function(ename,child){  //ename查找元素,返回元素  child查找所有对应的子元素
      if(child){
        return document.querySelector(ename).querySelectorAll(child);
      }
      return document.querySelector(ename);
    },

    FnRunjs:function(scriptList,DomRoot){  //由于innerHTML插入的script不能运行，此方法用来运行插入的script
      var _this = KJ;
      //console.log("box_img",DomRoot);
      for(var i=0,len=scriptList.length;i<len;i++){
        var script = _this.Fncel("script");
        script.innerHTML = scriptList[i].innerHTML;
        
        DomRoot.appendChild(script);
        
        DomRoot.removeChild(script);
      }  
    },

    FngetTemplate:function(u,callback){ //加载html页面
      var _this = KJ;
   
      var url = _this.config.page + u;
      var xhr = new XMLHttpRequest(); //请求  路径  异步
      xhr.open("GET",url,true); 
      xhr.onreadystatechange = function(){   //每当 readyState 改变时，就会触发 onreadystatechange 事件。
        if(xhr.readyState == 4 && xhr.status == 200){
          callback(xhr.responseText);
          _this.FnCacheHTML(u,xhr.responseText);
        }
      }
      xhr.send();
      
    },

    FnCacheHTML:function(u,html){  //缓存html
      var _this = KJ;
      
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

    PageJump:function(el){  //页面跳转方法
      var _this = this;
      var storage = sessionStorage[_this.config.routeStorage];
      var url = el.getAttribute("data-url");
      _this.config.App= {url:url,count:_this.config.count};
      //location.hash = url;
      
      _this.FnhashChange(_this.config.routeStorage);
      //_this.FnMultiwindow(url);
      storage?_this.config.count = _this.FnJSON(storage).length:"";
      // sessionStorage[routeStorage]?
      location.hash = _this.config.count;
      
    },

    FnJSON:function(el){  //处理字符串和对象互转
      if(typeof el === "object"){
        return JSON.stringify(el);
      }
      return JSON.parse(el);
    },

    FnhashChange:function(storage){
      var _this = this,list = [];
      //var storage = _this.config.routeStorage;
      list.push(_this.config.App);
      //console.log("hashlist",_this.config.App);
      if(sessionStorage[storage]){
        list = _this.FnJSON(sessionStorage[storage]);
        list.push(_this.config.App);
      }
      sessionStorage[storage] = _this.FnJSON(list);
    },

    // FnMultiwindow:function(url){             //存储打开窗口个数
    //   var Multiwindow = [],_this= this;
    //   if(sessionStorage["Multiwindow"]){
    //     _this.Fnquery(url)
    //     return;
    //   }
    //   Multiwindow.push({url:url,status:true});
    //   sessionStorage["Multiwindow"] = _this.FnJSON(Multiwindow);
    // },

    // Fnquery:function(url){                   //窗口唯一 以及当前窗口状态为status:true 
    //   var _this= this,boolen,list = _this.FnJSON(sessionStorage["Multiwindow"]);
    //   list.forEach((item,index) => {
    //     console.log("item",item);
    //     if(item.url == url){
    //       item.status = true;
    //       boolen = true;
    //       return;
    //     }else{
    //       item.status = false;
    //     }
    //   });
    //   if(!boolen){
    //     list.push({url:url,status:true})
    //   }
    //   sessionStorage["Multiwindow"] = _this.FnJSON(list);
    // }
  }
}()

