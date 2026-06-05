const questions = document.querySelectorAll(".question:not(.select-question)");
const cards = document.querySelectorAll(".card");
const analyzeBtn = document.querySelector("#analyzeBtn");
const scores = Array(questions.length).fill(0);

function updateCard(cardIndex, title, width, description) {
    const card = cards[cardIndex];

    card.querySelector("h3").innerText = title;
    card.querySelector(".bar div").style.width = width + "%";
    card.querySelector("small").innerText = description;
}

function getResultText(percent) {
    if (percent >= 80) {
        return {
            emotion: "위험 수준: 전여친에게 연락할 확률 높음",
            sleep: "원인: '딱 하나만 더' 증후군",
            regret: "MAX",
            regretText: "내일 아침의 나에게 미안해하세요.",
            sns: "Lv. 5",
            snsText: "정신상태 관련 포스팅 금지",
        };
    }

    if (percent >= 50) {
        return {
            emotion: "위험 수준: 감성 플레이리스트 주의",
            sleep: "원인: 누워서 생각 많음",
            regret: "MID",
            regretText: "아직은 돌아올 수 있습니다.",
            sns: "Lv. 3",
            snsText: "스토리 올리기 전 한 번 더 생각하세요.",
        };
    }

    return {
        emotion: "위험 수준: 아직 정상 범위입니다.",
        sleep: "원인: 오늘은 꽤 멀쩡함",
        regret: "LOW",
        regretText: "내일 아침의 나도 안심 가능.",
        sns: "Lv. 1",
        snsText: "SNS에 이상한 글 올릴 확률 낮음",
    };
}

questions.forEach(function(question, index) {
    const circles = question.querySelectorAll(".circle");

    circles.forEach(function(circle) {
        circle.addEventListener("click", function() {
            circles.forEach(function(item) {
                item.classList.remove("selected");
            });

            circle.classList.add("selected");
            scores[index] = Number(circle.dataset.score);
        });
    });
});

analyzeBtn.addEventListener("click", function() {
    const total = scores.reduce(function(sum, score) {
        return sum + score;
    }, 0);

    const percent = Math.round((total / 20) * 100);
    const sleepPercent = Math.min(percent + 10, 100);
    const result = getResultText(percent);

    updateCard(0, percent + "%", percent, result.emotion);
    updateCard(1, sleepPercent + "%", sleepPercent, result.sleep);
    updateCard(2, result.regret, percent, result.regretText);
    updateCard(3, result.sns, percent, result.snsText);
});
