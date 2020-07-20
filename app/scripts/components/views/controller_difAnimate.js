import $ from "jquery";

export default class Controller_difAnimate {
  constructor() {
    this.correctStyles();
    this.init();
  }
  init() {
    this.productDetailTabChange();
    this.menuTabsLineMoving();
    this.lazyOpened();
    this.aboutWordsMoving();
  }

  //смена активных пунктов в фиксированном меню
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
    if (globalListener.checkInit("productDetailTabChange")) {
      globalListener.on("scroll", (yease, y) => {
        if (updateState) updateState(y);
      });
    }
  }

  //анимаци движение полосы к активному пункту
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

      if (globalListener.checkInit("menuTabsLineMoving")) {
        $(window).resize(() => {
          update($(".sert-content-menu-item.active"));
        });
      }
    }
  }

  //плавное открытие списка
  lazyOpened() {
    if ($(window).width() <= 650) {
      $(".lazy-opened").each(function () {
        $(this).height($(this).find(".lazy-opened-but").height());
      });
      $(".lazy-opened-but").click(function () {
        let parent = $(this).parent();
        parent.toggleClass("active");
        let height = $(this).height();
        if (parent.hasClass("active")) {
          height +=
            parent.find(".lazy-opened-box").height() +
            parseInt($(this).css("margin-bottom"));
          $(this).parent().find('.show-item').addClass('play')
        }
        parent.height(height);
      });
    }
    if (globalListener.checkInit("lazyOpened"))
      $(window).resize(function () {
        if ($(window).width() > 650) {
          $(".lazy-opened").attr("style", "");
        }
      });
  }

  //Движение слов на странице о нас
  aboutWordsMoving() {
    if (globalListener.checkInit("wordChangeSpeedmovingWithScroll")) {
      let state = [-100, 0, 100];
      let phaze = 0;
      let phazeStep = 0.1;
      let timeOut;
      setInterval(() => {
        if (
          $(".about-words-item").length > 0 &&
          $(".about-words-item").offset().top > $(document).scrollTop() - 80 &&
          $(".about-words-item").offset().top <
            $(document).scrollTop() + 5 + $(window).height()
        ) {
          $(".about-words-item").each(function (key) {
            let val = state[key] + phaze;
            $(this).css("transform", "translate3d(" + val + "%,0,0)");
          });
          phaze += phazeStep;
          if (phaze > 100) {
            phaze = 0;
          }
        }
      }, 10);
      globalListener.on("scroll", (y) => {
        clearInterval(timeOut);
        if ($(".about-words-item").length > 0) {
          if (phazeStep < 0.2) {
            phazeStep += 0.03;
          }
          timeOut = setInterval(() => {
            if (phazeStep > 0.1) {
              phazeStep *= 0.99;
              phazeStep = parseInt(phazeStep * 1000) / 1000;
            } else {
              phazeStep = 0.1;
              clearInterval(timeOut);
            }
          }, 10);
        }
      });
    }
  }

  //Корректировка стилей
  correctStyles() {
    let correctDuing = () => {
      if ($(window).width() < $(window).outerWidth()) {
        $("html").removeClass("touch");
        $("html").addClass("no-touch");
      } else {
        $("html").removeClass("no-touch");
        $("html").addClass("touch");
      }
      //установка позиции лого для возвращения после прелоадера
      setTimeout(() => {
        let left = $(".header-logo-box").offset().left;
        $(".header-logo").css("left", left + "px");
        //выравнивание тектса по лого
        $(".main-banner-sub").css("left", left - 40 + "px");
        $(".news-detail-box").css("left", left - 40 + "px");
        $(".page-404-content span").css(
          "left",
          -($(window).width() - 80) / 2 + left - 40 + "px"
        );
      }, 300);

      //корректировка скорости бегущей строки в большой кнопке
      $(".big-link").each(function () {
        let strs = $(this).find(".big-link-mask span");
        let widthStr = strs.eq(0).width() + 20;
        let defaultDuration = 4;
        let newDuration =
          defaultDuration *
          (widthStr / $(".big-link").find(".big-link-mask").width());
        strs.css("animation-duration", newDuration + "s");
      });
    };
    correctDuing();
    window.onresize = () => {
      correctDuing();
    };
  }
}
