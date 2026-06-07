const questions = document.querySelectorAll(".question:not(.select-question)");
const cards = document.querySelectorAll(".card");
const analyzeBtn = document.querySelector("#analyzeBtn");
const drinkingStyle = document.querySelector("#drinkingStyle");
const resultModal = document.querySelector("#resultModal");
const levelMessage = document.querySelector("#levelMessage");
const levelNickname = document.querySelector("#levelNickname");
const resultModalClose = document.querySelector("#resultModalClose");
const menuToggle = document.querySelector("#menuToggle");
const navigation = document.querySelector("header nav");
const resultSection = document.querySelector(".result");
const scores = Array(questions.length).fill(0);
const diagnosisStorageKey = "twoAmDiagnosisResult";

const shootingStarTops = [5, 31, 14, 43, 23, 8, 37, 18, 48, 27];
const shootingStars = document.querySelector(".shooting-stars");

shootingStarTops.forEach((top, index) => {
    const star = document.createElement("span");

    star.style.setProperty("--top", `${top}%`);
    star.style.setProperty("--delay", `${index * 3}s`);
    shootingStars.append(star);
});

function updateCard(cardIndex, title, width, description) {
    const card = cards[cardIndex];

    card.querySelector("h3").textContent = title;
    card.querySelector(".bar div").style.width = `${width}%`;
    card.querySelector("small").textContent = description;
}

const levelDetails = {
    1: {
        message: "Lv.1 😌 매우 안정",
        nickname: "😌 평범한 인간",
    },
    2: {
        message: "Lv.2 🟢 주의",
        nickname: "☕ 감성 입문자",
    },
    3: {
        message: "Lv.3 🟡 경계",
        nickname: "🌙 새벽 감성 폭발러",
    },
    4: {
        message: "Lv.4 🟠 위험",
        nickname: "🎬 혼자 영화 감독",
    },
    5: {
        message: "Lv.5 🔴 매우 위험",
        nickname: "🌌 우주와 대화하는 자",
    },
};

function closeResultModal() {
    resultModal.classList.remove("show");
    resultModal.setAttribute("aria-hidden", "true");
}

function scrollToResult() {
    resultSection.scrollIntoView({
        behavior: "smooth",
        block: "start",
    });
}

function openResultModal(level) {
    const { message, nickname } = levelDetails[level];

    levelMessage.textContent = message;
    levelNickname.textContent = nickname;
    resultModal.classList.add("show");
    resultModal.setAttribute("aria-hidden", "false");
    resultModalClose.focus();
}

resultModalClose.addEventListener("click", () => {
    closeResultModal();
    scrollToResult();
});

resultModal.addEventListener("click", (event) => {
    if (event.target === resultModal) {
        closeResultModal();
    }
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && resultModal.classList.contains("show")) {
        closeResultModal();
    }
});

menuToggle.addEventListener("click", () => {
    const isOpen = navigation.classList.toggle("show");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
});

function getResultText(percent) {
    if (percent >= 90) {
        return {
            emotion: "위험 수준: 새벽 감성 폭주 상태",
            sleep: "원인: 생각이 꼬리에 꼬리를 무는 중",
            regret: "MAX",
            regretText: "내일 아침 이불킥 예약입니다.",
            snsLevel: 5,
            snsText: "전여친 연락, 감성글 업로드 절대 금지",
        };
    }

    if (percent >= 70) {
        return {
            emotion: "위험 수준: 전여친에게 연락할 확률 높음",
            sleep: "원인: '딱 하나만 더' 증후군",
            regret: "HIGH",
            regretText: "지금 보내면 내일 후회할 가능성 큼.",
            snsLevel: 4,
            snsText: "스토리 올리기 전 물 한 잔 마시세요.",
        };
    }

    if (percent >= 50) {
        return {
            emotion: "위험 수준: 감성 플레이리스트 주의",
            sleep: "원인: 누워서 생각 많음",
            regret: "MID",
            regretText: "아직은 돌아올 수 있습니다.",
            snsLevel: 3,
            snsText: "의미심장한 글은 임시저장까지만.",
        };
    }

    if (percent >= 30) {
        return {
            emotion: "위험 수준: 살짝 감성 올라옴",
            sleep: "원인: 잠은 오는데 폰을 못 놓음",
            regret: "LOW",
            regretText: "조금만 정신 차리면 괜찮습니다.",
            snsLevel: 2,
            snsText: "릴스 3개만 보고 끄세요. 진짜로.",
        };
    }

    return {
        emotion: "위험 수준: 아직 정상 범위입니다.",
        sleep: "원인: 오늘은 꽤 멀쩡함",
        regret: "SAFE",
        regretText: "내일 아침의 나도 안심 가능.",
        snsLevel: 1,
        snsText: "SNS에 이상한 글 올릴 확률 낮음",
    };
}

function saveDiagnosisResult(result) {
    localStorage.setItem(diagnosisStorageKey, JSON.stringify({
        emotionPercent: result.emotionPercent,
        sleepPercent: result.sleepPercent,
        regret: result.regret,
        regretText: result.regretText,
        snsLevel: result.snsLevel,
        snsText: result.snsText,
        emotionText: result.emotionText,
        sleepText: result.sleepText,
        updatedAt: new Date().toISOString(),
    }));
}

questions.forEach((question, index) => {
    const circles = question.querySelectorAll(".circle");

    circles.forEach((circle) => {
        circle.addEventListener("click", () => {
            circles.forEach((item) => item.classList.remove("selected"));

            circle.classList.add("selected");
            scores[index] = Number(circle.dataset.score);
        });
    });
});

analyzeBtn.addEventListener("click", () => {
    if (scores.some((score) => score === 0) || !drinkingStyle.value) {
        alert("모든 질문에 답해주세요.");
        return;
    }

    const total = scores.reduce((sum, score) => sum + score, 0);
    const minimumScore = questions.length;
    const maximumScore = questions.length * 5;
    const basePercent = Math.round(
        ((total - minimumScore) / (maximumScore - minimumScore)) * 100,
    );
    const drinkingStyleBonus = drinkingStyle.value === "caller" ? 5 : 0;
    const percent = Math.min(basePercent + drinkingStyleBonus, 100);
    const sleepPercent = Math.min(percent + 10, 100);
    const result = getResultText(percent);

    updateCard(0, `${percent}%`, percent, result.emotion);
    updateCard(1, `${sleepPercent}%`, sleepPercent, result.sleep);
    updateCard(2, result.regret, percent, result.regretText);
    updateCard(
        3,
        `Lv. ${result.snsLevel}`,
        result.snsLevel * 20,
        result.snsText,
    );

    saveDiagnosisResult({
        emotionPercent: percent,
        sleepPercent,
        regret: result.regret,
        regretText: result.regretText,
        snsLevel: result.snsLevel,
        snsText: result.snsText,
        emotionText: result.emotion,
        sleepText: result.sleep,
    });

    openResultModal(result.snsLevel);
});
