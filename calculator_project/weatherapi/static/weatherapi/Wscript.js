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
        backgroundColor: "rgba(54, 162, 235, 1)",
        borderWidth: 2,
        type: "bar", // 막대 그래프로 표시
        yAxisID: "humiAxis",
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
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
// document.addEventListener("DOMContentLoaded", function () {
//   console.log("Weather script loaded.");

//   const stationData = {
//     station: "{{ station }}",
//     start_date: "{{ start_date }}",
//     end_date: "{{ end_date }}",
//     labels: JSON.parse("{{ labels|escapejs }}"), // JSON 데이터 변환
//     ta_max: JSON.parse("{{ ta_max|escapejs }}"), // JSON 데이터 변환
//     ta_min: JSON.parse("{{ ta_min|escapejs }}"), // JSON 데이터 변환
//     ta_avg: JSON.parse("{{ ta_avg|escapejs }}"), // JSON 데이터 변환
//   };
//   console.log("Station Data:", stationData); // 데이터 확인용

//   const stationElement = document.getElementById("station");
//   const startDateElement = document.getElementById("start_date");
//   const endDateElement = document.getElementById("end_date");

//   if (stationElement) stationElement.value = stationData.station;
//   if (startDateElement) startDateElement.value = stationData.start_date;
//   if (endDateElement) endDateElement.value = stationData.end_date;

//   console.log("Updated form values");

//   const ctx = document.getElementById("weatherChart").getContext("2d");
//   new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: stationData.labels, // 관측 날짜
//       datasets: [
//         {
//           label: "최고 기온 (°C)",
//           data: stationData.ta_max,
//           borderColor: "red",
//           fill: false,
//         },
//         {
//           label: "최저 기온 (°C)",
//           data: stationData.ta_min,
//           borderColor: "blue",
//           fill: false,
//         },
//         {
//           label: "일평균 기온 (°C)",
//           data: stationData.ta_avg,
//           borderColor: "green",
//           fill: false,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "top",
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "날짜",
//           },
//         },
//         y: {
//           title: {
//             display: true,
//             text: "기온 (°C)",
//           },
//         },
//       },
//     },
//   });
//   // ✅ 줌 리셋 버튼 기능 추가
//   document.getElementById("resetZoom").addEventListener("click", () => {
//     myChart.resetZoom();
//   });
// });
// document.addEventListener("DOMContentLoaded", function () {
//   console.log("Weather script loaded.");

//   const searchButton = document.querySelector("button[type='submit']");

//   searchButton.addEventListener("click", function (event) {
//     event.preventDefault(); // 기본 동작(페이지 새로고침) 방지
//     fetchChartData(); // 차트 데이터 가져오기 및 생성
//   });
// });

// function fetchChartData() {
//   const station = document.getElementById("station").value;
//   const startDate = document.getElementById("start_date").value;
//   const endDate = document.getElementById("end_date").value;

//   console.log("Fetching data for:", station, startDate, endDate);

//   fetch(
//     `/weather_api/data_from_db/?station=${station}&start_date=${startDate}&end_date=${endDate}`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log("Fetched Data:", data);
//       updateChart(data);
//     })
//     .catch((error) => {
//       console.error("Error fetching weather data:", error);
//     });
// }

// function updateChart(stationData) {
//   const ctx = document.getElementById("weatherChart").getContext("2d");

//   if (window.myChart) {
//     window.myChart.destroy(); // 기존 차트 삭제
//   }

//   window.myChart = new Chart(ctx, {
//     type: "line",
//     data: {
//       labels: stationData.labels, // 관측 날짜
//       datasets: [
//         {
//           label: "최고 기온 (°C)",
//           data: stationData.ta_max,
//           borderColor: "red",
//           fill: false,
//         },
//         {
//           label: "최저 기온 (°C)",
//           data: stationData.ta_min,
//           borderColor: "blue",
//           fill: false,
//         },
//         {
//           label: "일평균 기온 (°C)",
//           data: stationData.ta_avg,
//           borderColor: "green",
//           fill: false,
//         },
//       ],
//     },
//     options: {
//       responsive: true,
//       plugins: {
//         legend: {
//           position: "top",
//         },
//       },
//       scales: {
//         x: {
//           title: {
//             display: true,
//             text: "날짜",
//           },
//         },
//         y: {
//           title: {
//             display: true,
//             text: "기온 (°C)",
//           },
//         },
//       },
//     },
//   });

//   console.log("Chart updated successfully!");
// }
