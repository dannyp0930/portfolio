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
- **프로젝트 관리**
  - 프로젝트 등록/수정/삭제 기능
  - 프로젝트 상세 정보 및 이미지 관리
  - GitHub, Notion, 홈페이지 링크 연동
  **관련 코드**: `app/dashboard/project/[projectId]/page.tsx` (1-480 라인)

- **경력 관리**
  - 회사별 경력 정보 관리
  - 직무 및 업무 상세 설명
  - 기간별 경력 정리
  **관련 코드**: `app/dashboard/career/[careerId]/page.tsx` (1-37 라인)

- **스킬 관리**
  - 기술 스택 카테고리별 분류
  - 숙련도 표시 (1~5단계)
  - 기술 설명 및 아이콘 표시
  **관련 코드**: `components/home/Skills/index.tsx` (26-189 라인)

- **관리자 대시보드**
  - 모든 정보의 CRUD 관리
  - 페이지네이션 지원
  - 실시간 수정 및 반영

## 기술 스택
****
| Category | Technology                      | Version        | Description                                   |
| -------- | ------------------------------- | -------------- | --------------------------------------------- |
| Frontend | Next.js                         | 15.1.6         | React 기반의 풀스택 프레임워크, SSR/SSG 지원  |
|          | React                           | 19.0.0         | UI 구축을 위한 자바스크립트 라이브러리        |
|          | Tailwind CSS                    | 3.4.1          | 유틸리티 기반의 CSS 프레임워크                |
|          | shadcn/ui (Radix UI + Tailwind) | -              | Tailwind 기반의 UI 컴포넌트 라이브러리        |
|          | Font Awesome                    | 6.7.2          | 다양한 아이콘 제공                            |
| Backend  | Prisma                          | 6.3.1          | 데이터베이스 ORM, 타입 안전한 쿼리 작성       |
|          | MySQL                           | -              | 관계형 데이터베이스 관리 시스템               |
|          | bcrypt                          | 5.1.1          | 비밀번호 해싱을 위한 라이브러리               |
|          | JWT                             | 9.0.2          | JSON Web Token을 통한 사용자 인증             |
| DevOps   | Vercel                          | -              | 프론트엔드 및 서버 자동화 배포                |
|          | Railway                         | -              | 클라우드 DB 관리/호스팅                       |
|          | Docker                          | -              | 애플리케이션 컨테이너화 및 배포               |
| Tools    | TypeScript                      | 5              | 정적 타입 검사를 제공하는 자바스크립트 슈퍼셋 |
|          | ESLint                          | 9              | 코드 품질 및 스타일 검사 도구                 |
|          | Prettier                        | 3.4.2          | 코드 포맷터                                   |
|          | Husky + lint-staged             | 9.1.7 + 15.4.3 | Git 커밋 전 코드 검사 및 포맷팅 자동화        |

## 설치 및 실행
```bash
# DB 빌드 (Docker 또는 Docker Destkop 실행)
$ yarn docker:build

# DB 마이그레이션
$ yarn migrate:dev

# DB Seed (처음 한번만 실행)
$ yarn db:seed

# 어플리케이션 실행
$ yarn dev
```

## API 문서
### 프로젝트 API
- `GET /api/project` - 프로젝트 목록 조회
- `GET /api/project?id={id}` - 특정 프로젝트 상세 조회
- `POST /api/project` - 프로젝트 생성
- `PUT /api/project/{id}` - 프로젝트 수정
- `DELETE /api/project/{id}` - 프로젝트 삭제
**관련 코드**: `app/api/project/route.ts` (42-87 라인)

## 배포 및 운영

### Vercel + Railway(Cloud DB) 배포
- **Frontend/Backend**: [Vercel](https://vercel.com/) (자동화된 CI/CD, Next.js 지원)
- **Database**: [Railway](https://railway.app/) (MySQL 관리/호스팅)
- Github main 브랜치 push 시 Vercel이 자동 배포 수행
- Railway 서비스를 통한 MySQL 자동화/백업 지원
- 운영상 중요한 환경 변수는 Vercel/Railway 대시보드 및 GitHub Repo 시크릿에 등록

#### 환경 변수 예시(.env)
```
DATABASE_URL="(Railway에서 제공하는 MySQL url)"

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
- JWT 시크릿 값은 다음의 명령어로 생성: 
  ```bash
  $ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- 자세한 배포 및 환경 변수 관리법은 Vercel/Railway 공식문서 참고

## 후속 작업 (TODO)

### Critical (즉시 조치 필요)
1. `/api/profile` PUT에 JWT 인증 추가 — 누구나 타인의 사용자 정보를 수정 가능한 취약점
2. 모든 API 라우트의 500 응답에서 `details: err` 제거 — DB 스키마/스택 트레이스 노출 (85곳)
3. `isAdmin` 구현을 JWT 서명 검증으로 교체 — 현재 단순 쿠키 문자열 비교로 관리자 인가
4. `authMiddleware.ts` 환경변수 이름 통일 (`JWT_SECRET_KEY` → `JWT_SECRET`) 및 실제 API 보호 적용
5. `lib/utils/auth.ts`의 `generateRandomPassword`에서 `Math.random()` → `crypto.randomBytes()` 교체
6. `app/api/subscription/route.ts`의 디버그 `console.log(token, isActive)` 즉시 제거
### Major (단기 개선, 1-2주)
- Next.js `middleware.ts` 추가: `/dashboard/*` 경로 서버 레벨 인증 게이트 구현
- Career N+1 쿼리 수정: `prisma.career.findMany({ include: { careerDetails: true } })`로 교체
- Skill 그룹핑 로직 추출: `page.tsx`와 `skill/route.ts` 중복 로직 → `lib/utils/skill.ts`로 분리
- 동적 `orderBy` 파라미터 화이트리스트 검증 추가 (11개 라우트)
- `refresh/route.ts`에 DB refresh token 비교 검증 추가
- `PatchOrderRequset` 오타 수정 → `PatchOrderRequest` (12개 파일)
- 뉴스레터 구독 시 이메일 검증 (크롤링 시도 확인)

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
