---
author: Jo YunHo
pubDatetime: 2022-08-01T10:00:00Z
modDatetime: 2025-01-17T16:00:00Z
title: Data Handling with tidyverse - 데이터 조작의 핵심 (3)
slug: "data-handling-tidyverse-core"
featured: false
draft: false
tags:
  - R
  - Data Analysis
  - tidyverse
  - dplyr
description: "tidyverse를 활용한 데이터 조작의 핵심 기법을 마스터해보세요. filter, arrange, select, mutate, summarize 등 실무에서 가장 많이 사용되는 데이터 핸들링 기법을 체계적으로 학습합니다."
---

> 📌 참고 자료:  
> [tidyverse 공식 문서](https://www.tidyverse.org/) | [R for Data Science](https://r4ds.had.co.nz/)

## Table of contents

## 개요

**데이터 분석의 핵심**은 원하는 형태로 데이터를 가공하는 것입니다! 이번 포스팅에서는 tidyverse의 핵심 패키지인 **dplyr**을 활용한 데이터 조작 기법들을 다룹니다.

**filter**, **arrange**, **select**, **mutate**, **summarize** 등 실무에서 가장 많이 사용되는 함수들을 예제와 함께 배워보세요. 이 기법들만 익혀도 대부분의 데이터 전처리 작업을 효율적으로 처리할 수 있습니다!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
library('tidyverse')
library('nycflights13')  # 2013년 뉴욕시 출발 항공편 정보 패키지

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)
theme_set(theme_minimal(base_size = 10))
```

### 데이터셋 살펴보기

```r
flights %>% head()
```

| year | month | day | dep_time | sched_dep_time | dep_delay | arr_time | sched_arr_time | arr_delay | carrier | flight | tailnum | origin | dest | air_time | distance | hour | minute | time_hour |
|------|-------|-----|----------|----------------|-----------|----------|----------------|-----------|---------|--------|---------|--------|------|----------|----------|------|--------|-----------|
| 2013 | 1 | 1 | 517 | 515 | 2 | 830 | 819 | 11 | UA | 1545 | N14228 | EWR | IAH | 227 | 1400 | 5 | 15 | 2013-01-01 05:00:00 |
| 2013 | 1 | 1 | 533 | 529 | 4 | 850 | 830 | 20 | UA | 1714 | N24211 | LGA | IAH | 227 | 1416 | 5 | 29 | 2013-01-01 05:00:00 |
| 2013 | 1 | 1 | 542 | 540 | 2 | 923 | 850 | 33 | AA | 1141 | N619AA | JFK | MIA | 160 | 1089 | 5 | 40 | 2013-01-01 05:00:00 |

nycflights13 패키지의 `flights` 데이터셋은 2013년 뉴욕의 공항에서 출발한 336,776개의 항공편 정보를 담고 있습니다.

#### 📊 주요 변수 설명
- `dep_time`, `arr_time`: 출발/도착 시간
- `dep_delay`, `arr_delay`: 출발/도착 지연시간
- `carrier`: 항공사 코드
- `distance`: 비행 거리
- `dttm`: 날짜-시간형(날짜 + 시간)

## 2. filter() - 행 필터링

### 기본 사용법

```r
# 1월 1일 항공편만 선택
filter(flights, month == 1, day == 1)
```

| year | month | day | dep_time | carrier | flight | origin | dest | arr_delay |
|------|-------|-----|----------|---------|--------|--------|------|-----------|
| 2013 | 1 | 1 | 517 | UA | 1545 | EWR | IAH | 11 |
| 2013 | 1 | 1 | 533 | UA | 1714 | LGA | IAH | 20 |
| 2013 | 1 | 1 | 542 | AA | 1141 | JFK | MIA | 33 |

*결과: 842개의 항공편이 1월 1일에 출발했습니다.*

### 부동소수점 비교

컴퓨터에서 부동소수점 연산은 정확하지 않을 수 있습니다.

```r
# 안전한 부동소수점 비교
near(sqrt(2)^2, 2)
```

```
[1] TRUE
```

### 논리 연산자 활용

```r
# 11월 또는 12월 항공편
filter(flights, month == 11 | month == 12)

# %in% 연산자 사용 (더 간결)
nov_dec <- filter(flights, month %in% c(11, 12))
nov_dec %>% tail()
```

| year | month | day | dep_time | carrier | dest | arr_delay |
|------|-------|-----|----------|---------|------|-----------|
| 2013 | 12 | 31 | NA | UA | JAC | NA |
| 2013 | 12 | 31 | NA | UA | DEN | NA |
| 2013 | 12 | 31 | NA | US | CLT | NA |

*결과: 11월과 12월에 총 55,403개의 항공편이 있었습니다.*

### 복합 조건

```r
# 출발 지연 120분 이하이고 도착 지연 120분 이하
filter(flights, !(arr_delay > 120 | dep_delay > 120))
```

#### ✅ 팁: 드모르간의 법칙
`!(x & y)`는 `!x | !y`와 같고, `!(x | y)`는 `!x & !y`와 같습니다.

## 3. arrange() - 행 정렬

### 기본 정렬

```r
# 도착 지연시간 기준 내림차순 정렬
arrange(flights, desc(arr_delay))
```

| year | month | day | dep_time | carrier | flight | dest | arr_delay |
|------|-------|-----|----------|---------|--------|------|-----------|
| 2013 | 1 | 9 | 641 | HA | 51 | HNL | 1272 |
| 2013 | 6 | 15 | 1432 | MQ | 3535 | CMH | 1127 |
| 2013 | 1 | 10 | 1121 | MQ | 3695 | ORD | 1109 |

*결과: 최대 지연시간은 1272분(약 21시간)이었습니다.*

### 결측값 처리

```r
df <- tibble(x = c(5, 2, NA))
arrange(df, x)  # NA는 항상 마지막에 위치
```

| x |
|---|
| 2 |
| 5 |
| NA |

#### 📌 중요사항
결측값(NA)은 정렬 시 항상 마지막에 배치됩니다.

## 4. select() - 열 선택

### 기본 사용법

```r
# 특정 열만 선택
select(flights, year, month, day)

# 범위 선택
select(flights, year:arr_delay)

# 특정 열 제외
select(flights, -(year:air_time))
```

### 고급 선택 함수

```r
# 패턴 기반 선택
select(flights, starts_with("dep"))  # 'dep'로 시작
select(flights, ends_with("delay"))  # 'delay'로 끝남
select(flights, contains("time"))    # 'time' 포함
```

#### 🎯 select() 도우미 함수들
- `starts_with('abc')`: 'abc'로 시작하는 이름
- `ends_with("xyz")`: 'xyz'로 끝나는 이름  
- `contains('abc')`: 'abc'를 포함한 이름
- `num_range('x', 1:3)`: x1, x2, x3에 매칭

### 변수명 변경과 재배치

```r
# 변수명 변경
rename(flights, tail_num = tailnum)

# 특정 변수를 앞으로 이동
select(flights, time_hour, air_time, everything())
```

## 5. mutate() - 새 변수 생성

### 기본 변수 추가

```r
flights_sml <- select(flights,
                      year:day,
                      ends_with('delay'),
                      distance,
                      air_time)

mutate(flights_sml,
       gain = arr_delay - dep_delay,        # 지연시간 개선
       speed = distance / air_time * 60)    # 속도(mph)
```

### transmute() - 새 변수만 유지

```r
transmute(flights,
          gain = arr_delay - dep_delay,
          hours = air_time / 60,
          gain_per_hour = gain / hours)
```

### 유용한 mutate 함수들

#### 산술 연산자
```r
# 나눗셈과 나머지
x <- 1:10
x %/% 3  # 정수 나눗셈
x %% 3   # 나머지
```

#### 위치 함수
```r
# 데이터 이동
lag(x)   # 한 칸 뒤로
lead(x)  # 한 칸 앞으로
```

#### 누적 함수
```r
cumsum(x)   # 누적 합
cummean(x)  # 누적 평균
```

## 6. summarize() - 그룹화 요약

### 기본 요약

```r
# 전체 평균 출발 지연시간
summarize(flights, delay = mean(dep_delay, na.rm = TRUE))
```

### group_by()와 함께 사용

```r
# 날짜별 평균 지연시간
by_day <- group_by(flights, year, month, day)
summarize(by_day, delay = mean(dep_delay, na.rm = TRUE))
```

### 파이프 연산자로 연결

```r
delays <- flights %>%
  group_by(dest) %>%
  summarize(
    count = n(),
    dist = mean(distance, na.rm = TRUE),
    delay = mean(arr_delay, na.rm = TRUE)
  ) %>%
  filter(count > 20, dest != "HNL")
```

#### 📊 시각화로 패턴 확인

```r
ggplot(data = delays, mapping = aes(x = dist, y = delay)) + 
  geom_point(aes(size = count), alpha = 1/3) +
  geom_smooth(se = FALSE)
```

![distance vs delay scatter plot](@/assets/images/2022-08-01-data_handling_a_files/2022-08-01-data_handling_a_46_1.png)

### 결측값 처리의 중요성

```r
# 취소된 항공편 제외
not_cancelled <- flights %>%
  filter(!is.na(dep_delay), !is.na(arr_delay))

# 더 정확한 분석
not_cancelled %>%
  group_by(year, month, day) %>%
  summarize(mean = mean(dep_delay))
```

## 7. 유용한 요약 함수들

### 데이터 분포 시각화

```r
ggplot(data = delays, mapping = aes(x = delay)) +
  geom_freqpoly(binwidth = 10)
```

![delay frequency polygon](@/assets/images/2022-08-01-data_handling_a_files/2022-08-01-data_handling_a_55_0.png)

애초에 평균으로 요약된 데이터로 구한 plot으로 특정 항공기 종류는 도착 지연시간 평균이 300분을 넘어가는 것을 볼 수 있습니다.

### 운항 횟수와 지연시간의 관계

```r
ggplot(data = delays, mapping = aes(x = n, y = delay)) +
  geom_point(alpha = 0.1)
```

![flights count vs delay scatter](@/assets/images/2022-08-01-data_handling_a_files/2022-08-01-data_handling_a_59_0.png)

**해석**: n은 해당 비행기 기종의 운행 횟수를 나타낸 것으로 운행횟수가 많아질수록 평균 지연시간의 변동폭이 적어짐을 알 수 있습니다(평균이기에). 반대로 평균 운행횟수가 적은 경우 변동폭이 비교적 더 큽니다.

```r
# 항공기별 운항 횟수와 평균 지연시간
delays <- not_cancelled %>%
  group_by(tailnum) %>%
  summarize(
    delay = mean(arr_delay),
    n = n()  # 개수 세기
  )
```

### 위치 측도

```r
# 일별 첫 출발과 마지막 출발
not_cancelled %>%
  group_by(year, month, day) %>%
  summarize(
    first = min(dep_time),
    last = max(dep_time)
  )
```

### 순위 함수

```r
# 각 날짜의 가장 빠른/늦은 출발편
not_cancelled %>%
  group_by(year, month, day) %>%
  mutate(r = min_rank(desc(dep_time))) %>%
  filter(r %in% range(r))
```

### 고급 요약 기법

#### 조건부 요약

```r
# 60분 이상 지연된 항공편 비율
not_cancelled %>%
  group_by(year, month, day) %>%
  summarize(hour_prop = mean(arr_delay > 60))
```

#### 고유값 개수

```r
# 목적지별 항공사 수
not_cancelled %>%
  group_by(dest) %>%
  summarize(carriers = n_distinct(carrier)) %>%
  arrange(desc(carriers))
```

#### 가중 카운트

```r
# 항공기별 총 비행 거리
not_cancelled %>%
  count(tailnum, wt = distance)
```

## 8. 그룹화의 고급 활용

### 점진적 요약

```r
daily <- group_by(flights, year, month, day)
(per_day <- summarize(daily, flights = n()))
(per_month <- summarize(per_day, flights = sum(flights)))
(per_year <- summarize(per_month, flights = sum(flights)))
```

#### ⚠️ 주의사항
점진적 요약에서 `sum()`과 `count()`는 문제없지만, 중앙값의 경우 그룹별 중앙값의 중앙값은 실제 전체 중앙값과 다릅니다.

### 그룹 해제

```r
daily %>%
  ungroup() %>%  # 그룹화 해제
  summarize(flights = n())  # 전체 항공편 수
```

## 9. mutate()와 filter()에서 그룹 활용

### 그룹별 필터링

```r
# 각 날짜별 지연시간 상위 10개
flights_sml %>%
  group_by(year, month, day) %>%
  filter(rank(desc(arr_delay)) < 10)

# 인기 목적지만 선택 (연간 365편 초과)
popular_dests <- flights %>%
  group_by(dest) %>%
  filter(n() > 365)
```

### 그룹별 비율 계산

```r
# 목적지별 지연시간 비율
popular_dests %>%
  filter(arr_delay > 0) %>%
  mutate(prop_delay = arr_delay / sum(arr_delay)) %>%
  select(year:day, dest, arr_delay, prop_delay)
```

## 💡 데이터 핸들링 실무 팁

### ✅ 효율적인 작업 흐름

1. **데이터 탐색**: `glimpse()`, `summary()`, `head()` 활용
2. **결측값 확인**: `is.na()`, `complete.cases()` 검토
3. **필터링**: 분석에 필요한 데이터만 선별
4. **변수 생성**: 분석 목적에 맞는 파생 변수 추가
5. **그룹화 요약**: 패턴과 인사이트 도출

### 🎯 코드 최적화 전략

```r
# 파이프 연산자로 연결된 효율적인 코드
result <- flights %>%
  filter(!is.na(dep_delay), !is.na(arr_delay)) %>%
  group_by(carrier) %>%
  summarize(
    avg_delay = mean(arr_delay),
    flights = n(),
    .groups = 'drop'
  ) %>%
  arrange(desc(avg_delay))
```

### 📊 성능 고려사항

- **큰 데이터**: `slice_sample()`로 샘플링 후 개발
- **메모리 효율**: 불필요한 열은 일찍 제거
- **속도 최적화**: 필터링을 먼저, 연산은 나중에

## 마무리

**tidyverse의 데이터 조작 함수들**을 마스터하면 복잡한 데이터 전처리도 직관적이고 효율적으로 처리할 수 있습니다. 이번 포스팅에서 다룬 핵심 내용들을 정리하면:

- **filter()**: 조건에 맞는 행 선택으로 데이터 범위 설정
- **arrange()**: 정렬을 통한 데이터 순서 조정
- **select()**: 필요한 변수만 선택하여 분석 초점 맞추기
- **mutate()**: 새로운 변수 생성으로 분석 확장
- **summarize() + group_by()**: 그룹별 요약으로 패턴 발견

이 기법들은 **데이터 분석의 기초**이자 **실무의 핵심**입니다. 반복 연습을 통해 자연스럽게 사용할 수 있도록 익혀보세요!