// =====================================================
// credit.js — 크레딧 버튼 이동 및 이스터애그 로직
// =====================================================


document.addEventListener('DOMContentLoaded', function() {
    const btnSleep = document.getElementById('btnSleep');
    const btnGoMain = document.getElementById('btnGoMain');
    const btnEasterEgg = document.getElementById('btnEasterEgg');
    const mainArea = document.querySelector('.credit-main');

    // 시스템 종료(창 닫기 시도 및 블랙아웃) 함수
    function triggerShutdown() {
        window.open('', '_self', '');
        window.close(); 
        
        document.body.innerHTML = `
            <div style="
                display: flex; 
                justify-content: center; 
                align-items: center; 
                width: 100vw; 
                height: 100vh; 
                background-color: #000000; 
                color: #333333; 
                font-size: 16px; 
                position: fixed; 
                top: 0; left: 0; 
                z-index: 999999;
                user-select: none;
            ">
                시스템이 종료되었습니다. 안녕히 주무세요.
            </div>
        `;
    }

    if (btnSleep) {
        btnSleep.addEventListener('click', function() {
            alert("숙면을 위해 모든 스마트 기기를 내려놓으십시오. 좋은 밤 되세요.");
            triggerShutdown();
        });
    }

    if (btnGoMain) {
        btnGoMain.addEventListener('click', function() {
            window.location.href = 'main.html';
        });
    }

    if (btnEasterEgg) {
        let moveTimer;

        // 창 크기 조정 시 버튼 이탈 방지
        window.addEventListener('resize', function() {
            const btnWidth = btnEasterEgg.offsetWidth || 45;
            const btnHeight = btnEasterEgg.offsetHeight || 45;
            const maxX = mainArea.offsetWidth - btnWidth - 20;
            const maxY = mainArea.offsetHeight - btnHeight - 20;
            const curLeft = parseFloat(btnEasterEgg.style.left);
            const curTop = parseFloat(btnEasterEgg.style.top);

            if (!isNaN(curLeft) || !isNaN(curTop)) {
                if (curLeft > maxX) btnEasterEgg.style.left = Math.max(20, maxX) + 'px';
                if (curTop > maxY) btnEasterEgg.style.top = Math.max(20, maxY) + 'px';
            }
        });
        
        // 마우스 및 터치 회피 (벽 충돌 시 난수 이동 로직)
        function evadeAction(e) {
            clearTimeout(moveTimer);

            // 터치 이벤트인지 마우스 이벤트인지 구분하여 터치된 위치 좌표 추출
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            moveTimer = setTimeout(function () {
                const rect = btnEasterEgg.getBoundingClientRect();
                const btnCenterX = rect.left + rect.width / 2;
                const btnCenterY = rect.top + rect.height / 2;

                let diffX = btnCenterX - clientX;
                let diffY = btnCenterY - clientY;

                if (diffX === 0 && diffY === 0) { diffX = 1; diffY = 1; }

                const dist = Math.sqrt(diffX * diffX + diffY * diffY);
                const pushDistance = window.innerWidth <= 768 ? 70 : 120; // 피해서 이동할 거리

                const moveX = (diffX / dist) * pushDistance;
                const moveY = (diffY / dist) * pushDistance;

                let targetLeft = btnEasterEgg.offsetLeft + moveX;
                let targetTop = btnEasterEgg.offsetTop + moveY;

                const btnWidth = btnEasterEgg.offsetWidth || 45;
                const btnHeight = btnEasterEgg.offsetHeight || 45;
                const maxX = mainArea.offsetWidth - btnWidth - 20;
                const maxY = mainArea.offsetHeight - btnHeight - 20;

                let hitWall = false;

                // 계산된 위치가 main 영역을 넘어가는지 판별
                if (targetLeft < 20 || targetLeft > maxX || targetTop < 20 || targetTop > maxY) {
                    hitWall = true;
                }

                if (hitWall) {
                    // 벽에 부딪혔을 경우, main 영역 내부의 무작위 좌표로 강제 이동시킴
                    targetLeft = Math.max(20, Math.random() * maxX);
                    targetTop = Math.max(20, Math.random() * maxY);
                }

                btnEasterEgg.style.right = 'auto';
                btnEasterEgg.style.bottom = 'auto';
                btnEasterEgg.style.left = targetLeft + 'px';
                btnEasterEgg.style.top = targetTop + 'px';
            }, 40); 
        }

        // PC 환경의 마우스 접근 이벤트
        btnEasterEgg.addEventListener('mouseenter', evadeAction);
        
        // 모바일 환경의 터치 감지 이벤트 추가
        btnEasterEgg.addEventListener('touchstart', evadeAction, { passive: true });



        // 화면 전체 확산 후 떨어지는 무한 낙하 및 진짜 버튼 찾기 로직
        btnEasterEgg.addEventListener('click', function() {
            clearTimeout(moveTimer);
            
            // main 영역 내부를 기준으로 한 상대 좌표 획득
            const mainRect = mainArea.getBoundingClientRect();
            const rect = btnEasterEgg.getBoundingClientRect();
            const startLeft = rect.left - mainRect.left;
            const startTop = rect.top - mainRect.top;

            btnEasterEgg.style.display = 'none';

            const totalClones = 30; 
            const realIndex = Math.floor(Math.random() * totalClones); 
            
            for (let i = 0; i < totalClones; i++) {
                const clone = document.createElement('button');
                clone.className = 'credit-easter-egg clone-button'; 
                clone.innerText = '★';
                
                clone.style.position = 'absolute';
                clone.style.margin = '0';
                clone.style.right = 'auto';
                clone.style.bottom = 'auto';
                clone.style.left = startLeft + 'px';
                clone.style.top = startTop + 'px';
                clone.style.zIndex = '10';

                // 진짜 버튼과 가짜 버튼의 색상 차별화
                if (i === realIndex) {
                    clone.style.color = '#FFF38A';
                    clone.style.textShadow = '0 0 10px #FFF38A';
                    clone.style.fontWeight = 'bold';
                    clone.style.borderColor = 'rgba(255, 243, 138, 0.8)';
                } else {
                    clone.style.color = 'rgba(255, 243, 138, 0.5)';
                    clone.style.borderColor = 'rgba(255, 243, 138, 0.4)';
                }
                
                // mainArea 안에 직접 삽입
                mainArea.appendChild(clone);

                // 확산 좌표 계산 (main 영역 너비 기준)
                const maxMainWidth = mainArea.offsetWidth - 45;
                const maxMainHeight = mainArea.offsetHeight - 45;

                const targetLeft = Math.random() * 90 + 5;
                const targetTop = Math.random() * maxMainHeight;
                
                setTimeout(() => {
                    clone.style.left = targetLeft + '%';
                    clone.style.top = targetTop + 'px';
                }, 10);


                // 확산 후 떨어지는 애니메이션 실행
                setTimeout(() => {
                    clone.style.transition = 'none';

                    // 바닥까지 남은 '실제 거리'를 계산
                    const distanceToBottom = window.innerHeight - targetTop + 50; 
                    clone.style.setProperty('--end-y', `${distanceToBottom}px`);
                    
                    // 떨어지는 속도
                    const speed = 80 + Math.random() * 100;
                    const firstDuration = distanceToBottom / speed;

                    // 처음에는 바닥까지만 딱 1번 떨어짐
                    clone.style.animation = `infiniteFall ${firstDuration}s linear 1`;
                    
                    // 바닥에 닿는 순간 바로 화면 꼭대기로 이동시켜 무한 루프 시작
                    clone.addEventListener('animationend', () => {
                        clone.style.top = '-50px'; 
                        
                        const fullDistance = window.innerHeight + 100;
                        clone.style.setProperty('--end-y', `${fullDistance}px`);
                        const loopDuration = fullDistance / speed;
                        
                        clone.style.animation = 'none'; 
                        setTimeout(() => {
                            clone.style.animation = `infiniteFall ${loopDuration}s linear infinite`;
                        }, 10);
                    });
                }, 600);


                clone.addEventListener('click', function() {
                    if (i === realIndex) {
                        alert("🎉 진짜 버튼을 찾으셨군요! 시스템을 종료합니다.");
                        triggerShutdown();
                    } else {
                        // 가짜를 누르면 화면에서 즉시 사라짐
                        clone.style.display = 'none';
                    }
                });
            }
        });
    }
});
