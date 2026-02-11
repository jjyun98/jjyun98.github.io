---
title: 'String과 정규표현식 정리'
published: 2022-08-21
draft: false
description: "R stringr 패키지 문법 정리. str_length, str_detect, str_extract, str_replace 등 문자열 처리 방법을 예제와 함께 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

> 참고 자료: [stringr 공식 문서](https://stringr.tidyverse.org/) | [Regular Expressions in R](https://www.regular-expressions.info/)

## 개요

문자열 처리는 데이터 분석의 핵심 기술입니다. 이 문서는 stringr 패키지의 주요 함수와 정규표현식을 다루며, 문자열 검색, 추출, 치환, 분할 기법을 다룹니다.

## 환경 설정

**필수 패키지 설치 및 로드**

```r
# 패키지 로드
library('tidyverse')   # stringr 포함
library('htmlwidgets')

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 문자열 기초 조작

**문자열 길이 측정**

```r
# 문자열 길이 (공백도 포함)
str_length(c("a", "R for data science", NA))
# [1]  1 18 NA
```

**문자열 결합**

```r
# 기본 결합
str_c("x", "y")
# [1] "xy"

# 구분자 사용
str_c("x", "y", sep = ", ")
# [1] "x, y"

# 벡터화 결합
str_c("prefix-", c("a", "b", "c"), "-suffix")
# [1] "prefix-a-suffix" "prefix-b-suffix" "prefix-c-suffix"
```

**결측값 처리**

```r
x <- c("abc", NA)

# NA는 그대로 전파
str_c("|-", x, "-|")
# [1] "|-abc-|" NA        

# NA를 "NA" 문자열로 변환
str_c("|-", str_replace_na(x), "-|")
# [1] "|-abc-|" "|-NA-|" 
```

**collapse - 벡터를 단일 문자열로**

```r
# 여러 문자열을 하나로 합치기
str_c(c("x", "y", "z"), collapse = ", ")
# [1] "x, y, z"
```

## 문자열 서브셋팅

**str_sub() - 위치 기반 추출**

```r
x <- c("Apple", "Banana", "Pear")

# 2~3번째 문자 추출
str_sub(x, 2, 3)
# [1] "pp" "an" "ea"

# 뒤에서부터 추출 (음수 인덱스)
str_sub(x, -3, -2)
# [1] "pl" "an" "ea"

# 범위를 벗어나도 오류 없음
str_sub("a", 1, 5)
# [1] "a"
```

**대소문자 변환**

```r
# 대문자 변환
str_to_upper(c("i", "I"))
# [1] "I" "I"

# 소문자 변환
str_to_lower(c("Hello", "WORLD"))
# [1] "hello" "world"

# 첫 글자만 대문자
str_to_title("hello world")
# [1] "Hello World"
```

## 정규표현식 기초

**기본 패턴 매칭**

```r
x <- c("apple", "banana", "pear")

# "an" 패턴 찾기
str_view(x, "an")
# [2] | b<an><an>a

# 임의의 문자 매칭 (.)
str_view(x, ".a.")
# [2] | <ban>ana
# [3] | p<ear>
```

**앵커 문자**

```r
x <- c("apple", "banana", "pear")

# 문자열 시작 (^)
str_view(x, "^a")
# [1] | <a>pple

# 문자열 끝 ($)
str_view(x, "a$")
# [2] | banan<a>

# 정확한 매치
x <- c("apple pie", "apple", "apple cake")
str_view(x, "^apple$")
# [2] | <apple>
```

**문자 클래스**

| 패턴 | 의미 | 예제 |
|------|------|------|
| `\d` | 임의의 숫자 | `[0-9]` |
| `\s` | 공백 문자 | 공백, 탭, 줄바꿈 |
| `[abc]` | a, b, c 중 하나 | 특정 문자 집합 |
| `[^abc]` | a, b, c 제외 | 제외 문자 집합 |
| `[a-z]` | 소문자 범위 | 알파벳 소문자 |
| `[A-Z]` | 대문자 범위 | 알파벳 대문자 |

**OR 연산자**

```r
# 'grey' 또는 'gray' 매칭
str_view(c("grey", "gray"), "gr(e|a)y")
# [1] | <grey>
# [2] | <gray>
```

## 반복 패턴

**기본 반복 지정자**

| 패턴 | 의미 | 설명 |
|------|------|------|
| `?` | 0 또는 1회 | 선택적 문자 |
| `+` | 1회 이상 | 최소 1번은 나타남 |
| `*` | 0회 이상 | 없어도 됨 |
| `{n}` | 정확히 n회 | 고정 횟수 |
| `{n,}` | n회 이상 | 최소 횟수 |
| `{n,m}` | n~m회 사이 | 범위 지정 |

**실습 예제**

```r
x <- "1888 is the longest year in Roman numerals: MNCCLXXXVIII"

# ? : 0 또는 1회
str_view(x, "CC?")
# [1] | 1888 is the longest year in Roman numerals: MN<CC><C>LXXXVIII

# + : 1회 이상
str_view(x, "CC+")
# [1] | 1888 is the longest year in Roman numerals: MN<CCC>LXXXVIII

# {2} : 정확히 2회
str_view(x, "C{2}")
# [1] | 1888 is the longest year in Roman numerals: MN<CC>CLXXXVIII

# {2,3} : 2~3회
str_view(x, "C{2,3}")
# [1] | 1888 is the longest year in Roman numerals: MN<CCC>LXXXVIII
```

**Greedy vs Non-greedy**

```r
# Greedy (기본): 가능한 긴 매치
str_view(x, "C{2,3}")
# [1] | MN<CCC>LXXXVIII

# Non-greedy: 가능한 짧은 매치 (?추가)
str_view(x, "C{2,3}?")
# [1] | MN<CC>CLXXXVIII
```

## 문자열 탐지와 검색

**str_detect() - 패턴 존재 여부**

```r
x <- c("apple", "banana", "pear")

# 'e' 포함 여부
str_detect(x, "e")
# [1]  TRUE FALSE  TRUE

# 활용 예제
# 't'로 시작하는 단어 개수
sum(str_detect(words, "^t"))
# [1] 65

# 모음으로 끝나는 단어 비율
mean(str_detect(words, "[aeiou]$"))
# [1] 0.2765306
```

**복잡한 조건 처리**

```r
# 역조건 활용 (모음이 없는 단어)
no_vowels_1 <- !str_detect(words, "[aeiou]")
no_vowels_2 <- str_detect(words, "^[^aeiou]+$")

# 결과 비교
identical(no_vowels_1, no_vowels_2)
# [1] TRUE
```

**str_subset() - 매칭 문자열 추출**

```r
# 'x'로 끝나는 단어
words[str_detect(words, "x$")]
# [1] "box" "sex" "six" "tax"

# 동일한 결과
str_subset(words, "x$")
# [1] "box" "sex" "six" "tax"
```

**str_count() - 매칭 횟수 계산**

```r
x <- c("apple", "banana", "pear")

# 'a' 문자 개수
str_count(x, "a")
# [1] 1 3 1

# 단어당 평균 모음 개수
mean(str_count(words, "[aeiou]"))
# [1] 1.991837
```

## 문자열 추출

**str_extract() - 첫 번째 매치 추출**

```r
# 색상을 포함한 문장 찾기
colors <- c("red", "orange", "yellow", "green", "blue", "purple")
color_match <- str_c(colors, collapse = "|")

# 색상 포함 문장
has_color <- str_subset(sentences, color_match)
has_color[1:3]
# [1] "Glue the sheet to the dark blue background."
# [2] "Two blue fish swam in the tank."           
# [3] "The colt reared and threw the tall rider."

# 매칭된 색상 추출
matches <- str_extract(has_color, color_match)
matches[1:3]
# [1] "blue" "blue" "red" 
```

**str_extract_all() - 모든 매치 추출**

```r
# 여러 색상이 포함된 문장
more <- sentences[str_count(sentences, color_match) > 1]
str_extract_all(more, color_match, simplify = TRUE)
#      [,1]     [,2] 
# [1,] "blue"   "red"
# [2,] "green"  "red"
# [3,] "orange" "red"
```

**str_match() - 그룹 매칭**

```r
# 관사 + 명사 패턴
noun <- "(a|the) ([^ ]+)"
has_noun <- sentences %>%
  str_subset(noun) %>%
  head(10)

# 전체 매치
str_extract(has_noun, noun)[1:3]
# [1] "the smooth" "the sheet"  "the depth" 

# 그룹별 매치
str_match(has_noun, noun)[1:3,]
#      [,1]         [,2]  [,3]     
# [1,] "the smooth" "the" "smooth" 
# [2,] "the sheet"  "the" "sheet"  
# [3,] "the depth"  "the" "depth"
```

**tibble에서 extract 활용**

```r
# tidyr::extract로 더 편리하게
tibble(sentence = sentences) %>%
  tidyr::extract(
    sentence, c("article", "noun"), "(a|the) ([^ ]+)",
    remove = FALSE
  ) %>% head(3)
#   sentence                                    article noun   
# 1 The birch canoe slid on the smooth planks.  the     smooth 
# 2 Glue the sheet to the dark blue background. the     sheet  
# 3 It's easy to tell the depth of a well.      the     depth
```

## 문자열 치환

**str_replace() - 첫 번째 매치 치환**

```r
x <- c("apple", "pear", "banana")

# 첫 번째 모음을 '-'로 치환
str_replace(x, "[aeiou]", "-")
# [1] "-pple"  "p-ar"   "b-nana"
```

**str_replace_all() - 모든 매치 치환**

```r
# 모든 모음을 '-'로 치환
str_replace_all(x, "[aeiou]", "-")
# [1] "-ppl-"  "p--r"   "b-n-n-"

# 다중 치환
x <- c("1 house", "2 cars", "3 people")
str_replace_all(x, c("1" = "one", "2" = "two", "3" = "three"))
# [1] "one house"    "two cars"     "three people"
```

**역참조를 이용한 패턴 변경**

```r
# 두 번째와 세 번째 단어 순서 바꾸기
sentences %>%
  str_replace("([^ ]+) ([^ ]+) ([^ ]+)", "\\1 \\3 \\2") %>%
  head(3)
# [1] "The canoe birch slid on the smooth planks."
# [2] "Glue sheet the to the dark blue background." 
# [3] "It's to easy tell the depth of a well."
```

## 문자열 분할

**str_split() - 패턴으로 분할**

```r
# 공백으로 분할
sentences %>%
  head(3) %>%
  str_split(" ")
# [[1]]
# [1] "The"     "birch"   "canoe"   "slid"    "on"      "the"     "smooth"  "planks."
# 
# [[2]]
# [1] "Glue"        "the"         "sheet"       "to"          "the"         "dark"       
# [7] "blue"        "background."
# 
# [[3]]
# [1] "It's"  "easy"  "to"    "tell"  "the"   "depth" "of"    "a"     "well."
```

**분할 옵션**

```r
# 행렬로 결과 반환
sentences %>%
  head(3) %>%
  str_split(" ", simplify = TRUE)
#      [,1]   [,2]    [,3]    [,4]   [,5] [,6]    [,7]     [,8]         [,9]   
# [1,] "The"  "birch" "canoe" "slid" "on" "the"   "smooth" "planks."    ""     
# [2,] "Glue" "the"   "sheet" "to"   "the" "dark" "blue"   "background." ""     
# [3,] "It's" "easy"  "to"    "tell" "the" "depth" "of"    "a"          "well."

# 분할 개수 제한
fields <- c("Name: Hadley", "Country: NZ", "Age: 35")
str_split(fields, ": ", n = 2, simplify = TRUE)
#      [,1]      [,2]    
# [1,] "Name"    "Hadley"
# [2,] "Country" "NZ"    
# [3,] "Age"     "35"
```

**boundary() - 언어학적 경계**

```r
# 단어 경계로 분할
x <- "This is a sentence."
str_extract_all(x, boundary("word"))
# [[1]]
# [1] "This"     "is"       "a"        "sentence"
```

## 고급 정규표현식 옵션

**regex() 함수 옵션**

```r
bananas <- c("banana", "Banana", "BANANA")

# 대소문자 구분 없이 매칭
str_view(bananas, regex("banana", ignore_case = TRUE))
# [1] | <banana>
# [2] | <Banana>
# [3] | <BANANA>

# 여러 줄 처리
x <- "Line 1\nLine 2\nLine 3"
str_extract_all(x, regex("^Line", multiline = TRUE))
# [[1]]
# [1] "Line" "Line" "Line"
```

**주석이 있는 정규표현식**

```r
# 전화번호 패턴 (주석 포함)
phone <- regex("
  \\(?         # 선택적인 여는 괄호
  (\\d{3})     # 지역 번호  
  [)- ]?       # 선택적인 닫는 괄호, 대시 혹은 빈칸
  (\\d{3})     # 세 자리 숫자
  [ -]?        # 선택적인 빈칸 혹은 대시
  (\\d{4})     # 네 자리 숫자
", comments = TRUE)

str_match("514-791-8141", phone)
#      [,1]          [,2]  [,3]  [,4]  
# [1,] "514-791-8141" "514" "791" "8141"
```

## 실무 활용 사례

**데이터 정제 워크플로우**

```r
# 지저분한 데이터 예제
messy_data <- c(
  "  John Doe (25)  ",
  "jane_smith@email.com (30)",
  "Bob Wilson - Age: 35",
  "MARY JOHNSON | 28 years old"
)

# 단계별 정제
clean_data <- messy_data %>%
  # 1. 공백 제거
  str_trim() %>%
  # 2. 대소문자 통일
  str_to_title() %>%
  # 3. 나이 추출
  str_extract("\\d+") %>%
  # 4. 숫자로 변환
  as.numeric()

clean_data
# [1] 25 30 35 28
```

**이메일 유효성 검사**

```r
emails <- c(
  "user@domain.com",
  "invalid.email",
  "test@example.org",
  "bad@.com"
)

# 간단한 이메일 패턴
email_pattern <- "^[\\w\\._%+-]+@[\\w\\.-]+\\.[A-Za-z]{2,}$"

# 유효한 이메일만 필터링
valid_emails <- emails[str_detect(emails, email_pattern)]
valid_emails
# [1] "user@domain.com"  "test@example.org"
```

**텍스트 통계 분석**

```r
# 텍스트 분석 함수
analyze_text <- function(text) {
  tibble(
    text = text,
    char_count = str_length(text),
    word_count = str_count(text, "\\w+"),
    sentence_count = str_count(text, "\\.|\\!|\\?"),
    avg_word_length = str_count(text, "\\w") / str_count(text, "\\w+")
  )
}

# 문장 분석
sample_text <- "Hello world! This is a test. How are you?"
analyze_text(sample_text)
#   text                               char_count word_count sentence_count avg_word_length
# 1 Hello world! This is a test. How…         39          8              3            3.62
```