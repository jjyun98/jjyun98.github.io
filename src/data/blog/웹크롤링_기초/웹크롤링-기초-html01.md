---
author: Jo YunHo
pubDatetime: 2025-01-26T09:22:00Z
modDatetime: 2025-01-28T10:12:47Z 
title: 웹 크롤링을 위한 HTML 기초 (1)
slug: "webcrawling-1-html"
featured: true
draft: false
tags:
  - Web Crawling
  - html
  - css
description: "웹 크롤링을 위한 HTML기초 개념 정리"
---

> 📌 참고 영상:  
> [웹크롤링 비법 대공개! 데이터 수집 기초부터 돈버는 전략까지 한번에 배우기!](https://www.youtube.com/watch?v=Uf21RUo3KNc&list=PLNO7MWpu0eeUFdGMirV8_EkiLETqj8xA4)

## Table of contents

## 1. 웹 개발의 3요소

- **HTML**: 웹 페이지의 **구조(structure)** 를 담당  
- **CSS**: 웹 페이지의 **디자인(style)** 을 담당  
- **JavaScript**: 웹 페이지의 **동작(behavior)** 을 담당  

## 2. HTML 기본 구조

HTML 문서는 **태그(tag)** 를 이용해 구조를 정의한다.  
앞에 나온 태그를 시작태그, 뒤에 나온 태그를 종료태그라고 한다.

```html
<태그이름>내용</태그이름>
```

```html
<태그이름 속성="속성값">내용</태그이름>
```

- **속성(attribute)**: 태그에 추가 정보를 제공
- 속성은 **여러 개** 사용 가능
- 속성이 **없어도** 됨

#### ✅ HTML 기본 예제(네이버 HTML 구조 일부 발췌)

HTML 태그는 시작 태그와 종료 태그로 구성되며, 태그 안에는 텍스트 또는 다른 태그가 들어갈 수 있다.
일부 태그는 내용 없이 단독으로 사용될 수도 있다.

```html
<!DOCTYPE html>
<html lang="ko">
<head>
    <meta charset="UTF-8">
    <title>네이버</title>
</head>
<body>
    <div id="u_skip">
        <a href="#content">본문 바로가기</a>  <!-- 내용 있음 -->
    </div>
    <div id="wrap">
        <header>
            <h1>네이버</h1>
        </header>
        <main>
            <p>네이버 메인 페이지입니다.</p>  <!-- 내용 있음 -->
            <img src="logo.png" alt="네이버 로고">  <!-- 내용 없음 -->
        </main>
    </div>
</body>
</html>
```

#### ✅ 속성(Attribute) 예제

태그는 추가 정보를 담기 위해 속성을 가질 수 있으며, 여러 개의 속성을 동시에 사용할 수도 있다.

```html
<a href="https://www.naver.com" target="_blank">네이버 바로가기</a>
```
- href="https://www.naver.com" → 링크 주소 지정
- target="_blank" → 새 창에서 열리도록 설정

## 3.HTML 문서 구조

```html
<!DOCTYPE html>
<head>
    <!-- 부가적인 정보(웹 사이트 제목, 설명, 메타태그) -->
</head>
<body>
    <!-- 실제로 화면에 표시되는 내용 -->
</body>
</html>
```

- `<!DOCTYPE html>`  
  → HTML5 문서임을 선언  

- `<head>`  
  → 웹 사이트의 **부가 정보** (메타데이터, CSS, JS 포함)  

- `<body>`  
  → **화면에 표시되는 내용** (크롤링 시 주요 대상)  


## 4. HTML 태그 살펴보기

#### 📌 주석(comments)

```html
<!-- 이 부분은 주석입니다 -->
<!-- <p>주석 처리된 코드</p> -->
```

#### 📌 div 태그(레이아웃 그룹)

- 웹 페이지에서 특정 영역을 나눌 때 사용
- **다른 태그를 감싸는 컨테이너 역할**을 함

```html
<div>
    <p>이 부분은 div 태그 내부입니다.</p>
</div>
```

#### 📌 p 태그(문단)

```html
<p>이것은 문단을 나타냅니다.</p>
```

#### 📌 a 태그(하이퍼링크)

```html
<a href="https://www.naver.com">네이버로 이동</a>
```

#### 📌 inpu 태그(사용자 입력)

```
<input type="text" placeholder="이름을 입력하세요">
```

#### 📌 button 태그(버튼)

```html
<button onclick="alert('클릭했습니다!')">클릭하세요</button>
```

#### 📌 ul & li 태그(리스트)

```html
<ul>
    <li>항목 1</li>
    <li>항목 2</li>
    <li>항목 3</li>
</ul>
```

```html
<li><a href="#">첫달 무료!</a></li>
```

- #을 href 속성에 넣으면 **클릭할 수 있지만 이동하지 않는 빈 링크**가 됨.

## 마무리

이 글에서는 **웹 크롤링을 위한 HTML 기본 개념**을 정리했다.  
다음 글에서는 **CSS와 실제 웹 크롤링 코드**를 다뤄볼 예정이다. 🚀
