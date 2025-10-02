---
author: Jo YunHo
pubDatetime: 2022-08-02T10:00:00Z
modDatetime: 2025-01-17T17:00:00Z
title: R 데이터 탐색과 시각화 - 변동과 공변동 분석 완전정복 (4)
slug: "r-data-exploration-variation-covariation"
featured: false
draft: false
tags:
  - R
  - Data Analysis
description: "R을 활용한 탐색적 데이터 분석(EDA)의 핵심 개념을 다룹니다. 변동과 공변동 분석을 통해 데이터의 패턴을 발견하고, 결측값 처리와 이상값 탐지까지 체계적으로 학습합니다."
---

> 📌 참고 자료:  
> [R for Data Science - EDA](https://r4ds.had.co.nz/exploratory-data-analysis.html) | [tidyverse 공식 문서](https://www.tidyverse.org/)

## Table of contents

## 개요

**탐색적 데이터 분석(EDA)**은 데이터 사이언스의 핵심 단계입니다. 이번 포스팅에서는 R의 tidyverse를 활용하여 **변동(Variation)**과 **공변동(Covariation)** 분석을 통해 데이터의 숨겨진 패턴을 발견하는 방법을 다룹니다.

**시각화 기법**, **결측값 처리**, **이상값 탐지**, **패턴 분석**까지 - 실무에서 바로 활용할 수 있는 체계적인 데이터 탐색 기법을 배워보세요!

## 1. 환경 설정 및 기본 개념

### 라이브러리 로드 및 설정

```r
library('tidyverse')  # 데이터 분석 핵심 패키지
library('hexbin')     # 육각형 빈 플롯
library('nycflights13') # 실습용 데이터

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)
theme_set(theme_minimal(base_size = 10))
```

### 📊 변동(Variation)과 공변동(Covariation)

**변동(Variation)**: 동일한 변수의 측정값이 변하는 경향
- 모든 변수는 고유한 변동 패턴을 가짐
- 연속형/범주형 변수마다 다른 시각화 방법 필요

**공변동(Covariation)**: 둘 이상의 변수가 연관되어 동시에 변하는 경향
- 변수 간 상관관계의 단서 제공
- 예측력 향상에 핵심적 역할

## 2. 변동 분석 - 시각화 기법

### 범주형 변수 시각화

```r
# 기본 막대 그래프
ggplot(data = diamonds) + 
  geom_bar(mapping = aes(x = cut))
```

![categorical visualization](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_6_0.png)

```r
# 수치로 확인
diamonds %>% count(cut)
```

### 연속형 변수 시각화

#### 히스토그램을 이용한 분포 분석

```r
# 기본 히스토그램
ggplot(data = diamonds) +
  geom_histogram(mapping = aes(x = carat), binwidth = 0.5)
```

![continuous histogram](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_9_0.png)

```r
# 수치로 구간별 확인
diamonds %>%
  count(cut_width(carat, 0.5))
```

#### 세밀한 분포 탐색

```r
# 3캐럿 미만으로 필터링 후 세밀한 분석
smaller <- diamonds %>%
  filter(carat < 3)

ggplot(data = smaller, mapping = aes(x = carat)) +
  geom_histogram(binwidth = 0.1)
```

![filtered histogram](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_11_0.png)

### 다중 그룹 비교: geom_freqpoly

```r
ggplot(data = smaller, mapping = aes(x = carat, color = cut)) +
  geom_freqpoly(binwidth = 0.1)
```

![frequency polygon](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_13_0.png)

### 📌 패턴 발견하기

매우 세밀한 binwidth로 분석하면 흥미로운 패턴이 보입니다:

```r
ggplot(data = smaller, mapping = aes(x = carat)) +
  geom_histogram(binwidth = 0.01)
```

![fine histogram](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_14_0.png)

#### ✅ 발견한 패턴
특정 캐럿 값(0.3, 0.7, 1.0 등)에서 관측값이 급증합니다. 이는 다이아몬드 업계의 표준 크기와 관련이 있을 것으로 추정됩니다.

## 3. 이상값 탐지 및 처리

### Faithful 데이터셋 분석

```r
# Old Faithful 간헐천 데이터
ggplot(data = faithful, mapping = aes(x = eruptions)) + 
  geom_histogram(binwidth = 0.25)
```

![faithful histogram](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_17_0.png)

### 이상값 탐지

```r
# y 변수의 분포 확인
ggplot(diamonds) +
  geom_histogram(mapping = aes(x = y), binwidth = 0.5)
```

![outlier detection](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_18_0.png)

### coord_cartesian()을 활용한 확대

```r
# 이상값이 있는 구간 확대
ggplot(diamonds) +
  geom_histogram(mapping = aes(x = y), binwidth = 0.5) +
  coord_cartesian(ylim = c(0, 50))
```

![zoomed histogram](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_21_0.png)

### 이상값 확인

```r
# 이상값 추출
unusual <- diamonds %>%
  filter(y < 3 | y > 20) %>%
  select(price, x, y, z) %>%
  arrange(y)

unusual
```

## 4. 결측값 처리 전략

### 방법 1: 이상값이 포함된 행 제거 (비권장)

```r
diamonds2 <- diamonds %>%
  filter(between(y, 3, 20))
```

### 방법 2: 이상값을 결측값으로 변환 (권장)

```r
diamonds2 <- diamonds %>%
  mutate(y = ifelse(y < 3 | y > 20, NA, y))
```

#### 결측값이 있는 데이터 시각화

```r
ggplot(data = diamonds2, mapping = aes(x = x, y = y)) +
  geom_point()
```

![missing values plot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_33_1.png)

### 실제 사례: 항공편 취소 분석

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

![flight cancellations](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_37_0.png)

## 5. 공변동 분석 (Covariation)

### 범주형 vs 연속형 변수

#### 문제: 빈도수 차이로 인한 비교 어려움

```r
# 기본 frequency polygon - 비교가 어려움
ggplot(data = diamonds, mapping = aes(x = price)) +
  geom_freqpoly(mapping = aes(color = cut), binwidth = 500)
```

![frequency comparison problem](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_43_0.png)

#### 해결책 1: 밀도(Density) 사용

```r
# 밀도로 표준화하여 패턴 비교
ggplot(
  data = diamonds,
  mapping = aes(x = price, y = after_stat(density))
) +
geom_freqpoly(mapping = aes(color = cut), binwidth = 500)
```

![density comparison](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_47_1.png)

#### 해결책 2: 박스플롯 활용

```r
ggplot(data = diamonds, mapping = aes(x = cut, y = price)) +
  geom_boxplot()
```

![boxplot comparison](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_50_0.png)

#### 📊 핵심 인사이트
더 좋은 품질의 다이아몬드가 평균적으로 더 저렴합니다! 이는 직관에 반하는 흥미로운 발견입니다.

### 순서가 없는 범주형 변수

#### reorder()를 활용한 정렬

```r
# 기본 순서 (알파벳순)
ggplot(data = mpg, mapping = aes(x = class, y = hwy)) +
  geom_boxplot()
```

![unordered categories](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_56_0.png)

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

![reordered categories](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_58_0.png)

#### 축 뒤집기로 가독성 향상

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

![flipped boxplot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_60_0.png)

## 6. 범주형 변수 간 공변동

### geom_count()로 조합 빈도 시각화

```r
ggplot(data = diamonds) +
  geom_count(mapping = aes(x = cut, y = color))
```

![categorical covariation](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_63_0.png)

### count()와 geom_tile() 조합

```r
# 데이터 전처리
diamonds %>%
  count(color, cut) %>%
  ggplot(mapping = aes(x = color, y = cut)) +
  geom_tile(mapping = aes(fill = n))
```

![tile heatmap](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_68_0.png)

## 7. 연속형 변수 간 공변동

### 산점도의 한계와 해결책

#### 기본 산점도

```r
ggplot(data = diamonds) +
  geom_point(mapping = aes(x = carat, y = price))
```

![basic scatterplot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_71_0.png)

#### 투명도로 겹침 문제 해결

```r
ggplot(data = diamonds) +
  geom_point(
    mapping = aes(x = carat, y = price),
    alpha = 0.01
  )
```

![alpha scatterplot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_73_0.png)

### 2D 빈(Bin) 활용

#### 직사각형 빈

```r
ggplot(data = smaller) +
  geom_bin2d(mapping = aes(x = carat, y = price))
```

![bin2d plot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_75_0.png)

#### 육각형 빈 (추천)

```r
ggplot(data = smaller) +
  geom_hex(mapping = aes(x = carat, y = price))
```

![hex plot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_76_0.png)

### 연속형 변수를 범주형으로 변환

#### cut_width() 활용

```r
ggplot(data = smaller, mapping = aes(x = carat, y = price)) +
  geom_boxplot(mapping = aes(group = cut_width(carat, 0.1)))
```

![cut_width boxplot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_78_0.png)

#### cut_number()로 균등 분할

```r
ggplot(data = smaller, mapping = aes(x = carat, y = price)) +
  geom_boxplot(mapping = aes(group = cut_number(carat, 20)))
```

![cut_number boxplot](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_81_0.png)

## 8. 패턴과 모델 (고급)

### 패턴 분석을 위한 질문들

패턴을 발견했을 때 스스로에게 던져야 할 질문들:

1. **우연의 일치인가?** 랜덤한 가능성은 얼마나 될까?
2. **상관관계를 어떻게 설명할까?** 인과관계가 있을까?
3. **상관관계의 강도는?** 얼마나 강한 관계인가?
4. **다른 변수의 영향은?** 제3의 변수가 영향을 주는가?
5. **하위집단별 차이는?** 그룹별로 패턴이 다른가?

### Old Faithful 간헐천 사례

```r
ggplot(data = faithful) +
  geom_point(mapping = aes(x = eruptions, y = waiting))
```

![faithful pattern](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_85_0.png)

#### 📈 발견된 패턴
분출 사이의 대기 시간이 길수록 분출 시간도 길어지는 강한 양의 상관관계

### 모델을 활용한 패턴 추출

#### 로그 변환 회귀 모델

```r
library('modelr')

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

![residuals vs carat](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_89_0.png)

#### 캐럿 효과 제거 후 컷 품질 분석

```r
ggplot(data = diamonds2) +
  geom_boxplot(mapping = aes(x = cut, y = resid))
```

![residuals by cut](@/assets/images/2022-08-02-data_handling_b_files/2022-08-02-data_handling_b_90_0.png)

#### 🎯 핵심 발견
캐럿의 효과를 제거하고 나니, 더 좋은 품질의 다이아몬드가 실제로 더 비싸다는 것을 확인할 수 있습니다!

## 💡 탐색적 데이터 분석 체크리스트

### ✅ 변동 분석
- [ ] **범주형**: 막대 그래프로 빈도 확인
- [ ] **연속형**: 히스토그램으로 분포 탐색
- [ ] **이상값**: coord_cartesian()으로 세밀 검토
- [ ] **결측값**: 의미 있는 패턴인지 확인

### ✅ 공변동 분석
- [ ] **범주형 vs 연속형**: 박스플롯 또는 밀도 플롯
- [ ] **범주형 vs 범주형**: count 플롯 또는 타일 플롯
- [ ] **연속형 vs 연속형**: 산점도, 2D 빈, 또는 그룹화된 박스플롯

### ✅ 패턴 탐지
- [ ] **순서 조정**: reorder()로 의미 있는 순서
- [ ] **모델 활용**: 주요 효과 제거 후 세부 패턴 탐색
- [ ] **하위집단**: 그룹별 패턴 차이 확인

## 마무리

**탐색적 데이터 분석**은 데이터 사이언스의 핵심 단계입니다. 이번 포스팅에서 다룬 핵심 개념들을 정리하면:

- **변동 분석**: 각 변수의 고유한 패턴 이해
- **공변동 분석**: 변수 간 상관관계 탐색  
- **시각화 기법**: 데이터 유형별 최적 시각화 선택
- **이상값 처리**: 탐지와 적절한 대응 방법
- **패턴 발견**: 모델을 활용한 숨겨진 관계 발굴

**실무에서는 이러한 탐색 과정을 통해 데이터의 품질을 확인하고, 분석 방향을 설정하며, 모델링을 위한 인사이트를 얻습니다.** 

체계적인 EDA를 통해 **데이터가 말하는 이야기**를 발견하고, **가설 생성**의 기초를 마련하세요. 다음 포스팅에서는 **데이터 전처리와 변환 기법**에 대해 더 자세히 다뤄보겠습니다! 🔍📊