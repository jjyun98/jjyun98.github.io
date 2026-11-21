---
title: '생명과학통계 - 상관분석과 회귀분석'
published: 2026-05-25
draft: false
description: '피어슨·스피어만 상관계수와 검정, 단순선형회귀의 최소제곱 추정과 추론, 다중회귀와 변수선택, 잔차 진단, 다중공선성, 영향점을 SAS PROC CORR, PROC REG로 정리한다.'
series: '생명과학통계'
seriesOrder: 7
tags: ['통계학', '회귀분석', 'SAS', 'R']
---

『생명과학연구를 위한 통계적 방법』(이재원·박미라·유한나)과 전북대학교 최혜미 교수님 강의를 바탕으로, 두 연속형 변수의 관계를 다루는 상관분석과 회귀분석을 정리했다. 공분산분석, 로지스틱 회귀, Cox 회귀는 모두 이 글의 선형회귀를 바탕으로 확장된다. 상관분석은 두 변수가 함께 변하는 정도를, 회귀분석은 $X$로 $Y$를 설명하고 예측하는 식을 구한다.

최소제곱의 기하(사영, hat 행렬, 지렛값)는 [직교와 정규직교](/posts/la-orthonormal)의 회귀 절에서, 회귀 진단의 이론은 [데이터 마이닝의 선형회귀](/posts/dm-linear-regression)에서 다룬다. 이 글은 핵심 식과 SAS 사용법만 둔다.

이 글의 SAS 출력은 직접 옮기지 않고 같은 자료를 R로 계산한 값(R로 확인한 값)으로 적는다. `sashelp` 자료를 쓰는 예는 코드와 읽는 방법만 둔다.

## 1. 피어슨 상관계수

$$
r = \frac{\sum_i (x_i - \bar x)(y_i - \bar y)}{\sqrt{\sum_i (x_i - \bar x)^2 \sum_i (y_i - \bar y)^2}}, \qquad -1 \le r \le 1
$$

![상관계수와 산점도 모양](./figures/fig-bio-correlation.svg)

- $r$은 **선형** 관계의 강도다. $r = 0$이어도 U자 같은 강한 비선형 관계가 있을 수 있다.
- 이상값 하나에 크게 흔들린다.
- 상관은 인과가 아니다. 두 변수 모두와 관련된 제3의 변수가 있으면 상관이 생긴다.

$H_0: \rho = 0$은 다음 통계량으로 검정한다. 두 변수가 이변량 정규분포를 따른다고 가정한다.

$$
t = \frac{r \sqrt{n - 2}}{\sqrt{1 - r^2}} \sim t_{n-2}
$$

$\rho$의 신뢰구간은 $r$의 분포가 비대칭이라 Fisher 변환 $z = \frac{1}{2}\log\frac{1 + r}{1 - r}$으로 만든다. $z$는 근사적으로 $N(\frac{1}{2}\log\frac{1+\rho}{1-\rho}, \frac{1}{n - 3})$를 따른다. $z \pm z_{\alpha/2}/\sqrt{n-3}$ 구간을 $r = \tanh(z)$로 되돌리면 $\rho$의 신뢰구간이 된다.

## 2. 스피어만 순위상관과 켄달의 타우

정규성이 의심되거나 이상값이 있거나 순서형 자료라면 순위를 쓴다.

- **스피어만** $r_s$: 두 변수를 각각 순위로 바꾼 뒤 계산한 피어슨 상관. 단조 관계(한쪽이 커지면 다른 쪽도 커지는)의 강도다.
- **켄달** $\tau$: 모든 쌍 중 순서가 일치하는 쌍과 불일치하는 쌍의 비율 차이, $\tau = \dfrac{n_c - n_d}{n(n-1)/2}$ (동순위가 없을 때). 표본이 작고 동순위가 많을 때 쓴다.

```sas
proc corr data=sashelp.class pearson spearman kendall fisher plots=matrix(histogram);
  var Height Weight Age;
run;
```

`fisher` 옵션은 Fisher 변환 신뢰구간을, `plots=matrix`는 산점도 행렬을 출력한다.

### 편상관

$Z$의 영향을 제거한 $X$와 $Y$의 상관이다. 나이를 통제한 키와 체중의 상관처럼 교란을 제거할 때 쓴다. $X$와 $Y$를 각각 $Z$로 회귀한 잔차끼리의 피어슨 상관과 같고, 세 변수의 상관계수로는 다음과 같이 쓴다.

$$
r_{xy \cdot z} = \frac{r_{xy} - r_{xz} r_{yz}}{\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}
$$

```sas
proc corr data=sashelp.class;
  var Height Weight;
  partial Age;
run;
```

## 3. 단순선형회귀

$$
y_i = \beta_0 + \beta_1 x_i + \epsilon_i, \qquad \epsilon_i \overset{iid}{\sim} N(0, \sigma^2)
$$

최소제곱 추정량은 잔차제곱합 $\sum (y_i - b_0 - b_1 x_i)^2$을 최소화한다.

$$
b_1 = \frac{S_{xy}}{S_{xx}} = r \frac{s_y}{s_x}, \qquad b_0 = \bar y - b_1 \bar x
$$

$b_1 = r \, s_y / s_x$이므로 기울기와 상관계수는 부호가 같고, $H_0: \beta_1 = 0$ 검정과 $H_0: \rho = 0$ 검정의 $t$통계량은 같다. 기하로는 $\hat y$가 $y$를 $(1, x)$가 만드는 평면에 직교사영한 것이고 잔차는 그 평면과 수직이다([직교와 정규직교](/posts/la-orthonormal)).

### 분산분석표와 결정계수

$$
\underbrace{\sum (y_i - \bar y)^2}_{SST} = \underbrace{\sum (\hat y_i - \bar y)^2}_{SSR} + \underbrace{\sum (y_i - \hat y_i)^2}_{SSE}
$$

단순선형회귀($p = 1$)의 분산분석표는 다음과 같다(설명변수가 $p$개인 일반 회귀모형에서는 회귀 자유도가 $p$, 오차 자유도가 $n - p - 1$이 된다).

| 요인 | 자유도 | 제곱합 | 평균제곱 | $F$ |
|---|---|---|---|---|
| 회귀 | $1$ ($p=1$) | SSR | MSR = SSR / $1$ | MSR / MSE |
| 오차 | $n - 2$ | SSE | MSE = SSE / $(n - 2)$ | |
| 합 | $n - 1$ | SST | | |

$R^2 = SSR / SST$는 $Y$의 변동 중 회귀가 설명한 비율이고, 단순회귀에서는 $r^2$과 같다. $\sqrt{MSE}$는 $\sigma$의 추정값(Root MSE)이다. 단순회귀에서는 $F = t^2$이다.

### 신뢰구간과 예측구간

$x_0$에서 평균 반응 $E(Y \mid x_0)$의 신뢰구간과 새 관측값 $Y_0$의 예측구간은 다음과 같다.

$$
\hat y_0 \pm t_{\alpha/2,\, n-2} \sqrt{MSE \left( \frac{1}{n} + \frac{(x_0 - \bar x)^2}{S_{xx}} \right)}
\qquad \text{vs.} \qquad
\hat y_0 \pm t_{\alpha/2,\, n-2} \sqrt{MSE \left( 1 + \frac{1}{n} + \frac{(x_0 - \bar x)^2}{S_{xx}} \right)}
$$

예측구간에는 개별 관측의 변동(1)이 더해져 항상 더 넓다. 둘 다 $x_0$가 $\bar x$에서 멀어질수록 넓어진다.

```sas
proc reg data=sashelp.class plots=(fitplot residuals diagnostics);
  model Weight = Height / clb clm cli;
run;
quit;
```

- `clb`: 회귀계수의 신뢰구간
- `clm`, `cli`: 관측값마다 평균 반응의 신뢰구간, 개별 값의 예측구간
- `plots=fitplot`: 회귀선과 신뢰띠·예측띠를 그린다.

### 예시: 키와 몸무게 (단순회귀)

R의 `women`(미국 여성 15명의 키 in, 몸무게 lb)을 SAS로 입력하면 다음과 같다. 같은 자료를 R로 계산해 확인한다.

```sas
data women;
  input height weight @@;
  datalines;
58 115  59 117  60 120  61 123  62 126  63 129  64 132  65 135
66 139  67 142  68 146  69 150  70 154  71 159  72 164
;
run;

proc reg data=women;
  model weight = height / clb clm cli;
run;
quit;
```

```r
fit <- lm(weight ~ height, data = women)
summary(fit)$coefficients
anova(fit)
cor.test(women$height, women$weight)$statistic
nd <- data.frame(height = c(60, 65, 70))
predict(fit, nd, interval = "confidence")
predict(fit, nd, interval = "prediction")
```

R로 확인한 값은 다음과 같다. 회귀식은 $\hat y = -87.52 + 3.450\,x$이고 기울기의 표준오차는 0.091, $t = 37.86$이다. 분산분석표에서 $F = 1433 = 37.86^2$, $R^2 = 0.991$, Root MSE는 1.525이며 `cor.test`의 $t$도 37.86으로 기울기 검정과 같다. 기울기의 95% 신뢰구간은 (3.25, 3.65)다. $x_0 = 65$(=$\bar x$)에서 평균 반응의 신뢰구간은 (135.9, 137.6), 새 관측의 예측구간은 (133.3, 140.1)로 예측구간이 약 4배 넓다. $x_0 = 60$에서는 신뢰구간이 (118.2, 120.8)로 $\bar x$에서보다 넓어진다.

## 4. 다중회귀

$$
y_i = \beta_0 + \beta_1 x_{i1} + \cdots + \beta_p x_{ip} + \epsilon_i
$$

$\beta_j$는 **다른 설명변수를 고정했을 때** $x_j$가 한 단위 늘 때 $Y$의 평균 변화다. 행렬로 쓰면 $\hat\beta = (X^T X)^{-1} X^T y$이고 적합값은 $\hat y = Hy$, $H = X(X^TX)^{-1}X^T$이다. $H$의 대각원소가 아래의 레버리지 $h_{ii}$이다. 최소제곱을 사영으로 보는 설명과 `lm`이 정규방정식 대신 QR로 푸는 이유는 [직교와 정규직교](/posts/la-orthonormal)에 있다.

SAS 내장 `sashelp.heart`(프레이밍햄 심장 연구)에서 수축기 혈압을 나이, 체중, 콜레스테롤, 성별(`male`)로 설명한다.

```sas
data heart;
  set sashelp.heart;
  male = (Sex = 'Male');
  if nmiss(Systolic, AgeAtStart, Weight, Cholesterol) = 0;
run;

proc reg data=heart plots(maxpoints=none)=diagnostics;
  model Systolic = AgeAtStart Weight Cholesterol male / stb vif clb;
  test Weight = 0, Cholesterol = 0;
run;
quit;
```

- `stb`: 표준화 회귀계수. 단위가 다른 변수의 상대적 기여를 비교할 때 참고한다.
- `vif`: 분산팽창인자(아래 다중공선성 참고)
- `test`: 여러 계수가 동시에 0인지 부분 $F$검정. 동시에 검정할 식은 쉼표로 나열한다.
- `proc reg`는 `class` 문이 없어서 범주형 변수는 DATA 단계에서 가변수(`male`)로 만든다. 범주가 많으면 `proc glm`의 `class` 문을 쓰는 편이 편하다.

### 수정 결정계수와 변수 선택

$R^2$는 변수를 넣을수록 커지기만 하므로 비교에는 수정 $R^2$나 $C_p$, AIC처럼 변수 수에 벌점을 주는 기준을 쓴다.

$$
R^2_{adj} = 1 - \frac{SSE / (n - p - 1)}{SST / (n - 1)}
$$

```sas
proc reg data=heart;
  model Systolic = AgeAtStart Weight Cholesterol male / selection=stepwise slentry=0.15 slstay=0.15;
  model Systolic = AgeAtStart Weight Cholesterol male / selection=cp adjrsq best=3;
run;
quit;
```

단계적 선택은 편리하지만 선택된 모형의 $p$값과 신뢰구간이 낙관적으로 나온다. 연구 가설에 필요한 변수(노출, 알려진 교란변수)는 선택 절차와 관계없이 넣고, 선택은 탐색적 결과로만 보고한다.

## 5. 회귀 진단

이 절은 SAS 옵션과 판정 기준만 모았다. 잔차 그림 읽는 법과 이론은 [선형회귀](/posts/dm-linear-regression)를 본다.

| 가정 | 위반 신호 | 확인 | 대응 |
|---|---|---|---|
| 선형성 | 잔차 대 적합값 그림의 곡선 패턴 | 잔차 그림, 부분 잔차 그림 | 다항항, 변환 |
| 등분산성 | 적합값이 커질수록 잔차 폭이 넓어짐 | 잔차 그림, `spec` 옵션 | $\log Y$ 변환, 가중회귀 |
| 정규성 | Q-Q 그림이 직선에서 벗어남 | `proc univariate normal` | 변환, 큰 표본이면 덜 중요 |
| 독립성 | 시간·순서에 따른 잔차 패턴 | Durbin-Watson (`dw`) | 반복측정 모형 |

### 이상점과 영향점

| 측도 | 보는 것 | 기준(경험적) |
|---|---|---|
| 스튜던트화 잔차 | $Y$ 방향으로 튀는 점 | 절댓값 2~3 초과 |
| 레버리지 $h_{ii}$ | $X$ 공간에서 멀리 떨어진 점 | $2(p+1)/n$ 초과 |
| Cook's D | 그 점을 빼면 회귀계수가 얼마나 바뀌는가 | $4/n$ 또는 1 초과 |
| DFFITS, DFBETAS | 적합값·개별 계수에 대한 영향 | $2\sqrt{(p+1)/n}$, $2/\sqrt n$ |

```sas
proc reg data=sashelp.class plots(label)=(cooksd rstudentbyleverage);
  id Name;
  model Weight = Height Age / influence r;
  output out=diag rstudent=rstud h=lev cookd=cd;
run;
quit;

proc print data=diag;
  where abs(rstud) > 2 or cd > 4/19;
  var Name Weight Height Age rstud lev cd;
run;
```

영향점은 자동으로 지우지 않는다. 입력 오류인지, 다른 모집단에서 온 것인지 확인하고, 포함·제외 두 경우의 결과를 함께 보고한다.

### 다중공선성

설명변수끼리 상관이 높으면 계수의 분산이 커져 부호가 뒤집히거나 개별 계수가 유의하지 않게 된다. 모형 전체의 예측력은 유지된다.

$$
VIF_j = \frac{1}{1 - R_j^2}
$$

$R_j^2$은 $x_j$를 나머지 설명변수로 회귀했을 때의 결정계수다. VIF가 10(엄격하게는 5)을 넘으면 공선성을 의심한다. 비슷한 변수 중 하나를 빼거나, 합쳐서 지표를 만들거나, 능형회귀를 쓴다.

### 예시: 공선성과 영향점 (다중회귀)

R의 `mtcars`(자동차 32대)에서 연비 `mpg`를 무게 `wt`, 마력 `hp`, 배기량 `disp`로 설명한다. SAS로는 `model mpg = wt hp disp / vif;`, `/ influence r`에 해당한다.

```r
fit3 <- lm(mpg ~ wt + hp + disp, data = mtcars)
summary(fit3)$coefficients
vars <- c("wt", "hp", "disp")
sapply(vars, function(v) 1 / (1 - summary(lm(reformulate(setdiff(vars, v), v), mtcars))$r.squared))
summary(lm(mpg ~ disp, mtcars))$coefficients["disp", ]

fit2 <- lm(mpg ~ wt + hp, data = mtcars)
cd <- cooks.distance(fit2)
head(sort(cd, decreasing = TRUE), 3)
hatvalues(fit2)[names(which.max(cd))]
coef(fit2)
coef(update(fit2, data = mtcars[-which.max(cd), ]))
```

R로 확인한 값은 다음과 같다. 세 변수 모형에서 `disp`의 계수는 $-0.0009$($p = 0.93$)로 0에 가깝지만, `disp`만으로 회귀하면 기울기가 $-0.0412$($p < 10^{-9}$)로 매우 유의하다. `disp`는 `wt`(상관 0.89)와 `hp`(0.79)와 함께 움직여 VIF가 7.3($wt$ 4.8, $hp$ 2.7)이며, `wt`와 `hp`가 이미 설명한 부분을 빼면 `disp`가 더할 것이 없다. 공선성이 개별 계수의 해석을 바꾸는 예다.

`wt`와 `hp` 모형에서 Cook's D가 가장 큰 차는 Chrysler Imperial(0.42)로 $4/n = 0.125$를 넘는다. 레버리지는 0.19($2(p+1)/n = 0.1875$ 수준)이고 이 차를 빼면 `wt` 계수가 $-3.88$에서 $-4.42$로 바뀐다. 한 점이 계수 하나를 약 14% 움직이므로 결과를 보고할 때 포함·제외 두 경우를 함께 적는다.

## 6. 비교

상관분석과 회귀분석은 질문이 다르다.

| | 상관분석 | 회귀분석 |
|---|---|---|
| 질문 | 두 변수가 함께 변하는 정도는? | $X$로 $Y$를 어떻게 설명·예측하는가? |
| 변수 역할 | 대칭 | $X$ 설명변수, $Y$ 반응변수 |
| 결과 | 상관계수 $r$ | 회귀식 $\hat y = b_0 + b_1 x$ |

상관계수 세 종류는 다음과 같다.

| 계수 | 측정하는 관계 | 계산 대상 | 이상값 | 해석 |
|---|---|---|---|---|
| 피어슨 $r$ | 선형 관계 | 원래 값 | 민감 | 회귀계수와 직접 연결 ($r^2$ = 결정계수) |
| 스피어만 $r_s$ | 단조 관계 | 순위 | 강건 | 순위에 대한 피어슨 상관 |
| 켄달 $\tau$ | 단조 관계 | 일치·불일치 쌍 | 강건 | 일치쌍 비율 − 불일치쌍 비율 |

세 가지 자료에서 세 계수를 비교한다. 선형 관계, 선형 관계에 이상값 하나가 추가된 경우, 단조이지만 비선형인 관계다.

```r w=8 h=3.2
library(tidyverse)
set.seed(2023)

x <- runif(30, 0, 10)
cor_dat <- bind_rows(
  tibble(상황 = "선형", x = x, y = x + rnorm(30, 0, 2)),
  tibble(상황 = "선형 + 이상값 1개", x = c(x[-30], 25), y = c(x[-30] + rnorm(29, 0, 2), 0)),
  tibble(상황 = "단조 비선형", x = x, y = exp(x / 2) + rnorm(30, 0, 2))
) |> mutate(상황 = fct_inorder(상황))

cor_dat |>
  group_by(상황) |>
  summarise(피어슨 = cor(x, y), 스피어만 = cor(x, y, method = "spearman"),
            켄달 = cor(x, y, method = "kendall"),
            피어슨_p = cor.test(x, y)$p.value, 스피어만_p = cor.test(x, y, method = "spearman")$p.value)

ggplot(cor_dat, aes(x, y)) +
  geom_point() +
  geom_smooth(method = "lm", se = FALSE, formula = y ~ x) +
  facet_wrap(~상황, scales = "free")
```

![세 자료와 최소제곱 직선](./images/bio-cor-01.png)

선형 자료에서 0.87이던 피어슨 상관계수는 $x$ 방향으로 먼 이상값 하나가 들어가면 0.26으로 떨어지지만, 스피어만 상관계수는 0.62에 머문다. 단조 비선형 관계에서는 스피어만(0.95)이 피어슨(0.86)보다 크다. 켄달의 $\tau$는 정의가 달라 같은 관계에서도 값이 작으므로 다른 두 계수와 크기를 직접 비교하지 않는다. 산점도를 먼저 보고 선형 관계와 단조 관계 중 무엇을 물을지 정한다.

## 요약

| 목적 | 방법 | SAS |
|---|---|---|
| 선형 연관 | 피어슨 $r$, Fisher 변환 CI | `proc corr pearson fisher` |
| 단조 연관, 이상값 | 스피어만, 켄달 | `proc corr spearman kendall` |
| 교란 통제한 상관 | 편상관 | `proc corr` + `partial` |
| 설명·예측 | 단순·다중 회귀 | `proc reg` |
| 범주형 설명변수 포함 | 일반선형모형 | `proc glm` + `class` |
| 가정 확인 | 잔차·Q-Q 그림 | `plots=diagnostics` |
| 영향점 | 스튜던트화 잔차, 레버리지, Cook's D | `/ influence`, `output` |
| 공선성 | VIF | `/ vif` |
