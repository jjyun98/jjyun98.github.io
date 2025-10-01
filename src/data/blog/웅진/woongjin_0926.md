---
author: Jo YunHo
pubDatetime: 2025-09-26T00:00:00Z
modDatetime: 2025-09-28T00:00:00Z
title: 부트캠프 학습정리 (2)
slug: "web-data-collection-requests"
featured: false
draft: false
tags:
  - Python
  - Web Scraping
  - Data Collection
description: "Python의 requests 라이브러리를 활용한 웹 데이터 수집 기초부터 실무 활용까지. GET, POST 요청과 에러 처리 방법을 실습과 함께 학습합니다."
---

> 📌 **requests란?**  
> Python에서 HTTP 요청을 간편하게 보낼 수 있는 라이브러리로, 웹 API와 데이터 수집에 필수적인 도구입니다.

## Table of contents

## 1. 환경 설정 및 기본 설치

### 라이브러리 설치 및 로드

```python
# 필요한 라이브러리 설치
!pip install requests beautifulsoup4

# 라이브러리 임포트
import re
import pandas as pd
import numpy as np
import requests
from bs4 import BeautifulSoup as bs
```

## 2. GET 요청 기초

### 기본 GET 요청

GET 요청은 웹에서 데이터를 가져올 때 가장 많이 사용하는 방법입니다.

```python
# 기본 GET 요청
url = 'https://httpbin.org/get?q=python&page=2'
res = requests.get(url)
data = res.json()

print("요청 URL:", res.url)
print("응답 keys:", list(data.keys()))
```

**출력 결과:**
```
요청 URL: https://httpbin.org/get?q=python&page=2
응답 keys: ['args', 'headers', 'origin', 'url']
```

### params를 활용한 GET 요청

URL에 직접 쿼리 스트링을 작성하는 대신 params 딕셔너리를 사용하면 더 깔끔합니다.

```python
url = "https://httpbin.org/get"
params = {"q": "python", "page": 2}

res = requests.get(url, params=params)
data = res.json()

print("요청 URL:", res.url)
print("응답 keys:", list(data.keys()))
```

## 3. 구글 검색 자동완성 API 활용

### XML 데이터 파싱

```python
url = "http://suggestqueries.google.com/complete/search?output=toolbar&q=하이닉스"
res = requests.get(url)
soup = bs(res.content, 'xml')

print("자동완성 결과:")
for suggestion in soup.find_all('suggestion'):
    print(suggestion['data'])
```

**출력 결과:**
```
자동완성 결과:
하이닉스
하이닉스 주가
하이닉스 채용
하이닉스 hbm4
하이닉스 성과급
하이닉스 주식
하이닉스 기반 기술
하이닉�스 자소서
하이닉스 공채
하이닉스 연봉
```

## 4. 공공 데이터 API 활용

### 공휴일 정보 API

한국의 공휴일 정보를 가져와서 DataFrame으로 정리하는 실습입니다.

```python
# 공휴일 API 호출
url = 'http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo?solYear=2025&_type=json&ServiceKey=87c679b5da52deaa204520b6001a4c04758f392a3cb8a2d838ab909851ebc9c8'
res = requests.get(url)
holiday_json = res.json()

# 데이터 추출
date_list = []
for key, value in holiday_json.items():
    for key2, values in value.items():
        for key3, val in values.items():
            if type(val) == dict:
                date_list.append(val['item'])

date_list = date_list[0].copy()
print(f"총 {len(date_list)}개의 공휴일 데이터")
```

비효율적인 코드이므로 개선 버전

```python
import requests

def get_holidays(year=2025):
    """공휴일 데이터를 안전하게 가져오는 함수"""
    url = "http://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo"
    params = {
        'solYear': year,
        '_type': 'json',
        'ServiceKey': '87c679b5da52deaa204520b6001a4c04758f392a3cb8a2d838ab909851ebc9c8'
    }
    
    try:
        res = requests.get(url, params=params, timeout=(5, 20))
        res.raise_for_status()
        
        data = res.json()
        
        # 안전한 데이터 접근
        items = data.get('response', {}).get('body', {}).get('items', {})
        
        if isinstance(items.get('item'), list):
            return items['item']
        elif items.get('item'):  # 단일 항목인 경우
            return [items['item']]
        else:
            return []
            
    except requests.exceptions.RequestException as e:
        print(f"API 요청 실패: {e}")
        return []
    except KeyError as e:
        print(f"예상치 못한 응답 구조: {e}")
        return []

# 사용법
holidays = get_holidays(2025)
print(f"총 {len(holidays)}개의 공휴일 데이터")
```


**출력 결과:**
```
총 10개의 공휴일 데이터
```

### 공휴일 데이터 정리 함수

```python
def make_holi_func(date_list):
    d_name = []
    l_date = []
    for i in range(len(date_list)):
        d_name.append(date_list[i]['dateName'])
        l_date.append(date_list[i]['locdate'])
    
    result = pd.DataFrame({
        'date_name': d_name,
        'locdate': pd.to_datetime(l_date, format='%Y%m%d')
    })
    result['요일'] = result['locdate'].dt.day_name()
    return result

# 함수 실행
holiday_df = make_holi_func(date_list)
print(holiday_df.head(10))
```

**출력 결과:**
```
  date_name    locdate         요일
0      1월1일 2025-01-01  Wednesday
1     임시공휴일 2025-01-27     Monday
2        설날 2025-01-28    Tuesday
3        설날 2025-01-29  Wednesday
4        설날 2025-01-30   Thursday
5       삼일절 2025-03-01   Saturday
6     대체공휴일 2025-03-03     Monday
7      어린이날 2025-05-05     Monday
8    부처님오신날 2025-05-05     Monday
9     대체공휴일 2025-05-06    Tuesday
```

## 5. POST 요청 활용

### JSON 데이터 전송

POST 요청은 서버에 데이터를 전송할 때 사용합니다.

```python
url = 'https://httpbin.org/post'
payload = {
    "product": "아이폰",
    "info": {"manufacture": "USA", "price": 1500000}
}

res = requests.post(url, json=payload)
data = res.json()

print("전송한 데이터:")
print(data['json'])
```

**출력 결과:**
```
전송한 데이터:
{'info': {'manufacture': 'USA', 'price': 1500000}, 'product': '아이폰'}
```

## 6. 파일 다운로드

### 작은 파일 다운로드

```python
url = 'https://httpbin.org/image/png'
res = requests.get(url)

with open("sample_once.png", 'wb') as f:
    f.write(res.content)
print("다운로드 완료")
```

### 큰 파일 스트리밍 다운로드

```python
url = 'https://httpbin.org/image/png'
res = requests.get(url, stream=True)

with open('sample_iter.png', 'wb') as f:
    for chunk in res.iter_content(chunk_size=8192):
        if chunk:
            f.write(chunk)
print("다운로드 완료")
```

## 7. 에러 처리 및 타임아웃

### 안전한 요청 처리

```python
url = "https://httpbin.org/get"
params = {"q": "python", "page": 2}

try:
    res = requests.get(url, params=params, timeout=(5, 20))
    res.raise_for_status()  # 200~399 외에는 HTTP Error발생
    data = res.json()
    print("성공")
except requests.exceptions.Timeout:
    print("타임아웃")
except Exception as e:
    print("요청 에러")
```

## 8. 실무 활용 예제

### 인터파크 콘서트 정보 수집

```python
def inter_rank(res):
    g_code = []
    g_name = []
    region_name = []  
    s_date = []
    e_date = []
    rate_name = []    
    
    for i in range(len(res.json())):
        g_code.append(res.json()[i]['goodsCode'])
        g_name.append(res.json()[i]['goodsName'])
        region_name.append(res.json()[i]['regionName'])
        s_date.append(res.json()[i]['startDate'])
        e_date.append(res.json()[i]['endDate'])
        rate_name.append(res.json()[i]['rateName'])
    
    result = pd.DataFrame({
        'goodsCode': g_code,
        'goodsName': g_name,
        'regionName': region_name,
        'startDate': s_date,
        'endDate': e_date,
        'rateName': rate_name
    })
    return result

# API 호출
url = "https://tickets.interpark.com/contents/api/goods/genre?genre=CONCERT&&pageSize=25&sort=DAILY_RANKING"
for i in range(1, 5):
    params = {"page": i}
    res = requests.get(url, params=params)
    
concert_df = inter_rank(res)
print(concert_df.head())
```

**출력 결과:**
```
  goodsCode                             goodsName regionName startDate
0  25011160          2025 최시봉 ［The Last］ 콘서트 - 부산        부산시  20251018
1  25011276          2025 최시봉 ［The Last］ 콘서트 - 인천        인천시  20251101
2  25013726                   미노와 히로유키 재즈콘서트 내한공연         서울  20251101
3  25012014              박창근 장르 with Mr.아보카도 - 부산        부산시  20251025
4  25013879  Hindie LIVE Vol.2 ⟨너드커넥션 X 루아멜⟩ - 하남         경기  20251101

    endDate    rateName
0  20251018   8세이상 관람가능
1  20251101   8세이상 관람가능
2  20251101   미취학아동입장불가
3  20251026   미취학아동입장불가
4  20251101  초등학생이상 관람가
```

### 야놀자 호텔 정보 수집

```python
import csv

# 헤더 설정 (봇 차단 우회)
headers = {
    "User-Agent": (
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/120.0.0.0 Safari/537.36"
    ),
    "Accept": "application/json, text/plain, */*",
    "Content-Type": "application/json;charset=UTF-8",
    "Origin": "https://nol.yanolja.com",
    "Referer": "https://nol.yanolja.com/",
}

payload = {
    "page": 1,
    "sort": "RECOMMEND",
    "pageName": "HOTEL",
    "searchType": "hotel",
    "region": 900582
}

url_yanolja = 'https://nol.yanolja.com/api/v2/list/local-accommodation/v3/search'
res = requests.post(url_yanolja, headers=headers, json=payload)

if res.status_code == 200:
    json_file = res.json()
    
    with open('hotel.csv', 'w', encoding='utf-8') as file:
        writer = csv.writer(file)
        writer.writerow(['category', 'title', 'location', 'price', 'score', 'count'])

        for i in range(len(json_file['items'])):
            try:
                item = json_file['items'][i]['data']
                writer.writerow([
                    item['category'],
                    item['title'],
                    ', '.join(item['locationDetails']),
                    item['prices'][0]['discountPrice'],
                    item['review']['score'],
                    item['review']['count']
                ])
            except (KeyError, IndexError):
                continue
    
    print("호텔 데이터 수집 완료: hotel.csv")
```

## 9. HTTP 상태 코드 가이드

### 주요 상태 코드 의미

| 코드 | 의미 | 대응 방법 |
|------|------|-----------|
| 200 | 성공 | 정상 처리 |
| 400 | 잘못된 요청 | 파라미터 확인 |
| 401 | 인증 필요 | 토큰/쿠키 확인 |
| 403 | 접근 금지 | 헤더/권한 확인 |
| 404 | 리소스 없음 | URL 확인 |
| 429 | 요청 제한 | 대기 후 재시도 |
| 500 | 서버 오류 | 잠시 후 재시도 |

### 실무 체크리스트

- timeout 설정: `timeout=(연결시간, 읽기시간)`
- 상태 코드 확인: `response.raise_for_status()`
- 적절한 헤더 설정: User-Agent, Referer 등
- 요청 제한 고려: 429 에러 대응

## 마무리

requests 라이브러리는 **웹 데이터 수집의 핵심 도구**입니다. 이번 포스팅에서 다룬 주요 내용을 정리하면:

- **GET 요청**: 데이터 조회 및 API 호출
- **POST 요청**: 데이터 전송 및 폼 제출
- **에러 처리**: 타임아웃 및 상태 코드 관리
- **실무 활용**: 공공 API, 상업 사이트 데이터 수집
- **안전한 수집**: 헤더 설정 및 봇 차단 우회

**실무에서는 이러한 기법들이 특히 유용**합니다:
- 공공 데이터 포털 API 활용
- 전자상거래 사이트 상품 정보 수집
- 소셜 미디어 데이터 분석
- 금융 데이터 실시간 모니터링

다음 포스팅에서는 **BeautifulSoup과 Selenium을 활용한 고급 웹 스크래핑 기법**을 다뤄볼 예정입니다.