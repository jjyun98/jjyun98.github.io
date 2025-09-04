---
author: Jo YunHo
pubDatetime: 2022-10-08T00:00:00Z
modDatetime: 2025-09-03T00:00:00Z
title: 시계열 분석 - 분해법과 이동평균 (3)
slug: "timeseries-decomposition"
featured: false
draft: false
tags:
  - R
  - 시계열분석
description: "시계열 데이터의 추세, 계절성, 불규칙 성분을 분해하는 방법론. 가법모형과 승법모형, 이동평균을 활용한 실무 분석법을 학습합니다."
---

> 📌 **시계열 분해법**  
> 시계열 데이터를 추세(Trend), 계절성(Seasonal), 불규칙(Irregular) 성분으로 분해하여 각 요소의 특성을 파악하고 예측 모델의 정확도를 높이는 기법입니다.

## Table of contents

## 개요

**시계열 분석**에서 가장 기본이 되는 것은 시계열 데이터의 구성 요소를 이해하는 것입니다. 대부분의 시계열 데이터는 다음 세 가지 성분으로 구성됩니다:

- **추세성분(Trend)**: 장기적인 증가 또는 감소 패턴
- **계절성분(Seasonal)**: 주기적으로 반복되는 패턴  
- **불규칙성분(Irregular)**: 예측할 수 없는 랜덤한 변동

이번 포스팅에서는 **분해법(Decomposition)**을 통해 이러한 성분들을 분리하고 분석하는 방법을 알아보겠습니다.

## 1. 환경 설정 및 데이터 준비

### 필수 패키지 로드

```r
library('tidyverse')
library('TTR')
library('forecast')
library('lmtest')
options(repr.plot.width = 6, repr.plot.height = 4)
```

### 예제 데이터 로드

```r
z <- scan("food.txt")
t <- 1:length(z)
food <- ts(z, start = c(1981, 1), frequency = 12)
```

### 원시 시계열 데이터 확인

```r
plot.ts(food)
```

![원시 시계열 데이터](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_5_0.png)

데이터를 보면 **명확한 상승 추세**와 **계절적 패턴**이 관찰됩니다. 또한 시간이 지날수록 **변동성이 증가**하는 이분산성도 보입니다.

## 2. 분해법: 가법모형 (Additive Model)

### 이분산성 제거를 위한 변수 변환

이분산성을 해결하기 위해 **로그 변환**을 적용한 후 가법모형을 사용합니다.

```r
log_food <- log(food)
plot.ts(log_food)
```

![로그 변환된 시계열](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_8_0.png)

### 추세성분 추정

선형 회귀를 사용하여 추세성분을 추정합니다.

```r
fit <- lm(log_food ~ t)
summary(fit)
```

```
Call:
lm(formula = log_food ~ t)

Residuals:
      Min        1Q    Median        3Q       Max 
-0.251154 -0.042190  0.009368  0.051058  0.147910 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept) 3.705715   0.012870  287.94   <2e-16 ***
t           0.007216   0.000154   46.86   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.07682 on 142 degrees of freedom
Multiple R-squared:  0.9393,	Adjusted R-squared:  0.9388 
F-statistic:  2195 on 1 and 142 DF,  p-value: < 2.2e-16
```

**해석**: p-value가 매우 유의하고 R-squared도 0.9393으로 매우 높게 나타나 추세성분이 강하게 존재함을 확인할 수 있습니다.

```r
trend <- fitted(fit)
```

### 추세성분 시각화

```r
ts.plot(log_food, trend, col = 1:2, lty = 1:2, lwd = 1:2, ylab = "food", xlab = 
        "Log-transformed time series and trend component by decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("ln(z)", "trend component"))
```

![추세성분 시각화](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_13_0.png)

### 원시계열에서 추세성분 조정

추세성분을 구했으니 원래 데이터에서 추세성분을 빼줍니다. 그러면 계절성분과 불규칙성분만 남게 됩니다.

```r
adjtrend = log_food-trend
plot.ts(adjtrend)
```

![추세 조정된 시계열](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_16_0.png)

### 지시함수를 이용한 계절성분 추정

계절성분에 추세법을 이용하기 위해서는 sin함수를 이용하거나 지시함수를 이용하면 되는데 여기서는 지시함수를 이용합니다. 사이클 자체를 설명변수로 넣을 것입니다.

```r
y = factor(cycle(adjtrend))
y
```

```
[1] 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12 1  2  3  4  5  6  7  8  9  10 11 12

Levels: 1 2 3 4 5 6 7 8 9 10 11 12
```

지시함수를 사용하기 위해 여기서는 intercept를 0으로 놓았습니다.

```r
fit1 <- lm(adjtrend ~ 0 + y)
summary(fit1)
```

```
Call:
lm(formula = adjtrend ~ 0 + y)

Residuals:
      Min        1Q    Median        3Q       Max 
-0.182321 -0.028501  0.000597  0.025663  0.146887 

Coefficients:
    Estimate Std. Error t value Pr(>|t|)    
y1  -0.06884    0.01423  -4.837 3.61e-06 ***
y2  -0.13853    0.01423  -9.735  < 2e-16 ***
y3  -0.01290    0.01423  -0.907 0.366289    
y4   0.03840    0.01423   2.699 0.007872 ** 
y5   0.08825    0.01423   6.201 6.69e-09 ***
y6   0.03871    0.01423   2.720 0.007401 ** 
y7   0.01061    0.01423   0.746 0.457221    
y8   0.05972    0.01423   4.197 4.94e-05 ***
y9   0.03776    0.01423   2.653 0.008945 ** 
y10 -0.01856    0.01423  -1.304 0.194518    
y11 -0.05041    0.01423  -3.542 0.000549 ***
y12  0.01577    0.01423   1.108 0.269816    
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.0493 on 132 degrees of freedom
Multiple R-squared:  0.6172,	Adjusted R-squared:  0.5824 
F-statistic:  17.73 on 12 and 132 DF,  p-value: < 2.2e-16
```

```r
seasonal <- fitted(fit1)
ts.plot(seasonal, main = "Estimated seasonal component")
```

![계절성분 추정](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_22_0.png)

### 추정값 계산

```r
pred <- trend + seasonal
```

trend는 단순선형을 사용해서 구했고, seasonal은 지시함수를 사용해서 구했습니다.

```r
ts.plot(log_food, pred, col = 1:2, lty = 1:2, lwd = 1:2, ylab = "food", xlab = "time",
        main="Estimated value by log-transformed time series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("ln(z)", "estimated value"))
```

![가법모형 추정값](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_26_0.png)

### 잔차검토

최종적으로 잔차에 대해서 보려고 했기에 살펴보면:

```r
irregular <- log_food - pred
ts.plot(irregular)
abline(h = 0)
```

![가법모형 잔차](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_29_0.png)

겉 보기에 문제는 별로 없어보이지만 더빈왓슨 테스트를 해보면:

```r
dwtest(lm(irregular ~ 1), alternative = 'two.sided')
```

```
	Durbin-Watson test

data:  lm(irregular ~ 1)
DW = 1.0803, p-value = 2.748e-08
alternative hypothesis: true autocorrelation is not 0
```

자기상관관계가 있다고 나옵니다. 이런 경우 모델링을 해주어야 하는데 5장 이후에 알려줍니다.

## 3. 분해법: 승법모형 (Multiplicative Model)

### 원시 데이터 확인

```r
plot.ts(food)
```

![승법모형 원시데이터](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_34_0.png)

### 추세성분 추정

trend가 잘 안잡힐 것 같아서 t^2를 추가해도 됩니다. 이걸 lm에 추가할 때 I()하고 넣어야 들어갑니다. 바로 쓰면 추가 안됩니다.

```r
fit3 <- lm(food ~ t) #+ I(t^2))
summary(fit3)
```

```
Call:
lm(formula = food ~ t)

Residuals:
     Min       1Q   Median       3Q      Max 
-14.0331  -3.4505  -0.1355   4.2911  15.3948 

Coefficients:
            Estimate Std. Error t value Pr(>|t|)    
(Intercept) 35.28614    0.95561   36.92   <2e-16 ***
t            0.50557    0.01143   44.21   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 5.704 on 142 degrees of freedom
Multiple R-squared:  0.9323,	Adjusted R-squared:  0.9318 
F-statistic:  1955 on 1 and 142 DF,  p-value: < 2.2e-16
```

```r
trend <- fitted(fit3)
```

### 추세성분 시각화

```r
ts.plot(food, trend, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Trend component by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("primitive series", "trend component"))
```

![승법모형 추세성분](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_39_0.png)

가법모형과 비슷해 보이지만 다릅니다.

### 원시계열에서 추세성분 조정

나누어 주면 계절성분과 불규칙 성분만 남습니다.

```r
adjtrend = food/trend
plot.ts(adjtrend)
```

![승법모형 추세조정](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_43_0.png)

### 지시함수를 이용한 계절성분 추정

```r
y = factor(cycle(adjtrend))
```

추세가 제거된 모형:

```r
fit4 <- lm(adjtrend ~ 0+y)
fit4 %>% summary
```

```
Call:
lm(formula = adjtrend ~ 0 + y)

Residuals:
      Min        1Q    Median        3Q       Max 
-0.161461 -0.039085 -0.006972  0.032830  0.296240 

Coefficients:
    Estimate Std. Error t value Pr(>|t|)    
y1   0.94149    0.01922   48.98   <2e-16 ***
y2   0.87529    0.01922   45.54   <2e-16 ***
y3   0.99012    0.01922   51.51   <2e-16 ***
y4   1.04123    0.01922   54.17   <2e-16 ***
y5   1.09340    0.01922   56.88   <2e-16 ***
y6   1.04083    0.01922   54.15   <2e-16 ***
y7   1.01069    0.01922   52.58   <2e-16 ***
y8   1.06149    0.01922   55.22   <2e-16 ***
y9   1.03869    0.01922   54.04   <2e-16 ***
y10  0.98045    0.01922   51.01   <2e-16 ***
y11  0.94939    0.01922   49.39   <2e-16 ***
y12  1.01452    0.01922   52.78   <2e-16 ***
---
Signif. codes:  0 '***' 0.001 '**' 0.01 '*' 0.05 '.' 0.1 ' ' 1

Residual standard error: 0.06658 on 132 degrees of freedom
Multiple R-squared:  0.996,	Adjusted R-squared:  0.9956 
F-statistic:  2733 on 12 and 132 DF,  p-value: < 2.2e-16
```

```r
seasonal <- fitted(fit4)
ts.plot(seasonal, main = "Estimated seasonal component")
```

![승법모형 계절성분](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_48_0.png)

### 추정값 계산

실제 예측값은 trend + seasonal입니다.

```r
pred_stl <- stl_fit1$time.series[,1] + stl_fit1$time.series[,2]

ts.plot(log_food, pred_stl, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Estimated value by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("primitive series", "estimated value"))
```

![승법모형 추정값](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_51_0.png)

### 잔차검토

```r
irregular <- food/pred
ts.plot(irregular)
abline(h = 1, lty = 2)
```

![승법모형 잔차](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_54_0.png)

```r
dwtest(lm(irregular ~ 1), alternative = 'two.sided')
```

```
	Durbin-Watson test

data:  lm(irregular ~ 1)
DW = 0.57136, p-value < 2.2e-16
alternative hypothesis: true autocorrelation is not 0
```

## 4. 단순이동평균과 중심이동평균

### 원데이터 확인

```r
z <- scan('mindex.txt')
mindex <- ts(z, start = c(1986, 1), frequency = 12)
plot.ts(mindex)
```

![mindex 원시데이터](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_58_0.png)

단순이동평균은 smoothing해주려고 사용합니다. 예를 들어 단순이동평균의 경우 window가 5라고 하면 앞에 4개는 결과가 없습니다. 하지만 중심이동평균은 5개이면 위는 4번째까지 합해서 5번째부터 결과 나타나는 식이라면 중심이동은 5개의 중심값 3번째부터 결과나옵니다. 좀 더 유연한 결과입니다.

예측에서는 사용 불가능한데, 왜냐하면 5개의 경우 하나는 현재 2개는 과거 2개는 미래 정보를 사용하기 때문입니다.

```r
plot.ts(mindex, ylab = "", xlab = "")
lines(SMA(mindex, n = 5), col = 'red', lwd = 2) #처음 4개 안나오는 거 볼 수 있음
lines(ma(mindex, order = 5), col = 'blue', lty = 2, lwd = 2) # 두칸 일찍 나오는 거 보자
legend('topright', lty = c(1,1,2), col = c('black', 'red', 'blue'),
       lwd = c(1, 1, 2),
       c('primitive series', "SMA(m=5)", "CSMA(l=2)"),
       bty = 'n')
```

![이동평균 비교](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_60_0.png)

## 5. 이동평균을 이용한 분해법

### 다양한 이동평균 적용

```r
plot.ts(log_food)
lines(ma(log_food, 3), col = 'blue', lwd = 2)
lines(ma(log_food, 12), col = 'red', lwd = 2) # 거의 추세만 남아버림.(왜냐면 12개씩이면 1년씩이 묶인거라 계절성이 없어짐)
```

![이동평균 분해법](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_62_0.png)

## 6. STL 분해법

함수 stl, decompose 두개 다 사용가능합니다.

### STL 분해

원하는 3개의 성분으로 쪼개서 보여줍니다.

```r
stl_fit1 <- stl(log_food, s.window = 12)
stl_fit1$time.series %>% head
```

```
           seasonal     trend    remainder
Jan 1981 -0.09035504  3.789108  0.09223150
Feb 1981 -0.14793139  3.787232  0.04957932
Mar 1981 -0.01989614  3.785355 -0.03017285
Apr 1981  0.03829580  3.783478 -0.04901299
May 1981  0.09453872  3.782254 -0.04815173
Jun 1981  0.04378729  3.781031 -0.01593573
```

```r
plot(stl_fit1)
```

![STL 분해 결과](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_67_0.png)

실제 예측값은 trend + seasonal입니다.

```r
pred_stl <- stl_fit1$time.series[,1] + stl_fit1$time.series[,2]

ts.plot(log_food, pred_stl, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Estimated value by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("primitive series", "estimated value"))
```

![STL 추정값](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_69_0.png)

## 7. Decompose 함수 활용

### decompose 가법모형

밑에 additive써줬는데 안써도 되긴 합니다.

```r
dec_fit <- decompose(log_food, 'additive')
dec_fit$trend[1:10]
ma(log_food, 12)[1:10]
```

```
[1]       NA       NA       NA       NA       NA       NA 3.776909 3.768171 3.765650 3.772193

[1]       NA       NA       NA       NA       NA       NA 3.776909 3.768171 3.765650 3.772193
```

```r
dec_fit$seasonal[1:24]
```

```
[1] -0.07990209 -0.14604380 -0.01274493  0.04049678  0.09068184  0.03967867  0.01048177  0.05876191  0.04134155 -0.01793742 -0.04690019  0.02208592 -0.07990209 -0.14604380 -0.01274493  0.04049678  0.09068184  0.03967867  0.01048177  0.05876191  0.04134155 -0.01793742 -0.04690019  0.02208592
```

계절성분이라는 것은 12개월마다 반복되는 것이라 12까지 돌고 똑같이 나옵니다.

```r
plot.ts(log_food - dec_fit$trend)
```

![decompose 계절성분](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_75_0.png)

1~12월까지의 평균:

```r
x <- log_food - dec_fit$trend
b <- tapply(x, cycle(x), function(y) mean(y, na.rm = T))
b - mean(b)
```

```
          1           2           3           4           5           6 
-0.07990209 -0.14604380 -0.01274493  0.04049678  0.09068184  0.03967867 
          7           8           9          10          11          12 
 0.01048177  0.05876191  0.04134155 -0.01793742 -0.04690019  0.02208592
```

```r
dec_fit$random[1:10]
```

```
[1]          NA          NA          NA          NA          NA          NA -0.005476607 -0.031444194 -0.038838544  0.027659131
```

```r
plot(dec_fit)
```

![decompose 분해 결과](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_79_0.png)

predict = trend + seasonal:

```r
pred_dec <- dec_fit$trend + dec_fit$seasonal
```

```r
ts.plot(log_food, pred_dec, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Estimated value by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("primitive series", "Estimated value"))
```

![decompose 추정값](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_82_0.png)

### STL vs Decompose 비교

```r
ts.plot(pred_stl, pred_dec, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "stl vs decompose")
legend("topleft", lty = 1:2, col = 1:2, c("stl", "decompose"))
```

![STL vs decompose 비교](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_84_0.png)

거의 비슷하게 나옵니다.

## 8. Decompose 승법모형

### 승법모형 적용

```r
dec_fit2 <- decompose(food, type = "multiplicative")
dec_fit2$trend[1:10]
dec_fit2$seasonal[1:15]
dec_fit2$random[1:10]
```

```
[1]       NA       NA       NA       NA       NA       NA 43.72917 43.37917 43.29167 43.58750

[1] 0.9219246 0.8621213 0.9844960 1.0380042 1.0916505 1.0378593 1.0080029 1.0591710 1.0427540 0.9807592 0.9523825 1.0208744 0.9219246 0.8621213 0.9844960

[1]        NA        NA        NA        NA        NA        NA 0.9959362 0.9685292 0.9591835 1.0269284
```

```r
plot(dec_fit2)
```

![decompose 승법모형 결과](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_88_0.png)

```r
pred_dec2 <- dec_fit2$trend*dec_fit2$seasonal
```

```r
ts.plot(food, pred_dec2, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Estimated value by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("primitive series", "estimated value"))
```

![decompose 승법모형 추정값](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_90_0.png)

## 9. 가법모형 vs 승법모형 비교

### 최종 비교

```r
ts.plot(exp(pred_dec), pred_dec2, col = 1:2, lty = 1:2, ylab = "food", xlab = "time",
        main = "Estimated value by primitive series and decomposition method")
legend("topleft", lty = 1:2, col = 1:2, c("additive model", "multiplicative model"))
```

![가법모형 vs 승법모형](@/assets/images/2022-10-8-시계열자료분석-학습3_files/2022-10-8-시계열자료분석-학습3_92_0.png)

비슷하게 나옵니다. 추세모형은 회귀모형을 써서 예측값이 좀 다르게 나오는데 이건 좀 비슷합니다.

## 핵심 요약

### 📊 분해법의 핵심 개념

**분해법**은 시계열 데이터를 구성하는 주요 성분들을 분리하여 각각의 특성을 파악하는 방법입니다:

- **가법모형**: Y(t) = Trend(t) + Seasonal(t) + Irregular(t)
- **승법모형**: Y(t) = Trend(t) × Seasonal(t) × Irregular(t)

### 🔍 방법론별 특징

#### 분해법 방식
1. **추세법 이용**: 회귀분석으로 추세 추정
2. **평활법 이용**: 이동평균으로 추세 추정

#### 이동평균 종류
- **단순이동평균(SMA)**: 과거 n개 관측값의 평균
- **중심이동평균(CMA)**: 현재를 중심으로 앞뒤 관측값 활용

### 🛠️ 실무 적용 가이드

**결론**: 이분산성이 있는 경우 승법모형을 써야 되지만 로그변환 이후 가법모형을 사용해도 됩니다. 분해법에는 추세이용법과 평활법이 있습니다. 평활법을 이용할 때에는 일반적인 이동법과 중심이동법이 있는데 분해법에서 사용하는 평활을 위해서는 중심이동평균 쓰는 것이 더 좋습니다.

### ⚠️ 주의사항

- **자기상관성 검정**: Durbin-Watson 테스트로 잔차의 자기상관 확인 필요
- **모형 선택**: 이분산성 존재 시 로그변환 후 가법모형 또는 승법모형 적용
- **예측 한계**: 중심이동평균은 미래 정보를 사용하므로 예측에 부적합