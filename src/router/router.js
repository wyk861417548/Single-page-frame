class Router {
  constructor(){
    this.routers = {}
    this.hash = {}
  }
  // hash路由模式
  listenerHashchange(){
    window.addEventListener("hashchange",this.Fnhashchange,false);//监听hash
    
    window.addEventListener('load',this.Fnhashchange, false); // 页面加载事件,监听本页面刷新，防止死循环
  }

  Fnhashchange(el){  //监听hash值变化
    this.currentHash  = location.hash.slice(1);
    
    console.log("this.currentHashxxxxxxxxxxxxxx",this.currentHash);
    KJ.Fnpage(this.currentHash);
  }


  //history路由模式
  listenerPopState(){
    window.addEventListener("popstate",function(el){
      console.log("el",el);
    })
  }

  init(path) {
    history.replaceState(null, null, path);
  }
  register(url,callback){    //注册每个视图 url文件路径  callback返回的html
    this.routers[url] = callback;
  }
  pushState(url,callback){                 //往游览器中新添记录
    history.pushState(null,null,url);
    // callback();
  }
  replaceState(url,callback){                //将当前url地址记录修改为将要跳转的url地址
    history.replaceState({url},null,url);
    // callback(url);
  }
}