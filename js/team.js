// team.js — 팀 소개 페이지

const teamToggles = document.querySelectorAll(".team-toggle");

teamToggles.forEach(function (toggle) {
    const icon = toggle.querySelector(".team-toggle-icon");
    const text = toggle.querySelector(".team-toggle-text");

    toggle.addEventListener("click", function () {
        const card = toggle.closest(".team-card");
        const stats = document.getElementById(toggle.getAttribute("aria-controls"));
        if (!card || !stats) return;

        const willOpen = stats.hidden;

        stats.hidden = !willOpen;
        toggle.setAttribute("aria-expanded", String(willOpen));
        card.classList.toggle("is-open", willOpen);

        if (icon) icon.textContent = willOpen ? "✕" : "💬";
        if (text) text.textContent = willOpen ? "닫기" : "한마디";
    });
});