const questions = document.querySelectorAll(".question:not(.select-question)");
const resultCards = document.querySelectorAll(".card");
const analyzeButton = document.querySelector("#analyzeBtn");
const scores = Array(questions.length).fill(0);
const maxScore = questions.length * 5;

const resultMessages = [
    {
        minPercent: 80,
        emotion: "위험 수준: 전여친에게 연락할 확률 높음",
        sleep: "원인: '딱 하나만 더' 증후군",
        regret: "MAX",
        regretText: "내일 아침의 나에게 미안해하세요.",
        sns: "Lv. 5",
        snsText: "정신상태 관련 포스팅 금지",
    },
    {
        minPercent: 50,
        emotion: "위험 수준: 감성 플레이리스트 주의",
        sleep: "원인: 누워서 생각 많음",
        regret: "MID",
        regretText: "아직은 돌아올 수 있습니다.",
        sns: "Lv. 3",
        snsText: "스토리 올리기 전 한 번 더 생각하세요.",
    },
    {
        minPercent: 0,
        emotion: "위험 수준: 아직 정상 범위입니다.",
        sleep: "원인: 오늘은 꽤 멀쩡함",
        regret: "LOW",
        regretText: "내일 아침의 나도 안심 가능.",
        sns: "Lv. 1",
        snsText: "SNS에 이상한 글 올릴 확률 낮음",
    },
];

function updateCard(index, value, percent, description) {
    const card = resultCards[index];

    card.querySelector("h3").innerText = value;
    card.querySelector(".bar div").style.width = `${percent}%`;
    card.querySelector("small").innerText = description;
}

function getResultMessage(percent) {
    return resultMessages.find(function(message) {
        return percent >= message.minPercent;
    });
}

function selectScore(questionIndex, selectedCircle, circles) {
    circles.forEach(function(circle) {
        circle.classList.remove("selected");
    });

    selectedCircle.classList.add("selected");
    scores[questionIndex] = Number(selectedCircle.dataset.score);
}

function analyzeScores() {
    const totalScore = scores.reduce(function(total, score) {
        return total + score;
    }, 0);

    const percent = Math.round((totalScore / maxScore) * 100);
    const sleepPercent = Math.min(percent + 10, 100);
    const result = getResultMessage(percent);

    updateCard(0, `${percent}%`, percent, result.emotion);
    updateCard(1, `${sleepPercent}%`, sleepPercent, result.sleep);
    updateCard(2, result.regret, percent, result.regretText);
    updateCard(3, result.sns, percent, result.snsText);
}

questions.forEach(function(question, questionIndex) {
    const circles = question.querySelectorAll(".circle");

    circles.forEach(function(circle) {
        circle.addEventListener("click", function() {
            selectScore(questionIndex, circle, circles);
        });
    });
});

analyzeButton.addEventListener("click", analyzeScores);
