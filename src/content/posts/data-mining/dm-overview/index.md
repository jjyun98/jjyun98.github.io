---
title: '데이터 마이닝 - 개요와 모델 평가'
published: 2022-03-02
draft: false
description: 'ISLR 기반 데이터 마이닝 수업의 전체 흐름, 지도학습과 비지도학습, 예측 정확도와 모델 평가 기준 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '통계학', 'R', 'ISLR']
---

데이터 마이닝은 대용량 데이터에서 의미 있는 상관관계, 패턴, 추세를 찾아 의사결정에 활용하는 분석 과정이다. 이 수업은 ISLR의 흐름처럼 회귀와 분류를 먼저 다루고, 이후 트리 기반 방법, 앙상블, 군집분석, 연관규칙으로 확장한다.

## 1. 데이터 마이닝의 관점

데이터 마이닝은 통계학, 머신러닝, 패턴 인식, 데이터베이스, 시각화, 알고리즘이 만나는 영역이다. 핵심은 이미 관측된 데이터를 설명하는 데서 끝내지 않고, 아직 관측되지 않은 데이터에 대해 잘 일반화되는 규칙을 찾는 것이다.

통계적 학습 관점에서는 입력 변수 $X$와 반응 변수 $Y$ 사이의 관계를 다음처럼 쓴다.

$$
Y = f(X) + \epsilon
$$

$f$는 데이터에서 학습하려는 구조이고, $\epsilon$은 설명되지 않는 오차다.

## 2. 지도학습과 비지도학습

**지도학습(supervised learning)**은 반응 변수 $Y$가 있는 문제다. 선형회귀, 로지스틱 회귀, LDA, QDA, KNN, 의사결정나무, 랜덤포레스트, 부스팅은 모두 지도학습에 속한다.

**비지도학습(unsupervised learning)**은 명시적인 반응 변수 없이 데이터의 구조를 찾는 문제다. 군집분석, 자기조직화지도, 연관규칙 분석이 여기에 해당한다.

## 3. 회귀와 분류

반응 변수의 형태에 따라 문제를 나눌 수 있다.

- 회귀: $Y$가 연속형 변수인 경우
- 분류: $Y$가 범주형 변수인 경우

주택 가격이나 매출액을 예측하면 회귀 문제이고, 신용카드 연체 여부나 심장질환 여부를 예측하면 분류 문제다.

## 4. 예측 정확도와 해석 가능성

모델을 고를 때는 몇 가지 trade-off가 반복된다.

- 예측 정확도와 해석 가능성
- 과소적합과 과적합
- 간결한 모형과 블랙박스 모형

선형모형은 해석하기 쉽지만 복잡한 비선형 구조를 잡는 데 한계가 있다. 반대로 유연한 모델은 예측 성능이 좋아질 수 있지만, 왜 그런 예측이 나왔는지 설명하기 어려워질 수 있다.

## 5. 학습 오차와 테스트 오차

모델은 학습 데이터에 잘 맞는 것만으로 충분하지 않다. 실제 관심은 새로운 데이터에서의 예측 성능이다.

학습 데이터와 테스트 데이터를 나누어 쓰면 다음처럼 오차를 비교할 수 있다.

$$
MSE_{Tr} = Ave_{i \in Tr} \left[y_i - \hat{f}(x_i)\right]^2
$$

$$
MSE_{Te} = Ave_{i \in Te} \left[y_i - \hat{f}(x_i)\right]^2
$$

모델 유연성이 커질수록 학습 오차는 보통 계속 감소한다. 하지만 테스트 오차는 어느 지점 이후 다시 증가할 수 있다. 이 지점이 과적합의 시작이다.

## 6. 편향과 분산

테스트 오차는 편향, 분산, 오차항으로 나누어 생각할 수 있다.

$$
E(y_0 - \hat{f}(x_0))^2 = Var(\hat{f}(x_0)) + Bias(\hat{f}(x_0))^2 + Var(\epsilon)
$$

단순한 모델은 편향이 크고 분산이 작다. 복잡한 모델은 편향이 작고 분산이 크다. 데이터 마이닝에서 모델 선택은 이 균형을 잡는 일이다.

## 7. R로 확인하는 학습/테스트 오차

아래 코드는 데이터 생성, 학습/테스트 분할, 다항회귀 차수별 MSE 비교를 한 번에 확인하는 예시다.

```r
set.seed(123)

n <- 100
x <- runif(n, 0, 10)
y <- 2 + 1.5 * x - 0.2 * x^2 + rnorm(n, sd = 3)

train_id <- sample(seq_len(n), size = 70)
train <- data.frame(x = x[train_id], y = y[train_id])
test <- data.frame(x = x[-train_id], y = y[-train_id])

degrees <- 1:10
result <- data.frame(degree = degrees, train_mse = NA, test_mse = NA)

for (d in degrees) {
  fit <- lm(y ~ poly(x, d, raw = TRUE), data = train)

  pred_train <- predict(fit, newdata = train)
  pred_test <- predict(fit, newdata = test)

  result[result$degree == d, "train_mse"] <- mean((train$y - pred_train)^2)
  result[result$degree == d, "test_mse"] <- mean((test$y - pred_test)^2)
}

result

plot(result$degree, result$train_mse, type = "b", col = "grey40",
     ylim = range(result[, c("train_mse", "test_mse")]),
     xlab = "Model flexibility", ylab = "MSE")
lines(result$degree, result$test_mse, type = "b", col = "firebrick")
legend("topright", c("train", "test"), col = c("grey40", "firebrick"), lty = 1)
```

이 예시에서 차수가 커지면 학습 오차는 내려가지만 테스트 오차는 어느 순간부터 올라갈 수 있다. 강의의 모델 정확도 파트에서 강조하는 핵심이 바로 이 지점이다.
