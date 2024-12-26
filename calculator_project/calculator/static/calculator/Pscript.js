let flag = false;
let operator_clicked = false;
// 전역 변수로 현재 모드의 최소/최대값 설정
let currentModeLimits = {
  min: BigInt(-32768),
  max: BigInt(32767),
  bitSize: 16,
}; // 초기값: WORD

// 옵션 변경 시 호출되는 함수
document.getElementById("modeSelector").addEventListener("change", function () {
  const selectedMode = this.value;

  // 모드에 따른 제한 값 변경
  const MODES = {
    WORD: { min: BigInt(-32768), max: BigInt(32767), bitSize: 16 },
    DWORD: { min: BigInt(-2147483648), max: BigInt(2147483647), bitSize: 32 },
    QWORD: {
      min: BigInt(-9223372036854775808),
      max: BigInt(9223372036854775807),
      bitSize: 64,
    },
  };

  currentModeLimits = MODES[selectedMode];
  bitSize = currentModeLimits.bitSize;
  alert(
    `Changed to ${selectedMode} mode. Allowed range: ${currentModeLimits.min} ~ ${currentModeLimits.max}, Bit size: ${bitSize}`
  );
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
    //백스페이스
    //const display = document.getElementById("display");
    // display.value = display.value.slice(0, -1);
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
  //숫자 및 '.' 버튼 처리
  const display = document.getElementById("display");
  const displayAll = document.getElementById("displayAll");
  const lastValue = displayAll.value.slice(-1);

  if (isNaN(display.value)) {
    //NAN, ERROR 값 처리
    display.value = "";
    displayAll.value = "";
  }

  if (!flag) {
    //숫자이거나 . 이면
    // if (value === "." && display.value.includes(".")) {
    //   // 소수점이 이미 입력된 경우 추가 입력 방지
    //   return;
    // }
    // if (value === "." && display.value === "") {
    //   // 빈 셀에 . 입력시 0. 으로 변환
    //   value = "0.";
    // }
    if (lastValue === ")") {
      displayAll.value = "";
      display.value = value;
      return;
    }
    if (display.value === "0") {
      // '0' 뒤에 숫자 입력 시 대체
      display.value = "";
      display.value = value;
    } else if (/([+\-*//%<<>>)(])/.test(lastValue)) {
      // 연산자 뒤에 숫자 입력 시 display 초기화 후 입력
      if (operator_clicked) {
        display.value = "";
        operator_clicked = false; //////////???????
      }
      display.value += value;
    } else {
      // 숫자 연속 입력 처리
      display.value += value;
    }
  } else {
    //flag가 true 일 때, 리셋 후 새로운 계산
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
    alert(
      `Value out of range! Allowed range: ${currentModeLimits.min} ~ ${currentModeLimits.max}`
    );
    // display.value = ""; // 범위를 초과하면 초기화 >> 입력제한
    // 입력값을 제한 범위에 맞추기
    display.value = display.value.slice(0, -1); // 마지막 입력값 제거
    return; // 더 이상 처리하지 않음
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
      let result = BigInt(display.value); //////////////////////////////////////////////////////bigint로 변경

      if (lastValue === ")") {
        displayAll.value += value;
        operator_clicked = true;
        return;
      }
      displayAll.value += result + value;
      operator_clicked = true;
      console.log("operator_clicked : ", operator_clicked);
      console.log(typeof result);
    } else {
      displayAll.value = displayAll.value.slice(0, -1) + value;
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
    console.log("lastvalue: ", lastValue);
    if (operator_clicked || display.value === "") {
      displayAll.value += value;
    } else {
      displayAll.value += display.value + "*(";
      display.value = "";
    }

    // if (!isNaN(display.value) || lastValue === ")") {
    //   console.log("lastvalue: ", lastValue.length);

    //   value = display.value + "*(";
    // }
    // displayAll.value += value;

    return;
  }

  // 닫는 괄호 처리
  if (value === ")") {
    //displayvalue가 안 비어 있을 때
    const openCount = (displayAll.value.match(/\(/g) || []).length; // 여는 괄호 개수
    const closeCount = (displayAll.value.match(/\)/g) || []).length; // 닫는 괄호 개수

    if (openCount <= closeCount) {
      // 여는 괄호보다 닫는 괄호가 많으면 추가할 수 없음
      alert("No matching '(' for this ')'.");
      return;
    }

    // if (!operator_clicked) {
    //diplay에 숫자가 입력되었을 때
    displayAll.value += display.value + value;
    display.value = "";
    //return;
    //}
    // flag = true;
    // console.log(flag);
  }
}

function RSH() {} //RSH: 비트이동, ROR 순환이동

function Pcalculate() {
  const displayAll = document.getElementById("displayAll");
  const display = document.getElementById("display");

  // `display.value`가 비어 있으면 `results`를 추가하지 않음
  let results = display.value ? BigInt(display.value) : "";
  console.log("Results (BigInt):", results);

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
    body: "expression=" + encodeURIComponent(expression),
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

          alert(`Overflow occurred! Adjusted result: ${result}`);
        }

        // === 결과 반영 ===
        display.value = result;
        displayAll.value = data.expression + " = "; // 전체 계산식 업데이트
      }
      memoryUpdate = displayAll.value + display.value;
      flag = true;
      console.log("flag: ", flag);
      convertToOthers();
      // DOM 업데이트 이후 호출
      setTimeout(() => {
        updateDisplayAllLayout(displayAll);
      }, 0);
      addToMemory(memoryUpdate); // 결과를 메모리에 추가
    })
    .catch((error) => {
      document.getElementById("display").value = "Error!!";
    });
}

function toTwosComplement(value, bitSize) {
  if (value >= 0) {
    console.log("toTwosComplement", value);
    return value.toString(2).padStart(bitSize, "0"); // 양수는 그대로
  }

  const maxValue = BigInt(2 ** bitSize); // 최대값 계산
  console.log("toTwosComplement", maxValue);
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

  let binary, octal, decimal, hexadecimal;

  if (currentValue >= 0) {
    // 양수 처리
    binary = currentValue.toString(2).padStart(bitSize, "0");
    octal = currentValue.toString(8);
    hexadecimal = currentValue.toString(16).toUpperCase();
    console.log("bitSize", bitSize);
  } else {
    // 음수 처리: 2의 보수 계산
    binary = toTwosComplement(currentValue, bitSize);
    octal = BigInt("0b" + binary).toString(8);

    hexadecimal = BigInt("0b" + binary)
      .toString(16)
      .toUpperCase();
  }
  decimal = currentValue.toString();

  // 결과 업데이트
  // displayBin.value = "0b" + binary;
  // displayOct.value = "0o" + octal;
  // displayDec.value = decimal;
  // displayHex.value = "0x" + hexadecimal;

  // let binary = currentValue.toString(2); // 2진법
  // let octal = currentValue.toString(8); // 8진법
  // let decimal = currentValue.toString(); //10진법
  // let hexadecimal = currentValue.toString(16).toUpperCase(); // 16진법 (대문자)

  // 2진수: 4자리 패딩 + 4비트 그룹화
  binary = binary.padStart(Math.ceil(binary.length / 4) * 4, "0"); // 4자리 배수로 패딩
  console.log(binary);
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

    toggleButton.textContent = "Hide";
  } else {
    baseContainer.classList.add("hidden");

    toggleButton.textContent = "Show";
  }
});

function addToMemory(result) {
  //결과값 메모리 list로 올리기
  const memoryList = document.getElementById("memory-list");
  const listItem = document.createElement("li");

  listItem.textContent = result;
  memoryList.appendChild(listItem);
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
  } else {
    memorySidebar.classList.add("hidden");
    toggleButton.textContent = "Memory";
  }
}
