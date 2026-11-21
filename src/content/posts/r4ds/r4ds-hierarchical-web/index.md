---
title: 'R4DS - 계층형 자료와 웹 스크래핑'
published: 2022-08-23
draft: false
description: '리스트 열, unnest_wider와 unnest_longer로 중첩 리스트 펴기, JSON 읽기, rvest의 CSS 선택자로 HTML에서 표와 텍스트 뽑기, API와 스크래핑의 차이와 윤리를 repurrrsive 자료와 정적 HTML 예시로 정리'
series: 'R for Data Science'
seriesOrder: 12
tags: ['데이터 분석', 'R']
---

지금까지 다룬 자료는 행과 열이 있는 직사각형이었다. 웹 API가 돌려주는 JSON이나 웹 페이지의 HTML은 안에 리스트가 들어 있는 **계층형** 자료다. R4DS(2판) Hierarchical data, Web scraping 장을 따라 이런 자료를 tidy한 데이터 프레임으로 펴는 방법을 정리한다. 외부 사이트는 호출하지 않고, repurrrsive 패키지에 저장된 API 응답과 문자열로 만든 HTML을 쓴다.

```r title="환경 설정"
library(tidyverse)
library(repurrrsive)
library(jsonlite)
library(rvest)
```

## 1. 리스트와 리스트 열

리스트는 길이와 종류가 다른 원소를 담을 수 있고, 리스트 안에 리스트를 넣을 수 있다. `str()`로 구조를 본다.

```r
x <- list(a = 1:2, b = list(c = "x", d = list(e = TRUE)))
str(x)
```

```text
List of 2
 $ a: int [1:2] 1 2
 $ b:List of 2
  ..$ c: chr "x"
  ..$ d:List of 1
  .. ..$ e: logi TRUE
```

데이터 프레임의 열도 리스트일 수 있다. 이를 **리스트 열**이라 한다. tibble은 리스트 열을 원소의 종류와 길이로 요약해 보여 준다.

```r
df <- tibble(
  id = 1:2,
  info = list(
    list(name = "kim", age = 30),
    list(name = "lee", age = 25, city = "Seoul")
  )
)
df
```

```text
# A tibble: 2 × 2
     id info            
  <int> <list>          
1     1 <named list [2]>
2     2 <named list [3]>
```

## 2. unnest_wider와 unnest_longer

리스트 열을 펴는 함수는 두 가지다. 원소에 **이름이 있으면** 이름마다 열을 만드는 `unnest_wider()`를, **이름이 없으면** 원소마다 행을 만드는 `unnest_longer()`를 쓴다.

```r
df |> unnest_wider(info)
```

```text
# A tibble: 2 × 4
     id name    age city 
  <int> <chr> <dbl> <chr>
1     1 kim      30 <NA> 
2     2 lee      25 Seoul
```

`kim`에는 `city`가 없으므로 `NA`가 들어간다. 이름 없는 원소는 행으로 편다.

```r
df2 <- tibble(
  id = 1:3,
  scores = list(c(90, 85), 70, numeric())
)
df2 |> unnest_longer(scores)
df2 |> unnest_longer(scores, keep_empty = TRUE)
```

```text
# A tibble: 3 × 2
     id scores
  <int>  <dbl>
1     1     90
2     1     85
3     2     70
# A tibble: 4 × 2
     id scores
  <int>  <dbl>
1     1     90
2     1     85
3     2     70
4     3     NA
```

원소가 없는 행(`id = 3`)은 기본으로 사라진다. 남기려면 `keep_empty = TRUE`를 준다. 원소의 위치가 필요하면 `indices_include = TRUE`를 준다.

## 3. 사례: GitHub 저장소 자료

`gh_repos`는 GitHub API가 돌려준 저장소 정보를 리스트로 저장한 것이다. 사용자 6명 각각의 저장소 목록이 들어 있다.

```r
repos <- tibble(json = gh_repos)
repos
```

```text
# A tibble: 6 × 1
  json       
  <list>     
1 <list [30]>
2 <list [30]>
3 <list [30]>
4 <list [26]>
5 <list [30]>
6 <list [30]>
```

바깥 리스트의 원소(사용자별 저장소 목록)에는 이름이 없으므로 먼저 `unnest_longer()`로 저장소마다 행을 만든다. 각 저장소는 이름 있는 리스트(필드 68개)이므로 `unnest_wider()`로 편다.

```r
repos |>
  unnest_longer(json) |>
  unnest_wider(json) |>
  select(id, full_name, owner, description, stargazers_count)
```

```text
# A tibble: 176 × 5
         id full_name               owner        description    stargazers_count
      <int> <chr>                   <list>       <chr>                     <int>
 1 61160198 gaborcsardi/after       <named list> Run Code in t…                5
 2 40500181 gaborcsardi/argufy      <named list> Declarative f…               19
 3 36442442 gaborcsardi/ask         <named list> Friendly CLI …                5
 4 34924886 gaborcsardi/baseimports <named list> Do we get war…                0
 5 61620661 gaborcsardi/citest      <named list> Test R packag…                0
 6 33907457 gaborcsardi/clisymbols  <named list> Unicode symbo…               18
 7 37236467 gaborcsardi/cmaker      <named list> port of cmake…                0
 8 67959624 gaborcsardi/cmark       <named list> CommonMark pa…                0
 9 63152619 gaborcsardi/conditions  <named list> <NA>                          0
10 24343686 gaborcsardi/crayon      <named list> R package for…               52
# ℹ 166 more rows
```

`owner`는 다시 이름 있는 리스트다. 같은 방법을 한 번 더 쓴다. 바깥에 이미 `id` 열이 있으므로 `names_sep`으로 열 이름에 접두어를 붙여 겹치지 않게 한다.

```r
repos |>
  unnest_longer(json) |>
  unnest_wider(json) |>
  select(full_name, owner, stargazers_count) |>
  unnest_wider(owner, names_sep = "_") |>
  select(full_name, owner_login, stargazers_count) |>
  arrange(desc(stargazers_count)) |>
  head(5)
```

```text
# A tibble: 5 × 3
  full_name                      owner_login stargazers_count
  <chr>                          <chr>                  <int>
1 jtleek/datasharing             jtleek                  3558
2 jtleek/dataanalysis            jtleek                   616
3 juliasilge/tidytext            juliasilge               265
4 jtleek/genomicspapers          jtleek                   211
5 jtleek/capitalIn21stCenturyinR jtleek                   186
```

계층형 자료를 펼 때는 `unnest_*`를 한 번에 하나씩 적용하며 결과를 확인한다. 자료가 깊으면 필요한 열만 남긴 뒤 다음 단계로 간다.

## 4. JSON

JSON은 웹 API가 가장 많이 쓰는 형식이다. 구조는 R의 리스트와 거의 같다.

| JSON | R |
|---|---|
| 문자열 `"a"`, 수 `1`, `true`, `null` | 길이 1 벡터, `NULL` |
| 배열 `[1, 2]` | 이름 없는 리스트 |
| 객체 `{"x": 1}` | 이름 있는 리스트 |

jsonlite의 `parse_json()`은 문자열을, `read_json()`은 파일을 리스트로 읽는다.

```r
json <- '[
  {"name": "kim", "langs": ["R", "SQL"]},
  {"name": "lee", "langs": ["Python"]}
]'

tibble(json = parse_json(json)) |>
  unnest_wider(json) |>
  unnest_longer(langs)
```

```text
# A tibble: 3 × 2
  name  langs 
  <chr> <chr> 
1 kim   R     
2 kim   SQL   
3 lee   Python
```

`fromJSON()`은 배열을 가능하면 벡터나 데이터 프레임으로 **알아서** 단순화한다. 구조가 단순하면 편하지만, 구조가 예상과 다르면 결과 모양도 바뀐다. R4DS는 `parse_json()`으로 리스트를 받은 뒤 `unnest_*`로 직접 펴는 방법을 권한다.

## 5. 웹 스크래핑: rvest

API가 없으면 웹 페이지의 HTML에서 직접 값을 뽑는다. HTML은 여는 태그와 닫는 태그로 요소를 감싸고, 요소에 `class`나 `id` 속성을 붙인다.

```r
html <- minimal_html('
  <h1>도서 목록</h1>
  <ul>
    <li class="book"><b>R4DS</b> <span class="price">30000</span></li>
    <li class="book"><b>Advanced R</b> <span class="price">35000</span></li>
    <li class="book"><b>ggplot2</b></li>
  </ul>
  <table>
    <tr><th>저자</th><th>책 수</th></tr>
    <tr><td>Wickham</td><td>5</td></tr>
    <tr><td>Bryan</td><td>2</td></tr>
  </table>
')
```

`minimal_html()`은 문자열을 HTML 문서로 읽는다. 실제 페이지는 `read_html(url)`로 읽는다. 요소는 **CSS 선택자**로 고른다.

| 선택자 | 고르는 요소 |
|---|---|
| `p` | 모든 `<p>` 태그 |
| `.price` | `class="price"`인 요소 |
| `#title` | `id="title"`인 요소 |
| `li b` | `<li>` 안에 있는 `<b>` |
| `li > b` | `<li>`의 바로 아래 자식인 `<b>` |

`html_elements()`는 일치하는 요소를 모두, `html_element()`는 각 요소 안에서 **하나씩** 고른다. 이 차이가 중요하다.

```r
books <- html |> html_elements("li.book")

tibble(
  title = books |> html_element("b") |> html_text2(),
  price = books |> html_element(".price") |> html_text2() |> parse_number()
)

html |> html_elements(".price") |> html_text2()
```

```text
# A tibble: 3 × 2
  title      price
  <chr>      <dbl>
1 R4DS       30000
2 Advanced R 35000
3 ggplot2       NA
[1] "30000" "35000"
```

`li.book`마다 `html_element()`를 쓰면 가격이 없는 `ggplot2`에는 `NA`가 들어가 행이 맞는다. 처음부터 `html_elements(".price")`로 모으면 값이 두 개뿐이라 어느 책의 가격인지 알 수 없다. 반복되는 단위(여기서는 `li`)를 먼저 고르고 그 안에서 값을 하나씩 뽑는다.

표는 `html_table()`로 바로 데이터 프레임이 된다.

```r
html |> html_element("table") |> html_table()
```

```text
# A tibble: 2 × 2
  저자    `책 수`
  <chr>     <int>
1 Wickham       5
2 Bryan         2
```

속성 값(링크 주소 등)은 `html_attr("href")`로 뽑는다. 자바스크립트가 나중에 내용을 채우는 페이지는 `read_html()`이 받은 HTML에 값이 없다. 이럴 때는 브라우저 개발자 도구에서 페이지가 호출하는 API를 찾거나 `read_html_live()`를 쓴다.

## 6. 비교

| | `unnest_wider()` | `unnest_longer()` |
|---|---|---|
| 원소 | 이름 있는 리스트 | 이름 없는 리스트 (벡터) |
| 결과 | 이름마다 열 추가 | 원소마다 행 추가 |
| 없는 원소 | `NA` 열 값 | 행이 사라짐 (`keep_empty = TRUE`로 유지) |
| 예 | 저장소의 필드, `owner` | 사용자별 저장소 목록, 언어 목록 |

| | API | 스크래핑 |
|---|---|---|
| 받는 것 | JSON 같은 구조화된 자료 | 화면용 HTML |
| 안정성 | 형식이 문서화되고 잘 안 바뀜 | 페이지 디자인이 바뀌면 코드가 깨짐 |
| 허락 | 이용 약관과 키로 명시 | 약관과 `robots.txt`를 확인해야 함 |
| 먼저 볼 것 | 있으면 항상 API | API가 없을 때 |

스크래핑할 때는 사이트의 이용 약관과 `robots.txt`를 확인하고, 요청 사이에 시간 간격을 둔다. 공개된 페이지라도 개인정보를 모아 저장하는 것은 법적 문제가 될 수 있고, 저작권이 있는 내용을 그대로 재배포하면 안 된다. 사실(숫자, 이름 목록)은 대체로 저작권 대상이 아니지만, 그 사실을 모은 데이터베이스는 보호받을 수 있다.

## 자주 하는 실수

- 이름 없는 리스트에 `unnest_wider()`를 써서 `...1`, `...2` 같은 열이 생긴다. 이름이 없으면 `unnest_longer()`다.
- 펴고 나서 열 이름이 겹친다. `names_sep`을 쓴다.
- `html_elements()`로 값을 각각 모아 길이가 맞지 않는다. 반복 단위를 먼저 고르고 `html_element()`를 쓴다.
- `html_text()`로 공백과 줄바꿈이 그대로 남는다. 화면에 보이는 대로 정리하는 `html_text2()`를 쓴다.

## 요약

| 작업 | 함수 |
|---|---|
| 구조 보기 | `str()`, `View()` |
| 이름 있는 원소를 열로 | `unnest_wider()` |
| 원소를 행으로 | `unnest_longer()` |
| JSON 읽기 | `parse_json()`, `read_json()` |
| HTML 읽기 | `read_html()`, `minimal_html()` |
| 요소 고르기 | `html_elements()`, `html_element()` + CSS 선택자 |
| 값 뽑기 | `html_text2()`, `html_attr()`, `html_table()` |

## 참고자료

- [R for Data Science (2e) - Hierarchical data](https://r4ds.hadley.nz/rectangling)
- [R for Data Science (2e) - Web scraping](https://r4ds.hadley.nz/webscraping)

다음 글: [R4DS - 함수 작성하기](/posts/r4ds-functions)
