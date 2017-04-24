/*
 * @jqueryplugin 
 * @author saorbah
 * @date 23rd April, 2017
 * A jquery custome plugin which enables html5 slider
 *
 */
(function() {

  var parent = document.querySelector(".range-slider"),
      rangeS = parent.querySelectorAll("input[type=range]"),
      numberS = parent.querySelectorAll("input[type=number]");


  Array.prototype.forEach.call(rangeS, function(el) {
    el.oninput = function() {
      var slide1 = parseFloat(rangeS[0].value),
          slide2 = parseFloat(rangeS[1].value);

      if (slide1 > slide2) {
        var tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
      }

      numberS[0].value = slide1;
      numberS[1].value = slide2;
    }
  });

  Array.prototype.forEach.call(numberS, function(el) {
    el.oninput = function() {
      var number1 = numberS[0].value,
        number2 = numberS[1].value;

      if (number1 > number2) {
        var tmp = number2;
        number2 = number1;
        number1 = tmp;
      }

      rangeS[0].value = number1;
      rangeS[1].value = number2;

    }
  });

})();