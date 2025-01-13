from django.core.management.base import BaseCommand
import requests
from pymongo import MongoClient

class Command(BaseCommand):
    help = 'Fetch and store weather data'

    def handle(self, *args, **kwargs):
        API_URL = "https://apihub.kma.go.kr/api/typ01/url/kma_sfctm2.php"
        API_KEY = "RgiTjT29TKqIk409vUyqBA"  # 발급받은 API Key
        params = {
            "tm": "202501131700",
            "stn": 0,
            "help": 0,
            "authKey": API_KEY,
        }
        response = requests.get(API_URL, params=params)

        if response.status_code == 200:
            data = response.text.split("\n")
            start_idx = next(i for i, line in enumerate(data) if "#START7777" in line) + 1
            end_idx = next(i for i, line in enumerate(data) if "#7777END" in line)
            valid_lines = data[start_idx:end_idx]

            parsed_data = []
            for line in valid_lines:
                columns = line.split()
                if len(columns) >= 14:
                    parsed_data.append({
                        "time": columns[0],
                        "station": columns[1],
                        "temperature": columns[12],
                        "humidity": columns[13],
                    })

            client = MongoClient('mongodb://localhost:27017/')
            db = client["Project"]  # 데이터베이스 이름
            collection = db["weatherapi"]  # 컬렉션 이름
            collection.insert_many(parsed_data)

        else:
            print(f"API 요청 실패: {response.status_code}")
