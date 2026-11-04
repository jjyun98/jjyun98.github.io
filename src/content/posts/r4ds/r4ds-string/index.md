---
title: 'R4DS - 문자열과 정규표현식'
published: 2022-08-12
draft: false
description: 'stringr의 문자열 함수(길이, 자르기, 합치기, 탐지, 추출, 치환, 분할)와 정규표현식 문법을 실습으로 정리'
series: 'R for Data Science'
tags: ['R', 'tidyverse', 'stringr', '정규표현식']
---

R4DS(2판) Strings, Regular expressions 장을 실습하며 정리했다. stringr 함수는 모두 `str_`로 시작하고 첫 인자가 문자열 벡터라서, 자동완성으로 찾기 쉽고 파이프로 잇기 좋다. 예제 데이터는 stringr에 들어 있는 `fruit`, `words`, `sentences`를 쓴다.

```r title="환경 설정"
library(tidyverse)
```

## 함수 지도

| 하고 싶은 것 | 함수 | 결과 |
|---|---|---|
| 길이 | `str_length(x)` | 정수 |
| 일부 자르기 | `str_sub(x, start, end)` | 문자열 |
| 합치기 | `str_c(...)`, `str_glue("{x}")`, `str_flatten(x, ", ")` | 문자열 |
| 대소문자 | `str_to_lower`, `str_to_upper`, `str_to_title` | 문자열 |
| 공백 정리 | `str_trim`, `str_squish` | 문자열 |
| 패턴이 있나 | `str_detect(x, pattern)` | TRUE/FALSE |
| 몇 번 나오나 | `str_count(x, pattern)` | 정수 |
| 패턴 꺼내기 | `str_extract`, `str_extract_all` | 문자열 |
| 패턴 바꾸기 | `str_replace`, `str_replace_all`, `str_remove` | 문자열 |
| 나누기 | `str_split(x, pattern)` | 리스트 |
| 패턴 확인 | `str_view(x, pattern)` | 일치 부분 표시 |

## 1. 기본 조작

```r
x <- c("Apple", "Banana", "Pear")

str_length(x)              # 5 6 4
str_sub(x, 1, 3)           # "App" "Ban" "Pea"
str_sub(x, -3, -1)         # 뒤에서 3글자
str_to_lower(x)

str_c("x", "y", sep = ", ")               # "x, y"
str_c("prefix-", x)                        # 벡터에 각각 붙이기
str_flatten(x, collapse = ", ")            # 벡터 전체를 하나로: "Apple, Banana, Pear"

name <- c("Flora", "David")
str_glue("Hello {name}!")                  # 변수 끼워 넣기
```

`str_c()`는 `NA`가 섞이면 결과도 `NA`다. `NA`를 글자로 남기려면 `str_replace_na()`를 먼저 쓴다.

데이터 프레임에서는 `mutate()` 안에서 쓴다.

```r
df <- tibble(name = c("Flora", "David", "Terra", NA))
df |> mutate(greeting = str_c("Hi ", name, "!"))
df |> mutate(greeting = str_glue("Hi {name}!"))   # NA는 "NA"로 들어간다
```

## 2. 정규표현식

### 문법 요약

| 표현 | 뜻 | 예 |
|---|---|---|
| `.` | 아무 문자 하나 | `a.c` → abc, a1c |
| `^`, `$` | 시작, 끝 | `^a`, `a$` |
| `[abc]`, `[^abc]` | 셋 중 하나, 셋 외의 것 | `[aeiou]` 모음 |
| `\\d`, `\\s`, `\\w` | 숫자, 공백, 단어 문자 | `\\d+` |
| `\\D`, `\\S`, `\\W` | 위의 반대 | |
| `?`, `+`, `*` | 0~1번, 1번 이상, 0번 이상 | `colou?r` |
| `{n}`, `{n,}`, `{n,m}` | 정확히 n번, n번 이상, n~m번 | `\\d{3}` |
| `a\|b` | a 또는 b | `apple\|pear` |
| `(...)` | 묶기, 그룹 캡처 | `(ab)+` |
| `\\1` | 첫 번째 그룹과 같은 문자열 | `(.)\\1` 같은 글자 반복 |
| `\\.` | 특수문자 자체 | 마침표 |

R 문자열 안에서는 역슬래시 자체를 `\\`로 써야 해서, 정규표현식 `\d`는 `"\\d"`, 마침표 문자 `\.`는 `"\\."`가 된다. 역슬래시가 많아지면 raw 문자열 `r"(\d+\.\d+)"`이 편하다.

```r
str_view(fruit, "^a")          # a로 시작
str_view(fruit, "a$")          # a로 끝남
str_view(words, "^[^aeiou]+$") # 모음이 하나도 없는 단어
str_view(fruit, "(..)\\1")     # 두 글자가 연속으로 반복 (banana, coconut ...)
```

### 탐지와 개수

```r
str_detect(c("a", "b", "c"), "[aeiou]")          # TRUE FALSE FALSE

# 데이터 프레임에서는 filter와 함께
tibble(word = words) |> filter(str_detect(word, "x$"))

# x로 끝나는 단어의 비율, 단어별 모음 개수
mean(str_detect(words, "x$"))
tibble(word = words) |>
  mutate(vowels = str_count(word, "[aeiou]"), consonants = str_count(word, "[^aeiou]"))
```

### 추출

```r
colours <- c("red", "orange", "yellow", "green", "blue", "purple")
colour_match <- str_c("\\b(", str_flatten(colours, "|"), ")\\b")

has_colour <- sentences |> str_subset(colour_match)
has_colour |> str_extract(colour_match)           # 첫 번째 일치만
has_colour |> str_extract_all(colour_match)       # 모두 (리스트)

# 그룹 캡처: 관사 다음 단어 꺼내기
noun <- "(a|the) ([^ ]+)"
sentences |> str_subset(noun) |> head(5) |> str_match(noun)
```

`str_match()`는 전체 일치와 각 그룹을 행렬 열로 돌려준다. 데이터 프레임 열이라면 `separate_wider_regex()`가 더 편하다.

```r
tibble(sentence = sentences) |>
  filter(str_detect(sentence, "\\b(a|the) ")) |>
  separate_wider_regex(
    sentence,
    patterns = c(".*?\\b", article = "(?:a|the)", " ", noun = "[^ .]+", ".*")
  ) |>
  head()
```

### 치환과 분할

```r
x <- c("apple", "pear", "banana")
str_replace(x, "[aeiou]", "-")      # 첫 번째만
str_replace_all(x, "[aeiou]", "-")  # 모두
str_remove_all(x, "[aeiou]")        # 지우기

# 여러 패턴을 한 번에
c("1 house", "2 cars", "3 people") |>
  str_replace_all(c("1" = "one", "2" = "two", "3" = "three"))

# 그룹 순서 바꾸기: 둘째·셋째 단어 자리 바꾸기
sentences |> str_replace("(\\w+) (\\w+) (\\w+)", "\\1 \\3 \\2") |> head(3)

# 나누기
"a,b,,c" |> str_split(",")
sentences |> head(3) |> str_split(" ", simplify = TRUE)
```

### 실무 패턴

```r
x <- c("Price: $1,234.50", "Call 010-1234-5678", "  extra   spaces  ")

parse_number(x[1])                               # 1234.5 (숫자는 parse_number가 간편)
str_extract(x[2], "\\d{3}-\\d{4}-\\d{4}")         # 전화번호
str_squish(x[3])                                 # 앞뒤 공백 제거 + 중복 공백 하나로
str_detect(c("Banana", "banana"), regex("banana", ignore_case = TRUE))
```

## 자주 하는 실수

| 증상 | 원인과 해결 |
|---|---|
| `str_detect(x, ".")`가 모두 TRUE | `.`은 아무 문자. 마침표는 `"\\."` 또는 `fixed(".")` |
| 에러: `'\d' is an unrecognized escape` | R 문자열에서는 `"\\d"`. 또는 `r"(\d)"` |
| `str_replace`가 하나만 바꿈 | 모두 바꾸려면 `str_replace_all` |
| `str_split` 결과를 열로 못 씀 | 리스트를 돌려준다. `simplify = TRUE`나 `separate_wider_delim()` |
| 대소문자 때문에 놓침 | `regex(pattern, ignore_case = TRUE)` 또는 먼저 `str_to_lower` |
| `str_c` 결과가 NA | 입력에 NA가 있다. `str_replace_na()`나 `str_glue()` |

## 요약

| 하고 싶은 것 | 코드 |
|---|---|
| 포함 여부로 거르기 | `filter(str_detect(x, "pat"))` |
| 패턴 개수 | `str_count(x, "[aeiou]")` |
| 일부 꺼내기 | `str_extract(x, "\\d+")`, 그룹은 `str_match()` |
| 바꾸기 | `str_replace_all(x, "pat", "new")` |
| 지우기 | `str_remove_all(x, "pat")` |
| 숫자만 | `parse_number(x)` |
| 공백 정리 | `str_squish(x)` |
| 열로 나누기 | `separate_wider_delim()`, `separate_wider_regex()` |
| 패턴 테스트 | `str_view(x, "pat")` |

## 참고자료

- *R for Data Science* (2nd ed.): [14 Strings](https://r4ds.hadley.nz/strings.html), [15 Regular expressions](https://r4ds.hadley.nz/regexps.html)
- [stringr 공식 문서와 치트시트](https://stringr.tidyverse.org/)

다음 글: [R4DS - factor 다루기](/posts/r4ds-factor)
