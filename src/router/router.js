function Router(){
  this.routers = {};
  this.hash = {}
}
Router.prototype.listenerHashchange = function(){
  window.addEventListener("hashchange",this.Fnhashchange,false);//监听hash
    
  window.addEventListener('load',this.loadchange, false); // 页面加载事件,监听本页面刷新，防止死循环
}

Router.prototype.Fnhashchange = function(){
  var value = location.hash.slice(1);              
  var storage = sessionStorage[KJ.config.routeStorage];     
  if(value){                                             //hash是否存在  不存在首页
    if(storage && KJ.FnJSON(storage)[value]){            //hash是否被人手动修改   修改值没有记录 跳转首页
      this.currentHash = KJ.FnJSON(storage)[value].url;
    }else{
      this.currentHash = KJ.config.u;
    }
  }else{
    this.currentHash = KJ.config.u;
  }

  KJ.Fnpage(this.currentHash);
}

Router.prototype.loadchange = function(){
  
  var value = location.hash.slice(1);              
  var storage = sessionStorage[KJ.config.routeStorage];     
  if(value){                                             //hash是否存在  不存在首页
    if(storage && KJ.FnJSON(storage)[value]){            //hash是否被人手动修改   修改值没有记录 跳转首页
      this.currentHash = KJ.FnJSON(storage)[value].url;
    }
  }
  console.log("xxxxxxxxxxxxcadawdw");
  if(this.currentHash == KJ.config.u || !this.currentHash) return;
  console.log("this.currentHashxxxxxxxcadawdw",this.currentHash);
  KJ.Fnpage(this.currentHash);
}

// Router.prototype.loadChange = function(){
//   //var value = location.hash.slice(1); 
//   var Multiwindow;  
//   if(!sessionStorage["Multiwindow"])return;

//   Multiwindow = KJ.FnJSON(sessionStorage["Multiwindow"]);
//   console.log(Multiwindow);
//   Multiwindow.forEach(item => {
//     KJ.FnRepage(Multiwindow);
//   });
  
// }
// class Router {
//   constructor(){
//     this.routers = {}
//     this.hash = {}
//   }
//   // hash路由模式
//   listenerHashchange(){
//     window.addEventListener("hashchange",this.Fnhashchange,false);//监听hash
    
//     window.addEventListener('load',this.Fnhashchange, false); // 页面加载事件,监听本页面刷新，防止死循环
//   }

//   Fnhashchange(el){  //监听hash值变化
//     var value = location.hash.slice(1);
//     var storage = sessionStorage[KJ.config.routeStorage];
//     if(value){
//       if(storage && KJ.FnJSON(storage)[value]){
//         this.currentHash = KJ.FnJSON(storage)[value].url;
//       }else{
//         this.currentHash = KJ.config.u;
//       }
//     }else{
//       this.currentHash = KJ.config.u;
//     }

//     KJ.Fnpage(this.currentHash);
//   }

  

//   //history路由模式
//   listenerPopState(){
//     window.addEventListener("popstate",function(el){
//       console.log("el",el);
//     })
//   }

//   init(path) {
//     history.replaceState(null, null, path);
//   }
//   register(url,callback){    //注册每个视图 url文件路径  callback返回的html
//     this.routers[url] = callback;
//   }
//   pushState(url,callback){                 //往游览器中新添记录
//     history.pushState(null,null,url);
//     // callback();
//   }
//   replaceState(url,callback){                //将当前url地址记录修改为将要跳转的url地址
//     history.replaceState({url},null,url);
//     // callback(url);
//   }
// }