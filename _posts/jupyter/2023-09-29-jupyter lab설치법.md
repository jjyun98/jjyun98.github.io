---
title:  "jupyter lab 설치법"
toc: true
tag: mac
---

# mac에서 jupyter lab 설치법

## 필수 과정

먼저 homebrew설치하고 온다.(인터넷 참고)

가상환경 밖에서 R, python 설치시 가상환경내에서 패키지 위치가 필히 2개 생김.<br>
따라서 내부에서 설치하는 것을 권장


## 설치 과정

### step 1
가상환경 설치 도구

```
brew install pyenv
```

가상환경 구조에 대해서는 _posts/jupyter/2023-12-18-가상환경.md 참고 바람.

### step 3
가상환경 제작

```
python3 -m venv ynlab
```

### step 4
주피터 설치

```
brew install jupyterlab
```

### step 5
IRkernel 커널 연결

```
install.packages("IRkernel")

IRkernel::installspec()
```

<br>

## 필수 아님

### in R
R에서 패키지 설치시 자주 발생하는 오류 해결 방안(일회용)


```
.libPaths()
```
현재 라이브러리 경로 확인<br>

이 때 경로가 2개가 뜨면 하나로 고정시켜줘야함.(패키지 오류 가능성)<br>

<br>

```
new_paths <- "/opt/homebrew/Cellar/r/4.2.3/lib/R/library"

Sys.setenv(R_LIBS = new_paths)
```
첫 번째 경로를 삭제하고 두 번째 경로를 유일한 라이브러리 경로로 설정하기<br>

따옴표 안이 원하는 주소임.

<br>

**OR**

```
.libPaths("/opt/homebrew/Cellar/r/4.2.3/lib/R/library")
```

다만 이 방법들의 문제는 세션 껐다가 키면 설정 초기화됨.

```
jupyter lab
```
문제 없는지 확인

<br>

#### 만약

tidyverse같은 패키지 설치에서 0에러 나온다면 다음 설치 권장

```
brew install harfbuzz fribidi
```

<br>

```
install.packages("textshaping", dependencies = TRUE)
```

이 상황에서는 에러나는 패키지 이름이 textshaping였음.



devtools 가 0 에러 뜨는 경우 종속성 패키지는 아래를 설치하면 된다.

```
brew install libgit2
```

이거 하고 다시 

```
install.packages("devtools")
```


brew upgrade llvm



R역시 irkernel 사용권장<br>
이유는 모르겠지만 에러 덜나는 기분(검증 필요함)

## conda로 설치하는 방법


### conda 설치

```
brew install --cask miniconda
```

### python과 가상환경 설치
R은 별도로 설치함.<br>

```
conda create -n lab1 -c conda-forge r-base python=3.8
```


```
conda install -n lab1 -c conda-forge jupyterlab
```


### 실행


```
conda activate lab1
```


# 돌아가는 python 위치 확인

패키지를 설치했는데 존재하지 않는다고 나오면, 보통 파이썬이나 패키지 실행 위치가 다른 것이다. 2개 이상 설치되어 서로 다른 것으로 연결 되어있어서 그러하다.

확인 
```
import sys # jupyter code
sys.executable # 가상환경 code
```

이렇게 하고 서로 상이한지 확인
(같아야 함)
보통 2개 설치되어있는 경우 많으며, 여기서는 아래와 같다.


# zero error

에러중에는 많은 노력을 함에도 불구하고, 설치할 때 0 상태를 갖는다고 나오는 경우가 대다수

이 경우 conda가상환경에서 진행했기에 여기서의 예를들면

conda-forge 채널을 이용해 설치하도록 한다.

R패키지를 conda에서 설치하는 것이라 낯설긴한데(원리도 이해 정확히 안됨), 일단 설치까지는 훨씬 수월하다. (conda가 arm mac에 알아서 더 잘 적합시켜주는 거 같음)

예를 들면 아래와 같다.

```
conda install -c conda-forge r-glmnet
```

근데 이러면 감지를 못하는 경우가 종종 있음.
그러면 버전까지 명시해줘서 깔아보면 됨. 버전이 안맞는건지 뭔지 잘 모르나, 보통 버전 검색하면 여러개 나올 수도 있는데 낮은거부터 다 깔아본다. 하나는 된다.
여기서는 glmnet설치 오류였다.


```
conda search -c conda-forge r-glmnet

```

그러면 아래와 같이 나오고

![img](/assets/images/r_1225_1.png)


여기서 제일 낮은 버전을 설치할 것이기에



```
conda install -c conda-forge r-glmnet=4.1_2
```

이러면 해결된다.



# 추가

arm mac에서 R 패키지 설치시 필수로 봐야할 사이트(사전 설치 필요)

https://cran.r-project.org/bin/macosx/tools/
https://mac.r-project.org/tools/

