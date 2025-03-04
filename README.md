# SH Portfolio
> dannyp0930 개인 포트폴리오 웹 사이트

## 목차
- [기술 스택](#기술-스택)
- [설치 및 실행](#설치-및-실행)
- [배포 및 운영](#배포-및-운영)
- [ToDo List](#todo-list)
- [Next](#next)

## 기술 스택

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
# DB 빌드
$ yarn docker:build

# DB 마이그레이션
$ yarn migrate:dev

# 어플리케이션 실행
$ yarn dev
```

## 배포 및 운영
> Github action을 통해 master branch merge 발생시 자동 배포 구현

### .env
```
MYSQL_PASSWORD=""
JWT_SECRET=""
JWT_REFRESH_SECRET=""
DATABASE_URL=""
SHADOW_DATABASE_URL=""

AWS_ACCESS_KEY_ID=""
AWS_SECRET_ACCESS_KEY=""
AWS_REGION=""
S3_BUCKET_NAME=""
S3_REGION=""

API_URL=""
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

### Back
| Category | Task                        | Status |
| -------- | --------------------------- | ------ |
| 스키마   | 매인 배너                   | ☑      |
|          | 자기 소개                   | ☑      |
|          | 기본정보                    | ☑      |
|          | 스킬                        | ☑      |
|          | 프로젝트                    | ☑      |
|          | 이력 상세                   | ☑      |
|          | 이력서                      | ☑      |
| API 개발 | 메인 배너                   | ☐      |
|          | 자기 소개                   | ☐      |
|          | 정보                        | ☑      |
|          | 스킬                        | ☑      |
|          | 프로젝트                    | ☑      |
|          | 이력 상세                   | ☑      |
|          | 이력서                      | ☐      |
| 기타     | 로그인 쿠키 강화            | ☑      |
|          | POST, PUT, DELETE 권한 설정 | ☑      |
|          | Grafana 등 추적 로깅        | ☐      |
|          | Firebase 제거               | ☐      |

### Front
| Category        | Task               | Status |
| --------------- | ------------------ | ------ |
| Admin Dashboard | 메인 배너          | ☐      |
|                 | 자기 소개          | ☐      |
|                 | 정보               | ☑      |
|                 | 스킬               | ☑      |
|                 | 프로젝트           | ☑      |
|                 | 이력서             | ☐      |
| 랜딩 페이지     | 프로젝트 상세 모달 | ☐      |
|                 | 추가 디자인        | ☐      |
|                 | 이력서 다운로드    | ☐      |

### Readme 문서 작성
| Task                        | Status |
| --------------------------- | ------ |
| 프로젝트 개요 정리          | ☐      |
| 기술 스택 명시              | ☐      |
| 설치 및 실행 방법 작성      | ☐      |
| 주요 기능 설명 추가         | ☐      |
| API 문서화                  | ☐      |
| 배포 및 운영 관련 정보 기재 | ☐      |

## Next
- Oauth
- 뉴스레터 (+구독 시 이력서 전송)
- 블로그