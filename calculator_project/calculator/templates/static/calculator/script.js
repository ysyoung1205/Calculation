let flag = false;
let operator_clicked = false;

//키보드 입력 시
document.addEventListener("keydown", function(event) {
    const display = document.getElementById("display");
    const validKeys = "0123456789.+-*/";
    
    if (validKeys.includes(event.key)) {                   
        append(event.key);
         event.preventDefault(); // 기본 동작 방지
       // display.value += event.key; // 키 입력 추가
    } else if (event.key === "Enter") {
        calculate(); // 엔터로 계산 실행
    } else if (event.key === "Backspace") {
        const display = document.getElementById("display");
        display.value = display.value.slice(0, -1);
        event.preventDefault();
        //display.value = display.value.slice(0, -1); // 마지막 문자 삭제
    }else{
        event.preventDefault();
    }
});

function append(value) {
    const display = document.getElementById('display');  
    const displayAll = document.getElementById('displayAll');  
    const lastValue = displayAll.value.slice(-1);
    console.log("flag: ",flag);

    if(!flag){
        if(!isNaN(value)|| value ==="."){ //숫자이거나 . 이면
            if (value === "." && display.value.includes(".")) {// 소수점이 이미 입력된 경우 추가 입력 방지                     
                return;
            }
            if (value === "." && displayAll.value==="") {// 빈 셀에 . 입력시 0. 으로 변환                     
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
            displayAll.value += value;
            console.log("flag가 true, 숫자")
            //return;
            flag = false;
    }
    operator_clicked = false;
    console.log("operator_clicked : ", operator_clicked)    
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
        console.log("operator_clicked!!!! : ", operator_clicked)  
        flag = false; 


    }

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

function calculate() {
    const displayAll = document.getElementById('displayAll');
    const display = document.getElementById('display');
    const expression = displayAll.value+display.value;
    const formmatNumber = expression.toLocaleString
    //const expression = document.getElementById('display').value;

    // 숫자 형식 포맷팅 함수



    fetch('/calculate/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRFToken': '{{ csrf_token }}'
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
            flag = true;
            console.log("flag: ",flag);
        }
    })
    .catch(error => {
        document.getElementById('display').value = 'Error';
    });
}