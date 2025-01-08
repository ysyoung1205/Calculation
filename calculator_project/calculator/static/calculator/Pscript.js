let flag = false;
let operator_clicked = false;
let binary, octal, decimal, hexadecimal;
let currentModeLimits = (function () {
  const { min, max } = getSignedLimits(16);
  return {
    min,
    max,
    bitSize: 16,
  };
})();
let currentFilterDate = null; // 날짜 필터가 없을 경우 null로 초기화

function getSignedLimits(bitSize) {
  const half = BigInt(bitSize) - 1n;
  const max = (1n << half) - 1n;
  const min = -(1n << half);
  return { min, max };
}

// 옵션 변경 시 호출되는 함수
document.getElementById("modeSelector").addEventListener("change", function () {
  const selectedMode = this.value;
  const MODES = {
    WORD: (function () {
      const { min, max } = getSignedLimits(16);
      return { min, max, bitSize: 16 };
    })(),

    DWORD: (function () {
      const { min, max } = getSignedLimits(32);
      return { min, max, bitSize: 32 };
    })(),

    QWORD: (function () {
      const { min, max } = getSignedLimits(64);
      return { min, max, bitSize: 64 };
    })(),
  };

  //모드 업데이트
  currentModeLimits = MODES[selectedMode];
  const bitSize = currentModeLimits.bitSize;

  const display = document.getElementById("display");
  const displayBin = document.getElementById("displayBin");
  const binaryValue = displayBin.value; // 현재 값 가져오기
  let extractedBinary = binaryValue.replace(/0b/, "").replace(/\s+/g, "");

  // 유효성 검사: 빈 문자열일 경우 기본값 0 설정
  if (extractedBinary === "") {
    extractedBinary = "0";
    return;
  }

  // 비트 크기에 맞게 상위 비트 처리 (확장/자르기)
  let expandedBinary = (function () {
    if (extractedBinary.length > bitSize) {
      //범위가 작아질때
      return extractedBinary.slice(-bitSize);
    } else {
      //범위가 커질 때
      const signBit = extractedBinary[0] || "0"; // 부호 비트 가져오기 (음수는 첫째자리 1)
      return extractedBinary.padStart(bitSize, signBit);
    }
  })();

  console.log("Expanded binary:", expandedBinary);

  // BigInt 변환
  let numericValue = BigInt("0b" + expandedBinary);

  // 부호 비트를 기준으로 음수/양수 처리
  if (expandedBinary[0] === "1") {
    // 부호 비트가 1이면 음수 처리
    const bitMask = BigInt(1) << BigInt(bitSize);
    numericValue -= bitMask;
  }

  console.log("New value after processing:", numericValue);

  // 새 값을 디스플레이에 반영
  display.value = numericValue.toString();
  convertToOthers(); // 2진수, 8진수, 16진수 변환 함수 호출
});

//키보드 입력 시
document.addEventListener("keydown", function (event) {
  const display = document.getElementById("display");
  const validNum = "0123456789.";
  const validOp = "+-*/";

  if (validNum.includes(event.key)) {
    //숫자
    append(event.key);
    event.preventDefault();
  } else if (validOp.includes(event.key)) {
    //연산자
    operator(event.key);
    event.preventDefault();
  } else if (event.key === "Enter") {
    //엔터
    Pcalculate();
    event.preventDefault();
  } else if (event.key === "Backspace") {
    deleteOne();
    event.preventDefault();
  } else {
    event.preventDefault();
  }
});

function updateDisplayLayout(display) {
  //스크롤 마지막 입력 지점으로 이동
  display.scrollLeft = display.scrollWidth;
}

function updateDisplayAllLayout(displayAll) {
  //스크롤 마지막 입력 지점으로 이동
  displayAll.scrollLeft = displayAll.scrollWidth;
}

function append(value) {
  //숫자처리
  const display = document.getElementById("display");
  const displayAll = document.getElementById("displayAll");
  const lastValue = displayAll.value.slice(-1);
  const lastOperator = displayAll.value.match(/([+\-*/%]|<<|>>)$/)?.[0];

  if (isNaN(display.value)) {
    //NAN, ERROR 값 처리
    display.value = "";
    displayAll.value = "";
  }

  if (!flag) {
    if (lastOperator === ")") {
      displayAll.value = "";
      display.value = value;
      return;
    }
    if (operator_clicked) {
      display.value = "";
      console.log("display : ", display.value);
      operator_clicked = false; //연산자 입력되어있을 때 숫자 입력 시 display 초기화,
    }
    if (display.value === "0") {
      // '0' 뒤에 숫자 입력 시 대체
      display.value = value;
    } else {
      // 숫자 연속 입력 처리
      display.value += value; //입력
    }
  } else {
    // flag가 true일 때, 리셋 후 새로운 계산
    displayAll.value = "";
    display.value = value;
    flag = false;
  }

  // 입력값 제한 처리
  const numericValue = parseFloat(display.value);
  if (
    numericValue < currentModeLimits.min ||
    numericValue > currentModeLimits.max
  ) {
    // 입력값을 제한 범위에 맞추기
    display.value = display.value.slice(0, -1); // 마지막 입력값 제거
    return;
  }

  operator_clicked = false;
  convertToOthers(); //2,8,16 진법으로 바꾸기
  updateDisplayLayout(display); //스크롤
  updateDisplayAllLayout(displayAll); //스크롤
}

function operator(value) {
  //연산자 입력 처리
  const display = document.getElementById("display");
  const displayAll = document.getElementById("displayAll");
  const lastValue = displayAll.value.slice(-1);
  const lastOperator = displayAll.value.match(/([+\-*/%]|<<|>>)$/)?.[0];

  if (display.value === "" && displayAll.value === "") {
    //공백 연산자 입력 X
    return;
  }

  if (isNaN(display.value)) {
    //NAN, ERROR(문자결과값) 값 처리
    display.value = "";
    displayAll.value = "";
    console.log("display : ", display.value);
    return;
  }

  if (!flag) {
    if (!operator_clicked) {
      // 연산자가 없다면
      let result = BigInt(display.value);

      if (lastOperator === ")") {
        displayAll.value += value;
        operator_clicked = true;
        return;
      }
      displayAll.value += result + value;
      operator_clicked = true;
      console.log("operator_clicked : ", operator_clicked);
      console.log(typeof result);
    } else {
      // 동일한 연산자가 연속 입력되지 않도록 처리
      if (lastOperator === value) {
        return;
      }
      displayAll.value =
        displayAll.value.slice(0, -lastOperator.length) + value;
    }
  } else {
    ////flag가 true 일 때, 이어서 계산
    displayAll.value = display.value + value;
    operator_clicked = true;
    flag = false;
  }
  updateDisplayAllLayout(displayAll);
}

function clearDisplay() {
  //'C'
  document.getElementById("display").value = "";
  document.getElementById("displayAll").value = "";
  document.getElementById("displayBin").value = "";
  document.getElementById("displayOct").value = "";
  document.getElementById("displayDec").value = "";
  document.getElementById("displayHex").value = "";
}

function deleteOne() {
  //숫자라면 뒤에서 하나씩 지우기 (연산자에는 영향X)
  const display = document.getElementById("display");
  if (!isNaN(display.value.slice(-1))) {
    display.value = display.value.slice(0, -1);
  }
  if (display.value === "") {
    //공백이되면 연산자 변경가능
    operator_clicked = true;
    return;
  }
}

function parentheses(value) {
  const display = document.getElementById("display");
  const displayAll = document.getElementById("displayAll");
  const lastValue = displayAll.value.slice(-1) || "";

  if (flag) {
    displayAll.value = "";
    display.value = "";

    displayAll.value += value;

    flag = false;
    return;
  }

  // 여는 괄호 처리
  if (value === "(") {
    if (lastValue === ")") {
      console.log("Last value is ')'");
      displayAll.value += "*("; // 닫는 괄호 뒤에 곱셈 연산 포함한 여는 괄호 추가
    } else if (operator_clicked || display.value === "") {
      console.log("Operator clicked", operator_clicked);
      console.log("display.value", display.value);
      displayAll.value += value;
    } else {
      console.log("Default case");
      displayAll.value += display.value + "*(";
      display.value = "";
    }
    return;
  }

  // 닫는 괄호 처리
  if (value === ")") {
    //displayvalue가 안 비어 있을 때
    const openCount = (displayAll.value.match(/\(/g) || []).length; // 여는 괄호 개수
    const closeCount = (displayAll.value.match(/\)/g) || []).length; // 닫는 괄호 개수

    if (openCount <= closeCount) {
      return;
    }
    //diplay에 숫자가 입력되었을 때
    displayAll.value += display.value + value;
    display.value = "";
  }
}

function Pcalculate() {
  const displayAll = document.getElementById("displayAll");
  const display = document.getElementById("display");
  const mode = document.getElementById("modeSelector").value; // 선택된 모드 가져오기

  let results = display.value ? BigInt(display.value) : "";
  const bitSize =
    document.getElementById("modeSelector").value === "WORD"
      ? 16
      : document.getElementById("modeSelector").value === "DWORD"
      ? 32
      : 64;

  const expression = display.value
    ? displayAll.value + results // `display.value`가 있으면 추가
    : displayAll.value; // 없으면 `displayAll.value`만 사용

  console.log("Expression:", expression);
  if (display.value === "" && displayAll.value === "") return;

  fetch("/Pcalculate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
    },
    body: `expression=${encodeURIComponent(expression)}&bit_size=${bitSize}`,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "Error") {
        console.log("Server response:", data);
        display.value = "Error"; // 오류 시 결과 표시
      } else {
        let result = BigInt(data.result); // 서버에서 계산된 결과

        // === 오버플로우 연산 ===
        const bitSize = BigInt(
          currentModeLimits.max - currentModeLimits.min + 1n
        );
        if (result < currentModeLimits.min || result > currentModeLimits.max) {
          // 범위를 벗어나면 결과를 모드에 맞게 순환
          result = (result + bitSize) % bitSize; // 음수도 포함한 순환 처리
          // 음수 처리 (음수일 때 2의 보수로 변환)
          if (result > currentModeLimits.max) {
            result -= bitSize; // 음수 영역으로 이동
          }
        }
        display.value = result;
        displayAll.value = data.expression + " = "; // 전체 계산식 업데이트
      }
      memoryUpdate = displayAll.value + display.value;
      flag = true;
      convertToOthers();
      // DOM 업데이트 이후 호출
      setTimeout(() => {
        updateDisplayAllLayout(displayAll);
      }, 0);
      // updateMemoryList();
      // addToMemory(memoryUpdate); // 결과를 메모리에 추가
    })
    .catch((error) => {
      document.getElementById("display").value = "Error!!";
    });
}

function toTwosComplement(value, bitSize) {
  if (typeof value !== "bigint") {
    value = BigInt(value);
  }

  if (value >= 0) {
    console.log("toTwosComplement", value);
    return value.toString(2).padStart(bitSize, "0"); // 양수는 그대로
  }

  const maxValue = BigInt(2 ** bitSize); // 최대값 계산
  console.log("음수toTwosComplement", maxValue);
  console.log("value = ", value);
  console.log("bitSize = ", bitSize);
  return (maxValue + value).toString(2).padStart(bitSize, "0"); // 2의 보수 계산
}

function convertToOthers() {
  // 2진법, 8진법, 16진법으로 변환하여 출력하는 함수
  const display = document.getElementById("display");
  const displayBin = document.getElementById("displayBin");
  const displayOct = document.getElementById("displayOct");
  const displayDec = document.getElementById("displayDec");
  const displayHex = document.getElementById("displayHex");

  const currentValue = BigInt(display.value); // 현재 값
  const bitSize = currentModeLimits.bitSize; // 현재 모드의 비트 크기

  if (currentValue >= 0) {
    // 양수 처리
    binary = currentValue.toString(2).padStart(bitSize, "0");
    octal = currentValue.toString(8);
    hexadecimal = currentValue.toString(16).toUpperCase();
  } else {
    // 음수 처리: 2의 보수 계산
    binary = toTwosComplement(currentValue, bitSize);
    octal = BigInt("0b" + binary).toString(8);
    hexadecimal = BigInt("0b" + binary)
      .toString(16)
      .toUpperCase();
  }
  decimal = currentValue.toString();

  binary = binary.padStart(Math.ceil(binary.length / 4) * 4, "0"); // 4자리 배수로 패딩

  binary = binary.match(/.{1,4}/g).join(" "); // 4개씩 나누고 공백 추가
  octal = octal.replace(/\B(?=(\d{3})+(?!\d))/g, " "); // 뒤에서부터 3자리마다 공백 추가
  decimal = decimal.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  hexadecimal = hexadecimal.replace(/\B(?=(\w{4})+(?!\w))/g, " "); // 뒤에서부터 3자리마다 공백 추가

  displayBin.value = "0b" + binary;
  displayOct.value = "0o" + octal;
  displayDec.value = decimal;
  displayHex.value = "0x" + hexadecimal;
}

document.getElementById("toggleBases").addEventListener("click", function () {
  //base show , hide button
  const baseContainer = document.getElementById("baseContainer");
  const toggleButton = document.getElementById("toggleBases");

  if (baseContainer.classList.contains("hidden")) {
    baseContainer.classList.remove("hidden");
    memorySidebar.classList.add("expanded");
    toggleButton.textContent = "Hide";
  } else {
    baseContainer.classList.add("hidden");
    memorySidebar.classList.remove("expanded");
    toggleButton.textContent = "Show";
  }
});

function updateMemoryList() {
  fetch("/get_presults/", { method: "GET" })
    .then((response) => response.json())
    .then((data) => {
      const memoryList = document.getElementById("memory-list");
      memoryList.innerHTML = ""; // 기존 목록 초기화

      data.results.forEach((item) => {
        const li = document.createElement("li");
        // _id 값을 li의 data-id 속성에 저장
        li.setAttribute("data-id", item._id || "");

        //type추가
        const type_Span = document.createElement("span");
        const type = item.type || "undefined"; // 기본값 "undefined"
        type_Span.textContent = type;
        // 클래스 추가 시 undefined 체크
        type_Span.classList.add(
          "type-span",
          type ? `${type.toLowerCase()}-type` : "undefined-type" // 타입별 클래스 추가
        );

        const textSpan = document.createElement("span");
        textSpan.classList.add("mem-text"); // 메모 CSS 클래스
        textSpan.textContent = `${item.expression} ${item.result}`;

        // 2) X 버튼 생성
        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-mem-btn");

        // 3) X 버튼 클릭 시 삭제 함수 호출
        deleteBtn.addEventListener("click", () => {
          const id = li.getAttribute("data-id"); // data-id 속성에서 _id 가져오기
          const expression = item.expression; // 수식
          deleteMemoryItem(expression, id);
        });

        // li 구성
        li.appendChild(type_Span);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        memoryList.appendChild(li);
      });
    })
    .catch((error) => {
      console.error("메모리 데이터를 불러오는 중 오류 발생:", error);
    });
}

// 메모리 열기/닫기 토글
document.getElementById("toggleMemory").addEventListener("click", function () {
  toggleMemory();
});
function toggleMemory() {
  const memorySidebar = document.getElementById("memorySidebar");
  const toggleButton = document.getElementById("toggleMemory");

  if (memorySidebar.classList.contains("hidden")) {
    memorySidebar.classList.remove("hidden");
    toggleButton.textContent = "Hide";
    updateMemoryList();
  } else {
    memorySidebar.classList.add("hidden");
    toggleButton.textContent = "Memory";
  }
}

document.getElementById("loadMemoryByDate").addEventListener("click", () => {
  const dateVal = document.getElementById("memoryDate").value;
  if (!dateVal) {
    alert("날짜를 입력하세요.");
    return;
  }
  loadMemoryByDate(dateVal);
});

function loadMemoryByDate(dateVal) {
  const params = new URLSearchParams();
  params.append("date", dateVal);

  // POST 요청
  fetch("/get_presults_by_date_post", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
    },
    body: params.toString(),
  })
    .then((response) => response.json())
    .then((data) => {
      const memoryList = document.getElementById("memory-list");
      memoryList.innerHTML = ""; // 기존 목록 초기화

      if (!data.results || data.results.length === 0) {
        // 데이터가 없을 경우 메시지 표시
        const emptyMessage = document.createElement("p");
        emptyMessage.textContent = "조회된 데이터가 없습니다.";
        emptyMessage.classList.add("empty-message");
        memoryList.appendChild(emptyMessage);
        currentFilterDate = dateVal;
        return;
      }
      currentFilterDate = dateVal; //날짜선택필터
      data.results.forEach((item) => {
        const li = document.createElement("li");
        li.setAttribute("data-id", item._id || "");

        const type_Span = document.createElement("span"); // type
        const type = item.type || "undefined"; // 기본값
        type_Span.textContent = type;
        type_Span.classList.add(
          "type-span",
          type ? `${type.toLowerCase()}-type` : "undefined"
        );

        const textSpan = document.createElement("span"); // 계산 결과
        textSpan.classList.add("mem-text");
        textSpan.textContent = `${item.expression} ${item.result}`;

        const deleteBtn = document.createElement("button"); // X 버튼
        deleteBtn.textContent = "X";
        deleteBtn.classList.add("delete-mem-btn");

        // 3) X 버튼 클릭 시 삭제 함수 호출
        deleteBtn.addEventListener("click", () => {
          const id = li.getAttribute("data-id"); // data-id 속성에서 _id 가져오기
          const expression = item.expression; // 수식
          deleteMemoryItem(expression, id);
        });

        li.appendChild(type_Span);
        li.appendChild(textSpan);
        li.appendChild(deleteBtn);

        memoryList.appendChild(li);
      });
    })
    .catch((error) => console.error("날짜 조회 에러:", error));
}

function refreshMemoryList() {
  if (currentFilterDate) {
    // 현재 날짜필터가 켜져 있으면 그 날짜로 다시 조회
    loadMemoryByDate(currentFilterDate);
  } else {
    // 아니면 전체 목록
    updateMemoryList();
  }
}

document.addEventListener("DOMContentLoaded", () => {
  //초당 refresh
  setInterval(() => {
    if (currentFilterDate) {
      refreshMemoryList(); // 날짜 필터가 설정된 경우 해당 날짜로 갱신
    } else {
      updateMemoryList(); // 전체 목록 갱신
    }
  }, 1000);
});

//개별삭제
function deleteMemoryItem(expression, id) {
  console.log("expression", expression);
  console.log("Deleting item with ID:", id);
  fetch("/delete_presult/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken, // Django에서 CSRF 보호를 쓰는 경우
    },
    body: new URLSearchParams({ expression: expression, id: id }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "Result deleted") {
        // 삭제 성공 -> 메모리 목록 갱신
        refreshMemoryList();
      } else {
        console.error("개별 삭제 실패:", data);
      }
    })
    .catch((error) => {
      console.error("개별 삭제 오류:", error);
    });
}

//날짜별삭제
function deleteAllMemoryByDate(dateVal) {
  const params = new URLSearchParams();
  params.append("date", dateVal);

  fetch("/delete_all_presultsByDate/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
    },
    body: params.toString(),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.deleted_count > 0) {
        // 날짜별 삭제 성공 -> 화면에서 필터링된 메모리 제거
        const memoryList = document.getElementById("memory-list");
        memoryList.innerHTML = ""; // 필터링된 목록 초기화
        alert("선택한 날짜의 메모리가 삭제되었습니다.");
        refreshMemoryList();
      } else {
        console.error("날짜별 삭제 실패:", data);
      }
    })
    .catch((error) => {
      console.error("날짜별 삭제 오류:", error);
    });
}

function deleteAllMemory() {
  fetch("/delete_all_presults/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "X-CSRFToken": csrfToken,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.message === "All results deleted") {
        // 전체 삭제 성공 -> 메모리 목록 초기화
        const memoryList = document.getElementById("memory-list");
        memoryList.innerHTML = "";
      } else {
        console.error("전체 삭제 실패:", data);
      }
    })
    .catch((error) => {
      console.error("전체 삭제 오류:", error);
    });
}

document.getElementById("deleteAllBtn").addEventListener("click", function () {
  // 날짜 필터 활성화 여부 확인
  if (currentFilterDate) {
    const userConfirmed = confirm(
      `${currentFilterDate} 날짜의 메모리를 삭제하시겠습니까?`
    );
    if (userConfirmed) {
      deleteAllMemoryByDate(currentFilterDate); // 선택된 날짜의 메모리만 삭제
    }
  } else {
    const userConfirmed = confirm("모든 메모리를 삭제하시겠습니까?");
    if (userConfirmed) {
      deleteAllMemory(); // 전체 삭제
    }
  }
});

//export
document.getElementById("exportBtn").addEventListener("click", () => {
  const selectedDate = document.getElementById("memoryDate").value; // 날짜 입력 필드의 값
  // 요청 URL 생성 (날짜 포함)
  let url = "/export_to_csv/";
  if (selectedDate) {
    url += `?date=${selectedDate}`; // 날짜를 쿼리 문자열로 추가
  }
  fetch(url, {
    method: "GET",
  })
    .then((response) => response.blob())
    .then((blob) => {
      // Blob -> 다운로드
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = selectedDate
        ? `calculations_${selectedDate}.csv`
        : "calculations.csv"; // 파일명 설정
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    })
    .catch((error) => console.error("CSV 다운로드 오류:", error));
});

document.getElementById("showAllMemory").addEventListener("click", () => {
  // "모두 보기" → 원래 있던 전체 메모리 목록 불러오기
  currentFilterDate = null; // 날짜 필터링 해제
  document.getElementById("memoryDate").value = ""; // 날짜 입력 필드 리셋
  updateMemoryList();
});
