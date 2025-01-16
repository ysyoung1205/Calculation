from pymongo import MongoClient

# MongoDB 설정
MONGO_URI = "mongodb://localhost:27017/"  # MongoDB 기본 연결 URL
DB_NAME = "weatherapi"                 # 데이터베이스 이름
COLLECTION_NAME = "weather_AVG"         # 컬렉션 이름

def save_to_mongo(data):
    """
    데이터를 MongoDB에 저장하는 함수.

    Args:
        data (dict): 저장할 데이터 (JSON 형식)
    """
    try:
        # MongoDB 클라이언트 연결
        client = MongoClient(MONGO_URI)
        db = client[DB_NAME]
        collection = db[COLLECTION_NAME]
        
        # 데이터 삽입
        if isinstance(data, list):
            for record in data:
                # 중복 여부 확인 (tm 값을 기준으로 확인)
                if not collection.find_one({"tm": record.get("tm"),"stn": record.get("stn")}):
                    collection.insert_one(record)
                    print(f"데이터 저장 완료: {record}")
                else:
                    print(f"중복 데이터 건너뜀: tm={record['tm']}, stn={record['stn']}")
        else:
            # 단일 데이터 저장
            if not collection.find_one({"tm": data.get("tm"), "stn": data.get("stn")}):
                collection.insert_one(data)
                print(f"단일 데이터 저장 완료: {data}")
            else:
                print(f"중복 데이터 건너뜀: tm={record['tm']}, stn={record['stn']}")
    except Exception as e:
        print(f"MongoDB 저장 실패: {e}")
    finally:
        client.close()  # 연결 종료
