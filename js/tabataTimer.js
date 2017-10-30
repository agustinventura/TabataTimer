var rounds = 8;
var roundsCount = 0;
var workSeconds = 20;
var restSeconds = 10;
var secondsOffset = 5;
var rest = true;
var countDown = null;
var intervalSeconds = null;
var paused = false;

function init() {
    $("#rounds").text(rounds);
    $("#workSeconds").text(workSeconds);
    $("#restSeconds").text(restSeconds);
    $("#setRounds").click(function () {
        roundsSet();
    });
    $("#setWorkTime").click(function () {
        workTimeSet();
    });
    $("#setRestTime").click(function () {
        restTimeSet();
    });
    document.addEventListener('rotarydetent', function(ev) {
		setsRotaryControl(ev);
	});
    window.addEventListener('tizenhwkey', function onTizenHwKey(e) {
        var activePageId = tau.activePage.id;
        if (e.keyName === 'back') {
            if (activePageId === 'roundsPage') {
            	tizen.application.getCurrentApplication().exit();
            } else if (activePageId === 'tabataPage') {
                if (countDown !== null) {
                	if (!paused) {
                		pauseWorkout();
                	} else {
                		resumeWorkout();
                	}
                } else {
                	history.back();
                }
            } else {
                history.back();
            }
        }
    });
}

function setsRotaryControl(ev) {
	var direction = ev.detail.direction;
	if (direction === "CW") {
		increaseRounds();
	} else {
		decreaseRounds();
	}
}

function workRotaryControl(ev) {
	var direction = ev.detail.direction;
	if (direction === "CW") {
		increaseSeconds("work", "#workSeconds");
	} else {
		decreaseSeconds("work", "#workSeconds");
	}
}

function restRotaryControl(ev) {
	var direction = ev.detail.direction;
	if (direction === "CW") {
		increaseSeconds("rest", "#restSeconds");
	} else {
		decreaseSeconds("rest", "#restSeconds");
	}
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
    navigator.vibrate(2000);
    navigator.notification.beep(3);
    if (roundsCount < rounds) {
        rest = !rest;
        if (rest) {
            $("#currentStatus").text("Descansa...");
            $("#secondsLeft").text(restSeconds);
            roundsCount++;
            countdown(restSeconds);
        } else {
            updateRounds();
            $("#currentStatus").text("¡Vamos!");
            $("#secondsLeft").text(workSeconds);
            countdown(workSeconds);
        }
    } else {
        updateRounds();
        $("#currentStatus").text("¡Tabata terminado!");
        $("#statusSecondsSeparator").show();
        $("#secondsLeft").show();
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
	paused = false;
    $("#pause").show();
    tau.closePopup();
    countdown(intervalSeconds);
}

function pauseWorkout() {
	paused = true;
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
    $("#statusSecondsSeparator").show();
    $("#secondsLeft").show();
    rest = false;
    roundsCount = 0;
    updateRounds();
    $("#currentStatus").text("¡Vamos!");
    $("#secondsLeft").text(workSeconds);
    countdown(workSeconds);
}

function roundsSet() {
    document.addEventListener('rotarydetent', function(ev) {
    	workRotaryControl(ev);
	});
    tau.changePage("#workTimePage");
}

function workTimeSet() {
    document.addEventListener('rotarydetent', function(ev) {
    	restRotaryControl(ev);
	});
    tau.changePage("#restTimePage");
}

function restTimeSet() {
    $("#start").click(function () {
        startWorkout();
    });
    $("#pause").click(function () {
        pauseWorkout();
    });
    updateRounds();
    $("#statusSecondsSeparator").hide();
    $("#secondsLeft").hide();
    $(".ui-title").width("100%");
    tau.changePage("#tabataPage");
}

$(document).ready(function () {
    init();
    document.addEventListener('deviceready', onDeviceReady, false);
});

function onDeviceReady() {
    console.log('Cordova features now available');
}
