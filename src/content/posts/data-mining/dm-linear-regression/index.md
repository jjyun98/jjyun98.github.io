---
title: '데이터 마이닝 - 선형회귀'
published: 2022-03-09
draft: false
description: '단순선형회귀와 다중선형회귀, 최소제곱법, 회귀계수 해석, 적합도와 예측오차 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '회귀분석', 'R', 'ISLR']
---

선형회귀는 수치형 반응 변수를 설명하거나 예측할 때 사용하는 가장 기본적인 지도학습 방법이다. ISLR에서도 통계적 학습의 출발점으로 선형회귀를 다룬다.

## 1. 두 변수 사이의 관계

두 변수 사이의 관계를 볼 때는 먼저 산점도로 형태를 확인한다. 이후 상관분석은 두 변수의 선형적 관련성을 요약하고, 회귀분석은 설명 변수 $X$와 반응 변수 $Y$ 사이의 함수관계를 모델링한다.

$$
Y = f(X) + \epsilon
$$

단순선형회귀에서는 $f(X)$를 직선으로 둔다.

$$
Y = \beta_0 + \beta_1 X + \epsilon
$$

## 2. Advertising 예시

강의에서는 TV, radio, newspaper 광고비로 sales를 설명하는 Advertising 데이터를 예시로 든다. 관심 질문은 다음과 같다.

- 광고비와 매출 사이에 관계가 있는가?
- 어떤 광고 매체가 매출과 관련이 큰가?
- 각 매체의 효과는 어느 정도인가?
- 미래 매출을 얼마나 정확히 예측할 수 있는가?

R에서는 다음처럼 시작할 수 있다.

```r
library(tidyverse)

advertising <- read.csv("Advertising.csv")

advertising %>%
  select(TV, radio, newspaper, sales) %>%
  head()

ggplot(advertising, aes(TV, sales)) +
  geom_point(color = "steelblue") +
  geom_smooth(method = "lm", se = FALSE, color = "firebrick")
```

## 3. 최소제곱법

회귀계수는 잔차제곱합을 최소화하도록 추정한다.

$$
RSS = \sum_{i=1}^{n} (y_i - \hat{y}_i)^2
$$

$$
\hat{y}_i = \hat{\beta}_0 + \hat{\beta}_1 x_i
$$

R의 `lm()`은 이 최소제곱 추정을 수행한다.

```r
fit_tv <- lm(sales ~ TV, data = advertising)
summary(fit_tv)
```

`summary()`에서 확인할 핵심은 회귀계수 추정값, 표준오차, t 통계량, p-value, $R^2$다.

## 4. 다중선형회귀

설명 변수가 여러 개이면 다중선형회귀가 된다.

$$
Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_p X_p + \epsilon
$$

Advertising 데이터에서는 다음처럼 세 광고 매체를 동시에 넣는다.

```r
fit_all <- lm(sales ~ TV + radio + newspaper, data = advertising)
summary(fit_all)
```

각 계수는 다른 변수를 고정했을 때 해당 변수가 반응 변수에 주는 평균적인 영향을 의미한다.

## 5. 모델 평가

선형회귀에서 자주 보는 지표는 다음과 같다.

- RSE: 잔차의 평균적인 크기
- $R^2$: 반응 변수 변동 중 모델이 설명한 비율
- F 통계량: 적어도 하나의 설명 변수가 반응 변수와 관련 있는지 확인
- 테스트 MSE: 새 데이터에서의 예측오차

```r
set.seed(123)

idx <- sample(seq_len(nrow(advertising)), size = 0.7 * nrow(advertising))
train <- advertising[idx, ]
test <- advertising[-idx, ]

fit <- lm(sales ~ TV + radio + newspaper, data = train)
pred <- predict(fit, newdata = test)

mean((test$sales - pred)^2)
```

## 6. 변수 선택과 해석

모든 변수를 넣는다고 항상 좋은 모델이 되는 것은 아니다. 관련 없는 변수를 넣으면 해석이 흐려지고 테스트 오차가 커질 수 있다. 강의 흐름에서는 선형회귀를 통해 다음 개념을 잡는 것이 중요하다.

- 계수는 조건부 평균 효과로 해석한다.
- 학습 데이터 적합도보다 테스트 성능이 중요하다.
- 단순하고 해석 가능한 모델은 이후 복잡한 모델의 기준점이 된다.
