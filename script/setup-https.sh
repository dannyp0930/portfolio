#!/bin/bash

# ANSI 색상 코드
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # 색상 초기화

echo -e "${GREEN}🚀 HTTPS 환경 설정을 시작합니다...${NC}"

# OS 확인
OS=""
if [[ "$OSTYPE" == "darwin"* ]]; then
    OS="mac"
elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "msys" || "$OSTYPE" == "cygwin" ]]; then
    OS="windows"
else
    echo -e "${RED}❌ 지원되지 않는 OS입니다. 수동으로 mkcert를 설치하세요.${NC}"
    exit 1
fi

# mkcert 설치 확인
if ! command -v mkcert &> /dev/null
then
    echo -e "${YELLOW}⚠️ mkcert가 설치되지 않았습니다.${NC}"
    echo -e "${GREEN}🔧 mkcert를 설치 중...${NC}"
    
    if [[ "$OS" == "mac" ]]; then
        brew install mkcert
    elif [[ "$OS" == "linux" ]]; then
        sudo apt install libnss3-tools -y
        wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-linux-amd64
        chmod +x mkcert
        sudo mv mkcert /usr/local/bin/
    elif [[ "$OS" == "windows" ]]; then
        choco install mkcert
    fi
else
    echo -e "${GREEN}✅ mkcert가 이미 설치되어 있습니다.${NC}"
fi

# mkcert CA 설치
mkcert -install

# certs 디렉토리 생성
mkdir -p certs

# 인증서 생성 (기존 파일이 없을 때만 생성)
if [[ -f "certs/localhost.pem" && -f "certs/localhost-key.pem" ]]; then
    echo -e "${YELLOW}⚠️ 인증서가 이미 존재합니다. 새로 생성하지 않습니다.${NC}"
else
    mkcert -key-file certs/localhost-key.pem -cert-file certs/localhost.pem localhost
    echo -e "${GREEN}✅ 인증서 생성 완료!${NC}"
fi

echo -e "${GREEN}✅ HTTPS 인증서 설정 완료!${NC}"
echo -e "${GREEN}🚀 이제 'node server.js'를 실행하여 HTTPS로 개발 서버를 시작하세요.${NC}"
