import $ from "jquery";

export default class Header {
  constructor() {
    this.del = 10;
    this.pos = 0;
    this.limitScrollForHide = 70;
    this.state = 'show';
    this.init();
  }
  show() {
    if (this.state == 'hide') {
      $(document).find(".header").removeClass("hide");
      this.state = 'show';
    }
  }
  hide() {
    let header = $(document).find(".header");
    if (this.state == 'show' && $(document).scrollTop() > this.limitScrollForHide) {
      header.addClass("hide");
      this.state = 'hide';
    }
  }
  update() {
    let scrollTop = $(document).scrollTop();
    let d = scrollTop - this.pos;
    if (scrollTop > 0) {
      $(document).find(".header").addClass("scrolled");
    } else {
      $(document).find(".header").removeClass("scrolled");
    }
    if (d < -this.del) {
      this.pos = scrollTop;
      this.show();
    } else if (d > this.del) {
      this.pos = scrollTop;
      this.hide();
    }
  }
  init() {
    this.pos = $(document).scrollTop();
    $(document).on("scroll", () => {
      this.update();
    });
  }
}
