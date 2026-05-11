# MGW-front Project

## Source of truth

화면 작업은 `docs/<screen>/` 아래에 정리된다. 항상 이 순서로 참조:

1. `docs/<screen>/flow.md` — 화면 플로우 정의
2. `docs/<screen>/design` — 레이아웃, 간격, 타이포그래피, 반응형 의도 (PNG 순서 = 플로우 컨텍스트)
3. `docs/<screen>/api` — 요청/응답 구조, 로딩/빈/성공/에러 상태

문서가 누락되거나 모순되면 추측하지 말고 사용자에게 확인.

## Working method

- 작업 전 타겟 화면/플로우를 먼저 식별
- 해당 doc 경로를 모은 뒤 구현 시작
- 기존 동작을 보존. 문서나 요청이 명시적으로 변경을 요구하지 않는 한 수정하지 않음

## Git & delivery

- 화면 단위 브랜치, 기능 단위 커밋
- 커밋 형식: `[#이슈번호] <type> : <메시지>` (한국어 메시지, 영어 type)
- 허용 type: `feat`, `fix`, `style`, `docs`, `refactor`, `chore`
- PR 생성 전 사용자 확인 필수

## Code convention

README.md의 React Clean Component Convention 준수:
- 렌더는 순수하게, 사이드 이펙트는 render 밖으로
- 공유 상태는 단일 소유자
- 컴포넌트는 모듈 최상위에 정의 (중첩 금지)
- 화면 오케스트레이션과 재사용 UI 분리
- API 응답 매핑은 API 레이어 근처에 격리
- 명시적 TypeScript 타입 사용 (`any` 금지)
- 동일 기능 컴포넌트는 재사용 (variant/props 활용)

## Implementation

- UI는 `docs/<screen>/design`에 충실. 임의로 시각 방향을 새로 만들지 않음
- API는 `docs/<screen>/api`를 따르되, 백엔드 응답 변경에 대비해 격리 유지
- 로딩/빈/성공/에러 상태를 명시적으로 처리

## Validation

- `pnpm lint`를 코드 변경 후 완료 전에 실행
- UI 변경: `flow.md` + `design` 대비 검증
- API/동작 변경: `api` 대비 검증
- 완료 요약에 포함: 변경 내용, 참조 문서, 검증 방법, 알려진 갭
