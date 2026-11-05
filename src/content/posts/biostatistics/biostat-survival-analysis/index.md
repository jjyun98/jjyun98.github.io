---
title: '생명과학통계 - 생존분석'
published: 2026-05-30
draft: false
description: '생존시간과 중도절단, 생존함수와 위험함수, 협심증 생명표, 신장이식 환자의 Kaplan-Meier 추정, 흑색종 환자의 로그순위 검정, 폐암 환자의 Cox 비례위험모형과 가정 확인을 SAS PROC LIFETEST, PROC PHREG로 정리한다.'
series: '생명과학통계'
tags: ['생명과학통계', '생존분석', 'Kaplan-Meier', 'Cox 회귀', 'SAS']
---

『생명과학연구를 위한 통계적 방법』(이재원·박미라·유한나)과 전북대학교 최혜미 교수님 강의를 바탕으로 정리했다. 생존분석은 관심 사건이 일어날 때까지의 시간을 분석한다. 사건은 사망뿐 아니라 재발, 관해 종료, 감염, 부작용 발생처럼 연구에서 정의한 무엇이든 될 수 있다.

## 생존시간과 중도절단

생존시간 $T$는 기준 시점(진단, 무작위 배정, 수술 등)부터 사건까지의 시간이다. 생존자료가 일반 연속형 자료와 다른 이유는 **중도절단** 때문이다.

![추적 기간과 중도절단](./figures/fig-bio-censoring.svg)

| 유형 | 상황 | 아는 것 |
|---|---|---|
| 오른쪽 중도절단 | 연구 종료까지 사건 없음, 추적 탈락, 다른 원인 사망 | $T > C$ |
| 왼쪽 중도절단 | 관찰 시작 전에 이미 사건 발생 | $T < C$ |
| 구간 중도절단 | 정기 검진 사이에 사건 발생 | $L < T \le R$ |

생명과학 자료는 대부분 오른쪽 중도절단이다. 관찰값은 시간과 사건 여부의 쌍이다.

$$
X_i = \min(T_i, C_i), \qquad \delta_i = I(T_i \le C_i)
$$

$\delta_i = 1$이면 사건 관찰, $0$이면 중도절단이다. 중도절단된 관측값을 버리거나 사건으로 취급하면 생존을 과소추정한다. 생존분석의 표준 방법은 **비정보적 중도절단**, 즉 중도절단 여부가 사건 위험과 무관하다는 가정을 둔다. 부작용 때문에 탈락한 환자가 많다면 이 가정이 깨진다.

## 생존함수와 위험함수

$$
S(t) = P(T > t) = 1 - F(t)
$$

$$
h(t) = \lim_{\Delta t \to 0} \frac{P(t \le T < t + \Delta t \mid T \ge t)}{\Delta t} = \frac{f(t)}{S(t)}
$$

$h(t)$는 $t$까지 사건이 없던 사람이 바로 다음 순간 사건을 겪을 순간 위험률이다. 누적위험함수 $H(t) = \int_0^t h(u)\,du$를 쓰면 다음 관계가 성립한다.

$$
S(t) = \exp\{-H(t)\}, \qquad H(t) = -\log S(t)
$$

| 위험함수 모양 | 예 |
|---|---|
| 일정 (지수분포) | 우발적 사고 |
| 증가 | 노화, 진행성 질환 |
| 감소 | 수술 직후 위험이 높다가 안정 |
| 욕조형 | 신생아기와 노년기에 높은 사망 위험 |

생존시간은 오른쪽으로 치우치고 중도절단이 있어 평균 대신 **중위 생존시간**($\hat S(t) = 0.5$가 되는 첫 시점)과 **$t$년 생존율**을 보고한다.

## 생명표 방법

자료가 구간별로 집계되어 있거나 표본이 클 때 쓴다. 구간 $(t_{i-1}, t_i]$마다 다음을 둔다.

- $n_i$: 구간 시작 시 위험집단 수, $d_i$: 사건 수, $c_i$: 중도절단 수
- 유효 표본 수 $n_i' = n_i - c_i / 2$ (중도절단이 구간 중간에 고르게 일어난다고 가정)

$$
\hat q_i = \frac{d_i}{n_i'}, \qquad \hat p_i = 1 - \hat q_i, \qquad \hat S(t_i) = \prod_{j=1}^{i} \hat p_j
$$

### 예제 7.1: 협심증 환자의 생명표

협심증이 있는 남성 2,418명의 생존자료다. 진단 시점부터 사망까지의 시간을 1년 간격으로 집계했다.

```sas
data angina;
  do time = 0.5 to 15.5;          /* 구간 중앙값 */
    do censor = 1, 0;             /* 1 = 사망, 0 = 중도절단 */
      input freq @@;
      output;
    end;
  end;
  datalines;
456 0 226 39 152 22 171 23 135 24 125 107 83 133 74
102 51 68 42 64 43 45 34 53 18 33 9 27 6 23 0 30
;
run;

proc lifetest data=angina method=life intervals=1 to 15 by 1 plots=(s, h);
  time time*censor(0);
  freq freq;
run;
```

한 줄에 (사망자 수, 중도절단 수) 쌍이 구간 순서대로 들어 있다. 처음 다섯 구간을 손으로 계산하면 다음과 같다.

| 구간(년) | $n_i$ | $d_i$ | $c_i$ | $n_i'$ | $\hat q_i$ | $\hat S(t_i)$ |
|---|---:|---:|---:|---:|---:|---:|
| [0, 1) | 2418 | 456 | 0 | 2418.0 | 0.1886 | 0.8114 |
| [1, 2) | 1962 | 226 | 39 | 1942.5 | 0.1163 | 0.7170 |
| [2, 3) | 1697 | 152 | 22 | 1686.0 | 0.0902 | 0.6524 |
| [3, 4) | 1523 | 171 | 23 | 1511.5 | 0.1131 | 0.5786 |
| [4, 5) | 1329 | 135 | 24 | 1317.0 | 0.1025 | 0.5193 |

다음 구간의 위험집단은 $n_{i+1} = n_i - d_i - c_i$다. 진단 후 1년 생존율은 약 81%, 5년 생존율은 약 52%다. 출력의 생명표에서 같은 값을 확인할 수 있다.

## Kaplan-Meier 추정

사건이 실제로 일어난 시점마다 생존확률을 갱신하는 곱한계(product-limit) 추정량이다. 사건 시점 $t_{(1)} < t_{(2)} < \cdots$에서 $n_i$를 직전 위험집단 수, $d_i$를 사건 수라 하면 다음과 같다.

$$
\hat S(t) = \prod_{t_{(i)} \le t} \left( 1 - \frac{d_i}{n_i} \right)
$$

분산은 Greenwood 공식으로 추정한다.

$$
\widehat{Var}\big(\hat S(t)\big) = \hat S(t)^2 \sum_{t_{(i)} \le t} \frac{d_i}{n_i (n_i - d_i)}
$$

중도절단된 사람은 그 시점에 생존확률을 떨어뜨리지 않고, 다음 사건 시점의 위험집단에서만 빠진다. 그래서 Kaplan-Meier 곡선은 사건 시점에서만 내려가는 계단 함수다.

### 예제 7.2: 신장이식 환자의 호전기간

신장이식 수술을 받은 환자 15명의 호전기간(일)이다. `+`는 중도절단이다.

> 3.0, 4.0+, 4.5, 4.5, 5.5, 6.0, 6.4, 6.5, 7.0, 7.5, 8.4+, 10.0, 10.0+, 12.0, 15.0

| $t_{(i)}$ | $n_i$ | $d_i$ | $1 - d_i/n_i$ | $\hat S(t)$ |
|---:|---:|---:|---:|---:|
| 3.0 | 15 | 1 | 14/15 | 0.933 |
| 4.5 | 13 | 2 | 11/13 | 0.790 |
| 5.5 | 11 | 1 | 10/11 | 0.718 |
| 6.0 | 10 | 1 | 9/10 | 0.646 |
| 6.4 | 9 | 1 | 8/9 | 0.574 |
| 6.5 | 8 | 1 | 7/8 | 0.503 |
| 7.0 | 7 | 1 | 6/7 | 0.431 |
| 7.5 | 6 | 1 | 5/6 | 0.359 |
| 10.0 | 4 | 1 | 3/4 | 0.269 |
| 12.0 | 2 | 1 | 1/2 | 0.135 |
| 15.0 | 1 | 1 | 0/1 | 0.000 |

- 4.0+에서 중도절단된 1명은 생존확률을 떨어뜨리지 않고, 4.5의 위험집단에서 빠진다($15 - 1 - 1 = 13$).
- 10.0에는 사건 1명과 중도절단 1명이 함께 있다. 같은 시점이면 사건이 먼저 일어난 것으로 보므로 $n = 4$에서 1명이 사건이고, 12.0의 위험집단은 2명이다.
- $\hat S(t)$가 처음 0.5 아래로 내려가는 7.0이 중위 호전기간이다.

![Kaplan-Meier 곡선 읽는 법](./figures/fig-bio-km-curve.svg)

```sas
data rem;
  input time censor @@;     /* censor: 1 = 사건, 0 = 중도절단 */
  datalines;
3.0 1 4.0 0 4.5 1 4.5 1 5.5 1 6.0 1 6.4 1 6.5 1 7.0 1
7.5 1 8.4 0 10.0 1 10.0 0 12.0 1 15.0 1
;
run;

proc lifetest data=rem method=km plots=survival(atrisk cl) outsurv=km_out;
  time time*censor(0);
run;
```

- `method=km`: Kaplan-Meier(누적한계추정법). 기본값이다.
- `time time*censor(0)`: 괄호 안 값(0)이 중도절단을 뜻한다.
- `plots=survival(atrisk cl)`: 곡선 아래 위험집단 수와 신뢰띠를 그린다.
- `outsurv=`: 시점별 $\hat S(t)$와 신뢰한계를 데이터셋으로 저장한다.

출력의 `Quartile Estimates` 표에 중위 생존시간과 신뢰구간이 나온다.

## 두 생존곡선의 비교

$$
H_0: S_1(t) = S_2(t) \;\; \text{for all } t, \qquad H_1: S_1(t) \ne S_2(t) \;\; \text{for some } t
$$

### 로그순위 검정

각 사건 시점 $t_{(i)}$에서 다음 2×2 표를 만든다.

| 집단 | 사건 | 사건 없음 | 위험집단 |
|---|---:|---:|---:|
| 1 | $d_{1i}$ | $n_{1i} - d_{1i}$ | $n_{1i}$ |
| 2 | $d_{2i}$ | $n_{2i} - d_{2i}$ | $n_{2i}$ |
| 합 | $d_i$ | $n_i - d_i$ | $n_i$ |

$H_0$에서 주변합이 고정되면 $d_{1i}$는 초기하분포를 따른다.

$$
E_{1i} = \frac{n_{1i} d_i}{n_i}, \qquad V_{1i} = \frac{n_{1i} n_{2i} d_i (n_i - d_i)}{n_i^2 (n_i - 1)}
$$

$$
\chi^2_{LR} = \frac{\left[ \sum_i (d_{1i} - E_{1i}) \right]^2}{\sum_i V_{1i}} \sim \chi^2(1)
$$

사건 시점별 2×2 표를 층으로 보고 합치는 것이므로 [분할표 글](/posts/biostat-contingency-diagnostic)의 CMH 검정과 같은 구조다.

### 가중 검정

$\sum_i w_i (d_{1i} - E_{1i})$ 꼴로 가중치를 주면 다른 검정이 된다.

| 검정 | 가중치 $w_i$ | 민감한 차이 |
|---|---|---|
| 로그순위 | 1 | 후기 차이, 비례위험일 때 가장 강력 |
| Gehan(일반화 Wilcoxon) | $n_i$ | 초기 차이 |
| Tarone-Ware | $\sqrt{n_i}$ | 중간 |
| Peto-Peto | $\hat S(t_{(i)})$ | 초기 차이, 중도절단 패턴에 덜 민감 |

생존곡선이 **교차**하면 차이가 서로 상쇄되어 어느 검정도 차이를 잘 잡지 못한다. 곡선을 먼저 그려 보고 검정을 고른다. 셋 이상의 집단은 자유도 $K - 1$인 카이제곱 검정으로 확장되고, `strata` 문에 `/ adjust=bonferroni` 같은 옵션으로 쌍별 비교를 보정할 수 있다.

### 예제 7.8: 흑색종 환자의 면역요법 비교

2기~4기 흑색종(melanoma) 환자 30명에게 BCG(11명) 또는 CP(*Corynebacterium parvum*, 19명) 면역요법을 적용하고 생존시간(월)을 조사했다. `+`는 중도절단이다.

| 처리 | 생존시간 |
|---|---|
| BCG | 33.7+, 3.9, 10.5, 5.4, 19.5, 23.8+, 7.9, 16.9+, 16.6+, 33.7+, 17.1+ |
| CP | 8.0, 26.9+, 21.4+, 18.1+, 16.0+, 6.9, 11.0+, 24.8+, 23.0+, 8.3, 10.8+, 12.2+, 12.5+, 24.4, 7.7, 14.8+, 8.2+, 8.2+, 7.8+ |

```sas
data melanoma;
  input time censor group @@;   /* group: 1 = BCG, 2 = CP */
  datalines;
33.7 0 1 3.9 1 1 10.5 1 1 5.4 1 1 19.5 1 1 23.8 0 1
7.9 1 1 16.9 0 1 16.6 0 1 33.7 0 1 17.1 0 1
8.0 1 2 26.9 0 2 21.4 0 2 18.1 0 2 16.0 0 2 6.9 1 2
11.0 0 2 24.8 0 2 23.0 0 2 8.3 1 2 10.8 0 2 12.2 0 2
12.5 0 2 24.4 1 2 7.7 1 2 14.8 0 2 8.2 0 2 8.2 0 2
7.8 0 2
;
run;

proc lifetest data=melanoma plots=survival(atrisk);
  time time*censor(0);
  strata group / test=(logrank wilcoxon);
run;
```

두 군 모두 중도절단 비율이 높고(BCG 6/11, CP 13/19) 표본이 작아 곡선이 크게 떨어지지 않는다. 출력의 `Test of Equality over Strata` 표에서 로그순위와 Wilcoxon 검정의 $p$값을 함께 본다. 이런 소표본에서는 검정력이 낮으므로 유의하지 않다고 해서 두 요법의 효과가 같다고 결론 내리지 않는다.

셋 이상의 집단을 비교하는 예로는 SAS 내장 `sashelp.bmt`(골수이식 환자 137명, 질병군 3개)가 있다. `strata Group / test=logrank adjust=sidak;`으로 쌍별 비교의 다중성을 보정한다.

## Cox 비례위험모형

여러 공변량을 함께 보려면 회귀모형이 필요하다. Cox 모형은 위험함수를 다음처럼 둔다.

$$
h(t \mid x) = h_0(t) \exp(\beta_1 x_1 + \cdots + \beta_k x_k)
$$

기준위험함수 $h_0(t)$의 모양은 정하지 않는다(준모수적 모형). 두 사람의 위험비는 다음과 같다.

$$
\frac{h(t \mid x_i)}{h(t \mid x_j)} = \exp\{\beta^T (x_i - x_j)\}
$$

시간 $t$가 없다. **위험비가 시간에 따라 일정하다**는 것이 비례위험 가정이다.

### 부분가능도

$h_0(t)$를 모른 채로 $\beta$를 추정하기 위해, 각 사건 시점에서 "위험집단 $R(t_{(i)})$ 중 실제로 사건을 겪은 사람이 $i$일 조건부 확률"만 곱한다.

$$
L(\beta) = \prod_{i:\, \delta_i = 1} \frac{\exp(\beta^T x_i)}{\sum_{j \in R(t_{(i)})} \exp(\beta^T x_j)}
$$

$h_0(t_{(i)})$가 분자와 분모에서 약분되어 사라진다. 같은 시점에 사건이 여럿이면 Breslow(SAS 기본), Efron, exact 근사를 쓴다(`model ... / ties=efron`).

### 해석

| 값 | 의미 |
|---|---|
| $\hat\beta_j$ | 로그 위험비 |
| $e^{\hat\beta_j}$ | $x_j$ 한 단위 증가 시 위험비 (다른 공변량 고정) |
| $e^{\hat\beta_j} > 1$ | 위험 증가 (생존 불리) |
| $e^{\hat\beta_j} < 1$ | 위험 감소 (생존 유리) |

위험비 0.5는 "생존시간이 두 배"가 아니라 "어느 시점에서든 순간 위험이 절반"이라는 뜻이다.

```sas
proc phreg data=sashelp.bmt;
  class Group (ref='ALL') / param=ref;
  model T*Status(0) = Group / ties=efron risklimits;
  hazardratio 'Group' Group / diff=ref;
run;
```

- `class ... (ref=)`: 기준 범주를 정한다. `param=ref`는 기준 범주 대비 가변수다.
- `risklimits`: 위험비와 95% 신뢰구간을 출력한다.
- 전체 모형 검정은 `Testing Global Null Hypothesis` 표의 가능도비, 점수, Wald 검정 세 가지로 나온다. 공변량이 범주 하나뿐이고 동점을 Breslow 방식으로 처리하면 점수 검정은 로그순위 검정과 같다.

### 예제 7.6: 폐암 환자의 생존시간

폐암 환자 40명의 생존시간(일)과 예후 인자다. 표준 치료(`trt = 1`)와 시험 치료(`trt = 2`)에 무작위 배정되었다.

| 변수 | 내용 |
|---|---|
| `time`, `censor` | 생존일수, 사건 여부(1 = 사망, 0 = 중도절단) |
| `x1` | 진단 시 수행능력 점수 (0~100) |
| `x2` | 나이 |
| `x3` | 진단부터 연구 시작까지 개월 수 |
| `trt` | 1 = 표준, 2 = 시험 |
| `type` | 종양 유형 (1 = squamous, 2 = small, 3 = adeno, 4 = large) |

```sas
data lung;
  input time censor x1 x2 x3 trt type @@;
  datalines;
411 1 70 64  5 1 1  126 1 60 63  9 1 1  118 1 70 65 11 1 1
 82 1 40 69 10 1 1    8 1 40 63 58 1 1   25 0 70 48  9 1 1
 11 1 70 48 11 1 1   54 1 80 63  4 1 2  153 1 60 63 14 1 2
 16 1 30 53  4 1 2   56 1 80 43 12 1 2   21 1 40 55  2 1 2
287 1 60 66 25 1 2   10 1 40 67 23 1 2    8 1 20 61 19 1 3
 12 1 50 63  4 1 3  177 1 50 66 16 1 4   12 1 40 68 12 1 4
200 1 80 41 12 1 4  250 1 70 53  8 1 4  100 1 60 37 13 1 4
999 1 90 54 12 2 1  231 0 50 52  8 2 1  991 1 70 50  7 2 1
  1 1 20 65 21 2 1  201 1 80 52 28 2 1   44 1 60 70 13 2 1
 15 1 50 40 13 2 1  103 0 70 36 22 2 2    2 1 40 44 36 2 2
 20 1 30 54  9 2 2   51 1 30 59 87 2 2   18 1 40 69  5 2 3
 90 1 60 50 22 2 3   84 1 80 62  4 2 3  164 1 70 68 15 2 4
 19 1 30 39  4 2 4   43 1 60 49 11 2 4  340 1 80 64 10 2 4
231 1 70 67 18 2 4
;
run;

proc phreg data=lung;
  class trt (ref='1') type (ref='1') / param=ref;
  model time*censor(0) = x1 x2 x3 trt type / ties=efron risklimits;
run;
```

- `risklimits`(`rl`): 위험비와 95% 신뢰구간을 출력한다.
- `type`은 범주가 4개라 기준(squamous) 대비 가변수 3개가 들어간다. `Type 3 Tests` 표가 `type` 전체의 효과 검정이다.
- `x1`(수행능력)의 위험비가 1보다 작으면 수행능력 점수가 높을수록 사망 위험이 낮다는 뜻이다. 10점 단위로 보려면 `hazardratio 'x1' x1 / units=10;`을 추가한다.
- 치료 효과는 다른 예후 인자를 보정한 뒤의 `trt` 위험비로 해석한다.

변수 선택이 필요하면 `model` 문에 `/ selection=backward slstay=0.1`을 준다. 다만 연구 가설인 치료 변수는 선택 절차와 상관없이 모형에 남겨 둔다.

## 비례위험 가정 확인

가정이 깨지면 $e^{\hat\beta}$는 시간에 따라 변하는 위험비의 평균 같은 값이 되어 해석이 어렵다.

| 방법 | 보는 것 | SAS |
|---|---|---|
| log-log 그림 | 집단별 $\log\{-\log \hat S(t)\}$ 대 $\log t$가 평행한가 | `proc lifetest plots=(lls)` |
| 시간 상호작용 | $x \cdot \log t$ 항이 유의한가 | `phreg`의 프로그래밍 문 |
| Schoenfeld 잔차 | 잔차가 시간에 따라 추세를 보이는가 | `output out= ressch=` |
| 누적 잔차 | 관측 누적 잔차가 모의 경로 안에 있는가 | `assess ph / resample` |

$\log\{-\log S(t \mid x)\} = \log\{-\log S_0(t)\} + \beta^T x$이므로, 비례위험이면 집단별 곡선은 세로로 $\beta$만큼 평행 이동한 모양이다.

```sas
proc lifetest data=sashelp.bmt plots=(lls) notable;
  time T*Status(0);
  strata Group;
run;

proc phreg data=sashelp.bmt;
  class Group (ref='ALL') / param=ref;
  model T*Status(0) = Group AML_hi_t;
  AML_hi_t = (Group = 'AML-High Risk') * log(T);   /* 시간과의 상호작용 */
run;

proc phreg data=sashelp.bmt;
  class Group (ref='ALL') / param=ref;
  model T*Status(0) = Group;
  assess ph / resample seed=1;
run;
```

`model` 문 뒤의 대입문은 시간에 따라 값이 바뀌는 **시간의존 공변량**을 만든다. 이 항의 계수가 유의하면 그 집단의 위험비가 시간에 따라 변한다는 뜻이다.

가정이 깨졌을 때의 대응은 다음과 같다.

- **층화 Cox 모형**: 가정을 위반한 변수로 층을 나눠 층마다 다른 $h_0(t)$를 허용한다(`strata` 문). 그 변수의 효과는 추정하지 않는다.
- **시간의존 계수**: 위처럼 $x \cdot g(t)$ 항을 넣어 시간에 따라 변하는 위험비를 직접 모델링한다.
- **구간별 분석**: 예를 들어 1년 전후로 나눠 따로 위험비를 보고한다.

## 예측 생존함수

$$
S(t \mid x) = S_0(t)^{\exp(\beta^T x)}
$$

```sas
data covs;
  length Group $ 15;
  input Group $ 1-15;
  datalines;
ALL
AML-Low Risk
AML-High Risk
;
run;

proc phreg data=sashelp.bmt plots(overlay)=survival;
  class Group (ref='ALL') / param=ref;
  model T*Status(0) = Group;
  baseline covariates=covs out=pred survival=s lower=lo upper=hi;
run;
```

`baseline` 문은 `covariates=`에 준 공변량 조합마다 예측 생존곡선을 계산해 저장하고 그린다.

## 요약

| 목적 | 방법 | SAS |
|---|---|---|
| 집계 자료의 생존함수 | 생명표 | `lifetest method=life` |
| 개별 자료의 생존함수 | Kaplan-Meier, Greenwood 분산 | `lifetest` |
| 집단 비교 | 로그순위, Wilcoxon 계열 | `lifetest` + `strata / test=` |
| 공변량 보정 | Cox 비례위험모형 | `phreg` |
| 가정 확인 | log-log 그림, 시간 상호작용, `assess ph` | `lifetest plots=lls`, `phreg` |
| 가정 위반 대응 | 층화 Cox, 시간의존 공변량 | `phreg` + `strata`, 프로그래밍 문 |
