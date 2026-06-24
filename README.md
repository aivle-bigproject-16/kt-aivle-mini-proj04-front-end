# LMS Frontend - EKS 기반 CI/CD 배포 문서

## 프로젝트 개요

이 repository는 도서 관리 및 에피소드 서비스의 프론트엔드 애플리케이션입니다. React와 Vite를 기반으로 로그인/회원가입, 도서 목록, 도서 상세, 에피소드 작성/조회, 댓글, 좋아요, AI 커버 생성 화면을 제공합니다.

우리 조는 프론트엔드와 백엔드를 모두 EKS에 배포하는 구조를 목표로 합니다. 프론트엔드는 정적 파일만 제공한다면 S3 배포도 가능하지만, 로그인 쿠키, 백엔드 API 연동, 같은 ALB 아래에서의 라우팅 구성을 고려해 백엔드와 동일하게 컨테이너 기반 EKS 배포 대상으로 잡았습니다.

공통 클라우드 아키텍처, 네트워크, EKS, IAM, Auto Scaling, CloudWatch 상세 설명은 백엔드 README를 기준 문서로 관리합니다.

- 공통 클라우드 기준 문서: https://github.com/aivle-bigproject-16/KT-AIVLE-mini-proj05-back-end

## Frontend Repository 구성

```text
KT-AIVLE-mini-proj04-front-end/
├── api/                          # json-server 또는 서버리스 형태의 API 보조 코드
├── k8s/                          # EKS 배포용 Kubernetes 매니페스트
│   ├── frontend-config.yaml      # 프론트엔드 환경 설정 ConfigMap
│   ├── frontend-deployment.yaml  # frontend Pod/replica/RollingUpdate 정의
│   └── frontend-service.yaml     # frontend Pod 접근용 ClusterIP Service
├── public/                       # 정적 리소스, 아이콘, favicon
├── src/                          # React 프론트엔드 소스코드
│   ├── assets/                   # 이미지, SVG 등 화면 자산
│   ├── common/                   # 공통 레이아웃, Header/Footer/Button 등 재사용 컴포넌트
│   ├── hooks/                    # API 호출 및 화면 로직용 커스텀 훅
│   │   └── auth/                 # 로그인, 회원가입, 토큰 갱신 관련 훅
│   ├── screen/                   # 주요 페이지 단위 컴포넌트
│   ├── utils/                    # 인증 저장소, 검색 유틸 등 공통 유틸
│   ├── App.jsx                   # 라우팅 및 최상위 앱 구성
│   └── main.jsx                  # React 앱 진입점
├── buildspec.yml                 # Docker image build + ECR push용 CodeBuild 명세
├── buildspec-deploy.yaml         # EKS kubectl apply 배포용 CodeBuild 명세
├── dockerfile                    # Vite build 후 Nginx 이미지로 실행하는 Docker 빌드 파일
├── nginx.conf                    # React SPA fallback 설정
├── package.json                  # npm scripts 및 의존성
├── vite.config.js                # Vite 설정
├── vercel.json                   # 기존 배포 설정 파일
└── README.md
```

## 주요 기술 스택

| 구분 | 사용 기술 |
| --- | --- |
| Framework | React 19 |
| Build Tool | Vite |
| Runtime Container | Nginx |
| Routing | react-router-dom |
| API 통신 | axios |
| 상태 관리 | zustand |
| CI/CD | GitHub, AWS CodePipeline, AWS CodeBuild |
| Container Registry | Amazon ECR |
| Deployment Target | Amazon EKS |

## 프론트엔드 배포 선택 이유

| 선택 항목 | 이유 |
| --- | --- |
| EKS 배포 | 백엔드와 같은 클러스터에서 실행해 ALB/Ingress 라우팅을 단순화합니다. |
| Docker 이미지 | Vite 빌드 결과물을 Nginx 컨테이너로 실행하면 실행 환경이 고정됩니다. |
| ECR `lms-frontend` | CodeBuild가 만든 프론트엔드 이미지를 저장하고 EKS에서 pull합니다. |
| ALB Ingress | `/` 화면 요청은 frontend-service로, API 요청은 backend-service로 나눌 수 있습니다. |
| Auto Scaling | 트래픽 증가 시 frontend Pod replica를 늘려 정적 리소스 응답 부하를 분산합니다. |

## 전체 클라우드 구조

공통 구조는 백엔드 README의 전체 클라우드 구조를 기준으로 합니다. 프론트엔드는 아래 흐름에서 `Frontend GitHub Repo -> mini16-front-end-pipe -> mini16-front-end -> lms-frontend -> frontend Pod` 구간을 담당합니다.

```mermaid
flowchart LR
    FE_GH["GitHub Frontend Repo\nKT-AIVLE-mini-proj04-front-end"] --> FE_CP["CodePipeline\nmini16-front-end-pipe"]
    FE_CP --> FE_CB["CodeBuild\nmini16-front-end"]
    FE_CB --> FE_ECR["ECR\nlms-frontend"]
    FE_ECR --> EKS["EKS Cluster\nuser126-cluster"]
    EKS --> FE_POD["frontend Pod\nlms-frontend image"]
    ALB["ALB / Ingress"] --> FE_SVC["frontend-service"]
    FE_SVC --> FE_POD
```

## 현재 CI/CD 상태

현재 프론트엔드 repository에는 Docker/ECR 빌드와 EKS 배포를 위한 기본 파일이 추가되어 있습니다.

| 파일 | 현재 역할 | 상태 |
| --- | --- | --- |
| `buildspec.yml` | ECR 로그인, Docker image build/tag/push | 구성됨 |
| `buildspec-deploy.yaml` | `kubectl` 설치, kubeconfig 설정, frontend 매니페스트 apply, rollout 확인 | 구성됨 |
| `dockerfile` | Node 20 Alpine으로 Vite build 후 Nginx 이미지 생성 | 파일명 확인 필요 |
| `nginx.conf` | React SPA 새로고침 시 `index.html` fallback 처리 | 구성됨 |
| `k8s/frontend-config.yaml` | `NODE_ENV=production` 등 ConfigMap 설정 | 구성됨 |
| `k8s/frontend-deployment.yaml` | `lms-frontend` 이미지, replica 2, RollingUpdate 정의 | 구성됨 |
| `k8s/frontend-service.yaml` | frontend Pod의 80 포트를 ClusterIP Service로 노출 | 구성됨 |

`docker build`는 Linux 환경에서 기본적으로 `Dockerfile` 이름을 찾으므로, 현재 파일명 `dockerfile`이 CodeBuild에서 정상 인식되는지 확인이 필요합니다. 문제가 생기면 파일명을 `Dockerfile`로 바꾸거나 `docker build -f dockerfile ...` 형태로 명시해야 합니다.

## 목표 CI/CD 파이프라인

```mermaid
flowchart LR
    SRC["Source\nGitHub main branch"] --> BUILD["Build\nCodeBuild mini16-front-end"]
    BUILD --> IMAGE["Docker Build\nNginx + dist"]
    IMAGE --> ECR["ECR Push\nlms-frontend"]
    ECR --> DEPLOY["Deploy\nkubectl apply"]
    DEPLOY --> ROLLING["RollingUpdate\nfrontend Pods"]
    ROLLING --> ALB["ALB Ingress\n서비스 노출"]
```

## 각 스테이지에서 필요한 세팅

| Stage | 필요한 세팅 | 현재 상태 |
| --- | --- | --- |
| Source | GitHub Connector로 `aivle-bigproject-16/KT-AIVLE-mini-proj04-front-end` 연결 | 구성됨 |
| Build | `VITE_API_URL`을 `.env`로 생성, ECR 로그인, Docker image build/tag | 구성됨 |
| Image Push | `879772956301.dkr.ecr.us-east-1.amazonaws.com/lms-frontend`에 commit hash tag와 `latest` push | 구성됨 |
| Deploy | `aws eks update-kubeconfig`, `frontend-deployment.yaml` 이미지 tag 치환, ConfigMap/Deployment/Service apply | 구성됨 |
| Expose | Ingress에서 `/` 또는 프론트 경로를 `frontend-service`로 연결 | 추가 필요 |
| Scaling | `frontend-hpa.yaml` 또는 공통 HPA 매니페스트로 CPU 기준 replica 조절 | 추가 필요 |
| Monitor | CodeBuild 로그, rollout status, ALB target health, Pod CPU/log 확인 | 구성 필요 |

## buildspec.yml 역할

```text
pre_build: VITE_API_URL 기반 .env 생성, ECR 로그인, IMAGE_TAG 생성
build: Docker image build, ECR 주소로 image tag 지정
post_build: ECR에 commit hash tag와 latest tag push
```

## buildspec-deploy.yaml 역할

```text
install: kubectl 설치
pre_build: aws eks update-kubeconfig로 user126-cluster 접속 설정
build: frontend-deployment.yaml의 이미지 tag 수정 후 ConfigMap, Deployment, Service 적용
post_build: kubectl rollout status로 배포 성공 여부 확인
```

배포 단계가 CodeBuild에서 동작하려면 CodeBuild 서비스 역할이 EKS 클러스터의 `aws-auth`에 등록되어 있어야 합니다. 이 IAM 권한 부분은 아직 확정 전이므로 백엔드 README의 `IAM과 aws-auth (수정 필요)` 섹션을 기준으로 확인해야 합니다.

## 아직 추가 또는 확인이 필요한 배포 항목

| 항목 | 이유 |
| --- | --- |
| Ingress 매니페스트 | ALB를 생성하고 `/` 요청을 `frontend-service`로 연결해야 합니다. |
| HPA 매니페스트 | CPU 기준으로 frontend Pod replica를 자동 조절하려면 필요합니다. |
| `dockerfile` 파일명 | Linux CodeBuild에서 기본 Dockerfile 인식 여부 확인이 필요합니다. |
| `VITE_API_URL` 환경 변수 | CodeBuild 환경 변수로 실제 백엔드 API 주소가 전달되어야 합니다. |
| CodeBuild IAM 권한 | ECR push와 EKS kubectl apply 권한이 필요합니다. |

## 프론트엔드 요청 흐름

```text
User Browser
-> ALB
-> Ingress
-> frontend-service
-> frontend Pod
-> Nginx
-> React 정적 파일 제공
-> React 앱에서 백엔드 API 호출
```

## 실행 명령

```powershell
npm install
npm run dev
```

PowerShell에서 `npm.ps1` 실행 정책 오류가 발생하면 아래처럼 `npm.cmd`를 사용할 수 있습니다.

```powershell
npm.cmd install
npm.cmd run dev
```

## 민감정보 관리

`.env`에는 API 주소나 환경 변수가 들어갈 수 있으므로 GitHub에 올리지 않습니다. AWS Access Key, DB 비밀번호, JWT Secret 같은 값은 README에 기록하지 않고, 배포 환경에서는 Kubernetes Secret, AWS Secrets Manager, CodeBuild 환경 변수로 관리합니다.

## 미니프로젝트 6차 R&R

| 역할 | 담당 | 비고 |
| --- | --- | --- |
| 조장 | 김경순 | 기술 P1 겸임, 전체관리 |
| 발표자 | 심경민 | Day3 발표 |
| 서기 | 공다연 | 기록, README |
| 검토 담당자 | 김성준, 장윤재 | 크로스체크, 칸반보드 보조 |
| 타임키퍼 | 김현민 | 칸반보드 관리 |
| ppt 제작자 | 김창민, 조승대 | 3일차 발표자료 |