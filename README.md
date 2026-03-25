# SH Portfolio
> dannyp0930의 개인 포트폴리오 웹 사이트

## 목차
- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [API 문서](#api-문서)
- [배포 및 운영](#배포-및-운영)
- [컨트리뷰션 가이드](#컨트리뷰션-가이드)
- [라이센스](#라이센스)
- [후속 작업 (TODO)](#후속-작업-todo)

## 프로젝트 개요
SH Portfolio는 개발자 dannyp0930의 개인 포트폴리오 웹사이트입니다. 이 프로젝트는 다음과 같은 목표를 가지고 있습니다:
- 개인의 기술 스택과 프로젝트 경험을 체계적으로 정리
- 다양한 기술을 활용한 풀스택 개발 경험
- 지속적인 개선과 새로운 기술 도입을 통한 학습

## 주요 기능
- **배너 & 소개**
  - 반응형 배너 이미지 (desktop / tablet / mobile 별도 설정)
  - 모바일 소개 텍스트 더 보기/접기 토글
  - 이력서 파일 다운로드 링크

- **프로젝트 관리**
  - 프로젝트 등록/수정/삭제
  - 프로젝트 상세 설명 및 이미지 다중 업로드 (AWS S3)
  - 이미지 드래그 앤 드롭 정렬
  - GitHub, Notion, 홈페이지 링크 연동

- **경력 관리**
  - 회사별 경력 및 상세 업무 관리
  - 경력 상세 항목 드래그 앤 드롭 정렬
  - 기간별 경력 정리

- **스킬 관리**
  - 기술 스택 카테고리별 분류
  - 숙련도 표시 (1~5단계)
  - 기술 설명 및 아이콘 표시

- **기본 정보 관리**
  - 학력, 경험, 자격증, 언어, 연락처 CRUD
  - 항목별 노출 순서 관리

- **이메일 문의**
  - 방문자 → 관리자 이메일 발송 (Nodemailer + Gmail)
  - 발송 이력 DB 기록 (`MailLog`)

- **뉴스레터 구독**
  - 이메일 구독/구독 취소
  - 구독자 목록 관리 대시보드

- **관리자 대시보드**
  - 모든 콘텐츠의 CRUD 관리
  - 페이지네이션 지원
  - JWT 기반 인증 (access + refresh token)

## 기술 스택

| Category | Technology | Version | Description |
|----------|-----------|---------|-------------|
| **Frontend** | Next.js | ^16.0.8 | React 기반 풀스택 프레임워크, App Router / SSR / SSG |
| | React | ^19.2.1 | UI 구축 라이브러리 |
| | Tailwind CSS | ^3.4.1 | 유틸리티 기반 CSS 프레임워크 |
| | shadcn/ui | - | Radix UI + Tailwind 기반 컴포넌트 라이브러리 |
| | next-themes | ^0.4.4 | 다크모드 테마 지원 |
| | Font Awesome | ^6.7.2 | 아이콘 라이브러리 |
| | @dnd-kit | ^6.3.1 | 드래그 앤 드롭 정렬 |
| | Embla Carousel | ^8.5.2 | 이미지 캐러셀 |
| **Form** | React Hook Form | ^7.54.2 | 폼 상태 관리 |
| | Zod | ^3.24.2 | 스키마 기반 입력값 검증 |
| **Backend** | Prisma | ^6.3.1 | 타입 안전한 DB ORM (싱글톤 패턴) |
| | MySQL | - | 관계형 데이터베이스 (Railway 호스팅) |
| | bcrypt | ^5.1.1 | 비밀번호 해싱 |
| | JWT | ^9.0.2 | 사용자 인증 (access + refresh token) |
| | Nodemailer | ^6.10.0 | 이메일 발송 (Gmail SMTP) |
| **Storage** | AWS S3 | ^3.750.0 | 이미지 / 파일 스토리지 |
| **DevOps** | Vercel | - | 프론트엔드 및 서버 자동화 배포 |
| | Railway | - | MySQL 클라우드 호스팅 |
| | Docker | - | 로컬 개발 DB 컨테이너 |
| **Tools** | TypeScript | ^5 | 정적 타입 검사 |
| | ESLint | ^9 | 코드 품질 검사 |
| | Prettier | ^3.4.2 | 코드 포맷터 |
| | Husky + lint-staged | 9.1.7 + 15.4.3 | Git 커밋 전 자동 검사 및 포맷팅 |

## 설치 및 실행
```bash
# DB 시작 (이미 빌드된 컨테이너가 있는 경우)
$ yarn docker:up

# DB 최초 빌드 및 시작
$ yarn docker:build

# DB 마이그레이션
$ yarn migrate:dev

# DB Seed (처음 한 번만 실행)
$ yarn db:seed

# 개발 서버 실행
$ yarn dev

# Prisma Studio (DB GUI)
$ yarn studio
```

## API 문서

### 인증
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/register` | 회원가입 |
| POST | `/api/login` | 로그인 (access + refresh token 발급) |
| POST | `/api/logout` | 로그아웃 |
| POST | `/api/refresh` | access token 갱신 |
| POST | `/api/find/email` | 이메일 찾기 |
| POST | `/api/find/password` | 비밀번호 찾기 |

### 사용자 / 프로필
| Method | Path | 설명 |
|--------|------|------|
| GET / POST / PUT | `/api/user` | 사용자 조회 / 생성 / 수정 |
| GET / POST / PUT | `/api/profile` | 프로필 조회 / 생성 / 수정 |

### 소개 & 기본 정보
| Method | Path | 설명 |
|--------|------|------|
| GET / POST / PUT | `/api/intro` | 배너 소개 관리 |
| GET / POST / PUT / DELETE | `/api/info/contact` | 연락처 |
| GET / POST / PUT / DELETE | `/api/info/education` | 학력 |
| GET / POST / PUT / DELETE | `/api/info/experience` | 경험 |
| GET / POST / PUT / DELETE | `/api/info/career` | 경력 개요 |
| GET / POST / PUT / DELETE | `/api/info/certificate` | 자격증 |
| GET / POST / PUT / DELETE | `/api/info/language` | 언어 |

### 경력
| Method | Path | 설명 |
|--------|------|------|
| GET / POST / PUT / DELETE | `/api/career` | 경력 CRUD |
| GET / POST / PUT / DELETE | `/api/career/detail` | 경력 상세 항목 CRUD |

### 프로젝트
| Method | Path | 설명 |
|--------|------|------|
| GET / POST / PUT / DELETE | `/api/project` | 프로젝트 CRUD |
| GET / POST / PUT / DELETE | `/api/project/detail` | 프로젝트 상세 CRUD |
| GET / POST / PUT / DELETE | `/api/project/image` | 프로젝트 이미지 CRUD |

### 스킬
| Method | Path | 설명 |
|--------|------|------|
| GET / POST / PUT / DELETE | `/api/skill` | 스킬 CRUD |

### 이메일 & 구독
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/email` | 문의 이메일 발송 |
| GET / POST / DELETE | `/api/subscription` | 뉴스레터 구독 관리 |

### 스토리지
| Method | Path | 설명 |
|--------|------|------|
| POST | `/api/upload` | AWS S3 파일 업로드 |

## 배포 및 운영

### Vercel + Railway(Cloud DB) 배포
- **Frontend/Backend**: [Vercel](https://vercel.com/) (자동화된 CI/CD, Next.js 지원)
- **Database**: [Railway](https://railway.app/) (MySQL 관리/호스팅)
- `main` 브랜치 push 시 Vercel이 자동 배포 수행
- Railway 서비스를 통한 MySQL 자동화/백업 지원
- 운영상 중요한 환경 변수는 Vercel / Railway 대시보드 및 GitHub Repo 시크릿에 등록

### 브랜치 전략
```
main        ← 프로덕션 (Vercel 자동 배포)
develop     ← 통합 브랜치
fix/*       ← 버그 수정
feat/*      ← 신규 기능
refactor/*  ← 리팩토링
```

### 환경 변수 예시 (.env)
```
DATABASE_URL="(Railway에서 제공하는 MySQL URL)"

JWT_SECRET=""
JWT_REFRESH_SECRET=""

S3_BUCKET_NAME=""
S3_REGION=""

ADMIN_EMAIL=""
ADMIN_NAME=""
ADMIN_PHONE=""
ADMIN_PASSWORD=""

GMAIL_USER=""
GMAIL_PASSWORD=""

API_URL=""
```

JWT 시크릿 값 생성:
```bash
$ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

자세한 배포 및 환경 변수 관리법은 [Vercel](https://vercel.com/docs) / [Railway](https://docs.railway.app/) 공식 문서 참고.

## 컨트리뷰션 가이드
1. `develop` 브랜치에서 새 브랜치를 생성합니다. (`feat/*`, `fix/*`, `refactor/*`)
2. 변경 사항을 커밋합니다. (Conventional Commits 한국어 형식 준수)
   ```
   feat(scope): 기능 설명
   fix(scope): 버그 수정 설명
   refactor(scope): 리팩토링 설명
   ```
3. `develop` 브랜치로 PR을 생성합니다.
4. 리뷰 후 `develop` → `main` 순서로 merge합니다.

## 라이센스
This project is for personal portfolio use. All rights reserved.

## 후속 작업 (TODO)

### Critical (즉시 조치 필요)
1. `isAdmin` 구현을 JWT 서명 검증으로 교체 — 현재 단순 쿠키 문자열 비교로 관리자 인가
2. `authMiddleware.ts` 환경변수 이름 통일 (`JWT_SECRET_KEY` → `JWT_SECRET`) 및 실제 API 보호 적용

### Major (단기 개선, 1-2주)
- Next.js `middleware.ts` 추가: `/dashboard/*` 경로 서버 레벨 인증 게이트 구현
- Career N+1 쿼리 수정: `prisma.career.findMany({ include: { careerDetails: true } })`로 교체
- Skill 그룹핑 로직 추출: `page.tsx`와 `skill/route.ts` 중복 로직 → `lib/utils/skill.ts`로 분리
- 동적 `orderBy` 파라미터 화이트리스트 검증 추가 (11개 라우트)
- `refresh/route.ts`에 DB refresh token 비교 검증 추가
- `PatchOrderRequset` 오타 수정 → `PatchOrderRequest` (12개 파일)
- 뉴스레터 구독 시 이메일 검증 (크롤링 시도 확인)

### 리팩토링 / 코드 품질
- 코드 리팩토링: JSDoc 주석 추가, 복잡한 로직 분리, 함수 단일 책임 원칙 적용
- 타입 구조화: 중앙화된 타입 정의 일관성 유지, Prisma 생성 타입과 커스텀 타입 분리, 타입 중복 제거
- 프로젝트 디렉토리: Next.js 트렌드에 맞는 폴더 구조 검토 및 재정비

### 중장기 개선 (1개월+)
- Vitest 도입 및 테스트 코드 작성 (유틸리티 함수 단위 테스트, API 라우트 통합 테스트)
- `info/` 하위 6개 CRUD 라우트 공통화 (팩토리 패턴)
- S3 클라이언트 단일화: `uploadToS3.ts`, `deleteFromS3.ts` → `lib/s3Client.ts`로 통합
- 불필요한 `$transaction` 제거 (단일 쿼리를 트랜잭션으로 감싸는 패턴)
- 로그인 엔드포인트에 Rate limiting 추가 (`@upstash/ratelimit` 등)
- `next.config.ts` S3 버킷명 하드코딩 제거 → 환경변수 사용
- Content Security Policy (CSP) 헤더 추가
- Prisma 쿼리 로그 레벨 프로덕션 환경 조정 (`warn`, `error`만 활성화)
- OAuth 소셜 로그인 추가
- 블로그 기능: 주기별/게시글별 뉴스레터 전송
- Grafana 등 로깅/모니터링 도입
- 대시보드에서 테마 컬러 커스터마이징 기능 (`ThemeConfig` DB 테이블 + CSS 변수 동적 주입)
