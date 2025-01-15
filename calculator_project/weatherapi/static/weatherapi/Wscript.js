// 서버에서 제공한 현재 선택된 station 값
const selectedStation = stationData.station;
const selectedDate = stationData.date;
console.log("Station Data:", stationData);

// 해당 station 값을 selectbox에서 선택
document.getElementById("station").value = selectedStation;
document.getElementById("date").value = selectedDate;

// Chart.js를 이용한 그래프 생성
const ctx = document.getElementById("myChart").getContext("2d");
const myChart = new Chart(ctx, {
  type: "line",
  data: {
    labels: stationData.labels,
    datasets: [
      {
        label: "온도 (°C)",
        data: stationData.temperature_data,
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 2,
        yAxisID: "tempAxis",
      },
      {
        label: "습도 (%)",
        data: stationData.humidity_data,
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        type: "bar", // 막대 그래프로 표시
        yAxisID: "humiAxis",
      },
    ],
  },
  options: {
    responsive: true,
    scales: {
      x: {
        type: "category",
        title: {
          display: true,
          text: "시간 (Hour)",
        },
      },
      tempAxis: {
        max: 50,
        min: -30,
        type: "linear",
        position: "left",
        title: {
          display: true,
          text: "온도 (°C)",
        },
      },
      humiAxis: {
        max: 100,
        min: 0,
        type: "linear",
        position: "right",
        title: {
          display: true,
          text: "습도 (%)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
    // ★ 여기서부터 plugins 설정 ★
    plugins: {
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
          threshold: 5,
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
        limits: {
          x: { min: 0, max: stationData.labels.length - 1 },
        },
      },
    },
  },
});

// 리셋 버튼 기능 추가
document.getElementById("resetZoom").addEventListener("click", () => {
  myChart.resetZoom();
});

// Chart.js에 zoom 플러그인 등록
Chart.register(ChartZoom);
// function getZoomLevel(chart) {
//   const xScale = chart.scales.x;
//   const range = xScale.max - xScale.min;
//   return range; // 표시되는 레이블의 범위로 줌 레벨을 추정
// }
// // 확대 레벨에 따라 레이블을 변경하는 함수
// function calculateLabelsBasedOnZoomLevel(zoomLevel) {
//   const originalLabels = stationData.labels;
//   let interval;

//   // 줌 레벨에 따라 레이블 간격 조정
//   if (zoomLevel < 10) {
//     interval = 2; // 레이블 모두 표시
//   } else {
//     interval = 1; // 4 간격으로 표시
//   }

//   // 간격에 따라 필터링된 레이블 반환
//   const filteredLabels = originalLabels.filter(
//     (_, index) => index % interval === 0
//   );

//   console.log("Original Labels:", originalLabels);
//   console.log("Zoom Level:", zoomLevel);
//   console.log("Filtered Labels:", filteredLabels);
//   return filteredLabels;
// }
