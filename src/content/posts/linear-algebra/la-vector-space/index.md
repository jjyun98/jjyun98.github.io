---
title: '선형대수 - 벡터공간, 기저와 차원'
published: 2023-04-10
draft: false
description: '벡터공간과 내적공간의 공리, 부분공간과 생성, 일차독립, 기저와 차원, 행공간·열공간·영공간과 계수 정리'
series: '선형대수학'
tags: ['수학', 'R', 'Python']
---

벡터공간은 선형대수의 모든 개념이 놓이는 무대다. 이 글은 벡터공간과 내적공간의 공리, 부분공간과 생성, 일차독립, 기저와 차원, 행렬의 네 가지 기본 공간 중 행공간·열공간·영공간과 계수를 정리한다. 코드는 해당 절에 붙였고, 통계에서의 쓰임(공선성, 자유도, 추정 가능한 대비)과 비교 절을 더했다.

이전 글: [선형대수 - 행렬식, 치환과 보간다항식](/posts/la-determinant)

## 1. 벡터공간

### 공리

집합 $V$에 덧셈과 실수배가 정의되어 있고, 두 연산의 결과가 다시 $V$에 속하며(**닫힘**), 임의의 $\mathbf{u}, \mathbf{v}, \mathbf{w} \in V$, $h, k \in \mathbb{R}$에 대해 다음 8가지가 성립하면 $V$를 **벡터공간**이라 한다. 원소를 **벡터**라 부른다.

| | 덧셈 | | 실수배 |
|---|---|---|---|
| A1 | $(\mathbf{u} + \mathbf{v}) + \mathbf{w} = \mathbf{u} + (\mathbf{v} + \mathbf{w})$ | S1 | $1\mathbf{u} = \mathbf{u}$ |
| A2 | $\mathbf{u} + \mathbf{v} = \mathbf{v} + \mathbf{u}$ | S2 | $(hk)\mathbf{u} = h(k\mathbf{u})$ |
| A3 | 영벡터 $\mathbf{0}$이 존재해 $\mathbf{u} + \mathbf{0} = \mathbf{u}$ | S3 | $(h + k)\mathbf{u} = h\mathbf{u} + k\mathbf{u}$ |
| A4 | 역원 $-\mathbf{u}$가 존재해 $\mathbf{u} + (-\mathbf{u}) = \mathbf{0}$ | S4 | $k(\mathbf{u} + \mathbf{v}) = k\mathbf{u} + k\mathbf{v}$ |

공리에서 $0\mathbf{u} = \mathbf{0}$, $(-1)\mathbf{u} = -\mathbf{u}$가 따라 나온다.

### $\mathbb{R}^n$과 표준단위벡터

$\mathbb{R}^n = \{(x_1, \dots, x_n) \mid x_i \in \mathbb{R}\}$은 성분별 덧셈과 실수배로 벡터공간이 된다. $i$번째 성분만 1인 벡터 $\mathbf{e}_i$를 **표준단위벡터**라 한다.

$\mathbb{R}^n$의 벡터는 행벡터($M_{1,n}$)로도 열벡터($M_{n,1}$)로도 쓸 수 있다. 같은 공간이지만 어느 쪽으로 세웠는지 강조할 때 $\mathbb{R}^n_r$, $\mathbb{R}^n_c$로 구분해 쓰기도 한다.

## 2. 내적공간

벡터공간 $V$에 다음 네 조건을 만족하는 $\langle \cdot, \cdot \rangle$이 정의되면 **내적공간**이라 한다.

1. $\langle \mathbf{u}, \mathbf{u} \rangle \ge 0$이고, $\langle \mathbf{u}, \mathbf{u} \rangle = 0 \iff \mathbf{u} = \mathbf{0}$
2. $\langle \mathbf{u}, \mathbf{v} \rangle = \langle \mathbf{v}, \mathbf{u} \rangle$
3. $\langle \mathbf{u} + \mathbf{v}, \mathbf{w} \rangle = \langle \mathbf{u}, \mathbf{w} \rangle + \langle \mathbf{v}, \mathbf{w} \rangle$
4. $\langle k\mathbf{u}, \mathbf{v} \rangle = k\langle \mathbf{u}, \mathbf{v} \rangle$

내적으로 길이 $\lVert \mathbf{u} \rVert = \sqrt{\langle \mathbf{u}, \mathbf{u} \rangle}$를 정의하면, 모든 내적공간에서 **코시-슈바르츠 부등식**이 성립한다.

$$
\lvert\langle \mathbf{u}, \mathbf{v} \rangle\rvert \le \lVert \mathbf{u} \rVert \lVert \mathbf{v} \rVert
$$

등호는 두 벡터가 평행(한쪽이 다른 쪽의 상수배)일 때만 성립한다. 이 부등식 덕분에 $\cos\theta = \dfrac{\langle \mathbf{u}, \mathbf{v} \rangle}{\lVert \mathbf{u} \rVert \lVert \mathbf{v} \rVert}$로 사잇각을 정의할 수 있다.

## 3. 부분공간과 생성

### 부분공간

$V$의 부분집합 $W$가 $\mathbf{0}$을 포함하고 다음 두 조건을 만족하면 $W$는 그 자체로 벡터공간이 되며, $V$의 **부분공간**이라 한다.

$$
\mathbf{w}_1, \mathbf{w}_2 \in W \Rightarrow \mathbf{w}_1 + \mathbf{w}_2 \in W,
\qquad
\mathbf{w} \in W,\ k \in \mathbb{R} \Rightarrow k\mathbf{w} \in W
$$

나머지 공리는 $V$에서 물려받으므로 닫힘만 확인하면 된다.

$\mathbb{R}^2$에서 부분공간이 될 수 있는 것은 $\{\mathbf{0}\}$, 원점을 지나는 직선, 평면 전체뿐이다. 그럴듯해 보이지만 부분공간이 아닌 집합들과 비교하면 조건 하나하나의 역할이 드러난다.

![부분공간인 집합과 부분공간이 아닌 세 집합](./figures/fig-subspace-check.svg)

원점을 지나지 않는 직선은 $\mathbf{0}$을 포함하지 않는다. $0\mathbf{v} = \mathbf{0}$이 집합 밖으로 나가므로 실수배에 닫혀 있지 않은 것과 같다. 두 축의 합집합은 각 축 안에서는 닫혀 있지만, $(1, 0) + (0, 1) = (1, 1)$처럼 서로 다른 축의 벡터를 더하면 밖으로 나간다. 제1사분면은 덧셈에는 닫혀 있지만, 음수를 곱하면 제3사분면으로 나간다. 부분공간은 원점을 지나면서 어느 방향으로든 무한히 뻗어 있는 "평평한" 집합이다.

### 생성

$S = \{\mathbf{v}_1, \dots, \mathbf{v}_n\}$의 선형결합 전체

$$
\operatorname{span}(S) = \langle S \rangle = \{c_1\mathbf{v}_1 + \cdots + c_n\mathbf{v}_n \mid c_i \in \mathbb{R}\}
$$

는 항상 부분공간이다. 이를 $S$가 **생성하는** 부분공간이라 하고, $S$를 **생성집합**이라 한다.

### 부분공간의 교집합과 합

두 부분공간 $W_1, W_2$에 대해

- **교집합** $W_1 \cap W_2$는 부분공간이다.
- **합집합** $W_1 \cup W_2$는 일반적으로 부분공간이 **아니다**. 예를 들어 $x$축과 $y$축의 합집합에서 $(1, 0) + (0, 1) = (1, 1)$은 어느 축에도 없다.
- 대신 **합공간** $W_1 + W_2 = \{\mathbf{w}_1 + \mathbf{w}_2 \mid \mathbf{w}_1 \in W_1, \mathbf{w}_2 \in W_2\}$는 부분공간이고, $W_1 \cup W_2$를 포함하는 가장 작은 부분공간이다.

$$
\dim(W_1 + W_2) = \dim W_1 + \dim W_2 - \dim(W_1 \cap W_2)
$$

$\mathbb{R}^3$에서 $W_1 = \langle \mathbf{e}_1, \mathbf{e}_2 \rangle$($xy$평면), $W_2 = \langle \mathbf{e}_2, \mathbf{e}_3 \rangle$($yz$평면)이면 $W_1 + W_2 = \mathbb{R}^3$이고 교집합은 $y$축이다. 생성집합의 rank가 차원이므로 코드로 확인할 수 있다.

```r
W1 <- rbind(c(1, 0, 0), c(0, 1, 0)); W2 <- rbind(c(0, 1, 0), c(0, 0, 1))
r <- function(M) qr(M)$rank
c(r(W1), r(W2), r(rbind(W1, W2)))        # 2 2 3
r(W1) + r(W2) - r(rbind(W1, W2))         # 1 = dim(W1 ∩ W2)
```

$\dim W_1 = \dim W_2 = 2$, $\dim(W_1 + W_2) = 3$이므로 $\dim(W_1 \cap W_2) = 2 + 2 - 3 = 1$이다.

## 4. 일차독립

### 정의

$\mathbf{v}_1, \dots, \mathbf{v}_n$이 **일차독립**이라는 것은

$$
c_1\mathbf{v}_1 + \cdots + c_n\mathbf{v}_n = \mathbf{0} \;\Rightarrow\; c_1 = \cdots = c_n = 0
$$

이라는 뜻이다. 이를 만족하지 않으면(0이 아닌 $c_j$가 있으면) **일차종속**이다. 일차종속은 어떤 벡터 하나가 나머지의 선형결합으로 표현된다는 것과 같다. 벡터가 두 개일 때는 한쪽이 다른 쪽의 상수배, 즉 평행하다는 뜻이 된다.

### $\mathbb{R}^n$에서 판별하기

| 방법 | 판별 |
|---|---|
| 소거 | 벡터들을 행으로 쌓아 행사다리꼴로 만든다. 0인 행이 생기면 일차종속 |
| 행렬식 | $n$개의 벡터를 쌓은 $n \times n$ 행렬 $\mathbf{A}$에 대해, 일차독립 $\iff \det\mathbf{A} \neq 0$ |
| 개수 | $\mathbb{R}^n$에서 $n$개보다 많은 벡터는 항상 일차종속 |

$(1, 2, 3), (2, 3, 4), (3, 5, 7)$은 세 번째가 앞의 둘의 합이라 일차종속이다. 마지막 벡터를 $(1, 0, 1)$로 바꾸면 독립이다.

```r
V <- rbind(c(1, 2, 3), c(2, 3, 4), c(3, 5, 7))
qr(V)$rank                                # 2: 일차종속
qr(rbind(c(1, 2, 3), c(2, 3, 4), c(1, 0, 1)))$rank   # 3: 일차독립
```

rank가 벡터 개수(3)보다 작으면 일차종속이고, 같으면 독립이다. 행렬식으로도 같은 판정이 되지만 정사각일 때만 쓸 수 있고, rank는 모양에 관계없이 쓸 수 있다.

## 5. 기저와 차원

### 기저

유한집합 $B \subset V$가 다음 두 조건을 만족하면 $V$의 **기저**다.

1. $B$가 $V$를 생성한다: $\langle B \rangle = V$
2. $B$가 일차독립이다.

### 차원

같은 공간의 기저는 여러 가지지만 **원소의 개수는 항상 같다**. 이 개수를 **차원** $\dim V$라 한다. 예를 들어 $\dim\mathbb{R}^n = n$이고, $\{\mathbf{e}_1, \dots, \mathbf{e}_n\}$이 표준기저다.

$\dim V = n$일 때 다음이 성립한다.

- $n$개의 벡터는 **생성하거나 일차독립이기만 하면** 기저다. 둘 중 하나가 나머지를 보장한다.
- 부분공간 $W$에 대해 $\dim W \le n$이고, $\dim W = n$이면 $W = V$이다.

기저가 달라지면 같은 벡터의 좌표가 달라지지만, 기저 벡터의 개수는 그대로다.

![같은 벡터를 표준기저와 다른 기저로 나타낸 좌표](./figures/fig-two-bases.svg)

$\mathbf{v} = (3, 1)$은 표준기저로 $3\mathbf{e}_1 + 1\mathbf{e}_2$, 기저 $\{\mathbf{b}_1, \mathbf{b}_2\} = \{(1, 1), (1, -1)\}$로 $2\mathbf{b}_1 + 1\mathbf{b}_2$다. 기저는 공간에 격자를 까는 방법이고, 좌표는 그 격자에서 각 방향으로 몇 칸 갔는지를 적은 것이다. 격자의 모양은 바뀌어도 평면을 덮으려면 독립인 방향이 꼭 두 개 필요하다는 사실이 차원 $\dim \mathbb{R}^2 = 2$이다. 기저를 바꿀 때 좌표가 어떻게 변하는지는 [전이행렬](/posts/la-orthonormal)에서 다룬다.

## 6. 행렬의 공간과 계수

$m \times n$ 행렬 $\mathbf{A}$에 대해 다음 공간을 정의한다.

| 공간 | 정의 | 위치 |
|---|---|---|
| 열공간 $C(\mathbf{A})$ | 열들의 생성 $= \{\mathbf{A}\mathbf{x} \mid \mathbf{x} \in M_{n,1}\}$ | $M_{m,1}$의 부분공간 |
| 행공간 $R(\mathbf{A})$ | 행들의 생성 $= \{\mathbf{y}\mathbf{A} \mid \mathbf{y} \in M_{1,m}\}$ | $M_{1,n}$의 부분공간 |
| 영공간 $N(\mathbf{A})$ | $\{\mathbf{x} \mid \mathbf{A}\mathbf{x} = \mathbf{0}\}$ | $M_{n,1}$의 부분공간 |

### 열공간 = $\mathbf{Ax}$가 갈 수 있는 곳

$\mathbf{Ax}$는 $\mathbf{A}$의 열들의 선형결합이다.

$$
\begin{pmatrix} 1 & 2 & 3 & 0 \\ 2 & 3 & 4 & 1 \\ 5 & -1 & 7 & 2 \end{pmatrix}
\begin{pmatrix} x \\ y \\ z \\ w \end{pmatrix}
= x\begin{pmatrix} 1 \\ 2 \\ 5 \end{pmatrix} + y\begin{pmatrix} 2 \\ 3 \\ -1 \end{pmatrix} + z\begin{pmatrix} 3 \\ 4 \\ 7 \end{pmatrix} + w\begin{pmatrix} 0 \\ 1 \\ 2 \end{pmatrix}
$$

따라서 $\mathbf{Ax}$의 치역은 열공간이고, $\mathbf{Ax} = \mathbf{b}$에 해가 있다 $\iff \mathbf{b} \in C(\mathbf{A})$이다. 행공간은 전치로 연결된다: $R(\mathbf{A}) = C(\mathbf{A}^T)^T$.

### 행 연산은 행공간을 바꾸지 않는다

행 연산은 행들의 선형결합이고 되돌릴 수도 있으므로 행공간이 그대로다. 그래서 **기약행사다리꼴의 0이 아닌 행이 행공간의 기저**가 된다.

$$
\mathbf{A} = \begin{pmatrix} 1 & 1 & 0 \\ -1 & 1 & 2 \\ 0 & 2 & 2 \end{pmatrix}
\;\longrightarrow\;
\begin{pmatrix} 1 & 0 & -1 \\ 0 & 1 & 1 \\ 0 & 0 & 0 \end{pmatrix}
$$

세 행이 $R(\mathbf{A})$를 생성하지만 기저는 $\{(1, 0, -1), (0, 1, 1)\}$ 두 개면 충분하다. 즉 $\dim R(\mathbf{A}) = 2$이다.

### 계수: 행계수 = 열계수

$$
\mathbf{A} = \begin{pmatrix} 1 & 0 & 1 & 1 \\ 1 & 1 & 0 & 1 \\ 3 & 2 & 1 & 3 \end{pmatrix}
\;\longrightarrow\;
\begin{pmatrix} 1 & 0 & 1 & 1 \\ 0 & 1 & -1 & 0 \\ 0 & 0 & 0 & 0 \end{pmatrix},
\qquad
\mathbf{A}^T \;\longrightarrow\;
\begin{pmatrix} 1 & 0 & 1 \\ 0 & 1 & 2 \\ 0 & 0 & 0 \\ 0 & 0 & 0 \end{pmatrix}
$$

행공간과 열공간의 차원이 모두 2다. 이는 우연이 아니라 항상 성립하므로, 둘을 구분하지 않고 **계수**라 한다.

$$
\operatorname{rank}(\mathbf{A}) = \dim R(\mathbf{A}) = \dim C(\mathbf{A}) = \text{기약행사다리꼴의 선행성분 개수}
$$

### 영공간과 nullity

위의 $\mathbf{A}$로 $\mathbf{Ax} = \mathbf{0}$을 풀면, 기약행사다리꼴에서

- **선행변수** $x_1, x_2$: 선행성분이 있는 열. 다른 변수로 결정된다.
- **자유변수** $x_3, x_4$: 아무 값이나 가질 수 있다.

$$
x_1 = -x_3 - x_4,\quad x_2 = x_3
\quad\Rightarrow\quad
\mathbf{x} = x_3\begin{pmatrix} -1 \\ 1 \\ 1 \\ 0 \end{pmatrix} + x_4\begin{pmatrix} -1 \\ 0 \\ 0 \\ 1 \end{pmatrix}
$$

두 벡터가 $N(\mathbf{A})$의 기저이고, $\operatorname{nullity}(\mathbf{A}) = \dim N(\mathbf{A}) = 2$ = 자유변수의 개수다. 선행변수와 자유변수를 합치면 전체 변수이므로

$$
\operatorname{rank}(\mathbf{A}) + \operatorname{nullity}(\mathbf{A}) = n \;(\text{열의 수} = \text{변수의 수})
$$

이 차원정리는 다음 글들의 선형사상에서 $\dim\operatorname{Im}(L) + \dim\operatorname{Ker}(L) = \dim V$로 다시 등장한다.

### 네 가지 기본 부분공간

$\mathbf{A}^T$의 영공간 $N(\mathbf{A}^T) = \{\mathbf{y} \mid \mathbf{A}^T\mathbf{y} = \mathbf{0}\}$을 **좌영공간**이라 한다. $\mathbf{y}^T\mathbf{A} = \mathbf{0}^T$, 즉 왼쪽에서 곱해 0을 만드는 벡터들이다. 앞의 세 공간과 합쳐 **네 가지 기본 부분공간**이라 부른다.

![네 가지 기본 부분공간](./figures/fig-four-subspaces.svg)

| 공간 | 위치 | 차원 | 직교하는 짝 |
|---|---|---|---|
| 행공간 $R(\mathbf{A})$ | $\mathbb{R}^n$ | $r$ | 영공간 |
| 영공간 $N(\mathbf{A})$ | $\mathbb{R}^n$ | $n - r$ | 행공간 |
| 열공간 $C(\mathbf{A})$ | $\mathbb{R}^m$ | $r$ | 좌영공간 |
| 좌영공간 $N(\mathbf{A}^T)$ | $\mathbb{R}^m$ | $m - r$ | 열공간 |

- $\mathbf{Ax} = \mathbf{0}$은 $\mathbf{A}$의 모든 행과 $\mathbf{x}$의 내적이 0이라는 뜻이다. 그래서 영공간은 행공간에 수직이다. 같은 이유로 좌영공간은 열공간에 수직이다.
- 차원이 맞물려 $\mathbb{R}^n = R(\mathbf{A}) \oplus N(\mathbf{A})$, $\mathbb{R}^m = C(\mathbf{A}) \oplus N(\mathbf{A}^T)$로 나뉜다.
- $\mathbf{A}$는 행공간을 열공간으로 일대일 대응시키고 영공간은 $\mathbf{0}$으로 보낸다.
- 위 예시의 $\mathbf{A}$($3 \times 4$, rank 2)는 영공간이 $4 - 2 = 2$차원, 좌영공간이 $3 - 2 = 1$차원이다. 3행 = 1행 + 2 $\times$ 2행이므로 $\mathbf{y} = (1, 2, -1)^T$가 $\mathbf{y}^T\mathbf{A} = \mathbf{0}^T$를 만족한다.

같은 $\mathbf{A}$로 rank와 두 영공간을 계산한다.

```r
A <- matrix(c(1, 1, 3, 0, 1, 2, 1, 0, 1, 1, 1, 3), nrow = 3)

qr(A)$rank          # 2
MASS::Null(t(A))    # N(A)의 기저, 열 2개 (MASS::Null(M)은 M^T x = 0을 구하므로 t(A) 전달)
MASS::Null(A)       # 좌영공간 N(A^T)의 기저, 열 1개
crossprod(A, MASS::Null(A))   # A^T y = 0 확인: 모두 0
A %*% MASS::Null(t(A))        # A x = 0 확인: 모두 0
```

```python
import numpy as np
from scipy.linalg import null_space

A = np.array([[1, 0, 1, 1], [1, 1, 0, 1], [3, 2, 1, 3]], dtype=float)
np.linalg.matrix_rank(A)    # 2
null_space(A)               # N(A)의 정규직교기저, 열 2개
null_space(A.T)             # 좌영공간 N(A^T)의 기저, 열 1개
```

rank 2, 영공간 2개 열, 좌영공간 1개 열로 $2 + 2 = 4$(열의 수), $2 + 1 = 3$(행의 수)가 맞는다. 좌영공간의 기저는 $(-0.41, -0.82, 0.41)$로 앞서 구한 $(1, 2, -1)$에 비례한다.

**통계에서의 쓰임:**

- **완전공선성**은 $\mathbf{X}$의 열이 일차종속이라는 뜻이다. $\operatorname{rank}(\mathbf{X}) < p$이면 영공간에 0이 아닌 $\mathbf{x}$가 있어 $\mathbf{X}\boldsymbol\beta$가 같은 $\boldsymbol\beta$가 여러 개다. `lm(y ~ x1 + x2)`에서 `x2 = 3 * x1`이면 R은 계수 하나를 `NA`로 두고 rank 2인 모형으로 적합한다.
- **자유도**는 부분공간의 차원이다. 적합값 $\hat{\mathbf{y}}$는 열공간 $C(\mathbf{X})$ 위에 있어 모형 자유도가 $\operatorname{rank}(\mathbf{X})$이고, 잔차는 직교하는 좌영공간 $N(\mathbf{X}^T)$에 있어 잔차 자유도가 $n - \operatorname{rank}(\mathbf{X})$이다. 위의 공선 모형은 $n = 10$, 모형 자유도 2, 잔차 자유도 8이며 `summary(lm())$df`가 `2 8 3`으로 보고한다(세 번째 값은 `NA`를 포함한 모수의 수).
- **추정 가능한 대비**: $\mathbf{c}^T\boldsymbol\beta$는 $\mathbf{c}$가 $\mathbf{X}$의 행공간에 있을 때만 추정할 수 있다. 절편과 세 집단 더미를 모두 넣은 일원배치 설계행렬은 열이 4개인데 rank가 3이라 nullity가 1이다.

```r
g <- factor(rep(c("a", "b", "c"), each = 2))
X <- cbind(1, model.matrix(~ 0 + g))     # 절편 + 집단 3개: 열 4개
c(qr(X)$rank, ncol(X) - qr(X)$rank)      # rank 3, nullity 1
estimable <- function(cc) qr(rbind(X, cc))$rank == qr(X)$rank   # c가 행공간에 있는가
estimable(c(0, 1, -1, 0))                # TRUE : 집단 a와 b의 차
estimable(c(1, 1, 0, 0))                 # TRUE : 집단 a의 평균
estimable(c(0, 1, 0, 0))                 # FALSE: 효과 α_a 하나만으로는 안 됨
```

집단 간 차이와 집단 평균은 추정할 수 있지만 절편이나 집단 효과 하나만으로는 값이 정해지지 않는다. 영공간 방향 $(1, -1, -1, -1)$만큼 절편과 효과를 서로 옮겨도 $\mathbf{X}\boldsymbol\beta$가 같기 때문이다.

## 비교

**부분공간의 합과 교집합.** 합집합은 부분공간이 아니고, 합공간과 교집합이 부분공간이다.

| | 교집합 $W_1 \cap W_2$ | 합공간 $W_1 + W_2$ | 합집합 $W_1 \cup W_2$ |
|---|---|---|---|
| 부분공간인가 | 항상 | 항상 | 일반적으로 아님 |
| 정체 | 둘 모두에 속하는 벡터 | 두 공간의 벡터를 더한 것 전체 | 둘 중 하나에 속하는 벡터 |
| 차원 | $\dim W_1 + \dim W_2 - \dim(W_1 + W_2)$ | $\dim W_1 + \dim W_2 - \dim(W_1 \cap W_2)$ | 해당 없음 |

**네 가지 기본 부분공간.** $\mathbf{A}$가 $m \times n$, rank $r$일 때

| 공간 | 위치 | 차원 | 직교하는 짝 | 기저를 얻는 방법 |
|---|---|---|---|---|
| 행공간 $R(\mathbf{A})$ | $\mathbb{R}^n$ | $r$ | 영공간 | 기약행사다리꼴의 0이 아닌 행 |
| 영공간 $N(\mathbf{A})$ | $\mathbb{R}^n$ | $n - r$ | 행공간 | 자유변수로 푼 해 |
| 열공간 $C(\mathbf{A})$ | $\mathbb{R}^m$ | $r$ | 좌영공간 | 선행성분이 있는 열 |
| 좌영공간 $N(\mathbf{A}^T)$ | $\mathbb{R}^m$ | $m - r$ | 열공간 | $\mathbf{A}^T$의 영공간 |

**rank와 nullity.** rank는 독립인 열(또는 행)의 개수이고, nullity는 $\mathbf{Ax} = \mathbf{0}$의 자유변수 개수다. 둘의 합은 열의 수 $n$이다.

**일차독립과 생성.** 기저는 둘을 모두 만족하는 집합이다.

| | 일차독립 | 생성 |
|---|---|---|
| 뜻 | 불필요한 벡터가 없다 | 공간을 모두 덮는다 |
| 벡터가 너무 많으면 | 깨진다 ($n$개 초과면 종속) | 유지된다 |
| 벡터가 너무 적으면 | 유지된다 | 깨진다 ($n$개 미만이면 생성 못 함) |

$\dim V = n$이면 $n$개의 벡터는 둘 중 하나만 확인해도 기저다.

## 정리

| 개념 | 핵심 |
|---|---|
| 벡터공간 | 덧셈·실수배에 닫힘 + 8개 공리 |
| 부분공간 판정 | $\mathbf{0}$ 포함, 덧셈·실수배에 닫힘 |
| 교집합·합집합 | 교집합과 합공간 $W_1 + W_2$는 부분공간, 합집합은 일반적으로 아님 |
| 일차독립 | $\sum c_i\mathbf{v}_i = \mathbf{0} \Rightarrow$ 모든 $c_i = 0$ |
| 기저 | 생성 + 일차독립. $\dim V = n$이면 $n$개 벡터는 둘 중 하나만 확인 |
| 차원 | 기저 원소의 개수, 기저와 무관하게 일정 |
| 열공간 | $\mathbf{Ax}$의 치역, $\mathbf{Ax} = \mathbf{b}$ 해 존재 $\iff \mathbf{b} \in C(\mathbf{A})$ |
| 행공간 | 행 연산으로 불변, 기약행사다리꼴의 0 아닌 행이 기저 |
| 계수 | 행계수 = 열계수 = 선행성분 개수 |
| 네 부분공간 | $\mathbb{R}^n$: 행공간 $\perp$ 영공간 ($r$, $n - r$), $\mathbb{R}^m$: 열공간 $\perp$ 좌영공간 ($r$, $m - r$) |
| 차원정리 | $\operatorname{rank} + \operatorname{nullity} = $ 열의 수, nullity = 자유변수 개수 |

## 참고자료

- 하길찬, 『해설이 있는 선형대수학』
- 유호석, 「선형대수학」, 세종대학교, KOCW 공개강의

다음 글: [선형대수 - 정규직교기저와 최소제곱법](/posts/la-orthonormal)
