---
author: Jo YunHo
pubDatetime: 2022-11-20T00:00:00Z
modDatetime: 2022-10-14T00:00:00Z
title: 시계열 자료분석 - AR, MA, ARMA 모델의 시뮬레이션과 식별 (5)
slug: "timeseries-ar-ma-arma-models"
featured: false
draft: false
tags:
  - R
  - 시계열분석
description: "AR, MA, ARMA 모델의 시뮬레이션 방법과 ACF, PACF를 통한 모델 식별 기법"
---

## Table of contents

## 개요

시계열 분석에서 **AR(자기회귀)**, **MA(이동평균)**, **ARMA(자기회귀 이동평균)** 모델은 정상 시계열을 모델링하는 핵심 방법론입니다. 이번 포스팅에서는 각 모델의 시뮬레이션부터 ACF, PACF를 통한 식별 방법까지 체계적으로 알아보겠습니다.

## 1. 환경 설정

```r
library('tidyverse')
library('gridExtra')
library('forecast')
options(repr.plot.width = 6, repr.plot.height = 4)
```

## 2. AR(자기회귀) 모델

### AR(1) 모델 시뮬레이션 함수

AR(1) 모델을 직접 구현해보겠습니다. 초기값의 영향을 줄이기 위해 n개보다 100개 더 생성한 후 앞의 100개를 제거합니다.

```r
sim_ar1 <- function(n, phi, mu, sigma){
    z <- rep(mu, n + 100)
    for(k in 2 : (n + 100)){
        z[k] <- mu + phi*(z[k-1] - mu) + rnorm(1, 0, sigma)
    }
    return(z[-(1:100)])  # 앞의 100개 제거
}
```

### AR(1) 시뮬레이션 결과

```r
n <- 100
phi <- -0.5
mu <- 0
sigma <- 1

tmp.data <- data.frame(
    t = 1:n,
    z = sim_ar1(n, phi, mu, sigma)
)

p1 <- ggplot(tmp.data, aes(t, z)) +
geom_line(col = 'steelblue', lwd = 1.2) +
geom_hline(yintercept = 0, lty = 2, col = 'grey') +
ggtitle(paste0("Time series plot : AR(1) - phi = ", phi)) +
theme_bw() +
theme(axis.title.y = element_blank())

p2 <- ggAcf(tmp.data$z, lwd = 1.5) +
theme_bw() + ylim(-1, 1) + 
ggtitle("SACF") +
theme(axis.title.y = element_blank())

p3 <- ggPacf(tmp.data$z, lwd = 1.5) +
theme_bw() + ylim(-1, 1) +
ggtitle('SPACF') +
theme(axis.title.y = element_blank())

grid.arrange(p1, p2, p3, nrow = 2,
             layout_matrix = rbind(c(1, 1),
                                   c(2, 3)))
```

![AR(1) 모델 분석](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_12_0.png)

**결과 해석**: 
- φ = -0.5인 AR(1) 모델에서 0을 기준으로 대칭적으로 움직이는 정상 시계열이 생성됨
- PACF에서 첫 번째 시차만 유의하고 나머지는 0에 가까운 값을 보임 (이론적 특성)
- 표본 크기가 100개라서 약간의 오차가 있을 수 있음

### 일반화된 AR(p) 시뮬레이션 함수

```r
sim_ar <- function(n, mu, phi, sigma){
    p <- length(phi) # 차수
    z <- rep(mu, (100 + n))
    delta <- (1-sum(phi))*mu 
    
    for(k in (length(phi) + 1) : (n + 100)){
        z[k] <- delta + sum(z[(k-1):(k-p)]*phi) + rnorm(1, 0, sigma)
    }
    return(z[-(1:100)])
}
```

### AR(1) 패키지 사용 예제

```r
z <- arima.sim(n = 100,
               list(order = c(1, 0, 0), ar = 0.5), # order = c(p, d, q)
               rand.gen = rnorm)

plot.ts(z)
acf(z, lag.max = 24)
pacf(z, lag.max = 24)
```

![AR(1) 패키지 결과 - 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_25_0.png)

![AR(1) 패키지 결과 - ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_25_1.png)

![AR(1) 패키지 결과 - PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_25_2.png)

### AR(2) 모델 예제

```r
z <- arima.sim(n = 100,
               list(order = c(2, 0, 0), ar = c(0.5, -0.4)),
               rand.gen = rnorm)

plot.ts(z)
acf(z, lag.max = 24)
pacf(z, lag.max = 24)
```

![AR(2) 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_27_0.png)

![AR(2) ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_27_1.png)

![AR(2) PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_27_2.png)

**AR(2) 모델 특징**: PACF에서 2개의 시차까지만 유의하고 이후는 0에 가까운 값을 보임

### AR(2) ggplot 시각화

```r
p1 <- ggplot(data.frame(t = 1:length(z), z = as.numeric(z)), aes(t, z)) +
geom_line(col = 'steelblue', lwd = 1.2) +
geom_hline(yintercept = 0, lty = 2, col = 'grey') +
ggtitle("Time series plot : AR(2)") +
theme_bw() +
theme(axis.title.y = element_blank())

p2 <- ggAcf(z, lwd = 1.5) +
theme_bw() + ylim(-1, 1) +
ggtitle("SACF") +
theme(axis.title.y = element_blank())

p3 <- ggPacf(z, lwd = 1.5) +
theme_bw() + ylim(-1, 1) +
ggtitle("SPACF") +
theme(axis.title.y = element_blank())

grid.arrange(p1, p2, p3, nrow = 2,
             layout_matrix = rbind(c(1, 1),
                                   c(2, 3)))
```

![AR(2) ggplot 시각화](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_29_0.png)

## 3. MA(이동평균) 모델

### MA(q) 시뮬레이션 함수

MA 모델은 $Z_t = \epsilon_t - \theta_1 \cdot \epsilon_{t-1} + ... + \theta_q \cdot \epsilon_{t-q}$ 형태입니다.

```r
sim_ma <- function(n, mu, theta, sigma){
    q <- length(theta)
    ep <- rnorm(n + 100, 0, sigma)
    z <- ep
    
    for(k in (q+1) : (n + 100)){
        z[k] <- mu + ep[k] - sum(ep[(k-1):(k-q)]*theta)
    }
    return(z[-(1:100)])
}
```

### MA(1) 직접 구현 결과

```r
z <- sim_ma(100, 0, theta = 0.9, 1)

ts.plot(z)
acf(z)
pacf(z)
```

![MA(1) 직접 구현 - 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_36_0.png)

![MA(1) 직접 구현 - ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_36_1.png)

![MA(1) 직접 구현 - PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_36_2.png)

**MA(1) 특징**: ACF에서 첫 번째 시차만 유의하고 나머지는 0에 가까운 값을 보임

### MA(1) 패키지 사용

⚠️ **주의사항**: R의 `arima.sim` 함수는 MA 계수의 부호가 일반적인 정의와 반대이므로 `-` 부호를 붙여야 합니다.

```r
z <- arima.sim(n = 100,
               list(order = c(0,0,1), ma = -0.9), # 부호 주의!
               rand.gen = rnorm)

ts.plot(z)
acf(z, lag.max = 24)
pacf(z, lag.max = 24)
```

![MA(1) 패키지 - 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_40_0.png)

![MA(1) 패키지 - ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_40_1.png)

![MA(1) 패키지 - PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_40_2.png)

### MA(2) 모델 예제

```r
z <- arima.sim(n = 100,
               list(order = c(0,0,2), ma = c(0.5, -0.2)),
               rand.gen = rnorm)

ts.plot(z)
acf(z, lag.max = 20)
pacf(z, lag.max = 20)
```

![MA(2) 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_42_0.png)

![MA(2) ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_42_1.png)

![MA(2) PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_42_2.png)

**MA(2) 특징**: ACF에서 2차 시차까지만 유의하고 이후는 0에 가까운 값을 보임

## 4. ARMA(자기회귀 이동평균) 모델

### ARMA(1,1) 모델 시뮬레이션

ARMA 모델은 AR과 MA의 특성을 모두 포함합니다.

```r
z <- arima.sim(n = 10000, list(order = c(1, 0, 1),
                               ar = -0.5, ma = -0.3),
               rand.gen = rnorm)

plot.ts(z)
acf(z, lag.max = 20)
pacf(z, lag.max = 20)
```

![ARMA(1,1) 시계열](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_45_0.png)

![ARMA(1,1) ACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_45_1.png)

![ARMA(1,1) PACF](@/assets/images/2022-10-14-시계열자료분석-학습5_files/2022-10-14-시계열자료분석-학습5_45_2.png)

**ARMA(1,1) 특징**: 
- **ACF와 PACF 모두 점진적으로 감소**하는 패턴을 보임
- ACF로만 보면 MA(5) 정도, PACF로만 보면 AR(4) 정도로 보일 수 있음
- 하지만 ARMA(1,1)로 모델링하면 추정해야 할 모수가 2개로 줄어들어 효율적

## 5. 모델 식별 가이드라인

### ACF/PACF 패턴에 따른 모델 식별

| 모델 | ACF 패턴 | PACF 패턴 |
|------|----------|-----------|
| **AR(p)** | 점진적/지수적 감소 | p차 이후 절단 (0) |
| **MA(q)** | q차 이후 절단 (0) | 점진적/지수적 감소 |
| **ARMA(p,q)** | 점진적/지수적 감소 | 점진적/지수적 감소 |

### 실무 적용 전략

1. **시계열 플롯 확인**: 정상성, 추세, 계절성 파악
2. **ACF/PACF 분석**: 
   - 절단 패턴 → 순수 AR 또는 MA 모델
   - 두 함수 모두 점진적 감소 → ARMA 모델 검토
3. **정보기준(AIC, BIC) 비교**: 여러 후보 모델 중 최적 선택
4. **잔차 진단**: 백색잡음 가정 검증

### 모델 선택 시 고려사항

- **간결성 원칙**: 더 적은 모수로 비슷한 성능을 얻을 수 있다면 간단한 모델 선택
- **해석 가능성**: 실무에서는 모델의 해석이 중요할 수 있음
- **예측 성능**: 검증 데이터를 통한 예측 성능 비교
- **모수 안정성**: 추정된 모수가 정상성 조건을 만족하는지 확인

## 마무리

AR, MA, ARMA 모델은 시계열 분석의 기본 도구입니다. 각 모델의 특성을 ACF/PACF를 통해 구별할 수 있으며, 실제 데이터에서는 여러 후보 모델을 비교하여 최적 모델을 선택하는 것이 중요합니다.

다음 시간에는 **비정상 시계열을 위한 ARIMA 모델과 계절 성분을 포함한 SARIMA 모델**을 다뤄보겠습니다. 📈