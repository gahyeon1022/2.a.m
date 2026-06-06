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
