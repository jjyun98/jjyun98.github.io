---

title:  "jupyter lab 설치법"

toc: true

---

# mac에서 jupyter lab 설치법


1) homebrew설치


2) brew install r<br>

brew install python3


을 통해 R, Python 설치(이는 가상환경 밖에 설치되는거임)


3) brew install pyenv<br>

(가상환경 설치도구)<br>

python3 -m venv ynlab<br>

(가상환경 제작)


4) brew install jupyterlab<br>

(주피터 설치)


4) install.packages("IRkernel")<br>

IRkernel::installspec()<br>

(IRkernel 연결)


### 필수 아님


.libPaths()<br>

(현재 라이브러리 경로 확인)<br>

이 때 경로가 2개가 뜨면 하나로 고정시켜줘야함.(패키지 오류 가능성)<br>

<br>

new_paths <- "/opt/homebrew/Cellar/r/4.2.3/lib/R/library"<br>

Sys.setenv(R_LIBS = new_paths)<br>

(첫 번째 경로를 삭제하고 두 번째 경로를 유일한 라이브러리 경로로 설정,<br>

여기서 따옴표 안이 원하는 주소)<br>

또는 .libPaths("/opt/homebrew/Cellar/r/4.2.3/lib/R/library")<br>

다만 이 방법들의 문제는 세션 껐다가 키면 설정 초기화됨


5) jupyter lab<br>

(끝)


### if)


tidyverse같은 패키지 설치에서 0에러 나온다면 다음 설치 권장<br>

brew install harfbuzz fribidi<br>

install.packages("textshaping", dependencies = TRUE)<br>

(이 상황에서는 에러나는 패키지 이름이 textshaping였음)



```python
```
