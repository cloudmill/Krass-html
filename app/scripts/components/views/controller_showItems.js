import $ from "jquery";

class GroupAnimate {
  constructor() {
    this.items = [];
    this.state = "wait";
  }
  add(item) {
    let p = item.parent();
    this.items.push({
      el: item,
      top: p.offset().top,
      center: p.offset().top + item.height() / 2,
      bottom: p.offset().top + item.height(),
    });
  }
  play() {
    if (this.state == "wait") {
      this.state = "play";
      let i = 0;
      this.time = setInterval(() => {
        if (this.items.length > i) {
          let item = this.items[i].el;
          if (!item.hasClass("play")) {
            item.addClass("play");
          }
        }
        i++;
        if (i == this.items) {
          clearInterval(this.time);
          this.state = "complate";
          this.time = null;
        }
      }, 200);
    }
  }
  check(y) {
    if (this.state == "wait") {
      let wHeight = $(window).height();
      this.items.forEach((item, key) => {
        if (y + wHeight > item.top && y < item.bottom) {
          this.play();
        }
      });
    }
  }
  update() {
    if (this.state == "wait") {
      this.items.forEach((item, key) => {
        let p = item.el.parent();
        item.top = p.offset().top;
        item.center = p.offset().top + item.el.height() / 2;
        item.bottom = p.offset().top + item.el.height();
      });
    }
  }
}

export default class Controller_showItems {
  constructor() {
    this.init();
    this.ready = false;
    globalListener.on("scroll", (y) => {
      if (this.ready) this.check(y);
    });
    globalListener.on("preloader-load", () => {
      this.ready = true;
      this.check($(document).scrollTop());
    });
    globalListener.on("XHR-complate", () => {
      this.ready = true;
      this.check($(document).scrollTop());
    });
    globalListener.on("XHR-start", () => {
      this.ready = false;
    });
    globalListener.on("resize", () => {
      this.update();
    });
  }

  init() {
    this.items = $(".show-item");
    this.groups = [];
    this.items.each((key, item) => {
      let group = $(item).attr("data-group");
      if (!this.groups[group]) {
        this.groups[group] = new GroupAnimate();
      }
      this.groups[group].add($(item));
    });
  }
  check(y) {
    for (let key in this.groups) {
      let item = this.groups[key];
      item.check(y);
    }
  }
  update() {
    for (let key in this.groups) {
      let item = this.groups[key];
      item.update();
    }
  }
}
