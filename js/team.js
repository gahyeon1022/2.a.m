// team.js — 팀 소개 페이지: 진단 결과 오버레이 펼치기/접기 토글
// 공통(common.js)은 그대로 두고 team 페이지 전용 동작만 처리

var teamToggles = document.querySelectorAll(".team-toggle");

teamToggles.forEach(function (toggle) {
    var icon = toggle.querySelector(".team-toggle-icon");
    var text = toggle.querySelector(".team-toggle-text");

    toggle.addEventListener("click", function () {
        var card  = toggle.closest(".team-card");
        var stats = document.getElementById(toggle.getAttribute("aria-controls"));
        if (!card || !stats) return;

        var willOpen = stats.hidden;

        stats.hidden = !willOpen;
        toggle.setAttribute("aria-expanded", String(willOpen));
        card.classList.toggle("is-open", willOpen);

        if (icon) icon.textContent = willOpen ? "✕" : "💬";
        if (text) text.textContent = willOpen ? "닫기" : "한마디";
    });
});
