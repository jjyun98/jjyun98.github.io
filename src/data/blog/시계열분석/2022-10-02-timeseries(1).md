---
author: Jo YunHo
pubDatetime: 2022-10-02T00:00:00Z
modDatetime: 2025-01-17T00:00:00Z
title: 시계열 자료분석 - 불규칙성분, 추세성분, 주기성분 (1)
slug: "timeseries-analysis-basics-part1"
featured: true
draft: false
tags:
  - R
  - Time Series Analysis
description: "시계열 분석의 핵심 개념인 불규칙성분, 추세성분, 주기성분을 실습 예제와 함께 체계적으로 학습합니다. R을 활용한 시계열 데이터 시각화와 모델링 기법을 마스터해보세요."
---

> 📌 참고 자료:  
> [R Time Series Analysis](https://cran.r-project.org/web/views/TimeSeries.html) | [Time Series Analysis with R](https://a-little-book-of-r-for-time-series.readthedocs.io/)

## Table of contents

## 개요

**시계열 분석**은 시간에 따라 변화하는 데이터의 패턴을 이해하고 예측하는 통계 분석 기법입니다. 이번 포스팅에서는 시계열의 세 가지 핵심 구성 요소인 **불규칙성분**, **추세성분**, **주기성분**을 실습을 통해 깊이 있게 다뤄보겠습니다.

실제 데이터 분석에 필요한 R 코드와 함께 각 성분의 특성을 이해하고, 백화점 매출액 데이터를 통해 실무 적용 방법을 배워보세요!

## 1. 환경 설정 및 라이브러리 로드

### 필수 패키지 설치 및 로드

```r
# 필요한 패키지 로드
library('data.table')
library('tidyverse')
library('gridExtra')  # 다중 그래프 배치용
library('lmtest')     # Durbin-Watson 테스트용

# 플롯 설정 최적화
options(repr.plot.width = 6, repr.plot.height = 4)
```

## 2. 불규칙 성분 (Irregular Component)

**불규칙 성분**은 시계열에서 예측할 수 없는 랜덤한 변동을 나타냅니다. 주로 **백색잡음(white noise)**의 형태로 나타납니다.

### 기본 불규칙 성분 생성

```r
set.seed(1245)
n <- 100

# 표준정규분포를 따르는 불규칙 성분
z <- 5000 + 20*rnorm(n)
z %>% head()
```

![불규칙성분 기본형](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_8_0.png)

### 시각화 및 특성 이해

```r
# 기본 불규칙 성분
plot(rnorm(n), type = 'l')
abline(h = 0, lty = 2)
```

![표준 불규칙성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_10_0.png)

### ✅ 불규칙 성분의 특징
- **평균이 일정**: 시간에 관계없이 동일한 평균값
- **분산이 일정**: 변동폭이 시간에 따라 변하지 않음  
- **독립성**: 이전 값과 현재 값 사이에 상관관계 없음

### Time Series 객체 변환

```r
# ts() 함수로 시계열 객체 생성
z.ts <- ts(z,
           start = c(1980, 1),   # 1980년 1월 시작
           frequency = 12)       # 월별 데이터 (12)

# 시계열 속성 확인
z.ts %>% cycle()    # 주기 정보
z.ts %>% frequency() # 빈도
z.ts %>% start()     # 시작 시점
z.ts %>% end()       # 종료 시점
```

### 시계열 시각화

```r
ts.plot(z.ts, xlab = "date", ylab = "zt",
        main = "irregular elements")
abline(h = 5000)
```

![시계열 불규칙성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_22_0.png)

### ggplot2로 고급 시각화

```r
# 데이터 테이블 생성
tmp.data <- data.table(Time = seq.Date(as.Date("1980/1/1"),
                                       by = "month",
                                       length.out = 100),
                       z = z)

# ggplot으로 시각화
ggplot(tmp.data, aes(Time, z)) +
  geom_line(col = 'steelblue') +
  geom_hline(yintercept = 5000, col = 'grey80', lty = 2) +
  ggtitle("irregular elements") +
  scale_x_date(date_breaks = "year", date_labels = "%Y") +
  theme_bw() +
  theme(text = element_text(size = 16),
        axis.title = element_blank())
```

![ggplot 불규칙성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_27_0.png)

## 3. 추세 성분 (Trend Component)

**추세 성분**은 시계열 데이터의 장기적인 증가 또는 감소 패턴을 나타냅니다.

### 선형 추세 생성

```r
set.seed(1234)
n <- 100
t <- 1:n

# 순수 추세
x <- 0.5*t

# 추세 + 불규칙 성분
z <- 0.5*t + rnorm(n)

# 시계열 객체로 변환
z.ts <- ts(z, start = c(1980, 1), frequency = 12)
x.ts <- ts(x, start = c(1980, 1), frequency = 12)
```

### 추세 성분 시각화

```r
# 추세와 추세+노이즈 함께 그리기
ts.plot(z.ts, x.ts,
        col = c('blue', 'red'),
        lty = 1:2,
        xlab = "date",
        ylab = "zt",
        main = "trend component")

legend("topleft",
       legend = c("series", "trend"),
       lty = 1:2,
       col = c("blue", "red"))
```

![추세성분 비교](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_39_0.png)

### 💡 추세 성분의 특징
- **방향성**: 명확한 증가 또는 감소 패턴
- **지속성**: 단기적 변동과 관계없이 장기간 유지
- **선형/비선형**: 직선적이거나 곡선적 형태

## 4. 계절성분 (Seasonal Component)

**계절성분**은 일정한 주기로 반복되는 패턴을 나타냅니다. 주로 **삼각함수**를 사용하여 모델링합니다.

### 기본 계절성분 생성

```r
n <- 120
t <- 1:n
a <- rnorm(n, 0, 1)  # 오차항

# 계절성분 (사인함수 기반)
z <- 10 + 3*sin((2*pi*t)/12) + 0.8*a
```

### 주기적 패턴 시각화

```r
z.ts <- ts(z,
           start = c(1985, 1),
           frequency = 12)

plot(z.ts,
     xlab = "date",
     ylab = "zt",
     main = "seasonal component")
```

![계절성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_50_0.png)

### 삼각함수를 이용한 주기성분

```r
x <- seq(0, 48, 0.01)
s <- 12

# 다양한 주기의 sin, cos 함수
par(mfrow = c(4, 1))

# 기본 사인함수 (주기 12)
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin:: frequency=', s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)

# 코사인함수
plot(x, cos(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('cos:: frequency=', s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![삼각함수 패턴](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_54_0.png)

### 복합 주기성분

```r
# 여러 주기의 조합
plot(x, sin(2*pi*x/12) + sin(2*pi*x/6) + sin(2*pi*x/3), 
     type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = "Multiple periodic components")
abline(h = 0, lty = 2)
```

![복합 주기성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_63_3.png)

### ⚠️ 주의사항
- **주파수 선택**: 데이터의 특성에 맞는 적절한 주기 설정 필요
- **진폭 조절**: 계수를 통해 변동폭 조정
- **위상 고려**: 시작점에 따른 패턴 변화 고려

## 5. 실제 데이터 활용: 백화점 매출액 분석

### 데이터 로드 및 전처리

```r
# 데이터 읽기
z <- scan("depart.txt")

# 시계열 객체 생성
dep <- ts(z, frequency = 12, start = c(1984, 1))
plot(dep)
```

![백화점 매출 원데이터](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_72_0.png)

### 특성 분석
- **증가 추세**: 매출액이 지속적으로 증가
- **계절성**: 연간 주기적 패턴 관찰
- **이분산성**: 시간이 지날수록 변동폭 증가

### 로그 변환

```r
tmp.data <- data.table(
    day = seq.Date(as.Date("1984-01-01"),
                   by = 'month', length.out = length(z)),
    z = z
)

tmp.data[, lndep := log(z)]        # 로그 변환
tmp.data[, y := as.factor(as.integer(cycle(dep)))]  # 월별 더미
tmp.data[, trend := 1:length(z)]   # 추세 변수
```

### 변환 전후 비교

```r
p1 <- ggplot(tmp.data, aes(day, z)) + 
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  labs(title = "Original Series") +
  theme_bw()

p2 <- ggplot(tmp.data, aes(day, lndep)) + 
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  labs(title = "Log-transformed Series") +
  theme_bw()

grid.arrange(p1, p2, nrow = 2)
```

![로그변환 비교](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_78_0.png)

## 6. 선형회귀 모델링

### 지시함수(Indicator Function) 접근

지시함수를 사용할 때는 다음 제약 조건 중 하나를 선택해야 합니다:
- β₀ = 0 
- Σβᵢ = 0 
- β₁ = 0

#### 방법 1: β₀ = 0 가정

```r
reg <- lm(lndep ~ 0 + trend + y, data = tmp.data)
summary(reg)
```

**해석**:
- `trend`: 매월 0.0107씩 증가 (로그 스케일)
- `y1` ~ `y12`: 각 월의 로그 매출액 평균
- 12월이 가장 높고, 7월도 높은 수준 (계절적 특성)

#### 방법 2: β₁ = 0 가정 (기본설정)

```r
reg2 <- lm(lndep ~ trend + y, data = tmp.data)
summary(reg2)
```

**해석**:
- `(Intercept)`: 1월 기준값
- `y2` ~ `y12`: 1월 대비 각 월의 차이
- 12월이 1월 대비 가장 큰 증가폭

#### 방법 3: Σβᵢ = 0 가정

```r
reg3 <- lm(lndep ~ trend + y, data = tmp.data, 
           contrasts = list(y = "contr.sum"))
summary(reg3)
```

**해석**:
- `(Intercept)`: 전체 월평균
- 각 계수: 전체 평균 대비 해당 월의 편차
- 12월 계수는 자동 계산됨

### 모델 적합도 확인

```r
tmp.data[, fitted_lndep := fitted(reg)]

ggplot(tmp.data, aes(day, lndep)) + 
  geom_line(col = 'skyblue', lwd = 1) +
  geom_line(aes(day, fitted_lndep), col = 'orange', lwd = 1) +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  labs(title = "Actual vs Fitted Values") +
  theme_bw()
```

![모델 적합도](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_93_0.png)

## 7. 잔차 분석 및 진단

### 잔차 시계열 플롯

```r
tmp.data[, res := resid(reg)]

ggplot(tmp.data, aes(day, res)) + 
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  geom_hline(yintercept = 0, col = 'grey', lty = 2) +
  labs(title = "Residuals Time Series Plot") +
  theme_bw()
```

![잔차 분석](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_97_0.png)

### Durbin-Watson 테스트

```r
dwtest(reg, alternative = 'two.sided')
```

**결과 해석**:
- DW = 0.826, p-value = 4.781e-06
- **결론**: 1차 양의 자기상관관계 존재
- 독립성 가정 위반으로 모델 개선 필요

### ⚠️ 진단 결과
- **자기상관 문제**: 연속된 잔차 간 상관관계 존재
- **해결방안**: ARIMA 모델이나 차분 기법 고려 필요

## 8. 삼각함수 접근법

### 삼각함수 변수 생성

```r
tmp.data_sub <- tmp.data[, .(lndep, trend)]

# 다양한 주기의 sin, cos 함수 생성
tmp.data_sub <- cbind(tmp.data_sub,
                      tmp.data_sub[, lapply(as.list(1:5),
                                            function(i) sin(2*pi*i/12*trend))])

names(tmp.data_sub)[-(1:2)] <- paste("sin", c(12, 6, 4, 3, 2.4), sep = "_")

tmp.data_sub <- cbind(tmp.data_sub,
                      tmp.data_sub[, lapply(as.list(1:5),
                                            function(i) cos(2*pi*i/12*trend))])

names(tmp.data_sub)[-(1:7)] <- paste("cos", c(12, 6, 4, 3, 2.4), sep = "_")
```

### 삼각함수 회귀 모델

```r
reg_2 <- lm(lndep ~ ., data = tmp.data_sub)
summary(reg_2)
```

**주요 결과**:
- **R-squared**: 0.9796 (높은 설명력)
- **유의한 성분**: 대부분의 sin, cos 항이 유의
- **sin_2.4**: 유일하게 비유의적

### 모델 비교

```r
tmp.data_sub[, day := tmp.data$day]
tmp.data_sub[, fitted_lndep := fitted(reg_2)]

ggplot(tmp.data_sub, aes(day, lndep)) + 
  geom_line(col = 'skyblue', lwd = 1) +
  geom_line(aes(day, fitted_lndep), col = 'orange', lwd = 1) +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  theme_bw()
```

![삼각함수 모델](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_110_0.png)

### 삼각함수 모델 진단

```r
tmp.data_sub[, res := resid(reg_2)]

# 잔차 플롯
ggplot(tmp.data_sub, aes(day, res)) +
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
  theme_bw()

# Durbin-Watson 테스트
dwtest(reg_2, alternative = "two.sided")
```

**진단 결과**:
- DW = 3.27, p-value = 1.269e-06
- **결론**: 1차 음의 자기상관관계 존재

## 💡 실무 활용 팁

### ✅ 모델 선택 가이드
1. **지시함수 방법**: 해석이 직관적, 월별 효과 명확
2. **삼각함수 방법**: 매끄러운 계절 패턴, 예측에 유리
3. **모델 비교**: AIC, BIC 등으로 최적 모델 선택

### 📊 진단 체크리스트
- **잔차의 정규성**: Q-Q plot, Shapiro-Wilk 검정
- **등분산성**: Breusch-Pagan 검정
- **자기상관**: Durbin-Watson, Ljung-Box 검정
- **이상치**: Cook's distance, leverage

### 🎯 개선 방향
- **차분**: 추세 제거를 위한 1차, 계절 차분
- **ARIMA**: 자기상관 구조 직접 모델링
- **로버스트 방법**: 이상치에 강건한 추정법

## 마무리

시계열 분석의 핵심은 **데이터의 구성 요소를 정확히 파악**하는 것입니다. 불규칙성분, 추세성분, 계절성분을 체계적으로 분석함으로써:

- **패턴 이해**: 데이터의 근본적 특성 파악
- **적절한 모델링**: 각 성분에 맞는 모델 선택  
- **정확한 예측**: 미래 값 예측 정확도 향상
- **의사결정 지원**: 비즈니스 인사이트 도출

실제 분석에서는 **잔차 진단**을 통해 모델의 적합성을 반드시 확인하고, 필요시 ARIMA나 상태공간 모델 등 고급 기법을 적용해야 합니다.

다음 포스팅에서는 **ARIMA 모델링**과 **예측 기법**에 대해 더 깊이 있게 다뤄보겠습니다! 📈