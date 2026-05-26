---
title: '데이터 마이닝 - 앙상블'
published: 2022-04-13
draft: false
description: '배깅, 랜덤포레스트, 부스팅의 아이디어와 트리 기반 앙상블의 편향-분산 관점 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '앙상블', '랜덤포레스트', '부스팅', 'R', 'ISLR']
---

앙상블은 여러 모델을 결합해 단일 모델보다 안정적인 예측을 만드는 방법이다. 트리 모델은 해석이 쉽지만 예측이 불안정할 수 있으므로, 여러 트리를 결합하는 앙상블과 잘 맞는다.

## 1. Bootstrap

부트스트랩은 원자료에서 복원추출로 같은 크기의 표본을 여러 개 만드는 방법이다. 추정량의 표준오차나 불확실성을 평가할 때도 쓰이고, 배깅의 기반이 된다.

```r
set.seed(123)

x <- 1:10
sample(x, size = length(x), replace = TRUE)
```

## 2. Bagging

배깅은 bootstrap aggregating의 줄임말이다. 학습 데이터에서 부트스트랩 표본을 여러 번 뽑고, 각 표본에 모델을 적합한 뒤 예측을 평균내거나 투표한다.

회귀 문제에서는 평균을 사용한다.

$$
\hat{f}_{bag}(x) = \frac{1}{B} \sum_{b=1}^{B} \hat{f}^{*b}(x)
$$

분류 문제에서는 다수결 투표를 사용한다. 배깅은 주로 분산을 줄인다.

## 3. 랜덤포레스트

랜덤포레스트는 배깅에 변수 무작위성을 추가한다. 각 분할 시점에서 전체 변수 중 일부만 후보로 사용한다. 이렇게 하면 트리들 사이의 상관이 줄어들고, 여러 트리를 평균냈을 때 분산 감소 효과가 커진다.

## 4. 부스팅

부스팅은 여러 약한 학습기를 순차적으로 학습한다. 앞 단계에서 잘 맞추지 못한 관측값에 더 집중하면서 모델을 개선한다.

트리 기반 부스팅에서는 작은 트리를 여러 개 더해 최종 예측함수를 만든다.

$$
\hat{f}(x) = \sum_{b=1}^{B} \lambda \hat{f}^b(x)
$$

$\lambda$는 학습률이다. 작게 둘수록 천천히 학습하고, 보통 더 많은 트리가 필요하다.

## 5. Heart 데이터 실습

실습에서는 심장질환 여부(`AHD`)를 예측한다.

```r
library(rpart)
library(rpart.plot)
library(tree)
library(tidyverse)

library(randomForest)
library(ipred)
library(gbm)
library(xgboost)
library(adabag)
library(data.table)

set.seed(123)

Heart <- read.csv("/materials/data-mining/dm-ensemble/Heart.csv",
                  stringsAsFactors = TRUE)
Heart <- na.omit(Heart)

train <- sample(1:nrow(Heart), nrow(Heart) * 0.7)
Heart_train <- Heart[train, -1]
Heart_test <- Heart[-train, -1]
```

먼저 단일 CART를 적합한다.

```r
cart_Heart <- rpart(AHD ~ ., data = Heart_train)
rpart.plot(cart_Heart, main = "Classification using CART")

cart_pred <- predict(cart_Heart, Heart_test, type = "class")
table(predicted = cart_pred, actual = Heart_test$AHD)
mean(cart_pred == Heart_test$AHD)
```

배깅은 `ipred::bagging()`으로 실행한다.

```r
bag_Heart <- bagging(AHD ~ ., data = Heart_train, nbagg = 100)
bag_pred <- predict(bag_Heart, Heart_test)

table(predicted = bag_pred, actual = Heart_test$AHD)
mean(bag_pred == Heart_test$AHD)
```

랜덤포레스트는 `randomForest()`로 적합한다.

```r
rf_Heart <- randomForest(AHD ~ ., data = Heart_train,
                         ntree = 500, importance = TRUE)

rf_pred <- predict(rf_Heart, Heart_test)
table(predicted = rf_pred, actual = Heart_test$AHD)
mean(rf_pred == Heart_test$AHD)

varImpPlot(rf_Heart)
```

부스팅은 `gbm()`으로 적합할 수 있다.

```r
Heart_train_gbm <- Heart_train %>%
  mutate(AHD_num = ifelse(AHD == "Yes", 1, 0))

Heart_test_gbm <- Heart_test %>%
  mutate(AHD_num = ifelse(AHD == "Yes", 1, 0))

boost_Heart <- gbm(
  AHD_num ~ . - AHD,
  data = Heart_train_gbm,
  distribution = "bernoulli",
  n.trees = 1000,
  interaction.depth = 2,
  shrinkage = 0.01
)

boost_prob <- predict(boost_Heart, Heart_test_gbm,
                      n.trees = 1000, type = "response")
boost_pred <- ifelse(boost_prob > 0.5, "Yes", "No")

table(predicted = boost_pred, actual = Heart_test$AHD)
mean(boost_pred == Heart_test$AHD)
```

## 6. 비교

- 배깅: 독립적인 여러 트리를 평균내어 분산 감소
- 랜덤포레스트: 변수 무작위성으로 트리 간 상관 감소
- 부스팅: 이전 오차를 보완하며 순차적으로 학습

단일 트리보다 앙상블이 보통 예측 성능은 좋지만, 해석 가능성은 낮아진다. 그래서 변수 중요도, 부분의존도 같은 보조 도구가 함께 필요하다.
