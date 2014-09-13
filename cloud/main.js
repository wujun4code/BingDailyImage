require("cloud/app.js");
var util = require('util');
var moment = require('moment');
var request = require("request");
// Use AV.Cloud.define to define as many cloud functions as you want.
// For example:
AV.Cloud.define("hello", function(request, response) {
  response.success("Hello world!");
});

AV.Cloud.define("ExcuteBingHPImageArchiveToday",function(request,response){
   pull(0,0);
});

AV.Cloud.define("ExcuteBingHPImageArchive",function(request,response){
  getIndexDate(function(err,data,offset){
    //var url = "http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US";
    pull(data,offset);
  });
});

function pull(data,offset)
{
  var url=util.format('http://www.bing.com/HPImageArchive.aspx?format=js&idx=%d&n=1&mkt=en-US', data); // 'foo:%s'
  var imageRepositoryUrl="http://s.cn.bing.net";
  request({
      url: url,
      json: true
  }, function (error, response, body) {

      if (!error && response.statusCode === 200)
      {
          //var json = JSON.parse(body);
          var today = moment();
          var duration= offset - data;
          var dateString = today.add(duration,'days').format('YYYYMMDD');
          var Bing = AV.Object.extend("Bing");
          var query = new AV.Query(Bing);
          var bing = new Bing();
          var urlbase = body["images"][0]["urlbase"];
          var hash = body["images"][0]["hsh"];
          query.equalTo("hash", hash);
          query.find({
            success: function(results) {
              //console.log(results);
              if(results.length == 0)
                {
                  bing.set("hash", body["images"][0]["hsh"]);
                  bing.set("urlbase",urlbase);
                  bing.set("apiBody",body);
                  bing.set("date",dateString);
                  bing.set("processed",true);

                  bing.save(null, {
                    success: function(bing) {
                        },
                        error: function(bing, error) {
                          //response.error(error.description);
                          }});
               }
            },error: function(error) {

            }});
      }});
}

function saveImage(url,resolutionCode,dateString){
  var Image = AV.Object.extend("Image");
  var image=new Image();
  image.set("url",url);
  image.set("resolutionCode",resolutionCode);
  image.set("dateString",dateString);
  image.save(null, {
  success: function(image) {
  },
  error: function(image, error) {

  }});
}

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
function getIndexDate(cb){
  var Bing = AV.Object.extend("Bing");
  var query = new AV.Query(Bing);
  var rtn=0;
  query.ascending("date");
  query.find({
  success: function(results) {

    // results is an array of AV.Object.
    if(results.length > 0)
      {
        var lastProcessed = results[0];
        var lastDateString=lastProcessed.get('date');
        var lastDate = moment(lastDateString, "YYYYMMDD");
        var today = moment();
        var duration = today.diff(lastDate, 'days');
        rtn = duration + 1;
        console.log(rtn);
      }
    cb(null,rtn,0);
  },

  error: function(error) {
    // error is an instance of AV.Error.
    cb(error);
  }
});
}

AV.Cloud.define("TestGameScore",function(request)
{
  var GameScore = AV.Object.extend("GameScore");
  var gameScore = new GameScore();
  gameScore.set("score", 1337);
  gameScore.set("playerName", "Sean Plott");
  gameScore.set("cheatMode", false);
  gameScore.save(null, {
  success: function(gameScore) {
    // Execute any logic that should take place after the object is saved.
  },
  error: function(gameScore, error) {
    // Execute any logic that should take place if the save fails.
    // error is a AV.Error with an error code and description.
  }});
});
