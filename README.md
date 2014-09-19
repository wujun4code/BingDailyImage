BingDailyImage
==============

# API
* http://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US
* supported standard:"480×800"(MWVGA), "800×480"(WVGA), "768×1024"(MXGA), "1024×768"(XGA), "720×1280"(MWXGA), "1280×720"(WXGA), "768×1366"(MWXGAPlus), "1366×768"(WXGAPlus), "1200×1920"(MWUXGA), "1920×1200"(WUXGA)

# Request
## BaseUrl
[https://hellobing.avosapps.com](https://hellobing.avosapps.com)

## Parameters
/dateString/resolutionCode

** Because Bing provides API for recent 15 days, so BingDailyImage provider API from 2014-08-28. **

## Sample
get [Bing](http://cn.bing.com/) homepage background images at 2014-09-11 with a image resolution in 800x480,you can call 

```
https://hellobing.avosapps.com/20140911/WVGA
```
and if you want to get a different height and width in the same resolution, you should set the resolutionCode with an "m" before the resolution code, for example, if you want to get a 480x800 image, you can request the API like this

```
https://hellobing.avosapps.com/20140911/MWVGA
```


## Response
```
{
   "url":"http://s.cn.bing.net/az/hprichbg/rb/Fanjingshan_ZH-CN11691452911_800x480.jpg",
   "date":"20140911",
   "resolution":"_800x480.jpg"
}
```
