---
title: '데이터 마이닝 - 의사결정나무'
published: 2022-04-06
draft: false
description: '회귀나무와 분류나무, 재귀적 이진 분할, 가지치기, 트리 모델의 해석과 한계 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '의사결정나무', 'R', 'ISLR']
---

의사결정나무는 데이터를 여러 규칙으로 나누어 예측하는 방법이다. 규칙이 나무 구조로 표현되기 때문에 해석이 쉽고, 변수 간 비선형 관계와 상호작용을 자연스럽게 다룰 수 있다.

## 1. Tree-based methods

트리 기반 방법은 회귀와 분류 모두에 사용할 수 있다. 데이터를 여러 영역으로 층화하거나 분할하고, 각 영역에서 단순한 예측값을 만든다.

의사결정나무는 if-then-else 규칙의 집합으로 이해할 수 있다.

```text
if Petal.Length < 2.45:
  Species = setosa
else if Petal.Width < 1.75:
  Species = versicolor
else:
  Species = virginica
```

## 2. 회귀나무

회귀나무는 반응 변수가 연속형일 때 사용한다. 각 단말 노드의 예측값은 그 영역에 속한 관측값들의 평균이다.

분할 기준은 보통 RSS를 가장 많이 줄이는 방향으로 선택한다.

$$
RSS = \sum_{j=1}^{J} \sum_{i \in R_j} (y_i - \hat{y}_{R_j})^2
$$

## 3. 분류나무

분류나무는 반응 변수가 범주형일 때 사용한다. 단말 노드에서는 가장 많이 등장한 범주를 예측한다.

분할 기준으로는 지니 지수나 엔트로피를 많이 사용한다.

$$
G = \sum_{k=1}^{K} \hat{p}_{mk}(1 - \hat{p}_{mk})
$$

지니 지수가 낮을수록 한 노드 안에 특정 범주가 더 순수하게 모여 있다.

## 4. Iris 데이터 실습

실습에서는 `rpart`, `rpart.plot`, `tree` 패키지를 사용한다.

```r
library(rpart)
library(rpart.plot)
library(tree)
library(tidyverse)

set.seed(1000)

train_id <- sample(1:nrow(iris), nrow(iris) * 0.7)
train_dt <- iris[train_id, ]
test_dt <- iris[-train_id, ]
```

분류나무를 적합한다.

```r
cart_iris <- rpart(Species ~ ., data = train_dt)
cart_iris

rpart.plot(cart_iris, main = "Classification tree for iris")
```

예측 성능을 확인한다.

```r
pred <- predict(cart_iris, newdata = test_dt, type = "class")

table(predicted = pred, actual = test_dt$Species)
mean(pred == test_dt$Species)
```

## 5. 가지치기

트리를 너무 깊게 만들면 학습 데이터에 과적합되기 쉽다. `rpart`에서는 복잡도 매개변수 `cp`를 사용해 가지치기한다.

```r
printcp(cart_iris)
plotcp(cart_iris)

best_cp <- cart_iris$cptable[which.min(cart_iris$cptable[, "xerror"]), "CP"]
pruned_iris <- prune(cart_iris, cp = best_cp)

rpart.plot(pruned_iris, main = "Pruned classification tree")
```

비용복잡도 가지치기는 오차와 트리 크기를 함께 고려한다.

$$
\sum_{m=1}^{|T|} \sum_{i \in R_m} (y_i - \hat{y}_{R_m})^2 + \alpha |T|
$$

## 6. 트리의 장단점

트리는 해석이 쉽고 전처리 부담이 적다. 하지만 단일 트리는 예측 성능과 안정성이 낮을 수 있다. 작은 데이터 변화에도 분할 구조가 크게 바뀔 수 있기 때문이다.

이 한계를 보완하기 위해 다음 글의 배깅, 랜덤포레스트, 부스팅 같은 앙상블 방법을 사용한다.
