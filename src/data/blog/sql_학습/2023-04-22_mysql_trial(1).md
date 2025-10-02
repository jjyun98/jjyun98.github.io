---
title: MYSQL begining (1)
description: "MySQL 기본 사용법과 주요 SQL 쿼리문 학습 노트입니다. SELECT, WHERE, JOIN, 서브쿼리 등 데이터베이스 조작의 핵심 개념들을 다룹니다."
pubDatetime: 2023-04-22T00:00:00Z
modDatetime: 2025-08-10T00:00:00Z
author: "Jo YunHo"
slug: "mysql-step-1"
featured: false
draft: false
tags:
  - SQL
---
참고: MYSQL로 배우는 데이터베이스 개론

`terminal`에서 `mysql`이용하기

## Table of contents

## 기본조작

**mysql 실행**  
먼저 terminal을 실행한다.

서버 상태 확인
```sql
brew services list | grep mysql
```

서버가 실행중이면 바로 접속
```sql
mysql -u root # 비밀번호 사용안한다면
```

서버가 중지되어 있으면 시작

```sql
brew services start mysql # 서버 시작
mysql -u root # 접속
```

**종료하기**

```sql
EXIT
```

**DB사용**

어떠한 DB가 있는지 확인하기

```sql
SHOW DATABASES;
```

## Book Table 

이 중에서 madang DB를 사용하기

```sql
USE madang;
```

madang DB에서 테이블을 보기

```sql
SHOW TABLES;
```

테이블 4개가 나온다. 이 중에서 Book이라는 테이블에 어떠한 field가 있는지 보고싶다.

```sql
DESCRIBE Book;
```

### SELECT 

테이블에서 필요로 하는 열만 가져올 때 사용

4가지 field에서 bookid안에 무엇이 들었나 확인해보고 싶다.(*은 모두 의미)

```sql
SELECT * FROM Book;
```

이 중에서 bookname과 price가 동시에 보고 싶다.

```sql
SELECT bookname, price FROM Book;
```

#### DISTINCT
- 중복 제거

```sql
SELECT DISTINCT publisher
FROM Book;
```

### WHERE
- 조회하는 결과에 특정한 조건으로 원하는 데이터만 보고 싶을 때 사용

> SELECT 필드이름  
> FROM 테이블이름  
> WHERE 조건식;

```sql
SELECT *
FROM Book 
WHERE price > 10000;
```

- 응용1

```sql
SELECT *
FROM Book
WHERE price > 10000
AND price < 15000;
```

- 응용2

```sql
SELECT *
FROM Book
WHERE price < 30000 
AND publisher = '대한미디어';
```

#### BETWEEN

```sql
SELECT *
FROM Book
WHERE price BETWEEN 15000 AND 30000 ;
```

#### IN

```sql
SELECT *
FROM Book
WHERE publisher IN('굿스포츠', '나무수', '대한미디어');
```

### LIKE
- 테이블의 열에서 패턴을 검색하는데 사용  
`SELECT`문과 함께 사용시 패턴 일치에 따라 데이터를 검색

- "축구"라는 단어를 포함한 bookname을 검색

```sql
SELECT *
FROM Book
WHERE bookname LIKE '%축구%';
```

### ORDER BY
- 데이터베이스에서 가져온 결과를 정렬하는데 사용

```sql
SELECT *
FROM Book
ORDER BY bookname;
```

- 응용1  
1순위 2순위 이런 식의 기준으로 검색하기

```sql
SELECT *
FROM Book
ORDER BY price, bookname;
```

- 응용2  
1순위 가격을 기준으로 내림차순 만약 가격이 같을 시 출판사를 기준으로 오름차순하기

```sql
SELECT *
FROM Book
ORDER BY price DESC, publisher ASC;
```

## Orders Table

### 집계 함수

#### SUM

- 고객이 주문한 도서의 총 판매액

```sql
SELECT SUM(saleprice)
FROM Orders;
```

- 결과를 다른 이름으로 출력되게 하기

```sql
SELECT SUM(saleprice) AS 총매출
FROM Orders;
```

- 2번 고객이 주문한 도서의 총 판매액

```sql
SELECT SUM(saleprice)
FROM Orders
WHERE custid = 2;
```

#### GROUP BY

#### HAVING
- group화된 데이터에 대한 조건을 지정할 때 사용

### 조인

```sql
SELECT *
FROM Customer, Orders;
```

- 응용

Customer Table의 custid와 Orders Table의 custid가 동일한 조건이 달린 경우

```sql
SELECT *
FROM Customer, Orders
WHERE Customer.custid = Orders.custid;
```

### 외부조인
LEFT OUTER JOIN

### 서브쿼리
- 쿼리안의 쿼리 꼴  
안에 들어가는 쿼리의 결과를 모를 때 사용(두번 질문 안하기 위해서), 당연하게도 첫 번째 쿼리문으로 답을 얻고 두 번째 쿼리문안에 그 답을 넣어도 똑같은 결과 나온다.

```sql
SELECT bookname
FROM Book
WHERE price = (SELECT MAX(price)
FROM Book);
```

여기서 

```sql
SELECT MAX(price)
FROM Book;
```

결과는 35000이 나온다.

따라서 아래와 같은 결과가 나온다.

```sql
SELECT bookname
FROM Book
WHERE price = 35000;
```

- 응용
  
```sql
SELECT name
FROM Customer
WHERE custid IN(SELECT custid
FROM Orders);
```

아래의 결과는 다음과 같다.

```sql
SELECT custid
FROM Orders;
```

결과를 보면 {1, 2, 3, 4}가 있는지를 알아보지만 IN연산자가 중복을 제거하는 것은 아니기에  
처리 과정속에서는 1이 있나? 3번 확인하고, 2가 있나? 2번 확인하고 이런 식으로 작동된다.

- 응용2  
3개 이상의 중첩도 가능하다.

Q) 대한미디어에서 출판한 도서를 구매한 고객의 이름을 보이시오.

```sql
SELECT name
FROM Customer
WHERE custid IN(SELECT custid
         