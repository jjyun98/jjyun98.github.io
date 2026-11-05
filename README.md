# jjyun98.github.io

통계학 전공 수업과 교재, 데이터 분석과 파이프라인 작업을 정리하는 개인 노트 블로그다. Astro 기반 정적 사이트로 GitHub Pages에 배포한다.

## 시리즈

- 데이터 마이닝 (ISLR, R)
- 시계열 분석 (조신섭·손영숙·성병찬, R)
- 생명과학통계 (이재원·박미라·유한나, SAS)
- 선형대수학 (하길찬)
- 미시경제학 (Pindyck·Rubinfeld 기반 강의 자료)
- R for Data Science

## 글 작성 규칙

- 글 위치: `src/content/posts/<시리즈 폴더>/<slug>/index.md`
- 문체는 이다체, 그림은 Excalidraw 손그림 스타일 SVG (`./figures/`)
- R 코드 결과 이미지는 `./images/`에 저장
- 로고 원본: `src/assets/logo/*.excalidraw`

## 기술 스택

- [Astro](https://astro.build/)
- TypeScript
- Tailwind CSS
- Markdown / MDX
- KaTeX
- Mermaid
- Pagefind

## 실행 방법

```bash
npm install
npm run dev
```

빌드와 로컬 프리뷰는 다음 명령으로 확인합니다.

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```text
src/content/posts/   블로그 글
src/pages/           Astro 라우트
src/components/      UI 컴포넌트
src/layouts/         페이지 레이아웃
src/site.config.ts   사이트 메타데이터와 테마 설정
public/              정적 파일
```

## 글 frontmatter

```md
---
title: '시리즈명 - 글 제목'
published: 2026-01-01
draft: false
description: '글 설명'
series: '시리즈명'
tags: ['tag']
---
```

시리즈 안의 순서는 `published` 날짜 순이다.

## Credits

이 블로그는 [MultiTerm Astro](https://github.com/stelcodes/multiterm-astro)를 기반으로 커스터마이징했다.
