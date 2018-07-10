//需要开启http服务 申明http模块
let http = require('http');

//需要生成绝对路径 申明path模块
let path = require('path');

//需要读取文件 申明fs模块
let fs = require('fs');

//mime为的三方模块 让浏览器可以正确识别文件类型
let mime=require('mime');

//引入querystring模块
let querystring = require('querystring');

//配置网站根目录
let rootPath = path.join(__dirname, 'www');
// console.log(rootPath);

//开启http服务
http.createServer((request, response) => {
    // console.log(response);
    //根据请求的url 生成静态资源服务器中的绝对路径
    let filePath = path.join(rootPath, querystring.unescape(request.url));
    // console.log(filePath);
    //判断访问的这个目录是否存在
    let isExist = fs.existsSync(filePath);
    //如果存在 判断是文件还是文件夹
    if (isExist) {
        //只有存在才继续往下走  生成文件列表
        fs.readdir(filePath, (err, files) => {
            //不是文件夹直接返回出错  只能是文件
            if (err) {
                // console.log(err);
                //读取文件 返回读取的文件
                fs.readFile(filePath, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        //直接返回
                        //mime为第三方指令模块
                        response.writeHead(200, {
                            "content-type": mime.getType(filePath)
                        });
                        //判断文件是什么类型,设置不同的mime类型返回给浏览器
                        response.end(data);
                    }
                })
            } //如果是文件夹
            else {
                console.log(files);
                //判断是否存在首页
                if (files.indexOf('index.html') != -1) {
                    console.log('存在首页');
                    fs.readFile(path.join(filePath, 'index.html'), (err, data) => {
                        if (err) {
                            console.log(err);
                        } else {
                            response.end(data);
                        }
                    })
                } else {
                    //进到这里表示没有首页
                    let backData = "";
                    for (let i = 0; i < files.length; i++) {
                        // 根目录 request.url => /
                        // 默认拼接的都是 ./ 只能访问根目录
                        // 根据请求的url 进行判断 拼接上一级目录的地址 进行即可进行访问
                        backData+=`<h2><a href="${
                            request.url=="/"?"":request.url
                        }/${files[i]}">${files[i]}</a></h2>`;
                    }
                    response.writeHead(200,{
                        "content-type":"text/html;charset=utf-8"
                    });
                    response.end(backData);
                }
            }
        })

    }
    //如果不存在返回404
    else{
        response.writeHead(404,{
            "content-type": "text/html;charset=utf-8"
        });
        //响应和Apache一样的错误并返回
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
}).listen(80, '127.0.0.1', () => {
    console.log('开始监听  127.0.0.1:80');
})