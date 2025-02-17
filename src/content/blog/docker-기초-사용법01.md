---
author: Jo YunHo
pubDatetime: 2025-02-14T09:22:00Z
modDatetime: 2025-02-17T10:12:47Z
title: Docker를 이용한 Node.js 서버 배포
slug: "Docker-1-basic"
featured: false
draft: false
tags:
  - Docker
description: "Docker 기초 사용법"
---

> 📌 참고 영상:  
> [Dockerfile 명령어 & 이미지 만들기](https://codingapple.com/unit/docker-3-custom-image/?id=131613)

## 1. 시작하기
먼저 Node.js와 Express 라이브러리를 설치하여 서버를 실행하는 방법을 배웠다. 그 후, Docker를 사용하여 서버를 이미지로 만들고 배포하는 과정을 설명하겠습니다.

## 2. Node.js와 Express 서버 실행

#### npm init -y로 package.json 생성

```bash
npm init -y
```

이 명령어로 package.json 파일이 생성된다. 이 파일은 프로젝트에 필요한 라이브러리와 설정을 기록합니다.

#### Express 설치
```bash
npm install express
```

**Express**는 웹 서버를 쉽게 만들 수 있도록 도와주는 라이브러리입니다. 실제 라이브러리 파일은 node_modules 폴더에 설치됩니다.

#### 서버 코드 작성

```javascript
const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log('서버 실행중 http://localhost:8080');
});

app.get('/', (req, res) => {
    res.send('안녕');
});
```

위 코드를 작성하고 **server.js**라는 파일로 저장합니다. 이 코드는 http://localhost:8080에서 서버를 실행하고, 메인 페이지에 안녕 메시지를 출력합니다.

#### 서버 실행

```bash
node server.js
```

이 명령어로 서버를 실행할 수 있습니다. 수정한 사항이 반영되지 않으면 서버를 종료하고 다시 실행해야 합니다.

#### 자동 반영을 위해 nodemon 설치

```bash
npm install -g nodemon
```

이후 nodemon을 사용하여, 파일을 저장할 때마다 자동으로 서버가 반영되게 할 수 있습니다.

```bash
nodemon server.js
```

## 3. Docker 사용하여 서버 배포하기

#### Dockerfile 작성

프로젝트 파일이 있는 폴더에 **Dockerfile**을 생성하여, 서버 환경을 설정합니다. Dockerfile에는 어떤 이미지를 기반으로 사용할지, 필요한 프로그램은 무엇인지 등을 설정합니다.

#### Dockerfile 예시

```Dockerfile
FROM node:20-slim

WORKDIR /app

COPY . .

RUN ["npm", "install"]

EXPOSE 8080

CMD ["node", "server.js"]
```

FROM node:20-slim: node:20-slim 이미지를 기반으로 사용합니다. 이 이미지는 최소한의 Node.js 환경을 제공합니다.
WORKDIR /app: 작업 디렉토리를 /app으로 설정합니다.

- COPY . .: 현재 디렉토리의 모든 파일을 컨테이너의 /app 디렉토리로 복사합니다.
- RUN ["npm", "install"]: 프로젝트의 의존성을 설치합니다.
- EXPOSE 8080: 8080 포트를 열어 외부에서 접근할 수 있도록 설정합니다.
- CMD ["node", "server.js"]: 서버를 실행할 명령어를 설정합니다.

#### Docker 이미지 빌드

```bash
docker build -t nodeserver:1 .
```

이 명령어로 Docker 이미지를 빌드합니다. nodeserver는 이미지의 이름이고, 1은 태그입니다.

#### Docker 컨테이너 실행

```
docker run -p 8080:8080 nodeserver:1
```

이 명령어로 Docker에서 만든 이미지를 실행하고, **포트 8080**을 외부와 연결합니다. 이후 http://localhost:8080에서 서버에 접속할 수 있습니다.

## 4. Docker 이미지 다른 컴퓨터에서 사용하기

Docker 이미지를 다른 컴퓨터로 전송하면, 동일한 과정을 재현할 수 있습니다.

1. package.json 파일을 포함한 프로젝트 파일을 복사합니다.
2. 해당 컴퓨터에서 docker build 명령어로 이미지를 빌드하고 실행합니다.

## 5. .dockerignore 사용

Docker 이미지를 빌드할 때 불필요한 파일들이 복사되지 않도록 .dockerignore 파일을 사용합니다. 예를 들어, node_modules 폴더를 제외하려면 .dockerignore 파일에 다음과 같이 작성합니다.

```bash
node_modules
Dockerfile
.git
```

## 마무리

Docker를 사용하면 서버 배포가 훨씬 간편해지고, **환경 차이로 인한 문제**를 최소화할 수 있습니다. 특히 AWS와 같은 서버 환경에서 Docker 이미지를 사용하여 손쉽게 배포할 수 있습니다. 이제 Docker를 통해 **개발 환경을 컨테이너화**하고, **배포 과정의 자동화**를 실현할 수 있습니다.


