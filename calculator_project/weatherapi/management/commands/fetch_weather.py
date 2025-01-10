from django.core.management.base import BaseCommand
from weatherapi.services import WeatherAPIClient
from pymongo import MongoClient

class Command(BaseCommand):
    help = "Fetch and save weather data hourly"

    def handle(self, *args, **kwargs):
        data = WeatherAPIClient.fetch_weather_data()
        
        # MongoDB에 저장
        client = MongoClient('mongodb://localhost:27017/')
        db = client.weather_db
        collection = db.weather_data
        collection.insert_one(data)

        self.stdout.write(self.style.SUCCESS("Weather data fetched and saved successfully."))