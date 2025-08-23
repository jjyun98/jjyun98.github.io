---
author: Jo YunHo
pubDatetime: 2025-01-29T09:22:00Z
modDatetime: 2025-01-31T10:12:47Z
title: 웹 크롤링을 위한 CSS 기초 (2)
slug: "webcrawling-2-html"
featured: false
draft: false
tags:
  - Web Crawling
  - html
  - css
description: "CSS 기본 문법과 선택자에 대한 정리"
---

> 📌 참고 영상:  
> [웹크롤링 비법 대공개! 데이터 수집 기초부터 돈버는 전략까지 한번에 배우기!](https://www.youtube.com/watch?v=Uf21RUo3KNc&list=PLNO7MWpu0eeUFdGMirV8_EkiLETqj8xA4)

## Table of contents

## 1. CSS 기본 문법

```css
h1 {
    color: red;
}
```
- h1 → **선택자** (웹페이지에서 특정 요소를 선택)
- {} → **선언 블록** (스타일 지정 시작과 종료)
- color: red; → **속성명: 속성값** (이 경우 글자 색상을 빨간색으로 지정)
- ; → **선언 종료**

👉 위 코드는 페이지 내 모든 `<h1>` 태그의 글자 색상을 빨간색으로 변경한다.

## 2. CSS 선택자

웹 페이지에는 수많은 태그가 존재한다. 특정 요소를 스타일링하려면 적절한 **선택자**를 사용해야 한다.

#### 1️⃣ 태그 선택자
태그 이름을 직접 지정하여 스타일을 적용한다.

```html
<body>
    <h1>Pick This</h1>
    <p>Pick This, Too</p>
```

```css
    h1 {color: red;}
    p {color: blue;}
```

h1 태그의 글자는 **빨강**, p 태그의 글자는 **파랑**으로 변경된다.

#### 2️⃣ 클래스 선택자(중요!)

특정 그룹의 요소에 스타일을 적용할 때 사용하며, **.** 으로 시작한다.

```html
<body>
    <p>Do not pick this</p>
    <p class="large">Pick this</p>
    <p class="large">Pick this</p>
</body>
```

```css
.large {
    font-size: 50px;
    font-weight: 600;
}
```

👉 class="large" 속성이 있는 p 태그에만 글자 크기 **50px**, 굵기 **600** 적용.

#### 3️⃣ 아이디 선택자

특정 요소 **하나**에만 스타일을 적용할 때 사용하며, **#** 으로 시작한다.

```html
<body>
    <p id="title">Pick this</p>
    <p>Do not pick this</p>
    <p>Do not pick this</p>
</body>
```

```css
#title {
    font-size: 32px;
    text-decoration: underline;
}
```

👉 id="title"을 가진 p 태그만 **글자 크기 32px, 밑줄 적용**.

#### 4️⃣ 자식 선택자(중요!)

특정 태그의 바로 아래 자식 요소만 선택할 때 사용한다.

```html
<body>
    <div>
        <p>Pick this</p>
        <p>Do not pick this</p>
    </div>
    <p>Do not pick this</p>
</body>
```

```css
div > p {
    font-size: 30px;
}
```

`div` 안에 있는 **직속** p 태그만 글자 크기 **30px** 적용.
만약 div > p 대신 div p를 사용하면, `div` 내부의 모든 p 태그에 스타일이 적용된다.


## 3. css 실습

아래 코드를 적용하면 .box 클래스를 가진 요소의 스타일이 변경된다.
```css
<style>
    .box {
        background-color: steelblue;
        padding: 15px;
        margin-bottom: 20px;
        border-radius: 5px;
    }
    .box > a {
        color: white;
    }
    .box > p {
        color: lightskyblue;
    }
</style>
```

📌 .box 클래스에 적용되는 스타일
- **배경색**: 스틸블루(steelblue)
- **안쪽 여백 (padding)**: 15px
- **아래쪽 간격 (margin-bottom)**: 20px
- **모서리 둥글게 (border-radius)**: 5px

📌 .box 내부 요소 스타일
- a 태그는 **흰색 (white)**
- p 태그는 **연한 하늘색 (lightskyblue)**


### CSS 선택자 연습 사이트

더 연습하고 싶다면 [CSS Diner](https://flukeout.github.io/)에서 학습할 수 있다.

## 마무리  

이번 글에서는 **CSS 선택자**의 기본 개념을 정리했다. 선택자를 잘 활용하면 웹 크롤링에서 원하는 데이터를 효율적으로 추출할 수 있다.  
다음 글부터는 **웹 크롤링을 본격적으로 시작**하며, BeautifulSoup과 Selenium을 활용한 데이터 수집 방법을 다뤄볼 예정이다. 🚀