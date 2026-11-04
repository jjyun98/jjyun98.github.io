---
title: 'R4DS - 반복: across와 map'
published: 2022-08-26
draft: false
description: '벡터와 리스트, for 반복문, 여러 열에 같은 작업을 하는 across, 리스트에 함수를 적용하는 purrr map 함수군, 오류 처리와 reduce, 여러 파일 읽기를 실습으로 정리'
series: 'R for Data Science'
tags: ['R', 'tidyverse', 'purrr', '함수형 프로그래밍']
---

같은 작업을 여러 번 할 때 코드를 복사하는 대신 반복을 쓴다. R4DS(2판) Iteration 장과 purrr를 따라, 반복을 **여러 열**(`across`)과 **여러 원소**(`map`) 두 방향으로 나눠 정리한다. 1판에서 다루던 리스트 열과 그룹별 모델은 [모델링 글](/posts/r4ds-modeling)로 옮겼다.

```r title="환경 설정"
library(tidyverse)
```

## 어떤 반복을 쓸까

| 상황 | 도구 |
|---|---|
| 데이터 프레임의 **여러 열**에 같은 계산 | `across()` (mutate, summarise 안에서) |
| 여러 열 중 하나라도 / 모두 조건 만족 | `if_any()`, `if_all()` (filter 안에서) |
| 리스트나 벡터의 **원소마다** 함수 적용 | `map()` 계열 |
| 입력이 두 개, 여러 개 | `map2()`, `pmap()` |
| 결과를 하나로 누적 | `reduce()` |
| 앞 결과가 다음 계산에 필요, 조기 종료 | `for`, `while` |

## 1. 벡터와 리스트

반복의 대상이 되는 자료구조다.

```r
x <- list(a = 1:3, b = "a string", c = pi, d = list(-1, -5))
str(x)

x[1]        # 리스트 그대로 (원소 하나짜리 리스트)
x[[1]]      # 원소 자체: 1 2 3
x$a         # 이름으로: x[["a"]]와 같다
x[[4]][[1]] # 중첩: -1
```

| 문법 | 결과 |
|---|---|
| `x[i]` | 일부를 담은 **같은 타입**(리스트면 리스트) |
| `x[[i]]`, `x$name` | 원소 하나를 **꺼낸 것** |

데이터 프레임은 열의 리스트라서 `df[[1]]`은 첫 열(벡터), `length(df)`는 열 개수다.

## 2. for 반복문

```r
df <- tibble(a = rnorm(10), b = rnorm(10), c = rnorm(10), d = rnorm(10))

output <- vector("double", ncol(df))   # 1. 결과 공간을 미리 만든다
for (i in seq_along(df)) {             # 2. 반복 범위
  output[[i]] <- median(df[[i]])       # 3. 본문
}
output
```

- 결과를 `c(output, new)`로 하나씩 늘리면 매번 복사가 일어나 느리다. 미리 만들어 둔다.
- `1:length(x)`는 `x`가 비어 있으면 `1:0`이 되어 엉뚱하게 돈다. `seq_along(x)`를 쓴다.
- 길이를 미리 모르면 리스트에 담은 뒤 마지막에 합친다(`list_rbind()`, `unlist()`).

for는 여전히 쓸모 있지만, 데이터 프레임 작업은 대부분 아래 `across()`나 `map()`이 더 짧고 실수가 적다.

## 3. across: 여러 열에 같은 작업

```r
df <- tibble(
  grp = sample(2, 10, replace = TRUE),
  a = rnorm(10), b = rnorm(10), c = rnorm(10), d = rnorm(10)
)

df |> summarise(n = n(), across(a:d, median), .by = grp)
```

### 열 고르기와 함수 지정

```r
# 숫자 열 전체에 평균과 표준편차, 이름 규칙 지정
df |>
  summarise(across(where(is.numeric), list(mean = mean, sd = sd), .names = "{.col}_{.fn}"))

# 인자가 필요하면 익명 함수 \(x)
df_miss <- df |> mutate(a = if_else(a > 1, NA, a))
df_miss |> summarise(across(a:d, \(x) mean(x, na.rm = TRUE)))

# 결측을 0으로
df_miss |> mutate(across(a:d, \(x) coalesce(x, 0)))

# 조건: 어느 열이든 NA인 행
df_miss |> filter(if_any(a:d, is.na))
```

| 인자 | 내용 |
|---|---|
| `.cols` | `a:d`, `where(is.numeric)`, `starts_with("x")`, `everything()` 등 select 문법 |
| `.fns` | 함수 이름, `\(x) f(x, 인자)`, 또는 이름 붙은 리스트 |
| `.names` | 결과 열 이름. `{.col}`, `{.fn}` |

`\(x)`는 R 4.1부터 생긴 익명 함수 문법이다(`function(x)`와 같다). 예전에 쓰던 `summarise_at()`, `mutate_if()`, `~ .x` 형식은 모두 `across()`와 `\(x)`로 바꿀 수 있다.

## 4. map: 원소마다 함수 적용

### 반환 타입별 함수

```r
map(1:3, \(x) x * 2)                 # 리스트
map_dbl(1:3, \(x) x * 2)             # 실수 벡터
map_chr(c("a", "b"), str_to_upper)   # 문자 벡터
map_lgl(list(1, "a", TRUE), is.numeric)
```

| 함수 | 결과 |
|---|---|
| `map()` | 리스트 |
| `map_dbl()`, `map_int()`, `map_chr()`, `map_lgl()` | 해당 타입 벡터. 결과가 길이 1이 아니면 에러 |
| `map_vec()` | 결과 타입을 자동으로 맞춘 벡터 |
| `walk()` | 결과 없이 부수효과만 (파일 저장, 출력) |

### 사례: 그룹별 회귀계수

```r
mpg |>
  split(mpg$drv) |>                         # 구동 방식별 데이터 프레임 3개의 리스트
  map(\(df) lm(hwy ~ displ, data = df)) |>  # 각각 회귀
  map(coef) |>                              # 계수
  map_dbl(2)                                # 두 번째 원소(기울기)만
```

`map_dbl(2)`처럼 숫자나 이름을 주면 각 원소에서 그 위치를 꺼낸다. 이런 그룹별 모델은 데이터 프레임 안에 담아 관리하는 편이 더 낫다([모델링 글](/posts/r4ds-modeling)의 nest).

### 입력이 여러 개

```r
mu <- c(5, 10, -3)
sigma <- c(1, 5, 10)
map2(mu, sigma, \(m, s) rnorm(5, mean = m, sd = s))

params <- tibble(n = c(1, 3, 5), mean = c(5, 10, -3), sd = c(1, 5, 10))
pmap(params, rnorm)   # 열 이름이 함수 인자 이름과 같으면 그대로 연결된다
```

### base R의 apply 계열과 비교

| base R | purrr | 차이 |
|---|---|---|
| `lapply(x, f)` | `map(x, f)` | 거의 같다 |
| `sapply(x, f)` | `map_*()` | sapply는 결과 모양을 추측해서 바꾼다. purrr는 타입을 명시 |
| `vapply(x, f, numeric(1))` | `map_dbl(x, f)` | 둘 다 타입 안전 |
| `mapply(f, x, y)` | `map2(x, y, f)` | |
| `apply(m, 1, f)` | (행렬 전용) | 행렬의 행·열 방향 |

## 5. 오류 처리

```r
x <- list(1, 10, "a")

# map(x, log)는 "a"에서 멈추고 앞의 결과도 잃는다
safe_log <- safely(log)
res <- map(x, safe_log)
res[[3]]                                   # result = NULL, error = <오류>

map_dbl(x, possibly(log, otherwise = NA_real_))   # 실패한 곳은 NA
```

| 함수 | 결과 |
|---|---|
| `safely(f)` | `list(result, error)`. 어디서 왜 실패했는지 확인 |
| `possibly(f, otherwise)` | 실패하면 기본값 |
| `quietly(f)` | 출력, 메시지, 경고를 함께 담아 반환 |

## 6. reduce와 accumulate

```r
dfs <- list(
  age = tibble(name = "John", age = 30),
  sex = tibble(name = c("John", "Mary"), sex = c("M", "F")),
  trt = tibble(name = "Mary", treatment = "A")
)
dfs |> reduce(full_join, by = "name")    # 테이블 여러 개를 차례로 join

accumulate(1:5, `+`)                     # 누적 합: 1 3 6 10 15
```

## 7. 사례: 여러 파일을 한 번에 읽기

반복이 가장 자주 쓰이는 곳이다. 예제를 위해 임시 폴더에 제조사별 CSV를 만들어 둔다.

```r
dir <- file.path(tempdir(), "mpg_by_maker")
dir.create(dir, showWarnings = FALSE)
mpg |>
  split(mpg$manufacturer) |>
  iwalk(\(df, name) write_csv(df, file.path(dir, str_c(name, ".csv"))))
```

```r
paths <- list.files(dir, pattern = "\\.csv$", full.names = TRUE)

all_mpg <- paths |>
  set_names(basename) |>                              # 파일 이름을 원소 이름으로
  map(\(p) read_csv(p, col_types = cols(drv = col_character()), show_col_types = FALSE)) |>
  list_rbind(names_to = "file")                       # 하나의 데이터 프레임으로

all_mpg |> count(file)
```

`col_types`를 지정한 이유가 있다. honda 차량은 `drv`가 모두 `"f"`라서, 지정하지 않으면 read_csv가 이 열을 논리값 `FALSE`로 추측하고, 다른 파일(문자형)과 합칠 때 타입 충돌 에러가 난다. 파일을 따로 읽어 합칠 때는 **타입을 고정**하는 것이 안전하다.

같은 구조의 CSV라면 `read_csv(paths, id = "file")` 한 줄로도 된다. 파일마다 정제가 필요하거나 엑셀처럼 함수가 경로 여러 개를 못 받을 때 위 패턴을 쓴다.

## 자주 하는 실수

| 증상 | 원인과 해결 |
|---|---|
| `map_dbl` 에러: 결과 길이가 1이 아님 | 함수가 여러 값을 돌려준다. `map()`으로 받고 확인 |
| for 결과가 마지막 값 하나뿐 | `output[[i]] <-`가 아니라 `output <-`로 덮어썼다 |
| for가 빈 입력에서 이상하게 돈다 | `1:length(x)` 대신 `seq_along(x)` |
| across 안에서 인자를 못 넘김 | `across(a:d, \(x) mean(x, na.rm = TRUE))` |
| 하나가 실패해서 전체 결과를 잃음 | `safely()`, `possibly()` |
| `x[1]`로 꺼냈는데 리스트 | 원소를 꺼내려면 `x[[1]]` |
| 파일 합치기에서 `Can't combine <character> and <logical>` | 파일마다 열 타입 추측이 달랐다(`"f"`, `"T"`가 논리값으로). `col_types`로 고정 |

## 요약

| 하고 싶은 것 | 코드 |
|---|---|
| 여러 열에 함수 | `mutate(across(a:d, f))`, `summarise(across(where(is.numeric), mean))` |
| 여러 함수, 이름 지정 | `across(cols, list(mean = mean, sd = sd), .names = "{.col}_{.fn}")` |
| 조건 걸러내기 | `filter(if_any(cols, is.na))`, `if_all()` |
| 원소마다 | `map(x, \(i) ...)`, 타입 지정 `map_dbl()` |
| 두 입력 | `map2(x, y, \(a, b) ...)` |
| 여러 입력 | `pmap(df, f)` |
| 실패해도 계속 | `possibly(f, NA)` |
| 누적 | `reduce(list, full_join)` |
| 여러 파일 | `map(read_csv) \|> list_rbind(names_to =)` |

## 참고자료

- *R for Data Science* (2nd ed.): [26 Iteration](https://r4ds.hadley.nz/iteration.html), [27 A field guide to base R](https://r4ds.hadley.nz/base-R.html)
- [purrr 공식 문서](https://purrr.tidyverse.org/)

다음 글: [R4DS - 모델링 기초: lm과 broom](/posts/r4ds-modeling)
