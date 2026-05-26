---
title: '데이터 마이닝 - 군집분석과 자기조직화지도'
published: 2022-05-04
draft: false
description: 'K-means, 계층적 군집분석, 거리 측도, 덴드로그램, 자기조직화지도와 비지도학습 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '군집분석', '비지도학습', 'R', 'ISLR']
---

군집분석은 반응 변수 없이 관측값들 사이의 유사성을 기준으로 그룹을 찾는 비지도학습 방법이다. 분류와 달리 정답 라벨이 없기 때문에, 거리 측도와 군집 수 선택이 결과에 큰 영향을 준다.

## 1. 거리와 유사도

군집분석의 출발점은 관측값 사이의 거리를 정의하는 것이다.

유클리드 거리는 다음과 같다.

$$
d(x, y) = \sqrt{(x_1 - y_1)^2 + \cdots + (x_p - y_p)^2}
$$

맨하탄 거리는 좌표별 절대 차이를 더한다.

$$
d(x, y) = |x_1 - y_1| + \cdots + |x_p - y_p|
$$

변수의 단위가 다르면 거리가 특정 변수에 의해 지배될 수 있으므로 표준화가 중요하다.

## 2. K-means

K-means는 군집 수 $K$를 미리 정하고, 각 관측값을 가장 가까운 중심에 배정한다. 목표는 군집 내부 제곱합을 최소화하는 것이다.

$$
\sum_{k=1}^{K} \sum_{i \in C_k} \|x_i - \bar{x}_k\|^2
$$

초기 중심에 따라 결과가 달라질 수 있으므로 여러 번 반복해 좋은 해를 선택한다.

## 3. 계층적 군집분석

계층적 군집분석은 군집 수를 처음부터 고정하지 않고, 관측값들이 합쳐지는 과정을 덴드로그램으로 표현한다.

연결 방법에 따라 군집 모양이 달라진다.

- 단일 연결: 두 군집 사이의 가장 가까운 거리
- 완전 연결: 두 군집 사이의 가장 먼 거리
- 평균 연결: 모든 쌍 거리의 평균
- Ward 방법: 군집 내 제곱합 증가를 최소화

## 4. Crime 데이터 실습

실습에서는 도시별 범죄 자료에서 두 변수만 뽑아 거리와 덴드로그램을 확인한다.

```r
library(tidyverse)
library(MASS)
library(cowplot)

crime <- read.csv("/materials/data-mining/dm-clustering/Crime.csv")
head(crime)

x <- crime[, 3:4]

plot(x, pch = 16)
text(x, labels = crime$city, adj = -0.1, cex = 0.8)
```

거리행렬을 계산한다.

```r
D1 <- dist(x)
round(D1, 2)

D2 <- dist(x, method = "manhattan")
round(D2, 2)
```

연결 방법별 계층적 군집분석을 비교한다.

```r
hc_single <- hclust(dist(x)^2, method = "single")
hc_complete <- hclust(dist(x)^2, method = "complete")
hc_average <- hclust(dist(x)^2, method = "average")
hc_ward <- hclust(dist(x)^2, method = "ward.D2")

par(mfrow = c(2, 2))
plot(hc_single, labels = crime$city, main = "single", xlab = "", sub = "")
plot(hc_complete, labels = crime$city, main = "complete", xlab = "", sub = "")
plot(hc_average, labels = crime$city, main = "average", xlab = "", sub = "")
plot(hc_ward, labels = crime$city, main = "ward.D2", xlab = "", sub = "")
```

덴드로그램을 특정 높이에서 잘라 군집을 만든다.

```r
clusters <- cutree(hc_ward, k = 3)
data.frame(city = crime$city, cluster = clusters)
```

## 5. 자기조직화지도

자기조직화지도(SOM)는 고차원 데이터를 저차원 격자 위에 배치해 유사한 관측값이 가까운 위치에 놓이도록 학습한다. 군집분석과 차원축소의 성격을 함께 가진다.

강의 예시는 4차원 입력 벡터를 2개 그룹으로 클러스터링하는 과정이다. 입력 벡터와 가중 벡터 사이의 유클리드 거리를 계산하고, 가장 가까운 노드인 BMU를 찾은 뒤 가중치를 조정한다.

$$
D_i = \|x - w_i\|^2 = \sum_{k=1}^{n} (x_k - w_{ik})^2
$$

학습률은 반복마다 줄인다.

$$
\alpha(t + 1) = 0.4 \alpha(t)
$$

## 6. SOM 실습

실습에서는 `kohonen` 패키지의 `wine` 데이터를 사용한다.

```r
library(tidyverse)
library(kohonen)
library(gclus)
library(MASS)
library(cowplot)
library(gridExtra)

data(wine)
head(wine)

wine.sc <- scale(wine)

set.seed(7)
wine.som <- som(
  wine.sc,
  grid = somgrid(5, 4, topo = "hexagonal")
)

summary(wine.som)
plot(wine.som, type = "codes")
plot(wine.som, type = "mapping")
```

SOM은 결과를 시각적으로 해석하기 좋지만, 격자 크기와 학습 설정에 따라 결과가 달라질 수 있다.
