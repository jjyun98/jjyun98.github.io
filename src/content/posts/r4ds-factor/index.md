---
title: 'R Factor 활용 가이드 - 범주형 데이터 완전정복'
published: 2022-08-06
draft: false
description: "R의 factor를 활용한 범주형 데이터 처리법. fct_reorder, fct_collapse, fct_recode 등 forcats 패키지 함수들을 실습 예제와 함께 체계적으로 학습합니다."
series: 'R for Data Science'
tags: ['R', 'Factor', 'Categorical Data', 'ggplot2', 'tidyverse']
---

> 참고 자료:
> [forcats 공식 문서](https://forcats.tidyverse.org/) | [R for Data Science - Factors](https://r4ds.had.co.nz/factors.html)

## 개요

**Factor(팩터)**는 R에서 범주형 변수를 다루는 핵심 데이터 타입입니다. 가질 수 있는 값이 미리 정해진 범주형 데이터를 효율적으로 처리하고, 문자형 벡터를 원하는 순서로 정렬할 때 필수적으로 사용됩니다.

이번 포스팅에서는 **forcats 패키지**의 다양한 함수들을 활용하여 factor를 조작하는 방법과 **ggplot2**에서의 실전 활용법을 실습 예제와 함께 알아보겠습니다!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
# 패키지 로드
library('tidyverse')  # forcats 패키지 포함

# 플롯 최적화 설정
options(
  repr.plot.width = 8,
  repr.plot.height = 5,
  repr.plot.res = 150
)

# 테마 설정
theme_set(theme_minimal(base_size = 10))
```

## 2. Factor 기초 개념

### 팩터형이란?

**팩터형**은 범주형 변수에 사용되는 데이터 타입으로, 다음과 같은 특징을 가집니다:

- 가질 수 있는 값이 **미리 고정되고 알려진** 변수
- 문자형 벡터를 **알파벳순이 아닌 원하는 순서**로 표시
- **메모리 효율성**과 **데이터 무결성** 보장

### 문자형 vs 팩터형 비교

```r
# 월 데이터 예시
x1 <- c("Dec", "Apr", "Jan", "Mar")
x1
# [1] "Dec" "Apr" "Jan" "Mar"

# 문자형 정렬 (알파벳순)
sort(x1)
# [1] "Apr" "Dec" "Jan" "Mar"  # 원하는 순서가 아님!
```

### 팩터형 생성과 레벨 설정

```r
# 올바른 월 순서 정의
month_levels <- c(
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
)

# 팩터형 생성
y1 <- factor(x1, levels = month_levels)
y1
# [1] Dec Apr Jan Mar
# Levels: Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec

# 팩터형 정렬 (원하는 순서대로!)
sort(y1)
# [1] Jan Mar Apr Dec
```

### 오타 감지 기능

```r
# 오타가 포함된 데이터
x2 <- c("Dec", "Apr", "Jam", "Mar")  # "Jam"은 오타
y2 <- factor(x2, levels = month_levels)
y2
# [1] Dec Apr <NA> Mar  # 오타는 자동으로 NA 처리

# parse_factor 사용시 경고 메시지
y2 <- parse_factor(x2, levels = month_levels)
# Warning: 1 parsing failure.
# row col expected actual
#   3  -- value in level set Jam
```

## 3. ggplot2에서 Factor 활용

### GSS 데이터셋 소개

```r
# General Social Survey 데이터
gss_cat %>% head()
# 설문조사 데이터로 다양한 팩터형 변수 포함
```

### 팩터 레벨 확인 방법

#### 방법 1: count() 함수

```r
gss_cat %>% count(race)
#     race     n
# 1  Other  1959
# 2  Black  3129
# 3  White 16395
```

#### 방법 2: 막대 그래프

```r
ggplot(gss_cat, aes(race)) +
  geom_bar()
```

### 빈 레벨 표시하기

```r
# 빈 레벨도 x축에 표시
ggplot(gss_cat, aes(race)) +
  geom_bar() +
  scale_x_discrete(drop = FALSE)
```

## 4. 팩터 재정렬 기법

### fct_reorder(): 다른 변수 기준 정렬

#### 종교별 TV 시청시간 분석

```r
# 종교별 평균 계산
relig_summary <- gss_cat %>%
  group_by(relig) %>%
  summarize(
    age = mean(age, na.rm = TRUE),
    tvhours = mean(tvhours, na.rm = TRUE),
    n = n()
  )

# 기본 플롯 (읽기 어려움)
ggplot(relig_summary, aes(tvhours, relig)) +
  geom_point()
```

```r
# tvhours 기준으로 재정렬 (훨씬 읽기 쉬움!)
ggplot(relig_summary, aes(tvhours, fct_reorder(relig, tvhours))) +
  geom_point()
```

#### tibble 자체를 재정렬하는 방법

```r
relig_summary %>%
  mutate(relig = fct_reorder(relig, tvhours)) %>%
  ggplot(aes(tvhours, relig)) +
  geom_point()
```

### fct_relevel(): 특정 레벨을 앞으로 이동

```r
# 소득별 평균 나이 분석
rincome_summary <- gss_cat %>%
  group_by(rincome) %>%
  summarize(
    age = mean(age, na.rm = TRUE),
    tvhours = mean(tvhours, na.rm = TRUE),
    n = n()
  )

# "Not applicable"을 맨 앞으로 이동
ggplot(rincome_summary, aes(age, fct_relevel(rincome, "Not applicable"))) +
  geom_point()
```

### fct_reorder2(): 선 그래프 최적화

```r
# 나이별 결혼 상태 비율
by_age <- gss_cat %>%
  filter(!is.na(age)) %>%
  count(age, marital) %>%
  group_by(age) %>%
  mutate(prop = n / sum(n))

# 기본 선 그래프
ggplot(by_age, aes(age, prop, color = marital)) +
  geom_line(na.rm = TRUE)
```

```r
# 범례와 선 순서 일치시키기
ggplot(by_age, aes(age, prop, color = fct_reorder2(marital, age, prop))) +
  geom_line() +
  labs(color = "marital")
```

### fct_infreq(): 빈도 기준 정렬

```r
# 빈도 기준 내림차순 정렬
gss_cat %>%
  mutate(marital = marital %>% fct_infreq() %>% fct_rev()) %>%
  ggplot(aes(marital)) +
  geom_bar()
```

## 5. 팩터 레벨 수정하기

### fct_recode(): 레벨 이름 변경

```r
# 정당 성향 데이터 확인
gss_cat %>% count(partyid)
```

```r
# 레벨 이름을 더 명확하게 변경
gss_cat %>%
  mutate(partyid = fct_recode(partyid,
    "Republican, strong"     = "Strong republican",
    "Republican, weak"       = "Not str republican",
    "Independent, near rep"  = "Ind,near rep",
    "Independent, near dem"  = "Ind,near dem",
    "Democrat, weak"         = "Not str democrat",
    "Democrat, strong"       = "Strong democrat"
  )) %>%
  count(partyid)
```

### 여러 레벨을 하나로 통합

```r
# 기타 항목들을 "Other"로 통합
gss_cat %>%
  mutate(partyid = fct_recode(partyid,
    "Republican, strong"     = "Strong republican",
    "Republican, weak"       = "Not str republican",
    "Independent, near rep"  = "Ind,near rep",
    "Independent, near dem"  = "Ind,near dem",
    "Democrat, weak"         = "Not str democrat",
    "Democrat, strong"       = "Strong democrat",
    "Other"                  = "No answer",
    "Other"                  = "Don't know",
    "Other"                  = "Other party"
  )) %>%
  count(partyid)
```

#### 주의사항
서로 다른 성격의 범주들을 무분별하게 통합하면 잘못된 분석 결과를 초래할 수 있습니다.

## 6. 고급 팩터 조작 기법

### fct_collapse(): 효율적인 그룹화

```r
# 여러 레벨을 한 번에 그룹화
gss_cat %>%
  mutate(partyid = fct_collapse(partyid,
    other = c("No answer", "Don't know", "Other party"),
    rep = c("Strong republican", "Not str republican"),
    ind = c("Ind,near rep", "Independent", "Ind,near dem"),
    dem = c("Not str democrat", "Strong democrat")
  )) %>%
  count(partyid)
```

### fct_lump(): 자동 그룹화

#### 상위 1개만 남기고 나머지는 Other로

```r
gss_cat %>%
  mutate(relig = fct_lump(relig)) %>%
  count(relig)
#       relig     n
# 1 Protestant 10846
# 2     Other 10637
```

#### 상위 n개만 남기고 나머지는 Other로

```r
# 상위 4개 종교만 남기기
gss_cat %>%
  mutate(relig = fct_lump(relig, n = 4)) %>%
  count(relig, sort = TRUE)
#        relig     n
# 1  Protestant 10846
# 2    Catholic  5124
# 3        None  3523
# 4   Christian   689
# 5       Other  1301
```

## 7. 실전 활용 사례

### 범주형 변수 시각화 최적화

```r
# Before: 읽기 어려운 차트
gss_cat %>%
  ggplot(aes(relig)) +
  geom_bar() +
  theme(axis.text.x = element_text(angle = 45))

# After: 정렬된 차트
gss_cat %>%
  mutate(relig = fct_infreq(relig)) %>%
  ggplot(aes(relig)) +
  geom_bar() +
  coord_flip()  # 수평 막대로 더 읽기 쉽게
```

### 다변량 분석에서 팩터 활용

```r
# 소득-나이-결혼상태 관계 분석
gss_cat %>%
  filter(!is.na(rincome), rincome != "Not applicable") %>%
  mutate(
    rincome = fct_reorder(rincome, age),
    marital = fct_infreq(marital)
  ) %>%
  ggplot(aes(age, rincome, color = marital)) +
  geom_jitter(alpha = 0.3) +
  facet_wrap(~marital)
```

## Factor 활용 팁

### 효율적인 팩터 관리
1. **레벨 순서**: 의미 있는 순서로 정렬 (시간순, 크기순 등)
2. **일관성 유지**: 프로젝트 전체에서 동일한 레벨 이름 사용
3. **메모리 효율**: 반복되는 문자열은 팩터로 변환

### 시각화에서 팩터 활용법
- **fct_reorder()**: 값에 따른 정렬로 패턴 파악 용이
- **fct_infreq()**: 빈도 기준 정렬로 중요도 강조
- **fct_rev()**: 역순 정렬로 시각적 효과 향상
- **fct_lump()**: 소수 범주 통합으로 차트 단순화

### 데이터 전처리 전략
- **fct_recode()**: 명확한 레벨명으로 가독성 향상
- **fct_collapse()**: 유사 범주 통합으로 분석 단순화
- **parse_factor()**: 데이터 검증과 오류 탐지

## 마무리

**Factor**는 R에서 범주형 데이터를 효과적으로 다루는 핵심 도구입니다. 특히 **forcats 패키지**의 함수들을 활용하면:

- **데이터 시각화**: 의미 있는 순서로 정렬된 깔끔한 차트 생성
- **분석 효율성**: 범주 통합과 재분류로 분석 초점 명확화
- **데이터 품질**: 오타 감지와 일관성 유지로 신뢰성 향상

**실무에서는 원시 데이터의 범주형 변수를 그대로 사용하기보다는, 분석 목적에 맞게 팩터로 변환하고 적절히 가공하는 것이 중요**합니다.

특히 **ggplot2와 결합**했을 때 팩터의 진가가 발휘됩니다. 단순히 데이터를 그리는 것을 넘어서, **스토리를 전달하는 시각화**를 만들 수 있습니다!

다음 포스팅에서는 **날짜/시간 데이터 처리**와 **문자열 조작 기법**에 대해 다뤄보겠습니다.