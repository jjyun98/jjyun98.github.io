---
title: 'R4DS - 논리형과 수 다루기'
published: 2022-08-08
draft: false
description: '논리 연산과 결측, if_else와 case_when, 수의 변환·반올림·구간화·누적·순위·오프셋·요약을 nycflights13 지연 자료로 정리'
series: 'R for Data Science'
seriesOrder: 6
tags: ['데이터 전처리', 'R']
---

[dplyr 글](/posts/r4ds-dplyr)에서 `filter()`와 `mutate()`를 썼다면, 그 안에 들어가는 조건식과 숫자 계산이 이 글의 주제다. R4DS(2판)의 Logical vectors와 Numbers 장을 따라, 논리형 벡터로 조건을 만들고 수 벡터를 변환·요약하는 도구를 정리한다. 자료는 `nycflights13::flights`다.

```r title="환경 설정"
library(tidyverse)
library(nycflights13)

theme_set(theme_minimal(base_size = 12))
```

## 1. 논리형 벡터

논리형(`TRUE`, `FALSE`, `NA`) 벡터는 비교 연산의 결과다. `filter()`는 `TRUE`인 행만 남기고, `mutate()`에서는 조건을 새 열로 저장할 수 있다.

```r
flights |>
  mutate(
    daytime = dep_time > 600 & dep_time < 2000,
    approx_ontime = abs(arr_delay) < 20,
    .keep = "used"
  ) |>
  head(5)
```

```text
# A tibble: 5 × 4
  dep_time arr_delay daytime approx_ontime
     <int>     <dbl> <lgl>   <lgl>        
1      517        11 FALSE   TRUE         
2      533        20 FALSE   FALSE        
3      542        33 FALSE   FALSE        
4      544       -18 FALSE   TRUE         
5      554       -25 FALSE   FALSE        
```

### 1.1 비교와 부동소수점

`==`는 값이 정확히 같은지 비교한다. 소수는 이진수로 저장되어 오차가 있으므로 `==`로 비교하면 뜻밖의 결과가 나온다. 오차를 허용하려면 `near()`를 쓴다.

```r
x <- c(1 / 49 * 49, sqrt(2) ^ 2)
x
x == c(1, 2)
near(x, c(1, 2))
```

```text
[1] 1 2
[1] FALSE FALSE
[1] TRUE TRUE
```

화면에는 `1 2`로 보이지만 `==`는 둘 다 `FALSE`다. 저장된 값이 정확히 1과 2가 아니기 때문이고, `near()`는 `TRUE`로 돌려준다.

### 1.2 결측값

`NA`가 들어간 비교와 연산의 결과는 `NA`다. "알 수 없는 값과 같은가"는 알 수 없기 때문이다. 그래서 결측을 찾을 때는 `==`가 아니라 `is.na()`를 쓴다.

```r
NA > 5
NA == NA
NA & FALSE   # 한쪽이 FALSE면 결과는 확실히 FALSE
NA | TRUE    # 한쪽이 TRUE면 결과는 확실히 TRUE

flights |>
  filter(is.na(dep_time)) |>
  count(is.na(arr_time))
```

```text
[1] NA
[1] NA
[1] FALSE
[1] TRUE
# A tibble: 1 × 2
  `is.na(arr_time)`     n
  <lgl>             <int>
1 TRUE               8255
```

출발 시각이 없는 8,255건은 도착 시각도 모두 없다(결항으로 볼 수 있다).

> **주의** `filter(x == NA)`는 모든 행이 `NA`가 되어 0행을 돌려준다. 에러가 나지 않으므로 알아채기 어렵다.

### 1.3 논리 연산과 `%in%`

| 연산 | 뜻 |
|---|---|
| `&` | 그리고 (원소별) |
| `\|` | 또는 (원소별) |
| `!` | 부정 |
| `xor(x, y)` | 둘 중 하나만 `TRUE` |
| `x %in% c(a, b)` | `x == a \| x == b`의 짧은 표현 |

`x == 1 | 2`처럼 쓰면 `(x == 1) | 2`로 읽혀서 항상 `TRUE`가 된다. 여러 값과 비교할 때는 `%in%`을 쓴다. `%in%`은 `==`와 달리 `NA %in% NA`가 `TRUE`다.

```r
flights |>
  filter(month %in% c(11, 12)) |>
  count(month)

c(1, NA) %in% c(NA, 2)
```

```text
# A tibble: 2 × 2
  month     n
  <int> <int>
1    11 27268
2    12 28135
[1] FALSE  TRUE
```

### 1.4 논리형 요약

`TRUE`는 1, `FALSE`는 0으로 계산되므로 `sum()`은 개수, `mean()`은 비율이 된다. `any()`와 `all()`은 하나라도, 모두 참인지 묻는다.

```r
flights |>
  summarise(
    n_delayed = sum(dep_delay > 60, na.rm = TRUE),
    prop_delayed = mean(dep_delay > 60, na.rm = TRUE),
    .by = origin
  )

flights |>
  summarise(
    all_short = all(dep_delay < 240, na.rm = TRUE),
    any_long = any(arr_delay >= 300, na.rm = TRUE),
    .by = c(month, day)
  ) |>
  count(all_short, any_long)
```

```text
# A tibble: 3 × 3
  origin n_delayed prop_delayed
  <chr>      <int>        <dbl>
1 EWR        10940       0.0930
2 LGA         7240       0.0713
3 JFK         8401       0.0768
# A tibble: 4 × 3
  all_short any_long     n
  <lgl>     <lgl>    <int>
1 FALSE     FALSE      108
2 FALSE     TRUE       183
3 TRUE      FALSE       72
4 TRUE      TRUE         2
```

출발이 60분 넘게 지연된 비행의 비율은 EWR이 0.093으로 가장 높다. 날짜별 표(365일)에서는 183 + 2 = 185일에 도착이 300분 이상 늦은 비행이 있었고, 모든 비행의 출발 지연이 240분 미만이었던 날은 72 + 2 = 74일이다.

### 1.5 조건에 따라 값 바꾸기: `if_else()`와 `case_when()`

`if_else(조건, 참일 때, 거짓일 때, 결측일 때)`는 두 갈래, `case_when()`은 여러 갈래다. `case_when()`은 위에서부터 처음 `TRUE`가 되는 줄을 쓰고, 어디에도 해당하지 않으면 `NA`가 된다. `.default`로 나머지 값을 정한다.

```r
flights |>
  mutate(
    status = if_else(arr_delay > 0, "late", "on time", "cancelled"),
    delay_class = case_when(
      arr_delay <= -30 ~ "much early",
      arr_delay <   0  ~ "early",
      arr_delay <   30 ~ "slightly late",
      arr_delay >= 30  ~ "late"
    ),
    .keep = "used"
  ) |>
  count(status, delay_class)
```

```text
# A tibble: 6 × 3
  status    delay_class        n
  <chr>     <chr>          <int>
1 cancelled <NA>            9430
2 late      late           52802
3 late      slightly late  80202
4 on time   early         166181
5 on time   much early     22752
6 on time   slightly late   5409
```

`arr_delay == 0`인 5,409건은 `status`로는 "on time"이지만 `delay_class`로는 "slightly late"에 들어간다. 조건의 경계는 겹치지 않게 써야 한다. 결항(`arr_delay`가 `NA`) 9,430건은 `if_else()`의 네 번째 인자로 "cancelled"가 되었지만, `case_when()`에서는 어느 조건도 맞지 않아 `NA`로 남았다.

`if_else()`와 `case_when()`의 반환값은 같은 타입이어야 한다. 숫자와 문자를 섞으면 에러가 난다.

## 2. 수

### 2.1 세기와 변환

`count()`는 범주별 행 수를, `n_distinct()`는 서로 다른 값의 수를 센다. `count(wt = )`나 `sum()`으로 가중합도 만든다. 문자열에서 숫자를 꺼낼 때는 `parse_number()`가 `$`, `,`, `%` 같은 문자를 무시한다.

```r
flights |> count(dest, sort = TRUE) |> head(3)
flights |> summarise(n_dest = n_distinct(dest), .by = origin)
flights |> filter(!is.na(tailnum)) |> count(tailnum, wt = distance, sort = TRUE) |> head(3)

parse_number(c("$1,234", "45%", "abc 7.5"))
```

```text
# A tibble: 3 × 2
  dest      n
  <chr> <int>
1 ORD   17283
2 ATL   17215
3 LAX   16174
# A tibble: 3 × 2
  origin n_dest
  <chr>   <int>
1 EWR        86
2 LGA        68
3 JFK        70
# A tibble: 3 × 2
  tailnum      n
  <chr>    <dbl>
1 N328AA  939101
2 N338AA  931183
3 N327AA  915665
[1] 1234.0   45.0    7.5
```

### 2.2 산술과 순환

길이가 다른 두 벡터를 계산하면 짧은 쪽이 되풀이된다(recycling). 길이 1은 늘 안전하지만, 길이가 맞지 않으면 경고가 난다. `pmin()`, `pmax()`는 원소별 최소·최대이고, `min()`, `max()`는 벡터 전체의 값이다.

```r
x <- c(1, 2, 10, 20)
x / 5
x / c(5, 5, 10, 10)
pmin(x, 5)
min(x, 5)
```

```text
[1] 0.2 0.4 2.0 4.0
[1] 0.2 0.4 1.0 2.0
[1] 1 2 5 5
[1] 1
```

`%/%`는 몫, `%%`는 나머지다. 시각이 `hhmm` 형식으로 저장된 `dep_time`에서 시와 분을 뽑을 때 쓴다.

```r
flights |>
  mutate(hour = dep_time %/% 100, minute = dep_time %% 100, .keep = "used") |>
  head(3)
```

```text
# A tibble: 3 × 3
  dep_time  hour minute
     <int> <dbl>  <dbl>
1      517     5     17
2      533     5     33
3      542     5     42
```

### 2.3 반올림과 구간화

`round(x, digits)`는 반올림이고, `digits`가 음수면 자리수를 앞으로 센다. R은 0.5를 가장 가까운 짝수로 보내므로(`round(2.5)`는 2, `round(3.5)`는 4) 반올림 규칙이 학교 방식과 다를 수 있다. `floor()`는 내림, `ceiling()`은 올림이다. 연속값을 구간으로 나눌 때는 `cut()`을 쓴다.

```r
round(c(-1.5, -0.5, 0.5, 1.5, 2.5))
round(123.456, 1)
round(123.456, -1)
floor(123.456); ceiling(123.456)

cut(c(1, 5, 12, 40), breaks = c(0, 5, 10, Inf), labels = c("low", "mid", "high"))
```

```text
[1] -2  0  0  2  2
[1] 123.5
[1] 120
[1] 123
[1] 124
[1] low  low  high high
Levels: low mid high
```

`cut()`의 구간은 기본적으로 오른쪽이 닫힌다(`(0, 5]`). 그래서 5는 `low`로 간다. 경계를 왼쪽에 닫으려면 `right = FALSE`를 쓴다.

### 2.4 누적, 순위, 앞뒤 값

`cumsum()`, `cummean()`, `cummax()` 등은 누적값을 만든다. 순위 함수는 동점을 처리하는 방식이 다르다.

```r
x <- c(1, 2, 2, 3, 4, NA)
tibble(
  x,
  row_number = row_number(x),
  min_rank   = min_rank(x),
  dense_rank = dense_rank(x),
  percent    = percent_rank(x)
)
```

```text
# A tibble: 6 × 5
      x row_number min_rank dense_rank percent
  <dbl>      <int>    <int>      <int>   <dbl>
1     1          1        1          1    0   
2     2          2        2          2    0.25
3     2          3        2          2    0.25
4     3          4        4          3    0.75
5     4          5        5          4    1   
6    NA         NA       NA         NA   NA   
```

`lag(x)`는 한 칸 앞의 값을, `lead(x)`는 한 칸 뒤의 값을 가져온다. 변화량(`x - lag(x)`)과 값이 바뀐 지점(`x != lag(x)`)을 찾는 데 쓴다.

```r
x <- c(2, 5, 11, 11, 19, 35)
x - lag(x)
x == lag(x)
lead(x)
```

```text
[1] NA  3  6  0  8 16
[1]    NA FALSE FALSE  TRUE FALSE FALSE
[1]  5 11 11 19 35 NA
```

### 2.5 수 요약

중심은 `mean()`과 `median()`, 퍼짐은 `sd()`와 `IQR()`, 위치는 `quantile(x, p)`다. 극단값이 있으면 평균은 크게 움직이지만 중앙값은 거의 그대로다.

```r
flights |>
  summarise(
    mean = mean(dep_delay, na.rm = TRUE),
    median = median(dep_delay, na.rm = TRUE),
    p90 = quantile(dep_delay, 0.90, na.rm = TRUE),
    iqr = IQR(dep_delay, na.rm = TRUE),
    max = max(dep_delay, na.rm = TRUE)
  )
```

```text
# A tibble: 1 × 5
   mean median   p90   iqr   max
  <dbl>  <dbl> <dbl> <dbl> <dbl>
1  12.6     -2    49    16  1301
```

평균 12.6분과 중앙값 -2분의 차이가 크다. 최댓값 1,301분 같은 큰 지연이 평균을 끌어올리기 때문이다.

## 3. 비교

비슷해 보이지만 결과가 다른 쌍을 정리한다.

| 비교 | 차이 | 고르는 기준 |
|---|---|---|
| `==` 와 `near()` | `==`는 정확히 같아야 `TRUE`, `near()`는 아주 작은 오차를 허용 | 소수 계산 결과는 `near()` |
| `&` 와 `&&` | `&`는 원소별, `&&`는 길이 1짜리 하나만 보고 `if` 조건용 | 열 조건은 `&`, `if ()`는 `&&` |
| `if_else()` 와 `case_when()` | 두 갈래 / 여러 갈래, `case_when()`은 해당 없으면 `NA` | 갈래 수와 `.default` 필요 여부 |
| `round` 와 `floor`·`ceiling` | 가장 가까운 값 / 아래로 / 위로 | 구간 번호는 `floor`, 상한 맞추기는 `ceiling` |
| `row_number` / `min_rank` / `dense_rank` | 동점에 순서대로 / 같은 순위 후 건너뜀 / 같은 순위 후 안 건너뜀 | 중복 없는 번호면 `row_number`, 순위표면 `min_rank` |
| `lag` 와 `lead` | 앞 값 / 뒤 값 | 이전 대비 변화는 `lag`, 다음 사건은 `lead` |

`&&`는 R 4.3부터 길이 2 이상의 입력에 에러를 낸다. 열에 쓰려고 `&&`를 쓰면 에러로 알려준다.

## 4. 예시와 사용: 지연은 얼마나 퍼지는가

### 4.1 공항별 지연 비율

출발 지연이 1시간을 넘는 비행의 비율을 목적지별로 구한다. 논리값의 `mean()`이 비율이다.

```r
dest_delay <- flights |>
  summarise(
    n = n(),
    prop_late = mean(dep_delay > 60, na.rm = TRUE),
    .by = dest
  ) |>
  filter(n >= 1000) |>
  arrange(desc(prop_late))

head(dest_delay, 5)
```

```text
# A tibble: 5 × 3
  dest      n prop_late
  <chr> <int>     <dbl>
1 RIC    2454     0.164
2 MHT    1009     0.145
3 MCI    2008     0.140
4 GSO    1606     0.135
5 CVG    3941     0.133
```

운항이 1,000편 이상인 목적지 중 RIC가 60분 넘게 늦게 출발한 비율이 0.164로 가장 높다.

### 4.2 지연의 전후 관계

앞 비행이 늦으면 뒤 비행도 늦는가? 같은 출발 공항에서 시각 순으로 `lag()`를 걸어 확인한다.

```r
delay_chain <- flights |>
  filter(!is.na(dep_delay)) |>
  arrange(origin, month, day, sched_dep_time) |>
  mutate(prev_delay = lag(dep_delay), .by = origin) |>
  filter(!is.na(prev_delay))

cor(delay_chain$prev_delay, delay_chain$dep_delay)

delay_chain |>
  mutate(prev_class = cut(prev_delay, c(-Inf, 0, 30, 60, Inf),
                          labels = c("<=0", "0-30", "30-60", ">60"))) |>
  summarise(mean_delay = mean(dep_delay), n = n(), .by = prev_class) |>
  arrange(prev_class)
```

```text
[1] 0.2709383
# A tibble: 4 × 3
  prev_class mean_delay      n
  <fct>           <dbl>  <int>
1 <=0              4.78 200087
2 0-30            17.3   80140
3 30-60           29.5   21710
4 >60             43.9   26581
```

같은 공항의 직전 출발이 60분 넘게 늦으면 다음 비행의 평균 출발 지연은 43.9분, 직전이 제시간이나 일찍이면 4.78분이다. 상관계수는 0.271이다. 지연이 뒤 비행으로 이어진다는 연관을 보여 줄 뿐, 앞 비행이 원인이라는 증거는 아니다(날씨 같은 공통 원인도 있다).

## 자주 하는 실수

| 증상 | 원인과 해결 |
|---|---|
| `filter(x == NA)`가 0행 | `NA`와의 비교는 `NA`. `is.na(x)` |
| `x == 1 \| 2`가 항상 참 | `(x == 1) \| 2`로 읽힌다. `x %in% c(1, 2)` |
| `sum(x > 0)`이 `NA` | 결측이 있다. `na.rm = TRUE` |
| `case_when()`에 `NA`가 생김 | 어느 조건도 맞지 않은 행. `.default =`로 기본값 지정 |
| `round(2.5)`가 2 | 짝수로 반올림하는 규칙. 올림이 필요하면 `ceiling` 등을 쓴다 |
| 구간 경계값이 예상과 다른 쪽에 들어감 | `cut()`은 오른쪽이 닫힘. `right = FALSE` |

## 요약

| 하고 싶은 것 | 코드 |
|---|---|
| 결측 찾기 | `is.na(x)` |
| 여러 값 중 하나 | `x %in% c(...)` |
| 개수·비율 | `sum(조건)`, `mean(조건)` |
| 하나라도·모두 | `any()`, `all()` |
| 두 갈래·여러 갈래 | `if_else()`, `case_when()` |
| 몫과 나머지 | `%/%`, `%%` |
| 반올림·구간 | `round()`, `floor()`, `cut()` |
| 누적 | `cumsum()` |
| 순위 | `row_number()`, `min_rank()`, `dense_rank()` |
| 앞뒤 값 | `lag()`, `lead()` |

## 참고자료

- *R for Data Science* (2nd ed.): [12 Logical vectors](https://r4ds.hadley.nz/logicals.html), [13 Numbers](https://r4ds.hadley.nz/numbers.html)
- [dplyr 공식 문서](https://dplyr.tidyverse.org/)

다음 글: [R4DS - 문자열과 정규표현식](/posts/r4ds-string)
