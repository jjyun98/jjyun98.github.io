---
title: 'EDA 정리'
published: 2022-08-02
draft: false
description: "탐색적 데이터 분석. 변동과 공변동 분석, 이상값 탐지, 시각화 기법을 다룹니다."
series: 'R for Data Science'
tags: ['R']
---

>  참고 자료:  
> [R for Data Science - EDA](https://r4ds.had.co.nz/exploratory-data-analysis.html)

## 개요

<b>탐색적 데이터 분석(EDA)</b>은 데이터의 패턴과 특성을 파악하는 과정입니다. 이 포스팅에서는 변동(Variation)과 공변동(Covariation) 분석을 통해 데이터를 이해하는 방법을 다룹니다.

```r title="환경 설정"
library('tidyverse')  # 데이터 분석 핵심 패키지
library('hexbin')     # 육각형 빈 플롯
library('nycflights13') # 실습용 데이터
library('modelr')     # 모델링

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)
theme_set(theme_minimal(base_size = 10))
```

**변동과 공변동**

- **변동(Variation)**: 동일한 변수의 측정값이 변하는 경향. 모든 변수는 고유한 변동 패턴을 가집니다.
- **공변동(Covariation)**: 둘 이상의 변수가 연관되어 함께 변하는 경향. 변수 간 관계를 이해하는 핵심입니다.

## 1. 변동(Variation) 분석

### 1.1 범주형 변수

범주형 변수는 **막대 그래프**로 각 범주의 빈도를 확인합니다.
```r
# 기본 막대 그래프
ggplot(data = diamonds) + 
  geom_bar(mapping = aes(x = cut))
```

![categorical visualization](./images/2022-08-02-data_handling_b_6_0.png)
```r
# 수치로 확인
diamonds %>% count(cut)
```

```text
# A tibble: 5 x 2
  cut        n
  <ord>     <int>
1 Fair       1610
2 Good       4906
3 Very Good 12082
4 Premium   13791
5 Ideal     21551
```

### 1.2 연속형 변수

연속형 변수는 **히스토그램**으로 분포를 파악합니다.

**기본 히스토그램**
```r
# 기본 히스토그램
ggplot(data = diamonds) +
  geom_histogram(mapping = aes(x = carat), binwidth = 0.5)
```

![continuous histogram](./images/2022-08-02-data_handling_b_9_0.png)
```r
# 수치로 구간별 확인
diamonds %>%
  count(cut_width(carat, 0.5))
```

```text
# A tibble: 11 x 2
   cut_width(carat, 0.5)       n
   <fct>                   <int>
 1 [-0.25,0.25]              785
 2 (0.25,0.75]             29498
 3 (0.75,1.25]             15977
 4 (1.25,1.75]              5313
 5 (1.75,2.25]              2002
 6 (2.25,2.75]               322
 7 (2.75,3.25]                32
 8 (3.25,3.75]                 5
 9 (3.75,4.25]                 4
10 (4.25,4.75]                 1
11 (4.75,5.25]                 1
```

**세밀한 분포 탐색**

`binwidth`를 조정하여 더 자세한 패턴을 발견할 수 있습니다.
```r
# 3캐럿 미만으로 필터링 후 세밀한 분석
smaller <- diamonds %>%
  filter(carat < 3)

ggplot(data = smaller, mapping = aes(x = carat)) +
  geom_histogram(binwidth = 0.1)
```

![filtered histogram](./images/2022-08-02-data_handling_b_11_0.png)

**다중 그룹 비교: geom_freqpoly**

여러 그룹을 겹쳐서 비교할 때는 **frequency polygon**이 막대 그래프보다 명확합니다.
```r
ggplot(data = smaller, mapping = aes(x = carat, color = cut)) +
  geom_freqpoly(binwidth = 0.1)
```

![frequency polygon](./images/2022-08-02-data_handling_b_13_0.png)

**패턴 발견**

매우 세밀한 binwidth로 분석하면 흥미로운 패턴을 발견할 수 있습니다.
```r
ggplot(data = smaller, mapping = aes(x = carat)) +
  geom_histogram(binwidth = 0.01)
```

![fine histogram](./images/2022-08-02-data_handling_b_14_0.png)

특정 캐럿 값(0.3, 0.7, 1.0 등)에서 관측값이 급증합니다. 이는 다이아몬드 업계의 표준 크기와 관련이 있을 것으로 추정됩니다.

### 1.3 이상값 탐지

이상값은 **패턴에서 벗어난 관측치**로, 데이터 입력 오류일 수도 있고 중요한 발견일 수도 있습니다.

**Faithful 데이터셋 분석**  
faithful: 미국 옐로스톤 국립공원의 Old Faithful 간헐천의 분출 시간(eruptions)과 다음 분출까지의 대기 시간(waiting)을 기록한 데이터

```r
# Old Faithful 간헐천 데이터
ggplot(data = faithful, mapping = aes(x = eruptions)) + 
  geom_histogram(binwidth = 0.25)
```

![faithful histogram](./images/2022-08-02-data_handling_b_17_0.png)

이 그래프를 보면 데이터가 두 개의 봉우리를 가진 분포를 띠고 있음을 알 수 있습니다. 짧은 분출과 긴 분출이라는 두 가지 뚜렷한 패턴이 존재하며, 이 패턴에서 크게 벗어난 값은 보이지 않습니다.  

**이상값 발견의 어려움: diamonds 데이터셋**  
하지만 실제 대규모 데이터셋에서는 이상값이 거대한 데이터군에 묻혀 보이지 않는 경우가 많습니다. `diamonds`데이터의`y`변수(다이아몬드 폭, mm)를 살펴봅시다.
```r
# y 변수의 분포 확인
ggplot(diamonds) +
  geom_histogram(mapping = aes(x = y), binwidth = 0.5)
```

![outlier detection](./images/2022-08-02-data_handling_b_18_0.png)

이 히스토그램을 보면 대부분의 데이터가 10mm 미만의 좁은 구간에 쏠려 있습니다. 이 때문에 y축(count)의 범위가 0에서 12,000 이상으로 매우 넓게 설정되는데, 빈도수가 고작 몇 개뿐인 이상값들은 막대의 높이가 너무 낮아 보이지 않습니다. 이대로는 이상값이 있는지조차 알기 힘든 상태입니다.

**coord_cartesian()으로 숨은 데이터 확대**  
`coord_cartesian`은 특정 구간을 확대하여 보여줍니다. 이상값이 의심되는 구간(0, 50)을 확대하여 자세히 확인합니다.  
```r
# 이상값이 있는 구간 확대
ggplot(diamonds) +
  geom_histogram(mapping = aes(x = y), binwidth = 0.5) +
  coord_cartesian(ylim = c(0, 50))
```

![zoomed histogram](./images/2022-08-02-data_handling_b_21_0.png)

확대 결과, 0 근처와 30~60 사이에서 평소에는 보이지 않던 **비정상적인 관측치**들이 3곳에서 막대 형태로 나타나는 것을 확인할 수 있습니다.

**이상값 확인 및 데이터 추출**  
그래프에서 확인한 수치를 바탕으로, 실제 어떤 데이터들이 문제인지 `filter`를 통해 추출해 봅니다.
```r
# 그래프에서 확인된 비정상 구간(y < 3 또는 y > 20) 필터링
unusual <- diamonds %>%
  filter(y < 3 | y > 20) %>%
  select(price, x, y, z) %>%
  arrange(y)

unusual
```

```text
# A tibble: 9 x 4
  price     x     y     z
  <int> <dbl> <dbl> <dbl>
1  5139  0     0     0   
2  6381  0     0     0   
3 12800  0     0     0   
4 15686  0     0     0   
5 18034  0     0     0   
6  2130  0     0     0   
7  2130  0     0     0   
8  2075  5.15 31.8   5.12
9 12210  8.09 58.9   8.06
```

**분석 결과**  
1. y가 0인 데이터: 다이아몬드의 폭이 0일 수는 없으므로 측정 누락 또는 입력 오류입니다.
2. y가 31.8, 58.9인 데이터: 일반적인 다이아몬드 크기에 비해 비정상적으로 큽니다. 가격(price)과 비교했을 때 물리적으로 불가능한 수치라면 이 역시 이상값으로 판단하고 전처리를 고민해야합니다.

### 1.4 결측값 처리

이상값을 발견했을 때 두 가지 선택지가 있습니다.

**방법 1: 이상값이 포함된 행 제거 (비권장)**
```r
diamonds2 <- diamonds %>%
  filter(between(y, 3, 20))
```

이 방법은 다른 변수의 정보까지 함께 삭제하므로 권장하지 않습니다.

**방법 2: 이상값을 결측값으로 변환 (권장)**

이상값만 NA로 바꾸면 다른 변수의 정보는 유지됩니다.
```r
diamonds2 <- diamonds %>%
  mutate(y = ifelse(y < 3 | y > 20, NA, y))
```

**결측값이 있는 데이터 시각화**  
결측값이 포함된 데이터를 `ggplot2`로 시각화하면 어떻게 될까?
```r
ggplot(data = diamonds2, mapping = aes(x = x, y = y)) +
  geom_point()
```

![missing values plot](./images/2022-08-02-data_handling_b_33_1.png)

:::tip
`ggplot2`는 결측값이 포함된 행을 자동으로 제외하고 그래프를 그립니다.  
이때 "Removed n rows containing missing values"라는 경고 메시지를 띄워 사용자에게 데이터 일부가 빠졌음을 알려줍니다.
:::

**결측값 그 자체가 담고 있는 정보**

때로는 <b>데이터가 존재하지 않는다는 사실(NA)</b>자체가 분석의 핵심이 되기도 합니다. 예를 들어 항공편 데이터에서 '출발시간(dep_time)이 결측치'라는 것은 곧 '해당 항공편이 취소됨'을 의미합니다.

**취소된 항공편의 패턴 분석 예시**
```r
# 취소된 항공편 vs 정상 항공편의 출발시간 비교
nycflights13::flights %>%
  mutate(
    cancelled = is.na(dep_time),
    sched_hour = sched_dep_time %/% 100,
    sched_min = sched_dep_time %% 100,
    sched_dep_time = sched_hour + sched_min / 60
  ) %>%
  ggplot(mapping = aes(sched_dep_time)) +
  geom_freqpoly(
    mapping = aes(color = cancelled),
    binwidth = 1/4
  )
```

![flight cancellations](./images/2022-08-02-data_handling_b_37_0.png)

## 2. 공변동(Covariation) 분석

공변동은 변수들 사이의 관계를 나타냅니다. 두 개 이상의 변수가 함께 변하는 패턴을 파악하면 데이터 속에 숨겨진 이야기를 찾을 수 있습니다.

### 2.1 범주형 vs 연속형

범주형 변수(예: `cut`)에 따라 연속형 변수(예: `price`)가 어떻게 달라지는지 파악할 때는 **그룹별 분포의 차이**를 보는 것이 핵심입니다.

**문제: 빈도수 차이로 인한 비교의 함정** 앞서 본 항공편 취소 데이터처럼, 그룹 간 데이터 개수(`count`)차이가 너무 크면 일반적인 히스토그램이나 빈도 다각형(`geom_freqpoly`)으로는 패턴을 비교할 수 없습니다.
```r
# 개수(Count) 기반 비교 - Fair 등급은 바닥에 붙어서 보이지 않음
ggplot(data = diamonds) +
  geom_freqpoly(mapping = aes(x = price, color = cut), binwidth = 500)
```

![frequency comparison problem](./images/2022-08-02-data_handling_b_43_0.png)

- **통계적 문제**: `Ideal` 등급은 많고 `Fair` 등급은 너무 적어서, 개별 그룹의 내부 분포 모양보다 그룹 전체의 크기 차이만 눈에 띄게 됩니다.

**해결책 1: 밀도(Density)로 표준화하기** 이럴 때는 y축을 빈도가 아닌 <b>밀도(Density)</b>로 바꿔야 합니다. 밀도는 각 그룹의 전체 면적을 1로 표준화하여, 데이터 개수와 상관없이 분포의 '모양'을 직접 비교할 수 있게 해줍니다.
```r
# 밀도로 표준화하여 패턴 비교
ggplot(
  data = diamonds,
  mapping = aes(x = price, y = after_stat(density))
) +
geom_freqpoly(mapping = aes(color = cut), binwidth = 500)
```

![density comparison](./images/2022-08-02-data_handling_b_47_1.png)

**해결책 2: 박스플롯 활용**

박스플롯은 **분포의 요약 정보**(중앙값, 사분위수, 이상값)를 한눈에 보여줍니다.
```r
ggplot(data = diamonds, mapping = aes(x = cut, y = price)) +
  geom_boxplot()
```

![boxplot comparison](./images/2022-08-02-data_handling_b_50_0.png)

더 좋은 품질의 다이아몬드가 평균적으로 더 저렴합니다. 이는 직관에 반하는 흥미로운 발견입니다.

**순서가 없는 범주형 변수**

범주에 자연스러운 순서가 없을 때는 **reorder()**로 정렬하면 패턴이 명확해집니다.
```r
# 기본 순서 (알파벳순)
ggplot(data = mpg, mapping = aes(x = class, y = hwy)) +
  geom_boxplot()
```

![unordered categories](./images/2022-08-02-data_handling_b_56_0.png)
```r
# 중간값 기준으로 재정렬
ggplot(data = mpg) +
  geom_boxplot(
    mapping = aes(
      x = reorder(class, hwy, FUN = median),
      y = hwy
    )
  )
```

![reordered categories](./images/2022-08-02-data_handling_b_58_0.png)

**축 뒤집기로 가독성 향상**

범주명이 길 때는 축을 뒤집으면 읽기 쉽습니다.
```r
ggplot(data = mpg) +
  geom_boxplot(
    mapping = aes(
      x = reorder(class, hwy, FUN = median),
      y = hwy
    )
  ) +
  coord_flip()
```

![flipped boxplot](./images/2022-08-02-data_handling_b_60_0.png)

### 2.2 범주형 vs 범주형

두 범주형 변수의 관계는 **조합의 빈도**를 세어 파악합니다.

**geom_count()로 조합 빈도 시각화**

점의 크기로 빈도를 표현합니다.
```r
ggplot(data = diamonds) +
  geom_count(mapping = aes(x = cut, y = color))
```

![categorical covariation](./images/2022-08-02-data_handling_b_63_0.png)

**count()와 geom_tile() 조합**

히트맵 형태로 표현하면 패턴을 더 명확히 볼 수 있습니다.
```r
# 데이터 전처리
diamonds %>%
  count(color, cut) %>%
  ggplot(mapping = aes(x = color, y = cut)) +
  geom_tile(mapping = aes(fill = n))
```

![tile heatmap](./images/2022-08-02-data_handling_b_68_0.png)

### 2.3 연속형 vs 연속형

두 연속형 변수의 관계는 **산점도**가 기본이지만, 데이터가 많을 때는 다른 방법이 필요합니다.

**산점도의 한계**
```r
ggplot(data = diamonds) +
  geom_point(mapping = aes(x = carat, y = price))
```

![basic scatterplot](./images/2022-08-02-data_handling_b_71_0.png)

데이터가 많으면 점들이 겹쳐서 밀도를 파악하기 어렵습니다.

**투명도로 겹침 문제 해결**
```r
ggplot(data = diamonds) +
  geom_point(
    mapping = aes(x = carat, y = price),
    alpha = 0.01
  )
```

![alpha scatterplot](./images/2022-08-02-data_handling_b_73_0.png)

**2D 빈(Bin) 활용**

데이터를 **격자로 나눠 빈도를 계산**하면 패턴이 선명해집니다.

**직사각형 빈**
```r
ggplot(data = smaller) +
  geom_bin2d(mapping = aes(x = carat, y = price))
```

![bin2d plot](./images/2022-08-02-data_handling_b_75_0.png)

**육각형 빈 (추천)**

육각형 빈이 직사각형보다 **더 자연스러운 패턴**을 보여줍니다.
```r
ggplot(data = smaller) +
  geom_hex(mapping = aes(x = carat, y = price))
```

![hex plot](./images/2022-08-02-data_handling_b_76_0.png)

**연속형 변수를 범주형으로 변환**

한 변수를 구간으로 나누면 **박스플롯**을 활용할 수 있습니다.

**cut_width() - 동일한 너비**
```r
ggplot(data = smaller, mapping = aes(x = carat, y = price)) +
  geom_boxplot(mapping = aes(group = cut_width(carat, 0.1)))
```

![cut_width boxplot](./images/2022-08-02-data_handling_b_78_0.png)

**cut_number() - 동일한 개수**

각 구간에 동일한 개수의 관측치가 들어가도록 분할합니다.
```r
ggplot(data = smaller, mapping = aes(x = carat, y = price)) +
  geom_boxplot(mapping = aes(group = cut_number(carat, 20)))
```

![cut_number boxplot](./images/2022-08-02-data_handling_b_81_0.png)

### 2.4 패턴과 모델

**패턴 분석 질문**

패턴을 발견했을 때 스스로에게 던져야 할 질문들:

1. **우연의 일치인가?** 랜덤한 가능성은 얼마나 될까?
2. **상관관계를 어떻게 설명할까?** 인과관계가 있을까?
3. **상관관계의 강도는?** 얼마나 강한 관계인가?
4. **다른 변수의 영향은?** 제3의 변수가 영향을 주는가?
5. **하위집단별 차이는?** 그룹별로 패턴이 다른가?

**Old Faithful 간헐천 사례**
```r
ggplot(data = faithful) +
  geom_point(mapping = aes(x = eruptions, y = waiting))
```

![faithful pattern](./images/2022-08-02-data_handling_b_85_0.png)

분출 사이의 대기 시간이 길수록 분출 시간도 길어지는 강한 양의 상관관계가 보입니다.

**모델을 활용한 패턴 추출**

회귀 모델로 **주요 관계를 제거**하면 숨겨진 패턴을 발견할 수 있습니다.
```r
# 캐럿-가격 관계 모델링
mod <- lm(log(price) ~ log(carat), data = diamonds)

# 잔차 계산
diamonds2 <- diamonds %>%
  add_residuals(mod) %>%
  mutate(resid = exp(resid))

# 잔차 vs 캐럿
ggplot(data = diamonds2) +
  geom_point(mapping = aes(x = carat, y = resid))
```

![residuals vs carat](./images/2022-08-02-data_handling_b_89_0.png)

**캐럿 효과 제거 후 컷 품질 분석**
```r
ggplot(data = diamonds2) +
  geom_boxplot(mapping = aes(x = cut, y = resid))
```

![residuals by cut](./images/2022-08-02-data_handling_b_90_0.png)

캐럿의 효과를 제거하고 나니, 더 좋은 품질의 다이아몬드가 실제로 더 비싸다는 것을 확인할 수 있습니다.

## 시각화 기법 선택 가이드

| 변수 조합 | 추천 방법 | 목적 |
|-----------|-----------|------|
| 범주형 단일 | 막대 그래프 | 빈도 확인 |
| 연속형 단일 | 히스토그램 | 분포 파악 |
| 범주형 vs 연속형 | 박스플롯, 바이올린 플롯 | 그룹별 분포 비교 |
| 범주형 vs 범주형 | count 플롯, 타일 플롯 | 조합 빈도 |
| 연속형 vs 연속형 | 산점도, 2D 빈, 육각형 빈 | 상관관계 |