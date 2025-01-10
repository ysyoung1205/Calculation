from django.shortcuts import render
from django.http import JsonResponse
from .services import WeatherAPIClient

from django.http import JsonResponse
from .services import WeatherAPIClient
from pymongo import MongoClient

def fetch_and_save_weather(request):
    try:
        data = WeatherAPIClient.fetch_weather_data()
        
        # MongoDB에 데이터 저장
        client = MongoClient('mongodb://localhost:27017/')
        db = client.weather_db
        collection = db.weather_data
        collection.insert_one(data)

        return JsonResponse({"status": "success", "data": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)})