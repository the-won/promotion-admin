# CLAUDE.md

이 파일은 이 저장소에서 작업할 때 Claude Code(claude.ai/code)에게 제공되는 가이드입니다.

## 명령어

```bash
npm run dev      # 개발 서버 실행 (localhost:5173, 브라우저 자동 오픈)
npm run build    # 프로덕션 빌드
npm run preview  # 프로덕션 빌드 미리보기
```

현재 테스트 러너는 설정되어 있지 않습니다.

## 아키텍처 개요

**Vue 2 + Vite** 기반의 프로모션 HTML 이메일 템플릿 제작 및 다운로드 어드민 툴입니다. 백엔드 없이 완전히 클라이언트 사이드로 동작합니다.

### 핵심 데이터 흐름

1. `EmTemplates.vue` 또는 `EventTemplates.vue`의 탭에서 템플릿 유형 선택
2. `TemplateForm.vue`가 `templateDefaults.js` 설정을 기반으로 동적 폼 필드를 렌더링
3. `PreviewFrame.vue`가 `<iframe>` 안에서 실시간 HTML 미리보기 렌더링
4. 다운로드 시 `downloadHtml.js` 또는 `ImageDownloadHtml.js`가 `templateHtml/index.js`의 생성 함수를 호출하여 파일 저장

### 템플릿 시스템

템플릿은 두 개의 병렬 레이어로 정의됩니다:

- **`src/config/templateDefaults.js`** — 각 템플릿의 폼 필드 스키마 (레이블, 타입, 기본값)
- **`src/templateHtml/index.js`** — 템플릿 이름과 HTML 생성 함수를 매핑

템플릿 이름 키(예: `'em-type-4'`, `'em-type-imagemap'`)는 아래 세 곳에서 일치해야 합니다:
- `templateDefaults.js` (폼 설정)
- `templateHtml/index.js` (HTML 생성 함수 매핑)
- 뷰 컴포넌트의 템플릿 목록 배열

### 템플릿 종류

**EM 템플릿** (이메일 마케팅, `EmTemplates.vue`):
- `em-type-1` — 기본 이벤트 이메일 (`emType1Html.js`)
- `em-type-2` / `em-type-coupon` — 이미지 링크 타입 (`em/type-image-link/emType2Html.js`)
- `em-type-4` — 이패밀리샵, 엑셀 업로드 지원 (`em/efamily/`)
- `em-type-5` — 시크릿세일 / 화끈딜, 엑셀 업로드 지원 (`em/secret-sale/`)
- `em-type-imagemap` / `em-type-letter` — 이미지맵 + 핫스팟 에디터 (`em/type-usemap/`)
- `privacy-policy` — 개인정보 처리방침 (`privacy/privacyHtml.js`)

**이벤트 템플릿** (`EventTemplates.vue`):
- `em-type-3` — 이벤트맵, 이미지 클릭 영역 (`event/eventMapHtml.js`)

### 핫스팟 / 이미지맵 시스템

이미지맵 템플릿(`em-type-imagemap`, `em-type-3`)은 핫스팟 에디터를 사용합니다:
- `HotspotGroupEditor.vue` — 이미지 위에 클릭 영역을 배치하는 비주얼 에디터
- `hotspotLinkBuilder.js` — `linkType` + 파라미터로 웹/모바일 링크 URL을 생성하는 순수 함수. 미리보기 에디터와 HTML 다운로드 생성기 양쪽에서 공유
- 링크 타입은 웹과 모바일이 다름 (모바일 전용 추가 타입: `brand_store`, `coupon`)

### 다운로드 방식

- **`downloadHtml.js`** — 모든 것을 인라인으로 포함한 단일 `.html` 파일 생성
- **`ImageDownloadHtml.js`** — HTML과 이미지를 분리한 `.zip` 파일 생성 (JSZip + file-saver 사용, 이미지맵 템플릿에서 사용)

### 사이드바 레이아웃 패턴

`EmTemplates.vue`와 `EventTemplates.vue` 모두 동일한 레이아웃 패턴을 공유합니다:
- 접을 수 있는 사이드바 (300px 또는 600px 너비)에 폼 컨트롤 배치
- `document.body`의 CSS 클래스(`page-em-templates`, `sidebar-closed`, `sidebar-expanded`)로 `App.vue`에 정의된 헤더 너비 전환을 제어

### Vue 미리보기 컴포넌트

`src/templates/` 디렉토리는 실시간 미리보기를 렌더링하는 Vue 컴포넌트를 포함합니다 (`PreviewFrame.vue` 내부에서 사용). 이 컴포넌트들은 `src/templateHtml/`의 HTML 문자열 생성기와 병렬 구조이지만, Vue 컴포넌트로 렌더링됩니다.

### 스타일

- `src/styles/common-form.css` — `main.js`에서 전역으로 임포트되는 폼 공통 스타일
- 컴포넌트별 스코프 스타일은 각 `.vue` 파일 내에 인라인으로 정의
- 다크모드 UI 작업 진행 중
