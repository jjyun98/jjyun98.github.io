---
author: Jo YunHo
pubDatetime: 2025-06-04T14:00:00Z
modDatetime: 2025-06-05T14:00:00Z
title: 이커머스 고객 데이터 분석 (1) - 데이터 정제 및 탐색적 데이터 분석(EDA)
slug: "ecommerce-customer-analysis-part1-eda"
featured: false
draft: false
tags:
  - Python
  - Pandas
  - EDA
  - Data Cleansing
  - Visualization
description: "온라인 리테일 데이터셋을 활용하여 Pandas를 이용한 데이터 정제, 전처리 및 시각화를 통한 탐색적 데이터 분석(EDA) 과정을 상세히 다룹니다."
---

## Table of contents

## 1. 프로젝트 개요

이번 시리즈에서는 영국의 온라인 리테일 데이터를 활용하여 고객의 구매 패턴을 분석하고, 유의미한 인사이트를 도출하는 과정을 다룹니다. 데이터 분석의 가장 기본이 되는 데이터 정제(Data Cleansing)와 탐색적 데이터 분석(Exploratory Data Analysis, EDA)부터 시작하여, 최종적으로는 고객 세분화(Customer Segmentation)까지 진행할 예정입니다.

첫 번째 포스트에서는 본격적인 분석에 앞서 데이터를 불러오고, 분석에 적합한 형태로 가공하는 데이터 전처리 및 EDA 과정에 집중합니다.

## 2. 라이브러리 및 데이터 로딩

먼저 분석에 필요한 라이브러리를 가져옵니다. `pandas`와 `numpy`는 데이터 조작을 위해, `matplotlib`와 `seaborn`은 시각화를 위해 사용됩니다.

```python
import pandas as pd
import numpy as np
import seaborn as sns
import datetime as dt
import matplotlib.pyplot as plt
import matplotlib
# 한글 폰트 설정 (Mac OS 기준)
matplotlib.rcParams['font.family'] = 'AppleGothic'
# Windows 사용자의 경우
# matplotlib.rcParams['font.family'] = 'Malgun Gothic'
sns.set(font="AppleGothic") # 또는 "Malgun Gothic"
```

분석할 데이터는 약 54만 행으로 이루어져 있어 `read_excel` 대신 더 빠른 `read_parquet`을 사용하여 로딩했습니다.

```python
# parquet 파일을 읽어옵니다.
df = pd.read_parquet("online_retail.gzip")
df.head()
```

<details>
<summary>💡 Parquet이란?</summary>
<div>
Apache Parquet은 대용량 데이터셋 처리를 위해 설계된 컬럼 기반(Columnar) 스토리지 포맷입니다. 행 기반 포맷(예: CSV)보다 압축 효율이 높고, 특정 컬럼만 읽어올 때 디스크 I/O를 크게 줄여주어 분석 쿼리 성능이 훨씬 빠릅니다.
</div>
</details>

## 3. 데이터 기본 정보 확인 및 정제

데이터를 불러온 후에는 데이터의 구조, 결측치, 타입 등을 확인하며 기본 탐색을 진행합니다.

### 3.1. 데이터 정보 확인

`info()` 메소드를 통해 데이터프레임의 전체적인 정보를 파악합니다.

```python
df.info()
```
<details>
<summary>결과 확인</summary>

```
<class 'pandas.core.frame.DataFrame'>
RangeIndex: 541909 entries, 0 to 541908
Data columns (total 8 columns):
 #   Column       Non-Null Count   Dtype
---  ------       --------------   -----
 0   InvoiceNo    541909 non-null  object
 1   StockCode    541909 non-null  object
 2   Description  540455 non-null  object
 3   Quantity     541909 non-null  int64
 4   InvoiceDate  541909 non-null  datetime64[ns]
 5   UnitPrice    541909 non-null  float64
 6   CustomerID   406829 non-null  float64
 7   Country      541909 non-null  object
dtypes: datetime64[ns](1), float64(2), int64(1), object(4)
memory usage: 33.1+ MB
```
</details>

`Description`과 `CustomerID` 열에 결측치가 존재하는 것을 확인할 수 있습니다.

### 3.2. 결측치 처리

고객 기반 분석(RFM, 코호트 분석 등)을 수행하기 위해서는 고객을 식별할 수 있는 `CustomerID`가 필수적입니다. 따라서 `CustomerID`가 없는 행은 분석에서 제외합니다.

```python
# CustomerID가 없는 데이터 확인
print(f"CustomerID 결측치 개수: {df['CustomerID'].isnull().sum()}")

# CustomerID가 없는 행 제거
df.dropna(subset=['CustomerID'], inplace=True)
print(f"결측치 제거 후 CustomerID 결측치 개수: {df['CustomerID'].isnull().sum()}")
```

### 3.3. 데이터 타입 변경

`CustomerID`는 고유 식별자이므로 실수(float) 형태보다는 정수(integer) 형태로 관리하는 것이 더 명확합니다.

```python
df['CustomerID'] = df['CustomerID'].astype(int)
df.info()
```

## 4. 탐색적 데이터 분석 (EDA)

데이터 정제가 완료되었으니, 이제 본격적으로 데이터를 탐색하며 의미있는 패턴을 찾아보겠습니다.

### 4.1. 주문 취소 데이터 처리

`Quantity`가 음수인 경우는 '주문 취소'를 의미합니다. 전체 데이터에서 주문 취소 건은 얼마나 될까요?

```python
# Quantity가 0보다 작거나 같은 경우 (주문 취소)
df_cancel = df[df['Quantity'] <= 0]
print(f"주문 취소 건수: {len(df_cancel)}")
# 실행 결과: 주문 취소 건수: 8905

# InvoiceNo를 보면 'C'로 시작하는 것을 확인 할 수 있습니다.
df_cancel.head()
```
전체 데이터의 약 2.2%가 주문 취소에 해당합니다. 분석의 편의를 위해 주문 취소 건은 제외하고, 실제 거래가 완료된 데이터만 사용하겠습니다.

```python
df = df[df['Quantity'] > 0]
```

### 4.2. 매출액(TotalPrice) 변수 생성

개별 주문의 총액을 나타내는 `TotalPrice` 변수를 `Quantity`와 `UnitPrice`를 곱하여 생성합니다.

```python
df['TotalPrice'] = df['Quantity'] * df['UnitPrice']
df.head()
```

### 4.3. 국가별 매출 분석

어느 국가에서 가장 많은 매출이 발생했는지 확인해봅니다.

```python
# 상위 10개 국가별 매출 합계
country_sales = df.groupby('Country')['TotalPrice'].sum().sort_values(ascending=False)

plt.figure(figsize=(15, 7))
sns.barplot(x=country_sales.index[:10], y=country_sales.values[:10])
plt.title('상위 10개 국가별 총 매출액')
plt.xlabel('국가')
plt.ylabel('총 매출액')
plt.grid(axis='y', linestyle='--')
plt.show()
```
매출의 압도적인 부분이 **United Kingdom**에서 발생하는 것을 알 수 있습니다. 따라서 이번 분석은 영국 데이터에 집중하여 진행하겠습니다.

```python
df_uk = df[df['Country'] == 'United Kingdom'].copy()
print(f"영국 데이터 비율: {len(df_uk) / len(df):.2%}")
```

### 4.4. 시간별/월별/요일별 매출 트렌드 분석

시간의 흐름에 따른 매출 변화를 파악하기 위해 `InvoiceDate`에서 연도-월, 요일, 시간 정보를 추출합니다.

```python
# 연도-월 (YYYY-MM) 컬럼 생성
df_uk['YearMonth'] = df_uk['InvoiceDate'].dt.to_period('M').astype(str)

# 월별 매출액 계산
monthly_sales = df_uk.groupby('YearMonth')['TotalPrice'].sum()

# 월별 매출 시각화
plt.figure(figsize=(12, 6))
sns.barplot(x=monthly_sales.index, y=monthly_sales.values, palette='viridis')
plt.title('월별 총 매출액 (UK)')
plt.xlabel('연도-월')
plt.ylabel('총 매출액')
plt.xticks(rotation=45)
plt.grid(axis='y', linestyle='--')
plt.show()
```
전반적으로 매출이 증가하는 추세이며, 특히 2011년 하반기에 매출이 급증하는 것을 볼 수 있습니다. 2011년 12월의 매출이 낮은 이유는 데이터 수집이 월초(12월 9일)에 중단되었기 때문입니다.

요일별, 시간별 매출도 동일한 방식으로 분석해봅니다.

```python
# 요일 및 시간 정보 추출
df_uk['DayOfWeek'] = df_uk['InvoiceDate'].dt.day_name()
df_uk['Hour'] = df_uk['InvoiceDate'].dt.hour

# 요일 순서 정렬을 위한 카테고리 타입 설정
day_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Sunday"]

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(18, 6))

# 요일별 매출
sns.barplot(data=df_uk, x='DayOfWeek', y='TotalPrice', estimator=sum,
            order=day_order, ax=ax1, ci=None)
ax1.set_title('요일별 총 매출액')
ax1.set_xlabel('요일')
ax1.set_ylabel('총 매출액')

# 시간별 매출
sns.lineplot(data=df_uk, x='Hour', y='TotalPrice', estimator=sum, ax=ax2, ci=None)
ax2.set_title('시간대별 총 매출액')
ax2.set_xlabel('시간')
ax2.set_ylabel('총 매출액')
ax2.grid(True)

plt.show()
```
분석 결과, 토요일(Saturday)은 거래가 거의 없고, 주로 주중에 거래가 활발합니다. 시간대로는 점심시간(12시)을 기점으로 오후 3시까지 매출이 가장 높은 것으로 나타났습니다.

## 5. 마무리

이번 포스트에서는 본격적인 분석에 앞서 데이터를 정제하고, EDA를 통해 매출의 전반적인 트렌드를 파악했습니다.

- `CustomerID` 결측치 및 주문 취소 데이터를 제거하여 분석용 데이터를 만들었습니다.
- 대부분의 매출이 영국(United Kingdom)에서 발생함을 확인하고 분석 범위를 좁혔습니다.
- 월별, 요일별, 시간별 매출 트렌드를 시각화하여 주요 판매 시점을 확인했습니다.

다음 포스트에서는 **코호트 분석(Cohort Analysis)**을 통해 시간 경과에 따른 고객 유지율을 측정하고, 고객의 재방문 패턴을 심도 있게 분석해보겠습니다.