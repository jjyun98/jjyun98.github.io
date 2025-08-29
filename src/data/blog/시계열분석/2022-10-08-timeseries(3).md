---
author: Jo YunHo
pubDatetime: 2022-10-08T10:00:00Z
modDatetime: 2025-01-17T15:00:00Z
title: 시계열 자료분석 - 가법/승법모형, 이동평균, STL, Decompose (3)
slug: "timeseries-decomposition-methods-part3"
featured: false
draft: false
tags:
  - R
  - Time Series Analysis
description: "시계열 분해법의 핵심 기법들을 실습과 함께 완전 정복합니다. 가법/승법모형부터 STL, Decompose까지, 각 방법의 특성과 활용법을 체계적으로 학습해보세요."
---

> 📌 참고 자료:  
> [Time Series Decomposition](https://otexts.com/fpp3/decomposition.html) | [STL Decomposition](https://www.rdocumentation.org/packages/stats/versions/3.6.2/topics/stl)

## Table of contents

## 개요

**시계열 분해법(Time Series Decomposition)**은 복잡한 시계열을 **추세**, **계절성**, **불규칙성분**으로 분해하여 각각의 특성을 이해하는 분석 기법입니다. 이번 포스팅에서는 다양한 분해법의 원리와 실제 적용 방법을 상세히 다뤄보겠습니다.

**가법모형**과 **승법모형**의 차이부터 **STL**, **Decompose**, **이동평균** 기법까지, 실무에서 바로 활용할 수 있는 분해법 완전 가이드를 제공합니다!

## 1. 환경 설정 및 기본 개념

### 필수 패키지 로드

```r
library('tidyverse')
library('TTR')          # 기술적 분석 도구
library('forecast')     # 시계열 예측
library('lmtest')       # 통계적 검정
library('data.table')   # 데이터 처리

# 플롯 설정
options(repr.plot.width = 8, repr.plot.height = 6)
```

### 시계열 분해의 기본 모형

시계열 분해는 크게 두 가지 모형으로 나뉩니다:

**1. 가법 모형 (Additive Model)**
- **Y_t = T_t + S_t + I_t**
- 계절성분의 크기가 일정
- 분산이 시간에 따라 변하지 않을 때 적합

**2. 승법 모형 (Multiplicative Model)**  
- **Y_t = T_t × S_t × I_t**
- 계절성분이 추세에 비례하여 변함
- 이분산성이 있을 때 적합

### 데이터 준비

```r
# 식품 관련 데이터 로드
z <- scan("food.txt")
t <- 1:length(z)
food <- ts(z, start = c(1981, 1), frequency = 12)

# 데이터 탐색
plot.ts(food, main = "Food Price Index",
        xlab = "Year", ylab = "Index")
```

![식품가격지수 원데이터](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_5_0.png)

## 2. 가법 모형 분해법

가법 모형은 이분산성을 제거하기 위해 로그 변환을 먼저 수행합니다.

### 이분산성 제거를 위한 로그 변환

```r
log_food <- log(food)

# 변환 전후 비교
par(mfrow = c(2, 1))
plot.ts(food, main = "Original Data", ylab = "Food Index")
plot.ts(log_food, main = "Log-transformed Data", ylab = "ln(Food Index)")
```

![로그변환 비교](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_8_0.png)

### 추세성분 추정

**선형회귀를 이용한 추세 추정**:

```r
# 선형 추세 모형
fit <- lm(log_food ~ t)
summary(fit)

# 추정된 추세
trend <- fitted(fit)

# 시각화
ts.plot(log_food, trend, col = c("black", "red"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Log-transformed Series and Trend Component",
        ylab = "ln(Food Index)", xlab = "Time")
legend("topleft", 
       legend = c("ln(Food Index)", "Trend Component"),
       col = c("black", "red"), lty = c(1, 2), lwd = c(1, 2))
```

![추세성분 추정](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_13_0.png)

**해석**:
- **기울기**: 0.007216 (매월 0.7% 증가)
- **R-squared**: 0.9393 (매우 높은 설명력)
- **p-value**: < 2e-16 (통계적으로 유의)

### 원시계열에서 추세성분 제거

```r
# 추세 제거 (가법 모형)
adjtrend <- log_food - trend

plot.ts(adjtrend, main = "Detrended Series",
        ylab = "Residuals", xlab = "Time")
abline(h = 0, col = "red", lty = 2)
```

![추세제거된 시계열](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_16_0.png)

### 지시함수를 이용한 계절성분 추정

```r
# 월별 더미 변수 생성
y <- factor(cycle(adjtrend))

# 계절성분 추정 (절편 제거)
fit1 <- lm(adjtrend ~ 0 + y)
summary(fit1)

# 계절성분 추출
seasonal <- fitted(fit1)

# 계절성분 시각화
ts.plot(seasonal, main = "Estimated Seasonal Component",
        ylab = "Seasonal Effect", xlab = "Time")
```

![계절성분](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_22_0.png)

**해석**:
- **2월**이 가장 낮은 값 (-0.139)
- **5월**이 가장 높은 값 (0.088)
- **R-squared**: 0.617 (계절성이 잘 포착됨)

### 최종 추정값과 잔차 분석

```r
# 최종 추정값 (가법 모형)
pred <- trend + seasonal

# 원데이터와 추정값 비교
ts.plot(log_food, pred, col = c("black", "blue"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Actual vs Fitted (Additive Model)",
        ylab = "ln(Food Index)", xlab = "Time")
legend("topleft",
       legend = c("Actual", "Fitted"),
       col = c("black", "blue"), lty = c(1, 2), lwd = c(1, 2))

# 불규칙성분 (잔차)
irregular <- log_food - pred
ts.plot(irregular, main = "Irregular Component",
        ylab = "Residuals", xlab = "Time")
abline(h = 0, col = "red", lty = 2)

# 자기상관 검정
dwtest(lm(irregular ~ 1), alternative = 'two.sided')
```

![가법모형 적합도](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_26_0.png)

**진단 결과**:
- **DW = 1.08, p-value = 2.748e-08**
- **결론**: 잔차에 자기상관 존재 → 추가 모델링 필요

### ✅ 가법 모형의 특징
- **적용 조건**: 분산이 일정하거나 로그 변환으로 안정화 가능
- **장점**: 해석이 직관적, 각 성분의 기여도 명확
- **단점**: 이분산성이 심한 경우 로그 변환 필수

## 3. 승법 모형 분해법

승법 모형은 원데이터에 직접 적용하여 이분산성을 자연스럽게 처리합니다.

### 추세성분 추정

```r
# 원데이터에 대한 선형 추세
fit3 <- lm(food ~ t)
summary(fit3)

trend <- fitted(fit3)

# 추세 시각화
ts.plot(food, trend, col = c("black", "red"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Original Series and Trend (Multiplicative Model)",
        ylab = "Food Index", xlab = "Time")
legend("topleft",
       legend = c("Original", "Trend"),
       col = c("black", "red"), lty = c(1, 2), lwd = c(1, 2))
```

![승법모형 추세](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_39_0.png)

### 원시계열에서 추세성분 조정

```r
# 추세 제거 (승법 모형 - 나눗셈)
adjtrend <- food / trend

plot.ts(adjtrend, main = "Detrended Series (Multiplicative)",
        ylab = "Detrended Values", xlab = "Time")
abline(h = 1, col = "red", lty = 2)
```

![승법모형 추세제거](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_43_0.png)

### 계절성분 추정

```r
# 월별 계절성분 추정
y <- factor(cycle(adjtrend))
fit4 <- lm(adjtrend ~ 0 + y)
summary(fit4)

seasonal <- fitted(fit4)

# 계절성분 시각화
ts.plot(seasonal, main = "Seasonal Component (Multiplicative)",
        ylab = "Seasonal Multipliers", xlab = "Time")
abline(h = 1, col = "red", lty = 2)
```

![승법모형 계절성분](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_48_0.png)

### 최종 추정값과 진단

```r
# 최종 추정값 (승법 모형)
pred <- trend * seasonal

# 비교 시각화
ts.plot(food, pred, col = c("black", "blue"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Actual vs Fitted (Multiplicative Model)",
        ylab = "Food Index", xlab = "Time")
legend("topleft",
       legend = c("Actual", "Fitted"),
       col = c("black", "blue"), lty = c(1, 2), lwd = c(1, 2))

# 불규칙성분
irregular <- food / pred
ts.plot(irregular, main = "Irregular Component (Multiplicative)",
        ylab = "Residuals", xlab = "Time")
abline(h = 1, col = "red", lty = 2)

# 자기상관 검정
dwtest(lm(irregular ~ 1), alternative = 'two.sided')
```

![승법모형 적합도](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_51_0.png)

**진단 결과**:
- **DW = 0.57, p-value < 2.2e-16**
- **결론**: 가법 모형보다 더 강한 자기상관 존재

### 💡 승법 모형의 특징
- **적용 조건**: 계절성의 크기가 추세에 비례하여 변할 때
- **장점**: 이분산성을 자연스럽게 처리
- **단점**: 해석이 상대적으로 복잡

## 4. 이동평균을 이용한 분해법

이동평균은 시계열을 부드럽게 만들어 추세와 계절성을 파악하는 데 사용됩니다.

### 단순이동평균 vs 중심이동평균

```r
# 중간재 출하지수 데이터
z <- scan('mindex.txt')
mindex <- ts(z, start = c(1986, 1), frequency = 12)

# 비교 시각화
plot.ts(mindex, main = "Simple vs Centered Moving Average",
        ylab = "Index", xlab = "Time")
lines(SMA(mindex, n = 5), col = 'red', lwd = 2)     # 단순이동평균
lines(ma(mindex, order = 5), col = 'blue', lty = 2, lwd = 2)  # 중심이동평균
legend('topright', 
       legend = c('Original', "SMA(5)", "CMA(5)"),
       col = c('black', 'red', 'blue'),
       lty = c(1, 1, 2), lwd = c(1, 2, 2))
```

![이동평균 비교](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_60_0.png)

**차이점 분석**:
- **단순이동평균**: 처음 4개 값이 결측 (지연 발생)
- **중심이동평균**: 처음 2개만 결측 (더 균형적)
- **예측 적용**: 중심이동평균은 미래 정보 필요로 실시간 예측 불가

### 이동평균을 이용한 추세 추출

```r
# 다양한 윈도우 크기로 추세 추출
plot.ts(log_food, main = "Trend Extraction using Moving Average",
        ylab = "ln(Food Index)", xlab = "Time")
lines(ma(log_food, 3), col = 'blue', lwd = 2)   # 단기 평활
lines(ma(log_food, 12), col = 'red', lwd = 2)   # 연간 평활 (추세만 남김)
legend('topleft',
       legend = c('Original', 'MA(3)', 'MA(12)'),
       col = c('black', 'blue', 'red'), lwd = c(1, 2, 2))
```

![이동평균 추세추출](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_62_0.png)

**핵심 아이디어**:
- **MA(12)**: 12개월 이동평균으로 계절성 제거, 순수 추세만 추출
- **윈도우 크기**: 계절 주기와 같으면 계절성 완전 제거

## 5. STL 분해법

**STL(Seasonal and Trend decomposition using Loess)**은 비모수적 방법으로 유연한 분해를 제공합니다.

### STL 분해 수행

```r
# STL 분해 (s.window = 계절성 평활 정도)
stl_fit1 <- stl(log_food, s.window = 12)

# 결과 확인
head(stl_fit1$time.series)

# 분해 결과 시각화
plot(stl_fit1, main = "STL Decomposition")
```

![STL 분해결과](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_67_0.png)

### STL 적합도 평가

```r
# STL 예측값 계산
pred_stl <- stl_fit1$time.series[,"seasonal"] + stl_fit1$time.series[,"trend"]

# 원데이터와 비교
ts.plot(log_food, pred_stl, col = c("black", "green"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "STL Fitted Values",
        ylab = "ln(Food Index)", xlab = "Time")
legend("topleft",
       legend = c("Actual", "STL Fitted"),
       col = c("black", "green"), lty = c(1, 2), lwd = c(1, 2))
```

![STL 적합도](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_69_0.png)

### ✅ STL의 장점
- **유연성**: 비선형 추세와 변화하는 계절성 처리
- **로버스트**: 이상치에 덜 민감
- **자동화**: 최소한의 파라미터 설정

## 6. Decompose 함수

R의 내장 함수로 간단하고 빠른 분해를 제공합니다.

### 가법 분해

```r
# Decompose 가법 모형
dec_fit <- decompose(log_food, type = 'additive')

# 결과 확인
print("Trend (first 10 values):")
print(dec_fit$trend[1:10])

print("Seasonal (first 24 values - 2 cycles):")
print(dec_fit$seasonal[1:24])

# 분해 결과 시각화
plot(dec_fit, main = "Classical Decomposition (Additive)")
```

![Decompose 가법](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_79_0.png)

### 계절성분의 특성 확인

```r
# 계절성분이 12개월 주기로 반복되는지 확인
x <- log_food - dec_fit$trend
seasonal_means <- tapply(x, cycle(x), function(y) mean(y, na.rm = TRUE))

# 평균이 0이 되도록 조정된 계절성분
seasonal_centered <- seasonal_means - mean(seasonal_means)
print("Centered seasonal effects:")
print(round(seasonal_centered, 4))

# 실제 계절성분과 비교
cat("\nComparison with decompose seasonal component:\n")
print(round(dec_fit$seasonal[1:12], 4))
```

### Decompose 적합도 평가

```r
# 예측값 계산
pred_dec <- dec_fit$trend + dec_fit$seasonal

# 시각화
ts.plot(log_food, pred_dec, col = c("black", "orange"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Decompose Fitted Values (Additive)",
        ylab = "ln(Food Index)", xlab = "Time")
legend("topleft",
       legend = c("Actual", "Decompose Fitted"),
       col = c("black", "orange"), lty = c(1, 2), lwd = c(1, 2))
```

![Decompose 적합도](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_82_0.png)

### 승법 분해

```r
# Decompose 승법 모형
dec_fit2 <- decompose(food, type = "multiplicative")

# 분해 결과 시각화
plot(dec_fit2, main = "Classical Decomposition (Multiplicative)")

# 예측값 계산
pred_dec2 <- dec_fit2$trend * dec_fit2$seasonal

# 적합도 평가
ts.plot(food, pred_dec2, col = c("black", "purple"), 
        lty = c(1, 2), lwd = c(1, 2),
        main = "Decompose Fitted Values (Multiplicative)",
        ylab = "Food Index", xlab = "Time")
legend("topleft",
       legend = c("Actual", "Multiplicative Fitted"),
       col = c("black", "purple"), lty = c(1, 2), lwd = c(1, 2))
```

![Decompose 승법모형](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_90_0.png)

## 7. 분해법 비교 및 선택 가이드

### STL vs Decompose 비교

```r
# 두 방법의 예측값 비교
ts.plot(pred_stl, pred_dec, col = c("green", "orange"), 
        lty = c(1, 2), lwd = c(2, 2),
        main = "STL vs Decompose Comparison",
        ylab = "Fitted Values", xlab = "Time")
legend("topleft",
       legend = c("STL", "Decompose"),
       col = c("green", "orange"), lty = c(1, 2), lwd = c(2, 2))

# 차이 분석
diff_stl_dec <- pred_stl - pred_dec
ts.plot(diff_stl_dec, main = "Difference: STL - Decompose",
        ylab = "Difference", xlab = "Time")
abline(h = 0, col = "red", lty = 2)

cat("Mean absolute difference:", round(mean(abs(diff_stl_dec), na.rm = TRUE), 6))
```

![STL vs Decompose](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_84_0.png)

### 가법 vs 승법 모형 비교

```r
# 로그 변환 + 가법 vs 원데이터 + 승법 비교
# (원스케일로 변환하여 비교)
additive_original_scale <- exp(pred_dec)

ts.plot(additive_original_scale, pred_dec2, 
        col = c("blue", "red"), lty = c(1, 2), lwd = c(2, 2),
        main = "Additive (log-transformed) vs Multiplicative Model",
        ylab = "Food Index", xlab = "Time")
legend("topleft",
       legend = c("Additive (exp)", "Multiplicative"),
       col = c("blue", "red"), lty = c(1, 2), lwd = c(2, 2))

# 실제 데이터와 함께 비교
ts.plot(food, additive_original_scale, pred_dec2,
        col = c("black", "blue", "red"), 
        lty = c(1, 2, 3), lwd = c(1, 2, 2),
        main = "Model Comparison with Original Data",
        ylab = "Food Index", xlab = "Time")
legend("topleft",
       legend = c("Original", "Additive", "Multiplicative"),
       col = c("black", "blue", "red"), 
       lty = c(1, 2, 3), lwd = c(1, 2, 2))
```

![가법 vs 승법](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_92_0.png)

## 8. 실무 적용 가이드

### 분해법 선택 체크리스트

```r
# 분해법 선택을 위한 진단 함수
choose_decomposition_method <- function(data, data_name = "Series") {
  cat("=== 분해법 선택 가이드:", data_name, "===\n")
  
  # 1. 분산의 변화 확인
  n <- length(data)
  first_half_var <- var(data[1:(n%/%2)], na.rm = TRUE)
  second_half_var <- var(data[(n%/%2 + 1):n], na.rm = TRUE)
  variance_ratio <- second_half_var / first_half_var
  
  cat("분산 변화 비율:", round(variance_ratio, 2), "\n")
  if(variance_ratio > 2) {
    cat("→ 이분산성 존재: 승법모형 또는 로그변환 후 가법모형 권장\n")
  } else {
    cat("→ 분산 안정적: 가법모형 권장\n")
  }
  
  # 2. 계절성의 강도 변화 확인 (월별 데이터인 경우)
  if(frequency(data) == 12) {
    # 전반부와 후반부의 계절성 강도 비교
    first_seasonal <- tapply(data[1:(n%/%2)], 
                           cycle(data[1:(n%/%2)]), 
                           function(x) max(x, na.rm=T) - min(x, na.rm=T))
    second_seasonal <- tapply(data[(n%/%2 + 1):n], 
                            cycle(data[(n%/%2 + 1):n]), 
                            function(x) max(x, na.rm=T) - min(x, na.rm=T))
    seasonal_ratio <- mean(second_seasonal, na.rm=T) / mean(first_seasonal, na.rm=T)
    
    cat("계절성 강도 변화 비율:", round(seasonal_ratio, 2), "\n")
    if(seasonal_ratio > 1.5) {
      cat("→ 계절성이 증가: 승법모형 권장\n")
    } else if(seasonal_ratio < 0.7) {
      cat("→ 계절성이 감소: 적응적 방법 고려\n")
    } else {
      cat("→ 계절성 안정적: 가법모형 가능\n")
    }
  }
  
  # 3. 추천 방법
  cat("\n권장 분해법:\n")
  if(variance_ratio > 2) {
    cat("1순위: STL (로버스트하고 유연함)\n")
    cat("2순위: Decompose 승법모형\n")
    cat("3순위: 로그변환 후 가법모형\n")
  } else {
    cat("1순위: STL (범용성이 좋음)\n")
    cat("2순위: Decompose 가법모형 (단순하고 빠름)\n")
  }
  
  cat("\n")
}

# 적용 예시
choose_decomposition_method(food, "Food Index")
choose_decomposition_method(mindex, "Manufacturing Index")
```

### 분해 성능 평가

```r
# 다양한 분해법의 성능 비교
evaluate_decomposition <- function(original_data, fitted_values, method_name) {
  # 결측값 제거
  valid_idx <- !is.na(fitted_values)
  actual <- original_data[valid_idx]
  fitted <- fitted_values[valid_idx]
  
  # 성능 지표 계산
  mae <- mean(abs(actual - fitted))
  rmse <- sqrt(mean((actual - fitted)^2))
  mape <- mean(abs((actual - fitted) / actual)) * 100
  
  # 결정계수
  ss_res <- sum((actual - fitted)^2)
  ss_tot <- sum((actual - mean(actual))^2)
  r_squared <- 1 - (ss_res / ss_tot)
  
  return(data.frame(
    Method = method_name,
    MAE = round(mae, 4),
    RMSE = round(rmse, 4),
    MAPE = round(mape, 2),
    R_squared = round(r_squared, 4)
  ))
}

# 성능 비교 실행
performance_comparison <- rbind(
  evaluate_decomposition(as.vector(log_food), pred_stl, "STL"),
  evaluate_decomposition(as.vector(log_food), pred_dec, "Decompose_Add"),
  evaluate_decomposition(as.vector(food), pred_dec2, "Decompose_Mult")
)

print("=== 분해법 성능 비교 ===")
print(performance_comparison)

# 최적 모델 선택
best_model <- performance_comparison[which.min(performance_comparison$RMSE), "Method"]
cat("\n최적 모델 (RMSE 기준):", best_model, "\n")
```

### 잔차 진단 체크리스트

```r
# 종합적인 잔차 진단 함수
diagnose_decomposition <- function(original, fitted, method_name) {
  cat("=== 잔차 진단:", method_name, "===\n")
  
  # 잔차 계산
  residuals <- original - fitted
  residuals <- residuals[!is.na(residuals)]  # NA 제거
  
  # 1. 기본 통계량
  cat("잔차 평균:", round(mean(residuals), 6), "\n")
  cat("잔차 표준편차:", round(sd(residuals), 4), "\n")
  
  # 2. 정규성 검정
  if(length(residuals) >= 3 && length(residuals) <= 5000) {
    shapiro_test <- shapiro.test(residuals)
    cat("정규성 검정 p-value:", round(shapiro_test$p.value, 4), "\n")
    cat("정규성 가정:", ifelse(shapiro_test$p.value > 0.05, "만족", "위반"), "\n")
  }
  
  # 3. 자기상관 검정
  tryCatch({
    dw_test <- dwtest(lm(residuals ~ 1))
    cat("DW 통계량:", round(dw_test$statistic, 4), "\n")
    cat("자기상관 p-value:", round(dw_test$p.value, 4), "\n")
    cat("독립성 가정:", ifelse(dw_test$p.value > 0.05, "만족", "위반"), "\n")
  }, error = function(e) {
    cat("자기상관 검정 실패\n")
  })
  
  # 4. 이분산성 간단 검정 (전반부 vs 후반부 분산 비교)
  n <- length(residuals)
  if(n > 10) {
    var1 <- var(residuals[1:(n%/%2)])
    var2 <- var(residuals[(n%/%2+1):n])
    f_stat <- var2 / var1
    cat("분산비 (후반부/전반부):", round(f_stat, 3), "\n")
    cat("등분산성:", ifelse(f_stat < 2 && f_stat > 0.5, "양호", "의심"), "\n")
  }
  
  cat("\n")
}

# 모든 모델에 대한 잔차 진단
diagnose_decomposition(as.vector(log_food), pred_stl, "STL")
diagnose_decomposition(as.vector(log_food), pred_dec, "Decompose Additive")
diagnose_decomposition(as.vector(food), pred_dec2, "Decompose Multiplicative")
```

## 9. 고급 분해 기법

### 계절성 변화 감지

```r
# 시간에 따른 계절성 강도 변화 분석
seasonal_intensity_analysis <- function(data, window_size = 24) {
  n <- length(data)
  periods <- seq(window_size, n - window_size, by = 12)
  seasonal_strength <- numeric(length(periods))
  
  for(i in seq_along(periods)) {
    start_idx <- periods[i] - window_size + 1
    end_idx <- periods[i] + window_size
    subset_data <- data[start_idx:end_idx]
    
    # 해당 구간의 계절성 강도 계산
    monthly_means <- tapply(subset_data, cycle(subset_data), mean, na.rm = TRUE)
    seasonal_strength[i] <- max(monthly_means, na.rm = TRUE) - min(monthly_means, na.rm = TRUE)
  }
  
  return(data.frame(
    Period = periods,
    Seasonal_Strength = seasonal_strength
  ))
}

# 식품지수의 계절성 강도 변화
seasonal_analysis <- seasonal_intensity_analysis(food)

plot(seasonal_analysis$Period, seasonal_analysis$Seasonal_Strength,
     type = "l", lwd = 2, col = "blue",
     main = "Seasonal Strength Over Time",
     xlab = "Time Period", ylab = "Seasonal Intensity")
abline(h = mean(seasonal_analysis$Seasonal_Strength), col = "red", lty = 2)
```

### 적응적 분해법 (간단 구현)

```r
# 시간에 따라 변하는 계절성을 고려한 분해법
adaptive_decomposition <- function(data, window_size = 36) {
  n <- length(data)
  trend <- ma(data, order = 12)  # 12개월 이동평균으로 추세
  seasonal <- numeric(n)
  
  for(i in 1:n) {
    # 현재 시점 중심으로 윈도우 설정
    start_idx <- max(1, i - window_size/2)
    end_idx <- min(n, i + window_size/2)
    
    # 해당 윈도우 내에서 계절성 추정
    window_data <- data[start_idx:end_idx] - trend[start_idx:end_idx]
    window_data <- window_data[!is.na(window_data)]
    
    if(length(window_data) >= 12) {
      current_month <- cycle(data)[i]
      same_months <- window_data[cycle(data[start_idx:end_idx]) == current_month]
      seasonal[i] <- mean(same_months, na.rm = TRUE)
    }
  }
  
  irregular <- data - trend - seasonal
  
  return(list(
    trend = trend,
    seasonal = seasonal,
    irregular = irregular
  ))
}

# 적응적 분해법 적용 (예시)
adaptive_result <- adaptive_decomposition(as.vector(log_food))

# 결과 시각화
par(mfrow = c(4, 1), mar = c(2, 4, 2, 2))
plot.ts(log_food, main = "Original Series", ylab = "Value")
plot.ts(adaptive_result$trend, main = "Adaptive Trend", ylab = "Trend")
plot.ts(adaptive_result$seasonal, main = "Adaptive Seasonal", ylab = "Seasonal")
plot.ts(adaptive_result$irregular, main = "Adaptive Irregular", ylab = "Irregular")
```

## 10. 실무 워크플로우

### 단계별 분해 분석 프로세스

```r
# 종합적인 시계열 분해 워크플로우
comprehensive_decomposition_analysis <- function(data, data_name = "Series") {
  cat("=== 시계열 분해 분석:", data_name, "===\n\n")
  
  # 1단계: 데이터 특성 파악
  cat("1단계: 데이터 특성 분석\n")
  cat("관측값 개수:", length(data), "\n")
  cat("주기:", frequency(data), "\n")
  cat("평균:", round(mean(data, na.rm = TRUE), 2), "\n")
  cat("표준편차:", round(sd(data, na.rm = TRUE), 2), "\n")
  
  # 분산의 시간적 변화 확인
  n <- length(data)
  var_ratio <- var(data[(n%/%2+1):n], na.rm=T) / var(data[1:(n%/%2)], na.rm=T)
  cat("분산 증가율:", round((var_ratio - 1) * 100, 1), "%\n\n")
  
  # 2단계: 분해 방법 선택 및 적용
  cat("2단계: 분해 방법 적용\n")
  
  results <- list()
  
  # STL 분해
  if(frequency(data) > 1) {
    tryCatch({
      stl_result <- stl(data, s.window = "periodic")
      results$stl <- stl_result
      cat("STL 분해 완료\n")
    }, error = function(e) cat("STL 분해 실패\n"))
  }
  
  # Classical Decomposition
  tryCatch({
    if(var_ratio > 1.5) {
      decomp_result <- decompose(data, type = "multiplicative")
      results$decompose <- decomp_result
      cat("고전적 분해 (승법모형) 완료\n")
    } else {
      decomp_result <- decompose(data, type = "additive")
      results$decompose <- decomp_result
      cat("고전적 분해 (가법모형) 완료\n")
    }
  }, error = function(e) cat("고전적 분해 실패\n"))
  
  # 3단계: 모델 진단
  cat("\n3단계: 모델 진단\n")
  
  for(method in names(results)) {
    if(method == "stl") {
      fitted_values <- results[[method]]$time.series[,"trend"] + 
                      results[[method]]$time.series[,"seasonal"]
      residuals <- data - fitted_values
    } else {
      if(results[[method]]$type == "additive") {
        fitted_values <- results[[method]]$trend + results[[method]]$seasonal
        residuals <- data - fitted_values
      } else {
        fitted_values <- results[[method]]$trend * results[[method]]$seasonal
        residuals <- data / fitted_values
      }
    }
    
    # 간단한 진단 통계
    valid_residuals <- residuals[!is.na(residuals)]
    cat(sprintf("%s - RMSE: %.4f, 평균절대오차: %.4f\n", 
                toupper(method),
                sqrt(mean(valid_residuals^2)), 
                mean(abs(valid_residuals))))
  }
  
  # 4단계: 권장사항
  cat("\n4단계: 권장사항\n")
  if(var_ratio > 2) {
    cat("- 강한 이분산성 → 승법모형 또는 로그변환 권장\n")
  }
  if(frequency(data) > 1) {
    cat("- 계절성 데이터 → STL 또는 X-13 ARIMA-SEATS 고려\n")
  }
  cat("- 예측 목적 → ARIMA나 ETS 모델과 결합 검토\n")
  cat("- 실시간 분석 → 단순이동평균이나 지수평활법 고려\n")
  
  return(results)
}

# 종합 분석 실행
analysis_result <- comprehensive_decomposition_analysis(food, "Food Price Index")
```

### 예측 성능 향상을 위한 분해법 활용

```r
# 분해 + 개별 예측 + 결합 접근법
forecast_with_decomposition <- function(data, h = 12, method = "stl") {
  cat("=== 분해 기반 예측 ===\n")
  
  if(method == "stl") {
    # STL 분해
    decomp <- stl(data, s.window = "periodic")
    trend_comp <- decomp$time.series[,"trend"]
    seasonal_comp <- decomp$time.series[,"seasonal"]
    remainder_comp <- decomp$time.series[,"remainder"]
  } else {
    # Classical 분해
    decomp <- decompose(data, type = method)
    trend_comp <- decomp$trend
    seasonal_comp <- decomp$seasonal
    remainder_comp <- decomp$random
  }
  
  # 각 성분별 개별 예측
  # 1. 추세 예측 (선형 회귀)
  valid_trend <- !is.na(trend_comp)
  t_trend <- (1:length(trend_comp))[valid_trend]
  trend_model <- lm(trend_comp[valid_trend] ~ t_trend)
  future_t <- max(t_trend) + 1:h
  trend_forecast <- predict(trend_model, newdata = data.frame(t_trend = future_t))
  
  # 2. 계절성분 예측 (주기적 반복)
  seasonal_pattern <- seasonal_comp[1:frequency(data)]
  seasonal_pattern <- seasonal_pattern[!is.na(seasonal_pattern)]
  seasonal_forecast <- rep(seasonal_pattern, length.out = h)
  
  # 3. 불규칙성분 예측 (평균값 또는 ARIMA)
  irregular_forecast <- rep(mean(remainder_comp, na.rm = TRUE), h)
  
  # 최종 예측값 결합
  if(method == "multiplicative") {
    final_forecast <- trend_forecast * seasonal_forecast * irregular_forecast
  } else {
    final_forecast <- trend_forecast + seasonal_forecast + irregular_forecast
  }
  
  return(list(
    forecast = final_forecast,
    trend = trend_forecast,
    seasonal = seasonal_forecast,
    irregular = irregular_forecast
  ))
}

# 분해 기반 예측 수행
forecast_result <- forecast_with_decomposition(log_food, h = 12, method = "stl")

# 예측 결과 시각화
plot.ts(log_food, xlim = c(start(log_food)[1], end(log_food)[1] + 1),
        main = "Decomposition-based Forecast",
        ylab = "ln(Food Index)")
future_time <- seq(end(log_food)[1] + 1/12, by = 1/12, length.out = 12)
lines(future_time, forecast_result$forecast, col = "red", lwd = 2)
legend("topleft", legend = c("Actual", "Forecast"), 
       col = c("black", "red"), lwd = c(1, 2))
```

## 결론 및 실무 적용 가이드

시계열 분해법은 복잡한 시계열의 내재된 구조를 이해하는 강력한 도구입니다. 각 방법의 특성을 요약하면:

### 핵심 정리

**분해법 선택 기준**:
- **분산 안정적**: STL → Decompose 가법모형
- **이분산성 존재**: STL → Decompose 승법모형 → 로그변환 후 가법모형
- **계절성 변화**: STL (가장 유연함)
- **빠른 처리 필요**: Classical Decompose

**실무 활용 체크리스트**:
1. **데이터 특성 파악**: 분산의 시간적 변화, 계절성 강도
2. **적절한 방법 선택**: 데이터 특성에 맞는 분해법 적용
3. **성분별 분석**: 추세, 계절성, 불규칙성분의 개별 특성 파악
4. **잔차 진단**: 자기상관, 정규성, 등분산성 검정
5. **예측 활용**: 각 성분별 예측 후 결합


분해법은 시계열 분석의 기초이면서 동시에 고급 모델링의 전처리 단계로 활용됩니다. 다음 포스팅에서는 **ARIMA 모델링**과 **상태공간 모델**에 대해 다뤄보겠습니다.