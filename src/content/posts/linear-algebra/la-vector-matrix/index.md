---
title: '선형대수 - 벡터와 행렬곱을 보는 여러 관점'
published: 2023-03-01
draft: false
description: '선형결합과 생성, 내적과 외적, 행렬 연산의 기본 성질, 행렬곱을 보는 네 가지 관점 정리'
series: '선형대수학'
tags: ['선형대수학', '수학']
---

선형대수 시리즈의 첫 글이다. 선형결합, 내적과 외적, 행렬 연산의 기본 성질을 정리하고, 이후 가우스 소거법과 LU 분해의 기반이 되는 행렬곱의 네 가지 관점을 다룬다.

## 1. 선형결합과 생성

벡터로 새 벡터를 만드는 연산은 **상수배**와 **덧셈** 두 가지뿐이다. 벡터 $\mathbf{v}_1, \dots, \mathbf{v}_n$과 스칼라 $c_1, \dots, c_n$에 대해

$$
c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + \cdots + c_n\mathbf{v}_n
$$

을 **선형결합**(일차결합)이라 하고, 가능한 모든 선형결합의 집합을 $\operatorname{span}\{\mathbf{v}_1, \dots, \mathbf{v}_n\}$이라 한다.

- **생성**: 어떤 공간의 모든 벡터가 $\mathbf{v}_i$들의 선형결합으로 표현되면, $\mathbf{v}_i$들이 그 공간을 생성한다고 한다.
- **기저**: 공간을 생성하면서 **선형독립**인 집합. 즉 불필요한 벡터가 없는 최소 생성 집합이다. 생성한다고 해서 항상 기저인 것은 아니다.

## 2. 내적과 외적

| | 내적 $\mathbf{a} \cdot \mathbf{b}$ | 외적 $\mathbf{a} \times \mathbf{b}$ |
|---|---|---|
| 결과 | 스칼라 | 벡터 ($\mathbb{R}^3$에서만 정의) |
| 기하 | $\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\cos\theta$ | 크기 $\lVert\mathbf{a}\rVert\lVert\mathbf{b}\rVert\sin\theta$, 방향은 오른손 법칙 |
| 교환법칙 | 성립 | 성립하지 않음, $\mathbf{b} \times \mathbf{a} = -\mathbf{a} \times \mathbf{b}$ |
| 의미 | 사잇각, 사영 | $\mathbf{a}, \mathbf{b}$에 모두 수직. 크기는 평행사변형 넓이 |

### 내적

성분으로 쓰면 $\mathbf{a} \cdot \mathbf{b} = a_1b_1 + a_2b_2 + \cdots + a_nb_n$이고, 다음 성질을 만족한다.

- $\mathbf{a} \cdot \mathbf{a} \ge 0$, 등호는 $\mathbf{a} = \mathbf{0}$일 때만 성립
- $\mathbf{a} \cdot \mathbf{b} = \mathbf{b} \cdot \mathbf{a}$
- $(\mathbf{a} + \mathbf{b}) \cdot \mathbf{c} = \mathbf{a} \cdot \mathbf{c} + \mathbf{b} \cdot \mathbf{c}$
- $(k\mathbf{a}) \cdot \mathbf{b} = k(\mathbf{a} \cdot \mathbf{b}) = \mathbf{a} \cdot (k\mathbf{b})$

$\mathbf{a} \cdot \mathbf{b} = 0$이면 두 벡터는 수직(직교)이다.

### 외적

$\mathbf{a} = (a_1, a_2, a_3)$, $\mathbf{b} = (b_1, b_2, b_3)$일 때 형식적인 행렬식으로 외우면 편하다.

$$
\mathbf{a} \times \mathbf{b} =
\begin{vmatrix}
\mathbf{i} & \mathbf{j} & \mathbf{k} \\
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3
\end{vmatrix}
= (a_2b_3 - a_3b_2,\; a_3b_1 - a_1b_3,\; a_1b_2 - a_2b_1)
$$

- 상수배는 사잇각을 바꾸지 않으므로 $(k\mathbf{a}) \times \mathbf{b} = k(\mathbf{a} \times \mathbf{b}) = \mathbf{a} \times (k\mathbf{b})$
- **스칼라 삼중적**: 세 벡터가 만드는 평행육면체의 (부호 있는) 부피이며, 행렬식과 같다.

$$
(\mathbf{a} \times \mathbf{b}) \cdot \mathbf{c} =
\begin{vmatrix}
a_1 & a_2 & a_3 \\
b_1 & b_2 & b_3 \\
c_1 & c_2 & c_3
\end{vmatrix}
$$

외적이 교환법칙을 만족하지 않는 것처럼, 행렬곱도 일반적으로 $\mathbf{AB} \neq \mathbf{BA}$이다.

## 3. 행렬의 기본

### 용어

| 용어 | 정의 |
|---|---|
| $M_{m,n}$ | 실수 성분 $m \times n$ 행렬 전체의 집합. $M_{1,n}$은 행벡터, $M_{m,1}$은 열벡터 |
| 영행렬 $\mathbf{O}$ | 모든 성분이 0 |
| 대각행렬 | 정사각행렬에서 주대각 성분 외에는 모두 0. $\operatorname{diag}(a_{11}, \dots, a_{nn})$ |
| 스칼라행렬 | 주대각 성분이 모두 같은 대각행렬, $k\mathbf{I}_n$ |
| 단위행렬 $\mathbf{I}_n$ | 주대각 성분이 모두 1인 대각행렬 |
| 행렬의 상등 | $\mathbf{A} = \mathbf{B} \iff$ 크기가 같고 모든 $(i,j)$에서 $a_{ij} = b_{ij}$ |

### 연산 성질

덧셈은 교환·결합법칙, 곱셈은 결합법칙과 분배법칙이 성립한다.

$$
\mathbf{A}(\mathbf{BC}) = (\mathbf{AB})\mathbf{C}, \qquad
\mathbf{A}(\mathbf{B} + \mathbf{C}) = \mathbf{AB} + \mathbf{AC}, \qquad
k(\mathbf{AB}) = (k\mathbf{A})\mathbf{B} = \mathbf{A}(k\mathbf{B})
$$

곱셈의 교환법칙은 일반적으로 성립하지 않는다.

### 역행렬, 전치행렬, 대각합

$n$차 정사각행렬 $\mathbf{A}$에 대해 $\mathbf{AX} = \mathbf{XA} = \mathbf{I}_n$인 $\mathbf{X}$가 있으면 이를 **역행렬** $\mathbf{A}^{-1}$이라 하고, $\mathbf{A}$를 **가역**이라 한다. $m \times n$ 행렬 $\mathbf{A}$의 **전치행렬** $\mathbf{A}^T$는 $(\mathbf{A}^T)_{ij} = a_{ji}$인 $n \times m$ 행렬이다. **대각합**은 $\operatorname{tr}(\mathbf{A}) = \sum_{k=1}^{n} a_{kk}$이다.

| 역행렬 ($\mathbf{A}, \mathbf{B}$ 가역, $k \neq 0$) | 전치행렬 | 대각합 |
|---|---|---|
| 역행렬은 유일하다 | $(\mathbf{A}^T)^T = \mathbf{A}$ | $\operatorname{tr}(\mathbf{A}^T) = \operatorname{tr}(\mathbf{A})$ |
| $(\mathbf{A}^{-1})^{-1} = \mathbf{A}$ | $(k\mathbf{A})^T = k\mathbf{A}^T$ | $\operatorname{tr}(k\mathbf{A}) = k\operatorname{tr}(\mathbf{A})$ |
| $(\mathbf{AB})^{-1} = \mathbf{B}^{-1}\mathbf{A}^{-1}$ | $(\mathbf{A} + \mathbf{B})^T = \mathbf{A}^T + \mathbf{B}^T$ | $\operatorname{tr}(\mathbf{A} + \mathbf{B}) = \operatorname{tr}(\mathbf{A}) + \operatorname{tr}(\mathbf{B})$ |
| $(k\mathbf{A})^{-1} = \frac{1}{k}\mathbf{A}^{-1}$ | $(\mathbf{AB})^T = \mathbf{B}^T\mathbf{A}^T$ | $\operatorname{tr}(\mathbf{AB}) = \operatorname{tr}(\mathbf{BA})$ |
| $(\mathbf{A}^T)^{-1} = (\mathbf{A}^{-1})^T$ | | $\operatorname{tr}(\mathbf{ABC}) = \operatorname{tr}(\mathbf{CAB}) = \operatorname{tr}(\mathbf{BCA})$ |

곱의 역행렬과 전치는 **순서가 뒤집힌다**. 대각합은 **순환(cyclic) 순서**로만 바꿀 수 있으며, 일반적으로 $\operatorname{tr}(\mathbf{ABC}) \neq \operatorname{tr}(\mathbf{ACB})$이다.

### 블록행렬의 곱

부분행렬끼리의 곱이 정의되도록 나누기만 하면, 블록을 성분처럼 취급해 곱할 수 있다.

$$
\begin{pmatrix} \mathbf{X}_1 & \mathbf{Y}_1 \\ \mathbf{Z}_1 & \mathbf{W}_1 \end{pmatrix}
\begin{pmatrix} \mathbf{X}_2 & \mathbf{Y}_2 \\ \mathbf{Z}_2 & \mathbf{W}_2 \end{pmatrix}
=
\begin{pmatrix}
\mathbf{X}_1\mathbf{X}_2 + \mathbf{Y}_1\mathbf{Z}_2 & \mathbf{X}_1\mathbf{Y}_2 + \mathbf{Y}_1\mathbf{W}_2 \\
\mathbf{Z}_1\mathbf{X}_2 + \mathbf{W}_1\mathbf{Z}_2 & \mathbf{Z}_1\mathbf{Y}_2 + \mathbf{W}_1\mathbf{W}_2
\end{pmatrix}
$$

블록끼리도 곱의 순서를 바꾸면 안 된다($\mathbf{Y}_1\mathbf{Z}_2 \neq \mathbf{Z}_2\mathbf{Y}_1$).

## 4. 행렬곱을 보는 네 가지 관점

예시는 모두 같은 곱이다.

$$
\mathbf{AB} =
\begin{pmatrix} 1 & 2 \\ 3 & 4 \end{pmatrix}
\begin{pmatrix} a & b \\ c & d \end{pmatrix}
=
\begin{pmatrix} a + 2c & b + 2d \\ 3a + 4c & 3b + 4d \end{pmatrix}
$$

### 관점 1. 행 · 열 = 내적

$(\mathbf{AB})_{ij}$는 $\mathbf{A}$의 $i$행과 $\mathbf{B}$의 $j$열의 내적이다. 성분 하나를 계산할 때 쓰는 기본 방식이다.

$$
(\mathbf{AB})_{12} = \begin{pmatrix} 1 & 2 \end{pmatrix}\begin{pmatrix} b \\ d \end{pmatrix} = b + 2d
$$

### 관점 2. 열 × 행 = rank 1 행렬의 합

$\mathbf{A}$의 $k$번째 열과 $\mathbf{B}$의 $k$번째 행의 곱(외적 형태)은 rank 1 행렬이고, $\mathbf{AB}$는 그 합이다.

$$
\mathbf{AB} = \sum_{k} (\mathbf{A}\text{의 } k\text{열})(\mathbf{B}\text{의 } k\text{행})
= \begin{pmatrix} 1 \\ 3 \end{pmatrix}\begin{pmatrix} a & b \end{pmatrix}
+ \begin{pmatrix} 2 \\ 4 \end{pmatrix}\begin{pmatrix} c & d \end{pmatrix}
= \begin{pmatrix} a & b \\ 3a & 3b \end{pmatrix} + \begin{pmatrix} 2c & 2d \\ 4c & 4d \end{pmatrix}
$$

SVD처럼 행렬을 rank 1 조각의 합으로 분해할 때 이 관점이 쓰인다.

### 관점 3. $\mathbf{AB}$의 행 = $\mathbf{B}$의 행들의 선형결합

$\mathbf{AB}$의 $i$행은 $\mathbf{A}$의 $i$행 성분을 계수로 한 $\mathbf{B}$의 행들의 선형결합이다.

$$
(\mathbf{AB})\text{의 1행} = 1\begin{pmatrix} a & b \end{pmatrix} + 2\begin{pmatrix} c & d \end{pmatrix}
$$

따라서 **왼쪽에 곱하는 행렬은 행 연산**이다. 가우스 소거법의 기본 행 연산은 다음 세 가지다.

1. 두 행을 바꾼다.
2. 한 행에 0이 아닌 상수를 곱한다.
3. 한 행의 상수배를 다른 행에 더한다.

각 행 연산은 단위행렬에 같은 연산을 한 **기본행렬**을 왼쪽에 곱하는 것과 같다. 예를 들어 "1행의 $-1$배를 3행에 더한다"($R_{1,3}(-1)$)는

$$
\underbrace{\begin{pmatrix} 1 & 0 & 0 \\ 0 & 1 & 0 \\ -1 & 0 & 1 \end{pmatrix}}_{\mathbf{E}}
\underbrace{\begin{pmatrix} 1 & 2 & 1 \\ 0 & 1 & 1 \\ 1 & 1 & 2 \end{pmatrix}}_{\mathbf{A}}
=
\begin{pmatrix} 1 & 2 & 1 \\ 0 & 1 & 1 \\ 0 & -1 & 1 \end{pmatrix}
$$

$\mathbf{E}$의 3행 $(-1, 0, 1)$이 "1행 $\times(-1)$ + 3행 $\times 1$"을 그대로 적은 것이다.

### 관점 4. $\mathbf{AB}$의 열 = $\mathbf{A}$의 열들의 선형결합

$\mathbf{AB}$의 $j$열은 $\mathbf{B}$의 $j$열 성분을 계수로 한 $\mathbf{A}$의 열들의 선형결합이다.

$$
(\mathbf{AB})\text{의 1열} = a\begin{pmatrix} 1 \\ 3 \end{pmatrix} + c\begin{pmatrix} 2 \\ 4 \end{pmatrix}
$$

따라서 **오른쪽에 곱하는 행렬은 열 연산**이고, $\mathbf{A}\mathbf{x}$는 $\mathbf{A}$의 열들의 선형결합이다. $\mathbf{A}\mathbf{x} = \mathbf{b}$에 해가 있다는 것은 $\mathbf{b}$가 $\mathbf{A}$의 열공간에 있다는 뜻이다.

## 요약

| 관점 | 식 | 쓰이는 곳 |
|---|---|---|
| 행 · 열 내적 | $(\mathbf{AB})_{ij} = (\mathbf{A}\text{의 } i\text{행}) \cdot (\mathbf{B}\text{의 } j\text{열})$ | 성분 계산 |
| 열 × 행의 합 | $\mathbf{AB} = \sum_k \mathbf{a}_k \mathbf{b}_k^T$ | rank 1 분해, SVD |
| 행의 선형결합 | $\mathbf{AB}$의 행 = $\mathbf{B}$ 행들의 결합 | 행 연산, 가우스 소거법 |
| 열의 선형결합 | $\mathbf{AB}$의 열 = $\mathbf{A}$ 열들의 결합 | 열공간, $\mathbf{Ax} = \mathbf{b}$의 해 존재 |

| 자주 헷갈리는 것 | 정리 |
|---|---|
| 곱의 역행렬·전치 | $(\mathbf{AB})^{-1} = \mathbf{B}^{-1}\mathbf{A}^{-1}$, $(\mathbf{AB})^T = \mathbf{B}^T\mathbf{A}^T$ |
| 대각합 | $\operatorname{tr}(\mathbf{AB}) = \operatorname{tr}(\mathbf{BA})$, 세 개 이상은 순환 순서만 |
| 외적 | $\mathbb{R}^3$ 전용, 반교환 $\mathbf{b} \times \mathbf{a} = -\mathbf{a} \times \mathbf{b}$ |
| 생성 vs 기저 | 기저 = 생성 + 선형독립 |

다음 글: [선형대수 - 가우스 소거법, 역행렬과 LU 분해](/posts/la-gauss-lu)
