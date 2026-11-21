---
title: '수리통계학 - 최적 검정'
published: 2026-11-22
draft: false
description: '최강력 기각역과 네이만-피어슨 보조정리, 균일최강력검정과 그것이 없는 경우, 단조가능도비와 칼린-루빈 정리, 정규모형의 가능도비 검정(t검정, 두 표본 t, 분산비 F), 왈드의 축차확률비검정, 미니맥스 검정과 분류 규칙을 정리한다.'
series: '수리통계학'
seriesOrder: 11
tags: ['통계학', '수학', 'R']
---

Hogg·McKean·Craig 『Introduction to Mathematical Statistics』 8장을 정리했다. [6편](/posts/ms-06-testing-basics)에서 검정의 크기와 검정력을 정의했다. 이 글은 "크기 $\alpha$인 검정 중 검정력이 가장 큰 검정"을 찾는다. 단순가설끼리는 네이만-피어슨 보조정리가 답을 주고, 단측 복합가설은 단조가능도비가 있으면 답이 있다. 답이 없는 일반적인 경우에는 [9편](/posts/ms-09-likelihood-tests-em)의 가능도비 검정을 쓴다.

```r title="환경 설정"
library(tidyverse)
theme_set(theme_minimal(base_size = 12))
```

## 1. 최강력 기각역

단순가설 $H_0: \theta = \theta'$ 대 $H_1: \theta = \theta''$를 생각한다. 크기 $\alpha$인 기각역 $C$, 즉 $P_{\theta'}(\mathbf{X} \in C) = \alpha$인 것 중에서, 크기가 $\alpha$인 다른 모든 기각역 $A$에 대해

$$
P_{\theta''}(\mathbf{X} \in C) \ge P_{\theta''}(\mathbf{X} \in A)
$$

이면 $C$를 크기 $\alpha$의 **최강력 기각역**이라 한다.

**정리 (네이만-피어슨 보조정리).** $k > 0$에 대해

$$
C = \left\{\mathbf{x} : \frac{L(\theta'; \mathbf{x})}{L(\theta''; \mathbf{x})} \le k\right\}, \qquad P_{\theta'}(\mathbf{X} \in C) = \alpha
$$

이면 $C$는 크기 $\alpha$의 최강력 기각역이다.

가능도비가 작은 점, 즉 $H_0$보다 $H_1$ 아래에서 상대적으로 더 그럴듯한 점부터 기각역에 넣는다. 정해진 "예산" $\alpha$($H_0$ 아래 확률)로 $H_1$ 아래 확률을 가장 많이 사는 방법이다. 가성비가 좋은 순서($H_1$ 확률 / $H_0$ 확률이 큰 순서)로 담는 배낭 문제와 같다.

증명은 $C$와 다른 기각역 $A$의 차이를 본다. $C \cap A^c$에서는 $L(\theta'') \ge L(\theta')/k$이고 $C^c \cap A$에서는 $L(\theta'') < L(\theta')/k$이므로

$$
P_{\theta''}(C) - P_{\theta''}(A) = \int_{C \cap A^c} L(\theta'') - \int_{C^c \cap A} L(\theta'') \ge \frac1k\left[\int_{C \cap A^c} L(\theta') - \int_{C^c \cap A} L(\theta')\right] = \frac1k[P_{\theta'}(C) - P_{\theta'}(A)] \ge 0
$$

이다. 마지막은 두 기각역의 크기가 같거나 $A$의 크기가 $\alpha$ 이하이기 때문이다.

**예.** $N(\theta, 1)$ 표본에서 $H_0: \theta = 0$ 대 $H_1: \theta = 1$이면

$$
\frac{L(0)}{L(1)} = \exp\left[-\sum x_i + \frac{n}{2}\right] \le k \iff \bar x \ge c
$$

이다. 가능도비가 $\bar x$의 감소함수이므로 최강력 기각역은 $\bar x \ge c$ 꼴이고, 크기 조건에서 $c = z_\alpha/\sqrt n$이다.

```r
n <- c(4, 9, 16); cval <- qnorm(0.95) / sqrt(n)
tibble(n, critical = cval, power = 1 - pnorm((cval - 1) * sqrt(n))) |> mutate(across(-n, \(v) round(v, 4)))
```

```text
# A tibble: 3 × 3
      n critical power
  <dbl>    <dbl> <dbl>
1     4    0.822 0.639
2     9    0.548 0.912
3    16    0.411 0.991
```

이산분포에서는 가능도비가 몇 개의 값만 가져 크기를 정확히 $\alpha$로 맞추지 못할 수 있다. 확률화 검정을 쓰면 맞출 수 있고, 보조정리는 확률화 검정까지 포함하면 항상 성립한다.

## 2. 균일최강력검정

$H_1$이 복합가설이면 $H_1$의 각 $\theta$마다 최강력 기각역이 다를 수 있다. 하나의 기각역 $C$가 $H_1$의 **모든** $\theta$에서 최강력이면 **균일최강력**(UMP) 검정이라 한다.

1절의 예에서 대립가설의 값 1을 다른 $\theta'' > 0$으로 바꿔도 가능도비는 여전히 $\bar x$의 감소함수이고 기각역 $\bar x \ge z_\alpha/\sqrt n$은 $\theta''$와 무관하다. 따라서 $H_0: \theta = 0$ 대 $H_1: \theta > 0$의 UMP 검정이다.

양측 대립가설 $H_1: \theta \ne 0$에는 UMP 검정이 없다. $\theta'' > 0$에 대해서는 $\bar x \ge c$가, $\theta'' < 0$에 대해서는 $\bar x \le -c$가 최강력인데, 하나의 기각역이 둘을 동시에 만족할 수 없다. 양측 $z$검정 $|\bar x| \ge z_{\alpha/2}/\sqrt n$은 어느 쪽 대립가설에서도 최강력이 아니지만, 대신 **불편**(검정력이 모든 대립가설에서 $\alpha$ 이상)인 검정 중에서는 균일최강력이다.

## 3. 단조가능도비

UMP 검정이 존재하는지를 판정하는 일반적인 조건이다.

**정의.** $\theta_1 < \theta_2$이면 가능도비 $L(\theta_1; \mathbf{x})/L(\theta_2; \mathbf{x})$가 통계량 $y = u(\mathbf{x})$의 단조함수일 때, 분포족이 $u(\mathbf{X})$에서 **단조가능도비**(MLR)를 갖는다고 한다.

**정리 (칼린-루빈).** 가능도비가 $y = u(\mathbf{x})$의 감소함수인 MLR을 가지면, $H_0: \theta \le \theta'$ 대 $H_1: \theta > \theta'$의 크기 $\alpha$ UMP 검정은

$$
\text{기각역: } Y \ge c, \qquad P_{\theta'}(Y \ge c) = \alpha
$$

이다. 이 검정의 검정력 함수는 $\theta$에 대해 증가하므로, 복합 귀무가설에서도 경계점 $\theta'$의 크기가 전체 크기다.

정칙 지수족 $f(x; \theta) = \exp[p(\theta)K(x) + H(x) + q(\theta)]$에서 $p(\theta)$가 증가함수이면

$$
\frac{L(\theta_1)}{L(\theta_2)} = \exp\left\{[p(\theta_1) - p(\theta_2)]\sum K(x_i) + n[q(\theta_1) - q(\theta_2)]\right\}
$$

가 $\sum K(x_i)$의 감소함수이므로 MLR을 갖는다. 단측 검정의 UMP 검정은 [10편](/posts/ms-10-sufficiency)의 완비충분통계량 $\sum K(X_i)$로 만든다.

**예.** 베르누이에서 $H_0: p \le 0.1$ 대 $H_1: p > 0.1$ ($n = 50$). $Y = \sum X_i \sim b(50, p)$이고 $Y \ge c$에서 기각한다. 이산분포라 크기를 0.05 이하로 맞추는 가장 작은 $c$를 고른다.

```r
c_val <- min(which(pbinom(0:50 - 1, 50, 0.1, lower.tail = FALSE) <= 0.05)) - 1
size <- pbinom(c_val - 1, 50, 0.1, lower.tail = FALSE)
power <- sapply(c(0.15, 0.2, 0.3), \(p) pbinom(c_val - 1, 50, p, lower.tail = FALSE))
c(c = c_val, size = size, power_p015 = power[1], power_p02 = power[2], power_p03 = power[3])
```

```text
          c        size  power_p015   power_p02   power_p03 
10.00000000  0.02453794  0.20890633  0.55625959  0.95976837
```

$Y \ge 10$에서 기각하면 실제 크기는 0.025로 명목 0.05보다 작다. $Y \ge 9$로 하면 크기가 0.05를 넘는다.

## 4. 가능도비 검정

UMP 검정이 없는 경우(양측, 장애모수가 있는 경우)에는 [9편](/posts/ms-09-likelihood-tests-em)의 일반 가능도비 검정 $\Lambda = \max_\omega L/\max_\Omega L \le k$를 쓴다. 정규모형에서는 $\Lambda$가 익숙한 통계량의 단조함수가 되어 정확한 분포를 얻는다.

| 문제 | $\Lambda$와 동치인 통계량 | 분포 |
|---|---|---|
| $H_0: \mu = \mu_0$, $\sigma^2$ 모름 | $t = \dfrac{\bar X - \mu_0}{S/\sqrt n}$, $\Lambda^{2/n} = \dfrac{1}{1 + t^2/(n-1)}$ | $t(n - 1)$ |
| $H_0: \mu_1 = \mu_2$, 공통 $\sigma^2$ 모름 | $t = \dfrac{\bar X - \bar Y}{S_p\sqrt{1/n_1 + 1/n_2}}$ | $t(n_1 + n_2 - 2)$ |
| $H_0: \sigma_1^2 = \sigma_2^2$ | $F = S_1^2/S_2^2$ | $F(n_1 - 1, n_2 - 1)$ |
| $H_0: \sigma^2 = \sigma_0^2$ | $(n - 1)S^2/\sigma_0^2$ | $\chi^2(n - 1)$ |

두 표본 $t$검정을 유도하면, $\Omega$에서 $\hat\mu_1 = \bar x$, $\hat\mu_2 = \bar y$, $\hat\sigma^2 = [\sum(x_i - \bar x)^2 + \sum(y_j - \bar y)^2]/(n_1 + n_2)$이고, $\omega$에서는 공통평균을 합친 표본평균으로 추정한다. 분산 추정값의 비가 $\Lambda^{2/(n_1 + n_2)}$이고, 분모를 분해하면 $1 + t^2/(n_1 + n_2 - 2)$가 된다. 12편의 분산분석 $F$검정이 이것을 여러 집단으로 일반화한 것이다.

분산비 $F$검정은 등분산 가정을 확인하는 용도로 많이 쓰였지만 정규성 위반에 매우 민감하다. 실무에서는 등분산을 가정하지 않는 웰치 검정을 기본으로 쓴다.

## 5. 축차확률비검정

표본 크기를 미리 정하지 않고, 관측값을 하나씩 얻으면서 결론이 충분히 분명해지면 멈추는 검정이다. 단순가설 $H_0: \theta = \theta_0$ 대 $H_1: \theta = \theta_1$에서 $n$번째까지의 가능도비 $R_n = L(\theta_1; x_1, \dots, x_n)/L(\theta_0; x_1, \dots, x_n)$을 계산해

$$
R_n \ge A \Rightarrow H_1 \text{ 채택}, \qquad R_n \le B \Rightarrow H_0 \text{ 채택}, \qquad B < R_n < A \Rightarrow \text{한 개 더 관측}
$$

한다. 원하는 오류 확률 $\alpha, \beta$에 대해 왈드의 근사 경계는

$$
A \approx \frac{1 - \beta}{\alpha}, \qquad B \approx \frac{\beta}{1 - \alpha}
$$

이다. $H_1$ 채택 시점에서 $R_n \ge A$이므로 $P_{\theta_1}(H_1 \text{ 채택}) \ge A\,P_{\theta_0}(H_1 \text{ 채택})$, 즉 $1 - \beta \ge A\alpha$에서 나온다. 같은 $\alpha, \beta$를 얻는 고정 표본 검정보다 **평균 표본 크기**가 훨씬 작다(왈드-울포위츠: SPRT는 평균 표본 크기를 최소로 한다).

**예.** 불량률 $H_0: p = 0.1$ 대 $H_1: p = 0.2$, $\alpha = \beta = 0.05$. 로그를 취하면 각 관측이 $\log R_n$에 $x\log 2 + (1 - x)\log(8/9)$를 더한다.

```r
sprt <- function(p_true, p0 = 0.1, p1 = 0.2, alpha = 0.05, beta = 0.05) {
  logA <- log((1 - beta) / alpha); logB <- log(beta / (1 - alpha)); s <- 0; n <- 0
  repeat { x <- rbinom(1, 1, p_true); n <- n + 1
    s <- s + x * log(p1 / p0) + (1 - x) * log((1 - p1) / (1 - p0))
    if (s >= logA) return(c(n = n, H1 = 1)); if (s <= logB) return(c(n = n, H1 = 0)) }
}
set.seed(16)
r0 <- replicate(5000, sprt(0.1)); r1 <- replicate(5000, sprt(0.2))
fixed_n <- ceiling(((qnorm(0.95) * sqrt(0.1 * 0.9) + qnorm(0.95) * sqrt(0.2 * 0.8)) / 0.1)^2)
c(type1 = mean(r0["H1", ]), type2 = 1 - mean(r1["H1", ]), ASN_H0 = mean(r0["n", ]), ASN_H1 = mean(r1["n", ]), fixed_n = fixed_n)
```

```text
   type1    type2   ASN_H0   ASN_H1  fixed_n 
  0.0392   0.0468  73.5404  65.3112 133.0000
```

두 오류율(0.039, 0.047)이 목표 0.05보다 조금 작다. 경계를 넘는 순간 $R_n$이 경계를 약간 지나치는데 왈드 근사는 이를 무시하므로 보수적으로 작동한다. 그리고 평균 표본 크기는 고정 표본 검정(정규근사로 계산한 $n$)의 절반 정도다. 다만 표본 크기가 확률변수라 가끔은 고정 표본보다 길어진다. 임상시험의 중간 분석과 품질관리의 축차 샘플링이 이 생각에서 나왔다.

## 6. 미니맥스 검정과 분류

두 오류를 모두 고려하는 다른 기준도 있다. 제1종 오류의 손실을 $\mathcal{L}(\theta', \theta'')$, 제2종 오류의 손실을 $\mathcal{L}(\theta'', \theta')$라 하면, 두 위험 중 큰 쪽을 최소로 하는 **미니맥스 검정**은 두 위험이 같아지도록 $k$를 고른 네이만-피어슨 검정이다.

두 가설에 사전확률 $\pi', \pi''$를 주면 베이즈 위험(평균 손실)을 최소로 하는 규칙도 가능도비 규칙이 된다.

$$
\frac{L(\theta'; \mathbf{x})}{L(\theta''; \mathbf{x})} \le \frac{\pi''\mathcal{L}(\theta'', \theta')}{\pi'\mathcal{L}(\theta', \theta'')} \Rightarrow \theta'' \text{로 판정}
$$

이것을 관측값을 두 집단 중 하나로 배정하는 **분류** 문제로 보면, 두 다변량정규분포(공분산 같음)의 로그가능도비가 $\mathbf{x}$의 일차함수가 되어 선형판별분석(LDA)이 나온다([분류 글](/posts/dm-classification)). 검정과 분류는 같은 수학이다.

## 7. 비교

| 상황 | 최적 검정 | 근거 |
|---|---|---|
| 단순 대 단순 | 가능도비 $\le k$ | 네이만-피어슨 |
| 단측 복합, MLR | 충분통계량 $\ge c$ | 칼린-루빈 |
| 양측 | UMP 없음, UMP 불편 검정 | 불편성으로 범위를 제한 |
| 장애모수, 일반 | 가능도비 검정 | 정규모형이면 t, F와 동치 |
| 표본을 순차적으로 | SPRT | 평균 표본 크기 최소 |
| 두 오류를 손실로 평가 | 미니맥스, 베이즈 규칙 | 결국 가능도비 규칙 |

| 구분 | 고정 표본 검정 | 축차 검정 |
|---|---|---|
| 표본 크기 | 미리 고정 | 확률변수, 평균이 작음 |
| 제어하는 것 | $\alpha$를 정하고 검정력을 계산 | $\alpha, \beta$를 모두 정함 |
| 적합한 곳 | 자료를 한꺼번에 얻을 때 | 관측이 비싸고 하나씩 들어올 때 |

## 요약

| 개념 | 핵심 |
|---|---|
| 네이만-피어슨 | $L(\theta')/L(\theta'') \le k$가 최강력 기각역 |
| UMP | $H_1$의 모든 $\theta$에서 최강력, 양측에는 없음 |
| 단조가능도비 | 가능도비가 $u(\mathbf{x})$의 단조함수, 지수족이면 성립 |
| 칼린-루빈 | MLR이면 단측 검정의 UMP는 $Y \ge c$ |
| 정규 가능도비 검정 | t, 두 표본 t, F, 카이제곱 검정 |
| SPRT | $B < R_n < A$이면 계속, $A \approx (1-\beta)/\alpha$, $B \approx \beta/(1-\alpha)$ |
| 분류 | 사전확률과 손실을 넣은 가능도비 규칙, 정규면 LDA |

## 참고자료

- Hogg, R. V., McKean, J. W., & Craig, A. T. *Introduction to Mathematical Statistics* (8th ed.), Chapter 8.

다음 글: [수리통계학 - 정규선형모형](/posts/ms-12-normal-linear-models)
