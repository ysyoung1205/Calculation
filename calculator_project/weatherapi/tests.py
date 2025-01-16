# # from django.test import TestCase
# # from pymongo import MongoClient
# # from weatherapi.services import WeatherAPIClient

# # class WeatherApiTests(TestCase):
# #     def test_weather_data(self):
# #         # MongoDB 연결
# #         client = MongoClient("mongodb://localhost:27017")
# #         db = client["weatherapi"]
# #         collection = db["weather_AVG"]
# #         collection.delete_many({})  # 기존 데이터 삭제

# #         # API 요청 및 데이터 저장
# #         params = {
# #             "authKey": WeatherAPIClient.API_KEY,
# #             "tm": "202501010000",  # 테스트용 시간
# #             "stn": "108",
# #             "help": 0,
# #         }
# #         data = WeatherAPIClient.fetch_weather_data(params)
# #         WeatherAPIClient.save_to_mongodb(data)

# #         # MongoDB 데이터 확인
# #         saved_data = list(collection.find())
# #         print(f"Saved data: {saved_data}")
# #         self.assertGreater(len(saved_data), 0, "MongoDB에 데이터가 저장되지 않았습니다.")
# import unittest
# from unittest.mock import patch, MagicMock
# from datetime import datetime
# from pymongo import MongoClient
# from weatherapi.services import WeatherAPIClient, get_daily_weather_data

# class WeatherAPIClientTests(unittest.TestCase):

#     @patch("weatherapi.services.requests.get")
#     def test_fetch_weather_data(self, mock_get):
#         # Mock API 응답 데이터
#         mock_response = MagicMock()
#         mock_response.status_code = 200
#         mock_response.text = (
#             "#START7777\n"
#             "20250101 108  2.2  1861  25  5.1  1519  29  9.7  1417   2.6   8.9  1540  -2.5  441\n"
#             "20250102 108  2.1  1816  32  4.9  2254  29  9.6  2247   0.5   6.0  1507  -2.9  804\n"
#             "#7777END"
#         )
#         mock_get.return_value = mock_response

#         params = {
#             "authKey": WeatherAPIClient.API_KEY,
#             "tm": "202501010000",
#             "stn": "108",
#             "help": 0,
#         }

#         result = WeatherAPIClient.fetch_weather_data(params)

#         expected_result = [
#             {"TM": "20250101", "TA_AVG": "2.6", "TA_MAX": "8.9", "TA_MIN": "-2.5"},
#             {"TM": "20250102", "TA_AVG": "0.5", "TA_MAX": "6.0", "TA_MIN": "-2.9"},
#         ]
#         self.assertEqual(result, expected_result)

#     @patch("weatherapi.services.MongoClient")
#     def test_save_to_mongodb(self, mock_mongo_client):
#         # Mock MongoDB
#         mock_db = MagicMock()
#         mock_collection = MagicMock()

#         # find_one 호출 시 항상 None을 반환하도록 설정 (중복 데이터가 없다고 가정)
#         mock_collection.find_one.side_effect = lambda query: None
#         mock_mongo_client.return_value.__getitem__.return_value = mock_db
#         mock_db.__getitem__.return_value = mock_collection

#         data = [
#             {"TM": "20250101", "TA_AVG": "2.6", "TA_MAX": "8.9", "TA_MIN": "-2.5"},
#             {"TM": "20250102", "TA_AVG": "0.5", "TA_MAX": "6.0", "TA_MIN": "-2.9"},
#         ]

#         # 실행
#         WeatherAPIClient.save_to_mongodb(data)

#         # find_one과 insert_one 호출 확인
#         mock_collection.find_one.assert_any_call({"TM": "20250101"})
#         mock_collection.find_one.assert_any_call({"TM": "20250102"})
#         self.assertEqual(mock_collection.insert_one.call_count, 2)

#     @patch("weatherapi.services.requests.get")
#     @patch("weatherapi.services.MongoClient")
#     def test_get_daily_weather_data(self, mock_mongo_client, mock_get):
#         # Mock API 응답 데이터
#         mock_response = MagicMock()
#         mock_response.status_code = 200
#         mock_response.text = (
#             "#START7777\n"
#             "20250101 108  2.2  1861  25  5.1  1519  29  9.7  1417   2.6   8.9  1540  -2.5  441\n"
#             "20250102 108  2.1  1816  32  4.9  2254  29  9.6  2247   0.5   6.0  1507  -2.9  804\n"
#             "#7777END"
#         )
#         mock_get.return_value = mock_response

#         mock_db = MagicMock()
#         mock_collection = MagicMock()
#         mock_mongo_client.return_value.__getitem__.return_value = mock_db
#         mock_db.__getitem__.return_value = mock_collection

#         # Mock request
#         class MockRequest:
#             def __init__(self, params):
#                 self.GET = params

#         request = MockRequest({
#             "start_date": "2025-01-01",
#             "end_date": "2025-01-02",
#         })

#         # 실행
#         result = get_daily_weather_data(request)

#         # 중복 데이터 제거 후 검증
#         unique_results = {record["TM"]: record for record in result}.values()
#         self.assertEqual(len(unique_results), 2)

# if __name__ == "__main__":
#     unittest.main()
