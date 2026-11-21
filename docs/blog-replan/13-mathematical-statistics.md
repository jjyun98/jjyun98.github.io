# 10. 수리통계학 (Hogg·McKean·Craig, Introduction to Mathematical Statistics 8판)

**결정:** D3에서 사용자가 수리통계학 시리즈를 요청했다(2026-11-22). 교재는 Hogg·McKean·Craig 8판.

**목표:** 수리통계 1·2 수업의 핵심(정의, 정리, 유도, 대표 예제)을 다른 시리즈와 같은 틀로 정리한다. 전공자가 시험 준비와 복습에 쓸 수 있는 수준으로 쓴다.

## 공통 틀

```markdown
교재 장 안내 → 환경 설정(R) →
## n. 소주제: 정의·정리 → 유도(핵심 단계) → 예제 → R로 확인
## 비교 (개념 쌍을 표 하나로)
## 요약
```

- 교재 문장을 옮기지 않고 다시 쓴다. 예제는 표준 예제를 쓰고 교재 번호를 붙이지 않는다.
- 숫자는 손계산 값과 R 출력이 일치하는 것만 쓴다. R 코드는 `_tmp/r4ds/run_md.R`로 실행한다.
- 모의실험은 정리가 말하는 현상을 한 번 보여 주는 용도로만 쓴다(방법 간 반복 비교는 하지 않는다).
- 그림은 R 그래프(`./images/`)로 만든다.

## 글 구성

| 순서 | slug | 교재 | 내용 |
|---|---|---|---|
| 1 | ms-01-probability | 1.1–1.4 | 표본공간, 공리, 연속성, 셈, 조건부확률, 베이즈, 독립 |
| 2 | ms-02-random-variables | 1.5–1.10 | 확률변수, cdf, pmf·pdf, 변환, 기댓값, mgf, 부등식 |
| 3 | ms-03-multivariate | 2장 | 결합·주변·조건부 분포, 변환, 반복기댓값, 상관, 독립, 선형결합 |
| 4 | ms-04-special-distributions | 3장 | 이항 계열, 포아송, 감마·카이제곱·베타, 정규, 다변량정규, t, F, Student 정리 |
| 5 | ms-05-estimation-intervals | 4.1–4.4 | 통계량, 불편성, 신뢰구간, 순서통계량, 분위수 |
| 6 | ms-06-testing-basics | 4.5–4.9 | 검정, 검정력, p값, 카이제곱 검정, 몬테카를로, 부트스트랩 |
| 7 | ms-07-limiting-distributions | 5장 | 확률수렴, 분포수렴, Slutsky, 델타방법, CLT |
| 8 | ms-08-mle | 6.1–6.2 | MLE, 피셔정보, 크라메르-라오, 점근정규성 |
| 9 | ms-09-likelihood-tests-em | 6.3–6.6 | 가능도비·왈드·스코어 검정, 다모수, EM |
| 10 | ms-10-sufficiency | 7장 | 충분성, 분해정리, 라오-블랙웰, 완비성, 레만-셰페, 지수족, 바수 |
| 11 | ms-11-optimal-tests | 8장 | 네이만-피어슨, UMP, 단조가능도비, 가능도비 검정, SPRT |
| 12 | ms-12-normal-linear-models | 9장 | 이차형식, 분산분석, 비중심 분포, 회귀, 코크란 정리 |
| 13 | ms-13-nonparametric | 10장 | 부호검정, 윌콕슨, 맨-휘트니, ARE, 로버스트 추정 |
| 14 | ms-14-bayesian | 11장 | 사전·사후, 켤레, 베이즈 추정, 신용구간, 깁스, 계층 베이즈 |

## 연결

- `ms-07` CLT ↔ `biostat-sample-size`, `ms-08` ↔ `biostat-logistic-regression`(MLE), `ms-12` ↔ `doe-02-one-way`, `la-orthonormal`(사영), `ms-04` 다변량정규 ↔ `la-eigen`.

## 증명과 그림 보강 (2026-11-22)

- 교재에서 증명하는 정리는 본문에 증명을 둔다. 측도론이 필요한 것(mgf 유일성, 연속사상 정리, 크레이그 정리의 필요조건)만 생략하고 생략했다고 밝힌다.
- 개념도는 `_tmp/excal/ms_figs.py`로 만든다(`_tmp/pyla/bin/python _tmp/excal/ms_figs.py`). 생성기 `_tmp/excal/excal.py`는 Excalifont/Xiaolai 글꼴을 경로로 바꾼 SVG와 `.excalidraw` JSON을 함께 만든다. 첨자는 `X_{n}`, `σ^{2}` 표기를 쓴다.
