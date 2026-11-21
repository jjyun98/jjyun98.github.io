---
title: '수리통계학 - 가능도 기반 검정과 EM 알고리즘'
published: 2026-11-22
draft: false
description: '가능도비 검정과 윌크스 정리, 왈드 검정과 스코어 검정의 유도와 점근 동등성, 다모수 피셔정보행렬과 장애모수, 제약이 여럿인 가능도비 검정과 자유도, G검정, 불완전 자료의 EM 알고리즘과 단조 증가 성질을 정리한다.'
series: '수리통계학'
seriesOrder: 9
tags: ['통계학', '수학', 'R']
---

Hogg·McKean·Craig 『Introduction to Mathematical Statistics』 6장 뒷부분(6.3–6.6)을 정리했다. [8편](/posts/ms-08-mle)의 MLE 이론을 검정으로 확장한다. 가능도에서 나오는 세 가지 검정(가능도비, 왈드, 스코어)은 대표본에서 모두 카이제곱분포를 따르고 서로 동등하다. 이어서 모수가 여럿인 경우와, 자료 일부가 관측되지 않았을 때 MLE를 구하는 EM 알고리즘을 다룬다.

```r title="환경 설정"
library(tidyverse)
theme_set(theme_minimal(base_size = 12))
```

## 1. 세 가지 가능도 검정

$H_0: \theta = \theta_0$ 대 $H_1: \theta \ne \theta_0$를 생각한다. 로그가능도 $l(\theta)$의 그림 하나에서 세 검정이 모두 나온다.

| 검정 | 통계량 | 보는 것 |
|---|---|---|
| 가능도비 | $\chi^2_L = -2\log\Lambda = 2[l(\hat\theta) - l(\theta_0)]$ | 두 점의 로그가능도 높이 차이 |
| 왈드 | $\chi^2_W = nI(\hat\theta)(\hat\theta - \theta_0)^2$ | MLE와 $\theta_0$의 가로 거리 (MLE의 표준오차로 잼) |
| 스코어 (라오) | $\chi^2_R = \dfrac{[l'(\theta_0)]^2}{nI(\theta_0)}$ | $\theta_0$에서 로그가능도의 기울기 |

**가능도비 검정**은 $\Lambda = L(\theta_0)/L(\hat\theta) \le 1$이 작을 때(참값 후보 $\theta_0$의 가능도가 최대 가능도보다 훨씬 작을 때) 기각한다.

**정리 (윌크스).** 정칙조건과 $H_0$ 아래에서 $-2\log\Lambda \xrightarrow{D} \chi^2(1)$이다.

$l(\theta_0)$를 $\hat\theta$ 주위에서 전개하면 $l'(\hat\theta) = 0$이므로

$$
l(\theta_0) = l(\hat\theta) + \frac12 l''(\theta^*)(\theta_0 - \hat\theta)^2, \qquad -2\log\Lambda = \frac{-l''(\theta^*)}{n}\left[\sqrt n(\hat\theta - \theta_0)\right]^2
$$

이다. 앞 인자는 $I(\theta_0)$로 확률수렴하고, [8편](/posts/ms-08-mle)의 점근정규성으로 $\sqrt{nI(\theta_0)}(\hat\theta - \theta_0) \xrightarrow{D} N(0, 1)$이므로 그 제곱은 $\chi^2(1)$이다.

같은 전개에서 $-2\log\Lambda \approx nI(\theta_0)(\hat\theta - \theta_0)^2$이므로 왈드 통계량과 차이가 0으로 확률수렴한다. 스코어 통계량은 $l'(\theta_0) \approx -l''(\theta_0)(\hat\theta - \theta_0) \approx nI(\theta_0)(\hat\theta - \theta_0)$을 넣으면 역시 같은 양이 된다. 세 검정은 **점근적으로 동등**하다.

실제 차이는 계산에 있다. 왈드는 MLE만 구하면 되고(회귀 출력의 $z$값), 스코어는 $\theta_0$에서만 계산하므로 대립가설 모형을 적합할 필요가 없다. 가능도비는 두 모형을 모두 적합해야 하지만 모수 변환에 불변이고 소표본에서 가장 안정적이다. 왈드 검정은 $\theta$를 $g(\theta)$로 바꾸면 통계량 값이 바뀐다.

**예.** 정규분포($\sigma$ 앎)의 평균이면 $-2\log\Lambda = n(\bar x - \mu_0)^2/\sigma^2$이고 세 통계량이 정확히 같으며 정확히 $\chi^2(1)$이다. 포아송에서는 셋이 다르다.

```r
set.seed(13)
x <- rpois(30, 2.6); n <- length(x); theta0 <- 2; that <- mean(x)
l <- function(t) sum(dpois(x, t, log = TRUE))
stats <- c(LR = 2 * (l(that) - l(theta0)), Wald = n * (that - theta0)^2 / that, Score = (sum(x) / theta0 - n)^2 / (n / theta0))
rbind(statistic = stats, p_value = pchisq(stats, 1, lower.tail = FALSE)) |> round(4)
```

```text
              LR   Wald  Score
statistic 4.9288 4.1538 5.4000
p_value   0.0264 0.0415 0.0201
```

포아송에서 $I(\theta) = 1/\theta$이므로 왈드는 $\hat\theta$, 스코어는 $\theta_0$에서 정보를 계산한다. 이 표본은 $\hat\theta > \theta_0$이라 왈드 통계량이 가장 작고 스코어가 가장 크다. 세 값 모두 같은 결론을 준다.

## 2. 다모수: 피셔정보행렬

$\boldsymbol\theta = (\theta_1, \dots, \theta_p)'$이면 피셔정보는 행렬이 된다.

$$
\mathbf{I}(\boldsymbol\theta)_{jk} = E\left[\frac{\partial \log f}{\partial\theta_j}\frac{\partial \log f}{\partial\theta_k}\right] = -E\left[\frac{\partial^2 \log f}{\partial\theta_j\partial\theta_k}\right]
$$

MLE는 $\sqrt n(\hat{\boldsymbol\theta} - \boldsymbol\theta) \xrightarrow{D} N_p(\mathbf{0}, \mathbf{I}(\boldsymbol\theta)^{-1})$이고, 불편추정량에 대한 라오-크라메르 하한은 공분산행렬 $\mathbf{I}^{-1}/n$이다.

**예.** 정규분포 $(\mu, \sigma^2)$에서 2차 도함수의 기댓값을 계산하면

$$
\mathbf{I}(\mu, \sigma^2) = \begin{pmatrix} 1/\sigma^2 & 0 \\ 0 & 1/(2\sigma^4) \end{pmatrix}
$$

이다. 비대각이 0이라 $\hat\mu$와 $\hat\sigma^2$은 점근적으로 독립이다([4편](/posts/ms-04-special-distributions)의 Student 정리와 일치).

**장애모수의 비용.** 관심 모수가 $\theta_1$이고 나머지가 장애모수일 때, $\hat\theta_1$의 점근분산은 $[\mathbf{I}^{-1}]_{11}$이다. 일반적으로 $[\mathbf{I}^{-1}]_{11} \ge 1/\mathbf{I}_{11}$이고, 등호는 $\theta_1$과 나머지 모수의 정보가 직교할 때(비대각이 0)만 성립한다. 다른 모수를 모르면 관심 모수에 대한 정보가 줄어든다. 회귀에서 설명변수 사이의 공선성이 계수의 분산을 키우는 것이 이 현상이다.

## 3. 제약이 여럿인 가능도비 검정

모수공간 $\Omega$(차원 $p$) 안의 부분공간 $\omega$(차원 $p - r$)에 대해 $H_0: \boldsymbol\theta \in \omega$를 검정한다. $\omega$는 $\boldsymbol\theta$에 $r$개의 제약을 건 것이다.

$$
\Lambda = \frac{\max_{\boldsymbol\theta \in \omega}L(\boldsymbol\theta)}{\max_{\boldsymbol\theta \in \Omega}L(\boldsymbol\theta)}, \qquad -2\log\Lambda \xrightarrow{D} \chi^2(r) \quad (H_0 \text{ 아래})
$$

자유도는 **제약의 개수** = (전체 모형의 자유 모수 수) − (귀무 모형의 자유 모수 수)다.

**예 1: 정규평균, 분산 모름.** $H_0: \mu = \mu_0$에서 $\omega$의 MLE는 $\hat\sigma_0^2 = \frac1n\sum(x_i - \mu_0)^2$이고

$$
\Lambda^{2/n} = \frac{\hat\sigma^2}{\hat\sigma_0^2} = \frac{\sum(x_i - \bar x)^2}{\sum(x_i - \bar x)^2 + n(\bar x - \mu_0)^2} = \frac{1}{1 + t^2/(n - 1)}
$$

이다. $\Lambda$가 $t^2$의 감소함수이므로 가능도비 검정은 정확히 $|t|$가 클 때 기각하는 $t$검정이다. 정규모형의 표준 검정들(t, F)은 모두 가능도비 검정으로 유도된다. 11편과 12편에서 이를 일반화한다.

**예 2: 다항분포 적합도.** $k$개 범주의 다항분포에서 $H_0: p_i = p_{i0}$이면 $\Omega$의 MLE는 $\hat p_i = O_i/n$이고

$$
-2\log\Lambda = 2\sum_{i=1}^k O_i\log\frac{O_i}{E_i}, \qquad E_i = np_{i0}
$$

이다. 이것을 **G 통계량**이라 하고 자유도는 $k - 1$이다. $O_i/E_i$를 1 근처에서 전개하면 [6편](/posts/ms-06-testing-basics)의 피어슨 $\sum(O_i - E_i)^2/E_i$가 나온다. 같은 주사위 자료로 비교한다.

```r
obs <- c(15, 25, 18, 22, 12, 28); E <- rep(20, 6)
G <- 2 * sum(obs * log(obs / E)); Q <- sum((obs - E)^2 / E)
rbind(statistic = c(G = G, Pearson = Q), p_value = pchisq(c(G, Q), 5, lower.tail = FALSE)) |> round(4)
```

```text
               G Pearson
statistic 9.5100  9.3000
p_value   0.0904  0.0977
```

두 통계량이 가깝고 결론도 같다. 피어슨 통계량은 G 통계량의 스코어 검정형이라고 볼 수 있다.

## 4. EM 알고리즘

관측한 자료 $\mathbf{x}$ 외에 관측하지 못한 자료 $\mathbf{z}$가 있고, $(\mathbf{x}, \mathbf{z})$가 모두 있으면 가능도가 간단해지는 경우가 있다. 중도절단된 생존시간, 혼합분포에서 각 관측값이 어느 성분에서 왔는지, 결측값이 그런 예다. 관측자료의 가능도 $L(\theta \mid \mathbf{x})$를 직접 최대화하기 어려울 때 **완전자료 가능도** $L^c(\theta \mid \mathbf{x}, \mathbf{z})$를 이용한다.

**EM 알고리즘.** 현재 추정값 $\hat\theta^{(m)}$에서

1. **E 단계**: 관측자료와 현재 추정값이 주어졌을 때 완전자료 로그가능도의 조건부기댓값을 구한다.
$$
Q(\theta \mid \hat\theta^{(m)}) = E_{\hat\theta^{(m)}}\left[\log L^c(\theta \mid \mathbf{x}, \mathbf{Z}) \mid \mathbf{x}\right]
$$
2. **M 단계**: $\hat\theta^{(m+1)} = \arg\max_\theta Q(\theta \mid \hat\theta^{(m)})$

**정리.** EM의 각 단계에서 관측자료 가능도는 줄지 않는다: $L(\hat\theta^{(m+1)} \mid \mathbf{x}) \ge L(\hat\theta^{(m)} \mid \mathbf{x})$.

$\log L(\theta \mid \mathbf{x}) = \log L^c(\theta \mid \mathbf{x}, \mathbf{z}) - \log k(\mathbf{z} \mid \theta, \mathbf{x})$($k$는 $\mathbf{z}$의 조건부 pdf)의 양변에 $\hat\theta^{(m)}$ 아래 조건부기댓값을 취하면 $\log L(\theta \mid \mathbf{x}) = Q(\theta \mid \hat\theta^{(m)}) - H(\theta \mid \hat\theta^{(m)})$이다. M 단계는 $Q$를 늘리고, $H(\theta \mid \hat\theta^{(m)}) \le H(\hat\theta^{(m)} \mid \hat\theta^{(m)})$은 옌센 부등식(KL 발산 ≥ 0)이다. 따라서 $\log L$이 증가한다.

EM은 수렴이 보장되지만(극대점이나 안장점으로) 속도가 선형이라 느리고, 여러 극대점이 있으면 출발점에 따라 다른 곳에 수렴한다.

**예: 중도절단된 지수분포.** 평균 $\theta$인 지수분포에서 $n_1$개는 정확히 관측했고($x_1, \dots, x_{n_1}$), $n_2$개는 $c_j$에서 중도절단되어 "$c_j$보다 크다"는 것만 안다. 지수분포의 무기억성으로 절단된 값의 조건부기댓값은 $E(Z_j \mid Z_j > c_j) = c_j + \theta$이므로

$$
\text{E 단계:}\ Q(\theta \mid \hat\theta^{(m)}) = -n\log\theta - \frac{1}{\theta}\left[\sum x_i + \sum_j (c_j + \hat\theta^{(m)})\right], \qquad \text{M 단계:}\ \hat\theta^{(m+1)} = \frac{\sum x_i + \sum c_j + n_2\hat\theta^{(m)}}{n}
$$

이다. 고정점은 $\hat\theta = (\sum x_i + \sum c_j)/n_1$(총 관측시간 / 사건 수)으로, 관측자료 가능도를 직접 최대화한 MLE와 같다.

```r
set.seed(14)
t_true <- rexp(50, rate = 1 / 5); cens <- runif(50, 2, 12)
obs <- pmin(t_true, cens); event <- t_true <= cens
theta <- mean(obs); path <- theta
for (m in 1:30) { theta <- (sum(obs[event]) + sum(obs[!event]) + sum(!event) * theta) / length(obs); path <- c(path, theta) }
c(n_event = sum(event), em = theta, closed_form = sum(obs) / sum(event), naive_mean = mean(obs))
round(path[c(1:5, 31)], 4)
```

```text
    n_event          em closed_form  naive_mean 
  40.000000    3.812904    3.812904    3.050323 
[1] 3.0503 3.6604 3.7824 3.8068 3.8117 3.8129
```

절단된 값을 그냥 관측값처럼 평균내면(naive) 평균을 과소추정한다. EM은 몇 번 만에 닫힌 해 3.81에 수렴한다. 참값 5와는 차이가 있는데, 지수모형 MLE의 표준오차가 $\hat\theta/\sqrt{n_1} \approx 3.81/\sqrt{40} = 0.60$이므로 이 정도 차이는 표본 변동으로 나올 수 있다. 생존분석의 지수모형 MLE가 이 값이고, [생존분석 글](/posts/biostat-survival-analysis)의 카플란-마이어 추정량도 절단을 이런 식으로 반영한다.

## 5. 비교

| 검정 | 적합할 모형 | 정보 계산 위치 | 모수 변환에 불변 | 대표적 쓰임 |
|---|---|---|---|---|
| 가능도비 | 귀무·대립 모두 | 필요 없음 | 예 | 중첩 모형 비교, 이탈도 차이 |
| 왈드 | 대립(전체)만 | $\hat\theta$ | 아니오 | 회귀계수의 $z$값, 신뢰구간 |
| 스코어 | 귀무만 | $\theta_0$ | 예 | 피어슨 카이제곱, 로그순위 검정 |

| 구분 | 단일 모수 | 다모수 |
|---|---|---|
| 정보 | $I(\theta)$ | 행렬 $\mathbf{I}(\boldsymbol\theta)$ |
| 점근분산 | $1/I(\theta)$ | $\mathbf{I}^{-1}$, 장애모수가 있으면 $[\mathbf{I}^{-1}]_{11} \ge 1/\mathbf{I}_{11}$ |
| 가능도비 자유도 | 1 | 제약의 개수 $r$ |

| 구분 | 직접 최대화 (뉴턴-랩슨) | EM |
|---|---|---|
| 필요한 것 | 관측자료 가능도와 도함수 | 완전자료 가능도의 조건부기댓값 |
| 수렴 | 빠름 (2차), 발산할 수 있음 | 느림 (1차), 가능도가 단조 증가 |
| 표준오차 | 헤세행렬에서 바로 | 별도 계산 필요 |

## 요약

| 개념 | 핵심 |
|---|---|
| 가능도비 | $-2\log\Lambda = 2[l(\hat\theta) - l(\theta_0)] \xrightarrow{D} \chi^2$ (윌크스) |
| 왈드 | $nI(\hat\theta)(\hat\theta - \theta_0)^2$ |
| 스코어 | $[l'(\theta_0)]^2/[nI(\theta_0)]$ |
| 점근 동등성 | 세 통계량의 차이 → 0 |
| 정보행렬 | $\sqrt n(\hat{\boldsymbol\theta} - \boldsymbol\theta) \xrightarrow{D} N(\mathbf{0}, \mathbf{I}^{-1})$ |
| 자유도 | 제약의 개수 = 전체 모수 수 − 귀무 모수 수 |
| G 통계량 | $2\sum O\log(O/E)$, 피어슨과 근사적으로 같음 |
| EM | E: 완전자료 로그가능도의 조건부기댓값, M: 최대화. 가능도 단조 증가 |

## 참고자료

- Hogg, R. V., McKean, J. W., & Craig, A. T. *Introduction to Mathematical Statistics* (8th ed.), Chapter 6.3–6.6.

다음 글: [수리통계학 - 충분성](/posts/ms-10-sufficiency)
