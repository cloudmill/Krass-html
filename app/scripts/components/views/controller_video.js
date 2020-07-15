import $ from "jquery";

export default class Controller_video {
  constructor() {
    this.init();
  }
  init() {
    $(".video").each(function () {
      if ($(this).find("iframe").length > 0) {
        let frame = $(this).find("iframe").eq(0)[0];
        let that = this;
        frame.onload = function () {
          this.contentWindow.document.body.onclick = function () {
            $(that).addClass("active");
          };
        };
      }
    });
    $(".video").click(function () {
      $(this).addClass("active");
    });
    $(".video-play").click(function () {
      if ($(this).parent().find("iframe").length > 0) {
        let frame = $(this).parent().find("iframe");
        let src = frame.attr("src");
        if (src.split("?").length > 1) {
          frame.attr("src", src + "&autoplay=1");
        } else {
          frame.attr("src", src + "?autoplay=1");
        }
      }
    });
    this.resize();
    $(window).resize(() => {
      this.resize();
    });
  }
  resize() {
    $(".video").each(function () {
      if ($(this).find("iframe").length > 0) {
        let frame = $(this).find("iframe");
        let k = frame.width() / frame.height();
        frame.width($(this).width());
        frame.height(frame.width() / k);
      }
    });
  }
}
