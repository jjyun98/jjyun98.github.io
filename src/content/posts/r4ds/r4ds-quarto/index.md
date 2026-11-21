---
title: 'R4DS - Quarto로 분석 보고서 쓰기'
published: 2022-08-29
draft: false
description: 'Quarto 문서의 구조(YAML, 마크다운, 코드 청크), 청크 옵션, 인라인 코드, 표와 그림, HTML·PDF·Revealjs 출력 형식, R Markdown과의 차이를 짧은 분석 보고서 예시로 정리'
series: 'R for Data Science'
seriesOrder: 16
tags: ['데이터 분석', 'R']
---

분석 결과는 결국 누군가에게 전달해야 한다. 코드를 돌리고 그림을 복사해 문서에 붙이면, 자료가 바뀔 때마다 처음부터 다시 해야 하고 어느 숫자가 어느 코드에서 나왔는지 잃어버린다. **Quarto**는 글, 코드, 결과를 한 파일(`.qmd`)에 담고 렌더할 때 코드를 다시 실행해 문서를 만든다. R4DS(2판) Quarto, Quarto formats 장을 따라 정리한다.

## 1. 문서의 세 부분

`.qmd` 파일은 세 부분으로 이루어진다.

````markdown
---
title: "다이아몬드 크기와 가격"
author: "홍길동"
date: today
format: html
---

```{r}
#| label: setup
#| include: false
library(tidyverse)
smaller <- diamonds |> filter(carat <= 2.5)
```

## 개요

자료에는 다이아몬드 `r nrow(diamonds)`개가 있다. 그중 2.5캐럿 이하는
`r nrow(smaller)`개이고, 나머지 `r nrow(diamonds) - nrow(smaller)`개는 제외했다.

```{r}
#| label: fig-carat
#| fig-cap: "2.5캐럿 이하 다이아몬드의 캐럿 분포"
#| echo: false
ggplot(smaller, aes(x = carat)) +
  geom_freqpoly(binwidth = 0.01)
```
````

| 부분 | 쓰는 곳 | 역할 |
|---|---|---|
| YAML 헤더 | 맨 위 `---` 사이 | 제목, 작성자, 출력 형식 같은 문서 전체 설정 |
| 마크다운 본문 | 나머지 | `##` 제목, `**굵게**`, 목록, 링크, 수식 `$...$` |
| 코드 청크 | ```` ```{r} ```` 와 ```` ``` ```` 사이 | 실행할 코드. 결과가 문서에 들어감 |

RStudio나 VS Code에서 Render(명령줄에서는 `quarto render report.qmd`)를 누르면 Quarto가 코드를 knitr로 실행해 결과를 넣은 마크다운을 만들고, pandoc이 이를 HTML이나 PDF로 바꾼다.

렌더는 **새 R 세션**에서 위에서 아래로 실행한다. 콘솔에서 미리 만들어 둔 변수에 기대면 렌더가 실패한다. 이것이 Quarto가 재현성을 보장하는 방식이다.

## 2. 청크 옵션

청크 맨 위에 `#|`로 시작하는 줄로 옵션을 준다.

| 옵션 | 코드 실행 | 코드 표시 | 결과 표시 | 쓰는 곳 |
|---|---|---|---|---|
| `eval: false` | 안 함 | 함 | 없음 | 예시 코드만 보여 줄 때 |
| `include: false` | 함 | 안 함 | 안 함 | 패키지 불러오기, 준비 작업 |
| `echo: false` | 함 | 안 함 | 함 | 코드를 볼 필요 없는 독자용 보고서 |
| `message: false`, `warning: false` | 함 | 함 | 메시지·경고만 숨김 | 패키지 시작 메시지 |
| `error: true` | 함 | 함 | 오류를 보여 주고 계속 렌더 | 오류를 설명하는 문서 |
| `results: hide` | 함 | 함 | 출력만 숨김 | |
| `fig-show: hide` | 함 | 함 | 그림만 숨김 | |

`label`은 청크 이름이다. `fig-`로 시작하면 그림으로, `tbl-`로 시작하면 표로 번호가 붙고 본문에서 `@fig-carat`처럼 참조할 수 있다.

문서 전체에 같은 옵션을 주려면 YAML에 쓴다.

```yaml
execute:
  echo: false
  warning: false
```

## 3. 인라인 코드

본문의 `` `r 식` ``은 렌더할 때 값으로 바뀐다. 위 예에서 "다이아몬드 `r nrow(diamonds)`개"는 "다이아몬드 53940개"가 된다. 자료가 바뀌면 숫자도 같이 바뀌므로 본문에 손으로 숫자를 적지 않는다.

큰 수나 소수는 읽기 좋게 다듬어 넣는다.

```r norun
comma <- function(x) format(x, digits = 2, big.mark = ",")
comma(3452345)    # "3,452,345"
comma(0.12358124) # "0.12"
```

본문에는 `` `r comma(nrow(diamonds))` ``처럼 쓴다.

## 4. 표와 그림

데이터 프레임을 그냥 출력하면 콘솔 모양 그대로 들어간다. 보고서용 표는 `knitr::kable()`이나 gt 패키지로 만든다.

````markdown
```{r}
#| label: tbl-cut
#| tbl-cap: "cut 등급별 가격"
diamonds |>
  group_by(cut) |>
  summarise(n = n(), median_price = median(price)) |>
  knitr::kable()
```
````

그림 크기는 `fig-width`, `fig-height`(인치)로 정하고, 문서 안에서 보이는 폭은 `out-width`로 정한다. 그림의 가로세로 비율을 `fig-asp: 0.618`로 고정하고 `out-width: "70%"`처럼 폭만 바꾸면 그림마다 글자 크기가 일정해진다.

계산이 오래 걸리는 청크는 `cache: true`로 결과를 저장한다. 청크 코드가 바뀌면 다시 계산하지만, 청크가 읽는 파일이 바뀐 것은 모르므로 그럴 때는 캐시를 지우고 렌더한다.

## 5. 출력 형식

같은 `.qmd`를 YAML의 `format`만 바꿔 여러 형식으로 만든다.

```yaml
format:
  html:
    toc: true
    code-fold: true
  pdf: default
  docx: default
```

| 형식 | `format` | 필요한 것 | 쓰는 곳 |
|---|---|---|---|
| HTML 문서 | `html` | 없음 | 기본. 접는 코드, 대화형 그림 |
| PDF | `pdf` | LaTeX (`quarto install tinytex`) | 인쇄, 제출용 |
| Word | `docx` | 없음 | 동료가 고쳐 쓸 문서 |
| 발표 | `revealjs` | 없음 | 웹 브라우저 슬라이드 |
| 대시보드 | `dashboard` | 없음 | 그림·숫자 카드 배치 |
| 웹사이트, 책 | 프로젝트(`_quarto.yml`) | 없음 | 여러 문서를 묶어 사이트로 |

`revealjs`에서는 `##` 제목 하나가 슬라이드 하나가 된다. 대화형 HTML이 필요하면 htmlwidgets(leaflet, plotly)나 Shiny를 쓴다.

## 6. 비교

| | R Markdown (`.Rmd`) | Quarto (`.qmd`) |
|---|---|---|
| 렌더 도구 | R 패키지 rmarkdown | 독립 프로그램 quarto (R 없이도 설치) |
| 언어 | 주로 R | R, Python, Julia, Observable |
| 청크 옵션 | ```` ```{r, echo=FALSE} ```` | `#| echo: false` |
| 출력 형식 확장 | 형식마다 별도 패키지 (bookdown, xaringan, blogdown) | 내장 (`book`, `revealjs`, `website`) |
| 상호 호환 | | `.Rmd`도 대부분 그대로 렌더 |

R Markdown은 계속 유지되지만 새 기능은 Quarto에 들어간다. 새로 시작하는 문서는 Quarto로 쓴다.

| | 콘솔·스크립트 | Quarto 문서 |
|---|---|---|
| 결과 | 그때그때 확인하고 사라짐 | 글과 함께 파일로 남음 |
| 재현 | 실행 순서에 따라 결과가 달라질 수 있음 | 매번 새 세션에서 위에서 아래로 |
| 쓰는 때 | 탐색, 함수 작성 | 결과 전달, 분석 기록 |

## 자주 하는 실수

- 콘솔에서 만든 변수에 기대어 렌더가 실패한다. 필요한 것은 모두 문서 안에서 만든다.
- `setwd()`를 쓰거나 절대 경로로 파일을 읽어 다른 컴퓨터에서 렌더되지 않는다. 프로젝트 기준 상대 경로를 쓴다.
- 본문에 숫자를 손으로 적어 자료가 바뀐 뒤 코드 결과와 어긋난다. 인라인 코드를 쓴다.
- `cache: true`를 쓰고 입력 파일이 바뀐 것을 잊는다.

## 요약

| 요소 | 핵심 |
|---|---|
| YAML | 문서 설정, `format`으로 출력 형식 |
| 청크 | `#|` 옵션, `echo`·`include`·`eval`로 보일 것을 정함 |
| 인라인 코드 | `` `r 식` ``으로 본문 숫자를 코드에서 |
| 표·그림 | `tbl-`, `fig-` 라벨로 번호와 참조 |
| 형식 | HTML, PDF, Word, revealjs를 같은 소스로 |

## 참고자료

- [R for Data Science (2e) - Quarto](https://r4ds.hadley.nz/quarto)
- [R for Data Science (2e) - Quarto formats](https://r4ds.hadley.nz/quarto-formats)
- [Quarto 공식 문서](https://quarto.org/docs/guide/)

다음 글: [R4DS - 모델링 기초: lm과 broom](/posts/r4ds-modeling)
