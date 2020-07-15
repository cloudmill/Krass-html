import $ from "jquery";

class FixedItem {
  constructor(target) {
    this.target = target;
    this.base = this.target.closest(".fixed-base");
    this.baseOffsetTop = this.base.offset().top;
    this.box = this.base.find(".fixed-box");
    this.maxWidth = parseInt(this.base.attr("data-max-width"));
    this.h = this.target.find(">*").height();
    this.top = 50;
  }
  update(yease, y) {
    let headerH = $(".header").height() + $(".header").offset().top - y;
    let offsetY = this.box.offset().top;
    let bottomOffsetBase = this.baseOffsetTop + this.base.height();
    let offsetTop = 0;
    let overTop = 0;
    if ($(window).width() + 6 <= this.maxWidth) {
      this.clear();
      return true;
    }
    if (y + headerH + this.top > offsetY) {
      offsetTop = y + headerH + this.top - offsetY;
    }
    if (y + this.h + this.top + headerH >= bottomOffsetBase) {
      overTop = yease + this.h + this.top + headerH - bottomOffsetBase;
    }

    this.target.css("transform", "translate3d(0," + offsetTop + "px,0)");
    this.target.css("top", "-" + overTop + "px");
  }
  clear() {
    this.target.css("transform", "translate3d(0,0,0)");
    this.target.css("top", 0);
  }
}

export default class Controller_fixed {
  constructor() {
    this._init();
  }
  init() {
    this.fixedItems = [];
    let that = this;
    $(".fixed-item").each(function () {
      that.fixedItems.push(new FixedItem($(this)));
    });
  }
  _init() {
    this.init();
    window.onScroll((yease, ybase) => {
      this.fixedItems.forEach((item) => {
        if (item.update) item.update(yease, ybase);
      });
    });
  }
}
