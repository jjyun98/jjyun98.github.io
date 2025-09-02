---
author: Jo YunHo
pubDatetime: 2022-10-02T00:00:00Z
modDatetime: 2025-01-17T00:00:00Z
title: 시계열 자료분석 - 불규칙, 추세성분, 주기성분의 이해 (1)
slug: "timeseries-analysis-part1"
featured: false
draft: false
tags:
  - R
  - 시계열분석
  - Statistics
description: "시계열 자료의 불규칙성분, 추세성분, 주기성분에 대한 기본 개념과 R을 활용한 분석 방법을 학습합니다."
---

## Table of contents

## 1. 환경 설정 및 라이브러리 로드

```r
library('data.table')
library('tidyverse')
library('gridExtra') # grid.arrange 사용해주는(그림 한 화면에 그려주는)
library('lmtest') # dwtest
options(repr.plot.width = 6, repr.plot.height = 4)
```

## 2. 불규칙 성분

### 기본 불규칙 성분 생성

```r
set.seed(1245)
n = 100
z <- 5000 + 20*rnorm(n)
z %>% head
```

같은 방법으로도 생성 가능합니다:

```r
set.seed(1245)
rnorm(n, 5000, 20) %>% head
```

### 불규칙 성분의 특성

평균이 0인 기본 정규분포:

```r
plot(rnorm(n), type = 'l')
abline(h = 0, lty = 2)
```

![불규칙성분 기본](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_8_0.png)

20을 곱하면 표준편차가 ±20 정도 증가:

```r
plot(20*rnorm(n), type = 'l')
abline(h = 0, lty = 2)
```

![불규칙성분 표준편차 증가](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_10_0.png)

5000을 더하면 평균도 5000 증가:

```r
plot(5000 + 20*rnorm(n), type = 'l')
abline(h = 5000, lty = 2)
```

![불규칙성분 평균 이동](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_12_0.png)

### 시계열 객체 생성

```r
z.ts <- ts(z,
           start = c(1980,1), # 1980년 1월부터 시작
           frequency = 12) # 12면 월별로, 4면 분기별로, 365면 일별로
```

ts 객체의 다양한 속성들:

```r
z.ts %>% cycle    # 주기 알려줌
z.ts %>% time     # 시간 정보
z.ts %>% frequency # 주기성
z.ts %>% start    # 시작 시점
z.ts %>% end      # 종료 시점
z.ts %>% tsp      # 시작, 끝, 주기 알려줌
```

### 시계열 시각화

ts의 장점: 기본적으로 linetype = l로 해줌, 부가 옵션들이 더 나옴

```r
ts.plot(z.ts, xlab = "date", ylab = "zt",
       main ="irregular elements")
abline(h = 5000)
```

![불규칙성분 시계열 플롯](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_22_0.png)

### ggplot을 활용한 시각화

```r
tmp.data <- data.table(Time = seq.Date(as.Date("1980/1/1"),
                                       by = "month",
                                       length.out = 100),
                       z = z)

ggplot(tmp.data, aes(Time, z)) +
geom_line(col = 'steelblue') +
geom_hline(yintercept = 5000, col = 'grey80', lty = 2) +
ggtitle("irregular elements") +
scale_x_date(date_breaks = "year", date_labels = "%Y") +
theme_bw() +
theme(text = element_text(size = 16),
      axis.title = element_blank())
```

![불규칙성분 ggplot](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_27_0.png)

## 3. 추세성분

하는 방법: 일단 추세를 하나 그리고 노이즈를 더해준다.

```r
set.seed(1234)
n = 100
t <- 1:n
x <- 0.5*t # 추세
z <- 0.5*t + rnorm(n) # 추세 + 오차
```

기본 추세:

```r
plot(x, type = 'l')
```

![기본 추세](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_31_0.png)

기본 추세 + 노이즈:

```r
plot(z, type = 'l')
```

![추세 플러스 노이즈](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_33_0.png)

### 시계열 객체로 변환 및 비교

```r
z.ts <- ts(z, start = c(1980, 1), frequency = 12)
x.ts <- ts(x, start = c(1980, 1), frequency = 12)
```

추세선과 (추세 + 노이즈)를 함께 플롯:

```r
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

## 4. 계절성분

### 기본 계절성분 생성

```r
n = 120 # 계절성분 120개
t <- 1:n
a <- rnorm(n,0,1) # 오차
```

기본 오차항:

```r
plot(a, type = 'l')
```

![기본 오차항](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_42_0.png)

앞에 0.8 곱해주면 분산을 줄여줌(오차를 줄이니까), 10 더한 것은 평균 10 증가 → 불규칙성분 만들기:

```r
plot(10 + 0.8*a, type = 'l')
```

![불규칙성분 생성](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_44_0.png)

### 삼각함수를 이용한 주기성

주기가 있는 사인함수:

```r
plot(sin((2*pi*t)/12),type = 'l')
```

![사인함수 주기성](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_46_0.png)

z는 위의 sin함수에 노이즈가 더해진 형태:

```r
z <- 10 + 3*sin((2*pi*t)/12) + 0.8*a

z.ts <- ts(z,
           start = c(1985, 1),
           frequency = 12)
plot(z.ts,
     xlab = "date",
     ylab = "zt",
     main = "seasonal component")
```

![계절성분 시계열](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_50_0.png)

### 다양한 주기의 삼각함수

```r
x <- seq(0, 48, 0.01)
s <- 12
```

Sin 함수 (주기 12):

```r
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![Sin 함수 주기 12](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_54_0.png)

Cos 함수 (주기 12):

```r
plot(x, cos(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('cos::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![Cos 함수 주기 12](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_54_1.png)

### 삼각함수 조합

sin, cos 두 함수 더한 함수:

```r
plot(x, sin(2*pi*x/s) + cos(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin+cos::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
abline(v = seq(1.5, 48, by = s), lty = 2)
```

![Sin+Cos 조합 1](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_56_0.png)

각각 weight를 다르게 해 반영한 함수:

```r
plot(x, 1.5*sin(2*pi*x/s) + 0.7*cos(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin+cos::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = s), lty = 2)
abline(v = seq(1.5, 24, by = s), lty = 2)
```

![Sin+Cos 조합 2](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_56_1.png)

### 주기를 바꿔가면서 삼각함수 비교

주기 12:

```r
s <- 12
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![주기 12](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_59_0.png)

주기 6:

```r
s <- 6
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![주기 6](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_59_1.png)

주기는 6 그대로인데 weight를 다르게하면 또 다른 다양한 형태가 나온다:

```r
plot(x, sin(2*pi*x/12) + sin(2*pi*x/6), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![복합 주기 1](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_61_0.png)

```r
plot(x, 2*sin(2*pi*x/12) + 0.8*sin(2*pi*x/6), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![복합 주기 2](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_61_1.png)

### 복합 주기성분 분석

주기 3개 만들고 3개 더해서 그리기. 주기 12, 6, 3:

```r
s <- 12
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = s), lty = 2)
```

![주기 12 단일](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_63_0.png)

```r
s <- 6
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 48, by = s), lty = 2)
```

![주기 6 단일](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_63_1.png)

```r
s <- 3
plot(x, sin(2*pi*x/s), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin::', "frequncy=", s))
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = s), lty = 2)
```

![주기 3 단일](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_63_2.png)

```r
plot(x, sin(2*pi*x/12) + sin(2*pi*x/6) + sin(2*pi*x/3), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin + sin + sin::', "frequncy=", 12))
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = s), lty = 2)
```

![주기 조합](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_63_3.png)

### 복잡한 주기성분 조합

여러개 섞으면서 그리기. 마지막 거는 추세까지 섞음:

```r
plot(x, sin(2*pi*x/12) + sin(2*pi*x/6) + sin(2*pi*x/3), type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = paste0('sin + sin + sin::', "frequncy=", 12))
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = 12), lty = 2)
```

![주기 조합 1](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_65_0.png)

sin과 cos 모두 포함:

```r
y <- sin(2*pi*x/12) + sin(2*pi*x/6) + sin(2*pi*x/3) + cos(2*pi*x/12) + cos(2*pi*x/6) + cos(2*pi*x/3)

plot(x, y, type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = "s+s+s+c+c+c : frequncy=, 12")
abline(h = 0, lty = 2)
abline(v = seq(0, 24, by = 12), lty = 2)
```

![Sin Cos 조합](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_65_1.png)

추세까지 추가:

```r
y2 <- x*0.5 + sin(2*pi*x/12) + sin(2*pi*x/6) +sin(2*pi*x/3) + cos(2*pi*x/12) + cos(2*pi*x/6) + cos(2*pi*x/3)

plot(x, y2, type = 'l', col = 'steelblue', lwd = 2,
     xlab = "", ylab = "", main = "s+s+s+c+c+c frequency=12")
abline(a = 0, b = 0.5, lty = 2)
abline(v = seq(0, 24, by = 12), lty = 2)
```

![추세 포함 조합](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_65_2.png)

### ggplot을 활용한 주기성분 분석

```r
n <- 100
t <- 1:n
a1 <- -0.8 # 진폭
a2 <- 1.4 # 진폭
phi1 <- pi/3
phi2 <- 3*pi/4
first <- a1*sin(pi*t/6 + phi1) # 첫 번째 주기성분(주기 6)
second <- a2*sin(pi*t/3 + phi2) # 두 번째 주기성분(주기 3)

dt <- data.table(t = t,
                 first = first, # 첫 번째 주기 성분
                 second = second,# 두 번째 주기 성분
                 z = first + second)# 그 두 개 더한 성분

p1 <- ggplot(dt, aes(t, first)) + geom_line(col = 'skyblue', size = 1) +
geom_point(col = 'steelblue', size = 1) +
ylim(-2.5, 2) + xlab("") +
scale_x_continuous(breaks = seq(1, 100, by = 12)) +
theme_bw()

p2 <- ggplot(dt, aes(t, second)) + geom_line(col = 'skyblue', size = 1) +
geom_point(col = 'steelblue', size = 1) +
ylim(-2.5, 2) + xlab("") +
scale_x_continuous(breaks = seq(1, 100, by = 12)) +
theme_bw()

p3 <- ggplot(dt, aes(t, z)) + geom_line(col = 'skyblue', size = 1) +
geom_point(col = 'steelblue', size = 1) +
ylim(-2.5, 2) + xlab("") +
scale_x_continuous(breaks = seq(1, 100, by = 12)) +
theme_bw()
```

첫 번째 주기성분:

![첫 번째 주기성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_68_0.png)

두 번째 주기성분:

![두 번째 주기성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_68_1.png)

조합된 주기성분:

![조합된 주기성분](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_68_2.png)

전체 그리드 배열:

```r
grid.arrange(p1, p2, p3, nrow = 3)
```

![주기성분 그리드](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_69_0.png)

## 5. 실제 데이터 활용

### 백화점 매출액 - 지시함수

```r
z <- scan("depart.txt")

dep <- ts(z, frequency = 12, start = c(1984, 1))
plot(dep)
```

![백화점 매출액 원본](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_72_0.png)

매출액이 증가하는 추세가 보임. 계절성도 있어보임(특히 1년주기). 또 점점 분산이 증가하는 이분산성을 보이는데 따라서 로그 변환을 해준다.

### 데이터 전처리

```r
tmp.data <- data.table(
    day = seq.Date(as.Date("1984-01-01"),
                   by = 'month', length.out = length(z)),
    z = z
    )

tmp.data[, lndep := log(z)] # 로그변환
tmp.data[, y := as.factor(as.integer(cycle(dep)))] # factor쓰우는 게 그냥 넣으면 그대로 안 받아들여져서
tmp.data[, trend := 1:length(z)]
```

### 원본 vs 로그변환 비교

```r
p1 <- ggplot(tmp.data, aes(day, z)) + 
geom_line(col = 'skyblue') +
geom_point(col = 'steelblue') +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
labs(title = "monthly department store sales TimeSeries plot") +
theme_bw() +
theme(axis.title = element_blank())

p2 <- ggplot(tmp.data, aes(day, lndep)) + 
geom_line(col = 'skyblue') +
geom_point(col = 'steelblue') +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
labs(title = "monthly department store sales TimeSeries plot after log transformation") +
theme_bw() +
theme(axis.title = element_blank())
```

원본 데이터:

![백화점 매출 원본](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_77_0.png)

로그 변환 후 (분산 폭이 줄어듦을 볼 수 있다):

![백화점 매출 로그변환](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_77_1.png)

비교 그래프:

```r
grid.arrange(p1, p2, nrow = 2)
```

![원본 vs 로그변환 비교](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_78_0.png)

## 6. 모형적합 (선형회귀)

### 지시함수를 사용한 모델링

지시함수(Indicator)를 사용하고 싶다면, β₀ = 0 or Σβᵢ = 0 or β₁ = 0 셋 중 하나를 가정해야함.

#### 1) β₀ = 0 가정

```r
reg <- lm(lndep ~ 0 + trend + y, data = tmp.data)
summary(reg)
```

해석: coefficients에서 trend 보면 매월 0.0106603씩 증가함을 볼 수 있음. 로그 취한 것이기에 6.0641904, 6.0807995등은 각각 로그매출액의 1월의 평균, 2월의 평균을 의미(쭉쭉 12월까지). 미국은 블랙 프라이데이등으로 인해 12월 매출이 높은 것을 볼 수 있음, 또 높은 구간은 여름(7월)이고 이는 그래프에서도 나타남.

#### 2) β₁ = 0 가정

위 처럼 0 안 넣으면 자동으로 "β₁ = 0 가정" 들어간다:

```r
reg2 <- lm(lndep ~ trend + y, data = tmp.data)
summary(reg2)
contrasts(tmp.data$y)
```

해석: 이번에는 y12가 빠졌는데, 위에서 Σβᵢ = 0라고 했는데 이는 자연스레 β₁ + β₂ + β₃ ... + β₁₂ = 0임을 의미한다. 다시 말하면, β₁₂ = -(β₁ + β₂ + β₃ ... β₁₁)라는 말이 된다. Intercept(6.3260849) 전체 평균을 의미(월별 상관없이). 즉, 1월은 전체 평균(6.3260849) 대비 -0.2618944한 거 만큼 의미. 12월은 안나왔는데 12월은 위의 식처럼 평균대비 1~11을 다 빼면 나온다. 즉, 0.7843966 + 6.3260849 = 7.1104815 → 12월 거

#### 3) Σβᵢ = 0 가정

```r
reg3 <- lm(lndep ~ trend + y, data = tmp.data, contrasts = list(y = "contr.sum"))
summary(reg3)
```

coef 1~11 더한 거:

```r
c(-0.2618944,-0.2452853,0.0550335,-0.0307393,-0.1128456,-0.1063078, 0.2624217,-0.1418018 ,-0.2259700,0.0073656,0.0156268) %>% sum
```

### 모형 적합 결과 시각화

```r
tmp.data[, fitted_lndep := fitted(reg)]

ggplot(tmp.data, aes(day, lndep)) + 
geom_line(col = 'skyblue', lwd = 1) +
geom_line(aes(day, fitted_lndep), col = 'orange', lwd = 1) +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
labs(title = "department sales after log transformation vs estimated value") +
theme_bw() +
theme(axis.title = element_blank())
```

![모형 적합 결과](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_93_0.png)

파랑색이 원래, 노랑색이 적합된 값 의미

### 잔차그림

```r
tmp.data[, res := resid(reg)]

ggplot(tmp.data, aes(day, res)) + 
geom_line(col = 'skyblue') +
geom_point(col = 'steelblue') +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
geom_hline(yintercept = 0, col = 'grey', lty = 2) +
labs(title = "Time series plot of residuals") +
theme_bw() +
theme(axis.title = element_blank())
```

![잔차 그림 지시함수](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_97_0.png)

그림보면 양의 상관관계가 있어보임. 그래서 D.W test해보면:

```r
dwtest(reg, alternative = 'two.sided')
```

결과 독립성 확보 실패, 정확하게 1차 자기 상관관계가 있다. 특히 1차 양의 자기상관관계

## 7. 백화점 매출액 - 삼각함수

### 삼각함수 변수 생성

```r
tmp.data_sub <- tmp.data[,.(lndep, trend)]

# 데이터 생성 - 아래 12, 6, 4 .. 은 주기 의미
tmp.data_sub <- cbind(tmp.data_sub,
                      tmp.data_sub[, lapply(as.list(1:5),
                                            function(i) sin(2*pi*i/12*trend))])
                                            
names(tmp.data_sub)[-(1:2)] <- paste("sin", c(12, 6, 4, 3, 2.4), sep = "_")

tmp.data_sub <- cbind(tmp.data_sub,
                      tmp.data_sub[, lapply(as.list(1:5),
                                            function(i) cos(2*pi*i/12*trend))])
                                            
names(tmp.data_sub)[-(1:7)] <- paste("cos", c(12, 6, 4, 3, 2.4), sep = "_")
```

### 삼각함수 모형 적합

```r
reg_2 <- lm(lndep ~., data = tmp.data_sub)
summary(reg_2)
```

해석: sin_2.4 하나 유의하지 않다고 나옴(별표). 원래 sin, cos함수는 1부터 -1까지 갖는데 Estimate 나온 숫자만큼 진폭을 줄여주거나 늘려줌.

### 삼각함수 모형 시각화

```r
tmp.data_sub[, day := tmp.data$day]
tmp.data_sub[, fitted_lndep := fitted(reg_2)]

ggplot(tmp.data_sub, aes(day, lndep)) + 
geom_line(col = 'skyblue', lwd = 1) +
geom_line(aes(day, fitted_lndep), col = 'orange', lwd = 1) +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
theme_bw() +
theme(axis.title = element_blank())
```

![삼각함수 모형 적합](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_110_0.png)

### 삼각함수 모형 잔차분석

```r
tmp.data_sub[, res := resid(reg_2)]
ggplot(tmp.data_sub, aes(day, res)) +
geom_line(col = 'skyblue') +
geom_point(col = 'steelblue') +
scale_x_date(date_breaks = "1 year", date_labels = "%Y-%m") +
theme_bw() +
theme(axis.title = element_blank())
```

![삼각함수 모형 잔차](@/assets/images/2022-10-2-시계열자료분석-학습1_files/2022-10-2-시계열자료분석-학습1_112_0.png)

해석: 1차 음의 자기상관관계가 있다. 다른 것보다 등분산성의 문제가 있어보인다.(그저 보기에) = 독립성문제

### DW test

```r
dwtest(reg_2)
dwtest(reg_2, alternative = "two.side")
dwtest(reg_2, alternative = "less")
```

alternative 안 쓰면 default는 greater다. 첫 번째 4에 가까운 값이 나오면 two.side, less 둘 다 해보는게 좋음. two.side 결과보면 0이 아니다. → 기각. less 결과보면 '음의 상관관계가 있다'의 결과 p-value가 매우 작아 기각할 수 있다.

## 마무리

이번 포스팅에서는 시계열 자료의 기본 구성 요소인 불규칙성분, 추세성분, 주기성분에 대해 알아보았습니다. 

**주요 학습 내용:**
- 불규칙성분의 생성과 특성
- 추세성분을 포함한 시계열 모델링
- 삼각함수를 이용한 주기성분 분석
- 실제 백화점 매출 데이터를 통한 실습
- 지시함수와 삼각함수 방법론 비교
- 잔차 분석과 Durbin-Watson 검정

시계열 분석에서는 이러한 기본 성분들을 이해하고 적절한 모형을 선택하는 것이 중요합니다. 다음 파트에서는 더 고급 기법들을 다뤄보겠습니다.