---
title: '선형대수 - 벡터와 행렬곱을 보는 여러 관점'
published: 2023-03-01
draft: false
description: '벡터의 선형결합, 내적과 외적, 행렬곱을 행벡터/열벡터/선형결합 관점에서 정리'
series: '선형대수학'
tags: ['선형대수학', '수학']
---

벡터의 선형결합에서 시작해 내적과 외적, 그리고 행렬곱을 바라보는 여러 관점을 정리한다.

원래 하나의 긴 노트였던 내용을 세 편으로 나누었다. 이 글은 그중 1편으로, 뒤의 가우스 소거법과 LU 분해를 이해하기 위한 기본 관점을 잡는 데 초점을 둔다.

## 1. 벡터의 선형결합

> **주어진 벡터로부터 새로운 벡터를 만드는 방법**<br>
> a) 한 벡터에 상수를 곱한다.<br>
> b) 두 벡터를 더하여 벡터합을 구한다.

<br>

즉, 세 벡터 a, b, c가 주어질 때, 이 벡터를 이용하여 만들 수 있는 새로운 벡터의 일반적인 형태는 다음과 같다.

<br>

$$v = \alpha a + \beta b +  \gamma c,\\ (\alpha, \beta, \gamma \in \mathbb{R})$$

<br>

이때 식의 우변처럼 상수배와 벡터의 합으로 표시된 형태를 벡터 a, b, c의 `선형결합(linear combination)` 또는 일차결합이라고 부른다. 벡터 v는 벡터 a, b, c로부터 `생성(span)`된다고 볼 수 있다.<br>
단, a, b, c를 항상 `기저(basis)`라고 부를 수 있는 것은 아니다. 기저는 어떤 벡터공간을 만들 수 있으면서도 불필요한 벡터가 없는, 즉 선형독립인 최소 생성 집합이다. 따라서 a, b, c가 해당 공간을 생성하고 서로 선형독립일 때 기저라고 부른다.

<br>

## 2. 벡터의 곱: 내적과 외적

벡터의 곱에는 두 가지 표현 방식이 있다.<br>
하나는 `내적(inner product)`이고, 또 하나는 `외적(cross product)`이다.<br>
내적의 경우 계산 결과가 `스칼라(scalar)`가 나오고,<br>
외적의 경우 `벡터(vector)`로 나오게 된다는 것이 차이다.

<br>

### 벡터의 내적

> **내적의 성질**<br>
> a) $a \cdot a \ge 0 $<br>
> b) $a \cdot b = b \cdot a$<br>
> c) $(a + b) \cdot c = a \cdot c + b \cdot c$<br>
> d) $(ka) \cdot b = k(a \cdot b) = a \cdot (k b)$

<br>

**벡터의 내적 정의**

case 1)

<br>

$$a \cdot b ~ = ~ \parallel a \parallel \parallel b \parallel cos  \theta $$

<br>

case 2)

$a = (a_1, a_2), b = (b_1, b_2)$ 형태의 성분일 때 다음과 같다. 

<br>

$$a \cdot b ~ = a_1 b_1 + a_2 b_2$$ 

<br>

### 벡터의 외적
<br>

**벡터의 외적 정의**

case 1)

<br>

$$\parallel a \times b \parallel ~ = ~ \parallel a \parallel \parallel b \parallel sin \theta $$

<br>

case 2)

$a = (a_1, a_2, a_3), b = (b_1, b_2, b_3)$ 형태의 성분일 때 다음과 같다.

<br>

$$a \times b ~ = ~ (a_2 b_3 - a_3 b_2, a_3 b_1 - a_1 b_3, a_1 b_2 - a_2 b_1)$$

<br>

외적의 성분 공식은 손으로 자주 계산할 일은 많지 않아서, 이 식이 왜 이런 꼴이 되는지에 대한 유도는 여기서는 생략한다.

<br>

외적의 정의에 의해 벡터 $a \times b$는 a와 수직이며 동시에 b와도 수직인 벡터이다. 방향은 오른손 법칙으로 정해진다.<br>
또한, $a \times b$와 방향이 반대인 벡터는 다음과 같은데

<br>

$$b \times a = - a \times b$$

<br>

이는 외적에서는 교환법칙이 성립하지 않음을 의미한다. 행렬곱에서도 일반적으로 교환법칙이 성립하지 않는데, 뒤에서 보듯 행렬곱 역시 순서에 따라 행과 열의 결합 방식이 달라진다.<br>
외적과 행렬식이 연결되는 대표적인 예시는 스칼라 삼중적이다.

<br>

$$
\begin{vmatrix}
\vec{i} & \vec{j} & \vec{k} \\
a_x & a_y & a_z \\
b_x & b_y & b_z \\
\end{vmatrix}
= \vec{a} \times \vec{b}
$$

<br>

또한 세 벡터 a, b, c에 대해 다음 값은 평행육면체의 부피와 연결된다.

<br>

$$
(\vec{a} \times \vec{b}) \cdot \vec{c}
=
\begin{vmatrix}
a_x & a_y & a_z \\
b_x & b_y & b_z \\
c_x & c_y & c_z \\
\end{vmatrix}
$$

<br>

**두 벡터의 크기**

<br>

$$\parallel a \times b \parallel  =  \parallel b \times a \parallel  =  \parallel a  \parallel \parallel b \parallel sin \theta$$

<br>

이는 곧 a와 b로 만들어지는 평행사변형의 넓이를 의미한다. 또한, 실수 k에 대해 벡터의 상수배는 두 벡터의 사잇각을 변화시키지 않으므로 교환법칙은 성립하지 않지만 상수배에 대해서는 다음이 성립한다.

<br>

$$ (k a) \times b = k(a \times b) = a \times (k b)$$


## 3. 행렬, 역행렬, 블록행렬, 행렬곱

식의 계수만을 이용하여 연립일차방정식을 간단하게 표현할 때 `행렬`을 사용한다. 이처럼 행렬을 이용하여 연립일차방정식을 나타내고, 더 나아가 미지수의 개수를 줄여가며 연립일차방정식의 해를 구하는 방법을 `가우스(가우스-조르당) 소거법`이라고 한다.<br>
또, 평면에서 각 점을 회전시키거나 대칭이동 시키는 함수는 특별한 성질을 갖는다. 이런 종류의 함수들을 `선형사상`이라고 부르는데 이는 항상 행렬을 사용하여 나타낼 수 있다.<br>
또한 행렬의 연산을 사용하면 두 선형사상에 대응되는 행렬과 선형사상의 연산에 대응되는 행렬 사이의 관계를 설명할 수 있다.

### 행렬과 그 연산

$m \times n$ 행렬 중 모든 성분이 0인 행렬을 `영행렬`이라 하고, $O_{m \times n}$ 또는 간단히 $O$로 나타낸다. 예를 들어, $O_{2 \times 2}$와 $O_{2 \times 3}$은 다음과 같다.

$$ 
O_{2 \times 2} = \begin{pmatrix}
0 & 0 \\
0 & 0
\end{pmatrix},~ O_{2 \times 3} = \begin{pmatrix}
0 & 0 & 0\\
0 & 0 & 0
\end{pmatrix}
$$

n차 정사각행렬 A의 성분 $a_{11}, a_{22}, \cdots, a_{nn}$을 A의 `주대각 성분`이라 하고, 이들 성분을 연결하는 가상의 대각선을 `주대각선`이라 한다. 특히 **정사각행렬 A의 주대각 성분을 제외한 모든 성분이 0일 때**, A를 `대각행렬`이라 하고,<br>

$$
A = Diag(a_{11}, a_{22}, \cdots, a_{nn})
$$

과 같이 나타낸다.<br>
또, 주 대각선 성분이 모두 같은 대각행렬을 `상수행렬`이라 하는데, 특히 모든 주대각 성분이 1인 n차 상수행렬을 n차 `단위행렬`이라 하고 $I_n$으로 나타낸다. 예를 들어, 다음은 $I_2, I_3$이다.

$$
I_2 = \begin{pmatrix}
1 & 0 \\
0 & 1
\end{pmatrix},~ I_3 = \begin{pmatrix}
1 & 0 & 0\\
0 & 1 & 0\\
0 & 0 & 1
\end{pmatrix}
$$

행렬의 성분이 모두 실수인 $m \times n$ 행렬들의 집합을 

$$ M_{m, n} $$

으로 나타낸다.<br>
특히 행렬이 $M_{1, n}$에 속할 때 `행벡터`, $M_{m, 1}$ 에 속할 때 `열벡터`라 부른다.<br>
$\mathbb{R}^2$에서 두 벡터 a와 b가 같은 벡터라는 것은 두 벡터의 같은 위치에 있는 각 성분이 같은 것을 의미하는 것처럼, $M_{m,n}$의 두 행렬 A, B가 다음 조건을 만족할 때, 서로 `같다`고 하고 A = B로 나타낸다.


$$
A = B ~ \Leftrightarrow ~ A_{ij} = B_{ij}
$$

<br>

**행렬의 연산에 대한 성질**

> a) A + B = B + A<br>
> b) A + (B + C) = (A + B) + C<br>
> c) A(BC) = (AB)C<br>
> d) A(B + C) = AB + AC<br>
> e) (A + B)C = AC + BC<br>
> f) k(A + B) = kA + kB<br>
> g) (k + l)A = kA + lA<br>
> h) (kl)A = k(lA) = l(kA)<br>
> i) k(AB) = (kA)B = A(kB)

<br>

### 역행렬

<br/>

$$AX = I_n = XA$$

를 만족하는 n차 정사각행렬 X가 존재하면 X는 곱셈에 대한 A의 역원이 되는데, 이 X를 A의 `역행렬`이라 한다. 또 행렬 A가 역행렬을 가질 때, `가역`이라 한다.

**역행렬의 성질**

n차 정사각행렬 $A, B$가 가역행렬이고, $k$가 0아닌 실수일 때, 다음이 성립한다.

> a) $A$의 역행렬은 유일하다.(따라서, 역행렬이 같다면 둘은 같은 행렬)<br>
> b) $A^{-1}$는 가역이고 $(A^{-1})^{-1} = A$이다.<br>
> c) $AB$는 가역이고, $(AB)^{-1} = B^{-1}A^{-1}$이다.<br>
> d) $kA$는 가역이고, $(kA)^{-1} = \frac{1}{k} A^{-1}$이다.

<br>

### 전치행렬

행렬 A가 $m \times n$ 행렬일 때, 행렬 A의 1행부터 m행을 차례로 1열부터 m열로 갖는 행렬을 A의 `전치행렬`이라하고, $A^T$로 나타낸다. 즉, $n \times m$ 행렬 $A^T$의 성분은 다음과 같다.<br>

$$ (A^T)_{ij} = A_{ji} (1 \le i, j \le n)$$

**전치행렬의 성질**
> a) $(A^T)^T = A$<br>
> b) $(kA)^T = kA^T$<br>
> c) $(A + B)^T = A^T + B^T$<br>
> d) 행렬곱이 정의될 때, $(AB)^T = B^TA^T$<br>
> e) A가 가역행렬이면 $A^T$도 가역이고, $(A^T)^{-1} = (A^{-1})^T$

<br>

### 대각합

A가 n차 정사각행렬일 때, **A의 주대각선성분을 모두 더한 것**을 A의 `대각합`이라고 하고 `Tr(A)`로 나타낸다. 즉, A의 대각합은 다음과 같다.

$$Tr(A) = A_{11} + A_{22} + \cdots + A_{nn} = \sum_{k=1}^{n} A_{kk}$$


**대각합 성질**
> a) $Tr(A^T) = Tr(A)$<br>
> b) $Tr(kA) = kTr(A)$<br>
> c) $Tr(A + B) = Tr(A) + Tr(B)$<br>
> d) $Tr(AB) = Tr(BA)$<br>
> e) $Tr(ABC) = Tr(CAB) = Tr(BCA) \ne Tr(ACB)$

<br>

### 블록행렬의 곱셈

주어진 행렬을 부분행렬들로 이루어진 블록행렬로 생각하여 연산하는 것이 편리한 경우가 있다. 예를 들어, 5 $\times$ 5 행렬 $A_1$는 다음과 같다.

$$
A = \begin{bmatrix}
    2 & 4 & 1 & 8 & 0 \\
    3 & 5 & 7 & 2 & 9 \\
    6 & 4 & 0 & 1 & 2 \\
    1 & 2 & 4 & 6 & 8 \\
    9 & 7 & 5 & 3 & 1
\end{bmatrix}
$$

그리고, 이는 네 개의 부분행렬로 나누어 보일 수 있다.

$$
A_1 = \begin{pmatrix}
X_1 & Y_1 \\
Z_1 & W_1
\end{pmatrix} 
$$

이때, 또 다른 5 $\times$ 5 행렬 $A_2$도 같은 방법으로 부분행렬 $X_2, Y_2, Z_2, W_2$로 이루어진 블록행렬로 생각하면 두 행렬의 곱 $A_1 A_2$ 는 성분을 이용한 행렬의 곱셈과 유사하게 아래와 같은 꼴로 표현 가능하다.

$$
A_1 A_2 = \begin{pmatrix}
X_1 & Y_1 \\
Z_1 & W_1
\end{pmatrix} 
\begin{pmatrix}
X_2 & Y_2 \\
Z_2 & W_2
\end{pmatrix} = 
\begin{pmatrix}
X_1X_2 + Y_1Z_2 & X_1Y_2 + Y_1W_2 \\
Z_1X_2 + W_1Z_2 & Z_1Y_2 + W_1W_2
\end{pmatrix}
$$

위의 식에서처럼 부분행렬들 사이의 곱이 잘 정의되도록 나누기만 하면 유사하게 블록행렬의 곱셈을 할 수 있다.

<br>

### 가우스-조르당 소거법

가우스-조르당 소거법이란 가우스 소거법으로 구한 행사다리꼴에서 각 선행성분을 포함하는 열에 `선행성분을 제외한 모든 성분이 0`이 되도록 계산하는 방법이다.

<br>

## 4. 행렬의 곱셈을 이해하는 4가지 방법

### A의 행벡터와 B의 열벡터의 곱 : 벡터의 내적으로 이해

<br>

행렬의 각 행을 행벡터로, 각 열을 열벡터로 이해할 때, 두 행렬 A와 B의 곱 AB의 (i, j)성분은 각 A의 i번째 행벡터와 B의 j번째 열벡터의 `내적`으로 이해할 수 있다.<br>
아래는 벡터의 내적으로 표현하는 모습

<br>

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix} 
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} = 

\begin{pmatrix}

\begin{pmatrix}
1 & 2 
\end{pmatrix}
\begin{pmatrix}
a \\
c 
\end{pmatrix}
&
\begin{pmatrix}
1 & 2 
\end{pmatrix}
\begin{pmatrix}
b \\
d 
\end{pmatrix} \\
\begin{pmatrix}
3 & 4 
\end{pmatrix}
\begin{pmatrix}
a \\
c 
\end{pmatrix} &
\begin{pmatrix}
3 & 4 
\end{pmatrix}
\begin{pmatrix}
b \\
d 
\end{pmatrix}

\end{pmatrix}

=
\begin{pmatrix}
1a+2c & 1b+2d \\
3a+4c & 3b+4d
\end{pmatrix}
$$

<br>

### A의 열벡터와 B의 행벡터의 곱: rank가 1인 행렬의 덧셈으로 이해

<br>

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix} 
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} = 

\begin{pmatrix}
1 \\
3
\end{pmatrix}
\begin{pmatrix}
a & b
\end{pmatrix}
+
\begin{pmatrix}
2 \\
4
\end{pmatrix}
\begin{pmatrix}
c & d
\end{pmatrix}

\\

=
\begin{pmatrix}
1a & 1b \\
3a & 3b
\end{pmatrix}
+
\begin{pmatrix}
2c & 2d \\
4c & 4d
\end{pmatrix}
=
\begin{pmatrix}
1a+2c & 1b+2d \\
3a+4c & 3b+4d
\end{pmatrix}
$$

이 관점에서는 앞 행렬의 열벡터와 뒤 행렬의 행벡터를 하나씩 묶어 생각한다. 즉, $\begin{pmatrix}1 \\ 3\end{pmatrix}$, $\begin{pmatrix}2 \\ 4\end{pmatrix}$로 묶고, $(a \ b)$, $(c \ d)$로 묶는다고 보면 된다.<br>
각 묶음의 곱은 스칼라 하나가 아니라 행렬 하나를 만들고, 최종 결과는 그런 행렬들의 합 $A_1B_1 + A_2B_2$로 이해할 수 있다.

<br>

### 행렬의 곱셈 AB: B의 행벡터들의 일차결합으로 이해

<br>

일반적으로 n개의 벡터 $v_1, v_2, \cdots, v_n$와 상수 $c_i(1 \le i \le n)$가 주어질 때,

$$c_1v_1 + c_2v_2 + \cdots + c_nv_n$$

을 주어진 벡터들의 `선형결합` 또는 `일차결합`이라고 한다. 이때, 두 행렬의 곱 AB의 i행은 A의 i행의 성분들과 B의 행벡터들의 일차결합으로 이해할 수 있다.

> 선형결합(일차결합): 여러 vector에 각각 숫자를 곱한 뒤, 그 결과를 더해 표현하는 형태<br>
> 그리고 이를 통해 새로운 vector의 꼴을 만드는 것을 `생성한다`라고 한다.

<br>

아래 예시에서 (a, b, c, d)로 이루어진 행렬을 행벡터 두 개의 묶음으로 생각해보자. 앞의 행렬 역시 두 개의 행으로 이루어진 2 $\times$ 1 행렬처럼 바라보면 결과는 다음과 같이 나온다. 다음 줄의 과정은 $(1 \ 2)$를 1 $\times$ 2로 보고, 뒤 행렬을 $(a \ b)$, $(c \ d)$로 묶은 2 $\times$ 1로 보는 것이다.<br>
그렇게 구한 결과는 최종적으로 다른 방식으로 구한 결과와 동일하다.<br>
즉, 행렬을 바라보는 다양한 관점이 중요하다.

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix} 
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix} = 

\begin{pmatrix}

\begin{pmatrix}
1 & 2 
\end{pmatrix}
\begin{pmatrix}
a & b\\
c & d
\end{pmatrix}
\\
\begin{pmatrix}
3 & 4 
\end{pmatrix}
\begin{pmatrix}
a & b\\
c & d
\end{pmatrix}

\end{pmatrix}

\\

=
\begin{pmatrix}

1  
\begin{pmatrix}
a & b
\end{pmatrix}
+
2
\begin{pmatrix}
c & d 
\end{pmatrix} \\
3 
\begin{pmatrix}
a & b
\end{pmatrix} +
4 
\begin{pmatrix}
c & d 
\end{pmatrix}

\end{pmatrix}
=\begin{pmatrix}
1a & 1b \\
3a & 3b
\end{pmatrix}
+
\begin{pmatrix}
2c & 2d \\
4c & 4d
\end{pmatrix}
=
\begin{pmatrix}
1a+2c & 1b+2d \\
3a+4c & 3b+4d
\end{pmatrix}

$$

<br>

행렬의 곱을 행벡터들의 일차결합으로 이해하는 방식을 응용해보면 연립방정식을 풀때나, 역행렬을 구할 때 유용하게 사용하는 가우스 소거법은 아래의 세 가지 종류의 행 기본연산을 반복하여 적용하는 방법이다.

> **행 기본연산**<br>
> a) 두 행의 위치를 바꾼다.<br>
> b) 한 행에 상수배를 한다.<br>
> c) 한 행에 상수배한 것을 다른 행에 더한다.

<br>

이때 예를 들어, 행렬 A가 아래와 같고 이를 기본 행 연산을 하여 얻어지는 행렬 $\hat{A}$가 아래와 같다고 하자.

<br>

$$
A = \begin{pmatrix}
1 & 2 & 1\\
0 & 1 & 1\\
1 & 1 & 2
\end{pmatrix},
\hat{A} = \begin{pmatrix}
1 & 2 & 1\\
0 & 1 & 1\\
0 & -1 & 1
\end{pmatrix}
$$

<br>

이를 단순히 "1행에 -1을 곱한 것을 3행에 더한다"라는 절차로만 보지 말고, A라는 행렬 앞에 X라는 행 연산 행렬을 곱해서 $\hat{A}$가 되었다고 받아들일 수 있어야 한다.<br>
변화 과정을 유추해보면, 1행, 2행은 변화가 없다. 그리고 3행은 1행 * -1 +3행으로 보이기에 이를 행렬로 표현하면 다음과 같다.

<br>

$$
X = \begin{pmatrix}
1 & 0 & 0\\
0 & 1 & 0\\
-1 & 0 & 1
\end{pmatrix}
$$

<br>

이는 1행은 그대로 가져오고, 2행도 그대로 가져오고, 3행 자리에는 1행에 -1을 곱한 값과 3행을 더한다는 뜻이 내포되어 있다.

**추가** 기본행 연산에 대한 표현을 다음과 같이 나타낼 수 있다.

$R_{1, 3}(-1)$ = 1행에 -1을 곱해서 3행에 더하라.

<br>

### 행렬의 곱셈 AB: A의 열벡터들의 일차결합으로 이해

<br>

$$
\begin{pmatrix}
1 & 2 \\
3 & 4
\end{pmatrix}
\begin{pmatrix}
a & b \\
c & d
\end{pmatrix}
=
\begin{pmatrix}
a
\begin{pmatrix}
1 \\
3
\end{pmatrix}
+
c
\begin{pmatrix}
2 \\
4
\end{pmatrix}
&
b
\begin{pmatrix}
1 \\
3
\end{pmatrix}
+
d
\begin{pmatrix}
2 \\
4
\end{pmatrix}
\end{pmatrix}
$$

<br>

위의 식의 경우 $(1, 3)^T, (2, 4)^T$을 각각 $\alpha, \beta$라고 보면 뒤의 행렬의 원소들이 계수처럼 곱의 형태가 된다. 엄밀히 말하면 a, b, c, d는 행렬곱에서 순서상 뒤에 위치하지만, 숫자로 생각하여 계수 자리에 놓아도 결과는 다른 관점으로 계산한 값과 동일하다.

<br>

<br>

## 다음 글

이 관점을 바탕으로 다음 글에서는 가우스-조르당 소거법, 역행렬, LU 분해를 정리한다.

- [선형대수 - 가우스 소거법, 역행렬과 LU 분해](/posts/la-gauss-lu)
