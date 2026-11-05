---
title: '생명과학통계 - 로짓모형과 로지스틱 회귀'
published: 2026-05-26
draft: false
description: '이진 반응변수의 로짓모형, 오즈비 해석, 최대가능도와 Wald·가능도비 검정, 교란과 상호작용, 적합도와 분류 성능, 조건부·정확 로지스틱, 순서형 누적로짓과 명목형 일반화 로짓모형을 SAS PROC LOGISTIC으로 정리한다.'
series: '생명과학통계'
tags: ['생명과학통계', '로지스틱 회귀', '로짓모형', '범주형 자료']
---

『생명과학연구를 위한 통계적 방법』(이재원·박미라·유한나)과 전북대학교 최혜미 교수님 강의를 바탕으로 정리했다.

로지스틱 회귀는 반응변수가 범주형일 때 사용하는 회귀모형이다. 생명과학 연구에서는 질병 있음/없음, 치료 성공/실패, 관해 여부, 사망 여부처럼 이진 결과가 많기 때문에 가장 자주 쓰이는 모형 중 하나다.

## 1. 언제 로지스틱 회귀를 쓰는가

반응변수가 연속형이면 선형회귀나 ANOVA를 생각할 수 있다. 하지만 반응변수가 0/1이면 선형회귀는 적합하지 않다.

이진 반응변수 $Y$에 대해 다음처럼 둔다.

$$
Y =
\begin{cases}
1 & \text{사건 발생} \\
0 & \text{사건 미발생}
\end{cases}
$$

그러면 $Y$의 조건부 평균은 사건 발생 확률이다.

$$
E(Y \mid X=x) = P(Y=1 \mid X=x) = p_x
$$

이 확률 $p_x$는 반드시 0과 1 사이에 있어야 한다. 로지스틱 회귀는 선형예측자를 직접 확률로 두지 않고, 로그 오즈를 선형예측자로 둔다.

## 2. 로짓모형

로짓모형은 다음과 같다.

$$
p_x =
\frac{e^{\alpha+\beta x}}{1+e^{\alpha+\beta x}}
$$

양변을 오즈로 바꾸면 다음과 같다.

$$
\frac{p_x}{1-p_x} = e^{\alpha+\beta x}
$$

로그 오즈를 취하면 선형식이 된다.

$$
\log\left(\frac{p_x}{1-p_x}\right)
= \alpha + \beta x
$$

설명변수가 여러 개이면 다음처럼 확장한다.

$$
\log\left(\frac{p_x}{1-p_x}\right)
= \alpha + \beta_1x_1 + \beta_2x_2 + \cdots + \beta_kx_k
$$

## 3. 계수 해석

$\beta$는 $x$가 한 단위 증가할 때 로그 오즈가 얼마나 변하는지를 나타낸다. 더 직관적인 값은 $e^\beta$다.

$$
e^\beta =
\frac{\text{x가 한 단위 증가한 뒤의 odds}}
{\text{x가 증가하기 전의 odds}}
$$

따라서 $e^\beta$는 오즈비다.

- $e^\beta > 1$: $x$가 증가할수록 사건 오즈 증가
- $e^\beta = 1$: $x$와 사건 오즈 사이에 연관성 없음
- $e^\beta < 1$: $x$가 증가할수록 사건 오즈 감소

범주형 설명변수에서는 기준범주 대비 오즈비로 해석한다.

## 4. 추정과 검정

로지스틱 회귀의 계수는 최대가능도추정으로 구한다.

이진 반응변수의 조건부 확률은 다음과 같다.

$$
P(Y=y \mid X=x) = p_x^y(1-p_x)^{1-y}
$$

따라서 가능도는 다음과 같다.

$$
L(\alpha,\beta)
= \prod_{i=1}^n p_{x_i}^{y_i}(1-p_{x_i})^{1-y_i}
$$

개별 회귀계수 검정은 보통 Wald 검정으로 시작한다.

$$
H_0: \beta_i = 0
$$

$$
H_1: \beta_i \ne 0
$$

Wald 통계량은 다음과 같다.

$$
\left(\frac{\hat\beta_i}{SE(\hat\beta_i)}\right)^2
\sim \chi^2(1)
$$

모형 전체나 여러 변수를 동시에 비교할 때는 가능도비 검정도 자주 사용한다.

### 오즈비의 신뢰구간

$\hat\beta$가 근사적으로 정규분포를 따르므로 오즈비의 95% 신뢰구간은 로그 척도에서 만든 뒤 지수화한다.

$$
\exp\left\{ \hat\beta \pm 1.96\, SE(\hat\beta) \right\}
$$

구간이 1을 포함하지 않으면 5% 유의수준에서 유의하다. 연속형 변수는 한 단위가 너무 작으면 오즈비가 1에 가까워 해석이 어렵다. 나이 10세, 혈압 10mmHg처럼 의미 있는 단위로 바꿔 보고한다(`units` 문).

## 5. 예제 4.1: 백혈병 환자의 재발

백혈병 환자 102명을 무작위로 두 군으로 나눠 처리 A와 B를 하고 재발 여부를 조사했다. 재발에는 처리 외에 호전기간(remission time, 개월)도 영향을 줄 수 있다.

| 변수 | 내용 |
|---|---|
| `trt` | 처리 A, B (질적 변수, 가변수 1개) |
| `remission` | 호전기간(개월) |
| `y` | 재발 여부 (1 = 재발, 0 = 재발 안 함) |

$$
\log \frac{p}{1 - p} = \alpha + \beta_1 \text{trt}_A + \beta_2 \text{remission}
$$

자료는 교재 표 4.2에 있다. 탭으로 구분된 텍스트 파일로 저장했다면 다음처럼 읽고 탐색한다.

```sas
data liver;
  infile '예제4_1.txt' expandtabs;
  input trt $ remission y;
run;

proc means data=liver mean std;
  class trt;
  var remission;
run;

proc freq data=liver;
  tables trt*y / chisq;
run;

proc sgplot data=liver;
  scatter x=remission y=y / jitter group=trt;
run;
```

`expandtabs`는 탭을 공백으로 바꿔 읽는다. 0/1 반응을 산점도로 그리면 점이 겹치므로 `jitter`로 흩뜨린다.

```sas
proc logistic data=liver plots(only)=(effect oddsratio(type=horizontalstat));
  class trt (ref='B') / param=ref;
  model y(event='1') = trt remission / scale=none aggregate lackfit clodds=both;
  units remission=12;
  output out=estimated predicted=estprob l=lower95 u=upper95;
run;
```

- `class trt (ref='B')`: 처리 B를 기준으로 처리 A의 오즈비를 추정한다.
- `scale=none aggregate`: 같은 공변량 조합끼리 묶어 이탈도와 피어슨 적합도 통계량을 출력한다.
- `lackfit`: Hosmer-Lemeshow 적합도 검정
- `clodds=both`: 오즈비의 Wald와 프로파일 가능도 신뢰구간을 모두 출력한다.
- `units remission=12`: 호전기간 1년(12개월) 증가당 오즈비
- `output`: 관측값마다 예측확률과 신뢰한계를 저장한다.

`trt`의 오즈비는 "같은 호전기간에서 처리 A의 재발 오즈가 B의 몇 배인가"이고, `remission`의 오즈비는 "같은 처리에서 호전기간이 1개월(또는 12개월) 길 때 재발 오즈가 몇 배인가"다.

## 6. 예제: 프레이밍햄 심장 연구

SAS 내장 `sashelp.heart`는 프레이밍햄 심장 연구 참가자 5,209명의 추적 결과다. 사망 여부(`Status`)를 성별, 연구 시작 나이, 수축기 혈압, 콜레스테롤로 설명한다.

```sas
proc logistic data=sashelp.heart plots(only)=(oddsratio effect);
  class Sex (ref='Female') / param=ref;
  model Status(event='Dead') = Sex AgeAtStart Systolic Cholesterol / clodds=pl lackfit ctable pprob=0.3;
  units AgeAtStart=10 Systolic=10 Cholesterol=40;
  oddsratio Sex;
run;
```

옵션별 의미는 다음과 같다.

- `Status(event='Dead')`: 모델링할 사건을 명시한다. `descending` 옵션보다 의도가 분명하다.
- `class ... (ref=) / param=ref`: 기준 범주 대비 가변수. 기본값인 `param=effect`는 효과 코딩이라 계수 해석이 다르므로 주의한다.
- `clodds=pl`: 오즈비의 프로파일 가능도 신뢰구간(소표본에서 Wald보다 정확)
- `units`: 나이 10세, 혈압 10mmHg, 콜레스테롤 40mg/dL 증가당 오즈비를 추가로 출력
- `lackfit`: Hosmer-Lemeshow 적합도 검정
- `ctable pprob=0.3`: 예측확률 0.3을 기준으로 한 분류표(민감도, 특이도)

출력을 읽는 순서는 다음과 같다.

1. `Model Convergence Status`가 수렴했는지 확인한다.
2. `Testing Global Null Hypothesis`: 모든 계수가 0인지에 대한 가능도비·점수·Wald 검정
3. `Analysis of Maximum Likelihood Estimates`: 계수, 표준오차, Wald 카이제곱
4. `Odds Ratio Estimates`와 `units` 결과: 효과 크기와 신뢰구간
5. `Association of Predicted Probabilities` 표의 `c`: ROC 곡선 아래 면적(AUC)과 같다
6. `Hosmer and Lemeshow Goodness-of-Fit Test`: 유의하면 모형이 자료에 잘 맞지 않는다는 신호

### 적합도: Hosmer-Lemeshow 검정

예측확률 순으로 관측값을 10개 집단으로 나누고, 집단별로 관측 사건 수와 예측 사건 수를 비교한다.

$$
\hat C = \sum_{g=1}^{10} \frac{(O_g - n_g \bar\pi_g)^2}{n_g \bar\pi_g (1 - \bar\pi_g)} \;\dot\sim\; \chi^2_8
$$

표본이 아주 크면 작은 불일치도 유의하게 나오고, 작으면 검정력이 낮다. 보정 그림(calibration plot)과 함께 본다.

## 7. 예제 4.2: 두 설명변수와 이진 결과

예제 4.2는 질병 유형과 치료법에 따라 치료 성공 여부를 비교하는 형태의 집계자료다.

| type | trt | 성공 | 실패 |
| --- | --- | ---: | ---: |
| T | A | 65 | 18 |
| M | B | 100 | 13 |
| T | C | 56 | 38 |
| M | A | 80 | 15 |
| T | B | 29 | 9 |
| M | C | 78 | 22 |

이 자료에서는 성공/실패 도수를 이용해 이진 로지스틱 회귀를 적합할 수 있다.

$$
\log\left(
\frac{p_{\text{type}, \text{trt}}}
{1-p_{\text{type}, \text{trt}}}
\right)
= \alpha + \beta_1\text{type} + \beta_2\text{trt}_1 + \beta_3\text{trt}_2
$$

집계자료를 SAS에 넣을 때는 성공과 실패를 각각 한 행으로 만들고 도수를 `WEIGHT` 또는 `FREQ`로 지정한다.

```sas
data ex42;
  input type $ trt $ y count;
  cards;
  T A 1 65
  T A 0 18
  M B 1 100
  M B 0 13
  T C 1 56
  T C 0 38
  M A 1 80
  M A 0 15
  T B 1 29
  T B 0 9
  M C 1 78
  M C 0 22
  ;
run;

proc logistic data=ex42 descending;
  class type trt / param=ref;
  freq count;
  model y = type trt;
run;
```

`freq count`는 각 행이 `count`명을 나타낸다는 뜻이다. 집계자료는 사건 수/시행 수 형식으로도 넣을 수 있다. 성공 수 `s`와 전체 수 `n`이 한 행에 있으면 `model s/n = type trt;`처럼 쓴다.

### 교란과 상호작용

- **교란**: 노출과 결과 모두와 관련된 제3의 변수. 넣기 전후 노출의 오즈비가 크게(흔히 10% 이상) 바뀌면 교란 변수로 보고 모형에 남긴다.
- **상호작용(효과 수정)**: 한 변수의 효과가 다른 변수 수준에 따라 다르다. `model y = type trt type*trt;`로 넣고, 유의하면 층별 오즈비를 따로 보고한다.

```sas
proc logistic data=ex42;
  class type trt / param=ref;
  freq count;
  model y(event='1') = type trt type*trt;
  oddsratio trt / at(type=all) diff=ref;
run;
```

`oddsratio trt / at(type=all)`은 질병 유형별로 치료 오즈비를 따로 출력한다.

## 8. 작은 표본과 짝지은 자료

### 정확 로지스틱 회귀

표본이 작거나 어떤 칸의 사건이 0이면 최대가능도 추정이 발산하거나(준완전 분리) 큰 표본 근사가 부정확하다. 조건부 정확 추론을 쓴다.

```sas
proc logistic data=small;
  class trt / param=ref;
  model y(event='1') = trt;
  exact trt / estimate=both;
run;
```

### 조건부 로지스틱 회귀: 짝지은 사례-대조 연구

사례 한 명마다 나이·성별이 같은 대조군을 짝지어 뽑았다면, 짝(matched set)마다 다른 기저 위험을 허용해야 한다. 짝마다 절편을 두면 모수가 너무 많아지므로, 짝 안에서의 조건부 가능도를 쓴다. 짝 변수를 `strata`로 준다.

```sas
proc logistic data=matched;
  strata set_id;
  model case(event='1') = exposure smoking;
run;
```

1:1 짝짓기에서 이진 노출 하나만 있으면 이 모형의 오즈비는 [McNemar 검정](/posts/biostat-contingency-diagnostic)의 불일치 쌍 비 $n_{12}/n_{21}$와 같다.

## 9. 순서형 반응변수

반응변수가 세 범주 이상이고 순서가 있으면 순서형 로지스틱 회귀를 고려한다. 예를 들어 증상 정도가 "없음, 경함, 중등도"처럼 순서를 가진다면 순서형 반응변수다.

가장 대표적인 모형은 누적로짓모형 또는 비례오즈모형이다.

반응범주가 $1,\ldots,J$이고

$$
\pi_{ij} = P(Y=j \mid X=x_i)
$$

라고 하자. 누적확률은 다음과 같다.

$$
F_{ij} = P(Y \le j \mid X=x_i)
= \pi_{i1} + \cdots + \pi_{ij}
$$

누적로짓모형은 다음과 같다.

$$
\log\left(\frac{F_{ij}}{1-F_{ij}}\right)
= \alpha_j + \beta_1x_{i1} + \cdots + \beta_kx_{ik}
$$

범주별 절편 $\alpha_j$는 달라지지만 기울기 $\beta$는 같다고 가정한다. 이 가정이 비례오즈 가정이다.

비례오즈 가정 아래에서 $e^{\beta_k}$는 "어떤 기준점에서 나누든" $x_k$가 한 단위 늘 때 더 낮은 범주($Y \le j$)에 속할 오즈의 배율이다. SAS의 누적 로짓은 기본적으로 $P(Y \le j)$를 모델링하므로, 순서가 "나쁨 → 좋음"으로 코딩되어 있으면 $\beta > 0$이 나쁜 쪽으로 이동한다는 뜻이 된다. `descending`으로 방향을 바꾸면 해석도 반대가 된다.

## 10. 예제: 관절염 치료 효과

Koch & Edwards(1988)의 류머티스 관절염 임상시험 자료로, 성별과 처리(활성 약물 Active, 위약 Placebo)에 따른 증상 개선 정도(None < Some < Marked)다. 범주형 자료분석 교재에서 비례오즈모형의 대표 예제로 쓰인다.

| 성별 | 처리 | None | Some | Marked | 합계 |
| --- | --- | ---: | ---: | ---: | ---: |
| 여성 | Active | 6 | 5 | 16 | 27 |
| 여성 | Placebo | 19 | 7 | 6 | 32 |
| 남성 | Active | 7 | 2 | 5 | 14 |
| 남성 | Placebo | 10 | 0 | 1 | 11 |

```sas
data arthritis;
  input sex $ trt $ improve count @@;   /* improve: 1 = None, 2 = Some, 3 = Marked */
  datalines;
F A 1 6  F A 2 5  F A 3 16  F P 1 19 F P 2 7 F P 3 6
M A 1 7  M A 2 2  M A 3 5   M P 1 10 M P 2 0 M P 3 1
;
run;

proc logistic data=arthritis descending;
  class sex (ref='M') trt (ref='P') / param=ref;
  freq count;
  model improve = sex trt / link=clogit;
run;
```

- `descending`으로 $P(Y \ge j)$, 즉 더 개선될 쪽의 누적 오즈를 모델링한다. 그러면 $e^{\beta_{trt}} > 1$은 활성 약물이 더 나은 개선 범주로 옮겨 준다는 뜻이다.
- 출력의 `Score Test for the Proportional Odds Assumption`이 비례오즈 가정 검정이다. 유의하지 않으면 가정을 받아들인다. 유의하면 부분 비례오즈 모형(`unequalslopes` 옵션)이나 일반화 로짓을 검토한다.
- 절편은 범주 경계 수만큼($J - 1 = 2$개) 나온다.

## 11. 명목형 반응변수

반응변수가 세 범주 이상이지만 순서가 없으면 일반화 로짓모형을 쓴다. 기준범주를 $J$로 두면 다음과 같다.

$$
\log\left(\frac{\pi_{ij}}{\pi_{iJ}}\right)
= \alpha_j + \beta_{j1}x_{i1} + \cdots + \beta_{jk}x_{ik},
\quad j=1,\ldots,J-1
$$

범주마다 별도의 계수 벡터가 생긴다. 따라서 순서형 모형보다 모수가 많고 해석도 기준범주 대비로 이루어진다.

## 12. 예제: 성별과 인종에 따른 정당 지지

Agresti의 범주형 자료분석 교재에 나오는 미국 종합사회조사(GSS) 자료로, 성별과 인종(White, Black)에 따른 지지 정당(Democrat, Republican, Independent)이다. 정당에는 순서가 없으므로 일반화 로짓모형을 쓴다.

| 성별 | 인종 | Democrat | Republican | Independent |
| --- | --- | ---: | ---: | ---: |
| 남성 | White | 132 | 176 | 127 |
| 남성 | Black | 42 | 6 | 12 |
| 여성 | White | 172 | 129 | 130 |
| 여성 | Black | 56 | 4 | 15 |

```sas
data party;
  input gender $ race $ party $ count @@;
  datalines;
M W D 132 M W R 176 M W I 127
M B D 42  M B R 6   M B I 12
F W D 172 F W R 129 F W I 130
F B D 56  F B R 4   F B I 15
;
run;

proc logistic data=party;
  class gender (ref='M') race (ref='W') / param=ref;
  freq count;
  model party(ref='I') = gender race / link=glogit;
run;
```

기준범주를 Independent로 두면 계수가 두 벌 나온다. 하나는 $\log(\pi_D / \pi_I)$, 다른 하나는 $\log(\pi_R / \pi_I)$에 대한 계수다. 표만 봐도 흑인 응답자에서 Republican 비율이 매우 낮으므로, `race`의 R 대 I 계수가 크게 음수로 나올 것으로 예상할 수 있다. 두 비교의 계수를 빼면 Democrat 대 Republican 비교도 얻는다.

## 13. 해석할 때 주의할 점

로지스틱 회귀 결과를 해석할 때는 다음을 확인한다.

- 반응변수에서 1이 무엇을 의미하는가
- 기준범주가 무엇인가
- 계수 자체보다 오즈비와 신뢰구간을 함께 보는가
- 설명변수 사이 교란이나 상호작용을 고려했는가
- 희귀질병이 아닌 경우 오즈비를 상대위험률처럼 해석하지 않았는가

오즈비는 위험비와 다르다. 사건이 흔할수록 오즈비는 위험비보다 더 극단적으로 보일 수 있다.

## 요약

| 반응변수 | 모형 | SAS |
|---|---|---|
| 이진 | 로지스틱 회귀 | `model y(event=) = ...` |
| 이진, 작은 표본 | 정확 로지스틱 | `exact` 문 |
| 이진, 짝지은 사례-대조 | 조건부 로지스틱 | `strata` 문 |
| 순서형 | 누적로짓(비례오즈) | `link=clogit` (기본값) |
| 명목형 | 일반화 로짓 | `link=glogit` |

| 확인할 것 | 방법 |
|---|---|
| 효과 크기 | 오즈비와 신뢰구간, 의미 있는 단위(`units`) |
| 모형 전체 | 가능도비 검정 |
| 적합도 | Hosmer-Lemeshow, 보정 그림 |
| 판별력 | `c` 통계량(AUC), 분류표 |
| 비례오즈 가정 | 점수 검정 |
