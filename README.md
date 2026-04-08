# MGW-front

### **커밋 유형 (Commit Type)**

커밋은 다음과 같이 분류하여 메세지를 작성한다.

- ***feat*** :  기능 개발
- ***fix*** : 버그 수정
- ***style*** : css 스타일 수정
- ***docs*** : 문서 작업 (주로 main 에서 readme.md 작성)
- ***refactor*** : 리팩토링 (기능 변경 없이 아키텍처, 클래스 구조, 함수 추출 등 로직/설계 변경에 집중)
- ***chore*** : 파일 옮기기, 파일 이름 변경, 주석 추가 등 단순한 작업

### **커밋 메세지 작성 규칙**

1. 커밋 메세지는 다음과 같은 형태로 작성한다. (띄어쓰기 및 형식 참고)

    ```
    [#이슈번호] <커밋 유형> : <커밋 메세지>
    ```

2. 커밋 메세지는 반드시 한글로 작성한다.
3. 커밋 유형은 반드시 영문 소문자로 작성한다.
4. 필요시, 커밋 메세지의 가장 앞 부분에 이슈 번호를 추가한다.
5. 커밋 메세지는 “논리적으로 독립적인 작업”을 추가 혹은 변경할 때 작성한다
    - 독립적으로 빌드 및 테스트가 가능할 때
    - 롤백시 최소한의 영향을 주는 단위


---


### 브랜치 전략 (Branch Strategy)

- ***main** : 배포용 브랜치*
    - **실제 서비스에 배포되는 코드**만 포함
    - **직접 개발하지 않고 dev 또는 fix 등의 브랜치를 이용**하여 병합하여  사용
- ***dev** : 개발 통합 브랜치*
    - **main 브랜치에서 분기**
    - 여러 기능이 개발되고 통합되는 브랜치
    - feature 브랜치에서 작업한 기능들을 이 곳으로 병합
    - 충분히 테스트한 후 main으로 배포
- ***feature/#이슈번호-기능명*** : 신규 기능 개발 브랜치*
    - **dev 브랜치에서 분기**되어 기능 단위로 개발
    - 개발 완료 후 dev로 병합
- ***fix/#이슈번호-기능명*** : 버그 수정용 브랜치*
    - dev 또는 release에서 분기하여 버그 수정
        - **dev 브랜치에서 분기** : 개발시 발견된 버그 수정
        - 기능 구현에 대한 버그 수정시, 반드시 해당 기능에 대한 브랜치를 병합 후, 분기하여 버그 수정
    - 수정 완료 후 해당 브랜치로 병합

  ex) 회원가입 시 발생하는 오류의 상태 코드를 변경하고 싶음

      → feature/#1-signup 브랜치가 dev와 병합되어 있는지 확인
      
      → dev에서 fix/#2-status-code-error 를 생성하여 버그 수정
      
      → 이후 dev와 병합


### **브랜치 규칙 (Branching Rule)**

1. 기능 개발은 반드시 feature 브랜치에서 개발
2. 개발 완료 시 dev 브랜치로 합병
    - 브랜치명은 ***kebab-case*** 를 사용한다.
      ex) `feature/#1-get-user`

3. 모든 QA 및 버그 수정 완료 시 main으로 병합
4. 긴급 수정은 hotfix 브랜치에서 진행 후, 병합

---

### **코드 컨벤션 (React Clean Component Convention)**

본 프로젝트는 React 공식 문서의 컴포넌트 계층 분리, 순수 렌더링, 단일 상태 소유 원칙과 TypeScript의 명시적 타입 계약 방식을 기준으로 코드를 작성한다.

- 화면 구현은 먼저 `docs/<screen>/flow.md`와 `docs/<screen>/design`을 기준으로 컴포넌트 계층을 나눈다.
- 컴포넌트는 한 가지 역할에 집중한다.
  - 화면 조합, 데이터 요청, 상태 orchestration은 screen/page 레이어에서 담당한다.
  - 재사용 가능한 UI는 props 기반의 순수 컴포넌트로 분리한다.
- 공유 상태는 가장 가까운 공통 부모가 소유한다.
  - 같은 값을 여러 컴포넌트가 써야 하면 state를 복제하지 말고 올린 뒤 props로 전달한다.
- 렌더링은 순수해야 한다.
  - render 중 외부 변수 변경, props/state 직접 변경, 부수효과 실행을 금지한다.
  - 부수효과는 event handler 또는 effect에서 처리한다.
- 컴포넌트는 다른 컴포넌트 내부에서 새로 정의하지 않는다.
  - 모든 컴포넌트는 파일의 top-level에 선언하여 재사용성과 상태 안정성을 유지한다.
- 재사용 기준은 명확하게 나눈다.
  - 두 화면 이상에서 재사용 가능하거나 도메인 독립적인 UI는 `src/components`에 둔다.
  - 특정 화면 전용 조각은 해당 screen/page 가까이에 둔다.
- API 연동 코드는 화면 UI와 분리한다.
  - 백엔드 응답값 변경 가능성을 고려해 API 호출과 응답 매핑은 가능한 한 경계 레이어에 모은다.
  - UI 컴포넌트 전반에 raw response shape를 직접 퍼뜨리지 않는다.
- TypeScript 타입은 명시적으로 선언한다.
  - props, API DTO, view model은 이름 있는 `type` 또는 `interface`로 관리한다.
  - `any` 사용은 지양한다.
  - `String`, `Number`, `Boolean`, `Object` 같은 boxed type 대신 `string`, `number`, `boolean`, `object`를 사용한다.

참고 문서:
- React Thinking in React: [https://react.dev/learn/thinking-in-react](https://react.dev/learn/thinking-in-react)
- React Keeping Components Pure: [https://react.dev/learn/keeping-components-pure](https://react.dev/learn/keeping-components-pure)
- React Sharing State Between Components: [https://react.dev/learn/sharing-state-between-components](https://react.dev/learn/sharing-state-between-components)
- React static-components lint rule: [https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components](https://react.dev/reference/eslint-plugin-react-hooks/lints/static-components)
- TypeScript Object Types: [https://www.typescriptlang.org/docs/handbook/2/objects.html](https://www.typescriptlang.org/docs/handbook/2/objects.html)
- TypeScript Do's and Don'ts: [https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html](https://www.typescriptlang.org/docs/handbook/declaration-files/do-s-and-don-ts.html)
