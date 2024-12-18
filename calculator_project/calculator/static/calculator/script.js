let flag = false;
let operator_clicked = false;

//키보드 입력 시
document.addEventListener("keydown", function(event) {
    const display = document.getElementById("display");
    const validNum = "0123456789.";
    const validOp = "+-*/";
    
    if (validNum.includes(event.key)) {                   
        append(event.key);
         event.preventDefault();
         //console.log("event.key ", event.key);
       // display.value += event.key; // 키 입력 추가
    } else if (validOp.includes(event.key)) {
        operator(event.key);
        event.preventDefault(); 
    } 
    else if (event.key === "Enter") {     
        calculate(); // 엔터로 계산 실행
        event.preventDefault(); // 기본 동작 방지
    } 
    else if (event.key === "Backspace") {
        const display = document.getElementById("display");
        display.value = display.value.slice(0, -1);
        event.preventDefault();
    }else{
        event.preventDefault();
    }
});

function updateDisplayLayout(display) {
    display.scrollLeft = display.scrollWidth;
}

function updateDisplayAllLayout(displayAll) {
    displayAll.scrollLeft = displayAll.scrollWidth;
}

function append(value) {
    const display = document.getElementById('display');  
    const displayAll = document.getElementById('displayAll');  
    const lastValue = displayAll.value.slice(-1);      

    if(isNaN(display.value)){  //NAN, ERROR 등 값 처리
        display.value = ''
        displayAll.value = ''
    }
  
    if(!flag){
        if(!isNaN(value)|| value ==="."){ //숫자이거나 . 이면
            if (value === "." && display.value.includes(".")) {// 소수점이 이미 입력된 경우 추가 입력 방지                     
                return;
            }
            if (value === "." && display.value==="") {// 빈 셀에 . 입력시 0. 으로 변환                     
                value = "0.";
            }
            if(display.value==="0" && value != "."){
                display.value = ''
                display.value = value;   // '0' 뒤에 숫자 입력 시 대체      
            }else if (/([+\-*/])/.test(lastValue)) { 
                // 연산자 뒤에 숫자 입력 시 display 초기화 후 입력
                if(operator_clicked){
                    display.value='';
                    operator_clicked = false;
                }
                display.value += value; 
                console.log("2");
            } else {
                // 숫자 연속 입력 처리
                display.value += value; 
                console.log("3");
            }
           // displayAll.value += value; // 전체 식에 입력 추가
        }

    }else {//flag가 true 일 때, 다음 입력 값이 숫자이면 리셋/ 연산자이면 이전 결괏값에 이어서 계산       

            displayAll.value = '';
            display.value = value;
            flag = false;
    }
    operator_clicked = false; 
    convertToOthers();   
    
      // 여기서 display 레이아웃 업데이트
      updateDisplayLayout(display);
      updateDisplayAllLayout(displayAll);

}
      

function operator(value){
    const display = document.getElementById('display');  
    const displayAll = document.getElementById('displayAll');  
    const lastValue = displayAll.value.slice(-1);

    if(display.value==="")return;
  
   
    if(!flag){
        if(!operator_clicked){ // 연산자가 없다면
            displayAll.value += display.value+value;
            operator_clicked = true;
            console.log("operator_clicked : ", operator_clicked)   
        }else{
            if(/([+\-*/])/.test(lastValue)) {//연산자 연 속 입력 시 연산자 바뀜
                displayAll.value = displayAll.value.slice(0, -1) + value;
            }else if(display.value !== ''){ //숫자가 아니고 display가 공백이 아니라면
                displayAll.value += display.value +value; // 연산자 추가
                //currentValue = displayAll.value
                //displayAll.value = display.value + value;
                //flag = false;
                operator_clicked = true;
                console.log("operator_clicked : ", operator_clicked)              
            }else{
                displayAll.value += value;        
            }
        }
    }else{
        displayAll.value = display.value + value;
        operator_clicked = true;
        console.log("operator_clicked!!!! : ", operator_clicked)  
        flag = false; 
    }
    updateDisplayAllLayout(displayAll);

}         

function clearDisplay() {
    document.getElementById('display').value = '';
    document.getElementById('displayAll').value = '';
}

function deleteDisplay() { //숫자라면 뒤에서 하나씩 지우기 (연산자에는 영향X)
    const display = document.getElementById('display');     
    if(!isNaN(display.value.slice(-1))){
        display.value = display.value.slice(0, -1);
    }

}

function deletRecent() { //CE
    const display = document.getElementById('display');
    const currentValue = display.value;
    // 연산자를 기준으로 계산식 나누기
    const parts = currentValue.split(/([+\-*/])/); // 연산자 포함 분리

   // 마지막 숫자 또는 연산자 제거
    if (parts.length > 1) {
        parts.pop(); // 배열의 마지막 항목 제거
        display.value = parts.join(''); // 나머지 값 다시 합침
    } else {
        display.value = ''; // 숫자 하나만 있을 경우 전체 삭제
        //displayAll.value = ''; 
    }

}

function percent() {
    //@@@@숫자각각 적용되게 변경하기
    document.getElementById('display').value *= 0.01;
}
function pow() {
    const display = document.getElementById('display');
    display.value = Math.pow(display.value,2) // x의 제곱
}

function sqrt() {
    const display = document.getElementById('display');
    const currentValue = parseFloat(display.value); // 현재 화면 값 가져오기 (숫자로 변환)

    if (currentValue < 0) {
        display.value = "Error";  // 음수의 제곱근은 실수가 아님
    } else {
        display.value = Math.sqrt(currentValue); // 제곱근 계산
    }
}

function reciprocal(){
    const display = document.getElementById('display');
    const displayAll = document.getElementById('displayAll');
    display.value = 1/display.value  //역수
    //displayAll.value = "1/(" + display.value + ")" //displayAll에는 1/(3)

}

function formatNumber(num) {
    if (!isNaN(num)) {
        return Number(num).toLocaleString(); // 숫자를 1,000 형식으로 변환
    }
    return num; // 숫자가 아니면 그대로 반환
}

function addToMemory(result) {
    const memoryList = document.getElementById('memory-list');
    const listItem = document.createElement('li');
    
    listItem.textContent = result;
    memoryList.appendChild(listItem);
}


function calculate() {
    const displayAll = document.getElementById('displayAll');
    const display = document.getElementById('display');
    const expression = displayAll.value+display.value;
    //const formmatNumber = expression.toLocaleString
    //const expression = document.getElementById('display').value;

    fetch('/calculate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': csrfToken 
        },
        body: 'expression=' + encodeURIComponent(expression)
    })
    .then(response => response.json())
    .then(data => {
        if (data.result === "Error") {
            display.value = "Error"; // 오류 시 결과 표시
        } else {
            display.value =  formatNumber(data.result); // 결과를 현재 화면에 표시
            displayAll.value = data.expression + " = "; // 전체 계산식 업데이트
            memoryUpdate = displayAll.value + display.value 
            flag = true;
            console.log("flag: ",flag);
            convertToOthers();
            // DOM 업데이트 이후 호출
            setTimeout(() => {
                updateDisplayAllLayout(displayAll);
            }, 0);
            addToMemory(memoryUpdate); // 결과를 메모리에 추가
        }
    })
    .catch(error => {
        document.getElementById('display').value = 'Error';
    });


}

// 2진법, 8진법, 16진법으로 변환하여 출력하는 함수
    function convertToOthers() {
        const display = document.getElementById('display');
        const displayBin = document.getElementById('displayBin');
        const displayOct = document.getElementById('displayOct');
        const displayDec = document.getElementById('displayDec');
        const displayHex = document.getElementById('displayHex');
        // 문자 -> 숫자
        const currentValue = parseFloat(display.value);
        const binary = currentValue.toString(2); // 2진법
        const octal = currentValue.toString(8);  // 8진법
        const decimal = currentValue
        const hexadecimal = currentValue.toString(16).toUpperCase(); // 16진법 (대문자)

            displayBin.value = binary;
            displayOct.value = octal;
            displayDec.value = decimal;
            displayHex.value = hexadecimal;
    }

    document.getElementById('toggleBases').addEventListener('click', function () {
        const baseContainer = document.getElementById('baseContainer');
        const toggleButton = document.getElementById('toggleBases');
        //const toggleButton = document.getElementById('toggleBases');
        
    
        if (baseContainer.classList.contains('hidden')) {
            baseContainer.classList.remove('hidden');
            toggleButton.textContent = 'Hide';
            baseContainer.style.maxHeight = `${baseContainer.offsetHeight}px`;
            height = baseContainer.style.maxHeight
            console.log("height : ", height);

        } else {
            baseContainer.classList.add('hidden');
            toggleButton.textContent = 'Show';
        }
        
    });



        // 계산 결과를 메모리 영역에 추가하는 함수


    // // 계산이 완료되었을 때 호출
    // function calculateResult() {
    //     const display = document.querySelector('.display');
    //     const result = eval(display.value); // 결과 계산
    //     display.value = result; // 디스플레이 업데이트
    //     addToMemory(result); // 메모리에 추가
    //     console.log("result@@@@@@ : ", result);

    // }


    // 버튼 클릭 이벤트 예제
  //  document.querySelector('.equals-button').addEventListener('click', calculateResult);
    // 메모리 열기/닫기 토글
    document.getElementById('toggleMemory').addEventListener('click', function () {
        toggleMemory();
    });
        
        
    function toggleMemory(){   
        const memorySidebar = document.getElementById('memorySidebar');
        
        const toggleButton = document.getElementById('toggleMemory');

        if (memorySidebar.classList.contains('hidden')) {
            memorySidebar.classList.remove('hidden');
           // memorySidebar.classList.add('visible');
            toggleButton.textContent = 'Hide Memory';
            // 메모리 높이를 계산기의 높이로 설정
           // memorySidebar.style.maxHeight = `${calculator.offsetHeight}px`;

        } else {
           // memorySidebar.classList.remove('visible');
            memorySidebar.classList.add('hidden');
            //memorySidebar.style.maxHeight = '0'; // 높이를 0으로 설정
            toggleButton.textContent = 'Memory';
        }
    }
    // 창 크기 변경 시 메모리 높이 업데이트
    window.addEventListener('resize', function () {
        const memorySidebar = document.getElementById('memorySidebar');
        const calculator = document.querySelector('.calculator');

        // 메모리가 보이는 상태일 때만 높이 재설정
        if (!memorySidebar.classList.contains('hidden')) {
            memorySidebar.style.maxHeight = `${calculator.offsetHeight}px`;
        }
    });

    // // 페이지 로드 시 초기화
    // window.addEventListener('load', function () {
    //     const memorySidebar = document.getElementById('memorySidebar');
    //     const calculator = document.querySelector('.calculator');
    //     memorySidebar.style.maxHeight = `${calculator.offsetHeight}px`;
    // });

    // // 창 크기 변경 시 높이 재설정
    // window.addEventListener('resize', function () {
    //     const memorySidebar = document.getElementById('memorySidebar');
    //     const calculator = document.querySelector('.calculator');
    //     memorySidebar.style.maxHeight = `${calculator.offsetHeight}px`;
    // });
