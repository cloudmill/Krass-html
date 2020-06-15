import $ from "jquery";
import "jquery-mousewheel";
import "malihu-custom-scrollbar-plugin";

export default class ScrollController {
  constructor() {
    this.handlers = [];
    window.onScroll = this.onScroll.bind(this);
    this.init();
  }
  onScroll(handler) {
    console.log(handler);
    this.handlers.push(handler);
  }
  update() {
    this.handlers.forEach((item) => {
      item();
    });
  }
  init() {
    $(".scroll-box").mCustomScrollbar({
      scrollInertia: 800,
      mouseWheel: {
        enable: true,
        deltaFactor: 30,
        //normalizeDelta: 1,
        scrollAmount: 200,
      },
      keyboard: {
        enable: true,
      },
      contentTouchScroll: 25,
      documentTouchScroll: true,
      callbacks: {
        whileScrolling: this.update.bind(this),
      },
    });
  }
}
