import $ from "jquery";
export default class modalController {
  constructor() {
    this.headerProd();
  }
  headerProd() {
    var headerProd = {
      state: "close",
      animate: false,
      open: function () {
        this.animate = true;
        $(".header-product").addClass("active");
        setTimeout(() => {
          let i = 0;
          $(".header-product-item").each(function () {
            setTimeout(() => {
              $(this).addClass("show");
            }, i * 80);
            i++;
          });
          setTimeout(() => {
            this.animate = false;
            this.state = "open";
          }, 600);
        }, 600);
      },
      close: function () {
        this.animate = true;
        let i = 0;
        $(".header-product-item").each(function () {
          setTimeout(() => {
            $(this).removeClass("show");
          }, i * 80);
          i++;
        });
        setTimeout(() => {
          $(".header-product").removeClass("active");
          setTimeout(() => {
            this.animate = false;
            this.state = "close";
          }, 1250);
        }, i * 80);
      },
    };
    $(".header-product").click(function () {
      if (!headerProd.animate) {
        if (headerProd.state == "close") {
          headerProd.open();
        } else {
          headerProd.close();
        }
      }
    });
  }
}
