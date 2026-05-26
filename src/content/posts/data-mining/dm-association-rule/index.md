---
title: '데이터 마이닝 - 연관규칙 분석'
published: 2022-05-18
draft: false
description: '장바구니 분석, 지지도, 신뢰도, 향상도, Apriori 알고리즘과 연관규칙 해석 정리'
series: '데이터 마이닝'
tags: ['데이터 마이닝', '연관규칙', '비지도학습', 'R']
---

연관규칙 분석은 거래 데이터에서 함께 자주 등장하는 항목 조합을 찾는 방법이다. 장바구니 분석처럼 어떤 항목을 구매한 사람이 다른 항목도 구매하는 경향이 있는지를 규칙 형태로 표현한다.

## 1. 규칙의 형태

연관규칙은 다음과 같은 형태로 쓴다.

$$
X \Rightarrow Y
$$

$X$는 선행항, $Y$는 후행항이다. 예를 들어 `{soju, coke} => {beer}`는 소주와 콜라가 포함된 거래에서 맥주도 함께 등장하는 경향을 의미한다.

## 2. 지지도

지지도는 전체 거래 중 특정 항목집합이 등장한 비율이다.

$$
support(X \Rightarrow Y) = P(X \cup Y)
$$

지지도가 너무 낮으면 규칙이 우연히 나타난 것일 수 있다.

## 3. 신뢰도

신뢰도는 선행항이 등장한 거래 중 후행항도 함께 등장한 비율이다.

$$
confidence(X \Rightarrow Y) = P(Y \mid X)
$$

신뢰도는 방향성이 있다. 일반적으로 $confidence(A \Rightarrow B)$와 $confidence(B \Rightarrow A)$는 다르다.

## 4. 향상도

향상도는 $X$와 $Y$가 독립일 때에 비해 얼마나 더 자주 함께 나타나는지를 본다.

$$
lift(X \Rightarrow Y) = \frac{P(Y \mid X)}{P(Y)}
$$

향상도가 1보다 크면 양의 연관성이 있다고 해석한다.

## 5. Apriori 알고리즘

Apriori 알고리즘은 지지도가 낮은 항목집합의 상위 항목집합도 지지도가 낮다는 성질을 이용해 후보 규칙을 줄인다.

이 과정에서 최소 지지도와 최소 신뢰도 기준을 정해야 한다. 기준을 너무 낮게 두면 규칙이 과도하게 많아지고, 너무 높게 두면 의미 있는 규칙을 놓칠 수 있다.

## 6. 장바구니 예제

실습 노트북은 `arules`와 `arulesViz`로 시작한다.

```r
library(arules)
library(arulesViz)
```

간단한 거래 목록을 만든다.

```r
Shopping_List <- list(
  c("soju", "coke", "beer"),
  c("soju", "coke", "wine"),
  c("soju", "juice"),
  c("coke", "beer"),
  c("soju", "coke", "beer", "wine"),
  c("juice")
)
```

거래 데이터를 `itemMatrix`와 `transactions`로 바꾼다.

```r
Shopping_itemMatrix <- as(Shopping_List, "itemMatrix")
Shopping_itemMatrix

Shopping_df <- as(Shopping_itemMatrix, "matrix")
rownames(Shopping_df) <- paste0("customer", 1:6)
Shopping_df

Shopping_trans <- as(Shopping_df, "transactions")
inspect(Shopping_trans)
```

Apriori 알고리즘으로 규칙을 찾는다.

```r
rules <- apriori(
  Shopping_trans,
  parameter = list(supp = 0.2, conf = 0.5, minlen = 2)
)

inspect(rules)
```

규칙을 향상도 기준으로 정렬한다.

```r
rules_lift <- sort(rules, by = "lift", decreasing = TRUE)
inspect(rules_lift)
```

## 7. 규칙 시각화

규칙이 많아지면 표만으로 해석하기 어렵다. `arulesViz`를 사용하면 그래프 형태로 규칙을 확인할 수 있다.

```r
plot(rules_lift, method = "graph", engine = "htmlwidget")
```

실무에서는 지지도, 신뢰도, 향상도 중 하나만 보고 결론을 내리면 위험하다. 자주 나타나는 규칙인지, 조건부 확률이 충분히 높은지, 단순히 인기 품목 때문에 생긴 규칙은 아닌지를 함께 봐야 한다.
