---
author: Jo YunHo
pubDatetime: 2022-10-15T00:00:00Z
modDatetime: 2025-01-17T00:00:00Z
title: 시계열 자료분석 - 평활법과 지수평활법 (2)
slug: "timeseries-smoothing-methods"
featured: false
draft: false
tags:
  - R
  - 시계열분석
description: "R을 활용한 이동평균, 단순지수평활, 이중지수평활, Holt-Winters 방법론의 이해와 실습"
---

> 📌 **평활법(Smoothing Methods)이란?**  
> 시계열 데이터의 불규칙 성분을 제거하여 추세나 계절성 등의 패턴을 명확히 파악하기 위한 방법론입니다.

## Table of contents

## 1. 개요

시계열 분석에서 **평활법(Smoothing)**은 데이터의 노이즈를 줄이고 주요 패턴을 찾아내는 핵심 기법입니다. 이번 포스팅에서는 다양한 평활 방법들의 원리와 실제 적용법을 알아보겠습니다.

### 주요 평활법 종류
- **이동평균(Moving Average)**: 일정 구간의 평균으로 스무딩
- **단순지수평활(Simple Exponential Smoothing)**: 최근 값에 더 큰 가중치
- **이중지수평활(Double Exponential Smoothing)**: 추세가 있는 데이터 처리
- **Holt-Winters 방법**: 계절성까지 고려한 평활

## 2. 환경 설정 및 데이터 준비

```r
library(tidyverse)
library(data.table)
library(forecast)
library(TTR)
library(car)

# 영국 왕 수명 데이터
kings = scan("https://robjhyndman.com/tsdldata/misc/kings.dat", skip = 3)
kingstimeseries = ts(kings)
plot.ts(kingstimeseries)
```

![영국 왕 수명 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_3_0.png)

## 3. 이동평균(Moving Average)

### 기본 이동평균 적용

이동평균은 일정한 윈도우 크기로 평균을 계산하여 데이터를 평활화하는 방법입니다.

```r
# 3기간 이동평균
kingstimeseriesSMA3 <- SMA(kingstimeseries, n = 3)

# 시각화
plot.ts(kingstimeseries)
lines(kingstimeseriesSMA3, col = 'red', lty = 2)
lines(SMA(kingstimeseriesSMA3, n = 10), col = 'blue', lty = 2)
```

![이동평균 적용 결과](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_6_1.png)

### ggplot2를 활용한 시각화

```r
tmp.dat <- data.table(kings = kings,
                      t = 1:length(kings))
tmp.dat[, sma3 := SMA(kingstimeseries, n = 3)]
tmp.dat[, sma10 := SMA(kingstimeseries, n = 10)]

ggplot(tmp.dat, aes(t, kings)) + 
  geom_line(col = 'skyblue') +
  geom_point(col = 'steelblue') +
  theme_bw() +
  theme(axis.title.x = element_blank())
```

![ggplot 이동평균 시각화](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_8_0.png)

### 여러 이동평균 비교

```r
melt.tmp <- melt(tmp.dat, id = 't')

ggplot(melt.tmp, aes(t, value, col = variable, size = variable, lty = variable)) +
  geom_line() +
  theme_bw() +
  labs(col = "") +
  scale_linetype_manual(values = c('solid', 'twodash', 'dashed')) +
  scale_color_manual(values = c('black', 'orange', 'steelblue')) +
  scale_size_manual(values = c(0.2, 1.2, 1.2)) +
  guides(lty = 'none', size = 'none') +
  theme(axis.title.x = element_blank())
```

![이동평균 비교](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_9_1.png)

### 성능 평가 지표

```r
# 윈도우 크기 3일 때 성능 지표
mean((tmp.dat$kings- tmp.dat$sma3)^2, na.rm=T)  # MSE
mean(abs(tmp.dat$kings- tmp.dat$sma3), na.rm=T)  # MAE
mean(abs((tmp.dat$kings- tmp.dat$sma3)/tmp.dat$kings), na.rm=T)*100  # MAPE
```

```
[1] 128.7528
[1] 9.025
[1] 22.47399
```

```r
# 윈도우 크기 10일 때 성능 지표  
mean((tmp.dat$kings- tmp.dat$sma10)^2, na.rm=T)  # MSE
mean(abs(tmp.dat$kings- tmp.dat$sma10), na.rm=T)  # MAE
mean(abs((tmp.dat$kings- tmp.dat$sma10)/tmp.dat$kings), na.rm=T)*100  # MAPE
```

```
[1] 229.22
[1] 12.52727
[1] 31.8798
```

#### 📊 성능 비교 결과
- **윈도우 크기 3**: MSE=128.75, MAE=9.03, MAPE=22.47%
- **윈도우 크기 10**: MSE=229.22, MAE=12.53, MAPE=31.88%
- 윈도우가 작을수록 더 정확한 예측 성능을 보임

## 4. 단순 지수평활법(Simple Exponential Smoothing)

### 데이터 준비 및 탐색

```r
z <- scan('mindex.txt')
mindex <- ts(z, start = c(1986, 1), frequency = 12)

tmp.dat <- data.table(day = seq.Date(as.Date("1986-01-01"), 
                                     by='month', 
                                     length.out=length(z)),
                      ind = z)

ggplot(tmp.dat, aes(day, ind)) + 
  geom_line(col='skyblue') +
  geom_point(col='steelblue') +
  ggtitle("Intermediate shipment index") +
  theme_bw() +
  theme(plot.title = element_text(size=20),
        axis.title = element_blank())
```

![중간재 출하지수 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_17_1.png)

### HoltWinters 함수를 활용한 단순지수평활

```r
fit0 <- HoltWinters(mindex, 
                    alpha = 0.9,    # 레벨 평활상수
                    beta = FALSE,   # 기울기 평활 비활성화
                    gamma = FALSE)  # 계절성분 평활 비활성화

fit0$SSE
```

```
[1] 437.6361
```

### ses 함수를 활용한 단순지수평활

```r
fit01 <- ses(mindex, 
             alpha = 0.9,
             initial = 'simple',
             h = 10)  # 10기간 예측

summary(fit01)
```

```
Forecast method: Simple exponential smoothing

Model Information:
Simple exponential smoothing 

Call:
ses(y = mindex, h = 10, initial = "simple", alpha = 0.9)

  Smoothing parameters:
    alpha = 0.9 

  Initial states:
    l = 9.3 

  sigma:  2.092
Error measures:
                     ME     RMSE      MAE       MPE     MAPE      MASE
Training set 0.02051593 2.091975 1.614844 -2.575694 16.57215 0.2947652
                    ACF1
Training set -0.01462494

Forecasts:
         Point Forecast    Lo 80    Hi 80       Lo 95    Hi 95
May 1994       11.14643 8.465459 13.82741  7.04623710 15.24663
Jun 1994       11.14643 7.539551 14.75332  5.63018345 16.66268
Jul 1994       11.14643 6.806897 15.48597  4.50968590 17.78318
Aug 1994       11.14643 6.181200 16.11167  3.55276359 18.74010
Sep 1994       11.14643 5.625970 16.66690  2.70361248 19.58925
Oct 1994       11.14643 5.121693 17.17117  1.93238821 20.36048
Nov 1994       11.14643 4.656482 17.63638  1.22090910 21.07196
Dec 1994       11.14643 4.222457 18.07041  0.55712575 21.73574
Jan 1995       11.14643 3.814079 18.47879 -0.06743481 22.36030
Feb 1995       11.14643 3.427276 18.86559 -0.65899942 22.95187
```

### 평활상수에 따른 성능 비교

```r
tmp.dat[, ses_0.2 := ses(mindex, alpha = 0.2)$fitted]
tmp.dat[, ses_0.9 := ses(mindex, alpha = 0.9)$fitted]

melt.tmp <- melt(tmp.dat, id='day')

ggplot(melt.tmp, aes(day, value, col=variable, size=variable, lty=variable)) +
  geom_line() +
  xlab("") + ylab("") +
  theme_bw() +
  scale_linetype_manual(values=c('solid',"dashed","dashed")) +
  scale_color_manual(values=c('black','orange', 'steelblue')) +
  scale_size_manual(values=c(0.2,1.2,1.2)) +
  guides(lty = 'none', size='none') +
  theme(legend.position.inside = c(0.85,0.8)) +
  theme(legend.background = element_rect(linetype="solid", 
                                         colour ="darkblue")) +
  theme(legend.title = element_blank())
```

![평활상수 비교](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_35_1.png)

### 최적 평활상수 탐색

```r
w <- c(seq(0.1,0.8,0.1), 
       seq(0.81, 0.99, 0.01))

sse <- sapply(w, function(x) 
  return(sum(ses(mindex, alpha = x)$residuals^2)))

optimal_alpha <- w[which.min(sse)]
optimal_alpha
```

```
[1] 0.9
```

```r
fit1 <- ses(mindex, alpha=optimal_alpha, h=6)
```

![최적 평활상수 탐색](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_42_0.png)

### 잔차 분석

```r
t.test(resid(fit1), mu=0)  # 잔차의 평균이 0인지 검정
```

```
	One Sample t-test

data:  resid(fit1)
t = 0.088676, df = 99, p-value = 0.9295
alternative hypothesis: true mean is not equal to 0
95 percent confidence interval:
 -0.3985116  0.4357973
sample estimates:
 mean of x 
0.01864288
```

#### 📊 잔차 분석 결과
- **p-value = 0.9295 > 0.05**: 잔차의 평균이 0이라는 귀무가설 채택
- 모형이 적절히 적합되었음을 의미

```r
plot(fit1, xlab="", ylab="", 
     main="Intermediate Goods Shipment Index and Simple Exponential Smoothing Value alpha=0.9", 
     lty=1, col="black")
lines(fitted(fit1), col="red", lty=2)
legend("topright", legend=c("Mindex", "alpha=0.9"), 
       lty=1:2, col=c("black","red"))
```

![단순지수평활 결과](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_47_0.png)

![단순지수평활 잔차](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_49_0.png)

## 5. 이중 지수평활법(Double Exponential Smoothing)

### 주식 지수 데이터 분석

```r
z <- scan("stock.txt") 
stock <- ts(z, start=c(1984,1), frequency=12)

tmp.data <- data.table(
  day = seq.Date(as.Date("1984-01-01"), 
                 by='month', length.out=length(z)),
  z=z  
)

ggplot(tmp.data, aes(day, z)) + 
  geom_line(col='skyblue') +
  geom_point(col='steelblue') +
  ggtitle("monthly stock index") +
  theme_bw() +
  theme(plot.title = element_text(size=20),
        axis.title = element_blank())
```

![월별 주식지수 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_60_0.png)

### 1모수 이중지수평활

```r
# alpha, beta 동일하게 설정
fit4 = holt(stock, alpha=0.6, beta=0.6, h=6) 

plot(fit4, ylab="", xlab="", lty=1, col="black",
     main="Stock index and double exponential smoothing: alpha=beta=0.6")
lines(fitted(fit4), col="red", lty=2)
legend("topleft", lty=1:2, col=c("black","red"), c("Index", "Double"), bty = "n")
```

![이중지수평활 적용](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_66_0.png)

![이중지수평활 잔차](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_68_0.png)

### 최적 모수 추정

```r
fit5 = holt(stock, h=6)  # alpha, beta 자동 추정
fit5$model
```

```
Holt's method 

Call:
holt(y = stock, h = 6)

  Smoothing parameters:
    alpha = 0.9999 
    beta  = 0.1071 

  Initial states:
    l = 124.1137 
    b = 3.4954 

  sigma:  31.8609

     AIC     AICc      BIC 
1108.677 1109.343 1121.498
```

#### 📊 모수 추정 결과 해석
- **alpha = 0.9999**: 레벨 성분에 최근 관측값을 거의 100% 반영
- **beta = 0.1071**: 추세 성분은 완만하게 변화
- **AIC = 1108.677**: 모형 적합도 지표

```r
plot(fit5, ylab="Index", xlab="year", lty=1, col="black",
     main="Intermediate Goods Shipment Index and Double Exponential Smoothing Value : alpha, beta estimated")
lines(fitted(fit5), col="red", lty=2)
legend("topleft", lty=1:2, col=c("black","red"), c("Index", "Double"))
```

![최적 모수 이중지수평활](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_74_0.png)

![최적 모수 잔차 분석](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_75_0.png)

## 6. Holt-Winters 방법(계절성 평활)

### 항공사 승객 데이터

```r
z <- scan("koreapass.txt")
pass <- ts(z, start=c(1981,1), frequency=12) 

plot.ts(pass)
```

![항공사 승객 데이터](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_78_0.png)

### 가법 모형(Additive Model)

계절 변동의 크기가 일정한 경우 사용합니다.

```r
fit6 = hw(pass, seasonal="additive", h=12)
fit6$model
```

```
Holt-Winters' additive method 

Call:
hw(y = pass, h = 12, seasonal = "additive")

  Smoothing parameters:
    alpha = 0.5963 
    beta  = 0.0177 
    gamma = 1e-04 

  Initial states:
    l = 129763.5823 
    b = 799.4119 
    s = -29016.96 -855.2679 13617.18 -4624.62 37697.04 16768.22
           9720.317 14214.29 317.4589 -5632.175 -31459.7 -20745.79

  sigma:  11509.58

     AIC     AICc      BIC 
2542.155 2548.955 2587.751
```

```r
plot(fit6, ylab="passenger", xlab="year", lty=1, col="blue",
     main="Winters Additive Seasonal Exponential plot of Smooth Material")
lines(fit6$fitted, col="red", lty=2)
legend("topleft", lty=1:2, col=c("blue","red"), c("Pass", "Additive"), bty = "n")
```

![Holt-Winters 가법모형](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_84_0.png)

![가법모형 잔차](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_85_0.png)

### 승법 모형(Multiplicative Model)

계절 변동의 크기가 시간에 따라 변하는 경우 사용합니다.

```r
fit7= hw(pass, seasonal="multiplicative", h=12) 
fit7$model
```

```
Holt-Winters' multiplicative method 

Call:
hw(y = pass, h = 12, seasonal = "multiplicative")

  Smoothing parameters:
    alpha = 0.4231 
    beta  = 0.1209 
    gamma = 0.0014 

  Initial states:
    l = 128311.2252 
    b = 914.1471 
    s = 0.8553 0.9918 1.0572 0.9742 1.1913 1.0935
           1.0469 1.0668 0.9952 0.9699 0.8389 0.9189

  sigma:  0.051

     AIC     AICc      BIC 
2506.102 2512.902 2551.699
```

#### 📊 가법 vs 승법 모형 비교
- **가법모형 AIC**: 2542.155
- **승법모형 AIC**: 2506.102  
- AIC가 낮은 승법모형이 더 적합함

```r
plot(fit7, ylab="passenger", xlab="year", lty=1, col="blue",
     main="Winters Time series plot of multiplicative seasonal exponential smoothed data")
lines(fit7$fitted, col="red", lty=2)
legend("topleft", lty=1:2, col=c("blue","red"), c("Pass", "Multiplicative"), bty = "n")
```

![Holt-Winters 승법모형](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_90_0.png)

![승법모형 잔차](@/assets/images/2022-10-5-시계열자료분석-학습2_files/2022-10-5-시계열자료분석-학습2_92_0.png)

### 잔차 자기상관 검정

```r
# 가법모형 잔차 검정
dwtest(lm(resid(fit6)~1), alternative = 'two.sided')
```

```
	Durbin-Watson test

data:  lm(resid(fit6) ~ 1)
DW = 2.0779, p-value = 0.683
alternative hypothesis: true autocorrelation is not 0
```

```r
# 승법모형 잔차 검정
dwtest(lm(resid(fit7)~1), alternative = 'two.sided')
```

```
	Durbin-Watson test

data:  lm(resid(fit7) ~ 1)
DW = 1.6079, p-value = 0.03973
alternative hypothesis: true autocorrelation is not 0
```

#### 📊 잔차 검정 결과 해석
- **가법모형**: p-value = 0.683 > 0.05, 자기상관 없음 (양호)
- **승법모형**: p-value = 0.0397 < 0.05, 자기상관 존재 (추가 모델링 필요)

## 7. 평활법 선택 가이드

### 💡 적절한 방법 선택 기준

데이터의 특성에 따라 적절한 평활법을 선택해야 합니다:

#### ✅ 레벨만 있는 경우
- **단순지수평활(SES)** 사용
- 평균 수준 주변에서 랜덤하게 변동하는 데이터

#### ✅ 추세가 있는 경우  
- **이중지수평활(Holt)** 사용
- 지속적인 증가/감소 패턴이 있는 데이터

#### ✅ 계절성이 있는 경우
- **Holt-Winters** 사용
- **가법모형**: 계절 변동 크기가 일정
- **승법모형**: 계절 변동 크기가 시간에 따라 변함

### 📊 모형 평가 지표

- **MSE (Mean Squared Error)**: 예측 오차의 제곱평균
- **MAE (Mean Absolute Error)**: 예측 오차의 절댓값 평균  
- **MAPE (Mean Absolute Percentage Error)**: 상대적 오차율
- **AIC/BIC**: 모형 복잡도를 고려한 정보 기준

## 8. 실무 활용 팁

### ⚠️ 주의사항

1. **평활상수 선택**: 너무 높으면 노이즈에 민감, 너무 낮으면 반응 둔화
2. **모형 적합성**: 잔차 분석을 통한 모형 타당성 검증 필수
3. **예측 구간**: 시간이 지날수록 불확실성 증가

### 📈 성능 개선 방법

- **교차검증**: 시계열 분할을 통한 성능 평가
- **모수 최적화**: 격자탐색이나 최적화 알고리즘 활용
- **잔차 진단**: 자기상관, 정규성, 등분산성 검정

## 마무리

평활법은 시계열 분석의 기초이면서도 실무에서 매우 유용한 도구입니다. 데이터의 특성을 정확히 파악하고 적절한 방법을 선택하는 것이 성공적인 분석의 핵심입니다.

**다음 포스팅에서는 ARIMA 모형과 Box-Jenkins 방법론**을 다룰 예정입니다. 시계열 모델링의 더 고급 기법들을 함께 탐구해보겠습니다! 📊✨