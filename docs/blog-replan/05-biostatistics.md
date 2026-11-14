# 05. 생명과학통계 (『생명과학연구를 위한 통계적 방법』 이재원·박미라·유한나, 최혜미 교수 강의)

**목표:** 강의 범위를 빠짐없이 다루고, SAS 코드와 **실제 출력**을 함께 보여 준다.

**변화:** 12편 → 13편(분할 1편). 순서를 조정한다.

## 새 순서

| 순서 | slug | 현재 위치 | 변경 이유 |
|---|---|---|---|
| 1 | biostat-study-design-clinical-trials | 1 | |
| 2 | biostat-sas-basics | 2 | |
| 3 | biostat-hypothesis-testing | 3 | |
| 4 | biostat-mean-comparison | 4 | |
| 5 | biostat-contingency-diagnostic | 5 | 분할표만 남김 |
| 6 | biostat-diagnostic-test | **신규 분할** | 진단 평가는 비교 축이 다름 |
| 7 | biostat-correlation-regression | 6 | |
| 8 | biostat-ancova | 9 → 8 | ANOVA와 회귀를 전제로 하므로 GLM 앞으로 |
| 9 | biostat-logistic-regression | 7 → 9 | |
| 10 | biostat-poisson-glm | 8 → 10 | |
| 11 | biostat-repeated-measures | 10 → 11 | |
| 12 | biostat-survival-analysis | 11 → 12 | |
| 13 | biostat-sample-size | 12 → 13 | |

**범위 확인 방법:** 강의 자료(`_tmp/bio_sheets`)는 3장(`C3`, `D3`), 4장(`L4a`, `L4b`), 5장(`A5`), 7장(`S7a~c`)이 있다. 1, 2, 6장 자료는 없다. 작업 시 있는 자료와 글을 슬라이드 단위로 대조한다. 교재 전체 목차는 사용자에게 받으면 추가한다(D6).

## 공통 규칙

### SAS 출력 정책 (D2 기본값)

현재 SAS 코드 100개가 출력 없이 "출력의 표를 본다" 식으로 끝난다. 복습에 가장 큰 공백이다.

**기본 절차**

1. 글에서 예제별 SAS 코드를 모아 `_tmp/bio_sas/<slug>.sas`를 만든다.
2. 사용자가 SAS OnDemand에서 실행해 결과(HTML 또는 텍스트)를 `_tmp/bio_sas/`에 두면, 실제 출력에서 핵심 표만 옮긴다.
3. 사용자가 실행하기 전이라면 같은 자료를 R로 계산해 `R로 확인한 값`이라고 밝혀 적는다. **SAS 출력 형식을 흉내 내어 만들지 않는다.**

**출력 표시 형식**

- SAS 블록 바로 아래 "출력 해석" 작은 표를 둔다. 출력 표 이름(`ODS` 표 이름 또는 제목)과 볼 값, 해석을 적는다.
- 전체 출력을 붙이지 않고 결론에 필요한 부분만 옮긴다.

### 그 외

- R 코드는 모의실험과 그림에만 쓴다. 코드 블록 언어는 `sas`와 `r`로 구분한다.
- 글 사이 내부 링크가 5개뿐이다. 글마다 앞뒤 개념으로 2~3개 링크를 건다.
- 작업 흔적 제거: `hypothesis-testing:108`, `mean-comparison:164`, `:203`, `contingency:210`, `sas-basics:404`.

## 글별 계획

### biostat-study-design-clinical-trials · B형

**목표 목차:** 연구설계 기준 → 단면 → 종적 → 코호트 → 사례-대조 → 실험 → 임상시험 단계 → 무작위 배정과 눈가림 → 분석 집단(ITT, PP) → 설계 유형(평행, 교차, 요인) → 윤리 → 비교 → 분석 방법 연결

**비교 축:** 설계 / 방향 / 측정 가능한 지표(유병률, 발생률, RR, OR) / 장점 / 단점 / 적합 상황. ITT와 PP는 별도 표.

**핵심 식:** RR, OR 정의만 쓰고 5번 글로 링크.

**그림:** 설계별 시간 방향 SVG 확인, 연구 단계 흐름.

---

### biostat-sas-basics · B형

**목표 목차:** 프로그램 구조 → DATA 입력 → 파일 가져오기 → 라이브러리 → 나누기·합치기 → 확인·출력 → 포맷 → 기본 통계량 → ODS → SASHELP 예제 → SGPLOT → 연습

**비교 축:** DATA step과 PROC, `INPUT`과 `INFILE`과 `PROC IMPORT`, `SET`과 `MERGE`, 임시와 영구 라이브러리, SAS와 R 대응표.

**그림(현재 0장):** SVG로 DATA step 실행 흐름(PDV) 1개. SGPLOT 출력은 사용자가 실행한 경우만 넣는다.

**고칠 것:** 블록 23개에 입력과 짝이 되는 출력 표시. `:404` 흔적.

---

### biostat-hypothesis-testing · B형

**목표 목차**

1. 가설검정의 구조
2. 귀무가설 기준의 판단, 오류
3. 유의수준, p값
4. 단측, 양측
5. 예제: 평균이 10보다 큰가
6. 신뢰구간과 검정, 통계적 유의성과 임상적 의미
7. 가능도비, Wald, 점수 검정: 이항 비율, 축소·전체 모형
8. 비교: 세 검정 (모의실험 포함)
9. 자료형과 분석 방법: 시리즈 지도

**순서 변경:** 현재 8(세 검정) → 9(자료형) → 10(세 검정 비교)가 끼어 있다. 7, 8로 붙이고 자료형을 마지막으로 옮긴다.

**핵심 식:** $Z$, $t$, Wald $\frac{(\hat\theta-\theta_0)^2}{\mathrm{Var}(\hat\theta)}$, LR $-2\log\Lambda$, Score $\frac{U(\theta_0)^2}{I(\theta_0)}$.

**고칠 것**

- `:202` "LR이 가장 안정적"과 `:307` "Score가 가장 가까움"이 충돌한다. 모의실험에 맞춰 한 문장으로 통일한다. 실제 포함률과 몬테카를로 표준오차를 인용한다.
- `:220` `PROC FREQ binomial`의 기본 구간은 Wald이고 Exact는 옵션으로 나온다. 코드 옵션과 값을 정확히 쓴다.
- `:108` 흔적.

---

### biostat-mean-comparison · B형

**목표 목차:** 평균 비교 지도 → 독립 두 집단(합동, Welch, 예제 2-1, 2-2) → Mann-Whitney → 짝지은 표본(예제 2-3) → 일원분산분석(예제 2-4) → 다중비교와 대비 → 이원분산분석(예제 2-5) → Friedman → 비교

**핵심 식:** 합동 t, Welch t와 자유도, $U$, 대응 t, $F$, Tukey $q$, 대비, 이원 모형, Friedman.

**비교 축:** 합동 t/Welch t/Mann-Whitney(기존 모의실험 유지), 독립 분석과 짝지은 분석, 다중비교 방법.

**고칠 것**

- `:49`의 사전 등분산 검정 절차와 `:594`의 "Welch 기본" 결론이 충돌한다. 절차를 **Welch 기본**으로 고치고, 사전 검정은 교재가 제시한 관행으로만 설명한다.
- `:68~71` 칼슘 자료의 집단이 뒤바뀌었을 가능성이 있다. 교재 확인이 필요하다(D7). 확인 전에는 값을 바꾸지 않는다.
- `:164`, `:203` 흔적.

**유지:** Mann-Whitney의 $P(X>Y)$ 해석.

---

### biostat-contingency-diagnostic · B형 · 분할표

**범위:** 현재 1~9절과 15절(방법 간 비교). 10~14절의 진단 평가와 일치도는 새 글로 옮긴다. slug는 유지하고 제목을 "분할표 분석"으로 바꾼다.

**목표 목차:** 분할표와 PROC FREQ → 상대위험률 → 예제 3.1 → 오즈비 → 예제 3.2 → 카이제곱 → Fisher → McNemar → CMH → 비교(작은 표본, 발생률, 층화)

**핵심 식:** RR, OR, $\log$ OR의 SE, 카이제곱, $G^2$, 초기하, McNemar $\frac{(b-c)^2}{b+c}$, CMH.

**비교 축:** 카이제곱/Fisher/McNemar/CMH(자료 구조, 가설, 조건). RR과 OR(설계별 사용 가능성).

**고칠 것**

- `:235` "왼쪽 단측 0.262"는 SAS 기본 정렬(no, yes)에서 틀리다. R 재계산 결과 오른쪽 0.262, 왼쪽 0.976이다. `order=data`로 행 순서를 고정하고 어느 칸을 기준으로 한 단측인지 쓴다.
- `:268`과 `:284~289` McNemar 표의 방향이 어긋난다. $b$, $c$ 정의를 통일한다.
- `:319` "SAS 코드는 다음과 같다" 뒤에 그림과 식이 나오고 코드는 `:335`에 있다. 문장을 코드 바로 앞으로 옮긴다.
- `:210` 흔적.

**유지:** 왜 오즈비를 쓰는가의 설명.

---

### biostat-diagnostic-test (신규 분할) · B형

**범위:** 현재 `contingency-diagnostic`의 10~14절(진단법 평가, ROC, 간 스캔, ROC 실습, 카파).

**목표 목차:** 진단법 평가 → 민감도, 특이도 → 예측도와 유병률 → 우도비 → 절단값과 ROC, AUC → 간 스캔 예제 → 일치도: 카파 → 비교

**핵심 식:** Se, Sp, PPV, NPV, 베이즈로 쓴 $PPV=\frac{Se\cdot p}{Se\cdot p+(1-Sp)(1-p)}$, LR+, LR−, AUC, $\kappa=\frac{p_o-p_e}{1-p_e}$.

**비교 축:** 검사의 고유 성질(Se, Sp, LR)과 유병률 의존값(PPV, NPV), 진단 평가와 일치도, 민감도·특이도 교환.

**그림:** 유병률에 따른 PPV 곡선, ROC와 절단값(R).

**링크:** 기존 URL의 독자를 위해 `contingency-diagnostic` 끝에 이 글 링크를 둔다.

---

### biostat-correlation-regression · B형

**목표 목차:** 피어슨 → 스피어만, 켄달 → 편상관 → 단순회귀 → ANOVA, $R^2$ → 신뢰·예측구간 → 다중회귀 → 수정 $R^2$, 변수 선택 → 진단: 이상점, 영향점, 공선성 → 비교

**핵심 식:** $r$, 피셔 $z$, $r_s$, 편상관, 회귀 식, Cook's D, DFFITS, VIF.

**비교 축:** 상관계수 세 종류(유지), 상관과 회귀, 신뢰구간과 예측구간, 영향 측도.

**연결:** 이론 상세는 `dm-linear-regression`.

---

### biostat-ancova · B형

**목표 목차:** 왜 쓰는가 → ANOVA·회귀·ANCOVA → 기본 모형, 조정평균, 정밀도 → 변화량 분석 비교 → 가정 → 가설 → SAS 문법 → Type I, III → 예제 5.1, 5.2 → 기울기가 다른 모형 → 예제 5.3 → 주의 → 비교

**핵심 식:** $y_{ij}=\mu+\tau_i+\beta(x_{ij}-\bar x)+e_{ij}$, 조정평균 $\bar y_i-\hat\beta(\bar x_i-\bar x)$.

**유지:** 현 구성은 좋다. `seriesOrder` 변경에 따른 앞뒤 링크를 고친다.

---

### biostat-logistic-regression · B형

**목표 목차:** 언제 쓰는가 → 로짓모형 → 계수 해석 → 추정, 검정, OR 구간 → 예제 4.1, 프레이밍햄, 4.2 → 적합도 → 교란, 상호작용 → 작은 표본(정확, 조건부) → 순서형 → 명목형 → 주의 → 비교

**핵심 식:** 로짓, OR $=e^{\beta}$, 가능도, 비례오즈 $\log\frac{P(Y\le j)}{P(Y>j)}=\alpha_j-\beta x$, 일반화 로짓, 조건부 가능도, Hosmer-Lemeshow.

**비교 축:** 로지스틱 종류 표, OR·RR 추정 방법(유지), 조건 없는 로지스틱과 조건부 로지스틱.

**그림(현재 0장):** 로짓 곡선과 계수의 의미, 비례오즈 그림, OR 숲 그림(R).

**연결:** 분류 관점은 `dm-logistic-regression`.

---

### biostat-poisson-glm · B형

**목표 목차:** 발생률과 인년 → 포아송 → GLM 세 요소 → 포아송 회귀와 오프셋 → 예제 → 적합도, 과대산포 → 수정 포아송으로 RR 추정 → 음이항 비교

**핵심 식:** $\log E(Y)=\log t+x^T\beta$, 편차, 피어슨 $\chi^2/df$, 음이항 $\mathrm{Var}=\mu+\alpha\mu^2$, 로버스트 분산.

**그림(현재 0장):** 포아송 분포 형태, 과대산포 시 표준오차 포함률(R).

---

### biostat-repeated-measures · B형

수식이 2개뿐이다. 식을 보강한다.

**목표 목차:** 왜 따로 다루는가 → 자료 형식 → 반복측정 ANOVA, 구형성 → 선형혼합모형: 공분산 구조, 임의효과, 결측 → GEE → 비교

**핵심 식:** $y_{ij}=\mu+\tau_i+\pi_{k(i)}+\beta_j+(\tau\beta)_{ij}+e_{ijk}$, Mauchly, Greenhouse-Geisser $\epsilon$, $y=X\beta+Zb+e$, $\mathrm{Var}(y)=ZGZ^T+R$, CS·AR(1)·UN 표, GEE 추정식 $\sum D_i^TV_i^{-1}(y_i-\mu_i)=0$.

**비교 축:** RM ANOVA/LMM/GEE(기존 표): 해석 수준, 결측 가정(MCAR, MAR), 공분산 처리. 조건부와 주변 효과.

**연결:** `doe-09`(분할법과 같은 구조).

---

### biostat-survival-analysis · B형

**목표 목차:** 생존시간과 중도절단 → 생존·위험함수 → 생명표(예제 7.1) → KM(예제 7.2) → 로그순위, 가중 검정(예제 7.8) → Cox, 부분가능도, 해석(예제 7.6) → 비례위험 확인 → 예측 생존함수 → 비교

**고칠 것**

- `:202~204`와 `:415` Wilcoxon 이름이 다르다. SAS `wilcoxon` 스트라타는 Gehan, R `rho = 1`은 Peto-Peto로 **서로 다른 가중**임을 표로 밝힌다. 같은 검정처럼 비교하지 않는다.
- `:236` CP 13/19는 14/19로 고친다. 그 값을 쓰는 뒤 계산이 있으면 함께 고친다.

**비교 축:** 생명표와 KM, 로그순위와 가중 검정, KM과 Cox, 검정력 모의실험(유지).

**연결:** 통계적 학습 관점과 벌점 Cox는 `dm-survival`.

---

### biostat-sample-size · B형

**목표 목차:** 검정력 네 요소 → 두 평균 → 군 크기, 탈락률 → 짝지은 자료 → 두 비율 → 생존(사건 수) → 여러 군, 비열등성 → 검정력 곡선, 사후 검정력 → 비교

**핵심 식:** $n=\frac{2\sigma^2(z_{1-\alpha/2}+z_{1-\beta})^2}{\Delta^2}$, 짝지은 형태, 두 비율, Schoenfeld $d=\frac{(z_{1-\alpha/2}+z_{1-\beta})^2}{p(1-p)(\log HR)^2}$, 비열등성.

**유지:** 사후 검정력 비판. `PROC POWER`와 R `pwr`, 공식 비교.

## 작업 묶음

| 묶음 | 글 | 비고 |
|---|---|---|
| BIO-1 | sas-basics, study-design | SAS 출력 형식 확정 |
| BIO-2 | hypothesis-testing, mean-comparison | |
| BIO-3 | contingency, diagnostic-test | 분할 |
| BIO-4 | correlation-regression, ancova | |
| BIO-5 | logistic, poisson-glm | |
| BIO-6 | repeated-measures, survival, sample-size | |
