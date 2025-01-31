---
author: Jo YunHo
pubDatetime: 2025-01-29T09:22:00Z
modDatetime: 2025-01-30T10:12:47Z
title: 웹 크롤링을 위한 CSS 기초
slug: "webcrawling-2-html"
featured: false
draft: false
tags:
  - Web Crawling
  - html
  - css
description: "웹 크롤링을 위한 CSS기초 개념을 정리한 글입니다."
---

## Table of contents

> 📌 참고 영상:  
> [웹크롤링 비법 대공개! 데이터 수집 기초부터 돈버는 전략까지 한번에 배우기!](https://www.youtube.com/watch?v=Uf21RUo3KNc&list=PLNO7MWpu0eeUFdGMirV8_EkiLETqj8xA4)

## CSS 기본 문법

h1{color:red;}

h1은 선택자
첫 괄호는 선언시작
끝 괄호는 선언 종료를 의미한다.
속성명:속성값 꼴로 사용, 여기서는 color가 속성명, red가 속성값이 된다.
마지막에 ;

위 문법의 의미는 페이지안에 있는 모든 h1태그에 대해 글자색깔을 빨강으로 바꿔라.

크롤링에서 선택자가 중요하다.

선택자(selector)
- 웹페이지에서 원하는 태그를 선택하는 문법

하나의 웹페이지 안에는 수백 ~ 수천개의 태그가 들어있는데, 이것중에서 내가 원

태그 선택자
- 태그 이름으로 선택하는 것


예시

```html
<body>
    <h1>Pick This</h1>
    <p>Pick This, Too</p>
```

```css
    h1{color : red;}
    p{color : blue;}
```

페이지 안에 있는 모든 h1태그를 선택하고 빨간색으로 바꿔줘 의미
웹 페이지 안에 있는 p 태그를 선택하고 파랑으로 바꿔줘

클래스 선택자(중요)
- 클래스 속성 값으로 선택하는 것
- 클래스: 태그에 별명을 주는 것

```html
<body>
    <p>Do not pick this</p>
    <p>pick this</p>
    <p>pick this</p>
</body>
```
가 있다고 할 때 2번 째 3번째 p 태그만 사용하고 싶다면?

```html
<body>
    <p>Do not pick this</p>
    <p class="large" >pick this</p>
    <p class="large" >pick this</p>
</body>
```

2,3 p태그에 별명을 large라고 주고 이들만 사용

예를들어

```css
.large{
    font-size : 50px;
    font-weight : 600;
}
```

라고 한다면 class = large인 애들만 아래 내용 적용

아이디 선택자
- 아이디 속성 값으로 선택하는 것
- 아이디: 태그에 별명을 주는 것



p 태그 3개중 첫 번째만 사용하고 싶다면?
이런식으로 id를 준다.
```html
<body>
    <p id="title">Pick this</p>
    <p>Do not pick this</p>
    <p>Do not pick this</p>
</body>
```

```css
title {
    font-size : 32px;
    text-decoration: underline;
}
```

클래스와 유사한 것 같은데 클래스는 .으로 시작하고 아이디는 #으로 시작한다.


자식 선택자(중요)
- 바로 아래 자식태그를 선택하는 것
- 내가 원하는 태그에 별명이 없을 때 사용


```html
<body>
    <div>
        <p>Pick this</p>
        <p>Do not pick this</p>
    </div>
    <p>Do not pick this</p>
</body>
```
div 태그 안의 p 태그 2개만 사용하고 싶다면?
그리고 이때 p 태그에 별명이 없다면?


```css
div > p { font-size : 30px }
```

클래스와 같이 사용된 경우
```html
<body>
    <div class="header">
        <p>Pick this</p>
        <p>Do not pick this</p>
    </div>
    <div class="section">
    <p>Do not pick this</p>
    </div>
</body>
```


```css
.header > p { font-size : 30px }
```


## css 실습

```css
<style>
    .box{background-color: steelblue; padding: 15px; margin-bottom: 20px;}
</style>
```