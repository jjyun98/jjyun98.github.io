---
title: 'ggplot2 기초부터 고급까지 완전정복'
published: 2022-07-01
draft: false
description: "R의 ggplot2 패키지를 활용한 데이터 시각화 기초부터 고급 기법까지. aes, facet, geom, mapping, filter 등 핵심 개념을 실습 예제와 함께 체계적으로 학습하고, 라벨과 주석 추가, 스케일 커스터마이징, 테마 설정 등 전문적인 시각화 기술을 마스터합니다."
series: 'R for Data Science'
tags: ['R', 'ggplot2', 'Data Visualization', 'Advanced']
---

>  참고 자료:  
> [ggplot2 공식 문서](https://ggplot2.tidyverse.org/) | [R for Data Science](https://r4ds.had.co.nz/)

## 개요

**ggplot2**는 R에서 가장 강력하고 널리 사용되는 데이터 시각화 패키지입니다. 이번 포스팅에서는 ggplot2의 핵심 개념인 **aes(aesthetic mapping)**, **facet**, **geom**, **mapping**, **filter** 등을 실습 예제와 함께 체계적으로 알아보겠습니다.

Grammar of Graphics 철학을 바탕으로 한 ggplot2의 레이어 시스템을 이해하고, 다양한 시각화 기법을 마스터해보세요!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
# 패키지 로드
library('tidyverse')  # ggplot2 포함
library('maps')       # 지도 데이터

# 플롯 최적화 설정
options(
  repr.plot.width = 8,    # 너비 설정
  repr.plot.height = 5,   # 높이 설정  
  repr.plot.res = 150     # 해상도 설정
)

# 테마 설정 (깔끔한 스타일)
theme_set(theme_minimal(base_size = 10))
```

## 2. aes (Aesthetic Mapping) 옵션들

**aes()**는 데이터의 변수를 시각적 속성에 매핑하는 핵심 함수입니다.

### 색상 매핑 (color)

```r
ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy, color = class))
```

![color mapping example](./images/2022-07-01-ggplot1_6_0.png)

**클래스별로 다른 색상**이 자동으로 할당되어 데이터의 그룹을 쉽게 구분할 수 있습니다.

### 크기 매핑 (size)

```r
ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy, size = class))
```

![size mapping example](./images/2022-07-01-ggplot1_8_1.png)

####  주의사항
이산형 변수에 size 매핑을 사용하면 경고가 발생합니다. 연속형 변수에 사용하는 것이 좋습니다.

### 투명도 매핑 (alpha)

```r
ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy, alpha = class))
```

![alpha mapping example](./images/2022-07-01-ggplot1_10_1.png)

### 모양 매핑 (shape)

```r
ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy, shape = class))
```

![shape mapping example](./images/2022-07-01-ggplot1_12_1.png)

####  중요 팁
shape는 최대 6개의 그룹까지만 구분 가능합니다. 그 이상은 일부 데이터가 표시되지 않습니다.

### 고정 속성 설정

```r
# aes 밖에서 설정하면 모든 점에 동일하게 적용
ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), color = 'blue')
```

![fixed color example](./images/2022-07-01-ggplot1_13_0.png)

## 3. Facet (면분할) - 데이터 분할 시각화

### facet_wrap(): 단일 변수 기준 분할

```r
ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_wrap(~ class, nrow = 3)
```

![facet wrap example](./images/2022-07-01-ggplot1_17_0.png)

**차량 클래스별로 분리된 플롯**을 생성하여 각 그룹의 패턴을 개별적으로 관찰할 수 있습니다.

### facet_grid(): 두 변수 기준 격자 분할

```r
ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_grid(drv ~ cyl)
```

![facet grid example](./images/2022-07-01-ggplot1_20_0.png)

**구동 방식(drv)과 실린더 수(cyl)**의 조합으로 격자 형태의 플롯을 생성합니다.

###  데이터 탐색

```r
# 구동 방식 확인
mpg$drv %>% unique()  # "f", "4", "r"

# 실린더 수 확인  
mpg$cyl %>% unique()  # 4, 6, 8, 5
```

### 단방향 분할

```r
# 열만 분할 (행은 통합)
ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy)) +
  facet_grid(. ~ cyl)
```

![single direction facet](./images/2022-07-01-ggplot1_27_0.png)

## 4. geom (기하학적 객체) 옵션들

**geom**은 데이터를 어떤 형태로 표현할지 결정하는 핵심 요소입니다.

### geom_smooth(): 평활선 추가

```r
ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy))
```

![smooth line example](./images/2022-07-01-ggplot1_32_1.png)

**LOESS 회귀선**이 자동으로 추가되어 전체적인 트렌드를 파악할 수 있습니다.

### 라인 타입으로 그룹 구분

```r
ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy, linetype = drv))
```

![linetype example](./images/2022-07-01-ggplot1_34_1.png)

### 색상으로 그룹 구분

```r
ggplot(data = mpg) +
  geom_smooth(mapping = aes(x = displ, y = hwy, color = drv))
```

![colored smooth example](./images/2022-07-01-ggplot1_38_1.png)

### 포인트와 스무딩 결합

```r
ggplot(data = mpg) + 
  geom_point(mapping = aes(x = displ, y = hwy, color = drv)) +
  geom_smooth(mapping = aes(x = displ, y = hwy, color = drv, linetype = drv))
```

![combined plot example](./images/2022-07-01-ggplot1_40_1.png)

### geom_bar(): 막대 그래프

```r
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut))
```

![bar chart example](./images/2022-07-01-ggplot1_42_0.png)

## 5. 매핑 최적화 기법

### 전역 매핑 설정

```r
# ggplot()에서 공통 매핑 설정
ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point() +
  geom_smooth()
```

![global mapping example](./images/2022-07-01-ggplot1_45_1.png)

### 선택적 매핑 추가

```r
# 전역 매핑 + 개별 레이어 매핑
ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(mapping = aes(color = class)) +  # 포인트만 색상 구분
  geom_smooth()  # 전체 데이터로 스무딩
```

![selective mapping example](./images/2022-07-01-ggplot1_47_1.png)

## 6. 필터링 활용

### 특정 그룹만 스무딩

```r
ggplot(data = mpg, mapping = aes(x = displ, y = hwy)) +
  geom_point(mapping = aes(color = class)) +
  geom_smooth(
    data = filter(mpg, class == 'subcompact'),  # 서브컴팩트만 필터링
    se = FALSE  # 신뢰구간 제거
  )
```

![filtered smooth example](./images/2022-07-01-ggplot1_50_1.png)

## 7. 통계 변환 (Statistical Transformations)

### 사용자 정의 데이터로 막대 그래프

```r
# 커스텀 데이터 생성
demo <- tribble(
  ~cut, ~freq,
  "Fair", 1610,
  "Good", 4906,
  "Very Good", 12082,
  "Premium", 13791,
  "Ideal", 21551
)

# stat = 'identity'로 실제 값 사용
ggplot(data = demo) +
  geom_bar(mapping = aes(x = cut, y = freq), stat = 'identity')
```

![custom data bar example](./images/2022-07-01-ggplot1_58_0.png)

### 비율 표시

```r
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, y = after_stat(prop), group = 1))
```

![proportion bar example](./images/2022-07-01-ggplot1_60_1.png)

### stat_summary(): 통계 요약

```r
ggplot(data = diamonds) +
  stat_summary(
    mapping = aes(x = cut, y = depth),
    fun.min = min,    # 최솟값
    fun.max = max,    # 최댓값
    fun = median      # 중앙값
  )
```

![stat summary example](./images/2022-07-01-ggplot1_62_1.png)

## 8. 색상과 채우기 (Color vs Fill)

### color vs fill 차이점

```r
# 테두리 색상
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, color = cut))

# 내부 채우기 색상  
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, fill = cut))
```

![color vs fill example](./images/2022-07-01-ggplot1_65_0.png)

### 그룹별 적층 막대

```r
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, fill = clarity))
```

![stacked bar example](./images/2022-07-01-ggplot1_67_0.png)

## 9. 위치 조정 (Position Adjustments)

### position = 'identity': 원래 위치

```r
ggplot(data = diamonds, mapping = aes(x = cut, fill = clarity)) +
  geom_bar(alpha = 0.3, position = 'identity')
```

![position identity example](./images/2022-07-01-ggplot1_70_0.png)

### position = 'fill': 비율 비교

```r
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, fill = clarity), position = 'fill')
```

![position fill example](./images/2022-07-01-ggplot1_74_0.png)

### position = 'dodge': 나란히 배치

```r
ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, fill = clarity), position = 'dodge')
```

![position dodge example](./images/2022-07-01-ggplot1_76_0.png)

### position = 'jitter': 점 분산

```r
ggplot(data = mpg) +
  geom_point(mapping = aes(x = displ, y = hwy), position = 'jitter')
```

![jitter example](./images/2022-07-01-ggplot1_79_0.png)

**겹치는 점들을 약간 분산**시켜 데이터 밀도를 더 잘 보여줍니다.

## 10. 좌표계 변환

### coord_flip(): 축 뒤집기

```r
# 기본 박스플롯
ggplot(data = mpg, mapping = aes(x = class, y = hwy)) +
  geom_boxplot()

# 축 뒤집기  
ggplot(data = mpg, mapping = aes(x = class, y = hwy)) + 
  geom_boxplot() +
  coord_flip()
```

![coord flip example](./images/2022-07-01-ggplot1_81_0.png)

## 11. 지도 시각화

### 기본 지도 그리기

```r
# 뉴질랜드 지도 데이터
nz <- map_data('nz')

ggplot(nz, aes(long, lat, group = group)) +
  geom_polygon(fill = 'white', color = 'black')
```

![basic map example](./images/2022-07-01-ggplot1_84_0.png)

### coord_quickmap(): 비율 보정

```r
ggplot(nz, aes(long, lat, group = group)) +
  geom_polygon(fill = 'white', color = 'black') +
  coord_quickmap()  # 지도 비율 보정
```

![quickmap example](./images/2022-07-01-ggplot1_86_0.png)

## 12. 극좌표와 파이 차트

### 막대 그래프를 파이 차트로 변환

```r
# 기본 막대 그래프 설정
bar <- ggplot(data = diamonds) +
  geom_bar(mapping = aes(x = cut, fill = cut), 
           show.legend = FALSE, width = 1) +
  theme(aspect.ratio = 1) +
  labs(x = NULL, y = NULL)

# 축 뒤집기
bar + coord_flip()
```

![flipped bar example](./images/2022-07-01-ggplot1_88_0.png)

### coord_polar(): 파이 차트 생성

```r
bar + coord_polar()
```

![pie chart example](./images/2022-07-01-ggplot1_90_0.png)

##  ggplot2 활용 팁

###  효율적인 코딩 습관
1. **전역 매핑 활용**: 공통 매핑은 `ggplot()`에서 설정
2. **레이어별 특성**: 개별 레이어에만 필요한 매핑은 해당 `geom`에서 설정
3. **일관된 테마**: `theme_set()`으로 프로젝트 전체 스타일 통일

###  시각화 선택 가이드
- **관계 탐색**: `geom_point()` + `geom_smooth()`
- **분포 비교**: `geom_boxplot()`, `geom_violin()`
- **범주형 데이터**: `geom_bar()`, `geom_col()`
- **시계열 데이터**: `geom_line()`, `geom_area()`

###  색상과 스타일링
- **color**: 테두리나 선의 색상
- **fill**: 내부 채우기 색상  
- **alpha**: 투명도 (0~1)
- **position**: 요소들의 배치 방식

## 마무리

**ggplot2**는 Grammar of Graphics 철학을 바탕으로 한 강력한 시각화 도구입니다. 이번 포스팅에서 다룬 핵심 개념들을 정리하면:

- **aes()**: 데이터 변수를 시각적 속성에 매핑
- **facet**: 데이터를 그룹별로 분할하여 시각화
- **geom**: 데이터의 기하학적 표현 방식 결정  
- **position**: 요소들의 배치 방식 조정
- **coord**: 좌표계 변환으로 다양한 뷰 제공

이러한 **레이어 시스템**을 이해하고 조합하면, 단순한 산점도부터 복잡한 다변량 시각화까지 자유자재로 구현할 수 있습니다.

**실무에서는 데이터의 특성과 전달하고자 하는 메시지에 따라 적절한 geom과 aes 조합을 선택하는 것이 중요**합니다. 많은 연습을 통해 ggplot2의 문법을 체화하고, 데이터 스토리텔링의 달인이 되어보세요!

---

>  참고 자료:  
> [ggplot2 공식 문서](https://ggplot2.tidyverse.org/) | [R Graphics Cookbook](https://r-graphics.org/)

## Table of contents

## 개요

ggplot2의 **기초 문법**을 익혔다면, 이제 **고급 기법**으로 시각화의 완성도를 높일 차례입니다! 이번 포스팅에서는 **라벨과 주석 추가**, **스케일 커스터마이징**, **축과 범례 조정**, **확대/축소**, **테마 설정** 등 전문적인 데이터 시각화를 위한 핵심 기술들을 다룹니다.

단순한 플롯에서 **출판 품질의 시각화**로 한 단계 업그레이드하는 모든 노하우를 실습과 함께 배워보세요!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
library('tidyverse')  # ggplot2 포함
library('ggrepel')    # 라벨 겹침 방지
library('viridis')    # 색상 팔레트

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)
theme_set(theme_minimal(base_size = 10))
```

## 2. 라벨 (Labels) 완전정복

### 기본 제목과 라벨 추가

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth(se = FALSE) +
  labs(
    title = "Engine Size and Fuel Efficiency",
    subtitle = "Exception: Coupe category",
    caption = "Source: fueleconomy.gov"
  )
```

![title and labels example](./images/2022-07-02-ggplot2_4_1.png)

### 축 라벨 커스터마이징

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth(se = FALSE) +
  labs(
    x = "Engine Displacement (L)",
    y = "Highway Fuel Efficiency (MPG)",
    color = "Car Type"
  )
```

![axis labels example](./images/2022-07-02-ggplot2_6_1.png)

### 수학 수식 라벨

`quote()`를 사용하여 수학 수식을 라벨로 사용할 수 있습니다.

```r
df <- tibble(
  x = runif(10),
  y = runif(10)
)

ggplot(df, aes(x, y)) +
  geom_point() +
  labs(
    x = quote(sum(x[i]^2, i == 1, n)),
    y = quote(alpha + beta + frac(delta, theta))
  )
```

![math expressions example](./images/2022-07-02-ggplot2_8_0.png)

####  수학 표현식 참고
더 많은 수학 표현식은 `?plotmath`를 참조하세요.

## 3. 주석 (Annotations) 마스터하기

### geom_text(): 개별 데이터 포인트 라벨링

```r
# 각 클래스별 최고 연비 차량 선별
best_in_class <- mpg %>%
  group_by(class) %>%
  filter(row_number(desc(hwy)) == 1)

ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_text(aes(label = model), data = best_in_class)
```

![geom_text example](./images/2022-07-02-ggplot2_11_0.png)

### geom_label(): 배경이 있는 라벨

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_label(
    aes(label = model),
    data = best_in_class,
    nudge_y = 2,      # 위로 2만큼 이동
    alpha = 0.5       # 반투명 설정
  )
```

![geom_label example](./images/2022-07-02-ggplot2_12_0.png)

### ggrepel: 라벨 겹침 해결

라벨이 겹치는 문제를 해결하는 강력한 도구입니다.

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_point(size = 3, shape = 1, data = best_in_class) +  # 강조 테두리
  ggrepel::geom_label_repel(
    aes(label = model),
    data = best_in_class
  )
```

![ggrepel example](./images/2022-07-02-ggplot2_14_0.png)

####  중요 팁
`ggrepel` 패키지는 라벨 겹침을 자동으로 방지하여 깔끔한 시각화를 만들어줍니다.

### 범례 대신 직접 라벨링

```r
# 클래스별 중앙값 계산
class_avg <- mpg %>%
  group_by(class) %>%
  summarize(
    displ = median(displ),
    hwy = median(hwy)
  )

ggplot(mpg, aes(displ, hwy, color = class)) +
  ggrepel::geom_label_repel(
    aes(label = class),
    data = class_avg,
    size = 6,
    label.size = 0,
    segment.color = NA
  ) +
  geom_point() +
  theme(legend.position = "none")  # 범례 제거
```

![direct labeling example](./images/2022-07-02-ggplot2_16_0.png)

### 모퉁이에 설명 텍스트 추가

```r
# 최대값 위치에 라벨 배치
label <- mpg %>%
  summarize(
    displ = max(displ),
    hwy = max(hwy),
    label = "Increasing engine size is \nrelated to decreasing fuel economy"
  )

ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  geom_text(
    aes(label = label),
    data = label,
    vjust = "top",    # 수직 정렬
    hjust = "right"   # 수평 정렬
  )
```

![corner text example](./images/2022-07-02-ggplot2_18_0.png)

### Inf를 활용한 테두리 배치

```r
label <- tibble(
  displ = Inf,      # 무한대로 설정
  hwy = Inf,
  label = paste(
    "Increasing engine size is \nrelated to",
    "decreasing fuel economy"
  )
)

ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  geom_text(
    aes(label = label),
    data = label,
    vjust = "top",
    hjust = "right"
  )
```

![infinity positioning example](./images/2022-07-02-ggplot2_20_0.png)

###  자동 줄바꿈 기능

```r
# stringr::str_wrap()으로 자동 줄바꿈
"Increasing engine size is related to decreasing fuel economy." %>%
  stringr::str_wrap(width = 40) %>%
  writeLines()
```

## 4. 스케일 (Scales) 커스터마이징

### 기본 스케일 이해

ggplot2는 자동으로 스케일을 추가합니다:

```r
# 기본 플롯
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class))

# 명시적 스케일 (위와 동일한 결과)
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  scale_x_continuous() +
  scale_y_continuous() +
  scale_color_discrete()
```

![basic scales comparison](./images/2022-07-02-ggplot2_27_0.png)

####  스케일 명명 규칙
`scale_` + `심미성이름` + `_` + `스케일타입`

## 5. 축, 눈금, 범례 키 조정

### breaks: 눈금 위치 조정

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  scale_y_continuous(breaks = seq(15, 40, by = 5))
```

![custom breaks example](./images/2022-07-02-ggplot2_32_0.png)

### labels: 라벨 숨기기

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point() +
  scale_x_continuous(labels = NULL) +
  scale_y_continuous(labels = NULL)
```

![hidden labels example](./images/2022-07-02-ggplot2_34_0.png)

### 대통령 임기 시각화

```r
presidential %>%
  mutate(id = 33 + row_number()) %>%
  ggplot(aes(start, id, color = party)) +
  geom_point() +
  geom_segment(aes(xend = end, yend = id)) +
  scale_x_date(
    NULL,
    breaks = presidential$start,
    date_labels = "'%y"  # 2자리 연도 표시
  )
```

![presidential terms example](./images/2022-07-02-ggplot2_36_0.png)

## 6. 범례 레이아웃 조정

### 범례 위치 조정

```r
base <- ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class))

# 다양한 위치 설정
base + theme(legend.position = "left")
base + theme(legend.position = "top")
base + theme(legend.position = "bottom")
base + theme(legend.position = "right")
```

![legend positions](./images/2022-07-02-ggplot2_40_0.png)

### 범례 세부 조정

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth(se = FALSE) +
  theme(legend.position = "bottom") +
  guides(
    color = guide_legend(
      nrow = 1,                        # 한 줄로 배치
      override.aes = list(size = 4)    # 범례 점 크기 조정
    )
  )
```

![legend customization example](./images/2022-07-02-ggplot2_42_1.png)

## 7. 스케일 교체하기

### 로그 변환의 두 가지 방법

#### 기본 플롯 (변환 전)

```r
ggplot(diamonds, aes(carat, price)) +
  geom_bin2d()
```

![basic diamond plot](./images/2022-07-02-ggplot2_46_0.png)

#### 방법 1: 데이터 직접 변환 (권장하지 않음)

```r
ggplot(diamonds, aes(log10(carat), log10(price))) +
  geom_bin2d()
```

![log transform data](./images/2022-07-02-ggplot2_47_0.png)

#### 방법 2: 스케일 변환 (권장)

```r
ggplot(diamonds, aes(carat, price)) +
  geom_bin2d() +
  scale_x_log10() +
  scale_y_log10()
```

![log transform scale](./images/2022-07-02-ggplot2_49_0.png)

### 색상 스케일 커스터마이징

#### ColorBrewer 팔레트 사용

```r
# 기본 색상
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = drv))

# ColorBrewer 팔레트
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = drv)) +
  scale_color_brewer(palette = "Set1")
```

![colorbrewer example](./images/2022-07-02-ggplot2_51_0.png)

#### 색상 + 모양 중복 매핑

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = drv, shape = drv)) +
  scale_color_brewer(palette = "Set1")
```

![color shape mapping](./images/2022-07-02-ggplot2_53_0.png)

####  접근성 팁
색상과 모양을 함께 사용하면 색맹이 있는 사람도 구분할 수 있습니다.

### 수동 색상 설정

```r
presidential %>%
  mutate(id = 33 + row_number()) %>%
  ggplot(aes(start, id, color = party)) +
  geom_point() +
  geom_segment(aes(xend = end, yend = id)) +
  scale_color_manual(values = c(Republican = "red", Democratic = "blue"))
```

![manual colors example](./images/2022-07-02-ggplot2_56_0.png)

### Viridis 색상 스케일

```r
df <- tibble(
  x = rnorm(10000),
  y = rnorm(10000)
)

# 기본 색상
ggplot(df, aes(x, y)) +
  geom_hex() +
  coord_fixed()

# Viridis 색상 (색맹 친화적)
ggplot(df, aes(x, y)) +
  geom_hex() +
  viridis::scale_fill_viridis() +
  coord_fixed()
```

![viridis colors example](./images/2022-07-02-ggplot2_59_0.png)

## 8. 확대/축소 (Zooming)

### coord_cartesian() vs filter() 비교

```r
# coord_cartesian() 사용 (권장)
ggplot(mpg, mapping = aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth() +
  coord_cartesian(xlim = c(5, 7), ylim = c(10, 30))

# filter() 사용 (데이터 손실)
mpg %>%
  filter(displ >= 5, displ <= 7, hwy >= 10, hwy <= 30) %>%
  ggplot(aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth()
```

![zooming comparison](./images/2022-07-02-ggplot2_63_1.png)

###  중요한 차이점
- `coord_cartesian()`: 전체 데이터 기준으로 통계 계산 후 확대
- `filter()`: 일부 데이터만으로 통계 계산

## 9. 스케일 통일하기

### 문제: 서로 다른 스케일

```r
suv <- mpg %>%
  filter(class == "suv")
compact <- mpg %>%
  filter(class == "compact")

# 비교하기 어려운 플롯들
ggplot(suv, aes(displ, hwy, color = drv)) +
  geom_point()

ggplot(compact, aes(displ, hwy, color = drv)) +
  geom_point()
```

![different scales problem](./images/2022-07-02-ggplot2_65_0.png)

### 해결: 공통 스케일 적용

```r
# 공통 스케일 정의
x_scale <- scale_x_continuous(limits = range(mpg$displ))
y_scale <- scale_y_continuous(limits = range(mpg$hwy))
col_scale <- scale_color_discrete(limits = unique(mpg$drv))

# 동일한 스케일 적용
ggplot(suv, aes(displ, hwy, color = drv)) +
  geom_point() +
  x_scale + y_scale + col_scale

ggplot(compact, aes(displ, hwy, color = drv)) +
  geom_point() +
  x_scale + y_scale + col_scale
```

![unified scales solution](./images/2022-07-02-ggplot2_67_0.png)

## 10. 테마 (Themes) 활용

### 기본 테마 적용

```r
ggplot(mpg, aes(displ, hwy)) +
  geom_point(aes(color = class)) +
  geom_smooth(se = FALSE) +
  theme_bw()  # 흑백 테마
```

![theme example](./images/2022-07-02-ggplot2_69_1.png)

###  주요 내장 테마들

- `theme_minimal()`: 미니멀한 스타일
- `theme_classic()`: 클래식한 스타일  
- `theme_void()`: 배경 없는 스타일
- `theme_dark()`: 어두운 배경
- `theme_bw()`: 흑백 스타일

##  ggplot2 고급 활용 팁

###  프로페셔널 시각화 체크리스트

1. **명확한 제목과 라벨**: `labs()`로 모든 요소에 설명 추가
2. **적절한 색상 선택**: ColorBrewer나 Viridis 팔레트 활용
3. **범례 최적화**: 위치와 크기를 내용에 맞게 조정
4. **축 스케일 조정**: 데이터 특성에 맞는 변환과 구간 설정
5. **일관된 테마**: 프로젝트 전체에 동일한 스타일 적용

###  색상 선택 가이드

- **정성적 데이터**: `scale_color_brewer()` 또는 `scale_color_manual()`
- **정량적 데이터**: `scale_color_gradient()` 또는 `viridis::scale_color_viridis()`
- **발산형 데이터**: `scale_color_gradient2()` (양수/음수 구분)

###  라벨링 전략

- **적은 데이터**: 직접 라벨링으로 범례 대체
- **많은 데이터**: 대표값만 선별하여 라벨링
- **겹침 방지**: `ggrepel` 패키지 적극 활용

## 마무리

**ggplot2의 고급 기능**들을 마스터하면 단순한 데이터 플롯을 **출판 품질의 시각화**로 업그레이드할 수 있습니다. 이번 포스팅에서 다룬 핵심 내용들을 정리하면:

- **aes()**: 데이터 변수를 시각적 속성에 매핑
- **facet**: 데이터를 그룹별로 분할하여 시각화
- **geom**: 데이터의 기하학적 표현 방식 결정  
- **position**: 요소들의 배치 방식 조정
- **coord**: 좌표계 변환으로 다양한 뷰 제공

이러한 **레이어 시스템**을 이해하고 조합하면, 단순한 산점도부터 복잡한 다변량 시각화까지 자유자재로 구현할 수 있습니다.

**실무에서는 데이터의 특성과 전달하고자 하는 메시지에 따라 적절한 geom과 aes 조합을 선택하는 것이 중요**합니다. 많은 연습을 통해 ggplot2의 문법을 체화하고, 데이터 스토리텔링의 달인이 되어보세요!