# 리팩토링 계획 (Refactoring Plan)

> 상세 내용은 각 섹션을 참고. 작업 전 반드시 별도 브랜치(`refactor/*`)로 분리하여 진행.

## 1. 코드 리팩토링

### 현재 상태

프로젝트는 Next.js 16 + TypeScript + Prisma 기반의 포트폴리오 관리 애플리케이션입니다.

**주요 관찰 사항:**

1. **함수/모듈의 문서화 부족**
   - `lib/` 디렉토리의 대부분 유틸리티 함수에 JSDoc 주석 없음
   - 예: `uploadToS3()`, `deleteFromS3()`, `formatPhoneNumber()` 등
   - `hooks/useScrollAnimation.ts`만 일부 JSDoc이 있음

2. **API 라우트 핸들러의 중복 패턴**
   - Admin 권한 확인 로직이 매 라우트에서 반복됨 (예: `isAdmin(req)` 체크)
   - 에러 처리 및 응답 포맷이 일관되지 않음
   - 트랜잭션 감싸기가 반복됨

3. **컴포넌트 문제**
   - `ImageInput.tsx`의 상태 관리가 복잡함 (중복된 `useEffect` 의존성)
   - `ModalContainer` 인터페이스에서 `closeModal: function` 타입 사용 (부정확한 타입)

4. **유틸리티 함수 산재**
   - `lib/utils/` 디렉토리 밑에만 3개 파일
   - `lib/` 루트에 4개 파일 추가로 분산
   - 관련 함수들이 논리적으로 그룹화되지 않음

### 개선 방향

#### 1.1 JSDoc 주석 추가
**대상 함수:**
- `lib/uploadToS3.ts` - S3 업로드 및 ContentType 매핑 로직 설명
- `lib/deleteFromS3.ts` - URL 파싱 및 키 추출 로직 설명
- `lib/formatUtils.ts` - 전화번호 포맷팅 규칙 문서화
- `lib/authMiddleware.ts` - JWT 검증 및 Admin 확인 프로세스
- `lib/isAdmin.ts` - 쿠키 기반 Admin 확인 방식 설명
- `hooks/useAuthCheck.ts` - 주기적 인증 체크 로직 설명

**예시:**
```typescript
/**
 * AWS S3에 파일을 업로드하고 접근 가능한 URL을 반환합니다.
 *
 * @param file - 업로드할 파일 바이너리 데이터
 * @param dir - S3 내 디렉토리 경로 (예: 'skill', 'project')
 * @param fileName - 원본 파일명 (자동으로 sanitize됨)
 * @returns 업로드된 파일의 공개 S3 URL
 * @throws S3 업로드 실패 시 에러 발생
 */
export default async function uploadToS3(
  file: Buffer,
  dir: string,
  fileName: string
): Promise<string>
```

#### 1.2 단일 책임 원칙 위반 개선
**문제:** `authMiddleware.ts`가 토큰 검증과 관리자 권한 확인을 동시에 수행

**개선안:**
```typescript
// lib/auth/tokenVerifier.ts - 토큰 검증만 담당
export async function verifyToken(token: string): Promise<{ userId: string }> { ... }

// lib/auth/adminChecker.ts - 관리자 권한만 확인
export async function checkAdminAccess(userId: string): Promise<boolean> { ... }

// lib/auth/authMiddleware.ts - 위의 두 함수를 조합
export async function authMiddleware(req: NextRequest) { ... }
```

#### 1.3 API 라우트 중복 코드 제거
**문제:** 모든 API 라우트에서 반복되는 패턴
```typescript
// 현재: 매 라우트마다 반복
if (!isAdmin(req)) {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
try {
  // ... 비즈니스 로직
} catch (err) {
  console.error('[endpoint]', err);
  return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
}
```

**개선안:** 고차 함수(Higher-Order Function) 또는 미들웨어 패턴
```typescript
// lib/api/withAdminAuth.ts
export function withAdminAuth(handler: (req: NextRequest) => Promise<NextResponse>) {
  return async (req: NextRequest) => {
    if (!isAdmin(req)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    try {
      return await handler(req);
    } catch (err) {
      console.error('[API Error]', err);
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  };
}

// 사용 예:
export const POST = withAdminAuth(async (req) => {
  const data = await req.json();
  // ... 비즈니스 로직만 작성
  return NextResponse.json({ message: 'OK' }, { status: 200 });
});
```

#### 1.4 컴포넌트 상태 관리 단순화
**문제:** `ImageInput.tsx`의 복잡한 상태 관리
```typescript
// 현재: 중복된 의존성 배열 문제
useEffect(() => {
  if (ref?.current?.value === '') {
    setNewImageUrl('');
  }
}, [ref, ref?.current?.value, setNewImageUrl]); // ref.current?.value는 문제 가능
```

**개선안:** ref 감시 대신 파일 입력 이벤트 활용

---

## 2. 타입 구조화

### 현재 타입 파일 목록

```
types/
├── index.d.ts              # Prisma 재내보내기 (User, Project, Career 등)
├── component.d.ts          # 컴포넌트 Props (ImageInputProps, AdminPaginationProps 등)
├── context.d.ts            # Context 타입 (UserContextType, UserContextValue)
├── params.d.ts             # Next.js 동적 라우트 파라미터 (ProjectUpdateParams 등)
└── schema.d.ts             # 기타 스키마 (BannerProps, SkillsProps, ProjectListPros 등)
```

### 문제점

1. **네이밍 오류**
   - `PatchOrderRequset` → `PatchOrderRequest` (Requset은 오타)
   - `ProjectListPros` → `ProjectListProps` (Props가 맞는 표기)
   - `CareerWidthDetails` → `CareerWithDetails` (Width는 오타, With가 맞음)

2. **파일 분류의 혼란**
   - `schema.d.ts`에 Props 인터페이스가 섞여 있음 (컴포넌트 Props와 분리되어야 함)
   - `params.d.ts`는 Next.js 동적 라우트만 있는데 너무 파일이 적음
   - `component.d.ts`는 일부 Props만 있고 나머지는 `schema.d.ts`에 있음

3. **타입 중복**
   - Prisma 생성 타입을 재내보내기만 함 (덮어쓸 수 없고, 조정 불가)
   - 확장 타입(`ProjectWithHasDetail`, `CareerWithDetails`)이 전역에 분산

4. **Prisma 타입과 커스텀 타입 혼용**
   - `schema.d.ts`에서 Prisma 타입을 `declare global`로 재내보내기
   - 커스텀 타입도 같은 파일에 혼재되어 있음

### 개선 방향

#### 2.1 디렉토리 구조 개선
```
types/
├── index.d.ts              # 전역 타입 내보내기 (한 곳에서 import)
├── entities/               # Prisma 생성 타입 (재내보내기 전용)
│   └── prisma.d.ts         # declare global로 Prisma 타입 재내보내기
├── models/                 # 비즈니스 로직 확장 타입
│   ├── project.d.ts        # ProjectWithHasDetail, ProjectListProps
│   ├── career.d.ts         # CareerWithDetails 등
│   └── auth.d.ts           # 인증 관련 타입
├── components/             # 컴포넌트 Props (현재 component.d.ts)
│   ├── common.d.ts         # 공통 컴포넌트 (ImageInputProps 등)
│   ├── dashboard.d.ts      # 대시보드 컴포넌트 Props
│   └── home.d.ts           # 홈페이지 컴포넌트 Props
└── api/                    # API 관련 타입
    ├── routes.d.ts         # Next.js 동적 라우트 파라미터
    └── requests.d.ts       # API 요청 바디 타입 (현재 PatchOrderRequest 등)
```

#### 2.2 네이밍 컨벤션 통일
**수정 필요:**
```typescript
// 전:
interface PatchOrderRequset { ... }      // Requset → Request
interface ProjectListPros { ... }        // Pros → Props
interface CareerWidthDetails { ... }     // Width → With

// 후:
interface PatchOrderRequest { ... }
interface ProjectListProps { ... }
interface CareerWithDetails { ... }
```

#### 2.3 Prisma 타입 vs 커스텀 타입 분리
```typescript
// types/entities/prisma.d.ts
// Prisma 생성 타입만 재내보내기 (수정 금지, 읽기 전용)
declare global {
  type User = Prisma.User;
  type Project = Prisma.Project;
  // ... 나머지 모든 Prisma 타입
}

// types/models/project.d.ts
// 비즈니스 로직 확장 타입
declare global {
  // Prisma 타입을 확장/조합
  interface ProjectWithHasDetail extends Project {
    hasProjectDetail: boolean;
  }

  interface ProjectListProps {
    projects: ProjectWithHasDetail[];
  }
}
```

#### 2.4 전역 선언 통합
```typescript
// types/index.d.ts - 이 파일 하나만 import 권장
export {};
// 그 외 모든 types/*.d.ts 파일은 자동 로드됨
// tsconfig.json의 typeRoots에 설정
```

---

## 3. 프로젝트 디렉토리 구조

### 현재 구조

```
portfolio/
├── app/                          # Next.js App Router
│   ├── api/                      # API 라우트 (20개 이상)
│   │   ├── career/
│   │   ├── info/                 # 정보 관련 API 모음
│   │   ├── project/
│   │   ├── skill/
│   │   ├── user/
│   │   ├── login/
│   │   ├── register/
│   │   └── [기타 단일 엔드포인트]
│   ├── dashboard/                # 관리자 대시보드
│   │   ├── career/
│   │   ├── info/                 # 정보 관리 (세부 페이지 7개)
│   │   ├── project/
│   │   ├── skill/
│   │   └── user/
│   ├── [public pages]            # login, register, profile 등
│   └── layout.tsx
├── components/
│   ├── Layout/                   # 헤더, 푸터, 레이아웃
│   ├── common/                   # 공통 컴포넌트
│   ├── ui/                       # shadcn/ui 컴포넌트
│   ├── dashboard/                # 대시보드 관련 컴포넌트
│   │   ├── career/
│   │   ├── info/                 # 정보 관리 행(Row) 컴포넌트
│   │   └── project/
│   └── home/                     # 홈페이지 섹션
│       ├── Banner/
│       ├── Career/
│       ├── Project/
│       ├── Skills/
│       └── Newletter/
├── context/                      # React Context (UserContext)
├── hooks/                        # 커스텀 React Hooks (3개)
├── lib/
│   ├── utils/                    # 유틸리티 함수 (index, validation, auth)
│   ├── constants/                # 상수 (errorMessages, SKILL_CATEGORY)
│   ├── [기타 유틸]               # uploadToS3, deleteFromS3, formatUtils 등
│   └── prisma.ts                 # Prisma Client 싱글톤
├── types/                        # TypeScript 전역 선언
├── prisma/                       # Prisma 스키마 및 마이그레이션
└── public/                       # 정적 자산
```

### 권장 구조 (Next.js 15/16 트렌드)

```
portfolio/
├── app/
│   ├── (public)/                 # 공개 페이지 그룹
│   │   ├── layout.tsx
│   │   ├── page.tsx              # 홈페이지
│   │   ├── login/
│   │   ├── register/
│   │   └── [profile]/            # 사용자 포트폴리오 조회
│   │
│   ├── (auth)/                   # 인증 필요 페이지 그룹
│   │   ├── layout.tsx
│   │   └── profile/              # 내 포트폴리오 보기
│   │
│   ├── (admin)/                  # 관리자 페이지 그룹
│   │   ├── layout.tsx
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── page.tsx
│   │       ├── career/
│   │       ├── project/
│   │       └── skill/
│   │
│   ├── api/
│   │   └── v1/                   # API 버전 관리
│   │       ├── admin/            # 관리자 API
│   │       │   ├── career/
│   │       │   ├── project/
│   │       │   └── skill/
│   │       ├── public/           # 공개 API
│   │       │   ├── [userId]/     # 사용자 포트폴리오 데이터
│   │       │   └── careers/      # 경력 목록
│   │       └── auth/             # 인증 관련
│   │           ├── login/
│   │           ├── register/
│   │           └── refresh/
│   │
│   └── layout.tsx
│
├── components/
│   ├── layout/                   # 레이아웃 컴포넌트
│   ├── common/                   # 공통 재사용 컴포넌트
│   ├── ui/                       # UI 컴포넌트 라이브러리
│   ├── sections/                 # 페이지 섹션 (홈페이지)
│   │   ├── Banner/
│   │   ├── Career/
│   │   ├── Project/
│   │   └── Skills/
│   ├── admin/                    # 관리자 대시보드 컴포넌트
│   │   ├── forms/                # CRUD 폼
│   │   ├── tables/               # 데이터 테이블
│   │   └── dialogs/              # 모달/대화
│   └── profile/                  # 프로필/포트폴리오 컴포넌트
│
├── features/                     # 도메인별 기능 모듈 (선택적)
│   ├── career/
│   │   ├── hooks/
│   │   ├── services/             # API 호출 로직
│   │   └── types.ts
│   ├── project/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   └── skill/
│       ├── hooks/
│       ├── services/
│       └── types.ts
│
├── lib/
│   ├── api/                      # API 클라이언트
│   │   ├── client.ts             # axios instance
│   │   ├── endpoints.ts          # 엔드포인트 정의
│   │   └── helpers.ts            # API 헬퍼 (withAdminAuth 등)
│   ├── auth/                     # 인증 관련 유틸
│   │   ├── jwt.ts
│   │   ├── middleware.ts
│   │   └── permissions.ts
│   ├── db/                       # 데이터베이스 관련
│   │   └── client.ts             # Prisma 싱글톤
│   ├── storage/                  # 파일/이미지 저장소
│   │   ├── s3.ts
│   │   └── validators.ts
│   ├── utils/                    # 범용 유틸리티
│   │   ├── format.ts
│   │   ├── validation.ts
│   │   ├── cn.ts
│   │   └── common.ts
│   └── constants.ts              # 상수
│
├── hooks/                        # 전역 커스텀 Hooks
│   ├── useAuth.ts
│   ├── useScrollAnimation.ts
│   └── useIsMobile.ts
│
├── context/                      # React Context
│   └── auth.tsx
│
├── types/                        # TypeScript 타입
│   ├── index.d.ts
│   ├── entities/
│   ├── models/
│   ├── components/
│   └── api/
│
├── styles/                       # 글로벌 스타일
│   └── globals.css
│
├── prisma/                       # Prisma 스키마
├── public/                       # 정적 자산
└── docs/                         # 프로젝트 문서
```

### 주요 변경 포인트

#### 3.1 Route Groups를 사용한 레이아웃 분리
**현재:** 모든 페이지가 동일 레이아웃 또는 조건부 레이아웃
**개선:**
- `(public)` - 공개 페이지 (헤더/푸터만)
- `(auth)` - 로그인 필요 페이지 (헤더/푸터 + 네비)
- `(admin)` - 관리자 페이지 (관리자 레이아웃)

#### 3.2 API 라우트 구조 개선
**현재:** 평탄한 구조
```
/api/career → /api/career/route.ts
/api/project → /api/project/route.ts
```

**개선:** 버전 관리 + 역할별 분리
```
/api/v1/admin/career → /api/v1/admin/career/route.ts
/api/v1/public/careers → /api/v1/public/careers/route.ts
/api/v1/auth/login → /api/v1/auth/login/route.ts
```

**장점:**
- API 버전 관리 용이
- 공개 API와 관리자 API 명확히 분리
- 향후 v2 추가 시 하위호환성 유지

#### 3.3 컴포넌트 폴더 구조 개선
**현재:** `components/dashboard/info/CareerRow.tsx` vs `components/dashboard/career/CareerRow.tsx` 중복

**개선:**
- 명확한 용도별 분류 (layout, common, ui, sections, admin)
- 도메인별 기능 모듈 분리 시 컴포넌트도 함께 이동

#### 3.4 서비스 레이어 추가 (선택적)
**현재:** API 호출이 컴포넌트에 직접 포함
**개선:**
```typescript
// features/career/services/api.ts
export async function fetchCareers() { ... }
export async function createCareer(data) { ... }
export async function updateCareer(id, data) { ... }

// components에서 서비스 호출만
const { data } = await careerService.fetchCareers();
```

---

## 작업 우선순위

| 우선순위 | 항목 | 예상 범위 | 브랜치 | 작업 시간 |
|---------|------|---------|--------|---------|
| 1 | 타입 시스템 재구조화 및 오타 수정 | `types/` 5개 파일 완전 재정리 | `refactor/types-restructure` | 1-2시간 |
| 2 | API 라우트 중복 코드 제거 (withAdminAuth 헬퍼) | `lib/api/` 신규 생성 + 라우트 10개 수정 | `refactor/api-middleware` | 2-3시간 |
| 3 | JSDoc 주석 추가 | `lib/` 8개 파일 + `hooks/` 3개 파일 | `refactor/add-jsdoc` | 1-2시간 |
| 4 | 컴포넌트 상태 관리 최적화 | `ImageInput.tsx` 등 4-5개 컴포넌트 | `refactor/component-optimization` | 1시간 |
| 5 | 디렉토리 구조 개선 (선택적) | 전체 파일 이동 및 라우트 리팩토링 | `refactor/directory-structure` | 4-6시간 |
| 6 | 서비스 레이어 추가 (선택적) | `features/` 디렉토리 신규 생성 | `refactor/service-layer` | 3-4시간 |

### 우선순위 설명

**1순위: 타입 시스템 재구조화**
- 가장 영향 범위가 작음 (types/ 파일만 수정)
- 오타 수정 (`PatchOrderRequset` 등)는 전체 코드 품질 향상
- 다른 작업의 기초가 됨

**2순위: API 라우트 중복 코드 제거**
- 20개 이상의 API 라우트에서 중복 제거 가능
- 장기적 유지보수성 향상
- 테스트 작성도 용이

**3순위: JSDoc 주석 추가**
- 즉시 개발 경험 개선 (IDE 자동완성)
- 새로운 팀원 온보딩 효율화
- 기술 부채 감소

**4순위: 컴포넌트 최적화**
- 성능 개선 및 버그 제거
- 작은 규모이지만 영향도 높음

**5-6순위: 구조 개선 (선택적)**
- 대규모 리팩토링
- 프로젝트 규모가 더 커질 때 추천
- 지금 당장 필요하지 않음

---

## 추가 고려사항

### Testing 추가
현재 테스트 코드가 없으므로 리팩토링 전에 주요 로직에 대한 테스트 추가 권장:
- `lib/uploadToS3.ts`, `lib/deleteFromS3.ts` - 파일 업로드 테스트
- `lib/authMiddleware.ts` - JWT 검증 테스트
- `lib/formatUtils.ts` - 전화번호 포맷 테스트

### 문서화
현재 `/docs` 폴더가 있으나 활용되지 않는 것으로 보임:
- API 문서 (Swagger/OpenAPI)
- 아키텍처 가이드
- 개발 가이드 추가 권장

### 보안 감시
- `isAdmin` 확인이 쿠키 기반 (`is-admin` 쿠키)인데, JWT 토큰 기반으로 통일하는 것 권장
- `authMiddleware.ts`의 `isAdmin()` vs `checkAdminAccess()`의 이중 검증 고려

