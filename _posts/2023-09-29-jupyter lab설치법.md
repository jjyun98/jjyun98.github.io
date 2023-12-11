---

title:  "jupyter lab 설치법"

toc: true

---

# mac에서 jupyter lab 설치법

## 필수 과정

먼저 homebrew설치하고 온다.(인터넷 참고)

### step 1
R, python 설치(이는 가상환경 밖에 설치되는거임)

수정 : 가상환경 밖에 설치하면 python 패키지 종속성 문제 발생할 가능성 다분함. 고로 개별 가상환경 내에 설치하길 권장
```

brew install r

~~brew install python3~~
```

### step 2
가상환경 설치 도구

```
brew install pyenv
```

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

