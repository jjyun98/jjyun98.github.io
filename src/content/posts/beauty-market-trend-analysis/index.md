---
title: '화장품 트렌드 분석 프로젝트 1: 데이터 수집 및 설계'
published: 2026-02-06
draft: false
description: '화장품 시장 트렌드 분석을 위한 올리브영 데이터 수집 및 데이터베이스 스키마 설계 과정을 소개합니다.'
series: '화장품 성분 분석 프로젝트'
tags: ['portfolio', 'data-analysis', 'sql', 'athena', 'web-scraping']
---

# 프로젝트 목표

최근 3개월간 급상승한 리뷰 키워드 분석을 통해 **차세대 주력 성분(ingredient) 및 신규 상품군을 제안**하는 것을 목표로 하는 '화장품 성분 분석 프로젝트'의 첫 번째 포스트입니다.

이번 포스트에서는 분석의 기반이 될 데이터를 수집하고, 분석에 용이하도록 데이터베이스를 설계하는 과정을 다룹니다.

## 1. 올리브영 카테고리 데이터 수집

올리브영에서 상품 리뷰를 가져오려면 먼저 상품 ID를 알아야 합니다. 상품 ID는 각 카테고리별 랭킹 페이지에서 수집할 수 있으므로, 우선 올리브영의 전체 상품 카테고리 구조를 파악하는 것부터 시작했습니다.

올리브영의 카테고리는 3개의 계층적 구조를 가지고 있습니다. 저는 이를 각각 large, mid, small로 명명했습니다. 아래 표와 같이 **대 → 중 → 소** 순서로 ID가 확장되는 규칙을 가지고 있습니다.

| **카테고리 레벨** | **카테고리 ID**     | **카테고리 명칭** | **비고**                   |
| ----------------- | ------------------- | ----------------- | -------------------------- |
| large             | 10000010001         | 스킨케어          | 최상위 분류                |
| mid               | 100000100010010     | 미스트/오일       | 스킨케어 내 세부분류       |
| small             | 1000001000100100001 | 미스트/픽서       | 최종 상품 리스트 추출 지점 |

각 카테고리 정보를 가져오는 스크래핑 코드는 `category_scraping.ipynb`에 구현되어 있습니다.

## 2. 데이터베이스 설계 (ERD)

수집한 데이터를 효율적으로 관리하고 분석하기 위해 데이터베이스 스키마를 설계했습니다. 데이터는 S3에 저장하고 AWS Athena를 사용해 쿼리할 예정입니다.

전체 데이터베이스의 구조는 다음과 같습니다.

```mermaid
erDiagram
    categories ||--o{ products : "categorizes"
    products ||--o{ reviews : "has"
    profiles ||--o{ reviews : "writes"
    reviews ||--o| keyword_chocolate : "analyzed"
    reviews ||--o| keyword_essence_serum : "analyzed"
    reviews ||--o| keyword_cream : "analyzed"
    reviews ||--o| keyword_healthy_snack : "analyzed"
    reviews ||--o| keyword_perfume : "analyzed"

    categories {
        bigint category_id PK
        string category_name
        string category_type
    }

    products {
        string goodsnumber PK
        string goodsname
        bigint category_id FK
        int rank
    }

    profiles {
        string profilekey PK
        boolean istopreviewer
        string membernickname
        double reviewerrank
        string skintone
        string skintype
        boolean skin_troubles_c01
        boolean skin_troubles_c02
        boolean skin_troubles_c13
    }

    reviews {
        bigint review_id PK
        string content
        bigint reviewscore
        boolean isrepurchase
        string reviewtype
        double usefulpoint
        string createddatetime
        bigint recommendcount
        string goods_id FK
        string category
        string profile_key FK
    }

    keyword_essence_serum {
        bigint review_id PK_FK
        int is_hyaluronic
        int is_cica
        int is_panthenol
        int is_pdrn
        int is_peptide
        int is_retinol
        int is_nmn
        int is_vitaminc
        int is_glutathione
        int is_niacinamide
        int is_spicule
        int is_exosome
    }

    keyword_cream {
        bigint review_id PK_FK
        int is_barrier
        int is_hyaluronic
        int is_pdrn
        int is_anti_aging
        int is_cica
        int is_trouble_care
    }

    keyword_chocolate {
        bigint review_id PK_FK
        int is_sugar_free
        int is_dark
        int is_milk
        int is_nut
        int is_salty
        int is_sour_fruit
    }

    keyword_healthy_snack {
        bigint review_id PK_FK
        int is_protein
        int is_zero_sugar
        int is_low_calorie
        int is_natural
        int is_grain
    }

    keyword_perfume {
        bigint review_id PK_FK
        int is_cotton_soap
        int is_floral
        int is_musk_woody
        int is_citrus
        int is_sweet
    }
```

### 테이블 구조 요약

| 구분 | 테이블명 | 주요 역할 |
|------|---------|----------|
| **기본** | `categories` | 제품 카테고리 분류 |
| **기본** | `products` | 올리브영 제품 정보 |
| **기본** | `profiles` | 리뷰어 프로필 (피부타입/고민) |
| **기본** | `reviews` | 리뷰 본문 + 메타데이터 |
| **분석** | `keyword_*` | 카테고리별 트렌드 키워드 분석 결과 |

## 3. 초기 데이터 탐색 (EDA) 및 테이블 생성

본격적인 분석에 앞서, 수집한 카테고리 데이터에 대한 간단한 탐색을 진행했습니다. 어떤 카테고리에 상품이 많이 분포해 있는지 확인하기 위해 Athena에서 다음 쿼리를 실행했습니다.

```sql
SELECT c.category_name, COUNT(DISTINCT p.goods_id) AS product_count
FROM categories AS c
JOIN products AS p ON c.category_id = p.category_id
WHERE c.category_type = 'small'
GROUP BY c.category_name
ORDER BY product_count DESC;
```

분석 결과, '에센스/세럼/앰플' 카테고리에 가장 많은 상품이 등록되어 있었습니다. 모든 카테고리에 대해 프로젝트를 진행하기에는 규모가 너무 크다고 판단하여, 등록 상품 수가 가장 많은 상위 5개 카테고리에 대해서만 분석을 진행하기로 결정했습니다.

이 데이터를 바탕으로 Athena에 테이블을 생성했습니다. `products`와 `profiles` 테이블의 생성 쿼리는 다음과 같습니다.

```sql title="products 테이블 생성"
CREATE EXTERNAL TABLE IF NOT EXISTS oliveyoung_db.products (
    goodsNumber STRING,
    goodsName STRING,
    category_id BIGINT,
    rank int
)
STORED AS PARQUET
LOCATION 's3://oliveyoung-reviews-yn/products/'
TBLPROPERTIES ('parquet.compress'='SNAPPY');
```

```sql title="profiles 테이블 생성"
CREATE EXTERNAL TABLE IF NOT EXISTS oliveyoung_db.profiles (
  profileKey STRING,
  isTopReviewer BOOLEAN,
  memberNickname STRING,
  reviewerRank DOUBLE,
  skinTone STRING,
  skinType STRING,
  skin_troubles_C01 BOOLEAN,
  skin_troubles_C02 BOOLEAN,
  skin_troubles_C03 BOOLEAN,
  skin_troubles_C04 BOOLEAN,
  skin_troubles_C05 BOOLEAN,
  skin_troubles_C06 BOOLEAN,
  skin_troubles_C07 BOOLEAN,
  skin_troubles_C08 BOOLEAN,
  skin_troubles_C09 BOOLEAN,
  skin_troubles_C10 BOOLEAN,
  skin_troubles_C11 BOOLEAN,
  skin_troubles_C12 BOOLEAN,
  skin_troubles_C13 BOOLEAN
)
STORED AS PARQUET
LOCATION 's3://oliveyoung-reviews-yn/profile/'
TBLPROPERTIES ("parquet.compress"="SNAPPY");
```

또한, 각 카테고리별 트렌드 키워드를 정규표현식으로 추출하여 별도의 `keyword` 테이블에 저장했습니다. 예를 들어 `cream` 카테고리의 키워드 테이블은 다음과 같이 생성됩니다.

```sql title="cream_keyword 테이블 생성"
CREATE EXTERNAL TABLE IF NOT EXISTS oliveyoung_db.cream_keyword (
    review_id BIGINT,
    is_Barrier INT,
    is_Hyaluronic INT,
    is_PDRN INT,
    is_Anti_Aging INT,
    is_Cica INT,
    is_Trouble_Care INT
)
STORED AS PARQUET
LOCATION 's3://oliveyoung-reviews-yn/reviews/keyword/cream/'
TBLPROPERTIES ('parquet.compression'='SNAPPY');
```

## 4. 핵심 지표 산출 로직

분석을 위해 다음과 같은 핵심 지표를 정의했습니다.

- **SOV (Share of Voice)**: 전체 리뷰 중 해당 키워드가 차지하는 비중
- **NSS (Net Sentiment Score)**: (긍정 리뷰 비율 - 부정 리뷰 비율)
- **MoM (Month-on-Month)**: 키워드 언급량의 월별 성장률

이 지표들을 계산하기 위한 SQL 쿼리의 예시는 다음과 같습니다. 아래는 '에센스/세럼' 카테고리의 월별 키워드 지표를 산출하는 쿼리입니다.

```sql title="에센스/세럼 카테고리 월별 키워드 지표 산출"
/*
=================================================================
Essence/Serum Keyword Analysis - Monthly Metrics
- 기간: 2024-08-01 ~ 2025-01-31
- 목적: 트렌드 키워드별 SOV, NSS, MoM 계산
=================================================================
*/

-- Step 1: 기간 내 에센스/세럼 리뷰 추출
WITH base_reviews AS (
  SELECT 
    r.review_id,
    date_parse(r.createddatetime, '%Y.%m.%d') as review_date,
    date_trunc('month', date_parse(r.createddatetime, '%Y.%m.%d')) as month,
    r.reviewscore,
    k.is_hyaluronic,
    k.is_cica,
    k.is_panthenol,
    k.is_pdrn,
    k.is_peptide,
    k.is_retinol,
    k.is_nmn,
    k.is_vitaminc,
    k.is_glutathione,
    k.is_niacinamide,
    k.is_spicule,
    k.is_exosome
  FROM reviews r
  INNER JOIN keyword_essence_serum k ON r.review_id = k.review_id
  WHERE date_parse(r.createddatetime, '%Y.%m.%d') BETWEEN DATE '2024-08-01' AND DATE '2025-01-31'
    AND r.category = 'essence_serum'
),

-- Step 2: 키워드별 unpivot (12개 키워드를 행으로)
keyword_unpivot AS (
  SELECT month, review_id, reviewscore, 'Hyaluronic' as keyword_name, is_hyaluronic as is_keyword FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Cica', is_cica FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Panthenol', is_panthenol FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'PDRN', is_pdrn FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Peptide', is_peptide FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Retinol', is_retinol FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'NMN', is_nmn FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'VitaminC', is_vitaminc FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Glutathione', is_glutathione FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Niacinamide', is_niacinamide FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Spicule', is_spicule FROM base_reviews
  UNION ALL
  SELECT month, review_id, reviewscore, 'Exosome', is_exosome FROM base_reviews
),

-- Step 3: 월별 전체 리뷰 수 계산
monthly_total AS (
  SELECT 
    month,
    COUNT(DISTINCT review_id) as total_reviews_in_month
  FROM base_reviews
  GROUP BY month
),

-- Step 4: 월별 키워드별 집계
monthly_keyword_stats AS (
  SELECT 
    month,
    keyword_name,
    -- 키워드 언급 리뷰 수
    SUM(is_keyword) as keyword_reviews,
    -- 긍정 리뷰 (4~5점)
    SUM(CASE WHEN is_keyword = 1 AND reviewscore >= 4 THEN 1 ELSE 0 END) as positive_reviews,
    -- 부정 리뷰 (1~2점)
    SUM(CASE WHEN is_keyword = 1 AND reviewscore <= 2 THEN 1 ELSE 0 END) as negative_reviews
  FROM keyword_unpivot
  WHERE is_keyword = 1  -- 키워드가 있는 리뷰만
  GROUP BY month, keyword_name
),

-- Step 5: SOV, NSS 계산
with_basic_metrics AS (
  SELECT 
    k.month,
    k.keyword_name,
    t.total_reviews_in_month as total_reviews,
    k.keyword_reviews,
    k.positive_reviews,
    k.negative_reviews,
    -- SOV
    ROUND(CAST(k.keyword_reviews AS DOUBLE) / NULLIF(t.total_reviews_in_month, 0) * 100, 2) as SOV,
    -- NSS
    ROUND(CAST(k.positive_reviews - k.negative_reviews AS DOUBLE) / NULLIF(k.keyword_reviews, 0) * 100, 2) as NSS
  FROM monthly_keyword_stats k
  INNER JOIN monthly_total t ON k.month = t.month
),

-- Step 6: MoM 계산 (윈도우 함수)
final_metrics AS (
  SELECT 
    month,
    keyword_name,
    total_reviews,
    keyword_reviews,
    positive_reviews,
    negative_reviews,
    SOV,
    NSS,
    -- 전월 키워드 리뷰 수
    LAG(keyword_reviews) OVER (PARTITION BY keyword_name ORDER BY month) as prev_month_reviews,
    -- MoM 성장률
    ROUND(
      (CAST(keyword_reviews AS DOUBLE) - LAG(keyword_reviews) OVER (PARTITION BY keyword_name ORDER BY month)) 
      / NULLIF(LAG(keyword_reviews) OVER (PARTITION BY keyword_name ORDER BY month), 0) 
      * 100, 
      2
    ) as MoM_growth
  FROM with_basic_metrics
)

SELECT 
  date_format(month, '%Y-%m') as month,
  keyword_name,
  total_reviews,
  keyword_reviews,
  positive_reviews,
  negative_reviews,
  SOV,
  NSS,
  prev_month_reviews,
  MoM_growth
FROM final_metrics
ORDER BY keyword_name, month;
```

## 5. 결론 및 다음 단계

이번 포스트에서는 화장품 트렌드 분석 프로젝트의 첫 단계로, 올리브영의 카테고리 데이터를 수집하고 분석을 위한 데이터베이스 스키마를 설계하는 과정을 살펴보았습니다.

다음 포스트에서는 실제 상품 리뷰 데이터를 수집하고, 오늘 설계한 지표들을 활용하여 유의미한 트렌드를 발견하는 과정을 보여드리겠습니다.





