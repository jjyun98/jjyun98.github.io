# 03. 시계열 분석 (조신섭·손영숙·성병찬, 강의 CH1~10)

**목표:** 강의 CH1~10을 빠짐없이 다루고, 전통적 방법 → 확률과정 → ARIMA로 이어지는 비교를 분명히 한다.

**변화:** 10편 유지, 순서 유지. 대부분 B형이고 평활법, 분해법은 A형이다.

**범위 확인 방법:** 교재 전문이 없다. 작업 시 `_tmp/ts_sheets/sheet_CHn.jpg`를 열어 슬라이드 제목을 글의 절과 하나씩 대조한다. 슬라이드에 있고 글에 없는 내용은 추가한다. 교재의 11장 이후(개입, 전이함수, VAR, GARCH 등)는 강의 범위 밖이므로 `ts-10` 끝에 "다루지 않음"으로 적는다.

**공통 고칠 것**

- 9개 글이 외부 자료 `raw.githubusercontent.com/Bricoler/time-series-analysis/master/...`에 의존한다. `master`를 특정 커밋 SHA로 고정한다.
- 책 제목을 통일한다. 글에는 『SAS/ETS를 이용한 시계열분석』, About에는 『SAS/ETS와 R을 이용한 시계열분석』으로 되어 있다. 정확한 판을 사용자에게 확인하고 통일한다(D5).
- `ts_code`, `old_ts`의 자료와 그림이 현재 글에 반영되어 있는지 필요할 때만 확인한다.

## 글별 계획

### ts-01-intro · B형 · CH1

**목표 목차:** 시계열 자료 → 시계열 그림 → 성분(추세, 계절, 순환, 불규칙) → 분석 목적 → 모형 적합 3단계 → 예측력 척도 → 비교 → 시리즈 구성

**핵심 식**

- $\mathrm{MSE}=\frac1m\sum e_t^2$, $\mathrm{MAE}=\frac1m\sum|e_t|$, $\mathrm{MAPE}=\frac{100}{m}\sum|e_t/Z_t|$, $\mathrm{RMSE}$
- 가법 $Z_t=T_t+S_t+C_t+I_t$, 승법 $Z_t=T_tS_tC_tI_t$

**비교 축:** 추세모형 / 평활법 / 분해법 / ARIMA를 목적, 식, 장단점으로 비교한다. 예측력 척도끼리 척도 의존성과 0 근처 문제를 비교한다.

**예시:** 기존 시계열 그림. 성분별로 다른 자료를 하나씩 보인다.

---

### ts-02-trend · B형 · CH2

**목표 목차**

1. 추세모형 종류: 상수평균, 선형, 2차, 지수 성장
2. 회귀 복습: 최소제곱, 상수평균모형의 예측과 갱신
3. 잔차분석과 Durbin-Watson
4. 계절 추세모형: 지시함수, 삼각함수
5. 추세모형 예측
6. 비교
7. 예시: 국내 인구, 백화점 매출

**핵심 식**

- $Z_t=\beta_0+\beta_1t+\epsilon_t$, $\hat Z_{n+h}$
- $d=\frac{\sum_{t=2}^n(e_t-e_{t-1})^2}{\sum_{t=1}^ne_t^2}\approx2(1-r_1)$
- $Z_t=\sum_{i=1}^s\beta_iI_{it}+\epsilon_t$, $Z_t=\beta_0+\sum_i\{\beta_{1i}\sin\frac{2\pi it}{s}+\beta_{2i}\cos\frac{2\pi it}{s}\}+\epsilon_t$

**비교 축:** 지시함수와 삼각함수(모수 수, 곡선의 매끄러움, 쓰임), 추세 차수 선택 기준.

---

### ts-03-smoothing · A형 · CH3

**목표 목차**

1. 개념: 이동평균, 단순지수평활, 초기값·평활상수, Holt(이중), Winters(가법, 승법)
2. 비교: 평활법과 예측함수, 대응 ARIMA 표, 추세·계절 처리 표
3. 예시: 중간재 출하지수, 월별 주가지수, 국내 항공 승객

**핵심 식**

- $\hat Z_n(1)=\frac1m\sum_{i=0}^{m-1}Z_{n-i}$
- $S_n=wZ_n+(1-w)S_{n-1}$
- $L_t=\alpha Z_t+(1-\alpha)(L_{t-1}+T_{t-1})$, $T_t=\beta(L_t-L_{t-1})+(1-\beta)T_{t-1}$
- Winters 승법·가법 갱신식

**유지:** 평활법-ARIMA 대응 표.

**고칠 것:** 모형 간 예측력 비교에서 하나의 분할 결과를 일반화하지 않는다. 이름이 비슷한 이중지수평활과 Holt의 관계를 비교 절에서 명확히 쓴다.

---

### ts-04-decomposition · A형 · CH4

**목표 목차**

1. 개념: 분해 모형, 추세모형에 의한 분해, 단순·중심이동평균, 이동평균 분해, STL, X-11 계열, 계절조정
2. 비교: 평활법과 분해법의 목적 차이, 기존 분해 방법 표
3. 예시: 식료품 출하지수, 계절조정 전후

**핵심 식:** 가법 $Z_t=T_t+S_t+I_t$, 승법, 중심이동평균 $2\times12$ 가중치, 계절지수 정규화 합 조건, 계절조정 $Z_t-\hat S_t$ 또는 $Z_t/\hat S_t$.

---

### ts-05-stochastic-process · B형 · CH5

**목표 목차:** 확률과정 → 정상성(강, 약) → 백색잡음과 확률보행 → 선형과정과 Wold → ACF와 SACF → PACF → 비교 → 실제 시계열

**핵심 식**

- $E(Z_t)=\mu$, $\mathrm{Cov}(Z_t,Z_{t+k})=\gamma_k$, $\rho_k=\gamma_k/\gamma_0$
- $r_k=\frac{\sum_{t=1}^{n-k}(Z_t-\bar Z)(Z_{t+k}-\bar Z)}{\sum(Z_t-\bar Z)^2}$, Bartlett 표준오차
- $\phi_{kk}$ 정의 (부분상관, Yule-Walker 해)
- 포트맨토 $Q_{LB}=n(n+2)\sum_{k=1}^K\frac{r_k^2}{n-k}$
- 확률보행 $Z_t=Z_{t-1}+a_t$, $\mathrm{Var}(Z_t)=t\sigma^2$

**유지:** 1절의 동기 설명은 이 시리즈의 좋은 예다. 그대로 살린다.

**비교 축:** 백색잡음 / 확률보행 / 정상 AR을 평균, 분산, ACF로 비교한다. ACF와 PACF의 정의와 쓰임을 비교한다.

---

### ts-06-arma · B형 · CH6

**목표 목차**

1. 부호 표기 (유지)
2. AR(1), AR(2), AR(p): 정상성 조건, 평균, 분산, ACF, PACF
3. MA(1), MA(2), MA(q): 가역성
4. AR과 MA의 쌍대성
5. ARMA(1,1), ARMA(p,q)
6. 비교: AR/MA/ARMA 표 **한 번**
7. 예시: 시뮬레이션 SACF, SPACF 패널

**핵심 식:** $\phi(B)Z_t=\delta+\theta(B)a_t$, $\rho_k=\phi^k$, Yule-Walker $\rho_k=\phi_1\rho_{k-1}+\phi_2\rho_{k-2}$, MA(1) $\rho_1=-\theta/(1+\theta^2)$, ARMA(1,1)의 $\rho_1$과 $\rho_k=\phi\rho_{k-1}$.

**고칠 것**

- 같은 ACF/PACF 표가 4회 나온다. 비교 절 1회로 줄인다.
- `:244`의 $\phi(B)$와 $\Phi(B)$를 구분한다. $\Phi$는 ts-10의 계절 연산자에 쓴다.

**유지:** 부호 표기 주의, 쌍대성.

---

### ts-07-arima · B형 · CH7

**목표 목차:** 비정상 종류 → 분산 안정화(Box-Cox) → 결정적·확률적 추세 → 차분과 과대차분 → 계절 차분 → ARIMA(p,d,q) → 단위근 검정(ADF, **KPSS 추가**) → 비교

**핵심 식**

- $Z_t^{(\lambda)}=(Z_t^\lambda-1)/\lambda$
- $\nabla=1-B$, $\nabla_s=1-B^s$, $\phi(B)(1-B)^dZ_t=\delta+\theta(B)a_t$
- ADF 회귀 $\nabla Z_t=\alpha+\gamma t+\rho Z_{t-1}+\sum\psi_i\nabla Z_{t-i}+a_t$, $H_0:\rho=0$
- KPSS: $H_0$ 정상 (ADF와 가설 방향이 반대)

**비교 축:** ADF와 KPSS의 귀무가설, 결론 조합 4가지의 해석. 추세 정상과 차분 정상의 예측 구간 차이.

**고칠 것:** `:200` `ndiffs()` 기본 검정이 KPSS, `nsdiffs()`의 기본이 seas 측도임을 정확히 쓴다. 코드에 `test =`를 명시한다.

**유지:** 과대차분 설명, 비교 모의실험.

---

### ts-08-model-fitting · B형 · CH8

**목표 목차:** Box-Jenkins → 식별(정상화, 차수, 정보기준, 상수항) → 추정(적률, 최소제곱, 최대가능도) → 진단(잔차, 포트맨토, 과대적합) → 비교 → 예제 3개 → 자동 선택의 한계

**핵심 식:** AIC, BIC, AICc, 적률추정 $\hat\phi=r_1$, $\hat\theta$의 $r_1$ 방정식과 가역 해 선택, 조건부 제곱합, $Q_{LB}$의 자유도 $K-p-q$.

**비교 축:** 추정 방법(유지), 정보 기준(유지), 자동 선택과 수동 식별.

**고칠 것:** 비교 결과에 분할, 시드 범위를 적는다. `auto.arima` 기본값을 명시한다.

---

### ts-09-forecasting · B형 · CH9

**목표 목차:** 최소 평균제곱오차 예측 → AR(1) → MA(1) → 일반 ARMA와 ψ 가중치, 예측구간 → 비정상 ARIMA 예측 → 갱신 → 비교

**핵심 식**

- $\hat Z_n(\ell)=E(Z_{n+\ell}\mid Z_n,Z_{n-1},\dots)$
- $e_n(\ell)=\sum_{j=0}^{\ell-1}\psi_ja_{n+\ell-j}$, $\mathrm{Var}(e_n(\ell))=\sigma^2\sum_{j=0}^{\ell-1}\psi_j^2$
- 예측구간 $\hat Z_n(\ell)\pm z_{\alpha/2}\sigma\sqrt{\sum\psi_j^2}$
- 갱신 $\hat Z_{n+1}(\ell)=\hat Z_n(\ell+1)+\psi_\ell a_{n+1}$

**비교 축:** 모형별 장기 예측값과 예측구간 폭의 수렴 또는 발산(AR, MA, ARMA, ARIMA, 추세 정상).

**그림:** 모형별 예측구간 팬 차트 패널.

---

### ts-10-seasonal-arima · B형 · CH10

**목표 목차**

1. 결정적 계절성과 확률적 계절성
2. 순수 계절 모형: SMA(1), SAR(1), SAR(2)의 SACF·SPACF
3. 승법 ARIMA(p,d,q)(P,D,Q)ₛ, 항공 모형
4. 승법 모형의 SACF 패턴: $(0,0,1)(0,0,1)_{12}$, $(0,0,1)(1,0,0)_{12}$ 등
5. **비승법 계절 모형** (강의에 있음, 글에 없음)
6. 회귀 + ARMA 오차
7. 비교
8. 예시: 월별 관광객, 식별 → 추정 → 진단 → 예측
9. 시리즈 정리: 다루지 않은 주제 목록

**핵심 식**

- $\phi(B)\Phi(B^s)(1-B)^d(1-B^s)^DZ_t=\delta+\theta(B)\Theta(B^s)a_t$
- 항공 모형 $(1-B)(1-B^{12})Z_t=(1-\theta B)(1-\Theta B^{12})a_t$
- 항공 모형 $\rho_1$, $\rho_{11}$, $\rho_{12}$, $\rho_{13}$
- 비승법 $\phi^*(B)(1-B^s)^D(1-B)^dZ_t=\delta+\theta^*(B)a_t$

**비교 축:** 결정적 계절 / 승법 / 비승법 / Winters / 회귀 + ARMA 오차.

**그림:** 강의 슬라이드 5~11의 패턴을 R 시뮬레이션으로 재현한 패널.

## 작업 묶음

| 묶음 | 글 |
|---|---|
| TS-1 | ts-01, ts-02 |
| TS-2 | ts-03, ts-04 |
| TS-3 | ts-05, ts-06 |
| TS-4 | ts-07, ts-08 |
| TS-5 | ts-09, ts-10 |
