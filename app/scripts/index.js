import $ from "jquery";
import App from "./main.js";

window.$ = $;
window.Config = {
  debug: true,
};



$(document).ready(function () {
  let app = new App();
  
  expenseCalculator();
});

function expenseCalculator() {
  let sectionType; // 0 - герметик (по-умолчанию), 1 - пена
  
  try {
    sectionType = sectionName === "Герметики" ? 0 : 1;
  } catch (err) {
    sectionType = 0;
  }

  if (sectionType) {
    document.querySelector(".prodInfo-calc-result-item").remove();
    $(".prodInfo-calc-result-item > span").text("Потребуется баллонов");
  }

  const form = $(".prodInfo-calc");

  const submitButton = form.find(".field-submit");

  const xField = form.find("input[name=\"x\"]");
  const yField = form.find("input[name=\"y\"]");
  const zField = form.find("input[name=\"z\"]");

  inputControl(xField, form.data("x-max"));
  inputControl(yField, form.data("y-max"));
  inputControl(zField, form.data("z-max"));

  submitButton.click(function (event) {
    event.preventDefault();

    const xValue = xField.val();
    const yValue = yField.val();
    const zValue = zField.val();

    if (isValidInput(xValue, yValue, zValue)) {
      const resultFields = $(".prodInfo-calc-result-item");
      
      const germField = $("#germ");
      const cartField = $("#cart");

      const germResult = (xValue * 10) * (yValue * 0.01) * (zValue * 0.01);

      const cartValue = form.data("cart-value");

      const cartResult = Math.ceil(germResult / cartValue);
      const germResultRound = Math.round(germResult * 100) / 100;

      germField.text(germResultRound);
      cartField.text(cartResult);

      if (!resultFields.hasClass("open")) {
        resultFields.addClass("open");
      }
    } else {
      console.log("Not valid input");
    }
  });

  function inputControl(inputField, maxValue) {
    const inputFieldElement = inputField[0];

    inputFieldElement.oninput = function (event) {
      const lastInputStr = $(this).val();
      const lastInputChar = lastInputStr.slice(-1);
  
      if (isDigit(lastInputChar)) {
        if (lastInputStr.length == 1 && lastInputChar == "0") {
          $(this).val("");
        }
      } else {
        $(this).val(lastInputStr.substr(0, lastInputStr.length - 1));
      }

      const resultInputValue = $(this).val();
      if (resultInputValue > maxValue) {
        // $(this).val(lastInputStr.substr(0, lastInputStr.length - 1));
        $(this).val(maxValue);
      }
    };

    inputFieldElement.onblur = function (event) {
      const inputValue = $(this).val();
  
      if (!inputValue || inputValue === "0") {
        $(this).val(1);
      }
    };
  }

  function isDigit(char) {
    if (
      char === "0" ||
      char === "1" ||
      char === "2" ||
      char === "3" ||
      char === "4" ||
      char === "5" ||
      char === "6" ||
      char === "7" ||
      char === "8" ||
      char === "9"
    ) {
      return true;
    }

    return false;
  }

  function isValidInput(x, y, z) {
    if (
      x > 0 && y > 0 && z > 0 &&
      x <= form.data("x-max") &&
      y <= form.data("y-max") &&
      z <= form.data("z-max")
    ) {
      return true;
    }

    return false;
  }
}
