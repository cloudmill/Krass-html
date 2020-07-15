import $ from "jquery";

export default class Controller_difAnimate {
  constructor() {
    this.init();
    globalListener.on('preloader-load', () => {
      this.showItemsAfterload();
    })
    globalListener.on('XHR-complate', () => {
      this.init();
      this.showItemsAfterload();
    })
  }
  init() {
    this.productDetailTabChange();
    this.menuTabsLineMoving();
  }

  showItemsAfterload() {
    let clearStyleHide = (items) => {
      let groupsItems = [];
      items.each((key, item) => {
        let group = item.getAttribute("data-group");
        if (groupsItems[group]) {
          groupsItems[group].push(item);
        } else {
          groupsItems[group] = [];
          groupsItems[group].push(item);
        }
      });
      let i = 0;
      let time = setInterval(() => {
        let lenght = 0;
        groupsItems.forEach((group) => {
          if (lenght < group.length) lenght = group.length;
          if (group.length > i) {
            let item = group[i];
            if (!$(item).hasClass("play")) {
              $(item).addClass("play");
            }
          }
        });
        i++;
        if (i == lenght) {
          clearInterval(time);
          time = null;
        }
      }, 200);
    }

    setInterval(() => {
      let items = $(document).find(".show-item");
      if (!this.time && items.length > 0) clearStyleHide(items);
    }, 100);
  }

  productDetailTabChange() {
    if ($(".prodInfo-menu").length > 0) {
    }
    let updateState = function (y) {
      $(".prodInfo-tab").each((key, item) => {
        let center = y + $(window).height() / 3;
        if ($(item).offset().top < center) {
          if ($(item).offset().top + $(item).height() > center) {
            $(".prodInfo-menu-link").removeClass("active");
            $(".prodInfo-menu-link").eq(key).addClass("active");
          }
        }
      });
    };
    $(".prodInfo-menu-link").click(function () {
      let index = $(this).index();
      let item = $(".prodInfo-tab").eq(index);
      $("html, body").animate(
        { scrollTop: item.offset().top - $(window).height() / 3 + 50 },
        500
      );
    });
    if (globalListener.checkInit('productDetailTabChange')) {
      window.onScroll((yease, y) => {
        if (updateState) updateState(y);
      });
    }
  }
  menuTabsLineMoving() {
    if ($(".sert-content-menu").length > 0) {
      let update = function (item) {
        $(".sert-content-menu-progress").width(item.width());
        let left = item.offset().left - $(".sert-content-menu").offset().left;
        $(".sert-content-menu-progress").css("left", left + "px");
      };
      $(".sert-content-menu-item").click(function () {
        update($(this));
      });
      $(".sert-content-menu-item").click(function () {
        update($(this));
      });
      update($(".sert-content-menu-item").eq(0));

      if (globalListener.checkInit('menuTabsLineMoving')) {
        $(window).resize(() => {
          update($(".sert-content-menu-item.active"));
        });
      }
    }
  }
}
