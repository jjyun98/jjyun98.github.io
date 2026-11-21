---
title: '시계열 분석 - 비정상 시계열과 ARIMA'
published: 2022-10-17
draft: false
description: '분산이 변하는 시계열의 Box-Cox 변환, 결정적 추세와 확률적 추세, 차분 연산자와 과대차분, 계절 차분, ARIMA(p,d,q) 모형, ADF·KPSS 단위근 검정을 백화점 매출과 시뮬레이션 자료로 정리한다.'
series: '시계열 분석'
seriesOrder: 7
tags: ['시계열', 'R']
---

『SAS/ETS를 이용한 시계열분석』(조신섭·손영숙·성병찬)과 전북대학교 이영미 교수님 강의의 7장과 8장 부록(단위근 검정)을 정리했다. 6편의 ARMA 모형은 정상 시계열에만 쓸 수 있다. 실제 시계열은 대부분 추세나 계절성, 변하는 분산 때문에 비정상이다. 이 글은 비정상 시계열을 **정상으로 바꾸는 방법**을 다룬다.

```r title="환경 설정"
library(tidyverse)
library(forecast)
library(tseries)
library(patchwork)
theme_set(theme_minimal(base_size = 12))

data_url <- "https://raw.githubusercontent.com/Bricoler/time-series-analysis/172803efe88d52321e43a3533b2fd2d1eeb6a6e4/timedata/"
read_ts <- function(file, start, frequency = 12) {
  ts(scan(paste0(data_url, file), quiet = TRUE), start = start, frequency = frequency)
}
acf_pair <- function(x, title) {
  (autoplot(x) + labs(title = title, x = NULL, y = NULL)) /
    (ggAcf(x, lag.max = 24) + labs(title = NULL) | ggPacf(x, lag.max = 24) + labs(title = NULL))
}
```

## 1. 비정상 시계열의 종류

| 비정상의 원인 | 신호 | 대처 |
|---|---|---|
| 분산이 시간에 따라 변함 | 수준이 커질수록 변동 폭도 커짐 | 분산 안정화 변환(로그, Box-Cox) |
| 수준이 결정적으로 변함 | 매끄러운 추세 | 추세 회귀 후 잔차를 ARMA로 |
| 수준이 확률적으로 변함 | 정해진 방향 없이 흘러감, SACF가 아주 천천히 감소 | 차분 |
| 계절성 | 주기적 반복, SACF가 시차 $s$, $2s$에서 큼 | 계절 차분 |

분산 안정화를 **먼저** 하고 차분은 그다음에 한다. 차분한 뒤에는 음수가 생겨 로그를 취할 수 없기 때문이다.

## 2. 분산 안정화 변환

$Var(Z_t)$가 수준 $\mu_t$의 함수이면 적절한 변환으로 분산을 일정하게 만들 수 있다. 표준편차가 수준에 비례하면($\sigma_t \propto \mu_t$) 로그 변환이 맞다. 일반적으로는 Box-Cox 변환을 쓴다.

$$
f_\lambda(Z_t) = \begin{cases} \dfrac{Z_t^\lambda - 1}{\lambda}, & \lambda \ne 0 \\[2mm] \log Z_t, & \lambda = 0 \end{cases}, \qquad Z_t > 0
$$

| $\lambda$ | 변환 |
|---|---|
| 1 | 변환 없음 |
| 0.5 | 제곱근 |
| 0 | 로그 |
| -1 | 역수 |

```r w=9 h=5
depart <- read_ts("depart.txt", start = c(1984, 1))
lambda <- BoxCox.lambda(depart)
lambda

tibble(date = as.numeric(time(depart)),
       original = as.numeric(depart),
       sqrt = sqrt(as.numeric(depart)),
       log = log(as.numeric(depart)),
       `Box-Cox` = as.numeric(BoxCox(depart, lambda))) |>
  pivot_longer(-date) |>
  mutate(name = fct_inorder(name)) |>
  ggplot(aes(date, value)) +
  geom_line(color = "steelblue") +
  facet_wrap(~name, scales = "free_y") +
  labs(x = NULL, y = NULL)
```

![백화점 매출과 분산 안정화 변환](./images/ts07-01.png)

`BoxCox.lambda()`는 변환 후 분산이 가장 안정되는 $\lambda$를 추정한다. 해석이 쉬운 로그($\lambda = 0$)와 큰 차이가 없으면 로그를 쓴다. 로그를 취하면 12월의 봉우리 높이가 해마다 비슷해진다.

## 3. 결정적 추세와 확률적 추세

| | 결정적 추세 | 확률적 추세 |
|---|---|---|
| 모형 | $Z_t = \beta_0 + \beta_1 t + \epsilon_t$ | $Z_t = \delta + Z_{t-1} + \epsilon_t$ (확률보행) |
| 충격의 효과 | 일시적: 추세선으로 돌아옴 | 영구적: 이후 수준이 계속 바뀜 |
| 정상화 | 추세 제거(회귀) | 차분 |
| 장기 예측구간 | 일정한 폭 | 시간에 따라 계속 넓어짐 |

경제 자료는 강한 양의 상관 때문에 추세가 있는 것처럼 보이지만 실제로는 확률적으로 변하는 경우가 많다. 그림만으로 둘을 구별하기 어려우므로 단위근 검정(6절)을 쓴다.

## 4. 차분

차분 연산자 $\nabla = 1 - B$:

$$
\nabla Z_t = Z_t - Z_{t-1}, \qquad \nabla^2 Z_t = (1 - B)^2 Z_t = Z_t - 2Z_{t-1} + Z_{t-2}
$$

- 확률보행 $Z_t = Z_{t-1} + \epsilon_t$를 1차 차분하면 $\nabla Z_t = \epsilon_t$, 백색잡음이 된다.
- 결정적 선형 추세 $Z_t = \beta_0 + \beta_1 t + \epsilon_t$를 차분하면 $\nabla Z_t = \beta_1 + \epsilon_t - \epsilon_{t-1}$, 정상이지만 가역이 아닌 MA(1)이 된다. $p$차 다항 추세는 $p$번 차분하면 제거된다. 그러나 결정적 추세는 차분보다 회귀(분해법)로 제거하는 편이 모형이 간단하다.

```r w=9 h=5
set.seed(7)
rw <- ts(cumsum(rnorm(300)))
acf_pair(rw, "Random walk") 
```

![확률보행의 SACF와 SPACF](./images/ts07-02.png)

```r w=9 h=5
acf_pair(diff(rw), "Random walk after first differencing")
```

![차분한 확률보행의 SACF와 SPACF](./images/ts07-03.png)

확률보행의 SACF는 1에 가까운 값에서 아주 천천히 줄어든다. 비정상의 전형적인 신호다. 차분하면 모든 시차가 점선 안으로 들어온다.

### 과대차분

이미 정상인 시계열을 또 차분하면 오히려 문제가 생긴다. 백색잡음 $\epsilon_t$를 차분하면 $\nabla\epsilon_t = \epsilon_t - \epsilon_{t-1}$, $\theta = 1$인 가역이 아닌 MA(1)이 되고, 분산도 $2\sigma^2$으로 커진다. 차분 후 SACF의 시차 1 값이 $-0.5$에 가깝게 나오면 과대차분을 의심한다. 차분 차수는 보통 0, 1, 2 중 하나면 충분하다.

```r
set.seed(3)
x <- arima.sim(list(ar = 0.8), n = 300)    # 이미 정상
c(var_original = var(x), var_diff1 = var(diff(x)), var_diff2 = var(diff(x, differences = 2)))
c(acf_lag1_diff2 = acf(diff(x, differences = 2), plot = FALSE)$acf[2])
```

$\phi = 0.8$처럼 1에 가까운 정상 과정은 1차 차분에서 오히려 분산이 줄어든다($Var(\nabla Z_t) = 2\gamma_0(1 - \rho_1)$). 그래서 단위근인지 아닌지 그림만으로 헷갈리기 쉽다. 그러나 2차 차분을 하면 분산이 다시 원래 수준으로 커지고, 시차 1 자기상관이 약 $-0.55$로 과대차분의 전형적인 신호가 나타난다.

## 5. 계절 차분과 ARIMA

계절 주기가 $s$이면 계절 차분 $\nabla_s = 1 - B^s$를 쓴다.

$$
\nabla_{12} Z_t = Z_t - Z_{t-12}
$$

결정적 계절성(매년 똑같은 패턴)은 지시함수로, 확률적 계절성(패턴이 해마다 조금씩 바뀜)은 계절 차분으로 제거한다.

```r w=9 h=5
acf_pair(diff(diff(log(depart)), 12), "log(sales), lag-1 and lag-12 differenced")
```

![로그 변환, 1차 차분, 계절 차분 후의 백화점 매출](./images/ts07-04.png)

로그 → 1차 차분 → 계절 차분을 거치면 추세와 계절성이 모두 사라진다. 남은 SACF와 SPACF로 ARMA 차수를 정하는 것이 8편과 10편의 내용이다.

### ARIMA(p, d, q)

$d$번 차분한 $\nabla^d Z_t$가 정상 ARMA($p$, $q$)를 따르면 $Z_t$를 ARIMA($p$, $d$, $q$)라 한다.

$$
\phi(B)(1 - B)^d Z_t = \delta + \theta(B)\epsilon_t
$$

| 모형 | 다른 이름 |
|---|---|
| ARIMA(0, 1, 0) | 확률보행 |
| ARIMA(0, 1, 1) | 단순지수평활과 같은 예측 |
| ARIMA(0, 2, 2) | Holt 이중지수평활과 같은 예측 |
| ARIMA($p$, 0, $q$) | 정상 ARMA($p$, $q$) |

$d \ge 1$이면 $\phi(B)(1 - B)^d$는 단위근 $B = 1$을 가지므로 비정상이다. $d$번 차분하면 다항식 추세가 제거되고, $\delta \ne 0$이면 $d$차 다항 추세가 남는다.

```r w=9 h=5.5
set.seed(11)
z1 <- arima.sim(list(order = c(1, 1, 0), ar = 0.8), n = 200)

(acf_pair(z1, "ARIMA(1,1,0), phi = 0.8") | acf_pair(diff(z1), "after differencing"))
```

![ARIMA(1,1,0)과 차분 후 SACF·SPACF](./images/ts07-05.png)

차분하기 전 SACF는 천천히 감소하고, 차분한 뒤에는 AR(1)의 전형적인 모양(ACF 지수 감소, PACF 시차 1 절단)이 드러난다.

## 6. 단위근 검정

AR(1) $Z_t = \phi Z_{t-1} + \epsilon_t$에서 $\phi = 1$이면 확률보행(단위근), $|\phi| < 1$이면 정상이다.

$$
H_0: \phi = 1 \;\; (\text{단위근, 차분 필요}), \qquad H_1: |\phi| < 1 \;\; (\text{정상})
$$

양변에서 $Z_{t-1}$을 빼면 $\nabla Z_t = (\phi - 1) Z_{t-1} + \epsilon_t$이고, $\phi - 1 = 0$을 검정한다. 검정통계량 $t = (\hat\phi - 1)/SE(\hat\phi)$은 $H_0$에서 $t$분포를 따르지 않고 왼쪽으로 치우친 **Dickey-Fuller 분포**를 따른다. 그래서 별도의 임계값을 쓴다.

| 경우 | 적합 모형 | 대립가설의 모습 |
|---|---|---|
| 1 | $Z_t = \phi Z_{t-1} + \epsilon_t$ | 평균 0인 정상 |
| 2 | $Z_t = \delta + \phi Z_{t-1} + \epsilon_t$ | 평균이 0이 아닌 정상 |
| 3 | $Z_t = \delta + \beta t + \phi Z_{t-1} + \epsilon_t$ | 추세 주위의 정상 (추세 정상) |

오차의 자기상관을 흡수하려고 $\nabla Z_{t-j}$ 항을 추가한 것이 ADF(augmented Dickey-Fuller) 검정이다. 추세 정상까지 포함한 회귀는 다음과 같고, 검정하는 것은 $Z_{t-1}$의 계수다.

$$
\nabla Z_t = \alpha + \gamma t + \rho Z_{t-1} + \sum_{i=1}^{k} c_i \nabla Z_{t-i} + \epsilon_t, \qquad H_0: \rho = 0 \;\; (\rho = \phi - 1)
$$

### KPSS 검정

KPSS(Kwiatkowski-Phillips-Schmidt-Shin) 검정은 **가설의 방향이 ADF와 반대**다. 시계열을 결정적 추세, 확률보행, 정상 오차의 합으로 놓는다.

$$
Z_t = \xi t + r_t + \epsilon_t, \qquad r_t = r_{t-1} + u_t, \quad u_t \sim (0, \sigma_u^2)
$$

$$
H_0: \sigma_u^2 = 0 \;\; (\text{확률보행 성분이 없음, 정상}), \qquad H_1: \sigma_u^2 > 0 \;\; (\text{단위근})
$$

상수(수준 정상) 또는 상수와 추세(추세 정상)에 회귀한 잔차를 $e_t$, 그 누적합을 $S_t = \sum_{i=1}^{t} e_i$라 하면 통계량은 다음과 같다.

$$
\mathrm{KPSS} = \frac{1}{n^2} \sum_{t=1}^{n} \frac{S_t^2}{\hat\sigma_l^2}
$$

$\hat\sigma_l^2$은 시차 $l$까지의 자기공분산을 쓰는 장기분산 추정량이다. $H_0$에서 $S_t$가 확률보행처럼 퍼지지 않으므로 통계량이 작고, 단위근이 있으면 $S_t$가 크게 벌어져 통계량이 커진다. 그래서 **큰 값에서 기각**한다.

ADF는 단위근이 있다는 가정을 기본으로 두고 정상이라는 증거를 찾고, KPSS는 정상이라는 가정을 기본으로 두고 단위근의 증거를 찾는다. 둘을 함께 보면 결론이 더 안정적이다.

| ADF | KPSS | 해석 |
|---|---|---|
| 기각 | 기각 못 함 | 정상이라는 증거가 일치한다 |
| 기각 못 함 | 기각 | 단위근이라는 증거가 일치한다. 차분한다 |
| 기각 못 함 | 기각 못 함 | 자료가 부족해 판단할 수 없다 (검정력 부족) |
| 기각 | 기각 | 두 검정이 충돌한다. 구조 변화, 계절성, 차분 정상과 추세 정상의 혼합 등을 의심한다 |

```r
adf.test(rw)
adf.test(diff(rw))
kpss.test(rw, null = "Level")
kpss.test(diff(rw), null = "Level")
ndiffs(log(depart), test = "kpss")
nsdiffs(log(depart), test = "seas")
```

- `tseries::adf.test()`는 경우 3(상수와 추세 포함)으로 검정한다. 확률보행은 $H_0$를 기각하지 못하고($p = 0.146$), 차분한 계열은 기각한다($p \le 0.01$).
- 같은 확률보행에 KPSS는 정상 가설을 기각하고($p \le 0.01$), 차분한 계열에서는 기각하지 못한다($p \ge 0.1$). 두 검정이 모두 "확률보행은 단위근, 차분하면 정상"으로 일치한다. `ndiffs(log(depart))`와 `nsdiffs(log(depart))`는 둘 다 1을 주어 앞의 로그, 1차 차분, 계절 차분 선택과 맞는다.
- `tseries::kpss.test()`는 `null = "Level"`(수준 정상)이 기본이고, 추세 정상을 검정하려면 `null = "Trend"`를 쓴다. 보고되는 $p$값은 표를 보간한 값이라 0.01과 0.1 사이로 제한된다.
- `forecast::ndiffs()`는 기본으로 KPSS 검정(`test = "kpss"`)을 반복해 필요한 일반 차분 횟수를 정한다. ADF 검정으로 하려면 `ndiffs(x, test = "adf")`로 지정한다. `nsdiffs()`는 기본으로 계절 강도 측도(`test = "seas"`)로 계절 차분 횟수를 정한다.
- 단위근 검정은 검정력이 낮아 $\phi = 0.95$ 같은 정상 과정도 단위근으로 판정하기 쉽다. SACF 모양과 함께 판단한다.

## 7. 결정적 추세와 확률적 추세의 비교

추세가 있는 시계열은 추세를 회귀로 제거할 수도 있고(추세 정상), 차분으로 제거할 수도 있다(차분 정상). 두 방법은 충격의 성질에 대한 가정이 다르고, 그 차이는 장기 예측구간에서 드러난다. 같은 평균 기울기(0.1)를 갖는 두 시계열을 생성해 두 모형을 모두 적합한다.

- 추세 정상: $Z_t = 5 + 0.1t + X_t$, $X_t$는 AR(1) ($\phi = 0.6$)
- 차분 정상: $Z_t = Z_{t-1} + 0.1 + \varepsilon_t$ (표류 있는 확률보행)

```r
set.seed(7)
n <- 200
z_det <- ts(5 + 0.1 * (1:n) + arima.sim(list(ar = 0.6), n))
z_sto <- ts(5 + cumsum(0.1 + rnorm(n)))

tibble(자료 = c("추세 정상", "차분 정상"),
       ADF_p = c(adf.test(z_det)$p.value, adf.test(z_sto)$p.value),
       KPSS_p = c(kpss.test(z_det, null = "Trend")$p.value, kpss.test(z_sto, null = "Trend")$p.value))

fc_both <- function(z, name) {
  f1 <- forecast(Arima(z, order = c(1, 0, 0), xreg = seq_along(z)), xreg = n + 1:50)
  f2 <- forecast(Arima(z, order = c(0, 1, 0), include.drift = TRUE), h = 50)
  bind_rows(
    tibble(h = 1:50, 폭 = as.numeric(f1$upper[, 2] - f1$lower[, 2]), 모형 = "추세 회귀 + AR(1)"),
    tibble(h = 1:50, 폭 = as.numeric(f2$upper[, 2] - f2$lower[, 2]), 모형 = "차분 (확률보행 + 표류)")
  ) |> mutate(자료 = name)
}
widths <- bind_rows(fc_both(z_det, "추세 정상 자료"), fc_both(z_sto, "차분 정상 자료"))
widths |> filter(h %in% c(1, 10, 50)) |> pivot_wider(names_from = h, values_from = 폭, names_prefix = "h=")

ggplot(widths, aes(h, 폭, color = 모형)) +
  geom_line(linewidth = 1) +
  facet_wrap(~자료) +
  labs(x = "예측 시차", y = "95% 예측구간의 폭", color = NULL)
```

![두 모형의 시차별 95% 예측구간 폭](./images/ts07-06.png)

ADF 검정은 추세 정상 자료에서 단위근을 기각하고(유의확률 0.01 이하), 확률보행 자료에서는 기각하지 못한다(0.218). KPSS(`null = "Trend"`)는 반대로 추세 정상 자료에서 기각하지 못하고(0.1 이상), 확률보행 자료에서 기각한다(0.011). 두 검정이 같은 방향을 가리켜 앞의 비교표에서 첫째, 둘째 행에 해당한다. 두 자료의 성질이 올바르게 구분된다. 이 값은 시드 7의 한 번의 생성 결과다.

1시차 예측구간은 네 경우 모두 비슷하다. 차이는 장기에서 나타난다. 추세 정상 모형에서는 충격이 감쇠하므로 폭이 몇 시차 만에 일정한 값으로 수렴하고, 차분 모형에서는 충격이 누적되므로 폭이 $\sqrt{h}$에 비례해 계속 넓어진다. 추세 정상 자료에 차분 모형을 쓰면 장기 불확실성을 과대평가하고, 확률보행 자료에 추세 회귀를 쓰면 과소평가한다. 단위근 검정은 이 선택을 위한 것이다.

## 요약

| 단계 | 확인 | 조치 | R |
|---|---|---|---|
| 1 | 분산이 수준에 비례 | 로그·Box-Cox | `log()`, `BoxCox.lambda()` |
| 2 | SACF가 아주 천천히 감소 | 1차 차분 | `diff(x)` |
| 3 | 시차 $s$, $2s$의 SACF가 큼 | 계절 차분 | `diff(x, lag = 12)` |
| 4 | 단위근 여부 | ADF(귀무: 단위근)와 KPSS(귀무: 정상)를 함께 | `adf.test()`, `kpss.test()`, `ndiffs()` |
| 주의 | 차분 후 시차 1 SACF가 $-0.5$ 근처 | 과대차분 의심 | |
| 결과 | $\nabla^d Z_t$가 정상 ARMA | ARIMA($p$, $d$, $q$) | `Arima(order = c(p, d, q))` |
