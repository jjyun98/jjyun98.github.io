---
title: "Tibble 정리"
published: 2022-08-18
draft: false
description: "R의 tibble과 parsing을 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

Tibble은 tidyverse의 현대적 데이터 구조입니다. 안전하고 직관적인 동작을 제공하며, parsing은 외부 데이터를 R에서 사용 가능한 형태로 변환합니다.

## 환경 설정

```r title="패키지 로드"
library('tidyverse')  # tibble, readr 포함
```

## Tibble 기초

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

## Tibble vs Data.frame

**주요 차이점**

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

## Tribble

**기본 문법**

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

## Tibble 출력

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

## Tibble 서브셋팅

**다양한 서브셋팅 방법**

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

## 데이터 읽기

**read_csv 주요 옵션**

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

## Parsing

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

## Parsing 오류

**오류 감지와 해결**

```r title="오류 처리"
x <- parse_integer(c("123", "345", "abc", "123.45"))
problems(x)
```

:::tip
parsing 실패 시 `NA`로 처리되며, `problems()` 함수로 오류 내용을 확인합니다.
:::

## 숫자 Parsing

**소수점 구분기호 처리**

```r title="소수점 구분"
parse_double("1.23")
parse_double("1,23", locale = locale(decimal_mark = ","))
```

**유연한 숫자 파싱**

```r title="숫자 추출"
parse_number("$100")
parse_number("20%")
parse_number("It cost $123.45")
parse_number("$123,456,789")
parse_number("123.456.789",
             locale = locale(grouping_mark = "."))
```

## Factor Parsing

**레벨 지정**

```r title="팩터 생성"
fruit <- c("apple", "banana")
parse_factor(c("apple", "banana", "bananana"), levels = fruit)
```

:::tip
factor는 범주형 데이터 분석에 유용합니다. 가능한 값들을 정의해두면 데이터 검증 효과를 얻습니다.
:::

## 날짜/시간 Parsing

**기본 형식**

```r title="형식 인식"
parse_datetime("2010-10-01T2010")
parse_datetime("20101010")
parse_date("2010-10-01")
parse_time("20:10:01")
parse_time("01:10 am")
```

**사용자 정의 형식**

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

## 핵심 요점

Tibble과 parsing은 현대적인 R 데이터 분석의 출발점입니다.

- **Tibble**: 안전하고 직관적인 데이터 구조
- **Tribble**: 빠른 테스트 데이터 생성
- **Parsing**: 외부 데이터를 R로 안전하게 가져오기
- **오류 처리**: `problems()` 함수로 문제 파악

데이터 품질이 분석 결과를 좌우하므로, 초기 데이터 로드와 파싱 단계를 충분히 검토하는 것이 중요합니다.