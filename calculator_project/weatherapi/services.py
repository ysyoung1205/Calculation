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
import requests
from datetime import datetime, timedelta
# from pymongo import MongoClient

class WeatherAPIClient:
    API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php?tm=202211300900&stn=0&help=1&authKey=RgiTjT29TKqIk409vUyqBA"  # API 엔드포인트
    API_KEY = "RgiTjT29TKqIk409vUyqBA"

    @staticmethod
    def fetch_weather_data():
        # 현재 시간을 기준으로 1시간 전 데이터 요청
        current_time = datetime.utcnow() + timedelta(hours=9)  # KST로 변환
        tm = current_time.strftime("%Y%m%d%H%M")  # 요청 형식에 맞춘 시간
        
        params = {
            "serviceKey": WeatherAPIClient.API_KEY,
            "pageNo": 1,
            "numOfRows": 10,
            "dataType": "JSON",
            "tm": tm,  # 요청 시간
            "stn": "108",  # 서울 지점 코드 (예)
        }

        response = requests.get(WeatherAPIClient.BASE_URL, params=params)
        response.raise_for_status()  # HTTP 에러 발생 시 예외 처리
        return response.json()
