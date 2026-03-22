# CLAUDE.md — 프로젝트 컨텍스트

## 프로젝트 개요
dannyp0930의 개인 포트폴리오 웹사이트. Next.js 15 App Router + Prisma + MySQL + AWS S3 기반 풀스택 프로젝트.

## 기술 스택
- **Frontend/Backend**: Next.js 15 (App Router), React 19, TypeScript
- **DB ORM**: Prisma + MySQL (Railway)
- **스타일**: Tailwind CSS + shadcn/ui
- **배포**: Vercel (main 브랜치 자동 배포)
- **스토리지**: AWS S3

## 브랜치 전략
```
main        ← 프로덕션 (Vercel 자동 배포)
develop     ← 통합 브랜치
fix/*       ← 버그 수정
feat/*      ← 신규 기능
refactor/*  ← 리팩토링
```
- 작업은 항상 `develop`에서 브랜치를 따서 진행
- 완료 후 `develop` → `main` 순서로 merge

## 주요 규칙

### 데이터 변경 API
- `POST`, `PUT`, `PATCH`, `DELETE` 메서드 성공 경로에 반드시 `revalidatePath('/')` 추가
- `import { revalidatePath } from 'next/cache'`

### 에러 핸들링
- 프로덕션 응답에 `details: err` 절대 포함 금지 — DB 스키마 노출 위험
- 에러는 `console.error('[컨텍스트]', err)`로 서버 로그에만 기록
- 응답: `NextResponse.json({ error: '요청을 처리할 수 없습니다.' }, { status: 500 })`

### 인증/인가
- 관리자 판단: `is-admin` 쿠키 문자열 비교 → JWT 서명 검증으로 교체 예정
- 데이터 변경 API는 반드시 인증 확인 필요

### 커밋 메시지
한국어 사용, Conventional Commits 형식:
```
feat(scope): 기능 설명
fix(scope): 버그 수정 설명
refactor(scope): 리팩토링 설명
chore: 기타 작업
```
- 커밋 메시지에 `Co-Authored-By:` 트레일러 절대 포함 금지

## 환경변수 키 이름
- `JWT_SECRET` (refresh 포함 모든 미들웨어에서 통일)
- `JWT_REFRESH_SECRET`
- `S3_BUCKET_NAME`, `S3_REGION`

### README.md TODO 관리
- 작업을 완료하면 `README.md`의 `## 후속 작업 (TODO)` 섹션에서 해당 항목을 **즉시 제거**한다
- 커밋 전에 README.md TODO 항목 제거 여부를 반드시 확인한다

## 주의사항
- `Math.random()` 보안 목적 사용 금지 → `crypto.randomBytes()` 사용
- 동적 `orderBy` 파라미터는 화이트리스트로 검증 후 사용
- 단일 쿼리에 `$transaction` 불필요하게 감싸지 않기
