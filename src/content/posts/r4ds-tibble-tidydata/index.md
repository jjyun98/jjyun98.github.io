---
title: 'Tibble과 Tidy Data 정리'
published: 2022-08-19
draft: false
description: "R의 tibble과 데이터 parsing부터 tidy data 원칙, pivot/separate/unite 변환, 결측값 처리까지 데이터 정제의 모든 것을 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

>  참고 자료:
> [tibble 공식 문서](https://tibble.tidyverse.org/) | [tidyr 공식 문서](https://tidyr.tidyverse.org/) | [Tidy Data 논문](https://vita.had.co.nz/papers/tidy-data.pdf)

## 개요

**Tibble**은 tidyverse의 현대적 데이터 구조이고, **Tidy Data**는 분석하기 쉬운 형태로 데이터를 구조화하는 핵심 개념입니다. 이 포스팅에서는 tibble의 기초와 데이터 parsing부터 pivot, separate/unite, 결측값 처리까지 데이터 정제의 전 과정을 다룹니다.

```r title="환경 설정"
# 패키지 로드
library('tidyverse')  # tibble, readr, tidyr 포함

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 1. Tibble 기초

**기존 데이터프레임을 Tibble로 변환**

```r title="변환 예제"
as_tibble(iris) %>% head()
```

**새로운 Tibble 생성**

```r title="직접 생성"
tibble(
  x = 1:5,
  y = 1,
  z = x^2 + y
)
```

**tibble vs data.frame 비교**

| 특징 | data.frame | tibble |
|------|------------|---------|
| 타입 변환 | 자동 변환 (문자→factor) | 입력 타입 보존 |
| 변수명 | 자동 수정 | 원본 이름 유지 |
| 행 이름 | 자동 생성 | 생성하지 않음 |
| 특수 변수명 | 제한적 | 공백, 숫자 등 허용 |

**특수 변수명 사용**

```r title="특수 변수명"
tb <- tibble(
  `apple` = "근본",
  ` ` = "스페이스",
  `1000` = "숫자"
)
```

:::tip
특수 변수명은 역따옴표(`)로 감싸서 사용하지만, 표준 변수명을 사용하는 것이 좋습니다.
:::

## 2. Tribble과 서브셋팅

**행 단위로 데이터를 입력할 때는 tribble() 함수를 사용합니다.**

```r title="행 단위 입력"
tribble(
  ~x, ~y, ~z,           # 열 이름은 ~로 시작
  "c", 3, 4.0,          # 각 행은 쉼표로 구분
  "a", 2, 3.6,
  "b", 1, 8.5
)
```

**복합 데이터 타입**

```r title="다양한 타입"
tibble(
  a = lubridate::now() + runif(1e3) * 86400,
  b = lubridate::today() + runif(1e3) * 30,
  c = 1:1e3,
  d = runif(1e3),
  e = sample(letters, 1e3, replace = TRUE)
) %>% head()
```

**출력 옵션 조정**

```r title="출력 제어"
nycflights13::flights %>%
  print(n = 10, width = Inf)
```

**출력 옵션**

| 옵션 | 기능 |
|------|------|
| `n = 10` | 표시할 행 수 |
| `width = Inf` | 모든 열 표시 |
| `n = Inf` | 모든 행 표시 |

**Tibble 서브셋팅**

다양한 방법으로 tibble의 열과 행에 접근할 수 있습니다.

```r title="서브셋팅 방법"
df <- tibble(
  x = runif(5),
  y = rnorm(5)
)

# $ 연산자
df$x

# [[ ]] 연산자 (이름 또는 위치)
df[["x"]]
df[[1]]
```

**파이프에서의 서브셋팅**

```r title="파이프"
df %>% .$x
df %>% .[["x"]]
```

:::tip
오래된 함수와 호환성이 필요하면 `as.data.frame()` 변환을 사용합니다.
:::

## 3. 데이터 읽기

**read_csv 함수로 파일을 읽을 때 주요 옵션들을 활용할 수 있습니다.**

```r title="read_csv 옵션"
read_csv("data.csv",
  skip = 2,
  comment = "#",
  col_names = FALSE
)
```

**데이터 읽기 옵션**

| 옵션 | 설명 |
|------|------|
| `skip = n` | 처음 n줄 건너뛰기 |
| `comment = "#"` | 주석 줄 무시 |
| `col_names = FALSE` | 헤더 없음 |

Parsing은 문자형 벡터를 특수화된 데이터 타입으로 변환합니다.

**Parse 함수**

| 함수 | 반환 타입 |
|------|-----------|
| `parse_logical()` | 논리형 |
| `parse_integer()` | 정수형 |
| `parse_double()` | 실수형 |
| `parse_number()` | 실수형 |
| `parse_character()` | 문자형 |
| `parse_factor()` | 팩터형 |
| `parse_datetime()` | 날짜시간 |
| `parse_date()` | 날짜 |
| `parse_time()` | 시간 |

**오류 감지와 해결**

```r title="오류 처리"
x <- parse_integer(c("123", "345", "abc", "123.45"))
problems(x)
```

:::tip
parsing 실패 시 `NA`로 처리되며, `problems()` 함수로 오류 내용을 확인합니다.
:::

## 4. Parsing 함수

**소수점 구분기호 처리**

```r title="소수점 구분"
parse_double("1.23")
parse_double("1,23", locale = locale(decimal_mark = ","))
```

**유연한 숫자 파싱**

parse_number() 함수는 문자열에서 숫자만 추출하므로 통화 기호나 백분율 기호가 있어도 자동으로 제거됩니다.

```r title="숫자 추출"
parse_number("$100")
parse_number("20%")
parse_number("It cost $123.45")
parse_number("$123,456,789")
parse_number("123.456.789",
             locale = locale(grouping_mark = "."))
```

**레벨 지정**

팩터 parsing 시 가능한 값들을 미리 정의할 수 있습니다.

```r title="팩터 생성"
fruit <- c("apple", "banana")
parse_factor(c("apple", "banana", "bananana"), levels = fruit)
```

:::tip
factor는 범주형 데이터 분석에 유용합니다. 가능한 값들을 정의해두면 데이터 검증 효과를 얻습니다.
:::

**날짜와 시간 파싱**

기본 형식을 자동으로 인식하거나 사용자 정의 형식을 지정할 수 있습니다.

```r title="형식 인식"
parse_datetime("2010-10-01T2010")
parse_datetime("20101010")
parse_date("2010-10-01")
parse_time("20:10:01")
parse_time("01:10 am")
```

**형식 지정자**

| 지정자 | 설명 |
|--------|------|
| `%Y` | 4자리 연도 |
| `%y` | 2자리 연도 |
| `%m` | 숫자 월 (01-12) |
| `%b` | 축약 월명 |
| `%B` | 전체 월명 |
| `%d` | 날짜 (01-31) |
| `%e` | 공백 패딩 날짜 |
| `%H` | 24시간 형식 |
| `%I` | 12시간 형식 |
| `%p` | AM/PM |
| `%M` | 분 |
| `%S` | 초 |

**실전 예제**

```r title="날짜 파싱"
parse_date("01/02/15", "%m/%d/%y")
parse_date("01/02/15", "%d/%m/%y")
parse_date("01/02/15", "%y/%m/%d")
```

## 5. Tidy Data 원칙

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

## 6. Pivot 함수

데이터의 **형태를 변환**하여 분석 목적에 맞는 구조로 재배치하는 핵심 함수들입니다.

**pivot_longer - 넓은 데이터를 길게**

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

**pivot_wider - 긴 데이터를 넓게**

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
# 3 Brazil       1999  37737   172006362
# 4 Brazil       2000  80488   174504898
# 5 China        1999 212258 1272915272
# 6 China        2000 213766 1280428583
```

**pivot 함수 선택 가이드**

- **pivot_longer**: 여러 열이 실제로는 하나의 변수를 나타낼 때 (예: 연도별 열 → year 변수)
- **pivot_wider**: 하나의 열에 여러 변수의 값이 섞여 있을 때 (예: type 열에 cases/population 혼재)

## 7. Separate와 Unite

하나의 열을 **여러 변수로 분리**하거나, 여러 열을 **하나로 결합**하는 함수들입니다.

**separate - 열 분리**

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
# 3 Brazil       1999  37737   172006362
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

**unite - 열 결합**

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

## 8. 결측값 처리

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

## 9. WHO 결핵 데이터 정제

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
| 데이터프레임 변환 | `as_tibble()` | tibble로 변환 |
| 행 단위 데이터 생성 | `tribble()` | 테스트 데이터 생성 |
| 문자열 → 타입 변환 | `parse_*()` | 데이터 파싱 |
| 여러 열 → 행 | `pivot_longer()` | 정규화 |
| 행 → 여러 열 | `pivot_wider()` | 요약/시각화 |
| 하나 열 분리 | `separate()` | 변수 분해 |
| 여러 열 결합 | `unite()` | 변수 결합 |
| 결측값 채우기 | `fill()` | 데이터 보완 |
| 조합 완성 | `complete()` | 구조 완성 |
