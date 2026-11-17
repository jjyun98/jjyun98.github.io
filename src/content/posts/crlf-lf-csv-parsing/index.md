---
title: 'CRLF와 LF: 줄바꿈 1바이트가 CSV 파싱을 깨뜨리는 이유'
published: 2026-11-16
draft: false
description: '줄바꿈 문자 CRLF와 LF의 기원, UTF-8 BOM과의 차이, 한 파일에 둘이 섞일 때 CSV 파서에서 생기는 오류와 행 누락, Windows에서의 권장 조합을 정리했다.'
series: '데이터 분석 환경'
seriesOrder: 7
tags: ['데이터 전처리', 'Python']
---

에디터에서는 똑같은 줄바꿈으로 보여도, 바이트를 보면 운영체제와 도구에 따라 다른 제어 문자가 기록되어 있다. 평소에는 상관없지만 큰 CSV를 병합하고 분석하다 보면 **이 1바이트 차이 때문에 파싱 오류가 나거나 행이 통째로 빠지는** 일을 만난다. 이 글은 CRLF와 LF의 차이, UTF-8 BOM과의 관계, CSV 처리에서 주의할 점을 정리한다.

## 1. CR과 LF

두 문자는 기계식 타자기와 전신타자기(Teletype)의 동작에서 왔다.

| 문자 | 이름 | 이스케이프 | ASCII | 원래 동작 |
|---|---|---|---|---|
| CR | Carriage Return | `\r` | `0x0D` (13) | 인자 헤드를 현재 줄의 맨 왼쪽으로 되돌린다 |
| LF | Line Feed | `\n` | `0x0A` (10) | 종이를 한 줄 올린다 |

타자기에서는 줄 처음으로 돌아가는 동작과 다음 줄로 넘기는 동작이 따로였다. 다음 줄 맨 앞에서 쓰려면 CR 다음에 LF를 보내야 했고, 이것이 **CRLF(`\r\n`)**다.

## 2. 운영체제마다 다른 이유

**CRLF**: CP/M, MS-DOS 같은 초기 시스템과 HTTP, SMTP, FTP 같은 초기 인터넷 프로토콜, 그리고 CSV 명세(RFC 4180)가 CRLF를 줄바꿈으로 정했다. MS-DOS를 이은 Windows도 이를 유지해, Windows의 기본 도구는 지금도 줄바꿈을 `0D 0A` 2바이트로 쓴다. CRLF는 Windows가 만든 규격이 아니라 초기 표준이 Windows에 남은 것이다.

**LF**: Unix는 한 글자로 "다음 줄 처음"을 뜻하면 된다고 보고 `0A` 1바이트로 줄였다. Linux와 macOS가 이를 따른다. Classic Mac OS는 `\r`만 썼지만 OS X부터 LF로 바뀌었다.

서버, 컨테이너, Git, Python, DuckDB, Spark 같은 데이터 인프라가 Unix 계열 위에서 돌아가면서, **Windows에서 작업하더라도 데이터와 소스 파일은 LF로 맞추는 것**이 사실상의 표준이 되었다.

## 3. UTF-8 BOM과의 차이

BOM과 줄바꿈은 별개의 속성이다.

| 구분 | UTF-8 BOM | CRLF / LF |
|---|---|---|
| 역할 | "이 파일은 UTF-8"이라는 표식 | 줄의 끝을 알리는 제어 문자 |
| 위치 | 파일 맨 앞에 한 번 | 매 줄 끝마다 |
| 바이트 | `EF BB BF` (3바이트) | `0D 0A` (2바이트) 또는 `0A` (1바이트) |

둘은 독립이므로 `BOM + LF`, `BOM + CRLF`, `BOM 없음 + LF`, `BOM 없음 + CRLF` 네 조합이 모두 가능하다. 문제가 생기는 지점도 다르다.

- **BOM을 처리하지 않으면** 첫 컬럼명 앞에 보이지 않는 문자 `﻿`가 붙어 `col == "년월일"` 비교가 실패한다. Python에서는 `encoding="utf-8-sig"`로 읽으면 BOM이 제거된다. 반대로 한국어 Windows 엑셀은 BOM이 있어야 UTF-8 CSV의 한글이 깨지지 않는다(인코딩 자세한 내용은 [네이밍 표준](/posts/data-naming-standards) 글).
- **줄바꿈이 섞이면** CSV 파서가 레코드 경계를 잘못 판단해 오류가 나거나 행이 빠진다. 아래에서 다룬다.

## 4. 한 파일에 CRLF와 LF가 섞이는 경우

가장 흔한 경우는 **Windows에서 만든 CSV에 Python으로 데이터를 이어 붙일 때**다.

```python
with open("old.csv", "r", encoding="utf-8-sig", newline="") as fin, \
     open("merged.csv", "w", encoding="utf-8-sig", newline="") as fout:
    header = fin.readline()        # newline=""이라 헤더 끝의 \r\n이 그대로 남는다
    fout.write(header)             # 1행만 CRLF로 기록된다
    for row in new_rows:
        fout.write(row + "\n")     # 2행부터는 LF로 기록된다
```

`newline=""`은 Python이 줄바꿈을 변환하지 않게 하는 옵션이다. 그래서 읽은 헤더의 `\r\n`이 그대로 쓰이고, 직접 붙인 `\n`도 그대로 쓰인다. 에디터로 열면 티가 나지 않지만 바이트는 이렇게 된다.

```text
1행 (헤더):  EF BB BF ... ,방문인구 0D 0A   <-- CRLF
2행 (본문):  20260301, ... ,0.1    0A      <-- LF
3행 (본문):  20260301, ... ,0.2    0A      <-- LF
```

이 파일을 읽으면 두 가지 문제가 생긴다.

1. **줄바꿈 자동 감지 실패**: DuckDB 같은 CSV 엔진은 파일 앞부분을 보고 줄바꿈 문자를 정한다. 1행에서 `\r\n`을 감지했는데 이후 `\n`만 나오면, 엄격 모드(`strict_mode`)에서는 형식이 일관되지 않다며 오류를 낸다.
2. **강제 옵션의 함정**: 오류를 피하려고 `new_line = '\n'`을 지정하면 1행 끝에 남은 `\r`과 맞물려 줄 경계 계산이 어긋날 수 있다. 이때 파일 앞부분의 행이 **오류 없이 빠지는** 경우가 있다. 오류가 나지 않으니 더 위험하다.

> **주의** 옵션으로 오류를 넘겼다면, 읽은 행 수를 `wc -l`이나 원본 행 수와 반드시 비교한다. 오류가 없다고 데이터가 온전한 것은 아니다.

어떤 줄바꿈이 쓰였는지는 바이트로 확인한다.

```bash
file merged.csv                     # "with CRLF line terminators" 여부를 알려 준다
head -c 200 merged.csv | xxd        # 앞 200바이트를 16진수로 본다
grep -c $'\r' merged.csv            # \r이 들어 있는 줄 수
```

## 5. Windows에서도 LF로 바꿔도 되는가

된다. 오히려 권장한다.

| 도구 | LF 지원 |
|---|---|
| DuckDB, Python(`csv`, `pandas`, `polars`, `pyarrow`), R, DBeaver | Windows에서도 문제없이 읽는다. 줄마다 1바이트씩 작아진다 |
| 엑셀 | **UTF-8 BOM만 있으면** LF여도 더블클릭으로 열었을 때 한글과 줄바꿈이 정상이다 |
| 에디터 | VS Code, Notepad++, Windows 10(1809 이후)과 Windows 11 메모장이 LF를 지원한다 |

구형 메모장(Windows 7 시절)과 일부 오래된 배치 스크립트만 CRLF를 요구한다.

## 정리

1. **핵심은 일관성이다.** CRLF냐 LF냐보다, 한 파일 안(헤더와 본문)과 데이터셋 전체가 같은 줄바꿈을 쓰는 것이 중요하다.
2. **엑셀 호환까지 고려하면 `UTF-8 BOM + LF`**가 무난하다. 분석 파이프라인 전용이면 BOM 없는 `UTF-8 + LF`도 좋다.
3. **CSV를 쓸 때 줄바꿈을 정규화한다.** `csv.writer(..., lineterminator="\n")`를 명시하고, 헤더를 복사할 때는 `header.rstrip("\r\n") + "\n"`으로 끝을 맞춘다.
4. **크고 오래 보관할 데이터는 Parquet으로 바꾼다.** 줄바꿈, 인용부호, 인코딩 파싱 문제가 아예 없다([Parquet 압축](/posts/parquet-compression-sorting) 글).
