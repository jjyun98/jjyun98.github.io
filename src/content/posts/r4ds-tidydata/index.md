---
title: 'Tidy Data 정리'
published: 2022-08-19
draft: false
description: "tidyr을 활용한 데이터 정제. pivot_longer/wider, separate/unite, 결측값 처리 방법을 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

> 참고 자료:
> [tidyr 공식 문서](https://tidyr.tidyverse.org/) | [Tidy Data 논문](https://vita.had.co.nz/papers/tidy-data.pdf)

## 개요

**Tidy Data**는 분석하기 쉬운 형태로 데이터를 구조화하는 핵심 개념입니다. Hadley Wickham이 제시한 이 원칙은 현대 데이터 분석의 기초가 되었습니다.
```r title="환경 설정"
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

## 1. Tidy Data 원칙

**Tidy Data의 3가지 규칙**

1. **각 변수는 고유한 열을 가져야 함**
2. **각 관측값은 고유한 행을 가져야 함**
3. **각 값은 고유한 셀을 가져야 함**

이 규칙을 따르면 데이터 분석 도구들이 일관되게 작동하고, 변환 작업이 단순해집니다. Tidy 형태는 **각 열이 하나의 의미만** 가지므로 dplyr, ggplot2 등과 자연스럽게 연결됩니다.

**Tidy vs Messy Data 비교**

| 특징 | Tidy Data | Messy Data |
|------|-----------|------------|
| **구조** | 일관된 형태 | 불규칙한 형태 |
| **분석 용이성** | 쉬움 | 어려움 |
| **도구 호환성** | 높음 | 낮음 |
| **유지보수** | 간단 | 복잡 |

## 2. Pivot 함수

데이터의 **형태를 변환**하여 분석 목적에 맞는 구조로 재배치하는 핵심 함수들입니다.

### 2.1 pivot_longer - 넓은 데이터를 길게

여러 열에 분산된 값들을 **행으로 변환**합니다. 주로 연도별, 월별 등 시간 데이터가 열로 펼쳐져 있을 때 사용합니다.
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

**데이터 결합 예제**
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

### 2.2 pivot_wider - 긴 데이터를 넓게

행에 분산된 값들을 **열로 변환**합니다. 하나의 열에 여러 변수가 섞여 있을 때 각 변수를 독립된 열로 분리하는 데 사용합니다.
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

**pivot 함수 선택 가이드**

- **pivot_longer**: 여러 열이 실제로는 하나의 변수를 나타낼 때 (예: 연도별 열 → year 변수)
- **pivot_wider**: 하나의 열에 여러 변수의 값이 섞여 있을 때 (예: type 열에 cases/population 혼재)

## 3. Separate/Unite

하나의 열을 **여러 변수로 분리**하거나, 여러 열을 **하나로 결합**하는 함수들입니다.

### 3.1 separate - 열 분리

하나의 열에 여러 정보가 들어있을 때 **구분자나 위치**를 기준으로 분리합니다.

**기본 사용법**
```r
# table3 예제
table3
#   country      year rate
# 1 Afghanistan  1999 745/19987071
# 2 Afghanistan  2000 2666/20595360
# 3 Brazil       1999 37737/172006362

# 기본 분리 (알파벳이나 숫자가 아닌 문자로 자동 분리)
table3 %>%
  separate(rate, into = c("cases", "population"))
```

**구분자 명시적 지정**
```r
# 특정 구분자로 분리
table3 %>%
  separate(rate, into = c("cases", "population"), sep = "/")
```

**데이터 타입 자동 변환**

`convert = TRUE` 옵션을 사용하면 문자열이 숫자로 자동 변환되어 계산이 가능해집니다.
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
```

**위치로 분리**

구분자가 없을 때는 **문자 위치**를 숫자로 지정할 수 있습니다.
```r
# 숫자로 위치 지정 (앞에서부터 n자리)
table3 %>%
  separate(year, into = c("century", "year"), sep = 2)
#   country     century year rate
# 1 Afghanistan 19      99   745/19987071
# 2 Afghanistan 20      00   2666/20595360
```

**separate 주요 옵션**

| 옵션 | 설명 | 예제 |
|------|------|------|
| `sep = "/"` | 문자로 분리 | 슬래시 기준 분리 |
| `sep = 2` | 위치로 분리 | 앞에서 2자리 후 분리 |
| `sep = -2` | 뒤에서부터 분리 | 뒤에서 2자리 전에 분리 |
| `convert = TRUE` | 타입 자동 변환 | 문자 → 숫자 등 |

### 3.2 unite - 열 결합

여러 열의 값을 **하나로 합쳐** 새로운 변수를 만듭니다. 주로 분리된 날짜 정보(년, 월, 일)를 합치거나 ID를 생성할 때 사용합니다.

**기본 사용법**
```r
# table5 예제
table5
#   country     century year rate
# 1 Afghanistan 19      99   745/19987071
# 2 Afghanistan 20      00   2666/20595360

# 기본 결합 (기본 구분자는 _)
table5 %>%
  unite(new, century, year)
#   country     new   rate
# 1 Afghanistan 19_99 745/19987071
# 2 Afghanistan 20_00 2666/20595360
```

**구분자 변경**
```r
# 구분자 없이 결합
table5 %>%
  unite(new, century, year, sep = "")
#   country     new  rate
# 1 Afghanistan 1999 745/19987071
# 2 Afghanistan 2000 2666/20595360
```

## 4. 결측값 처리

결측값은 **명시적(NA로 표시)**이거나 **암묵적(데이터에 존재하지 않음)** 두 가지 형태로 나타납니다.

**결측값 예제 데이터**
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

**암묵적 결측값을 명시적으로 변환**

`pivot_wider`를 사용하면 존재하지 않는 조합이 NA로 표시됩니다.
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

**명시적 결측값을 암묵적으로 변환**

`values_drop_na = TRUE` 옵션으로 NA가 있는 행을 제거할 수 있습니다.
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

**complete() - 모든 조합 완성**

가능한 **모든 조합**을 생성하고 누락된 부분을 NA로 채웁니다.
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

**fill() - 결측값 채우기**

가장 최근의 **비결측값으로 앞의 NA를 채웁니다**. 설문 데이터에서 반복 입력을 피하기 위해 비워둔 셀을 채울 때 유용합니다.
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

## 5. 실전: WHO 결핵 데이터 정제

실제 복잡한 데이터를 **단계적으로 정제**하는 과정입니다.

**원본 데이터 구조**
```r
# WHO 결핵 데이터
who %>% head()
#   country iso2 iso3  year new_sp_m014 new_sp_m1524 ...
# 1 Afghanistan AF AFG 1980        NA         NA
# 2 Afghanistan AF AFG 1981        NA         NA
# 3 Afghanistan AF AFG 1982        NA         NA
```

**1단계: pivot_longer로 변수 재구조화**

60개 이상의 열을 하나의 key-value 형태로 변환합니다.
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
```

**2단계: 변수명 표준화**

일관성 없는 명명을 통일합니다. `newrel`을 `new_rel`로 변경하여 나중에 언더스코어로 분리할 수 있게 합니다.
```r
# newrel을 new_rel로 통일
who2 <- who1 %>%
  mutate(key = stringr::str_replace(key, "newrel", "new_rel"))
```

**3단계: 언더스코어 기준으로 분리**

하나의 key 변수를 의미 단위로 분리합니다.
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

**4단계: 불필요한 변수 제거**

상수이거나 중복되는 변수들을 제거합니다.
```r
# 상수 및 중복 변수 제거
who4 <- who3 %>%
  select(-new, -iso2, -iso3)
```

**5단계: 성별과 연령 분리**

`sexage` 열의 첫 글자가 성별(m/f)이므로 위치 기준으로 분리합니다.
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

**변수 의미**

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

**전체 파이프라인**

모든 단계를 하나로 연결하면 다음과 같습니다.
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

## 함수 선택 가이드

| 상황 | 사용 함수 | 목적 |
|------|-----------|------|
| 여러 열 → 행 | `pivot_longer()` | 정규화 |
| 행 → 여러 열 | `pivot_wider()` | 요약/시각화 |
| 하나 열 분리 | `separate()` | 변수 분해 |
| 여러 열 결합 | `unite()` | 변수 결합 |
| 결측값 채우기 | `fill()` | 데이터 보완 |
| 조합 완성 | `complete()` | 구조 완성 |