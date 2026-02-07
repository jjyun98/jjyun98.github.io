---
title: 'Vector와 Iteration 정리'
published: 2022-08-17
draft: false
description: "R Vector와 반복문 처리 방법 정리. apply 계열 함수부터 purrr의 map, reduce까지 예제와 함께 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

> 참고 자료:
> [purrr 공식 문서](https://purrr.tidyverse.org/) | [R for Data Science - Iteration](https://r4ds.had.co.nz/iteration.html)

## 개요

**반복문과 벡터 연산**은 R에서 데이터 처리의 핵심 도구입니다. 전통적인 for 루프부터 함수형 프로그래밍 패러다임의 **purrr 패키지**까지 다양한 반복 처리 방법을 알아보겠습니다.

```r title="환경 설정"
# 패키지 로드
library('tidyverse')  # purrr 패키지 포함
library('data.table')

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 1. Vector와 List 기초

**에러 처리 함수**

```r
# stop: 즉시 중단하고 메시지 표시
# stopifnot: 조건이 FALSE일 때만 중단 (다중 조건 검사에 유용)
```

**List의 특징과 활용**

이름 지정 가능한 List:

```r
# 이름이 있는 리스트 생성
x_named <- list(a = 1, b = 2, c = 3)
x_named
# $a
# [1] 1
# $b  
# [1] 2
# $c
# [1] 3
```

다양한 데이터 타입 혼합 저장:

```r
# 서로 다른 타입들을 하나의 리스트에 저장
y <- list("a", 1L, 1.5, TRUE)
y
# [[1]]
# [1] "a"
# [[2]]
# [1] 1
# [[3]] 
# [1] 1.5
# [[4]]
# [1] TRUE
```

중첩 리스트 구조:

```r
# 리스트 안에 리스트 포함
z <- list(list(1, 2), list(3, 4))
str(z)
# List of 2
#  $ :List of 2
#   ..$ : num 1
#   ..$ : num 2
#  $ :List of 2
#   ..$ : num 3
#   ..$ : num 4
```

**리스트 구조 비교**

```r
x1 <- list(c(1, 2), c(3, 4))          # 벡터들의 리스트
x2 <- list(list(1, 2), list(3, 4))    # 리스트들의 리스트  
x3 <- list(1, list(2, list(3)))       # 깊이가 다른 중첩 리스트
```

**리스트 서브셋팅**

```r
# 예제 리스트 생성
a <- list(a = 1:3, b = "a string", c = pi, d = list(-1, -5))

# [ ] : 부분 리스트 추출 (결과는 항상 리스트)
str(a[1:2])
# List of 2
#  $ a: int [1:3] 1 2 3  
#  $ b: chr "a string"

# [[ ]] : 단일 구성요소 추출 (리스트 계층 한 단계 제거)
str(a[[1]])
# int [1:3] 1 2 3

# $ : 명명된 요소 추출 (따옴표 불필요)
a$a        # 동일: a[["a"]]
# [1] 1 2 3
```

:::note
**핵심 포인트**
- **`[`**: 더 작은 새 리스트 반환
- **`[[`**: 리스트 안으로 들어가서 내용 추출
:::

## 2. 전통적인 반복문 (for loop)

**기본 for 루프 구조**

```r
# 데이터프레임 생성
df <- tibble(
  a = rnorm(10),
  b = rnorm(10), 
  c = rnorm(10),
  d = rnorm(10)
)

# 각 열의 중앙값 계산
output <- vector("double", ncol(df))
for(i in seq_along(df)){
  output[[i]] <- median(df[[i]])
}
output
```

**seq_along vs 1:length 비교**

```r
y <- vector("double", 0)

seq_along(y)  # integer(0) - 안전함
1:length(y)   # [1] 1 0 - 예상치 못한 결과!
```

:::tip
**`seq_along()`**을 사용하면 빈 벡터에서도 안전하게 작동합니다.
:::

**실전 예제: 데이터 정규화**

```r
# 0-1 스케일링 함수
rescale01 <- function(x){
  rng <- range(x, na.rm = TRUE)
  (x - rng[1]) / (rng[2] - rng[1])
}

# for 루프로 모든 열에 적용
for (i in seq_along(df)){
  df[[i]] <- rescale01(df[[i]])
}
```

**길이를 모르는 출력 처리**

비효율적인 방법 (벡터 늘리기):

```r
means <- c(0, 1, 2)
output <- double()
for (i in seq_along(means)){
  n <- sample(100, 1)
  output <- c(output, rnorm(n, means[[i]]))  # 매번 복사!
}
```

효율적인 방법 (리스트 사용):

```r
out <- vector("list", length(means))
for(i in seq_along(means)){
  n <- sample(100, 1)
  out[[i]] <- rnorm(n, means[[i]])
}
# 최종적으로 평탄화
result <- unlist(out)
```

## 3. map 함수군 - 함수형 프로그래밍

**기본 map 함수**

```r
# 각 열의 평균 계산
map_dbl(df, mean)
#    a       b       c       d 
# 0.123  -0.456   0.789   0.234

# 다양한 통계량 계산
map_dbl(df, median)  # 중앙값
map_dbl(df, sd)      # 표준편차
```

**map 함수 타입별 정리**

| 함수 | 반환 타입 | 용도 |
|------|-----------|------|
| `map()` | 리스트 | 일반적인 변환 |
| `map_lgl()` | 논리형 벡터 | TRUE/FALSE 결과 |
| `map_int()` | 정수형 벡터 | 정수 결과 |
| `map_dbl()` | 더블형 벡터 | 실수 결과 |
| `map_chr()` | 문자형 벡터 | 문자 결과 |

**파이프와 함께 사용**

```r
# 파이프 연산자로 깔끔하게
df %>% map_dbl(mean)

# 이름 유지 확인
z <- list(x = 1:3, y = 4:5)
map_int(z, length)
# x y 
# 3 2
```

## 4. 고급 map 활용

**그룹별 모델링**

```r
# 실린더 수별로 선형 모형 적합
models <- mtcars %>% 
  split(.$cyl) %>%
  map(~lm(mpg ~ wt, data = .))

models
# $`4`
# Call: lm(formula = mpg ~ wt, data = .)
# Coefficients:
# (Intercept)          wt  
#      39.571      -5.647  
```

모델에서 R² 추출하기:

```r
# 방법 1: 익명 함수 사용
models %>%
  map(summary) %>%
  map_dbl(~.$r.squared)

# 방법 2: 이름으로 직접 추출 (더 간단!)
models %>%
  map(summary) %>%
  map_dbl("r.squared")
# 4         6         8 
# 0.5086    0.4645    0.4230
```

**위치로 요소 선택**

```r
# 각 리스트의 두 번째 요소 추출
x <- list(list(1,2,3), list(4,5,6), list(7,8,9))
x %>% map_dbl(2)
# [1] 2 5 8
```

## 5. apply 함수군

**apply 계열 함수 비교**

| 함수 | 입력 | 출력 | 특징 |
|------|------|------|------|
| `apply()` | 배열/행렬 | 벡터/배열 | 행/열 방향 적용 |
| `lapply()` | 벡터/리스트 | 리스트 | 항상 리스트 반환 |
| `sapply()` | 벡터/리스트 | 벡터/행렬 | 간단한 형태로 변환 |

**실전 예제**

```r
# 임계값 함수 정의
threshold <- function(x, cutoff = 0.9) x[x > cutoff]

# 데이터 생성
x1 <- list(
  c(0.27, 0.37, 0.57, 0.91, 0.20),
  c(0.90, 0.94, 0.66, 0.63, 0.06),
  c(0.21, 0.18, 0.69, 0.38, 0.77)
)

# sapply 적용
x1 %>% sapply(threshold) %>% str()
# List of 3
#  $ : num 0.91
#  $ : num 0.94  
#  $ : num(0)
```

## 6. 오류 처리

**safely() 함수**

```r
# 안전한 로그 함수 생성
safe_log <- safely(log)

# 정상 케이스
str(safe_log(10))
# List of 2
#  $ result: num 2.3
#  $ error : NULL

# 오류 케이스  
str(safe_log("a"))
# List of 2
#  $ result: NULL
#  $ error :List of 2
#   ..$ message: chr "non-numeric argument to mathematical function"
```

## 7. 다중 인수 map

### map2() : 두 개 인수

```r
mu <- list(5, 10, -3)
sigma <- list(1, 5, 10)

# 평균과 표준편차를 동시에 적용
map2(mu, sigma, rnorm, n = 10)
```

map2 작동 원리:

| mu | sigma | 결과 |
|----|-------|------|
| 5 | 1 | rnorm(10, mean=5, sd=1) |
| 10 | 5 | rnorm(10, mean=10, sd=5) |
| -3 | 10 | rnorm(10, mean=-3, sd=10) |

### pmap() : 다중 인수

```r
# 3개 이상의 인수 처리
n <- list(1, 3, 5)
args1 <- list(n, mu, sigma)
args1 %>% pmap(rnorm) %>% str()

# 이름으로 인수 지정 (더 안전!)
args2 <- list(mean = mu, sd = sigma, n = n)
args2 %>% pmap(rnorm) %>% str()
```

**데이터프레임으로 매개변수 관리**

```r
# 복잡한 경우 데이터프레임 사용
params <- tribble(
  ~mean, ~sd, ~n,
  5,     1,   1,
  10,    5,   3, 
  -3,    10,  5
)

params %>% pmap(rnorm)
```

### invoke_map() : 함수까지 변수로

```r
# 함수 이름과 매개변수 리스트
f <- c("runif", "rnorm", "rpois")
param <- list(
  list(min = -1, max = 1),
  list(sd = 5),
  list(lambda = 10)
)

invoke_map(f, param, n = 5) %>% str()
```

invoke_map 작동 원리:

| 함수 | 매개변수 | 결과 |
|------|----------|------|
| "runif" | min=-1, max=1 | runif(n=5, min=-1, max=1) |
| "rnorm" | sd=5 | rnorm(n=5, sd=5) |
| "rpois" | lambda=10 | rpois(n=5, lambda=10) |

## 8. 논리 검사 함수

**some & every**

```r
x <- list(1:5, letters, list(10))

# 일부 요소가 조건을 만족하는지
x %>% some(is.character)  # TRUE

# 모든 요소가 조건을 만족하는지  
x %>% every(is_vector)    # TRUE
```

**detect 계열 함수**

```r
x <- sample(10)  # [1] 9 4 8 3 7 2 10 6 5 1

# 조건을 만족하는 첫 번째 값
x %>% detect(~ . > 5)        # 9

# 조건을 만족하는 첫 번째 위치
x %>% detect_index(~ . > 5)  # 1

# 앞에서부터 조건 만족하는 연속 요소들
x %>% head_while(~ . > 5)    # 9

# 뒤에서부터 조건 만족하는 연속 요소들  
x %>% tail_while(~ . > 5)    # (빈 결과)
```

## 9. reduce

**데이터프레임 조인**

```r
# 여러 데이터프레임을 하나로 합치기
dfs <- list(
  age = tibble(name = "John", age = 30),
  sex = tibble(name = c("John", "Mary"), sex = c("M", "F")),
  trt = tibble(name = "Mary", treatment = "A")
)

# 순차적으로 조인
dfs %>% reduce(full_join)
#   name   age sex treatment
# 1 John    30  M      <NA>
# 2 Mary   <NA> F         A
```

**벡터 교집합 구하기**

```r
# 여러 벡터의 교집합
vs <- list(
  c(1, 3, 5, 6, 10),
  c(1, 2, 3, 7, 8, 10),
  c(1, 2, 3, 4, 8, 9, 10)
)

vs %>% reduce(intersect)
# [1]  1  3 10
```

## 주요 함수 요약

**map 계열**
- `map()`: 리스트 반환
- `map_lgl()`, `map_int()`, `map_dbl()`, `map_chr()`: 타입 지정 반환
- `map2()`, `pmap()`: 여러 인수 처리

**apply 계열**
- `apply()`: 배열/행렬의 행/열 방향 적용
- `lapply()`: 리스트 반환
- `sapply()`: 단순화된 형태 반환

**기타**
- `reduce()`: 리스트 통합
- `safely()`: 안전한 오류 처리
- `detect()`: 조건 만족 요소 찾기 