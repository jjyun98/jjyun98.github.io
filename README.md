# jjyun98.github.io

개인 블로그 저장소입니다. 통계학 전공과 금융경제학 부전공 배경을 바탕으로 데이터 분석, 통계 모델링, 데이터 파이프라인, 엔지니어링 관련 내용을 정리합니다.

사이트는 Astro 기반 정적 블로그로 구성되어 있으며, GitHub Pages에 배포하는 것을 전제로 합니다.

## 주요 내용

- 통계 전공 서적을 바탕으로 한 개념 정리와 해설
- 주식, 금융, 개인 건강, 자전거 운동 데이터 분석 프로젝트
- R, Python, SQL을 활용한 데이터 분석과 모델링
- AWS, Airflow 기반 데이터 파이프라인과 엔지니어링 기록
- 분석 결과를 재현 가능하게 정리하기 위한 코드, 시각화, 문서화

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

## 글 작성

새 글은 `src/content/posts` 아래에 Markdown 또는 MDX 파일로 추가합니다. 글의 frontmatter에는 최소한 `title`, `published`, `draft`, `description`, `tags`를 지정합니다.

```md
---
title: '글 제목'
published: 2026-01-01
draft: false
description: '글 설명'
tags: ['tag']
---
```

## Credits

이 블로그는 [MultiTerm Astro](https://github.com/stelcodes/multiterm-astro)를 기반으로 커스터마이징했습니다.
