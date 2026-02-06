---
title: 'R Tibble & Parsing 완전정복 - 현대적 데이터 구조와 파싱 기법'
published: 2022-08-18
draft: false
description: "R의 tibble과 parsing을 활용한 현대적 데이터 처리법. tibble 생성부터 다양한 데이터 타입 파싱까지 실습 예제와 함께 체계적으로 학습합니다."
series: 'R for Data Science'
tags: ['R', 'Data Analysis', 'Tibble', 'Parsing', 'tidyverse', 'Data Import', 'Data Structure']
---

> 참고 자료:
> [tibble 공식 문서](https://tibble.tidyverse.org/) | [readr 공식 문서](https://readr.tidyverse.org/)

## 개요

**Tibble**은 전통적인 data.frame을 현대적으로 개선한 tidyverse의 핵심 데이터 구조입니다. 더 안전하고 직관적인 동작을 제공하며, **Parsing**은 외부 데이터를 R에서 사용할 수 있는 형태로 변환하는 핵심 기술입니다.

이번 포스팅에서는 **tibble 생성과 조작**, **tribble을 활용한 빠른 데이터 생성**, **다양한 데이터 타입 파싱 기법**을 실습 예제와 함께 체계적으로 알아보겠습니다!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
# 패키지 로드
library('tidyverse')  # tibble, readr 포함

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 2. Tibble 기초

### 기존 데이터프레임을 Tibble로 변환

```r
# iris 데이터를 tibble로 변환
as_tibble(iris) %>% head()
#   Sepal.Length Sepal.Width Petal.Length Petal.Width Species
# 1          5.1         3.5          1.4         0.2  setosa
# 2          4.9         3.0          1.4         0.2  setosa
# 3          4.7         3.2          1.3         0.2  setosa
# 4          4.6         3.1          1.5         0.2  setosa
# 5          5.0         3.6          1.4         0.2  setosa
# 6          5.4         3.9          1.7         0.4  setosa
```

### 새로운 Tibble 생성

```r
# 직접 tibble 생성
tibble(
  x = 1:5,
  y = 1,
  z = x^2 + y
)
#   x     y     z
# 1 1     1     2
# 2 2     1     5
# 3 3     1    10
# 4 4     1    17
# 5 5     1    26
```

## 3. Tibble vs Data.frame 차이점

### 주요 차이점 정리

| 특징 | data.frame | tibble |
|------|------------|---------|
| **타입 변환** | 자동 변환 (문자→factor) | 입력 타입 보존 |
| **변수명** | 자동 수정 | 원본 이름 유지 |
| **행 이름** | 자동 생성 | 생성하지 않음 |
| **특수 변수명** | 제한적 | 공백, 숫자 등 허용 |

### 특수 변수명 사용 예제

```r
# 특수 문자를 포함한 변수명
tb <- tibble(
  `apple` = "근본",
  ` ` = "스페이스",
  `1000` = "숫자"
)

tb
#   apple ` `     `1000`
# 1 근본  스페이스  숫자
```

#### 중요 팁
특수 변수명은 역따옴표(`)로 감싸서 사용하지만, 가능하면 표준 변수명을 사용하는 것이 좋습니다.

## 4. Tribble - 빠른 데이터 생성

### Tribble 기본 문법

```r
# tribble: 행 단위로 데이터 입력
tribble(
  ~x, ~y, ~z,           # 열 이름은 ~로 시작
  "c", 3, 4.0,          # 각 행은 쉼표로 구분
  "a", 2, 3.6,
  "b", 1, 8.5
)
#   x     y     z
# 1 c     3   4.0
# 2 a     2   3.6
# 3 b     1   8.5
```

### 복합 데이터 타입 예제

```r
# 다양한 데이터 타입을 포함한 tibble
tibble(
  a = lubridate::now() + runif(1e3) * 86400,  # 날짜시간
  b = lubridate::today() + runif(1e3) * 30,   # 날짜
  c = 1:1e3,                                  # 정수
  d = runif(1e3),                            # 실수
  e = sample(letters, 1e3, replace = TRUE)    # 문자
) %>% head()
```

#### 유용한 함수들
- **1e3**: 1000을 의미 (과학적 표기법)
- **runif()**: 균등분포 난수 생성
- **sample()**: 무작위 샘플링

## 5. Tibble 출력 제어

### 출력 옵션 조정

```r
# 출력 행수와 열 너비 제어
nycflights13::flights %>%
  print(n = 10, width = Inf)  # 10행, 모든 열 표시
```

### 유용한 출력 옵션

| 옵션 | 기능 | 예제 |
|------|------|------|
| `n = 10` | 표시할 행 수 | `print(n = 10)` |
| `width = Inf` | 모든 열 표시 | `print(width = Inf)` |
| `n = Inf` | 모든 행 표시 | `print(n = Inf)` |

## 6. Tibble 서브셋팅

### 다양한 서브셋팅 방법

```r
# 예제 tibble 생성
df <- tibble(
  x = runif(5),
  y = rnorm(5)
)

# 1. $ 연산자
df$x

# 2. [[ ]] 연산자 (이름으로)
df[["x"]]

# 3. [[ ]] 연산자 (위치로)
df[[1]]
```

### 파이프에서의 서브셋팅

```r
# 파이프에서는 . 사용
df %>% .$x
df %>% .[["x"]]
```

### 호환성 문제 해결

```r
# 일부 오래된 함수에서는 data.frame으로 변환 필요
class(as.data.frame(tb))
# [1] "data.frame"
```

## 7. 데이터 읽기 옵션

### read_csv 주요 옵션

```r
# read_csv 옵션 예제
read_csv("data.csv",
  skip = 2,              # 처음 2줄 건너뛰기
  comment = "#",         # #로 시작하는 줄 무시
  col_names = FALSE      # 첫 행을 헤더로 취급하지 않음
)
```

#### 데이터 읽기 팁

| 옵션 | 설명 | 사용 상황 |
|------|------|-----------|
| `skip = n` | 처음 n줄 건너뛰기 | 메타데이터가 있을 때 |
| `comment = "#"` | 주석 줄 무시 | 주석이 포함된 파일 |
| `col_names = FALSE` | 헤더 없음 | 변수명이 없는 데이터 |

## 8. Parsing 기초

### Parse 함수 개요

**Parsing**은 문자형 벡터를 특수화된 데이터 타입으로 변환하는 과정입니다.

### Parse 함수 종류

| 함수 | 반환 타입 | 복잡도 | 주요 용도 |
|------|-----------|--------|-----------|
| `parse_logical()` | 논리형 | ⭐ | TRUE/FALSE 데이터 |
| `parse_integer()` | 정수형 | ⭐ | 정수 데이터 |
| `parse_double()` | 실수형 | ⭐⭐⭐ | 정확한 수치 |
| `parse_number()` | 실수형 | ⭐⭐ | 유연한 수치 |
| `parse_character()` | 문자형 | ⭐⭐ | 인코딩 처리 |
| `parse_factor()` | 팩터형 | ⭐⭐ | 범주형 데이터 |
| `parse_datetime()` | 날짜시간 | ⭐⭐⭐⭐ | 복합 시간 데이터 |
| `parse_date()` | 날짜 | ⭐⭐⭐⭐ | 날짜 데이터 |
| `parse_time()` | 시간 | ⭐⭐⭐⭐ | 시간 데이터 |

## 9. Parsing 오류 처리

### 오류 감지와 해결

```r
# parsing 실패 예제
x <- parse_integer(c("123", "345", "abc", "123.45"))
# Warning: 2 parsing failures.

# 문제점 확인
problems(x)
#   row col               expected actual
# 1   3  NA no trailing characters abc
# 2   4  NA no trailing characters 123.45
```

#### 주의사항
parsing 실패 시 해당 값은 `NA`로 처리되며, `problems()` 함수로 구체적인 오류 내용을 확인할 수 있습니다.

## 10. 숫자 Parsing

### 숫자 Parsing의 3가지 주요 문제

1. **소수점 구분기호** (`.` vs `,`)
2. **단위 표시** (`$`, `%` 등)
3. **천 단위 구분** (`,`, `.`, ` ` 등)

### 소수점 구분기호 처리

```r
# 기본 (점 사용)
parse_double("1.23")
# [1] 1.23

# 쉼표를 소수점으로 사용하는 지역
parse_double("1,23", locale = locale(decimal_mark = ","))
# [1] 1.23
```

### 유연한 숫자 파싱

```r
# parse_number: 숫자가 아닌 문자 자동 제거
parse_number("$100")        # 100
parse_number("20%")         # 20
parse_number("It cost $123.45")  # 123.45

# 미국식 (쉼표로 천 단위 구분)
parse_number("$123,456,789")  # 123456789

# 유럽식 (점으로 천 단위 구분)
parse_number("123.456.789",
             locale = locale(grouping_mark = "."))  # 123456789
```

## 11. Factor Parsing

### Factor 레벨 지정

```r
# 미리 정의된 레벨로 factor 생성
fruit <- c("apple", "banana")
parse_factor(c("apple", "banana", "bananana"), levels = fruit)
# [1] apple  banana <NA>
# Levels: apple banana

# Warning: 1 parsing failure.
# 정의되지 않은 값은 NA로 처리
```

#### Factor 활용 팁
Factor는 설문 조사나 범주형 데이터 분석에서 매우 유용합니다. 미리 가능한 값들을 정의해두면 데이터 검증 효과도 얻을 수 있습니다.

## 12. 날짜/시간 Parsing

### 기본 날짜/시간 형식

```r
# 다양한 날짜시간 형식 자동 인식
parse_datetime("2010-10-01T2010")   # 2010-10-01 20:10:00 UTC
parse_datetime("20101010")          # 2010-10-10 UTC

parse_date("2010-10-01")            # 2010-10-01

# 시간 데이터
library('hms')
parse_time("20:10:01")              # 20:10:01
parse_time("01:10 am")              # 01:10:00
```

### 사용자 정의 날짜 형식

#### 날짜/시간 형식 지정자

| 구분 | 지정자 | 설명 | 예제 |
|------|--------|------|------|
| **연도** | `%Y` | 4자리 연도 | 2023 |
| | `%y` | 2자리 연도 | 23 |
| **월** | `%m` | 숫자 월 (01-12) | 03 |
| | `%b` | 축약 월명 | Mar |
| | `%B` | 전체 월명 | March |
| **일** | `%d` | 날짜 (01-31) | 15 |
| | `%e` | 공백 패딩 날짜 | _5 |
| **시간** | `%H` | 24시간 형식 | 14 |
| | `%I` | 12시간 형식 | 02 |
| | `%p` | AM/PM | PM |
| | `%M` | 분 | 30 |
| | `%S` | 초 | 45 |

### 실전 날짜 파싱 예제

```r
# 다양한 형식의 날짜 파싱
parse_date("01/02/15", "%m/%d/%y")  # 2015-01-02 (미국식)
parse_date("01/02/15", "%d/%m/%y")  # 2015-02-01 (유럽식)
parse_date("01/02/15", "%y/%m/%d")  # 2001-02-15 (ISO식)
```

#### 지역별 날짜 형식
- **미국**: MM/DD/YY
- **유럽**: DD/MM/YY
- **ISO**: YY/MM/DD

## 실무 활용 팁

### Tibble 사용 권장사항
1. **새 프로젝트**: 처음부터 tibble 사용
2. **기존 코드**: 점진적으로 tibble로 마이그레이션
3. **패키지 호환성**: 필요시 `as.data.frame()` 변환
4. **변수명**: 표준 변수명 사용 권장

### Parsing 전략
1. **데이터 탐색**: `glimpse()`, `summary()` 먼저 확인
2. **단계적 접근**: 작은 샘플로 테스트 후 전체 적용
3. **오류 대응**: `problems()` 함수로 문제점 파악
4. **로케일 설정**: 지역별 형식에 맞게 조정

### 성능 최적화
- **큰 데이터**: `read_csv()`가 `read.csv()`보다 빠름
- **타입 지정**: `col_types` 미리 지정하면 더 빠름
- **메모리 관리**: 필요한 열만 선택해서 읽기

## 마무리

**Tibble과 Parsing**은 현대적인 R 데이터 분석의 출발점입니다. 이번 포스팅에서 다룬 주요 내용을 정리하면:

- **Tibble**: 더 안전하고 직관적인 데이터 구조
- **Tribble**: 빠른 테스트 데이터 생성에 최적
- **Parsing**: 다양한 외부 데이터를 R로 안전하게 가져오기
- **오류 처리**: `problems()` 함수로 체계적인 문제 해결

**실무에서는 데이터 품질이 분석 결과를 좌우하므로, 초기 데이터 불러오기와 파싱 단계를 충분히 검토하는 것이 중요**합니다.

특히 **국제적인 프로젝트**에서는 다양한 날짜 형식과 숫자 표기법을 다뤄야 하므로, locale 설정과 사용자 정의 파싱 형식을 잘 활용하면 많은 시간을 절약할 수 있습니다!

다음 포스팅에서는 **데이터 변환과 정리(Data Wrangling)**에 대해 다뤄보겠습니다.