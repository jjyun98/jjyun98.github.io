---
title: 'R4DS - 외부 데이터: Excel, 데이터베이스, Parquet'
published: 2022-08-22
draft: false
description: 'readxl로 Excel 시트 읽기, DBI와 duckdb로 데이터베이스에 연결하고 dbplyr로 dplyr 코드를 SQL로 번역하기, Parquet 파일과 arrow로 큰 자료 다루기를 CSV와 비교해 정리'
series: 'R for Data Science'
seriesOrder: 11
tags: ['데이터 분석', 'R']
---

[데이터 불러오기 글](/posts/r4ds-tibble-tidydata)에서는 CSV를 읽었다. 실무 자료는 Excel 파일, 회사 데이터베이스, 메모리에 다 들어가지 않는 큰 파일로 오는 경우가 많다. R4DS(2판) Spreadsheets, Databases, Arrow 장을 따라 세 가지를 정리한다. 외부 서버 없이 돌아가도록 Excel 파일은 직접 만들어 읽고, 데이터베이스는 메모리 안에서 도는 duckdb를 쓴다.

```r title="환경 설정"
library(tidyverse)
library(readxl)
library(DBI)
library(dbplyr)
library(duckdb)
library(nycflights13)
```

## 1. Excel: readxl

readxl은 Excel 없이 `.xlsx`, `.xls`를 읽는다. readxl에 들어 있는 예시 파일 `deaths.xlsx`를 쓴다. 2016~2017년에 세상을 떠난 유명인 목록이 시트 두 개(`arts`, `other`)에 있고, 표 위에 설명 문장이, 아래에 메모가 붙어 있는, 실무에서 흔한 모양이다.

```r
path <- readxl_example("deaths.xlsx")
excel_sheets(path)
read_excel(path, sheet = "arts") |> head(5)
```

```text
[1] "arts"  "other"
# A tibble: 5 × 6
  `Lots of people`             ...2       ...3  ...4     ...5          ...6     
  <chr>                        <chr>      <chr> <chr>    <chr>         <chr>    
1 simply cannot resist writing <NA>       <NA>  <NA>     <NA>          some not…
2 at                           the        top   <NA>     of            their sp…
3 or                           merging    <NA>  <NA>     <NA>          cells    
4 Name                         Profession Age   Has kids Date of birth Date of …
5 David Bowie                  musician   69    TRUE     17175         42379
```

그대로 읽으면 첫 줄의 설명 문장이 열 이름이 되고 모든 열이 문자가 된다. 표가 있는 셀 범위를 `range`로 알려 주면 열 이름과 열 종류가 제대로 잡힌다. 위쪽 줄만 문제라면 `skip = 4`로 건너뛰어도 되지만, 이 파일은 아래쪽에도 메모가 있어 `range`가 낫다.

```r
deaths <- read_excel(path, sheet = "arts", range = "A5:F15")
deaths
```

```text
# A tibble: 10 × 6
   Name      Profession   Age `Has kids` `Date of birth`     `Date of death`    
   <chr>     <chr>      <dbl> <lgl>      <dttm>              <dttm>             
 1 David Bo… musician      69 TRUE       1947-01-08 00:00:00 2016-01-10 00:00:00
 2 Carrie F… actor         60 TRUE       1956-10-21 00:00:00 2016-12-27 00:00:00
 3 Chuck Be… musician      90 TRUE       1926-10-18 00:00:00 2017-03-18 00:00:00
 4 Bill Pax… actor         61 TRUE       1955-05-17 00:00:00 2017-02-25 00:00:00
 5 Prince    musician      57 TRUE       1958-06-07 00:00:00 2016-04-21 00:00:00
 6 Alan Ric… actor         69 FALSE      1946-02-21 00:00:00 2016-01-14 00:00:00
 7 Florence… actor         82 TRUE       1934-02-14 00:00:00 2016-11-24 00:00:00
 8 Harper L… author        89 FALSE      1926-04-28 00:00:00 2016-02-19 00:00:00
 9 Zsa Zsa … actor         99 TRUE       1917-02-06 00:00:00 2016-12-18 00:00:00
10 George M… musician      53 FALSE      1963-06-25 00:00:00 2016-12-25 00:00:00
```

readxl은 셀의 내용을 보고 열 종류를 추측한다. 날짜 셀은 `<dttm>`으로 읽는다. 추측이 틀리거나 결측 표기(`"N/A"`, `"-"`)가 섞여 있으면 `col_types`와 `na`로 직접 정한다. `col_types`에는 `"skip"`, `"guess"`, `"logical"`, `"numeric"`, `"date"`, `"text"`, `"list"`를 쓸 수 있다.

같은 모양의 시트가 여러 개면 [반복 글](/posts/r4ds-iteration)의 `map()`으로 읽어 합친다.

```r
excel_sheets(path) |>
  set_names() |>
  map(\(s) read_excel(path, sheet = s, range = "A5:F15")) |>
  list_rbind(names_to = "sheet") |>
  count(sheet, Profession, sort = TRUE) |>
  head(5)
```

```text
# A tibble: 5 × 3
  sheet Profession     n
  <chr> <chr>      <int>
1 arts  actor          5
2 arts  musician       4
3 other journalist     2
4 other lawyer         2
5 other politician     2
```

Excel 파일로 저장할 때는 `writexl::write_xlsx()`를 쓴다. Google Sheets는 googlesheets4 패키지의 `read_sheet()`가 같은 인자로 읽는다(인증이 필요하다).

```r norun
library(googlesheets4)
gs4_deauth()   # 공개 시트는 인증 없이
read_sheet("시트 URL 또는 ID", sheet = "Sheet1", range = "A5:F15")
```

## 2. 데이터베이스: DBI와 dbplyr

회사 자료는 대부분 데이터베이스에 있다. R은 **DBI** 패키지로 데이터베이스와 대화한다. DBI는 연결, 쿼리, 결과 받기를 정한 공통 인터페이스이고, 실제 연결은 데이터베이스마다 다른 드라이버 패키지(RPostgres, RMariaDB, odbc, duckdb 등)가 맡는다.

```r
con <- dbConnect(duckdb())          # 메모리 안의 duckdb
dbWriteTable(con, "flights", flights)
dbWriteTable(con, "airlines", airlines)
dbListTables(con)

dbGetQuery(con, "
  SELECT carrier, COUNT(*) AS n, AVG(dep_delay) AS delay
  FROM flights
  WHERE dep_delay IS NOT NULL
  GROUP BY carrier
  ORDER BY delay DESC
  LIMIT 3
")
```

```text
[1] "airlines" "flights" 
  carrier     n    delay
1      F9   682 20.21554
2      EV 51356 19.95539
3      YV   545 18.99633
```

실제 서버라면 `dbConnect(RPostgres::Postgres(), host = ..., dbname = ..., user = ...)`처럼 드라이버와 접속 정보만 바뀐다. 비밀번호는 코드에 적지 않고 환경변수나 키체인에서 읽는다.

### dbplyr: dplyr 코드를 SQL로

SQL을 몰라도 된다. `tbl()`로 테이블을 가리키면 dplyr 동사를 그대로 쓸 수 있고, **dbplyr**가 이를 SQL로 번역해 데이터베이스에서 실행한다.

```r
flights_db <- tbl(con, "flights")

delay_db <- flights_db |>
  filter(!is.na(dep_delay)) |>
  group_by(carrier) |>
  summarise(n = n(), delay = mean(dep_delay, na.rm = TRUE))

delay_db |> arrange(desc(delay)) |> show_query()
```

```text
<SQL>
SELECT carrier, COUNT(*) AS n, AVG(dep_delay) AS delay
FROM flights
WHERE (NOT((dep_delay IS NULL)))
GROUP BY carrier
ORDER BY delay DESC
```

`show_query()`로 번역된 SQL을 볼 수 있다. 이 시점까지 데이터베이스는 아무것도 계산하지 않았다. dbplyr는 **게으르게** 동작해서, 결과를 출력하거나 `collect()`를 부를 때 쿼리를 보낸다.

```r
delay_db |>
  left_join(tbl(con, "airlines"), join_by(carrier)) |>
  arrange(desc(delay)) |>
  head(3) |>
  collect()
```

```text
# A tibble: 3 × 4
  carrier     n delay name                    
  <chr>   <dbl> <dbl> <chr>                   
1 F9        682  20.2 Frontier Airlines Inc.  
2 EV      51356  20.0 ExpressJet Airlines Inc.
3 YV        545  19.0 Mesa Airlines Inc.
```

`collect()`는 결과를 R의 tibble로 가져온다. 큰 테이블은 데이터베이스 안에서 필터와 요약을 끝내고 작은 결과만 가져오는 것이 핵심이다. R 함수 중 SQL로 번역되지 않는 것(직접 만든 함수 등)은 `collect()` 뒤에 쓴다.

## 3. 큰 파일: Parquet과 arrow

CSV는 사람이 읽을 수 있는 텍스트라 어디서나 열리지만, 크고 느리며 열 종류 정보가 없다. **Parquet**은 열 단위로 압축해 저장하는 이진 형식이다. 열 종류를 함께 저장하고, 필요한 열만 읽을 수 있다.

duckdb는 Parquet을 직접 쓰고 읽는다. flights를 CSV와 Parquet으로 저장해 크기를 비교한다.

```r
dir <- tempfile(); dir.create(dir)
csv_path <- file.path(dir, "flights.csv")
pq_path  <- file.path(dir, "flights.parquet")

write_csv(flights, csv_path)
dbExecute(con, sprintf("COPY flights TO '%s' (FORMAT parquet)", pq_path))

c(csv_MB = file.size(csv_path), parquet_MB = file.size(pq_path)) / 1024^2
```

```text
[1] 336776
    csv_MB parquet_MB 
 29.615259   5.498969
```

`dbExecute()`는 영향을 받은 행 수(336,776)를 돌려준다. 같은 자료가 CSV로 29.6MB, Parquet으로 5.5MB로, 약 5분의 1이다. 열 단위 저장이 왜 이렇게 잘 압축되는지는 [Parquet 압축의 원리](/posts/parquet-compression-sorting)에 정리했다. Parquet 파일은 불러오지 않고 그 자리에서 질의할 수 있다. dbplyr로 Parquet 파일을 테이블처럼 쓴다.

```r
tbl(con, sprintf("read_parquet('%s')", pq_path)) |>
  filter(month == 1) |>
  count(origin, sort = TRUE) |>
  collect()
```

```text
# A tibble: 3 × 2
  origin     n
  <chr>  <dbl>
1 EWR     9893
2 JFK     9161
3 LGA     7950
```

arrow 패키지는 같은 일을 R 안에서 한다. `open_dataset()`은 파일(또는 폴더 안의 여러 파일)을 열기만 하고, dplyr 동사를 쌓은 뒤 `collect()`할 때 필요한 부분만 읽는다. 연도·월로 폴더를 나누어 저장(`write_dataset(partitioning = ...)`)하면 필터에 해당하는 폴더만 읽어 더 빠르다.

```r norun
library(arrow)
write_dataset(flights, "flights_pq", partitioning = "month")
open_dataset("flights_pq") |>
  filter(month == 1) |>
  count(origin) |>
  collect()

# arrow 테이블을 duckdb로 넘겨 SQL과 섞어 쓸 수도 있다
open_dataset("flights_pq") |> to_duckdb()
```

```r
dbDisconnect(con, shutdown = TRUE)
```

## 4. 비교

| 형식 | 읽기 | 크기·속도 | 열 종류 정보 | 언제 |
|---|---|---|---|---|
| CSV | `read_csv()` | 크고 느림 | 없음 (추측) | 주고받기, 작은 자료 |
| Excel | `read_excel()` | 중간 | 셀마다 (섞일 수 있음) | 사람이 만든 표 |
| 데이터베이스 | `dbGetQuery()`, `tbl()` | 서버에서 계산 | 있음 | 여러 사람이 쓰는 큰 자료 |
| Parquet | `read_parquet()`, `open_dataset()` | 작고 빠름, 일부 열만 읽음 | 있음 | 메모리보다 큰 분석용 파일 |

| dplyr | SQL |
|---|---|
| `filter()` | `WHERE` |
| `select()` | `SELECT` |
| `mutate()` | `SELECT ... AS` |
| `group_by()` + `summarise()` | `GROUP BY` + 집계 함수 |
| `arrange()` | `ORDER BY` |
| `left_join()` | `LEFT JOIN` |
| `head(n)` | `LIMIT n` |

SQL을 쓸 수 있으면 `dbGetQuery()`로 직접 써도 되고, `show_query()`로 dbplyr가 만든 SQL을 보고 배울 수도 있다. 패키지 설치가 제한된 [망분리 환경](/posts/air-gapped-analysis-environment)에서는 DBI와 드라이버가 승인되어 있는지가 먼저다. 그렇지 않으면 데이터베이스 측에서 SQL로 줄인 결과를 CSV로 내려받아 읽는 방법을 쓴다.

## 자주 하는 실수

- Excel 제목 줄 때문에 열 이름과 종류가 엉망이 된다. `skip`, `na`, `col_types`를 준다.
- dbplyr 결과를 R 함수에 넘기다 번역 오류가 난다. 데이터베이스에서 줄인 뒤 `collect()`하고 R 함수를 쓴다.
- 큰 테이블 전체를 `collect()`해 메모리가 부족해진다. 필터와 요약을 먼저 한다.
- 비밀번호를 코드에 적는다. 환경변수나 키체인을 쓴다.

## 요약

| 작업 | 함수 |
|---|---|
| Excel 시트 목록, 읽기 | `excel_sheets()`, `read_excel(skip, na, col_types, range)` |
| Excel 쓰기 | `write_xlsx()` |
| DB 연결, SQL 실행 | `dbConnect()`, `dbGetQuery()`, `dbDisconnect()` |
| DB를 dplyr로 | `tbl()`, `show_query()`, `collect()` |
| Parquet | duckdb `read_parquet()`, arrow `open_dataset()`, `write_dataset()` |

## 참고자료

- [R for Data Science (2e) - Spreadsheets](https://r4ds.hadley.nz/spreadsheets)
- [R for Data Science (2e) - Databases](https://r4ds.hadley.nz/databases)
- [R for Data Science (2e) - Arrow](https://r4ds.hadley.nz/arrow)

다음 글: [R4DS - 계층형 자료와 웹 스크래핑](/posts/r4ds-hierarchical-web)
