# 09. 사이트 공통 작업과 단독 글

## WP-0 사이트 공통 작업

### 1. `seriesOrder` 추가

**문제:** 시리즈 순서가 `published` 날짜에 묶여 있다. 순서를 바꾸려면 날짜를 고쳐야 하고, 2022년 글이 2판 R4DS나 `.by`를 인용하는 시대 불일치가 드러난다. 또한 홈의 시리즈 목록이 최근 글 순이어서 글 하나만 고쳐도 순서가 움직일 수 있다.

**작업**

1. `src/content.config.ts:25` 근처에 `seriesOrder: z.number().optional()`을 추가한다.
2. `src/utils.ts`와 `src/components/SeriesSection.astro`에서 시리즈 안 정렬을 찾아, `seriesOrder`가 있으면 그 값, 없으면 `published` 순으로 정렬한다. `getSortedPosts`(`src/utils.ts:217`)의 전역 정렬은 그대로 둔다.
3. 시리즈 내비게이션(이전, 다음 글)이 같은 정렬을 쓰는지 확인한다.
4. 모든 글에 `seriesOrder`를 넣는다. 번호는 각 시리즈 파일의 새 순서이며, 아직 없는 신규 글의 번호를 비워 둔다.
5. 홈의 시리즈 목록을 고정 순서(DM, TS, DOE, Bio, LA, Micro, R4DS)로 할지는 D8에 따른다.
6. `README.md`의 "시리즈 안의 순서는 published 날짜 순" 문장과 frontmatter 예를 고친다.

**완료 조건:** `npm run build` 통과. `/series/<이름>` 목록과 글 아래 이전·다음 링크가 새 순서로 나온다.

### 2. 모바일 표

**문제:** 375px 화면에서 표가 스크롤 컨테이너에 들어 있지 않아 페이지 전체가 475~592px로 넓어진다(시험한 글 4편 모두). 수식은 이미 스크롤된다.

**작업:** Markdown 표에 가로 스크롤 래퍼를 적용한다. rehype 플러그인으로 `<div class="table-wrapper">`로 감싸는 방법을 우선 쓰고, 안 되면 `.prose table { display: block; overflow-x: auto }`로 처리한다. `src/styles/global.css:557`의 기존 패턴을 확인한다.

**완료 조건:** 표가 많은 글(`micro-game-theory`, `biostat-contingency-diagnostic`, `dm-classification`, `doe-04-multi-way-ems`)을 375px에서 열었을 때 페이지 `scrollWidth`가 뷰포트와 같다.

### 3. 자료 URL 고정

`time-series` 글의 `Bricoler/time-series-analysis/master/`를 커밋 SHA로 바꾼다. 자료를 저장소에 복제하지는 않는다.

### 4. About, README

- 시리즈 표에 새 글 수, 교재명을 반영한다. 시계열 교재명을 통일한다(D5).
- 선형대수 코드 칸이 비어 있지만 글에는 R, Python이 있다. 채운다.
- About이 Airflow, Lambda를 말하지만 글이 없다. 글을 쓰거나 표현을 고친다(D9). 계획 파일이 임의로 경력 내용을 만들지 않는다.

## 단독 글

### beauty (화장품 성분 분석 프로젝트)

**문제**

- 합니다체여서 블로그 문체와 다르다.
- 1부에서 끝나고 2부가 없다.
- `:54`의 `goods_id`와 `:67`의 `goodsNumber`가 다르다.
- 결론 뒤에 배열 표가 남아 있다.

**작업:** 이다체 통일, 컬럼명 통일, 결론 뒤 표 제거. 시리즈 처리는 D10 결정에 따른다.

**틀:** 프로젝트 글은 문제 → 자료 → 설계 → 지표(식) → 결과 → 한계로 쓴다.

### air-gapped-analysis-environment (데이터 분석 환경)

좋은 구조다. 요약과 인코딩 절만 확인하고 큰 변경은 없다. `r4ds-external-data`, `r4ds-base-r`에서 링크한다.

## 새 주제 후보 (이번 계획의 실행 범위 밖)

전공 축 기준으로 공백이 있다. 지금 쓰지 않고, 기존 시리즈 개편 후 D3에서 결정한다.

| 후보 | 이유 | 전제 |
|---|---|---|
| 수리통계/확률론 | 여러 시리즈의 분포, 추정, 검정의 근거 | 사용 교재가 필요 |
| 회귀분석 | DM, Biostat, TS, DOE의 공통 기반 | 사용 교재가 필요. 없으면 DM 3장으로 충분 |
| 금융경제학 부전공 주제 | 전공 구성상 비어 있음 | 사용 교재가 필요 |
| 다변량 분석 | PCA, LDA, 군집과 연결 | DM과 일부 중복 |
