document.addEventListener("DOMContentLoaded", function () {
  // 폼 요소 값 설정
  document.getElementById("station").value = "{{ station }}";
  document.getElementById("start_date").value = "{{ start_date }}";
  document.getElementById("end_date").value = "{{ end_date }}";

  // 차트 생성
  const ctx = document.getElementById("myChart2").getContext("2d");
  const myChart2 = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "최고기온",
          data: taMax,
          borderColor: "red",
          borderWidth: 2,
          pointBackgroundColor: "red",
          fill: false,
        },
        {
          label: "최저기온",
          data: taMin,
          borderColor: "blue",
          borderWidth: 2,
          pointBackgroundColor: "blue",
          fill: false,
        },
        {
          label: "평균기온",
          data: taAvg,
          borderColor: "green",
          borderWidth: 2,
          pointBackgroundColor: "green",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { title: { display: true, text: "날짜" } },
        y: { title: { display: true, text: "기온" }, min: -30, max: 50 },
      },
    },
  });

  // // 🔄 줌 리셋 버튼 기능 추가
  // document.getElementById("resetZoom").addEventListener("click", () => {
  //   myChart2.resetZoom();
  // });
});
