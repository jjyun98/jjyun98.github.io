# 12. 기계학습 활용 시리즈 설계

작성일 2026-11-14. 원자료: 최규빈, 「기계학습활용」 강의노트 (2023), <https://guebin.github.io/MP2023/>

**원칙:** 회차 순(자료별 모듈)으로 옮기지 않는다. 강의는 같은 장난감 자료(아이스크림, 취업, 체중감량, Medical Cost, 타이타닉)를 여러 방법에 반복 적용하는 구조이므로, 글은 **개념** 단위로 묶고 자료는 개념을 보여 주는 예로만 쓴다.

- 제목 `기계학습 활용 - <개념>`, 폴더 `src/content/posts/machine-learning/ml-NN-<개념>/`, 접두어 `ml`.
- 이론(최소제곱, 벌점 회귀, 트리의 분할 기준, 배깅의 분산 감소)은 데이터 마이닝 시리즈(ISLR, R)가 담당한다. 이 시리즈는 **sklearn으로 쓰는 법과 각 방법이 어떤 자료에서 무너지는가**를 담당하고, 이론은 링크로 넘긴다.
- 버리는 것: 캐글 가입·제출 화면, ChatGPT 대화, 애니메이션(10wk-36), 그래프 꾸미기(plot_tree 옵션 나열), 과제 안내.
- 코드: Python, scikit-learn 1.9, AutoGluon (스크래치패드 가상환경). 숫자는 모두 직접 실행한 값.
- 타이타닉은 캐글 로그인 없이 받을 수 있는 train.csv 사본(891행)만 쓰고, 시험 자료는 train을 나눠 만든다. House Prices, 자전거 대여(캐글판), Disaster Tweets는 캐글 로그인이 필요해 쓰지 않는다. 자전거 대여는 UCI 원자료로 대신한다.

## 글 구성 (11편)

| # | 제목 | 폴더 | 강의 회차 | 핵심 | 연결 |
|---|---|---|---|---|---|
| 1 | 예측 문제와 predictor | `ml-01-predictor` | 01~02wk, 04wk-18 | train/test = 모의고사/시험, X·y·XX·yy, 생성→fit→predict→score 네 단계, 입력은 2차원, 성별 기준선 0.787 | dm-overview, dl-01 |
| 2 | 선형회귀와 로지스틱 회귀 | `ml-02-linear-logistic` | 03wk, 04wk-17 | coef_/intercept_ 해석, 원핫과 drop_first, R², 시그모이드, predict_proba, 문자열·결측으로 fit 실패 | dm-linear-regression, dm-logistic-regression, dl-03 |
| 3 | 결측치 처리와 스케일링 | `ml-03-missing-scaling` | 04wk-14~16, 05wk-19~20 | msno, SimpleImputer 전략, 혼합형, MinMax vs Standard, train에서 fit·test는 transform, 정보누수 | r4ds-eda |
| 4 | 과적합과 다중공선성 | `ml-04-overfitting-collinearity` | 05wk-21, 06wk-22 | 쓸모없는 변수 5000개, 유사 토익 500개, train 1.0/test 0.12, 계수 불안정과 계수합 | dm-resampling, la-svd |
| 5 | 릿지와 라쏘 | `ml-05-ridge-lasso` | 06wk-23~26, 07wk-28C | L2는 나눠 갖기, L1은 골라내기, α 경로, RidgeCV/LassoCV, L1 로지스틱 | dm-regularization |
| 6 | 선형모형의 한계: 이상치와 교호작용 | `ml-06-outlier-interaction` | 07wk-27~30, 07wk-28 | 선형모형의 다섯 적 표, 축제 이상치와 외삽, Huber, 교호작용 항 | doe-03-two-way |
| 7 | 의사결정나무 | `ml-07-decision-tree` | 07wk-31~35, 10wk, 11wk-40~42 | 분할점 탐색 직접 구현(5.05), max_depth, max_features, sample_weight, 다섯 적에 대한 반응, 외삽 불가 | dm-tree |
| 8 | 배깅, 랜덤포레스트, 부스팅 | `ml-08-ensemble` | 11wk-43, 12wk-44~45 | 부트스트랩 평균 재현, 다양성, RF = 배깅 + max_features, 잔차를 0.1씩 학습하는 부스팅 재현 | dm-ensemble |
| 9 | 분류의 평가지표 | `ml-09-metrics` | 12wk-46, 13wk-47 | 혼동행렬, 정확도의 함정, 재현율·정밀도·F1·특이도·FPR, ROC와 AUC | dm-classification, biostat-contingency-diagnostic |
| 10 | AutoML: AutoGluon | `ml-10-autogluon` | 02wk-05~08, 13wk-48~56, 14wk-60 | 자동 전처리, 여러 모형 + 가중 앙상블, 리더보드, presets, 하이퍼파라미터, 특성 중요도 | ml-08 |
| 11 | 시계열 예측과 피처엔지니어링 | `ml-11-timeseries` | 14wk-58~59 | TimeSeriesDataFrame, 전주 기온 예측, 시간 특징을 뽑아 회귀로 바꾸기 | ts 시리즈 |

## 다루지 않음

- 텍스트(Disaster Tweets, MultiModalPredictor): 자료가 캐글 로그인 필요, 설치 용량이 커서 10편에서 한 줄로만 언급.
- 중간·기말 문제: 참거짓 문항의 오개념만 해당 글의 `주의`로 옮긴다.
