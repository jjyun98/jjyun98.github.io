---
author: Jo YunHo
pubDatetime: 2022-11-10T00:00:00Z
modDatetime: 2022-10-12T00:00:00Z
title: 시계열 자료분석 - ACF, PACF, 백색잡음의 이해 (4)
slug: "timeseries-acf-pacf-analysis"
featured: false
draft: false
tags:
  - R
  - 시계열분석
description: "시계열 분석에서 ACF와 PACF를 활용한 정상 시계열 판별과 MA(1) 모델의 특성 분석"
---

## Table of contents

## 개요

시계열 분석에서 **자기상관함수(ACF)**와 **편자기상관함수(PACF)**는 시계열의 특성을 파악하는 핵심 도구입니다. 이번 포스팅에서는 정상 시계열의 생성부터 MA(1) 모델의 특성, 백색잡음 검증까지 실습을 통해 알아보겠습니다.

## 1. 환경 설정 및 라이브러리 로드

```r
library('tidyverse')
library('forecast')
library('gridExtra')
library('data.table')
options(repr.plot.width = 6, repr.plot.height = 4)
```

## 2. 정상 시계열 생성

### 기본 정상 시계열

먼저 표준정규분포에서 200개의 관측값을 생성하여 정상 시계열을 만들어보겠습니다.

```r
z <- rnorm(200)

tmp.data <- data.frame(
    t = 1:length(z),
    z = z
)

ggplot(tmp.data, aes(t, z)) +
geom_line(col = 'steelblue') +
xlab("") + ylab("") +
geom_hline(yintercept = 0, lty = 2, col = 'grey') +
theme_bw()
```

![정상 시계열 생성](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_6_0.png)

**결과 해석**: 추세가 없고 분산이 일정한 시계열(정상 시계열)이 생성되었습니다. 다만 시도표만 보아서는 이것이 확실한 정상 시계열인지 판별하기 어렵습니다.

## 3. MA(1) 모델 시뮬레이션

### MA(1) 모델 정의

MA(1) 모델은 다음과 같이 정의됩니다:
- $z_t = \mu + e_t - \theta \cdot e_{t-1}$
- $e_t \sim WN(0, \sigma^2)$

### MA(1) 시뮬레이션 함수

```r
ma1_sim <- function(mu, theta, sigma, n){
    z <- rep(0, n*2)
    e <- rnorm(n*2, 0, sigma^2)
    z[1] <- mu + e[1] # 첫 번째는 손으로 입력
    
    for(k in 2:(n*2)){
        z[k] <- mu + e[k] - theta*e[k-1]
    }
    
    return(z[-(1:n)]) # 200개 만든 것 중 뒤의 100개만 선택
}
```

### 다양한 θ 값으로 MA(1) 생성

```r
tmp.data <- data.frame(
    t = 1:100,
    z1 = ma1_sim(10, 0.7, 2, 100),
    z2 = ma1_sim(10, 0.3, 2, 100),
    z3 = ma1_sim(10, -0.3, 2, 100),
    z4 = ma1_sim(10, -0.7, 2, 100)
)

tmp.data %>% head()
```

```
  t       z1       z2       z3       z4
1 1 12.02023 11.35643 12.44436  8.67498
2 2  3.03434 13.92068 15.32895 16.14506
3 3  8.44293 25.28467 14.49049 22.83572
4 4  9.30893  4.91282 14.48045  8.63875
5 5 10.54674 15.29711 15.17240  4.11869
6 6 12.66506 12.36769 11.78080 14.84745
```

### 시계열 플롯 비교

```r
theta <- c(0.7, 0.3, -0.3, -0.7)
for(k in 1:4){
    plot(tmp.data$t, tmp.data[, (k+1)], type = 'l',
         col = 'steelblue',
         main = paste0(' theta = ', theta[k]),
         xlab = 't',
         ylab = 'z')
    abline(h = 10, col = 'grey', lty = 2)
}
```

![θ = 0.7](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_13_0.png)

![θ = 0.3](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_13_1.png)

![θ = -0.3](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_13_2.png)

![θ = -0.7](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_13_3.png)

**분석 결과**: 
- θ의 절댓값이 클수록 변동폭이 커집니다
- θ = 0.3이 가장 안정적이고, θ = ±0.7일 때 변동이 큽니다
- 시계열 플롯만으로는 MA(1) 모델인지 판별할 수 없습니다

## 4. ACF(자기상관함수) 분석

### 각 θ 값에 대한 ACF

```r
for(k in 1:4){
    acf(tmp.data[, (k+1)],
        main = paste0(' theta = ', theta[k]))
}
```

![θ = 0.7 ACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_16_0.png)

![θ = 0.3 ACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_16_1.png)

![θ = -0.3 ACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_16_2.png)

![θ = -0.7 ACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_16_3.png)

**ACF 해석**:
- 파란선은 $H_0: \rho = 0$의 임계치선 ($2/\sqrt{n}$, n=100일 때 약 0.2)
- MA(1) 모델의 특징: **첫 번째 시차(lag 1)에서만 유의한 상관관계**, 나머지는 모두 0
- θ > 0일 때 양의 상관관계, θ < 0일 때 음의 상관관계를 보입니다

## 5. PACF(편자기상관함수) 분석

### 각 θ 값에 대한 PACF

```r
for(k in 1:4){
    pacf(tmp.data[, (k+1)],
         main = paste0(' theta = ', theta[k]))
}
```

![θ = 0.7 PACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_20_0.png)

![θ = 0.3 PACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_20_1.png)

![θ = -0.3 PACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_20_2.png)

![θ = -0.7 PACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_20_3.png)

**PACF 해석**:
- PACF는 여러 시차에서 유의한 값을 보입니다
- 부호가 바뀌면서(사인 곡선 형태로) 점차 감소하는 패턴을 보입니다
- MA(1) 모델의 특징: PACF는 **점진적으로 감소**하는 패턴을 보입니다

## 6. 백색잡음(White Noise) 분석

### IID 정규분포 생성 및 분석

```r
z <- rnorm(100)

tmp.data <- data.table(
    t = 1:length(z),
    z = z
)
```

### 통합 시각화

```r
p1 <- ggplot(tmp.data, aes(t, z)) +
geom_line(col = 'steelblue', lwd = 1) +
xlab("") + ylab("") +
ggtitle('Time series plot of iid N(0,1)') +
geom_hline(yintercept = 0, lty = 2, col = 'grey') +
theme_bw()

p2 <- ggAcf(z) +
theme_bw() + ylim(-1, 1) +
theme(plot.title = element_blank())

p3 <- ggPacf(z) +
theme_bw() + ylim(-1, 1) +
theme(plot.title = element_blank())

grid.arrange(p1, p2, p3, nrow = 2,
             layout_matrix = rbind(c(1, 1),
                                   c(2, 3)))
```

![백색잡음 통합 분석](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_26_0.png)

**백색잡음의 특징**:
- ACF와 PACF 모두에서 거의 모든 시차가 임계치 내에 위치
- 이는 $\rho_k = 0$ (모든 k에 대해)임을 의미
- 잔차 검증에서 이러한 패턴이 나와야 적절한 모델로 판단됩니다

### 개별 그래프 확인

![백색잡음 시계열](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_27_0.png)

![백색잡음 ACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_27_1.png)

![백색잡음 PACF](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_27_2.png)

## 7. 주기성이 있는 시계열 분석

### 사인함수 시계열

```r
t <- 1:100
y <- sin(t*pi/3)  # 주기가 6인 사인함수

layout(matrix(c(1, 1, 2, 3), 2, 2, byrow = TRUE))
plot(t, y, type = 'l',
     col = 'steelblue',
     xlab = 't',
     ylab = 'z')
abline(h = 0, col = 'grey', lty = 2)

acf(y)
pacf(y)
```

![사인함수 시계열 분석](@/assets/images/2022-10-12-시계열자료분석-학습4_files/2022-10-12-시계열자료분석-학습4_35_0.png)

**주기성 시계열의 특징**:
- **ACF**: 주기가 6인 사인 패턴을 명확히 보여줍니다
- 6 간격마다 상관계수가 1에 가깝고, 3 간격마다 부호가 바뀝니다
- **PACF**: 6을 넘어가는 시점부터는 거의 모든 값이 0에 가깝습니다
- 이는 한 주기가 지나면 이전 과정으로 설명이 완료되기 때문입니다

## 8. 모델 식별 가이드라인

### ACF와 PACF 패턴으로 모델 식별

| 모델 유형 | ACF 패턴 | PACF 패턴 |
|-----------|----------|-----------|
| **AR(p)** | 점진적 감소 | p차 이후 절단 |
| **MA(q)** | q차 이후 절단 | 점진적 감소 |
| **ARMA(p,q)** | 점진적 감소 | 점진적 감소 |
| **백색잡음** | 모든 시차에서 0 | 모든 시차에서 0 |

### 실무 적용 팁

1. **시계열 플롯 확인**: 추세, 계절성, 이상치 파악
2. **정상성 검증**: 단위근 검정, 차분 필요성 판단  
3. **ACF/PACF 분석**: 모델 유형 및 차수 결정
4. **모델 적합 후 진단**: 잔차의 백색잡음 검증

## 마무리

ACF와 PACF는 시계열 모델 식별의 핵심 도구입니다. MA(1) 모델에서 ACF는 첫 번째 시차에서만 유의하고 PACF는 점진적으로 감소하는 특성을 확인했습니다. 백색잡음에서는 두 함수 모두 임계치 내에 위치하여 독립성을 보여줍니다.

다음 시간에는 **AR 모델의 특성과 ARMA 모델의 식별 방법**을 다뤄보겠습니다. 📊