let flag = false;
let operator_clicked = false;

//키보드 입력 시
document.addEventListener("keydown", function(event) {
    const display = document.getElementById("display");
    const validNum = "0123456789.";
    const validOp = "+-*/";
    
    if (validNum.includes(event.key)) {        //숫자                
        append(event.key);
         event.preventDefault();
    } else if (validOp.includes(event.key)) {  //연산자
        operator(event.key);
        event.preventDefault(); 
    } 
    else if (event.key === "Enter") {          //엔터
        calculate(); 
        event.preventDefault(); 
    } 
    else if (event.key === "Backspace") {       //백스페이스
        //const display = document.getElementById("display");
       // display.value = display.value.slice(0, -1);
        deleteOne();
        event.preventDefault();
    }else{
        event.preventDefault();
    }
});

function updateDisplayLayout(display) {             //스크롤 마지막 입력 지점으로 이동
    display.scrollLeft = display.scrollWidth;
}


function updateDisplayAllLayout(displayAll) {       //스크롤 마지막 입력 지점으로 이동
    displayAll.scrollLeft = displayAll.scrollWidth;
}

function append(value) {   //숫자 및 '.' 버튼 처리
    const display = document.getElementById('display');  
    const displayAll = document.getElementById('displayAll');  
    const lastValue = displayAll.value.slice(-1);      

    if(isNaN(display.value)){  //NAN, ERROR 값 처리
        display.value = ''
        displayAll.value = ''
    }
  
    if(!flag){ 
        if(!isNaN(value)|| value ==="."){ //숫자이거나 . 이면
            if (value === "." && display.value.includes(".")) { // 소수점이 이미 입력된 경우 추가 입력 방지                     
                return;
            }
            if (value === "." && display.value==="") {          // 빈 셀에 . 입력시 0. 으로 변환                     
                value = "0.";
            }
            if(display.value==="0" && value != "."){            // '0' 뒤에 숫자 입력 시 대체    
                display.value = ''
                display.value = value;    
            }else if (/([+\-*/])/.test(lastValue)) {            // 연산자 뒤에 숫자 입력 시 display 초기화 후 입력
                if(operator_clicked){
                    display.value='';
                    operator_clicked = false;
                }
                display.value += value; 
            } else {                                            // 숫자 연속 입력 처리
                display.value += value; 
            }
        }

    }else {//flag가 true 일 때, 리셋 후 새로운 계산
        displayAll.value = '';
        display.value = value;
        flag = false;
    }
    operator_clicked = false; 
    convertToOthers();                  //2,8,16 진법으로 바꾸기      
    updateDisplayLayout(display);       //스크롤
    updateDisplayAllLayout(displayAll); //스크롤
}
      

function operator(value){ //연산자 입력 처리
    const display = document.getElementById('display');  
    const displayAll = document.getElementById('displayAll');  
    const lastValue = displayAll.value.slice(-1);

    if(display.value==="" && displayAll.value===""){//공백 연산자 입력 X
        return;
    }


    if(isNaN(display.value)){  //NAN, ERROR(문자결과값) 값 처리
        display.value = ''
        displayAll.value = ''
        console.log("display : ", display.value )    
        return;
    }
  
    if(!flag){
        if(!operator_clicked){              // 연산자가 없다면
            displayAll.value += display.value+value;
            operator_clicked = true;
            console.log("operator_clicked : ", operator_clicked)          
        
        }else{
            displayAll.value = displayAll.value.slice(0, -1) + value;
            // if(/([+\-*/])/.test(lastValue)) {//연산자 연속 입력 시 연산자 바뀜
            // }
            // else if(display.value !== ''){ //display가 공백이 아니라면
            //     displayAll.value += display.value +value; // 연산자 추가
            //     operator_clicked = true;
            //     console.log("!!operator_clicked : ", operator_clicked)              
            // }
            // else{
            //     displayAll.value += value;        
            // }
        }
    }else{ ////flag가 true 일 때, 이어서 계산
        displayAll.value = display.value + value;
        operator_clicked = true; 
        flag = false; 
    }
    updateDisplayAllLayout(displayAll);
}         

function clearDisplay() { //'C'
    document.getElementById('display').value = '';
    document.getElementById('displayAll').value = '';
}

function deleteOne() { //숫자라면 뒤에서 하나씩 지우기 (연산자에는 영향X)
    const display = document.getElementById('display');     
    if(!isNaN(display.value.slice(-1))){
        display.value = display.value.slice(0, -1);
    }
    if(display.value===""){ //공백이되면 연산자 변경가능
        operator_clicked = true; 
        return;
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

function percent() {  //%
    const display = document.getElementById('display');

    if(display.value==="")return;
    if(isNaN(display.value)){  //NAN, ERROR(문자결과값) 값 처리
        display.value = ''
        displayAll.value = ''
        return;
    }
    display.value *= 0.01;
}

function pow() {    //x²
    const display = document.getElementById('display');

    if(display.value==="")return;
    if(isNaN(display.value)){  //NAN, ERROR(문자결과값) 값 처리
        display.value = ''
        displayAll.value = ''
        return;
    }
    display.value = Math.pow(display.value,2) // x의 제곱
}

function sqrt() {    //루트
    const display = document.getElementById('display');
    const currentValue = parseFloat(display.value); // 현재 화면 값 가져오기 (숫자로 변환)
    
    if(display.value==="")return;
    if(isNaN(display.value)){  //NAN, ERROR(문자결과값) 값 처리
        display.value = ''
        displayAll.value = ''
        return;
    }

    if (currentValue < 0) { //음수의 제곱근은 실수가 아님 
        display.value = "Error";  
    } else {
        display.value = Math.sqrt(currentValue); // 제곱근 계산
    }
}

function reciprocal(){ //¹/x 역수
    const display = document.getElementById('display');
    const displayAll = document.getElementById('displayAll');
    if(display.value==="")return;
    if(isNaN(display.value)){  //NAN, ERROR(문자결과값) 값 처리
        display.value = ''
        displayAll.value = ''
        return;
    }
    display.value = 1/display.value  //역수
}

// function formatNumber(num) {
//     if (!isNaN(num)) {
//         return Number(num).toLocaleString(); // 숫자를 1,000 형식으로 변환
//     }
//     return num; // 숫자가 아니면 그대로 반환
// }

function addToMemory(result) {  //결과값 메모리 list로 올리기
    const memoryList = document.getElementById('memory-list');
    const listItem = document.createElement('li');
    
    listItem.textContent = result;
    memoryList.appendChild(listItem);
}


function calculate() {
    const displayAll = document.getElementById('displayAll');
    const display = document.getElementById('display');
    const expression = displayAll.value+display.value;
    
    if(display.value==="")return;

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
            display.value =  data.result; // 결과를 현재 화면에 표시
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

function convertToOthers() { // 2진법, 8진법, 16진법으로 변환하여 출력하는 함수
    const display = document.getElementById('display');
    const displayBin = document.getElementById('displayBin');
    const displayOct = document.getElementById('displayOct');
    const displayDec = document.getElementById('displayDec');
    const displayHex = document.getElementById('displayHex');
    const currentValue = parseFloat(display.value); // 부동소수점문자 -> 숫자
    const binary = currentValue.toString(2);  // 2진법
    const octal = currentValue.toString(8);   // 8진법
    const decimal = currentValue              //10진법
    const hexadecimal = currentValue.toString(16).toUpperCase(); // 16진법 (대문자)

    displayBin.value = binary;
    displayOct.value = octal;
    displayDec.value = decimal;
    displayHex.value = hexadecimal;
}

document.getElementById('toggleBases').addEventListener('click', function () { //base show , hide button
    const baseContainer = document.getElementById('baseContainer');
    const toggleButton = document.getElementById('toggleBases');    

    if (baseContainer.classList.contains('hidden')) {
        baseContainer.classList.remove('hidden');
        toggleButton.textContent = 'Hide';
    } else {
        baseContainer.classList.add('hidden');
        toggleButton.textContent = 'Show';
    }   
});
// 메모리 열기/닫기 토글
document.getElementById('toggleMemory').addEventListener('click', function () {
    toggleMemory();
});
        
function toggleMemory(){   
    const memorySidebar = document.getElementById('memorySidebar');
    const toggleButton = document.getElementById('toggleMemory');

    if (memorySidebar.classList.contains('hidden')) {
        memorySidebar.classList.remove('hidden');
        toggleButton.textContent = 'Hide Memory';

    } else {
        memorySidebar.classList.add('hidden');
        toggleButton.textContent = 'Memory';
    }
}
