# CertiOne (자격증 문제 학습 플랫폼)

## 📱 프로젝트 소개
CertiOne은 자격증 시험 준비를 위한 효율적인 학습 플랫폼입니다. 사용자들이 다양한 자격증의 기출문제와 예상문제를 풀어보고 학습할 수 있는 웹 애플리케이션입니다.

## ✨ 주요 기능
- **문제 풀이**: 다양한 자격증의 기출문제와 예상문제를 풀어볼 수 있습니다.
- **시트 선택**: 원하는 시험 과목과 문제 세트를 선택할 수 있습니다.
- **점수 확인**: 문제 풀이 후 즉시 결과를 확인할 수 있습니다.
- **반응형 디자인**: 모바일과 데스크톱 환경 모두에서 최적화된 사용자 경험을 제공합니다.

## 🛠 기술 스택
- **Frontend**: React, TypeScript, Material-UI (MUI)
- **상태 관리**: React Query
- **스타일링**: Emotion
- **API 통신**: Axios
- **백엔드 연동**: Express, Google Sheets API
- **개발 도구**: Vite, ESLint

## 📁 프로젝트 구조
```
src/
├── components/          # 리액트 컴포넌트
│   ├── Quiz.tsx        # 퀴즈 화면 컴포넌트
│   ├── SubjectList.tsx # 과목 목록 컴포넌트
│   └── SubtitleList.tsx# 부제목 목록 컴포넌트
├── services/           # 외부 서비스 연동
│   └── googleSheets.ts # 구글 시트 API 연동
├── types/              # 타입 정의
│   └── index.ts       # 공통 타입 정의
└── assets/            # 정적 리소스
```

## 🚀 실행 방법

### 웹 버전 (CertiOne)
1. 의존성 설치
```bash
npm install
```

2. 개발 서버 실행
```bash
npm run dev
```

3. 프로덕션 빌드
```bash
npm run build
```

### 모바일 앱 버전 (CertiOneApp)
1. 의존성 설치
```bash
cd CertiOneApp
npm install
```

2. 앱 실행
```bash
npm run web    # 웹 버전
npm run ios    # iOS 시뮬레이터
npm run android # Android 에뮬레이터
npm start      # Expo 개발 서버
```

## 📱 모바일 앱 버전 (CertiOneApp)
React Native와 Expo를 사용한 모바일 앱 버전을 제공합니다:

- **개발 환경**: Expo
- **실행 방법**: Expo Go 앱 또는 시뮬레이터를 통해 실행
- **지원 플랫폼**: iOS, Android, Web
- **QR 코드 스캔**: Expo Go(Android) 또는 카메라 앱(iOS)로 스캔
- **개발 도구**:
  - `s`: development build로 전환
  - `a`: Android 에뮬레이터 실행
  - `i`: iOS 시뮬레이터 실행
  - `w`: 웹 버전 실행
  - `r`: 앱 리로드
  - `m`: 메뉴 토글
  - `j`: 디버거 실행
  - `o`: 프로젝트 코드 에디터에서 열기

## 🌟 주요 특징
- 직관적인 사용자 인터페이스
- 실시간 점수 계산
- 문제 셔플 기능
- 다크 모드 지원
- 반응형 레이아웃

## 🔧 환경 설정
### 웹 버전 요구사항
- Node.js 18.0.0 이상
- npm 9.0.0 이상
- TypeScript 5.2.2
- Vite 5.1.6

### 모바일 앱 버전 요구사항
- Expo CLI
- React Native
- iOS 시뮬레이터 (Mac 전용)
- Android Studio & 에뮬레이터
- Expo Go 앱 (실제 기기 테스트용)

## 🔍 ESLint 설정
프로젝트는 타입 체크를 포함한 ESLint 설정을 사용합니다:
- Type-aware 린트 규칙 활성화
- React 전용 린트 규칙 적용
- 코드 스타일 통일성 유지

## 📝 라이선스
이 프로젝트는 MIT 라이선스를 따릅니다.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
