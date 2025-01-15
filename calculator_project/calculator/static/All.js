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
// const standardMode = document.getElementById("standardMode");
// const programmerMode = document.getElementById("programmerMode");
// const weather1 = document.getElementById("weather1");

// // 현재 URL 경로 가져오기
// const currentPath = window.location.pathname;

// // 활성화 상태 설정
// if (currentPath.includes("programmers_calculator")) {
//   programmerMode.classList.add("active");
//   standardMode.classList.remove("active");
// } else {
//   standardMode.classList.add("active");
//   programmerMode.classList.remove("active");
// }

// // 표준 계산기 클릭
// standardMode.addEventListener("click", (e) => {
//   e.preventDefault(); // 기본 링크 동작 방지
//   window.location.href = "/standard/"; // 절대 경로로 이동
// });

// // 프로그래밍 계산기 클릭
// programmerMode.addEventListener("click", (e) => {
//   e.preventDefault(); // 기본 링크 동작 방지

//   window.location.href = `/programmer/`; // 프로그래밍 계산기로 이동
// });

// // 프로그래밍 계산기 클릭
// weather1.addEventListener("click", (e) => {
//   e.preventDefault(); // 기본 링크 동작 방지

//   window.location.href = `/weatherapi/weather1/`; // 프로그래밍 계산기로 이동
// });
