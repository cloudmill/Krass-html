import $ from "jquery";

export default class PreloaderController {
  constructor() {
    this.handlers = [];
    this.init();
  }
  init() {
    $("html").addClass("loading");
    $("html").addClass("closeScroll");
    if (document.readyState === "complete") {
      this.load();
    } else {
      window.onload = () => {
        this.load();
      };
    }
  }
  onLoad(handler) {
    this.handlers.push(handler);
  }
  afterLoad() {
    setTimeout(()=>{
      this.handlers.forEach((item) => {
        item();
      });
    },300)
    
    $("html").removeClass("closeScroll");
    $("html").removeClass("loading");
    $("html").addClass("loaded");
  }
  fasterLoad() {
    let i = 1;
    let time = setInterval(() => {
      $(".header-logo-strs span").eq(i).addClass("show");
      i++;
      if (i == 4) {
        clearInterval(time);
        this.afterLoad();
      }
    }, 300);
  }
  load() {
    var time = performance.now();
    let time2 = 0;

    let that = this;
    let imgs = $(".wrapper").find("*:not(script)");
    let items = [];
    imgs.each(function () {
      var url = "";
      if (
        $(this).css("background-image") != "none" &&
        $(this).css("background-image").split("-")[0] != "linear"
      ) {
        var url = $(this).css("background-image");
      } else if (
        typeof $(this).attr("src") != "undefined" &&
        $(this).attr("tagName") == "img"
      ) {
        var url = $(this).attr("src");
      }

      url = url
        .replace('url("', "")
        .replace("url(", "")
        .replace('")', "")
        .replace(")", "");

      if (url.length > 0) {
        items.push(url);
      }
    });
    let imgCount = items.length;
    var progress = 0;
    function refreshPreloader() {
      progress++;
      var percent = Math.round((progress / imgCount) * 100);
      if (percent >= 33 && performance.now() - time > 100) {
        $(".header-logo-strs span").eq(1).addClass("show");
      }
      if (percent >= 66 && performance.now() - time > 500) {
        $(".header-logo-strs span").eq(2).addClass("show");
      }
      if (imgCount == progress) {
        $(".header-logo-strs span").eq(3).addClass("show");
        time2 = performance.now() - time;
        console.log(time2)
        if (performance.now() - time > 800) {
          that.afterLoad();
        } else {
          that.fasterLoad();
        }
      }
    }
    items.forEach(function (item) {
      var imgLoad = $("<img></img>");
      $(imgLoad).attr("src", item);
      $(imgLoad).unbind("load");
      $(imgLoad).bind("load", function () {
        refreshPreloader();
      });
    });
  }
}
