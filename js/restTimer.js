var restSeconds = 45;
var offsetSeconds = 5;
var countDown = null;

function init() {
  $("#restTimer").text(restSeconds);
  $("#decrease").text("-" + offsetSeconds);
  $("#increase").text("+" + offsetSeconds);
  $("#workout").hide();
  $("#decrease").click(function() {
    decreaseTimer();
  });
  $("#increase").click(function(){
      increaseTimer();
  });
  $("#rest").click(function() {
    restStart();
  });
  $("#workout").click(function() {
        restStop();
  });
}

function decreaseTimer() {
    var currentTimer = $("#restTimer").text();
    if (currentTimer - offsetSeconds > 0) {
      $("#restTimer").text(currentTimer - offsetSeconds);
    }
}

function increaseTimer() {
  var currentTimer = parseInt($("#restTimer").text());
  $("#restTimer").text(currentTimer + offsetSeconds);
}

function restStart() {
  $("#rest").hide();
  $("#workout").show();
  restSeconds = parseInt($("#restTimer").text());
  var countDownSeconds = parseInt($("#restTimer").text());
  $("#decrease").prop("disabled",true);
  $("#increase").prop("disabled",true);
    countDown = setInterval(function() {
    countDownSeconds--;
    $("#restTimer").text(countDownSeconds);
    if (countDownSeconds < 0) {
      restStop();
    }
  }, 1000);
}

function restStop() {
  clearInterval(countDown);
  $("#workout").hide();
  $("#rest").show();
  $("#decrease").prop("disabled",false);
  $("#increase").prop("disabled",false);
  $("#restTimer").text(restSeconds);
}

$(document).ready(function() {
  init();
});
