---
name: Promotion Admin
description: 퍼블리셔 없이 프로모션 이메일과 이벤트 HTML을 생성하는 내부 어드민 툴
colors:
  instrument-blue: "#0071e3"
  instrument-blue-hover: "#0077ed"
  instrument-blue-faint: "#e8f0fc"
  graphite-ink: "#1d1d1f"
  mid-graphite: "#6e6e73"
  soft-graphite: "#86868b"
  placeholder-gray: "#aeaeb2"
  hairline-silver: "#d2d2d7"
  border-hover: "#a1a1a6"
  studio-canvas: "#f5f5f7"
  studio-canvas-deep: "#e8e8ed"
  success: "#059669"
  danger: "#dc2626"
  deep-navy: "#0e111c"
  blueprint-indigo: "#5c61d4"
  display-blue: "#0a84ff"
  midnight-canvas: "#1c1c1e"
typography:
  display:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "clamp(1.35rem, 2.5vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "16px"
    fontWeight: 600
    lineHeight: 1.4
  title:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "12px"
    fontWeight: 400
    lineHeight: 1.47
  label:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.07em"
  button:
    fontFamily: "Pretendard, -apple-system, BlinkMacSystemFont, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1
rounded:
  none: "0px"
  btn: "3px"
  tab: "10px"
  panel: "16px"
  chip: "999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-primary-hover:
    backgroundColor: "{colors.instrument-blue-hover}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.mid-graphite}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-soft:
    backgroundColor: "{colors.instrument-blue-faint}"
    textColor: "{colors.instrument-blue}"
    rounded: "{rounded.btn}"
    padding: "10px 18px"
  button-sm:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "7px 14px"
  button-download:
    backgroundColor: "{colors.instrument-blue}"
    textColor: "#ffffff"
    rounded: "{rounded.btn}"
    padding: "14px 20px"
  input-default:
    backgroundColor: "transparent"
    textColor: "{colors.graphite-ink}"
    rounded: "{rounded.none}"
    padding: "7px 0"
---

# Design System: Promotion Admin

## 1. Overview

**Creative North Star: "The Spare Studio"**

이 시스템은 설득을 위한 것이 아니라 작업을 위한 것이다. 모든 표면은 이메일 HTML을 만드는 일을 위해 존재하고, 그 외에는 아무것도 하지 않는다. 장식이 없어서 깔끔한 게 아니라, 있어야 할 것이 정확히 있기 때문에 깔끔하다. The Spare Studio는 좋은 도구가 가지는 고유한 분위기를 가진다. 조용하지만 사용할 때만 존재감이 생기는.

레이아웃은 두 개의 존으로 나뉜다. 상단 히어로(Dark Navy)는 도구의 아이덴티티 존이고, 사이드바와 미리보기 영역(Studio Canvas)은 실제 작업 존이다. 이 두 존은 서로 섞이지 않는다. 히어로에서 허용된 글래스모피즘과 그레이디언트는 작업 존에서 금지된다. 대비가 시스템의 성격을 만든다.

이 시스템이 명시적으로 거부하는 것: 폼 요소가 쌓여 어디부터 봐야 할지 모르는 레이아웃, 한 화면에 옵션이 쏟아지는 무거운 엔터프라이즈 UI, 도구가 결과물보다 눈에 띄는 어드민.

**Key Characteristics:**
- 히어로(다크 네이비) + 작업 존(화이트/캔버스) 이중 레지스터
- 폼 우선: 모든 간격과 계층 결정은 폼 가독성 기준
- 작업 존은 완전히 평평하다 — 섀도는 히어로 패널에만
- Apple-영향 언어: 헤어라인 보더, 하단선 인풋, 정밀한 타입 스케일
- Instrument Blue는 인터랙티브 요소에만 사용. 출현 빈도가 신뢰를 만든다

## 2. Colors: The Studio Palette

두 레지스터 팔레트. Instrument Blue가 모든 인터랙티비티를 담당하고, 뉴트럴이 나머지를 한다.

### Primary
- **Instrument Blue** (#0071e3): 유일한 인터랙티브 색상. 프라이머리 버튼, 포커스 링, 선택 상태, 인풋 하단선 포커스에 사용. 출현 빈도를 제한하는 것이 이 색의 힘이다.
- **Instrument Blue Hover** (#0077ed): 호버 상태 전용. 기본 색상으로 절대 사용하지 않는다.
- **Instrument Blue Faint** (#e8f0fc): 선택된 라디오/체크박스 컨테이너 배경. 어떤 화면에서도 10% 이하로 유지한다.

### Neutral
- **Graphite Ink** (#1d1d1f): 기본 텍스트. 모든 레이블, 헤딩, 입력값.
- **Mid Graphite** (#6e6e73): 보조 텍스트. 폼 레이블, 설명, 서브 네비게이션.
- **Soft Graphite** (#86868b): 3차 텍스트. 타임스탬프, 도움말 텍스트.
- **Placeholder Gray** (#aeaeb2): 인풋 플레이스홀더 전용.
- **Hairline Silver** (#d2d2d7): 모든 보더. 인풋 하단선, 카드 보더, 구분선. 의도적인 얇음이 이름이 됐다.
- **Border Hover** (#a1a1a6): 호버 보더 상태 전용.
- **Studio Canvas** (#f5f5f7): 보조 배경. 사이드바 섹션, 폼 그룹, 라디오 아이템.
- **Studio Canvas Deep** (#e8e8ed): 3차 배경. 비활성화 상태, 깊이 중첩된 컨테이너.
- **Success** (#059669): 성공 피드백 전용. 인터랙티브 색상으로 사용 금지.
- **Danger** (#dc2626): 에러/삭제 피드백 전용. 인터랙티브 색상으로 사용 금지.

### Dark Mode
- **Midnight Canvas** (#1c1c1e): 다크 사이드바/헤더 배경. iOS 네이티브 다크 서페이스.
- **Display Blue** (#0a84ff): 다크모드 인터랙티브 액센트. Instrument Blue를 대체한다.

### Hero Zone
- **Deep Navy** (#0e111c → #121c2e): 히어로 섹션 그레이디언트. 도구의 아이덴티티 표면. 작업 존에서 사용 금지.
- **Blueprint Indigo** (#5c61d4): 템플릿 탭 액티브 보더, 히어로 글로. 팔레트에서 유일한 쿨-웜 전환점.

**The One Voice Rule.** Instrument Blue가 유일한 인터랙티브 색상이다. 새로운 액센트 색상을 추가하지 않는다. 성공/위험 색상은 유효성 피드백에만 쓴다.

## 3. Typography

**UI 폰트:** Pretendard (-apple-system, BlinkMacSystemFont, system-ui 폴백)
**단일 서체 시스템:** 서체 페어링 없음. 계층은 크기, 굵기, 케이스로만 만든다.

**성격:** Pretendard의 한국어 최적화 자형은 12px 소형 크기에서도 폼 레이블과 값을 읽기 편하게 만든다. 스케일은 의도적으로 압축되어 있다. 이것은 마케팅 툴이 아닌 작업 도구다.

### Hierarchy
- **Display** (700, clamp(1.35rem–1.75rem), lh 1.2, -0.03em): 히어로 섹션 타이틀만. "Email Template Builder". 최대 2줄.
- **Headline** (600, 16px, lh 1.4): 사이드바 패널 타이틀 ("템플릿 설정"). 패널당 1개.
- **Title** (600, 12px, lh 1.4): 카드 타이틀, 사이드바 내부 섹션 타이틀.
- **Body** (400, 12px, lh 1.47): 모든 폼 값, 인풋 텍스트, 도움말 텍스트.
- **Label** (600, 11px, lh 1.4, 0.07em, uppercase): 사이드바 내부 섹션 서브헤더 ("기본 설정"). 대문자 처리는 콘텐츠 계층이 아닌 사이드바 내 네비게이션을 의미한다.
- **Button** (500, 13px, lh 1): 모든 버튼 텍스트.

**The Scale Rule.** 시스템의 타입 사이즈는 11–12–13–16 네 단계다. 중간 크기(10.5px, 14px, 15px)를 추가하지 않는다. 12에서 16으로의 점프는 의도적으로 크다.

## 4. Elevation

이 시스템은 기본적으로 완전히 평평하다. 카드, 폼 인풋, 사이드바 컨테이너에 섀도가 없다. 깊이는 배경 틴팅(화이트 위의 캔버스, 캔버스 위의 딥 캔버스)과 헤어라인 보더로 표현한다.

유일한 예외는 **Hero Panel**이다. 다크 네이비 히어로 내부의 글래스모피즘 패널 (`backdrop-filter: blur(14px)`, `rgba(255,255,255,0.08)` 배경). 이 블러는 시스템에서 구조적으로 사용되는 유일한 것이며 히어로 존에서만 존재한다.

**The Flat-by-Default Rule.** 라이트 작업 존의 카드, 인풋, 폼 그룹, 사이드바 컨테이너에 `box-shadow` 없음. 섀도는 세 곳에만: (1) 히어로 패널, (2) 다크모드 사이드바 우측 엣지, (3) 네비게이션 액티브 링크.

### Shadow Vocabulary
- **Hero Panel** (`0 18px 44px rgba(0,0,0,0.14)` + `0 1px 0 rgba(255,255,255,0.10) inset`): 히어로 존 전용.
- **Dark Sidebar Edge** (`4px 0 24px rgba(0,0,0,0.30)`): 다크모드 사이드바 전용.
- **Nav Active Pill** (`0 1px 3px rgba(0,0,0,0.10)`): 헤더 액티브 탭. 선택 신호, 엘리베이션이 아님.

## 5. Components

조용하지만 정확하다. 존재감은 작동할 때만 생긴다. 애니메이션은 상태 변화에만, 장식용으로 절대 사용하지 않는다.

### Buttons
- **Shape:** 최소한의 라운딩 (3px). 네모(0)도 필 형태도 아님. 3px는 의도 있는 절제를 신호한다.
- **Primary** (`#0071e3` bg, `#fff` text, `10px 18px` padding, 13px/500): 유일한 채워진 버튼. 다운로드, 주요 확인 동작.
- **Primary Hover** (`#0077ed`): 컬러 시프트만. 트랜스폼, 섀도 없음.
- **Ghost** (`1px solid #d2d2d7` border, `#6e6e73` text, transparent): 보조 동작, 취소, 토글.
- **Soft** (`rgba(0,113,227,0.08)` bg, `#0071e3` text): 사이드바 내 컨텍스트 동작. 템플릿 선택 버튼.
- **SM** (`7px 14px` padding, 12px font): 폼 그룹 내 인라인 사용.
- **Download (시그니처):** 전체 너비, 높은 padding (`14px 20px`, 14px/500). 사이드바 고정 푸터. 다크모드에서: `linear-gradient(135deg, #0a84ff, #0062c0)` + `box-shadow: 0 2px 12px rgba(10,132,255,0.25)`.

### Inputs / Fields
- **Style:** 하단선 전용 (`border-bottom: 1px solid #d2d2d7`). 박스 없음, 배경 없음, 라디우스 없음. 라인온리 인풋은 이 시스템의 가장 결정적인 선택이다.
- **Focus:** 하단선이 `#0071e3`으로 전환. 글로, box-shadow, 링 없음.
- **Hover:** 하단선이 `#a1a1a6`으로 전환.
- **Height:** 단일 라인 인풋 36px 고정.
- **Textarea:** 동일한 하단선 처리, `min-height: 72px`, resize 핸들 없음.
- **Color Picker:** `<input type="color">` + 텍스트 인풋 나란히. 동일한 하단선 스타일 공유.
- **Select:** SVG 배경 이미지로 커스텀 화살표. `appearance: none`, 하단선 동일.

### Sidebar
- **라이트모드:** 화이트 배경, `border-right: 1px solid #d2d2d7`. 섀도 없음. 너비 320px 기본, 640px 확장.
- **다크모드:** `#1c1c1e` 배경, `border-right: 1px solid rgba(255,255,255,0.08)`, `box-shadow: 4px 0 24px rgba(0,0,0,0.30)`. 시스템에서 가장 iOS 네이티브한 표면.
- **Fixed Footer:** 다운로드 버튼 고정. 다크모드: 블러 글래스 처리 (`backdrop-filter: blur(12px)`, `background: rgba(15,23,42,0.52)`).

### Navigation (Header)
- **Container:** 플로팅 필 (`rgba(243,244,246,0.70)` bg, `border-radius: 10px`, `backdrop-filter: blur(10px)`). 절대 포지션, 64px 높이.
- **Nav Link:** `8px 16px` padding, 8px radius, 14px/500. 기본: `#6e6e73`, 호버/액티브: `#1f2937`.
- **Active:** `rgba(255,255,255,0.95)` 배경, `box-shadow: 0 1px 3px rgba(0,0,0,0.10)`. 언더라인, 보더 없음.
- **다크모드:** `rgba(44,44,46,0.80)` 컨테이너. 액티브: `rgba(255,255,255,0.12)`.

### Template Tabs (Hero Panel)
- **Style:** 라운드 탭 (`border-radius: 10px`). 다크 히어로 위에 화이트 배경 (`rgba(255,255,255,0.93)`), 다크 텍스트 (`#334155`).
- **Active:** `#5c61d4` 보더, `#373c8f` 텍스트, 인디고 글로 링 (`box-shadow: 0 0 0 2px rgba(92,97,212,0.14)`).
- **Hover:** 보더가 인디고 방향으로 (`rgba(92,97,212,0.38)`).

### Cards / Containers
- **Shape:** 0px 라디우스. 섀도 없음.
- **Border:** `1px solid #d2d2d7`. 단일 헤어라인.
- **배경:** 기본 카드는 화이트; 중첩 컨테이너는 `#f5f5f7`.
- **시그니처 중첩 글로:** 선택 가능한 중첩 카드는 호버 시 코닉-그레이디언트 보더 애니메이션을 사용한다 (회전하는 빛 줄기, `0.2s opacity 전환`). 시스템에서 유일한 애니메이션 데코레이션.

### Form Tabs (Sidebar)
- **Style:** 사이드바 내부 언더라인 탭. 액티브: `border-bottom: 2px solid #0071e3`. 필 없음, 배경 시프트 없음.
- **히어로 탭과의 의도적 차이:** 히어로의 필 탭 vs 사이드바의 언더라인 탭. 이 대비가 아이덴티티 존과 작업 존의 경계를 시각적으로 표시한다.

## 6. Do's and Don'ts

### Do:
- **Do** 모든 폼 필드에 하단선 전용 인풋을 사용한다 (`border-bottom: 1px solid #d2d2d7`).
- **Do** 라이트 작업 존의 모든 표면은 평평하고 섀도 없이 유지한다. 깊이는 배경 틴팅으로만 표현.
- **Do** Instrument Blue(`#0071e3`)는 인터랙티브 상태 전용으로만 사용한다. 하나의 색, 하나의 역할.
- **Do** uppercase + 0.07em 레터 스페이싱은 사이드바 내 11px 섹션 서브헤더에만 적용한다.
- **Do** `backdrop-filter: blur()`는 히어로 패널과 다크 사이드바 푸터 두 곳에만. 그 외 금지.
- **Do** 버튼 3px, 카드/인풋 0px 라디우스의 의도적 불연속성을 유지한다. 인터랙션 표면을 구분하는 신호다.

### Don't:
- **Don't** 폼 레이아웃을 숨 쉴 공간 없이 인풋만 쌓지 않는다. 모든 요소가 같은 무게로 경쟁하는 레이아웃이 안티레퍼런스다.
- **Don't** 사용자가 어디 있는지 모르게 만드는 사이드바 구조를 만들지 않는다.
- **Don't** 라이트 작업 존의 카드, 폼 그룹, 사이드바 섹션에 box-shadow를 추가하지 않는다. 평평한 표면은 실수가 아닌 결정이다.
- **Don't** 1px 초과 border-left/right를 컬러 액센트로 사용하지 않는다. 배경 틴팅 또는 풀 보더를 사용한다.
- **Don't** `background-clip: text`와 그레이디언트를 함께 사용하지 않는다. Instrument Blue는 솔리드로 사용한다.
- **Don't** 두 번째 인터랙티브 색상을 추가하지 않는다. Success/Danger는 유효성 신호이지 액센트가 아니다.
- **Don't** 라이트 작업 존에 글래스모피즘을 추가하지 않는다. 블러 표면은 히어로 존과 다크 사이드바 푸터에만.
- **Don't** 어떤 인터랙션에도 모달을 첫 번째 선택으로 쓰지 않는다. 인라인, 확장형, 사이드바 고정 방식을 먼저 소진한다.
