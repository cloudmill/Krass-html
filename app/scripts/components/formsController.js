import $ from "jquery";
import "select2";

export default class FormsController {
  constructor() {
    this.initSelect2();
    this.initErrorsChecker();
  }
  initSelect2() {
    $(".field-select select").each((key, select) => {
      $(select).select2({
        minimumResultsForSearch: Infinity,
        dropdownParent: $(".selectArea"),
      });
      $(select).on("select2:open", function (e) {
        $(".selectArea").addClass("active");
        var html = $(select)
          .parent()
          .find(".select2-selection__rendered")
          .eq(0)[0].outerHTML;
        console.log(html);
        $(".select2-dropdown").find(".select2-selection__rendered").remove();
        $(".select2-dropdown").append(html);
        if($(select).parent().parent().hasClass('field-filter')){
          $(".select2-dropdown").addClass('select2-filter-view')
        }
        
        $("html").addClass("closeScroll");
      });
      $(select).on("select2:closing", function (e) {
        $(".selectArea").removeClass("active");
        $("html").removeClass("closeScroll");
      });
    });
    $(document).on(
      "click",
      ".select2-dropdown .select2-selection__rendered",
      function (e) {
        $(select).select2("close");
      }
    );
  }
  initErrorsChecker() {
    let inputs = $(".field").find("input");
    let error = function (input) {
      input.closest("label").addClass("error");
      if (window.Config.debug) {
        console.error("field " + input.attr("name") + " invalid");
      }
    };
    let success = function (input) {
      input.parent("label").removeClass("error");
      if (window.Config.debug) {
        console.log("field " + input.attr("name") + " valid");
      }
    };
    let checkInputForRight = function (input) {
      let type = input.attr("type");
      if (input.attr("data-required")) {
        if (type == "text") {
          if (input.val() == "") {
            input.removeClass("fill");
          } else {
            input.addClass("fill");
          }
          let name = input.attr("name");
          let val = input.val();
          if (val == "") {
            error(input);
          } else {
            success(input);
          }
        } else if (type == "checkbox") {
          if (!input.eq(0)[0].checked) {
            error(input);
          } else {
            success(input);
          }
        }
      }
    };

    inputs.keyup(function () {
      checkInputForRight($(this));
    });
    inputs.change(function () {
      checkInputForRight($(this));
    });
    let checkFormRight = function (form) {
      let fields = form.find(".field");
      fields.each(function () {
        checkInputForRight($(this).find("input"));
      });
      if (form.find(".field label.error").length == 0) {
        return true;
      } else {
        return false;
      }
    };
    let forms = $("form");
    forms.submit(function (e) {
      let form = $(this);
      e.preventDefault();
      if (checkFormRight(form)) {
        if (window.Config.debug) {
          console.error("form valid");
        }
        //отправка формы
      } else {
        if (window.Config.debug) {
          console.error("form invalid");
        }
        //ошибка отправки формы
      }
    });
  }
}
