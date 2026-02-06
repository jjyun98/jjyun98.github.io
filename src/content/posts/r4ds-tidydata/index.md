---
title: 'R Tidy Data 완전정복 - 데이터 정제와 재구조화 기법'
published: 2022-08-19
draft: false
description: "R의 tidyr을 활용한 데이터 정제와 재구조화. pivot_longer, pivot_wider, separate, unite, 결측값 처리까지 실습 예제와 함께 체계적으로 학습합니다."
series: 'R for Data Science'
tags: ['R', 'Data Analysis', 'Tidy Data', 'Data Restructuring', 'pivot', 'tidyr', 'Data Cleaning']
---

> 참고 자료:
> [tidyr 공식 문서](https://tidyr.tidyverse.org/) | [Tidy Data 논문](https://vita.had.co.nz/papers/tidy-data.pdf)

## 개요

**Tidy Data**는 분석하기 쉬운 형태로 데이터를 구조화하는 핵심 개념입니다. Hadley Wickham이 제시한 이 원칙은 현대 데이터 분석의 기초가 되었습니다.

이번 포스팅에서는 **pivot_longer/wider를 활용한 데이터 재구조화**, **separate/unite를 통한 변수 분리와 결합**, **결측값 처리 전략**을 실습 예제와 함께 체계적으로 알아보겠습니다!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
# 패키지 로드
library('tidyverse')  # tidyr 포함

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 2. Tidy Data 원칙

### Tidy Data의 3가지 규칙

1. **각 변수는 고유한 열을 가져야 함**
2. **각 관측값은 고유한 행을 가져야 함**
3. **각 값은 고유한 셀을 가져야 함**

### Tidy vs Messy Data 비교

| 특징 | Tidy Data | Messy Data |
|------|-----------|------------|
| **구조** | 일관된 형태 | 불규칙한 형태 |
| **분석 용이성** | 쉬움 | 어려움 |
| **도구 호환성** | 높음 | 낮음 |
| **유지보수** | 간단 | 복잡 |

## 3. pivot_longer - 넓은 데이터를 길게

### 기본 개념

**pivot_longer**는 여러 열에 분산된 값들을 행으로 변환하여 데이터를 길고 좁게 만듭니다.

### table4a 예제

```r
# 넓은 형태의 데이터
table4a
#   country     `1999` `2000`
# 1 Afghanistan    745   2666
# 2 Brazil       37737  80488
# 3 China       212258 213766

# 긴 형태로 변환
table4a %>%
  pivot_longer(c('1999', '2000'),
               names_to = "year",
               values_to = "cases")
#   country      year  cases
# 1 Afghanistan  1999    745
# 2 Afghanistan  2000   2666
# 3 Brazil       1999  37737
# 4 Brazil       2000  80488
# 5 China        1999 212258
# 6 China        2000 213766
```

### 데이터 결합 예제

```r
# 두 테이블을 각각 변환 후 결합
tidy4a <- table4a %>%
  pivot_longer(c('1999', '2000'), names_to = 'year', values_to = 'cases')

tidy4b <- table4b %>%
  pivot_longer(c('1999', '2000'), names_to = 'year', values_to = 'population')

# left_join으로 결합
left_join(tidy4a, tidy4b)
#   country      year  cases population
# 1 Afghanistan  1999    745   19987071
# 2 Afghanistan  2000   2666   20595360
# 3 Brazil       1999  37737  172006362
# 4 Brazil       2000  80488  174504898
# 5 China        1999 212258 1272915272
# 6 China        2000 213766 1280428583
```

## 4. pivot_wider - 긴 데이터를 넓게

### 기본 개념

**pivot_wider**는 `pivot_longer`의 반대로, 행에 분산된 값들을 열로 변환하여 데이터를 짧고 넓게 만듭니다.

### table2 예제

```r
# 긴 형태의 데이터
table2
#   country      year type       count
# 1 Afghanistan  1999 cases        745
# 2 Afghanistan  1999 population 19987071
# 3 Afghanistan  2000 cases       2666
# 4 Afghanistan  2000 population 20595360
# 5 Brazil       1999 cases      37737
# 6 Brazil       1999 population 172006362

# 넓은 형태로 변환
table2 %>%
  pivot_wider(names_from = type, values_from = count)
#   country      year  cases population
# 1 Afghanistan  1999    745   19987071
# 2 Afghanistan  2000   2666   20595360
# 3 Brazil       1999  37737  172006362
# 4 Brazil       2000  80488  174504898
# 5 China        1999 212258 1272915272
# 6 China        2000 213766 1280428583
```

### pivot 함수 선택 가이드

- **pivot_longer**: 여러 열이 실제로는 하나의 변수를 나타낼 때
- **pivot_wider**: 하나의 열에 여러 변수의 값이 섞여 있을 때

## 5. separate - 하나의 열을 여러 열로 분리

### 기본 사용법

```r
# table3 예제
table3
#   country      year rate
# 1 Afghanistan  1999 745/19987071
# 2 Afghanistan  2000 2666/20595360
# 3 Brazil       1999 37737/172006362
# 4 Brazil       2000 80488/174504898
# 5 China        1999 212258/1272915272
# 6 China        2000 213766/1280428583

# 기본 분리 (알파벳이나 숫자가 아닌 문자로 자동 분리)
table3 %>%
  separate(rate, into = c("cases", "population"))
```

### 구분자 명시적 지정

```r
# 특정 구분자로 분리
table3 %>%
  separate(rate, into = c("cases", "population"), sep = "/")
```

### 데이터 타입 자동 변환

```r
# convert = TRUE로 적절한 타입으로 자동 변환
table3 %>%
  separate(rate,
           into = c("cases", "population"),
           convert = TRUE)
#   country      year  cases population
# 1 Afghanistan  1999    745   19987071  # <int> <int>
# 2 Afghanistan  2000   2666   20595360
# 3 Brazil       1999  37737  172006362
# 4 Brazil       2000  80488  174504898
# 5 China        1999 212258 1272915272
# 6 China        2000 213766 1280428583
```

### 위치로 분리

```r
# 숫자로 위치 지정 (앞에서부터 n자리)
table3 %>%
  separate(year, into = c("century", "year"), sep = 2)
#   country     century year rate
# 1 Afghanistan 19      99   745/19987071
# 2 Afghanistan 20      00   2666/20595360
# 3 Brazil      19      99   37737/172006362
# 4 Brazil      20      00   80488/174504898
# 5 China       19      99   212258/1272915272
# 6 China       20      00   213766/1280428583
```

#### separate 주요 옵션

| 옵션 | 설명 | 예제 |
|------|------|------|
| `sep = "/"` | 문자로 분리 | `sep = "/"` |
| `sep = 2` | 위치로 분리 | `sep = 2` (앞에서 2자리) |
| `sep = -2` | 뒤에서부터 분리 | `sep = -2` (뒤에서 2자리) |
| `convert = TRUE` | 타입 자동 변환 | 문자→숫자 등 |

## 6. unite - 여러 열을 하나의 열로 결합

### 기본 사용법

```r
# table5 예제
table5
#   country     century year rate
# 1 Afghanistan 19      99   745/19987071
# 2 Afghanistan 20      00   2666/20595360
# 3 Brazil      19      99   37737/172006362
# 4 Brazil      20      00   80488/174504898
# 5 China       19      99   212258/1272915272
# 6 China       20      00   213766/1280428583

# 기본 결합 (기본 구분자는 _)
table5 %>%
  unite(new, century, year)
#   country     new   rate
# 1 Afghanistan 19_99 745/19987071
# 2 Afghanistan 20_00 2666/20595360
# 3 Brazil      19_99 37737/172006362
# 4 Brazil      20_00 80488/174504898
# 5 China       19_99 212258/1272915272
# 6 China       20_00 213766/1280428583
```

### 구분자 변경

```r
# 구분자 없이 결합
table5 %>%
  unite(new, century, year, sep = "")
#   country     new  rate
# 1 Afghanistan 1999 745/19987071
# 2 Afghanistan 2000 2666/20595360
# 3 Brazil      1999 37737/172006362
# 4 Brazil      2000 80488/174504898
# 5 China       1999 212258/1272915272
# 6 China       2000 213766/1280428583
```

## 7. 결측값 처리

### 결측값의 두 가지 형태

1. **명시적 결측값**: `NA`로 표시
2. **암묵적 결측값**: 데이터에 존재하지 않음

### 예제 데이터 생성

```r
stocks <- tibble(
  year = c(2015, 2015, 2015, 2015, 2016, 2016, 2016),
  qtr = c(1, 2, 3, 4, 2, 3, 4),
  return = c(1.88, 0.59, 0.35, NA, 0.92, 0.17, 2.66)
)

stocks
#    year   qtr return
# 1  2015     1   1.88
# 2  2015     2   0.59
# 3  2015     3   0.35
# 4  2015     4   NA     # 명시적 결측값
# 5  2016     2   0.92   # 2016년 1분기 없음 (암묵적 결측값)
# 6  2016     3   0.17
# 7  2016     4   2.66
```

### 암묵적 결측값을 명시적으로 변환

```r
# pivot_wider로 암묵적 결측값을 NA로 표시
stocks %>%
  pivot_wider(names_from = year, values_from = return)
#     qtr `2015` `2016`
# 1     1   1.88     NA  # 2016년 1분기 누락이 명시적으로 표시됨
# 2     2   0.59   0.92
# 3     3   0.35   0.17
# 4     4     NA   2.66
```

### 명시적 결측값을 암묵적으로 변환

```r
# values_drop_na = TRUE로 NA 행 제거
stocks %>%
  pivot_wider(names_from = year, values_from = return) %>%
  pivot_longer(
    cols = c('2015', '2016'),
    names_to = "year",
    values_to = "return",
    values_drop_na = TRUE
  )
#     qtr year  return
# 1     1 2015   1.88
# 2     2 2015   0.59
# 3     2 2016   0.92
# 4     3 2015   0.35
# 5     3 2016   0.17
# 6     4 2016   2.66  # NA가 있던 행들이 제거됨
```

### complete() - 모든 조합 완성

```r
# 가능한 모든 조합을 생성하고 결측값을 NA로 채움
stocks %>%
  complete(year, qtr)
#    year   qtr return
# 1  2015     1   1.88
# 2  2015     2   0.59
# 3  2015     3   0.35
# 4  2015     4     NA
# 5  2016     1     NA  # 누락된 조합이 추가됨
# 6  2016     2   0.92
# 7  2016     3   0.17
# 8  2016     4   2.66
```

### fill() - 결측값 채우기

```r
# 예제 데이터
treatment <- tribble(
  ~person,           ~treatment, ~response,
  "Derrick Whitmore", 1,         7,
  NA,                 2,        10,
  NA,                 3,         9,
  "Katherine Burke",  1,         4
)

# 가장 최근의 비결측값으로 채우기
treatment %>%
  fill(person)
#   person           treatment response
# 1 Derrick Whitmore         1        7
# 2 Derrick Whitmore         2       10  # 위의 값으로 채워짐
# 3 Derrick Whitmore         3        9  # 위의 값으로 채워짐
# 4 Katherine Burke          1        4
```

## 8. 실전 사례: WHO 결핵 데이터 정제

### 원본 데이터 탐색

```r
# WHO 결핵 데이터
who %>% head()
#   country iso2 iso3  year new_sp_m014 new_sp_m1524 ...
# 1 Afghanistan AF AFG 1980        NA         NA
# 2 Afghanistan AF AFG 1981        NA         NA
# 3 Afghanistan AF AFG 1982        NA         NA
# 4 Afghanistan AF AFG 1983        NA         NA
# 5 Afghanistan AF AFG 1984        NA         NA
# 6 Afghanistan AF AFG 1985        NA         NA
```

### 단계별 데이터 정제

#### 1단계: 변수 식별과 pivot_longer

```r
who1 <- who %>%
  pivot_longer(
    cols = new_sp_m014:newrel_f65,
    names_to = "key",
    values_to = "cases",
    values_drop_na = TRUE
  )

who1 %>% head()
#   country iso2 iso3  year key          cases
# 1 Afghanistan AF AFG 1997 new_sp_m014     0
# 2 Afghanistan AF AFG 1997 new_sp_m1524   10
# 3 Afghanistan AF AFG 1997 new_sp_m2534    6
# 4 Afghanistan AF AFG 1997 new_sp_m3544    3
# 5 Afghanistan AF AFG 1997 new_sp_m4554    5
# 6 Afghanistan AF AFG 1997 new_sp_m5564    2
```

#### 2단계: 변수명 표준화

```r
# newrel을 new_rel로 통일
who2 <- who1 %>%
  mutate(key = stringr::str_replace(key, "newrel", "new_rel"))
```

#### 3단계: 변수 분리

```r
# 언더스코어로 분리
who3 <- who2 %>%
  separate(key, c("new", "type", "sexage"), sep = "_")

who3 %>% head()
#   country iso2 iso3  year new type sexage cases
# 1 Afghanistan AF AFG 1997 new   sp  m014     0
# 2 Afghanistan AF AFG 1997 new   sp m1524    10
# 3 Afghanistan AF AFG 1997 new   sp m2534     6
```

#### 4단계: 불필요한 변수 제거

```r
# 상수 및 중복 변수 제거
who4 <- who3 %>%
  select(-new, -iso2, -iso3)
```

#### 5단계: 성별과 연령 분리

```r
# 성별과 연령대 분리
who5 <- who4 %>%
  separate(sexage, c("sex", "age"), sep = 1)

who5 %>% head()
#   country      year type sex   age cases
# 1 Afghanistan  1997   sp   m   014     0
# 2 Afghanistan  1997   sp   m  1524    10
# 3 Afghanistan  1997   sp   m  2534     6
# 4 Afghanistan  1997   sp   m  3544     3
# 5 Afghanistan  1997   sp   m  4554     5
# 6 Afghanistan  1997   sp   m  5564     2
```

### 변수 의미 해석

| 코드 | 의미 |
|------|------|
| **rel** | 재발 사례 |
| **ep** | 폐외 결핵 사례 |
| **sn** | 도말음성 폐결핵 |
| **sp** | 도말양성 폐결핵 |
| **m/f** | 성별 (남성/여성) |
| **014** | 0-14세 |
| **1524** | 15-24세 |
| **65** | 65세 이상 |

### 전체 과정 파이프라인

```r
# 모든 단계를 하나의 파이프라인으로
who_tidy <- who %>%
  pivot_longer(
    cols = new_sp_m014:newrel_f65,
    names_to = "key",
    values_to = "cases",
    values_drop_na = TRUE
  ) %>%
  mutate(
    key = stringr::str_replace(key, "newrel", "new_rel")
  ) %>%
  separate(key, c("new", "var", "sexage")) %>%
  select(-new, -iso2, -iso3) %>%
  separate(sexage, c("sex", "age"), sep = 1)
```

## 실무 활용 팁

### 데이터 정제 전략
1. **탐색적 분석**: `glimpse()`, `summary()`, `str()` 활용
2. **단계적 접근**: 한 번에 하나씩 변환하며 결과 확인
3. **백업**: 원본 데이터 보존하며 단계별 저장
4. **문서화**: 각 변환 단계의 이유와 목적 기록

### 함수 선택 가이드

| 상황 | 사용 함수 | 목적 |
|------|-----------|------|
| 여러 열 → 행 | `pivot_longer()` | 정규화 |
| 행 → 여러 열 | `pivot_wider()` | 요약/시각화 |
| 하나 열 분리 | `separate()` | 변수 분해 |
| 여러 열 결합 | `unite()` | 변수 결합 |
| 결측값 채우기 | `fill()` | 데이터 보완 |
| 조합 완성 | `complete()` | 구조 완성 |

### 성능 최적화
- **큰 데이터**: `values_drop_na = TRUE`로 불필요한 NA 제거
- **메모리 절약**: 단계적 변환보다 파이프라인 사용
- **재사용성**: 함수로 만들어 반복 작업 자동화

## 마무리

**Tidy Data**는 단순한 형태 변환이 아닌, 분석 가능한 구조로 데이터를 재구성하는 핵심 기술입니다. 이번 포스팅에서 다룬 주요 내용을 정리하면:

- **Pivot 함수**: 데이터의 형태를 자유자재로 변환
- **Separate/Unite**: 변수의 분리와 결합으로 적절한 단위 구성
- **결측값 처리**: 명시적/암묵적 결측값의 적절한 관리
- **실전 적용**: 복잡한 실제 데이터의 체계적 정제 과정

**실무에서는 raw 데이터가 이미 tidy한 형태인 경우는 거의 없습니다.** 따라서 이러한 데이터 정제 기술을 익혀두면 분석 시간을 크게 단축할 수 있습니다.

특히 **WHO 결핵 데이터 사례**처럼 복잡한 변수명과 구조를 가진 데이터를 다룰 때, 체계적인 접근법을 통해 단계적으로 정제하는 것이 중요합니다!

다음 포스팅에서는 **관계형 데이터와 조인(Join) 기법**에 대해 다뤄보겠습니다.