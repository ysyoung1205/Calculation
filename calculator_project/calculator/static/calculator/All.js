function updateClock() {
  const clockElement = document.getElementById("clock");
  if (!clockElement) return;
  const now = new Date();
  const timeString = now.toLocaleTimeString();
  clockElement.textContent = timeString;
}

// updateClock();
// setInterval(updateClock, 1000);

// 메뉴 요소 가져오기
const standardMode = document.getElementById("standardMode");
const programmerMode = document.getElementById("programmerMode");

// 현재 URL 경로 가져오기
const currentPath = window.location.pathname;

// 활성화 상태 설정
if (currentPath.includes("programmers_calculator")) {
  programmerMode.classList.add("active");
  standardMode.classList.remove("active");
} else {
  standardMode.classList.add("active");
  programmerMode.classList.remove("active");
}

// 표준 계산기 클릭
standardMode.addEventListener("click", (e) => {
  e.preventDefault(); // 기본 링크 동작 방지
  const currentUrl = window.location.origin; // 현재 도메인 (http://127.0.0.1:8000)
  window.location.href = `${currentUrl}/standard/`; // 표준 계산기로 이동
});

// 프로그래밍 계산기 클릭
programmerMode.addEventListener("click", (e) => {
  e.preventDefault(); // 기본 링크 동작 방지
  const currentUrl = window.location.origin; // 현재 도메인 (http://127.0.0.1:8000)
  window.location.href = `${currentUrl}/programmer/`; // 프로그래밍 계산기로 이동
});
