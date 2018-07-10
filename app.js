//能够开启http服务,引入http模块
let http=require('http');
//生成路径
let path=require('path');
//生成读取文件模块
let fs=require('fs');

//配置网站根目录
let rootPath=path.join(__dirname,'www');
// console.log('根目录是:'+rootPath);
//开启服务
http.createServer((request,Response)=>{
    // console.log('请求来了');
    //根据请求的url 生成静态资源服务器中的绝对路径
    let filePath=path.join(rootPath,request.url);
    // console.log(filePath);
    let isExist=fs.existsSync(filePath);
    if(isExist){
        //存在才需要继续走  生成文件列表
        fs.readdir(filePath,(err,files)=>{
            //如果是文件
            if(err){
                console.log(err);
                // console.log('不是文件夹');
                 // 能够进到这里 说明是文件
                // 读取文件 返回读取的文件
                fs.readFile(filePath,(err,data)=>{
                    response.end(data);
                });
            }//如果是文件夹
            else{
                console.log(files);
                //直接判断是否存在首页
                if(foles.indexOf('index.html')!=-1){
                    console.log('有首页');
                    //读取首页
                    fs.readFile(path.join(filePath,'index.html'),(err,data)=>{
                        if(err){
                            console.log(err);
                        }else{
                            response.end(data)
                        }
                    })
                }
                //如果没有首页
                else{
                    //没有首页
                    let backData="";
                    for(let i=0;i<files.length;i++){
                        backData+= `<h2><a href="./${files[i]}">${files[i]}</a></h2>`;
                    }
                    response.writeHead(200, {
                        "content-type": "text/html;charset=utf-8"
                      });
                      response.end(backData);
                    }
                  }
                });
              } else {
                // 不存在 返回 404
                response.writeHead(404, {
                  "content-type": "text/html;charset=utf-8"
                });
                response.end(`
                          <!DOCTYPE HTML PUBLIC "-//IETF//DTD HTML 2.0//EN">
                          <html><head>
                          <title>404 Not Found</title>
                          </head><body>
                          <h1>Not Found</h1>
                          <p>The requested URL /index.hththt was not found on this server.</p>
                          </body></html>
                  `);
              }
              // console.log(filePath,isExist);
          
              // 响应内容
              // response.end('you come')
            })
            .listen(80, "127.0.0.1", () => {
              console.log("开始监听 127.0.0.1:80");
            });