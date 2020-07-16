import $ from "jquery";

class ParalaxItem {
  constructor(opts) {
    this.parent = opts.parent;
    this.child = opts.child;
    this.duration = 0.9;
    this.way = 90;
    this.hook = opts.hook || 0.9;
    this.offset = this.parent.hasClass("size-box") ? "-50%" : "0";
  }
  update(y) {
    this.startPos = this.parent.offset().top - window.innerHeight * this.hook;
    this.endPos = this.startPos + window.innerHeight * this.duration;
    if (y - this.startPos >= 0 && this.endPos - y >= 0) {
      this.currentOffset =
        (this.way / (this.endPos - this.startPos)) * (y - this.startPos);
      this.child.css(
        "transform",
        "translate3d(" + this.offset + "," + this.currentOffset + "px,0)"
      );
    } else if (y - this.startPos < 0) {
      this.child.css("transform", "translate3d(" + this.offset + ",0,0)");
    } else if (this.endPos - y < 0) {
      this.child.css(
        "transform",
        "translate3d(" + this.offset + "," + this.way + "px,0)"
      );
    }
  }
}

export default class Controller_paralax {
  constructor() {
    this._init();
  }
  _init() {
    this.init();
    globalListener.on("scroll", (y) => {
      this.paralaxItems.forEach((item) => {
        item.update(y);
      });
    });
  }
  init() {
    this.paralaxItems = [];
    let that = this;
    $(".paralax-box").each(function () {
      that.paralaxItems.push(
        new ParalaxItem({
          parent: $(this),
          child: $(this).find(".paralax-item"),
          hook: $(this).attr("data-hook"),
        })
      );
    });
  }
}
