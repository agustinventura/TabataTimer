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
        var activePageId = tau.activePage.id;
        if (e.originalEvent.keyName === 'back') {
            if (activePageId === 'roundsPage') {
                exit();
            } else if (activePageId === 'tabataPage') {
                    reset();
                	history.back();
            } else {
                history.back();
            }
        }
    });
}

function exit() {
    tizen.application.getCurrentApplication().exit();
}

function reset() {
	roundsCount = 0;
	clearInterval(countDown);
	countDown = null;
    intervalSeconds = null;
    paused = false;
    audio = null;
    restAudio = null;
    $("#start").show();
    $("#pause").hide();
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
    if (roundsCount < rounds) {
        rest = !rest;
        if (rest) {
        	restAudio.load();
        	restAudio.play();
            $("#currentStatus").text("Descansa");
            $("#secondsLeft").text(restSeconds);
            roundsCount++;
            countdown(restSeconds);
        } else {
        	audio.load();
            audio.play();
            updateRounds();
            $("#currentStatus").html("&iexcl;Vamos!");
            $("#secondsLeft").text(workSeconds);
            countdown(workSeconds);
        }
    } else {
        updateRounds();
        reset();
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
    clearInterval(countDown);
    countDown = null;
    tau.openPopup("#pausePopup");
}

function startWorkout() {
    $("#start").hide();
    $("#pause").show();
    $("#secondsLeft").show();
    rest = false;
    roundsCount = 0;
    updateRounds();
    $("#currentStatus").html("&iexcl;Vamos!");
    $("#secondsLeft").text(workSeconds);
    $(".roundsSumUp").css('paddingBottom', '0');
    audio = document.createElement('audio');
    audio.src = 'snd/beep.mp3';
    audio.name = 'beep';
    restAudio = document.createElement('audio');
    restAudio.src = 'snd/beep2.mp3';
    restAudio.name = 'beep2';
    audio.load();
    audio.play();
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

$(document).ready(init);