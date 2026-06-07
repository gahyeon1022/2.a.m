// music.js — 모든 페이지 공통 새벽 배경음악 컨트롤
var musicVideoId = "n7N3kWbIux0";
var musicStorageKey = "twoAmMusicPlaying";
var musicPlayer = document.getElementById("musicPlayer");
var musicButton = document.getElementById("musicToggle");
var musicFrameWrap = document.getElementById("musicFrame");
var musicIframe;
var musicPlaying = localStorage.getItem(musicStorageKey) === "true";
var cricketMotionStorageKey = "twoAmCricketMotionStartedAt";
var cricketFloatDuration = 24;
var cricketSwayDuration = 7.5;

function sendMusicCommand(command) {
    if (!musicIframe || !musicIframe.contentWindow) {
        return;
    }

    musicIframe.contentWindow.postMessage(JSON.stringify({
        event: "command",
        func: command,
        args: [],
    }), "*");
}

function createMusicIframe() {
    if (musicIframe || !musicFrameWrap) {
        return;
    }

    musicIframe = document.createElement("iframe");
    musicIframe.title = "감성적인 센티멘탈 피아노";
    musicIframe.allow = "autoplay; encrypted-media";
    musicIframe.src = "https://www.youtube.com/embed/" + musicVideoId +
        "?enablejsapi=1&autoplay=1&playsinline=1&loop=1&playlist=" + musicVideoId;
    musicIframe.setAttribute("frameborder", "0");
    musicFrameWrap.appendChild(musicIframe);
}

function updateMusicButton() {
    if (!musicButton) {
        return;
    }

    musicButton.classList.toggle("is-playing", musicPlaying);
    musicButton.setAttribute("aria-label", musicPlaying ? "음악 끄기" : "음악 켜기");
    musicButton.setAttribute("aria-pressed", String(musicPlaying));
    musicButton.title = musicPlaying ? "음악 끄기" : "음악 켜기";
}

function playMusic() {
    createMusicIframe();
    musicPlaying = true;
    localStorage.setItem(musicStorageKey, "true");
    updateMusicButton();

    setTimeout(function() {
        sendMusicCommand("playVideo");
    }, 500);
}

function pauseMusic() {
    musicPlaying = false;
    localStorage.setItem(musicStorageKey, "false");
    updateMusicButton();
    sendMusicCommand("pauseVideo");
}

if (musicPlayer && musicButton && musicFrameWrap) {
    var cricketMotionStartedAt = Number(localStorage.getItem(cricketMotionStorageKey));

    if (!cricketMotionStartedAt || Number.isNaN(cricketMotionStartedAt)) {
        cricketMotionStartedAt = Date.now();
        localStorage.setItem(cricketMotionStorageKey, String(cricketMotionStartedAt));
    }

    var cricketElapsed = (Date.now() - cricketMotionStartedAt) / 1000;
    musicPlayer.style.animationDelay = "-" + (cricketElapsed % cricketFloatDuration) + "s";
    musicButton.style.animationDelay = "-" + (cricketElapsed % cricketSwayDuration) + "s";

    updateMusicButton();

    musicButton.addEventListener("click", function() {
        if (musicPlaying) {
            pauseMusic();
        } else {
            playMusic();
        }
    });

    if (musicPlaying) {
        playMusic();
    }
}
