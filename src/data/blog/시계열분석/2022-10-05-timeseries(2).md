---
author: Jo YunHo
pubDatetime: 2022-10-05T10:00:00Z
modDatetime: 2025-01-17T15:00:00Z
title: 시계열 자료분석 - Moving Average, 단순지수평활, 이중지수평활, Holt-Winters (2)
slug: "timeseries-smoothing-methods-part2"
featured: false
draft: false
tags:
  - R
  - Time Series Analysis
description: "시계열 분석의 핵심 평활법들을 실습과 함께 완전 정복합니다. Moving Average부터 Holt-Winters까지, 각 방법의 특성과 활용법을 상세히 다룹니다."
---

> 📌 참고 자료:  
> [Forecasting: Principles and Practice](https://otexts.com/fpp3/) | [Time Series Analysis with R](https://a-little-book-of-r-for-time-series.readthedocs.io/)

## Table of contents

## 개요

**시계열 평활법(Time Series Smoothing)**은 과거 데이터의 불규칙한 변동을 제거하여 시계열의 기본적인 패턴을 파악하고 미래를 예측하는 기법입니다. 이번 포스팅에서는 실무에서 가장 많이 활용되는 평활법들을 체계적으로 학습해보겠습니다.

**Moving Average**, **단순지수평활**, **이중지수평활**, **Holt-Winters** 방법까지, 각각의 특성과 적용 상황을 실제 데이터와 함께 마스터해보세요!

## 1. 환경 설정 및 데이터 준비

### 필수 패키지 로드

```r
library('data.table')
library('tidyverse')
library('forecast')      # 예측 모델링
library('TTR')          # 기술적 분석
library('gridExtra')    # 다중 그래프
library('lmtest')       # 통계적 검정

# 플롯 설정
options(repr.plot.width = 8, repr.plot.height = 5)
```

### 데이터 로드

```r
# 영국 왕 수명 데이터 (추세가 없는 데이터 예제)
kings <- scan("https://robjhyndman.com/tsdldata/misc/kings.dat", skip = 3)
kingstimeseries <- ts(kings)

plot.ts(kingstimeseries, main = "Age of Death of English Kings",
        xlab = "King", ylab = "Age at Death")
```

![영국왕 수명 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_3_0.png)

## 2. Moving Average (이동평균)

**이동평균**은 가장 기본적인 평활 기법으로, 지정된 윈도우 크기 내에서 평균을 계산하여 노이즈를 제거합니다.

### 이동평균의 원리

이동평균은 다음과 같이 계산됩니다:

**MA(k) = (X_{t-k+1} + X_{t-k+2} + ... + X_t) / k**

### 다양한 윈도우 크기 비교

```r
# 윈도우 크기별 이동평균 계산
kingstimeseriesSMA3 <- SMA(kingstimeseries, n = 3)
kingstimeseriesSMA10 <- SMA(kingstimeseries, n = 10)

# 기본 시각화
plot.ts(kingstimeseries, main = "Moving Average Comparison")
lines(kingstimeseriesSMA3, col = 'red', lty = 2, lwd = 2)
lines(kingstimeseriesSMA10, col = 'blue', lty = 2, lwd = 2)
legend("topright", 
       legend = c("Original", "MA(3)", "MA(10)"),
       col = c("black", "red", "blue"),
       lty = c(1, 2, 2), lwd = 2)
```

![이동평균 비교](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_6_1.png)

### ggplot2를 활용한 고급 시각화

```r
# 데이터 준비
tmp.dat <- data.table(kings = kings,
                      t = 1:length(kings))
tmp.dat[, sma3 := SMA(kingstimeseries, n = 3)]
tmp.dat[, sma10 := SMA(kingstimeseries, n = 10)]

# 데이터 변형 및 시각화
melt.tmp <- melt(tmp.dat, id = 't')

ggplot(melt.tmp, aes(t, value, col = variable, 
                     linewidth = variable, lty = variable)) +
  geom_line() +
  theme_bw() +
  labs(title = "Moving Average Analysis",
       x = "Kings", y = "Age at Death", col = "Method") +
  scale_linetype_manual(values = c('solid', 'twodash', 'dashed')) +
  scale_color_manual(values = c('black', 'orange', 'steelblue')) +
  scale_linewidth_manual(values = c(0.8, 1.2, 1.2)) +
  guides(lty = 'none', linewidth = 'none')
```

![ggplot 이동평균](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_9_1.png)

### 성능 평가 지표

```r
# 윈도우 크기별 성능 비교
cat("=== Moving Average Performance Comparison ===\n")
cat("Window Size 3:\n")
cat("MSE:", mean((tmp.dat$kings - tmp.dat$sma3)^2, na.rm = T), "\n")
cat("MAE:", mean(abs(tmp.dat$kings - tmp.dat$sma3), na.rm = T), "\n")
cat("MAPE:", mean(abs((tmp.dat$kings - tmp.dat$sma3)/tmp.dat$kings), na.rm = T) * 100, "%\n\n")

cat("Window Size 10:\n")
cat("MSE:", mean((tmp.dat$kings - tmp.dat$sma10)^2, na.rm = T), "\n")
cat("MAE:", mean(abs(tmp.dat$kings - tmp.dat$sma10), na.rm = T), "\n")
cat("MAPE:", mean(abs((tmp.dat$kings - tmp.dat$sma10)/tmp.dat$kings), na.rm = T) * 100, "%\n")
```

### ✅ 이동평균의 특징
- **장점**: 구현이 간단하고 직관적
- **단점**: 과거 정보 손실, 예측력 제한적
- **적용**: 단기 노이즈 제거, 추세 파악

## 3. 단순지수평활 (Simple Exponential Smoothing)

**단순지수평활**은 최근 관측값에 더 큰 가중치를 부여하는 평활 기법입니다. 추세나 계절성이 없는 데이터에 적합합니다.

### 중간재 출하지수 데이터 분석

```r
# 데이터 로드
z <- scan('mindex.txt')
mindex <- ts(z, start = c(1986, 1), frequency = 12)

# 데이터 시각화
tmp.dat <- data.table(day = seq.Date(as.Date("1986-01-01"), 
                                     by = 'month', 
                                     length.out = length(z)),
                      ind = z)

ggplot(tmp.dat, aes(day, ind)) + 
  geom_line(col = 'skyblue', linewidth = 1) +
  geom_point(col = 'steelblue') +
  ggtitle("Intermediate Goods Shipment Index") +
  theme_bw() +
  theme(plot.title = element_text(size = 16),
        axis.title = element_blank())
```

![중간재출하지수](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_17_1.png)

### 단순지수평활의 원리

**수식**: S_t = αX_t + (1-α)S_{t-1}
- **α**: 평활상수 (0 < α < 1)
- **α가 클수록**: 최근 관측값에 더 큰 가중치
- **α가 작을수록**: 과거 관측값들을 더 많이 반영

### 다양한 평활상수 비교

```r
# HoltWinters를 이용한 단순지수평활
fit0 <- HoltWinters(mindex, 
                    alpha = 0.9,      # 레벨 평활상수
                    beta = FALSE,     # 추세 없음
                    gamma = FALSE)    # 계절성 없음

# ses 함수 활용
fit01 <- ses(mindex, 
             alpha = 0.9, 
             initial = 'simple',
             h = 10)      # 10개월 예측

summary(fit01)
```

### 최적 평활상수 탐색

```r
# 다양한 α 값에 대한 SSE 계산
w <- c(seq(0.1, 0.8, 0.1), seq(0.81, 0.99, 0.01))

sse <- sapply(w, function(x) {
  return(sum(ses(mindex, alpha = x)$residuals^2))
})

# 최적 평활상수 찾기
optimal_alpha <- w[which.min(sse)]
cat("Optimal Alpha:", optimal_alpha, "\n")
cat("Minimum SSE:", min(sse), "\n")

# SSE 그래프
plot(w[7:length(w)], sse[7:length(sse)], 
     type = "o", xlab = "Alpha", ylab = "SSE", pch = 16,
     main = "SSE vs Smoothing Parameter")
abline(v = optimal_alpha, col = "red", lty = 2)
```

![SSE 최적화](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_42_0.png)

### 평활상수별 성능 비교

```r
# α = 0.2 vs α = 0.9 비교
tmp.dat[, ses_0.2 := ses(mindex, alpha = 0.2)$fitted]
tmp.dat[, ses_0.9 := ses(mindex, alpha = 0.9)$fitted]

melt.tmp <- melt(tmp.dat, id = 'day')

ggplot(melt.tmp, aes(day, value, col = variable, 
                     linewidth = variable, lty = variable)) +
  geom_line() +
  theme_bw() +
  labs(title = "Simple Exponential Smoothing: α Comparison",
       x = "", y = "", col = "Method") +
  scale_linetype_manual(values = c('solid', "dashed", "dashed")) +
  scale_color_manual(values = c('black', 'orange', 'steelblue')) +
  scale_linewidth_manual(values = c(0.8, 1.2, 1.2)) +
  guides(lty = 'none', linewidth = 'none') +
  theme(legend.position = c(0.85, 0.8),
        legend.background = element_rect(color = "darkblue"))
```

![평활상수 비교](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_35_1.png)

### 최적 모델 진단

```r
# 최적 α로 모델 피팅
fit_optimal <- ses(mindex, h = 6)

# 예측 시각화
plot(fit_optimal, xlab = "", ylab = "", 
     main = "SES: Optimal Alpha", 
     lty = 1, col = "black")
lines(fitted(fit_optimal), col = "red", lty = 2)
legend("topright", legend = c("Actual", "Fitted"), 
       lty = 1:2, col = c("black", "red"))

# 잔차 분석
plot(fit_optimal$residuals, ylab = "Residuals",
     main = "Residuals Plot")
abline(h = 0, col = "red", lty = 2)

# 잔차 정규성 검정
t.test(resid(fit_optimal), mu = 0)
```

![SES 최적모델](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_47_0.png)

### 💡 단순지수평활 활용 팁
- **적용 대상**: 추세와 계절성이 없는 데이터
- **α 선택**: 변동이 큰 데이터는 큰 α, 안정적 데이터는 작은 α
- **장점**: 계산 효율성, 최근 정보 중시
- **단점**: 추세나 계절성 포착 불가

## 4. 이중지수평활 (Double Exponential Smoothing)

**이중지수평활**은 추세가 있는 데이터를 위한 평활법입니다. 레벨과 추세를 동시에 평활화합니다.

### 주식지수 데이터 분석

```r
# 데이터 로드
z <- scan("stock.txt") 
stock <- ts(z, start = c(1984, 1), frequency = 12)

# 데이터 시각화
tmp.data <- data.table(
  day = seq.Date(as.Date("1984-01-01"), 
                 by = 'month', length.out = length(z)),
  z = z  
)

ggplot(tmp.data, aes(day, z)) + 
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  theme_bw() + 
  ggtitle("Monthly Stock Index") +
  theme(plot.title = element_text(size = 16),
        axis.title = element_blank())
```

![주식지수 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_60_0.png)

### 이중지수평활의 원리

**이중지수평활**은 두 개의 방정식을 사용합니다:
- **레벨 방정식**: L_t = αX_t + (1-α)(L_{t-1} + T_{t-1})
- **추세 방정식**: T_t = β(L_t - L_{t-1}) + (1-β)T_{t-1}

### Holt 방법 적용

```r
# 1모수 이중지수평활 (α = β)
fit4 <- holt(stock, alpha = 0.6, beta = 0.6, h = 6)
print(fit4$model)

# 시각화
plot(fit4, ylab = "", xlab = "", lty = 1, col = "black",
     main = "Holt Method: α = β = 0.6")
lines(fitted(fit4), col = "red", lty = 2)
legend("topleft", lty = 1:2, col = c("black", "red"), 
       c("Actual", "Fitted"), bty = "n")

# 잔차 분석
plot(resid(fit4), main = "Residuals: Holt Method")
abline(h = 0, col = "red", lty = 2)
```

![Holt 방법](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_66_0.png)

### 최적 파라미터 추정

```r
# 자동 파라미터 추정
fit5 <- holt(stock, h = 6)
print(fit5$model)

# 결과 시각화
plot(fit5, ylab = "Index", xlab = "Year", lty = 1, col = "black",
     main = "Holt Method: Optimized Parameters")
lines(fitted(fit5), col = "red", lty = 2)
legend("topleft", lty = 1:2, col = c("black", "red"), 
       c("Index", "Holt"))

# 잔차 진단
plot(resid(fit5), main = "Residuals: Optimized Parameters")
abline(h = 0, col = "red", lty = 2)
```

![Holt 최적화](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_74_0.png)

### ⚠️ 이중지수평활 주의사항
- **과적합 위험**: β가 너무 클 경우 추세를 과대추정
- **초기값 민감성**: 초기 레벨과 추세값에 따라 결과 변동
- **적용 한계**: 계절성이 있는 데이터에는 부적합

## 5. Holt-Winters 방법 (삼중지수평활)

**Holt-Winters 방법**은 레벨, 추세, 계절성을 모두 고려하는 가장 포괄적인 평활법입니다.

### 항공승객 데이터 분석

```r
# 데이터 로드
z <- scan("koreapass.txt")
pass <- ts(z, start = c(1981, 1), frequency = 12)

# 데이터 탐색
plot.ts(pass, main = "Korean Air Passengers",
        xlab = "Year", ylab = "Passengers")

# 특성 분석
cat("데이터 특성:\n")
cat("- 증가 추세: 명확한 상승 패턴\n")
cat("- 계절성: 연간 주기적 변동\n")
cat("- 이분산성: 시간에 따라 변동폭 증가\n")
```

![항공승객 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_78_0.png)

### 가법 모델 (Additive Model)

계절성이 시간에 따라 일정한 경우 사용합니다.

```r
# Holt-Winters 가법 모델
fit6 <- hw(pass, seasonal = "additive", h = 12)
print(fit6$model)

# 모델 시각화
plot(fit6, ylab = "Passengers", xlab = "Year", lty = 1, col = "blue",
     main = "Holt-Winters Additive Model")
lines(fit6$fitted, col = "red", lty = 2)
legend("topleft", lty = 1:2, col = c("blue", "red"), 
       c("Actual", "Fitted"), bty = "n")

# 잔차 분석
ts.plot(resid(fit6), ylab = "Residuals", 
        main = "Residuals: Additive Model")
abline(h = 0, col = "red", lty = 2)

# 자기상관 검정
dwtest(lm(resid(fit6) ~ 1), alternative = 'two.sided')
```

![가법 모델](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_84_0.png)

### 승법 모델 (Multiplicative Model)

계절성의 크기가 시간에 따라 변하는 경우 사용합니다.

```r
# Holt-Winters 승법 모델
fit7 <- hw(pass, seasonal = "multiplicative", h = 12)
print(fit7$model)

# 모델 시각화
plot(fit7, ylab = "Passengers", xlab = "Year", lty = 1, col = "blue",
     main = "Holt-Winters Multiplicative Model")
lines(fit7$fitted, col = "red", lty = 2)
legend("topleft", lty = 1:2, col = c("blue", "red"), 
       c("Actual", "Fitted"), bty = "n")

# 잔차 분석
ts.plot(z - fit7$fitted, ylab = "Residuals", 
        main = "Residuals: Multiplicative Model")
abline(h = 0, col = "red", lty = 2)

# 자기상관 검정
dwtest(lm(resid(fit7) ~ 1), alternative = 'two.sided')
```

![승법 모델](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_90_0.png)

### 모델 비교 및 선택

```r
# 모델 성능 비교
cat("=== Model Performance Comparison ===\n")
cat("Additive Model AIC:", fit6$model$aic, "\n")
cat("Multiplicative Model AIC:", fit7$model$aic, "\n")

# 정확도 비교
additive_acc <- accuracy(fit6)
multiplicative_acc <- accuracy(fit7)

comparison <- rbind(additive_acc, multiplicative_acc)
rownames(comparison) <- c("Additive", "Multiplicative")
print(round(comparison, 3))
```

### 📊 Holt-Winters 방법 선택 가이드

| 조건 | 권장 모델 | 특징 |
|------|-----------|------|
| 계절변동이 일정 | **가법 모델** | 계절성 크기 불변 |
| 계절변동이 증가/감소 | **승법 모델** | 계절성이 추세에 비례 |
| 분산이 시간에 따라 증가 | **승법 모델** | 이분산성 고려 |

## 6. 실무 적용 가이드

### 평활법 선택 체크리스트

```r
# 데이터 특성별 평활법 선택 함수
choose_smoothing_method <- function(data) {
  cat("=== 평활법 선택 가이드 ===\n")
  
  # 추세 확인
  trend_test <- cor.test(1:length(data), data)
  has_trend <- trend_test$p.value < 0.05
  
  # 계절성 확인 (월별 데이터인 경우)
  if(frequency(data) > 1) {
    seasonal_test <- friedman.test(as.vector(data) ~ 
                                 rep(1:frequency(data), length.out = length(data)))
    has_seasonal <- seasonal_test$p.value < 0.05
  } else {
    has_seasonal <- FALSE
  }
  
  # 권장 방법 출력
  cat("데이터 특성:\n")
  cat("- 추세:", ifelse(has_trend, "있음", "없음"), "\n")
  cat("- 계절성:", ifelse(has_seasonal, "있음", "없음"), "\n")
  
  if(!has_trend & !has_seasonal) {
    cat("\n권장 방법: 단순지수평활 (SES)\n")
    return("ses")
  } else if(has_trend & !has_seasonal) {
    cat("\n권장 방법: 이중지수평활 (Holt)\n")
    return("holt")
  } else if(has_seasonal) {
    cat("\n권장 방법: Holt-Winters\n")
    return("hw")
  }
}

# 사용 예시
choose_smoothing_method(mindex)
choose_smoothing_method(pass)
```

### 모델 진단 체크리스트

```r
# 종합적인 모델 진단 함수
diagnose_model <- function(model, data_name = "Data") {
  cat("=== 모델 진단:", data_name, "===\n")
  
  # 1. 잔차 기본 통계
  residuals <- resid(model)
  cat("잔차 평균:", round(mean(residuals), 4), "\n")
  cat("잔차 표준편차:", round(sd(residuals), 4), "\n")
  
  # 2. 정규성 검정
  shapiro_test <- shapiro.test(residuals)
  cat("정규성 검정 p-value:", round(shapiro_test$p.value, 4), "\n")
  cat("정규성:", ifelse(shapiro_test$p.value > 0.05, "만족", "위반"), "\n")
  
  # 3. 자기상관 검정
  dw_test <- dwtest(lm(residuals ~ 1), alternative = 'two.sided')
  cat("DW 통계량:", round(dw_test$statistic, 4), "\n")
  cat("자기상관 p-value:", round(dw_test$p.value, 4), "\n")
  cat("독립성:", ifelse(dw_test$p.value > 0.05, "만족", "위반"), "\n")
  
  # 4. 모델 선택 기준
  if("aic" %in% names(model$model)) {
    cat("AIC:", round(model$model$aic, 2), "\n")
  }
  
  cat("\n")
}

# 모든 모델 진단
diagnose_model(fit01, "SES (mindex)")
diagnose_model(fit5, "Holt (stock)")
diagnose_model(fit7, "HW Multiplicative (passengers)")
```

### 🎯 실무 활용 팁

#### ✅ 평활법별 장단점

| 방법 | 장점 | 단점 | 적용상황 |
|------|------|------|----------|
| **Moving Average** | 직관적, 간단 | 정보손실, 예측력 제한 | 노이즈 제거 |
| **SES** | 효율적, 최근정보 중시 | 추세 미반영 | 레벨만 있는 데이터 |
| **Holt** | 추세 반영 | 계절성 미반영 | 추세 데이터 |
| **Holt-Winters** | 포괄적 | 복잡성, 파라미터 많음 | 계절성 데이터 |

#### 🔧 파라미터 튜닝 가이드

```r
# 평활상수 해석 가이드
interpret_parameters <- function(alpha, beta = NULL, gamma = NULL) {
  cat("=== 파라미터 해석 ===\n")
  
  # Alpha 해석
  if(alpha > 0.8) {
    cat("α =", alpha, "→ 최근 데이터에 매우 민감\n")
  } else if(alpha > 0.5) {
    cat("α =", alpha, "→ 최근 데이터 중시\n")
  } else {
    cat("α =", alpha, "→ 과거 데이터도 중요하게 고려\n")
  }
  
  # Beta 해석
  if(!is.null(beta)) {
    if(beta > 0.5) {
      cat("β =", beta, "→ 추세 변화에 민감\n")
    } else {
      cat("β =", beta, "→ 추세 변화에 안정적\n")
    }
  }
  
  # Gamma 해석
  if(!is.null(gamma)) {
    if(gamma > 0.5) {
      cat("γ =", gamma, "→ 계절패턴 변화에 민감\n")
    } else {
      cat("γ =", gamma, "→ 계절패턴 유지\n")
    }
  }
}

# 예시
interpret_parameters(0.9)
interpret_parameters(0.6, 0.1)
interpret_parameters(0.4, 0.12, 0.001)
```

## 7. 고급 평활법 기법

### 적응적 평활법

일반적인 평활법과 달리 시간에 따라 파라미터가 변화하는 방법입니다.

```r
# 적응적 SES 예시 (간단한 구현)
adaptive_ses <- function(data, initial_alpha = 0.3, adaptation_rate = 0.01) {
  n <- length(data)
  fitted_values <- numeric(n)
  alpha_values <- numeric(n)
  
  # 초기값 설정
  fitted_values[1] <- data[1]
  alpha_values[1] <- initial_alpha
  
  for(t in 2:n) {
    # 예측 오차 계산
    error <- abs(data[t-1] - fitted_values[t-1])
    
    # 오차에 따른 alpha 조정
    alpha_values[t] <- min(0.99, max(0.01, 
                         alpha_values[t-1] + adaptation_rate * error))
    
    # 평활값 계산
    fitted_values[t] <- alpha_values[t] * data[t] + 
                       (1 - alpha_values[t]) * fitted_values[t-1]
  }
  
  return(list(fitted = fitted_values, alpha = alpha_values))
}

# 적용 예시
adaptive_result <- adaptive_ses(as.vector(mindex))

plot(1:length(mindex), as.vector(mindex), type = "l", 
     main = "Adaptive SES vs Fixed SES",
     xlab = "Time", ylab = "Value")
lines(1:length(mindex), adaptive_result$fitted, col = "red")
lines(1:length(mindex), fitted(ses(mindex, alpha = 0.3)), col = "blue")
legend("topright", legend = c("Original", "Adaptive", "Fixed"), 
       col = c("black", "red", "blue"), lty = 1)
```

### 로버스트 평활법

이상치에 강건한 평활법입니다.

```r
# 로버스트 SES (Huber 손실함수 사용)
robust_ses <- function(data, alpha = 0.3, k = 1.345) {
  n <- length(data)
  fitted_values <- numeric(n)
  fitted_values[1] <- data[1]
  
  for(t in 2:n) {
    error <- data[t-1] - fitted_values[t-1]
    
    # Huber 가중치 계산
    if(abs(error) <= k) {
      weight <- 1
    } else {
      weight <- k / abs(error)
    }
    
    # 가중 평활
    fitted_values[t] <- alpha * weight * data[t] + 
                       (1 - alpha * weight) * fitted_values[t-1]
  }
  
  return(fitted_values)
}
```

## 8. 교차검증 및 모델 선택

### 시계열 교차검증

```r
# 시계열 교차검증 함수
ts_cv <- function(data, forecast_func, h = 1, window = NULL) {
  n <- length(data)
  if(is.null(window)) window <- round(n * 0.7)
  
  errors <- numeric(n - window - h + 1)
  
  for(i in 1:(n - window - h + 1)) {
    train_data <- data[i:(i + window - 1)]
    test_data <- data[i + window + h - 1]
    
    # 예측 수행
    forecast_result <- forecast_func(train_data, h = h)
    forecast_value <- as.numeric(forecast_result$mean[h])
    
    # 오차 계산
    errors[i] <- test_data - forecast_value
  }
  
  return(errors)
}

# 다양한 방법의 교차검증 비교
methods <- list(
  ses = function(x, h) ses(x, h = h),
  holt = function(x, h) holt(x, h = h),
  hw_add = function(x, h) hw(x, seasonal = "additive", h = h),
  hw_mult = function(x, h) hw(x, seasonal = "multiplicative", h = h)
)

cv_results <- list()
for(method_name in names(methods)) {
  tryCatch({
    cv_errors <- ts_cv(pass, methods[[method_name]], h = 1, window = 60)
    cv_results[[method_name]] <- c(
      RMSE = sqrt(mean(cv_errors^2, na.rm = TRUE)),
      MAE = mean(abs(cv_errors), na.rm = TRUE),
      MAPE = mean(abs(cv_errors / pass[(61):(length(pass))]), na.rm = TRUE) * 100
    )
  }, error = function(e) {
    cv_results[[method_name]] <- c(RMSE = NA, MAE = NA, MAPE = NA)
  })
}

# 결과 출력
cv_matrix <- do.call(rbind, cv_results)
print(round(cv_matrix, 3))
```

### 정보 기준을 통한 모델 선택

```r
# 모델 선택을 위한 정보 기준 비교
model_selection <- function(data, methods) {
  results <- data.frame()
  
  for(method_name in names(methods)) {
    tryCatch({
      model <- methods[[method_name]](data)
      
      # 정보 기준 추출
      aic <- model$model$aic
      bic <- model$model$bic
      aicc <- model$model$aicc
      
      results <- rbind(results, data.frame(
        Method = method_name,
        AIC = aic,
        BIC = bic,
        AICc = aicc
      ))
    }, error = function(e) {
      cat("Error in", method_name, ":", e$message, "\n")
    })
  }
  
  return(results)
}

# 정보 기준 비교
ic_results <- model_selection(pass, methods)
print(ic_results)

# 최적 모델 선택
best_aic <- ic_results[which.min(ic_results$AIC), "Method"]
best_bic <- ic_results[which.min(ic_results$BIC), "Method"]
cat("Best model by AIC:", best_aic, "\n")
cat("Best model by BIC:", best_bic, "\n")
```

## 9. 실전 예측 프로세스

### 단계별 예측 워크플로우

```r
# 종합적인 예측 워크플로우
forecasting_workflow <- function(data, test_proportion = 0.2, h = 12) {
  cat("=== 시계열 예측 워크플로우 ===\n\n")
  
  # 1. 데이터 분할
  n <- length(data)
  train_size <- round(n * (1 - test_proportion))
  train_data <- window(data, end = time(data)[train_size])
  test_data <- window(data, start = time(data)[train_size + 1])
  
  cat("1. 데이터 분할 완료\n")
  cat("   훈련 데이터:", length(train_data), "개\n")
  cat("   테스트 데이터:", length(test_data), "개\n\n")
  
  # 2. 데이터 특성 분석
  trend_p <- cor.test(1:length(train_data), as.vector(train_data))$p.value
  has_trend <- trend_p < 0.05
  
  if(frequency(train_data) > 1) {
    seasonal_p <- friedman.test(as.vector(train_data) ~ 
                              cycle(train_data))$p.value
    has_seasonal <- seasonal_p < 0.05
  } else {
    has_seasonal <- FALSE
  }
  
  cat("2. 데이터 특성 분석\n")
  cat("   추세:", ifelse(has_trend, "있음", "없음"), "(p =", round(trend_p, 4), ")\n")
  cat("   계절성:", ifelse(has_seasonal, "있음", "없음"), "\n\n")
  
  # 3. 모델 적합 및 선택
  models <- list()
  model_names <- c()
  
  # SES
  models[["SES"]] <- ses(train_data, h = h)
  
  # Holt
  if(has_trend) {
    models[["Holt"]] <- holt(train_data, h = h)
  }
  
  # Holt-Winters
  if(has_seasonal) {
    models[["HW_Add"]] <- hw(train_data, seasonal = "additive", h = h)
    models[["HW_Mult"]] <- hw(train_data, seasonal = "multiplicative", h = h)
  }
  
  cat("3. 모델 적합 완료 -", length(models), "개 모델\n\n")
  
  # 4. 모델 평가
  cat("4. 모델 성능 평가\n")
  performance <- data.frame()
  
  for(name in names(models)) {
    model <- models[[name]]
    fitted_values <- fitted(model)
    
    # 훈련 데이터 성능
    train_rmse <- sqrt(mean((train_data - fitted_values)^2, na.rm = TRUE))
    train_mae <- mean(abs(train_data - fitted_values), na.rm = TRUE)
    
    # 테스트 데이터 성능 (if available)
    if(length(test_data) > 0) {
      forecast_values <- model$mean[1:min(length(test_data), h)]
      test_rmse <- sqrt(mean((test_data[1:length(forecast_values)] - 
                            forecast_values)^2, na.rm = TRUE))
      test_mae <- mean(abs(test_data[1:length(forecast_values)] - 
                         forecast_values), na.rm = TRUE)
    } else {
      test_rmse <- NA
      test_mae <- NA
    }
    
    performance <- rbind(performance, data.frame(
      Model = name,
      Train_RMSE = train_rmse,
      Train_MAE = train_mae,
      Test_RMSE = test_rmse,
      Test_MAE = test_mae,
      AIC = model$model$aic
    ))
  }
  
  print(round(performance, 3))
  
  # 5. 최종 모델 선택 및 예측
  best_model_idx <- which.min(performance$AIC)
  best_model_name <- performance$Model[best_model_idx]
  best_model <- models[[best_model_name]]
  
  cat("\n5. 최종 선택 모델:", best_model_name, "\n")
  cat("   AIC:", round(performance$AIC[best_model_idx], 2), "\n")
  
  # 최종 예측 (전체 데이터 사용)
  final_model <- switch(best_model_name,
    "SES" = ses(data, h = h),
    "Holt" = holt(data, h = h),
    "HW_Add" = hw(data, seasonal = "additive", h = h),
    "HW_Mult" = hw(data, seasonal = "multiplicative", h = h)
  )
  
  return(list(
    best_model = final_model,
    performance = performance,
    data_characteristics = list(trend = has_trend, seasonal = has_seasonal)
  ))
}

# 워크플로우 실행
result <- forecasting_workflow(pass, test_proportion = 0.15, h = 12)

# 결과 시각화
plot(result$best_model, main = "Final Forecast Result",
     xlab = "Year", ylab = "Passengers")
```

### 예측 구간과 불확실성

```r
# 예측 불확실성 분석
analyze_forecast_uncertainty <- function(model, data_name = "Data") {
  cat("=== 예측 불확실성 분석:", data_name, "===\n")
  
  # 점 예측과 구간 예측
  point_forecast <- model$mean
  lower_80 <- model$lower[, "80%"]
  upper_80 <- model$upper[, "80%"]
  lower_95 <- model$lower[, "95%"]
  upper_95 <- model$upper[, "95%"]
  
  # 구간 폭 분석
  width_80 <- upper_80 - lower_80
  width_95 <- upper_95 - lower_95
  
  cat("80% 신뢰구간 평균 폭:", round(mean(width_80), 2), "\n")
  cat("95% 신뢰구간 평균 폭:", round(mean(width_95), 2), "\n")
  cat("구간 폭 증가율:", round((width_95[length(width_95)] / width_95[1] - 1) * 100, 1), "%\n")
  
  # 시각화
  plot(model, main = paste("Forecast with Uncertainty Intervals -", data_name),
       xlab = "Time", ylab = "Value")
  
  return(list(
    point_forecast = point_forecast,
    intervals = list(
      lower_80 = lower_80, upper_80 = upper_80,
      lower_95 = lower_95, upper_95 = upper_95
    )
  ))
}

# 불확실성 분석 실행
uncertainty <- analyze_forecast_uncertainty(result$best_model, "Korean Passengers")
```

## 마무리

시계열 평활법은 **실무에서 가장 널리 활용되는 예측 기법** 중 하나입니다. 각 방법의 특성을 정리하면:

### 핵심 요약

**평활법 선택 기준**:
- **레벨만 있는 경우**: 단순지수평활 (SES)
- **추세가 있는 경우**: 이중지수평활 (Holt)  
- **계절성이 있는 경우**: Holt-Winters
- **복잡한 패턴**: ARIMA나 상태공간 모델 고려

**성공적인 적용을 위한 체크리스트**:
1. **데이터 특성 파악**: 추세, 계절성, 이분산성 확인
2. **적절한 방법 선택**: 데이터 특성에 맞는 평활법 적용
3. **파라미터 최적화**: 교차검증이나 정보기준 활용
4. **모델 진단**: 잔차 분석, 자기상관 검정
5. **예측 평가**: 실제값과 비교를 통한 성능 검증

평활법은 단순해 보이지만 **올바른 적용을 위해서는 깊은 이해가 필요**합니다. 다음 포스팅에서는 **ARIMA 모델링**과 **고급 시계열 분석 기법**에 대해 다뤄보겠습니다!