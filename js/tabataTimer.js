var rounds = 8;
var roundsCount = 0;
var workSeconds = 20;
var restSeconds = 10;
var secondsOffset = 5;
var rest = true;
var countDown = null;
var intervalSeconds = null;
var paused = false;

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

function setInitialListeners() {
	$("#setRounds").click(function () {
        roundsSet();
    });
    $("#setWorkTime").click(function () {
        workTimeSet();
    });
    $("#setRestTime").click(function () {
        restTimeSet();
    });
    $("#start").click(function () {
        startWorkout();
    });
    $("#pause").click(function () {
        pauseWorkout();
    });
    $("#increaseRounds").click(increaseRounds);
    $("#decreaseRounds").click(decreaseRounds);
    $("#increaseWork").click({actionComponent: "work", targetComponent: "#workSeconds"}, increaseSeconds);
    $("#decreaseWork").click({actionComponent: "work", targetComponent: "#workSeconds"}, decreaseSeconds);
    $("#increaseRest").click({actionComponent: "rest", targetComponent: "#restSeconds"}, increaseSeconds);
    $("#decreaseRest").click({actionComponent: "rest", targetComponent: "#restSeconds"}, decreaseSeconds);
	$(document).on('rotarydetent', function(ev) {
		setsRotaryControl(ev);
	});
    window.addEventListener('tizenhwkey', function onTizenHwKey(e) {
        var activePageId = tau.activePage.id;
        if (e.keyName === 'back') {
            if (activePageId === 'roundsPage') {
            	tizen.application.getCurrentApplication().exit();
            } else if (activePageId === 'tabataPage') {
                    countDown = null;
                	history.back();
            } else {
                history.back();
            }
        }
    });
}

function init() {
	setInitialListeners();
    $("#rounds").text(rounds);
    $("#workSeconds").text(workSeconds);
    $("#restSeconds").text(restSeconds);
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
		increaseSeconds({actionComponent: "work", targetComponent: "#workSeconds"});
	} else {
		decreaseSeconds({actionComponent: "work", targetComponent: "#workSeconds"});
	}
}

function restRotaryControl(ev) {
	var direction = ev.detail.direction;
	if (direction === "CW") {
		increaseSeconds({actionComponent: "rest", targetComponent: "#restSeconds"});
	} else {
		decreaseSeconds({actionComponent: "rest", targetComponent: "#restSeconds"});
	}
}

function decreaseSeconds(event) {
    if (event.data.actionComponent === "work") {
        if (workSeconds > secondsOffset) {
            workSeconds -= secondsOffset;
            $(event.data.targetComponent).text(workSeconds);
        }
    } else if (event.data.actionComponent === "rest") {
        if (restSeconds > secondsOffset) {
            restSeconds -= secondsOffset;
            $(event.data.targetComponent).text(restSeconds);
        }
    }
}

function increaseSeconds(event) {
    if (event.data.actionComponent === "work") {
        workSeconds += secondsOffset;
        $(event.data.targetComponent).text(workSeconds);
    } else if (event.data.actionComponent === "rest") {
        restSeconds += secondsOffset;
        $(event.data.targetComponent).text(restSeconds);
    }
}

function updateRounds() {
    $("#round").text(roundsCount);
    $("#totalRounds").text(rounds);
}

function nextInterval() {
    clearInterval(countDown);
    navigator.vibrate(500);
    var audio = document.createElement('audio');
    audio.src = 'snd/beep.mp3';
    audio.name = 'beep';
    audio.play();
    if (roundsCount < rounds) {
        rest = !rest;
        if (rest) {
            $("#currentStatus").text("Descansa");
            $("#secondsLeft").text(restSeconds);
            roundsCount++;
            countdown(restSeconds);
        } else {
            updateRounds();
            $("#currentStatus").html("&iexcl;Vamos!");
            $("#secondsLeft").text(workSeconds);
            countdown(workSeconds);
        }
    } else {
        updateRounds();
        countDown = null;
        $("#currentStatus").html("&iquest;Otra?");
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
    tau.closePopup();
    countdown(intervalSeconds);
}

function pauseWorkout() {
	paused = true;
    clearInterval(countDown);
    countDown = null;
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
    $("#currentStatus").html("&iexcl;Vamos!");
    $("#secondsLeft").text(workSeconds);
    $(".roundsSumUp").css('paddingBottom', '0');
    countdown(workSeconds);
}

function roundsSet() {
    $(document).off('rotarydetent');
    $(document).on('rotarydetent', function(ev) {
        workRotaryControl(ev);
    });
    tau.changePage("#workTimePage");
}

function workTimeSet() {
    $(document).off('rotarydetent');
    $(document).on('rotarydetent', function(ev) {
        restRotaryControl(ev);
    });
    tau.changePage("#restTimePage");
}

function restTimeSet() {
    $(document).off('rotarydetent');
    updateRounds();
    $(".roundsSumUp").css('paddingBottom', '2rem');
    $("#secondsLeft").hide();
    tau.changePage("#tabataPage");
}

$(document).ready(function(){init()});