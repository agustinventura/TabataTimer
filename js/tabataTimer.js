var rounds = 8;
var roundsCount = 0;
var workSeconds = 20;
var restSeconds = 10;
var secondsOffset = 5;

function init() {
    $("#rounds").text(rounds);
    $("#workSeconds").text(workSeconds);
    $("#restSeconds").text(restSeconds);
    $("#decreaseRounds").click(function () {
        decreaseRounds();
    });
    $("#increaseRounds").click(function () {
        increaseRounds();
    });
    $("#setRounds").click(function () {
        roundsSet();
    });
    $("#setWorkTime").click(function () {
        workTimeSet();
    });
    $("#setRestTime").click(function () {
        restTimeSet();
    });
}

function decreaseRounds() {
    rounds--;
    $("#rounds").text(rounds);
}

function increaseRounds() {
    rounds++;
    $("#rounds").text(rounds);
}

function decreaseSeconds(actionComponent, targetComponent) {
    if (actionComponent === "work") {
        workSeconds -= secondsOffset;
        $(targetComponent).text(workSeconds);
    } else if (actionComponent === "rest") {
        restSeconds -= secondsOffset;
        $(targetComponent).text(restSeconds);
    }
}

function increaseSeconds(actionComponent, targetComponent) {
    if (actionComponent === "work") {
        workSeconds += secondsOffset;
        $(targetComponent).text(workSeconds);
    } else if (actionComponent === "rest") {
        restSeconds += secondsOffset;
        $(targetComponent).text(restSeconds);
    }
}

function roundsSet() {
    $("#decreaseWorkSeconds").click(function () {
        decreaseSeconds("work", "#workSeconds");
    });
    $("#increaseWorkSeconds").click(function () {
        increaseSeconds("work", "#workSeconds");
    });
    tau.changePage("#workTimePage")
}

function workTimeSet() {
    $("#decreaseRestSeconds").click(function () {
        decreaseSeconds("rest", "#restSeconds");
    });
    $("#increaseRestSeconds").click(function () {
        increaseSeconds("rest", "#restSeconds");
    });
    tau.changePage("#restTimePage")
}

function restTimeSet() {
    $("#start").click(function () {
        $("#start").hide();
        $("#stop").show();
    });
    $("#stop").click(function () {
        $("#stop").hide();
        $("#start").show();
    });
    $("#round").text(roundsCount);
    $("#roundsLeft").text(rounds - roundsCount);
    tau.changePage("#tabataPage")
}

$(document).ready(function () {
    init();
});
