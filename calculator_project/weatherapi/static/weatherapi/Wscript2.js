document.addEventListener("DOMContentLoaded", function () {
  console.log("Weather script loaded.");

  const searchButton = document.querySelector("button[type='submit']");

  searchButton.addEventListener("click", function (event) {
    event.preventDefault(); // 기본 동작(페이지 새로고침) 방지
    fetchChartData(); // 차트 데이터 가져오기 및 생성
  });
});

function fetchChartData() {
  const station = document.getElementById("station").value;
  const startDate = document.getElementById("start_date").value;
  const endDate = document.getElementById("end_date").value;

  console.log("Fetching data for:", station, startDate, endDate);

  fetch(
    `/weather_api/weather2/?station=${station}&start_date=${startDate}&end_date=${endDate}`
  )
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched Data:", data);
      updateChart(data);
    })
    .catch((error) => {
      console.error("Error fetching weather data:", error);
    });
}

function updateChart(stationData) {
  const ctx = document.getElementById("weatherChart").getContext("2d");

  if (window.weatherChart) {
    window.weatherChart.destroy(); // 기존 차트 삭제
  }

  window.weatherChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: stationData.labels, // 관측 날짜
      datasets: [
        {
          label: "최고 기온 (°C)",
          data: stationData.ta_max,
          borderColor: "red",
          fill: false,
        },
        {
          label: "최저 기온 (°C)",
          data: stationData.ta_min,
          borderColor: "blue",
          fill: false,
        },
        {
          label: "일평균 기온 (°C)",
          data: stationData.ta_avg,
          borderColor: "green",
          fill: false,
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "날짜",
          },
        },
        y: {
          title: {
            display: true,
            text: "기온 (°C)",
          },
        },
      },
    },
  });

  console.log("Chart updated successfully!");
}
