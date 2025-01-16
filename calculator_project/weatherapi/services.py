# import requests
# from pymongo import MongoClient

# class WeatherAPIClient:
#     API_URL = "https://api.weather.com/..."  # 기상청 API URL
#     API_KEY = "YOUR_API_KEY"

#     @staticmethod
#     def fetch_weather_data(params=None):
#         if params is None:
#             params = {"key": WeatherAPIClient.API_KEY}
#         response = requests.get(WeatherAPIClient.API_URL, params=params)
#         response.raise_for_status()  # 에러가 있으면 예외 발생
#         return response.json()

#     @staticmethod
#     def save_to_mongodb(data):
#         client = MongoClient('mongodb://localhost:27017/')
#         db = client.weather_db
#         collection = db.weather_data
#         collection.insert_one(data)
# import requests
# from datetime import datetime, timedelta
# # from pymongo import MongoClient

# class WeatherAPIClient:
#     API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=1&authKey=RgiTjT29TKqIk409vUyqBA"  # API 엔드포인트
#     API_KEY = "RgiTjT29TKqIk409vUyqBA"

#     @staticmethod
#     def fetch_weather_data():
#         # 현재 시간을 기준으로 1시간 전 데이터 요청
#         current_time = datetime.utcnow() + timedelta(hours=9)  # KST로 변환
#         tm = current_time.strftime("%Y%m%d%H%M")  # 요청 형식에 맞춘 시간
        
#         params = {
#             "serviceKey": WeatherAPIClient.API_KEY,
#             "pageNo": 1,
#             "numOfRows": 10,
#             "dataType": "JSON",
#             "tm": tm,  # 요청 시간
#             "stn": "108",  # 서울 지점 코드 (예)
#         }

#         response = requests.get(WeatherAPIClient.BASE_URL, params=params)
#         response.raise_for_status()  # HTTP 에러 발생 시 예외 처리
#         return response.json()

# def get_daily_weather_data(request):
#     # 예시: 간단히 request.GET에서 값만 출력
#     start_date = request.GET.get("start_date", "default_start_date")
#     end_date = request.GET.get("end_date", "default_end_date")
#     return {
#         "start_date": start_date,
#         "end_date": end_date,
#     }
# import requests
# from datetime import datetime, timedelta
# from pymongo import MongoClient

# class WeatherAPIClient:
#     BASE_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php"
#     API_KEY = "RgiTjT29TKqIk409vUyqBA"

#     @staticmethod
#     def fetch_weather_data(params):
#         response = requests.get(WeatherAPIClient.BASE_URL, params=params)
#         response.raise_for_status()  # HTTP 에러 발생 시 예외 처리

#         # 응답 텍스트 처리
#         text_data = response.text
#         lines = text_data.split("\n")

#         # #START7777 ~ #7777END 추출
#         try:
#             start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
#             end_idx = next(i for i, line in enumerate(lines) if "#7777END" in line)
#             valid_lines = lines[start_idx:end_idx]
#         except StopIteration:
#             print("START7777 또는 7777END 태그를 찾을 수 없습니다.")
#             return []

#         # 필요한 열 추출 (예: 0: TM, 10: TA_AVG, 11: TA_MAX, 13: TA_MIN)
#         parsed_data = []
#         for line in lines[2:]:  # 인덱스 2부터 시작
#             columns = line.split()
#             if len(columns) >= 14:  # 최소 14열 이상일 경우
#                 record = {
#                     "TM": columns[0],       # 관측일
#                     "TA_AVG": columns[10],  # 일 평균기온
#                     "TA_MAX": columns[11],  # 최고기온
#                     "TA_MIN": columns[13],  # 최저기온
#                 }
#                 parsed_data.append(record)
                

#         return parsed_data
        

#     @staticmethod
#     def save_to_mongodb(data):
#         client = MongoClient("mongodb://localhost:27017/")
#         db = client.weather_db
#         collection = db.weather_data

#         for record in data:
#             if not collection.find_one({"TM": record["TM"]}):  # 중복 방지
#                 collection.insert_one(record)
#                 print(f"Inserted record: {record}")
#             else:
#                 print(f"Duplicate record skipped: {record}")

# def get_daily_weather_data(request):
#     # GET 요청에서 날짜 범위 가져오기
#     start_date_str = request.GET.get("start_date", datetime.now().strftime("%Y-%m-%d"))
#     end_date_str = request.GET.get("end_date", datetime.now().strftime("%Y-%m-%d"))

#     start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
#     end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

#     results = []
#     current_date = start_date
#     while current_date <= end_date:
#         tm = current_date.strftime("%Y%m%d%H%M")
#         params = {
#             "authKey": WeatherAPIClient.API_KEY,
#             "tm": tm,
#             "stn": "108",
#             "help": 0,
#         }
#         response = requests.get(WeatherAPIClient.BASE_URL, params=params)
#         print(f"Request URL: {response.url}")  # 요청 URL 출력
#         print(f"Response status: {response.status_code}")  # 상태 코드 출력
#         print(f"Response text: {response.text[:200]}")  # 응답 데이터 앞부분 출력

#         try:
#             data = WeatherAPIClient.fetch_weather_data(params)
#             results.append(data)
#         except requests.exceptions.RequestException as e:
#             print(f"API 요청 실패: {e}")

#         current_date += timedelta(days=1)

#     WeatherAPIClient.save_to_mongodb(results)  # MongoDB에 저장
#     return results
# import requests
# from datetime import datetime, timedelta
# from pymongo import MongoClient

# class WeatherAPIClient:
#     BASE_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php"
#     API_KEY = "RgiTjT29TKqIk409vUyqBA"

#     @staticmethod
#     def fetch_weather_data(params):
#         response = requests.get(WeatherAPIClient.BASE_URL, params=params)
#         response.raise_for_status()
#         print(f"Request URL: {response.url}")
#         print(f"Response Status Code: {response.status_code}")
#         print(f"Response Text (first 200 chars): {response.text[:200]}")

#         text_data = response.text
#         lines = text_data.split("\n")

#         try:
#             start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
#             end_idx = next(i for i, line in enumerate(lines) if "#7777END" in line)
#             valid_lines = lines[start_idx:end_idx]
#         except StopIteration:
#             print("START7777 또는 7777END 태그를 찾을 수 없습니다.")
#             return []

#         parsed_data = []
#         for line in valid_lines:
#             columns = line.split()
#             if len(columns) >= 14:
#                 record = {
#                     "TM": columns[0],
#                     "TA_AVG": columns[10],
#                     "TA_MAX": columns[11],
#                     "TA_MIN": columns[13],
#                 }
#                 parsed_data.append(record)

#         return parsed_data

#     @staticmethod
#     def save_to_mongodb(data):
#         client = MongoClient("mongodb://localhost:27017/")
#         db = client.weatherapi
#         collection = db.weather_AVG

#         # 중첩 리스트를 평탄화
#         if isinstance(data, list) and all(isinstance(item, list) for item in data):
#             data = [record for sublist in data for record in sublist]

#         for record in data:
#             if isinstance(record, dict) and "TM" in record:  # 데이터 검증
#                 if not collection.find_one({"TM": record["TM"]}):  # 중복 방지
#                     collection.insert_one(record)
#                     print(f"Inserted record: {record}")
#                 else:
#                     print(f"Duplicate record skipped: {record}")


# def get_daily_weather_data(request):
#     start_date_str = request.GET.get("start_date", datetime.now().strftime("%Y-%m-%d"))
#     end_date_str = request.GET.get("end_date", datetime.now().strftime("%Y-%m-%d"))

#     start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
#     end_date = datetime.strptime(end_date_str, "%Y-%m-%d")

#     results = []
#     current_date = start_date
#     while current_date <= end_date:
#         tm = current_date.strftime("%Y%m%d%H%M")
#         params = {
#             "authKey": WeatherAPIClient.API_KEY,
#             "tm": tm,
#             "stn": "108",
#             "help": 0,
#         }

#         try:
#             data = WeatherAPIClient.fetch_weather_data(params)
#             results.extend(data)
#         except requests.exceptions.RequestException as e:
#             print(f"API 요청 실패: {e}")

#         current_date += timedelta(days=1)

#     WeatherAPIClient.save_to_mongodb(results)
#     print(f"Results data: {results}")  # 디버깅용 출력
#     return results
import sys
import os
# 프로젝트 루트 경로 추가
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.append(PROJECT_ROOT)
import requests
from MDBconnect.mongo_connect import save_to_mongo  # MongoDB 저장 함수 가져오기

API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfcdd3.php"
API_KEY = "RgiTjT29TKqIk409vUyqBA"

def fetch_weather_data(start_date: str, end_date: str, station: int):
    """
    API에서 특정 도시의 날씨 데이터를 가져옴.
    """
    params = {
        "tm1": start_date,
        "tm2": end_date,
        "stn": station,
        "authKey": API_KEY,
        "help": 0  # 디버깅을 위해 도움말 포함
    }
    try:
        response = requests.get(API_URL, params=params)
        response.raise_for_status()
        return response.text  # 텍스트 응답 반
    except requests.exceptions.RequestException as e:
        print(f"API 요청 실패: {e}")
        return None

def parse_weather_data(raw_data: str):
    """
    START7777 ~ 7777END 사이 데이터를 파싱하여 필요한 정보만 추출.

    Args:
        raw_data (str): API 응답 텍스트 데이터

    Returns:
        list[dict]: 파싱된 데이터 리스트
    """
    try:
        lines = raw_data.split("\n")
        start_idx = next(i for i, line in enumerate(lines) if "#START7777" in line) + 1
        end_idx = next(i for i, line in enumerate(lines) if "#7777END" in line)
        valid_lines = lines[start_idx:end_idx]

        parsed_data = []
        for line in valid_lines:
            # 첫 글자가 '#'인 경우 건너뜀
            if line.startswith("#"):
                continue

            # 공백으로 분리된 데이터 파싱
            columns = line.split()
            if len(columns) < 15:  # 데이터가 부족하면 건너뜀
                continue

            # 필요한 데이터 파싱
            tm = columns[0]  # 관측일
            stn = columns[1]  # 관측소
            ta_avg = columns[10]  # 일 평균기온
            ta_max = columns[11]  # 최고기온
            ta_min = columns[13]  # 최저기온
            print(tm)
            print(stn)
            print(ta_avg)
            print(ta_max)
            print(ta_min)

            # -9.0 값을 None으로 처리
            def convert_value(value):
                return None if value == "-9.0" else float(value)

            parsed_data.append({
                "tm": tm,
                "stn": stn,
                "ta_avg": convert_value(ta_avg),
                "ta_max": convert_value(ta_max),
                "ta_min": convert_value(ta_min),
            })
        return parsed_data
    except (StopIteration, IndexError) as e:
        print(f"데이터 파싱 실패: {e}")
        return []

def save_weather_to_db(start_date: str, end_date: str, station: int):
    """
    날씨 데이터를 MongoDB에 저장.

    Args:
        start_date (str): 시작 날짜 (YYYYMMDD 형식)
        end_date (str): 종료 날짜 (YYYYMMDD 형식)
        station (int): 지역 코드 (STN)
    """
    raw_data = fetch_weather_data(start_date, end_date, station)
    if raw_data:
        parsed_data = parse_weather_data(raw_data)
        if parsed_data:
            save_to_mongo(parsed_data)
            print(f"{start_date} ~ {end_date} 데이터 저장 완료!")
            # # MongoDB에 저장
            # save_to_mongo({"start_date": start_date, "end_date": end_date, "station": station, "data": raw_data})
            # print(f"{start_date} ~ {end_date} 데이터 저장 완료!")
    else:
        print("날씨 데이터를 가져오지 못했습니다.")    
    # if raw_data:
    #     parsed_data = parse_weather_data(raw_data)
    #     if parsed_data:
    #         save_to_mongo(parsed_data)
    #         print(f"{start_date} 데이터 저장 완료!")
    #     else:
    #         print("파싱된 데이터가 없습니다.")
    # else:
    #     print("날씨 데이터를 가져오지 못했습니다.")

# 테스트 실행(TEST)
# if __name__ == "__main__":
#     # 입력값 설정
#     start_date = input("시작 날짜 (YYYYMMDD): ").strip()
#     end_date = input("종료 날짜 (YYYYMMDD): ").strip()
#     station = int(input("지역 코드 (STN): ").strip())

#     save_weather_to_db(start_date, end_date, station)

