---
title: 'R4DS - ggplot2로 시각화하기'
published: 2022-07-01
draft: false
description: 'ggplot2 레이어 문법의 뼈대인 aes, geom, facet, stat, position, coord를 실습 코드와 비교 그래프로 정리'
series: 'R for Data Science'
tags: ['R', 'tidyverse', 'ggplot2', '시각화']
---

R for Data Science(2판)의 시각화 장을 실습하며 정리했다. ggplot2의 레이어 문법 중 그래프의 뼈대가 되는 aes, geom, facet, stat, position, coord를 다룬다. 라벨, 스케일, 테마로 그래프를 다듬는 내용은 다음 글에서 이어진다. 데이터는 ggplot2에 들어 있는 `mpg`(차종별 연비)와 `diamonds`를 쓴다.

```r title="환경 설정"
library(tidyverse)
library(patchwork)   # 그래프 여러 장을 나란히 배치

theme_set(theme_minimal(base_size = 12))
```

## 레이어 문법 한눈에 보기

ggplot2 그래프는 레이어를 `+`로 쌓아 만든다. 아래 템플릿에서 필요한 부분만 골라 쓴다.

![ggplot2의 레이어 구성](./figures/fig-ggplot-layers.svg)

```r norun
ggplot(data = <DATA>, mapping = aes(<MAPPINGS>)) +
  <GEOM_FUNCTION>(mapping = aes(<MAPPINGS>), stat = <STAT>, position = <POSITION>) +
  <COORDINATE_FUNCTION> +
  <FACET_FUNCTION>
```

| 레이어 | 하는 일 | 자주 쓰는 함수 |
|---|---|---|
| aes | 변수를 위치, 색, 크기, 모양에 연결 | `aes(x, y, color, fill, size, shape, alpha)` |
| geom | 데이터를 그릴 도형 | `geom_point`, `geom_line`, `geom_bar`, `geom_col`, `geom_histogram`, `geom_boxplot`, `geom_smooth` |
| facet | 범주별로 작은 그래프 여러 개 | `facet_wrap(~ x)`, `facet_grid(rows ~ cols)` |
| stat | 그리기 전에 하는 통계 변환 | `after_stat(prop)`, `stat_summary` |
| position | 겹치는 도형의 배치 | `"stack"`, `"fill"`, `"dodge"`, `"jitter"` |
| coord | 좌표계 | `coord_cartesian`, `coord_quickmap`, `coord_polar` |

## 1. 어떤 그래프를 그릴까

변수의 개수와 종류가 정해지면 쓸 geom이 거의 정해진다.

| 보고 싶은 것 | 변수 | geom |
|---|---|---|
| 분포 | 범주형 1개 | `geom_bar` |
| 분포 | 연속형 1개 | `geom_histogram`, `geom_density`, `geom_freqpoly` |
| 관계 | 연속형 × 연속형 | `geom_point`, 많으면 `geom_bin_2d` / `geom_hex` |
| 관계 | 범주형 × 연속형 | `geom_boxplot`, `geom_violin`, 그룹별 `geom_density` |
| 관계 | 범주형 × 범주형 | `geom_count`, `geom_tile` (개수를 색으로) |
| 변화 | 시간 × 연속형 | `geom_line` |

```r w=9 h=6
p1 <- ggplot(mpg, aes(x = displ, y = hwy)) + geom_point() + ggtitle("연속 × 연속: geom_point")
p2 <- ggplot(mpg, aes(x = hwy, y = drv)) + geom_boxplot() + ggtitle("범주 × 연속: geom_boxplot")
p3 <- ggplot(mpg, aes(x = class)) + geom_bar() + ggtitle("범주 하나: geom_bar")
p4 <- ggplot(mpg, aes(x = hwy)) + geom_histogram(binwidth = 2) + ggtitle("연속 하나: geom_histogram")
(p1 + p2) / (p3 + p4)
```

![변수 종류별 대표 geom 네 가지](./images/ggplot2-01.png)

분포와 두 변수 관계를 실제 분석에 쓰는 방법은 [EDA 글](/posts/r4ds-eda)에서 자세히 다룬다.

## 2. aes: 변수를 시각 속성에 연결하기

### 색으로 그룹 구분하기

```r
ggplot(mpg, aes(x = displ, y = hwy, color = class)) +
  geom_point()
```

![차종별 색으로 구분한 배기량과 연비](./images/ggplot2-02.png)

배기량이 크면 연비가 낮은데, 2seater(스포츠카)만 배기량이 큰데도 연비가 높은 예외라는 것이 색으로 드러난다.

### 시각 속성마다 어울리는 변수

```r
ggplot(mpg, aes(x = displ, y = hwy, size = cty, shape = drv)) +
  geom_point(alpha = 0.6)
```

![도시 연비를 크기로, 구동 방식을 모양으로 표현](./images/ggplot2-03.png)

| 속성 | 어울리는 변수 | 주의 |
|---|---|---|
| `color` | 범주형, 연속형 모두 | 범주가 많으면 구분이 어렵다 |
| `size` | 연속형 | 범주형에 쓰면 경고가 난다 |
| `shape` | 범주 6개 이하 | 7번째 범주부터는 그려지지 않는다 |
| `alpha` | 연속형, 또는 고정값으로 겹침 완화 | 범주형에 쓰면 경고가 난다 |

### aes 안과 밖

```r w=9 h=3.5
p_in  <- ggplot(mpg, aes(x = displ, y = hwy)) + geom_point(aes(color = "blue")) + ggtitle('aes(color = "blue")')
p_out <- ggplot(mpg, aes(x = displ, y = hwy)) + geom_point(color = "blue") + ggtitle('color = "blue"')
p_in + p_out
```

![aes 안에 고정값을 넣은 경우와 밖에 넣은 경우](./images/ggplot2-04.png)

`aes()` 안의 값은 **변수**로 취급된다. 그래서 왼쪽은 "blue"라는 범주 하나가 생겨 기본 색(빨강)과 범례가 붙는다. 모든 점에 같은 색을 주려면 오른쪽처럼 `aes()` 밖에 쓴다.

## 3. geom: 무엇으로 그릴지

### 전역 aes와 레이어 aes

`ggplot()`의 `aes()`는 모든 레이어에, 레이어 안의 `aes()`는 그 레이어에만 적용된다.

```r
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth()
```

![점은 차종별 색, 추세선은 전체 데이터 기준](./images/ggplot2-05.png)

점은 차종별로 색이 다르지만 추세선은 전체 데이터로 하나만 그려진다. 회색 띠는 신뢰구간이다.

### 그룹별 추세선, 일부만 강조

```r w=9 h=3.5
p1 <- ggplot(mpg, aes(x = displ, y = hwy, color = drv)) +
  geom_point() +
  geom_smooth(aes(linetype = drv), se = FALSE) +
  ggtitle("그룹별 추세선")
p2 <- ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point(color = "grey60") +
  geom_point(data = filter(mpg, class == "2seater"), color = "red") +
  geom_smooth(data = filter(mpg, class == "subcompact"), se = FALSE) +
  ggtitle("레이어마다 다른 data")
p1 + p2
```

![구동 방식별 추세선과 일부 그룹만 강조한 그래프](./images/ggplot2-06.png)

전역 `aes()`에 `color`를 넣으면 이후 레이어(추세선 포함)가 모두 그룹별로 나뉜다. 레이어마다 `data`를 따로 줄 수도 있어서, 전체는 회색으로 깔고 관심 그룹만 강조할 때 쓴다.

## 4. facet: 범주별로 나눠 그리기

```r w=8 h=4.5
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_wrap(~ class, nrow = 2)
```

![차종별로 나눈 산점도](./images/ggplot2-07.png)

```r w=8 h=4.5
ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() +
  facet_grid(drv ~ cyl)
```

![구동 방식(행) × 실린더 수(열) 격자](./images/ggplot2-08.png)

| 함수 | 언제 |
|---|---|
| `facet_wrap(~ x)` | 범주 변수 하나, 범주가 많아 여러 줄로 감쌀 때 |
| `facet_grid(r ~ c)` | 두 범주 변수의 조합을 행과 열로 볼 때 |
| `facet_grid(r ~ .)`, `facet_grid(. ~ c)` | 한 방향으로만 나눌 때 |
| `scales = "free"` | 패널마다 축 범위를 따로 잡을 때 (패널 간 비교는 어려워진다) |

색으로 그룹을 구분하는 것과 비교하면, facet은 그룹이 많아도 겹치지 않지만 그룹 간 위치 비교는 덜 직접적이다.

## 5. stat: 그리기 전의 계산

`geom_bar()`는 행 개수를 세어 막대 높이로 쓴다. 다른 값을 쓰고 싶으면 stat을 바꾼다.

```r w=9 h=3.5
p1 <- ggplot(diamonds, aes(x = cut)) + geom_bar() + ggtitle("개수 (기본)")
p2 <- ggplot(diamonds, aes(x = cut, y = after_stat(prop), group = 1)) + geom_bar() + ggtitle("비율: after_stat(prop)")
p1 + p2
```

![개수 막대와 비율 막대](./images/ggplot2-09.png)

`group = 1`이 없으면 막대마다 따로 비율을 계산해 모두 1이 된다. 이미 집계된 값이 있으면 `geom_col(aes(x, y))`를 쓴다.

```r
ggplot(diamonds, aes(x = cut, y = depth)) +
  stat_summary(fun.min = min, fun.max = max, fun = median)
```

![cut 등급별 depth의 최솟값, 중앙값, 최댓값](./images/ggplot2-10.png)

## 6. position: 겹치는 도형 배치

### 막대: stack, fill, dodge

```r w=11 h=3.8
base <- ggplot(diamonds, aes(x = cut, fill = clarity)) +
  theme(axis.text.x = element_text(angle = 30, hjust = 1))
(base + geom_bar() + ggtitle('"stack" (기본)')) +
  (base + geom_bar(position = "fill") + ggtitle('"fill"')) +
  (base + geom_bar(position = "dodge") + ggtitle('"dodge"')) +
  plot_layout(guides = "collect")
```

![같은 데이터를 stack, fill, dodge로 비교](./images/ggplot2-11.png)

| position | 언제 쓰나 |
|---|---|
| `"stack"` | 전체 크기와 구성을 함께 볼 때 |
| `"fill"` | 그룹 안의 **비율**을 비교할 때. 높이가 모두 1이라 전체 크기 정보는 사라진다 |
| `"dodge"` | 하위 그룹의 **절댓값**을 직접 비교할 때 |

같은 데이터인데 stack에서는 등급별 **개수 차이**(Ideal이 가장 많음)가, fill에서는 등급 안의 **clarity 구성 차이**가, dodge에서는 하위 그룹끼리의 **크기 비교**가 잘 보인다. 막대 색은 `color`(테두리)가 아니라 `fill`(내부)로 준다.

### 점: jitter

```r w=9 h=3.5
p1 <- ggplot(mpg, aes(x = displ, y = hwy)) + geom_point() + ggtitle("geom_point")
p2 <- ggplot(mpg, aes(x = displ, y = hwy)) + geom_jitter(width = 0.1, height = 0.5) + ggtitle("geom_jitter")
p1 + p2
```

![겹친 점과 jitter로 흩뜨린 점](./images/ggplot2-12.png)

`hwy`와 `displ`은 반올림된 값이라 234개 중 상당수가 같은 자리에 겹친다. jitter는 위치를 조금 흔들어 실제 양을 보여준다. 대신 위치가 약간 부정확해지므로 `width`, `height`를 작게 둔다.

## 7. coord: 좌표계

### 확대는 coord_cartesian으로

```r w=9 h=3.5
p1 <- ggplot(mpg, aes(x = displ, y = hwy)) +
  geom_point() + geom_smooth() +
  coord_cartesian(xlim = c(5, 7), ylim = c(10, 30)) +
  ggtitle("coord_cartesian: 화면만 확대")
p2 <- mpg |>
  filter(displ >= 5, displ <= 7, hwy >= 10, hwy <= 30) |>
  ggplot(aes(x = displ, y = hwy)) +
  geom_point() + geom_smooth() +
  ggtitle("filter: 데이터를 자름")
p1 + p2
```

![coord_cartesian과 filter로 확대했을 때 추세선 비교](./images/ggplot2-13.png)

`filter()`나 `scale_x_continuous(limits = )`는 **잘린 데이터로** 추세선을 다시 계산한다. `coord_cartesian()`은 전체 데이터로 계산한 뒤 화면만 확대하므로 원래 추세가 유지된다.

### 지도와 극좌표

```r w=9 h=3.8
nz <- map_data("nz")   # maps 패키지 필요 (library는 하지 않아도 된다)
p1 <- ggplot(nz, aes(x = long, y = lat, group = group)) +
  geom_polygon(fill = "white", color = "black") +
  coord_quickmap() + ggtitle("coord_quickmap")
p2 <- ggplot(diamonds, aes(x = clarity, fill = clarity)) +
  geom_bar(show.legend = FALSE, width = 1) +
  coord_polar() + labs(x = NULL, y = NULL) + ggtitle("coord_polar")
p1 + p2
```

![coord_quickmap으로 그린 지도와 coord_polar 차트](./images/ggplot2-14.png)

- `coord_quickmap()`: 위도에 따른 경도 간격 차이를 반영해 지도 가로세로 비율을 맞춘다.
- `coord_polar()`: 막대를 부채꼴로 바꾼다. 각도로 크기를 비교하기는 어려워서 실제 분석에는 막대가 낫다.
- 범주 이름이 길 때 예전에는 `coord_flip()`을 썼지만, 지금은 범주를 `y`에 매핑하면 된다(`aes(x = hwy, y = class)`).

## 자주 하는 실수

| 증상 | 원인과 해결 |
|---|---|
| 다음 레이어가 무시되거나 에러 | `+`는 **줄 끝**에 둬야 한다. 줄 앞에 두면 앞 줄에서 코드가 끝난 것으로 본다 |
| 고정 색이 빨갛게 나오고 범례가 생김 | 고정값을 `aes()` 안에 넣었다. 밖에 둔다 |
| 레이어를 `\|>`로 연결해 에러 | 레이어는 `+`, 데이터 처리는 파이프 `\|>` |
| 비율 막대가 모두 1 | `after_stat(prop)`에는 `group = 1`이 필요하다 |
| 확대했더니 추세선이 바뀜 | 데이터를 자르지 말고 `coord_cartesian()`으로 확대 |
| shape 범례에서 범주 하나가 사라짐 | shape는 6개까지만 자동 지정된다 |
| 범주 순서가 알파벳순 | factor로 순서를 지정한다 ([factor 글](/posts/r4ds-factor)) |

## 요약

| 하고 싶은 것 | 코드 |
|---|---|
| 기본 산점도 | `ggplot(df, aes(x, y)) + geom_point()` |
| 그룹을 색으로 | `aes(color = g)`, 막대는 `aes(fill = g)` |
| 모든 점 같은 색 | `geom_point(color = "steelblue")` |
| 추세선 | `geom_smooth()`, 직선은 `method = "lm"`, 띠 제거는 `se = FALSE` |
| 범주별 작은 그래프 | `facet_wrap(~ g)`, `facet_grid(r ~ c)` |
| 집계된 값의 막대 | `geom_col()` |
| 비율 막대 | `geom_bar(position = "fill")`, 전체 대비 비율은 `after_stat(prop), group = 1` |
| 겹친 점 | `geom_jitter()`, `alpha = 0.3` |
| 확대 | `coord_cartesian(xlim =, ylim =)` |
| 그래프 나란히 | patchwork: `p1 + p2`, `p1 / p2`, `plot_layout(guides = "collect")` |

## 참고자료

- Hadley Wickham, Mine Çetinkaya-Rundel, Garrett Grolemund, *R for Data Science* (2nd ed.): [1 Data visualization](https://r4ds.hadley.nz/data-visualize.html), [9 Layers](https://r4ds.hadley.nz/layers.html)
- [ggplot2 공식 문서](https://ggplot2.tidyverse.org/), [patchwork](https://patchwork.data-imaginist.com/)

다음 글: [R4DS - 그래프 다듬기: 라벨, 스케일, 테마](/posts/r4ds-communication)
