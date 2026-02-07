---
title: 'Mutate와 Join 정리'
published: 2022-08-20
draft: false
description: "R dplyr 패키지 문법 정리. mutate, join 기법, filter join, 집합 연산을 예제와 함께 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

> 참고 자료:
> [dplyr 공식 문서](https://dplyr.tidyverse.org/) | [R for Data Science - Data Transformation](https://r4ds.had.co.nz/transform.html)

## 개요

데이터 변환(Mutate)과 데이터 결합(Join)은 데이터 분석의 핵심 기술입니다. 단일 테이블에서 새로운 변수를 생성하는 것부터 여러 테이블을 연결하여 통합 분석을 수행하는 방법을 알아보겠습니다.

```r title="환경 설정"

```r
# 패키지 로드
library('tidyverse')     # dplyr 포함
library('nycflights13')  # 실습 데이터

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 2. 데이터 탐색과 기본키 확인

### count와 filter를 활용한 데이터 품질 검증

#### 기본키 중복 확인

```r
# weather 데이터의 기본키 중복 검사
weather %>%
  count(year, month, day, hour, origin) %>%
  filter(n > 1)
#   year month day hour origin n
# 1 2013    11   3    1    EWR 2
# 2 2013    11   3    1    JFK 2  
# 3 2013    11   3    1    LGA 2
```

#### flights 데이터의 중복 항공편 확인

```r
# 같은 날짜에 같은 항공편 번호가 여러 번 운항되는 경우
flights %>%
  count(year, month, day, flight) %>%
  filter(n > 1) %>% head()
#   year month day flight n
# 1 2013     1   1      1 2
# 2 2013     1   1      3 2
# 3 2013     1   1      4 2
# 4 2013     1   1     11 3  # 같은 항공편이 하루에 3번!
# 5 2013     1   1     15 2
# 6 2013     1   1     21 2
```

:::tip 데이터 품질 검증 팁
- **기본키 확인**: `count() + filter(n > 1)`로 중복 검사
- **데이터 무결성**: 예상과 다른 중복이 있다면 원인 파악 필요
- **비즈니스 로직**: 항공편은 하루에 여러 번 운항 가능 (정상)
:::

## 3. 데이터 변환과 select

### 핵심 변수 선택

```r
# 분석에 필요한 핵심 변수만 선택
flights2 <- flights %>%
  select(year:day, hour, origin, dest, tailnum, carrier)

flights2 %>% head()
#   year month day hour origin dest tailnum carrier
# 1 2013     1   1    5    EWR  IAH  N14228      UA
# 2 2013     1   1    5    LGA  IAH  N24211      UA  
# 3 2013     1   1    5    JFK  MIA  N619AA      AA
# 4 2013     1   1    5    JFK  BQN  N804JB      B6
# 5 2013     1   1    6    LGA  ATL  N668DN      DL
# 6 2013     1   1    5    EWR  ORD  N39463      UA
```

#### select 패턴 활용법

| 패턴 | 설명 | 예제 |
|------|------|------|
| `year:day` | 범위 선택 | 연속된 여러 열 |
| `starts_with("dep")` | 접두사 | dep로 시작하는 열 |
| `ends_with("time")` | 접미사 | time으로 끝나는 열 |
| `contains("delay")` | 포함 | delay를 포함하는 열 |
| `-carrier` | 제외 | carrier 열 제외 |

## 4. Join 기초

### 기본 테이블 설정

```r
# 예제 데이터 생성
x <- tribble(
  ~key, ~val_x,
  1, "x1",
  2, "x2", 
  3, "x3"
)

y <- tribble(
  ~key, ~val_y,
  1, "y1",
  2, "y2",
  4, "y3"
)

x
#   key val_x
# 1   1    x1
# 2   2    x2
# 3   3    x3

y  
#   key val_y
# 1   1    y1
# 2   2    y2
# 3   4    y3
```

### inner_join - 교집합

```r
# 양쪽 테이블에 모두 존재하는 키만 유지
x %>% inner_join(y, by = "key")
#   key val_x val_y
# 1   1    x1    y1
# 2   2    x2    y2
```

## 5. Join 유형별 상세 설명

### Join 유형 비교표

| Join 유형 | 설명 | 결과 행 수 | 사용 상황 |
|-----------|------|------------|-----------|
| **inner_join** | 양쪽에 모두 있는 키만 | 교집합 | 완전 매칭만 필요할 때 |
| **left_join** | 왼쪽 기준, 오른쪽 보완 | 왼쪽과 동일 | 기본 테이블 유지 |
| **right_join** | 오른쪽 기준, 왼쪽 보완 | 오른쪽과 동일 | 참조 테이블 기준 |
| **full_join** | 양쪽 모두 포함 | 합집합 | 모든 데이터 보존 |

### left_join 실전 예제

```r
# 항공사 정보 추가
flights2 %>%
  select(-origin, -dest) %>%
  left_join(airlines, by = "carrier") %>% head()
#   year month day hour tailnum carrier                    name
# 1 2013     1   1    5  N14228      UA  United Air Lines Inc.
# 2 2013     1   1    5  N24211      UA  United Air Lines Inc.
# 3 2013     1   1    5  N619AA      AA American Airlines Inc.
# 4 2013     1   1    5  N804JB      B6        JetBlue Airways
# 5 2013     1   1    6  N668DN      DL   Delta Air Lines Inc.
# 6 2013     1   1    5  N39463      UA  United Air Lines Inc.
```

### match를 활용한 수동 매칭

```r
# mutate + match로 join과 같은 효과
flights2 %>%
  select(-origin, -dest) %>%
  mutate(name = airlines$name[match(carrier, airlines$carrier)]) %>% head()
#   year month day hour tailnum carrier                    name
# 1 2013     1   1    5  N14228      UA  United Air Lines Inc.
# 2 2013     1   1    5  N24211      UA  United Air Lines Inc.
# 3 2013     1   1    5  N619AA      AA American Airlines Inc.
# 4 2013     1   1    5  N804JB      B6        JetBlue Airways
# 5 2013     1   1    6  N668DN      DL   Delta Air Lines Inc.
# 6 2013     1   1    5  N39463      UA  United Air Lines Inc.
```

#### match vs join 비교

| 방법 | 장점 | 단점 | 권장 사용 |
|------|------|------|-----------|
| **match** | 간단한 1:1 매칭에 빠름 | 복잡한 조건 처리 어려움 | 단순 코드 변환 |
| **join** | 유연하고 명확한 의도 | 약간의 오버헤드 | 일반적인 테이블 결합 |

## 6. 고급 Join 기법

### Natural Join (자동 키 매칭)

```r
# 공통 변수로 자동 join
flights2 %>%
  left_join(weather) %>% head()
# Joining with `by = join_by(year, month, day, hour, origin)`
#   year month day hour origin dest tailnum carrier  temp  dewp humid wind_dir
# 1 2013     1   1    5    EWR  IAH  N14228      UA 39.02 28.04 64.43      260
# 2 2013     1   1    5    LGA  IAH  N24211      UA 39.92 24.98 54.81      250
# 3 2013     1   1    5    JFK  MIA  N619AA      AA 39.02 26.96 61.63      260
```

### 다른 이름의 키로 Join

```r
# dest(목적지)와 faa(공항코드) 매칭
flights2 %>%
  left_join(airports, c("dest" = "faa")) %>% head()
#   year month day hour origin dest tailnum carrier                         name      lat       lon
# 1 2013     1   1    5    EWR  IAH  N14228      UA George Bush Intercontinental 29.98443 -95.34144
# 2 2013     1   1    5    LGA  IAH  N24211      UA George Bush Intercontinental 29.98443 -95.34144
# 3 2013     1   1    5    JFK  MIA  N619AA      AA                   Miami Intl 25.79325 -80.29056
# 4 2013     1   1    5    JFK  BQN  N804JB      B6                         <NA>       NA        NA
# 5 2013     1   1    6    LGA  ATL  N668DN      DL    Hartsfield Jackson Atlanta 33.63672 -84.42807
# 6 2013     1   1    5    EWR  ORD  N39463      UA             Chicago Ohare Intl 41.97860 -87.90484
```

### 중복 키 처리

```r
# 한쪽 테이블에 중복 키가 있는 경우
x <- tribble(
  ~key, ~val_x,
  1, "x1",
  2, "x2", 
  2, "x3",  # 중복 키
  1, "x4"   # 중복 키
)

y <- tribble(
  ~key, ~val_y,
  1, "y1",
  2, "y2"
)

left_join(x, y, by = "key")
#   key val_x val_y
# 1   1    x1    y1
# 2   2    x2    y2  
# 3   2    x3    y2  # x2, x3 모두 y2와 매칭
# 4   1    x4    y1  # x1, x4 모두 y1과 매칭
```

:::note 주의사항
중복 키가 있으면 카르테시안 곱이 발생하여 행 수가 급격히 증가할 수 있습니다.
:::

## 7. Filtering Join

### semi_join - 매칭되는 행만 필터링

```r
# 상위 10개 목적지 추출
top_dest <- flights %>%
  count(dest, sort = TRUE) %>%
  head(10)

top_dest
#   dest     n
# 1  ORD 17283
# 2  ATL 17215  
# 3  LAX 16174
# 4  BOS 15508
# 5  MCO 14082
# 6  CLT 14064
# 7  SFO 13331
# 8  FLL 12055
# 9  MIA 11728
# 10 DCA  9705

# 상위 목적지로 가는 항공편만 필터링
flights %>%
  semi_join(top_dest) %>% head()
# Joining with `by = join_by(dest)`
#   year month day dep_time sched_dep_time dep_delay arr_time sched_arr_time
# 1 2013     1   1      542            540         2      923            850
# 2 2013     1   1      554            600        -6      812            837
# 3 2013     1   1      554            558        -4      740            728
# 4 2013     1   1      555            600        -5      913            854
# 5 2013     1   1      557            600        -3      838            846
# 6 2013     1   1      558            600        -2      753            745
```

### filter vs semi_join 비교

```r
# 동일한 결과를 얻는 두 가지 방법
# 방법 1: filter 사용
flights %>%
  filter(dest %in% top_dest$dest) %>% head()

# 방법 2: semi_join 사용  
flights %>%
  semi_join(top_dest) %>% head()
```

:::tip semi_join의 장점
- **의도 명확**: "매칭되는 것만 필터링" 의도가 분명
- **성능**: 큰 데이터셋에서 더 효율적
- **안전성**: 실수로 변수가 추가되지 않음
:::

### anti_join - 매칭되지 않는 행 찾기

```r
# planes 테이블에 없는 항공기를 사용하는 항공편
flights %>%
  anti_join(planes, by = "tailnum") %>%
  count(tailnum, sort = TRUE) %>% head()
#   tailnum     n
# 1    <NA>  2512  # 항공기 번호가 누락된 경우
# 2 N725MQ   575   # 데이터베이스에 없는 항공기
# 3 N722MQ   513
# 4 N723MQ   507  
# 5 N713MQ   483
# 6 N735MQ   396
```

:::tip anti_join 활용 사례
- **데이터 품질 검사**: 참조 무결성 위반 찾기
- **누락 데이터 파악**: 어떤 데이터가 빠져있는지 확인
- **예외 상황 분석**: 정상적이지 않은 케이스 발견
:::

## 8. 집합 연산

### 기본 집합 연산

```r
# 예제 데이터
df1 <- tribble(
  ~x, ~y,
  1,  1,
  2,  1
)

df2 <- tribble(
  ~x, ~y,
  1,  1,
  1,  2
)

# 교집합
intersect(df1, df2)
#   x y
# 1 1 1

# 합집합
union(df1, df2)  
#   x y
# 1 1 1
# 2 2 1
# 3 1 2

# 차집합 (df1에는 있지만 df2에는 없는 행)
setdiff(df1, df2)
#   x y
# 1 2 1
```

### 실무 활용 예제

```r
# 공통 변수명 확인
common_vars <- intersect(colnames(flights2), colnames(weather))
common_vars
# [1] "year"   "month"  "day"    "hour"   "origin"

# 전체 변수명 확인  
all_vars <- union(colnames(flights2), colnames(weather))
all_vars
# [1] "year"       "month"      "day"        "hour"       "origin"     
# [6] "dest"       "tailnum"    "carrier"    "temp"       "dewp"       
# [11] "humid"      "wind_dir"   "wind_speed" "wind_gust"  "precip"     
# [16] "pressure"   "visib"      "time_hour"
```

## 9. 실전 데이터 분석 워크플로우

### 단계별 데이터 결합 예제

```r
# 1단계: 핵심 변수 선택
flights_clean <- flights %>%
  select(year:day, hour, origin, dest, tailnum, carrier, 
         dep_delay, arr_delay, distance, air_time)

# 2단계: 항공사 정보 추가
flights_with_airline <- flights_clean %>%
  left_join(airlines, by = "carrier")

# 3단계: 날씨 정보 추가
flights_with_weather <- flights_with_airline %>%
  left_join(weather, by = c("year", "month", "day", "hour", "origin"))

# 4단계: 공항 정보 추가 (출발지)
flights_with_origin <- flights_with_weather %>%
  left_join(airports, by = c("origin" = "faa"), suffix = c("", "_origin"))

# 5단계: 공항 정보 추가 (목적지)  
flights_complete <- flights_with_origin %>%
  left_join(airports, by = c("dest" = "faa"), suffix = c("_origin", "_dest"))

# 결과 확인
flights_complete %>%
  select(carrier, name, origin, name_origin, dest, name_dest, temp, wind_speed) %>%
  head()
```

### 데이터 품질 검증

```r
# 결합 후 데이터 손실 확인
cat("원본 행 수:", nrow(flights_clean), "\n")
cat("최종 행 수:", nrow(flights_complete), "\n")
cat("매칭 실패율:", 
    round(100 * sum(is.na(flights_complete$temp)) / nrow(flights_complete), 2), "%\n")
```

## 실무 활용 팁

### Join 선택 가이드

| 상황 | 추천 Join | 이유 |
|------|-----------|------|
| **메인 테이블에 정보 보강** | `left_join` | 원본 데이터 유지 |
| **완전 매칭만 필요** | `inner_join` | 깔끔한 결과 |
| **모든 데이터 보존** | `full_join` | 데이터 손실 방지 |
| **조건부 필터링** | `semi_join` | 효율적 필터링 |
| **예외 케이스 찾기** | `anti_join` | 데이터 품질 검사 |

### 성능 최적화

1. **인덱스 활용**: 키 변수에 인덱스 설정
2. **메모리 관리**: 필요한 변수만 선택 후 join
3. **순서 최적화**: 작은 테이블부터 join
4. **중복 제거**: join 전 distinct() 활용

### 데이터 품질 관리

```r
# Join 전 데이터 품질 체크리스트
check_data_quality <- function(df, key_vars) {
  cat("=== 데이터 품질 체크 ===\n")
  cat("전체 행 수:", nrow(df), "\n")
  cat("키 변수 결측값:", sum(is.na(df[key_vars])), "\n")
  cat("키 조합 중복:", 
      nrow(df) - nrow(distinct(df, !!!syms(key_vars))), "\n")
  cat("고유 키 조합:", nrow(distinct(df, !!!syms(key_vars))), "\n")
}

# 사용 예
check_data_quality(flights, c("year", "month", "day", "flight"))
```

## 마무리

데이터 변환과 결합은 데이터 분석의 핵심 스킬입니다. 주요 내용을 정리하면:

- **기본 Join**: inner, left, right, full join의 적절한 활용
- **고급 기법**: 다른 이름의 키 매칭, 중복 키 처리
- **Filtering Join**: semi_join과 anti_join으로 효율적 필터링
- **집합 연산**: 데이터 비교와 품질 검증
- **실전 워크플로우**: 단계별 데이터 결합과 검증

실무에서는 여러 테이블의 정보를 결합하여 통합 분석을 수행합니다. 각 join 유형의 특성을 정확히 이해하고, 데이터 손실이나 중복을 방지하면서 안전하게 결합하는 기술이 중요합니다.

특히 데이터 품질 검증을 습관화하여 join 전후의 행 수 변화, 결측값 증가, 예상치 못한 중복 등을 체크하면 신뢰할 수 있는 분석 결과를 얻을 수 있습니다.