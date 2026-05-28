---
title: '생명과학통계 - SAS 기초'
published: 2026-05-29
draft: false
description: 'SAS의 DATA step, PROC step, 데이터 입력, 라이브러리, 데이터셋 결합, 기초 통계량과 그래프 작성 문법 정리'
series: '생명과학통계'
tags: ['생명과학통계', 'SAS', '통계프로그래밍']
---

SAS는 생명과학, 보건의학, 임상시험 자료 분석에서 오래 사용되어 온 통계 분석 시스템이다. 이 글에서는 원본 `sas_start2023.pdf`의 흐름을 따라 SAS 프로그램의 기본 구조와 자주 쓰는 절차를 정리한다.

## 1. SAS 프로그램의 큰 구조

SAS 프로그램은 크게 `DATA step`과 `PROC step`으로 나뉜다.

- `DATA step`: 데이터셋을 만들거나 수정한다.
- `PROC step`: 만들어진 데이터셋으로 통계분석, 출력, 그래프 등을 만든다.

모든 명령문은 세미콜론으로 끝난다. SAS는 대소문자를 구별하지 않는다. 주석은 `/* ... */` 또는 `* ... ;` 형식으로 쓴다.

```sas
/* 기본적인 프로그램 구조 */
DATA data_name;
  INPUT variable1 variable2 $ @@;
  CARDS;
  data1 data2 data3 data4
  data5 data6 data7 data8
  ;
RUN;

PROC procedure_name OPTION;
  VAR variable1;
  BY variable2;
  OUTPUT OUT=data_name_1 keywords;
RUN;
```

`BY` 문을 쓰려면 보통 먼저 `PROC SORT`로 정렬해야 한다. 이미 정렬되어 있지 않은 변수로 `BY` 분석을 하면 오류가 난다.

## 2. 직접 데이터 입력하기

`DATA`, `INPUT`, `DATALINES` 또는 `CARDS`를 이용하면 코드 안에 작은 데이터를 직접 넣을 수 있다.

```sas
title "Example: getting started with SAS";

data grade;
  input subject gender$ exam1 exam2 hwgrade$;
  datalines;
  10 M 80 84 A
  7 . 85 89 A
  4 F 90 . B
  20 M 82 85 B
  25 F 94 94 A
  14 F 88 84 C
  ;
run;

proc print data=grade;
  var subject gender;
run;
```

`gender$`, `hwgrade$`처럼 변수명 뒤에 `$`를 붙이면 문자형 변수로 읽는다. 숫자형 결측값은 `.`으로 표시한다.

## 3. 파일에서 데이터 가져오기

SAS 데이터셋은 에디터에서 직접 입력할 수도 있고, `txt`, `csv`, `xlsx`, `sas7bdat` 같은 외부 파일을 읽어 만들 수도 있다. 강의자료에서는 메뉴에서 `Import Data`를 선택해 `mower.xlsx`를 `mower`라는 데이터셋으로 읽는 예를 든다.

외부 파일을 읽을 때 확인할 점은 다음과 같다.

- 첫 행이 변수명인지
- 문자형과 숫자형이 올바르게 인식되었는지
- 결측값이 어떻게 표시되어 있는지
- 작업 디렉터리가 의도한 폴더인지

## 4. 임시 라이브러리와 영구 라이브러리

SAS에서 라이브러리는 데이터셋이 저장되는 위치다.

기본 라이브러리인 `WORK`는 임시 저장소다. SAS를 종료하면 사라진다. 계속 남는 데이터셋을 만들려면 `LIBNAME`으로 폴더를 라이브러리에 연결한다.

```sas
libname sclass 'C:\Users\USER\Desktop\SAS_class\data';

data sclass.x;
  input x1-x3;
  datalines;
  1 1 12.4
  1 2 11.3
  1 3 1.4
  2 1 2.1
  2 2 19.4
  2 3 10.0
  ;
run;

proc print data=sclass.x;
run;
```

`data x;`라고 쓰면 보통 `work.x`가 만들어진다. `data sclass.x;`라고 쓰면 `sclass` 라이브러리에 영구 데이터셋이 만들어진다.

## 5. 데이터셋 나누기와 합치기

조건을 이용해 데이터셋을 나눌 수 있다.

```sas
data mow_y;
  set mower;
  if ridingmower = "yes";
run;

data mow_n;
  set mower;
  if ridingmower ne "yes";
run;
```

하나의 `DATA step`에서 여러 데이터셋으로 동시에 나눌 수도 있다.

```sas
data mow_y1 mow_n1;
  set mower;
  if ridingmower = "yes" then output mow_y1;
  else output mow_n1;
run;
```

같은 구조의 데이터셋을 세로로 붙일 때는 `SET`을 사용한다.

```sas
data mow_yn;
  set mow_y mow_n;
  label ridingmower = "Do they have a riding mower?";
run;
```

공통 키를 기준으로 가로로 붙일 때는 `MERGE`와 `BY`를 사용한다. 이때 각 데이터셋은 `BY` 변수로 정렬되어 있어야 한다.

```sas
data mow_inc;
  set mower(keep=income ridingmower);
  id = _n_;
run;

data mow_lot;
  set mower(keep=lotsize ridingmower);
  id = _n_;
run;

data mow_inclot;
  merge mow_inc mow_lot;
  by id;
run;
```

## 6. 데이터 구조 확인과 기본 출력

데이터를 읽은 뒤에는 먼저 변수 구조와 일부 관측치를 확인한다.

```sas
proc contents data=mower;
run;

proc print data=mower(obs=10);
run;
```

`PROC CONTENTS`는 변수명, 변수형, 길이, 포맷 같은 구조를 보여준다. `PROC PRINT`는 실제 관측치를 출력한다.

## 7. 포맷 지정

`PROC FORMAT`을 이용하면 숫자나 문자 값을 보기 쉬운 범주로 표시할 수 있다.

```sas
proc format;
  value incgrp
    low-40 = "Low"
    40<-80 = "Middle"
    80<-high = "High";

  value $yngrp
    "yes" = "Y"
    "no" = "N";
run;

proc print data=mower;
  format income incgrp. ridingmower $yngrp.;
run;
```

포맷을 데이터셋에 붙여 저장할 수도 있다.

```sas
data mower_f;
  set mower;
  format income incgrp. ridingmower $yngrp.;
run;
```

## 8. 기본 통계량과 빈도표

수치형 변수는 `PROC MEANS`, 범주형 변수는 `PROC FREQ`로 먼저 요약한다.

```sas
proc means data=mower_f;
  var income;
run;

proc freq data=mower_f;
  table income ridingmower income*ridingmower;
run;
```

`PROC SORT`는 정렬된 데이터셋을 새 이름으로 저장할 때 자주 쓴다.

```sas
proc sort data=mower out=mower_s;
  by income;
run;
```

## 9. 결과 저장과 ODS

`ODS`를 이용하면 결과를 PDF, HTML, RTF 등으로 저장할 수 있다.

```sas
ods pdf file='mower_mean.pdf';

proc means data=mow;
  var income lotsize;
run;

ods pdf close;
```

특정 출력표를 데이터셋으로 저장할 수도 있다.

```sas
proc univariate data=mow;
  var income lotsize;
  ods output BasicMeasures=dmeas;
run;

proc contents data=dmeas;
run;
```

저장된 출력표는 `PROC REPORT`로 원하는 형태로 정리할 수 있다.

```sas
proc report data=dmeas nowindows headline;
  title '기초 통계량';
  column VarName LocMeasure LocValue;
  define VarName / width=6 "변수/이름" center;
  define LocMeasure / width=6 center;
  define LocValue / format=comma5.2 right;
run;
```

## 10. SASHELP 예제

SAS에는 연습용 데이터셋이 들어 있다. `sashelp.class`는 작은 학생 자료라서 기초 요약 연습에 적합하다.

```sas
proc contents data=sashelp.class position;
run;

title 'Frequency count of sex';
proc freq data=sashelp.class;
  tables sex;
run;

proc freq data=sashelp.class;
  tables sex / nocum;
run;

proc means data=sashelp.class maxdec=2 fw=10;
  var age height;
run;

proc means data=sashelp.class maxdec=2 fw=10 sum range median;
  var age height;
run;
```

집단별 요약은 `CLASS` 또는 정렬 후 `BY`로 할 수 있다.

```sas
proc means data=sashelp.class maxdec=2 fw=10;
  var age height;
  class sex;
run;

proc sort data=sashelp.class out=class2;
  by sex;
run;

proc means data=class2 noprint;
  var age height;
  by sex;
  output out=clsummary
    mean=MeanAge MeanHeight
    median=MedianAge MedianHeight;
run;

proc print data=clsummary;
  title 'Class Statistics';
run;
```

정규성 확인은 `PROC UNIVARIATE`로 시작할 수 있다.

```sas
proc univariate data=sashelp.class normal plot;
  var height;
run;
```

## 11. SGPLOT 예제

`sashelp.cars`는 그래프 예제에 자주 쓰인다.

```sas
proc contents data=sashelp.cars;
run;

proc sgplot data=sashelp.cars;
  title "Box Plot: Category = Origin";
  vbox Horsepower / category=Origin;
run;

proc sgplot data=sashelp.cars;
  title "Box Plot: Group = Origin";
  vbox Horsepower / group=Origin;
run;

proc sgplot data=sashelp.cars;
  title "Box Plot: Category = Cylinders, Linear Scale";
  vbox Horsepower / category=Cylinders;
  xaxis type=linear;
run;

proc sgplot data=sashelp.cars;
  where Type in ('SUV' 'Truck' 'Sedan');
  title "Box Plot: Category = Origin, Group = Type";
  vbox Horsepower / category=Origin group=Type;
run;
```

산점도는 다음처럼 그린다.

```sas
proc sgplot data=sashelp.cars;
  title "Vehicles: All Origins";
  scatter x=Wheelbase y=Weight / markerattrs=(symbol=CircleFilled);
run;

proc sgplot data=sashelp.cars;
  title "Vehicles: All Origins";
  scatter x=Wheelbase y=Weight / markerattrs=(symbol=CircleFilled) group=Origin;
run;

proc sgplot data=sashelp.cars;
  title "Vehicles: Origin=USA only";
  where Origin = "USA";
  scatter x=Wheelbase y=Weight / markerattrs=(symbol=CircleFilled);
run;
```

## 12. 연습 과제

원본 자료의 과제는 `bweight.csv`를 읽어 데이터셋을 만들고, 수치형 변수 2개와 범주형 변수 2개를 선택해 표와 그래프로 요약하는 것이다.

`bweight` 자료는 1997년 출생 체중 데이터로 설명되어 있다. 주요 변수는 다음과 같다.

| 변수 | 설명 |
| --- | --- |
| `Weight` | 신생아 체중 |
| `Black` | 흑인 어머니 여부 |
| `Married` | 기혼 어머니 여부 |
| `Boy` | 남아 여부 |
| `MomAge` | 어머니 나이 |
| `MomSmoke` | 흡연 어머니 여부 |
| `CigsPerDay` | 하루 흡연량 |
| `MomWtGain` | 임신기간 체중 증가량 |
| `Visit` | 산전 병원 방문 여부 |
| `MomEdLevel` | 어머니 교육수준 |

분석 흐름은 다음처럼 잡으면 된다.

```sas
proc contents data=bweight;
run;

proc means data=bweight n mean std min median max;
  var Weight MomAge;
run;

proc freq data=bweight;
  tables Black Married MomSmoke Boy;
run;

proc sgplot data=bweight;
  histogram Weight;
run;

proc sgplot data=bweight;
  vbox Weight / category=MomSmoke;
run;
```

TODO: 원본에는 `mower.xlsx`와 `bweight.csv`의 실제 파일 내용은 포함되어 있지 않다. 데이터를 확보하면 `PROC IMPORT` 코드와 실제 출력표를 이 글에 추가한다.
