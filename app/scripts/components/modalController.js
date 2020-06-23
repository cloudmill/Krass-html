import $ from "jquery";
class Modal {
  constructor(el) {
    this.el = el;
    this.childs = $(this.el).find(".zoom-hide-item");
    this.cCount = this.childs.length;
    this.state = "close";
    this.id = this.el.id;
    this.animate = false;
  }
  open(handler = () => {}) {
    if (!this.animate) {
      this.animate = true;
      this.el.classList.add("active");
      setTimeout(() => {
        if (this.cCount == 0) {
          //если нету дочерней анимации открытия
          this.state = "open";
          this.animate = false;
          handler();
        } else {
          //если есть
          let i = 0;
          this.childs.each((key, child) => {
            setTimeout(() => {
              $(child).addClass("show");
            }, i * 80);
            i++;
            if (i == this.cCount) {
              this.state = "open";
              this.animate = false;
              handler();
            }
          });
        }
      }, 800);
    }
  }
  close(handler = () => {}) {
    if (!this.animate) {
      this.animate = true;
      if (this.cCount == 0) {
        //если нету дочерней анимации открытия
        this.el.classList.remove("active");
        this.state = "close";
        this.animate = false;
        handler();
      } else {
        //если есть
        let i = 0;
        this.childs.each((key, child) => {
          setTimeout(() => {
            $(child).removeClass("show");
          }, i * 80);
          i++;
          if (i == this.cCount) {
            setTimeout(() => {
              this.el.classList.remove("active");
              this.state = "close";
              this.animate = false;
              handler();
            }, this.cCount * 80);
          }
        });
      }
    }
  }
}
export default class modalController {
  constructor() {
    this.modals = [];
    this.count = 0;
    this.init();
    this.state = "close";
  }
  init() {
    var that = this;
    $(document)
      .find(".modal-item")
      .each((key, item) => {
        let id = item.getAttribute("id");
        this.modals[id] = new Modal(item);
        this.count++;
      });

    $(".js-modal").click(function (e) {
      e.preventDefault();
      let id = $(this).attr("href").replace("#", "");
      that.openModal(id);
    });
    $("[data-modal-close]").click(() => {
      this.closeAll();
    });
    $(document).mouseup((e) => {
      if (this.state == "open") {
        var container = $(".modal-item > *");
        if (container.has(e.target).length === 0) {
          this.closeAll();
        }
      }
    });
  }
  openModal(id) {
    $("html").addClass("closeScroll");
    if (this.state == "close") {
      $(".modal").addClass("active");
      this.modals[id].open(() => {
        this.state = "open";
      });
    } else {
      for (let key in this.modals) {
        let item = this.modals[key];
        if (item.state == "open") {
          item.close();
        }
      }
      this.modals[id].open(() => {
        this.state = "open";
      });
    }
  }
  closeAll() {
    let i = 0;
    for (let key in this.modals) {
      let item = this.modals[key];
      if (item.state == "open")
        item.close(() => {
          i++;
          if (i == this.count) {
            this.state = "close";
            $(".modal").removeClass("active");
            $("html").removeClass("closeScroll");
          }
        });
      else {
        i++;
        if (i == this.count) {
          this.state = "close";
          $(".modal").removeClass("active");
          $("html").removeClass("closeScroll");
        }
      }
    }
  }
}
