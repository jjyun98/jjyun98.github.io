#  블로그 전체 점검 및 수정 필요 사항 정리

- 점검 일시: 2026-11-14
- 점검 범위: `src/content/posts/` 전체 141편(13개 시리즈·단독 글), `src/pages/`, `src/content/`, `src/styles/`, `src/site.config.ts`, `public/`, `README.md`
- 빌드·자동 검증 결과:
  - `npm run build` (`astro build` + `pagefind`): 367개 페이지 빌드 성공, KaTeX 렌더링 오류(`katex-error`) 0건, 깨진 내부 경로·앵커 0건.
  - 단, 마크다운 표 안 인라인 수식의 이스케이프되지 않은 `|` 때문에 **실제 HTML 표 렌더링이 깨지거나 잘린 곳 3건**이 확인됐다.

---

## 1. 우선순위별 핵심 요약

| 우선순위 | 분류 | 건수 | 핵심 내용 |
|---|---|---|---|
| **P0 (즉시 수정)** | HTML 표 파싱 깨짐 | 3건 | `dl-02`, `dl-03`, `sp-04` 표 안 수식 `|...|`가 GFM 열 구분자로 인식됨 (`dl-02`는 표 전체가 원문 출력, `dl-03`·`sp-04`는 셀 잘림) |
| **P0 (즉시 수정)** | 미완성 문장·코드 런타임 에러·SQL 불일치 | 9건 | `beauty` 중간 끊긴 문장·잔여 표·SQL 컬럼명(`goods_id` vs `goodsNumber`), `r4ds-functions` 기본값 `NULL` 실행 오류, `dl-02` `axis=1`, `dl-08` `splitter` 누락, `dl-11` 미선언 변수, `sp-12` `.max(1)`/`~D`, `air-gapped`/`data-naming-standards` Base R `write.csv(..., fileEncoding="UTF-8-BOM")` 오류 |
| **P1 (높음)** | 수식·통계·이론·수치 오류 | 26건 | 부등호 역전(`ts-05`), 조건 누락(`sp-02`), 차원 불일치(`sp-06`, `la-svd`), 역설적 모순(`ml-06` 2×2 교호작용, `la-orthonormal` rank 조건, `biostat-mean-comparison` $U_1$ 정의 충돌, `doe-05` Satterthwaite 분산성분, `doe-08` 자유도 22→20), SAS 옵션 오류(`biostat-diagnostic-test`, `biostat-mean-comparison`), 산술·반올림 오류(`ml-04`, `ml-05`, `dl-03`, `dl-04`, `biostat-hypothesis-testing`, `biostat-sample-size`, `micro-factor-market`) 등 |
| **P1 (높음)** | 개연성·문맥·시리즈 모순 | 14건 | `dm-overview`에서 딥러닝·생존분석 "다루지 않음" 모순, `micro-competitive-market-analysis` 존재하지 않는 그림(A,B,C,D) 참조 및 잉여 계산 모순, `micro-pricing-market-power` 표 뒤에 바뀐 예제 수치 공개, `dv-11` 미연결 차트(`dv11-area.html`), `r4ds-modeling` `lm()` 정규방정식 오서술, `dm-logistic-regression` GLM 절·표 중복 등 |
| **P2 (보통)** | 사이트 공통·정렬·날짜·네이밍 | 12건 | `README.md`·`about.md`·`home.md`·`addendum.md`·`site.config.ts` 미갱신, 모바일 표 가로 스크롤 미적용(`src/styles/global.css`), 빈 잔여 폴더 `time-series-analysis/`, 미사용 `public/materials/` CSV 10개, `r4ds`·`dv`의 `seriesOrder` 대비 `published` 역전, `ts-09`·`ts-10` URL 미고정 등 |
| **P3 (낮음)** | 표기 통일·사소한 오탈자·보완 권장 | 30+건 | 기호 충돌(`ts-06~10` $\Phi/\Theta$, `biostat-sample-size` $\Delta/\delta$), 오탈자(`임보크`, `삼각형형은`), 공백 없는 제목 앞 줄, 미실행/보류 절 빈 셀(`doe-09`, `doe-10`) 등 |

---

## 2. 사이트 공통 · 저장소 구조

1. **모바일 환경 표 가로 스크롤 미적용 (`P2`)**
   - 위치: [src/styles/global.css](file:///Users/yn/workspace/github/jjyun98.github.io/src/styles/global.css#L546-L558), [astro.config.mjs](file:///Users/yn/workspace/github/jjyun98.github.io/astro.config.mjs)
   - 현상: `.katex-display`에는 `overflow-x-auto`가 적용돼 있으나, `table`을 감싸는 래퍼 플러그인이나 가로 스크롤 CSS가 아직 없다(`docs/blog-replan/09-site-and-standalone.md`의 WP-0 미완료 항목).
   - 수정: rehype 플러그인으로 `<div class="table-wrapper">`를 씌우거나 CSS로 가로 스크롤 처리.

2. **`README.md` 내용 구버전 (`P2`)**
   - 위치: [README.md](file:///Users/yn/workspace/github/jjyun98.github.io/README.md#L5-L13), [README.md](file:///Users/yn/workspace/github/jjyun98.github.io/README.md#L57-L70)
   - 현상: 시리즈 목록(7개)에 `딥러닝`, `확률과정론`, `데이터 시각화`, `기계학습 활용`, `데이터 분석 환경`이 빠져 있고, 70행에 "시리즈 안의 순서는 `published` 날짜 순이다"라고 적혀 있어 실제 `seriesOrder` 우선 정렬(`src/utils.ts`)과 다르다. (39행 "확인합니다."도 블로그 문체인 이다체와 불일치)
   - 수정: 전체 시리즈 반영 및 frontmatter 예시·정렬 설명에 `seriesOrder` 반영.

3. **`src/pages/about.md` 시리즈 표 누락 및 빈 칸 (`P2`)**
   - 위치: [src/pages/about.md](file:///Users/yn/workspace/github/jjyun98.github.io/src/pages/about.md#L12-L26)
   - 현상: 실제 사이트에는 13개 `series`가 생성되나 표에는 11개만 있고 `데이터 분석 환경`(4편)과 `화장품 성분 분석 프로젝트`(1편)가 빠져 있다. 또한 18행 `선형대수학`의 `코드` 열이 비어 있다(실제 글에는 R, Python 코드 포함).
   - 수정: `데이터 분석 환경` 추가(프로젝트 글 처리 방침에 따라 `beauty`도 정리), `선형대수학` 코드 칸에 `R, Python` 기재.

4. **`src/content/home.md` 사용 언어 설명 불일치 (`P2`)**
   - 위치: [src/content/home.md](file:///Users/yn/workspace/github/jjyun98.github.io/src/content/home.md#L10)
   - 현상: "코드는 수업에서 쓴 언어(R, SAS)를 그대로 따른다"라고 되어 있으나, 실제로는 Python 전용 시리즈 4개(47편)와 선형대수(8편) 등에서 Python을 광범위하게 사용한다.
   - 수정: `(R, Python, SAS)` 등으로 갱신.

5. **`src/content/addendum.md` UI 위치 설명 부정확 (`P2`)**
   - 위치: [src/content/addendum.md](file:///Users/yn/workspace/github/jjyun98.github.io/src/content/addendum.md#L7)
   - 현상: "같은 시리즈의 다른 글은 글 상단의 시리즈 목록에서 이어서 볼 수 있다"라고 쓰여 있으나, [src/pages/posts/[slug].astro](file:///Users/yn/workspace/github/jjyun98.github.io/src/pages/posts/%5Bslug%5D.astro#L135-L141)와 `PostInfo.astro` 기준으로 글 상단에는 시리즈 배지(`제목 N / M`)만 있고 전체 시리즈 글 목록은 **글 하단**(addendum 아래)에 렌더링된다.
   - 수정: "글 상단의 시리즈 배지나 글 하단의 시리즈 목록에서..."로 수정.

6. **`src/site.config.ts` SEO 태그 구버전 (`P3`)**
   - 위치: [src/site.config.ts](file:///Users/yn/workspace/github/jjyun98.github.io/src/site.config.ts#L14)
   - 현상: `tags` 배열에 `딥러닝`, `기계학습`, `선형대수학`, `확률과정론`, `실험계획법`, `데이터 시각화`, `데이터 엔지니어링` 등 주요 시리즈가 빠져 있다.

7. **빈 잔여 폴더 및 미참조 정적 파일 (`P2`)**
   - `src/content/posts/time-series-analysis/`: `.DS_Store`만 남은 빈 폴더(실제 시리즈는 `time-series/`). 삭제 필요.
   - `public/materials/data-mining/` 하위 CSV 10개(`Heart.csv`, `Default.csv`, `SAheartdata.csv`, `Carseats.csv`, `OJ.csv`, `Wholesale_customers_data.csv`, `sample_DT.csv`, `Crime.csv`, `USArrests.csv`): 현재 어떤 글에서도 경로로 참조되지 않는다. 사용 의도가 없다면 정리 여부 결정 필요.
   - `public/charts/dv/dv11-area.html`: Plotly 누적 영역 차트 HTML이 존재하나 `dv-11-pandas-plot-plotly` 본문에 임베드되어 있지 않다.

---

## 3. 시리즈별 상세 수정 사항

### 3.1 데이터 마이닝 (`src/content/posts/data-mining/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `dm-overview/index.md:28-44, 163-176` | 44행에 **"ISLR 10장(딥러닝)과 11장(생존분석)은 이 시리즈에서 다루지 않는다"**라고 되어 있으나, 실제로 `dm-neural-network`(12), `dm-deep-learning`(13), `dm-survival`(14)이 시리즈에 추가되어 있음. `시리즈 구성` 표(28~42행)와 `시리즈 방법의 비교` 표(163~176행)에서도 세 글이 누락됨 | 44행의 부정 문구 삭제, 두 요약 표에 신경망·딥러닝·생존분석 추가. 168행 KNN 행도 회귀가 `dm-linear-regression`에 있음을 함께 표기 |
| **P1** | `dm-association-rule/index.md:170` | 글 전체가 연관규칙을 $X \Rightarrow Y$로 표기하는데, 170행만 "신뢰도는 $B$ 자체가 흔하면..."으로 생뚱맞은 `$B$`를 사용 | `$B$` → `$Y$` |
| **P1** | `dm-logistic-regression/index.md:186-192, 211-225` | `Bikeshare` 예제를 사이에 두고 "선형·로지스틱·포아송 회귀는 모두 GLM이다"라는 문장과 3모형 비교 표가 거의 똑같이 두 번 중복됨 | 포아송 회귀 도입부에는 짧은 연결 문장만 두고, 전체 3모형 비교 표는 `## GLM으로 본 회귀모형들`에 한 번만 배치 |
| **P1** | `dm-deep-learning/index.md:177, 254` | (1) 177행 `xdata <- scale(as.matrix(NYSE[, ...]))`가 시험 구간(1980~1986)까지 포함한 전체 평균·표준편차로 표준화해 `dm-resampling`·`dm-neural-network`에서 경고한 **데이터 누수** 기준과 충돌. (2) 254행에서 Hitters 신경망 모수를 `1,409개`(ISLR 표 10.2, 은닉 64유닛)로 인용했는데, 앞 글 `dm-neural-network:302`의 은닉 50유닛 모형(`1,101개`)과 유닛 수가 다른 점을 적지 않아 숫자가 충돌해 보임 | (1) 학습 분할(`istrain`) 기준 표준화로 고치거나, ISLR 실습 원문 재현이라 전체 표준화를 썼음을 명시. (2) `신경망(은닉 단위 64개, 모수 1,409개)`로 명시 |
| **P1** | `dm-regularization/index.md:179` | PLS 첫 방향의 $\phi_{j1}$을 "$Y$를 $X_j$에 단순회귀한 계수"로 설명했으나, 이는 각 $X_j$를 **표준화**했을 때($\text{Var}(X_j)=1$) 성립하는 성질(표준화는 201행 코드에 가서야 등장) | "각 $X_j$를 표준화한 뒤, 첫 방향의 $\phi_{j1}$은..."으로 전제 명시 |
| **P2** | `dm-linear-regression/index.md:58` | `## 단순선형회귀` 안의 표에서 `RSE`를 $\sqrt{RSS/(n-p-1)}$로 적었으나, 48행은 $n-2$로 쓰고 `$p$`는 103행 `## 다중선형회귀`에서 처음 정의됨 | $\sqrt{RSS/(n-2)}$로 맞추거나 `$p$`의 의미 병기 |
| **P2** | `dm-ensemble/index.md:198` | 4열 비교 표(`배깅 | 랜덤포레스트 | 부스팅 | BART`, 190~196행) 바로 아래에서 "세 방법 모두 단일 나무보다 정확하지만..."이라고 서술 | "네 방법" 또는 "실습에서 다룬 세 방법"으로 수정 |
| **P3** | `dm-deep-learning/index.md:84` | 일반 개념 설명에서 CIFAR100의 구체적 크기(`32 × 32` 행렬, `3 × 3` 필터)를 일반 사실처럼 서술(CIFAR100은 107행에서 등장) | "예: $32 \times 32$ 행렬", "예: $3 \times 3$ 가중치"로 완화 |
| **P3** | `dm-logistic-regression/index.md:164`, `dm-pca/index.md:159` | `$1 - $ 특이도`, `$1 - $ 누적 PVE`처럼 닫는 `$` 앞에 공백이 있는 비표준 인라인 수식 표기 | `$1 - \text{특이도}$`, `$1 - \text{누적 PVE}$` (또는 일반 텍스트)로 수정 |
| **참고** | `dm-regularization` 등 | `seriesOrder`가 `6` 다음 `8`로 7번이 비어 있음(`pcr-pls-high-dim` 통합에 따른 의도된 결번이나, 혼동 방지를 위해 `dm-overview`에서 흐름이 자연스럽게 이어지는지 확인 필요) | 의도 유지 시 현황만 인지 |

---

### 3.2 생명과학통계 (`src/content/posts/biostatistics/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `biostat-mean-comparison/index.md:178, 180, 189` | 189행에 $U_1 = n_1 n_2 + \frac{n_1(n_1+1)}{2} - R_1$로 정의해 놓고(`g1` $n_1=16, R_1=245$, `g2` $n_2=9, R_2=80$일 때 $U_1=35$, $U_2=109$), 178·180행에서는 R의 `wilcox.test` 결과 `W = 109`를 **$U_1 = 109$**라고 표기해 수식과 숫자가 정면 충돌 | 178·180행을 $W = 109$ (또는 $U_2 = 109$, $U_1 = 35$)로 수정하고, R의 `W`가 $n_1 n_2 - U_1 = R_1 - n_1(n_1+1)/2$에 해당함을 명시 |
| **P1** | `biostat-mean-comparison/index.md:470` | `data calcium;`에서 `length gender $ 6;` 없이 `do gender = 'male', 'female';`을 사용해 SAS 실행 시 `gender` 길이가 4로 고정되어 `'female'`이 `'fema'`로 잘림 | `do gender` 앞에 `length gender $ 6;` 추가 |
| **P1** | `biostat-mean-comparison/index.md:540, 545` | `lsmeans gender*trt / slice=gender adjust=tukey pdiff;`에 대해 `slice=gender`가 단순 주효과 검정이라고 설명했으나, 같은 문장의 `adjust=tukey pdiff`는 slice 내부가 아니라 **6개 cell 전체 15개 쌍**에 대해 Tukey 보정을 적용함 | `pdiff adjust=tukey`는 6개 셀 전체 쌍을 비교함을 명시 (성별 내부 비교만 원하면 `PROC PLM` `SLICE` 등 사용 안내) |
| **P1** | `biostat-mean-comparison/index.md:253, 259-265, 284` | 대립가설은 단측($H_1: \mu_D < 0$)이고 284행 결론도 단측 $p=0.042$를 쓰면서, 263행 SAS 코드는 `proc ttest data=blood;`에 `sides=L` 옵션이 빠져 있어 기본 양측검정($p=0.084$)이 실행됨 | `proc ttest data=blood sides=L;`로 수정 (`proc means`/`univariate`도 양측 $p$가 기본이므로 단측 변환 설명 추가) |
| **P1** | `biostat-diagnostic-test/index.md:86-88, 92` | (1) `tables scan*path / nopercent norow;`는 행 퍼센트를 숨기고 **열 퍼센트**($P(\text{scan}\mid\text{path})$)를 출력하므로 PPV/NPV가 아니라 민감도·특이도를 두 번 계산하게 됨. (2) 88행 `tables scan / binomial(level='abnormal');`에 `where` 필터가 없어 92행 설명("해당 행만 골라")과 달리 전체 양성률(263/344)이 나옴 | 87행을 `tables scan*path / nopercent nocol;` (행 백분율 = PPV, NPV)로 수정, 88행에 `where path='abnormal';` 등 부분집합 조건 추가 |
| **P1** | `biostat-sas-basics/index.md:275, 298-299` | 275행에서 `ridingmower`에 `"yes"="Y"`, `"no"="N"` 포맷(`$yngrp.`)을 입혀 `mower_f`를 만들었는데, 298~299행 결과 설명에서는 `income`은 포맷 라벨(`Low/Middle/High`)로 쓰면서 `ridingmower`는 포맷 전 값(`no`, `yes`)으로 기술 | `N`, `Y` 출력 기준으로 설명 통일 |
| **P1** | `biostat-hypothesis-testing/index.md:220` | $\hat p = 32/50 = 0.64$의 Wald 95% 신뢰구간 하한은 $0.64 - 1.96\sqrt{0.64\times 0.36/50} \approx 0.50695$로 반올림 시 `0.507`인데 `0.506`으로 적혀 있음 | `(0.506, 0.773)` → `(0.507, 0.773)` |
| **P1** | `biostat-sample-size/index.md:38` | 식에는 반올림 값 `(1.96 + 0.84)`을 넣고 결과는 정확한 분위수 기준인 `62.8`을 적음 (`2*(1.96+0.84)^2*100/25 = 62.72`) | `62.7`로 고치거나 정확한 $z$ 분위수 기준 `62.8`임을 부기 |
| **P2** | `biostat-mean-comparison/index.md:234 vs 331`, `354 vs 414` | (1) 예제 2-3과 2-4가 모두 데이터셋 이름을 `data blood;`로 써서 앞 예제를 덮어씀. (2) 354행 불균형 자료에 `proc anova`를 쓰면서 414행에서는 "`PROC ANOVA`는 균형 자료용이다"라고 적음 | 414행에 "일원배치는 불균형도 가능하지만 다원배치 불균형 자료는 `PROC GLM`을 써야 한다"고 보완 |
| **P2** | `biostat-correlation-regression/index.md:88-90, 156` | (1) `## 3. 단순선형회귀` 안에 자유도 $p$가 들어간 일반 ANOVA 표를 설명 없이 배치. (2) 156행 본문은 "나이, 체중, 콜레스테롤로 설명한다"고 하고 166행 코드는 `male`을 포함 | 88행에 $p=1$ 명시, 156행에 성별(`male`) 추가 |
| **P2** | `biostat-ancova/index.md:193` | "SAS의 Type I은 `anova()`, Type III은 `drop1()`에 해당한다"는 교호작용이 없는 가법 모형에서만 성립 (교호작용 모형에서는 주효과 Type III 검정 불가) | "교호작용이 없는 모형에서는" 조건 추가 |
| **P3** | `biostat-study-design-clinical-trials/index.md:199`, `biostat-survival-analysis/index.md:55`, `biostat-diagnostic-test/index.md:226-232`, `biostat-sample-size/index.md`, `biostat-sas-basics/index.md:10, 350` | (1) "노출 오즈와 비노출 오즈의 비" → "노출군의 발병 오즈와 비노출군의 발병 오즈의 비". (2) 중위 생존시간 $\hat S(t) = 0.5$ → $\hat S(t) \le 0.5$인 첫 시점. (3) Landis & Koch 표에서 `0.20, 0.40, 0.60, 0.80` 경계값 누락. (4) `sample-size`에서 효과크기 $\Delta$와 $\delta$ 기호 혼용. (5) `sas-basics` 10행 "SAS로 작성한다"와 R 코드 혼용, 350행 `lotsize`에 `width=6` 지정 | 각각 문구·기호·경계 보완 (참고: `docs/blog-replan/00-README.md`의 D7 칼슘 집단 원자료 대조 보류 건은 교재 대조 전까지 유지) |

---

### 3.3 실험계획법 (`src/content/posts/design-of-experiments/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `doe-08-three-level-factorial/index.md:182` | $3^3$ 교락법($N=27$, 총 자유도 26)에서 블록 효과(자유도 8)를 무시하고 주효과 $A, B, C$(각 2, 합 6)만 남기면 오차 자유도는 $26 - 6 = \mathbf{20}$인데 **22**라고 적혀 있음 | `오차가 22다` → `오차가 20이다` |
| **P1** | `doe-05-block-latin/index.md:321-343` | (1) 330행 본문은 "날짜(`C`)를 오차에 풀링한 축소모형"이라 적었으나, 321행 코드는 풀링하지 않은 `aov(y ~ A + B + C)`(`df_e = 14`)를 사용. (2) 334행 Satterthwaite 자유도 계산에서 서로 독립이 아닌 분산성분(`s2B/9`, `s2E/9`)에 자유도 8, 14를 직접 대입(`nu = 9.96`, 반폭 `2.01`). `doe-04:318`처럼 독립인 평균제곱 $\frac{1}{27}MS_B + \frac{2}{27}MS_E$에 적용해야 함(비풀링 시 $\nu^* = 9.25$, 반폭 `2.03`; `C` 풀링 시 $\nu^* = 9.42$, 반폭 `2.04`) | 풀링 여부(`A + B` vs `A + B + C`)를 본문과 일치시키고, `MS_B`와 `MS_E` 기반 Satterthwaite 식으로 수정 및 결과 수치 갱신 |
| **P1** | `doe-09-nested-split-plot/index.md:168-185` | 168행 제목은 "분할법을 **완전확률화(CRD)**로 분석하면"인데, 177~180행 코드는 블록 `B`를 포함한 **난괴법/블록+요인실험**(`aov(Y ~ B + V * N)`)을 실행함 | 제목을 "분할 구조를 무시하고(블록+요인실험으로) 분석하면"으로 바꾸고 CRD(`Y ~ V * N`)와 RCBD(`Y ~ B + V * N`) 구분 명시 |
| **P2** | `doe-09-nested-split-plot/index.md:120` | 위 코드 `summary(aov(Y ~ V * N + Error(B / V), data = oats))`의 출력은 반올림 시 질소 `N`의 Sum Sq가 `20021`, Mean Sq가 `6674`(정확히 `.5`)인데 표에는 `20020`, `6673`으로 적혀 있음 | `20021` / `6674` (또는 `20020.5` / `6673.5`)로 통일 |
| **P2** | `doe-04-multi-way-ems/index.md:203-213` | `fit_is`는 유의하지 않은 `B`, `A:C`를 모형에 남겨 `MSE` 자유도 9로 검정(`C` $p=0.036$)하면서, 바로 아래 점추정 `est`는 `B`, `A:C`를 뺀 `A, C, D, A:D`만 사용(`B, A:C` 풀링 시 `C` $p=0.0536$). `doe-08:322`처럼 교재 관행에 대한 주의 설명이 없음 | `doe-08:322`와 같이 `> **주의**` 블록으로 교재 기준 설명 추가 |
| **P2** | `doe-09-nested-split-plot/index.md:152-193`, `doe-10-rsm-mixture/index.md:20-32, 155, 249` | 개편 미완료(`대기` 상태) 2편에서 발견된 구조·서식 문제: `doe-09:193`과 `doe-10:249`의 `## 정리` 표 빈 셀; `doe-09` 2단분할법 수치 예제 및 독립 `## 비교` 절 부재; `doe-10` 1차 모형·최대경사법 예제 부재 및 155행 Scheffé 다항식 수식 `, \qquad + \sum...` 어색한 줄 연결 | 각 표 빈 셀 채우기, `doe-10:155` `\begin{aligned}` 2줄 분리, 예제 보강 여부 결정 |
| **P3** | `doe-07-confounding-fractional/index.md:251` | 오탈자: `삼각형형은 1, 2, 4열을 점으로 두고` | `삼각형은`으로 수정 |

---

### 3.4 시계열 분석 (`src/content/posts/time-series/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `ts-05-stochastic-process/index.md:138-142` | Bartlett ACF 분산 근사식 조건이 **"시차 $k$ 앞의 자기상관이 모두 0이면 ($\rho_j = 0,\; j < k$)"**로 부등호가 정반대로 적혀 있음 ($\rho_j=0, j<k$면 합 $\sum_{j=1}^{k-1}r_j^2$이 0이 됨). 실제 조건은 **시차 $k$ 이상이 0 ($\rho_j = 0,\; j \ge k$)**임 | `시차 $k$ 이상의 자기상관이 모두 0이면 ($\rho_j = 0,\; j \ge k$, 예: $k > q$인 MA($q$))`로 수정 |
| **P1** | `ts-09-forecasting/index.md:5, 71, 95` | (1) 5행 frontmatter `description`에 **"파이 가중치와 예측구간"**이라 적혀 있으나 본문에는 $\psi$-가중치(`ARMAtoMA`)만 있고 $\pi$-가중치는 전혀 없음. (2) 71행 가역성으로 $\epsilon_n$ 복원을 `(8편)`으로 참조했으나 가역성 설명은 **6편(`ts-06-arma`)**에 있음. (3) 95행에서 "출력의 둘째 줄처럼..."이라 했으나 앞 R 코드 블록에 출력 블록이 없음 | (1) `프사이($\psi$) 가중치와 예측구간`으로 수정. (2) `(6편, 8편)`으로 수정. (3) 출력 블록 추가 또는 문구 수정 |
| **P1** | `ts-06`, `ts-07`, `ts-10` 전반 | `ts-06`과 `ts-07`은 비계절 AR/MA 다항식을 대문자 $\Phi(B), \Theta(B)$로 쓰다가 `ts-10:77`에서 예고 없이 비계절을 소문자 $\phi_p(B), \theta_q(B)$로 바꾸고 $\Phi_P(B^s), \Theta_Q(B^s)$를 계절 연산자에 배정함 | `ts-10:77` 부근에 표기 전환 안내 추가 또는 시리즈 전체를 소문자(비계절)/대문자(계절)로 통일 |
| **P2** | `ts-09/index.md:18`, `ts-10/index.md:18` | `ts-01~08`은 `data_url`이 커밋 SHA(`172803ef...`)로 고정되어 있는데, `ts-09`·`ts-10`만 여전히 `master` 브랜치 URL 사용 | 커밋 SHA `172803efe88d52321e43a3533b2fd2d1eeb6a6e4`로 고정 |
| **P2** | `ts-08-model-fitting/index.md:158 vs 253` | 5절 `gas` 적합에서는 `include.mean = FALSE`를 명시해 놓고 8절 `ic_tab` 반복문(253행)에서는 기본값(`include.mean = TRUE`)으로 모형 적합해 절편 모수 1개가 달라짐 | 253행에도 `include.mean = FALSE` 적용 |
| **P3** | `ts-02`, `ts-03`, `ts-05`, `ts-07`, `ts-09`, `ts-10` | (1) `ts-02:39` 로지스틱 추세 행에 오차항 누락, `ts-02:62` $Z_{n+1} - \hat Z_n(l)$→$\hat Z_n(1)$, `ts-02:183` $2m$개(최대 $s-1$개) 짝수 $s$ 예외 설명 보완. (2) `ts-03:219-221` `\ell_n` vs `L_n` 혼용, `ts-03:260` R 부호 기준 `1 + \theta` 미표기. (3) `ts-05:78` `k >= 0` 조건 누락, `ts-05:262-266` `\varepsilon_t` vs `\epsilon_t`. (4) `ts-07:193` & `ts-08:88` 갑자기 $a_t$ 기호 등장 및 `ts-07:193` $\psi_i$가 MA($\infty$) 가중치와 기호 충돌. (5) `ts-09:145` $\hat\theta$ 모자 누락. (6) `ts-10:58-60` 표가 일반 $s$가 아닌 $s=12$ 기준임을 명시하고 `, 나머지 0` 보완, 150행 `$\hat\theta = -$`ma1` 수식 분리 어색함 | 각 기호·표기 통일 |

---

### 3.5 선형대수학 (`src/content/posts/linear-algebra/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `la-orthonormal/index.md:221-226` | 221행에 `$\operatorname{rank}(\mathbf{A}) = n$인 $m \times n$ 행렬에 대해`라고 전제해 놓고 226행 표에 `$m < n$` 행을 배치함 ($m < n$이면 $\operatorname{rank}(\mathbf{A}) \le m < n$이므로 모순; 226행은 **행계수 최대** $\operatorname{rank}(\mathbf{A}) = m$이어야 함) | 221행을 `최대 계수($\operatorname{rank}(\mathbf{A}) = \min(m, n)$)인 $m \times n$ 행렬`로 수정 |
| **P1** | `la-svd/index.md:30 vs 135`, `238` | (1) 30행에서 "소프트웨어의 `svd()`는 기본적으로 $\min(m, n)$개의 열만 돌려주는 간소한 형태다"라고 했으나, $\min(m, n)$개 열은 compact($r$)가 아니라 **thin SVD**이며, NumPy `np.linalg.svd()` 기본값은 `full_matrices=True`임(135행 주석과도 어긋남). (2) 238행 조건수 $\kappa(\mathbf{A}) = \sigma_1 / \sigma_n$은 $m < n$일 때 성립하지 않음($\sigma_{\min(m,n)}$이어야 함) | R `svd()`(thin)와 NumPy `np.linalg.svd()`(full 기본) 구분 명시, 조건수는 $\sigma_1 / \sigma_{\min(m,n)}$로 수정 |
| **P2** | `la-orthonormal/index.md:456` ↔ `dm-linear-regression/index.md:163` | `la-orthonormal`이 지렛값 진단 상세를 `dm-linear-regression`으로 링크하나, 정작 `dm-linear-regression`에는 `hatvalues()` R 코드가 없고 용어도 `지렛값` 대신 `레버리지`를 쓰며, 모수 표기도 $p$ vs $p+1$로 다름 | 링크 문구 조정 또는 `dm-linear-regression`에 `hatvalues()` 짧은 설명 추가 |
| **P3** | `la-determinant/index.md:310-311` | 본문 끝(`일치한다.`)과 `## 6. 행렬식의 기하학적 의미` 사이에 빈 줄이 없음 | 빈 줄 1줄 추가 |

---

### 3.6 미시경제학 (`src/content/posts/microeconomics/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `micro-competitive-market-analysis/index.md:208` | 장기 시장 사례에서 **"(그림의 A는 가격 20,000 아래 16,000단위, C는 ... B는 ... D는 ...)"**라고 그림을 지칭하지만 **해당 절에 그림이 없음**. 또한 소비자잉여 변화가 $A - B$라고 하면서 바로 뒤에서 병원·중개인이 $A + D$ 일부를 가져간다고 서술해 수혜자 순변화와 모순 | 그림(SVG) 추가 또는 "그림의 A~D" 참조 제거 후 구간별 수치로 명확히 서술, 이상적 $P=0$ 경우($A-B$)와 중개 지대 흡수 구분 |
| **P1** | `micro-factor-market/index.md:138, 154` | 쌍방독점($MRP_L = 100 - L$, $w = 10 + L$)에서 **고용량 $L = 30$, 총잉여 $1,800$, DWL $225$는 극단값($w=40$ 또는 $w=70$)일 때만 성립**하는데, 138행에 "고용은 30 근처다", 154행 표에 `약 30`, `약 1,800`, `약 225`라고 적어 바로 다음 문장("경쟁 결과에 가까워질 수도 있다") 및 수학과 모순 | 고용 `30~45`, 총잉여 `1,800~2,025`, DWL `0~225` 범위로 수정 |
| **P1** | `micro-monopolistic-competition-oligopoly/index.md:130` | 바로 앞 5절과 보수표(132~135행)는 모두 차별화 **베르트랑 가격 경쟁**($P=4$ vs $P=6$)인데, 130행에 **"왜 쿠르노 결과가 나오는가?"**라고 잘못 지칭 | `왜 비협조 균형(경쟁 가격 $P=4$)이 나오는가?` (또는 베르트랑 균형)로 수정 |
| **P1** | `micro-game-theory/index.md:125-134` | **맞대응(tit-for-tat)** 전략 설명에서 **"한 번 배신: ... 다음 기부터 상대가 저가로 보복해 매기 12(-4씩)"**라고 적었으나, 맞대응에서 1회만 배신하고 복귀하면 상대도 1기만 보복하므로 영구 손실(-4씩/기)이 발생하지 않음. 영구 손실 식 $4 \le 4/r$은 상대가 **방아쇠(grim trigger)**를 쓰거나 배신자가 계속 저가를 유지할 때 성립(또한 `대략`이 아니라 정확한 등비급수 합) | 1회 보복(맞대응)과 영구 보복(방아쇠/지속 배신) 구분하고 `대략` 삭제 |
| **P1** | `micro-pricing-market-power/index.md:138-146` | 혼합 묶음판매 표의 두 번째 열(`한계비용 0`)이 138행의 유보가격(`B(50,50), C(60,40)`)이 아니라 **146행에 가서야 뒤늦게 공개되는 다른 자료(`B(40,80), C(80,40)`)**로 계산되어 있어, 순서대로 읽으면 표 숫자가 틀린 것처럼 보임 | 두 번째 자료의 유보가격을 표 앞(138행 부근 또는 열 머리)으로 이동 |
| **P1** | `micro-monopoly-market-power/index.md:144` | 한계비용이 일정한 예제($MC = AC = 20$)에서 가격상한 $\bar P < 20$일 때 결과를 `공급 감소`라고 적었으나, 일정한 $MC$ 아래에서는 전 구간 손실이므로 공급량이 **0(조업중단)**이 됨 | `공급이 0이 됨(조업중단), 초과수요`로 수정 |
| **P2** | `micro-overview/index.md:108` | `1원당 한계값 균등` 행에 `$MR_1 = MR_2$`를 함께 넣었으나, 3급 가격차별의 $MR_1 = MR_2$는 "1원당"으로 나눈 조건이 아님 | 원리 이름을 `한계값 균등 (또는 1원당 한계값 균등)`으로 조정하거나 분리 |
| **P2** | `micro-cost/index.md:184` | 4절 개념인 규모의 경제 지수 `SCI = 1 - E_C`가 5절(`범위의 경제와 학습곡선`) 한가운데(`SC` 바로 아래)에 잘못 끼어들어 있음 | 4절(159행 뒤)로 이동 |
| **P2** | `micro-consumer-behavior/index.md:51` | "아래 그림의 무차별곡선은... $XY = 150$"라고 했으나 바로 아래 그림 3개는 다른 수치이고 해당 그림(`fig-mi-indifference`)은 115행(5절)에 있음 | "5절 효용극대화 그림의..."로 명시 |
| **P3** | `micro-consumer-behavior:182`, `micro-perfect-competition:54`, `micro-competitive-market-analysis:202`, `micro-supply-demand:10`, `micro-individual-market-demand:204`, `micro-pricing-market-power:36`, `micro-factor-market:124`, `micro-general-equilibrium-efficiency:58-59`, `micro-externalities-public-goods:62` | 반올림 대입 미세 오차($12.25$ 대신 $\sqrt{150}$, `42.67` vs `88`, `=` vs `\approx`), `1~5절` 범위 한정 필요, `fig-mi-network.svg` 축 눈금(20,15,40,50,60) 생략, 초록 삼각형 "들" 복수 표기, `55 이하`→`55 미만`, 후생경제학 1·2정리 표 가정 생략, `MSC` 약어 중복(한계사회비용 vs 한계사회피해) | 각각 문구·표기 정교화 |

---

### 3.7 딥러닝 (`src/content/posts/deep-learning/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P0** | `dl-02-gradient-descent/index.md:251` | 표 헤더의 `$|1 - 2\alpha \cdot 121.39|$` 안 `|` 2개가 GFM 열 구분자로 인식되어 5열 vs 구분선 3열 불일치로 **표 전체(251~257행)가 HTML에서 원문 `|---|---|---|` 그대로 깨져 출력됨** | `$\lvert 1 - 2\alpha \cdot 121.39\rvert$`로 변경 |
| **P0** | `dl-03-output-loss/index.md:42` | 표의 `$|u| > 4$` 안 `|` 때문에 열이 분리되어 **HTML에서 두 번째 열이 `$`만 남고 뒤 문장이 잘려 사라짐** | `$\lvert u\rvert > 4$`로 변경 |
| **P0** | `dl-02-gradient-descent/index.md:41` | `torch.concat([torch.ones(100, 1), x], axis=1)` — PyTorch는 `axis=` 인자를 받지 않고 **`dim=1`**만 지원 (`TypeError` 발생) | `axis=1` → `dim=1` |
| **P0** | `dl-08-transfer-cam/index.md:109-110` | `Learner(dls, net, metrics=accuracy)`에 **`splitter`를 주지 않아** `fine_tune(3)`의 1단계 동결(`freeze()`)이 `net1`을 동결하지 못함(본문의 "머리만 학습" 설명과 모순) | `splitter=default_split` (또는 2그룹 splitter) 지정 |
| **P0** | `dl-11-lstm/index.md:69-76` | 루프 코드에서 `T`, `h`, `c`가 초기화되지 않아 단독 실행 시 `NameError` 발생 | 루프 앞에 `T = x.shape[0]; h = c = torch.zeros(x.shape[1], 16)` 추가 |
| **P1** | `dl-03-output-loss/index.md:175` | 위 코드(159~162행)는 5행 전체에 `CrossEntropyLoss()`(`reduction='mean'` 기본)를 적용해 실제 첫 행 기울기가 `1/5`인 `(0.0213, 0.0213, -0.0426)`인데, 본문은 `(0.107, 0.107, -0.213)`으로 기술 | 1행 손실 또는 `reduction='sum'` 기준 기울기임을 명시 |
| **P1** | `dl-04-mlp-universal/index.md:102` | 가중치·편향 표에서 $x < 0$ 구간 절편 계산 시 `(-4.315)(-0.062) = +0.268` 항을 누락해 `14.06x + 5.04`가 아닌 `14.06x + 4.78`로 오기 | `14.06x + 4.78` → `14.06x + 5.04` |
| **P1** | `dl-09-embedding-recsys/index.md:60` | 정규화 항 `+\lambda(\|\mathbf p_u\|^2 + \|\mathbf q_i\|^2)`의 인덱스 `u, i`가 앞의 $\sum_{(u,i)\in\Omega}$ 밖에 있어 자유 변수로 남음 | `\lambda(\sum_u \|\mathbf p_u\|^2 + \sum_i \|\mathbf q_i\|^2)` 또는 프로베니우스 노름으로 수정 |
| **P1** | `dl-10-rnn/index.md:115` | 행벡터 규약($\mathbf h_s = \tanh(\dots + \mathbf h_{s-1}\mathbf W_{hh})$)에서 야코비안 곱 순서와 곱셈 방향이 뒤바뀜: `diag(1 - h_s^2)`가 $\mathbf W_{hh}^\top$ 앞에 와야 하고, $\prod$도 $s = T$에서 $T-k+1$ 역순이어야 함 | $\frac{\partial\mathbf h_s}{\partial\mathbf h_{s-1}} = \text{diag}(1-\mathbf h_s^2)\mathbf W_{hh}^\top$ 및 역순 곱으로 정정 |
| **P3** | `dl-06:155`, `dl-08:143`, `dl-10:74 vs 82` | `weight_decay=λ`의 $1/2$ 계수 차이, `net2[0](why)`의 4차원 텐서 모양 `(1,2,1,1)`, `RNNCell` 루프의 손실 합산(`loss / T` 누락) | 필요 시 보완 주석 추가 |

---

### 3.8 확률과정론 (`src/content/posts/stochastic-process/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P0** | `sp-04-markov-chain-stationary/index.md:155` | 표 안 `$|\lambda_2|$`의 `|`가 GFM 열 구분자로 파싱되어 2열 표가 깨짐 | `$\lvert\lambda_2\rvert$`로 수정 |
| **P0** | `sp-12-rl-lunarlander/index.md:59, 162` | (1) 59행 비교 표에서 `q_net(s').max(1)`은 `(values, indices)` namedtuple을 반환해 스칼라 곱 시 `TypeError`가 나며, `keepdim=True`도 빠져 `(B,1)` vs `(B,)` 브로드캐스팅 버그 소지. (2) 162행 `(~D)`는 `D`가 `float`면 에러, `int64`면 `~0 = -1`, `~1 = -2`로 오동작 | (1) `q_net(s_next).max(1, keepdim=True)[0]`로 수정. (2) `(1 - D)` 또는 `(~D.bool())` 사용 |
| **P1** | `sp-02-sigma-field-random-variable/index.md:93` | 표 예시에 아무 단서 없이 **`사건 A, B에 대해 P(B | A) = P(B)`**라고 적어 일반 사건에 대해 거짓인 등식을 참처럼 표기 | "독립인 사건 $A, B$에 대해..." 또는 $P(B \mid A)$ 형태로 수정 |
| **P1** | `sp-06-limit-distributions/index.md:54` | `($\mathbf P^t \to \boldsymbol\pi^\top$)` — $N\times N$ 행렬과 $1\times N$ 행벡터의 차원 불일치 | `$\boldsymbol\mu^\top\mathbf P^t \to \boldsymbol\pi^\top$` 또는 `$\mathbf P^t \to \mathbf 1\boldsymbol\pi^\top$` |
| **P1** | `sp-07-recurrence/index.md:122` | 일시적 상태($p=0.55$)의 기댓값 $E_0[T_0]$를 "정의되지 않음"이라고 표기했으나, 확장 확률변수 $T_0 \in \mathbb N \cup \{\infty\}$의 기댓값은 잘 정의되며 값은 **$\infty$**임 | `$\infty$ (10%는 돌아오지 않음)`으로 수정 |
| **P2** | `sp-08-mcmc-intro/index.md:162` | 연속상태 메트로폴리스 상세 균형을 순수 밀도 등식 $f(x)p(x,x') = f(x')p(x',x)$로만 서술 (거절 시 $x'=x$에 점질량 원자 존재) | `$x \ne x'$일 때 밀도 등식이 성립`으로 보완 |
| **P3** | `sp-03:78`, `sp-05:209`, `sp-11:120` | `sp-03` 이웃 상관계수 `0.875`는 정상상태 극한값(초기 $t=1,2$에서는 약 `0.659`), `sp-05` `α가 수렴 속도의 상한`→`$|\lambda_2|$의 상한`, `sp-11` `q^*` vs `q^\star` 표기 혼용 | 미세 표현 정교화 |

---

### 3.9 데이터 시각화 (`src/content/posts/data-visualization/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `dv-11-pandas-plot-plotly/index.md:130-212` | `public/charts/dv/dv11-area.html` 파일이 존재하지만 글 어디에도 임베드되어 있지 않음(matplotlib `dv11-10.png`만 있음) | `## 2. backend='plotly'`에 `dv11-area.html` iframe 추가 또는 미사용 파일 삭제 |
| **P1** | `dv-04-scatter-correlation/index.md:25-28` | `plt.plot(x, y, 'o')` 코드 바로 아래에서 **"아래 왼쪽 그림처럼..."**이라 지칭했으나, 실제 그림(`dv04-01.png`)은 38줄 뒤 2절(66행)에 있음 | 1절 그림 위치 조정 또는 "(2절 왼쪽 그림처럼)"으로 문구 수정 |
| **P1** | `dv-05-kde-qqplot/index.md:102` | `probplot` OLS 회귀직선의 기울기(`1.43`)를 "표본의 표준편차(`1.42`)와 같다"고 서술 (92행에서는 "추정값이 된다"고 맞게 씀) | "표본의 표준편차(1.42), 평균(1.91)에 가깝다(추정값이다)"로 수정 |
| **P1** | `dv-12-folium-map/index.md:73` | `HeatMapWithTime` 입력 모양이 항상 `(프레임 수) × (점의 수) × 2`라고 단정했으나, 바로 뒤 지진 예제(104행)는 `[위도, 경도, 가중치]` 길이 3과 프레임별 가변 개수를 사용 | 랜덤워크 예제의 모양임을 한정하고, 일반 입력은 가중치(3열)·가변 길이 가능 명시 |
| **P2** | `dv-03`, `dv-06`, `dv-10`, `dv-11` | `published` 날짜가 `seriesOrder`와 역전됨 (`dv-03`: 09-27 > `dv-04`: 09-13; `dv-06`: 11-16 > `dv-07~10`; `dv-10`: 10-18 < `dv-08,09`; `dv-11`: 11-29 > `dv-12`: 11-24). 특히 `dv-10`은 `9편`을 선행 참조함 | `published` 날짜를 `seriesOrder` 1~12 순으로 단조 증가하게 조정 |
| **P3** | `dv-03:25-29, 169-171`, `dv-08:173-227` | (1) `dv-03` 한 코드블록의 두 `plt.plot`이 `dv03-01.png`에서는 좌우 서브플롯으로 그려짐(주석 보완). (2) `dv-03`과 `dv-06`의 10명 예시 표에서 인덱스 4·5 성별 라벨 뒤바뀜. (3) `dv-08` `16,710명` 중 `6,362 + 10,346 = 16,708명`(나머지 2명 `0 < Potential2 <= 0.1` 미언급), `f2['Q']` 슬라이스 대입 시 `SettingWithCopyWarning` 가능 | 주석·수치 설명 보완 |

---

### 3.10 기계학습 활용 (`src/content/posts/machine-learning/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P1** | `ml-05-ridge-lasso/index.md:82` | `1.28 / 272`를 `0.0037`로 오기 (`1.28 / 272 = 0.0047058... ≈ 0.0047`, `0.0037`은 `1.0 / 272`) | `0.0037` → `0.0047` |
| **P1** | `ml-06-outlier-interaction/index.md:129` | 바로 위 99행에서 2×2 칸이 4개라 4개 모수(`절편 + 운동 + 약 + 운동×약`)로 각 칸 평균을 그대로 맞힌다고 해놓고, 129행에서는 **"운동은 안 하고 약만 먹으면 부작용처럼 특정 칸에만 생기는 효과는 곱 항 하나로 표현되지 않아 4수준 원핫 인코딩해야 한다"**고 모순된 주장(3수준 이상 다수준 범주형에만 해당) | 3수준 이상 범주형이나 연속형 예시로 교체 |
| **P1** | `ml-04-overfitting-collinearity/index.md:93` | (1) `LinearRegression` 기본값이 절편 포함(`fit_intercept=True`)이라 미지수는 $p+1$개이므로 $p=n=350$이 아니라 $p=n-1=349$에서 식과 미지수 수가 같아짐. (2) 시험 $R^2 = -82$를 "평균으로 찍는 것보다 82배 나쁘다"고 했으나, $R^2 = 1 - \text{MSE}/\text{MSE}_{\text{mean}}$이므로 $1 - (-82.2) \approx \mathbf{83}$배 나쁨 | 절편 포함 기준($p+1=n$, 즉 $p=349$)과 "약 83배"로 수정 |
| **P1** | `ml-05-ridge-lasso/index.md:123-130` | 앞 절에서 벌점 회귀에 표준화가 필수라고 강조한 직후, `LogisticRegressionCV(..., penalty='l1')`을 표준화 없이 원자료 `X`(`gpa` vs `toeic`)에 그대로 적합 | `make_pipeline(StandardScaler(), LogisticRegressionCV(...))`로 수정하거나 생략 사유 명시 |
| **P1** | `ml-11-timeseries/index.md:127, 131-136, 157` | 4개월 미래(`9~12월`)를 "진짜 미래 예측"이라고 평가하면서, 실제로는 시험 기간의 **실현된 기상 변수(`temp`, `hum`, `windspeed`, `weathersit`)**를 그대로 입력으로 넣고 "예보로 근사적으로 안다"고 정당화(기상 예보는 수일 단기만 가능하고 4개월 뒤 실제 날씨는 시점 $t$에 알 수 없음) | 4개월 전체 구간에 실측 날씨를 쓴 것은 이상적 조건 평가이며, 실전 장기 예측에서는 단기 예보 한계가 있음을 명시 |
| **P2** | `ml-03:119-129`, `ml-08:38, 124`, `ml-11:86-96` | (1) `ml-03` 표의 `합쳐서 fit` 행이 비어 있고 128행에서 예제가 `(1,2,3,4,5)`→`(1,2,3,4,3.5)`로 바뀜. (2) `ml-08:38` `X[s]`는 ndarray 전용(DataFrame이면 `.iloc[s]` 필요), 124행 5겹 CV $R^2$가 전체 1,338명인지 학습 936명인지 미표기. (3) `ml-11` WQL 표는 AutoGluon의 음수 부호를 다시 양수로 되돌려 적었으나 설명 누락 | 표 채우기·예제 일치·범위/부호 주석 추가 |

---

### 3.11 R for Data Science (`src/content/posts/r4ds/`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P0** | `r4ds-functions/index.md:282-283` | `histogram <- function(df, var, binwidth = NULL)`에서 `rlang::englue("{{ var }}의 분포 (binwidth = {binwidth})")`를 무조건 호출해, 기본값인 `binwidth = NULL`로 호출하면 **`Error in englue(): ! The glue string must be size 1, not 0.`** 런타임 에러 발생 | `= NULL` 기본값 제거 또는 `is.null(binwidth)` 분기 처리 |
| **P1** | `r4ds-modeling/index.md:43` | "`lm()`은 이 문제를 반복 탐색 없이 **정규방정식**으로 바로 푼다" — 사실 오류 (`lm()`은 수치 안정성을 위해 **QR 분해**를 사용) | `정규방정식` → `QR 분해` |
| **P2** | `r4ds-communication`, `r4ds-joins`, `r4ds-datetime` | `published` 날짜가 `seriesOrder`와 역전됨 (`communication`: `seriesOrder: 5`인데 `2022-07-08`로 `dplyr`(2)보다 이전이며 본문에서 `dplyr`을 이미 안다고 전제함; `joins`: `seriesOrder: 10`인데 `07-22`; `datetime`: `seriesOrder: 9`인데 `08-16`으로 `factor`(8, `08-19`)보다 이전) | `published` 날짜를 `seriesOrder` 순으로 단조 증가하게 조정 |
| **P2** | `r4ds-communication/index.md:96` | 바로 다음 글(`seriesOrder: 6`)은 `r4ds-logical-numbers`인데 `r4ds-string`(`seriesOrder: 7`)을 **"다음 [문자열 글]"**이라고 표현 | "뒤의 [문자열 글]"로 수정 |
| **P3** | `r4ds-functions:5, 113, 203`, `r4ds-logical-numbers:447`, `r4ds-iteration:182` | (1) `embrace`를 **`임보크`**(invoke)로 오기(3곳). (2) `case_when` 문제해결 표에 본문에서 다루지 않은 구식 `TRUE ~` 표기 남음(`.default =`로 통일 권장). (3) `reduce(full_join, by = "name")` → 2판 기준 `join_by(name)` 통일 권장 | 오탈자(`임브레이스`) 및 2판 문법 통일 |

---

### 3.12 단독 글 및 데이터 분석 환경 (`beauty`, `air-gapped-*`, `data-naming-*`, `portable-*`, `parquet-*`)

| 심각도 | 파일:줄 | 문제 및 현상 | 수정 방향 |
|---|---|---|---|
| **P0** | `beauty/index.md:143` | 문장이 **"여기서 복합성 피부란 T존 유분과 U존 건조함"**에서 동사·마침표 없이 중간에 잘려 있음 (또한 앞 문장의 "전체 약 15만건의 리뷰 데이터"도 실제 SQL은 `FROM profiles` 기준) | 문장 완성 및 "프로필 데이터" 정정 |
| **P0** | `air-gapped-analysis-environment/index.md:98`, `data-naming-standards/index.md:176` | Base R의 `fileEncoding = "UTF-8-BOM"`을 **저장(쓰기)**에도 쓰는 것처럼 서술했으나, 실제 R 실행 시 `write.csv(..., fileEncoding = "UTF-8-BOM")`는 `unsupported conversion from 'UTF-8-BOM' to ''` 에러로 실패함 (`read.csv` 읽기 전용) | Base R 쓰기 시 바이너리(`"wb"`) 연결로 BOM 바이트(`0xEF, 0xBB, 0xBF`) 선기록하거나 `readr::write_excel_csv()` / `data.table::fwrite(..., bom = TRUE)` 사용하도록 정정 |
| **P1** | `beauty/index.md:53, 107, 341-358` | (1) 53행 SQL `p.goods_id`가 DDL(67행)·ERD(`cosmetic_erd.svg`)의 **`goodsNumber`**와 다름. (2) 107행 테이블명 `oliveyoung_db.cream_keyword`가 명명 규칙(`keyword_*`, 46·223행·ERD의 `keyword_cream`)과 순서가 뒤바뀜. (3) 글 맨 끝 345~358행에 본문 132~141행 마크다운 표와 중복되는 **KaTeX `\begin{array}` 표가 덩그러니 남아 있음** | `p.goodsNumber`, `keyword_cream`으로 수정하고 끝부분 중복 `\begin{array}` 표 삭제 |
| **P1** | `beauty/index.md:2, 6, 10, 12, 339` | (1) 제목은 `화장품 트렌드 분석 프로젝트 1`, `series`와 12행은 `화장품 성분 분석 프로젝트`로 이름 불일치. (2) "1편"이자 339행에서 "다음 포스트에서는 실제 상품 리뷰 데이터를 수집하고..."라고 예고하나 2부가 없고, 이미 본문에 프로필 15만 건·`reviews` 쿼리가 있음. (3) 본문 첫 줄에 `# 프로젝트 목표`(H1) 중복, 전체 글 중 이 글만 `합니다체` 사용 | 단독 글 또는 시리즈 방향 결정 후 제목·문체(이다체)·H2(`##`)·결론 문구 정리 |
