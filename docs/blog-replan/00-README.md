# 블로그 전체 재구성 계획

작성일 2026-11-09, 기준 커밋 `3d034d2f`. 작업 세션은 이 파일에서 시작한다.

> **방향 변경 (2026-11-10):** 기준은 GitHub 버전(`origin/main` `53edf6ec`)이다. 먼저 [01-common-frame.md](01-common-frame.md)의 "0. 우선 원칙"을 읽는다. 아래 계획의 글 수, 목표 목차, 작업 순서는 이 원칙보다 뒤에 온다.

## 1. 계획 요약

**목표:** 블로그만 읽어도 각 과목을 한 번에 복습할 수 있게 한다. 교재 범위를 빠짐없이 담고, 모든 글을 **개념(수식과 글) → 비교 → 예시와 사용**의 틀로 정리한다.

| 시리즈 | 현재 | 계획 | 핵심 변화 |
|---|---|---|---|
| 데이터 마이닝 | 14 | **18** | ISLR 2~13장 전체. 딥러닝 2편, 생존 1편, PCR·PLS·고차원 1편 신규. BART, 행렬 완성, Tukey·Scheffé, 재표집 FDR 등 추가 |
| 시계열 | 10 | 10 | 중복 표 제거, KPSS와 비승법 모형 추가, 자료 URL 고정 |
| 실험계획법 | 10 | 10 | EMS 규칙 충돌 해결, 3수준과 2단분할 보강, 그림 추가 |
| 생명과학통계 | 12 | **13** | SAS 실제 출력, 진단 평가 분리, ANCOVA 순서 변경, 오류 수정 |
| 선형대수 | 8 | 8 | 코드를 개념 옆으로, 비교 표, 통계에서의 쓰임 추가 |
| 미시경제학 | 18 | 18 | 곡선 그림 대폭 추가, 게임이론 그림과 Wal-Mart 사례, 비교 표 정리 |
| R4DS | 10 | **17** | 책 순서로 변경, 2판 공백 7편 추가(우선순위 낮음) |
| 단독 | 2 | 2 | 문체와 컬럼명 정리 |
| **합계** | **84** | **96** | |

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
| D3 | 새 주제(수리통계, 회귀, 금융) | 이번 범위에서 제외. 개편 후 재논의 |
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
| WP-0 | 사이트 공통 | 진행 | `seriesOrder` 완료(스키마, 정렬, 데이터 마이닝 14편 번호). 모바일 표, 자료 URL 고정, About·README 갱신은 대기 |
| WP-1 | 확정 오류 | 검토 | 16건 중 15건 처리(2026-11-11). `doe-04`는 비제약(교재)과 제약(강의) EMS를 나란히 비교하는 표로 고쳤다. 7, 13번은 해당 문장이 GitHub 기준 정리에서 빠져 해소됐다. 칼슘 자료(D7)만 보류 |
| WP-2 | 파일럿 3편 | 중단 | 번호 구조 파일럿은 폐기했다. `dm-resampling`은 GitHub 글 기준으로 되돌렸다 |
| DM 기존 14편 | GitHub 기준 정리 | 검토 | 8편은 GitHub 글로 되돌린 뒤 빠진 내용만 더했고, 6편은 덧붙인 절을 줄였다. 사용자 확인 대기 |
| DM 신규 | neural-network, deep-learning, survival | 대기 | ISLR 10, 11장. 글 구조는 GitHub 글을 따른다. `pcr-pls-high-dim`은 만들지 않고 `dm-regularization` 안에 둔다 |
| DOE-1 | 01, 02 | 대기 | |
| DOE-2 | 03, 04 | 대기 | |
| DOE-3 | 05, 06 | 대기 | |
| DOE-4 | 07, 08 | 대기 | |
| DOE-5 | 09, 10 | 대기 | |
| BIO-1 | sas-basics, study-design | 대기 | |
| BIO-2 | hypothesis, mean-comparison | 대기 | |
| BIO-3 | contingency, diagnostic-test | 대기 | |
| BIO-4 | correlation-regression, ancova | 대기 | |
| BIO-5 | logistic, poisson | 대기 | |
| BIO-6 | repeated, survival, sample-size | 대기 | |
| TS-1~5 | 10편 | 대기 | |
| LA-1~4 | 8편 | 대기 | |
| MI-1~7 | 18편 | 대기 | |
| R4-1~3 | 17편 | 대기 | |
| 딥러닝 | 12편 | 검토 | `10-deep-learning.md`. 1~9편을 개념 중심으로 다시 쓰고 폴더와 번호를 바꿨으며 10~12편을 새로 썼다. 편끼리 교차 링크 추가(2026-11-14). 커밋 전 |
| 데이터 시각화 | 12편 | 검토 | `11-data-visualization.md`. 신규, 커밋 전 |
| 기계학습 활용 | 11편 | 검토 | `12-machine-learning.md`. 신규, 커밋 전 |
| 데이터 분석 환경 | air-gapped, data-naming-standards | 검토 | `seriesOrder` 1, 2. naming-standards는 신규, 커밋 전 |
| 마무리 | 단독 글, About, 링크 | 대기 | |

## 8. 계획과 달라진 점

작업 중 계획을 바꾸면 날짜, 파일, 이유를 여기에 적는다.

- 2026-11-09: `02-data-mining.md`의 12번 `dm-neural-network` 계획을 ISLR 10.1, 10.2, 10.7, 10.8 원문과 대조해 다시 썼다. 예시를 소주제마다 붙이는 B형 구조로 바꾸고, 역전파, 모수 수, 드롭아웃, 이중 하강 재현 설정을 구체화했다. 이중 하강은 시드 평균 대신 중앙값과 대표 시드를 쓰고, Hitters는 `nnet`이 ISLR 모형과 다르다는 점과 `MaxNWts`를 명시했다. `01-common-frame.md`에 torchvision과 큰 내려받기 허락 규칙을 추가했다.
- 2026-11-09: 사용자 요청으로 데이터 마이닝부터 시작했다. WP-0은 `seriesOrder`만, WP-1은 데이터 마이닝 항목만 먼저 처리했다. `seriesOrder`는 `src/utils.ts`의 `SeriesGroup.build`에서 시리즈 안 정렬을 하고(번호가 있는 글 우선, 나머지는 `published`), `sortCollationsMostRecent`는 마지막 항목이 아니라 가장 최근 날짜를 쓰도록 바꿨다. 데이터 마이닝 14편에 번호를 넣었고 신규 4편(7, 12, 13, 14번)은 비어 있다.
- 2026-11-10: 사용자가 비교 보강본과 파일럿이 과하고 GitHub 버전이 적당하다고 판단했다. 데이터 마이닝 14편을 GitHub 글 기준으로 다시 정리했다. 아래 파일럿의 결정 사항은 폐기한다.
- 2026-11-11: 같은 기준을 시계열, 생명과학통계, 실험계획법, 미시경제학의 비교 보강 커밋(`d0808a6e`, `aa56dd0c`, `f6d7b14d`, `3d034d2f`)에 적용했다. 개념 비교표는 남기고, 방법 간 우열을 겨루는 반복 모의실험과 시험 구간 비교, 결과 표, 긴 해석을 두세 문장으로 줄였다. 실제 자료로 개념을 보여 주는 예시(심슨의 역설, 분할법 오분석, 블록화, 결정적·확률적 추세의 예측구간)는 남겼다. 미시경제학의 강의 예제 반영(`98f1c122`)과 실험계획법 시리즈 추가(`2ba3d9a3`)는 의도한 변경이므로 기준선에 포함한다. 이 과정에서 WP-1의 6번(`biostat-mean-comparison` 사전검정과 Welch)은 Welch 기본으로 고쳤고, 8번(`biostat-hypothesis` LR과 Score 결론 충돌)은 충돌한 모의실험 결론이 빠지면서 해소됐다.
- 2026-11-09: 파일럿 `dm-resampling`에서 정한 것. (1) 글의 개념 절은 `1. 개념`, `2. 비교`, `3. 예시와 사용` 순서이고 예시는 `3.1`처럼 번호를 붙인다. (2) 모의실험은 반복 수와 몬테카를로 SE를 코드에서 계산해 표에 `값 (SE)`로 적고, 방법끼리의 비교는 같은 자료에서의 짝지은 차이로 한다. (3) 이론과 모의실험이 어긋나면 어긋난다고 쓴다(`LOOCV 분산이 더 크다`는 이 설정에서 나타나지 않았다). (4) 한 번의 결과를 일반화하는 대신 200회 반복한다(변수 선택 누수, CV로 고른 차수와 K).
