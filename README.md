# 🧮 Calculator & Weather Data Visualization Project

## 📌 프로젝트 소개
Python(Django), MongoDB, JavaScript를 활용한 웹 기반 계산기 및 기상청 API를 이용한 과거 날씨 데이터 시각화 프로젝트입니다.

- **계산기 기능**:
  - 일반 계산기
  - 프로그래머스(프로그래머) 모드 계산기 (비트 연산 및 진법 변환 포함)
- **날씨 데이터 시각화**:
  - 기상청 API를 통해 과거 특정 날짜의 날씨 데이터를 가져와 차트로 시각화

---

## ⚙️ 사용 기술 스택
- **백엔드**: Python, Django
- **데이터베이스**: MongoDB
- **프론트엔드**: HTML, CSS, JavaScript
- **외부 API**: 기상청 과거 날씨 API

---

## ✨ 주요 기능
- ✅ 일반 수학 계산기
- ✅ 프로그래머스 모드 계산기 (비트 연산 지원)
- ✅ 기상청 API를 통한 과거 날씨 데이터 조회
- ✅ 과거 날씨 데이터 차트 시각화 (온도, 습도 등)

---

## 🖼️ 계산기 화면 예시

![계산기](https://github.com/ysyoung1205/Calculation/blob/main/calculator_project/calculator.png)

## 🌦️ 날씨 차트 예시

![날씨 차트](https://github.com/ysyoung1205/Calculation/blob/main/calculator_project/weatherChart.png4)





## 🚀 실행 방법
```bash
# 1. 저장소 클론
git clone https://github.com/username/calculator_project.git
cd calculator_project

# 2. 가상환경 생성 및 실행
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. 필요 패키지 설치
pip install -r requirements.txt

# 4. 서버 실행
python manage.py runserver
