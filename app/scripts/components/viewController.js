import $ from "jquery";

export default class ViewController {
  constructor() {
    this.init();
  }
  init() {
    window.onScroll(() => {
      this.check();
    });
    this.check();
  }
  check() {
    $(".view-item").each(function () {
      var addHeight = 300;
      var height = $(this).height();
      var wHeight = $(window).height();
      var top = $(this).offset().top;

      var opacity = 1;

      if (top + addHeight > wHeight) {
        opacity = 1 - (top - wHeight + addHeight) / addHeight;
      } else {
        opacity = (top + height / 2) / addHeight;
      }
      if (opacity <= 1.1 && opacity >= 0) $(this).css("opacity", opacity);
      else if (opacity > 1.1) $(this).css("opacity", 1);
      else $(this).css("opacity", 0);
    });
  }
}
