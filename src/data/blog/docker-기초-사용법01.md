---
author: Jo YunHo
pubDatetime: 2025-02-14T09:22:00Z
modDatetime: 2025-02-17T10:12:00Z
title: Docker를 이용한 Node.js 서버 배포
slug: "docker-nodejs-deployment"
featured: false
draft: false
tags:
  - Docker
  - Node.js
description: "Docker를 활용하여 Node.js 애플리케이션을 쉽게 배포하는 방법을 소개합니다. Dockerfile 작성부터 컨테이너 실행까지 단계별로 설명합니다."
---

> 📌 참고 영상:  
> [Dockerfile 명령어 & 이미지 만들기](https://codingapple.com/unit/docker-3-custom-image/?id=131613)

## Table of contents

이번 포스팅에서는 **Docker**를 이용해 간단하게 Node.js 서버를 배포하는 방법을 다뤄보겠습니다. Docker를 사용하면 **어떤 환경에서도 동일한 서버**를 실행할 수 있게 됩니다.

## 1. Node.js + Express 서버 만들기

우선 Node.js와 Express를 사용해 간단한 서버를 만들어보겠습니다.

```bash
npm init -y
npm install express
```

위 명령어로 package.json을 생성하고, Express 라이브러리를 설치합니다. 그다음, server.js 파일을 만들어 서버 코드를 작성합니다.
학습을 위해 아래 내용을 똑같이 파일에 복사하면 됩니다.

```js
const express = require('express');
const app = express();

app.listen(8080, () => {
  console.log('서버 실행중 http://localhost:8080');
});

app.get('/', (req, res) => {
  res.send('안녕');
});
```

이제 서버가 실행되고, 웹 브라우저에서 http://localhost:8080에 접속하면 안녕이라는 메시지를 확인할 수 있습니다. 이제 이 서버를 **Docker**를 이용해 쉽게 배포할 수 있는 방법을 알아봅니다.

## 2. Dockerfile 작성하기

Docker를 사용하려면 Dockerfile이라는 파일을 작성해야 합니다. 이 파일은 우리가 만든 애플리케이션을 **어떤 환경에서 실행할지** 정의하는 레시피입니다. 이곳에 애플리케이션을 실행하기 위한 환경과 필요한 명령어들을 적습니다.

#### ✅ Dockerfile 작성 예시

```dockerfile
# 1. 기본 이미지 설정 (Node.js 20버전, 슬림 리눅스)
FROM node:20-slim

# 2. 작업 디렉토리 설정
WORKDIR /app

# 3. 로컬 파일 복사 (현재 디렉토리의 모든 파일을 /app 디렉토리로 복사)
COPY . .

# 4. 의존성 설치
RUN npm install

# 5. 애플리케이션 포트 공개 (8080 포트를 사용)
EXPOSE 8080

# 6. 서버 실행 명령어
CMD ["node", "server.js"]
```

- FROM : 다른 이미지로 시작가능. 보통 OS정도 설치된 이미지 기입한다. 리눅스가 저렴하니까 리눅스 많이 사용함. 참고로 이미지들은 Docker hub에서 찾아볼 수 있음. 검색해서 하나 고르면 된다. 참고로 해당 이미지가 로컬에 없으면 자동으로 Docker가 해당 이미지를 pull함. 여기서는 Node.js 20버전과 슬림한 리눅스 이미지를 기반으로 설정

![img](/assets/images/docker_0217_1.png)

- WORKDIR : 컨테이너 내부에서 작업할 디렉토리를 설정. 여기서는 /app으로 설정함.

- COPY : 현재 로컬 디렉토리의 모든 파일을 컨테이너의 /app 디렉토리로 복사.

package.json 파일을 보면 내가 쓰는 라이브러리 버전이 기록되어 있다. 이 파일을 활용하면 내가 사용하던 라이브러리들의 버전을 쉽게 설정 가능. 따라서 복사해서 사용하기로 했다.

![img](/assets/images/docker_0217_2.png)

- RUN npm install: package.json에 정의된 의존성을 설치.

- EXPOSE : 해당 컨테이너에서 어떤 포트를 사용할 것인지에 대한 정보를 명시. 메모역할! 기능은 없음.

- CMD : 서버를 실행할 명령어를 설정합니다.

## 3. .dockerignore 설정

docker build 명령어를 실행하면 모든 파일이 Docker 이미지에 포함됩니다. 하지만 node_modules와 같은 불필요한 파일은 포함하지 않아야 합니다. 이를 위해 .dockerignore 파일을 생성하여 제외할 파일을 지정합니다.

**.dockerignore**

```dockerfile
node_modules
Dockerfile
.git
```

이렇게 하면 Docker 이미지를 만들 때 node_modules나 Git 관련 파일이 포함되지 않도록 설정할 수 있습니다.

#### ✅ 폴더 구조

정리하면, **폴더 구조**는 다음과 같이 될 것입니다.

```
my-node-app/
│
├── node_modules/         # (빌드 후 생성됨)
├── .dockerignore         # (작성)
├── Dockerfile            # (작성)
├── package-lock.json     # (생성)
├── package.json          # (생성)
└── server.js             # (작성)
```

## 4. Docker 이미지 빌드

이제 모든 준비가 끝났다. Dockerfile과 package.json을 기준으로 Docker 이미지를 빌드할 수 있습니다. 터미널에 아래 명령어를 사용하여 이미지를 빌드합니다.

```bash
docker build -t nodeserver:1 .
```

이 명령어에서 nodeserver:1은 이미지 이름과 태그입니다. .은 현재 디렉토리를 의미하며, Docker가 이 디렉토리에서 Dockerfile을 찾아 이미지를 빌드하도록 합니다.

## 5. Docker Desktop에서 이미지 확인

이미지가 빌드되면 Docker Desktop을 통해 확인할 수 있습니다. Images 탭에서 nodeserver:1 이미지를 확인할 수 있습니다.


## 6. Docker 컨테이너 실행

이제 Docker 컨테이너를 실행할 준비가 되었습니다. docker run 명령어를 사용하여 이미지를 실행합니다.

```bash
docker run -p 8080:8080 nodeserver:1
```

위 명령어는 호스트의 8080 포트를 컨테이너의 8080 포트에 연결하여, 외부에서 해당 포트로 접근할 수 있도록 합니다. 서버가 실행되면 아래와 같은 메시지가 출력됩니다.

```
서버 실행중 http://localhost:8080
```

브라우저에서 http://localhost:8080을 입력하면 “안녕”이라는 메시지가 출력되는 것을 확인할 수 있다.

#### 📌 다른 시스템에서 실행

Docker의 가장 큰 장점은 환경을 동일하게 재현할 수 있다는 것입니다. Docker 이미지가 생성되었으면, 해당 이미지를 다른 시스템에 전달하고 동일한 과정을 거쳐 서버를 실행할 수 있습니다. 이 때, docker save와 docker load 명령어를 사용하여 이미지를 전송할 수 있습니다.

## 마무리

지금까지 Node.js와 Express 서버를 Docker 이미지를 통해 실행하는 방법을 알아보았습니다. Docker를 활용하면 **개발 환경을 표준화**하고, **서버 배포가 용이**해지며, 다양한 시스템에서 동일한 환경을 재현할 수 있다는 장점이 있습니다.

또한, Docker를 사용하면 AWS나 다른 클라우드 서버로 쉽게 배포할 수 있으며, **개발 환경을 설정하는 시간을 단축**시킬 수 있습니다.

이 포스팅에서는 Docker를 사용한 기본적인 서버 구축 방법을 다루었지만, Docker를 보다 심화적으로 사용하려면 추가적인 설정과 최적화 방법이 필요합니다. 예를 들어, **멀티스테이지 빌드**, **Docker Compose** 등을 활용한 다중 컨테이너 환경 설정도 가능합니다.