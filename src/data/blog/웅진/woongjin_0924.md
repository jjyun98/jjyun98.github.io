---
author: Jo YunHo
pubDatetime: 2025-09-24T00:00:00Z
modDatetime: 2025-09-24T00:00:00Z
title: 부트캠프 학습정리 (1)
slug: "python-basic-study"
featured: true
draft: false
tags:
  - Python
description: "웅진 부트캠프 1일차 학습 내용 정리"
---

> 📌 **학습 배경**  
> 통계학 전공자로서 데이터 분석 취업을 준비하며 Python 기초부터 체계적으로 정리한 학습 노트입니다. Jupyter Notebook 환경에서 직관적이고 쉬운 코드로 실습하며 익힌 내용을 공유합니다.

## Table of contents

## 1. Jupyter Notebook 환경 설정

데이터 분석 실습을 위해 Jupyter Notebook 환경을 선택했습니다. 코드와 문서, 시각화를 한 번에 관리할 수 있어 학습과 실습에 최적화된 도구입니다.

### 주요 단축키 정리

```python
# 명령 모드 (Esc)
# a: 위에 셀 추가
# b: 아래에 셀 추가  
# dd: 현재 셀 삭제
# m: 셀을 Markdown으로 변경
# y: 셀을 Code로 변경

# 편집 모드 (Enter)
# Shift + Enter: 셀 실행 후 다음 셀로 이동
# Ctrl + Enter: 셀 실행만
# Alt + Enter: 실행 후 아래 새 셀 추가
```

## 2. Python 기본 연산자와 자료형

### 비교 연산자 실습

```python
x = 10
y = 10.0
z = None

print(x == y)     # True - 값(value) 비교
print(x is y)     # False - 객체의 동일성(identity) 비교
print(z == None)  # True - 권장 X
print(z is None)  # True - 권장 O (PEP8 준수)
print(x >= 5 and y != 5)  # True
```

**결과:**
```
True
False
True
True
True
```

### Type Casting의 중요성

데이터 분석에서 외부 데이터를 읽을 때 항상 마주하는 문제입니다.

```python
# 타입 변환 예시
float_num = 100.1
print(f"타입: {type(float_num)}, 값: {float_num}")

int_num = int(float_num)  # 데이터 손실 주의!
print(f"타입: {type(int_num)}, 값: {int_num}")

# 실제 문제 상황
price = "1000"  # CSV/Excel에서 읽은 데이터는 문자열
tax_rate = 0.1

# 타입 캐스팅 필수
total = int(price) * (1 + tax_rate)
print(f"총액: {total}")
```

**결과:**
```
타입: <class 'float'>, 값: 100.1
타입: <class 'int'>, 값: 100
총액: 1100.0
```

## 3. 컬렉션 자료형과 성능 비교

### Set vs List 성능 차이 체험

```python
import time

N = 10_000_000
target = N - 1

big_list = list(range(N))
big_set = set(range(N))

# LIST 검색 시간
start = time.time()
print(target in big_list)
end = time.time()
print(f"리스트 검색 시간: {end - start:.6f}초")

# SET 검색 시간  
start = time.time()
print(target in big_set)
end = time.time()
print(f"셋 검색 시간: {end - start:.6f}초")
```

**결과:**
```
True
리스트 검색 시간: 0.083130초
True
셋 검색 시간: 0.000032초
```

이런 성능 차이로 인해 실무에서는 IP 블록 리스트, 토큰 검증 등에서 set을 적극 활용합니다.

## 4. 실습 과제로 익히는 Python 기초

### 장바구니 분석 실습

```python
# 장바구니 상품 가격 리스트
cart = [12000, 5500, 33000, 8000, 15000]

# 이합, 최대값, 최소값 계산
# 내장 함수(sum, max, min)는 속도·가독성 모두 뛰어나므로 적극 사용
total = sum(cart)
max_price = max(cart)  
min_price = min(cart)

print(f"이합: {total:,}원")
print(f"최대값: {max_price:,}원")
print(f"최소값: {min_price:,}원")

# 30,000원 이상 상품 필터링
high_value_orders = [price for price in cart if price >= 30000]
print(f"고액 주문: {high_value_orders}")
```

**결과:**
```
이합: 73,500원
최대값: 33,000원
최소값: 5,500원
고액 주문: [33000]
```

### 회원 등급 판정 시스템

```python
age = int(input("나이를 입력하세요: "))

if age >= 20:
    print("성인 회원 할인 적용")
else:
    print("청소년 회원 할인 적용")
```

## 5. 문자열 처리와 데이터 정제

소셜 미디어 댓글 분석을 위한 전처리 실습을 진행했습니다.

```python
comments = [
    "   와… 여기 진짜 맛있어요!!! 😀 #맛집 #핫플   ",
    "\t넘 예쁘다요~~~ ㅋㅋ #여행 #뷰맛집 #여행 ",
    "광고 인가요? 광고성 포스트 같아요. http://example.com  #협찬?",
    " @brand_official 서비스 최고… 근데 가격은 좀 😅 #가성비 ",
    "다신 안가요   🤬🤬  서비스가 너무 별로였음… #실망 #노추천   "
]

# 1) 공백 제거
cleaned = [comment.strip() for comment in comments]

# 2) 특정 해시태그 개수 세기
hashtag_count = sum(comment.count("#여행") for comment in cleaned)
print(f"#여행 등장 횟수: {hashtag_count}")

# 3) 멘션 위치 찾기
mention_positions = [comment.find("@brand_official") for comment in cleaned]
print(f"멘션 위치 인덱스: {mention_positions}")

# 4) 부정적 표현 정규화
replacements = {
    "🤬": "🔇",
    "노추천": "비추천", 
    "광고": "프로모션"
}

normalized = []
for comment in cleaned:
    text = comment
    for old, new in replacements.items():
        text = text.replace(old, new)
    normalized.append(text)

print("정규화된 댓글:")
for i, comment in enumerate(normalized, 1):
    print(f"{i:02d}. {comment}")
```

**결과:**
```
#여행 등장 횟수: 2
멘션 위치 인덱스: [-1, -1, -1, 0, -1]
정규화된 댓글:
01. 와… 여기 진짜 맛있어요!!! 😀 #맛집 #핫플
02. 넘 예쁘다요~~~ ㅋㅋ #여행 #뷰맛집 #여행
03. 프로모션 인가요? 프로모션성 포스트 같아요. http://example.com  #협찬?
04. @brand_official 서비스 최고… 근데 가격은 좀 😅 #가성비
05. 다신 안가요   🔇🔇  서비스가 너무 별로였음… #실망 #비추천
```

## 6. 경계값 버그 실습

실무에서 자주 발생하는 경계값 처리 오류를 직접 체험해봤습니다.

```python
def discount_rate(amount):
    """
    장바구니 금액에 따른 할인율 반환
    0~49,999원: 0% / 50,000~99,999원: 5% / 100,000원 이상: 10%
    """
    if amount >= 100000:        # 높은 조건부터 검사
        return 0.10
    elif amount >= 50000:
        return 0.05
    else:
        return 0.0

# 경계값 테스트
test_list = [49_999, 50_000, 99_999, 100_000, 120_000]
expect_dict = {
    49_999: 0.00, 50_000: 0.05, 99_999: 0.05, 
    100_000: 0.10, 120_000: 0.10
}

print("금액\t\t할인율(계산)\t기대값\t\tOK?")
for amount in test_list:
    calculated = discount_rate(amount)
    expected = expect_dict[amount]
    ok = "✅" if calculated == expected else "❌"
    print(f"{amount:>7,d}\t\t{calculated:.2%}\t\t{expected:.2%}\t\t{ok}")
```

**결과:**
```
금액		할인율(계산)	기대값		OK?
 49,999		0.00%		0.00%		✅
 50,000		5.00%		5.00%		✅
 99,999		5.00%		5.00%		✅
100,000		10.00%		10.00%		✅
120,000		10.00%		10.00%		✅
```

## 7. 파일 처리와 데이터 포맷

### Plain Text 처리

```python
# 마케팅 메시지 파일 읽기
with open('./data/plain_text_origin.txt', 'r', encoding='utf-8') as f:
    for num in range(0, 10):
        line = f.readline()
        if line:
            print(f"{num} : {line.strip()}")
```

**결과:**
```
0 : 단 3일! 지금만 만나는 초특가 인기 아이템
1 : 오늘 하루! 역대급 혜택으로 베스트 상품 GET
2 : 주말 한정! 놓치면 후회할 핫딜 상품 모음
...
```

### CSV 파일 처리

```python
import csv

with open('./data/kobis_250916.csv', 'r') as csv_file:
    csv_reader = csv.reader(csv_file, delimiter=',')
    for index, line in enumerate(csv_reader):
        print(f"{line[0:5]}")
        if index > 5:
            break
```

**결과:**
```
['순번', '영화명', '감독', '제작사', '수입사']
['1', '쥬라기 월드: 새로운 시작', '가렛 에드워즈', '', '유니버설픽처스인터내셔날코리아(유)']
['2', 'F1 더 무비', '조셉 코신스키', '', '워너브러더스 코리아(주)']
...
```

## 8. 웹 크롤링 실습 - 인터파크 티켓 API

실제 웹 API를 활용한 데이터 수집 실습을 진행했습니다.

```python
import requests
import json

# 인터파크 티켓 가격 정보 API
url = 'https://api-ticketfront.interpark.com/v1/goods/25013780/prices/group'

# API 호출
resp = requests.get(url, headers={"Accept": "application/json"}, timeout=10)
print(f"응답 상태: {resp.status_code}")

# JSON 데이터 파싱
json_data = resp.json()

# 좌석별 가격 정보 추출
list_data = []
for seat, value_dict in json_data.items():
    for price, value in value_dict.items():
        list_data.append(value)

# 가격 정보 출력
print("좌석별 티켓 가격:")
for i in range(len(list_data)):
    seat_info = list_data[i][0]
    seat_name = seat_info['seatGradeName']
    price = seat_info['salesPrice']
    print(f"{seat_name}: {price:,}원")
```

**결과:**
```
응답 상태: 200
좌석별 티켓 가격:
스탠딩: 154,000원
지정석 SR: 165,000원
지정석 R: 154,000원
```

## 9. JSON 데이터 처리 심화

### API 응답 처리 패턴

```python
# 환율 API 호출 예시
resp = requests.get("https://api.frankfurter.app/latest?from=KRW&to=USD")

# (1) 응답 파싱
json_dict = json.loads(resp.text)
print(f"응답 타입: {type(json_dict)}")

# (2) 중첩된 데이터 안전하게 접근
usd_rate = json_dict.get("rates", {}).get("USD")
print(f"KRW to USD 환율: {usd_rate}")

# (3) 요청용 데이터 준비
payload = {
    "code": "005930",
    "name": "삼성전자", 
    "price": {"unit": "KRW", "value": 78100}
}

# (4) dict → JSON 문자열 변환
json_str = json.dumps(payload, ensure_ascii=False)
print(f"전송용 JSON: {json_str}")
```

**결과:**
```
응답 타입: <class 'dict'>
KRW to USD 환율: 0.00072
전송용 JSON: {"code": "005930", "name": "삼성전자", "price": {"unit": "KRW", "value": 78100}}
```

## 주요 학습 포인트

### 실무 활용 관점에서 배운 것들

1. **타입 캐스팅의 중요성**: CSV/Excel 등 외부 데이터는 항상 문자열로 입력되므로 적절한 형 변환 필수

2. **성능을 고려한 자료구조 선택**: 검색이 빈번한 경우 set 활용으로 성능 향상

3. **경계값 테스트**: 조건문 작성 시 순서와 범위 신중하게 검토

4. **안전한 파일 처리**: `with` 문으로 자원 관리 자동화

5. **실무적 문자열 처리**: 실제 데이터는 노이즈가 많으므로 체계적인 전처리 필요


Python 기초를 탄탄히 다지고 나니 데이터 분석의 본격적인 도구들을 학습할 준비가 되었습니다. 다음 포스팅에서는 Pandas를 활용한 데이터 조작과 분석 실습을 다뤄보겠습니다.