var rounds = 8;
var roundsCount = 0;
var workSeconds = 20;
var restSeconds = 10;
var secondsOffset = 5;
var rest = true;
var countDown = null;
var intervalSeconds = null;
var paused = false;
var audio = null;
var restAudio = null;

function init() {
    setInitialListeners();
    $("#rounds").text(rounds);
    $("#workSeconds").text(workSeconds);
    $("#restSeconds").text(restSeconds);
}

function setInitialListeners() {
	$("#setRounds").click(roundsSet);
    $("#setWorkTime").click(workTimeSet);
    $("#setRestTime").click(restTimeSet);
    $("#start").click(startWorkout);
    $("#pause").click(pauseWorkout);
    $("#increaseRounds").click(increaseRounds);
    $("#decreaseRounds").click(decreaseRounds);
    $("#increaseWork").click({actionComponent: "work", targetComponent: "#workSeconds"}, increaseSeconds);
    $("#decreaseWork").click({actionComponent: "work", targetComponent: "#workSeconds"}, decreaseSeconds);
    $("#increaseRest").click({actionComponent: "rest", targetComponent: "#restSeconds"}, increaseSeconds);
    $("#decreaseRest").click({actionComponent: "rest", targetComponent: "#restSeconds"}, decreaseSeconds);
    $("#resume").click(resumeWorkout);
    $("#exit").click(exit);
	$(document).on('rotarydetent', function(ev) {
		setsRotaryControl(ev);
	});
    $(window).on('tizenhwkey', function(e) {
    	backPressed(e);
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

function increaseSeconds(event) {
    if (event.actionComponent === "work") {
        workSeconds += secondsOffset;
        $(event.targetComponent).text(workSeconds);
    } else if (event.actionComponent === "rest") {
        restSeconds += secondsOffset;
        $(event.targetComponent).text(restSeconds);
    }
}

function decreaseSeconds(event) {
    if (event.actionComponent === "work") {
        if (workSeconds > secondsOffset) {
            workSeconds -= secondsOffset;
            $(event.targetComponent).text(workSeconds);
        }
    } else if (event.actionComponent === "rest") {
        if (restSeconds > secondsOffset) {
            restSeconds -= secondsOffset;
            $(event.targetComponent).text(restSeconds);
        }
    }
}

function backPressed(e) {
    var activePageId = tau.activePage.id;
    if (e.originalEvent.keyName === 'back') {
        if (activePageId === 'roundsPage') {
            exit();
        } else if (activePageId === 'tabataPage') {
        	tizen.power.release("SCREEN");
            reset();
            $(document).off('rotarydetent');
            $(document).on('rotarydetent', function(ev) {
                restRotaryControl(ev);
            });
            history.back();
        } else if (activePageId === 'restTimePage') {
        	$(document).off('rotarydetent');
            $(document).on('rotarydetent', function(ev) {
                workRotaryControl(ev);
            });
            history.back();
        } else if (activePageId === 'workTimePage') {
        	$(document).off('rotarydetent');
            $(document).on('rotarydetent', function(ev) {
                setsRotaryControl(ev);
            });
            history.back();
        }
    }
}

function exit() {
	tizen.power.release("SCREEN");
    tizen.application.getCurrentApplication().exit();
}

function stopInterval() {
    clearInterval(countDown);
    countDown = null;
}

function reset() {
    roundsCount = 0;
    stopInterval();
    intervalSeconds = null;
    paused = false;
    audio = null;
    restAudio = null;
    $("#start").show();
    $("#pause").hide();
    $("#readyStatus").show();
    $("#workStatus").hide();
    $("#endStatus").hide();
    $("#restStatus").hide();
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

function updateRounds() {
    $("#round").text(roundsCount);
    $("#totalRounds").text(rounds);
}

function restInterval() {
    restAudio.load();
    restAudio.play();
    $("#readyStatus").hide();
    $("#workStatus").hide();
    $("#endStatus").hide();
    $("#restStatus").show();
    $("#secondsLeft").text(restSeconds);
    roundsCount++;
    countdown(restSeconds);
}

function workInterval() {
    navigator.vibrate(500);
    audio.load();
    audio.play();
    updateRounds();
    $("#readyStatus").hide();
    $("#workStatus").show();
    $("#endStatus").hide();
    $("#restStatus").hide();
    $("#secondsLeft").text(workSeconds);
    countdown(workSeconds);
}

function loadWorkAudio() {
    audio = document.createElement('audio');
    audio.src = 'snd/beep.mp3';
    audio.name = 'beep';
}

function loadRestAudio() {
    restAudio = document.createElement('audio');
    restAudio.src = 'snd/beep2.mp3';
    restAudio.name = 'beep2';
}

function startWorkout() {
	tizen.power.request("SCREEN", "SCREEN_NORMAL");
    rest = false;
    roundsCount = 0;
    updateRounds();
    $("#start").hide();
    $("#pause").show();
    $("#secondsLeft").show();
    $("#readyStatus").hide();
    $("#workStatus").show();
    $("#endStatus").hide();
    $("#restStatus").hide();
    $("#secondsLeft").text(workSeconds);
    $(".roundsSumUp").css('paddingBottom', '0');
    loadWorkAudio();
    loadRestAudio();
    workInterval();
}

function stopWorkout() {
    reset();
    updateRounds();
    $("#readyStatus").hide();
    $("#workStatus").hide();
    $("#endStatus").show();
    $("#restStatus").hide();
    $(".roundsSumUp").css('paddingBottom', '2rem');
    $("#start").show();
    $("#pause").hide();
    $("#secondsLeft").hide();
}

function nextInterval() {
    stopInterval();
    navigator.vibrate(500);
    if (roundsCount < rounds) {
        rest = !rest;
        if (rest) {
            restInterval();
        } else {
            workInterval();
        }
    } else {
        stopWorkout();
    }
}

function countdown(seconds) {
    intervalSeconds = seconds;
    if (seconds === 1) {
        nextInterval();
    } else {
        countDown = setInterval(function () {
            refreshSeconds();
            checkIntervalEnd();
        }, 1000);
    }
}

function refreshSeconds() {
    intervalSeconds--;
    $("#secondsLeft").text(intervalSeconds);
}

function checkIntervalEnd() {
    if (intervalSeconds < 1) {
        nextInterval();
    }
}

function resumeWorkout() {
	paused = false;
    tau.closePopup();
    countdown(intervalSeconds);
}

function pauseWorkout() {
	paused = true;
    stopInterval();
    tau.openPopup("#pausePopup");
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
    $("#readyStatus").show();
    $("#workStatus").hide();
    $("#endStatus").hide();
    $("#restStatus").hide();
    tau.changePage("#tabataPage");
}

$(document).ready(init);