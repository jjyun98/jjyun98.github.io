---
title: '선형대수 - 가우스 소거법, 역행렬과 LU 분해'
published: 2023-03-02
draft: false
description: '기본행렬로 보는 가우스 소거법, 가우스-조르당 소거법으로 역행렬 구하기, LU 분해와 PA = LU 정리'
series: '선형대수학'
tags: ['선형대수학', '수학']
---

가우스 소거법은 기본행렬을 왼쪽에 차례로 곱하는 과정이다. 이 관점으로 가우스-조르당 소거법으로 역행렬을 구하는 방법, LU 분해와 행교환이 필요한 경우의 $\mathbf{PA} = \mathbf{LU}$를 정리한다.

이전 글: [선형대수 - 벡터와 행렬곱을 보는 여러 관점](/posts/la-vector-matrix)

## 1. 기본행렬

기본 행 연산 세 가지는 각각 단위행렬에 같은 연산을 한 **기본행렬**을 왼쪽에 곱하는 것과 같다. 이 시리즈에서 쓰는 표기는 다음과 같다.

| 표기 | 연산 | 역행렬 | 행렬식 |
|---|---|---|---|
| $R_{i,j}$ | $i$행과 $j$행을 바꾼다 | $R_{i,j}$ (자기 자신) | $-1$ |
| $R_i(c)$ | $i$행에 $c \neq 0$을 곱한다 | $R_i(1/c)$ | $c$ |
| $R_{i,j}(c)$ | $i$행의 $c$배를 $j$행에 더한다 | $R_{i,j}(-c)$ | $1$ |

역행렬은 "한 연산을 되돌리는 연산"이라 바로 읽힌다.

## 2. 가우스-조르당 소거법과 역행렬

### 원리

$\mathbf{A}$를 기본행렬 $\mathbf{E}_k \cdots \mathbf{E}_1$로 단위행렬까지 줄였다면

$$
\mathbf{E}_k \cdots \mathbf{E}_1 \mathbf{A} = \mathbf{I} \quad\Rightarrow\quad \mathbf{A}^{-1} = \mathbf{E}_k \cdots \mathbf{E}_1 = \mathbf{E}_k \cdots \mathbf{E}_1\mathbf{I}
$$

즉 $\mathbf{A}$에 한 행 연산을 $\mathbf{I}$에도 똑같이 하면 $\mathbf{I}$가 $\mathbf{A}^{-1}$이 된다. 그래서 첨가행렬 $[\mathbf{A} \mid \mathbf{I}]$를 만들어 왼쪽이 $\mathbf{I}$가 될 때까지 소거한다.

$$
[\mathbf{A} \mid \mathbf{I}] \;\longrightarrow\; [\mathbf{I} \mid \mathbf{A}^{-1}]
$$

왼쪽에 0인 행이 생기면 $\mathbf{A}$는 가역이 아니다.

### 예시

$$
\left(\begin{array}{cc|cc} 2 & 1 & 1 & 0 \\ 1 & 1 & 0 & 1 \end{array}\right)
\xrightarrow{R_{1,2}(-\frac12)}
\left(\begin{array}{cc|cc} 2 & 1 & 1 & 0 \\ 0 & \frac12 & -\frac12 & 1 \end{array}\right)
\xrightarrow{R_2(2)}
\left(\begin{array}{cc|cc} 2 & 1 & 1 & 0 \\ 0 & 1 & -1 & 2 \end{array}\right)
$$

$$
\xrightarrow{R_{2,1}(-1)}
\left(\begin{array}{cc|cc} 2 & 0 & 2 & -2 \\ 0 & 1 & -1 & 2 \end{array}\right)
\xrightarrow{R_1(\frac12)}
\left(\begin{array}{cc|cc} 1 & 0 & 1 & -1 \\ 0 & 1 & -1 & 2 \end{array}\right)
$$

따라서 $\mathbf{A}^{-1} = \begin{pmatrix} 1 & -1 \\ -1 & 2 \end{pmatrix}$이고, $\mathbf{A}\mathbf{A}^{-1} = \mathbf{I}$로 확인된다.

- **가우스 소거법**: 행사다리꼴(선행성분 아래가 0)까지 만든다.
- **가우스-조르당 소거법**: 기약행사다리꼴(선행성분이 1이고, 그 열의 다른 성분이 모두 0)까지 만든다.

## 3. LU 분해

### 아이디어

행교환 없이 소거가 끝나면, 사용한 기본행렬은 모두 $R_{i,j}(c)$ ($i < j$) 형태이고 이들은 하삼각행렬이다.

$$
\underbrace{\mathbf{E}_k \cdots \mathbf{E}_1}_{\text{하삼각}}\mathbf{A} = \mathbf{U}\;(\text{상삼각})
\quad\Rightarrow\quad
\mathbf{A} = \underbrace{\mathbf{E}_1^{-1} \cdots \mathbf{E}_k^{-1}}_{\mathbf{L}}\,\mathbf{U}
$$

- $\mathbf{U}$: 소거 결과인 행사다리꼴
- $\mathbf{L}$: 소거에 쓴 **배수**를 기록한 하삼각행렬. $j$행에서 $i$행의 $l_{ji}$배를 뺐다면 $\mathbf{L}$의 $(j, i)$ 성분이 $l_{ji}$이고, 대각은 1이다.

하삼각행렬끼리의 곱과 (가역인) 하삼각행렬의 역행렬은 다시 하삼각행렬이다. 상삼각행렬도 마찬가지다. 그래서 $\mathbf{L}$이 하삼각으로 유지된다.

### 예시

$$
\mathbf{A} = \begin{pmatrix} 1 & 2 & 4 \\ 3 & 8 & 14 \\ 2 & 6 & 13 \end{pmatrix}
$$

| 단계 | 연산 | 배수 | 결과 |
|---|---|---|---|
| 1 | 2행 $-$ 3 $\times$ 1행 | $l_{21} = 3$ | 2행 $= (0, 2, 2)$ |
| 2 | 3행 $-$ 2 $\times$ 1행 | $l_{31} = 2$ | 3행 $= (0, 2, 5)$ |
| 3 | 3행 $-$ 1 $\times$ 2행 | $l_{32} = 1$ | 3행 $= (0, 0, 3)$ |

$$
\mathbf{A} = \mathbf{LU} =
\begin{pmatrix} 1 & 0 & 0 \\ 3 & 1 & 0 \\ 2 & 1 & 1 \end{pmatrix}
\begin{pmatrix} 1 & 2 & 4 \\ 0 & 2 & 2 \\ 0 & 0 & 3 \end{pmatrix}
$$

곱해 보면 3행은 $2(1, 2, 4) + 1(0, 2, 2) + (0, 0, 3) = (2, 6, 13)$으로 $\mathbf{A}$와 같다.

### 쓰임

$\mathbf{Ax} = \mathbf{b}$를 $\mathbf{Ly} = \mathbf{b}$(전진대입), $\mathbf{Ux} = \mathbf{y}$(후진대입) 두 번으로 푼다. $\mathbf{A}$가 같고 $\mathbf{b}$만 바뀌는 문제에서 분해를 한 번만 하면 된다. 또한 $\det(\mathbf{A}) = \det(\mathbf{U}) = u_{11}u_{22}\cdots u_{nn}$이다.

## 4. 행교환이 필요한 경우: PA = LU

피벗 자리에 0이 오면 행을 바꿔야 하고, 그러면 $\mathbf{L}$이 하삼각이 아니게 된다. 해결책은 **행교환을 모두 맨 오른쪽(가장 먼저 하는 연산)으로 옮기는 것**이다.

### 행교환 행렬 옮기기

$R_{k,l}$을 다른 기본행렬 오른쪽으로 넘길 때는, 그 기본행렬 첨자의 $k$와 $l$을 서로 바꾼다.

$$
R_{k,l}\,R_{i,j}(c) = R_{i',j'}(c)\,R_{k,l} \qquad (i', j' = i, j \text{에서 } k \leftrightarrow l)
$$

예를 들어 $R_{3,4}R_{2,4}(c) = R_{2,3}(c)R_{3,4}$이다. 양쪽 모두 "3행 자리에 (원래 4행 + $c \times$ 2행), 4행 자리에 원래 3행"을 만든다. 이 규칙을 반복하면

$$
\begin{aligned}
\mathbf{U} &= R_{3,4}(a_6)\,R_{3,4}\,\big(R_{2,4}(a_5)\,R_{2,3}(a_4)\big)\big(R_{1,4}(a_3)\,R_{1,2}(a_2)\,R_{1,3}(a_1)\big)R_{2,3}\,\mathbf{A} \\
&= R_{3,4}(a_6)\big(R_{2,3}(a_5)\,R_{2,4}(a_4)\big)\,R_{3,4}\,\big(R_{1,4}(a_3)\,R_{1,2}(a_2)\,R_{1,3}(a_1)\big)R_{2,3}\,\mathbf{A} \\
&= \underbrace{R_{3,4}(a_6)\,R_{2,3}(a_5)\,R_{2,4}(a_4)\,R_{1,3}(a_3)\,R_{1,2}(a_2)\,R_{1,4}(a_1)}_{\text{하삼각}}\;\underbrace{R_{3,4}\,R_{2,3}}_{\mathbf{P}}\,\mathbf{A}
\end{aligned}
$$

행교환을 모두 모은 $\mathbf{P}$는 **치환행렬**(각 행과 각 열에 1이 정확히 하나)이다. 따라서

$$
\mathbf{PA} = \mathbf{LU}
$$

**가역행렬은 항상** 적절한 치환행렬 $\mathbf{P}$에 대해 이렇게 분해된다.

## 5. 해의 존재와 유일성

### rank로 판정하기

$m \times n$ 행렬 $\mathbf{A}$와 첨가행렬 $[\mathbf{A} \mid \mathbf{b}]$를 소거하면 해의 개수가 rank로 정해진다. $r = \operatorname{rank}(\mathbf{A})$라 하면

| 조건 | 해 | 소거 결과의 모습 |
|---|---|---|
| $\operatorname{rank}[\mathbf{A} \mid \mathbf{b}] > r$ | 없음 | $(0 \cdots 0 \mid c)$, $c \neq 0$인 행이 생긴다 |
| $\operatorname{rank}[\mathbf{A} \mid \mathbf{b}] = r = n$ | 유일 | 모든 변수가 선행변수 |
| $\operatorname{rank}[\mathbf{A} \mid \mathbf{b}] = r < n$ | 무수히 많음 | 자유변수가 $n - r$개 |

해가 존재한다는 것은 $\mathbf{b}$가 $\mathbf{A}$의 열들의 선형결합, 즉 $\mathbf{b} \in C(\mathbf{A})$라는 뜻이다.

### 해집합의 구조

해가 있으면 모든 해는 **특수해 하나 + 동차방정식의 해** 꼴이다.

$$
\mathbf{x} = \mathbf{x}_p + \mathbf{x}_h, \qquad \mathbf{A}\mathbf{x}_p = \mathbf{b},\quad \mathbf{x}_h \in N(\mathbf{A})
$$

두 해의 차가 $\mathbf{A}(\mathbf{x}_1 - \mathbf{x}_2) = \mathbf{0}$을 만족하기 때문이다. 예를 들어 $x + 2y = 3$, $2x + 4y = 6$은 두 식이 사실상 같아서 $r = 1 < n = 2$이고

$$
\begin{pmatrix} x \\ y \end{pmatrix} = \begin{pmatrix} 3 \\ 0 \end{pmatrix} + t\begin{pmatrix} -2 \\ 1 \end{pmatrix}, \qquad t \in \mathbb{R}
$$

반면 두 번째 식이 $2x + 4y = 7$이면 소거 후 $(0\ \ 0 \mid 1)$이 생겨 해가 없다. 정사각행렬은 가역일 때 정확히 유일해 $\mathbf{x} = \mathbf{A}^{-1}\mathbf{b}$를 갖는다.

## 요약

| 항목 | 핵심 |
|---|---|
| 행 연산 | 기본행렬을 **왼쪽**에 곱하는 것 |
| 역행렬 구하기 | $[\mathbf{A} \mid \mathbf{I}] \to [\mathbf{I} \mid \mathbf{A}^{-1}]$ |
| 기본행렬의 역 | $R_{i,j}^{-1} = R_{i,j}$, $R_i(c)^{-1} = R_i(1/c)$, $R_{i,j}(c)^{-1} = R_{i,j}(-c)$ |
| LU 분해 | $\mathbf{L}$ = 소거 배수(대각 1), $\mathbf{U}$ = 행사다리꼴 |
| 행교환 필요 | $\mathbf{PA} = \mathbf{LU}$, $R_{k,l}$을 넘길 때 첨자 $k \leftrightarrow l$ |
| 해의 개수 | $\operatorname{rank}[\mathbf{A} \mid \mathbf{b}] > r$이면 없음, $= r = n$이면 유일, $= r < n$이면 $\mathbf{x}_p + N(\mathbf{A})$ |
| 쓰임 | 전진·후진대입으로 $\mathbf{Ax} = \mathbf{b}$ 반복 풀이, $\det\mathbf{A} = \prod u_{ii}$ |

## R / Python으로 확인

```r
A <- matrix(c(1, 3, 2, 2, 8, 6, 4, 14, 13), nrow = 3)

solve(matrix(c(2, 1, 1, 1), nrow = 2))   # 역행렬
solve(A, c(1, 2, 3))                     # Ax = b 풀이
qr(cbind(A, c(1, 2, 3)))$rank            # 첨가행렬의 rank

library(Matrix)
expand(lu(A))                            # P, L, U (A = P L U)
```

```python
import numpy as np
from scipy.linalg import lu

A = np.array([[1, 2, 4], [3, 8, 14], [2, 6, 13]], dtype=float)
P, L, U = lu(A)        # A = P @ L @ U (부분 피벗팅 때문에 P가 단위행렬이 아닐 수 있다)
np.linalg.inv([[2, 1], [1, 1]])          # [[ 1, -1], [-1,  2]]
np.linalg.solve(A, [1, 2, 3])            # Ax = b 풀이 (역행렬을 직접 구하지 않는다)
np.linalg.matrix_rank(np.c_[A, [1, 2, 3]])  # 첨가행렬의 rank
```

## 참고자료

- 하길찬, 『해설이 있는 선형대수학』
- 유호석, 「선형대수학」, 세종대학교, KOCW 공개강의

다음 글: [선형대수 - 행렬식, 치환과 보간다항식](/posts/la-determinant)
