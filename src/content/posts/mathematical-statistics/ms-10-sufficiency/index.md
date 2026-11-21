---
title: '수리통계학 - 충분성'
published: 2026-11-22
draft: false
description: '손실함수와 위험, 최소분산불편추정량, 충분통계량의 정의와 네이만 분해정리, 라오-블랙웰 정리, 완비성과 레만-셰페 정리, 정칙 지수족의 완비충분통계량, 모수 함수의 MVUE, 최소충분통계량과 보조통계량, 바수 정리를 정리한다.'
series: '수리통계학'
seriesOrder: 10
tags: ['통계학', '수학', 'R']
---

Hogg·McKean·Craig 『Introduction to Mathematical Statistics』 7장을 정리했다. [8편](/posts/ms-08-mle)의 라오-크라메르 하한은 달성되지 않는 경우가 많다. 그래도 불편추정량 중 분산이 가장 작은 것(MVUE)을 찾고 싶다. 열쇠는 **충분통계량**이다. 자료에서 모수에 대한 정보를 하나도 잃지 않고 요약한 통계량으로, 좋은 추정량은 모두 그 함수여야 한다.

```r title="환경 설정"
library(tidyverse)
theme_set(theme_minimal(base_size = 12))
```

## 1. 최소분산불편추정량과 위험

통계량 $Y$가 $E(Y) = \theta$이고, 다른 모든 불편추정량보다 분산이 작거나 같으면(모든 $\theta$에서) **최소분산불편추정량**(MVUE)이라 한다.

불편성은 하나의 기준일 뿐이다. 더 일반적으로는 추정량 $\delta(\mathbf{X})$와 참값의 차이에 **손실함수** $\mathcal{L}(\theta, \delta)$를 정하고, 그 기댓값인 **위험** $R(\theta, \delta) = E_\theta[\mathcal{L}(\theta, \delta(\mathbf{X}))]$를 비교한다. 제곱손실 $(\theta - \delta)^2$이면 위험은 [5편](/posts/ms-05-estimation-intervals)의 MSE다.

위험은 $\theta$의 함수라서 모든 $\theta$에서 다른 추정량보다 나은 추정량은 보통 없다. 상수 추정량 $\delta \equiv 5$는 $\theta = 5$에서 위험이 0이라 그 점에서는 아무도 이기지 못한다. 그래서 비교 대상을 제한하거나(불편추정량만 → MVUE), 위험을 하나의 숫자로 요약한다(최대 위험을 최소화하는 **미니맥스**, 사전분포로 평균한 위험을 최소화하는 **베이즈**, 14편).

## 2. 충분통계량

**정의.** 통계량 $Y_1 = u_1(\mathbf{X})$가 주어졌을 때 $\mathbf{X}$의 조건부분포가 $\theta$에 의존하지 않으면 $Y_1$을 $\theta$의 **충분통계량**이라 한다.

$Y_1$을 알면 나머지 자료의 분포는 $\theta$와 무관하므로, $\theta$에 대해 더 알려 주는 것이 없다. 원 자료를 버리고 $Y_1$만 보관해도 된다. 원 자료가 필요하면 $\theta$를 모른 채로 조건부분포에서 "가짜 자료"를 만들 수 있고, 그것은 원 자료와 같은 분포를 갖는다.

**예.** 베르누이 표본에서 $Y_1 = \sum X_i \sim b(n, \theta)$이면

$$
P(\mathbf{X} = \mathbf{x} \mid Y_1 = y) = \frac{\theta^y(1 - \theta)^{n-y}}{\binom{n}{y}\theta^y(1 - \theta)^{n-y}} = \frac{1}{\binom{n}{y}}
$$

로 $\theta$가 사라진다. 성공 횟수가 주어지면 어느 시행이 성공이었는지는 모든 배치가 같은 확률이다. 성공의 순서는 $\theta$에 대해 아무것도 알려 주지 않는다.

정의로 확인하려면 조건부분포를 계산해야 해서 번거롭다. 다음 정리가 실제로 쓰는 판정법이다.

**정리 (네이만 분해정리).** $Y_1 = u_1(\mathbf{X})$가 충분통계량일 필요충분조건은 결합 pdf가 다음처럼 분해되는 것이다.

$$
\prod_{i=1}^n f(x_i; \theta) = k_1[u_1(\mathbf{x}); \theta]\,k_2(\mathbf{x})
$$

$k_1$은 $\mathbf{x}$에 $u_1(\mathbf{x})$를 통해서만 의존하고, $k_2$는 $\theta$에 의존하지 않는다.

| 모형 | 결합 pdf의 분해 | 충분통계량 |
|---|---|---|
| 포아송 $(\theta)$ | $\theta^{\sum x_i}e^{-n\theta} \cdot \frac{1}{\prod x_i!}$ | $\sum X_i$ |
| 정규 $(\mu, \sigma^2)$ | $(2\pi\sigma^2)^{-n/2}\exp\left[-\frac{\sum x_i^2 - 2\mu\sum x_i + n\mu^2}{2\sigma^2}\right]$ | $(\sum X_i, \sum X_i^2)$ |
| 균일 $U(0, \theta)$ | $\theta^{-n}I(\max x_i < \theta) \cdot I(\min x_i > 0)$ | $\max X_i$ |
| 감마 $(\alpha, \beta)$ | $\frac{(\prod x_i)^{\alpha - 1}e^{-\sum x_i/\beta}}{[\Gamma(\alpha)\beta^\alpha]^n}$ | $(\prod X_i, \sum X_i)$ |

균일분포처럼 받침이 $\theta$에 의존하면 지시함수를 분해식에 꼭 넣어야 한다. 충분통계량의 일대일 함수도 충분하다. 정규분포에서는 $(\bar X, S^2)$도 충분통계량이다.

## 3. 라오-블랙웰 정리

**정리.** $Y_1$이 충분통계량이고 $Y_2$가 $\theta$의 불편추정량이면 $\varphi(Y_1) = E(Y_2 \mid Y_1)$은

1. $\theta$에 의존하지 않는 통계량이고 (충분성 덕분)
2. $E[\varphi(Y_1)] = \theta$ (반복기댓값)
3. $\text{Var}[\varphi(Y_1)] \le \text{Var}(Y_2)$ (전분산 공식)

이다.

1이 핵심이다. 충분통계량이 아닌 것으로 조건을 걸면 조건부기댓값에 $\theta$가 남아 추정량이 되지 못한다. 2, 3은 [3편](/posts/ms-03-multivariate)의 반복기댓값과 전분산 공식 $\text{Var}(Y_2) = E[\text{Var}(Y_2 \mid Y_1)] + \text{Var}[E(Y_2 \mid Y_1)]$에서 바로 나온다.

어떤 불편추정량이든 충분통계량으로 조건부기댓값을 취하면 같거나 더 좋아진다. 따라서 MVUE를 찾을 때 충분통계량의 함수만 보면 된다. MLE도 유일하게 존재하면 충분통계량의 함수다. 분해정리에서 $L(\theta) = k_1(u_1; \theta)k_2$이고 $k_2$는 $\theta$와 무관하므로 최대화가 $u_1$에만 의존하기 때문이다.

## 4. 완비성과 레만-셰페 정리

충분통계량의 함수인 불편추정량이 여러 개면 그중 어느 것이 MVUE인가? 하나뿐이도록 보장하는 조건이 완비성이다.

**정의.** 통계량 $Y_1$의 분포족 $\{f(y; \theta) : \theta \in \Omega\}$에서, 모든 $\theta$에 대해 $E_\theta[g(Y_1)] = 0$이면 $g(Y_1) = 0$(확률 1)이 따라올 때 **완비**라 한다.

완비이면 같은 기댓값을 갖는 $Y_1$의 함수가 하나뿐이다. 두 불편추정량 $\varphi_1(Y_1), \varphi_2(Y_1)$의 차이는 모든 $\theta$에서 기댓값이 0이므로 0이어야 한다.

**예.** $Y_1 = \sum X_i \sim \text{Poisson}(n\theta)$이면 $E[g(Y_1)] = e^{-n\theta}\sum_y g(y)(n\theta)^y/y! = 0$이 모든 $\theta > 0$에서 성립해야 한다. 거듭제곱급수가 항등적으로 0이면 모든 계수가 0이므로 $g(y) = 0$이다. 완비다.

**정리 (레만-셰페).** $Y_1$이 완비충분통계량이고 $\varphi(Y_1)$이 $\theta$의 불편추정량이면, $\varphi(Y_1)$은 **유일한** MVUE다.

라오-블랙웰로 MVUE는 $Y_1$의 함수 중에서 찾으면 되고, 완비성으로 $Y_1$의 함수인 불편추정량은 하나뿐이다. MVUE를 찾는 절차는 다음과 같다.

1. 완비충분통계량 $Y_1$을 찾는다.
2. $Y_1$의 함수 중 불편인 것을 찾는다(기댓값을 계산해 맞추거나, 아무 불편추정량에 $E(\cdot \mid Y_1)$을 취한다).

## 5. 지수족

완비충분통계량을 매번 따로 증명하지 않아도 되는 큰 분포족이 있다.

**정의.** pdf가

$$
f(x; \theta) = \exp[p(\theta)K(x) + H(x) + q(\theta)], \quad x \in \mathcal{S}
$$

꼴이고 (1) 받침 $\mathcal{S}$가 $\theta$와 무관, (2) $p(\theta)$가 $\theta$의 연속이고 비자명한 함수, (3) $K$와 $H$가 적절히 정칙이면 **정칙 지수족**이라 한다.

**정리.** 정칙 지수족의 확률표본에서 $Y_1 = \sum_{i=1}^n K(X_i)$는 완비충분통계량이다.

충분성은 분해정리에서 바로 보인다($\prod f = \exp[p(\theta)\sum K(x_i) + nq(\theta)]\exp[\sum H(x_i)]$). 완비성은 $Y_1$의 분포도 지수족이 되고, 라플라스 변환의 유일성에서 나온다.

| 분포 | $p(\theta)$ | $K(x)$ | 완비충분통계량 |
|---|---|---|---|
| 베르누이 $(\theta)$ | $\log\frac{\theta}{1 - \theta}$ | $x$ | $\sum X_i$ |
| 포아송 $(\theta)$ | $\log\theta$ | $x$ | $\sum X_i$ |
| 지수 (평균 $\theta$) | $-1/\theta$ | $x$ | $\sum X_i$ |
| 정규 ($\sigma$ 앎) | $\mu/\sigma^2$ | $x$ | $\sum X_i$ |
| 정규 ($\mu$ 앎) | $-1/(2\sigma^2)$ | $(x - \mu)^2$ | $\sum (X_i - \mu)^2$ |

모수가 여럿인 지수족 $\exp[\sum_j p_j(\boldsymbol\theta)K_j(x) + H(x) + q(\boldsymbol\theta)]$에서도 $(\sum K_1(X_i), \dots, \sum K_m(X_i))$가 완비충분통계량이다. 정규분포의 $(\sum X_i, \sum X_i^2)$가 그 예다. 그래서 정규표본에서 $\bar X$와 $S^2$은 각각 $\mu$와 $\sigma^2$의 MVUE다. $S^2$이 라오-크라메르 하한에 못 미쳐도 MVUE인 이유가 이것이다. 하한 자체가 달성 불가능한 경우다.

균일분포 $U(0, \theta)$는 받침이 $\theta$에 의존해 지수족이 아니다. 그래도 $Y_n = \max X_i$가 완비충분통계량임을 직접 보일 수 있고, $E(Y_n) = n\theta/(n + 1)$이므로 MVUE는 $\frac{n + 1}{n}Y_n$이다.

## 6. 모수 함수의 MVUE

관심 대상이 $\theta$가 아니라 $g(\theta)$일 때도 같은 절차를 쓴다.

**예.** 포아송 표본에서 $P(X = 0) = e^{-\theta}$(사건이 하나도 없을 확률)의 MVUE를 구한다. 간단한 불편추정량 $W = I(X_1 = 0)$에서 출발해 완비충분통계량 $Y = \sum X_i$로 조건부기댓값을 취한다. $Y = y$가 주어지면 $X_1 \sim b(y, 1/n)$이므로

$$
E(W \mid Y = y) = P(X_1 = 0 \mid Y = y) = \left(1 - \frac1n\right)^y
$$

이다. 레만-셰페 정리로 $\left(\frac{n - 1}{n}\right)^{Y}$가 $e^{-\theta}$의 유일한 MVUE다. MLE $e^{-\bar X}$(불변성)는 편향되어 있지만 $n$이 크면 둘이 가까워진다.

```r
set.seed(15)
n <- 10; theta <- 1.5
sims <- replicate(20000, { x <- rpois(n, theta); y <- sum(x)
  c(W = as.numeric(x[1] == 0), RB = ((n - 1) / n)^y, MLE = exp(-y / n)) })
tibble(estimator = rownames(sims), mean = rowMeans(sims), var = apply(sims, 1, var),
       mse = rowMeans((sims - exp(-theta))^2)) |> mutate(across(-estimator, \(v) round(v, 5)))
exp(-theta)
```

```text
# A tibble: 3 × 4
  estimator  mean     var     mse
  <chr>     <dbl>   <dbl>   <dbl>
1 W         0.225 0.174   0.174  
2 RB        0.223 0.0081  0.0081 
3 MLE       0.239 0.00842 0.00869
[1] 0.2231302
```

$W$(첫 관측값만 봄)는 불편이지만 분산이 크다. 라오-블랙웰화한 RB는 평균이 $e^{-1.5} = 0.2231$로 불편이면서 분산이 훨씬 작다. MLE는 약간 편향되어 있다.

## 7. 최소충분, 보조통계량, 바수 정리

충분통계량은 여러 개다. 표본 전체도 충분하다. 가장 많이 압축한 것, 즉 다른 모든 충분통계량의 함수인 충분통계량을 **최소충분통계량**이라 한다. 두 표본점 $\mathbf{x}, \mathbf{y}$에 대해 가능도비 $L(\theta; \mathbf{x})/L(\theta; \mathbf{y})$가 $\theta$와 무관한 것과 $T(\mathbf{x}) = T(\mathbf{y})$가 동치이면 $T$는 최소충분이다. 완비충분통계량은 최소충분이다.

반대로 분포가 $\theta$에 의존하지 않는 통계량을 **보조통계량**이라 한다. 혼자서는 $\theta$에 대해 아무 정보가 없다.

- 위치모수 모형($f(x - \theta)$)에서 표본범위 $Y_n - Y_1$, 표본분산 $S^2$
- 척도모수 모형($f(x/\theta)/\theta$)에서 $X_1/X_2$ 같은 비

**정리 (바수).** 완비충분통계량과 보조통계량은 독립이다.

보조통계량 $Z$에 대해 $P(Z \in A \mid Y_1)$은 충분성으로 $\theta$와 무관하고, $E[P(Z \in A \mid Y_1) - P(Z \in A)] = 0$이 모든 $\theta$에서 성립하므로 완비성에서 $P(Z \in A \mid Y_1) = P(Z \in A)$, 즉 독립이다.

**응용.** 정규분포에서 $\sigma^2$을 고정하고 $\mu$만 모수로 보면 $\bar X$는 완비충분이고 $S^2$은 보조통계량이다($X_i - \bar X$의 분포가 $\mu$와 무관). 바수 정리로 $\bar X$와 $S^2$이 독립이다. $\sigma^2$이 무엇이든 성립하므로 [4편](/posts/ms-04-special-distributions) Student 정리의 독립성을 다른 방법으로 증명한 것이다. 같은 논리로 $\bar X$는 표본범위, 중앙값과 평균의 차이 등 모든 위치 불변 통계량과 독립이다.

## 8. 비교

| 구분 | 앞의 것 | 뒤의 것 |
|---|---|---|
| 충분 대 보조 | $Y$가 주어지면 자료의 분포가 $\theta$와 무관 (정보 전부) | $Y$의 분포가 $\theta$와 무관 (정보 없음) |
| 충분 대 최소충분 | 정보를 잃지 않는 요약 | 그중 가장 많이 압축한 것 |
| 라오-블랙웰 대 레만-셰페 | 충분통계량으로 조건부기댓값을 취하면 분산이 준다 | 충분통계량이 완비이면 그 결과가 유일한 MVUE |
| 라오-크라메르 대 레만-셰페 | 하한을 주지만 달성되지 않을 수 있음 | 하한과 무관하게 MVUE를 직접 찾음 |
| 지수족 대 비지수족 | $\sum K(X_i)$가 자동으로 완비충분 | 받침이 $\theta$에 의존하면 직접 증명 (균일) |
| MVUE 대 MLE | 불편 중 최소 분산 | 불변성, 점근효율. 둘 다 충분통계량의 함수 |

## 요약

| 개념 | 핵심 |
|---|---|
| 충분통계량 | 조건부분포가 $\theta$와 무관, 분해정리 $k_1(u; \theta)k_2(\mathbf{x})$로 판정 |
| 라오-블랙웰 | $E(\text{불편추정량} \mid \text{충분})$은 불편이고 분산이 같거나 작다 |
| 완비성 | $E_\theta g(Y) = 0\ \forall\theta \Rightarrow g = 0$ |
| 레만-셰페 | 완비충분통계량의 불편 함수 = 유일한 MVUE |
| 지수족 | $\exp[p(\theta)K(x) + H(x) + q(\theta)]$, $\sum K(X_i)$가 완비충분 |
| 바수 | 완비충분 ⫫ 보조, 정규에서 $\bar X \perp S^2$ |

## 참고자료

- Hogg, R. V., McKean, J. W., & Craig, A. T. *Introduction to Mathematical Statistics* (8th ed.), Chapter 7.

다음 글: [수리통계학 - 최적 검정](/posts/ms-11-optimal-tests)
