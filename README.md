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
- [ToDo List](#todo-list)
- [Next](#next)

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
|          | AWS S3                          | 3.750.0        | 클라우드 기반 파일 스토리지 서비스            |
| DevOps   | AWS EC2                         | -              | 클라우드 가상 서버                            |
|          | GitHub Actions                  | -              | 자동화된 빌드, 테스트 및 배포 파이프라인      |
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
> Github action을 통해 master branch merge 발생시 자동 배포 구현

### /etc/nginx/sites-available/{server_name}
```nginx
server {
    listen 80;
    server_name {server_name};
    return 301 https://$host$request_uri;  # HTTP -> HTTPS 리디렉션
}

server {
    listen 443 ssl;
    server_name {server_name} www.{server_name};

    ssl_certificate /etc/letsencrypt/live/{server_name}/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/{server_name}/privkey.pem;
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```
| 항목              | 설명                    |
| ----------------- | ----------------------- |
| 도메인 구매       | Gabia                   |
| DNS 등록          | AWS Route53             |
| HTTPS 인증서 발급 | AWS Certificate Manager |

### .env
```
MYSQL_USER=""
MYSQL_PASSWORD=""
MYSQL_DATABASE=""
MYSQL_SHADOW_DATABASE=""
DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@localhost:3306/${MYSQL_DATABASE}"
SHADOW_DATABASE_URL="mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@localhost:3307/${MYSQL_SHADOW_DATABASE}"

JWT_SECRET=""
JWT_REFRESH_SECRET=""

AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
S3_BUCKET_NAME=""
S3_REGION=""

ADMIN_EMAIL=""
ADMIN_PASSWORD=""

GMAIL_USER=""
GMAIL_PASSWORD=""

API_URL=""
```
- 아래 명령어로 각 `JWT_SECRET`/`JWT_REFRESH_SECRET` 생성
  ```bash
  $ node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

### .github/deploy.yml
```yml
name: Deploy on Master Merge

on:
    push:
        branches:
            - master

jobs:
    build-and-deploy:
        runs-on: ubuntu-latest

        steps:
            - name: Checkout repository
              uses: actions/checkout@v4

            - name: Execute remote ssh and Deploy
              uses: appleboy/ssh-action@master
              with:
                  host: ${{ secrets.SSH_HOST }}
                  username: ${{ secrets.SSH_USERNAME }}
                  key: ${{ secrets.SSH_PRIVATE_KEY }}
                  script: |
                      set -e
                      echo "Starting deployment process..."

                      echo "Updating repository..."
                      cd /srv/portfolio
                      sudo git pull origin master || { echo "Git pull failed"; exit 1; }

                      echo "Setting up Node.js environment..."
                      export NVM_DIR="$HOME/.nvm"
                      [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
                      nvm use 22 || { echo "nvm use failed"; exit 1; }

                      echo "Installing dependencies..."
                      sudo yarn install --frozen-lockfile || { echo "yarn install failed"; exit 1; }

                      echo "Running migrations..."
                      sudo yarn migrate:prod || { echo "yarn migrate:prod failed"; exit 1; }

                      echo "Building application..."
                      sudo yarn build || { echo "yarn build failed"; exit 1; }

                      echo "Restarting application..."
                      if pm2 describe portfolio > /dev/null 2>&1; then
                        pm2 restart portfolio --update-env || { echo "pm2 restart failed"; exit 1; }
                      else
                        pm2 start "yarn start" --name portfolio --update-env || { echo "pm2 start failed"; exit 1; }
                      fi

```
github repository에 환경 변수 등록 필수

## ToDo List
- 뉴스레터 
  - 회원 구독 (여부 스키마)
  - 비회원 구독 (O)
  - 첫 구독 시 이력서 전송
  - 구독 메일 기능
- 메일 로그 주기 삭제
- 블로그
  - 주기별 or 게시글 별 뉴스레터 전송
- Schema 순서 추가
- grafana 등 로깅
- 사용자
  - 회원가입/email/비밀번호 찾기 고도화
  - 마이페이지
  - Oauth
