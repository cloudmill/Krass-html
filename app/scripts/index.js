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
  // режим расчета
  const MODE_1 = "sealant"; // для герметика
  const MODE_2 = "foam"; // для пены
  
  const calculationMode = MODE_1; // режим расчета для герметика по-умолчанию
  
  const form = $(".prodInfo-calc"); // форма расчета

  const submitButton = form.find(".field-submit"); // кнопка для расчета

  // поля с данными
  const xField = form.find("input[name=\"x\"]");
  const yField = form.find("input[name=\"y\"]");
  const zField = form.find("input[name=\"z\"]");

  // добавляем ограничение на ввод для полей
  inputControl(xField);
  inputControl(yField);
  inputControl(zField);

  // нажатие на кнопку для расчета
  submitButton.click(function (event) {
    event.preventDefault(); // отмета отправки формы
  
    // получение значений
    const xValue = xField.val();
    const yValue = yField.val();
    const zValue = zField.val();

    // валидация значений
    if (isValidInput(xValue, yValue, zValue)) {
      const resultFields = $(".prodInfo-calc-result-item");
      
      const germField = $("#germ");
      const cartField = $("#cart");

      // расчет расхода в литрах
      const germResult = (xValue * 10) * (yValue * 0.01) * (zValue * 0.01);

      // расчет расхода в картриджах
      const cartValue = 0.3; // объем одного картриджа в литрах
      const cartResult = Math.ceil(germResult / cartValue);

      // отображение результата
      const germResultRound = Math.ceil(germResult * 1000) / 1000; // округление объема-результата до 3 цифр после запятой 
      germField.text(germResultRound);
      cartField.text(cartResult);

      // первое появление панели с результатами
      if (!resultFields.hasClass("open")) {
        resultFields.addClass("open");
      }
    } else {
      console.log("Not valid input");
    }
  });

  // ограничение на ввод (только цифры, не начинать с нуля)
  function inputControl(inputField) {
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
    };

    inputFieldElement.onblur = function (event) {
      const inputValue = $(this).val();
  
      if (!inputValue || inputValue === "0") {
        $(this).val(1);
      }
    };
  }

  // строка - цифра?
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

  // валидация ввода - целое положительное число
  function isValidInput(x, y, z) {
    if (x > 0 && y > 0 && z > 0) {
      return true;
    }

    return false;
  }
}
