var rounds = 8;
var roundsCount = 0;
var workSeconds = 20;
var restSeconds = 10;
var secondsOffset = 5;
var rest = true;
var countDown = null;
var intervalSeconds = null;

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
    if (rounds > 1) {
        rounds--;
        $("#rounds").text(rounds);
    }
}

function increaseRounds() {
    rounds++;
    $("#rounds").text(rounds);
}

function decreaseSeconds(actionComponent, targetComponent) {
    if (actionComponent === "work") {
        if (workSeconds > secondsOffset) {
            workSeconds -= secondsOffset;
            $(targetComponent).text(workSeconds);
        }
    } else if (actionComponent === "rest") {
        if (restSeconds > secondsOffset) {
            restSeconds -= secondsOffset;
            $(targetComponent).text(restSeconds);
        }
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

function updateRounds() {
    $("#round").text(roundsCount);
    $("#totalRounds").text(rounds);
}

function nextInterval() {
    clearInterval(countDown);
    //navigator.vibrate(2000);
    //navigator.notification.beep(2);
    if (roundsCount < rounds) {
        rest = !rest;
        if (rest) {
            $("#interval").text("Rest for");
            $("#secondsLeft").text(restSeconds);
            roundsCount++;
            countdown(restSeconds);
        } else {
            updateRounds();
            $("#interval").text("Work for");
            $("#secondsLeft").text(workSeconds);
            countdown(workSeconds);
        }
    } else {
        updateRounds();
        $("#interval").text("Tabata");
        $("#secondsLeft").text("finished");
        $("#start").show();
        $("#pause").hide();
    }
}

function countdown(seconds) {
    intervalSeconds = seconds;
    if (seconds === 1) {
        nextInterval();
    } else {
        countDown = setInterval(function () {
            intervalSeconds--;
            $("#secondsLeft").text(intervalSeconds);
            if (intervalSeconds < 1) {
                nextInterval();
            }
        }, 1000);
    }
}

function resumeWorkout() {
    $("#pause").show();
    tau.closePopup("#pausePopup");
    countdown(intervalSeconds);
}

function pauseWorkout() {
    $("#pause").hide();
    clearInterval(countDown);
    tau.openPopup("#pausePopup");
    $("#resume").click(function () {
        resumeWorkout();
    });
    $("#exit").click(function() {
        tizen.application.getCurrentApplication().exit();
    });
}

function startWorkout() {
    $("#start").hide();
    $("#pause").show();
    rest = false;
    roundsCount = 0;
    updateRounds();
    $("#interval").text("Work for");
    $("#secondsLeft").text(workSeconds);
    countdown(workSeconds);
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
        startWorkout();
    });
    $("#pause").click(function () {
        pauseWorkout();
    });
    updateRounds();
    tau.changePage("#tabataPage")
}

$(document).ready(function () {
    init();
});
