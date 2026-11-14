# 07. 미시경제학 (Pindyck·Rubinfeld 1~18장, 강의 자료 C02~C16)

**목표:** 책 18개 장을 글 18편으로 대응해 복습할 수 있게 한다. 그래프와 계산 예제를 충분히 넣는다.

**변화:** 18편 유지, 순서 유지. 모두 B형.

## 공통 틀

코드가 없으므로 "예시와 사용"은 다음으로 구성한다.

```markdown
## n. 소주제
개념(글 + 식) → 그림(곡선 이동) → 계산 예제(문제 → 풀이 → 결과) → 정책·기업 사례 1개

## 비교 (이 글의 개념 쌍을 표 하나로)
## 정리
```

- 곡선 그림이 글당 1~3개로 적다. 아래 목록대로 추가한다. 경제 곡선 SVG는 축, 곡선 이름, 교점의 값을 표시한다.
- 그림의 수치가 계산 예제의 수치와 일치해야 한다.
- 강의 자료 대조: 작업 시 `_tmp/mi_sheets/sheet_C{장}.jpg`를 열어 강의 예제와 글의 절을 하나씩 확인한다. 1, 17, 18장은 자료가 없으므로 책 구성을 기준으로 본다.
- 수치 표현을 손으로 재계산한다. `Python` 또는 R로 간단히 검증하되 코드는 글에 넣지 않는다.

## 글별 계획

| 글 | 장 | 추가 또는 고칠 내용 | 비교 절 | 추가 그림 |
|---|---|---|---|---|
| micro-overview | 1 | `:113` 쿠르노 수치를 지우고 시장구조 표는 정성적으로. 실증·규범 분석을 확인 | 시장구조, 명목과 실질, 실증과 규범 | 시리즈 지도 |
| micro-supply-demand | 2 | 곡선 이동과 곡선 위 이동 강조, 탄력성 수치 예 | 이동 유형, 탄력성 4종, 단기와 장기 | 탄력성 위치, 단기·장기 |
| micro-consumer-behavior | 3 | 예산선 변화 수치 예 | 특수 선호 3종, 내부해와 구석해, 라스파이레스·파셰·연쇄지수 | 특수 선호 무차별곡선, 구석해, 배급 |
| micro-individual-market-demand | 4 | 슬러츠키 분해와 힉스 분해 구분 | 대체·소득 효과(정상, 열등, 기펜), 보통·보상수요, CV·EV·소비자잉여, 편승·과시 효과 | 대체·소득 분해, 엥겔, 네트워크 외부효과 |
| micro-uncertainty-consumer-behavior | 5 | 강의 예제 유지 | 위험회피·중립·선호, 분산투자·보험·정보, 기대효용과 전망이론 | 효용곡선 3종, 위험자산 예산선 |
| micro-production | 6 | 대체탄력성 유지 | 단기와 장기, 수확체감과 규모수익, 생산함수 3종 | 생산 3단계, 등량곡선 형태 |
| micro-cost | 7 | 라그랑지 풀이 유지 | 회계·경제 비용, 매몰·고정·가변, 규모·범위·학습 | 유지, 포락선, 확장경로 |
| micro-perfect-competition | 8 | 이윤극대화 식, 조업중단 | 단기·장기, 이윤과 생산자잉여, 비용 불변·증가·감소 산업 | 조업중단점, 장기 공급 |
| micro-competitive-market-analysis | 9 | 강의 예제 유지 | 8개 정책의 잉여 변화 표 (소비자, 생산자, 정부, DWL) | 가격지지, 수입할당, 조세 |
| micro-monopoly-market-power | 10 | 러너 지수, 강의 예제 유지 | 완전경쟁과 독점, 독점과 수요독점, 가격규제 | MR, 독점 DWL, 다공장, 수요독점, 자연독점 |
| micro-pricing-market-power | 11 | 각 가격차별에 그림 | 1·2·3급, 시점 간과 최대부하, 이부가격, 순수·혼합 묶음 | 1·2·3급, 이부가격, 묶음 산점도 |
| micro-monopolistic-competition-oligopoly | 12 | 쿠르노 수치를 이 글로 모음 | 독점적 경쟁과 완전경쟁, 쿠르노·슈타켈베르크·베르트랑·담합·경쟁 수치표 | 단기·장기 독점적 경쟁, 반응곡선, 굴절수요 |
| micro-game-theory | 13 | **그림 0장.** `:148`의 "게임나무를 그리고"가 그림 없이 끝남. **Wal-Mart 선점** 추가. 강의의 해변 입지와 협상 전략이 충분한지 확인 | 기존 균형 개념 표, 동시와 순차, 일회와 반복, 경매 유형 | 혼합전략 최적반응 2개, 게임나무 2개, 진입 저지, 경매 기대수입 |
| micro-factor-market | 14 | 잉여 비교 유지 | 경쟁·수요독점·공급독점 요소시장 (기존) | 노동공급 후방굴절, 경제적 지대, 수요독점 |
| micro-capital-market | 15 | NPV 예제 유지 | 저량과 유량, 명목과 실질, 위험 조정, 채권 수익률과 NPV | 현재가치와 이자율, 자원 가격 경로, 자금시장 균형 |
| micro-general-equilibrium-efficiency | 16 | 후생정리의 가정 명시 | 효율 조건 3종(기존), 후생정리 1·2, 공평성 기준 4종 | 에지워스 유지, 효용가능곡선, 생산가능곡선 |
| micro-asymmetric-information | 17 | 예제 유지 | 역선택과 도덕적 해이, 신호와 선별, 효율임금 | 레몬시장, 교육 신호, 보험 도덕적 해이 |
| micro-externalities-public-goods | 18 | 코즈 표 유지 | 기존 교정 수단 표, **경합성·배제성 2×2 재화 분류** | 재화 분류, 수직합, 공유자원 |

## 작업 묶음

| 묶음 | 글 |
|---|---|
| MI-1 | overview, supply-demand |
| MI-2 | consumer-behavior, individual-market-demand, uncertainty |
| MI-3 | production, cost, perfect-competition |
| MI-4 | competitive-market-analysis, monopoly, pricing |
| MI-5 | oligopoly, game-theory |
| MI-6 | factor-market, capital-market, general-equilibrium |
| MI-7 | asymmetric-information, externalities |

**먼저 할 글:** `micro-game-theory`는 그림 공백이 가장 크고 내용은 좋다. MI 묶음 중 먼저 처리해 그림 양식을 정한다.
