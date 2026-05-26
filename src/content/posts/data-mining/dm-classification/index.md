---
title: '데이터 마이닝 - 분류, LDA/QDA와 KNN'
published: 2022-03-23
draft: false
description: '분류 문제의 기본 구조, 베이즈 분류기, LDA, QDA, KNN의 가정과 차이 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '분류', 'LDA', 'QDA', 'KNN', 'R', 'ISLR']
---

분류 문제에서는 관측값이 어떤 범주에 속하는지를 예측한다. 로지스틱 회귀가 조건부 확률을 직접 모델링한다면, LDA와 QDA는 각 범주에서 설명 변수의 분포를 가정해 분류한다. KNN은 별도의 모수적 가정보다 가까운 이웃의 정보를 사용한다.

## 1. 베이즈 정리와 분류

분류의 이상적인 기준은 사후확률이 가장 큰 범주를 선택하는 것이다.

$$
\hat{Y} = \arg\max_k P(Y = k \mid X = x)
$$

베이즈 정리를 쓰면 다음처럼 쓸 수 있다.

$$
P(Y = k \mid X = x) = \frac{\pi_k f_k(x)}{\sum_{l=1}^{K} \pi_l f_l(x)}
$$

여기서 $f_k(x)$는 $k$번째 범주에서의 $X$의 확률밀도함수이고, $\pi_k$는 $k$번째 범주의 사전확률이다.

## 2. 로지스틱 회귀와 판별분석

강의에서는 로지스틱 회귀와 판별분석의 차이를 강조한다.

- 범주가 잘 분리되어 있으면 로지스틱 회귀의 계수 추정이 불안정할 수 있다.
- 표본 수가 작고 각 범주에서 설명 변수 분포가 정규분포에 가까우면 LDA가 안정적일 수 있다.
- 범주가 3개 이상일 때 LDA는 자연스럽게 확장된다.

## 3. LDA와 QDA

LDA는 각 범주의 설명 변수가 정규분포를 따르고, 모든 범주가 같은 공분산행렬을 가진다고 가정한다.

$$
X \mid Y = k \sim N(\mu_k, \Sigma)
$$

공분산행렬이 공통이므로 결정경계는 선형이 된다.

QDA는 범주마다 다른 공분산행렬을 허용한다.

$$
X \mid Y = k \sim N(\mu_k, \Sigma_k)
$$

결정경계가 이차식 형태가 될 수 있어 LDA보다 유연하지만, 추정해야 할 모수가 많아진다.

## 4. LDA 실습

실습에서는 `iris` 데이터와 `Default.csv`를 사용한다. 먼저 `iris`의 변수별 산점도를 확인한다.

```r
library(tidyverse)
library(MASS)
library(ROCR)

pairs(
  iris[, -5],
  col = c("steelblue", "darkorange", "darkgreen")[iris$Species]
)
```

LDA는 `MASS::lda()`로 적합한다.

```r
lda.fit <- lda(Species ~ ., data = iris)
lda.fit

lda.pred <- predict(lda.fit, newdata = iris)
table(predicted = lda.pred$class, actual = iris$Species)
mean(lda.pred$class == iris$Species)
```

두 범주만 남겨 로지스틱 회귀와 비교할 수도 있다.

```r
sub_iris <- iris[iris$Species != "setosa", -(1:2)]
sub_iris <- droplevels(sub_iris)

glm.fit <- glm(Species ~ Petal.Length + Petal.Width,
               data = sub_iris, family = binomial)

summary(glm.fit)
```

## 5. KNN

KNN은 예측하려는 관측값 주변의 $K$개 이웃을 찾고, 그 이웃들이 가장 많이 속한 범주로 분류한다.

$$
P(Y = k \mid X = x_0) \approx \frac{1}{K} \sum_{i \in N_0} I(y_i = k)
$$

$K$가 작으면 모델이 복잡해지고 분산이 커진다. $K$가 크면 결정경계가 부드러워지고 편향이 커진다.

## 6. KNN 실습

실습 노트북에서는 `iris`의 꽃잎 길이와 너비만 사용해 KNN을 적용한다.

```r
library(class)
library(tidyverse)

data(iris)
set.seed(1234)

train_id <- sample(1:nrow(iris), nrow(iris) * 0.7)

train_dt_x <- iris[train_id, 3:4]
train_dt_y <- iris[train_id, 5]
test_dt_x <- iris[-train_id, 3:4]
test_dt_y <- iris[-train_id, 5]
```

교차검증으로 $K$를 고른다.

```r
k.grid <- seq(1, 21, 2)
acc_df <- data.frame(k = k.grid, acc = NA)

for (i in seq_along(k.grid)) {
  pred_y <- knn.cv(train_dt_x, cl = train_dt_y, k = k.grid[i])
  acc_df[i, "acc"] <- mean(pred_y == train_dt_y)
}

plot(acc_df, type = "b")
opt_k <- k.grid[which.max(acc_df$acc)]
opt_k
```

테스트 데이터에 적용한다.

```r
pred_test <- knn(
  train = train_dt_x,
  test = test_dt_x,
  cl = train_dt_y,
  k = opt_k,
  prob = TRUE
)

table(predicted = pred_test, actual = test_dt_y)
mean(pred_test == test_dt_y)
```

KNN은 거리 기반 방법이므로 변수 스케일에 민감하다. 실제 데이터에서는 표준화를 먼저 고려해야 한다.
