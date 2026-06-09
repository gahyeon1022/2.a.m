// common.js — 헤더 메뉴 토글 + 별똥별 생성
// form.html은 form.js, game.html은 game.js가 각각 처리
// index / team / credit 페이지에서 사용

// 별똥별 span 동적 생성
var shootingStarTops = [5, 31, 14, 43, 23, 8, 37, 18, 48, 27];
var shootingStarsEl  = document.querySelector(".shooting-stars");

if (shootingStarsEl) {
    shootingStarTops.forEach(function(top, index) {
        var star = document.createElement("span");
        star.style.setProperty("--top",   top + "%");
        star.style.setProperty("--delay", (index * 3) + "s");
        shootingStarsEl.appendChild(star);
    });
}

// 모바일 햄버거 메뉴 토글
var menuToggle = document.getElementById("menuToggle");
var mainNav    = document.getElementById("mainNav");

if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", function() {
        var isOpen = mainNav.classList.toggle("show");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });
}

var currentTimeEl = document.getElementById("currentTimeTitle");
var factMessageEl = document.getElementById("factMessage");
var diagnosisStorageKey = "twoAmDiagnosisResult";
var factMessages = [
    "지금 안 자면 내일의 너는 오늘의 너를 고소하고 싶어질 겁니다.",
    "쇼츠 하나만 더? 그 말이 벌써 47번째 마지막입니다.",
    "새벽 감성은 무료지만, 대가는 내일 아침 얼굴로 치릅니다.",
    "지금 보내려는 그 연락, 아침에 보면 범죄 현장입니다.",
    "자기계발 영상 그만 보고 일단 자기부터 하세요.",
    "내일 멀쩡한 척하려면 지금부터라도 양심껏 자야 합니다.",
    "잠을 미룬다고 하루가 길어지는 게 아니라 내일이 망가집니다.",
    "지금의 낭만은 알람 울리는 순간 바로 채무가 됩니다.",
    "이 시간까지 깨어 있는 건 감성이 아니라 체력 낭비입니다.",
    "성장은 밤샘 각오보다 폰 끄는 용기에서 시작됩니다.",
    "지금 안 자는 이유가 있는 게 아니라, 그냥 폰을 못 끄는 겁니다.",
    "내일 피곤할 걸 알면서도 안 자는 건 지능 문제가 아니라 의지 문제입니다.",
    "지금 하는 고민의 80%는 자고 일어나면 별거 아닙니다. 근데 안 자죠?",
    "새벽 감성인 줄 알았겠지만, 사실 수면 부족으로 판단력이 흐려진 상태입니다.",
    "그 사람이 한 말, 숨은 뜻 없습니다. 당신만 2시간째 확대해석 중입니다.",
    "흑역사는 아무도 기억 못 하는데, 본인만 정기구독 중입니다.",
    "내일의 당신은 지금의 당신을 꽤 싫어할 예정입니다.",
    "자기 전 5분만 본다는 말, 올해 들어 가장 많이 한 거짓말입니다.",
    "지금 인생이 망한 게 아니라, 생활패턴이 망한 겁니다.",
    "새벽 3시에 내린 결론은 대부분 감정 과다 판정입니다.",
    "잠은 안 자면서 내일 컨디션 걱정하는 건 꽤 뻔뻔한 태도입니다.",
    "그 카톡 답장 하나로 인간관계 논문 쓰지 마세요.",
    "현재 상태: 몸은 자고 싶은데, 손가락이 스크롤을 배신 중입니다.",
    "지금의 진지함은 철학이 아니라 졸림에서 온 오류일 가능성이 높습니다.",
    "당신의 뇌는 퇴근했는데, 불안만 야근 중입니다.",
];
var currentFactIndex = 0;
var useRandomFactMessages = true;
var factFlyPositions = [
    ["-10px", "12px"],
    ["8px", "14px"],
    ["0", "16px"],
    ["12px", "10px"],
    ["-8px", "15px"],
    ["6px", "12px"],
    ["-12px", "9px"],
    ["10px", "16px"],
];

function getSavedDiagnosisResult() {
    var savedResult = localStorage.getItem(diagnosisStorageKey);

    if (!savedResult) {
        return null;
    }

    try {
        var result = JSON.parse(savedResult);
        var updatedAt = new Date(result.updatedAt);
        var now = new Date();
        var isSameDate =
            updatedAt.getFullYear() === now.getFullYear() &&
            updatedAt.getMonth() === now.getMonth() &&
            updatedAt.getDate() === now.getDate();

        if (Number.isNaN(updatedAt.getTime()) || !isSameDate) {
            localStorage.removeItem(diagnosisStorageKey);
            return null;
        }

        return result;
    } catch (error) {
        localStorage.removeItem(diagnosisStorageKey);
        return null;
    }
}

function getDiagnosisFactMessages(result) {
    if (!result) {
        return factMessages;
    }

    var emotionPercent = Number(result.emotionPercent) || 0;
    var sleepPercent = Number(result.sleepPercent) || 0;
    var snsLevel = Number(result.snsLevel) || 1;
    var summaryMessage = "진단 결과: 새벽 감성도 " + emotionPercent + "%, 수면 실패 확률 " + sleepPercent + "%입니다.";

    if (snsLevel >= 5) {
        return [
            summaryMessage,
            "현재 상태는 매우 위험입니다. 폰 내려놓고 아무에게도 연락하지 마세요.",
            "감성 글, 장문 카톡, 전송 버튼 모두 오늘은 금지입니다.",
            result.regretText || "내일 아침 이불킥 예약입니다.",
        ];
    }

    if (snsLevel >= 4) {
        return [
            summaryMessage,
            "위험 단계입니다. 지금 쓰는 말은 아침의 당신이 수습해야 합니다.",
            "스토리 올리기 전에 물 한 잔 마시고 10분만 버텨보세요.",
            result.snsText || "SNS는 잠깐 쉬는 편이 좋습니다.",
        ];
    }

    if (snsLevel >= 3) {
        return [
            summaryMessage,
            "경계 단계입니다. 감성 플레이리스트는 괜찮지만 연락은 잠시 보류하세요.",
            "의미심장한 문장은 업로드 말고 임시저장까지만.",
            result.regretText || "아직은 돌아올 수 있습니다.",
        ];
    }

    if (snsLevel >= 2) {
        return [
            summaryMessage,
            "주의 단계입니다. 아직 괜찮지만 릴스 세 개가 한 시간이 될 수 있습니다.",
            "잠은 오는데 폰을 못 놓는 상태라면 화면 밝기부터 낮춰보세요.",
            result.snsText || "지금은 가볍게 정리하고 자면 됩니다.",
        ];
    }

    return [
        summaryMessage,
        "오늘은 비교적 안정권입니다. 이 기세로 바로 자면 승리입니다.",
        "SNS 위험도는 낮지만 방심하면 알고리즘이 다시 붙잡습니다.",
        result.regretText || "내일 아침의 나도 안심 가능.",
    ];
}

function padTime(value) {
    return String(value).padStart(2, "0");
}

function updateCurrentTime() {
    if (!currentTimeEl) {
        return;
    }

    var now = new Date();
    currentTimeEl.textContent = [
        padTime(now.getHours()),
        padTime(now.getMinutes()),
        padTime(now.getSeconds()),
    ].join(":");
}

function showNextFact() {
    if (!factMessageEl) {
        return;
    }

    if (useRandomFactMessages && factMessages.length > 1) {
        var nextFactIndex = currentFactIndex;

        while (nextFactIndex === currentFactIndex) {
            nextFactIndex = Math.floor(Math.random() * factMessages.length);
        }

        currentFactIndex = nextFactIndex;
    } else {
        currentFactIndex = (currentFactIndex + 1) % factMessages.length;
    }

    renderFactMessage(factMessages[currentFactIndex]);
}

function renderFactMessage(message) {
    factMessageEl.textContent = "";

    Array.from(message).forEach(function(character, index) {
        var span = document.createElement("span");
        var position = factFlyPositions[index % factFlyPositions.length];

        span.textContent = character === " " ? "\u00a0" : character;
        span.className = character === " " ? "fact-char fact-space" : "fact-char";
        span.style.setProperty("--fly-x", position[0]);
        span.style.setProperty("--fly-y", position[1]);
        span.style.setProperty("--fly-delay", Math.min(index * 0.012, 0.32) + "s");
        factMessageEl.appendChild(span);
    });
}

function fadeToNextFact() {
    if (!factMessageEl) {
        return;
    }

    factMessageEl.classList.add("fade-out");

    setTimeout(function() {
        showNextFact();
        factMessageEl.classList.remove("fade-out");
    }, 800);
}

function setDashboardValue(id, value) {
    var element = document.getElementById(id);

    if (element) {
        element.textContent = value;
    }
}

function setDashboardBar(id, width) {
    var element = document.getElementById(id);

    if (element) {
        element.style.width = width + "%";
    }
}

function formatUpdatedAt(value) {
    if (!value) {
        return "-";
    }

    var date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "-";
    }

    return date.toLocaleString("ko-KR", {
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
    });
}

function renderDashboard() {
    var dashboardTitle = document.getElementById("dashboardTitle");

    if (!dashboardTitle) {
        return;
    }

    var result = getSavedDiagnosisResult();

    if (!result) {
        return;
    }

    var emotionPercent = Number(result.emotionPercent) || 0;
    var sleepPercent = Number(result.sleepPercent) || 0;
    var snsLevel = Number(result.snsLevel) || 0;

    setDashboardValue("dashboardEmotion", emotionPercent + "%");
    setDashboardBar("dashboardEmotionBar", emotionPercent);
    setDashboardValue("dashboardEmotionText", result.emotionText || "진단 결과를 불러왔습니다.");

    setDashboardValue("dashboardSleep", sleepPercent + "%");
    setDashboardBar("dashboardSleepBar", sleepPercent);
    setDashboardValue("dashboardSleepText", result.sleepText || "수면 실패 확률을 불러왔습니다.");

    setDashboardValue("dashboardRegret", result.regret || "-");
    setDashboardBar("dashboardRegretBar", emotionPercent);
    setDashboardValue("dashboardRegretText", result.regretText || "후회 지수를 불러왔습니다.");

    setDashboardValue("dashboardSns", snsLevel ? "Lv. " + snsLevel : "-");
    setDashboardBar("dashboardSnsBar", snsLevel * 20);
    setDashboardValue("dashboardSnsText", result.snsText || "SNS 위험도를 불러왔습니다.");
    setDashboardValue("dashboardUpdated", "Updated: " + formatUpdatedAt(result.updatedAt));
}

if (currentTimeEl) {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
}

if (factMessageEl) {
    var savedDiagnosisResult = getSavedDiagnosisResult();

    factMessages = getDiagnosisFactMessages(savedDiagnosisResult);
    useRandomFactMessages = !savedDiagnosisResult;
    currentFactIndex = useRandomFactMessages ? Math.floor(Math.random() * factMessages.length) : 0;
    renderFactMessage(factMessages[currentFactIndex]);
    setInterval(fadeToNextFact, 3500);
}

renderDashboard();
