// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var markdown = require( "markdown" ).markdown;
var fs = require('fs');

var app = express();

// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'ejs');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件
app.use(express.static('public'));
//app.use(express.static(__dirname + '/public'));
//app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function(req, res) {
  res.render('readme');
});

app.get('/test', function(req, res) {
  //res.redirect('/help');
  res.render('test');
});

// // 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/help', function(req, res) {
  var rmPath = __dirname + '/../README.md';
  var data = fs.readFileSync(rmPath,'utf-8');
  var pageContent=markdown.toHTML(data);
  //res.render('md', { md: pageContent });
  res.send(pageContent);
});

app.get('/:dateString/:resolutionCode',function(req, res){
  var ds = req.params.dateString;
  var rc= req.params.resolutionCode;
  var imageRepositoryUrl="http://s.cn.bing.net";
  var Bing = AV.Object.extend("Bing");
  var query = new AV.Query(Bing);

  query.equalTo("date",ds);
  query.find({
    success: function(results)
    {
      var bingObj= results[0];
      var rtn={};
      var resolutionString = getResolutionCodeDictionary()[rc];
      rtn.url=imageRepositoryUrl+bingObj.get('urlbase')+resolutionString;
      rtn.date=ds;
      rtn.resolution=resolutionString;
      res.send(rtn);
    },
    error: function(error) {
  }});
});

function getResolutionCodeDictionary(){
  var dic={};
  dic.MWVGA="_480x800.jpg";
  dic.WVGA="_800x480.jpg";
  dic.MXGA="_768x1024.jpg";
  dic.XGA="_1024x768.jpg";
  dic.MWXGA="_720x1280.jpg";
  dic.WXGA="_1280x720.jpg";
  dic.MWXGAPlus="_768x1366.jpg";
  dic.WXGAPlus="_1366x768.jpg";
  dic.MWUXGA="_1200x1920.jpg";
  dic.WUXGA="_1920x1200.jpg";
  //console.log(dic);
  return dic;
}
// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();
