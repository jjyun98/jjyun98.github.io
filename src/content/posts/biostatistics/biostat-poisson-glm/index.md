---
title: '생명과학통계 - 포아송 회귀와 일반화선형모형'
published: 2026-05-27
draft: false
description: '발생률과 인년, 포아송 분포, 일반화선형모형의 세 요소, 오프셋을 쓰는 포아송 회귀와 발생률비, 과대산포와 음이항 회귀, 상대위험률을 직접 추정하는 회귀를 SAS PROC GENMOD로 정리한다.'
series: '생명과학통계'
tags: ['생명과학통계', '포아송 회귀', 'GLM', 'SAS']
---

『생명과학연구를 위한 통계적 방법』(이재원·박미라·유한나)과 전북대학교 최혜미 교수님 강의를 바탕으로, 발생 건수 자료를 다루는 포아송 회귀와 그 틀인 일반화선형모형(GLM)을 정리했다.

## 1. 발생률과 인년

코호트 연구에서는 사람마다 추적 기간이 다르다. 그래서 "몇 명 중 몇 명"보다 "관찰한 시간 대비 몇 건"이 공정한 비교 기준이다.

$$
\text{발생률} = \frac{\text{사건 수 } d}{\text{총 관찰 인년 } T}
$$

인년(person-years)은 대상자별 추적 기간의 합이다. 100명을 2년씩 관찰하면 200인년이다. 두 집단의 발생률비(rate ratio)는 다음과 같다.

$$
IRR = \frac{d_1 / T_1}{d_0 / T_0}
$$

## 2. 포아송 분포

일정 시간·공간에서 드물게 독립적으로 일어나는 사건의 수 $Y$는 포아송 분포를 따른다.

$$
P(Y = y) = \frac{e^{-\mu} \mu^y}{y!}, \quad y = 0, 1, 2, \dots \qquad E(Y) = Var(Y) = \mu
$$

평균과 분산이 같다는 것이 핵심 성질이다. 관찰 시간이 $T$이고 단위 시간당 발생률이 $\lambda$면 $\mu = \lambda T$다.

## 3. 일반화선형모형의 세 요소

선형회귀, 로지스틱 회귀, 포아송 회귀는 모두 GLM이다.

| 요소 | 뜻 | 선형회귀 | 로지스틱 | 포아송 |
|---|---|---|---|---|
| 확률 성분 | $Y$의 분포 (지수족) | 정규 | 이항 | 포아송 |
| 체계적 성분 | 선형예측식 $\eta = \beta_0 + \beta^T x$ | 같음 | 같음 | 같음 |
| 연결함수 | $g(\mu) = \eta$ | 항등 $\mu$ | 로짓 $\log\frac{\mu}{1-\mu}$ | 로그 $\log\mu$ |

추정은 모두 최대가능도(반복재가중최소제곱, IRLS)로 하고, 모형 비교는 이탈도(deviance) 차이의 가능도비 검정으로 한다. SAS의 `PROC GENMOD`는 `dist=`와 `link=`만 바꿔 이 모형들을 모두 적합한다.

## 4. 포아송 회귀와 오프셋

$$
\log \mu_i = \log T_i + \beta_0 + \beta_1 x_{i1} + \cdots + \beta_p x_{ip}
$$

$\log T_i$는 계수가 1로 고정된 항으로, **오프셋**이라 한다. 양변에서 $\log T_i$를 빼면 발생률을 모델링하는 식이 된다.

$$
\log \frac{\mu_i}{T_i} = \log \lambda_i = \beta_0 + \beta^T x_i
$$

$e^{\beta_j}$는 $x_j$가 한 단위 늘 때 **발생률비**다. 관찰 시간이 모두 같으면 오프셋 없이 건수를 바로 모델링한다.

## 5. 예제: 연령대·흡연별 발생률

아래는 설명용 예시 자료다. 연령대(3개)와 흡연 여부별로 질병 발생 건수와 관찰 인년을 집계했다.

| 연령대 | 흡연 | 사건 수 | 인년 |
|---|---|---:|---:|
| 40대 | 비흡연 | 12 | 8,200 |
| 40대 | 흡연 | 18 | 5,100 |
| 50대 | 비흡연 | 28 | 7,400 |
| 50대 | 흡연 | 41 | 4,600 |
| 60대 | 비흡연 | 45 | 5,300 |
| 60대 | 흡연 | 62 | 3,200 |

```sas
data incidence;
  input agegrp $ smoke $ cases pyears;
  log_py = log(pyears);
  datalines;
40s N 12 8200
40s Y 18 5100
50s N 28 7400
50s Y 41 4600
60s N 45 5300
60s Y 62 3200
;
run;

proc genmod data=incidence;
  class agegrp (ref='40s') smoke (ref='N') / param=ref;
  model cases = agegrp smoke / dist=poisson link=log offset=log_py type3;
  estimate 'IRR smoking' smoke 1 / exp;
  estimate 'IRR 60s vs 40s' agegrp 0 1 / exp;
run;
```

- `offset=log_py`: 로그 인년을 오프셋으로 넣는다. 로그를 DATA 단계에서 미리 계산해야 한다.
- `type3`: 각 효과의 가능도비 검정(Type 3 분석)
- `estimate ... / exp`: 계수를 지수화해 발생률비와 신뢰구간을 출력한다. `class` 수준의 정렬 순서는 50s, 60s(기준 40s 제외)이므로 `agegrp 0 1`이 60대 대 40대다.

결과의 흡연 발생률비는 "같은 연령대에서 흡연자의 발생률이 비흡연자의 몇 배인가"로 해석한다.

## 6. 적합도와 과대산포

`Criteria For Assessing Goodness Of Fit` 표에서 이탈도와 피어슨 카이제곱을 자유도로 나눈 값을 본다.

$$
\hat\phi = \frac{\chi^2_{Pearson}}{n - p - 1}
$$

포아송 모형이 맞으면 $\hat\phi \approx 1$이다. 1보다 훨씬 크면 **과대산포**다. 실제 건수 자료는 개인 간 이질성 때문에 분산이 평균보다 큰 경우가 흔하다. 과대산포를 무시하면 표준오차가 과소추정되어 $p$값이 지나치게 작아진다.

| 대응 | 방법 | SAS |
|---|---|---|
| 준가능도 | 표준오차에 $\sqrt{\hat\phi}$를 곱해 보정. 계수 추정값은 그대로 | `/ scale=pearson` |
| 음이항 회귀 | $Var(Y) = \mu + k\mu^2$ 허용 | `/ dist=negbin` |
| 로버스트 표준오차 | 분산 구조를 가정하지 않는 샌드위치 추정 | `repeated subject=id;` |
| 0 과잉 | 구조적 0이 많을 때 0 과잉 포아송·음이항 | `/ dist=zip` 또는 `zinb` |

```sas
proc genmod data=incidence;
  class agegrp (ref='40s') smoke (ref='N') / param=ref;
  model cases = agegrp smoke / dist=negbin link=log offset=log_py;
run;
```

음이항 모형의 출력에는 산포 모수 $k$의 추정값이 나온다. $k$가 0에 가까우면 포아송 모형과 같다.

## 7. 상대위험률을 직접 추정하기

코호트 연구나 임상시험에서 결과가 흔하면(10% 이상) 로지스틱 회귀의 오즈비는 상대위험률보다 크게 과장된다. 상대위험률을 직접 추정하는 두 가지 방법이 있다.

- **로그-이항 모형**: 이항 분포에 로그 연결. $e^{\beta}$가 바로 상대위험률이지만 예측확률이 1을 넘으면 수렴하지 않는 경우가 많다.
- **수정 포아송 회귀**: 0/1 결과에 포아송 모형을 적합하고 로버스트 표준오차를 쓴다. 수렴 문제가 거의 없다.

```sas
data heart;
  set sashelp.heart;
  id = _n_;
  dead = (Status = 'Dead');
  male = (Sex = 'Male');
run;

proc genmod data=heart;
  model dead(event='1') = male AgeAtStart / dist=binomial link=log;
  estimate 'RR male' male 1 / exp;
run;

proc genmod data=heart;
  class id;
  model dead = male AgeAtStart / dist=poisson link=log;
  repeated subject=id / type=ind;
  estimate 'RR male' male 1 / exp;
run;
```

두 번째 모형은 `repeated subject=id`로 사람마다 한 관측인 자료에 샌드위치 분산을 적용한다. 0/1 자료는 포아송 분포가 아니므로 모형 기반 표준오차는 틀리지만, 로버스트 표준오차를 쓰면 상대위험률에 대한 타당한 추론이 된다.

## 요약

| 반응 | 분포 | 연결 | 지수화한 계수 | SAS `genmod` |
|---|---|---|---|---|
| 연속형 | 정규 | 항등 | (지수화 안 함) | `dist=normal` |
| 이진 | 이항 | 로짓 | 오즈비 | `dist=binomial link=logit` |
| 이진 | 이항 | 로그 | 상대위험률 | `dist=binomial link=log` |
| 건수, 발생률 | 포아송 | 로그 + 오프셋 | 발생률비 | `dist=poisson offset=` |
| 과대산포 건수 | 음이항 | 로그 | 발생률비 | `dist=negbin` |
