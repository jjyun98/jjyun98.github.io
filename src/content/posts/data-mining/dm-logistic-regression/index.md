---
title: '데이터 마이닝 - 로지스틱 회귀'
published: 2022-03-16
draft: false
description: '범주형 반응 변수, 로짓 함수, 오즈와 오즈비, 로지스틱 회귀의 추정과 분류 기준 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '분류', '로지스틱 회귀', 'R', 'ISLR']
---

로지스틱 회귀는 반응 변수가 0과 1처럼 두 범주로 나뉠 때 사용하는 분류 방법이다. 이름은 회귀지만 실제 목적은 특정 범주에 속할 확률을 추정하는 것이다.

## 1. 분류 문제

질적 자료 또는 범주형 자료는 가능한 값이 유한한 집합에 속한다.

$$
email \in \{spam, ham\}
$$

분류는 주어진 설명 변수 $X$에 대해 범주 $C(X)$를 예측하는 함수 $C$를 찾는 문제다. 때로는 범주 자체보다 각 범주에 속할 확률을 추정하는 것이 더 중요하다.

## 2. 이진 반응 변수

반응 변수 $Y$가 성공확률 $p$인 베르누이 분포를 따른다고 하자.

$$
Y =
\begin{cases}
0, & P(Y = 0) = 1 - p \\
1, & P(Y = 1) = p
\end{cases}
$$

이때 기대값은 성공확률과 같다.

$$
E(Y) = P(Y = 1) = p
$$

## 3. 로지스틱 함수

선형회귀를 이진 반응 변수에 그대로 적용하면 예측값이 0보다 작거나 1보다 커질 수 있다. 로지스틱 회귀는 확률이 항상 0과 1 사이에 있도록 로지스틱 함수를 사용한다.

$$
p(X) = P(Y = 1 \mid X)
$$

$$
p(X) = \frac{e^{\beta_0 + \beta_1 X}}{1 + e^{\beta_0 + \beta_1 X}}
$$

오즈와 로짓은 다음과 같다.

$$
\frac{p(X)}{1 - p(X)}
$$

$$
\log \left( \frac{p(X)}{1 - p(X)} \right) = \beta_0 + \beta_1 X
$$

즉 로지스틱 회귀는 로그 오즈를 설명 변수의 선형결합으로 모델링한다.

## 4. Default 데이터 실습

실습은 신용카드 연체 여부(`default`)를 `balance`, `income`, `student`로 설명하는 흐름이다.

```r
library(tidyverse)

dt <- read.csv("/materials/data-mining/dm-logistic-regression/Default.csv",
               stringsAsFactors = TRUE)

head(dt)
dim(dt)
```

연체 여부에 따라 `balance`, `income`의 분포를 먼저 확인한다.

```r
plot(dt$balance, dt$income, type = "n",
     xlab = "Balance", ylab = "Income")

points(dt[dt$default == "No", ]$balance,
       dt[dt$default == "No", ]$income,
       col = "steelblue")

points(dt[dt$default == "Yes", ]$balance,
       dt[dt$default == "Yes", ]$income,
       col = "darkorange", pch = 3)

boxplot(balance ~ default, data = dt,
        col = c("steelblue", "darkorange"),
        xlab = "Default", ylab = "Balance")

boxplot(income ~ default, data = dt,
        col = c("steelblue", "darkorange"),
        xlab = "Default", ylab = "Income")
```

강의 노트의 해석은 `balance`가 높을수록 default 비율이 높고, `income`은 default와 관계가 상대적으로 약하다는 쪽이다.

## 5. `glm()`으로 적합하기

R에서는 `glm()`에 `family = binomial`을 지정한다.

```r
fit_balance <- glm(default ~ balance, data = dt, family = binomial)
summary(fit_balance)

fit_all <- glm(default ~ balance + income + student,
               data = dt, family = binomial)
summary(fit_all)
```

예측확률은 `type = "response"`로 얻는다.

```r
prob <- predict(fit_all, type = "response")
head(prob)

pred <- ifelse(prob > 0.5, "Yes", "No")
table(predicted = pred, actual = dt$default)
mean(pred == dt$default)
```

## 6. 분류 기준값

기준값을 0.5로 두는 것은 관습일 뿐이다. 연체 고객을 놓치는 비용이 크다면 기준값을 낮춰 더 많은 고객을 위험군으로 분류할 수 있다.

```r
cutoffs <- seq(0.1, 0.9, by = 0.1)

acc <- sapply(cutoffs, function(cut) {
  pred <- ifelse(prob > cut, "Yes", "No")
  mean(pred == dt$default)
})

data.frame(cutoff = cutoffs, accuracy = acc)
```

분류 문제에서는 정확도뿐 아니라 민감도, 특이도, ROC 곡선도 함께 확인해야 한다.
