import $ from "jquery";

export default class Header {
  constructor() {
    this.del = 10;
    this.pos = 0;
    this.state = 1;
    this.init();
  }
  show() {
    if (this.state == 0) {
      $(document).find(".header").removeClass("hide");
      this.state = 1;
    }
  }
  hide() {
    let header = $(document).find(".header");
    if (this.state == 1 && $(document).scrollTop() > header.height()) {
      header.addClass("hide");
      this.state = 0;
    }
  }
  update() {
    let pos = $(document).scrollTop();
    let d = pos - this.pos;
    if (pos > 100) {
      $(document).find(".header").addClass("scrolled");
    } else {
      $(document).find(".header").removeClass("scrolled");
    }
    if (d < -this.del) {
      this.pos = pos;
      this.show();
    } else if (d > this.del) {
      this.pos = pos;
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
