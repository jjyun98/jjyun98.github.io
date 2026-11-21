# 블로그 전체 재구성 계획

작성일 2026-11-09, 기준 커밋 `3d034d2f`. 작업 세션은 이 파일에서 시작한다.

> **방향 변경 (2026-11-10):** 기준은 GitHub 버전(`origin/main` `53edf6ec`)이다. 먼저 [01-common-frame.md](01-common-frame.md)의 "0. 우선 원칙"을 읽는다. 아래 계획의 글 수, 목표 목차, 작업 순서는 이 원칙보다 뒤에 온다.

## 1. 계획 요약

**목표:** 블로그만 읽어도 각 과목을 한 번에 복습할 수 있게 한다. 교재 범위를 빠짐없이 담고, 모든 글을 **개념(수식과 글) → 비교 → 예시와 사용**의 틀로 정리한다.

| 시리즈 | 현재 | 계획 | 핵심 변화 |
|---|---|---|---|
| 데이터 마이닝 | 14 | **18** | ISLR 2~13장 전체. 딥러닝 2편, 생존 1편, PCR·PLS·고차원 1편 신규. BART, 행렬 완성, Tukey·Scheffé, 재표집 FDR 등 추가 |
| 시계열 | 10 | 10 | 중복 표 제거, KPSS와 비승법 모형 추가, 자료 URL 고정 |
| 수리통계학 | 0 | **14** | 신규(D3). Hogg 1~11장, 모든 R 블록 실행 확인. 주요 정리 증명 보강, Excalidraw 개념도 12장(`_tmp/excal/ms_figs.py`) |
| 실험계획법 | 10 | 10 | EMS 규칙 충돌 해결, 3수준과 2단분할 보강, 그림 추가 |
| 생명과학통계 | 12 | **13** | SAS 실제 출력, 진단 평가 분리, ANCOVA 순서 변경, 오류 수정 |
| 선형대수 | 8 | 8 | 코드를 개념 옆으로, 비교 표, 통계에서의 쓰임 추가 |
| 미시경제학 | 18 | 18 | 곡선 그림 대폭 추가, 게임이론 그림과 Wal-Mart 사례, 비교 표 정리 |
| R4DS | 10 | **17** | 책 순서로 변경, 2판 공백 7편 추가(우선순위 낮음) |
| 단독 | 2 | 2 | 문체와 컬럼명 정리 |
| **합계** | **84** | **110** | |

## 2. 파일 안내

| 파일 | 내용 | 언제 읽는가 |
|---|---|---|
| [01-common-frame.md](01-common-frame.md) | 글 틀, 규칙, 실행 환경, 완료 체크리스트 | **항상** |
| [02-data-mining.md](02-data-mining.md) | ISLR 대조표, 18편 계획 | DM 작업 |
| [03-time-series.md](03-time-series.md) | 10편 계획 | TS 작업 |
| [04-design-of-experiments.md](04-design-of-experiments.md) | 교재 대조표, EMS 해결 방침, 10편 계획 | DOE 작업 |
| [05-biostatistics.md](05-biostatistics.md) | SAS 출력 정책, 13편 계획 | Bio 작업 |
| [06-linear-algebra.md](06-linear-algebra.md) | 8편 계획 | LA 작업 |
| [07-microeconomics.md](07-microeconomics.md) | 18편 계획, 그림 목록 | Micro 작업 |
| [08-r4ds.md](08-r4ds.md) | 책 대조표, 17편 계획 | R4DS 작업 |
| [09-site-and-standalone.md](09-site-and-standalone.md) | `seriesOrder`, 모바일 표, 단독 글, 새 주제 후보 | WP-0, 단독 글 |
| [10-deep-learning.md](10-deep-learning.md) | 딥러닝 12편 설계 | DL 작업 |
| [11-data-visualization.md](11-data-visualization.md) | 데이터 시각화 12편 설계 | DV 작업 |
| [12-machine-learning.md](12-machine-learning.md) | 기계학습 활용 11편 설계 | ML 작업 |
| [13-mathematical-statistics.md](13-mathematical-statistics.md) | 수리통계학 14편 설계 (Hogg 8판) | MS 작업 |

## 3. 작업 순서와 권장 모델

틀을 먼저 검증한 뒤 시리즈로 확장한다. 한 세션에 작업 묶음 하나씩 진행한다.

| 단계 | 작업 묶음 | 내용 | 권장 모델 |
|---|---|---|---|
| 1 | **WP-0** | `seriesOrder`, 모바일 표, URL 고정 | Sonnet high |
| 2 | **WP-1** | 확정 오류 수정 (아래 표) | EMS는 Opus medium, 나머지 Sonnet high |
| 3 | **WP-2 파일럿** | `dm-resampling`(A형), `micro-game-theory`(B형 + 그림), `biostat-mean-comparison` 일부(SAS 출력) | Sonnet high |
| 4 | 사용자 검토 | 파일럿을 보고 틀 수정, `01` 갱신 | 사용자 |
| 5 | **DM-2~5, 8** | 기존 DM 개편 | Sonnet high |
| 6 | **DM-6, 7** | 신규: 신경망, 딥러닝, 생존 | 초안 Sonnet high, 개념 검토 Opus medium |
| 7 | **DOE-1~5** | 실험계획법 | Sonnet high. doe-04, doe-08만 검토 Opus medium |
| 8 | **BIO-1~6** | 생명과학통계 | Sonnet high |
| 9 | **TS-1~5** | 시계열 | Sonnet high |
| 10 | **LA-1~4** | 선형대수 | Sonnet high |
| 11 | **MI-1~7** | 미시경제학 | Sonnet high |
| 12 | **R4-1~3** | R4DS | Sonnet medium~high |
| 13 | 마무리 | 단독 글, About, 시리즈 간 링크 점검 | Sonnet medium |

**DM을 먼저 하는 이유:** 사용자가 지정한 기준 사례이며, 공백이 가장 크고 다른 시리즈에서 링크할 글이 생긴다.

### 세션 시작 문구

```text
docs/blog-replan/00-README.md, 01-common-frame.md, <시리즈 파일>을 읽고
작업 묶음 <이름>을 진행해줘. 글마다 먼저 원글을 끝까지 읽고, 계획의 목표 목차대로 고친 뒤
완료 체크리스트를 확인하고 현황판을 갱신해줘. 커밋은 하지 말고 끝나면 변경 요약을 보고해줘.
```

## 4. WP-1 확정 오류

구조 개편 전에 바로 고친다. 줄 번호는 `3d034d2f` 기준이다.

| # | 위치 | 문제 | 수정 | 판정 |
|---|---|---|---|---|
| 1 | `doe-04:50~64` vs `:20~25`, `:175~177` | 제약·비제약 EMS 규칙을 섞음 | `04` 파일 방침대로 두 모델을 구분하는 표 추가 | 확정 |
| 2 | `biostat-contingency:235` | Fisher 왼쪽 단측 0.262 오기. SAS 기본 정렬에서 오른쪽 0.262, 왼쪽 0.976 | `order=data`, 방향 명시 | R 재계산 |
| 3 | `dm-ensemble:22, :109` vs `:72` | "독립" 표현 충돌 | 상관된다고 통일 | 확정 |
| 4 | `biostat-survival:202~204` vs `:415` | SAS Wilcoxon(Gehan)과 R `rho=1`(Peto-Peto)을 같은 것처럼 씀 | 구분 표 | 확정 |
| 5 | `biostat-survival:236` | CP 13/19 | 14/19 | 확정 |
| 6 | `biostat-mean-comparison:49` vs `:594` | 사전검정 절차와 Welch 기본 결론 충돌 | Welch 기본 | 확정 |
| 7 | `dm-multiple-testing:88` | "같은 설정"이지만 t와 z로 다름 | 설정 명시 또는 통일 | 확정 |
| 8 | `biostat-hypothesis:202` vs `:307` | LR과 Score 결론 충돌 | 모의실험 기준 통일 | 확정 |
| 9 | `biostat-hypothesis:220` | 기본 구간 설명 | Wald 명시 | 사소 |
| 10 | `biostat-contingency:268` vs `:284~289` | McNemar 방향 | 정의 통일 | 사소 |
| 11 | `ts-07:200` | `ndiffs`, `nsdiffs` 기본값 | 정확히 적고 명시 | 사소 |
| 12 | `r4ds-modeling:28` | RMSE 문구 | 식과 맞춤 | 사소 |
| 13 | `dm-regularization:220` | `Walks` 0.54, `HmRun` 설명 | 출력 확인 후 수정 | 사소 |
| 14 | `dm-ensemble` 표 | 부스팅 전체 자료 vs `bag.fraction=0.5` | 구분 | 사소 |
| 15 | `dm-pca` | $1/n$과 $1/(n-1)$ | 명시 | 사소 |
| 16 | `ts-06:244` | $\phi(B)$와 $\Phi(B)$ | 표기 수정 | 사소 |
| — | `biostat-mean-comparison:68~71` | 칼슘 집단 뒤바뀜 의심 | **교재 확인 전 수정 금지** (D7) | 미확정 |

**처리 결과(2026-11-11):** 1 EMS 비교 표, 2 `order=data`와 단측 방향, 4 Gehan과 Peto-Peto 구분, 5 14/19, 6 Welch 기본, 9 Wald 구간 명시, 10 McNemar 표 머리를 SAS 자료(행 = 결혼 전)에 맞춤, 11 `ndiffs`의 KPSS 기본과 `nsdiffs`의 `seas` 기본, 12 RMSE 문구, 16 $\Phi(B)$, $\Theta(B)$. 8번은 충돌한 모의실험이 빠지면서 해소됐다.

**모의실험 과잉 해석**(`dm-ensemble:213`, `dm-regularization:285, :355, :360`, `dm-resampling:28, :217, :342`)은 각 글 개편 때 처리한다. 다만 오해가 큰 `dm-ensemble:213`과 `dm-resampling:28, :342`는 WP-1에서 먼저 표현을 낮춘다.

**전체 글 정독 범위:** 사전 분석에서 84편 중 24편을 정독했고 60편은 지표와 키워드로 검사했다. 위 표는 확인된 오류만이다. 나머지 글을 고칠 때 추가 오류를 찾으면 이 표에 더한다.

## 5. 시리즈 간 연결

같은 주제를 여러 시리즈가 다룬다. 시리즈마다 복습이 가능하도록 핵심 식은 각 글에 두되, 깊은 설명은 담당 글에 두고 링크한다.

| 주제 | 담당 글 (깊이) | 사용 글 (적용) |
|---|---|---|
| 최소제곱, 사영 | `la-orthonormal` | `dm-linear-regression`, `ts-02`, `biostat-correlation-regression` |
| 회귀 진단 | `dm-linear-regression` | `biostat-correlation-regression`, `doe-02` |
| 로지스틱, 오즈비 | 이론·분류 `dm-logistic-regression`, 임상 해석 `biostat-logistic-regression` | |
| 포아송, GLM | `biostat-poisson-glm` | `dm-logistic-regression` |
| 생존분석 | 절차·임상 `biostat-survival-analysis`, 벌점·예측 `dm-survival` | `biostat-sample-size` |
| 다중비교 | 이론 `dm-multiple-testing`, 실험 `doe-02` | `biostat-mean-comparison` |
| ANOVA | `doe-02`, `doe-03` | `biostat-mean-comparison`, `biostat-ancova` |
| 분할법, 혼합모형 | `doe-09`, `doe-04` | `biostat-repeated-measures` |
| PCA, SVD | 수학 `la-svd`, 통계 `dm-pca` | `dm-pcr-pls-high-dim` |
| 자기상관 | `ts-05` | `dm-linear-regression`의 오차항 상관 |
| 부트스트랩 | `dm-resampling` | `dm-ensemble` |
| ROC, AUC | 평가 `biostat-diagnostic-test`, 분류기 `dm-classification` | `dm-svm`, `dm-survival` |
| 게임의 내쉬균형 | `micro-game-theory` | `micro-monopolistic-competition-oligopoly` |

## 6. 사용자 결정 사항

**기본값으로 작업을 진행할 수 있다.** 다르게 하고 싶은 항목만 바꾸면 된다.

| # | 결정 | 기본값 |
|---|---|---|
| D1 | ISLR 10장 실행 범위 | `torch` 설치를 시도. 안 되면 신경망은 `nnet`과 base R로, CNN·RNN은 원리 계산 + `norun` + ISLR 수치 인용 |
| D2 | SAS 출력 | 사용자가 SAS OnDemand에서 실행한 결과를 사용. 그 전까지 R 확인값으로 표시. SAS 출력을 만들어 쓰지 않음 |
| D3 | 새 주제(수리통계, 회귀, 금융) | 수리통계는 사용자 요청으로 진행(2026-11-22): Hogg·McKean·Craig 8판 기반 14편, 계획은 [13-mathematical-statistics.md](13-mathematical-statistics.md). 회귀, 금융은 재논의 |
| D4 | R4DS 신규 7편 | 포함하되 가장 뒤로. 전부 또는 일부 빼도 다른 작업에 영향 없음 |
| D5 | 시계열 교재명 | 사용자가 가진 책의 정확한 제목으로 통일. 확인 전까지 그대로 |
| D6 | 교재 목차 (생명과학통계, 선형대수, 시계열) | 강의 자료로 대조. 목차를 주면 대조표 추가 |
| D7 | `mean-comparison` 칼슘 자료 | 사용자가 교재를 확인할 때까지 수정 보류 |
| D8 | 홈 시리즈 순서 | 현재처럼 최근 순 유지 |
| D9 | About의 Airflow, Lambda | 사용자가 직접 결정. 내용을 임의로 쓰지 않음 |
| D10 | `beauty` 2부 | 문체와 오류만 정리. 2부 작성은 보류 |

## 7. 현황판

상태: `대기`, `진행`, `검토`, `완료`.

| 작업 묶음 | 글 | 상태 | 비고 |
|---|---|---|---|
| WP-0 | 사이트 공통 | 진행 | `seriesOrder` 완료(스키마, 정렬, 데이터 마이닝 14편 번호). 생명과학통계, 실험계획법, 선형대수학, 미시경제학, 시계열 분석 59편에도 발행일 순서대로 번호를 붙였다(2026-11-21). 모바일 표(rehype 래퍼)와 시계열 자료 URL은 이전에 처리되어 있었다. 데이터 시각화·딥러닝 글의 raw URL 13곳을 커밋 SHA로 고정했다. README는 갱신됨. About의 D5(교재명)·D9(Airflow·Lambda)는 사용자 결정 대기 |
| WP-1 | 확정 오류 | 완료 | 16건 중 15건 처리(2026-11-11). `doe-04`는 비제약(교재)과 제약(강의) EMS를 나란히 비교하는 표로 고쳤다. 7, 13번은 해당 문장이 GitHub 기준 정리에서 빠져 해소됐다. 칼슘 자료(D7)만 보류. 사용자 검토 완료(2026-11-14) |
| WP-2 | 파일럿 3편 | 중단 | 번호 구조 파일럿은 폐기했다. `dm-resampling`은 GitHub 글 기준으로 되돌렸다 |
| DM 기존 14편 | GitHub 기준 정리 | 완료 | 8편은 GitHub 글로 되돌린 뒤 빠진 내용만 더했고, 6편은 덧붙인 절을 줄였다. 사용자 검토 완료(2026-11-14) |
| DM 신규 | neural-network, deep-learning, survival | 검토 | ISLR 10, 11장. 3편 작성 완료(2026-11-14), `draft: false`, 커밋됨. torch·luz는 renv(`_tmp/r4ds`)에 설치해 Hitters 신경망과 NYSE RNN을 실제로 학습했다. IMDb, MNIST, CIFAR 수치는 ISLR 인용. 개념 그림 SVG 4장은 Excalidraw 도구가 없어 같은 색으로 직접 그렸다. 콜센터 자료는 `coxed` 대신 base R 모의. `pcr-pls-high-dim`은 만들지 않고 `dm-regularization` 안에 둔다(seriesOrder 7은 비어 있음) |
| DOE-1 | 01, 02 | 검토 | doe-01에 일표본 예시, Welch 기본 권고, 대응 차이 Q-Q 예시. doe-02에 대비 수치 예시, 변량모형 코드와 비교 표, Dunnett(교재 밖) 행. 기존 숫자는 로그와 일치(2026-11-14) |
| DOE-2 | 03, 04 | 검토 | doe-03 풀링 기준을 교재대로(Montgomery p≥0.25), 수준별 구간·교락 식·교호작용 패턴 SVG·비교 절. doe-04 법칙 5~7과 부록 4A, 제약·비제약 SVG, 4원배치 풀링 재현, 교재 표 4.16 분산성분 14.488 → 13.63 정정, 한글 행 이름 때문에 근사 F가 실행되지 않던 코드 버그 수정(2026-11-14) |
| DOE-3 | 05, 06 | 검토 | 05는 그래코·Youden 식·자유도·예제, 교재 예제 5.2, 5.3, 5.8 R 재현, 라틴방격 최적조건 80.64로, 그래코 존재 조건 p≥4로 수정. 06은 2³ 예제, Yates, 단계적 풀링, 비교 절. 교재 오류 3건(표 5.18 EMS 계수, 예제 5.6 점추정, 표 5.17 인쇄) 주의 표시(2026-11-14) |
| DOE-4 | 07, 08 | 검토 | 07은 블록·반실시 입방체 SVG, L8 선점도 SVG, 표 6.7에서 정의대비 복원, 예제 6.3, 6.5 재현, 2⁵⁻² 별칭. 08은 3² 단일·3³ 이중 교락, 3³⁻¹ 별칭, L9·L27·가수준·L18, 성분 곱 mod 3 함수로 별칭 검증. 교재 오류 4건 주의 표시(6.1 블록 제곱합, 6.3 최적조건 45.03 → 42.03, 7.1 MSE, 7.2 배치 불가)(2026-11-14) |
| DOE-5 | 09, 10 | 완료 | 09: 교재 예제 8.3(1차 단위 인자 둘), 8.4(분할되지 않는 인자), 8.5(2단분할, L16) 추가, 2단분할 그림. 10: α를 F^{1/4}로, Box-Behnken 예제(정상점이 영역 밖) 추가 (2026-11-21) |
| BIO-1 | sas-basics, study-design | 검토 | PDV 그림과 비교 절 추가. 출력은 `mower`·`bweight`의 R 확인값, `sashelp` 예제는 출력 표 안내만. study-design은 비교·요약 표 통합과 이항분포 계산 1개. `Visit` 설명 오류 수정. SAS 실제 출력 반영은 대기(2026-11-14) |
| BIO-2 | hypothesis, mean-comparison | 검토 | hypothesis는 세 검정 비교를 9절로 합치고 자료형을 뒤로, 소표본 예시(n=10, x=1). mean-comparison은 Welch 식과 R 확인값, 짝지은·독립 대비, Tukey. D7 보류, SAS 실제 출력 대기(2026-11-14) |
| BIO-3 | contingency, diagnostic-test | 검토 | 진단 평가를 새 글 `biostat-diagnostic-test`로 분리(PPV 곡선, 이론 ROC 그림, 카파). contingency는 R 확인값 추가, 빠진 `library(tidyverse)` 보충. `sashelp.heart` ROC 수치와 SAS 실제 출력 대기(2026-11-14) |
| BIO-4 | correlation-regression, ancova | 검토 | correlation-regression은 비교 절 하나로, 식 보강, `women`·`mtcars` 예시(공선성·영향점), 사영·진단은 링크. ancova는 `published`를 `2026-05-25T18:00:00`으로 바꿔 순서 변경, 예제 5.1~5.3 R 확인값, 5.2 줄 수 설명 오류 수정(2026-11-14) |
| BIO-5 | logistic, poisson | 완료 | SAS 결과 자리에 R로 확인한 값 표, 로짓·비례오즈·포아송 그림, 편차·Pearson 식 (2026-11-21) |
| BIO-6 | repeated, survival, sample-size | 완료 | 반복측정: EMS, 구형성, LMM 공분산 구조 비교, GEE. 생존: 가중 검정 표, Cox 표, cox.zph. 표본크기: 일반 Schoenfeld 식, 비열등성 식, R 확인값 (2026-11-21) |
| TS-1 | ts-01, ts-02 | 검토 | ts-01 가법·승법, RMSE와 척도 비교. ts-02 예측오차 분산·구간, 진폭·위상, 지시함수 대 삼각함수 비교 절. 자료 URL을 SHA `172803ef`로 고정. 책 제목 D5 미결(2026-11-14) |
| TS-2 | ts-03, ts-04 | 검토 | URL SHA 고정. ts-03 Brown과 Holt를 나누고 변환 관계를 수치로 확인(둘 다 ARIMA(0,2,2)로 묶은 표기 수정). ts-04 계절지수 정규화 조건, 계절 성분 차이를 숫자로, X-11 소개(2026-11-14) |
| TS-3 | ts-05, ts-06 | 검토 | ts-05에 Bartlett 표준오차, Ljung-Box 식과 네 자료 검정 예시, ACF·PACF 비교표, URL SHA 고정. ts-06은 4회 반복된 ACF/PACF 표를 하나로, AR(p)·MA(q)·ARMA(p,q) 일반식과 수치 예, 비교표의 ARMA 문구 수정(2026-11-14) |
| TS-4 | ts-07, ts-08 | 검토 | ts-07에 ADF 회귀식, KPSS와 ADF·KPSS 조합 표. ts-08은 추정 방법 표를 하나로, ts-05·ts-06으로 링크, `auto.arima` 기본값 명시. URL SHA 고정(2026-11-14) |
| TS-5 | ts-09, ts-10 | 완료 | ts-09: 추세정상 열, 네 모형 예측 그림. ts-10: 승법 모형의 다른 패턴과 비승법 모형, `fixed=`, 다루지 않는 주제 (2026-11-21) |
| LA-1 | la-vector-matrix, la-gauss-lu | 검토 | 노름·코시-슈바르츠·대각합·콜레스키·정규방정식 예시 추가, 코드를 소절 옆으로, 비교 절 정리, `PA=LU`와 `A=PLU` 구분(2026-11-14) |
| LA-2 | la-determinant, la-vector-space | 검토 | 코드를 소절 옆으로, 비교 절 1회, 통계 쓰임(공선성, 일반화 분산, 야코비안, QDA, 자유도, 추정 가능 대비). Python 블록은 미실행(2026-11-14) → Python 블록 6개를 venv(`_tmp/pyla`)에서 실행, 주석 값과 일치(2026-11-22). |
| LA-3 | la-orthonormal, la-linear-map | 검토 | orthonormal은 수치 안정성(조건수 제곱), 7절 회귀의 사영 해석(hat 행렬, 지렛값, `lm`의 QR, 직교다항식), 비교표. linear-map은 공분산 변환, PCA 점수 = 등장 좌표변환, 불변량. R·Python 모두 실행(2026-11-14) |
| LA-4 | la-eigen, la-svd | 검토 | eigen은 통계 쓰임(마할라노비스, AR 동반행렬, 마르코프)과 분해 비교, 거듭제곱법 과장 문구 수정. svd는 간소·완전 SVD, 에카르트-영, 유사역행렬(최소노름), 조건수 제곱, 릿지 축소, PCA 통계 해석은 `dm-pca`로. R·Python 모두 실행(2026-11-14) |
| MI-1 | overview, supply-demand | 검토 | overview의 과점 잉여 수치표를 정성 설명으로 줄임(수치는 oligopoly 글). supply-demand에 탄력성 4종 비교 표. 숫자 재계산 일치, 강의 시트 항목 대조는 못 함(2026-11-14) → C02 대조(2026-11-22): 기대가격, 가격 상한(초과수요 20), 브라질 커피 단기·중기·장기 보충. |
| MI-2 | consumer-behavior, individual-market-demand, uncertainty | 검토 | 내부해·구석해, 힉스·슬러츠키, 마셜·힉스 수요, 밴드왜건·스놉·과시, 분산투자·보험·정보, 기대효용·전망이론 비교표. 생계비 지수 수치 예, 정보 가치 예제 설정(C05 대조), 과시효과 추가. `fig-mi-network.svg` 숫자 미확인(2026-11-14) → `fig-mi-network` 기하 확인: 시장수요 점이 D20~D80 위 Q=20~80, 40→50→60 일치(2026-11-22). |
| MI-3 | production, cost, perfect-competition | 검토 | 세 글에 비교 절. cost에 비용함수 형태와 규모·범위·학습 비교표, 범위의 경제 해석 문구 수정. perfect-competition에 공급탄력성과 단기·장기 비교. LAC 포락선 그림 수치 미확인(2026-11-14) → LAC 포락선 확인: SAC가 q≈6, 15, 24에서 접하고 SAC1 최저점은 접점 오른쪽, SAC3은 왼쪽(2026-11-22). |
| MI-4 | competitive-market-analysis, monopoly, pricing | 검토 | 정책 8개, 완전경쟁·독점·수요독점, 가격전략 8개 비교표. C09, C10 대조로 큰 나라 관세, 신장 시장 수치, 수요독점력 지수, 수익률 규제식 추가. 이부가격제 "둘 다 참여" 전제 명시(소비자 1만 상대하면 이윤 3,200). C11, 그림 내부 수치 미확인(2026-11-14) → C11 대조와 가격전략 그림 5장 수치 재계산 일치. 강의 자료의 혼합 묶어팔기 222.90은 229.9의 오기로 보여 주의 표시(2026-11-22). |
| MI-5~7 | 7편 | 완료 | 그림은 이미 들어가 있었다. game-theory에 Wal-Mart 선점과 협상 연계(강의 자료), asymmetric-information에 비교 절(역선택·도덕적 해이, 신호·선별) 추가 (2026-11-21) |
| R4-1 | `seriesOrder`, 기존 10편 | 검토 | `seriesOrder` 1, 2, 3, 4, 5, 7, 8, 10, 14, 17과 다음 글 링크. dplyr, tibble, eda, string, factor, joins에 비교와 빠진 내용 보강(2026-11-14) |
| R4-2 | logical-numbers, datetime, functions | 검토 | 신규 3편(seriesOrder 6, 9, 13), 앞뒤 링크 3곳 수정. `published`는 기존 글 날짜 사이 임의 값(2026-11-14) |
| R4-3 | external-data, hierarchical-web, base-r, quarto | 완료 | 4편 신규. 다음 글 링크를 joins → external-data, iteration → base-r로 바꿨다 (2026-11-21) |
| 딥러닝 | 12편 | 완료 | `10-deep-learning.md`. 1~9편을 개념 중심으로 다시 쓰고 폴더와 번호를 바꿨으며 10~12편을 새로 썼다. 편끼리 교차 링크 추가(2026-11-14). 사용자 검토 완료(2026-11-14) |
| 데이터 시각화 | 12편 | 완료 | `11-data-visualization.md`. 신규, 사용자 검토 완료(2026-11-14) |
| 기계학습 활용 | 11편 | 완료 | `12-machine-learning.md`. 신규, 사용자 검토 완료(2026-11-14) |
| 데이터 분석 환경 | 7편 | 완료 | `seriesOrder`는 linux 1, wsl2 2, air-gapped 3, data-naming-standards 4, portable-bat-uv 5, parquet-compression-sorting 6, crlf 7. 기존 4편 사용자 검토 완료(2026-11-14). linux, wsl2, crlf 3편 추가와 그림 6장(2026-11-16~21) |
| 마무리 | 단독 글, About, 링크 | 진행 | beauty의 세 문제는 이미 해결되어 있었다. air-gapped 인코딩 코드 실행 확인. `dm-linear-regression` 고영향점 기준을 평균의 2배로 명시. 시계열 비계절 연산자를 소문자 $\phi(B)$, $\theta(B)$로 통일(ts-06, ts-07, la-eigen). About(D9)·D5·D10은 사용자 결정 대기 (2026-11-22) |

## 8. 계획과 달라진 점

- 2026-11-22: 검토 대기 글 중 R 코드가 있는 67편(torch를 쓰는 `dm-neural-network`, `dm-deep-learning` 제외)을 글 사본에서 다시 실행해 모두 에러 0을 확인했다. 저장소의 그림은 바꾸지 않았다.

- 2026-11-21: BIO-5의 포아송 신뢰구간 포함률 모의실험은 "반복 모의실험으로 방법 비교 금지" 원칙에 따라 넣지 않았다. 예제에 과대산포가 없어(편차 0.022) 음이항 적합은 수렴하지 않는다는 설명으로 대신했다.
- 2026-11-21: BIO-6 반복측정의 확률 기울기 모형은 lme4 대신 이미 설치된 nlme(`lme`)로 했다. lme4는 설치하지 않았다.
- 2026-11-21: DOE-5에서 doe-09는 oats 예제에 교재 예제 8.3~8.5를 함께 썼다. 2단분할 그림은 Excalidraw 대신 `<text>`가 있는 손으로 쓴 SVG다. 예제 8.4는 B3·70°C 첫 값이 63.2여야 교재 표 8.15가 재현되어 본문에 적었다.
- 2026-11-21: R4-3에서 arrow는 이 환경(Homebrew R, 소스 설치만 가능)에서 빌드가 무거워 설치하지 않았다. Parquet 왕복은 duckdb로 실행하고, arrow 코드는 `norun`으로 두었다. readxl 예시는 패키지에 들어 있는 `deaths.xlsx`를 썼다. quarto는 설치되어 있지 않아 렌더 결과 없이 소스만 넣었다.

작업 중 계획을 바꾸면 날짜, 파일, 이유를 여기에 적는다.

- 2026-11-14: DM 신규 3편. 0번 우선 원칙에 따라 Hitters 비교는 반복 분할과 몬테카를로 SE 대신 ISLR과 같은 분할 하나로 하고 "이 분할에서는"으로 적었다. 이중 하강은 시드 1 곡선과 시드 100개 중앙값, 능선 비교만 그렸다. torch를 쓸 수 있게 되어 Hitters는 `nnet` 대신 ISLR 실습 구조(ReLU 50, 드롭아웃 0.4, RMSprop)로 적합했다.

- 2026-11-14: 남은 시리즈를 시리즈별로 한 묶음씩 병렬 세션으로 진행한다. 세션은 자기 시리즈 글만 고치고 현황판은 부모 세션이 갱신한다. 1차는 DOE-1, BIO-1, TS-1, LA-1, MI-1, R4-1.
- 2026-11-14: BIO-1에서 `sas-basics`의 SAS 출력은 `sashelp`를 쓰지 않는 예제(`mower`, `bweight`)만 R 확인값으로 표시했고, `sashelp.class`, `sashelp.cars` 예제는 숫자 대신 출력 표 안내로 두었다(D2). `study-design`의 `proc plan` 출력은 시드마다 달라 싣지 않았다.
- 2026-11-14: TS-1에서 ts-02의 비교 절을 예측 다음이 아니라 예제 앞(6절)에 두었다. 예제가 그 비교를 쓰기 때문이다.
- 2026-11-14: LA-1에서 계획의 열 결합 SVG, 소거 단계·해집합 그림은 기존 그림(`fig-row-column-picture`, `fig-elimination-lines`, `fig-solution-cases`)으로 충족해 새로 만들지 않았다. "내적과 외적" 비교는 이 글의 외적이 벡터곱이라 벡터곱과 $ab^T$ 구분 주의로 대신했다.
- 2026-11-14: MI-1에서 `micro-overview`의 쿠르노·슈타켈베르크·베르트랑 잉여표를 지우고 `micro-monopolistic-competition-oligopoly`의 표를 기준으로 삼았다. 계획의 그림(시리즈 지도, 탄력성 위치, 단기·장기)은 이미 있어 새로 그리지 않았다.
- 2026-11-14: R4-1에서 ggplot2, communication, iteration, modeling은 비교 항목이 이미 있어 순서와 링크만 맞췄다. R 출력이 필요한 곳(string, joins)은 `text` 블록으로 직접 적었다. "다음 글" 링크는 지금 있는 글로 이었으므로 신규 글을 넣을 때 앞뒤 링크를 다시 고친다.
- 2026-11-14: TS-2에서 ts-03, ts-04는 절 구성을 유지하고 비교·정규화 내용만 보강했다. "하나의 분할 결과 일반화" 항목은 해당하는 분할 비교가 없어 적용하지 않았다.
- 2026-11-14: MI-2의 곡선 그림(특수 선호·구석해·배급, 대체·소득 분해·엥겔·네트워크 외부효과, 효용곡선 3종·위험자산 예산선)은 이미 있어 새로 그리지 않았다. 대신 비교표를 더하고, 책에 있으나 글에 없던 과시효과(베블런)를 추가했다.
- 2026-11-14: 2차 묶음 중 DOE-2, BIO-2, LA-2는 사용량 한도로 중간에 멈춰 같은 세션에서 이어 진행한다.
- 2026-11-14: DOE-2에서 doe-04의 "비제약 EMS 확인 모의실험"은 넣지 않았다. EMS를 교재 법칙과 손 유도로 확인했고 0절 원칙에 따라 생략했다. `as_tibble(rownames =)` 뒤 한글 요인명으로 행을 찾는 코드는 한글이 깨지면 빈 값을 돌려준다. 다른 DOE 글을 고칠 때 같은 패턴을 점검한다.
- 2026-11-14: BIO-2에서 `hypothesis-testing`의 세 검정 비교는 모의실험 대신 소표본 예시 하나(n=10, x=1)로 줄였다. `mean-comparison`의 SAS 출력은 R 확인값으로 대신했다(D2).
- 2026-11-14: R4-2에서 `r4ds-joins`의 다음 글은 R4-3 글이 생기기 전까지 `r4ds-functions`로 잇는다. datetime은 로케일 차이 때문에 `Sys.setlocale("LC_TIME", "C")`를 환경 설정 블록에 넣었다.
- 2026-11-14: DOE-3에서 doe-05 Youden의 조정 처리 제곱합은 교재 예제 5.8이 직교 배치라서 불완비 4×3 배치의 BIBD 식과 효율로 설명했다. doe-06의 중심점과 곡률 절은 교재 밖으로 표시했다.
- 2026-11-14: BIO-3에서 진단 평가를 `biostat-diagnostic-test`로 분리했다. `published`를 `2026-05-24T12:00:00`으로 두어 분할표 글 바로 뒤에 오게 했고, 순서는 BIO-6 이후 다시 본다. `ml-09-metrics`의 링크는 새 글로 바꿨다.
- 2026-11-14: TS-3에서 ts-05는 비교(8절) 뒤에 실제 시계열(7절)이 오는 현재 순서를 유지했다. ts-06의 3절 쌍대성은 표 없이 문장으로 바꿨다.
- 2026-11-14: LA-3에서 `la-orthonormal`은 정규방정식과 QR 수치 안정성을 한 번의 실험(`x = 1..20`, 5차 다항식)으로 보였다. `la-linear-map`의 단사·전사 비교는 rank 판정 표로 바꿔 1절 정의와 겹치지 않게 했다.
- 2026-11-14: MI-3의 곡선 그림은 이미 있어 새로 그리지 않았고, 비교표와 비용함수 형태, 공급탄력성을 더했다.
- 2026-11-14: DOE-4에서 doe-07의 입방체 그림이 블록 분할과 반실시를 함께 보여 반실시 그림은 따로 만들지 않았다. doe-08의 예제 7.2는 교재 배치가 성립하지 않아 재현하지 않고 rank 확인과 가수준 인자가 열 3개를 쓴다는 규칙으로 대신했다.
- 2026-11-14: BIO-4에서 `sashelp.class`, `sashelp.heart` 예제는 코드만 두고 개념 예시는 R 내장 자료(`women`, `mtcars`)로 넣었다. 생명과학통계는 `seriesOrder` 대신 `published` 시각으로 순서를 맞추고 있다(diagnostic-test, ancova).
- 2026-11-14: TS-4에서 ts-07, ts-08은 ts-06의 `Φ(B)`(비계절 연산자) 표기를 따랐다. ts-10의 계절 연산자 $\Phi(B^s)$와 겹치므로 TS-5에서 시리즈 전체 표기를 정리한다.
- 2026-11-14: MI-4의 곡선 그림은 이미 있어 새로 그리지 않았다. 비교표와 시트 C09, C10에서 빠진 개념을 더했다.
- 2026-11-21: 데이터 분석 환경 시리즈에서 입문 글인 리눅스와 WSL2를 1, 2번으로 당기고 나머지를 한 칸씩 뒤로 미뤘다. 글끼리는 제목으로 링크하므로 본문 문구는 바꾸지 않았다. About의 시리즈 설명 순서도 맞췄다.
- 2026-11-21: 단독 글 그림(`posts/*/figures/fig-*.svg`)은 글자가 path로 들어 있어 용량이 크다. `scripts/optimize-figures.py`로 좌표를 소수 한 자리로 줄이고 상대 좌표로 바꿔 20장 4.49MB를 2.37MB로(gzip 1.49MB → 0.61MB) 줄였다. 새 그림을 넣으면 이 스크립트를 한 번 돌린다.
- **마무리 때 처리할 시리즈 간 항목 (2026-11-22 둘 다 처리):** (1) `r4ds-modeling`의 "`lm()`은 정규방정식으로 바로 푼다"는 틀렸다(`lm()`은 QR). R4-3 때 고친다. (2) `la-orthonormal` 7절이 `dm-linear-regression`을 지렛값 진단 글로 링크하는데 그 글에 `hatvalues` 설명이 없다. 지렛값을 짧게 넣거나 링크 문장을 바꾼다.
  (3) 완료: `la-svd` 8절의 PCR·PLS 언급을 `dm-regularization` 링크로 바꿨다. (4) 생명과학통계 시리즈 순서를 `published`로 맞춘 것을 `seriesOrder`로 바꿀지 결정한다.
- 2026-11-09: `02-data-mining.md`의 12번 `dm-neural-network` 계획을 ISLR 10.1, 10.2, 10.7, 10.8 원문과 대조해 다시 썼다. 예시를 소주제마다 붙이는 B형 구조로 바꾸고, 역전파, 모수 수, 드롭아웃, 이중 하강 재현 설정을 구체화했다. 이중 하강은 시드 평균 대신 중앙값과 대표 시드를 쓰고, Hitters는 `nnet`이 ISLR 모형과 다르다는 점과 `MaxNWts`를 명시했다. `01-common-frame.md`에 torchvision과 큰 내려받기 허락 규칙을 추가했다.
- 2026-11-09: 사용자 요청으로 데이터 마이닝부터 시작했다. WP-0은 `seriesOrder`만, WP-1은 데이터 마이닝 항목만 먼저 처리했다. `seriesOrder`는 `src/utils.ts`의 `SeriesGroup.build`에서 시리즈 안 정렬을 하고(번호가 있는 글 우선, 나머지는 `published`), `sortCollationsMostRecent`는 마지막 항목이 아니라 가장 최근 날짜를 쓰도록 바꿨다. 데이터 마이닝 14편에 번호를 넣었고 신규 4편(7, 12, 13, 14번)은 비어 있다.
- 2026-11-10: 사용자가 비교 보강본과 파일럿이 과하고 GitHub 버전이 적당하다고 판단했다. 데이터 마이닝 14편을 GitHub 글 기준으로 다시 정리했다. 아래 파일럿의 결정 사항은 폐기한다.
- 2026-11-11: 같은 기준을 시계열, 생명과학통계, 실험계획법, 미시경제학의 비교 보강 커밋(`d0808a6e`, `aa56dd0c`, `f6d7b14d`, `3d034d2f`)에 적용했다. 개념 비교표는 남기고, 방법 간 우열을 겨루는 반복 모의실험과 시험 구간 비교, 결과 표, 긴 해석을 두세 문장으로 줄였다. 실제 자료로 개념을 보여 주는 예시(심슨의 역설, 분할법 오분석, 블록화, 결정적·확률적 추세의 예측구간)는 남겼다. 미시경제학의 강의 예제 반영(`98f1c122`)과 실험계획법 시리즈 추가(`2ba3d9a3`)는 의도한 변경이므로 기준선에 포함한다. 이 과정에서 WP-1의 6번(`biostat-mean-comparison` 사전검정과 Welch)은 Welch 기본으로 고쳤고, 8번(`biostat-hypothesis` LR과 Score 결론 충돌)은 충돌한 모의실험 결론이 빠지면서 해소됐다.
- 2026-11-09: 파일럿 `dm-resampling`에서 정한 것. (1) 글의 개념 절은 `1. 개념`, `2. 비교`, `3. 예시와 사용` 순서이고 예시는 `3.1`처럼 번호를 붙인다. (2) 모의실험은 반복 수와 몬테카를로 SE를 코드에서 계산해 표에 `값 (SE)`로 적고, 방법끼리의 비교는 같은 자료에서의 짝지은 차이로 한다. (3) 이론과 모의실험이 어긋나면 어긋난다고 쓴다(`LOOCV 분산이 더 크다`는 이 설정에서 나타나지 않았다). (4) 한 번의 결과를 일반화하는 대신 200회 반복한다(변수 선택 누수, CV로 고른 차수와 K).
