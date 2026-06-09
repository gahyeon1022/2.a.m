// =====================================================
// game.js — 자니...? 문자 시뮬레이션 게임
// =====================================================

// -------------------------------------------------------
// 1. 대화 데이터
//
//    각 장면 구조:
//    {
//      messages: [{ speaker: "me" | "ex", text: "..." }, ...]
//      choices:  [{ label: "버튼 텍스트", next: "장면ID", silent: true/false }, ...]
//      ending:   { title: "엔딩 제목", desc: "설명" }  ← 엔딩 장면에만
//    }
//
//    silent: true → 선택지 텍스트를 말풍선으로 보내지 않음
//                    (예: "아무것도 보내지 않는다")
// -------------------------------------------------------
const gameData = {

    // ===================================================
    // 전여친 버전
    // ===================================================
    ex_girl: {

        oldMessages: [
            { speaker: "me", text: "미안. 우리 그만하자." },
            { speaker: "ex", text: "어. 잘 지내." }
        ],
        oldDate: "3개월 전",

        start: {
            messages: [],
            choices: [
                { label: "자니...?",              next: "girl_1",        silent: false },
                { label: "아무것도 보내지 않는다", next: "girl_end_wise", silent: true  }
            ]
        },

        // "자니...?" 전송 후
        girl_1: {
            messages: [
                { speaker: "ex", text: "..." },
                { speaker: "ex", text: "뭐야? 지금 시간이 몇신데" }
            ],
            choices: [
                { label: "그냥.. 인스타 보니 많이 예뻐졌더라...",      next: "girl_2a" },
                { label: "어 쏘리... 잘못보냈어", next: "girl_2b" }
            ]
        },

        // 루트 A: 인스타보니 예뻐졌더라
        girl_2a: {
            messages: [
                { speaker: "ex", text: "뭐래" },
                { speaker: "ex", text: "술 마셨냐" }
            ],
            choices: [
                { label: "응... 술김에...",  next: "girl_3a" },
                { label: "안마셨어 그냥 너가 생각나서 보내봤어...", next: "girl_3b" }
            ]
        },

        // 루트 B: 잘못보냈어
        girl_2b: {
            messages: [
                { speaker: "ex", text: "음? 차단하지 않았어?" },
                { speaker: "ex", text: "어떻게 잘못보내지" }
            ],
            choices: [
                { label: "사실 너랑 다시 만나고 싶어서 보내봤어...",    next: "girl_3b" },
                { label: "들켰다! 읽씹하고 도망친다.", next: "girl_end_c" , silent:true}
            ]
        },

        // 술 마셨다고 했을 때
        girl_3a: {
            messages: [
                { speaker: "ex", text: "하..." },
                { speaker: "ex", text: "술 마시고 연락하는거 민폐인거 알지?" },
                { speaker: "ex", text: "그만해" }
            ],
            choices: [
                { label: "보고싶어... 진심으로...",     next: "girl_4" },
                { label: "ㅇㅋ 잘게 쏘리요 ㅋ", next: "girl_end_d" }
            ]
        },

        // 사실 일부러 보낸거야
        girl_3b: {
            messages: [
                { speaker: "ex", text: "..." },
                { speaker: "ex", text: "양심이 있냐?" },
                { speaker: "ex", text: "너 내 생일에 다이소 화장품 사준거 기억안나?" },
                { speaker: "ex", text: "그리고 너 옷입고 다니는 꼬라지를 생각해봐..." }
            ],
            choices: [
                { label: "미안... 나 그래도 달라졌어 믿어줘",  next: "girl_4" },
                { label: "그게 뭐가 문젠데 !!!!! 내 옷에 보태준거 있어?!!!",   next: "girl_end_b" }
            ]
        },

        // 마지막 분기
        girl_4: {
            messages: [
                { speaker: "ex", text: "사람 고쳐쓰는거 아니다" },
                { speaker: "ex", text: "연락하지 마" }
            ],
            choices: [
                { label: "니가 내 모습을 제대로 못봐서그래...ㅋ", next: "girl_end_a" },
                { label: "...알겠어. 미안",       next: "girl_end_e" }
            ]
        },

        // 엔딩들
        girl_end_wise: {
            messages: [],
            ending: {
                title: "역대급 자제력",
                desc:  "보내지 않았어요.\n내일 아침의 나 : 잘했어... 잘했어...\n그냥 자라."
            }
        },

        girl_end_a: {
            messages: [
                { speaker: "ex", text: "어휴... 근자감 여전하네" },
                { speaker: "ex", text: "잠이나 자. 답장하지마." }
            ],
            ending: {
                title: "이불킥 챔피언",
                desc:  "낮엔 용기 없으면서 새벽엔 용감해지는 당신.\n내일 아침 이 대화 보는 순간 이불 속으로 들어가세요."
            }
        },

        girl_end_b: {
            messages: [
                { speaker: "ex", text: "미쳤네" },
                { speaker: "ex", text: "걍 꺼져" }
            ],
            ending: {
                title: "감정 폭주 기관차",
                desc:  "새벽이라 그런건지 폭주하는 감정을 다스릴 수가 없었다...\n내일도 잠은 글렀습니다."
            }
        },

        girl_end_c: {
            messages: [
                { speaker: "ex", text: "...? 잠이나 자라" }
            ],
            ending: {
                title: "쪽팔림의 권위자",
                desc:  "거짓말도 철저히 합시다.\n1년치 쪽팔림 한 번에 획득."
            }
        },

        girl_end_d: {
            messages: [
                { speaker: "ex", text: "어. 자." }
            ],
            ending: {
                title: "자존감 사수형 쿨찐",
                desc:  "애써 쿨한척 물러서는 당신.\n아마도 내일 전여친과 그녀의 친구들 사이 안줏거리가 될 겁니다."
            }
        },
        girl_end_e: {
            messages: [
                { speaker: "ex", text: "자라" }
            ],
            ending: {
                title: "시도는 좋았다",
                desc:  "용기있게 시도했지만 결과는 실패.\n내일 하루종일 우울할 것 같으니 잠이라도 잡시다."
            }
        }
    },

    // ===================================================
    // 전남친 버전
    // ===================================================
    ex_boy: {

        oldMessages: [
            { speaker: "me", text: "우리 이제 그만하자." },
            { speaker: "ex", text: "...어." }
        ],
        oldDate: "3개월 전",

        start: {
            messages: [],
            choices: [
                { label: "자니...?",              next: "boy_1",        silent: false },
                { label: "아무것도 보내지 않는다", next: "boy_end_wise", silent: true  }
            ]
        },

        // "자니...?" 전송 후
        boy_1: {
            messages: [
                { speaker: "ex", text: "어." },
                { speaker: "ex", text: "왜." }
            ],
            choices: [
                { label: "그냥... 인스타 보니까 잘 사는 것 같아서...", next: "boy_2a" },
                { label: "어 쏘리 잘못보냈어ㅋ",                       next: "boy_2b" }
            ]
        },

        // 루트 A: 인스타 잘사는 것 같아서
        boy_2a: {
            messages: [
                { speaker: "ex", text: "그래서?" },
                { speaker: "ex", text: "술 마셨냐." }
            ],
            choices: [
                { label: "응... 조금...",              next: "boy_3a" },
                { label: "아니 그냥 진짜 생각나서...", next: "boy_3b" }
            ]
        },

        // 루트 B: 잘못보냈어
        boy_2b: {
            messages: [
                { speaker: "ex", text: "어." },
                { speaker: "ex", text: "근데 차단한거 아니였나." }
            ],
            choices: [
                { label: "사실 일부러 보낸거야... 보고싶어서", next: "boy_3b" },
                { label: "들켰다! 읽씹하고 도망친다.",          next: "boy_end_c", silent: true }
            ]
        },

        // 술 마셨다고 했을 때
        boy_3a: {
            messages: [
                { speaker: "ex", text: "하..." },
                { speaker: "ex", text: "술 마시면 꼭 이러지." },
                { speaker: "ex", text: "그만해." }
            ],
            choices: [
                { label: "보고싶어... 진짜야...",  next: "boy_4" },
                { label: "ㅇㅋ 잘게ㅋ 미안",        next: "boy_end_d" }
            ]
        },

        // 사실 일부러 / 생각나서
        boy_3b: {
            messages: [
                { speaker: "ex", text: "양심 없어?" },
                { speaker: "ex", text: "야 내가 너 히스테리 부리는거 몇 번이나 참았는데 니가 나 먼저 찼잖아" },
                { speaker: "ex", text: "그리고 맨날 너 집까지 운전해서 데려다줬는데 왜 문앞까지 안가주냐고 성질낸거 기억안나?" }
            ],
            choices: [
                { label: "미안... 나 달라졌어 진짜야ㅠ",                              next: "boy_4"    },
                { label: "야 저녁에 얼마나 위험한데!!! 그리고 데려다준김에 문앞까지 가줄 수 있는거 아니냐!!!!!", next: "boy_end_b" }
            ]
        },

        // 마지막 분기
        boy_4: {
            messages: [
                { speaker: "ex", text: "사람 안 변해." },
                { speaker: "ex", text: "연락하지 마." }
            ],
            choices: [
                { label: "나 예뻐져서 카리나 뺨치는데도?", next: "boy_end_a" },
                { label: "...알겠어. 미안.",               next: "boy_end_e" }
            ]
        },

        // 엔딩들
        boy_end_wise: {
            messages: [],
            ending: {
                title: "역대급 자제력",
                desc:  "보내지 않았어요.\n내일 아침의 나 : 잘했어... 잘했어...\n그냥 자라."
            }
        },

        boy_end_a: {
            messages: [
                { speaker: "ex", text: "카리나가 뉘집 개 이름이냐?" },
                { speaker: "ex", text: "자라." }
            ],
            ending: {
                title: "카리나는 개뿔",
                desc:  "아무리 그래도 카리나는 쫌.\n당신도 참. 잠이나 잡시다."
            }
        },

        boy_end_b: {
            messages: [
                { speaker: "ex", text: "미쳤냐." },
                { speaker: "ex", text: "꺼져." }
            ],
            ending: {
                title: "감정 폭주 기관차",
                desc:  "새벽이라 그런건지 폭주하는 감정을 다스릴 수가 없었다...\n내일도 잠은 글렀습니다."
            }
        },

        boy_end_c: {
            messages: [
                { speaker: "ex", text: "...잠이나 자라." }
            ],
            ending: {
                title: "쪽팔림의 권위자",
                desc:  "거짓말도 철저히 합시다.\n1년치 쪽팔림 한 번에 획득."
            }
        },

        boy_end_d: {
            messages: [
                { speaker: "ex", text: "어." }
            ],
            ending: {
                title: "자존감 사수형 쿨찐",
                desc:  "애써 쿨한 척 물러서는 당신.\n아마도 내일 전남친과 그의 친구들 사이 안줏거리가 될 겁니다."
            }
        },

        boy_end_e: {
            messages: [
                { speaker: "ex", text: "자." }
            ],
            ending: {
                title: "시도는 좋았다",
                desc:  "용기있게 시도했지만 결과는 실패.\n내일 하루종일 우울할 것 같으니 잠이라도 잡시다."
            }
        }
    }
};

// -------------------------------------------------------
// 3. 게임 상태
// -------------------------------------------------------
let currentVersion = null;

// -------------------------------------------------------
// 4. 화면 전환
// -------------------------------------------------------
function showIntro() {
    document.getElementById("gameIntro").style.display       = "block";
    document.getElementById("gameChatSection").style.display = "none";
    document.getElementById("gameEnding").style.display      = "none";
}

function showChatSection() {
    document.getElementById("gameIntro").style.display       = "none";
    document.getElementById("gameChatSection").style.display = "flex";
    document.getElementById("gameEnding").style.display      = "none";
}

function showEndingSection(title, desc) {
    document.getElementById("gameChatSection").style.display = "none";
    document.getElementById("gameEnding").style.display      = "block";
    document.getElementById("endingTitle").textContent       = title;
    document.getElementById("endingDesc").innerHTML = desc.replace(/\n/g, "<br>");
}

// -------------------------------------------------------
// 5. 채팅 함수
// -------------------------------------------------------

// 스크롤 맨 밑으로 보내기
function scrollToBottom() {
    const chatBox = document.getElementById("chatBox");
    chatBox.scrollTop = chatBox.scrollHeight; 
}

// 날짜/시간 구분선 추가
function addDateDivider(text) {
    const chatBox = document.getElementById("chatBox");
    const div = document.createElement("div");
    div.className   = "game-date-divider";
    div.textContent = text;
    chatBox.appendChild(div);
    scrollToBottom();
}

// 시간 문자열 생성 — 새벽 3:00 부터 시작해서 메시지마다 1~3분씩 흐름
let gameMinutes = 0; // 누적 분 (0 = 오전 3:00)

function getTimeStr() {
    const base    = 3 * 60 + gameMinutes; // 기준: 새벽 3시
    const hours   = Math.floor(base / 60);
    const minutes = base % 60;
    gameMinutes += Math.floor(Math.random() * 3) + 1; // 1~3분 랜덤 경과
    return "오전 " + hours + ":" + String(minutes).padStart(2, "0");
}

// 말풍선 추가 (isOld: 오래된 대화인지 여부)
function addMessage(speaker, text, isOld) {
    const chatBox = document.getElementById("chatBox");

    const wrap = document.createElement("div");
    wrap.className = "game-msg-wrap " + (speaker === "me" ? "game-msg-me" : "game-msg-ex");
    if (isOld) wrap.classList.add("game-msg-old"); // 흐릿하게 표시

    const bubble = document.createElement("div");
    bubble.className   = "game-bubble";
    bubble.textContent = text;

    const time = document.createElement("span");
    time.className   = "game-msg-time";
    time.textContent = getTimeStr();

    if (speaker === "me") {
        wrap.appendChild(time);
        wrap.appendChild(bubble);
    } else {
        wrap.appendChild(bubble);
        wrap.appendChild(time);
    }

    chatBox.appendChild(wrap);
    scrollToBottom();
}

// 선택지 렌더링
function renderChoices(choices) {
    const area = document.getElementById("choicesArea");
    area.innerHTML = "";

    choices.forEach(function(choice, index) {
        const btn = document.createElement("button");
        btn.className   = "game-choice-btn " + (index === 0 ? "game-choice-blue" : "game-choice-purple");
        btn.textContent = choice.label;

        btn.addEventListener("click", function() {
            hideChoices();

            if (!choice.silent) {
                // 일반 선택지: 선택한 텍스트를 내 말풍선으로 출력 후 이동
                addMessage("me", choice.label);
                setTimeout(function() {
                    goToScene(choice.next);
                }, 600);
            } else {
                // silent 선택지: 말풍선 없이 바로 이동 (예: 아무것도 안 보내기)
                goToScene(choice.next);
            }
        });

        area.appendChild(btn);
    });

    // 선택지 패널이 생기면 chatBox 높이가 줄어드므로
    // 레이아웃 리플로우 후 다시 맨 아래로 스크롤
    setTimeout(scrollToBottom, 80);
}

function hideChoices() {
    document.getElementById("choicesArea").innerHTML = "";
}

// -------------------------------------------------------
// ⑥ 메시지 순차 출력
// -------------------------------------------------------
function showMessagesSequentially(messages, callback) {
    let i = 0;

    function showNext() {
        if (i >= messages.length) {
            if (callback) callback();
            return;
        }
        const msg = messages[i];
        i++;
        addMessage(msg.speaker, msg.text, false);
        setTimeout(showNext, 1200);
    }

    showNext();
}

// -------------------------------------------------------
// ⑦ 장면 이동
// -------------------------------------------------------
function goToScene(sceneId) {
    const data  = gameData[currentVersion];
    const scene = data[sceneId];

    if (!scene) {
        console.error("장면을 찾을 수 없음:", sceneId);
        return;
    }

    hideChoices();

    showMessagesSequentially(scene.messages, function() {
        if (scene.ending) {
            // 엔딩 장면 → 1초 뒤 엔딩 화면
            setTimeout(function() {
                showEndingSection(scene.ending.title, scene.ending.desc);
            }, 1000);
        } else if (scene.choices) {
            renderChoices(scene.choices);
        }
    });
}

// -------------------------------------------------------
// ⑧ 게임 시작
// -------------------------------------------------------
function startGame(version) {
    currentVersion = version;

    document.getElementById("chatBox").innerHTML = "";
    hideChoices();
    gameMinutes = 0; // 시간 초기화 → 새벽 3:00부터 다시 시작

    document.getElementById("chatName").textContent =
        version === "ex_girl" ? "전여친 💙" : "전남친 💜";

    showChatSection();

    const data = gameData[version];

    // 오래된 대화 기록 표시 (흐릿하게)
    addDateDivider(data.oldDate);
    data.oldMessages.forEach(function(msg) {
        addMessage(msg.speaker, msg.text, true); // isOld = true
    });

    // 현재 시간 구분선
    addDateDivider("오늘 새벽 3:00");

    // 첫 선택지 표시 (자니...? vs 아무것도 안 보내기)
    goToScene("start");
}

// -------------------------------------------------------
// ⑨ 이벤트 리스너
// -------------------------------------------------------
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("selectEx").addEventListener("click", function() {
        startGame("ex_girl");
    });

    document.getElementById("selectBf").addEventListener("click", function() {
        startGame("ex_boy");
    });

    document.getElementById("selectEx").addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") startGame("ex_girl");
    });

    document.getElementById("selectBf").addEventListener("keydown", function(e) {
        if (e.key === "Enter" || e.key === " ") startGame("ex_boy");
    });

    document.getElementById("btnRestart").addEventListener("click", function() {
        showIntro();
    });

    document.getElementById("btnMain").addEventListener("click", function() {
        window.location.href = "main.html";
    });

});
